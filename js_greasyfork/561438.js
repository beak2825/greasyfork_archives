// ==UserScript==
// @name         Video Timestamp Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skip to specific timestamps in ANY video on ANY website
// @author       wheter
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/561438/Video%20Timestamp%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/561438/Video%20Timestamp%20Skipper.meta.js
// ==/UserScript==

(function() {
'use strict';
GM_addStyle(`
#simpleTimestampModal{display:none;position:fixed;z-index:9999999;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,0.85);font-family:'Segoe UI',system-ui,-apple-system,sans-serif}
#simpleTimestampContent{background:#1e1e1e;margin:15% auto;padding:30px;width:420px;border-radius:12px;box-shadow:0 15px 35px rgba(0,0,0,0.5);border:1px solid #333}
#simpleTimestampTitle{text-align:center;margin-bottom:30px;color:#fff;font-size:22px;font-weight:500;letter-spacing:0.5px}
.simpleTimeContainer{margin-bottom:35px}
.simpleInputRow{display:flex;justify-content:center;align-items:flex-end;gap:25px;margin-bottom:15px}
.simpleTimeUnit{display:flex;flex-direction:column;align-items:center}
.simpleTimeLabel{color:#aaa;font-size:13px;font-weight:500;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
.simpleTimestampInput{width:80px;height:50px;padding:0;border:2px solid #444;border-radius:8px;font-size:24px;font-weight:400;text-align:center;background:#2d2d2d;color:#fff;transition:all 0.2s ease}
.simpleTimestampInput:focus{outline:none;border-color:#0078d4;background:#252525;box-shadow:0 0 0 3px rgba(0,120,212,0.2)}
.simpleColon{color:#666;font-size:28px;font-weight:300;margin:0 5px 15px 5px;user-select:none}
.simpleButtonContainer{display:flex;justify-content:center;gap:15px;margin-top:30px}
.simpleModalButton{padding:14px 32px;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;transition:all 0.2s ease;min-width:140px;background:#333;color:#fff;border:1px solid #444}
.simpleModalButton:hover{background:#3a3a3a;transform:translateY(-1px);box-shadow:0 5px 15px rgba(0,0,0,0.3)}
.simpleModalButton:active{transform:translateY(0)}
#simpleSkipButton{background:#0078d4;border-color:#0078d4}
#simpleSkipButton:hover{background:#106ebe;border-color:#106ebe}
#simpleCancelButton:hover{background:#444}
`);
const modalHTML=`<div id="simpleTimestampModal"><div id="simpleTimestampContent"><div id="simpleTimestampTitle">Skip to Timestamp</div><div class="simpleTimeContainer"><div class="simpleInputRow"><div class="simpleTimeUnit"><div class="simpleTimeLabel">Hours</div><input type="number" id="simpleHours" class="simpleTimestampInput" min="0" max="99" value="0"></div><div class="simpleColon">:</div><div class="simpleTimeUnit"><div class="simpleTimeLabel">Minutes</div><input type="number" id="simpleMinutes" class="simpleTimestampInput" min="0" max="59" value="0"></div><div class="simpleColon">:</div><div class="simpleTimeUnit"><div class="simpleTimeLabel">Seconds</div><input type="number" id="simpleSeconds" class="simpleTimestampInput" min="0" max="59" value="0"></div></div></div><div class="simpleButtonContainer"><button id="simpleSkipButton" class="simpleModalButton">Skip to Time</button><button id="simpleCancelButton" class="simpleModalButton">Cancel</button></div></div></div>`;
document.body.insertAdjacentHTML('beforeend',modalHTML);
const modal=document.getElementById('simpleTimestampModal');
const hoursInput=document.getElementById('simpleHours');
const minutesInput=document.getElementById('simpleMinutes');
const secondsInput=document.getElementById('simpleSeconds');
const skipButton=document.getElementById('simpleSkipButton');
const cancelButton=document.getElementById('simpleCancelButton');
class SimpleVideoController{constructor(){this.videoElements=[]}
findAllVideoElements(){this.videoElements=[];
const html5Videos=document.querySelectorAll('video');html5Videos.forEach(video=>{this.videoElements.push(video)});
const youtubeIframes=document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');youtubeIframes.forEach(iframe=>{try{const ytPlayer=iframe.contentWindow.document.querySelector('video');if(ytPlayer){this.videoElements.push(ytPlayer)}}catch(e){}});
const commonSelectors=['.html5-video-player video','.video-player video','.player video','.media-player video','.video-js video','.jw-video video'];commonSelectors.forEach(selector=>{try{const videos=document.querySelectorAll(selector);videos.forEach(video=>{if(!this.videoElements.includes(video)){this.videoElements.push(video)}})}catch(e){}});
return this.videoElements.length>0}
setTimeForAllVideos(totalSeconds){let successful=0;
this.videoElements.forEach(video=>{try{if(video.duration&&totalSeconds<=video.duration){video.currentTime=totalSeconds;successful++;
if(video.paused){video.play().catch(()=>{})}}}catch(e){}});
return successful}
getCurrentTime(){if(this.videoElements.length>0){const firstVideo=this.videoElements[0];return Math.floor(firstVideo.currentTime||0)}return 0}
getVideoDuration(){if(this.videoElements.length>0){const firstVideo=this.videoElements[0];const duration=firstVideo.duration;return!isNaN(duration)&&duration>0?Math.floor(duration):null}return null}}
const videoController=new SimpleVideoController();
function getCurrentInputTime(){const hours=parseInt(hoursInput.value)||0;const minutes=parseInt(minutesInput.value)||0;const seconds=parseInt(secondsInput.value)||0;return(hours*3600)+(minutes*60)+seconds}
function setInputFields(totalSeconds){if(totalSeconds<0)totalSeconds=0;
const hours=Math.floor(totalSeconds/3600);const minutes=Math.floor((totalSeconds%3600)/60);const seconds=Math.floor(totalSeconds%60);
hoursInput.value=hours;minutesInput.value=minutes;secondsInput.value=seconds}
function validateAndRollover(){let hours=parseInt(hoursInput.value)||0;let minutes=parseInt(minutesInput.value)||0;let seconds=parseInt(secondsInput.value)||0;
if(seconds<0)seconds=0;if(minutes<0)minutes=0;if(hours<0)hours=0;
if(seconds>=60){minutes+=Math.floor(seconds/60);seconds=seconds%60}
if(minutes>=60){hours+=Math.floor(minutes/60);minutes=minutes%60}
hoursInput.value=hours;minutesInput.value=minutes;secondsInput.value=seconds;
checkVideoDuration()}
function checkVideoDuration(){videoController.findAllVideoElements();const videoDuration=videoController.getVideoDuration();
if(videoDuration!==null){const totalSeconds=getCurrentInputTime();
if(totalSeconds>videoDuration){setInputFields(videoDuration)}}}
hoursInput.addEventListener('change',validateAndRollover);minutesInput.addEventListener('change',validateAndRollover);secondsInput.addEventListener('change',validateAndRollover);
hoursInput.addEventListener('input',validateAndRollover);minutesInput.addEventListener('input',validateAndRollover);secondsInput.addEventListener('input',validateAndRollover);
function skipToTimestamp(){const totalSeconds=getCurrentInputTime();
videoController.findAllVideoElements();
if(videoController.videoElements.length===0){return}
videoController.setTimeForAllVideos(totalSeconds);
modal.style.display='none'}
function showTimestampDialog(){videoController.findAllVideoElements();const currentTime=videoController.getCurrentTime();
setInputFields(currentTime);
modal.style.display='block';
setTimeout(()=>{hoursInput.focus();hoursInput.select()},100)}
skipButton.addEventListener('click',skipToTimestamp);
cancelButton.addEventListener('click',function(){modal.style.display='none'});
window.addEventListener('click',function(event){if(event.target===modal){modal.style.display='none'}});
[hoursInput,minutesInput,secondsInput].forEach(input=>{input.addEventListener('keypress',function(e){if(e.key==='Enter'){skipToTimestamp()}})});
document.addEventListener('keydown',function(e){if(e.ctrlKey&&e.shiftKey&&e.key==='T'){e.preventDefault();showTimestampDialog()}
if(e.key==='Escape'&&modal.style.display==='block'){modal.style.display='none'}
if((e.ctrlKey||e.altKey)&&modal.style.display==='block'){const currentSeconds=getCurrentInputTime();let newSeconds=currentSeconds;
if(e.key==='ArrowUp'){newSeconds+=300;setInputFields(newSeconds);e.preventDefault()}else if(e.key==='ArrowDown'){newSeconds=Math.max(0,currentSeconds-300);setInputFields(newSeconds);e.preventDefault()}}});
GM_registerMenuCommand('Skip to Timestamp',showTimestampDialog);
const observer=new MutationObserver(function(){videoController.findAllVideoElements()});
observer.observe(document.body,{childList:true,subtree:true});
})();