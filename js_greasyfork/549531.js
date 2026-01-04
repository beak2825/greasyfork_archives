// ==UserScript==
/*
MIT License

Copyright (c) 2025 mkco5162

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// ==UserScript==
// @name        YouTube Volume Curve Designer
// @icon        https://www.youtube.com/s/desktop/1c9f2583/img/favicon_144x144.png
// @icon        https://music.youtube.com/img/favicon_32.png
// @name:ja     YouTube Volume Curve Designer
// @name:zh-CN  YouTube Volume Curve Designer
// @name:ko     YouTube Volume Curve Designer
// @namespace   knoa.jp
// @description Customize the volume increasing curve for subtle sound tweaks and maximum volume boosts.
// @description:ja 音量の増加曲線をカスタマイズして、繊細な音の微調整や最大音量の引き上げを実現します。
// @description:zh-CN 自定义音量增加曲线，以实现细腻的声音微调和最大音量提升。
// @description:ko 음량 증가 곡선을 사용자 정의하여 미세한 사운드 조정 및 최대 음량 부스트를 실현합니다.
// @include     https://www.youtube.com/*
// @include     https://www.youtube.com/embed/*
// @include     https://www.youtube-nocookie.com/embed/*
// @include     https://music.youtube.com/*
// @exclude     https://www.youtube.com/live_chat*
// @exclude     https://www.youtube.com/live_chat_replay*
// @version     3.0.4.1
// @author      min5162 (Modified from original by knoa.jp)
// @homepage    https://github.com/mkco5162/youtube-volume-curve-designer
// @homepageURL https://github.com/mkco5162/youtube-volume-curve-designer
// @supportURL  https://github.com/mkco5162/youtube-volume-curve-designer/issues
// @source      https://greasyfork.org/scripts/404756-youtube-volume-curve-designer
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549531/YouTube%20Volume%20Curve%20Designer.user.js
// @updateURL https://update.greasyfork.org/scripts/549531/YouTube%20Volume%20Curve%20Designer.meta.js
// ==/UserScript==

/*
 * YouTube Volume Curve Designer
 * 
 * Original Source: https://greasyfork.org/scripts/404756-youtube-volume-curve-designer
 * Original Author: knoa.jp
 * 
 * Modified by: min5162
 * Modifications:
 * - Added Korean localization (ko)
 * - Fixed tooltip text duplication issue
 * - Code optimization and performance improvements
 * - Added auto-update support
 * - Enhanced language detection logic
 * - Improved DOM element selection
 * - Memory usage optimization
 * 
 * License: Same as original (if specified) or MIT
 * Version: 3.0.2
 */

