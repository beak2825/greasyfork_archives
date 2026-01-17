// ==UserScript==
// @name         Telegraph Auto Next
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Enhanced Telegraph image viewer with auto-navigation, state memory, page jump, and UI controls. Keyboard shortcuts: 'g' to start/stop auto-next, 'f' to set interval. Based on SparkZhang's script: https://greasyfork.org/zh-CN/scripts/481178
// @author       CurssedCoffin (perfected with gemini) https://github.com/CurssedCoffin. Original by SparkZhang (https://greasyfork.org/zh-CN/users/1226354-sparkzhang)
// @match        https://telegra.ph/*
// @match        https://graph.org/*
// @exclude      https://telegra.ph/
// @exclude      https://graph.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegra.ph
// @resource     https://cdnjs.cloudflare.com/ajax/libs/webfonts/fa-solid-900.woff2
// @resource     fa https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561527/Telegraph%20Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/561527/Telegraph%20Auto%20Next.meta.js
// ==/UserScript==

/* global Vue */

if (location.hostname === 'graph.org') {
    location.replace(location.href.replace('graph.org', 'telegra.ph'));
}

const excludeUrl = "https://telegra.ph/";
unsafeWindow.Vue = Vue;

init();

function init() {
    if (location.pathname === '/' || location.pathname === '') return;

    injectStyle();
    createWrapper();
    var title = getTitle();
    var urls = getImageUrls();
    if (urls.length > 0) {
        createVue(urls, title);
    }
}

