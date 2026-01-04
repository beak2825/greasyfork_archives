// ==UserScript==
// @name         Fuck YouTube Ads w/o Lubricant
// @namespace    https://www.github.com/vippium/
// @version      1.5.8
// @description  Very Useful for Ad-free experience (M*therF@ckers are not allowed to use this)
// @author       vippium
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://www.youtubekids.com/*
// @exclude      https://www.youtube.com/live_chat*
// @exclude      https://www.youtube.com/embed*
// @connect      https://api.cobalt.tools
// @connect      api.sponsor.ajay.app
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setClipboard
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557720/Fuck%20YouTube%20Ads%20wo%20Lubricant.user.js
// @updateURL https://update.greasyfork.org/scripts/557720/Fuck%20YouTube%20Ads%20wo%20Lubricant.meta.js
// ==/UserScript==

(function () {
  let uuid = GM_getValue("uuid");
  if (!uuid) {
    uuid = crypto
      .randomUUID()
      .substring(0, Math.floor(Math.random() * 5) + 6)
      .replace(/-/g, "");
    GM_setValue("uuid", uuid);
  }

  if (unsafeWindow[uuid]) {
    console.log("Duplicate injection!");
    return;
  }

  unsafeWindow[uuid] = true;

  let debugger_fun_name;

  const disableRemovePlayerAd = false;

  const open_config_keyword = "2333";
  const display_error_keyword = "2444";
  const reset_config_keyword = "2555";

  let channel_id = GM_getValue("last_channel_id", "default");

  const user_data_listener = get_user_data_listener();
  const user_data_api = get_user_data_api();
  let user_data = user_data_api.get();

  let tmp_debugger_value;

  let limit_eval = false;

  let element_monitor_observer;

  let real_language = user_data.language;

  let is_account_init;

  let fake_fetch;

  const inject_info = {
    ytInitialPlayerResponse: false,
    ytInitialData: false,
    ytInitialReelWatchSequenceResponse: false,
    xhr: false,
    fetch: false,
  };

  const $ = unsafeWindow.document.querySelector.bind(unsafeWindow.document);
  const $$ = unsafeWindow.document.querySelectorAll.bind(unsafeWindow.document);

  const origin_console = console;
  const script_url =
    "https://update.greasyfork.org/scripts/557720/Fuck%20YouTube%20Ads%20wo%20Lubricant.user.js";
  let href = location.href;
  let ytInitialPlayerResponse_rule;
  let ytInitialData_rule;
  let ytInitialReelWatchSequenceResponse_rule;
  let open_debugger = false;
  let isinint = false;
  let mobile_web;
  let movie_channel_info;
  let mobile_movie_channel_info;
  let flag_info;

  let debugger_ytInitialPlayerResponse;
  let debugger_ytInitialData;
  let debugger_ytInitialReelWatchSequenceResponse;
  let debugger_music_initialData;
  const error_messages = [];
  let data_process = get_data_process();
  let shorts_fun = get_shorts_fun();
  let yt_api = get_yt_api();
  const shorts_parse_delay = 500;
  const browser_info = getBrowserInfo();
  let page_type = get_page_type();
  const config_api = get_config_api();
  if (disableRemovePlayerAd) {
    config_api.common_ytInitialPlayerResponse_rule =
      config_api.common_ytInitialPlayerResponse_rule.slice(3);
  }
  const SPLIT_TAG = "###";
  let cur_watch_channle_id;
  const trustedScript = trustedScriptInit();
  setSecurePolicy();
  init();

  function init() {
    log("Initialization started!" + href, 0);
    url_observer();
    is_account_init = false;
    data_process.set_obj_filter(obj_process_filter);
    config_api.config_init(user_data.language);
    const init_hook = init_hook_collection();
    init_hook.property();
    init_hook.other();
    init_hook.request();

    unsafeWindow.document.addEventListener("DOMContentLoaded", function () {
      set_search_listen();
      // check_update();
      on_page_change();
      init_create_button_observer();
    });

    // Global shorts blocker observer
    init_global_shorts_blocker();

    isinint = true;
    log("Initialization finished!" + href, 0);
    open_debugger && set_debugger();
  }

  function setSecurePolicy() {
    if (
      !unsafeWindow.isSecureContext ||
      !unsafeWindow.trustedTypes?.createPolicy
    )
      return;
    try {
      unsafeWindow.trustedTypes.createPolicy("default", {
        createScriptURL: (url) => url,
        createHTML: (html) => html,
        createScript: (script) => script,
      });
    } catch (error) {}
  }

  function trustedScriptInit() {
    try {
      let test_value;
      eval("test_eval = 1");
      return function (str) {
        return str;
      };
    } catch (error) {
      if (unsafeWindow.trustedTypes) {
        const policy = unsafeWindow.trustedTypes.createPolicy("eval", {
          createScript: (script) => script,
        });
        return function (str) {
          return policy.createScript(str);
        };
      } else {
        log("trustedTypes not support", error, -1);
      }
    }
  }

  function init_hook_collection() {
    return {
      property() {
        const already_inject = [];
        let ytInitialPlayerResponse_value =
          unsafeWindow["ytInitialPlayerResponse"];
        function process_property(name, value, rule, reverse = false) {
          if (!value) return value;
          if (already_inject.includes(name)) {
            log(`${name} duplicate modification intercepted`, 0);
            return value;
          }
          const start_time = Date.now();
          if (typeof value === "object") {
            already_inject.push(name);
            open_debugger &&
              !limit_eval &&
              !eval(trustedScript(`debugger_${name}`)) &&
              eval(
                trustedScript(
                  `debugger_${name} = JSON.parse(JSON.stringify(value))`
                )
              );
            rule && data_process.obj_process(value, rule, reverse);
          }
          if (typeof value === "string") {
            already_inject.push(name);
            open_debugger &&
              !limit_eval &&
              !eval(trustedScript(`debugger_${name}`)) &&
              eval(trustedScript(`debugger_${name} = JSON.parse(value)`));
            value = data_process.text_process(value, rule, "insert", reverse);
          }
          log(`${name} time:`, Date.now() - start_time, "spend_time");
          return value;
        }

        define_property_hook(unsafeWindow, "ytInitialPlayerResponse", {
          get: function () {
            return ytInitialPlayerResponse_value;
          },
          set: function (value) {
            inject_info.ytInitialPlayerResponse = true;
            value = process_property(
              "ytInitialPlayerResponse",
              value,
              config_api.common_ytInitialPlayerResponse_rule
            );
            ytInitialPlayerResponse_value = value;
          },
          configurable: false,
        });
        let ytInitialReelWatchSequenceResponse_value =
          unsafeWindow["ytInitialReelWatchSequenceResponse"];
        define_property_hook(
          unsafeWindow,
          "ytInitialReelWatchSequenceResponse",
          {
            get: function () {
              return ytInitialReelWatchSequenceResponse_value;
            },
            set: function (value) {
              inject_info.ytInitialReelWatchSequenceResponse = true;
              if (["yt_shorts", "mobile_yt_shorts"].includes(page_type)) {
                value = process_property(
                  "ytInitialReelWatchSequenceResponse",
                  value,
                  config_api.get_rules(
                    mobile_web ? "yt_shorts_mobile" : "yt_shorts"
                  ).ytInitialReelWatchSequenceResponse_rule
                );
              }
              ytInitialReelWatchSequenceResponse_value = value;
            },
            configurable: false,
          }
        );

        let ytInitialData_value = unsafeWindow["ytInitialData"];
        define_property_hook(unsafeWindow, "ytInitialData", {
          get: function () {
            return ytInitialData_value;
          },
          set: function (value) {
            inject_info.ytInitialData = true;
            let rules = config_api.get_rules(page_type);
            ![
              "yt_watch",
              "mobile_yt_watch",
              "mobile_yt_watch_searching",
            ].includes(page_type) && (rules = rules.ytInitialData_rule);
            value = process_property("ytInitialData", value, rules);
            ytInitialData_value = value;
          },
          configurable: false,
        });

        const origin_ua = navigator.userAgent;
        define_property_hook(navigator, "userAgent", {
          get: function () {
            return browser_info.isMobile || browser_info.name === "Chrome"
              ? origin_ua
              : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";
          },
        });
        if (unsafeWindow.ytcfg) {
          if (
            unsafeWindow.ytcfg.data_ &&
            typeof unsafeWindow.ytcfg.data_.LOGGED_IN === "boolean"
          ) {
            account_data_init(unsafeWindow.ytcfg.data_.LOGGED_IN);
          } else {
            if (
              unsafeWindow.ytcfg.data_ &&
              typeof unsafeWindow.ytcfg.data_ === "object"
            ) {
              define_property_hook(unsafeWindow.ytcfg.data_, "LOGGED_IN", {
                get: function () {
                  return unsafeWindow.ytcfg.data_.LOGGED_IN_;
                },
                set: function (value) {
                  unsafeWindow.ytcfg.data_.LOGGED_IN_ = value;
                  account_data_init(value);
                },
              });
            }
          }
          if (!unsafeWindow.ytcfg.data_) {
            if (unsafeWindow.yt?.config_) {
              const config_ = unsafeWindow.yt.config_;
              if (typeof config_.LOGGED_IN === "boolean") {
                account_data_init(config_.LOGGED_IN);
              }
              config_.HL && config_api.config_init(config_.HL);
            }
          } else {
            if (unsafeWindow.ytcfg.data_?.HL) {
              config_api.config_init(unsafeWindow.ytcfg.data_.HL);
            } else {
              if (unsafeWindow.ytcfg.msgs) {
                unsafeWindow.ytcfg.msgs.__lang__ &&
                  config_api.config_init(unsafeWindow.ytcfg.msgs.__lang__);
              } else {
                unsafeWindow.ytcfg._msgs = unsafeWindow.ytcfg.msgs;
                define_property_hook(unsafeWindow.ytcfg, "msgs", {
                  get: function () {
                    return this._msgs;
                  },
                  set: function (newValue) {
                    if (newValue.__lang__)
                      config_api.config_init(newValue.__lang__);
                    this._msgs = newValue;
                  },
                });
              }
            }
          }
        } else {
          define_property_hook(unsafeWindow, "ytcfg", {
            get: function () {
              return this._ytcfg;
            },
            set: function (newValue) {
              // Filter out constructs like a = a || 1
              if (newValue === unsafeWindow.ytcfg) return;
              if (newValue.set) {
                const origin_set = newValue.set;
                newValue.set = function () {
                  // hook ytmusic initial data YTMUSIC_INITIAL_DATA
                  if (arguments?.[0].YTMUSIC_INITIAL_DATA) {
                    const yt_music_init_data =
                      arguments[0].YTMUSIC_INITIAL_DATA;
                    if (yt_music_init_data?.length > 0) {
                      const browse_data = yt_music_init_data[1];
                      if (browse_data.path === "/browse") {
                        const rule =
                          config_api.get_rules("yt_music").ytInitialData_rule;
                        browse_data.data = process_property(
                          "music_initialData",
                          browse_data.data,
                          rule
                        );
                      }
                    }
                  }
                  origin_set.apply(this, arguments);
                  if (
                    arguments[0] &&
                    typeof arguments[0].LOGGED_IN === "boolean"
                  ) {
                    account_data_init(arguments[0].LOGGED_IN);
                  }
                  if (arguments[0].HL) {
                    config_api.config_init(arguments[0].HL);
                  }
                };
              }
              this._ytcfg = newValue;
            },
          });
        }
      },
      other() {
        const origin_createElement = unsafeWindow.document.createElement;
        unsafeWindow.document.createElement = function () {
          const node = origin_createElement.apply(this, arguments);
          if (arguments[0] === "IFRAME") {
            const contentWindow_getter = Object.getOwnPropertyDescriptor(
              HTMLIFrameElement.prototype,
              "contentWindow"
            ).get;
            define_property_hook(node, "contentWindow", {
              get: function () {
                const contentWindow = contentWindow_getter.call(node);
                if (
                  !contentWindow ||
                  this.src !== "about:blank" ||
                  contentWindow.change_history
                )
                  return contentWindow;
                set_history_hook(contentWindow);
                contentWindow.fetch = fake_fetch;
                contentWindow.change_history = true;
                return contentWindow;
              },
            });
          }
          return node;
        };
        unsafeWindow.document.createElement.toString =
          origin_createElement.toString.bind(origin_createElement);
      },
      request() {
        async function deal_response(name, response, rule) {
          if (!rule) return response;
          let is_deal = false;
          const responseClone = response.clone();
          let result = await responseClone.text();
          let origin_result = result;
          if (name === "subscribe" || name === "unsubscribe") {
            let match_list = result.match(/channelId":\"(.*?)"/);
            const match_channel_id =
              match_list && match_list.length > 1 ? match_list[1] : "";
            let channel_infos = user_data.channel_infos;
            if (match_channel_id) {
              if (name === "unsubscribe") {
                let index = channel_infos.ids.indexOf(match_channel_id);
                if (index > -1) {
                  channel_infos.ids.splice(index, 1);
                  channel_infos.names.splice(index, 1);
                }
              } else {
                channel_infos.ids.push(match_channel_id);
                channel_infos.names.push("");
              }
              user_data.channel_infos = channel_infos;
              user_data_api.set();
              log(name, match_channel_id, 0);
            }
            is_deal = true;
          }
          if (name === "playlist") {
            let obj;
            try {
              obj = JSON.parse(result);
              data_process.obj_process(
                obj.playerResponse,
                config_api.common_ytInitialPlayerResponse_rule,
                false
              );
              data_process.obj_process(
                obj.response,
                config_api.get_rules("yt_watch", "init"),
                false
              );
              result = JSON.stringify(obj);
            } catch (error) {
              log("playlist parsing failed", error, -1);
              result = origin_result;
            }
            is_deal = true;
          }
          if (!is_deal) {
            let start_time = Date.now();
            result = data_process.text_process(result, rule, "insert", false);
            log(name + " time:", Date.now() - start_time, "spend_time");
          }
          if (!result) {
            result = origin_result;
            debugger;
          }
          return new Response(result, response);
        }
        const origin_fetch = unsafeWindow.fetch;
        if (!check_native("fetch", origin_fetch)) {
          log("fetch have been modified", -1);
        }
        fake_fetch = (function () {
          const fetch_ = async function (uri, options) {
            async function fetch_request(response) {
              let url = response.url;
              inject_info.fetch = true;
              let request_body;
              try {
                request_body = uri.body_ ? JSON.parse(uri.body_) : null;
              } catch (error) {
                request_body = null;
              }
              if (url.includes("youtubei/v1/next")) {
                const rule = config_api.get_rules(
                  mobile_web ? "mobile_yt_watch" : "yt_watch",
                  request_body?.videoId ? "init" : "next"
                );
                return await deal_response("next", response, rule);
              }
              if (url.includes("youtubei/v1/player")) {
                return await deal_response(
                  "player",
                  response,
                  config_api.common_ytInitialPlayerResponse_rule
                );
              }
              if (url.includes("youtubei/v1/reel/reel_watch_sequence")) {
                const rule = config_api.get_rules(
                  mobile_web ? "mobile_yt_shorts" : "yt_shorts"
                ).ytInitialReelWatchSequenceResponse_rule;
                return await deal_response(
                  "reel_watch_sequence",
                  response,
                  rule
                );
              }
              if (url.includes("youtubei/v1/reel/reel_item_watch")) {
                // shorts content
                const rule = config_api.get_rules(
                  mobile_web ? "mobile_yt_shorts" : "yt_shorts"
                ).ytInitialData_rule;
                return await deal_response("reel_item_watch", response, rule);
              }
              if (url.includes("youtubei/v1/browse?prettyPrint=false")) {
                let browse_id = request_body?.browseId;
                let rule;
                if (href.includes("https://music.youtube.com/")) {
                  rule = config_api.get_rules(
                    "yt_music",
                    "browse"
                  ).ytInitialData_rule;
                }
                // Ignore music homepage and movie homepage
                if (
                  !rule &&
                  (["yt_home", "mobile_yt_home"].includes(page_type) ||
                    browse_id === "FEwhat_to_watch")
                ) {
                  if (!browse_id) {
                    let node, node_list, node_index;
                    if (mobile_web) {
                      node = $(
                        "#filter-chip-bar > div > ytm-chip-cloud-chip-renderer.selected"
                      );
                      node_list = $$(
                        "#filter-chip-bar > div > ytm-chip-cloud-chip-renderer"
                      );
                      node_index = Array.from(node_list).indexOf(node);
                      if (node_index !== 1) return response;
                    } else {
                      node = $(
                        "#chips > yt-chip-cloud-chip-renderer.style-scope.ytd-feed-filter-chip-bar-renderer.iron-selected"
                      );
                      node_list = $$(
                        "#chips > yt-chip-cloud-chip-renderer.style-scope.ytd-feed-filter-chip-bar-renderer"
                      );
                      node_index = Array.from(node_list).indexOf(node);
                      if (node_index !== 0) return response;
                    }
                  }
                  rule = config_api.get_rules(
                    mobile_web ? "mobile_yt_home" : "yt_home",
                    request_body?.browseId ? "init" : "browse"
                  ).ytInitialData_rule;
                }

                return await deal_response("browse", response, rule);
              }
              if (url.startsWith("https://www.youtube.com/playlist?list=")) {
                return await deal_response("playlist", response, []);
              }
              if (url.includes("/youtubei/v1/search")) {
                const rule = config_api.get_rules(
                  mobile_web ? "mobile_yt_search" : "yt_search"
                ).ytInitialData_rule;
                return await deal_response("search", response, rule);
              }
              if (url.includes("/unsubscribe?prettyPrint=false")) {
                return await deal_response("unsubscribe", response, []);
              }
              if (url.includes("/subscribe?prettyPrint=false")) {
                return await deal_response("subscribe", response, []);
              }
              return response;
            }
            return origin_fetch(uri, options).then(fetch_request);
          };
          return fetch_;
        })();
        unsafeWindow.fetch = fake_fetch;
        unsafeWindow.fetch.toString = origin_fetch.toString.bind(origin_fetch);
        const origin_Request = unsafeWindow.Request;
        if (!check_native("Request", origin_Request)) {
          log("Request have been modified", -1);
        }
        unsafeWindow.Request = class extends unsafeWindow.Request {
          constructor(input, options = void 0) {
            super(input, options);
            this.url_ = input;
            if (options && "body" in options) this["body_"] = options["body"];
          }
        };

        unsafeWindow.XMLHttpRequest = class extends (
          unsafeWindow.XMLHttpRequest
        ) {
          open(method, url, ...opts) {
            inject_info.xhr = true;
            if (
              ["mobile_yt_watch"].includes(page_type) &&
              url.includes("m.youtube.com/watch?v")
            ) {
              log("xhr watch returned empty", 0);
              return null;
            }
            if (
              ["mobile_yt_home"].includes(page_type) &&
              url.includes("m.youtube.com/?pbj")
            ) {
              log("xhr home returned empty", 0);
              return null;
            }
            this.url_ = url;
            return super.open(method, url, ...opts);
          }
          send(body) {
            this.body_ = body;
            super.send(body);
          }
          get xhrResponseValue() {
            const xhr = this;
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
              let result = super.response;
              const url = xhr.responseURL;
              const result_type = typeof result;
              try {
                if (url.includes("youtubei/v1/player")) {
                  // music_watch shorts
                  if (result_type !== "string") {
                    log(`XHR ${url} response is not a string!`, 0);
                    return result;
                  }
                  result = data_process.text_process(
                    result,
                    config_api.common_ytInitialPlayerResponse_rule,
                    "insert",
                    false
                  );
                  return result;
                }
                if (url.includes("youtube.com/playlist")) {
                  debugger;
                  let obj;
                  obj = JSON.parse(result);
                  log(`Detected ${url}!`, 0);
                  data_process.obj_process(
                    obj[2].playerResponse,
                    ytInitialPlayerResponse_rule,
                    false
                  );
                  data_process.obj_process(
                    obj[3].response,
                    ytInitialData_rule,
                    false
                  );
                  tmp_debugger_value = obj;
                  result = JSON.stringify(obj);
                  return result;
                }
              } catch (error) {
                log(`XHR ${url} parsing failed!`, error, -1);
              }
            }
            return super.response;
          }
          get responseText() {
            return this.xhrResponseValue;
          }
          get response() {
            return this.xhrResponseValue;
          }
        };
      },
    };
  }

  function on_page_change() {
    let analyzing_download_url = false;
    function common() {
      if (page_type === "yt_shorts") {
        shorts_fun.check_shorts_exist();
      }
    }

    function element_monitor() {
      element_monitor_observer?.disconnect();
      const configs = wait_configs[page_type] || [];
      if (configs.length === 0) return;
      const callback = function (mutationsList) {
        for (let i = configs.length - 1; i >= 0; i--) {
          const config = configs[i];
          const selector = config.seletor;
          const nodes = $$(selector);
          for (let node of nodes) {
            if (node.offsetHeight > 0) {
              if (config.inject) {
                if (!node.inject_xxxx) {
                  node.inject_xxxx = true;
                } else {
                  configs.splice(i, 1);
                  break;
                }
              }
              if ("count" in config) {
                if (config.count > 0) {
                  config.count--;
                  if (config.count === 0) {
                    configs.splice(i, 1);
                  }
                }
              }
              const funs = Array.isArray(config.fun)
                ? config.fun
                : [config.fun];
              for (let fun of funs) {
                fun(node);
              }
              break;
            }
          }
        }
        if (configs.length === 0) {
          log("monitor end", 0);
          element_monitor_observer.disconnect();
          return;
        }
      };
      element_monitor_observer = new MutationObserver(callback);
      element_monitor_observer.observe($("body"), {
        childList: true,
        subtree: true,
      });
    }

    const wait_configs = {
      yt_shorts: [
        {
          seletor: "ytd-reel-video-renderer[is-active] video",
          inject: true,
          fun: [
            shorts_auto_scroll,
            set_shorts_dbclick_like,
            set_shorts_progress,
          ],
        },
        {
          seletor: "ytd-reel-video-renderer[is-active] #comments-button",
          inject: true,
          fun: [shorts_change_comment_click],
        },
        {
          seletor: "ytd-reel-video-renderer[is-active] video",
          count: 30,
          fun: [],
        },
      ],
      mobile_yt_shorts: [
        {
          seletor:
            'div.carousel-item[aria-hidden="false"] ytm-like-button-renderer',
          count: 10,
          fun: [
            shorts_auto_scroll,
            set_shorts_dbclick_like,
            set_shorts_progress,
          ],
        },
      ],

      yt_home: [
        {
          seletor:
            "#contents ytd-rich-section-renderer yt-shelf-header-layout h2.yt-shelf-header-layout__title span.yt-core-attributed-string",
          inject: true,
          fun: hide_explore_more_topics_section,
        },
      ],

      yt_watch: [
        {
          seletor:
            "#contents ytd-rich-section-renderer yt-shelf-header-layout h2.yt-shelf-header-layout__title span.yt-core-attributed-string",
          inject: true,
          fun: hide_explore_more_topics_section,
        },
        {
          seletor: "#teaser-carousel",
          inject: true,
          fun: hide_teaser_carousel,
        },
      ],
    };

    common();
    hide_create_button();
    element_monitor();

    // SponsorBlock
    init_sponsorblock();

    apply_hide_buttons_css();

    hide_shorts_sections_if_disabled();

    function set_dbclick(node, handler) {
      if (node.inject_dbclick) return;
      node.inject_dbclick = true;
      let corgin_onclick = node.onclick;
      let timers = [];
      node.onclick = node.onclick_ = function (event) {
        if (
          node.dbclick_intercept_propagation ||
          node.click_intercept_propagation
        ) {
          event.stopPropagation();
        }
        const timer = setTimeout(() => {
          if (
            node.dbclick_intercept_propagation &&
            !node.click_intercept_propagation
          ) {
            let parent = node.parentElement;
            if (parent) {
              let parentHandler = parent.onclick;
              if (typeof parentHandler === "function") {
                parentHandler.call(parent, event);
              }
              parent.dispatchEvent(event);
            }
          }
          timers.splice(timers.indexOf(timer), 1);
          corgin_onclick?.call(this, event);
        }, 300);
        timers.push(timer);
      };
      define_property_hook(node, "onclick", {
        get: function () {
          return this.onclick_;
        },
        set: function (fun) {
          corgin_onclick = fun;
        },
      });
      node.addEventListener("dblclick", function (event) {
        if (node.dbclick_intercept_propagation) event.stopPropagation();
        for (let timer of timers) {
          clearInterval(timer);
        }
        timers.length = 0;
        handler?.call(this, event);
      });
    }
    function set_download_event(dislike_node, like_node, url = href) {
      if (!like_node) log("like_node is null");
      if (!dislike_node) log("dislike_node is null");
      if (!like_node || !dislike_node) {
        log("set_download_event error like_node or dislike_node is null", -1);
        return;
      }
      function randomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      function set_node_download_event(node, type = "like") {
        node.style.transition = `${
          node.style.transition && node.style.transition + " , "
        }background-color 0.5s ease`;
        node.backgroundColor_ = node.style.backgroundColor;
        node.resolve_background_color = function () {
          if (this.background_color_interval_id)
            clearInterval(this.background_color_interval_id);
          this.style.backgroundColor = this.backgroundColor_;
        };
        set_dbclick(node, () => {
          if (user_data.dbclick_download_video === "off") return;
          const tips =
            type === "like"
              ? flag_info.download_video_confirm_tips
              : flag_info.download_audio_confirm_tips;
          if (!confirm(`${unsafeWindow.document.title}\n\n${tips}`)) return;
          const result = video_download(url, type !== "like", node);
          if (result) {
            node.background_color_interval_id = setInterval(() => {
              node.style.backgroundColor = randomColor();
            }, 100);
          }
        });
      }
      set_node_download_event(like_node, "like");
      set_node_download_event(dislike_node, "dislike");
    }
    function set_shorts_dbclick_like(video_node) {
      video_node =
        page_type === "yt_shorts"
          ? video_node
          : $('div.carousel-item[aria-hidden="false"] div.video-wrapper');
      if (!video_node) return;
      video_node.dbclick_intercept_propagation = true;
      set_dbclick(video_node, function () {
        if (user_data.shorts_dbclick_like === "off") return;
        const like_seltor =
          page_type === "yt_shorts"
            ? "ytd-reel-video-renderer[is-active] #like-button > yt-button-shape > label > button"
            : 'div.carousel-item[aria-hidden="false"] ytm-like-button-renderer button';
        $(like_seltor)?.click();
      });
    }
    function set_shorts_progress(node) {
      const video_node = page_type === "yt_shorts" ? node : $("video");
      if (!video_node || video_node.inject_shorts_progress) return;
      video_node.inject_shorts_progress = true;
      video_node.addEventListener("timeupdate", function () {
        if (user_data.shorts_add_video_progress === "off") return;
        const shape_button =
          page_type === "yt_shorts"
            ? $("ytd-reel-video-renderer[is-active] #button-shape > button")
            : $(
                'div.carousel-item[aria-hidden="false"] ytm-bottom-sheet-renderer button'
              );
        if (!shape_button) return;
        const progress = (video_node.currentTime / video_node.duration) * 100;
        const transparency = page_type === "yt_shorts" ? "0.05" : "0.3";
        const progress_color =
          page_type === "yt_shorts"
            ? "rgba(0, 0, 255, 0.4)"
            : "rgba(255, 255, 0, 0.4)";
        shape_button.style.background = `linear-gradient(to top, ${progress_color} ${progress}%, rgba(0, 0, 0, ${transparency}) ${progress}%)`;
      });
    }
    function shorts_change_comment_click(comments_node) {
      const comments_button = comments_node.querySelector(
        "ytd-button-renderer > yt-button-shape > label > button"
      );
      const onclick_setter = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "onclick"
      ).set;
      const current_render_node = $("ytd-reel-video-renderer[is-active]");
      const wrap = function (fun) {
        return function (event) {
          const expand_node = current_render_node.querySelector(
            "#watch-while-engagement-panel > ytd-engagement-panel-section-list-renderer:nth-child(1)"
          );
          if (
            expand_node?.visibility === "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"
          ) {
            const expand_close_node = current_render_node.querySelector(
              "#visibility-button > ytd-button-renderer > yt-button-shape > button"
            );
            expand_close_node?.click();
          } else {
            fun.call(this, event);
          }
        };
      };
      comments_button.onclick = comments_button.onclick_ = wrap(
        comments_button.onclick
      );
      define_property_hook(comments_button, "onclick", {
        get: function () {
          return this.onclick_;
        },
        set: function (fun) {
          this.onclick_ = wrap(fun);
          onclick_setter.call(comments_button, this.onclick_);
        },
      });
    }
    function shorts_auto_scroll(video_node) {
      video_node = page_type === "yt_shorts" ? video_node : $("video");
      if (!video_node) return;
      if (video_node?.inject_auto_scroll) return;
      video_node.inject_auto_scroll = true;
      video_node.loop = false;
      define_property_hook(video_node, "loop", {
        get: function () {
          return false;
        },
      });
      video_node?.addEventListener("ended", function () {
        if (user_data.shorts_auto_scroll === "on") {
          if (page_type === "yt_shorts") {
            $(
              "#navigation-button-down > ytd-button-renderer > yt-button-shape > button"
            ).click();
          } else {
            simulate_swipeup(this, 500, 100);
          }
          return;
        }
        if (user_data.shorts_disable_loop_play === "on") {
          return;
        }
        this.play();
      });
    }
    function set_shorts_download(like_button) {
      const dislike_button = $(
        "ytd-reel-video-renderer[is-active] #dislike-button > yt-button-shape > label > button"
      );
      set_download_event(dislike_button, like_button);
    }
    function set_music_download(dislike_node) {
      const like_node = dislike_node.parentElement.parentElement.querySelector(
        "#button-shape-like > button"
      );
      set_download_event(dislike_node, like_node);
    }
    function set_watch_download(wrapper_node) {
      const like_node = wrapper_node.querySelector(
        "like-button-view-model button"
      );
      const dislike_node = wrapper_node.querySelector(
        "dislike-button-view-model button"
      );
      set_download_event(dislike_node, like_node);
    }
    function set_mobile_shorts_download(wrapper_node) {
      const nodes = wrapper_node.querySelectorAll("button");
      if (nodes.length !== 2) {
        log(
          "set_mobile_shorts_download wrong number of nodes",
          nodes.length,
          -1
        );
        return;
      }
      const like_node = nodes[0];
      const dislike_node = nodes[1];
      dislike_node.click_intercept_propagation = true;
      dislike_node.dbclick_intercept_propagation = true;
      like_node.click_intercept_propagation = true;
      like_node.dbclick_intercept_propagation = true;
      set_download_event(dislike_node, like_node);
    }
    function video_download(
      url = href,
      isAudioOnly = false,
      targetNode = null
    ) {
      if (page_type === "yt_music_watch") {
        url = "https://www.youtube.com/watch?" + href.split("?")[1];
      }
      if (analyzing_download_url) return false;
      analyzing_download_url = true;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cobalt.tools/api/json", true);
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");

      const data = JSON.stringify({
        url: encodeURI(url),
        vQuality: "max",
        filenamePattern: "basic",
        isAudioOnly: isAudioOnly,
        disableMetadata: true,
      });
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          const download_url = response?.url;
          if (download_url) {
            window.open(download_url, "_blank");
            analyzing_download_url = false;
            targetNode.resolve_background_color();
            return;
          }
        }
        let tips;
        try {
          const json_data = JSON.parse(xhr.responseText);
          tips = json_data?.text;
        } catch (error) {
          tips = xhr.responseText;
        }
        alert(
          `download failed\nstatus: ${xhr.status}\nresponseText: ${tips}\n`
        );
        analyzing_download_url = false;
        targetNode.resolve_background_color();
      };

      xhr.onerror = function (error) {
        alert(`download failed\nstatus: ${xhr.status}\nerror: ${error}\n`);
        analyzing_download_url = false;
        targetNode.resolve_background_color();
      };
      xhr.send(data);
      return true;
    }
  }

  function get_user_data_listener() {
    return {
      cur_channel_id: null,
      listener_id: null,
      set: function () {
        if (channel_id === this.cur_channel_id) {
          return;
        }
        !this.cur_channel_id && GM_removeValueChangeListener(this.listener_id);
        this.cur_channel_id = channel_id;
        this.listener_id = GM_addValueChangeListener(
          channel_id,
          (name, oldValue, newValue, remote) => {
            if (!remote || this.cur_channel_id !== name) return;
            newValue.language = user_data.language;
            user_data = newValue;
            config_api.config_init();
            const popup_node =
              unsafeWindow.document.getElementById("xxx_popup");
            popup_node && display_config_win();
          }
        );
      },
    };
  }

  async function account_data_init(login) {
    if (is_account_init) return;
    is_account_init = true;
    if (login) {
      yt_api.get_channel_id();
      yt_api.get_subscribe_data();
    } else if (channel_id !== "default") {
      channel_id = "default";
      user_data.login = false;
      user_data = user_data_api.get();
    }
  }

  function native_method_hook(method_path, handler) {
    try {
      let [last_path, last_key] =
        data_process.get_lastPath_and_key(method_path);
      let last_obj = data_process.string_to_value(
        unsafeWindow,
        "unsafeWindow." + last_path
      );
      let dec_obj = last_obj[last_key];
      last_obj[last_key + "__"] = dec_obj;
      if (typeof dec_obj !== "function") {
        log(method_path, "have been modified", -1);
        return;
      }
      const method_name = dec_obj.name;
      if (
        dec_obj.toString() !==
        "function " + method_name + "() { [native code] }"
      ) {
        log(method_path, "have been modified!", -1);
      }
      last_obj[last_key] = handler;
    } catch (error) {
      log(method_path, "hook failed!", error, -1);
    }
  }

  function define_property_hook(obj, property, descriptor) {
    const old_descriptor = Object.getOwnPropertyDescriptor(obj, property);
    if (old_descriptor?.configurable === false) {
      debugger;
      log(property, "is not configurable, hook error!", old_descriptor, -1);
      return;
    }
    try {
      Object.defineProperty(obj, property, descriptor);
    } catch (error) {
      log(property, "hook failed!", error, -1);
    }
  }

  function get_config_api() {
    return {
      flag_infos: {
        "zh-CN": {
          sponsored: "赞助商广告",
          free_movie: "免费（含广告）",
          live: "直播",
          movie_channel: "电影与电视",
          free_primetime_movie: "免费黄金档电影",
          Playables: "试玩 / 游戏中心",
          short_buy_super_thanks: "购买 Super Thanks",
          think_video: "你觉得这个视频如何？|此推荐内容怎么样？",
          try: "试用",
          recommend_popular: "热门",
          featured: "精选",
          category_live: "直播",
          category_game: "游戏",
          category_news: "新闻",
          btn_recommend_movie: "电影推荐",
          btn_recommend_shorts: "Shorts 推荐",
          btn_recommend_liveroom: "直播推荐",
          btn_recommend_popular: "热门推荐",
          btn_recommend_game: "游戏中心推荐",
          btn_save: "保存",
          goodselect: "精选",
          music_ad_flag: "无广告",
          upcoming: "即将开始",
          init: "初始化",
          ctoc: "已复制到剪贴板",
          runing_normally: "运行正常",
          err_msg: "错误信息",
          success: "成功",
          failed: "失败",
          tips: "你可以将错误信息或截图发送给脚本开发者",
          exists_error: "检测到错误",
          inject: "注入",
          btn_lable_open: "开启",
          btn_lable_close: "关闭",
          btn_lable_subscribed: "仅订阅",
          recommend_subscribed_lable_tips: "仅显示已订阅的推荐",
          title_add_shorts_upload_date: "在 Shorts 显示上传时间",
          title_shorts_change_author_name: "将 Shorts 作者名替换为频道名",
          config_info: "配置信息",
          page_info: "页面信息",
          rule_info: "规则信息",
          del_config_confirm_tips: "你确定要删除所有配置信息吗？",
          btn_dbclick_download_video_tips: "双击赞下载视频，双击踩下载音频",
          btn_dbclick_download_video_title: "双击下载视频",
          download_video_confirm_tips: "要下载这个视频吗？",
          download_audio_confirm_tips: "要下载这个音频吗？",
          btn_shorts_auto_scroll_title: "自动滚动",
          bt_shorts_disable_loop_play_title: "禁用循环播放",
          btn_shorts_dbclick_like_title: "双击视频点赞",
          btn_shorts_add_video_progress_title: "添加视频进度",
          shorts_recommend_split_tag: "Shorts 配置",
          btn_sponsorblock_title: "SponsorBlock 跳过赞助片段",
          btn_sponsorblock_tips:
            "使用 SponsorBlock 接口自动跳过视频中的赞助内容",
        },
        "zh-TW": {
          sponsored: "贊助商廣告",
          free_movie: "免費（含廣告）",
          live: "直播",
          movie_channel: "電影與電視節目",
          free_primetime_movie: "免費黃金時段電影",
          Playables: "遊戲角落",
          short_buy_super_thanks: "購買 Super Thanks",
          think_video: "你對這部影片有什麼看法？|此推薦內容如何？",
          try: "試用",
          recommend_popular: "發燒影片",
          featured: "精選內容",
          category_live: "直播",
          category_game: "遊戲",
          category_news: "新聞",
          btn_recommend_movie: "電影推薦",
          btn_recommend_shorts: "Shorts 推薦",
          btn_recommend_liveroom: "直播推薦",
          btn_recommend_popular: "熱門推薦",
          btn_recommend_game: "遊戲角落推薦",
          btn_save: "保存",
          goodselect: "精選內容",
          music_ad_flag: "零廣告",
          upcoming: "即將開始",
          init: "初始化",
          ctoc: "已複製到剪貼板",
          runing_normally: "運行正常",
          err_msg: "錯誤訊息",
          success: "成功",
          failed: "失敗",
          tips: "你可以將錯誤訊息或截圖發送給腳本開發者",
          exists_error: "存在錯誤訊息（請多次刷新以確認是否為相同錯誤）",
          inject: "注入",
          btn_lable_open: "開啟",
          btn_lable_close: "關閉",
          btn_lable_subscribed: "僅訂閱",
          recommend_subscribed_lable_tips: "只顯示已訂閱的推薦",
          title_add_shorts_upload_date: "Shorts 添加更新時間",
          title_shorts_change_author_name: "Shorts 使用者名稱改為頻道名稱",
          config_info: "設定資訊",
          page_info: "頁面資訊",
          rule_info: "規則資訊",
          del_config_confirm_tips: "你確定要刪除所有設定資訊嗎？",
          btn_dbclick_download_video_tips:
            "雙擊按讚下載影片，雙擊不喜歡下載音檔",
          btn_dbclick_download_video_title: "雙擊下載影片",
          download_video_confirm_tips: "要下載這個影片嗎？",
          download_audio_confirm_tips: "要下載這個音檔嗎？",
          btn_shorts_auto_scroll_title: "自動捲動",
          bt_shorts_disable_loop_play_title: "禁止循環播放",
          btn_shorts_dbclick_like_title: "雙擊影片按讚",
          btn_shorts_add_video_progress_title: "添加影片進度",
          shorts_recommend_split_tag: "Shorts 設定",
          btn_sponsorblock_title: "SponsorBlock 跳過贊助片段",
          btn_sponsorblock_tips:
            "使用 SponsorBlock API 自動跳過影片中的贊助內容",
        },
        "zh-HK": {
          sponsored: "贊助廣告",
          free_movie: "免費（有廣告）",
          live: "直播",
          movie_channel: "電影與電視節目",
          free_primetime_movie: "免費黃金時段電影",
          Playables: "遊戲角落",
          short_buy_super_thanks: "購買 Super Thanks",
          free_primetime_movie: "免費黃金時段電影",
          think_video: "你對此影片有何意見？|此推薦內容如何？",
          try: "試用",
          recommend_popular: "熱爆影片",
          featured: "精選",
          category_live: "直播",
          category_game: "遊戲",
          category_news: "新聞",
          btn_recommend_movie: "電影推薦",
          btn_recommend_shorts: "Shorts 推薦",
          btn_recommend_liveroom: "直播推薦",
          btn_recommend_popular: "熱門推薦",
          btn_recommend_game: "遊戲角落推薦",
          btn_save: "保存",
          goodselect: "精選",
          music_ad_flag: "零廣告音樂",
          upcoming: "即將發佈",
          init: "初始化",
          ctoc: "已複製到剪貼板",
          runing_normally: "運行正常",
          err_msg: "錯誤訊息",
          success: "成功",
          failed: "失敗",
          tips: "你可以將錯誤訊息或截圖發送給腳本開發者",
          exists_error: "存在錯誤訊息（請多次刷新以確認是否為相同錯誤）",
          inject: "注入",
          btn_lable_open: "開啓",
          btn_lable_close: "關閉",
          btn_lable_subscribed: "僅訂閱",
          recommend_subscribed_lable_tips: "只顯示已訂閱的推薦",
          title_add_shorts_upload_date: "Shorts 添加更新時間",
          title_shorts_change_author_name: "Shorts 使用者名稱改為頻道名稱",
          config_info: "設定資訊",
          page_info: "頁面資訊",
          rule_info: "規則資訊",
          del_config_confirm_tips: "你確定要刪除所有設定資訊嗎？",
          btn_dbclick_download_video_tips:
            "雙擊喜歡下載影片，雙擊不喜歡下載音檔",
          btn_dbclick_download_video_title: "雙擊下載影片",
          download_video_confirm_tips: "要下載這個影片嗎？",
          download_audio_confirm_tips: "要下載這個音檔嗎？",
          btn_shorts_auto_scroll_title: "自動捲動",
          bt_shorts_disable_loop_play_title: "禁止循環播放",
          btn_shorts_dbclick_like_title: "雙擊影片按讚",
          btn_shorts_add_video_progress_title: "添加影片進度",
          shorts_recommend_split_tag: "Shorts 設定",
          btn_sponsorblock_title: "SponsorBlock 跳過贊助內容",
          btn_sponsorblock_tips:
            "使用 SponsorBlock API 自動略過影片中的贊助片段",
        },
        en: {
          sponsored: "Sponsored Ads",
          free_movie: "Free (with ads)",
          live: "LIVE",
          movie_channel: "Movies & TV",
          Playables: "Playables",
          short_buy_super_thanks: "Buy Super Thanks",
          think_video:
            "What did you think of this video? | How is this recommended content?",
          try: "Try",
          recommend_popular: "Trending",
          featured: "Featured",
          category_live: "Live",
          category_game: "Gaming",
          category_news: "News",
          btn_recommend_movie: "Movie Recommendations",
          btn_recommend_shorts: "Shorts Recommendations",
          btn_recommend_liveroom: "Live Recommendations",
          btn_recommend_popular: "Trending",
          btn_recommend_game: "Playables Recommendations",
          btn_save: "Save",
          goodselect: "Featured",
          music_ad_flag: "ad-free",
          upcoming: "UPCOMING",
          init: "Initialize",
          ctoc: "Copied to clipboard",
          runing_normally: "running normally",
          err_msg: "error message",
          success: "Success",
          failed: "Failed",
          tips: "You can send an error message or screenshot to the developer",
          exists_error:
            "Error message exists (It is recommended to refresh multiple times to see if it is the same error message)",
          inject: "Inject",
          btn_lable_open: "On",
          btn_lable_close: "Off",
          btn_lable_subscribed: "Only subscribed",
          recommend_subscribed_lable_tips:
            "Only show subscribed recommendations",
          title_add_shorts_upload_date: "Add Shorts upload time",
          title_shorts_change_author_name:
            "Change Shorts username to channel name",
          config_info: "Config info",
          page_info: "Page info",
          rule_info: "Rule info",
          del_config_confirm_tips:
            "Are you sure you want to delete all configuration settings?",
          btn_dbclick_download_video_tips:
            "Double-click the like button to download the video, double-click the dislike button to download the audio",
          btn_dbclick_download_video_title: "DoubleClickDownloadVideo",
          download_video_confirm_tips: "Do you want to download this video?",
          download_audio_confirm_tips: "Do you want to download this audio?",
          btn_shorts_auto_scroll_title: "AutoScroll",
          bt_shorts_disable_loop_play_title: "DisableLoopPlay",
          btn_shorts_dbclick_like_title: "DoubleClickLikeVideo",
          btn_shorts_add_video_progress_title: "AddVideoProgress",
          shorts_recommend_split_tag: "ShortsConfig",
          btn_sponsorblock_title: "SponsorBlock skip sponsors",
          btn_sponsorblock_tips:
            "Automatically skip sponsor segments using SponsorBlock API",
        },
      },

      common_ytInitialPlayerResponse_rule: [
        "abs:playerAds=- $exist",
        "abs:adSlots=- $exist",
        "abs:adPlacements=- $exist",
        'abs:auxiliaryUi.messageRenderers.bkaEnforcementMessageViewModel.isVisible=json("true") $exist',
        "abs:adBreakHeartbeatParams=- $exist",
        "abs:messages[*]=- /.mealbarPromoRenderer$exist",
      ],
      default_language: "en",
      config_init: function (tmp_language = null) {
        if (!tmp_language) {
          tmp_language = unsafeWindow["ytcfg"].msgs
            ? unsafeWindow["ytcfg"].msgs.__lang__
            : unsafeWindow["ytcfg"].data
            ? unsafeWindow["ytcfg"].data.HL
            : undefined;
          !tmp_language &&
            (tmp_language =
              unsafeWindow["yt"] &&
              unsafeWindow["yt"].config_ &&
              unsafeWindow["yt"].config_.HL);
          if (!tmp_language) {
            log("Language acquisition error", unsafeWindow, -1);
          }
        }
        if (!["en", "zh-CN", "zh-TW", "zh-HK"].includes(tmp_language)) {
          real_language = tmp_language;
          tmp_language = this.default_language;
        }
        if (tmp_language !== user_data.language) {
          user_data.language = tmp_language;
          user_data_api.set();
        }
        flag_info = this.flag_infos[user_data.language];
        movie_channel_info = {
          guideEntryRenderer: {
            navigationEndpoint: {
              clickTrackingParams: "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
              commandMetadata: {
                webCommandMetadata: {
                  url: "/feed/storefront",
                  webPageType: "WEB_PAGE_TYPE_BROWSE",
                  rootVe: 6827,
                  apiUrl: "/youtubei/v1/browse",
                },
              },
              browseEndpoint: {
                browseId: "FEstorefront",
              },
            },
            icon: {
              iconType: "CLAPPERBOARD",
            },
            trackingParams: "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
            formattedTitle: {
              simpleText: flag_info.movie_channel,
            },
            accessibility: {
              accessibilityData: {
                label: flag_info.movie_channel,
              },
            },
          },
        };
        data_process.storage_obj("movie_channel_info", movie_channel_info);
        mobile_movie_channel_info = {
          navigationItemViewModel: {
            text: {
              content: flag_info.movie_channel,
            },
            icon: {
              sources: [
                {
                  clientResource: {
                    imageName: "CLAPPERBOARD",
                  },
                },
              ],
            },
            onTap: {
              parallelCommand: {
                commands: [
                  {
                    innertubeCommand: {
                      clickTrackingParams:
                        "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
                      hideMoreDrawerCommand: {},
                    },
                  },
                  {
                    innertubeCommand: {
                      clickTrackingParams:
                        "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
                      commandMetadata: {
                        webCommandMetadata: {
                          url: "/feed/storefront",
                          webPageType: "WEB_PAGE_TYPE_CHANNEL",
                          rootVe: 3611,
                          apiUrl: "/youtubei/v1/browse",
                        },
                      },
                      browseEndpoint: {
                        browseId: "FEstorefront",
                      },
                    },
                  },
                ],
              },
            },
            loggingDirectives: {
              trackingParams: "CBQQnOQDGAIiEwj5l8SLqPiCAxUXSEwIHbf1Dw0=",
              visibility: {
                types: "12",
              },
              enableDisplayloggerExperiment: true,
            },
          },
        };
        data_process.storage_obj(
          "mobile_movie_channel_info",
          mobile_movie_channel_info
        );
        ytInitialData_rule = null;
        ytInitialReelWatchSequenceResponse_rule = null;
        ytInitialPlayerResponse_rule = null;
        mobile_web = page_type.startsWith("mobile");
      },
      get_rules: function (page_type_, type) {
        page_type_ = page_type_ || page_type;
        if (page_type_ === "mobile_yt_watch_searching")
          page_type_ = "mobile_yt_watch";
        else if (page_type_ === "mobile_yt_home_searching")
          page_type_ = "mobile_yt_home";
        else if (page_type_ === "yt_music_channel") page_type_ = "yt_watch";

        let tmp_ytInitialData_rule = null;
        let tmp_ytInitialReelWatchSequenceResponse_rule = null;
        let tmp_ytInitialPlayerResponse_rule = null;
        const common_ytInitialData_rule = ["adSlotRenderer.=-"];
        const return_obj = {
          ytInitialData_rule: null,
          ytInitialReelWatchSequenceResponse_rule: null,
          ytInitialPlayerResponse_rule: null,
          reverse: false,
        };
        if (page_type_ === "yt_search") {
          tmp_ytInitialData_rule = common_ytInitialData_rule;
          return_obj.ytInitialData_rule = tmp_ytInitialData_rule;
          return return_obj;
        }

        if (page_type_ === "yt_music") {
          return_obj.ytInitialData_rule = [
            "abs:overlay.mealbarPromoRenderer=- $exist",
          ];
          return return_obj;
        }

        if (page_type_ === "mobile_yt_search") {
          tmp_ytInitialData_rule = common_ytInitialData_rule;
          return_obj.ytInitialData_rule = tmp_ytInitialData_rule;
          return return_obj;
        }

        if (page_type_ === "yt_kids_watch") {
          tmp_ytInitialData_rule = common_ytInitialData_rule;
          return_obj.ytInitialData_rule = tmp_ytInitialData_rule;
          return return_obj;
        }

        if (page_type_ === "yt_music_watch") {
          tmp_ytInitialData_rule = common_ytInitialData_rule;
          return_obj.ytInitialData_rule = tmp_ytInitialData_rule;
          return return_obj;
        }

        if (page_type_.includes("yt_shorts")) {
          const tmp_ytInitialData_rule__ = [];
          if (
            user_data.add_shorts_upload_date === "on" ||
            user_data.shorts_change_author_name === "on"
          ) {
            let dec_path =
              "overlay.reelPlayerOverlayRenderer.reelPlayerHeaderSupportedRenderers.reelPlayerHeaderRenderer.channelTitleText.runs[0].text";
            let name_base_path =
              "json_obj.engagementPanels[1].engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items[0].videoDescriptionHeaderRenderer.channel.";
            let time_tag_path;
            let name_tag_path;
            if (mobile_web) {
              user_data.add_shorts_upload_date === "on" &&
                (time_tag_path = "....timestampText.runs[0].text");
              user_data.shorts_change_author_name === "on" &&
                (name_tag_path = name_base_path + "runs[0].text");
            } else {
              user_data.add_shorts_upload_date === "on" &&
                (time_tag_path = "....timestampText.simpleText");
              user_data.shorts_change_author_name === "on" &&
                (name_tag_path = name_base_path + "simpleText");
            }
            let rule = `abs:${dec_path}={absObj(${
              name_tag_path ? name_tag_path : "json_obj." + dec_path
            })\}${time_tag_path ? "\n{pathObj(" + time_tag_path + ")}" : ""}`;
            tmp_ytInitialData_rule__.push(rule);
          }

          if (user_data.short_buy_super_thanks === "off") {
            !mobile_web &&
              tmp_ytInitialData_rule__.push(
                "abs:overlay.reelPlayerOverlayRenderer.suggestedAction=- $exist"
              );
          }
          tmp_ytInitialReelWatchSequenceResponse_rule = [
            "abs:entries[*]=- /.command.reelWatchEndpoint.adClientParams$exist",
          ];
          tmp_ytInitialData_rule__.length &&
            (tmp_ytInitialData_rule = tmp_ytInitialData_rule__);
          return_obj.ytInitialReelWatchSequenceResponse_rule =
            tmp_ytInitialReelWatchSequenceResponse_rule;
          return_obj.ytInitialData_rule = tmp_ytInitialData_rule;
          return return_obj;
        }

        if (page_type_.includes("yt_watch")) {
          return function (json_obj) {
            if (json_obj.continuation) return [];
            let video_item_base_path;
            let video_sub_path;
            let section_sub_path;
            let player_bottom_path;
            let player_bottom_section_path;
            type = type || "init";
            if (type === "next") {
              if (
                json_obj.onResponseReceivedEndpoints?.[0]
                  ?.appendContinuationItemsAction?.continuationItems?.length
              ) {
                let target_id =
                  json_obj.onResponseReceivedEndpoints[0]
                    .appendContinuationItemsAction.targetId;
                if (target_id.startsWith("comment-replies")) return [];
                video_item_base_path =
                  "abs:onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems[*]";
                video_sub_path = "/.videoWithContextRenderer";
                section_sub_path = "/.reelShelfRenderer";
              }
            } else if (type === "init") {
              if (mobile_web) {
                if (
                  json_obj.contents?.singleColumnWatchNextResults?.results
                    ?.results?.contents?.length
                ) {
                  let length =
                    json_obj.contents.singleColumnWatchNextResults.results
                      .results.contents.length;
                  video_item_base_path = `abs:contents.singleColumnWatchNextResults.results.results.contents[${
                    length - 1
                  }].itemSectionRenderer.contents[*]`;
                  length > 1 &&
                    (player_bottom_path = `abs:contents.singleColumnWatchNextResults.results.results.contents[0-${
                      length - 2
                    }]`);
                  cur_watch_channle_id =
                    json_obj.contents.singleColumnWatchNextResults.results
                      .results.contents?.[1]?.slimVideoMetadataSectionRenderer
                      ?.contents?.[1]?.slimOwnerRenderer?.title.runs[0]
                      .navigationEndpoint.browseEndpoint.browseId;
                  player_bottom_section_path =
                    "/.itemSectionRenderer.contents[0].reelShelfRenderer";
                  video_sub_path = "/.videoWithContextRenderer";
                  section_sub_path = "/.reelShelfRenderer";
                }
              } else {
                let is_next_target_id;
                if (
                  json_obj.contents?.twoColumnWatchNextResults?.secondaryResults
                    ?.secondaryResults?.results?.[1]?.itemSectionRenderer
                    ?.contents?.length
                ) {
                  video_item_base_path =
                    "abs:contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[1].itemSectionRenderer.contents[*]";
                  player_bottom_path =
                    "abs:contents.twoColumnWatchNextResults.results.results.contents[*]";
                  is_next_target_id =
                    json_obj.contents.twoColumnWatchNextResults.secondaryResults
                      .secondaryResults.results[1].itemSectionRenderer
                      .targetId === "watch-next-feed";
                  cur_watch_channle_id =
                    json_obj.contents.twoColumnWatchNextResults.results.results
                      .contents?.[1]?.videoSecondaryInfoRenderer?.owner
                      ?.videoOwnerRenderer?.title.runs[0].navigationEndpoint
                      .browseEndpoint.browseId;
                  player_bottom_section_path =
                    "/.itemSectionRenderer.contents[0]";
                  video_sub_path = "/.compactVideoRenderer";
                  section_sub_path = "/.reelShelfRenderer";
                }
                if (
                  !is_next_target_id &&
                  json_obj.contents?.twoColumnWatchNextResults?.secondaryResults
                    ?.secondaryResults?.results?.[0]?.richGridRenderer?.contents
                    ?.length
                ) {
                  video_item_base_path =
                    "abs:contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[0].richGridRenderer.contents[*]";
                  player_bottom_path =
                    "abs:contents.twoColumnWatchNextResults.results.results.contents[*]";
                  is_next_target_id =
                    json_obj.contents.twoColumnWatchNextResults.secondaryResults
                      .secondaryResults.results[0].richGridRenderer.targetId ===
                    "watch-next-feed";
                  cur_watch_channle_id =
                    json_obj.contents.twoColumnWatchNextResults.results.results
                      .contents?.[1]?.videoSecondaryInfoRenderer?.owner
                      ?.videoOwnerRenderer?.title.runs[0].navigationEndpoint
                      .browseEndpoint.browseId;
                  player_bottom_section_path =
                    "/.itemSectionRenderer.contents[0]";
                  video_sub_path = "/.richItemRenderer.content.videoRenderer";
                  section_sub_path =
                    "/.richSectionRenderer.content.richShelfRenderer";
                }
                if (
                  !is_next_target_id &&
                  json_obj.contents?.twoColumnWatchNextResults?.secondaryResults
                    ?.secondaryResults?.results?.length
                ) {
                  video_item_base_path =
                    "abs:contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[*]";
                  player_bottom_path =
                    "abs:contents.twoColumnWatchNextResults.results.results.contents[*]";
                  cur_watch_channle_id =
                    json_obj.contents.twoColumnWatchNextResults.results.results
                      .contents?.[1]?.videoSecondaryInfoRenderer?.owner
                      ?.videoOwnerRenderer?.title.runs[0].navigationEndpoint
                      .browseEndpoint.browseId;
                  player_bottom_section_path =
                    "/.itemSectionRenderer.contents[0]";
                  video_sub_path = "/.compactVideoRenderer";
                  section_sub_path = "/.reelShelfRenderer";
                }
              }
            }
            if (!video_item_base_path) return [];

            const rules = [];
            let video_item_rules = [];
            let section_item_rules = [];
            let player_bottom_rules = [];

            mobile_web &&
              type === "init" &&
              player_bottom_rules.push(
                `${player_bottom_section_path.replace(
                  /\.[^\.]+$/,
                  ""
                )}.adSlotRenderer$exist`
              );
            video_item_rules.push(
              `${video_sub_path.replace(/\.[^\.]+$/, ".adSlotRenderer$exist")}`
            );

            !mobile_web &&
              type === "init" &&
              player_bottom_rules.push(`/.merchandiseShelfRenderer$exist`);

            if (
              user_data.open_recommend_movie === "off" &&
              cur_watch_channle_id !== "UClgRkhTL3_hImCAmdLfDE4g"
            ) {
              if (mobile_web) {
                video_item_rules.push(
                  `${video_sub_path}.badges[0].metadataBadgeRenderer.style=BADGE_STYLE_TYPE_YPC`
                );
              } else {
                video_item_rules.push(
                  `${video_sub_path.replace(
                    /\.[^\.]+$/,
                    ".compactMovieRenderer"
                  )}$exist`
                );
              }
            }

            if (
              ["off", "subscribed"].includes(user_data.open_recommend_liveroom)
            ) {
              if (mobile_web)
                video_item_rules.push(
                  `${video_sub_path}.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer.style=LIVE|UPCOMING`
                );
              else
                video_item_rules.push(
                  `${video_sub_path}.badges[0].metadataBadgeRenderer.style=BADGE_STYLE_TYPE_LIVE_NOW`
                );
            }

            if (
              user_data.open_recommend_shorts === "subscribed" &&
              type === "init" &&
              page_type !== "mobile_yt_watch"
            ) {
              rules.push(
                `${video_item_base_path.replace(
                  "[*]",
                  ""
                )}=+(arr_insert,method(shorts_fun.get_shorts_section()),0) @user_data.shorts_list.length$value>0`
              );
            }

            if (
              ["off", "subscribed"].includes(user_data.open_recommend_shorts)
            ) {
              section_item_rules.push(
                `${section_sub_path}.icon.iconType=YOUTUBE_SHORTS_BRAND_24`
              );
              mobile_web &&
                type === "init" &&
                player_bottom_rules.push(
                  `${player_bottom_section_path}.icon.iconType=YOUTUBE_SHORTS_BRAND_24`
                );
            }

            player_bottom_rules.length &&
              rules.push(
                `${player_bottom_path}=- ${player_bottom_rules.join(
                  data_process.condition_split_or_tag
                )}`
              );
            section_item_rules.length &&
              video_item_rules.push(...section_item_rules);
            video_item_rules.length &&
              rules.push(
                `${video_item_base_path}=- ${video_item_rules.join(
                  data_process.condition_split_or_tag
                )}`
              );
            return rules;
          };
        }

        if (page_type_.includes("yt_home")) {
          let item_path;
          let item_rules = [];
          let rules = [];
          type = type || "init";
          if (type === "browse") {
            item_path =
              "abs:onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems[*]";
          } else if (type === "init") {
            item_path = `abs:contents.${
              mobile_web
                ? "singleColumnBrowseResultsRenderer"
                : "twoColumnBrowseResultsRenderer"
            }.tabs[0].tabRenderer.content.richGridRenderer.contents[*]`;
          } else {
            return {};
          }
          const video_path = `/.richItemRenderer.content.${
            mobile_web ? "videoWithContextRenderer" : "videoRenderer"
          }`;
          const section_path = `/.richSectionRenderer.content.${
            mobile_web ? "reelShelfRenderer" : "richShelfRenderer"
          }`;

          item_rules.push("/.richItemRenderer.content.adSlotRenderer$exist");

          !mobile_web &&
            type === "init" &&
            rules.push(
              "abs:contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.masthead=- $exist"
            );

          if (["off", "subscribed"].includes(user_data.open_recommend_shorts)) {
            item_rules.push(
              `${section_path}.icon.iconType=YOUTUBE_SHORTS_BRAND_24`
            );
          }

          if (user_data.open_recommend_popular === "off") {
            item_rules.push(
              `${section_path}.endpoint.browseEndpoint.browseId=FEtrending`
            );
          }

          if (user_data.open_recommend_playables === "off") {
            item_rules.push(
              "/.richSectionRenderer.content.richShelfRenderer.endpoint.browseEndpoint.browseId=FEmini_app_destination"
            );
          }

          if (
            user_data.open_recommend_shorts === "subscribed" &&
            type === "init"
          ) {
            rules.push(
              item_path.replace("[*]", "") +
                "=+(arr_insert,method(shorts_fun.get_shorts_section()),0) @user_data.shorts_list.length$value>0"
            );
          }

          if (
            ["off", "subscribed"].includes(user_data.open_recommend_liveroom)
          ) {
            !mobile_web &&
              item_rules.push(
                `${video_path}.badges[0].metadataBadgeRenderer.style=BADGE_STYLE_TYPE_LIVE_NOW`
              );
            const tag_express = `UPCOMING${
              mobile_web ? data_process.value_split_or_tag + "LIVE" : ""
            }`;
            item_rules.push(
              `${video_path}.thumbnailOverlays[-1].thumbnailOverlayTimeStatusRenderer.style=${tag_express}`
            );
          }

          if (user_data.open_recommend_movie === "off") {
            item_rules.push(
              `${section_path}.endpoint.browseEndpoint.browseId=FEstorefront|UClgRkhTL3_hImCAmdLfDE4g`
            );
            item_rules.push(
              `${video_path}.badges[0].metadataBadgeRenderer.style=BADGE_STYLE_TYPE_YPC`
            );
          }

          item_rules.push(
            "/.richSectionRenderer.content.statementBannerRenderer$exist"
          );

          rules.push("abs:survey=- $exist");

          item_rules.push(
            section_path.replace(/\.[^\.]+$/, ".inlineSurveyRenderer$exist")
          );

          item_rules.push(
            section_path.replace(/\.[^\.]+$/, ".primetimePromoRenderer$exist")
          );

          const add_movie_channel_rule =
            "loadingStrategy.inlineContent.moreDrawerViewModel.content=+sobj(" +
            (mobile_web ? "mobile_" : "") +
            "movie_channel_info) !~=" +
            flag_info.movie_channel;
          rules.push(add_movie_channel_rule);

          rules.push(
            `${item_path}=- ${item_rules.join(
              data_process.condition_split_or_tag
            )}`
          );
          return_obj.ytInitialData_rule = rules;
          return return_obj;
        }
        return return_obj;
      },
    };
  }

  function set_search_listen() {
    let count = 0;
    const interval_id = setInterval(() => {
      if (
        ![
          "yt_watch",
          "yt_home",
          "mobile_yt_home_searching",
          "mobile_yt_watch_searching",
          "yt_shorts",
        ].includes(page_type)
      ) {
        clearInterval(interval_id);
        return;
      }
      count++;
      const search_selector = href.includes("https://m.youtube.com/")
        ? "input.searchbox-input.title"
        : "input.yt-searchbox-input";
      const search_input_node = $(search_selector);
      if (search_input_node) {
        clearInterval(interval_id);
        if (search_input_node.set_listener) return;

        search_input_node.set_listener = true;
        const oninput = function (event) {
          if (
            [
              display_error_keyword,
              open_config_keyword,
              reset_config_keyword,
              "2666",
            ].includes(this.value)
          ) {
            setTimeout(() => {
              if (search_input_node.value === open_config_keyword) {
                search_input_node.value = "";
                display_config_win();
              }
              if (search_input_node.value === reset_config_keyword) {
                user_data_api.reset();
                return;
              }
              if (search_input_node.value === display_error_keyword) {
                search_input_node.value = "";
                let tips = `script ${flag_info.init} ${
                  isinint ? flag_info.success : flag_info.failed
                }`;
                if (error_messages.length === 0 && isinint)
                  tips += " " + flag_info.runing_normally;
                for (let key of Object.keys(inject_info)) {
                  if (!mobile_web && key === "ytInitialPlayerResponse")
                    continue;
                  if (
                    key === "ytInitialReelWatchSequenceResponse" &&
                    !["yt_shorts", "mobile_yt_shorts"].includes(page_type)
                  )
                    continue;
                  tips += `\n${key} ${flag_info.inject} ${
                    inject_info[key] ? flag_info.success : flag_info.failed
                  }`;
                }

                const tmp_user_data = JSON.parse(JSON.stringify(user_data));
                delete tmp_user_data.shorts_list;
                delete tmp_user_data.channel_infos;
                tips += `\n\n${flag_info.config_info}\n${JSON.stringify(
                  tmp_user_data,
                  null,
                  2
                )}\n\n${
                  flag_info.page_info
                }\npage_type: ${page_type}\nhref: ${href}`;
                tips += `\n\nbrowser_info\n${JSON.stringify(
                  browser_info,
                  null,
                  2
                )}`;
                const str_channel_id = "" + channel_id;
                tips += `\n\naccount_info\nchannel_id: ${
                  str_channel_id === "default" || str_channel_id.length <= 10
                    ? str_channel_id
                    : str_channel_id.slice(0, 5) +
                      "..." +
                      str_channel_id.slice(-5)
                }`;
                tips += `\nreal_language：${real_language}`;
                if (error_messages.length !== 0) {
                  tips += `\n\n${flag_info.exists_error}\n-----------${
                    flag_info.err_msg
                  }(${flag_info.ctoc})-----------------\n${error_messages.join(
                    "\n"
                  )}\n\n${flag_info.tips}`;
                }
                display_error_win(tips);
              }
              if (search_input_node.value === "2666") {
                search_input_node.value = "";
                display_hide_buttons_win();
              }
            }, 500);
          }
        };
        search_input_node.addEventListener("input", oninput);
      } else if (count > 50) {
        clearInterval(interval_id);
        log("Search box not found", -1);
      }
    }, 200);
  }

  function hide_create_button() {
    const labels = [
      "Create",
      "Create ",
      "Create a Short",
      "Create video",
      "Create post",
    ];

    const selectorParts = labels.map(
      (l) => `ytd-button-renderer.ytd-masthead button[aria-label="${l}"]`
    );
    const selector = selectorParts.join(",");

    $$(selector).forEach((btn) => {
      const renderer = btn.closest("ytd-button-renderer.ytd-masthead") || btn;
      renderer.style.display = "none";
    });
  }

  function hide_explore_more_topics_section() {
    const sections = $$("#contents ytd-rich-section-renderer");
    if (!sections.length) return;

    for (const section of sections) {
      let titleSpan =
        section.querySelector(
          "yt-shelf-header-layout h2.yt-shelf-header-layout__title span.yt-core-attributed-string"
        ) ||
        section.querySelector(
          ".yt-shelf-header-layout__title span.yt-core-attributed-string"
        ) ||
        section.querySelector("h2 span.yt-core-attributed-string");

      const text = titleSpan?.textContent?.trim();
      if (!text) continue;

      const isExploreMoreTopics =
        text === "Explore more topics" ||
        text.toLowerCase().includes("explore more");

      if (isExploreMoreTopics) {
        section.style.display = "none";
        log('Hidden "Explore more topics" section', 0);
      }
    }
  }

  function hide_shorts_sections_if_disabled() {
    const shortsHidden =
      user_data.global_shorts_block === "on" ||
      user_data.open_recommend_shorts === "off";

    if (!shortsHidden) return;

    $$("#contents ytd-rich-section-renderer").forEach((section) => {
      const titleSpan = section.querySelector(
        ".yt-shelf-header-layout__title-row .yt-shelf-header-layout__title .yt-core-attributed-string"
      );
      const text = titleSpan?.textContent?.trim();
      if (!text) return;

      if (text === "Shorts") {
        section.style.display = "none";
        log('Hidden "Shorts" rich section', 0);
      }
    });

    // Fallback for generic rich section headers
    $$(
      "#contents .yt-shelf-header-layout__title .yt-core-attributed-string"
    ).forEach((span) => {
      const txt = span.textContent.trim();
      if (txt === "Shorts") {
        const richSection = span.closest("ytd-rich-section-renderer");
        if (richSection) {
          richSection.style.display = "none";
          log('Hidden generic "Shorts" rich section', 0);
        }
      }
    });

    // Mobile / grid-shelf based "Shorts" shelves (your grid-shelf-view-model example)
    $$("grid-shelf-view-model").forEach((shelf) => {
      const titleSpan = shelf.querySelector(
        ".yt-shelf-header-layout__title .yt-core-attributed-string"
      );
      const txt = titleSpan?.textContent?.trim();
      if (txt === "Shorts") {
        shelf.style.display = "none";
        log('Hidden grid-shelf "Shorts" section', 0);
      }
    });
  }

  // Live chat replay teaser carousel
  function hide_teaser_carousel(node) {
    if (user_data.watch_page_config?.hide_live_chat_replay !== "on") return;
    if (!node) node = $("#teaser-carousel");
    if (!node) return;
    node.style.display = "none";
    log("Hidden Live chat replay teaser (#teaser-carousel)", 0);
  }

  function simulate_swipeup(target, start, end) {
    function createAndDispatchTouchEvent(type, target, clientY) {
      const touches =
        (type !== "touchend" && [
          new Touch({
            identifier: 0,
            target: target,
            clientY: clientY,
          }),
        ]) ||
        [];
      let touchEvent = new TouchEvent(type, {
        touches: touches,
        bubbles: true,
        cancelable: true,
      });
      target.dispatchEvent(touchEvent);
    }
    createAndDispatchTouchEvent("touchstart", target, start);
    createAndDispatchTouchEvent("touchmove", target, end);
    createAndDispatchTouchEvent("touchend", target);
  }

  function getCookie(cookieName) {
    const name = cookieName + "=";
    let decodedCookie;
    try {
      decodedCookie = decodeURIComponent(document.cookie);
    } catch (error) {
      log("cookie decode error", error, -1);
      return null;
    }
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();

      if (cookie.startsWith(name)) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  function copyToClipboard(text) {
    GM_setClipboard(text, "text");
  }

  function check_native(name, fun) {
    const fun_str = fun.toString();
    if (browser_info.name !== "Firefox") {
      return `function ${name}() { [native code] }` === fun_str;
    } else {
      return `function ${name}() {\n    [native code]\n}` === fun_str;
    }
  }

  function set_history_hook(window_obj) {
    const wrap = function (type) {
      const origin = window_obj.history[type];
      return function () {
        let rv;
        try {
          rv = origin.apply(this, arguments);
        } catch (error) {
          log("history hook error", error, 0);
          return;
        }
        let url = arguments[2] || location.href;
        url.startsWith("/") && (url = location.origin + url);
        !url.startsWith("http") && (url = location.origin + "/" + url);
        url_change(url);
        return rv;
      };
    };
    window_obj.history.pushState = wrap("pushState");
    window_obj.history.replaceState = wrap("replaceState");
  }

  function url_observer() {
    set_history_hook(unsafeWindow);
    unsafeWindow.addEventListener("popstate", function (event) {
      url_change(event);
    });
    unsafeWindow.addEventListener("hashchange", function (event) {
      url_change(event);
    });
  }

  function url_change(event = null) {
    let destination_url;
    if (typeof event === "object")
      destination_url = event?.destination?.url || "";
    else destination_url = event;

    if (destination_url?.startsWith?.("about:blank")) return;
    if (destination_url === href) return;
    href = destination_url || location.href;
    log("Page URL changed href -> " + href, 0);
    const tmp_page_type = get_page_type();
    if (tmp_page_type !== page_type) {
      page_type = tmp_page_type;
      config_api.config_init();
      set_search_listen();
    }
    on_page_change();
  }

  function get_page_type(url = href) {
    if (!url) return "other";
    url.startsWith("/") && (url = location.origin + url);
    const base_url = url.split("?")[0];
    let tmp_page_type;
    if (base_url.match("https://www.youtube.com/?$")) tmp_page_type = "yt_home";
    else if (base_url.match("https://m.youtube.com/?#?$"))
      tmp_page_type = "mobile_yt_home";
    else if (base_url.match("https://www.youtube.com/watch$"))
      tmp_page_type = "yt_watch";
    else if (base_url.match("https://m.youtube.com/watch$"))
      tmp_page_type = "mobile_yt_watch";
    else if (base_url.match("https://www.youtube.com/results$"))
      tmp_page_type = "yt_search";
    else if (base_url.match("https://m.youtube.com/results$"))
      tmp_page_type = "mobile_yt_search";
    else if (base_url.startsWith("https://www.youtube.com/shorts"))
      tmp_page_type = "yt_shorts";
    else if (base_url.startsWith("https://m.youtube.com/shorts"))
      tmp_page_type = "mobile_yt_shorts";
    else if (base_url.match("https://www.youtubekids.com/watch$"))
      tmp_page_type = "yt_kids_watch";
    else if (base_url.match("https://music.youtube.com/?$"))
      tmp_page_type = "yt_music_home";
    else if (base_url.match("https://music.youtube.com/watch$"))
      tmp_page_type = "yt_music_watch";
    else if (base_url.match("https://m.youtube.com/#searching$"))
      tmp_page_type = "mobile_yt_home_searching";
    else if (base_url.startsWith("https://www.youtube.com/playlist"))
      tmp_page_type = "yt_watch_playlist";
    else if (base_url.includes("channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ"))
      tmp_page_type = "yt_music_channel";
    else tmp_page_type = "other";
    if (tmp_page_type === "mobile_yt_watch" && href.endsWith("#searching"))
      tmp_page_type = "mobile_yt_watch_searching";
    return tmp_page_type;
  }

  function set_debugger() {
    while (!debugger_fun_name) {
      let tmp = crypto
        .randomUUID()
        .substring(0, Math.floor(Math.random() * 4) + 3)
        .replace(/-/g, "");
      tmp = tmp.match("[a-z].+")?.[0];
      if (tmp && !unsafeWindow[tmp]) {
        debugger_fun_name = tmp;
      }
    }
    log(`debugger_fun_name： ${debugger_fun_name}`, 0);
    const debugger_config_info = {
      ytInitialPlayerResponse: debugger_ytInitialPlayerResponse,
      ytInitialData: debugger_ytInitialData,
      ytInitialReelWatchSequenceResponse:
        debugger_ytInitialReelWatchSequenceResponse,
      music_initialData: debugger_music_initialData,
      inject_info: inject_info,
      info: [
        "ytInitialData_rule",
        "ytInitialPlayerResponse_rule",
        "is_account_init",
        "user_data",
        "mobile_web",
        "page_type",
        "tmp_debugger_value",
      ],
    };
    unsafeWindow[debugger_fun_name] = function (action = null) {
      const keys = Object.keys(debugger_config_info);
      if (!action && action !== 0) {
        debugger;
        return;
      }
      if (action === "ytInitialPlayerResponse")
        log("ytInitialPlayerResponse", debugger_ytInitialPlayerResponse, 0);
      if (action === "ytInitialData")
        log("ytInitialData", debugger_ytInitialData, 0);
      if (action === "inject_info") log("inject_info", inject_info, 0);
      if (action === "info") {
        if (limit_eval) {
          log("eval is restricted", 0);
        } else {
          for (let key of debugger_config_info["info"]) {
            log(key, eval(trustedScript(key)), 0);
          }
        }
        return;
      }
      if (action === "list") {
        keys.forEach(function (key, index) {
          log(index, key, 0);
        });
      }
      if (typeof action === "number") {
        if (action < keys.length) {
          unsafeWindow[debugger_fun_name](keys[action]);
        } else if (action >= keys.length) {
          keys.forEach(function (key) {
            unsafeWindow[debugger_fun_name](key);
          });
        }
      }
    };
  }

  function log() {
    const arguments_arr = [...arguments];
    const flag = arguments_arr.pop();
    if (flag === -1) {
      error_messages.push(arguments_arr.join(" "));
    }
    if (flag === 999) arguments_arr.unshift("-----test---test-----");
    if (flag !== 0 && flag !== 999) arguments_arr.push(getCodeLocation());
    if (flag === 0 || flag === 999) {
      const array_length = arguments_arr.length;
      const color = flag === 0 ? "orange" : "blue";
      const css_str = `color: ${color};font-size: 20px`;
      for (let i = 0; i < array_length; i++) {
        if (typeof arguments_arr[i] === "string") {
          arguments_arr[i] = "%c" + arguments_arr[i];
          i === array_length - 1
            ? arguments_arr.push(css_str)
            : arguments_arr.splice(i + 1, 0, css_str);
          break;
        }
      }
    }
    if ([-1, 0, 999].includes(flag) || open_debugger)
      flag === -1
        ? origin_console.error(...arguments_arr)
        : origin_console.log(...arguments_arr);
  }

  function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName;
    let browserVersion;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)[1];
    } else if (
      userAgent.indexOf("OPR") > -1 ||
      userAgent.indexOf("Opera") > -1
    ) {
      browserName = "Opera";
      browserVersion = userAgent.match(/(OPR|Opera)\/([0-9.]+)/)[2];
    } else if (userAgent.indexOf("Edg") > -1) {
      browserName = "Edge";
      browserVersion = userAgent.match(/Edg\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)[1];
    } else if (
      userAgent.indexOf("MSIE") > -1 ||
      userAgent.indexOf("rv:") > -1
    ) {
      browserName = "Internet Explorer";
      browserVersion = userAgent.match(/(MSIE |rv:)([0-9.]+)/)[2];
    } else {
      browserName = "Unknown";
      browserVersion = "N/A";
    }

    return {
      name: browserName,
      version: browserVersion,
      isMobile: isMobile,
    };
  }

  function getCodeLocation() {
    if (["Firefox"].includes(browser_info.name)) return "";
    const callstack = new Error().stack.split("\n");
    callstack.shift();
    while (callstack.length && callstack[0].includes("-extension://")) {
      callstack.shift();
    }
    if (!callstack.length) {
      return "";
    }
    return "\n" + callstack[0].trim();
  }

  /* ===== 2444 : Information Window panel ===== */

  function display_error_win(msg) {
    const css = `
#yt-error-popup{
  z-index:999999999;
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  padding:0;
  background-color:#ffffff;
  border:1px solid #3498db;
  border-radius:5px;
  box-shadow:0 0 10px rgba(0,0,0,0.3);
  width:360px;
  max-height:80vh;
  display:flex;
  flex-direction:column;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#yt-error-header{
  cursor:move;
  user-select:none;
  padding:4px 8px;
  background-color:#3498db;
  color:#ffffff;
  border-radius:4px 4px 0 0;
  font-weight:bold;
  font-size:13px;
}

#yt-error-topbar{
  flex:0 0 auto;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;
  padding:6px 8px 4px 8px;
  background-color:#f5f7fb;
  border-bottom:1px solid #e0e4f0;
}

#yt-error-close,#yt-error-copy{
  cursor:pointer;
  background-color:#3498db;
  color:#ffffff;
  border:none;
  padding:4px 12px;
  border-radius:999px;
  font-size:12px;
}

#yt-error-body{
  flex:1 1 auto;
  overflow-y:auto;
  padding:8px 10px 10px 10px;
  white-space:pre-wrap;
  font-size:12px;
  color:#000;
}
`;
    if (!unsafeWindow.document.getElementById("yt-error-style")) {
      const style = unsafeWindow.document.createElement("style");
      style.id = "yt-error-style";
      style.textContent = css;
      unsafeWindow.document.head.appendChild(style);
    }

    const old = unsafeWindow.document.getElementById("yt-error-popup");
    if (old) old.remove();

    const popup = unsafeWindow.document.createElement("div");
    popup.id = "yt-error-popup";

    const header = unsafeWindow.document.createElement("div");
    header.id = "yt-error-header";
    header.textContent = "Information (message)";

    const topbar = unsafeWindow.document.createElement("div");
    topbar.id = "yt-error-topbar";
    const copyBtn = unsafeWindow.document.createElement("button");
    copyBtn.id = "yt-error-copy";
    copyBtn.textContent = "Copy & Close";
    const closeBtn = unsafeWindow.document.createElement("button");
    closeBtn.id = "yt-error-close";
    closeBtn.textContent = "Close";
    topbar.append(copyBtn, closeBtn);

    const body = unsafeWindow.document.createElement("div");
    body.id = "yt-error-body";
    body.textContent = msg;

    popup.append(header, topbar, body);
    unsafeWindow.document.body.appendChild(popup);

    function close() {
      popup.remove();
    }

    closeBtn.addEventListener("click", close);
    copyBtn.addEventListener("click", () => {
      copyToClipboard(msg);
      close();
      alert("Copy Successful !(copy success)");
    });

    make_popup_draggable(popup, header);
  }

  /* =============== MAIN 2333 CONFIG PANEL =============== */

  function display_config_win() {
    const css_str = `
.popup{
  z-index:999999999;
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  padding:0;
  background-color:#ffffff;
  border:1px solid #3498db;
  border-radius:5px;
  box-shadow:0 0 10px rgba(0,0,0,0.3);
  width:260px;
  max-height:80vh;
  display:flex;
  flex-direction:column;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.popup-header{
  cursor:move;
  user-select:none;
  padding:4px 8px;
  background-color:#3498db;
  color:#ffffff;
  border-radius:4px 4px 0 0;
  font-weight:bold;
  font-size:13px;
  text-align:left;
}

.popup-topbar{
  flex:0 0 auto;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:6px 8px 4px 8px;
  background-color:#f5f7fb;
  border-bottom:1px solid #e0e4f0;
}

.popup-close-button{
  cursor:pointer;
  background-color:#3498db;
  color:#ffffff;
  border:none;
  padding:4px 12px;
  border-radius:999px;
  font-size:12px;
}

.popup-body{
  flex:1 1 auto;
  overflow-y:auto;
  padding:6px 8px 8px 8px;
}

.btn{
  cursor:pointer;
  background-color:#3498db;
  color:#ffffff;
  border:none;
  padding:5px 10px;
  margin:0 auto;
  border-radius:5px;
  display:block;
  margin-top:10px;
}

.recommend-title{
  user-select:none;
  font-weight:bold;
  font-size:13px;
  background-color:#f3f6fb;
  color:#333333;
  border:none;
  padding:5px 8px;
  border-radius:4px;
  width:auto;
  text-align:start;
  margin-bottom:4px;
}

.select-group{
  cursor:pointer;
  padding:4px 0 6px 0;
  list-style-type:none;
  margin:0;
  padding-left:0;
  user-select:none;
}

.item-group{
  list-style-type:none;
  margin:0;
  padding-left:0;
}

.popup h1{
  margin:4px 0;
}

label{
  font-size:13px;
}
`;
    const style = unsafeWindow.document.createElement("style");
    style.textContent = css_str;
    $("body").appendChild(style);

    let win_config;
    const home_watch_config = {
      recommend_btn: [
        {
          id: "open_recommend_shorts",
          title: "btn_recommend_shorts",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
            {
              tag: "btn_lable_subscribed",
              value: "subscribed",
              tips: "recommend_subscribed_lable_tips",
              condition: {
                login_status: true,
              },
            },
          ],
        },
        {
          id: "open_recommend_liveroom",
          title: "btn_recommend_liveroom",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
            {
              tag: "btn_lable_subscribed",
              value: "subscribed",
              tips: "recommend_subscribed_lable_tips",
              condition: {
                login_status: true,
              },
            },
          ],
        },
        {
          id: "open_recommend_movie",
          title: "btn_recommend_movie",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "open_recommend_popular",
          title: "btn_recommend_popular",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "open_recommend_playables",
          title: "btn_recommend_game",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
      ],
    };
    const shorts_config = {
      recommend_btn: [
        {
          id: "add_shorts_upload_date",
          title: "title_add_shorts_upload_date",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "shorts_change_author_name",
          title: "title_shorts_change_author_name",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "short_buy_super_thanks",
          title: "short_buy_super_thanks",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "shorts_disable_loop_play",
          title: "bt_shorts_disable_loop_play_title",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "shorts_auto_scroll",
          title: "btn_shorts_auto_scroll_title",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "shorts_add_video_progress",
          title: "btn_shorts_add_video_progress_title",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "shorts_dbclick_like",
          title: "btn_shorts_dbclick_like_title",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
      ],
    };

    const common_config = {
      recommend_btn: [
        {
          id: "sponsorblock",
          title: "btn_sponsorblock_title",
          tips: "btn_sponsorblock_tips",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
        {
          id: "global_shorts_block",
          title: "Block all Shorts",
          items: [
            {
              tag: "btn_lable_open",
              value: "on",
            },
            {
              tag: "btn_lable_close",
              value: "off",
            },
          ],
        },
      ],
    };

    if (
      ["mobile_yt_home_searching", "mobile_yt_watch_searching"].includes(
        page_type
      )
    ) {
      home_watch_config.recommend_btn.push({
        split_line: true,
        title: "shorts_recommend_split_tag",
      });
      home_watch_config.recommend_btn.push(...shorts_config.recommend_btn);
    }
    [
      "yt_home",
      "yt_watch",
      "mobile_yt_watch_searching",
      "mobile_yt_home_searching",
    ].includes(page_type) && (win_config = home_watch_config);
    ["yt_shorts"].includes(page_type) && (win_config = shorts_config);
    win_config && win_config.recommend_btn.push(...common_config.recommend_btn);
    if (!win_config) return;
    const popup_node = unsafeWindow.document.getElementById("xxx_popup");
    if (popup_node) {
      popup_node.remove_popup_listener("rm");
    }

    const popup = unsafeWindow.document.createElement("div");
    popup.id = "xxx_popup";
    popup.className = "popup";

    const header = unsafeWindow.document.createElement("div");
    header.className = "popup-header";
    header.textContent = flag_info.config_info || "Script Settings";

    const topbar = unsafeWindow.document.createElement("div");
    topbar.className = "popup-topbar";
    const closeButton = unsafeWindow.document.createElement("button");
    closeButton.className = "popup-close-button";
    closeButton.textContent = "Close";
    topbar.appendChild(closeButton);

    const body = unsafeWindow.document.createElement("div");
    body.className = "popup-body";

    const item_groups = [];
    const item_group = unsafeWindow.document.createElement("ul");
    item_group.className = "item-group";
    win_config.recommend_btn.forEach((recommend_item_info) => {
      if (recommend_item_info.split_line) {
        let p = unsafeWindow.document.createElement("h1");
        p.style.fontSize = "large";
        p.style.textAlign = "center";
        p.style.color = "red";
        p.style.padding = "20px 20px";
        p.style.fontWeight = "bold";
        p.innerText =
          flag_info[recommend_item_info.title] || recommend_item_info.title;
        item_groups.push(p);
        return;
      }
      const recommend_id = recommend_item_info.id;
      const recommend_title =
        flag_info[recommend_item_info.title] || recommend_item_info.title;
      const recommend_tips =
        recommend_item_info.tips && flag_info[recommend_item_info.tips];
      const select_item_infos = recommend_item_info.items || [];
      const select_items = [];
      const item = unsafeWindow.document.createElement("li");
      const select_group = unsafeWindow.document.createElement("ul");
      select_group.className = "select-group";
      select_group.id = recommend_id;
      select_item_infos.forEach((select_item_info) => {
        const tag = flag_info[select_item_info.tag] || select_item_info.tag;
        const value = select_item_info.value;
        const tips = select_item_info.tips && flag_info[select_item_info.tips];
        const condition = select_item_info.condition;
        const select_item = unsafeWindow.document.createElement("li");
        const input = unsafeWindow.document.createElement("input");
        input.type = "radio";
        input.name = recommend_id + "_option";
        input.id = recommend_id + "_" + value;
        input.value = value;
        if (condition && condition.login_status) {
          if (condition.login_status !== user_data.login) {
            input.disabled = true;
          }
        }
        if (user_data[recommend_id] === value) {
          input.checked = true;
        }
        input.addEventListener("click", () => {
          handle_recommend_radio(input);
        });
        const label = unsafeWindow.document.createElement("label");
        label.htmlFor = input.id;
        label.innerText = tag;
        tips && (label.title = tips);
        select_item.append(input, label);
        select_items.push(select_item);
      });
      const recommend_title_div = unsafeWindow.document.createElement("div");
      recommend_title_div.className = "recommend-title";
      recommend_title_div.innerText = recommend_title;
      recommend_tips && (recommend_title_div.title = recommend_tips);
      select_group.append(...select_items);
      item.append(recommend_title_div, select_group);
      item_groups.push(item);
    });
    item_group.append(...item_groups);

    body.appendChild(item_group);
    popup.append(header, topbar, body);
    unsafeWindow.document.body.append(popup);

    function remove_popup_hander(event) {
      if (
        (event && event.target && !popup.contains(event.target)) ||
        (event && event.target === closeButton) ||
        event === "rm"
      ) {
        popup.remove();
        unsafeWindow.document.removeEventListener("click", remove_popup_hander);
        if (
          ["mobile_yt_watch_searching", "mobile_yt_home_searching"].includes(
            page_type
          )
        ) {
          history.back();
        }
      }
    }

    popup.remove_popup_listener = remove_popup_hander;
    unsafeWindow.document.addEventListener("click", remove_popup_hander);
    closeButton.addEventListener("click", remove_popup_hander);

    make_popup_draggable(popup, header);

    return;
  }

  function make_popup_draggable(popup, handle) {
    let isDown = false;
    let offsetX = 0;
    let offsetY = 0;

    handle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isDown = true;

      const rect = popup.getBoundingClientRect();
      popup.style.transform = "none";
      popup.style.top = rect.top + "px";
      popup.style.left = rect.left + "px";

      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      e.preventDefault();
    });

    unsafeWindow.document.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      popup.style.left = x + "px";
      popup.style.top = y + "px";
    });

    unsafeWindow.document.addEventListener("mouseup", () => {
      isDown = false;
    });
  }

  function handle_recommend_radio(input_obj) {
    user_data[input_obj.parentNode.parentNode.id] = input_obj.value;
    user_data_api.set();
    config_api.config_init(user_data.language);
  }

  function display_update_win() {
    function btn_click() {
      const btn = this;
      if (btn.id === "go_btn") {
        location.href = script_url;
      }
      container.remove();
    }
    const css_str =
      "#update_tips_win { z-index:9999999999; display: flex; position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 10px; } .btn { margin: 0 10px; display: inline-block; padding: 5px 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; } .btn:hover { background-color: #2980b9; }";
    const style = unsafeWindow.document.createElement("style");
    style.innerText = css_str;
    $("body").appendChild(style);
    const container = unsafeWindow.document.createElement("div");
    container.id = "update_tips_win";
    const span = unsafeWindow.document.createElement("span");
    span.textContent = GM_info.script.name + " has an update!";
    container.appendChild(span);
    const go_btn = unsafeWindow.document.createElement("button");
    go_btn.textContent = "GO";
    go_btn.id = "go_btn";
    go_btn.className = "btn";
    go_btn.onclick = btn_click;
    container.appendChild(go_btn);
    const no_btn = unsafeWindow.document.createElement("button");
    no_btn.textContent = "NO";
    no_btn.className = "btn";
    no_btn.id = "no_btn";
    no_btn.onclick = btn_click;
    container.appendChild(no_btn);
    $("body").appendChild(container);
  }

  function check_update() {
    const script_handler = GM_info.scriptHandler;
    if (["Via"].includes(script_handler)) return;
    const last_check_time = GM_getValue("last_check_time", 0);
    if (Date.now() - last_check_time < 1000 * 60 * 60 * 24) return;
    GM_xmlhttpRequest({
      method: "GET",
      url: script_url,
      onload: function (response) {
        const onlineScript = response.responseText;
        const onlineMeta = onlineScript.match(/@version\s+([^\s]+)/i);
        const onlineVersion = onlineMeta ? onlineMeta[1] : "";
        if (onlineVersion > GM_info.script.version) {
          display_update_win();
        }
      },
    });
    GM_setValue("last_check_time", Date.now());
  }

  function obj_process_filter(path_info, json_obj) {
    if (
      !["yt_home", "yt_watch", "mobile_yt_home", "mobile_yt_watch"].includes(
        page_type
      )
    )
      return false;
    if (!user_data.login || user_data.channel_infos.ids.length === 0)
      return false;

    if (
      user_data.open_recommend_shorts === "subscribed" &&
      path_info.condition_value === "YOUTUBE_SHORTS_BRAND_24"
    ) {
      if (path_info.express.includes("YOUTUBE_SHORTS_BRAND_24")) {
        let video_list_path;
        video_list_path =
          path_info.conform_value_path.split('["icon"]')[0] +
          (page_type === "yt_home" ? '["contents"]' : '["items"]');
        const video_list =
          data_process.string_to_value(json_obj, video_list_path) || [];
        shorts_fun.node_parse(video_list);
      }
    }

    if (
      user_data.open_recommend_liveroom === "subscribed" &&
      ["UPCOMING", "LIVE", "BADGE_STYLE_TYPE_LIVE_NOW"].includes(
        path_info.condition_value
      )
    ) {
      if (path_info.express.includes("UPCOMING")) {
        try {
          const match = JSON.stringify(
            data_process.string_to_value(json_obj, path_info.deal_path)
          ).match(/"browseId"\:"(.*?)"/);
          let id;
          if (match && match.length > 1) id = match[1];
          if (!id) {
            log("Failed to get id\n" + JSON.stringify(path_info), -1);
          }
          if (user_data.channel_infos.ids.includes(id)) {
            const index = user_data.channel_infos.ids.indexOf(id);
            const name = user_data.channel_infos.names[index];
            log(
              "Do not filter " +
                name +
                (path_info.condition_value === "UPCOMING"
                  ? " upcoming Live"
                  : " ongoing Live"),
              "shorts"
            );
            return true;
          }
          let msg = `Filtering ${id} ${
            path_info.condition_value === "UPCOMING"
              ? " upcoming Live"
              : " ongoing Live"
          }`;
          log(msg, "shorts");
        } catch (error) {
          log(error, -1);
        }
      }
    }
    return false;
  }

  function get_shorts_fun() {
    class ShortsFun {
      constructor() {
        this.parsing = false;
        this.shorts_list = [];
      }
      node_parse(video_list) {
        !user_data.shorts_list && (user_data.shorts_list = []);
        let video_id, title, views_lable, thumbnail_url;
        let count = 0;
        for (let video_info of video_list) {
          count++;
          if (page_type === "yt_home") {
            video_id =
              video_info.richItemRenderer.content.reelItemRenderer.videoId;
            title =
              video_info.richItemRenderer.content.reelItemRenderer.headline
                .simpleText;
            views_lable =
              video_info.richItemRenderer.content.reelItemRenderer.viewCountText
                .simpleText;
            thumbnail_url =
              video_info.richItemRenderer.content.reelItemRenderer.thumbnail
                .thumbnails[0].url;
          }
          if (page_type === "yt_watch") {
            video_id = video_info.reelItemRenderer.videoId;
            title = video_info.reelItemRenderer.headline.simpleText;
            views_lable = video_info.reelItemRenderer.viewCountText.simpleText;
            thumbnail_url =
              video_info.reelItemRenderer.thumbnail.thumbnails[0].url;
          }
          if (["mobile_yt_home", "mobile_yt_watch"].includes(page_type)) {
            video_id = video_info.shortsLockupViewModel.entityId.replace(
              "shorts-shelf-item-",
              ""
            );
            title =
              video_info.shortsLockupViewModel.overlayMetadata.primaryText
                .content;
            views_lable =
              video_info.shortsLockupViewModel.overlayMetadata.secondaryText
                .content;
            thumbnail_url =
              video_info.shortsLockupViewModel.thumbnail.sources[0].url;
          }
          this.shorts_list.push({
            id: video_id,
            title: title,
            views_lable: views_lable,
            thumbnail_url: thumbnail_url,
          });
          if (!this.parsing) {
            this.parsing = true;
            setTimeout(() => {
              this.parse_shorts_list();
            }, shorts_parse_delay);
          }
        }
      }
      get_shorts_section() {
        if (!user_data.shorts_list || !user_data.shorts_list.length) return;
        let root, item_path;
        const items = [];
        if (page_type == "yt_home") {
          root = {
            richSectionRenderer: {
              content: {
                richShelfRenderer: {
                  title: {
                    runs: [
                      {
                        text: "Shorts",
                      },
                    ],
                  },
                  contents: [],
                  trackingParams: "CNMEEN-DAyITCOGA_NHuz4UDFWdqTAgdfF4E-Q==",
                  menu: {
                    menuRenderer: {
                      trackingParams:
                        "CNMEEN-DAyITCOGA_NHuz4UDFWdqTAgdfF4E-Q==",
                      topLevelButtons: [
                        {
                          buttonRenderer: {
                            style: "STYLE_OPACITY",
                            size: "SIZE_DEFAULT",
                            isDisabled: false,
                            serviceEndpoint: {
                              clickTrackingParams:
                                "CNYEEKqJCRgMIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                              commandMetadata: {
                                webCommandMetadata: {
                                  sendPost: true,
                                  apiUrl: "/youtubei/v1/feedback",
                                },
                              },
                              feedbackEndpoint: {
                                feedbackToken:
                                  "AB9zfpIcTXNyA3lbF_28icb4umRJ5AveSSTqmF7T9gE8k-Sw7HrOTLE5wzA2TScqfTByCI-cR9nPuVMSWAgbNuuaruVBYx2-2dGAzujQTL8KGMOyCFM_wmGhkLTSdUBQzsFQRHEibpg_",
                                uiActions: {
                                  hideEnclosingContainer: true,
                                },
                                actions: [
                                  {
                                    clickTrackingParams:
                                      "CNYEEKqJCRgMIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                                    replaceEnclosingAction: {
                                      item: {
                                        notificationMultiActionRenderer: {
                                          responseText: {
                                            runs: [
                                              {
                                                text: "Shelf will be hidden for ",
                                              },
                                              {
                                                text: "30",
                                              },
                                              {
                                                text: " days",
                                              },
                                            ],
                                          },
                                          buttons: [
                                            {
                                              buttonRenderer: {
                                                style: "STYLE_BLUE_TEXT",
                                                text: {
                                                  simpleText: "Undo",
                                                },
                                                serviceEndpoint: {
                                                  clickTrackingParams:
                                                    "CNgEEPBbGAAiEwjhgPzR7s-FAxVnakwIHXxeBPk=",
                                                  commandMetadata: {
                                                    webCommandMetadata: {
                                                      sendPost: true,
                                                      apiUrl:
                                                        "/youtubei/v1/feedback",
                                                    },
                                                  },
                                                  undoFeedbackEndpoint: {
                                                    undoToken:
                                                      "AB9zfpLpAillN1hH9cyfSbyPRWwAhTOJo6mUTu-ony4HASc0KgCEy0ifaIrDUdJJEk4OXiPC43EMPZBEK8WGiIqeci4r97TGpabAUk84dEh7tHzF7-rsziFBGZjY92Jyk3YujrF2_wxC",
                                                    actions: [
                                                      {
                                                        clickTrackingParams:
                                                          "CNgEEPBbGAAiEwjhgPzR7s-FAxVnakwIHXxeBPk=",
                                                        undoFeedbackAction: {
                                                          hack: true,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                                trackingParams:
                                                  "CNgEEPBbGAAiEwjhgPzR7s-FAxVnakwIHXxeBPk=",
                                              },
                                            },
                                          ],
                                          trackingParams:
                                            "CNcEEKW8ASITCOGA_NHuz4UDFWdqTAgdfF4E-Q==",
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                            icon: {
                              iconType: "DISMISSAL",
                            },
                            tooltip: "Not interested",
                            trackingParams:
                              "CNYEEKqJCRgMIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                            accessibilityData: {
                              accessibilityData: {
                                label: "Not interested",
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                  showMoreButton: {
                    buttonRenderer: {
                      style: "STYLE_OPACITY",
                      size: "SIZE_DEFAULT",
                      text: {
                        runs: [
                          {
                            text: "Show more",
                          },
                        ],
                      },
                      icon: {
                        iconType: "EXPAND",
                      },
                      accessibility: {
                        label: "Show more",
                      },
                      trackingParams:
                        "CNUEEJnjCyITCOGA_NHuz4UDFWdqTAgdfF4E-Q==",
                    },
                  },
                  isExpanded: false,
                  icon: {
                    iconType: "YOUTUBE_SHORTS_BRAND_24",
                  },
                  isTopDividerHidden: false,
                  isBottomDividerHidden: false,
                  showLessButton: {
                    buttonRenderer: {
                      style: "STYLE_OPACITY",
                      size: "SIZE_DEFAULT",
                      text: {
                        runs: [
                          {
                            text: "Show less",
                          },
                        ],
                      },
                      icon: {
                        iconType: "COLLAPSE",
                      },
                      accessibility: {
                        label: "Show less",
                      },
                      trackingParams: "CNQEEPBbIhMI4YD80e7PhQMVZ2pMCB18XgT5",
                    },
                  },
                },
              },
              trackingParams: "CNIEEOOXBRgEIhMI4YD80e7PhQMVZ2pMCB18XgT5",
              fullBleed: false,
            },
          };
          item_path =
            "root.richSectionRenderer.content.richShelfRenderer.contents";
        }
        if (["mobile_yt_watch", "yt_watch"].includes(page_type)) {
          root = {
            reelShelfRenderer: {
              title: {
                runs: [
                  {
                    text: "Shorts",
                  },
                ],
              },
              items: [],
              trackingParams: "CM4CEN-DAxgEIhMInKOvhY3QhQMVGcCXCB04HQR6",
              icon: {
                iconType: "YOUTUBE_SHORTS_BRAND_24",
              },
            },
          };
          item_path = "root.reelShelfRenderer.items";
        }
        if (page_type == "mobile_yt_home") {
          root = {
            richSectionRenderer: {
              content: {
                reelShelfRenderer: {
                  title: {
                    runs: [
                      {
                        text: "Shorts",
                      },
                    ],
                  },
                  button: {
                    menuRenderer: {
                      trackingParams: "CHYQ34MDIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                      topLevelButtons: [
                        {
                          buttonRenderer: {
                            style: "STYLE_DEFAULT",
                            size: "SIZE_DEFAULT",
                            isDisabled: false,
                            serviceEndpoint: {
                              clickTrackingParams:
                                "CLMBEKqJCRgPIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                              commandMetadata: {
                                webCommandMetadata: {
                                  sendPost: true,
                                  apiUrl: "/youtubei/v1/feedback",
                                },
                              },
                              feedbackEndpoint: {
                                feedbackToken:
                                  "AB9zfpJSnrbvskPWkpziyGduKV-4gTxm30-eNNYDobzecpLq84dL6HwCxdX_zbvm_OmxSKdlsngHEE1CF7JKYGiyDVYV_Q7p9ihGCzOYcnqKcAJfNnSp-U-njcnKLgCWu_USr-2prW3x",
                                uiActions: {
                                  hideEnclosingContainer: true,
                                },
                                actions: [
                                  {
                                    clickTrackingParams:
                                      "CLMBEKqJCRgPIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                                    replaceEnclosingAction: {
                                      item: {
                                        notificationMultiActionRenderer: {
                                          responseText: {
                                            runs: [
                                              {
                                                text: "Shelf will be hidden for ",
                                              },
                                              {
                                                text: "30",
                                              },
                                              {
                                                text: " days",
                                              },
                                            ],
                                          },
                                          buttons: [
                                            {
                                              buttonRenderer: {
                                                style: "STYLE_MONO_TONAL",
                                                text: {
                                                  runs: [
                                                    {
                                                      text: "Undo",
                                                    },
                                                  ],
                                                },
                                                serviceEndpoint: {
                                                  clickTrackingParams:
                                                    "CLUBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                                                  commandMetadata: {
                                                    webCommandMetadata: {
                                                      sendPost: true,
                                                      apiUrl:
                                                        "/youtubei/v1/feedback",
                                                    },
                                                  },
                                                  undoFeedbackEndpoint: {
                                                    undoToken:
                                                      "AB9zfpK-nY3vxgYDkvJSkuFdbeBltD0r4XdLzoFqxz6OPnmJrroOAxKfUuDny8kPjB9yyWzwEerOZqe90BakCPEJXycRSrH8sZAdnlWpEs0n0lx6qOFERE6o5jkK3mgbcVCM-Al38oGV",
                                                    actions: [
                                                      {
                                                        clickTrackingParams:
                                                          "CLUBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                                                        undoFeedbackAction: {
                                                          hack: true,
                                                        },
                                                      },
                                                    ],
                                                  },
                                                },
                                                trackingParams:
                                                  "CLUBEPBbGAAiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
                                              },
                                            },
                                          ],
                                          trackingParams:
                                            "CLQBEKW8ASITCKnqgMqO0IUDFc95TAgdpggNCQ==",
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                            icon: {
                              iconType: "DISMISSAL",
                            },
                            tooltip: "Not interested",
                            trackingParams:
                              "CLMBEKqJCRgPIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                            accessibilityData: {
                              accessibilityData: {
                                label: "Not interested",
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                  items: [],
                  trackingParams: "CHYQ34MDIhMIqeqAyo7QhQMVz3lMCB2mCA0J",
                  icon: {
                    iconType: "YOUTUBE_SHORTS_BRAND_24",
                  },
                },
              },
              trackingParams: "CHUQ45cFGAEiEwip6oDKjtCFAxXPeUwIHaYIDQk=",
              fullBleed: false,
            },
          };
          item_path =
            "root.richSectionRenderer.content.reelShelfRenderer.items";
        }
        let shorts;
        while ((shorts = user_data.shorts_list.pop())) {
          const id = shorts["id"];
          const title = shorts["title"];
          const ago_str = shorts["ago_str"];
          const author = shorts["author_name"];
          const views_lable =
            shorts["views_lable"] +
            (author ? " · " + author : "") +
            (ago_str ? " · " + ago_str : "");
          const thumbnail_url = shorts["thumbnail_url"];
          let tmp_item;
          if (["yt_home", "yt_watch"].includes(page_type)) {
            tmp_item = {
              reelItemRenderer: {
                videoId: id,
                headline: {
                  simpleText: title,
                },
                thumbnail: {
                  thumbnails: [
                    {
                      url: thumbnail_url,
                      width: 405,
                      height: 720,
                    },
                  ],
                  isOriginalAspectRatio: true,
                },
                viewCountText: {
                  accessibility: {
                    accessibilityData: {
                      label: views_lable,
                    },
                  },
                  simpleText: views_lable,
                },
                navigationEndpoint: {
                  clickTrackingParams:
                    "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6mgEFCCUQ-B0=",
                  commandMetadata: {
                    webCommandMetadata: {
                      url: "/shorts/" + id,
                      webPageType: "WEB_PAGE_TYPE_SHORTS",
                      rootVe: 37414,
                    },
                  },
                  reelWatchEndpoint: {
                    videoId: id,
                    playerParams:
                      "8AEBoAMCyAMluAQGogYVAdXZ-jvMfGWnXiNDPh0oiMSTJMUn",
                    thumbnail: {
                      thumbnails: [
                        {
                          url: "https://i.ytimg.com/vi/" + id + "/frame0.jpg",
                          width: 1080,
                          height: 1920,
                        },
                      ],
                      isOriginalAspectRatio: true,
                    },
                    overlay: {
                      reelPlayerOverlayRenderer: {
                        style: "REEL_PLAYER_OVERLAY_STYLE_SHORTS",
                        trackingParams:
                          "CO4CELC1BCITCJyjr4WN0IUDFRnAlwgdOB0Eeg==",
                        reelPlayerNavigationModel:
                          "REEL_PLAYER_NAVIGATION_MODEL_UNSPECIFIED",
                      },
                    },
                    params: "CAYwAg%3D%3D",
                    sequenceProvider: "REEL_WATCH_SEQUENCE_PROVIDER_RPC",
                    sequenceParams: "CgtLRmRCbnpnSjJZWSoCGAZQGWgA",
                    loggingContext: {
                      vssLoggingContext: {
                        serializedContextData: "CgIIDA%3D%3D",
                      },
                      qoeLoggingContext: {
                        serializedContextData: "CgIIDA%3D%3D",
                      },
                    },
                    ustreamerConfig:
                      "CAwSHDFIakVXUytucVRyTENNWlgzMXdDZmYwamZQQ0U=",
                  },
                },
                menu: {
                  menuRenderer: {
                    items: [
                      {
                        menuServiceItemRenderer: {
                          text: {
                            runs: [
                              {
                                text: "Report",
                              },
                            ],
                          },
                          icon: {
                            iconType: "FLAG",
                          },
                          serviceEndpoint: {
                            clickTrackingParams:
                              "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                            commandMetadata: {
                              webCommandMetadata: {
                                sendPost: true,
                                apiUrl: "/youtubei/v1/flag/get_form",
                              },
                            },
                            getReportFormEndpoint: {
                              params: "EgtLRmRCbnpnSjJZWUABWABwAXgB2AEA6AEA",
                            },
                          },
                          trackingParams:
                            "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                        },
                      },
                      {
                        menuServiceItemRenderer: {
                          text: {
                            runs: [
                              {
                                text: "Not interested",
                              },
                            ],
                          },
                          icon: {
                            iconType: "NOT_INTERESTED",
                          },
                          serviceEndpoint: {
                            clickTrackingParams:
                              "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                            commandMetadata: {
                              webCommandMetadata: {
                                sendPost: true,
                                apiUrl: "/youtubei/v1/feedback",
                              },
                            },
                            feedbackEndpoint: {
                              feedbackToken:
                                "AB9zfpIBjY8nLioWtHjvUvMvrLXfhPMooShdpv91xgNNrZuxibAl6QyPeYMe7faEHcrSUm-TIqvLe2ThmYQpNRUy9rPbV1k3jjrvqqc5cOLBvnV8oN0Kbrq3-K9IjJXYitJPyOzJU0uy",
                              actions: [
                                {
                                  clickTrackingParams:
                                    "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                                  replaceEnclosingAction: {
                                    item: {
                                      notificationMultiActionRenderer: {
                                        responseText: {
                                          runs: [
                                            {
                                              text: "Video removed",
                                            },
                                          ],
                                        },
                                        buttons: [
                                          {
                                            buttonRenderer: {
                                              style: "STYLE_BLUE_TEXT",
                                              text: {
                                                runs: [
                                                  {
                                                    text: "Undo",
                                                  },
                                                ],
                                              },
                                              serviceEndpoint: {
                                                clickTrackingParams:
                                                  "CO0CEPBbGAAiEwico6-FjdCFAxUZwJcIHTgdBHo=",
                                                commandMetadata: {
                                                  webCommandMetadata: {
                                                    sendPost: true,
                                                    apiUrl:
                                                      "/youtubei/v1/feedback",
                                                  },
                                                },
                                                undoFeedbackEndpoint: {
                                                  undoToken:
                                                    "AB9zfpK74nsMbZ4OfNgKTgA9g0w3Q8o72jdm384D3y82OAuy2KgvTUOAn-iII915ZC_7aqAxTK-XNir21X_T3WQEeAzdy4hCZ6o0f12hfdHW8xI1js1WB_CEn3EW27P9_1vu5dw2kDeW",
                                                  actions: [
                                                    {
                                                      clickTrackingParams:
                                                        "CO0CEPBbGAAiEwico6-FjdCFAxUZwJcIHTgdBHo=",
                                                      undoFeedbackAction: {
                                                        hack: true,
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                              trackingParams:
                                                "CO0CEPBbGAAiEwico6-FjdCFAxUZwJcIHTgdBHo=",
                                            },
                                          },
                                        ],
                                        trackingParams:
                                          "COwCEKW8ASITCJyjr4WN0IUDFRnAlwgdOB0Eeg==",
                                      },
                                    },
                                  },
                                },
                              ],
                            },
                          },
                          trackingParams:
                            "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                          accessibility: {
                            accessibilityData: {
                              label: "Not interested",
                            },
                          },
                        },
                      },
                      {
                        menuNavigationItemRenderer: {
                          text: {
                            runs: [
                              {
                                text: "Send feedback",
                              },
                            ],
                          },
                          icon: {
                            iconType: "FEEDBACK",
                          },
                          navigationEndpoint: {
                            clickTrackingParams:
                              "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                            commandMetadata: {
                              webCommandMetadata: {
                                ignoreNavigation: true,
                              },
                            },
                            userFeedbackEndpoint: {
                              additionalDatas: [
                                {
                                  userFeedbackEndpointProductSpecificValueData:
                                    {
                                      key: "video_id",
                                      value: id,
                                    },
                                },
                                {
                                  userFeedbackEndpointProductSpecificValueData:
                                    {
                                      key: "lockup",
                                      value: "shelf",
                                    },
                                },
                              ],
                            },
                          },
                          trackingParams:
                            "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                          accessibility: {
                            accessibilityData: {
                              label: "Send feedback",
                            },
                          },
                        },
                      },
                    ],
                    trackingParams: "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                    accessibility: {
                      accessibilityData: {
                        label: "More actions",
                      },
                    },
                  },
                },
                trackingParams:
                  "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6QIazp8Dzs9CrKA==",
                accessibility: {
                  accessibilityData: {
                    label: title + " - play Short",
                  },
                },
                style: "REEL_ITEM_STYLE_AVATAR_CIRCLE",
                dismissalInfo: {
                  feedbackToken:
                    "AB9zfpLIJd1aRU9JzdOjpgeJBW2QvHH79sx6dM6ZCDEzyc5qrISZBSpNRe5lerckNHwQ10BOwEQhlquLlHP-nkuA4VSSCXX0XgMJHBnKWBxlIXkQ1pLIUjd6cQKhrCUioDfix7xn5Ecj",
                },
                videoType: "REEL_VIDEO_TYPE_VIDEO",
                loggingDirectives: {
                  trackingParams: "COsCEIf2BBgAIhMInKOvhY3QhQMVGcCXCB04HQR6",
                  visibility: {
                    types: "12",
                  },
                  enableDisplayloggerExperiment: true,
                },
              },
            };
          }
          if (page_type == "yt_home") {
            tmp_item = {
              richItemRenderer: {
                content: tmp_item,
                trackingParams: "CJsFEJmNBRgAIhMI4YD80e7PhQMVZ2pMCB18XgT5",
              },
            };
          }
          if (["mobile_yt_home", "mobile_yt_watch"].includes(page_type)) {
            tmp_item = {
              shortsLockupViewModel: {
                entityId: "shorts-shelf-item-" + id,
                accessibilityText: title + ", " + views_lable + " - play Short",
                thumbnail: {
                  sources: [
                    {
                      url: thumbnail_url,
                      width: 405,
                      height: 720,
                    },
                  ],
                },
                onTap: {
                  innertubeCommand: {
                    clickTrackingParams:
                      "CK8BEIf2BBgAIhMIqeqAyo7QhQMVz3lMCB2mCA0JWg9GRXdoYXRfdG9fdG9wYXRjaJoBBQgkEI4e",
                    commandMetadata: {
                      webCommandMetadata: {
                        url: "/shorts/" + id,
                        webPageType: "WEB_PAGE_TYPE_SHORTS",
                        rootVe: 37414,
                      },
                    },
                    reelWatchEndpoint: {
                      videoId: id,
                    },
                  },
                },
                overlayMetadata: {
                  primaryText: {
                    content: title,
                  },
                  secondaryText: {
                    content: views_lable,
                  },
                },
              },
            };
          }
          items.push(tmp_item);
        }
        if (item_path) {
          eval(trustedScript(item_path + " = items"));
          user_data_api.set();
          return root;
        }
        return {};
      }
      get_shorts_info(video_id) {
        return new Promise((resolve, reject) => {
          let basic_url, author_id_reg, author_name_reg, ago_reg;
          if (page_type.startsWith("mobile")) {
            basic_url = "https://m.youtube.com/shorts/";
            author_id_reg = /"channelId":"(.*?)"/;
            author_name_reg = /"ownerChannelName":"(.*?)"/;
            ago_reg = /timestampText.*?:\\x22(.*?)\\x22\\x7d/;
          } else {
            basic_url = "https://www.youtube.com/shorts/";
            author_id_reg = /"browseId":"([a-zA-Z0-9\-_]+)","canonicalBaseUrl"/;
            author_name_reg = /"channel":\{"simpleText":"(.*?)"/;
            ago_reg = /"timestampText":{"simpleText":"(.*?)"}/;
          }
          const url = basic_url + video_id;
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url);
          xhr.setRequestHeader(
            "accept",
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
          );
          let author_id = "";
          let author_name = "";
          let ago_str = "";
          xhr.onload = function () {
            if (xhr.status === 200) {
              let match;
              const result = xhr.responseText;
              match = result.match(author_id_reg);
              if (match && match.length > 1) author_id = match[1];
              match = result.match(author_name_reg);
              if (match && match.length > 1) author_name = match[1];
              match = result.match(ago_reg);
              if (match && match.length > 1) ago_str = match[1];
              resolve({
                id: video_id,
                author_id: author_id,
                author_name: author_name,
                ago_str: ago_str,
              });
            } else {
              reject(xhr.responseText);
            }
          };
          xhr.onerror = function () {
            reject(new Error("XHR request failed"));
          };
          xhr.send();
        });
      }
      parse_shorts_list() {
        if (!this.shorts_list.length) return;
        const { id, title, views_lable, thumbnail_url } =
          this.shorts_list.pop();
        this.get_shorts_info(id)
          .then((author_info) => {
            const { author_id, author_name, ago_str } = author_info;
            if (author_id && user_data.channel_infos.ids.includes(author_id)) {
              if (
                user_data.shorts_list.some((value) => {
                  return value.id === id;
                })
              ) {
                log(
                  "Already exists from " + author_name + ": " + title,
                  "shorts"
                );
              } else {
                log(
                  "Not filtering " + author_name + "'s short: " + title,
                  "shorts"
                );
                const shorts_info = {
                  id: id,
                  title: title,
                  author_id: author_id,
                  author_name: author_name,
                  views_lable: views_lable,
                  from: page_type,
                  thumbnail_url: thumbnail_url,
                  ago_str: ago_str,
                };
                user_data.shorts_list.push(shorts_info);
                user_data_api.set();
              }
            } else {
              log("Filtering " + author_name + "'s short: " + title, "shorts");
            }
          })
          .finally(() => {
            if (this.shorts_list.length > 0)
              setTimeout(() => {
                this.parse_shorts_list();
              }, shorts_parse_delay);
            else this.parsing = false;
          });
      }
      check_shorts_exist() {
        const short_id = href.split("/").pop();
        for (let i = 0; i < user_data.shorts_list.length; i++) {
          if (user_data.shorts_list[i].id === short_id) {
            user_data.shorts_list.splice(i, 1);
            user_data_api.set();
            return;
          }
        }
      }
      get_interval_tag(upload_date_str) {
        if (!upload_date_str) return "";
        const uploadDate = new Date(upload_date_str);
        const currentDate = new Date();
        const timeDifference = Math.abs(currentDate - uploadDate);
        const secondsDifference = timeDifference / 1000;
        const minutesDifference = secondsDifference / 60;
        const hoursDifference = minutesDifference / 60;
        const daysDifference = hoursDifference / 24;
        const weeksDifference = daysDifference / 7;
        const monthsDifference = weeksDifference / 4.345;
        const yearsDifference = monthsDifference / 12;
        if (secondsDifference < 60) {
          return `${Math.floor(secondsDifference)} seconds ago`;
        } else if (minutesDifference < 60) {
          return `${Math.floor(minutesDifference)} minutes ago`;
        } else if (hoursDifference < 24) {
          return `${Math.floor(hoursDifference)} hours ago`;
        } else if (daysDifference < 7) {
          return `${Math.floor(daysDifference)} days ago`;
        } else if (weeksDifference < 4.345) {
          return `${Math.floor(weeksDifference)} weeks ago`;
        } else if (monthsDifference < 12) {
          return `${Math.floor(monthsDifference)} months ago`;
        } else {
          return `${Math.floor(yearsDifference)} years ago`;
        }
      }
    }
    return new ShortsFun();
  }

  function get_yt_api() {
    return {
      get_subscribe_data: function (retry = 0) {
        const headers = {
          authority: "www.youtube.com",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        };
        const url = "https://www.youtube.com/feed/channels";
        const requestConfig = {
          method: "GET",
          headers: headers,
          url: url,
        };
        const save_this = this;
        GM_xmlhttpRequest({
          ...requestConfig,
          onload: function (response) {
            const tmp_channel_names = [];
            const tmp_channel_ids = [];
            const regex = /var ytInitialData \= (.*?);\<\/script\>/;
            try {
              const match = response.responseText.match(regex);
              const ytInitialData_obj = JSON.parse(match[1]);
              const items =
                ytInitialData_obj.contents.twoColumnBrowseResultsRenderer
                  .tabs[0].tabRenderer.content.sectionListRenderer.contents[0]
                  .itemSectionRenderer.contents[0].shelfRenderer.content
                  .expandedShelfContentsRenderer.items;
              for (let item of items) {
                const channel_name = item.channelRenderer.title.simpleText;
                const match_channel_id = item.channelRenderer.channelId;
                tmp_channel_ids.push(match_channel_id);
                tmp_channel_names.push(channel_name);
              }
              if (tmp_channel_ids.length > 0) {
                user_data.channel_infos.ids = tmp_channel_ids;
                user_data.channel_infos.names = tmp_channel_names;
                user_data_api.set();
              }
              log(
                "Fetched subscription list successfully: " +
                  user_data.channel_infos.ids.length +
                  " channels",
                0
              );
            } catch (error) {
              if (retry < 3) {
                setTimeout(() => {
                  save_this.get_subscribe_data(retry + 1);
                }, 1000);
              }
              log("Failed to fetch subscription list\n", error, -1);
            }
          },
          onerror: function (error) {
            if (retry < 3) {
              setTimeout(() => {
                save_this.get_subscribe_data(retry + 1);
              }, 1000);
            }
            log("Failed to fetch subscription list\n", error, -1);
          },
        });
      },
      get_authorization: function () {
        function Vja() {
          function a() {
            e[0] = 1732584193;
            e[1] = 4023233417;
            e[2] = 2562383102;
            e[3] = 271733878;
            e[4] = 3285377520;
            u = q = 0;
          }
          function b(x) {
            for (var y = l, C = 0; 64 > C; C += 4)
              y[C / 4] =
                (x[C] << 24) | (x[C + 1] << 16) | (x[C + 2] << 8) | x[C + 3];
            for (C = 16; 80 > C; C++)
              (x = y[C - 3] ^ y[C - 8] ^ y[C - 14] ^ y[C - 16]),
                (y[C] = ((x << 1) | (x >>> 31)) & 4294967295);
            x = e[0];
            var E = e[1],
              H = e[2],
              R = e[3],
              T = e[4];
            for (C = 0; 80 > C; C++) {
              if (40 > C) {
                if (20 > C) {
                  var X = R ^ (E & (H ^ R));
                  var la = 1518500249;
                } else (X = E ^ H ^ R), (la = 1859775393);
              } else
                60 > C
                  ? ((X = (E & H) | (R & (E | H))), (la = 2400959708))
                  : ((X = E ^ H ^ R), (la = 3395469782));
              X =
                ((((x << 5) | (x >>> 27)) & 4294967295) + X + T + la + y[C]) &
                4294967295;
              T = R;
              R = H;
              H = ((E << 30) | (E >>> 2)) & 4294967295;
              E = x;
              x = X;
            }
            e[0] = (e[0] + x) & 4294967295;
            e[1] = (e[1] + E) & 4294967295;
            e[2] = (e[2] + H) & 4294967295;
            e[3] = (e[3] + R) & 4294967295;
            e[4] = (e[4] + T) & 4294967295;
            u = q = 0;
          }
          function c(x, y) {
            if ("string" === typeof x) {
              x = unescape(encodeURIComponent(x));
              for (var C = [], E = 0, H = x.length; E < H; ++E)
                C.push(x.charCodeAt(E));
              x = C;
            }
            y || (y = x.length);
            C = 0;
            if (0 == q)
              for (; C + 64 < y; ) b(x.slice(C, C + 64)), (C += 64), (u += 64);
            for (; C < y; )
              if (((h[q++] = x[C++]), u++, 64 == q))
                for (q = 0, b(h); C + 64 < y; )
                  b(x.slice(C, C + 64)), (C += 64), (u += 64);
          }
          function d() {
            var x = [],
              y = 8 * u;
            56 > q ? c(m, 56 - q) : c(m, 64 - (q - 56));
            for (var C = 63; 56 <= C; C--) (h[C] = y & 255), (y >>>= 8);
            b(h);
            for (C = y = 0; 5 > C; C++)
              for (var E = 24; 0 <= E; E -= 8) x[y++] = (e[C] >> E) & 255;
            return x;
          }
          for (var e = [], h = [], l = [], m = [128], p = 1; 64 > p; ++p)
            m[p] = 0;
          var q, u;
          a();
          return {
            reset: a,
            update: c,
            digest: d,
            digestString: function () {
              for (var x = d(), y = "", C = 0; C < x.length; C++)
                y +=
                  "0123456789ABCDEF".charAt(Math.floor(x[C] / 16)) +
                  "0123456789ABCDEF".charAt(x[C] % 16);
              return y;
            },
          };
        }
        const sapisid_cookie =
          getCookie("SAPISID") ||
          getCookie("APISID") ||
          getCookie("__Secure-3PAPISID");
        if (sapisid_cookie) {
          const timestamp = Math.floor(Date.now() / 1000);
          const b = Vja();
          b.update(
            timestamp + " " + sapisid_cookie + " https://www.youtube.com"
          );
          const hash_value = b.digestString().toLowerCase();
          return "SAPISIDHASH " + timestamp + "_" + hash_value;
        }
        return "";
      },
      get_channel_id: function (retry = 0) {
        const authorization = this.get_authorization();
        if (!authorization) {
          log("Failed to get authorization", 0);
          return;
        }
        const url = "https://www.youtube.com/youtubei/v1/account/account_menu";
        const params = {
          prettyPrint: "false",
        };
        const data = {
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20240308.00.00",
            },
          },
        };
        const jsonData = JSON.stringify(data);
        const headers = {
          authorization: authorization,
          "content-type": "application/json",
          origin: "https://www.youtube.com",
          referer: "https0://www.youtube.com/",
        };
        const requestConfig = {
          method: "POST",
          headers: headers,
          data: jsonData,
          url: url + "?" + new URLSearchParams(params),
        };

        GM_xmlhttpRequest({
          ...requestConfig,
          onload: function (response) {
            const match = response.responseText.match(/"browseId"\:"(.*?)"/);
            if (match && match.length > 1) {
              const tmp_id = match[1];
              if (tmp_id && tmp_id != channel_id) {
                channel_id = tmp_id;
                user_data = user_data_api.get();
                GM_setValue("last_channel_id", channel_id);
              }
              log("Successfully obtained channel_id " + channel_id, 0);
            } else {
              if (retry < 3) {
                setTimeout(() => {
                  yt_api.get_channel_id(retry + 1);
                }, 500);
              } else {
                log(
                  "Failed to get channel_id",
                  response,
                  response.responseText,
                  -1
                );
              }
            }
          },
          onerror: function (error) {
            if (retry < 3) {
              setTimeout(() => {
                yt_api.get_channel_id(retry + 1);
              }, 500);
              yt_api.get_channel_id(retry + 1);
            } else {
              log("Failed to get channel_id", error, 0);
            }
          },
        });
      },
    };
  }

  function get_user_data_api() {
    return {
      get() {
        const default_user_data = {
          open_recommend_shorts: "off",
          open_recommend_movie: "off",
          open_recommend_popular: "off",
          open_recommend_liveroom: "on",
          open_recommend_playables: "off",
          add_shorts_upload_date: "on",
          shorts_change_author_name: "on",
          short_buy_super_thanks: "off",
          shorts_auto_scroll: "off",
          shorts_add_video_progress: "onTap",
          shorts_dbclick_like: "off",
          shorts_disable_loop_play: "on",
          dbclick_download_video: "off",
          sponsorblock: "on",
          language: "en",
          channel_infos: {
            ids: [],
            names: [],
          },
          shorts_list: [],
          watch_page_config: {
            shop_banner: "off",
            hide_live_chat: "off",
            hide_live_chat_replay: "on",
          },
          global_shorts_block: "on",
          hide_download_button: "off",
          hide_share_button: "off",
          hide_thanks_button: "off",
          hide_clip_button: "off",
          hide_more_actions_button: "off",
          hide_save_button: "off",
          hide_subscribe_button: "off",
          hide_like_bar: "off",
          hide_join_button: "off",
          hide_ask_button: "off",
          login: false,
        };
        let diff = false;
        user_data_listener.set();
        let tmp_user_data = GM_getValue(channel_id);
        if (!tmp_user_data) {
          tmp_user_data = default_user_data;
          diff = true;
        }
        for (let key in default_user_data) {
          if (!(key in tmp_user_data)) {
            diff = true;
            tmp_user_data[key] = default_user_data[key];
          }
        }
        const tmp_login = channel_id !== "default";
        if (tmp_user_data.login !== tmp_login) {
          diff = true;
          tmp_user_data.login = tmp_login;
        }
        (diff || this.update(tmp_user_data)) &&
          GM_setValue(channel_id, tmp_user_data);
        return tmp_user_data;
      },
      set() {
        return GM_setValue(channel_id, user_data);
      },
      reset() {
        if (!confirm(flag_info.del_config_confirm_tips)) return;
        const keys = GM_listValues();
        for (let key of keys) {
          GM_deleteValue(key);
        }
        unsafeWindow.document.location.reload();
      },
      update(tmp_user_data) {
        let diff = false;
        const last_version = GM_getValue("last_version", -1);
        if (last_version === -1 && !tmp_user_data.open_recommend_shorts) {
          tmp_user_data.open_recommend_shorts = GM_getValue(
            "open_recommend_shorts",
            "on"
          );
          tmp_user_data.open_recommend_movie = GM_getValue(
            "open_recommend_movie",
            "on"
          );
          tmp_user_data.open_recommend_popular = GM_getValue(
            "open_recommend_popular",
            "on"
          );
          tmp_user_data.open_recommend_liveroom = GM_getValue(
            "open_recommend_liveroom",
            "on"
          );
          diff = true;
        }
        if (typeof tmp_user_data.open_recommend_shorts === "boolean") {
          tmp_user_data.open_recommend_shorts =
            tmp_user_data.open_recommend_shorts ? "on" : "off";
          tmp_user_data.open_recommend_movie =
            tmp_user_data.open_recommend_movie ? "on" : "off";
          tmp_user_data.open_recommend_popular =
            tmp_user_data.open_recommend_popular ? "on" : "off";
          tmp_user_data.open_recommend_liveroom =
            tmp_user_data.open_recommend_liveroom ? "on" : "off";
          diff = true;
        }
        last_version !== GM_info.script.version &&
          GM_setValue("last_version", GM_info.script.version);

        // backfill watch_page_config
        if (!tmp_user_data.watch_page_config) {
          tmp_user_data.watch_page_config = {
            shop_banner: "off",
            hide_live_chat: "off",
            hide_live_chat_replay: "off",
          };
          diff = true;
        } else {
          if (tmp_user_data.watch_page_config.hide_live_chat === undefined) {
            tmp_user_data.watch_page_config.hide_live_chat = "off";
            diff = true;
          }
          if (
            tmp_user_data.watch_page_config.hide_live_chat_replay === undefined
          ) {
            tmp_user_data.watch_page_config.hide_live_chat_replay = "off";
            diff = true;
          }
        }

        const newHideKeys = [
          "hide_download_button",
          "hide_share_button",
          "hide_thanks_button",
          "hide_clip_button",
          "hide_more_actions_button",
          "hide_save_button",
          "hide_subscribe_button",
          "hide_like_bar",
          "hide_join_button",
          "hide_ask_button",
          "global_shorts_block",
        ];
        for (const key of newHideKeys) {
          if (tmp_user_data[key] === undefined) {
            tmp_user_data[key] = "off";
            diff = true;
          }
        }

        return diff;
      },
    };
  }

  function get_data_process() {
    class DATA_PROCESS {
      constructor() {
        this.limit_eval = false;
        this.obj_filter;
        this.obj_storage = {};
      }
      condition_split_and_tag = "&&";
      condition_split_or_tag = "||";
      value_split_and_tag = "&";
      value_split_or_tag = "|";

      storage_obj(key, obj) {
        this.obj_storage[key] = obj;
      }

      set_obj_filter(obj_filter) {
        if (typeof obj_filter !== "function") return;
        this.obj_filter = function () {
          try {
            obj_filter.apply(this, arguments);
          } catch (error) {
            log("obj_filter error", error, -1);
            return false;
          }
        };
      }

      text_process(data, values, mode, traverse_all) {
        if (!values) return data;
        const origin_data = data;
        try {
          mode = mode || "cover";
          if (mode === "reg") {
            for (let value of values) {
              const patten_express = value.split(SPLIT_TAG)[0];
              const replace_value = value.split(SPLIT_TAG)[1];
              const patten = new RegExp(patten_express, "g");
              data = data.replace(patten, replace_value);
            }
          }
          if (mode === "cover") {
            data = values[0];
          }
          if (mode === "insert") {
            traverse_all = traverse_all || false;
            let json_data;
            try {
              json_data = JSON.parse(data);
            } catch (error) {
              log("text_process JSON parse error", -1);
              return data;
            }
            this.obj_process(json_data, values, traverse_all);
            data = JSON.stringify(json_data);
          }
        } catch (error) {
          log("text_process error", error, -1);
          data = origin_data;
        }
        return data;
      }

      get_relative_path(basic_path, relative_path) {
        if (relative_path === "/") return basic_path;
        let real_path;
        if (relative_path.startsWith("/.")) {
          real_path = basic_path + relative_path.slice(1);
        }
        if (relative_path.startsWith(".")) {
          const reg = /[\.\[]/g;
          const positions = [];
          let match;
          while ((match = reg.exec(basic_path)) !== null) {
            positions.push(match.index);
          }
          if (positions.length === 0) {
            return basic_path;
          }
          const pointer_match = relative_path.match(/^\.+/);
          const split_index =
            positions[positions.length - pointer_match[0].length];
          const relative_attribute = relative_path.slice(
            pointer_match[0].length
          );
          real_path =
            basic_path.slice(0, split_index) +
            (relative_attribute
              ? (relative_attribute.startsWith("[") ? "" : ".") +
                relative_attribute
              : "");
        }
        return this.convertPathToBracketNotation(real_path);
      }

      value_parse(parse_value, path_info = null, json_obj = null) {
        const formula_match = parse_value.match(/\{.*?\}/g);
        if (formula_match) {
          for (let express_ of formula_match) {
            const express = express_.slice(1, -1);
            if (!express) continue;
            parse_value = parse_value.replace(
              express_,
              this.value_parse(express, path_info, json_obj)
            );
          }
        }
        const json_math = parse_value.match(/^json\((.*)\)$/);
        if (json_math) return JSON.parse(json_math[1]);
        const obj_match = parse_value.match(/^obj\((.*)\)$/);
        if (obj_match) return this.string_to_value(unsafeWindow, obj_match[1]);
        const storage_obj_match = parse_value.match(/^sobj\((.*)\)$/);
        if (storage_obj_match)
          return this.string_to_value(this.obj_storage, storage_obj_match[1]);
        const number_match = parse_value.match(/^num\((.*)\)$/);
        if (number_match) return Number(number_match[1]);
        const method_match = parse_value.match(/^method\((.*)\)$/);
        if (method_match) {
          if (this.limit_eval) {
            const method_info = method_match[1].match(/(.*?)\((.*)\)$/);
            const method_name = method_info[1];
            const method_args_string = method_info[2];
            const method_args = method_args_string.split(",");
            const args = [];
            for (let arg of method_args) {
              args.push(this.value_parse(arg, path_info, json_obj));
            }
            return unsafeWindow[method_name](...args);
          }
          return eval(trustedScript(method_match[1]));
        }
        const deal_obj_match = parse_value.match(/^dealObj\((.*)\)$/);
        if (deal_obj_match) {
          const path_msg = deal_obj_match[1];
          return this.string_to_value(
            json_obj.this.get_relative_path(path_info.deal_path, path_msg)
          );
        }
        const path_obj_match = parse_value.match(/^pathObj\((.*)\)$/);
        if (path_obj_match) {
          const path_msg = path_obj_match[1];
          return this.string_to_value(
            json_obj,
            this.get_relative_path(path_info.path, path_msg)
          );
        }
        const abs_obj_match = parse_value.match(/^absObj\((.*)\)$/);
        if (abs_obj_match) {
          const abs_path = abs_obj_match[1];
          return this.string_to_value(json_obj, abs_path);
        }
        const string_match = parse_value.match(/^["'](.*)["']$/);
        if (string_match) return string_match[1];
        if (parse_value === "undefined") return undefined;
        if (parse_value === "null") return null;
        return parse_value;
      }

      string_to_value(obj, path) {
        try {
          if (!this.limit_eval) {
            return eval(trustedScript(path.replace("json_obj", "obj")));
          }
          let tmp_obj = obj;
          let matches = path.match(/\[(.*?)\]/g);
          if (matches) {
            matches.map((match) => {
              if (match.includes('["')) {
                tmp_obj = Reflect.get(tmp_obj, match.replace(/\["|"\]/g, ""));
              } else {
                tmp_obj = Reflect.get(
                  tmp_obj,
                  Number(match.replace(/\[|\]/g, ""))
                );
              }
            });
            return tmp_obj;
          }
          matches = path.split(".");
          if (matches) {
            matches.splice(0, 1);
            matches.map((match) => {
              tmp_obj = Reflect.get(tmp_obj, match);
            });
            return tmp_obj;
          }
        } catch (error) {
          return null;
        }
      }

      get_lastPath_and_key(path) {
        let last_path, last_key;
        let matches = path.match(/\[(.*?)\]/g);
        if (matches && matches.length > 0) {
          const tmp = matches[matches.length - 1];
          if (tmp.includes('["')) {
            last_key = tmp.replace(/\["|"\]/g, "");
          } else {
            last_key = Number(tmp.replace(/\[|\]/g, ""));
          }
          last_path = path.substring(0, path.lastIndexOf(tmp));
        }
        if (!matches) {
          matches = path.split(".");
          if (matches && matches.length > 0) {
            last_key = matches[matches.length - 1];
            last_path = path.replace("." + last_key, "");
          }
        }
        return [last_path, last_key];
      }

      convertPathToBracketNotation(path) {
        if (!path) return "";
        return path.replace(/\.[\d\w\-\_\$@]+/g, function (match) {
          return '["' + match.slice(1) + '"]';
        });
      }

      paths_sort(paths_arr, key_name = null, reverse = false) {
        if (!Array.isArray(paths_arr)) {
          throw new Error("paths_arr must be an array");
        }
        if (paths_arr.length === 0) return;
        let tmp_paths_arr = paths_arr;
        if (!key_name) {
          key_name = "path";
          if (typeof paths_arr[0] !== "string")
            throw new Error("paths_arr must be a string array");
          tmp_paths_arr = [];
          paths_arr.forEach((path) => {
            tmp_paths_arr.push({
              path: path,
            });
          });
        }
        const reverse_factor = reverse ? -1 : 1;
        tmp_paths_arr.sort((a, b) => {
          function get_sort_key(obj) {
            if (!obj.sort_keys) {
              const reg = /\["?(.*?)"?\]/g;
              let matches = [];
              let match;
              while ((match = reg.exec(obj[key_name]))) {
                if (!match[0].startsWith('["')) {
                  if (isNaN(match[1]))
                    throw new Error("array index must be a number");
                  match[1] = parseInt(match[1]);
                }
                matches.push(match[1]);
              }
              obj.sort_keys = matches;
            }
          }
          if (a[key_name] === b[key_name]) return 0;
          get_sort_key(a);
          get_sort_key(b);
          const a_sort_keys = a.sort_keys;
          const b_sort_keys = b.sort_keys;
          if (a_sort_keys.length !== b_sort_keys.length) {
            return (b_sort_keys.length - a_sort_keys.length) * reverse_factor;
          }
          for (let i = 0; i < a_sort_keys.length; i++) {
            if (a_sort_keys[i] !== b_sort_keys[i]) {
              return (
                (b_sort_keys[i] > a_sort_keys[i] ? 1 : -1) * reverse_factor
              );
            }
          }
          return 0;
        });
        if (paths_arr !== tmp_paths_arr) {
          paths_arr.length = 0;
          tmp_paths_arr.forEach((path_info) => {
            paths_arr.push(path_info.path);
          });
        }
      }

      obj_process(json_obj, express_list, traverse_all = false) {
        if (typeof json_obj !== "object") {
          log("obj_process target is not an object", express_list, -1);
          return;
        }
        if (typeof express_list === "function") {
          try {
            express_list = express_list(json_obj);
            if (
              !express_list ||
              (Array.isArray(express_list) && express_list.length === 0)
            )
              return;
          } catch (error) {
            log("obj_process express_list function execution error", error, -1);
            return;
          }
        }
        const data_this = this;
        const abs_path_info_list = [];
        const relative_path_info_list = [];
        const relative_path_list = [];
        const relative_short_path_list = [];
        if (!json_obj || !express_list) return;
        const is_array_obj = Array.isArray(json_obj);
        try {
          express_list.forEach((express) => {
            if (!express) return;
            let reg;
            const express_type = typeof express;
            let matches;
            let conditions;
            reg =
              /^(abs:)?(.*?)(=\-|~=|=\+|=)(\(?([^ ][\s\S]*?)\)?)?( ([\s\S]*))?$/;
            if (express_type === "string") {
              matches = express.match(reg);
            } else {
              matches = express.value.match(reg);
              conditions = express.conditions;
            }
            const abs = matches[1];
            let path = matches[2];
            const operator = matches[3];
            let value = matches[4];
            const condition = matches[7];
            const path_extral_match = path.match(/\/\..*$|\.+$|\.\(.*$/);
            let path_extral;
            if (path_extral_match) {
              path_extral = path_extral_match[0];
              path = path.replace(path_extral, "");
            }
            let value_mode;
            if (express_type === "string") {
              const mode_match = value?.match(/^\((.*)\)$/);
              if (mode_match) {
                const mode_info = mode_match[1].split(",");
                value = mode_info[1];
                const mode = mode_info[0];
                mode_info.shift();
                mode_info.shift();
                value_mode = {
                  mode: mode,
                  params: mode_info,
                };
              }
              if (condition) {
                const tmp_conditions = condition
                  ? condition.split(this.condition_split_and_tag)
                  : [];
                conditions = {};
                for (let index = 0; index < tmp_conditions.length; index++) {
                  conditions["value" + index] = tmp_conditions[index].split(
                    this.condition_split_or_tag
                  );
                }
              }
            }
            matches = path.match(/\[([\*\d\-,]*)\]$/);
            let array_index;
            if (matches) {
              path = path.replace(/\[([\*\d\-,]*)\]$/, "");
              array_index = matches[1];
            }
            if (abs) {
              add_data_to_abs_path({
                path: `json_obj${is_array_obj ? "" : "."}` + path,
                express: express,
                relative_path: path,
                operator: operator,
                value: value,
                condition: conditions,
                array_index: array_index,
                path_extral: path_extral,
                value_mode: value_mode,
              });
            } else {
              relative_path_list.push(path);
              const tmp_short_path = path.split(".").pop();
              relative_short_path_list.push(tmp_short_path);
              relative_path_info_list.push({
                express: express,
                path: path,
                operator: operator,
                value: value,
                value_mode: value_mode,
                conditions: conditions,
                array_index: array_index,
                path_extral: path_extral,
              });
            }
          });
          if (relative_path_list.length > 0) {
            const dec_list = [];
            const dec_index_list = [];
            obj_property_traverse(
              json_obj,
              "",
              {
                short_keys: relative_short_path_list,
                real_keys: relative_path_list,
              },
              dec_list,
              dec_index_list,
              traverse_all
            );
            for (let i = 0; i < dec_index_list.length; i++) {
              const real_index = dec_index_list[i];
              const real_path_info = relative_path_info_list[real_index];
              const tmp_path = "json_obj" + dec_list[i];
              add_data_to_abs_path({
                path: tmp_path,
                express: real_path_info.express,
                relative_path: real_path_info.path,
                operator: real_path_info.operator,
                value: real_path_info.value,
                condition: real_path_info.conditions,
                array_index: real_path_info.array_index,
                path_extral: real_path_info.path_extral,
                value_mode: real_path_info.value_mode,
              });
            }
          }
          try {
            this.paths_sort(abs_path_info_list, "deal_path");
          } catch (error) {
            abs_path_info_list.sort((a, b) => (a < b ? 1 : -1));
          }
          for (let path_info of abs_path_info_list) {
            if (!this.obj_conditional(path_info, json_obj)) continue;
            if (this.obj_filter && this.obj_filter(path_info, json_obj))
              continue;
            obj_modify(json_obj, path_info);
          }
        } catch (error) {
          log("obj_process processing failed", error, -1);
        }

        function add_data_to_abs_path(params) {
          let {
            path,
            express,
            relative_path,
            operator,
            value,
            condition,
            array_index,
            path_extral,
            value_mode,
          } = params;
          let tmp;
          path = data_this.convertPathToBracketNotation(path);
          if (array_index === undefined) {
            tmp = {};
            path = path;
            tmp.path = path;
            tmp.relative_path = relative_path;
            tmp.operator = operator;
            tmp.value = value;
            tmp.value_mode = value_mode;
            tmp.condition = condition;
            tmp.path_extral = path_extral;
            tmp.express = express;
            add_path(tmp);
            return;
          }
          let array_index_list = [];
          if (array_index === "*") {
            let array_length;
            try {
              array_length =
                data_this.string_to_value(json_obj, path)?.length || 0;
              if (!array_length) return;
            } catch (error) {
              log(
                "obj_process failed to get array length --->" + path,
                error,
                -1
              );
              return;
            }
            array_index_list = Array.from(
              { length: array_length },
              (_, i) => i
            );
          } else if (array_index.includes(",")) {
            let is_error = false;
            array_index_list = array_index.split(",").map((item) => {
              if (is_error) return;
              if (isNaN(item)) {
                is_error = true;
                return;
              }
              return Number(item);
            });
            if (is_error) {
              return log(
                "obj_process array index format error --->" + path,
                -1
              );
            }
          } else if (array_index.includes("-")) {
            const index_arr = array_index.split("-");
            if (index_arr.length !== 2)
              return log(
                "obj_process array index format error --->" + path,
                -1
              );
            const start = Number(index_arr[0]);
            const end = Number(index_arr[1]);
            if (isNaN(start) || isNaN(end)) {
              return log(
                "obj_process array index format error --->" + path,
                -1
              );
            }
            array_index_list = Array.from(
              { length: end - start + 1 },
              (_, i) => start + i
            );
          } else if (!isNaN(array_index)) {
            array_index_list = [array_index];
          } else {
            return log("obj_process array index format error --->" + path, -1);
          }
          for (
            let tmp_index = array_index_list.length - 1;
            tmp_index >= 0;
            tmp_index--
          ) {
            tmp = {};
            tmp.path = path + "[" + array_index_list[tmp_index] + "]";
            tmp.operator = operator;
            tmp.value = value;
            tmp.value_mode = value_mode;
            tmp.condition = condition;
            tmp.path_extral = path_extral;
            tmp.relative_path = relative_path;
            tmp.express = express;
            add_path(tmp);
          }
          function add_path(path_info) {
            path_info.deal_path = path_extral
              ? data_this.get_relative_path(path, path_extral)
              : path_info.path;
            abs_path_info_list.push(path_info);
          }
        }

        function obj_property_traverse(
          obj,
          cur_path,
          dec_infos,
          dec_list,
          dec_index_list,
          traverse_all = false
        ) {
          if (Array.isArray(obj)) {
            obj.forEach((tmp_obj, index) => {
              const tmp_path = cur_path + "[" + index + "]";
              if (!tmp_obj || typeof tmp_obj !== "object") return;
              obj_property_traverse(
                tmp_obj,
                tmp_path,
                dec_infos,
                dec_list,
                dec_index_list,
                traverse_all
              );
            });
            return;
          }
          Object.keys(obj).forEach((key) => {
            const tmp_path = cur_path + "." + key;
            let deal = false;
            for (let i = 0; i < dec_infos["short_keys"].length; i++) {
              if (dec_infos["short_keys"][i] === key) {
                const len = dec_infos["real_keys"][i].length;
                if (
                  tmp_path.slice(tmp_path.length - len) ===
                  dec_infos["real_keys"][i]
                ) {
                  dec_list.push(tmp_path);
                  dec_index_list.push(i);
                  if (!deal && traverse_all && typeof obj[key] === "object") {
                    obj_property_traverse(
                      obj[key],
                      tmp_path,
                      dec_infos,
                      dec_list,
                      dec_index_list,
                      traverse_all
                    );
                  }
                  deal = true;
                }
              }
            }
            const value = obj[key];
            if (deal || !value || typeof value !== "object") return;
            obj_property_traverse(
              value,
              tmp_path,
              dec_infos,
              dec_list,
              dec_index_list,
              traverse_all
            );
          });
        }

        function obj_modify(json_obj, path_info) {
          const path = path_info["deal_path"];
          const operator = path_info["operator"];
          let value = path_info["value"];
          const [last_path, last_key] = data_this.get_lastPath_and_key(path);
          const last_obj = data_this.string_to_value(json_obj, last_path);
          if (!last_obj) {
            debugger;
            return log(
              "obj_modify failed, object not found --->" + path_info,
              -1
            );
          }
          if (operator === "=-") {
            const is_array = typeof last_key === "number";
            if (is_array) last_obj.splice(last_key, 1);
            else delete last_obj[last_key];
            log("Based on: " + path_info.express, "obj_process");
            log("Deleted property -->" + path, "obj_process");
            return;
          }
          if (operator === "=") {
            value = data_this.value_parse(value, path_info, json_obj);
            last_obj[last_key] = value;
            log("Based on: " + path_info.express, "obj_process");
            log("Modified property -->" + path, "obj_process");
          }
          const dec_obj = last_obj[last_key];
          if (!dec_obj) {
            return log(
              "obj_modify failed, object not found --->" + path_info,
              -1
            );
          }
          if (operator === "=+") {
            value = data_this.value_parse(value, path_info, json_obj);
            if (dec_obj === null || dec_obj === undefined)
              throw new Error("dec_obj is null");
            let type_ = typeof dec_obj;
            if (Array.isArray(dec_obj)) type_ = "array";
            if (type_ === "array") {
              const mode_info = path_info.value_mode;
              if (mode_info) {
                try {
                  mode_info.mode === "arr_insert" &&
                    last_obj[last_key].splice(
                      Number(mode_info.params[0]),
                      0,
                      value
                    );
                } catch (error) {
                  log(error, -1);
                }
              } else {
                last_obj[last_key].push(value);
              }
            }
            if (type_ === "string" || type_ === "number")
              last_obj[last_key] = last_obj[last_key] + value;
            log("Based on: " + path_info.express, "obj_process");
            log("Modified property -->" + path, "obj_process");
          }
          if (operator === "~=") {
            const search_value = value.split(SPLIT_TAG)[0];
            const replace_value = value.split(SPLIT_TAG)[1];
            last_obj[last_key] = dec_obj.replace(
              new RegExp(search_value, "g"),
              replace_value
            );
            log("Based on: " + path_info.express, "obj_process");
            log("Modified property -->" + path, "obj_process");
          }
        }
      }

      path_process(json_obj, path) {
        if (path.includes("[-")) {
          const match = path.match(/\[(-\d+)\]/);
          const index = parseInt(match[1]);
          const dec_obj_path = path.slice(0, match.index);
          const array_length = this.string_to_value(
            json_obj,
            dec_obj_path + '["length"]'
          );
          if (!array_length) return path;
          const real_index = array_length + index;
          path = path.replace(`[${index}`, `[${real_index}`);
          return this.path_process(json_obj, path);
        }
        return path;
      }

      value_conditional(value, condition_express) {
        const reg =
          /(\$text|\$value|\$exist|\$notexist)?((>=|<=|>|<|!~=|!=|~=|=))?(.*)/;
        const match = condition_express.match(reg);
        const condition_type = match[1] || "$text";
        const condition_operator = match[2];
        const condition_test_value = match[4];
        const operator_reg = /(>=|<=|>|<|!~=|!=|~=|=)?(.*)$/;
        if (condition_type === "$value") {
          if (![">=", "<=", ">", "<", "="].includes(condition_operator))
            return false;
          const split_tag =
            (condition_test_value.includes(this.value_split_or_tag) &&
              this.value_split_or_tag) ||
            this.value_split_and_tag;
          const condition_test_value_arr =
            condition_test_value.split(split_tag);
          let result;
          for (let test_value of condition_test_value_arr) {
            const operator_match = test_value.match(operator_reg);
            const operator =
              (operator_match && operator_match[1]) || condition_operator;
            test_value = operator_match && operator_match[2];
            if (isNaN(test_value)) {
              if (split_tag === this.value_split_and_tag) return false;
              else continue;
            }
            test_value = parseInt(test_value);
            if (operator === "=") result = test_value === value;
            if (operator === ">=") result = value >= test_value;
            if (operator === "<=") result = value <= test_value;
            if (operator === ">") result = value > test_value;
            if (operator === "<") result = value < test_value;
            if (!result) {
              if (split_tag === this.value_split_and_tag) return false;
              else continue;
            }
            return true;
          }
        }
        if (condition_type === "$exist") {
          return value !== undefined && value !== null;
        }
        if (condition_type === "$notexist") {
          return value === undefined || value === null;
        }
        if (condition_type === "$text") {
          let split_tag;
          let condition_test_value_arr;
          if (["!~=", "~="].includes(condition_operator)) {
            split_tag = this.value_split_and_tag;
            condition_test_value_arr = [condition_test_value];
          } else {
            split_tag =
              (condition_test_value.includes(this.value_split_or_tag) &&
                this.value_split_or_tag) ||
              this.value_split_and_tag;
            condition_test_value_arr = condition_test_value.split(split_tag);
          }
          let result;
          if (typeof value === "object") value = JSON.stringify(value);
          for (let test_value of condition_test_value_arr) {
            const operator_match = test_value.match(operator_reg);
            const operator =
              (operator_match && operator_match[1]) || condition_operator;
            test_value = (operator_match && operator_match[2]) || test_value;
            if (operator === "!=") result = test_value !== value;
            if (operator === "=") result = test_value === value;
            if (operator === "~=") result = new RegExp(test_value).test(value);
            if (operator === "!~=")
              result = !new RegExp(test_value).test(value);
            if (operator === ">=") result = value.length >= test_value.length;
            if (operator === ">") result = value.length > test_value.length;
            if (operator === "<=") result = value.length <= test_value.length;
            if (operator === ">") result = value.length > test_value.length;
            if (!result) {
              if (split_tag === this.value_split_and_tag) return false;
              else continue;
            }
            return true;
          }
        }
        return false;
      }

      obj_conditional(express_info, json_obj) {
        if (!express_info["condition"]) return true;
        const condition_infos = express_info["condition"];
        for (let condition_list of Object.values(condition_infos)) {
          let result = false;
          for (let condition of condition_list) {
            const reg = /^([a-zA-Z_0-9\/\-\.@\[\]]*)?(.*)/;
            const match = condition.match(reg);
            let condition_path = match[1];
            let mod;
            if (condition_path) {
              if (condition_path.startsWith("/")) {
                mod = "child";
              } else if (condition_path.startsWith(".")) {
                mod = "parent";
              } else if (condition_path.startsWith("@")) {
                mod = "global";
              } else {
                mod = "other";
              }
            } else {
              condition_path = express_info.path;
            }
            const conditional_express = match[2];
            if (["child", "parent"].includes(mod)) {
              condition_path = this.get_relative_path(
                express_info.path,
                condition_path
              );
            }
            if (mod === "other") {
              condition_path = this.get_relative_path(
                "json_obj",
                "/." + condition_path
              );
            }
            if (mod === "global") {
              condition_path = condition_path.replace(
                "@",
                this.limit_eval ? "unsafeWindow." : ""
              );
            }
            let condition_value;
            try {
              condition_path = this.path_process(json_obj, condition_path);
              condition_value = this.string_to_value(
                mod === "global" ? unsafeWindow : json_obj,
                condition_path
              );
            } catch (error) {
              continue;
            }
            result = this.value_conditional(
              condition_value,
              conditional_express
            );
            if (result) {
              express_info.condition_value = condition_value;
              express_info.conform_value_path = condition_path;
              log(
                "Condition satisfied -->",
                condition,
                typeof condition_value === "object"
                  ? "[object Object]"
                  : condition_value,
                "obj_process"
              );
              break;
            }
          }
          if (!result) return false;
        }
        return true;
      }
    }
    return new DATA_PROCESS();
  }

  /* ============ SponsorBlock integration ============ */

  const SB_API = "https://api.sponsor.ajay.app/api/skipSegments";
  const SB_SKIP_CATEGORIES = ["sponsor"];
  const SB_SKIP_PADDING = 0.35;

  const sb_segmentCache = new Map();
  let sb_currentVideoId = null;
  let sb_currentVideoEl = null;

  function sb_log(...args) {
    if (!open_debugger) return;
    log("[SmartSponsorBlock]", ...args, 0);
  }

  function sb_getVideoId() {
    try {
      const url = new URL(location.href);
      const v = url.searchParams.get("v");
      if (v) return v;
      const shorts = location.pathname.match(/\/shorts\/([^/?#]+)/);
      if (shorts) return shorts[1];
      const meta = unsafeWindow.document.querySelector(
        'meta[itemprop="videoId"]'
      );
      if (meta) return meta.content;
    } catch (e) {
      sb_log("getVideoId error", e);
    }
    return null;
  }

  function sb_getVideoElement() {
    return unsafeWindow.document.querySelector("video");
  }

  function sb_fetchSegments(videoId, callback) {
    if (!videoId) {
      callback([]);
      return;
    }

    if (sb_segmentCache.has(videoId)) {
      callback(sb_segmentCache.get(videoId));
      return;
    }

    const url =
      `${SB_API}?videoID=${encodeURIComponent(videoId)}` +
      `&categories=${encodeURIComponent(JSON.stringify(SB_SKIP_CATEGORIES))}`;

    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: { Accept: "application/json" },
      onload: (res) => {
        try {
          const data = JSON.parse(res.responseText);
          const segments = Array.isArray(data)
            ? data
                .map((d) => ({
                  start: d.segment[0],
                  end: d.segment[1],
                  category: d.category,
                }))
                .filter((s) => s.end > s.start)
                .sort((a, b) => a.start - b.start)
            : [];

          const merged = [];
          for (const s of segments) {
            const last = merged[merged.length - 1];
            if (!last || s.start > last.end) {
              merged.push({ ...s });
            } else {
              last.end = Math.max(last.end, s.end);
            }
          }

          sb_segmentCache.set(videoId, merged);
          sb_log("Loaded segments for", videoId, merged);
          callback(merged);
        } catch (e) {
          sb_log("Failed to parse SponsorBlock response", e);
          callback([]);
        }
      },
      onerror: () => {
        sb_log("GM_xmlhttpRequest error");
        callback([]);
      },
      ontimeout: () => {
        sb_log("GM_xmlhttpRequest timeout");
        callback([]);
      },
    });
  }

  function sb_attachSkipper(videoId) {
    const video = sb_getVideoElement();
    if (!video || !videoId) return;

    if (video === sb_currentVideoEl && videoId === sb_currentVideoId) return;

    sb_log("Attaching skipper to video", videoId);
    sb_currentVideoEl = video;
    sb_currentVideoId = videoId;

    sb_fetchSegments(videoId, (segments) => {
      if (!segments.length) {
        sb_log("No sponsor segments for", videoId);
        return;
      }

      let nextIndex = 0;

      const skipIfNeeded = () => {
        const t = video.currentTime;

        while (nextIndex < segments.length) {
          const seg = segments[nextIndex];
          if (t >= seg.start && t < seg.end) {
            video.currentTime = +(seg.end + SB_SKIP_PADDING).toFixed(2);
            sb_log(`Skipped sponsor: ${seg.start} → ${seg.end}`);
            nextIndex++;
          } else if (t < seg.start) {
            break;
          } else {
            nextIndex++;
          }
        }
      };

      const onSeeking = () => {
        nextIndex = segments.findIndex((s) => video.currentTime < s.end);
        if (nextIndex === -1) nextIndex = segments.length;

        const inside = segments.find(
          (s) => video.currentTime >= s.start && video.currentTime < s.end
        );

        if (inside) {
          video.currentTime = +(inside.end + SB_SKIP_PADDING).toFixed(2);
          sb_log("Seeked into sponsor, skipped");
          nextIndex = segments.indexOf(inside) + 1;
        }
      };

      video.addEventListener("timeupdate", skipIfNeeded);
      video.addEventListener("seeking", onSeeking);

      const watcher = unsafeWindow.setInterval(() => {
        if (
          !unsafeWindow.document.contains(video) ||
          sb_getVideoElement() !== video
        ) {
          video.removeEventListener("timeupdate", skipIfNeeded);
          video.removeEventListener("seeking", onSeeking);
          unsafeWindow.clearInterval(watcher);
          sb_currentVideoEl = null;
          sb_currentVideoId = null;
          sb_log("Detached skipper from old video element");
        }
      }, 1500);
    });
  }

  function init_sponsorblock() {
    if (user_data.sponsorblock === "off") {
      sb_log("SponsorBlock disabled by user config");
      return;
    }

    if (
      ![
        "yt_watch",
        "mobile_yt_watch",
        "yt_shorts",
        "mobile_yt_shorts",
        "yt_music_watch",
      ].includes(page_type)
    ) {
      return;
    }

    const videoId = sb_getVideoId();
    if (!videoId) {
      sb_log("No videoId found for current page_type", page_type);
      return;
    }

    unsafeWindow.setTimeout(() => {
      sb_attachSkipper(videoId);
    }, 800);
  }

  function init_create_button_observer() {
    const header =
      unsafeWindow.document.querySelector("ytd-masthead") ||
      unsafeWindow.document.querySelector(
        "ytm-app > ytm-mobile-topbar-renderer"
      );
    if (!header) return;

    const observer = new MutationObserver(() => {
      hide_create_button();
    });

    observer.observe(header, {
      childList: true,
      subtree: true,
    });

    hide_create_button();

    unsafeWindow.__yt_create_button_observer = observer;
  }

  /* ====== GLOBAL SHORTS BLOCKER ====== */

  function init_global_shorts_blocker() {
    const processedElements = new WeakSet();

    function hideElement(element) {
      if (!element || processedElements.has(element)) return;
      element.style.display = "none";
      processedElements.add(element);
    }

    function blockShorts() {
      if (user_data.global_shorts_block !== "on") {
        hide_shorts_sections_if_disabled();
        return;
      }

      const selectors = [
        "ytd-reel-shelf-renderer",
        'a[title="Shorts"]',
        "ytm-shorts-lockup-view-model-v2",
        "ytm-shorts-lockup-view-model",
        "yt-chip-cloud-chip-renderer",
      ];

      // Main selectors
      document.querySelectorAll(selectors.join(",")).forEach((element) => {
        if (element.matches("yt-chip-cloud-chip-renderer")) {
          const chipText = element.querySelector(".ytChipShapeChip");
          if (chipText?.textContent.trim() === "Shorts") {
            hideElement(element);
          }
        } else {
          hideElement(element);
        }
      });

      // Links to /shorts/ inside regular grids
      document
        .querySelectorAll('a[href^="/shorts/"]:not([data-processed])')
        .forEach((link) => {
          const videoRenderer = link.closest("ytd-video-renderer");
          if (videoRenderer) {
            hideElement(videoRenderer);
          }
          link.setAttribute("data-processed", "true");
        });

      // Grid shelf items on mobile etc.
      document
        .querySelectorAll(
          ".ytGridShelfViewModelGridShelfItem:not([data-processed])"
        )
        .forEach((item) => {
          if (
            item.querySelector(
              'ytm-shorts-lockup-view-model-v2, a[href^="/shorts/"]'
            )
          ) {
            hideElement(item);
          }
          item.setAttribute("data-processed", "true");
        });

      document
        .querySelectorAll("grid-shelf-view-model:not([data-processed])")
        .forEach((shelf) => {
          const hasShorts =
            shelf.querySelector("ytm-shorts-lockup-view-model-v2") ||
            shelf
              .querySelector(
                '.shelf-header-layout-wiz__title span[role="text"]'
              )
              ?.textContent?.includes("Shorts");
          if (hasShorts) {
            hideElement(shelf);
          }
          shelf.setAttribute("data-processed", "true");
        });

      // Fallback: any rich section whose header span contains "Shorts"
      document
        .querySelectorAll("span:not([data-processed])")
        .forEach((span) => {
          if (span.textContent.includes("Shorts")) {
            const richSection = span.closest(
              "#content.ytd-rich-section-renderer"
            );
            if (richSection) {
              hideElement(richSection);
            }
          }
          span.setAttribute("data-processed", "true");
        });

      hide_shorts_sections_if_disabled();
    }

    const observer = new MutationObserver(function (mutations) {
      let shouldProcess = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }
      if (shouldProcess) {
        blockShorts();
      }
    });

    // Initial run
    blockShorts();

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    // Expose for debugging / manual trigger if needed
    unsafeWindow.__yt_global_shorts_blocker = {
      reRun: blockShorts,
    };
  }

  /* ====== 2666 WATCH BUTTON HIDER PANEL ====== */

  function apply_hide_buttons_css() {
    const rules = [];

    if (user_data.hide_all_buttons === "on") {
      rules.push("ytd-watch-metadata #actions { display: none !important; }");
    } else {
      if (user_data.hide_ask_button === "on") {
        rules.push('button[aria-label="Ask"] { display: none !important; }');
        rules.push(
          "button .yt-spec-button-shape-next__button-text-content:has(> span, > div, > *) { }"
        );
      }

      if (user_data.hide_download_button === "on") {
        rules.push(
          "ytd-download-button-renderer { display: none !important; }"
        );
        rules.push(
          'button[aria-label="Download"] { display: none !important; }'
        );
      }

      if (user_data.hide_share_button === "on") {
        rules.push(
          "#actions #menu ytd-menu-renderer > yt-button-view-model { display: none !important; }"
        );
        rules.push('button[aria-label="Share"] { display: none !important; }');
      }

      if (user_data.hide_thanks_button === "on") {
        rules.push('button[aria-label="Thanks"] { display: none !important; }');
      }

      if (user_data.hide_clip_button === "on") {
        rules.push('button[aria-label="Clip"] { display: none !important; }');
      }

      if (user_data.hide_more_actions_button === "on") {
        rules.push(
          "yt-button-shape#button-shape { display: none !important; }"
        );
        rules.push(
          'button[aria-label="More actions"] { display: none !important; }'
        );
      }

      if (user_data.hide_save_button === "on") {
        rules.push(
          'button[aria-label="Save to playlist"] { display: none !important; }'
        );
      }

      if (user_data.hide_subscribe_button === "on") {
        rules.push("#subscribe-button { display: none !important; }");
      }

      if (user_data.hide_like_bar === "on") {
        rules.push(
          ".ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper { display: none !important; }"
        );
      }

      if (user_data.hide_join_button === "on") {
        rules.push("#sponsor-button { display: none !important; }");
      }
    }

    let css = rules.join("\n");
    let styleEl = unsafeWindow.document.getElementById("yt-hide-buttons-style");
    if (!styleEl) {
      styleEl = unsafeWindow.document.createElement("style");
      styleEl.id = "yt-hide-buttons-style";
      unsafeWindow.document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }

  function display_hide_buttons_win() {
    const existing = unsafeWindow.document.getElementById(
      "yt-hide-buttons-popup"
    );
    if (existing) existing.remove();

    const css = `
#yt-hide-buttons-popup{
  z-index:999999999;
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  padding:0;
  background-color:#ffffff;
  border:1px solid #3498db;
  border-radius:5px;
  box-shadow:0 0 10px rgba(0,0,0,0.3);
  width:260px;
  max-height:80vh;
  display:flex;
  flex-direction:column;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#yt-hide-buttons-header{
  cursor:move;
  user-select:none;
  padding:4px 8px;
  background-color:#3498db;
  color:#ffffff;
  border-radius:4px 4px 0 0;
  font-weight:bold;
  font-size:13px;
}

#yt-hide-buttons-topbar{
  flex:0 0 auto;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:6px 8px 4px 8px;
  background-color:#f5f7fb;
  border-bottom:1px solid #e0e4f0;
}

#yt-hide-buttons-close{
  cursor:pointer;
  background-color:#3498db;
  color:#ffffff;
  border:none;
  padding:4px 12px;
  border-radius:999px;
  font-size:12px;
}

#yt-hide-buttons-body{
  flex:1 1 auto;
  overflow-y:auto;
  padding:6px 8px 8px 8px;
}

.yt-hb-row{
  display:flex;
  align-items:center;
  gap:6px;
  margin:2px 0;
}

.yt-hb-row label{
  font-size:13px;
}

.yt-hb-row.disabled label{
  color:#999;
}
`;
    const style = unsafeWindow.document.createElement("style");
    style.textContent = css;
    unsafeWindow.document.head.appendChild(style);

    const popup = unsafeWindow.document.createElement("div");
    popup.id = "yt-hide-buttons-popup";

    const header = unsafeWindow.document.createElement("div");
    header.id = "yt-hide-buttons-header";
    header.textContent = "Watch buttons";

    const topbar = unsafeWindow.document.createElement("div");
    topbar.id = "yt-hide-buttons-topbar";
    const closeBtn = unsafeWindow.document.createElement("button");
    closeBtn.id = "yt-hide-buttons-close";
    closeBtn.textContent = "Close";
    topbar.appendChild(closeBtn);

    const body = unsafeWindow.document.createElement("div");
    body.id = "yt-hide-buttons-body";

    function row(id, labelText) {
      const div = unsafeWindow.document.createElement("div");
      div.className = "yt-hb-row";
      const input = unsafeWindow.document.createElement("input");
      input.type = "checkbox";
      input.id = id;
      const label = unsafeWindow.document.createElement("label");
      label.htmlFor = id;
      label.textContent = labelText;
      div.append(input, label);
      return { div, input };
    }

    const rows = [
      row("hb_download", "Download"),
      row("hb_ask", "Ask (Gemini)"),
      row("hb_share", "Share"),
      row("hb_thanks", "Thanks"),
      row("hb_clip", "Clip"),
      row("hb_save", "Save to playlist"),
      row("hb_more", "More actions"),
      row("hb_subscribe", "Subscribe+Bell"),
      row("hb_likebar", "Like/Dislike bar"),
      row("hb_join", "Join"),
      row("hb_livechat_replay", "Live chat replay teaser"),
    ];

    for (const { div } of rows) {
      body.appendChild(div);
    }

    popup.append(header, topbar, body);
    unsafeWindow.document.body.appendChild(popup);

    const map = [
      ["hb_download", "hide_download_button"],
      ["hb_ask", "hide_ask_button"],
      ["hb_share", "hide_share_button"],
      ["hb_thanks", "hide_thanks_button"],
      ["hb_clip", "hide_clip_button"],
      ["hb_more", "hide_more_actions_button"],
      ["hb_save", "hide_save_button"],
      ["hb_subscribe", "hide_subscribe_button"],
      ["hb_likebar", "hide_like_bar"],
      ["hb_join", "hide_join_button"],
    ];

    const checkboxById = {};
    for (const { input } of rows) {
      checkboxById[input.id] = input;
    }

    for (const [checkboxId, key] of map) {
      const input = checkboxById[checkboxId];
      input.checked = user_data[key] === "on";
    }

    // Live chat replay section
    if (user_data.watch_page_config?.hide_live_chat_replay === "on") {
      checkboxById["hb_livechat_replay"].checked = true;
    }

    for (const [checkboxId, key] of map) {
      const input = checkboxById[checkboxId];
      input.addEventListener("change", () => {
        user_data[key] = input.checked ? "on" : "off";
        user_data_api.set();
        apply_hide_buttons_css();
      });
    }

    checkboxById["hb_livechat_replay"].addEventListener("change", () => {
      user_data.watch_page_config.hide_live_chat_replay = checkboxById[
        "hb_livechat_replay"
      ].checked
        ? "on"
        : "off";
      user_data_api.set();
      if (user_data.watch_page_config.hide_live_chat_replay === "on") {
        hide_teaser_carousel();
      } else {
        const n = unsafeWindow.document.querySelector("#teaser-carousel");
        if (n) n.style.display = "";
      }
    });

    function close() {
      popup.remove();
    }
    closeBtn.addEventListener("click", close);
    make_popup_draggable(popup, header);
  }
})();
