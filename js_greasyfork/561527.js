// ==UserScript==
// @name         Telegraph Auto Next
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Enhanced Telegraph image viewer with auto-navigation. Keyboard shortcuts: 'g' to start/stop auto-next, 'f' to set interval. Redirects graph.org to telegra.ph. Based on SparkZhang's script: https://greasyfork.org/zh-CN/scripts/481178
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

// --- 1. Auto-Redirect graph.org to telegra.ph ---
if (location.hostname === 'graph.org') {
    location.replace(location.href.replace('graph.org', 'telegra.ph'));
}

const excludeUrl = "https://telegra.ph/";
unsafeWindow.Vue = Vue;

init();

function init() {
    // Skip homepage
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
    height: 40px; display: flex; justify-content: center; line-height: 40px; background-color: #383838;
  }
  .photo-viewer-header, .photo-viewer-content, .photo-viewer-footer { color: #fff; text-align: center; }
  .photo-viewer-click-left, .photo-viewer-click-right {
    top: 0; left: 0; width:50%; height: 100%; z-index: 999; position: absolute;
  }
  .photo-viewer-click-right{ left: 50%; }
  .photo-viewer-content { font-size: 0; position: relative; min-height: calc(100vh - 80px); }
  .photo-viewer-content img { max-height: calc(100vh - 80px); max-width: 100%; }
  .photo-viewer-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
  .photo-viewer-counter { padding: 0 15px; }
  .photo-viewer-btn:hover { cursor: pointer; background-color: #525252; }
  .auto-play-status { position: absolute; right: 20px; font-size: 12px; color: #00ff00; }
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
              <div class="photo-viewer-counter">{{counter}}</div>
              <div class="photo-viewer-btn" @click="next"><i class="fa fa-chevron-right"></i></div>
              <div class="photo-viewer-btn" @click="last"><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i></div>
              <div v-if="autoTimer" class="auto-play-status">
                <i class="fa fa-play"></i> {{autoInterval}}s
              </div>
          </div>
        </div>`,
        setup(props) {
            const currentIndex = ref(0);
            const content = ref(null);
            const autoTimer = ref(null);
            const autoInterval = ref(parseInt(localStorage.getItem('tg_auto_interval')) || 0);

            const imgs = ref(props.urls.map(url => {
                var img = document.createElement("img");
                img.src = url;
                return img;
            }));

            const img = computed(() => imgs.value[currentIndex.value]);

            watch(img, (newImg, oldImg) => {
                if (oldImg) oldImg.remove();
                if (content.value) content.value.appendChild(newImg);
            });

            const total = computed(() => props.urls.length);
            const counter = computed(() => `${currentIndex.value + 1}/${total.value}`);

            const first = () => { currentIndex.value = 0; };
            const last = () => { if (total.value > 0) currentIndex.value = total.value - 1; };
            const prev = () => { if (currentIndex.value > 0) currentIndex.value--; };
            const next = () => {
                if (currentIndex.value < total.value - 1) {
                    currentIndex.value++;
                } else {
                    stopAutoPlay();
                }
            };

            const stopAutoPlay = () => {
                if (autoTimer.value) {
                    clearInterval(autoTimer.value);
                    autoTimer.value = null;
                }
            };

            const setNewInterval = () => {
                const current = autoInterval.value || 3;
                const input = prompt("Enter auto-next interval (seconds):", current);
                const val = parseInt(input);
                if (!isNaN(val) && val > 0) {
                    autoInterval.value = val;
                    localStorage.setItem('tg_auto_interval', val);
                    if (autoTimer.value) startAutoPlay();
                }
            };

            const startAutoPlay = () => {
                stopAutoPlay();
                if (!autoInterval.value || autoInterval.value <= 0) {
                    setNewInterval();
                }
                if (autoInterval.value > 0) {
                    autoTimer.value = setInterval(next, autoInterval.value * 1000);
                }
            };

            const toggleAutoPlay = () => {
                autoTimer.value ? stopAutoPlay() : startAutoPlay();
            };

            const clickLeft = () => prev();
            const clickRight = () => next();

            onMounted(() => {
                document.addEventListener("keydown", e => {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                    if (e.key === "ArrowRight") next();
                    else if (e.key === "ArrowLeft") prev();
                    else if (e.key === "g") toggleAutoPlay();
                    else if (e.key === "f") setNewInterval();
                });
                if (content.value) content.value.appendChild(img.value);
            })
            return { imgs, img, currentIndex, counter, first, last, prev, next, clickLeft, clickRight, content, autoTimer, autoInterval };
        }
    });
    app.mount("#app");
}