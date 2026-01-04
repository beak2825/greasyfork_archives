// ==UserScript==
// @name            Enhanced NanI
// @name:ja         なんI+
// @description     A userscript that improves existing features of NanI and adds new ones.
// @description:ja  なんIの機能を改善したり新たに機能を追加したりするユーザースクリプトです。
// @version         2.1.1
// @namespace       65c9f364-2ddd-44f5-bbc4-716f44f91335
// @author          MaxTachibana
// @license         MIT
// @match           https://openlive2ch.pages.dev/*
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @grant           unsafeWindow
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/549056/Enhanced%20NanI.user.js
// @updateURL https://update.greasyfork.org/scripts/549056/Enhanced%20NanI.meta.js
// ==/UserScript==

(async () => {
  "use strict";

  // src/h.ts
  var h = (tag, attrs, ...children) => {
    const el = document.createElement(tag);
    if (attrs) {
      const { style, class: classes, ...extra } = attrs;
      Object.assign(el.style, style);
      if (classes) {
        for (const cls of classes) {
          el.classList.add(cls);
        }
      }
      for (const prop in extra) {
        const val = extra[prop];
        if (prop.startsWith("on")) {
          el.addEventListener(prop.slice(2), val);
          continue;
        }
        el[prop] = val;
      }
    }
    el.append(...children);
    return el;
  };
  var compileStyle = (style) => {
    let css2 = "";
    for (const k in style) {
      const prop = k.replaceAll(
        /(.)([A-Z])/g,
        (_m, a, b) => `${a}-${b.toLowerCase()}`,
      );
      css2 += `${prop}: ${style[k]}; `;
    }
    return css2;
  };
  var compileCss = (rules) => {
    let css2 = "";
    for (const selector in rules) {
      const style = rules[selector];
      const rule = compileStyle(style);
      css2 += `${selector} { ${rule} }`;
    }
    return css2;
  };
  var css = (rules, styleProps) => {
    const css2 = compileCss(rules);
    const s = h("style", styleProps, css2);
    document.head.append(s);
    return s;
  };

  // src/event.ts
  var EventEmitter = class {
    #listenersMap = /* @__PURE__ */ new Map();
    #initListeners(event) {
      const listeners = /* @__PURE__ */ new Map();
      this.#listenersMap.set(event, listeners);
      return listeners;
    }
    on(event, listener, signal) {
      const listeners =
        this.#listenersMap.get(event) ?? this.#initListeners(event);
      if (listeners.has(listener)) return;
      let data;
      if (signal) {
        const abortHandler = () => {
          this.off(event, listener);
        };
        signal.addEventListener("abort", abortHandler, {
          once: true,
        });
        data = {
          signal,
          abortHandler,
        };
      }
      listeners.set(listener, data);
    }
    off(event, listener) {
      const listeners = this.#listenersMap.get(event);
      if (!listeners) return;
      const data = listeners.get(listener);
      if (data) {
        data.signal.removeEventListener("abort", data.abortHandler);
      }
      listeners.delete(listener);
      if (listeners.size <= 0) {
        this.#listenersMap.delete(event);
      }
    }
    emit(event, ...args) {
      const listeners = this.#listenersMap.get(event);
      if (!listeners) return;
      for (const listener of listeners.keys()) {
        try {
          listener(...args);
        } catch {}
      }
    }
  };

  // src/nani.ts
  var getThreadInfo = (threadEl) => {
    let params;
    if (threadEl) {
      const a = threadEl.getElementsByTagName("a")[0];
      params = new URL(a.href).searchParams;
    } else {
      params = new URLSearchParams(location.search);
    }
    const thread = params.get("thread");
    const board = params.get("board");
    if (!thread || !board) {
      return;
    }
    return {
      thread,
      board,
    };
  };
  var BOARD_PARAM = /board=(\w+)/;
  var getCurrentBoard = () => location.search.match(BOARD_PARAM)?.[1];
  var inThread = () => location.search.includes("thread=");
  var NaniEvents = {
    ThreadsCacheUpdate: "threadsCacheUpdate",
    TitlesCacheUpdate: "titlesCacheUpdate",
    PostsCacheUpdate: "postsCacheUpdate",
    UrlChanged: "urlChanged",
  };
  var NaniCache = class {
    threads;
    posts = /* @__PURE__ */ new Map();
    titles = /* @__PURE__ */ new Map();
    #threadCache = /* @__PURE__ */ new Map();
    getThread(id) {
      const cached = this.#threadCache.get(id);
      if (cached) {
        return cached;
      }
      if (!this.threads) return;
      for (const thread of this.threads) {
        this.#threadCache.set(thread.id.toString(), thread);
      }
      return this.#threadCache.get(id);
    }
  };
  var Nani = class {
    cache = new NaniCache();
    events = new EventEmitter();
    constructor() {
      this.#prepare();
    }
    #prepareFetch() {
      const this_ = this;
      const orig = unsafeWindow.fetch;
      const fetch = async function (...args) {
        const res = await orig.call(this, ...args);
        const cloned = res.clone();
        (async () => {
          const url = new URL(res.url);
          if (
            !url.hostname.endsWith(".supabase.co") ||
            args[1]?.method !== "GET"
          )
            return;
          if (url.pathname === "/rest/v1/threads") {
            const id = url.searchParams.get("id")?.replace(/^eq\./, "");
            const json = await cloned.json();
            if (id) {
              this_.cache.titles.set(id, json.title);
              this_.events.emit(NaniEvents.TitlesCacheUpdate, id, json.title);
            } else {
              this_.cache.threads = json;
              this_.events.emit(NaniEvents.ThreadsCacheUpdate);
            }
            return;
          }
          if (
            url.pathname === "/rest/v1/posts" &&
            url.searchParams.get("select") === "id,content,created_at"
          ) {
            const id = url.searchParams.get("thread_id")?.replace(/^eq\./, "");
            if (!id) return;
            const json = await cloned.json();
            this_.cache.posts.set(id, json);
            this_.events.emit(NaniEvents.PostsCacheUpdate, id, json);
            return;
          }
        })();
        return res;
      };
      unsafeWindow.fetch = fetch;
    }
    #prepareHistoryReplaceState() {
      const this_ = this;
      const orig = history.replaceState;
      const replaceState = function (...args) {
        try {
          const url = args[2];
          if (url) {
            const oldUrl = new URL(location.href);
            const newUrl = new URL(url, location.href);
            this_.events.emit(NaniEvents.UrlChanged, oldUrl, newUrl);
          }
        } catch {}
        return orig.call(this, ...args);
      };
      unsafeWindow.history.replaceState = replaceState;
    }
    #prepare() {
      this.#prepareFetch();
      this.#prepareHistoryReplaceState();
    }
  };

  // src/plugins/feature/all-image.ts
  var IMAGE_URL =
    /https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\/images\/\S+\.\S+|https:\/\/i\.imgur\.com\/\w+\.\w+/g;
  var allImage = () => ({
    documentEnd: (ctx2) => {
      const viewImagesButton = document.getElementById("icon-images");
      const imagePanelList = document.getElementById("image-panel-list");
      if (!viewImagesButton || !imagePanelList) return;
      viewImagesButton.addEventListener("click", () => {
        if (inThread()) return;
        if (!ctx2.nani.cache.threads) return;
        imagePanelList.replaceChildren();
        const images = [];
        const holder2 = h("div", {
          style: {
            display: "flex",
            gap: "0.5rem",
            flexDirection: "column",
          },
        });
        const gallery = h("div", {
          style: {
            display: "grid",
            gap: "0.25rem",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          },
        });
        for (const thread of ctx2.nani.cache.threads) {
          for (const post of thread.posts) {
            const urls = post.content.match(IMAGE_URL);
            if (!urls) continue;
            for (const url of urls) {
              images.push({
                board: thread.board,
                thread: thread.id.toString(),
                timestamp: new Date(post.created_at).getTime(),
                url,
              });
            }
          }
        }
        const label = h("strong", void 0, `画像: ${images.length}件`);
        for (const [i, image2] of images
          .sort((a, b) => b.timestamp - a.timestamp)
          .entries()) {
          const children = [
            h("span", void 0, `${images.length - i}.`),
            h(
              "a",
              {
                href: image2.url,
                target: "_blank",
                rel: "noopener noreferrer",
              },
              h(
                "div",
                {
                  style: {
                    width: "90px",
                    height: "90px",
                  },
                },
                h("img", {
                  src: image2.url,
                  loading: "lazy",
                  decoding: "async",
                  style: {
                    display: "block",
                    width: "auto",
                    height: "auto",
                    maxWidth: "90px",
                    maxHeight: "90px",
                    contentVisibility: "auto",
                  },
                }),
              ),
            ),
          ];
          children.push(
            h(
              "a",
              { href: `?board=${image2.board}&thread=${image2.thread}` },
              "スレに移動",
            ),
          );
          gallery.append(
            h(
              "div",
              {
                style: {
                  display: "flex",
                  gap: "0.1rem",
                  flexDirection: "column",
                  alignItems: "flex-start",
                },
              },
              ...children,
            ),
          );
        }
        holder2.append(label, gallery);
        imagePanelList.append(holder2);
      });
    },
  });

  // src/plugins/feature/display-poster.ts
  var displayPoster = () => ({
    documentStart: async () => {
      await GM.deleteValue("displayPoster");
    },
  });

  // src/iter-tools.ts
  function pipe(value, ...ops) {
    let ret = value;
    for (const op of ops) {
      ret = op(ret);
    }
    return ret;
  }
  var flatMap = (func) =>
    function* (source) {
      for (const value of source) {
        yield* func(value);
      }
    };
  function filter(predicate) {
    return function* (source) {
      for (const value of source) {
        if (predicate(value)) {
          yield value;
        }
      }
    };
  }
  var map = (func) =>
    function* (source) {
      for (const value of source) {
        yield func(value);
      }
    };
  var toArray = (source) => [...source];
  var forEach = (func) => (source) => {
    for (const value of source) {
      func(value);
    }
  };
  var enumerate = function* (source) {
    let i = 0;
    for (const value of source) {
      yield [i++, value];
    }
  };

  // src/plugins/feature/fix-ui.ts
  var holder = () => {
    const labels = [];
    return {
      checkbox: (label_, inputProps) => {
        const input = h("input", {
          type: "checkbox",
          ...inputProps,
        });
        const label = h(
          "label",
          {
            style: {
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            },
          },
          h("span", void 0, `${label_}: `),
          input,
        );
        labels.push(label);
        return input;
      },
      [Symbol.iterator]() {
        return labels.values();
      },
    };
  };
  var toggleStyle = (rules) => {
    const id = `a${Math.random().toString(36).slice(2)}`;
    let s;
    const obj = {
      enable: () => {
        if (s?.parentNode) return;
        if (s) {
          document.head.append(s);
          return;
        }
        s = css(rules, {
          id,
        });
      },
      disable: () => {
        s?.remove();
      },
      update: (enabled) => {
        if (enabled) {
          obj.enable();
        } else {
          obj.disable();
        }
      },
    };
    return obj;
  };
  var fixMosaic = (ctx2) => {
    const toggleMosaicButton = document.getElementById("toggle-mosaic-btn");
    if (!toggleMosaicButton) {
      console.warn("toggleMosaicButton not found");
      return;
    }
    const toggled = /* @__PURE__ */ new Set();
    const postsObs = new MutationObserver((recs) => {
      pipe(
        recs,
        flatMap((rec) => rec.addedNodes),
        filter((node) => node instanceof Element),
        forEach((postEl) => {
          for (const [i, img] of pipe(
            postEl.getElementsByTagName("img"),
            enumerate,
          )) {
            const id = `${postEl.id}_${i}`;
            img.dataset.userscriptImageId = id;
            if (toggled.has(id)) {
              img.style.transition = "unset";
              img.classList.toggle("unblurred");
            }
          }
        }),
      );
    });
    postsObs.observe(ctx2.elems.posts, {
      childList: true,
    });
    ctx2.elems.posts.addEventListener("click", (ev) => {
      if (!(ev.target instanceof HTMLImageElement)) return;
      const id = ev.target.dataset.userscriptImageId;
      if (!id) return;
      if (toggled.has(id)) {
        toggled.delete(id);
      } else {
        toggled.add(id);
      }
    });
    toggleMosaicButton.addEventListener("click", () => {
      toggled.clear();
    });
    ctx2.nani.events.on(NaniEvents.UrlChanged, (old, new_) => {
      if (!old.searchParams.has("board")) return;
      if (old.search === new_.search) return;
      toggled.clear();
    });
  };
  var fixUi = () => ({
    documentEnd: async (ctx2) => {
      fixMosaic(ctx2);
      ctx2.nani.events.on(NaniEvents.PostsCacheUpdate, () => {
        if (ctx2.elems.listView.style.display !== "none") {
          ctx2.elems.listView.style.display = "none";
        }
      });
      const checkboxes = holder();
      const savedBgcolor = await GM.getValue("bgcolor", "#ffffff");
      const bgcolorInput = h("input", {
        type: "color",
        value: savedBgcolor,
        oninput: async (ev) => {
          if (!ev.target) return;
          if (!(ev.target instanceof HTMLInputElement)) return;
          const bgcolor = ev.target.value;
          document.body.style.backgroundColor = bgcolor;
          await GM.setValue("bgcolor", bgcolor);
        },
      });
      const bgcolorInputLabel = h(
        "label",
        {
          style: {
            display: "inline-flex",
            gap: "0.5rem",
            alignItems: "center",
          },
        },
        h("span", void 0, "背景色: "),
        bgcolorInput,
      );
      document.body.style.backgroundColor = savedBgcolor;
      const fixedPanelHeightStyle = toggleStyle({
        ".nav-panel": {
          maxHeight: "50%",
          overflow: "auto",
        },
        ".panel-header": {
          top: "0",
          left: "0",
          position: "sticky",
          backgroundColor: "inherit",
        },
      });
      const fixedPanelHeight = checkboxes.checkbox(
        "ナビパネルのサイズを固定する",
        {
          checked: await GM.getValue("fixedPanelHeight", true),
          onchange: async () => {
            await GM.setValue("fixedPanelHeight", fixedPanelHeight.checked);
            fixedPanelHeightStyle.update(fixedPanelHeight.checked);
          },
        },
      );
      fixedPanelHeightStyle.update(fixedPanelHeight.checked);
      const navPanelSizingStyle = toggleStyle({
        ".nav-panel": {
          boxSizing: "border-box",
        },
      });
      const navPanelSizing = checkboxes.checkbox(
        "設定パネルのはみ出しを抑える",
        {
          checked: await GM.getValue("navPanelSizing", true),
          onchange: async () => {
            await GM.setValue("navPanelSizing", navPanelSizing.checked);
            navPanelSizingStyle.update(navPanelSizing.checked);
          },
        },
      );
      navPanelSizingStyle.update(navPanelSizing.checked);
      const paddingNavStyle = toggleStyle({
        "#bottom-nav": {
          padding: "0.5rem",
        },
        ".nav-panel": {
          bottom: "calc(60px + 1rem)",
        },
      });
      const paddingNav = checkboxes.checkbox("下部ナビに余白を付ける", {
        checked: await GM.getValue("paddingNav", true),
        onchange: async () => {
          await GM.setValue("paddingNav", paddingNav.checked);
          paddingNavStyle.update(paddingNav.checked);
        },
      });
      paddingNavStyle.update(paddingNav.checked);
      const hideOnlineCountStyle = toggleStyle({
        "#viewers-count": {
          display: "none",
        },
      });
      const hideOnlineCount = checkboxes.checkbox("閲覧者数を非表示にする", {
        checked: await GM.getValue("hideOnlineCount", false),
        onchange: async () => {
          await GM.setValue("hideOnlineCount", hideOnlineCount.checked);
          hideOnlineCountStyle.update(hideOnlineCount.checked);
        },
      });
      hideOnlineCountStyle.update(hideOnlineCount.checked);
      const uiFixSettings = h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          },
        },
        h("strong", void 0, "UIの調整"),
        bgcolorInputLabel,
        ...checkboxes,
      );
      ctx2.elems.extraSettings.append(uiFixSettings);
    },
  });

  // src/plugins/feature/headline.ts
  var dateCache = /* @__PURE__ */ new Map();
  var getDate = (time) => {
    let date = dateCache.get(time);
    if (!date) {
      date = new Date(time);
      dateCache.set(time, date);
    }
    return date;
  };
  var headline = () => ({
    documentEnd: async (ctx2) => {
      const savedHeadline = await GM.getValue("headline", true);
      let destructor;
      const enable = () => {
        const controller = new AbortController();
        const headline2 = h("div", {
          style: {
            fontSize: "0.9em",
            border: "1px solid #000000",
            marginBottom: "8px",
            height: "150px",
            overflow: "auto",
            padding: "1rem",
            flexDirection: "column",
            display: "flex",
            gap: "0.5rem",
            backgroundColor: "#eee",
          },
        });
        ctx2.elems.threadBox.parentNode?.insertBefore(
          headline2,
          ctx2.elems.threadBox,
        );
        ctx2.nani.events.on(
          NaniEvents.ThreadsCacheUpdate,
          () => {
            if (!ctx2.nani.cache.threads) return;
            const currentBoard = getCurrentBoard();
            if (!currentBoard) return;
            const posts = pipe(
              ctx2.nani.cache.threads,
              filter((th) => th.board === currentBoard),
              flatMap((th) =>
                pipe(
                  th.posts,
                  map((p) => ({
                    thread: th,
                    post: p,
                  })),
                ),
              ),
              filter((v) => {
                if (!ctx2.includeNgword) return true;
                if (
                  ctx2.includeNgword(v.post.content) ||
                  ctx2.includeNgword(v.thread.title)
                )
                  return false;
                return true;
              }),
              toArray,
            );
            const latestPosts = posts
              .sort(
                (a, b) =>
                  getDate(b.post.created_at).getTime() -
                  getDate(a.post.created_at).getTime(),
              )
              .slice(0, 10);
            headline2.replaceChildren();
            for (const { thread, post } of latestPosts) {
              const res = h(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                  },
                },
                h(
                  "a",
                  {
                    href: `?board=${thread.board}&thread=${thread.id}`,
                  },
                  `${thread.title} (${thread.posts.length})`,
                ),
                h(
                  "span",
                  {
                    style: {
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    },
                  },
                  post.content,
                ),
              );
              headline2.append(res);
            }
          },
          controller.signal,
        );
        destructor = () => {
          headline2.remove();
          controller.abort();
        };
      };
      const disable = () => {
        destructor?.();
        destructor = void 0;
      };
      const update = () => {
        if (headlineCheckbox.checked) {
          enable();
        } else {
          disable();
        }
      };
      const headlineCheckbox = h("input", {
        type: "checkbox",
        checked: savedHeadline,
        onchange: async () => {
          await GM.setValue("headline", headlineCheckbox.checked);
          update();
        },
      });
      const headlineCheckboxLabel = h(
        "label",
        {
          style: {
            display: "inline-flex",
            gap: "0.5rem",
            alignItems: "center",
          },
        },
        h("span", void 0, "ヘッドラインを有効化: "),
        headlineCheckbox,
      );
      const headlineSettings = h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          },
        },
        h("strong", void 0, "ヘッドライン"),
        headlineCheckboxLabel,
      );
      ctx2.elems.extraSettings.append(headlineSettings);
      update();
    },
  });

  // src/plugins/feature/history.ts
  var mergeToOriginal = async () => {
    const originalHistoryItem = localStorage.getItem("threadHistoryMap");
    if (!originalHistoryItem) return;
    const originalHistory = JSON.parse(originalHistoryItem);
    const savedHistory = JSON.parse(await GM.getValue("history", "{}"));
    for (const info in savedHistory) {
      const [board, thread] = info.split("_");
      const orig = originalHistory[thread];
      const saved = savedHistory[info];
      if (!orig) {
        originalHistory[thread] = {
          lastViewed: saved.timestamp,
          title: saved.title,
          url: `?board=${board}&thread=${thread}`,
        };
        continue;
      }
      if (saved.timestamp > orig.lastViewed) {
        orig.lastViewed = saved.timestamp;
      }
    }
    localStorage.setItem("threadHistoryMap", JSON.stringify(originalHistory));
    await GM.deleteValue("history");
  };
  var history2 = () => ({
    documentStart: async () => {
      await mergeToOriginal();
    },
  });

  // src/plugins/feature/image.ts
  var image = () => ({
    documentEnd: (ctx2) => {
      const handleClick = (ev) => {
        const img = ev.target;
        if (!(img instanceof HTMLImageElement)) return;
        if (!img.classList.contains("unblurred")) return;
        ev.preventDefault();
        ev.stopPropagation();
        const backdrop = h(
          "div",
          {
            style: {
              display: "flex",
              position: "fixed",
              top: "0",
              left: "0",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: "99999",
              width: "100svw",
              height: "100svh",
            },
            onclick: () => {
              backdrop.remove();
            },
          },
          h("img", {
            src: img.src,
            onclick: (ev2) => {
              ev2.stopPropagation();
              const a = h("a", {
                href: img.src,
                rel: "noopener noreferrer",
                target: "_blank",
                style: {
                  maxWidth: "80%",
                  maxHeight: "80%",
                },
              });
              a.click();
            },
            style: {
              cursor: "pointer",
              display: "block",
              maxWidth: "80%",
              maxHeight: "80%",
              width: "auto",
              height: "auto",
              verticalAlign: "middle",
            },
          }),
        );
        document.body.append(backdrop);
      };
      const obs = new MutationObserver((recs) => {
        for (const rec of recs) {
          for (const postEl of rec.addedNodes) {
            if (!(postEl instanceof Element)) continue;
            for (const img of postEl.getElementsByTagName("img")) {
              img.style.cursor = "zoom-in";
              img.addEventListener("click", handleClick);
            }
          }
        }
      });
      obs.observe(ctx2.elems.posts, {
        childList: true,
      });
    },
  });

  // src/plugins/feature/ngword.ts
  var savedNgwords = await GM.getValue("ngwords", "");
  var compileNgwords = (ngwords) => {
    const list = ngwords
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => !!l);
    if (list.length <= 0) return;
    const cache = /* @__PURE__ */ new Map();
    return (input) => {
      const cached = cache.get(input);
      if (cached !== void 0) {
        return cached;
      }
      const includes = list.some((word) => input.includes(word));
      cache.set(input, includes);
      return includes;
    };
  };
  var parsePost = (postEl) => {
    const nameEl = postEl.querySelector('[class^="name-"]');
    const bodyEl = postEl.getElementsByClassName("post-body")[0];
    if (!nameEl || !bodyEl || !(bodyEl instanceof HTMLElement)) return;
    const name = nameEl.textContent.replace(/:$/, "");
    const body = bodyEl.innerText;
    return {
      name,
      body,
    };
  };
  var ngword = () => ({
    documentEnd: (ctx2) => {
      const postsAppendChild = ctx2.elems.posts.appendChild;
      ctx2.elems.posts.appendChild = function (...args) {
        patch: try {
          if (!ctx2.includeNgword) break patch;
          const node = args[0];
          if (!(node instanceof HTMLElement)) break patch;
          if (!node.classList.contains("post")) break patch;
          const post = parsePost(node);
          if (!post) break patch;
          if (ctx2.includeNgword(post.body) || ctx2.includeNgword(post.name)) {
            node.style.display = "none";
          }
        } catch (err) {
          console.error(err);
        }
        return postsAppendChild.call(this, ...args);
      };
      const updateThreads = (threadEls) => {
        if (!ctx2.includeNgword) return;
        for (const threadEl of threadEls) {
          const info = getThreadInfo(threadEl);
          if (!info) continue;
          threadEl.dataset.userscriptThreadId = info.thread;
          const thread = ctx2.nani.cache.getThread(info.thread);
          const firstPost = thread?.posts[0];
          if (!firstPost) continue;
          if (
            !ctx2.includeNgword(firstPost.content) &&
            !ctx2.includeNgword(thread.title)
          )
            continue;
          threadEl.style.display = "none";
        }
      };
      const input = h("textarea", {
        value: savedNgwords,
        placeholder: "【画像】\n過疎",
        onchange: async () => {
          await GM.setValue("ngwords", input.value);
        },
        oninput: () => {
          ctx2.includeNgword = compileNgwords(input.value);
          if (inThread()) {
            updateThreads(
              pipe(
                ctx2.elems.threadBox.children,
                filter((el) => el instanceof HTMLElement),
              ),
            );
          }
        },
      });
      const label = h(
        "label",
        {
          style: {
            display: "inline-flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "flex-start",
          },
        },
        h("strong", void 0, "NGワード (改行区切り): "),
        input,
      );
      ctx2.includeNgword = compileNgwords(input.value);
      ctx2.elems.extraSettings.append(label);
      const threadBoxObs = new MutationObserver((recs) => {
        updateThreads(
          pipe(
            recs,
            flatMap((rec) => rec.addedNodes),
            filter((node) => node instanceof HTMLElement),
          ),
        );
      });
      threadBoxObs.observe(ctx2.elems.threadBox, {
        childList: true,
      });
    },
  });

  // src/plugins/feature/notification.ts
  var SOUND = {
    // https://qiita.com/kurokky/items/f18341c17ad846332569
    coin: (ctx2) => {
      const osc = ctx2.createOscillator();
      const gain = ctx2.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(987.766, ctx2.currentTime);
      osc.frequency.setValueAtTime(1318.51, ctx2.currentTime + 0.09);
      gain.gain.value = 0.05;
      gain.gain.linearRampToValueAtTime(0, ctx2.currentTime + 0.7);
      osc.connect(gain).connect(ctx2.destination);
      osc.start();
      osc.stop(ctx2.currentTime + 0.5);
    },
    pico: (ctx2) => {
      const osc = ctx2.createOscillator();
      const gain = ctx2.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1200, ctx2.currentTime);
      gain.gain.setValueAtTime(0.2, ctx2.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx2.currentTime + 0.15);
      osc.connect(gain).connect(ctx2.destination);
      osc.start();
      osc.stop(ctx2.currentTime + 0.2);
    },
  };
  var notification = () => ({
    documentEnd: async (ctx2) => {
      const play = () => {
        if (!ctx2.audioContext) return;
        SOUND[soundSelect.value](ctx2.audioContext);
      };
      const update = () => {
        if (postNotificationEnabled.checked) {
          obs.observe(ctx2.elems.posts, {
            childList: true,
          });
        } else {
          obs.disconnect();
        }
      };
      const postNotificationEnabled = h("input", {
        type: "checkbox",
        checked: await GM.getValue("postNotificationEnabled", false),
        onchange: async () => {
          await GM.setValue(
            "postNotificationEnabled",
            postNotificationEnabled.checked,
          );
          update();
        },
      });
      const postNotificationEnabledLabel = h(
        "label",
        {
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          },
        },
        h("span", void 0, "新着レスを通知: "),
        postNotificationEnabled,
      );
      const soundSelect = h(
        "select",
        {
          onchange: async () => {
            await GM.setValue("notificationSound", soundSelect.value);
          },
        },
        h("option", { value: "coin" }, "コイン"),
        h("option", { value: "pico" }, "ピコ"),
      );
      const soundSelectLabel = h(
        "div",
        {
          style: {
            display: "inline-flex",
            gap: "0.5rem",
            alignItems: "center",
          },
        },
        h(
          "label",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            },
          },
          h("span", void 0, "通知音: "),
          soundSelect,
        ),
        h(
          "button",
          {
            class: ["smallbtn"],
            onclick: () => {
              play();
            },
          },
          "再生",
        ),
      );
      soundSelect.value = await GM.getValue("notificationSound", "coin");
      const notificationSettings = h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          },
        },
        h("strong", void 0, "通知"),
        postNotificationEnabledLabel,
        soundSelectLabel,
      );
      ctx2.elems.extraSettings.append(notificationSettings);
      let prevPostsId;
      let prevPosts;
      const obs = new MutationObserver(() => {
        if (!postNotificationEnabled.checked) return;
        const info = getThreadInfo();
        if (!info) return;
        const posts = ctx2.nani.cache.posts.get(info.thread);
        if (!posts) return;
        if (prevPosts && prevPostsId !== info.thread.toString()) {
          prevPostsId = void 0;
          prevPosts = void 0;
        }
        if (!prevPosts) {
          prevPostsId = info.thread.toString();
          prevPosts = posts;
          return;
        }
        if (posts.length <= prevPosts.length) return;
        prevPosts = posts;
        play();
      });
      update();
    },
  });

  // src/plugins/feature/period.ts
  var PERIOD_1H = 1e3 * 60 * 60;
  var PERIOD_1D = 1e3 * 60 * 60 * 24;
  var savedPeriod = await GM.getValue("period", "all");
  var period = () => ({
    documentEnd: (ctx2) => {
      css({
        ".periodHidden": {
          display: "none",
        },
        ".activePeriod": {
          backgroundColor: "#ddd",
        },
      });
      let currentValue = savedPeriod;
      const options = h(
        "div",
        {
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "8px",
          },
        },
        h("strong", void 0, "期間: "),
        ...[
          { value: "all", label: "全て" },
          { value: PERIOD_1H.toString(), label: "1時間" },
          { value: PERIOD_1D.toString(), label: "1日" },
        ].map((v) => {
          const button = h(
            "button",
            {
              class: ["smallbtn"],
              onclick: async () => {
                for (const active of document.getElementsByClassName(
                  "activePeriod",
                )) {
                  active.classList.remove("activePeriod");
                }
                button.classList.add("activePeriod");
                currentValue = v.value;
                await GM.setValue("period", currentValue);
                updateAll(ctx2.elems.threadBox.children);
              },
            },
            v.label,
          );
          if (v.value === savedPeriod) {
            button.classList.add("activePeriod");
          }
          return button;
        }),
      );
      ctx2.elems.sortOptions.parentNode?.insertBefore(
        options,
        ctx2.elems.sortOptions.nextSibling,
      );
      const updateAll = (threadEls) => {
        const now = /* @__PURE__ */ new Date();
        for (const threadEl of threadEls) {
          update(threadEl, now);
        }
      };
      const update = (threadEl, now) => {
        if (currentValue === "all") {
          threadEl.classList.remove("periodHidden");
          return;
        }
        const info = getThreadInfo(threadEl);
        if (!info) return;
        const thread = ctx2.nani.cache.getThread(info.thread);
        if (!thread) return;
        const lastPost = thread.posts.at(-1);
        if (!lastPost) return;
        const lastPostDate = new Date(lastPost.created_at);
        const period2 = Number.parseInt(currentValue, 10);
        const diff = now.getTime() - lastPostDate.getTime();
        if (diff >= period2) {
          threadEl.classList.add("periodHidden");
        } else {
          threadEl.classList.remove("periodHidden");
        }
      };
      const obs = new MutationObserver((records) => {
        updateAll(
          pipe(
            records,
            flatMap((r) => r.addedNodes),
            filter((n) => n instanceof Element),
          ),
        );
      });
      obs.observe(ctx2.elems.threadBox, {
        childList: true,
      });
      updateAll(ctx2.elems.threadBox.children);
    },
  });

  // src/plugins/middleware/audio-context.ts
  var audioContext = () => ({
    documentEnd: (ctx2) => {
      document.body.addEventListener(
        "click",
        () => {
          const audioCtx = new AudioContext();
          const src = audioCtx.createBufferSource();
          src.start();
          src.stop();
          ctx2.audioContext = audioCtx;
        },
        {
          once: true,
        },
      );
    },
  });

  // src/plugins/middleware/defined-elements.ts
  var definedElements = () => ({
    documentEnd: (ctx2) => {
      const settingsPanel = document.getElementById("unhide-panel");
      const threadBox = document.getElementById("thread-box");
      const posts = document.getElementById("posts");
      const listView = document.getElementById("list-view");
      const sortOptions = document.getElementsByClassName("sort-options")[0];
      if (!sortOptions || !settingsPanel || !threadBox || !posts || !listView) {
        throw new TypeError("element not found");
      }
      const extraSettings = h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexDirection: "column",
          padding: "0.5rem",
        },
      });
      settingsPanel.append(h("hr"));
      settingsPanel.append(extraSettings);
      const appendNav = h("div", {
        style: {
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "8px",
        },
      });
      const appendNavThread = h("div", {
        style: {
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "8px",
        },
      });
      threadBox.parentNode?.insertBefore(appendNav, threadBox);
      posts.parentNode?.insertBefore(appendNavThread, posts);
      ctx2.elems = {
        sortOptions,
        settingsPanel,
        threadBox,
        posts,
        appendNav,
        appendNavThread,
        extraSettings,
        listView,
      };
    },
  });

  // src/plugins/middleware/nani.ts
  var nani = () => ({
    documentStart: (ctx2) => {
      ctx2.nani = new Nani();
    },
  });

  // src/index.ts
  var plugins = [
    // middleware
    nani(),
    audioContext(),
    definedElements(),
    // features
    displayPoster(),
    period(),
    allImage(),
    ngword(),
    history2(),
    fixUi(),
    notification(),
    headline(),
    image(),
  ];
  var ctx = {};
  for (const f of plugins) {
    await f.documentStart?.(ctx);
  }
  document.addEventListener("DOMContentLoaded", async () => {
    for (const f of plugins) {
      await f.documentEnd?.(ctx);
    }
  });
})();