function injectStyle() {
    var fa = GM_getResourceText("fa");
    if (fa) {
        fa = fa.replaceAll("../webfonts", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/webfonts");
        GM_addStyle(fa);
    }
    GM_addStyle(`
  .tl_page_wrap { display:none; }
  #app { left: 0; top: 0; z-index: 99; position: absolute; width:100%; min-height: 100vh; }
  .photo-viewer { background-color: #000; }
  .photo-viewer-header, .photo-viewer-footer {
    height: 40px; display: flex; align-items: center; justify-content: center; background-color: #383838; position: relative;
  }
  .photo-viewer-header, .photo-viewer-content, .photo-viewer-footer { color: #fff; text-align: center; }
  .photo-viewer-click-left, .photo-viewer-click-right {
    top: 0; left: 0; width:50%; height: 100%; z-index: 999; position: absolute;
  }
  .photo-viewer-click-right{ left: 50%; }
  .photo-viewer-content {
    font-size: 0; position: relative; height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .photo-viewer-content img { width: 100%; height: 100%; object-fit: contain; }
  .photo-viewer-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
  .photo-viewer-btn:hover { background-color: #525252; }
  .photo-viewer-counter { padding: 0 10px; display: flex; align-items: center; gap: 5px; }

  .photo-viewer-footer-controls {
    position: absolute; right: 10px; display: flex; align-items: center; gap: 10px; height: 100%;
  }

  .ui-input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    text-align: center;
    border-radius: 4px;
    outline: none;
    font-size: 14px;
  }
  .ui-input:focus { border-color: #00ff00; background: rgba(255, 255, 255, 0.2); }
  .page-jump-input { width: 45px; height: 24px; }
  .interval-input { width: 50px; height: 24px; }
  
  .ui-input::-webkit-inner-spin-button, .ui-input::-webkit-outer-spin-button {
    -webkit-appearance: none; margin: 0;
  }
  .auto-active { color: #00ff00; }
`);
}

function createWrapper() {
    var app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
}

function getTitle() {
    return document.querySelector(".tl_article_header h1")?.innerText || "Untitled";
}

function getImageUrls() {
    var urls = [];
    var imgs = document.querySelectorAll(".figure_wrapper img, article img");
    imgs.forEach(img => { if (img.src) urls.push(img.src); });
    return urls;
}

function createVue(urls, title) {
    const { createApp, ref, computed, watch, onMounted } = Vue;
    const app = createApp({
        template: `<photo-viewer :urls="urls" :title="title"/>`,
        setup() { return { urls: ref(urls), title: ref(title) }; }
    });

    app.component("PhotoViewer", {
        props: ["urls", "title"],
        template: `
        <div class="photo-viewer">
          <div class="photo-viewer-header">{{title}}</div>
          <div class="photo-viewer-content" ref="content">
            <div class="photo-viewer-click-left" @click.stop="clickLeft"></div>
            <div class="photo-viewer-click-right" @click.stop="clickRight"></div>
          </div>
          <div class="photo-viewer-footer">
              <div class="photo-viewer-btn" @click="first"><i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i></div>
              <div class="photo-viewer-btn" @click="prev"><i class="fa fa-chevron-left"></i></div>
              <div class="photo-viewer-counter">
                  <input type="number" class="ui-input page-jump-input" v-model="inputPage" @focus="handlePageFocus" @blur="handlePageBlur" @keyup.enter="$event.target.blur()"/>
                  <span>/ {{total}}</span>
              </div>
              <div class="photo-viewer-btn" @click="next"><i class="fa fa-chevron-right"></i></div>
              <div class="photo-viewer-btn" @click="last"><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i></div>
              
              <div class="photo-viewer-footer-controls">
                  <div class="photo-viewer-btn" :class="{'auto-active': !!autoTimer}" @click="toggleAutoPlay">
                      <i class="fa" :class="autoTimer ? 'fa-pause' : 'fa-play'"></i>
                  </div>
                  <div style="display:flex; align-items:center; gap:5px; font-size:13px;">
                      <input type="number" step="0.1" class="ui-input interval-input" v-model="inputInterval" @blur="updateInterval" @keyup.enter="$event.target.blur()"/>
                      <span>s</span>
                  </div>
              </div>
          </div>
        </div>`,
        setup(props) {
            const currentIndex = ref(0);
            const content = ref(null);
            const autoTimer = ref(null);
            const autoInterval = ref(parseFloat(localStorage.getItem('tg_auto_interval')) || 3);
            
            const inputPage = ref(1);
            const isPageInputActive = ref(false);
            const inputInterval = ref(autoInterval.value);

            const imgs = ref(props.urls.map(url => {
                var img = document.createElement("img");
                img.src = url;
                return img;
            }));

            const img = computed(() => imgs.value[currentIndex.value]);

            watch(img, (newImg, oldImg) => {
                if (oldImg) oldImg.remove();
                if (content.value) content.value.appendChild(newImg);
                if (!isPageInputActive.value) inputPage.value = currentIndex.value + 1;
            });

            const total = computed(() => props.urls.length);

            const handlePageFocus = () => {
                isPageInputActive.value = true;
                stopAutoPlay(false);
            };

            const handlePageBlur = () => {
                isPageInputActive.value = false;
                let page = parseInt(inputPage.value);
                if (!isNaN(page)) {
                    if (page < 1) page = 1;
                    if (page > total.value) page = total.value;
                    currentIndex.value = page - 1;
                }
                inputPage.value = currentIndex.value + 1;
                if (localStorage.getItem('tg_auto_enabled') === 'true') startAutoPlay();
            };

            const updateInterval = () => {
                let val = parseFloat(inputInterval.value);
                if (!isNaN(val) && val > 0) {
                    autoInterval.value = val;
                    localStorage.setItem('tg_auto_interval', val);
                    if (autoTimer.value) startAutoPlay();
                } else {
                    inputInterval.value = autoInterval.value;
                }
            };

            const first = () => { currentIndex.value = 0; };
            const last = () => { if (total.value > 0) currentIndex.value = total.value - 1; };
            const prev = () => { if (currentIndex.value > 0) currentIndex.value--; };
            const next = () => {
                if (currentIndex.value < total.value - 1) {
                    currentIndex.value++;
                } else {
                    stopAutoPlay(false);
                }
            };

            const stopAutoPlay = (clearMemory = true) => {
                if (autoTimer.value) {
                    clearInterval(autoTimer.value);
                    autoTimer.value = null;
                }
                if (clearMemory) localStorage.setItem('tg_auto_enabled', 'false');
            };

            const startAutoPlay = () => {
                stopAutoPlay(false);
                if (autoInterval.value > 0) {
                    autoTimer.value = setInterval(next, autoInterval.value * 1000);
                    localStorage.setItem('tg_auto_enabled', 'true');
                }
            };

            const toggleAutoPlay = () => {
                autoTimer.value ? stopAutoPlay(true) : startAutoPlay();
            };

            const clickLeft = () => prev();
            const clickRight = () => next();

            onMounted(() => {
                document.addEventListener("keydown", e => {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                    if (e.key === "ArrowRight") next();
                    else if (e.key === "ArrowLeft") prev();
                    else if (e.key === "g") toggleAutoPlay();
                    else if (e.key === "f") {
                        let input = prompt("Enter auto-next interval (seconds):", autoInterval.value);
                        if (input !== null) {
                            inputInterval.value = input;
                            updateInterval();
                        }
                    }
                });
                if (content.value) content.value.appendChild(img.value);
                if (localStorage.getItem('tg_auto_enabled') === 'true') startAutoPlay();
            })
            return { 
                imgs, img, currentIndex, total, inputPage, inputInterval, 
                handlePageFocus, handlePageBlur, updateInterval,
                first, last, prev, next, clickLeft, clickRight, 
                content, autoTimer, autoInterval, toggleAutoPlay 
            };
        }
    });
    app.mount("#app");
}