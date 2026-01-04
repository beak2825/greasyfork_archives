// ==UserScript==
// @name         YouTube 本地字幕載入器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  讓 YouTube 能夠載入本地常用的各種字幕格式，支援srt/vtt/ass/ssa，按鈕在分享按鈕的後方
// @author       shanlan(grok-code-fast-1)
// @match        https://www.youtube.com/watch*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552279/YouTube%20%E6%9C%AC%E5%9C%B0%E5%AD%97%E5%B9%95%E8%BC%89%E5%85%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552279/YouTube%20%E6%9C%AC%E5%9C%B0%E5%AD%97%E5%B9%95%E8%BC%89%E5%85%A5%E5%99%A8.meta.js
// ==/UserScript==

(function(){
  function unloadPreviousSubtitles(){
    const video = document.querySelector("video");
    if(video){
      const tracks = video.querySelectorAll('track[kind="subtitles"][label="Local"]');
      tracks.forEach(track => {
        video.removeChild(track);
      });
    }
  }

  function convertAssToVtt(assText){
    const lines = assText.split('\n');
    let inEvents = false;
    let vttContent = 'WEBVTT\n\n';
    let index = 1;

    for(const line of lines){
      if(line.trim() === '[Events]'){
        inEvents = true;
        continue;
      }
      if(inEvents && line.startsWith('Dialogue:')){
        const parts = line.split(',');
        if(parts.length >= 10){
          const startTime = parts[1].trim();
          const endTime = parts[2].trim();
          const text = parts.slice(9).join(',').replace(/\{.*?\}/g, '').trim();

          const vttStart = convertTime(startTime);
          const vttEnd = convertTime(endTime);

          vttContent += `${index}\n${vttStart} --> ${vttEnd}\n${text}\n\n`;
          index++;
        }
      }
    }

    return vttContent;
  }

  function convertTime(assTime){
    const parts = assTime.split(':');
    if(parts.length === 3){
      const [h, m, s] = parts;
      const [sec, centi] = s.split('.');
      const ms = centi ? parseInt(centi) * 10 : 0;
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${sec.padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    return assTime;
  }

  function injectUI(){
    const actionsContainer = document.querySelector('#below #actions');
    if(!actionsContainer) return;
    if(document.getElementById('local-subtitle-input-container')) return;
    
    const container = document.createElement("div");
    container.id = 'local-subtitle-input-container';
    container.style.cssText = `
      display: flex;
      align-items: center;
      margin: 0 0 0 8px;
    `;
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".srt,.vtt,.ass,.ssa";
    input.style = "display:none";
    input.id = 'local-subtitle-input';
    input.onchange = function(){
      var f = input.files[0];
      if(!f) return;
      unloadPreviousSubtitles();
      var r = new FileReader();
      r.onload = function(e){
        var txt = e.target.result;
        var isAss = f.name.toLowerCase().endsWith('.ass') || f.name.toLowerCase().endsWith('.ssa');
        if(isAss){
          txt = convertAssToVtt(txt);
        }else if(!txt.startsWith("WEBVTT")){
          txt = "WEBVTT\n\n" + txt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
        }
        txt = txt.replace('WEBVTT', 'WEBVTT\n\nSTYLE\n::cue {\n  background: rgba(0, 0, 0, 0.6); /* 半透明黑色背景 */\n}\n\n');
        var url = URL.createObjectURL(new Blob([txt], {type: "text/vtt"}));
        var v = document.querySelector("video");
        if(v){
          var t = document.createElement("track");
          t.kind = "subtitles";
          t.label = "Local";
          t.srclang = "zh-TW";
          t.src = url;
          t.default = true;
          v.appendChild(t);
        }
      };
      r.readAsText(f);
    };
    
    const label = document.createElement("label");
    label.htmlFor = 'local-subtitle-input';
    label.textContent = "載入字幕";
    label.style.cssText = `
      cursor: pointer;
      background-color: #272727;
      color: #f1f1f1;
      padding: 8px 12px;
      border-radius: 18px;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.3s;
      white-space: nowrap;
    `;
    label.onmouseover = () => { label.style.backgroundColor = '#333333'; };
    label.onmouseout = () => { label.style.backgroundColor = '#272727'; };
    
    container.appendChild(input);
    container.appendChild(label);
    
    const shareButton = actionsContainer.querySelector('yt-button-view-model');
    if(shareButton){
      shareButton.parentNode.insertBefore(container, shareButton.nextSibling);
    }else{
      actionsContainer.appendChild(container);
    }
  }
  
  const observer = new MutationObserver((mutations, obs) => {
    if(document.querySelector('#below #actions')){
      injectUI();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();