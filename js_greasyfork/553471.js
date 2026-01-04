// ==UserScript==
// @name       4chan-swiper
// @namespace  npm/vite-plugin-monkey
// @version    0.0.19
// @license    MIT
// @icon       https://vitejs.dev/logo.svg
// @match      https://boards.4chan.org/*
// @match      https://boards.4channel.org/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.5.22/dist/vue.global.prod.js
// @grant      GM_addStyle
// @description 4chan swiper
// @downloadURL https://update.greasyfork.org/scripts/553471/4chan-swiper.user.js
// @updateURL https://update.greasyfork.org/scripts/553471/4chan-swiper.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(" .app-container[data-v-0e3767ee]{display:flex;flex-direction:column;height:100%;width:100%;position:relative}.app-header[data-v-0e3767ee]{position:fixed;top:0;left:0;right:0;padding:1rem 1.5rem;background:linear-gradient(180deg,rgba(0,0,0,.7) 0%,transparent 100%);color:#fff;z-index:100;pointer-events:none}.subtitle[data-v-0e3767ee]{margin:0;font-size:.85rem;opacity:.9;cursor:pointer;pointer-events:auto;-webkit-user-select:none;user-select:none;transition:opacity .2s ease}.subtitle[data-v-0e3767ee]:hover{opacity:1}.subtitle-input-wrapper[data-v-0e3767ee]{display:flex;align-items:center;gap:.5rem;font-size:.85rem;pointer-events:auto}.subtitle-prefix[data-v-0e3767ee],.subtitle-suffix[data-v-0e3767ee]{opacity:.9}.index-input[data-v-0e3767ee]{width:50px;padding:.25rem .5rem;font-size:.85rem;background:#fff3;border:1px solid rgba(255,255,255,.4);border-radius:4px;color:#fff;text-align:center;outline:none;transition:all .2s ease}.index-input[data-v-0e3767ee]:focus{background:#ffffff4d;border-color:#fff9}.index-input[data-v-0e3767ee]::-webkit-inner-spin-button,.index-input[data-v-0e3767ee]::-webkit-outer-spin-button{opacity:.5}.swiper-container[data-v-0e3767ee]{width:100%;height:100vh;height:100dvh;overflow-y:scroll;overflow-x:hidden;scroll-snap-type:y mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;background:#000}.swiper-container[data-v-0e3767ee]::-webkit-scrollbar{display:none}.no-media[data-v-0e3767ee]{display:flex;align-items:center;justify-content:center;height:100vh;height:100dvh;color:#fff;font-size:1.2rem;scroll-snap-align:start}.media-slide[data-v-0e3767ee]{width:100%;height:100vh;height:100dvh;display:flex;align-items:center;justify-content:center;background:#000;scroll-snap-align:start;scroll-snap-stop:always;will-change:scroll-position;contain:layout style paint;content-visibility:auto;padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box}.media-content[data-v-0e3767ee]{width:100%;height:100%;object-fit:contain;display:block;max-height:calc(100% - env(safe-area-inset-bottom,0px))}@media(orientation:portrait){.media-content[data-v-0e3767ee]{max-height:calc(100dvh - env(safe-area-inset-bottom,0px) - 80px);max-width:100vw;aspect-ratio:1 / 1;object-fit:contain}}@media(orientation:landscape){.media-content[data-v-0e3767ee]{width:100%;height:100%;max-height:calc(100% - env(safe-area-inset-bottom,0px) - 60px);object-fit:contain}} ");

  const styleCss = ".toggle-app-btn{position:fixed!important;bottom:20px!important;right:20px!important;padding:12px 20px!important;background-color:#eee!important;color:#000!important;font-size:18px!important;font-weight:400!important;border:1px solid #bbb!important;border-radius:4px!important;cursor:pointer!important;z-index:2147483647!important;transition:all .3s ease!important;display:flex!important;visibility:visible!important;opacity:1!important;align-items:center!important;justify-content:center!important;user-select:none!important;-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;margin:0!important;box-sizing:border-box!important;font-family:arial,helvetica,sans-serif!important;white-space:nowrap!important;pointer-events:auto!important;transform:none!important;filter:none!important;clip:auto!important;clip-path:none!important}.toggle-app-btn.exit-mode{top:20px!important;bottom:auto!important}@media(max-width:768px){.toggle-app-btn{bottom:10px!important;right:10px!important;padding:10px 16px!important;font-size:16px!important}.toggle-app-btn.exit-mode{top:10px!important;bottom:auto!important}}.toggle-app-btn:hover{background-color:#ddd}.toggle-app-btn:active{background-color:#ccc}html{overflow-x:hidden!important;box-sizing:border-box}body{overflow-x:hidden!important}*,*:before,*:after{box-sizing:inherit}#any-swiper-app{position:fixed;top:0;left:0;width:100vw;height:100dvh;z-index:999998;background:#000000e6;animation:fadeIn .3s ease;overflow:hidden}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}#any-swiper-app>div{width:100%;height:100%;overflow:hidden;animation:fadeIn .3s ease}";
  importCSS(styleCss);
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "app-container" };
  const _hoisted_2 = { class: "app-header" };
  const _hoisted_3 = {
    key: 1,
    class: "subtitle-input-wrapper"
  };
  const _hoisted_4 = { class: "subtitle-prefix" };
  const _hoisted_5 = ["max"];
  const _hoisted_6 = { class: "subtitle-suffix" };
  const _hoisted_7 = {
    key: 0,
    class: "no-media"
  };
  const _hoisted_8 = ["data-index"];
  const _hoisted_9 = ["src", "poster"];
  const _hoisted_10 = ["src", "alt"];
  const RENDER_WINDOW = 7;
  const CLEANUP_THRESHOLD = 10;
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const media = vue.ref([]);
      const videoRefs = vue.ref({});
      const currentIndex = vue.ref(0);
      const swiperContainerRef = vue.ref(null);
      const isEditingIndex = vue.ref(false);
      const inputIndex = vue.ref("");
      let intersectionObserver = null;
      let watchTimeout = null;
      const isUserScrolling = vue.ref(false);
      const frozenIndex = vue.ref(0);
      let scrollTimeout = null;
      const visibleMedia = vue.computed(() => {
        const indexToUse = isUserScrolling.value ? frozenIndex.value : currentIndex.value;
        const start = Math.max(0, indexToUse - RENDER_WINDOW);
        const end = Math.min(media.value.length, indexToUse + RENDER_WINDOW + 1);
        return media.value.slice(start, end).map((item, idx) => ({
          ...item,
          actualIndex: start + idx
        }));
      });
      const extractBoard = () => {
        const match = window.location.pathname.match(/^\/([^\/]+)\//);
        return match ? match[1] : null;
      };
      const extractThreadId = () => {
        const match = window.location.pathname.match(/\/thread\/(\d+)/);
        return match ? match[1] : null;
      };
      const parseMediaFromJson = (data, board, isThread = false) => {
        const allMedia = [];
        let posts = [];
        if (isThread) {
          posts = data.posts || [];
        } else {
          const pages = Array.isArray(data) ? data : [];
          pages.forEach((page) => {
            page.threads?.forEach((thread) => {
              posts.push(thread);
              if (thread.last_replies) {
                posts.push(...thread.last_replies);
              }
            });
          });
        }
        posts.forEach((post) => {
          if (post.tim && post.ext) {
            const tim = post.tim;
            const ext = post.ext;
            const isVideo = ext === ".webm" || ext === ".mp4";
            const mediaUrl = `https://i.4cdn.org/${board}/${tim}${ext}`;
            const thumbnailUrl = `https://i.4cdn.org/${board}/${tim}s.jpg`;
            allMedia.push({
              src: mediaUrl,
              id: allMedia.length,
              type: isVideo ? "video" : "image",
              poster: isVideo ? thumbnailUrl : void 0,
              alt: post.filename || ""
            });
          }
        });
        return allMedia;
      };
      const addResourceHints = () => {
        const head = document.head;
        const dnsPrefetch = document.createElement("link");
        dnsPrefetch.rel = "dns-prefetch";
        dnsPrefetch.href = "https://i.4cdn.org";
        head.appendChild(dnsPrefetch);
        const dnsPrefetchApi = document.createElement("link");
        dnsPrefetchApi.rel = "dns-prefetch";
        dnsPrefetchApi.href = "https://a.4cdn.org";
        head.appendChild(dnsPrefetchApi);
        const preconnect = document.createElement("link");
        preconnect.rel = "preconnect";
        preconnect.href = "https://i.4cdn.org";
        preconnect.crossOrigin = "anonymous";
        head.appendChild(preconnect);
      };
      const fetchMedia = async () => {
        const board = extractBoard();
        if (!board) {
          console.error("[4chan Swiper] Could not detect board from URL");
          return;
        }
        const threadId = extractThreadId();
        let apiUrl;
        let isThread = false;
        if (threadId) {
          apiUrl = `https://a.4cdn.org/${board}/thread/${threadId}.json`;
          isThread = true;
        } else {
          apiUrl = `https://a.4cdn.org/${board}/catalog.json`;
        }
        console.log(`[4chan Swiper] Fetching from: ${apiUrl}`);
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const extractedMedia = parseMediaFromJson(data, board, isThread);
          console.log(`[4chan Swiper] Found ${extractedMedia.length} media items`);
          media.value = extractedMedia;
        } catch (error) {
          console.error("[4chan Swiper] Error fetching media:", error);
        }
      };
      const cleanupDistantMedia = (currentIdx) => {
        Object.keys(videoRefs.value).forEach((key) => {
          const index = parseInt(key);
          const distance = Math.abs(index - currentIdx);
          if (distance > CLEANUP_THRESHOLD) {
            const video = videoRefs.value[index];
            if (video) {
              video.pause();
              delete videoRefs.value[index];
            }
          }
        });
      };
      const pauseAllVideos = () => {
        Object.values(videoRefs.value).forEach((video) => {
          if (video && !video.paused) {
            video.pause();
          }
        });
      };
      const playCurrentVideo = (index) => {
        const video = videoRefs.value[index];
        if (!video || media.value[index]?.type !== "video") return;
        setTimeout(() => {
          if (currentIndex.value === index) {
            const mediaItem = media.value[index];
            if (mediaItem && (!video.src || video.src === "" || video.src === window.location.href)) {
              video.src = mediaItem.src;
            }
            if (video.paused) {
              if (video.readyState < 2) {
                video.load();
              }
              video.play().catch((err) => {
                if (err.name !== "AbortError") {
                  console.log("Could not play video:", err);
                }
              });
            }
          }
        }, 150);
      };
      const preloadNextVideo = (index) => {
        const nextIndex = index + 1;
        if (nextIndex >= media.value.length) return;
        const nextItem = media.value[nextIndex];
        if (nextItem?.type !== "video") return;
        setTimeout(() => {
          const nextVideo = videoRefs.value[nextIndex];
          if (nextVideo) {
            if (!nextVideo.src || nextVideo.src === "" || nextVideo.src === window.location.href) {
              nextVideo.src = nextItem.src;
            }
            nextVideo.preload = "auto";
            nextVideo.load();
          }
        }, 300);
      };
      const goToMedia = (index, smooth = false) => {
        if (index < 0) {
          index = media.value.length - 1;
        }
        if (index >= media.value.length) {
          index = 0;
        }
        isUserScrolling.value = false;
        currentIndex.value = index;
        vue.nextTick(() => {
          const slides = swiperContainerRef.value?.querySelectorAll(".media-slide");
          const targetSlide = Array.from(slides || []).find(
            (slide) => parseInt(slide.dataset.index) === index
          );
          if (targetSlide) {
            pauseAllVideos();
            targetSlide.scrollIntoView({
              behavior: smooth ? "smooth" : "instant",
              block: "start"
            });
            playCurrentVideo(index);
            preloadNextVideo(index);
            cleanupDistantMedia(index);
          }
        });
      };
      const handleSubtitleClick = () => {
        isEditingIndex.value = true;
        inputIndex.value = String(currentIndex.value + 1);
        vue.nextTick(() => {
          const input = document.querySelector(".index-input");
          if (input) {
            input.focus();
            input.select();
          }
        });
      };
      const handleIndexSubmit = () => {
        const newIndex = parseInt(inputIndex.value) - 1;
        isEditingIndex.value = false;
        if (!isNaN(newIndex) && newIndex >= 0 && newIndex < media.value.length) {
          goToMedia(newIndex);
        }
      };
      const handleIndexBlur = () => {
        handleIndexSubmit();
      };
      const handleIndexKeydown = (e) => {
        if (e.key === "Enter") {
          handleIndexSubmit();
        } else if (e.key === "Escape") {
          isEditingIndex.value = false;
        }
      };
      const handleKeyDown = (e) => {
        if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
          if (e.key === "ArrowDown") {
            goToMedia(currentIndex.value + 1);
          } else if (e.key === "ArrowUp") {
            goToMedia(currentIndex.value - 1);
          } else if (e.key === "ArrowLeft") {
            const video = videoRefs.value[currentIndex.value];
            if (video) {
              video.currentTime -= 5;
            }
          } else if (e.key === "ArrowRight") {
            const video = videoRefs.value[currentIndex.value];
            if (video) {
              video.currentTime += 5;
            }
          }
        }
      };
      const observeVisibleSlides = () => {
        if (!intersectionObserver) return;
        intersectionObserver.disconnect();
        const slides = swiperContainerRef.value?.querySelectorAll(".media-slide");
        slides?.forEach((slide) => {
          intersectionObserver.observe(slide);
        });
      };
      const setupIntersectionObserver = () => {
        const options = {
          root: swiperContainerRef.value,
          threshold: 0.75
};
        intersectionObserver = new IntersectionObserver((entries) => {
          let mostVisible = null;
          let maxRatio = 0;
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              mostVisible = entry;
            }
          });
          if (mostVisible) {
            const index = parseInt(mostVisible.target.dataset.index);
            if (currentIndex.value !== index) {
              pauseAllVideos();
              currentIndex.value = index;
              playCurrentVideo(index);
              preloadNextVideo(index);
              if (!isUserScrolling.value) {
                cleanupDistantMedia(index);
              }
            }
          }
        }, options);
        observeVisibleSlides();
      };
      const handleScroll = () => {
        if (!isUserScrolling.value) {
          frozenIndex.value = currentIndex.value;
        }
        isUserScrolling.value = true;
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
          isUserScrolling.value = false;
          vue.nextTick(() => {
            observeVisibleSlides();
            cleanupDistantMedia(currentIndex.value);
          });
        }, 150);
      };
      vue.watch(visibleMedia, () => {
        if (isUserScrolling.value) {
          return;
        }
        if (watchTimeout) {
          clearTimeout(watchTimeout);
        }
        watchTimeout = setTimeout(() => {
          vue.nextTick(() => {
            observeVisibleSlides();
          });
        }, 50);
      }, { deep: true });
      vue.onMounted(async () => {
        addResourceHints();
        await fetchMedia();
        window.addEventListener("keydown", handleKeyDown, { passive: false });
        vue.nextTick(() => {
          if (media.value.length > 0) {
            if (swiperContainerRef.value) {
              swiperContainerRef.value.addEventListener("scroll", handleScroll, { passive: true });
            }
            goToMedia(0);
            setTimeout(() => {
              setupIntersectionObserver();
            }, 100);
          }
        });
      });
      vue.onUnmounted(() => {
        if (intersectionObserver) {
          intersectionObserver.disconnect();
        }
        window.removeEventListener("keydown", handleKeyDown);
        if (swiperContainerRef.value) {
          swiperContainerRef.value.removeEventListener("scroll", handleScroll);
        }
        if (scrollTimeout) clearTimeout(scrollTimeout);
        if (watchTimeout) clearTimeout(watchTimeout);
        pauseAllVideos();
        Object.keys(videoRefs.value).forEach((key) => {
          const video = videoRefs.value[key];
          if (video) {
            video.pause();
            video.src = "";
            video.load();
          }
        });
        videoRefs.value = {};
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            !isEditingIndex.value ? (vue.openBlock(), vue.createElementBlock("p", {
              key: 0,
              class: "subtitle",
              onClick: handleSubtitleClick
            }, vue.toDisplayString(media.value[currentIndex.value]?.type === "video" ? "Video" : "Image") + " " + vue.toDisplayString(currentIndex.value + 1) + " / " + vue.toDisplayString(media.value.length), 1)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
              vue.createElementVNode("span", _hoisted_4, vue.toDisplayString(media.value[currentIndex.value]?.type === "video" ? "Video" : "Image"), 1),
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => inputIndex.value = $event),
                type: "number",
                class: "index-input",
                min: "1",
                max: media.value.length,
                onBlur: handleIndexBlur,
                onKeydown: handleIndexKeydown
              }, null, 40, _hoisted_5), [
                [vue.vModelText, inputIndex.value]
              ]),
              vue.createElementVNode("span", _hoisted_6, "/ " + vue.toDisplayString(media.value.length), 1)
            ]))
          ]),
          vue.createElementVNode("div", {
            ref_key: "swiperContainerRef",
            ref: swiperContainerRef,
            class: "swiper-container"
          }, [
            media.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [..._cache[1] || (_cache[1] = [
              vue.createElementVNode("p", null, "No media found on this page", -1)
            ])])) : vue.createCommentVNode("", true),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleMedia.value, (item) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: item.id,
                "data-index": item.actualIndex,
                class: "media-slide"
              }, [
                item.type === "video" ? (vue.openBlock(), vue.createElementBlock("video", {
                  key: 0,
                  ref_for: true,
                  ref: (el) => {
                    if (el) videoRefs.value[item.actualIndex] = el;
                  },
                  src: item.src,
                  poster: item.poster,
                  preload: "none",
                  playsinline: "",
                  "webkit-playsinline": "",
                  controls: "",
                  disablePictureInPicture: "",
                  loop: "",
                  class: "media-content"
                }, " Your browser does not support the video tag. ", 8, _hoisted_9)) : (vue.openBlock(), vue.createElementBlock("img", {
                  key: 1,
                  src: item.src,
                  alt: item.alt,
                  loading: "lazy",
                  class: "media-content"
                }, null, 8, _hoisted_10))
              ], 8, _hoisted_8);
            }), 128))
          ], 512)
        ]);
      };
    }
  };
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-0e3767ee"]]);
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
    document.head.appendChild(meta);
  } else {
    const existingMeta = document.querySelector('meta[name="viewport"]');
    if (!existingMeta.content.includes("viewport-fit")) {
      existingMeta.content += ", viewport-fit=cover";
    }
  }
  let appInstance = null;
  let appContainer = null;
  const button = document.createElement("button");
  button.className = "toggle-app-btn";
  button.textContent = "Swipe Mode";
  const disableScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };
  const enableScroll = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };
  button.addEventListener("click", () => {
    if (appInstance) {
      appInstance.unmount();
      if (appContainer && appContainer.parentNode) {
        appContainer.parentNode.removeChild(appContainer);
      }
      appInstance = null;
      appContainer = null;
      button.textContent = "Swipe Mode";
      button.classList.remove("exit-mode");
      enableScroll();
    } else {
      appContainer = document.createElement("div");
      appContainer.id = "any-swiper-app";
      document.body.appendChild(appContainer);
      appInstance = vue.createApp(App);
      appInstance.mount(appContainer);
      button.textContent = "Exit";
      button.classList.add("exit-mode");
      disableScroll();
    }
  });
  const appendButton = () => {
    if (document.body) {
      document.body.appendChild(button);
      console.log("[Any Swiper] Button appended to body");
    } else {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          document.body.appendChild(button);
          console.log("[Any Swiper] Button appended to body (DOMContentLoaded)");
        });
      } else {
        setTimeout(() => {
          if (document.body) {
            document.body.appendChild(button);
            console.log("[Any Swiper] Button appended to body (delayed)");
          }
        }, 100);
      }
    }
  };
  appendButton();

})(Vue);