(function(){
  const SCRIPTID = 'YouTubeVolumeCurveDesigner';
  const SCRIPTNAME = 'YouTube Volume Curve Designer';
  const DEBUG = false;

  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const VIDEOVIEWS = [
    /^https:\/\/www\.youtube\.com\/(channel|c|user)\/[^/]+(\?.+)?$/,
    /^https:\/\/www\.youtube\.com\/(channel|c|user)\/[^/]+\/live(\?.+)?$/,
    /^https:\/\/www\.youtube\.com\/watch\?/,
    /^https:\/\/www\.youtube\.com\/embed\//,
    /^https:\/\/www\.youtube-nocookie\.com\/embed\//,
    /^https:\/\/music\.youtube\.com\/watch\?/,
  ];
  const CHARTUNIT = 3;/* 최대 음량의 1/100당 픽셀 수 */
  const site = {
    targets: {
      title: () => $('title'),
    },
    videoTargets: {
      video: () => $('video'),
    },
    controlTargets: {
      /* YouTube || YouTube Music */
      chromeBottom: () => {
        const selectors = ['.ytp-chrome-bottom', 'ytmusic-player-bar', '.ytp-chrome-controls'];
        for (const selector of selectors) {
          const result = $(selector);
          if (result) {
            if (DEBUG) console.log(`[DEBUG] chromeBottom 발견 - 선택자: "${selector}"`);
            return result;
          }
        }
        return null;
      },
      muteButton: () => {
        const selectors = [
          '.ytp-volume-area .ytp-mute-button',
          'button.ytp-mute-button',
          'paper-icon-button.volume',
          'button[data-title-no-tooltip="Mute"]',
          'button[data-title-no-tooltip="음소거"]',
          // YouTube Music용 추가 선택자
          'ytmusic-player-bar button[aria-label="Mute"]',
          'ytmusic-player-bar button[aria-label="음소거"]',
          '#button[aria-label="Mute"]',
          '#button[aria-label="음소거"]'
        ];
        
        for (const selector of selectors) {
          const result = $(selector);
          if (result) {
            if (DEBUG) console.log(`[DEBUG] muteButton 발견 - 선택자: "${selector}"`);
            return result;
          }
        }
        
        if (DEBUG) console.log('[DEBUG] muteButton을 찾을 수 없음');
        return null;
      },
      volumePanel: () => {
        const selectors = [
          '.ytp-volume-area .ytp-volume-panel',
          '.ytp-volume-panel[aria-valuenow]',
          '#volume-slider',
          '[role="slider"][aria-label="Volume"]',
          '[role="slider"][aria-label*="volume"]'
        ];
        
        for (const selector of selectors) {
          const result = $(selector);
          if (result) return result;
        }
        return null;
      },
      volumeSlider: () => {
        const selectors = [
          '.ytp-volume-area .ytp-volume-slider',
          '.ytp-volume-slider',
          '#progressContainer'
        ];
        
        for (const selector of selectors) {
          const result = $(selector);
          if (result) return result;
        }
        return null;
      },
      volumeSliderHandle: () => {
        const selectors = [
          '.ytp-volume-area .ytp-volume-slider-handle',
          '.ytp-volume-slider-handle',
          '#sliderKnob .slider-knob-inner'
        ];
        
        for (const selector of selectors) {
          const result = $(selector);
          if (result) return result;
        }
        return null;
      },
    },
    get: {
      volumeNow: (volumePanel) => {
        if (volumePanel && volumePanel.attributes['aria-valuenow']) {
          return parseFloat(volumePanel.attributes['aria-valuenow'].value);
        }
        // 백업으로 video 요소의 volume 속성 사용
        const video = $('video');
        if (video) {
          return Math.round(video.volume * 100);
        }
        return 100;
      },
      tooltipText: () => $('.ytp-tooltip-text'),/* 검은색 툴팁 */
    },
    showVolumeSlider: (chromeBottom) => {
      if (chromeBottom) chromeBottom.classList.add('ytp-volume-slider-active');
      // 현재 볼륨 영역에도 호버 효과 적용
      let volumeArea = $('.ytp-volume-area');
      if (volumeArea) volumeArea.classList.add('ytp-volume-slider-active');
    },
    hideVolumeSlider: (chromeBottom) => {
      if (chromeBottom) chromeBottom.classList.remove('ytp-volume-slider-active');
      // 볼륨 영역에서도 호버 효과 제거
      let volumeArea = $('.ytp-volume-area');
      if (volumeArea) volumeArea.classList.remove('ytp-volume-slider-active');
    },
  };
  class Configs{
    constructor(configs){
      Configs.PROPERTIES = {
        enable:   {type: 'bool',  default: 1  },
        gain:     {type: 'float', default: 2.0},
        exponent: {type: 'float', default: 2.0},
      };
      this.data = this.read(configs || {});
      /* use Proxy for flexibility */
      return new Proxy(this, {
        get: function(configs, field){
          if(field in configs) return configs[field];
        }
      });
    }
    read(configs){
      let newConfigs = {};
      Object.keys(Configs.PROPERTIES).forEach(key => {
        if(configs[key] === undefined) return newConfigs[key] = Configs.PROPERTIES[key].default;
        switch(Configs.PROPERTIES[key].type){
          case('bool'):  return newConfigs[key] = (configs[key]) ? 1 : 0;
          case('int'):   return newConfigs[key] = parseInt(configs[key]);
          case('float'): return newConfigs[key] = parseFloat(configs[key]);
          default:       return newConfigs[key] = configs[key];
        }
      });
      return newConfigs;
    }
    toJSON(){
      let json = {};
      Object.keys(this.data).forEach(key => {
        json[key] = this.data[key];
      });
      return json;
    }
    set enable(enable){this.data.enable = enable;}
    set gain(gain){this.data.gain = gain;}
    set exponent(exponent){this.data.exponent = exponent;}
    get enable(){return this.data.enable;}
    get gain(){return this.data.gain;}
    get exponent(){return this.data.exponent;}
  }
  let elements = {}, timers = {}, sizes = {}, panels, configs, gainNode;
  const core = {
    initialize: function(){
      if (DEBUG) console.log('[DEBUG] 스크립트 초기화 중...');
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      
      // 한국어 우선 감지: 브라우저 언어를 우선으로 사용
      let detectedLanguage = window.navigator.language; // 브라우저 언어를 우선으로 사용
      
      // HTML lang 속성이 한국어가 아니고 브라우저는 한국어인 경우, 브라우저 언어 우선
      const htmlLang = document.documentElement.lang;
      if (htmlLang && !htmlLang.startsWith('ko') && window.navigator.language.startsWith('ko')) {
        detectedLanguage = window.navigator.language;
      }
      
      if (DEBUG) {
        console.log('[DEBUG] 최종 감지된 언어:', detectedLanguage);
        console.log('[DEBUG] navigator.language:', window.navigator.language);
        console.log('[DEBUG] navigator.languages:', window.navigator.languages);
        console.log('[DEBUG] HTML lang 속성:', htmlLang);
      }
      
      text.setup(texts, detectedLanguage);
      core.ready();
      core.addStyle('style');
      core.addStyle('panelStyle');
      if (DEBUG) console.log('[DEBUG] 초기화 완료');
    },
    ready: function(){
      if (DEBUG) console.log('[DEBUG] Core ready 함수 호출됨');
      core.getTargets(site.targets).then(() => {
        if (DEBUG) console.log('[DEBUG] 사이트 대상 찾음');
        log("준비 완료.");
        
        // TrustedHTML 오류를 피하기 위해 직접 panels 컨테이너 생성
        const panelsContainer = document.createElement('div');
        panelsContainer.className = 'panels';
        panelsContainer.id = `${SCRIPTID}-panels`;
        panelsContainer.setAttribute('data-panels', '0');
        panels = new Panels(document.body.appendChild(panelsContainer));
        
        core.readyForVideos();
        core.observeTitle();
      }).catch(e => {
        console.error('[DEBUG] 사이트 대상 찾기 실패:', e);
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    readyForVideos: function(){
      if (DEBUG) console.log('[DEBUG] readyForVideos 호출됨, URL:', location.href);
      
      if(VIDEOVIEWS.some(view => view.test(location.href)) === false) {
        if (DEBUG) console.log('[DEBUG] URL이 비디오 뷰와 일치하지 않음, 건너뜀');
        return;
      }
      
      /* 광고에서는 video 요소가 src 속성만 바뀐다 */
      core.getTargets(site.videoTargets).then(() => {
        if (DEBUG) console.log('[DEBUG] 비디오 대상 찾음');
        log("비디오 준비 완료.", elements.video);
        
        configs = new Configs(Storage.read('configs') || {});
        core.createGain();
        core.listenVolumeChange();
        
        core.getTargets(site.controlTargets).then(() => {
          if (DEBUG) console.log('[DEBUG] 컨트롤 대상 찾음');
          log("비디오 컨트롤 준비 완료.");
          
          core.configs.createButton();
          core.configs.createPanel();
          core.updateVolume(configs.gain, configs.exponent);
          core.addIndicationOnMuteButton();
          core.getVolumeSliderWidth();
        }).catch(e => {
          console.error('[DEBUG] 컨트롤 대상 찾기 실패:', e);
        });
      }).catch(e => {
        console.error('[DEBUG] 비디오 대상 찾기 실패:', e);
      });
    },
    observeTitle: function(){
      let url = location.href;
      observe(elements.title, function(records){
        setTimeout(() => {
          if(url === location.href) return;
          else url = location.href;
          panels.hide('configs');
          core.readyForVideos();
        }, 1000);
      }, {childList: true, characterData: true, subtree: true});
    },
    addIndicationOnMuteButton: function(){
      let muteButton = elements.muteButton, tooltipText = site.get.tooltipText();
      if(muteButton.listeningMouseOver) return;
      if(tooltipText === null) return;
      muteButton.listeningMouseOver = true;
      muteButton.addEventListener('mouseover', function(e){
        animate(function(){
          // 이미 추가된 텍스트가 있는지 확인하여 중복 방지
          const existingText = tooltipText.textContent || '';
          const rightClickText = text('or Right Click...');
          
          if (!existingText.includes(rightClickText)) {
            tooltipText.appendChild(document.createElement('br'));
            tooltipText.appendChild(document.createTextNode(rightClickText));
          }
        });
      });
      
      // 마우스가 벗어날 때 추가된 텍스트 제거
      muteButton.addEventListener('mouseleave', function(e){
        animate(function(){
          const tooltipText = site.get.tooltipText();
          if (tooltipText) {
            const rightClickText = text('or Right Click...');
            const nodes = Array.from(tooltipText.childNodes);
            
            // 역순으로 순회하면서 추가된 텍스트와 br 태그 제거
            for (let i = nodes.length - 1; i >= 0; i--) {
              const node = nodes[i];
              if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(rightClickText)) {
                tooltipText.removeChild(node);
                // 바로 앞의 br 태그도 제거
                if (i > 0 && nodes[i-1].nodeName === 'BR') {
                  tooltipText.removeChild(nodes[i-1]);
                }
                break;
              }
            }
          }
        });
      });
    },
    getVolumeSliderWidth: function(){
      /* 어쩔 수 없이 클래스 조작으로 표시시킨 후 실측한다 */
      let volumeSlider = elements.volumeSlider, chromeBottom = elements.chromeBottom;
      if (!volumeSlider || !chromeBottom) return;
      
      let transitionElement = volumeSlider.parentNode;
      if (!transitionElement) return;
      
      transitionElement.style.transition = 'none';/*애니메이션 중간에 측정하지 않음*/
      site.showVolumeSlider(chromeBottom);
      volumeSlider.style.transform = '';
      let timer = setInterval(function(){
        let rect = volumeSlider.getBoundingClientRect();
        if(rect.x === 0 || rect.width === 0) return setTimeout(core.getVolumeSliderWidth, 1000);
        /* 소수점이 포함되면 마우스 클릭의 어긋남을 해결할 수 없다 */
        volumeSlider.style.transform = `translateX(-${rect.x%1}px)`;
        sizes.volumeSliderWidth = rect.width;
        //log('transform:', volumeSlider.style.transform, 'volumeSliderWidth:', sizes.volumeSliderWidth);
        transitionElement.style.transition = '';/*transitionend가 번거로움*/
        site.hideVolumeSlider(chromeBottom);
        clearInterval(timer);
      }, 1000);
      if(window.listeningResize) return;
      window.listeningResize = true;
      window.addEventListener('resize', function(e){
        clearTimeout(timers.getVolumeSliderWidth);
        timers.getVolumeSliderWidth = setTimeout(core.getVolumeSliderWidth, 1000);
      });
    },
    createGain: function(){
      let video = elements.video;
      if(video.gained === true) return;
      video.gained = true;
      let context = new AudioContext();
      let source = context.createMediaElementSource(video);
      gainNode = context.createGain();
      source.connect(gainNode);
      gainNode.connect(context.destination);
      /* 비디오 일시정지 시 CPU 휴식 */
      if(video.paused) context.suspend();
      video.addEventListener('play', e => context.resume());
      video.addEventListener('pause', e => context.suspend());
    },
    listenVolumeChange: function(){
      let video = elements.video;
      if(video.listeningVolumechange) return;
      video.listeningVolumechange = true;
      video.addEventListener('volumechange', function(e){
        core.updateVolume(configs.gain, configs.exponent);
        if(panels.hidden('configs')) return;
        core.configs.updateVolumeSlider();
        core.configs.updateChartHighlight();
      });
    },
    updateVolume: function(gain, exponent){
      if(!gainNode || configs.enable === 0) {
        if(gainNode) gainNode.gain.value = 1;
        return;
      }
      
      const video = elements.video;
      const volumePanel = elements.volumePanel;
      const volumeNow = site.get.volumeNow(volumePanel);
      
      if(video.volume === 0 || volumeNow === 0) {
        gainNode.gain.value = 0;
      } else {
        const normalizedVolume = volumeNow / 100;
        gainNode.gain.value = (gain * Math.pow(normalizedVolume, exponent)) / normalizedVolume;
      }
      
      if (DEBUG) {
        log('Volume:', video.volume.toFixed(2), 'Gained volume:', (gainNode.gain.value * video.volume).toFixed(2));
      }
    },
    configs: {
      // DOM 요소 생성 헬퍼 함수들
      createInput: function(type, name, id, value, attributes = {}) {
        const input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.id = id;
        if (value !== undefined) input.value = value;
        Object.assign(input, attributes);
        return input;
      },
      
      createLabel: function(forId, textContent) {
        const label = document.createElement('label');
        label.setAttribute('for', forId);
        label.textContent = textContent;
        return label;
      },
      
      createFormGroup: function(labelText, input, className = '') {
        const p = document.createElement('p');
        if (className) p.className = className;
        p.appendChild(this.createLabel(input.id, labelText));
        p.appendChild(input);
        return p;
      },
      
      createChartData: function(className) {
        const dl = document.createElement('dl');
        dl.className = className;
        for (let i = 0; i <= 100; i += 5) {
          const dt = document.createElement('dt');
          dt.textContent = i.toString().padStart(3, ' ');
          const dd = document.createElement('dd');
          dd.textContent = i.toString().padStart(3, ' ');
          dl.appendChild(dt);
          dl.appendChild(dd);
        }
        return dl;
      },
      createButton: function(){
        if (DEBUG) console.log('[DEBUG] createButton 호출됨');
        const muteButton = elements.muteButton;
        
        if(!muteButton) {
          console.error('[DEBUG] muteButton을 찾을 수 없습니다!');
          return;
        }
        
        if(muteButton.listeningContextmenu) {
          if (DEBUG) console.log('[DEBUG] muteButton에 이미 컨텍스트 메뉴가 연결됨');
          return;
        }
        
        muteButton.listeningContextmenu = true;
        muteButton.addEventListener('contextmenu', function(e){
          if (DEBUG) console.log('[DEBUG] 컨텍스트 메뉴 트리거됨!');
          
          // 기본 컨텍스트 메뉴 완전 차단
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          if(panels.hidden('configs')){
            core.configs.updateVolumeSlider();
            core.configs.updateChartHighlight();
          }
          panels.toggle('configs');
          
          return false;
        }, true);
        
        if (DEBUG) console.log('[DEBUG] 컨텍스트 메뉴 성공적으로 연결됨');
      },
      createPanel: function(){
        if (DEBUG) console.log('[DEBUG] createPanel 호출됨');
        
        try {
          // 패널 기본 구조 생성
          const panel = elements.configPanel = document.createElement('div');
          panel.className = 'panel';
          panel.id = `${SCRIPTID}-configPanel`;
          panel.setAttribute('data-order', '1');
          
          // 제목
          const h1 = document.createElement('h1');
          h1.textContent = text('${SCRIPTNAME} preferences');
          panel.appendChild(h1);
          
          // fieldset 생성
          const fieldset = document.createElement('fieldset');
          fieldset.className = 'island';
          
          // Volume curve design legend
          const legend1 = document.createElement('legend');
          legend1.textContent = text('Volume curve design');
          fieldset.appendChild(legend1);
          
          // Enable 체크박스
          const enableInput = this.createInput('checkbox', 'enable', 'config-enable', '1');
          if (configs && configs.enable) enableInput.checked = true;
          fieldset.appendChild(this.createFormGroup(text('Enable') + ':', enableInput));
          
          // Gain 입력
          const gainInput = this.createInput('number', 'gain', 'config-gain', 
            (configs && configs.gain) ? configs.gain : '2.0', 
            { min: '1.0', max: '8.0', step: '0.1' });
          fieldset.appendChild(this.createFormGroup(text('Gain') + ':', gainInput, 'sub'));
          
          // Exponent 입력
          const exponentInput = this.createInput('number', 'exponent', 'config-exponent',
            (configs && configs.exponent) ? configs.exponent : '2.0',
            { min: '1.0', max: '4.0', step: '0.1' });
          fieldset.appendChild(this.createFormGroup(text('Exponent') + ':', exponentInput, 'sub'));
          
          // Try on this video legend
          const legend2 = document.createElement('legend');
          legend2.textContent = text('Try on this video');
          fieldset.appendChild(legend2);
          
          // 범위 슬라이더
          const sliderInput = this.createInput('range', 'slider', 'config-slider', '100',
            { min: '0', max: '100', step: '1' });
          const sliderGroup = document.createElement('p');
          sliderGroup.appendChild(sliderInput);
          fieldset.appendChild(sliderGroup);
          
          panel.appendChild(fieldset);
          
          // 차트 생성
          const chart = document.createElement('div');
          chart.className = 'chart';
          chart.setAttribute('data-enable', (configs && configs.enable) ? configs.enable : '1');
          
          chart.appendChild(this.createChartData('original'));
          chart.appendChild(this.createChartData('gained'));
          panel.appendChild(chart);
          
          // 버튼들
          const buttonsGroup = document.createElement('p');
          buttonsGroup.className = 'buttons';
          
          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'cancel';
          cancelBtn.textContent = text('Cancel');
          
          const saveBtn = document.createElement('button');
          saveBtn.className = 'save primary';
          saveBtn.textContent = text('Save');
          
          buttonsGroup.appendChild(cancelBtn);
          buttonsGroup.appendChild(saveBtn);
          panel.appendChild(buttonsGroup);
          
          this.setupPanelEvents(panel, fieldset, chart, {
            enable: enableInput,
            gain: gainInput,
            exponent: exponentInput,
            slider: sliderInput
          });
          
          if (DEBUG) console.log('[DEBUG] DOM API로 패널 생성 완료');
          panels.add('configs', panel);
          draggable(panel);
          
        } catch (e) {
          console.error('[DEBUG] createPanel 오류:', e);
        }
      },
      
      setupPanelEvents: function(panel, fieldset, chart, items) {
        elements.fieldset = fieldset;
        elements.chart = chart;
        elements.slider = items.slider;
        
        if (!items.gain || !items.exponent) {
          console.error('[DEBUG] 필수 폼 항목들을 찾을 수 없음');
          return;
        }
        
        let gain = parseFloat(items.gain.value);
        let exponent = parseFloat(items.exponent.value);
        
        // enable 체크박스로 켜기/끄기
        const initialEnable = chart.dataset.enable = configs.enable;
        items.enable.addEventListener('change', () => {
          configs.enable = fieldset.dataset.enable = chart.dataset.enable = items.enable.checked ? 1 : 0;
          items.gain.disabled = items.exponent.disabled = !configs.enable;
          core.updateVolume(gain, exponent);
          this.updateChartHighlight();
        });
        
        // 0.0 형식 표시 및 차트 그리기
        items.gain.value = parseFloat(items.gain.value).toFixed(1);
        items.exponent.value = parseFloat(items.exponent.value).toFixed(1);
        this.drawChart(chart, gain, exponent);
        
        items.gain.addEventListener('input', () => {
          gain = parseFloat(items.gain.value);
          exponent = parseFloat(items.exponent.value);
          items.gain.value = gain.toFixed(1);
          this.drawChart(chart, gain, exponent);
          core.updateVolume(gain, exponent);
        });
        
        items.exponent.addEventListener('input', () => {
          gain = parseFloat(items.gain.value);
          exponent = parseFloat(items.exponent.value);
          items.exponent.value = exponent.toFixed(1);
          this.drawChart(chart, gain, exponent);
          core.updateVolume(gain, exponent);
        });
        
        // 음량 슬라이더 동기화
        const volumeSlider = elements.volumeSlider;
        const volumeSliderHandle = elements.volumeSliderHandle;
        
        items.slider.addEventListener('input', () => {
          const volume = parseFloat(items.slider.value);
          const rect = volumeSlider.getBoundingClientRect();
          const radius = location.host === 'music.youtube.com' ? 0 : volumeSliderHandle.getBoundingClientRect().width / 2;
          
          const options = {
            clientX: rect.x + radius + ((sizes.volumeSliderWidth - radius * 2) * (volume / 100)),
            clientY: rect.y + (rect.height / 2),
            bubbles: true,
          };
          volumeSlider.dispatchEvent(new MouseEvent('mousedown', options));
          volumeSlider.dispatchEvent(new MouseEvent('mouseup', options));
        });
        
        // 취소 버튼
        panel.querySelector('button.cancel').addEventListener('click', () => {
          configs.enable = initialEnable;
          panels.hide('configs');
          this.createPanel();
          core.updateVolume(configs.gain, configs.exponent);
        });
        
        // 저장 버튼
        panel.querySelector('button.save').addEventListener('click', () => {
          configs = new Configs({
            enable: items.enable.checked,
            gain: items.gain.value,
            exponent: items.exponent.value,
          });
          Storage.save('configs', configs.toJSON());
          panels.hide('configs');
          this.createPanel();
          core.updateVolume(configs.gain, configs.exponent);
        });
      },
      drawChart: function(chart, gain, exponent){
        let originalBars = elements.originalBars = chart.querySelectorAll('dl.original dd');
        let gainedBars = elements.gainedBars = chart.querySelectorAll('dl.gained dd');
        originalBars.forEach(dd => {
          let level = parseInt(dd.previousElementSibling.textContent) / 100;
          dd.style.width = `calc(((${level} / ${gain})*100)*${CHARTUNIT}px)`;
          dd.style.textIndent = `calc(((${level} / ${gain})*100)*${CHARTUNIT}px + 2px)`;
        });
        gainedBars.forEach(dd => {
          let level = parseInt(dd.previousElementSibling.textContent) / 100;
          let volume = ((level**exponent) * gain * 100).toFixed(1).split(/(?=\.)/);
          dd.textContent = volume[0];
          if(0 < level && parseInt(volume[0]) < 10) {
            // TrustedHTML 오류를 피하기 위해 DOM API로 직접 생성
            let span = document.createElement('span');
            span.className = 'decimal';
            span.textContent = volume[1];
            dd.appendChild(span);
          }
          dd.style.width = `calc(((${level**exponent})*100)*${CHARTUNIT}px)`;
          dd.style.textIndent = `calc(((${level**exponent})*100)*${CHARTUNIT}px + 2px)`;
        });
      },
      updateVolumeSlider: function(){
        let slider = elements.slider;/* on the config panel */
        if(document.activeElement === slider) return;
        let video = elements.video;
        let volumePanel = elements.volumePanel, volumeNow = site.get.volumeNow(volumePanel);
        if(video.muted) slider.value = 0;
        else slider.value = volumeNow;
      },
      updateChartHighlight: function(){
        let video = elements.video;
        let volumePanel = elements.volumePanel, volumeNow = site.get.volumeNow(volumePanel);
        let chart = elements.chart, terms = chart.querySelectorAll(configs.enable ? 'dl.gained dt' : 'dl.original dt');
        for(let i = 0, lastIndex = terms.length - 1, dt, filled = false; dt = terms[i]; i++){
          switch(true){
            case(filled):
            case(video.muted):
              if(dt.classList.contains('fill')) dt.classList.remove('fill');
              break;
            case(parseInt(dt.textContent) <= volumeNow):
            case(i === lastIndex && volumeNow === 100):
              if(!dt.classList.contains('fill')) dt.classList.add('fill');
              break;
            case(volumeNow <= parseInt(dt.textContent)):
            default:
              filled = true;
              if(dt.classList.contains('fill')) dt.classList.remove('fill');
              break;
          }
        }
      },
    },
    getTarget: function(selector, retry, interval){
      retry = retry || 10;
      interval = interval || (1 * SECOND);
      
      const key = selector.name;
      const get = function(resolve, reject){
        let selected = selector();
        if(selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);
        else if(selected instanceof HTMLElement) selected.dataset.selector = key;
        else if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, interval, resolve, reject);
        else return reject(new Error(`Not found: ${selector.name}, I give up.`));
        elements[key] = selected;
        resolve(selected);
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject);
      });
    },
    getTargets: function(selectors, retry, interval){
      retry = retry || 10;
      interval = interval || (1 * SECOND);
      return Promise.all(Object.values(selectors).map(selector => core.getTarget(selector, retry, interval)));
    },
    addStyle: function(name){
      if(!html[name]) {
        if (DEBUG) console.log(`[DEBUG] 스타일 ${name}을 찾을 수 없음`);
        return;
      }
      
      try {
        // 기존 스타일 제거
        if(elements[name] && elements[name].isConnected) {
          document.head.removeChild(elements[name]);
        }
        
        // 새 스타일 요소 생성
        const style = document.createElement('style');
        const htmlContent = html[name]();
        const match = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        
        if (match) {
          style.textContent = match[1];
          style.type = 'text/css';
          style.id = `${SCRIPTID}-${name}`;
          
          document.head.appendChild(style);
          elements[name] = style;
          
          if (DEBUG) console.log(`[DEBUG] 스타일 ${name} 추가 완료`);
        } else {
          console.error(`[DEBUG] 스타일 ${name}에서 CSS 내용을 찾을 수 없음`);
        }
      } catch (e) {
        console.error(`[DEBUG] 스타일 ${name} 추가 실패:`, e);
      }
    }
  };
  const texts = {
    'or Right Click...': {
      en: () => `or Right Click...`,
      ja: () => `または右クリック...`,
      zh: () => `或右键单击...`,
      ko: () => `또는 우클릭...`,
    },
    '${SCRIPTNAME}': {
      en: () => `${SCRIPTNAME}`,
      ja: () => `${SCRIPTNAME}`,
      zh: () => `${SCRIPTNAME}`,
      ko: () => `${SCRIPTNAME}`,
    },
    '${SCRIPTNAME} preferences': {
      en: () => `${SCRIPTNAME} preferences`,
      ja: () => `${SCRIPTNAME} 設定`,
      zh: () => `${SCRIPTNAME} 设定`,
      ko: () => `${SCRIPTNAME} 설정`,
    },
    'Volume curve design': {
      en: () => `Volume curve design`,
      ja: () => `音量カーブ設計`,
      zh: () => `音量曲线设计`,
      ko: () => `음량 곡선 설계`,
    },
    'Enable': {
      en: () => `Enable`,
      ja: () => `有効にする`,
      zh: () => `使之有效`,
      ko: () => `활성화`,
    },
    'Gain': {
      en: () => `Gain`,
      ja: () => `ゲイン`,
      zh: () => `增量`,
      ko: () => `게인`,
    },
    'Exponent': {
      en: () => `Exponent`,
      ja: () => `冪数`,
      zh: () => `幂数`,
      ko: () => `지수`,
    },
    'volume × G': {
      en: () => `volume × G`,
      ja: () => `音量 × G`,
      zh: () => `音量 × G`,
      ko: () => `음량 × G`,
    },
    'volume<sup>E</sup>': {
      en: () => `volume<sup>E</sup>`,
      ja: () => `音量<sup>E</sup>`,
      zh: () => `音量<sup>E</sup>`,
      ko: () => `음량<sup>E</sup>`,
    },
    'Try on this video': {
      en: () => `Try on this video`,
      ja: () => `この動画の音量で試す`,
      zh: () => `尝试这个视频的音量`,
      ko: () => `이 동영상으로 테스트`,
    },
    'Actual volume(%)': {
      en: () => `Actual volume(%)`,
      ja: () => `実際の音量(%)`,
      zh: () => `实际的音量(%)`,
      ko: () => `실제 음량(%)`,
    },
    'Cancel': {
      en: () => `Cancel`,
      ja: () => `キャンセル`,
      zh: () => `取消`,
      ko: () => `취소`,
    },
    'Save': {
      en: () => `Save`,
      ja: () => `保存`,
      zh: () => `保存`,
      ko: () => `저장`,
    },
  };
  const html = {
    panels: () => `<div class="panels" id="${SCRIPTID}-panels" data-panels="0"></div>`,
    configPanel: () => `
      <div class="panel" id="${SCRIPTID}-configPanel" data-order="1">
        <h1>${text('${SCRIPTNAME} preferences')}</h1>
        <fieldset class="island">
          <legend>${text('Volume curve design')}</legend>
          <p><label for="config-enable">${text('Enable')}:</label><input type="checkbox" name="enable" id="config-enable" value="1" ${(configs && configs.enable) ? 'checked' : ''}></p>
          <p class="sub"><label for="config-gain" >${text('Gain')       }<small>(${text('volume × G')        })</small>:</label><input type="number" name="gain"     id="config-gain"     value="${(configs && configs.gain) ? configs.gain : '2.0'}"     min="1.0" max="8.0" step="0.1"></p>
          <p class="sub"><label for="config-exponent">${text('Exponent')}<small>(${text('volume<sup>E</sup>')})</small>:</label><input type="number" name="exponent" id="config-exponent" value="${(configs && configs.exponent) ? configs.exponent : '2.0'}" min="1.0" max="4.0" step="0.1"></p>
          <legend>${text('Try on this video')}</legend>
          <p><input type="range" name="slider" id="config-slider" value="100" min="0" max="100" step="1"></p>
        </fieldset>
        <div class="chart" data-enable="${(configs && configs.enable) ? configs.enable : '1'}">
          <dl class="original">
            <dt>  0</dt><dd>  0</dd>
            <dt>  5</dt><dd>  5</dd>
            <dt> 10</dt><dd> 10</dd>
            <dt> 15</dt><dd> 15</dd>
            <dt> 20</dt><dd> 20</dd>
            <dt> 25</dt><dd> 25</dd>
            <dt> 30</dt><dd> 30</dd>
            <dt> 35</dt><dd> 35</dd>
            <dt> 40</dt><dd> 40</dd>
            <dt> 45</dt><dd> 45</dd>
            <dt> 50</dt><dd> 50</dd>
            <dt> 55</dt><dd> 55</dd>
            <dt> 60</dt><dd> 60</dd>
            <dt> 65</dt><dd> 65</dd>
            <dt> 70</dt><dd> 70</dd>
            <dt> 75</dt><dd> 75</dd>
            <dt> 80</dt><dd> 80</dd>
            <dt> 85</dt><dd> 85</dd>
            <dt> 90</dt><dd> 90</dd>
            <dt> 95</dt><dd> 95</dd>
            <dt>100</dt><dd>100</dd>
          </dl>
          <dl class="gained">
            <dt>  0</dt><dd>  0</dd>
            <dt>  5</dt><dd>  5</dd>
            <dt> 10</dt><dd> 10</dd>
            <dt> 15</dt><dd> 15</dd>
            <dt> 20</dt><dd> 20</dd>
            <dt> 25</dt><dd> 25</dd>
            <dt> 30</dt><dd> 30</dd>
            <dt> 35</dt><dd> 35</dd>
            <dt> 40</dt><dd> 40</dd>
            <dt> 45</dt><dd> 45</dd>
            <dt> 50</dt><dd> 50</dd>
            <dt> 55</dt><dd> 55</dd>
            <dt> 60</dt><dd> 60</dd>
            <dt> 65</dt><dd> 65</dd>
            <dt> 70</dt><dd> 70</dd>
            <dt> 75</dt><dd> 75</dd>
            <dt> 80</dt><dd> 80</dd>
            <dt> 85</dt><dd> 85</dd>
            <dt> 90</dt><dd> 90</dd>
            <dt> 95</dt><dd> 95</dd>
            <dt>100</dt><dd>100</dd>
          </dl>
        </div>
        <p class="buttons"><button class="cancel">${text('Cancel')}</button><button class="save primary">${text('Save')}</button></p>
      </div>
    `,
    style: () => `
      <style type="text/css" id="${SCRIPTID}-style">
        [data-selector="muteButton"]:hover *,
        .ytp-volume-area [data-selector="muteButton"]:hover *,
        .ytp-volume-area:hover .ytp-mute-button *{
          fill: rgb(131,176,234);
        }
        /* 볼륨 슬라이더 활성화 상태 개선 */
        .ytp-volume-area:hover .ytp-volume-panel,
        .ytp-volume-slider-active .ytp-volume-panel {
          opacity: 1;
          transform: scale(1);
        }
      </style>
    `,
    panelStyle: () => `
      <style type="text/css" id="${SCRIPTID}-panelStyle">
        /* panels default */
        #${SCRIPTID}-panels *{
          font-size: 14px;
          line-height: 20px;
          padding: 0;
          margin: 0;
        }
        #${SCRIPTID}-panels{
          font-family: Arial, sans-serif;
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          cursor: default;
          z-index: 99999;
        }
        #${SCRIPTID}-panels div.panel{
          position: absolute;
          max-height: 100%;
          overflow: auto;
          left: 50%;
          bottom: 50%;
          transform: translate(-50%, 50%);
          background: rgba(0,0,0,.75);
          transition: 250ms ease-out;
          padding: 5px 0;
          pointer-events: auto;
        }
        #${SCRIPTID}-panels div.panel.hidden{
          transform: translate(-50%, calc(50vh + 100%)) !important;
          display: block !important;
        }
        #${SCRIPTID}-panels div.panel.hidden *{
          animation: none !important;
        }
        #${SCRIPTID}-panels h1,
        #${SCRIPTID}-panels h2,
        #${SCRIPTID}-panels h3,
        #${SCRIPTID}-panels h4,
        #${SCRIPTID}-panels legend,
        #${SCRIPTID}-panels ul,
        #${SCRIPTID}-panels ol,
        #${SCRIPTID}-panels dl,
        #${SCRIPTID}-panels p{
          color: white;
          padding: 2px 10px;
          vertical-align: baseline;
        }
        #${SCRIPTID}-panels legend ~ p,
        #${SCRIPTID}-panels legend ~ ul,
        #${SCRIPTID}-panels legend ~ ol,
        #${SCRIPTID}-panels legend ~ dl{
          padding-left: calc(10px + 14px);
        }
        #${SCRIPTID}-panels header{
          display: flex;
        }
        #${SCRIPTID}-panels header h1{
          flex: 1;
        }
        #${SCRIPTID}-panels fieldset{
          border: none;
        }
        #${SCRIPTID}-panels fieldset > p{
          display: flex;
          align-items: center;
        }
        #${SCRIPTID}-panels fieldset > p:not([class]):hover,
        #${SCRIPTID}-panels fieldset > p.sub:hover{
          background: rgba(255,255,255,.125);
        }
        #${SCRIPTID}-panels fieldset > p > label{
          flex: 1;
        }
        #${SCRIPTID}-panels fieldset > p > input,
        #${SCRIPTID}-panels fieldset > p > textarea,
        #${SCRIPTID}-panels fieldset > p > select{
          color: black;
          background: white;
          padding: 1px 2px;
        }
        #${SCRIPTID}-panels fieldset > p > input,
        #${SCRIPTID}-panels fieldset > p > button{
          box-sizing: border-box;
          height: 20px;
        }
        #${SCRIPTID}-panels fieldset small{
          font-size: 85%;
          margin: 0 0 0 .25em;
        }
        #${SCRIPTID}-panels fieldset sup,
        #${SCRIPTID}-panels fieldset p.note{
          font-size: 10px;
          line-height: 14px;
          color: rgb(192,192,192);
        }
        #${SCRIPTID}-panels a{
          color: inherit;
          font-size: inherit;
          line-height: inherit;
        }
        #${SCRIPTID}-panels a:hover{
          color: rgb(255,255,255);
        }
        #${SCRIPTID}-panels div.panel > p.buttons{
          text-align: right;
          padding: 5px 10px;
        }
        #${SCRIPTID}-panels div.panel > p.buttons button{
          line-height: 1.4;
          width: 120px;
          padding: 5px 10px;
          margin-left: 10px;
          border-radius: 5px;
          color: rgba(255,255,255,1);
          background: rgba(64,64,64,1);
          border: 1px solid rgba(255,255,255,1);
          cursor: pointer;
        }
        #${SCRIPTID}-panels div.panel > p.buttons button.primary{
          font-weight: bold;
          background: rgba(0,0,0,1);
        }
        #${SCRIPTID}-panels div.panel > p.buttons button:hover,
        #${SCRIPTID}-panels div.panel > p.buttons button:focus{
          background: rgba(128,128,128,1);
        }
        #${SCRIPTID}-panels .template{
          display: none !important;
        }
        /* config panel */
        #${SCRIPTID}-configPanel{
          /*--${SCRIPTID}-chartSize: max(calc(36px + 100*${CHARTUNIT}px + 16px), calc(32px + 21*16px));*//* max: from Firefox 75*/
          --${SCRIPTID}-chartSize: calc(32px + 21*16px);
        }
        #${SCRIPTID}-configPanel{
          width: calc(var(--${SCRIPTID}-chartSize) + 10px);
          cursor: grab;
        }
        #${SCRIPTID}-configPanel.dragging{
          transition: none !important;
          cursor: grabbing;
        }
        #${SCRIPTID}-configPanel fieldset.island{
          position: absolute;
          z-index: 10;
        }
        #${SCRIPTID}-configPanel fieldset.island[data-enable="0"] .sub{
          pointer-events: none;
          opacity: .5;
        }
        #${SCRIPTID}-configPanel fieldset.island input[name="gain"],
        #${SCRIPTID}-configPanel fieldset.island input[name="exponent"]{
          width: 4em;
          margin-left: 5px;
        }
        #${SCRIPTID}-configPanel fieldset.island input[name="slider"]{
          width: 100%;
        }
        #${SCRIPTID}-configPanel .chart{
          width:  var(--${SCRIPTID}-chartSize);
          height: var(--${SCRIPTID}-chartSize);
          padding: 5px;
          transform: rotate(-90deg);
        }
        #${SCRIPTID}-configPanel .chart dl{
          width: var(--${SCRIPTID}-chartSize);
          height: var(--${SCRIPTID}-chartSize);
          padding: 0;
          margin: 0;
          position: absolute;
        }
        #${SCRIPTID}-configPanel .chart[data-enable="1"] dl.gained,
        #${SCRIPTID}-configPanel .chart[data-enable="0"] dl.original{
          z-index: 5;
        }
        #${SCRIPTID}-configPanel .chart dl dt{
          text-align: right;
          width: 32px;
          padding-right: 4px;
          clear: both;
        }
        #${SCRIPTID}-configPanel .chart dl dt,
        #${SCRIPTID}-configPanel .chart dl dd{
          float: left;
          height: 16px;
          font-size: 12px !important;
          line-height: 16px;
        }
        #${SCRIPTID}-configPanel .chart dl dd{
          transition: width 125ms, text-indent 125ms;
        }
        #${SCRIPTID}-configPanel .chart dl.original dt:last-of-type{
          position: relative;
        }
        #${SCRIPTID}-configPanel .chart dl.original dt:last-of-type::after{
          content: "${text('Actual volume(%)')}";
          position: absolute;
          left: 100%;
          bottom: -100%;
          width: ${100*CHARTUNIT}px;
          text-align: left;
        }
        #${SCRIPTID}-configPanel .chart[data-enable="1"] dl.original dd,
        #${SCRIPTID}-configPanel .chart[data-enable="0"] dl.gained dd{
          color: transparent;
          background: rgba(256,256,256,.125);
        }
        #${SCRIPTID}-configPanel .chart dl.gained dt{
          visibility: hidden;
        }
        #${SCRIPTID}-configPanel .chart[data-enable="1"] dl.gained dd,
        #${SCRIPTID}-configPanel .chart[data-enable="0"] dl.original dd{
          background: rgba(192,192,192,.75);
        }
        #${SCRIPTID}-configPanel .chart[data-enable="1"] dl.gained dt.fill + dd,
        #${SCRIPTID}-configPanel .chart[data-enable="0"] dl.original dt.fill + dd{
          background: rgba(  0,  0,256,.75);
        }
        #${SCRIPTID}-configPanel .chart[data-enable="1"] dl.gained dd span.decimal{
          font-size: 10px;
          color: gray;
        }
      </style>
    `,
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  class Storage{
    static key(key){
      return (SCRIPTID) ? (SCRIPTID + '-' + key) : key;
    }
    static save(key, value, expire = null){
      key = Storage.key(key);
      localStorage[key] = JSON.stringify({
        value: value,
        saved: Date.now(),
        expire: expire,
      });
    }
    static read(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.value === undefined) return data;
      if(data.expire === undefined) return data;
      if(data.expire === null) return data.value;
      if(data.expire < Date.now()) return localStorage.removeItem(key);/*undefined*/
      return data.value;
    }
    static remove(key){
      key = Storage.key(key);
      delete localStorage.removeItem(key);
    }
    static delete(key){
      Storage.remove(key);
    }
    static saved(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.saved) return data.saved;
      else return undefined;
    }
  }
  class Panels{
    constructor(container){
      this.container = container;
      this.panels = {};
      this.listen();
    }
    listen(){
      const EXCLUDES = ['input', 'textarea'];
      window.addEventListener('keydown', (e) => {
        if(e.key !== 'Escape') return;
        if(EXCLUDES.includes(document.activeElement.localName)) return;
        Object.keys(this.panels).forEach(key => this.hide(key));
      }, true);
    }
    add(name, panel){
      this.panels[name] = panel;
    }
    toggle(name){
      console.log('[DEBUG] Panel toggle called for:', name);
      if(this.panels[name] === undefined) {
        console.error('[DEBUG] Panel not found:', name);
        return;
      }
      let panel = this.panels[name];
      console.log('[DEBUG] Panel state - isConnected:', panel.isConnected, 'hasHiddenClass:', panel.classList.contains('hidden'));
      if(panel.isConnected === false || panel.classList.contains('hidden')) {
        console.log('[DEBUG] Showing panel');
        this.show(name);
      } else {
        console.log('[DEBUG] Hiding panel');
        this.hide(name);
      }
    }
    show(name){
      if(this.panels[name] === undefined) return;
      let panel = this.panels[name];
      if(panel.isConnected) return;
      panel.classList.add('hidden');
      this.container.appendChild(panel);
      this.container.dataset.panels = parseInt(this.container.dataset.panels) + 1;
      animate(() => panel.classList.remove('hidden'));
    }
    shown(name){
      if(this.panels[name] === undefined) return;
      let panel = this.panels[name];
      return panel.isConnected;
    }
    hide(name){
      if(this.panels[name] === undefined) return;
      let panel = this.panels[name];
      if(panel.classList.contains('hidden')) return;
      panel.classList.add('hidden');
      panel.addEventListener('transitionend', (e) => {
        this.container.removeChild(panel);
        this.container.dataset.panels = parseInt(this.container.dataset.panels) - 1;
      }, {once: true});
    }
    hidden(name){
      if(this.panels[name] === undefined) return;
      return !this.shown(name);
    }
  }
  const text = function(key, ...args){
    if(text.texts[key] === undefined){
      log('Not found text key:', key);
      return key;
    }else return text.texts[key](args);
  };
  text.setup = function(texts, language){
    let languages = [...window.navigator.languages];
    if(language) languages.unshift(...String(language).split('-').map((p,i,a) => a.slice(0,1+i).join('-')).reverse());
    if(!languages.includes('en')) languages.push('en');
    languages = languages.map(l => l.toLowerCase());
    
    if (DEBUG) {
      console.log('[DEBUG] 감지된 언어들:', window.navigator.languages);
      console.log('[DEBUG] 전달받은 언어:', language);
      console.log('[DEBUG] document.documentElement.lang:', document.documentElement.lang);
      console.log('[DEBUG] 처리된 언어 목록:', languages);
    }
    
    Object.keys(texts).forEach(key => {
      // 먼저 원본 언어 키를 소문자로 매핑
      const originalKeys = Object.keys(texts[key]);
      originalKeys.forEach(l => {
        texts[key][l.toLowerCase()] = texts[key][l];
      });
      
      // 언어 찾기
      const selectedLang = languages.find(l => texts[key][l] !== undefined);
      texts[key] = texts[key][selectedLang] || (() => key);
      
      if (DEBUG && key === 'Enable') {
        console.log('[DEBUG] "Enable" 키에 대한 원본 언어 키들:', originalKeys);
        console.log('[DEBUG] "Enable" 키에 대한 선택된 언어:', selectedLang);
        console.log('[DEBUG] 사용 가능한 언어들:', Object.keys(texts[key]).filter(k => typeof texts[key][k] === 'function'));
      }
    });
    text.texts = texts;
  };
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s, f){
    let targets = document.querySelectorAll(s);
    return f ? Array.from(targets).map(t => f(t)) : targets;
  };
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const createElement = function(html = '<span></span>'){
    // TrustedHTML 정책으로 인해 항상 DOM API 사용
    console.log('[DEBUG] createElement called, using DOM API approach');
    return document.createElement('div');
  };
  const observe = function(element, callback, options = {childList: true, characterData: false, subtree: false, attributes: false, attributeFilter: undefined}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const draggable = function(element, grabbable){
    const DELAY = 1000;/* catching up mouse position between each mousemoves while fast dragging (ms) */
    const EXCLUDE = ['input', 'textarea', 'button'];
    const mousedown = function(e){
      if(e.button !== 0) return;
      if(EXCLUDE.includes(e.target.localName)) return;
      if(grabbable && e.target !== grabbable) return;
      element.classList.add('dragging');
      [screenX, screenY] = [e.screenX, e.screenY];
      [a,b,c,d,tx,ty] = (getComputedStyle(element).transform.match(/[-0-9.]+/g) || [1,0,0,1,0,0]).map((n) => parseFloat(n));
      window.addEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup, {once: true});
      document.body.addEventListener('mouseleave', mouseup, {once: true});
      element.addEventListener('mouseleave', mouseleave, {once: true});
    };
    const mousemove = function(e){
      element.style.transform = `matrix(${a},${b},${c},${d},${tx + (e.screenX - screenX)},${ty + (e.screenY - screenY)})`;
    };
    const mouseup = function(e){
      element.classList.remove('dragging');
      window.removeEventListener('mousemove', mousemove);
    };
    const mouseleave = function(e){
      let timer = setTimeout(mouseup, DELAY);
      element.addEventListener('mouseenter', clearTimeout.bind(window, timer), {once: true});
    };
    let screenX, screenY, a, b, c, d, tx, ty;
    element.classList.add('draggable');
    element.addEventListener('mousedown', mousedown);
  };
  const log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      SCRIPTID + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...arguments
    );
  };
  log.formats = [{
      name: 'Firefox Scratchpad',
      detector: /MARKER@Scratchpad/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Console',
      detector: /MARKER@debugger/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 3',
      detector: /\/gm_scripts\//,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 4+',
      detector: /MARKER@user-script:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 500,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Tampermonkey',
      detector: /MARKER@moz-extension:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 6,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?name=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 1,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Chrome Extension',
      detector: /at MARKER \(chrome-extension:/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Edge Console',
      detector: /at MARKER \(eval/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(eval)/gm),
    }, {
      name: 'Edge Tampermonkey',
      detector: /at MARKER \(Function/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 4,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(Function)/gm),
    }, {
      name: 'Safari',
      detector: /^MARKER$/m,
      getLine: (e) => 0,/*e.lineが用意されているが最終呼び出し位置のみ*/
      getCallers: (e) => e.stack.split('\n'),
    }, {
      name: 'Default',
      detector: /./,
      getLine: (e) => 0,
      getCallers: (e) => [],
    }];
  log.format = log.formats.find(function MARKER(f){
    if(!f.detector.test(new Error().stack)) return false;
    //console.log('////', f.name, 'wants', 0/*line*/, '\n' + new Error().stack);
    return true;
  });
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();
