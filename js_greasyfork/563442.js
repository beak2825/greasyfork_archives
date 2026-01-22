// ==UserScript==
// @name         cela-auto
// @namespace    https://github.com/Moker32/
// @version      4.1.0
// @description  中国干部网络学院自动学习脚本，支持浦东分院等多种环境，采用状态机驱动的极简高效架构。模块化重构版本。
// @author       Moker32
// @license      GPL-3.0-or-later
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @match        *://cela.e-celap.cn/*
// @match        *://pudong.e-celap.cn/*
// @match        *://pd.cela.cn/*
// @match        *://*.e-celap.cn/*
// @match        *://www.cela.gov.cn/*
// @match        *://cela.gwypx.com.cn/*
// @match        *://cela.cbead.cn/*
// @connect      cela.e-celap.cn
// @connect      pudong.e-celap.cn
// @connect      pd.cela.cn
// @connect      cela.gwypx.com.cn
// @connect      cela.cbead.cn
// @connect      www.cela.gov.cn
// @connect      zpyapi.shsets.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563442/cela-auto.user.js
// @updateURL https://update.greasyfork.org/scripts/563442/cela-auto.meta.js
// ==/UserScript==
(function(exports) {
    "use strict";
    const CONSTANTS = {
        EVENTS: {
            LOG: "log",
            STATUS_UPDATE: "statusUpdate",
            PROGRESS_UPDATE: "progressUpdate",
            STATISTICS_UPDATE: "statisticsUpdate",
            LEARNING_START: "learningStart",
            LEARNING_STOP: "learningStop",
            COURSE_START: "courseStart",
            COURSE_COMPLETE: "courseComplete",
            COURSE_SKIP: "courseSkip",
            COURSE_ERROR: "courseError",
            PROGRESS_REPORT: "progressReport",
            PROGRESS_SUCCESS: "progressSuccess",
            PROGRESS_ERROR: "progressError",
            ERROR: "error",
            FATAL_ERROR: "fatalError"
        },
        LEARNING_STATES: {
            IDLE: "idle",
            PREPARING: "preparing",
            LEARNING: "learning",
            COMPLETED: "completed",
            FAILED: "failed",
            SKIPPED: "skipped"
        },
        FLOW_RESULTS: {
            WAITING_FOR_USER: "WAITING_FOR_USER"
        },
        COMPLETION_THRESHOLD: 80,
        SKIP_COMPLETED_COURSES: true,
        API_ENDPOINTS: {
            GET_PLAY_TREND: "/inc/nc/course/play/getPlayTrend",
            PULSE_SAVE_RECORD: "/inc/nc/course/play/pulseSaveRecord",
            GET_STUDY_RECORD: "/inc/nc/course/getStudyRecord",
            GET_COURSEWARE_DETAIL: "/inc/nc/course/play/getCoursewareDetail",
            GET_PACK_BY_ID: "/inc/nc/pack/getById",
            GET_COURSE_LIST: "/api/course/list"
        },
        SELECTORS: {
            PANEL: "#api-learner-panel",
            STATUS_DISPLAY: "#learner-status",
            PROGRESS_INNER: "#learner-progress-inner",
            TOGGLE_BTN: "#toggle-learning-btn",
            LOG_CONTAINER: "#api-learner-panel .log-container",
            STAT_TOTAL: "#stat-total",
            STAT_COMPLETED: "#stat-completed",
            STAT_LEARNED: "#stat-learned",
            STAT_FAILED: "#stat-failed",
            STAT_SKIPPED: "#stat-skipped",
            APP: "#app"
        },
        STORAGE_KEYS: {
            TOKEN: "token",
            AUTH_TOKEN: "authToken",
            ACCESS_TOKEN: "access_token",
            USER_ID: "userId",
            USER_ID_ALT: "user_id"
        },
        COURSE_SELECTORS: [ ".dsf-many-schedule-course-list-row", ".dsf_nc_pd_special_item", '[class*="course"]', "[data-course]", ".course-item", ".lesson-item", ".el-card", ".el-card__body", ".course-card", ".course-box", ".nc-course-item", ".study-item", ".learn-item", '[class*="item"]', '[class*="card"]', "[data-id]", ".pudong-course", ".pd-course", ".dsf-course", ".dsjy_card", ".item_content", ".class-item-desc" ],
        VIDEO_SELECTORS: [ "video", "[api-base-url]", '[class*="video"]', 'iframe[src*="play"]' ],
        COOKIE_PATTERNS: {
            USER_ID: /userId=([^;]+)/,
            TOKEN: /token=([^;]+)/,
            P_PARAM: /_p=([^;]+)/
        },
        TIME_FORMATS: {
            DEFAULT_DURATION: 1800
        },
        UI_LIMITS: {
            MAX_LOG_ENTRIES: 50,
            LOG_FLUSH_DELAY: 100
        },
        ENVIRONMENTS: {
            PORTAL: {
                name: "中央门户",
                hostnames: [ "www.cela.gov.cn" ],
                pathPatterns: [ "/home" ],
                features: {
                    type: "traditional",
                    framework: "jquery",
                    courseContainer: "#courseCon",
                    branchNavigation: "#branchCon"
                },
                supported: false,
                reason: "门户网站仅用于信息展示，不支持自动学习"
            },
            PUDONG: {
                name: "浦东分院",
                hostnames: [ "pudong.e-celap.cn", "pd.cela.cn", "cela.e-celap.cn" ],
                pathPatterns: [ "/pc/nc/page", "/page:pd" ],
                features: {
                    type: "spa",
                    framework: "vue",
                    router: "hash",
                    apiBase: "auto",
                    ssoParam: "cela_sso_logged"
                },
                supported: true,
                variants: {
                    MAIN: "cela.e-celap.cn",
                    SUBDOMAIN: "pudong.e-celap.cn",
                    ALIAS: "pd.cela.cn"
                }
            },
            GWYPX: {
                name: "党校分院",
                hostnames: [ "cela.gwypx.com.cn" ],
                supported: false,
                reason: "暂不支持党校分院环境"
            },
            CBEAD: {
                name: "企业分院",
                hostnames: [ "cela.cbead.cn" ],
                pathPatterns: [ "/home", "/study", "/train-new" ],
                features: {
                    type: "spa",
                    framework: "vue",
                    router: "hash",
                    apiBase: "auto",
                    ssoParam: "cela_sso_logged"
                },
                supported: true,
                variants: {
                    MAIN: "cela.cbead.cn"
                }
            }
        },
        SELECTOR_STRATEGY: {
            PUDONG: {
                INDEX: {
                    primary: ".dsf_nc_pd_special_item",
                    secondary: ".dsjy_card",
                    tertiary: ".dsf-many-schedule-course-list-row",
                    fallback: '[class*="course"][data-id]',
                    context: "#app",
                    extractors: {
                        courseId: [ "data-id", "id", "data-course-id" ],
                        courseName: [ ".title", ".name", ".item_content", "h3", "h4" ],
                        link: [ "data-url", "href", "[data-link]" ]
                    }
                },
                COLUMN: {
                    specialdetail: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    },
                    specialcolumn: {
                        primary: ".dsjy_card",
                        secondary: ".dsf-many-schedule-course-list-row",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    },
                    channelDetail: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/channel/getCourseList"
                    },
                    pdzq: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    },
                    xisijuan: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    }
                },
                PLAYER: {
                    container: "#coursePlayer",
                    video: 'video[api-base-url], iframe[src*="play"]',
                    controls: ".video-controls, .dsf-video-player"
                }
            },
            CBEAD: {
                INDEX: {
                    primary: ".activity-list .list-item",
                    secondary: ".course-item",
                    fallback: '[class*="course"]',
                    context: "#app",
                    extractors: {
                        courseId: [ "data-id", "id" ],
                        courseName: [ ".title", ".name" ],
                        link: [ "data-url", "href" ]
                    }
                },
                COLUMN: {
                    trainNew: {
                        primary: ".activity-stage ul.list",
                        courseItem: ".activity-stage ul.list li.clearfix",
                        extractors: {
                            titleElement: ".common-title.text-overflow",
                            titleIdPattern: /D75itemDetail1-([a-f0-9-]+)/,
                            studyBtn: ".study-btn",
                            studyBtnIdPattern: /D75itemDetail2-([a-f0-9-]+)/,
                            progressElement: ".completed-rate-bar .bar",
                            progressAttr: "style",
                            progressPattern: /width:\s*(\d+)%/
                        },
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    }
                },
                PLAYER: {
                    catalog: ".course-side-catalog",
                    chapterList: ".chapter-list-box",
                    extractors: {
                        chapterTitle: ".chapter-item .text-overflow",
                        durationElement: ".section-item .item:last-child",
                        durationPattern: /(\d+):(\d+)/,
                        completedText: ".item-completed",
                        completedPattern: /完成率[：:]\s*(\d+)%/
                    },
                    videoPlayer: "video.vjs-tech",
                    videoId: "D249player_html5_api",
                    playerType: "videojs"
                }
            },
            FALLBACK: {
                INDEX: {
                    primary: ".dsf_nc_pd_special_item",
                    secondary: ".dsjy_card",
                    tertiary: ".dsf-many-schedule-course-list-row",
                    fallback: '[class*="course"][data-id]',
                    context: "#app",
                    extractors: {
                        courseId: [ "data-id", "id", "data-course-id" ],
                        courseName: [ ".title", ".name", ".item_content", "h3", "h4" ],
                        link: [ "data-url", "href", "[data-link]" ]
                    }
                },
                COLUMN: {
                    specialdetail: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    },
                    specialcolumn: {
                        primary: ".dsjy_card",
                        secondary: ".dsf-many-schedule-course-list-row",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    },
                    channelDetail: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/channel/getCourseList"
                    },
                    pdzq: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    },
                    xisijuan: {
                        primary: ".dsf_nc_pd_special_item",
                        apiEndpoint: "/inc/nc/course/pd/getPackById"
                    }
                },
                PLAYER: {
                    container: "#coursePlayer",
                    video: 'video[api-base-url], iframe[src*="play"]',
                    controls: ".video-controls, .dsf-video-player"
                }
            }
        },
        PAGE_TYPES: {
            PORTAL_INDEX: {
                name: "门户首页",
                urlPattern: /^https?:\/\/www\.cela\.gov\.cn\/?(#.*)?$/,
                domPattern: [ "#branchCon", "#courseCon" ],
                features: [ "traditional", "jquery" ],
                actions: [ "navigate_to_branch" ]
            },
            PUDONG_INDEX: {
                name: "浦东首页",
                urlPattern: /pagehome\/index/,
                domPattern: [ "#app" ],
                features: [ "vue", "spa" ],
                actions: [ "scan_courses" ]
            },
            PUDONG_COLUMN_SPECIALDETAIL: {
                name: "浦东专题详情页",
                urlPattern: /specialdetail/,
                hashPattern: /[?&]id=([^&]+)/,
                domPattern: [ ".dsf_nc_pd_special_item" ],
                apiEndpoint: "/inc/nc/course/pd/getPackById",
                actions: [ "extract_from_api", "extract_from_dom" ]
            },
            PUDONG_COLUMN_SPECIALCOLUMN: {
                name: "浦东专栏页",
                urlPattern: /specialcolumn/,
                domPattern: [ ".dsjy_card" ],
                apiEndpoint: "/inc/nc/course/pd/getPackById",
                actions: [ "extract_from_api", "extract_from_dom" ]
            },
            PUDONG_COLUMN_CHANNELDETAIL: {
                name: "浦东频道详情页",
                urlPattern: /channelDetail/,
                domPattern: [ ".dsf_nc_pd_special_item" ],
                apiEndpoint: "/inc/nc/channel/getCourseList",
                actions: [ "extract_from_api", "extract_from_dom" ]
            },
            PUDONG_COLUMN_PDZQ: {
                name: "浦东专区页",
                urlPattern: /pdzq/,
                domPattern: [ ".dsf_nc_pd_special_item" ],
                apiEndpoint: "/inc/nc/course/pd/getPackById",
                actions: [ "extract_from_api", "extract_from_dom" ]
            },
            PUDONG_COLUMN_XISIJUAN: {
                name: "浦东西席卷页",
                urlPattern: /xisijuan/,
                domPattern: [ ".dsf_nc_pd_special_item" ],
                apiEndpoint: "/inc/nc/course/pd/getPackById",
                actions: [ "extract_from_api", "extract_from_dom" ]
            },
            PUDONG_PLAYER: {
                name: "浦东播放页",
                urlPattern: /coursePlayer/,
                domPattern: [ "#coursePlayer", "video[api-base-url]" ],
                actions: [ "report_progress" ]
            },
            CBEAD_INDEX: {
                name: "企业首页",
                urlPattern: /class\/index/,
                domPattern: [ "#app", ".activity-list" ],
                features: [ "vue", "spa" ],
                actions: [ "scan_courses" ]
            },
            CBEAD_COLUMN_TRAIN_NEW: {
                name: "企业专题详情页",
                urlPattern: /train-new\/class-detail/,
                hashPattern: /class-detail\/([a-f0-9-]+)/,
                domPattern: [ ".activity-stage", ".list" ],
                apiEndpoint: "/inc/nc/course/pd/getPackById",
                actions: [ "extract_from_api", "extract_from_dom" ]
            },
            CBEAD_PLAYER: {
                name: "企业播放页",
                urlPattern: /study\/course\/detail/,
                domPattern: [ ".player-content", ".new-global-height", "video" ],
                actions: [ "report_progress" ]
            },
            UNKNOWN: {
                name: "未知页面",
                actions: [ "detect_features" ]
            }
        },
        API_CONFIG: {
            PORTAL: {
                baseUrl: "https://www.cela.gov.cn",
                version: "v1",
                endpoints: {},
                supported: false
            },
            PUDONG: {
                baseUrl: "auto",
                version: "v1",
                endpoints: {
                    GET_PLAY_TREND: "/inc/nc/course/play/getPlayTrend",
                    GET_STUDY_RECORD: "/inc/nc/course/study/getStudyRecord",
                    GET_COURSE_LIST: "/inc/nc/course/getCourseList",
                    GET_PACK_BY_ID: "/inc/nc/course/pd/getPackById",
                    GET_CHANNEL_INFO: "/inc/nc/channel/getChannelInfo",
                    PULSE_SAVE_RECORD: "/api/player/pulse/saveRecord",
                    REPORT_PROGRESS: "/inc/nc/course/play/reportProgress",
                    GET_COURSE_LIST_FROM_CHANNEL: "/inc/nc/channel/getCourseList"
                },
                variants: {
                    main: {
                        host: "cela.e-celap.cn",
                        endpoints: {}
                    },
                    pudong: {
                        host: "pudong.e-celap.cn",
                        endpoints: {}
                    }
                },
                fallback: {
                    GET_COURSE_LIST: [ "/inc/nc/course/pd/getPackById", "/inc/nc/channel/getCourseList", "/api/course/list" ],
                    PULSE_SAVE_RECORD: [ "/api/player/pulse/saveRecord", "/inc/nc/course/play/pulseSaveRecord", "/api/player/pulse" ]
                },
                requestConfig: {
                    timeout: 1e4,
                    retries: 3,
                    retryDelay: 1e3
                }
            },
            GWYPX: {
                baseUrl: "https://cela.gwypx.com.cn",
                supported: false
            },
            CBEAD: {
                baseUrl: "https://cela.cbead.cn",
                version: "v1",
                endpoints: {
                    GET_PLAY_TREND: "/inc/nc/course/play/getPlayTrend",
                    GET_STUDY_RECORD: "/inc/nc/course/study/getStudyRecord",
                    GET_COURSE_LIST: "/inc/nc/course/getCourseList",
                    PULSE_SAVE_RECORD: "/inc/nc/course/play/pulseSaveRecord",
                    GET_COURSEWARE_DETAIL: "/inc/nc/course/play/getCoursewareDetail",
                    GET_PACK_BY_ID: "/inc/nc/course/pd/getPackById"
                },
                supported: true,
                fallback: {
                    PULSE_SAVE_RECORD: [ "/inc/nc/course/play/pulseSaveRecord", "/api/player/pulse/saveRecord" ]
                },
                requestConfig: {
                    timeout: 1e4,
                    retries: 3,
                    retryDelay: 1e3
                }
            }
        }
    };
    const EventBus = {
        events: {},
        subscribe(event, listener) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(listener);
            return () => {
                const index = this.events[event].indexOf(listener);
                if (index > -1) {
                    this.events[event].splice(index, 1);
                }
            };
        },
        publish(event, data) {
            if (!this.events[event]) return;
            this.events[event].forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`EventBus error in ${event}:`, error);
                }
            });
        },
        once(event, listener) {
            const unsubscribe = this.subscribe(event, data => {
                unsubscribe();
                listener(data);
            });
            return unsubscribe;
        }
    };
    const Utils = {
        formatTime(seconds) {
            if (!seconds || seconds < 0) return "00:00:00";
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor(seconds % 3600 / 60);
            const secs = seconds % 60;
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        },
        parseTimeToSeconds(timeStr) {
            try {
                if (!timeStr) return 0;
                const parts = timeStr.split(":").map(part => parseInt(part, 10));
                if (parts.length === 3 && !parts.some(isNaN)) {
                    return parts[0] * 3600 + parts[1] * 60 + parts[2];
                }
                return 0;
            } catch {
                return 0;
            }
        },
        parseDuration(durationStr) {
            if (!durationStr || typeof durationStr !== "string") {
                return CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
            }
            return this.parseTimeToSeconds(durationStr) || CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
        }
    };
    var utils = Object.freeze({
        __proto__: null,
        Utils: Utils
    });
    const ServiceLocator = {
        services: {},
        register: function(name, service) {
            if (!name || typeof name !== "string") {
                throw new Error("ServiceLocator.register: name must be a non-empty string");
            }
            if (!service || typeof service !== "object") {
                throw new Error(`ServiceLocator.register: service must be an object (got: ${typeof service})`);
            }
            this.services[name] = service;
        },
        get: function(name) {
            return this.services[name] || null;
        },
        has: function(name) {
            return name in this.services;
        }
    };
    const ServiceNames = Object.freeze({
        API: "api",
        LEARNER: "learner",
        UI: "ui",
        CONFIG: "config"
    });
    const LearningState = {
        _failed: false,
        _reason: null,
        markFailed(reason) {
            this._failed = true;
            this._reason = reason;
            console.error(`[LearningState] 🚨 课程已标记为失败: ${reason}`);
        },
        reset() {
            this._failed = false;
            this._reason = null;
            console.log("[LearningState] 🔄 学习状态已重置");
        },
        isFailed() {
            return this._failed;
        },
        getFailureReason() {
            return this._reason;
        },
        getState() {
            return {
                failed: this._failed,
                reason: this._reason
            };
        }
    };
    const Settings = {
        defaultConfig: {
            LEARNING_STRATEGY: "default",
            SKIP_COMPLETED_COURSES: true,
            STUDY_RECORD_ENABLED: true,
            FALLBACK_MODE: false,
            DEBUG_MODE: false,
            HEARTBEAT_INTERVAL: 10,
            COMPLETION_THRESHOLD: 95,
            MAX_RETRY_ATTEMPTS: 10,
            RETRY_DELAY: 3e3,
            COURSE_COMPLETION_DELAY: 5,
            PUDONG_MODE: false,
            PUDONG_API_BASE: "",
            CBEAD_MODE: false,
            CBEAD_API_BASE: "",
            IS_PORTAL: false,
            SUPER_FAST_MODE: true,
            FAST_LEARNING_MODE: true
        },
        config: {},
        load() {
            this.config = {
                ...this.defaultConfig
            };
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "✅ 使用固定配置：默认学习模式",
                type: "success"
            });
        },
        get(key) {
            return this.config[key];
        },
        set(key, value) {
            this.config[key] = value;
        }
    };
    const CONFIG$1 = new Proxy(Settings.config, {
        get(target, prop) {
            return Settings.get(prop) ?? target[prop];
        },
        set(target, prop, value) {
            Settings.set(prop, value);
            target[prop] = value;
            return true;
        }
    });
    var infraConfig = Object.freeze({
        __proto__: null,
        CONFIG: CONFIG$1,
        Settings: Settings
    });
    const RequestQueue = {
        queue: [],
        activeCount: 0,
        maxConcurrent: 2,
        requestGap: 1e3,
        add(fn) {
            return new Promise((resolve, reject) => {
                this.queue.push({
                    fn: fn,
                    resolve: resolve,
                    reject: reject
                });
                this.process();
            });
        },
        async process() {
            if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) return;
            this.activeCount++;
            const {fn: fn, resolve: resolve, reject: reject} = this.queue.shift();
            try {
                const delay = this.requestGap + Math.random() * 500;
                if (delay > 0) await new Promise(r => setTimeout(r, delay));
                const result = await fn();
                resolve(result);
            } catch (e) {
                reject(e);
            } finally {
                this.activeCount--;
                setTimeout(() => this.process(), 100);
            }
        }
    };
    const SIGN_UP_PATTERNS = [ "我要报名", "立即报名", "立即加入", "报名学习", "加入学习" ];
    function findSignUpButton() {
        const xpathConditions = SIGN_UP_PATTERNS.map(pattern => `contains(., "${pattern}")`).join(" or ");
        const xpath = `//button[${xpathConditions}] | //a[${xpathConditions}]`;
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (result.snapshotLength > 0) {
            console.log(`[DOMHelper] ✅ 通过 XPath 找到报名按钮，共 ${result.snapshotLength} 个`);
            return result.snapshotItem(0);
        }
        const selectors = [ "button", "a", ".btn", '[class*="button"]', '[class*="btn"]', '[role="button"]', ".el-button", ".ant-btn" ];
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const btn of elements) {
                const text = btn.textContent?.trim() || "";
                if (SIGN_UP_PATTERNS.some(pattern => text.includes(pattern))) {
                    console.log(`[DOMHelper] ✅ 通过选择器 "${selector}" 找到报名按钮`);
                    console.log(`[DOMHelper] 按钮文本: "${text}"`);
                    console.log(`[DOMHelper] 按钮标签: ${btn.tagName}, class: ${btn.className}`);
                    return btn;
                }
            }
        }
        console.log(`[DOMHelper] ⚠️ 未找到报名按钮，页面可能已报名`);
        return null;
    }
    function getSignUpButtonText(button) {
        return button?.textContent?.trim() || "报名按钮";
    }
    const MASK_SELECTORS = [ "#D339registerMask", '[id*="registerMask"]', '[class*="register-mask"]' ];
    const MASK_BUTTON_SELECTORS = [ ".register-img", '[class*="register-img"]', ".vjs-big-play-button", ".vjs-play-control" ];
    function clickMaskButton() {
        let clickedCount = 0;
        const clickDetails = [];
        for (const selector of MASK_BUTTON_SELECTORS) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (el.offsetParent !== null) {
                    const btnInfo = {
                        selector: selector,
                        tagName: el.tagName,
                        id: el.id,
                        className: el.className
                    };
                    clickDetails.push(btnInfo);
                    el.click();
                    clickedCount++;
                    console.log(`[DOMHelper] 🖱️ 点击遮罩按钮: ${el.tagName}.${el.className}`);
                }
            }
        }
        if (clickedCount > 0) {
            console.log(`[DOMHelper] 🖱️ 已点击 ${clickedCount} 个遮罩按钮`);
        }
        return {
            clicked: clickedCount,
            buttons: clickDetails
        };
    }
    function detectMask() {
        const masks = [];
        for (const selector of MASK_SELECTORS) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (el.offsetParent !== null || el.style.display !== "none") {
                    masks.push({
                        selector: selector,
                        tagName: el.tagName,
                        id: el.id,
                        className: el.className
                    });
                }
            }
        }
        return {
            exists: masks.length > 0,
            masks: masks
        };
    }
    function startMaskObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        for (const selector of MASK_SELECTORS) {
                            const baseSelector = selector.split(":")[0];
                            if (node.matches && node.matches(baseSelector)) {
                                console.log(`[DOMHelper] 🛡️ 检测到遮罩: ${node.tagName}#${node.id || ""}.${node.className || ""}`);
                                setTimeout(() => clickMaskButton(), 100);
                                break;
                            }
                        }
                    }
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log("[DOMHelper] 🛡️ 遮罩监听器已启动");
        return observer;
    }
    var infraDomHelper = Object.freeze({
        __proto__: null,
        clickMaskButton: clickMaskButton,
        detectMask: detectMask,
        findSignUpButton: findSignUpButton,
        getSignUpButtonText: getSignUpButtonText,
        startMaskObserver: startMaskObserver
    });
    function getUI() {
        return typeof window !== "undefined" && window.UI ? window.UI : null;
    }
    function detectEnvironment() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        const result = {
            currentEnv: null,
            hostname: hostname,
            pathname: pathname,
            hash: hash,
            confidence: 0,
            features: {}
        };
        for (const [envKey, envConfig] of Object.entries(CONSTANTS.ENVIRONMENTS)) {
            if (envConfig.hostnames.some(host => hostname === host || hostname.endsWith("." + host))) {
                result.currentEnv = envKey;
                result.confidence = 50;
                console.log(`🔍 域名匹配: ${envKey} (${envConfig.name})`);
                break;
            }
        }
        if (result.currentEnv) {
            const envConfig = CONSTANTS.ENVIRONMENTS[result.currentEnv];
            if (envConfig.pathPatterns) {
                const fullPath = pathname + hash;
                const matchesPath = envConfig.pathPatterns.some(pattern => fullPath.includes(pattern));
                if (matchesPath) {
                    result.confidence += 30;
                    console.log(`✅ 路径验证通过 (+30分)`);
                }
            }
        }
        if (result.currentEnv) {
            const envConfig = CONSTANTS.ENVIRONMENTS[result.currentEnv];
            if (envConfig.features) {
                if (envConfig.features.framework === "vue") {
                    if (document.querySelector("#app") || window.Vue) {
                        result.confidence += 15;
                        result.features.framework = "vue";
                        console.log(`✅ Vue框架特征检测 (+15分)`);
                    }
                }
                if (envConfig.features.framework === "jquery") {
                    if (window.jQuery && !document.querySelector("#app")) {
                        result.confidence += 15;
                        result.features.framework = "jquery";
                        console.log(`✅ jQuery框架特征检测 (+15分)`);
                    }
                }
                if (envConfig.features.courseContainer) {
                    const container = document.querySelector(envConfig.features.courseContainer);
                    if (container) {
                        result.confidence += 5;
                        console.log(`✅ 容器特征检测 (${envConfig.features.courseContainer}, +5分)`);
                    }
                }
            }
        }
        const envConfig = result.currentEnv ? CONSTANTS.ENVIRONMENTS[result.currentEnv] : null;
        if (result.currentEnv === "PORTAL") {
            CONFIG$1.IS_PORTAL = true;
            console.log("🏠 检测到中国干部网络学院门户页面");
        } else if (result.currentEnv === "PUDONG") {
            CONFIG$1.PUDONG_MODE = true;
            CONFIG$1.PUDONG_API_BASE = `https://${hostname}`;
            console.log("🏢 检测到浦东分院环境");
        } else if (result.currentEnv === "GWYPX") {
            CONFIG$1.UNSUPPORTED_BRANCH = "党校分院";
        } else if (result.currentEnv === "CBEAD") {
            CONFIG$1.CBEAD_MODE = true;
            CONFIG$1.CBEAD_API_BASE = `https://${hostname}`;
            console.log("🏢 检测到企业分院环境");
        }
        console.log(`🌐 环境检测完成: ${result.currentEnv || "UNKNOWN"} (置信度: ${result.confidence}%)`);
        console.log(`   - 域名: ${hostname}`);
        console.log(`   - 路径: ${pathname}`);
        console.log(`   - 特征: ${JSON.stringify(result.features)}`);
        EventBus.publish("environment:detected", {
            ...result,
            pudongMode: CONFIG$1.PUDONG_MODE,
            isPortal: CONFIG$1.IS_PORTAL,
            unsupportedBranch: CONFIG$1.UNSUPPORTED_BRANCH
        });
        setTimeout(() => {
            const UI = getUI();
            if (!UI || !UI.setIncompatible) return;
            if (CONFIG$1.UNSUPPORTED_BRANCH && envConfig) {
                UI.setIncompatible(`⚠️ 当前检测到【${envConfig.name}】，${envConfig.reason}`);
            } else if (CONFIG$1.IS_PORTAL && envConfig) {
                UI.setIncompatible(`🏠 ${envConfig.reason}`);
            } else if (!CONFIG$1.PUDONG_MODE && !CONFIG$1.IS_PORTAL && !CONFIG$1.CBEAD_MODE) {
                UI.setIncompatible("🔍 当前域名未被识别为受支持的学习环境，脚本已停止加载。");
            }
        }, 100);
        return result;
    }
    const PUDONG_CONSTANTS = {
        PATH_PATTERNS: {
            INDEX: "/pc/nc/pagehome/index",
            COLUMN: [ "zgpdyxkc", "specialcolumn", "specialdetail", "channelDetail", "pdchanel/pdzq" ],
            PLAYER: "coursePlayer"
        },
        PAGE_TYPES: {
            INDEX: "index",
            COLUMN: "column",
            PLAYER: "player",
            UNKNOWN: "unknown"
        },
        SELECTORS: {
            COURSE_ITEMS: [ ".dsf_nc_zg_item", ".dsf_nc_pd_course_express_item", ".dsf-many-schedule-course-list-row", ".dsf_nc_pd_special_item", ".pd_course_item", ".dsjy_card" ],
            ENTER_BTN: ".course-enter-btn",
            PLAYER_CONTAINER: "#coursePlayer"
        }
    };
    const Compliance = {
        enforce(url, data) {
            if (!data) return data;
            if (url.includes("/pulseSaveRecord") || url.includes("pulseSaveRecord")) {
                return this._enforcePulseRecord(data);
            }
            return data;
        },
        _enforcePulseRecord(data) {
            let params;
            let isString = typeof data === "string";
            if (isString) {
                params = new URLSearchParams(data);
            } else if (data instanceof FormData) {
                return data;
            } else {
                params = new URLSearchParams(data);
            }
            params.set("pulseTime", "10");
            params.set("pulseRate", "1");
            if (params.has("progress")) {
                const progress = parseInt(params.get("progress"));
                if (progress > 98) {
                    console.warn("[Compliance] ⚠️ 拦截异常进度上报:", progress, "-> 强制修正为 98");
                    params.set("progress", "98");
                }
            }
            return isString ? params.toString() : Object.fromEntries(params);
        }
    };
    const ApiCore = {
        _cachedToken: null,
        abortController: null,
        getBaseUrl() {
            const config = ServiceLocator.get(ServiceNames.CONFIG);
            if (config?.CBEAD_MODE) {
                return config?.CBEAD_API_BASE || `https://${window.location.hostname}`;
            }
            if (config?.PUDONG_MODE) {
                return config?.PUDONG_API_BASE || `https://${window.location.hostname}`;
            }
            return config?.PUDONG_API_BASE || config?.CBEAD_API_BASE || `https://${window.location.hostname}`;
        },
        _prepareHeaders(customHeaders = {}, data = null) {
            const token = this._extractToken();
            const headers = {
                Accept: "application/json, text/plain, */*",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                Referer: window.location.href,
                Origin: this.getBaseUrl(),
                Cookie: document.cookie,
                ...customHeaders
            };
            if (!(data instanceof FormData)) {
                if (typeof data === "string" && data.includes("=")) {
                    headers["Content-Type"] = "application/x-www-form-urlencoded";
                } else if (data) {
                    headers["Content-Type"] = "application/json";
                }
            }
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
                headers["X-Auth-Token"] = token;
            }
            return headers;
        },
        _handleResponse(response, resolve, reject) {
            if (response.status === 401) {
                this._cachedToken = null;
                this._log("Token 可能已过期 (401)，清除缓存", "warn");
            }
            const config = ServiceLocator.get(ServiceNames.CONFIG);
            if (config?.DEBUG_MODE) {
                this._log(`${response.status} ${response.responseText?.substring(0, 100)}...`);
            }
            try {
                if (response.responseText && response.responseText.trim()) {
                    return resolve(JSON.parse(response.responseText));
                }
                if (response.status >= 200 && response.status < 300) {
                    return resolve({
                        code: response.status,
                        success: true,
                        message: "Success"
                    });
                }
                resolve({
                    status: response.status,
                    message: "Empty response"
                });
            } catch {
                const html = response.responseText || "";
                if (html.trim().startsWith("<")) {
                    if (html.includes("login") || html.includes("登录")) {
                        this._log("登录已失效，请重新登录", "error");
                        alert("cela学习助手：登录已失效，请刷新页面重新登录！");
                        const learner = ServiceLocator.get(ServiceNames.LEARNER);
                        if (learner) learner.stop();
                        EventBus.publish(CONSTANTS.EVENTS.LEARNING_STOP);
                    } else if (html.includes("verification") || html.includes("验证码") || html.includes("人机")) {
                        this._log("触发人机验证，请手动完成验证", "error");
                        alert('cela学习助手：触发人机验证！请在页面上完成验证后点击"开始学习"继续。');
                        const learner = ServiceLocator.get(ServiceNames.LEARNER);
                        if (learner) learner.stop();
                        EventBus.publish(CONSTANTS.EVENTS.LEARNING_STOP);
                    }
                    return resolve({
                        error: "HTML response received",
                        status: response.status,
                        isHtml: true
                    });
                }
                resolve({
                    status: response.status,
                    message: html || "Empty response",
                    success: response.status >= 200 && response.status < 300
                });
            }
        },
        async request(options) {
            return RequestQueue.add(() => new Promise((resolve, reject) => {
                if (this.abortController && this.abortController.signal.aborted) {
                    return reject(new DOMException("Aborted", "AbortError"));
                }
                if (options.data) {
                    options.data = Compliance.enforce(options.url, options.data);
                }
                const headers = this._prepareHeaders(options.headers, options.data);
                const config = ServiceLocator.get(ServiceNames.CONFIG);
                if (config?.DEBUG_MODE) {
                    this._log(`${options.method || "GET"} ${options.url}`);
                }
                const req = GM_xmlhttpRequest({
                    method: options.method || "GET",
                    url: options.url,
                    headers: headers,
                    data: options.data,
                    timeout: options.timeout || 3e4,
                    onload: res => this._handleResponse(res, resolve, reject),
                    onerror: err => {
                        this._log(`请求失败: ${err.message}`, "error");
                        reject(err);
                    },
                    ontimeout: () => {
                        this._log("请求超时", "error");
                        reject(new Error("请求超时"));
                    }
                });
                if (this.abortController) {
                    this.abortController.signal.addEventListener("abort", () => {
                        if (req.abort) req.abort();
                        reject(new DOMException("Aborted", "AbortError"));
                    });
                }
            }));
        },
        async get(url, options = {}) {
            return this.request({
                ...options,
                method: "GET",
                url: url
            });
        },
        async post(url, data, options = {}) {
            return this.request({
                ...options,
                method: "POST",
                url: url,
                data: data
            });
        },
        _extractToken() {
            if (this._cachedToken) return this._cachedToken;
            const sources = [ () => localStorage.getItem(CONSTANTS.STORAGE_KEYS.TOKEN), () => localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN), () => localStorage.getItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN), () => sessionStorage.getItem(CONSTANTS.STORAGE_KEYS.TOKEN), () => sessionStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN), () => document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"), () => window.token, () => window.authToken, () => {
                const match = document.cookie.match(CONSTANTS.COOKIE_PATTERNS.TOKEN);
                return match ? match[1] : null;
            } ];
            for (const source of sources) {
                try {
                    const token = source();
                    if (token && token.length > 10) {
                        this._cachedToken = token;
                        this._log(`找到认证token: ${token.substring(0, 20)}...`, "debug");
                        return token;
                    }
                } catch {}
            }
            this._log("未找到认证token", "debug");
            return null;
        },
        _log(message, level = "info") {
            const ui = ServiceLocator.get(ServiceNames.UI);
            if (ui) {
                ui.log(message, level);
            } else {
                console.log(`[ApiCore] ${message}`);
            }
        },
        setAbortController(controller) {
            this.abortController = controller;
        },
        clearTokenCache() {
            this._cachedToken = null;
        }
    };
    const CourseAdapter = {
        normalize(raw, source = "api") {
            return {
                id: raw.id || raw.businessId || raw.courseId,
                courseId: raw.courseId || raw.id || raw.businessId,
                dsUnitId: raw.dsUnitId || raw.unitId || (raw.unitOrder && raw.order ? `unit_${raw.unitOrder}_${raw.order}` : "unit_default"),
                title: raw.name || raw.title || raw.courseName || "未命名课程",
                courseName: raw.name || raw.title || raw.courseName || "未命名课程",
                teacher: raw.teacher || "",
                durationStr: raw.duration || raw.durationStr || raw.timeLength || "00:30:00",
                period: raw.period || 0,
                status: raw.status || "not_started",
                source: source
            };
        }
    };
    function debugLog$2(...args) {}
    const PUDONG_API_CONFIG = {
        baseUrl: null,
        endpoints: {
            GET_PLAY_TREND: "/inc/nc/course/play/getPlayTrend",
            GET_COURSE_LIST: "/inc/nc/course/list",
            PULSE_SAVE_RECORD: "/inc/nc/course/play/pulseSaveRecord",
            PULSE_SAVE_RECORD_ALT: "/api/player/pulse",
            GET_STUDY_RECORD: "/inc/nc/course/play/getStudyRecord",
            GET_COURSEWARE_LIST: "/inc/nc/course/play/getPlayTrend",
            GET_COURSEWARE_LIST_ALT: "/inc/nc/course/play/getPlayInfoById"
        },
        getBaseUrl() {
            const config = ServiceLocator.get(ServiceNames.CONFIG);
            this.baseUrl = config?.PUDONG_API_BASE || `https://${window.location.hostname}`;
            return this.baseUrl;
        },
        getUrl(endpoint) {
            const baseUrl = this.getBaseUrl();
            const endpointPath = this.endpoints[endpoint] || endpoint;
            return baseUrl + endpointPath;
        }
    };
    function _buildUrl$1(endpoint, params = {}) {
        let url = PUDONG_API_CONFIG.getUrl(endpoint);
        const queryString = new URLSearchParams({
            ...params,
            _t: Date.now()
        }).toString();
        return `${url}?${queryString}`;
    }
    const PudongApi = {
        ...ApiCore,
        isSuccessResponse(result) {
            return result && (result.success === true || result.code === 200 || result.code === 2e4 || result.state === 2e4 || result.status === "success" || result.status === "ok" || result.code >= 200 && result.code < 300 || result.result === "success" || result.success === 1);
        },
        async getPlayInfo(courseId, coursewareId = null, courseDuration = null) {
            const {Utils: Utils} = await Promise.resolve().then(function() {
                return utils;
            });
            try {
                debugLog$2(`[getPlayInfo] 获取课程 ${courseId} 的播放信息`);
                const response = await this.get(_buildUrl$1("GET_PLAY_TREND", {
                    courseId: courseId
                }));
                if (response?.success && response?.data) {
                    const data = response.data;
                    let videoId = null;
                    let duration = 0;
                    let lastLearnedTime = 0;
                    let foundCoursewareId = coursewareId;
                    if (coursewareId && data.playTree?.children) {
                        const target = data.playTree.children.find(c => String(c.id) === String(coursewareId));
                        if (target) {
                            videoId = target.id;
                            foundCoursewareId = target.id;
                            duration = target.sumDurationLong || 0;
                            lastLearnedTime = target.lastWatchPoint ? Utils.parseTimeToSeconds(target.lastWatchPoint) : 0;
                            debugLog$2(`成功匹配到课件: ${target.title}`);
                        }
                    }
                    if (!videoId && data.locationSite) {
                        videoId = data.locationSite.id;
                        foundCoursewareId = data.locationSite.id;
                        duration = data.locationSite.sumDurationLong || 0;
                        lastLearnedTime = data.locationSite.lastWatchPoint ? Utils.parseTimeToSeconds(data.locationSite.lastWatchPoint) : 0;
                    }
                    if (duration === 0 && courseDuration) {
                        duration = Utils.parseDuration(courseDuration);
                    }
                    if (duration === 0) {
                        duration = CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
                    }
                    if (!videoId) {
                        videoId = `mock_video_${courseId}`;
                        debugLog$2("无法获取真实 videoId，使用模拟ID");
                    }
                    return {
                        courseId: courseId,
                        coursewareId: foundCoursewareId,
                        videoId: videoId,
                        duration: duration,
                        lastLearnedTime: lastLearnedTime,
                        playURL: `https://zpyapi.shsets.com/player/get?videoId=${videoId}`,
                        dataSource: videoId.startsWith("mock_") ? "fallback" : "api"
                    };
                }
                return null;
            } catch (error) {
                debugLog$2(`[getPlayInfo] 出错: ${error.message}`);
                return null;
            }
        },
        async reportProgress(playInfo, currentTime) {
            const {Utils: Utils} = await Promise.resolve().then(function() {
                return utils;
            });
            const watchPoint = Utils.formatTime(currentTime);
            const progress = Math.round(currentTime / playInfo.duration * 100);
            const payload = new URLSearchParams({
                courseId: playInfo.courseId,
                coursewareId: playInfo.coursewareId || playInfo.videoId,
                videoId: playInfo.videoId || "",
                watchPoint: watchPoint,
                currentTime: currentTime,
                duration: playInfo.duration,
                progress: progress,
                pulseTime: 10,
                pulseRate: 1,
                _t: Date.now()
            }).toString();
            try {
                return await this.post(_buildUrl$1("PULSE_SAVE_RECORD"), payload, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            } catch (error) {
                return await this.post(_buildUrl$1("PULSE_SAVE_RECORD_ALT"), payload, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            }
        },
        async reportProgressWithDelay(playInfo, currentTime) {
            const progressPercent = Math.round(currentTime / playInfo.duration * 100);
            if (progressPercent > 90) {
                await new Promise(resolve => setTimeout(resolve, 1e3 + Math.random() * 1e3));
            }
            return await this.reportProgress(playInfo, currentTime);
        },
        async checkCompletion(courseId, coursewareId = null) {
            try {
                const response = await this.get(_buildUrl$1("GET_PLAY_TREND", {
                    courseId: courseId
                }));
                const config = ServiceLocator.get(ServiceNames.CONFIG);
                if (response?.success && response?.data) {
                    const data = response.data;
                    if (coursewareId && data.playTree?.children) {
                        const target = data.playTree.children.find(c => String(c.id) === String(coursewareId));
                        if (target) {
                            const finishedRate = parseInt(target.finishedRate || 0);
                            return {
                                isCompleted: finishedRate >= (config?.COMPLETION_THRESHOLD || 80),
                                finishedRate: finishedRate,
                                method: "playTree_match"
                            };
                        }
                    }
                    if (data.locationSite && data.locationSite.finishedRate !== undefined) {
                        const finishedRate = parseInt(data.locationSite.finishedRate);
                        return {
                            isCompleted: finishedRate >= (config?.COMPLETION_THRESHOLD || 80),
                            finishedRate: finishedRate,
                            method: "playTrend_total"
                        };
                    }
                }
                return {
                    isCompleted: false,
                    finishedRate: 0,
                    method: "default"
                };
            } catch (error) {
                debugLog$2(`完成度检查失败: ${error.message}`);
                return {
                    isCompleted: false,
                    finishedRate: 0,
                    method: "error"
                };
            }
        },
        async getCoursewareList(courseId) {
            try {
                debugLog$2(`正在获取课程包详细信息 (ID: ${courseId})...`);
                const endpoints = [ _buildUrl$1("GET_COURSEWARE_LIST", {
                    courseId: courseId
                }), _buildUrl$1("GET_COURSEWARE_LIST_ALT", {
                    id: courseId
                }) ];
                for (const endpoint of endpoints) {
                    try {
                        const response = await this.get(endpoint);
                        if (response && response.success && response.data) {
                            const data = response.data;
                            if (data.playTree && data.playTree.children && Array.isArray(data.playTree.children)) {
                                const videos = data.playTree.children.filter(c => c.rTypeValue === "video" || c.rTypeValue === "courseware");
                                if (videos.length > 0) {
                                    debugLog$2(`从 playTree 获取到 ${videos.length} 个课件`);
                                    return videos.map((v, index) => CourseAdapter.normalize({
                                        id: courseId,
                                        courseId: courseId,
                                        dsUnitId: v.id,
                                        title: v.title || `${data.title || "课程"} - 视频${index + 1}`,
                                        duration: v.sumDurationLong || 0
                                    }, "pudong_api_tree"));
                                }
                            }
                            if (data.coursewareIdList && Array.isArray(data.coursewareIdList) && data.coursewareIdList.length > 0) {
                                debugLog$2(`从 coursewareIdList 获取到 ${data.coursewareIdList.length} 个课件`);
                                return data.coursewareIdList.map((cw, index) => CourseAdapter.normalize({
                                    id: courseId,
                                    courseId: courseId,
                                    dsUnitId: cw.id || cw.coursewareId,
                                    title: cw.name || cw.title || `${data.title || "课程"} - 视频${index + 1}`,
                                    duration: cw.duration || 0
                                }, "pudong_api_list"));
                            }
                            const list = data.subList || data.courseList || data.lessons;
                            if (list && Array.isArray(list) && list.length > 0) {
                                debugLog$2(`从 API 子列表获取到 ${list.length} 个视频`);
                                return list.map(item => CourseAdapter.normalize(item, "pudong_api_sublist"));
                            }
                        }
                    } catch {
                        continue;
                    }
                }
                return [];
            } catch (error) {
                debugLog$2(`获取课件列表失败: ${error.message}`);
                return [];
            }
        },
        async getCourseList() {
            try {
                debugLog$2("正在获取课程列表...");
                const currentUrl = window.location.href;
                if (currentUrl.toLowerCase().includes("specialdetail") || currentUrl.toLowerCase().includes("channeldetail") || currentUrl.toLowerCase().includes("pdchanel")) {
                    debugLog$2("检测到专题详情页，尝试从API获取课程列表...");
                    let channelId = null;
                    try {
                        const urlObj = new URL(currentUrl.replace("#", ""));
                        channelId = urlObj.searchParams.get("id");
                        if (!channelId) {
                            const hash = window.location.hash;
                            const match = hash.match(/[?&]id=([^&]+)/);
                            if (match) channelId = match[1];
                        }
                    } catch (error) {
                        debugLog$2(`解析频道ID失败: ${error.message}`);
                    }
                    if (channelId) {
                        debugLog$2(`专题ID: ${channelId}`);
                        return await this.getCourseListFromChannel(channelId);
                    }
                }
                debugLog$2("正在扫描页面课程元素...");
                for (let i = 0; i < 10; i++) {
                    const hasContent = document.querySelectorAll('.dsf_nc_pd_special_item, .list_item, .pd_course_item, .dsjy_card, .el-card, [class*="course"]').length > 0;
                    if (hasContent) break;
                    await new Promise(r => setTimeout(r, 500));
                }
                const courseList = [];
                let courseElements = [];
                const pudongItems = document.querySelectorAll(".dsf_nc_pd_special_item, .list_item, .pd_course_item, .dsjy_card");
                if (pudongItems.length > 0) {
                    debugLog$2(`找到浦东分院专用列表项: ${pudongItems.length}个`);
                    courseElements = Array.from(pudongItems);
                } else {
                    const selectors = [ ".dsf_nc_zg_item", ".dsf-many-schedule-course-list-row", ".dsf_nc_pd_course_express_item", ".el-card" ];
                    for (const selector of selectors) {
                        const elements = document.querySelectorAll(selector);
                        const validElements = Array.from(elements).filter(el => !el.closest("#api-learner-panel"));
                        if (validElements.length > 0) {
                            courseElements = validElements;
                            debugLog$2(`使用选择器 "${selector}" 找到 ${validElements.length} 个课程元素`);
                            break;
                        }
                    }
                }
                courseElements.forEach((el, index) => {
                    const findId = element => {
                        let current = element;
                        let depth = 0;
                        while (current && depth < 5) {
                            const id = current.getAttribute("data-id") || current.getAttribute("data-course-id") || current.getAttribute("id") || current.getAttribute("data-courseid") || current.querySelector("[data-id]")?.getAttribute("data-id") || current.querySelector("[data-course-id]")?.getAttribute("data-course-id");
                            if (id && !id.includes("kapture") && !id.includes("course_") && id.length > 5) return id;
                            current = current.parentElement;
                            depth++;
                        }
                        const uuidMatch = (element.getAttribute("onclick") || element.parentElement?.innerHTML || "").match(/[a-f0-9]{32}/);
                        return uuidMatch ? uuidMatch[0] : null;
                    };
                    const courseId = findId(el);
                    if (!courseId) return;
                    const rawData = {
                        courseId: courseId,
                        dsUnitId: el.getAttribute("data-unit-id") || el.getAttribute("data-dsunit") || `unit_${index}`,
                        courseName: el.querySelector(".title, .name, .course-title, .item_content, h3, h4")?.textContent?.trim() || el.getAttribute("title") || el.textContent?.trim()?.split("\n")[0]?.substring(0, 80) || `课程${index + 1}`,
                        durationStr: el.querySelector(".duration, .time, .period")?.textContent?.trim() || "00:30:00",
                        status: el.getAttribute("data-status") || "not_started"
                    };
                    if (rawData.courseName && rawData.courseName.length > 2) {
                        courseList.push(CourseAdapter.normalize(rawData, "pudong_dom"));
                    }
                });
                debugLog$2(`解析得到 ${courseList.length} 门课程`);
                return courseList;
            } catch (error) {
                debugLog$2(`获取课程列表失败: ${error.message}`);
                return [];
            }
        },
        async getCourseListFromChannel(channelId) {
            try {
                debugLog$2(`正在从频道获取课程列表 (ID: ${channelId})...`);
                const apiEndpoints = [ `/inc/nc/pack/getById?id=${channelId}&_t=${Date.now()}`, `/inc/nc/course/pd/getPackById?id=${channelId}&_t=${Date.now()}`, `/api/nc/channel/detail?id=${channelId}&_t=${Date.now()}`, `/inc/nc/course/getCourseList?channelId=${channelId}&_t=${Date.now()}` ];
                for (const endpoint of apiEndpoints) {
                    try {
                        debugLog$2(`尝试API端点: ${endpoint}`);
                        const response = await this.get(PUDONG_API_CONFIG.getBaseUrl() + endpoint);
                        if (response && response.success && response.data) {
                            const data = response.data;
                            const courseList = [];
                            if (data.pdChannelUnitList) {
                                for (const unit of data.pdChannelUnitList) {
                                    if (unit.subList) {
                                        for (const course of unit.subList) {
                                            if (course.typeValue === "course") {
                                                courseList.push(CourseAdapter.normalize({
                                                    ...course,
                                                    unitOrder: unit.order
                                                }, "pudong_api_unit"));
                                            }
                                        }
                                    }
                                }
                            } else if (data.subList && Array.isArray(data.subList)) {
                                debugLog$2(`从 subList 获取到 ${data.subList.length} 个课程`);
                                data.subList.forEach((item, index) => {
                                    courseList.push(CourseAdapter.normalize({
                                        courseId: item.id || item.courseId || item.dsId,
                                        dsUnitId: item.dsUnitId || item.id,
                                        courseName: item.courseName || item.title || item.name || `课程${index + 1}`,
                                        durationStr: item.durationStr || item.duration || "00:30:00",
                                        status: item.status || "not_started"
                                    }, "pudong_api_sublist"));
                                });
                            } else if (data.courseList && Array.isArray(data.courseList)) {
                                debugLog$2(`从 courseList 获取到 ${data.courseList.length} 个课程`);
                                data.courseList.forEach((item, index) => {
                                    courseList.push(CourseAdapter.normalize({
                                        courseId: item.id || item.courseId || item.dsId,
                                        dsUnitId: item.dsUnitId || item.id,
                                        courseName: item.courseName || item.title || item.name || `课程${index + 1}`,
                                        durationStr: item.durationStr || item.duration || "00:30:00",
                                        status: item.status || "not_started"
                                    }, "pudong_api_courselist"));
                                });
                            }
                            if (courseList.length > 0) {
                                debugLog$2(`从API获取到 ${courseList.length} 门课程`);
                                return courseList;
                            }
                        }
                    } catch (error) {
                        debugLog$2(`API端点 ${endpoint} 失败: ${error.message}`);
                        continue;
                    }
                }
                debugLog$2("所有频道API端点都失败了");
                return [];
            } catch (error) {
                debugLog$2(`从频道获取课程列表失败: ${error.message}`);
                return [];
            }
        }
    };
    function debugLog$1(...args) {}
    const PudongScanner = {
        async scanCourses(selectors = PUDONG_CONSTANTS.SELECTORS) {
            try {
                const currentUrl = window.location.href;
                if (currentUrl.toLowerCase().includes("channeldetail") || currentUrl.toLowerCase().includes("specialdetail") || currentUrl.toLowerCase().includes("pdchanel")) {
                    debugLog$1("检测到专题详情页，调用 API 获取课程列表...");
                    const apiCourses = await PudongApi.getCourseList();
                    if (apiCourses && apiCourses.length > 0) {
                        debugLog$1(`API 返回 ${apiCourses.length} 门课程`);
                        return apiCourses;
                    }
                    debugLog$1("API 未返回课程，降级到 DOM 扫描");
                }
                await this._waitForCourseElements();
                const courseElements = this._findCourseElements(selectors);
                if (courseElements.length === 0) {
                    debugLog$1("未找到课程元素");
                    return [];
                }
                debugLog$1(`找到 ${courseElements.length} 个课程元素`);
                const courses = this._parseCourseElements(courseElements);
                const uniqueCourses = this._uniqueCourses(courses);
                debugLog$1(`解析得到 ${uniqueCourses.length} 门有效课程`);
                return uniqueCourses;
            } catch (error) {
                console.error(`[PudongScanner] 扫描失败: ${error.message}`);
                return [];
            }
        },
        async _waitForCourseElements() {
            for (let i = 0; i < 10; i++) {
                const found = PUDONG_CONSTANTS.SELECTORS.COURSE_ITEMS.some(s => document.querySelector(s));
                if (found) break;
                await new Promise(r => setTimeout(r, 500));
            }
        },
        _findCourseElements(selectors) {
            const pudongItems = document.querySelectorAll(".dsf_nc_pd_special_item, .list_item, .pd_course_item, .dsjy_card");
            if (pudongItems.length > 0) {
                return Array.from(pudongItems);
            }
            for (const selector of selectors.COURSE_ITEMS) {
                const elements = document.querySelectorAll(selector);
                const validElements = Array.from(elements).filter(el => !el.closest("#api-learner-panel"));
                if (validElements.length > 0) {
                    return validElements;
                }
            }
            return [];
        },
        _parseCourseElements(elements) {
            const courseList = [];
            elements.forEach((el, index) => {
                const courseId = this._extractCourseId(el);
                if (!courseId) return;
                const rawData = {
                    courseId: courseId,
                    dsUnitId: el.getAttribute("data-unit-id") || el.getAttribute("data-dsunit") || `unit_${index}`,
                    courseName: this._extractCourseName(el),
                    durationStr: this._extractDuration(el),
                    status: el.getAttribute("data-status") || "not_started"
                };
                if (rawData.courseName && rawData.courseName.length > 2) {
                    courseList.push(CourseAdapter.normalize(rawData, "pudong_dom"));
                }
            });
            return courseList;
        },
        _extractCourseId(element) {
            let current = element;
            let depth = 0;
            while (current && depth < 5) {
                const id = current.getAttribute("data-id") || current.getAttribute("data-course-id") || current.getAttribute("id") || current.getAttribute("data-courseid") || current.querySelector("[data-id]")?.getAttribute("data-id") || current.querySelector("[data-course-id]")?.getAttribute("data-course-id");
                if (id && !id.includes("kapture") && !id.includes("course_") && id.length > 5) {
                    return id;
                }
                current = current.parentElement;
                depth++;
            }
            const uuidMatch = (element.getAttribute("onclick") || element.parentElement?.innerHTML || "").match(/[a-f0-9]{32}/);
            return uuidMatch ? uuidMatch[0] : null;
        },
        _extractCourseName(element) {
            return element.querySelector(".title, .name, .course-title, .item_content, h3, h4")?.textContent?.trim() || element.getAttribute("title") || element.textContent?.trim()?.split("\n")[0]?.substring(0, 80) || `课程${Date.now()}`;
        },
        _extractDuration(element) {
            return element.querySelector(".duration, .time, .period")?.textContent?.trim() || "00:30:00";
        },
        _uniqueCourses(courses) {
            return courses.filter((course, index, self) => index === self.findIndex(c => c.courseId === course.courseId));
        },
        getEnterButtonSelector() {
            return PUDONG_CONSTANTS.SELECTORS.ENTER_BTN;
        },
        getPlayerContainerSelector() {
            return PUDONG_CONSTANTS.SELECTORS.PLAYER_CONTAINER;
        }
    };
    const PudongPlayerFlow = {
        async startPlayerFlow() {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "检测到课程播放页面，正在检索所有视频课件...",
                type: "info"
            });
            const courseId = this._extractCourseIdFromUrl();
            if (!courseId) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "无法从页面URL中提取课程ID",
                    type: "error"
                });
                return null;
            }
            const apiCourses = await PudongApi.getCoursewareList(courseId);
            if (apiCourses && apiCourses.length > 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: `成功获取到 ${apiCourses.length} 个视频课件`,
                    type: "success"
                });
                return apiCourses;
            }
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "无法通过API获取视频列表，处理当前单一视频",
                type: "warn"
            });
            return [ {
                id: courseId,
                courseId: courseId,
                title: document.title || `当前视频 ${courseId}`,
                courseName: document.title || `当前视频 ${courseId}`,
                durationStr: "00:30:00"
            } ];
        },
        _extractCourseIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            let courseId = urlParams.get("id");
            if (!courseId) {
                const hash = window.location.hash;
                if (hash.includes("?")) {
                    const hashParams = new URLSearchParams(hash.split("?")[1]);
                    courseId = hashParams.get("id");
                }
                if (!courseId) {
                    const match = hash.match(/[?&]id=([^&]+)/);
                    if (match) {
                        courseId = match[1];
                    }
                }
            }
            return courseId;
        },
        async executeCourseLearning(course) {
            const {Utils: Utils} = await Promise.resolve().then(function() {
                return utils;
            });
            const {LearningStrategies: LearningStrategies} = await Promise.resolve().then(function() {
                return bizStrategies;
            });
            const courseId = course.id || course.courseId;
            const dsUnitId = course.dsUnitId;
            const playInfo = await PudongApi.getPlayInfo(courseId, dsUnitId, course.durationStr);
            if (!playInfo) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: `无法获取课程 ${courseId} 的播放信息`,
                    type: "error"
                });
                return false;
            }
            const courseInfo = {
                ...course,
                ...playInfo,
                title: course.title || course.courseName,
                courseId: courseId
            };
            const currentProgress = Math.floor(playInfo.lastLearnedTime / playInfo.duration * 100);
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `[学习启动] 课程: ${courseInfo.title}`,
                type: "info"
            });
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `[当前进度] ${currentProgress}% (${Utils.formatTime(playInfo.lastLearnedTime)}/${Utils.formatTime(playInfo.duration)})`,
                type: "info"
            });
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "执行极速完成策略 - 直接冲刺 99%",
                type: "info"
            });
            const success = await LearningStrategies.instant_finish({
                playInfo: courseInfo,
                duration: playInfo.duration,
                currentTime: playInfo.lastLearnedTime
            });
            if (success) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: `课程处理完成: ${courseInfo.title}`,
                    type: "success"
                });
            } else {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: `课程处理失败: ${courseInfo.title}`,
                    type: "error"
                });
            }
            return success;
        },
        async checkCourseCompletion(courseId, coursewareId = null) {
            return await PudongApi.checkCompletion(courseId, coursewareId);
        }
    };
    const PudongLearner$1 = {
        _validatePageType(pageType) {
            const allowedTypes = [ PudongHandler.PAGE_TYPES.PLAYER, PudongHandler.PAGE_TYPES.COLUMN, PudongHandler.PAGE_TYPES.INDEX ];
            if (allowedTypes.includes(pageType)) {
                return true;
            }
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "⚠️ 当前页面不支持自动学习。请进入课程播放页或列表页。",
                type: "warn"
            });
            EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "页面不支持");
            return false;
        },
        async selectAndExecute() {
            if (!CONFIG$1.PUDONG_MODE) {
                return null;
            }
            const pageType = PudongHandler.identifyPage();
            if (!this._validatePageType(pageType)) {
                return false;
            }
            const href = window.location.href;
            if (pageType === PudongHandler.PAGE_TYPES.PLAYER || href.includes("/coursePlayer")) {
                return await this._handlePlayerPage();
            }
            if (pageType === PudongHandler.PAGE_TYPES.COLUMN || pageType === PudongHandler.PAGE_TYPES.INDEX || href.includes("/column") || href.includes("/index") || href.includes("specialdetail")) {
                return await this._handleColumnPage();
            }
            return null;
        },
        async _handlePlayerPage() {
            return await this.startPlayerFlow();
        },
        async _handleColumnPage() {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "📋 检测到浦东分院专栏页",
                type: "info"
            });
            const courses = await PudongHandler.scanCourses();
            if (!courses || courses.length === 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "⚠️ 未扫描到课程列表",
                    type: "warn"
                });
                return false;
            }
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `✅ 扫描到 ${courses.length} 门课程`,
                type: "success"
            });
            const stats = {
                total: courses.length,
                completed: 0,
                learned: 0,
                failed: 0,
                skipped: 0
            };
            EventBus.publish(CONSTANTS.EVENTS.STATISTICS_UPDATE, stats);
            for (let i = 0; i < courses.length; i++) {
                const {Learner: Learner} = await Promise.resolve().then(function() {
                    return bizLearner;
                });
                if (Learner && Learner.stopRequested) {
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: "\n🛑 用户停止学习",
                        type: "warn"
                    });
                    break;
                }
                const course = courses[i];
                const courseId = course.id || course.courseId;
                const coursewareId = course.dsUnitId;
                EventBus.publish(CONSTANTS.EVENTS.COURSE_START, {
                    course: course,
                    index: i + 1,
                    total: courses.length
                });
                EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, `处理课程 ${i + 1}/${courses.length}`);
                try {
                    const completionCheck = await PudongHandler.checkCompletion(courseId, coursewareId);
                    if (completionCheck.isCompleted) {
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: `⏭️ 跳过已完成课程: ${course.title} (${completionCheck.finishedRate}%)`,
                            type: "info"
                        });
                        stats.skipped++;
                    } else {
                        const success = await PudongPlayerFlow.executeCourseLearning(course);
                        if (success) {
                            stats.learned++;
                        } else {
                            stats.failed++;
                        }
                    }
                    stats.completed = stats.skipped + stats.learned;
                    EventBus.publish(CONSTANTS.EVENTS.STATISTICS_UPDATE, stats);
                    EventBus.publish(CONSTANTS.EVENTS.PROGRESS_UPDATE, Math.floor((i + 1) / courses.length * 100));
                    if (stats.learned > 0 && i < courses.length - 1) {
                        await this._coolingDown(i === courses.length - 1);
                    }
                } catch (error) {
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: `❌ 处理课程失败: ${course.title} - ${error.message}`,
                        type: "error"
                    });
                    stats.failed++;
                    EventBus.publish(CONSTANTS.EVENTS.STATISTICS_UPDATE, stats);
                }
            }
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `\n🎉 所有课程处理完成！`,
                type: "success"
            });
            EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "学习完成");
            this._resetToggleButton("学习完成");
            return true;
        },
        async startPlayerFlow() {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "🎬 检测到浦东分院播放页，开始处理",
                type: "info"
            });
            const courses = await PudongPlayerFlow.startPlayerFlow();
            if (!courses || courses.length === 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "❌ 未找到可学习的课件",
                    type: "error"
                });
                return false;
            }
            const successCount = [];
            const failCount = [];
            for (const course of courses) {
                try {
                    const success = await PudongPlayerFlow.executeCourseLearning(course);
                    if (success) {
                        successCount.push(course);
                    } else {
                        failCount.push(course);
                    }
                } catch (error) {
                    console.error("[PudongLearner] 课件学习失败:", error);
                    failCount.push(course);
                }
            }
            if (successCount.length > 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: `✅ 成功完成 ${successCount.length} 个课件`,
                    type: "success"
                });
            }
            if (failCount.length > 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: `⚠️ ${failCount.length} 个课件处理失败`,
                    type: "warn"
                });
            }
            this._resetToggleButton("学习完成");
            return successCount.length > 0;
        },
        async _coolingDown(isLast) {
            if (isLast) return;
            const minDelay = 5e3;
            const maxDelay = 1e4;
            const delay = Math.random() * (maxDelay - minDelay) + minDelay;
            const seconds = Math.round(delay / 1e3);
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `冷却等待: ${seconds}秒`,
                type: "info"
            });
            for (let i = seconds; i > 0; i--) {
                EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, `等待中 (${i}s)`);
                await new Promise(r => setTimeout(r, 1e3));
            }
        },
        _resetToggleButton(statusText) {
            const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
            if (toggleBtn) {
                toggleBtn.setAttribute("data-state", "stopped");
                toggleBtn.textContent = "开始学习";
            }
            EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, statusText);
        }
    };
    const PudongHandler = {
        PAGE_TYPES: PUDONG_CONSTANTS.PAGE_TYPES,
        SELECTORS: PUDONG_CONSTANTS.SELECTORS,
        identifyPage() {
            const url = window.location.href;
            if (url.includes(PUDONG_CONSTANTS.PATH_PATTERNS.PLAYER)) {
                return this.PAGE_TYPES.PLAYER;
            }
            for (const pattern of PUDONG_CONSTANTS.PATH_PATTERNS.COLUMN) {
                if (url.includes(pattern)) {
                    return this.PAGE_TYPES.COLUMN;
                }
            }
            if (url.includes(PUDONG_CONSTANTS.PATH_PATTERNS.INDEX)) {
                return this.PAGE_TYPES.INDEX;
            }
            return this.PAGE_TYPES.UNKNOWN;
        },
        init() {
            if (!this.isPudongMode()) return;
            console.log("浦东分院处理器已激活");
            EventBus.subscribe("pudong:startLearning", async () => {
                console.log("[PudongHandler] 收到开始学习事件");
                const pageType = this.identifyPage();
                const url = window.location.href;
                if (pageType === this.PAGE_TYPES.PLAYER) {
                    await PudongLearner$1._handlePlayerPage();
                } else if (pageType === this.PAGE_TYPES.COLUMN) {
                    if (url.includes("/specialcolumn")) {
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: "⚠️ 当前页面为专题入口页，请进入具体的专题详情页后再开始学习",
                            type: "warn"
                        });
                        EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "页面不支持");
                        this._resetToggleButton();
                    } else if (url.includes("/pdchanel/pdzq")) {
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: "⚠️ 当前页面为干部履职通识课程专区，请进入具体的课程后再开始学习",
                            type: "warn"
                        });
                        EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "页面不支持");
                        this._resetToggleButton();
                    } else {
                        await PudongLearner$1._handleColumnPage();
                    }
                } else if (pageType === this.PAGE_TYPES.INDEX) {
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: "⚠️ 首页暂不支持自动学习，请进入专栏或课程页面",
                        type: "warn"
                    });
                    this._resetToggleButton();
                } else {
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: "⚠️ 当前页面不支持自动学习",
                        type: "warn"
                    });
                    EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "页面不支持");
                    this._resetToggleButton();
                }
            });
        },
        _resetToggleButton() {
            const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
            if (toggleBtn) {
                toggleBtn.setAttribute("data-state", "stopped");
                toggleBtn.textContent = "开始学习";
            }
        },
        isPudongMode() {
            return CONFIG$1.PUDONG_MODE === true;
        },
        async scanCourses() {
            return await PudongScanner.scanCourses();
        },
        async startPlayerFlow() {
            return await PudongPlayerFlow.startPlayerFlow();
        },
        async executeCourseLearning(course) {
            return await PudongPlayerFlow.executeCourseLearning(course);
        },
        async checkCompletion(courseId, coursewareId = null) {
            return await PudongPlayerFlow.checkCourseCompletion(courseId, coursewareId);
        },
        async getPlayInfo(courseId, coursewareId = null, duration = null) {
            return await PudongApi.getPlayInfo(courseId, coursewareId, duration);
        },
        async reportProgress(playInfo, currentTime) {
            return await PudongApi.reportProgress(playInfo, currentTime);
        },
        getEnterButtonSelector() {
            return PudongScanner.getEnterButtonSelector();
        },
        getPlayerContainerSelector() {
            return PudongScanner.getPlayerContainerSelector();
        }
    };
    const CBEAD_CONSTANTS = {
        TIMEOUT: {
            NAVIGATION: 3e3,
            PAGE_LOAD: 1e4,
            PLAYER_LOAD: 15e3,
            LEARNING_SESSION: 6e5,
            POLLING_INTERVAL: 500
        },
        TIMING: {
            NAVIGATION: 3e3,
            PLAYER_INIT_TIMEOUT: 1e4,
            PLAYER_CHECK_INTERVAL: 500,
            PROGRESS_REPORT_INTERVAL: 3e4,
            CHAPTER_CHECK_INTERVAL: 15e3,
            MUTE_VERIFY_DELAY: 1e3,
            NEXT_COURSE_DELAY: 2e3,
            CHAPTER_SWITCH_DELAY: 2e3,
            PROTECTION_TIMEOUT: 100
        },
        THRESHOLDS: {
            COMPLETED_PROGRESS: 100,
            SKIP_COURSE_PROGRESS: 100,
            CHAPTER_CHECK_MIN_PROGRESS: 80,
            VIDEO_START_THRESHOLD: 10,
            STORAGE_EXPIRY: 864e5
        },
        STORAGE_KEYS: {
            LEARNING_PROGRESS: "cbead_learning_progress"
        },
        PATH_PATTERNS: {
            PLAYER: "study/course/detail",
            COLUMN: "train-new/class-detail",
            BRANCH_LIST: "branch-list-v",
            INDEX: "class/index",
            HOME_V: "home-v"
        },
        SELECTORS: {
            START_BUTTON: '.start-study-btn, [class*="start-learn"]',
            PROGRESS_BAR: ".el-progress-bar",
            VIDEO_PLAYER: 'video, [class*="video-player"], [class*="player-container"]',
            LEARNING_COMPLETED: '[class*="completed"], [class*="finished"]'
        },
        BRANCH_LIST: {
            CONTAINER_SELECTOR: ".card-wrapper",
            ITEM_SELECTOR: ".card-item",
            CARD_BOX_SELECTOR: ".card-box",
            STATUS_SELECTOR: ".status",
            TITLE_SELECTOR: ".title-row",
            PAGINATION_BOX_SELECTOR: ".e-pagination-box",
            PAGINATION_SELECTOR: ".zxy-pagination",
            PAGE_ITEM_SELECTOR: ".zxy-pagination-item:not(.zxy-pagination-prev):not(.zxy-pagination-next):not(.zxy-pagination-dots)",
            ACTIVE_PAGE_SELECTOR: ".zxy-pagination-item.active",
            NEXT_BTN_SELECTOR: ".e-pagination-box .zxy-pagination .zxy-pagination-next",
            PREV_BTN_SELECTOR: ".zxy-pagination-prev",
            DISABLED_PAGINATION_CLASS: "zxy-pagination-disabled",
            TAG_CONTAINER_SELECTOR: ".label-container .tag-list",
            TAG_BTN_SELECTOR: ".label-btn",
            CATEGORY_MENU_SELECTOR: ".menu-wrapper .catalog-menu",
            CATEGORY_ITEM_SELECTOR: ".catalog-menu-item",
            PAGE_LOAD_TIMEOUT: 5e3,
            PAGINATION_DELAY: 2e3,
            TAG_SWITCH_DELAY: 2e3,
            API_ENDPOINTS: {
                COURSE_LIST: "/api/v1/audience/course/list",
                MY_COURSE_LIST: "/api/v1/audience/course/my-course-list",
                STUDY_PROGRESS: "/api/v1/audience/course/study-progress"
            },
            VALIDATION: {
                PAGE_LOAD_TIMEOUT: 1e4,
                SKELETON_TIMEOUT: 5e3,
                CONTENT_TIMEOUT: 8e3,
                VUE_TIMEOUT: 6e3,
                MAX_RETRY_COUNT: 3
            }
        },
        COLUMN_PAGE: {
            ACTIVITY_STYLE: {
                CONTAINER_SELECTOR: ".activity-page",
                ITEM_SELECTOR: "li.clearfix",
                TITLE_SELECTOR: ".common-title",
                PROGRESS_BAR_SELECTOR: ".completed-rate-bar .bar",
                STUDY_BTN_SELECTOR: ".study-btn",
                COMPLETED_STATUS_TEXT: "已完成",
                IN_PROGRESS_STATUS_TEXT: "学习中",
                NOT_STARTED_STATUS_TEXT: "未开始"
            },
            LAYOUT_STYLE: {
                CONTAINER_SELECTOR: ".class-layout",
                LIST_SELECTOR: ".item-content ul.clearfix",
                ITEM_SELECTOR: "li.pull-left",
                TITLE_SELECTOR: ".title-text",
                TITLE_ID_PREFIX: "D74itemDetail-",
                STATUS_SELECTOR: ".ms-train-state",
                STATUS_TEXT: {
                    COMPLETED: "已完成",
                    UNFINISHED: "未完成",
                    IN_PROGRESS: "学习中"
                },
                TAB_SWITCH: {
                    CONTAINER_SELECTOR: ".item-switch-list",
                    TAB_ITEM_SELECTOR: "ul.clearfix > li",
                    ACTIVE_CLASS: "current",
                    SWITCH_DELAY: 1500
                }
            }
        },
        HEARTBEAT: {
            INTERVAL: 1e4,
            ENABLED: true,
            MAX_RETRIES: 3,
            TIMEOUT: 5e3,
            API_PENDING: true
        }
    };
    Object.defineProperty(CBEAD_CONSTANTS.COLUMN_PAGE, "CONTAINER_SELECTOR", {
        get() {
            return this.ACTIVITY_STYLE.CONTAINER_SELECTOR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CBEAD_CONSTANTS.COLUMN_PAGE, "ITEM_SELECTOR", {
        get() {
            return this.ACTIVITY_STYLE.ITEM_SELECTOR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CBEAD_CONSTANTS.COLUMN_PAGE, "PROGRESS_BAR_SELECTOR", {
        get() {
            return this.ACTIVITY_STYLE.PROGRESS_BAR_SELECTOR;
        },
        enumerable: true,
        configurable: true
    });
    const CourseStatusDetector = {
        STATUS: {
            COMPLETED: "completed",
            IN_PROGRESS: "in_progress",
            NOT_STARTED: "not_started"
        },
        STATUS_TEXT_MAP: {
            "学习中": "in_progress",
            "已完成": "completed",
            "未开始": "not_started"
        },
        detectCourseStatus(courseItem) {
            if (!courseItem || typeof courseItem.querySelector !== "function") {
                return this._createStatusResult(null, 0, "无效的课程元素");
            }
            const statusFromVue = this._detectFromVueData(courseItem);
            const statusFromText = this._detectFromStatusElement(courseItem);
            const statusFromProgressBar = this._detectFromProgressBar(courseItem);
            const statusFromClass = this._detectFromClass(courseItem);
            const statusFromDataAttr = this._detectFromDataAttr(courseItem);
            const results = [ statusFromVue, statusFromText, statusFromProgressBar, statusFromClass, statusFromDataAttr ];
            const validResults = results.filter(r => r !== null);
            const statusCounts = {};
            validResults.forEach(r => {
                statusCounts[r] = (statusCounts[r] || 0) + 1;
            });
            let finalStatus = null;
            let maxCount = 0;
            for (const [status, count] of Object.entries(statusCounts)) {
                if (count > maxCount) {
                    maxCount = count;
                    finalStatus = status;
                }
            }
            const confidence = this._calculateConfidence(statusFromVue, statusFromText, statusFromProgressBar, statusFromClass, statusFromDataAttr);
            const title = this._extractTitle(courseItem);
            const courseId = this._extractCourseId(courseItem);
            if (finalStatus) {
                console.log(`[CourseStatusDetector] ${title} - 状态: ${finalStatus}, 置信度: ${confidence}%, 来源: ${validResults.join(", ")}`);
            }
            return this._createStatusResult(finalStatus, confidence, {
                vue: statusFromVue,
                text: statusFromText,
                progressBar: statusFromProgressBar,
                class: statusFromClass,
                dataAttr: statusFromDataAttr
            }, {
                title: title,
                courseId: courseId
            });
        },
        detectBatch(courseItems) {
            if (!Array.isArray(courseItems)) {
                console.warn("[CourseStatusDetector] 批量检测收到非数组参数");
                return [];
            }
            return courseItems.map((item, index) => {
                const statusInfo = this.detectCourseStatus(item);
                return {
                    index: index,
                    element: item,
                    ...statusInfo
                };
            });
        },
        _detectFromVueData(courseItem) {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const cardItem = courseItem.querySelector(config.CARD_SELECTOR);
            if (!cardItem || !cardItem.__vue__) {
                return null;
            }
            const vueInstance = cardItem.__vue__;
            const data = vueInstance.$data || vueInstance._data || {};
            if (data.studyStatus !== undefined) {
                if (data.studyStatus === 1 || data.studyStatus === "studying") {
                    return this.STATUS.IN_PROGRESS;
                } else if (data.studyStatus === 2 || data.studyStatus === "completed") {
                    return this.STATUS.COMPLETED;
                } else if (data.studyStatus === 0 || data.studyStatus === "not_started") {
                    return this.STATUS.NOT_STARTED;
                }
            }
            const progress = data.studyProgress ?? data.progress ?? data.percentage ?? data.studyPercentage;
            if (progress !== undefined) {
                if (progress >= 100) {
                    return this.STATUS.COMPLETED;
                } else if (progress > 0) {
                    return this.STATUS.IN_PROGRESS;
                } else {
                    return this.STATUS.NOT_STARTED;
                }
            }
            if (data.isCompleted === true || data.isCompleted === "true") {
                return this.STATUS.COMPLETED;
            }
            if (data.completedTime || data.finishTime || data.studyEndTime) {
                return this.STATUS.COMPLETED;
            }
            return null;
        },
        _detectFromStatusElement(courseItem) {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const statusEl = courseItem.querySelector(config.STATUS_SELECTOR);
            if (!statusEl) {
                return null;
            }
            const statusText = statusEl.textContent?.trim() || "";
            if (statusText === "学习中") {
                return this.STATUS.IN_PROGRESS;
            } else if (statusText === "已完成") {
                return this.STATUS.COMPLETED;
            } else if (statusText === "未开始") {
                return this.STATUS.NOT_STARTED;
            }
            const hiddenStatus = statusEl.getAttribute("data-status") || statusEl.getAttribute("data-study-status");
            if (hiddenStatus) {
                if (hiddenStatus === "studying" || hiddenStatus === "1") {
                    return this.STATUS.IN_PROGRESS;
                } else if (hiddenStatus === "completed" || hiddenStatus === "2") {
                    return this.STATUS.COMPLETED;
                } else if (hiddenStatus === "not_started" || hiddenStatus === "0") {
                    return this.STATUS.NOT_STARTED;
                }
            }
            return null;
        },
        _detectFromProgressBar(courseItem) {
            const progressBar = courseItem.querySelector('.progress-bar, [class*="progress"], .completed-rate-bar, .rate-bar');
            if (!progressBar) {
                return null;
            }
            const style = progressBar.getAttribute("style") || "";
            const progressMatch = style.match(/width:\s*(\d+)%/);
            if (progressMatch) {
                const progress = parseInt(progressMatch[1], 10);
                if (progress >= 100) {
                    return this.STATUS.COMPLETED;
                } else if (progress > 0) {
                    return this.STATUS.IN_PROGRESS;
                }
            }
            const progressChild = progressBar.querySelector('.progress, .bar, .completed, [class*="completed"]');
            if (progressChild) {
                const childStyle = progressChild.getAttribute("style") || "";
                const childProgressMatch = childStyle.match(/width:\s*(\d+)%/);
                if (childProgressMatch) {
                    const progress = parseInt(childProgressMatch[1], 10);
                    if (progress >= 100) {
                        return this.STATUS.COMPLETED;
                    } else if (progress > 0) {
                        return this.STATUS.IN_PROGRESS;
                    }
                }
            }
            const progressText = progressBar.textContent || "";
            if (progressText.includes("100%") || progressText.includes("已完成")) {
                return this.STATUS.COMPLETED;
            }
            return null;
        },
        _detectFromClass(courseItem) {
            const classList = courseItem.classList;
            if (classList.contains("is-completed") || classList.contains("completed") || classList.contains("study-completed") || classList.contains("finished")) {
                return this.STATUS.COMPLETED;
            }
            if (classList.contains("is-learning") || classList.contains("learning") || classList.contains("study-in-progress") || classList.contains("in-study")) {
                return this.STATUS.IN_PROGRESS;
            }
            if (classList.contains("is-not-started") || classList.contains("not-started") || classList.contains("unstarted")) {
                return this.STATUS.NOT_STARTED;
            }
            return null;
        },
        _detectFromDataAttr(courseItem) {
            const dataStatus = courseItem.getAttribute("data-status") || courseItem.getAttribute("data-study-status") || courseItem.getAttribute("data-progress-status");
            if (dataStatus) {
                if (dataStatus === "completed" || dataStatus === "2" || dataStatus === "true") {
                    return this.STATUS.COMPLETED;
                } else if (dataStatus === "studying" || dataStatus === "learning" || dataStatus === "1") {
                    return this.STATUS.IN_PROGRESS;
                } else if (dataStatus === "not_started" || dataStatus === "0" || dataStatus === "false") {
                    return this.STATUS.NOT_STARTED;
                }
            }
            const dataProgress = courseItem.getAttribute("data-progress");
            if (dataProgress !== null) {
                const progress = parseInt(dataProgress, 10);
                if (!isNaN(progress)) {
                    if (progress >= 100) {
                        return this.STATUS.COMPLETED;
                    } else if (progress > 0) {
                        return this.STATUS.IN_PROGRESS;
                    } else {
                        return this.STATUS.NOT_STARTED;
                    }
                }
            }
            return null;
        },
        _calculateConfidence(vue, text, progressBar, className, dataAttr) {
            let score = 0;
            let sources = 0;
            const weights = {
                vue: 35,
                text: 25,
                progressBar: 20,
                dataAttr: 15,
                class: 5
            };
            if (vue) {
                score += weights.vue;
                sources++;
            }
            if (text) {
                score += weights.text;
                sources++;
            }
            if (progressBar) {
                score += weights.progressBar;
                sources++;
            }
            if (dataAttr) {
                score += weights.dataAttr;
                sources++;
            }
            if (className) {
                score += weights.class;
                sources++;
            }
            if (sources >= 3) {
                score += 15;
            } else if (sources >= 2) {
                score += 8;
            }
            if (sources === 1) {
                score *= .8;
            }
            return Math.min(Math.round(score), 100);
        },
        _createStatusResult(status, confidence, sources = {}, extra = {}) {
            return {
                status: status,
                confidence: confidence,
                sources: sources,
                isCompleted: status === this.STATUS.COMPLETED,
                isInProgress: status === this.STATUS.IN_PROGRESS,
                isNotStarted: status === this.STATUS.NOT_STARTED,
                ...extra
            };
        },
        _extractTitle(courseItem) {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const titleEl = courseItem.querySelector(config.TITLE_SELECTOR);
            return titleEl?.textContent?.trim() || "未知课程";
        },
        _extractCourseId(courseItem) {
            const linkEl = courseItem.querySelector('a[href*="/study/course/detail/"]');
            if (linkEl) {
                const href = linkEl.getAttribute("href");
                const match = href.match(/detail\/([^&\/]+)/);
                if (match) return match[1];
            }
            const dataId = courseItem.getAttribute("data-id") || courseItem.getAttribute("data-course-id");
            if (dataId) return dataId;
            return null;
        },
        filterLearningNeeded(statusResults) {
            return statusResults.filter(result => {
                if (result.status === this.STATUS.COMPLETED && result.confidence >= 70) {
                    return false;
                }
                return result.status === this.STATUS.IN_PROGRESS || result.status === this.STATUS.NOT_STARTED;
            });
        },
        getStatistics(statusResults) {
            const stats = {
                total: statusResults.length,
                completed: 0,
                inProgress: 0,
                notStarted: 0,
                unknown: 0,
                avgConfidence: 0
            };
            let totalConfidence = 0;
            let confidenceCount = 0;
            statusResults.forEach(result => {
                if (result.status === this.STATUS.COMPLETED) {
                    stats.completed++;
                } else if (result.status === this.STATUS.IN_PROGRESS) {
                    stats.inProgress++;
                } else if (result.status === this.STATUS.NOT_STARTED) {
                    stats.notStarted++;
                } else {
                    stats.unknown++;
                }
                if (result.confidence > 0) {
                    totalConfidence += result.confidence;
                    confidenceCount++;
                }
            });
            stats.avgConfidence = confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount) : 0;
            return stats;
        }
    };
    const BranchListValidator = {
        async validateAndGetInfo() {
            const urlValidation = this._validateUrlFormat();
            if (!urlValidation.isValid) {
                return {
                    isValid: false,
                    pageType: "unknown",
                    pageNumber: 1,
                    totalPages: 1,
                    courseCount: 0,
                    error: urlValidation.reason
                };
            }
            const domValidation = this._validateDomElements();
            if (!domValidation.isValid) {
                return {
                    isValid: false,
                    pageType: "unknown",
                    pageNumber: 1,
                    totalPages: 1,
                    courseCount: 0,
                    error: domValidation.reason
                };
            }
            const pageReady = await this._waitForPageReady();
            if (!pageReady) {
                console.warn(`[BranchListValidator] 页面加载超时，尝试提取基本信息`);
            }
            const pageInfo = await this.extractPageInfo();
            return {
                isValid: true,
                pageType: "branch-list-v",
                organizationId: pageInfo.organizationId,
                pageNumber: pageInfo.currentPage,
                totalPages: pageInfo.totalPages,
                courseCount: pageInfo.courseCount,
                pageSize: pageInfo.pageSize,
                ...pageInfo
            };
        },
        async validatePage() {
            const urlValidation = this._validateUrlFormat();
            if (!urlValidation.isValid) {
                console.warn(`[BranchListValidator] URL格式验证失败: ${urlValidation.reason}`);
                return {
                    isValid: false,
                    pageInfo: null,
                    error: urlValidation.reason
                };
            }
            const domValidation = this._validateDomElements();
            if (!domValidation.isValid) {
                console.warn(`[BranchListValidator] DOM元素验证失败: ${domValidation.reason}`);
                return {
                    isValid: false,
                    pageInfo: null,
                    error: domValidation.reason
                };
            }
            const pageReady = await this._waitForPageReady();
            if (!pageReady) {
                console.warn(`[BranchListValidator] 页面加载超时`);
                return {
                    isValid: false,
                    pageInfo: null,
                    error: "页面加载超时"
                };
            }
            const pageInfo = await this.extractPageInfo();
            console.log(`[BranchListValidator] 页面验证通过`);
            console.log(`[BranchListValidator] 组织ID: ${pageInfo.organizationId.substring(0, 8)}...`);
            console.log(`[BranchListValidator] 总页数: ${pageInfo.totalPages}`);
            console.log(`[BranchListValidator] 当前页: ${pageInfo.currentPage}`);
            console.log(`[BranchListValidator] 课程数量: ${pageInfo.courseCount}`);
            return {
                isValid: true,
                pageInfo: pageInfo
            };
        },
        _validateUrlFormat() {
            const hash = window.location.hash || "";
            if (!hash.includes("#/branch-list-v/")) {
                return {
                    isValid: false,
                    reason: "URL不包含 branch-list-v 路径"
                };
            }
            const match = hash.match(/#\/branch-list-v\/([a-f0-9-]+)/i);
            if (!match) {
                return {
                    isValid: false,
                    reason: "无法提取组织ID"
                };
            }
            const organizationId = match[1];
            if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(organizationId)) {
                return {
                    isValid: false,
                    reason: "组织ID格式无效"
                };
            }
            return {
                isValid: true,
                organizationId: organizationId
            };
        },
        _validateDomElements() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const container = document.querySelector(config.CONTAINER_SELECTOR);
            if (!container) {
                return {
                    isValid: false,
                    reason: `未找到课程列表容器: ${config.CONTAINER_SELECTOR}`
                };
            }
            const pagination = document.querySelector(config.PAGINATION_SELECTOR);
            if (!pagination) {
                return {
                    isValid: false,
                    reason: `未找到分页组件: ${config.PAGINATION_SELECTOR}`
                };
            }
            return {
                isValid: true,
                container: container,
                pagination: pagination
            };
        },
        async _waitForPageReady() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const validationConfig = config.VALIDATION || {
                PAGE_LOAD_TIMEOUT: 1e4
            };
            console.log(`[BranchListValidator] 等待页面加载...`);
            let pageLoaded = false;
            let attempts = 0;
            const maxAttempts = Math.ceil(validationConfig.PAGE_LOAD_TIMEOUT / 500);
            while (!pageLoaded && attempts < maxAttempts) {
                const container = document.querySelector(config.CONTAINER_SELECTOR);
                if (container) {
                    const items = container.querySelectorAll(config.ITEM_SELECTOR);
                    if (items && items.length > 0) {
                        pageLoaded = true;
                        console.log(`[BranchListValidator] ✅ 页面已就绪，检测到 ${items.length} 个课程项`);
                    }
                }
                if (!pageLoaded) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    attempts++;
                }
            }
            if (pageLoaded) {
                return true;
            }
            console.warn(`[BranchListValidator] 页面加载超时`);
            return false;
        },
        async extractPageInfo() {
            const urlMatch = window.location.hash.match(/#\/branch-list-v\/([a-f0-9-]+)/i);
            const organizationId = urlMatch ? urlMatch[1] : null;
            return {
                organizationId: organizationId,
                currentPage: this._getCurrentPage(),
                totalPages: this._getTotalPages(),
                courseCount: this._getCourseCount(),
                pageSize: this._getPageSize(),
                startTime: Date.now()
            };
        },
        _getCurrentPage() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const activeItem = document.querySelector(config.ACTIVE_PAGE_SELECTOR);
            if (activeItem) {
                const pageNum = parseInt(activeItem.textContent?.trim(), 10);
                if (!isNaN(pageNum) && pageNum > 0) {
                    return pageNum;
                }
            }
            const isActiveItem = document.querySelector(`${config.PAGINATION_SELECTOR} .is-active`);
            if (isActiveItem) {
                const pageNum = parseInt(isActiveItem.textContent?.trim(), 10);
                if (!isNaN(pageNum) && pageNum > 0) {
                    return pageNum;
                }
            }
            const activeLi = document.querySelector(`${config.PAGINATION_SELECTOR} li.active`);
            if (activeLi) {
                const pageNum = parseInt(activeLi.textContent?.trim(), 10);
                if (!isNaN(pageNum) && pageNum > 0) {
                    return pageNum;
                }
            }
            console.warn(`[BranchListValidator] 无法确定当前页码，默认为1`);
            return 1;
        },
        _getTotalPages() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const paginationBox = document.querySelector(config.PAGINATION_BOX_SELECTOR);
            if (paginationBox) {
                const pageText = paginationBox.textContent || "";
                const totalMatch = pageText.match(/共\s*(\d+)\s*页/);
                if (totalMatch) {
                    const total = parseInt(totalMatch[1], 10);
                    if (total > 0) {
                        return total;
                    }
                }
                const slashMatch = pageText.match(/(\d+)\s*\/\s*(\d+)/);
                if (slashMatch) {
                    const total = parseInt(slashMatch[2], 10);
                    if (total > 0) {
                        return total;
                    }
                }
            }
            const paginationEl = document.querySelector(config.PAGINATION_SELECTOR);
            if (paginationEl) {
                const pageItems = paginationEl.querySelectorAll(config.PAGE_ITEM_SELECTOR);
                if (pageItems.length > 0) {
                    const lastItem = pageItems[pageItems.length - 1];
                    const lastPageNum = parseInt(lastItem.textContent?.trim(), 10);
                    if (!isNaN(lastPageNum) && lastPageNum > 0) {
                        return lastPageNum;
                    }
                }
            }
            const lastPageBtn = document.querySelector(`${config.PAGINATION_SELECTOR} .zxy-pagination-item-last`);
            if (lastPageBtn) {
                const lastPage = lastPageBtn.getAttribute("data-page");
                if (lastPage) {
                    const total = parseInt(lastPage, 10);
                    if (total > 0) {
                        return total;
                    }
                }
            }
            console.warn(`[BranchListValidator] 无法确定总页数，默认为1`);
            return 1;
        },
        _getCourseCount() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const container = document.querySelector(config.CONTAINER_SELECTOR);
            if (!container) {
                return 0;
            }
            const courseItems = container.querySelectorAll(config.ITEM_SELECTOR);
            return courseItems.length;
        },
        _getPageSize() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const paginationBox = document.querySelector(config.PAGINATION_BOX_SELECTOR);
            if (paginationBox) {
                const pageText = paginationBox.textContent || "";
                const sizeMatch = pageText.match(/每页\s*(\d+)\s*条/);
                if (sizeMatch) {
                    return parseInt(sizeMatch[1], 10);
                }
            }
            const courseCount = this._getCourseCount();
            if (courseCount > 0 && courseCount <= 12) return 12;
            if (courseCount > 12 && courseCount <= 16) return 16;
            if (courseCount > 16 && courseCount <= 20) return 20;
            return 20;
        },
        isLastPage() {
            const currentPage = this._getCurrentPage();
            const totalPages = this._getTotalPages();
            return currentPage >= totalPages;
        },
        getPaginationSummary() {
            const currentPage = this._getCurrentPage();
            const totalPages = this._getTotalPages();
            const courseCount = this._getCourseCount();
            return `第 ${currentPage}/${totalPages} 页，共 ${courseCount} 门课程`;
        }
    };
    const CbeadScanner = {
        extractCourseInfo(element) {
            try {
                const titleSelectors = [ ".common-title", ".title", ".activity-stage-name", "h3", "h4" ];
                let courseName = null;
                for (const selector of titleSelectors) {
                    const titleEl = element.querySelector(selector);
                    if (titleEl) {
                        courseName = titleEl.textContent?.trim();
                        break;
                    }
                }
                if (!courseName) return null;
                const linkEl = element.querySelector("a");
                const courseId = linkEl?.getAttribute("data-id") || element?.getAttribute("data-id") || linkEl?.getAttribute("id");
                const studyLink = linkEl?.getAttribute("href") || element.querySelector(".study-btn")?.getAttribute("data-url");
                return {
                    id: courseId,
                    name: courseName,
                    link: studyLink,
                    element: element
                };
            } catch (error) {
                console.warn("[CbeadScanner] 提取课程信息失败:", error);
                return null;
            }
        },
        getCourses(selectors) {
            const courses = [];
            for (const selector of selectors.COURSE_ITEMS) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const courseInfo = this.extractCourseInfo(element);
                    if (courseInfo) {
                        courses.push(courseInfo);
                    }
                }
                if (courses.length > 0) break;
            }
            return courses;
        },
        categorizeAndSortCourses(courses) {
            if (!Array.isArray(courses)) {
                console.warn("[CbeadScanner] categorizeAndSortCourses 收到非数组参数:", typeof courses);
                return {
                    inProgress: [],
                    notStarted: [],
                    completed: [],
                    toLearn: []
                };
            }
            const categorized = {
                inProgress: [],
                notStarted: [],
                completed: [],
                toLearn: []
            };
            courses.forEach(course => {
                if (course.status === "in_progress") {
                    categorized.inProgress.push(course);
                    categorized.toLearn.push(course);
                } else if (course.status === "not_started") {
                    categorized.notStarted.push(course);
                    categorized.toLearn.push(course);
                } else if (course.status === "completed") {
                    categorized.completed.push(course);
                }
            });
            categorized.inProgress.sort((a, b) => b.progress - a.progress);
            console.log(`[CbeadScanner] 课程分类结果:`);
            console.log(`  - 📖 学习中: ${categorized.inProgress.length} 门`);
            console.log(`  - 📝 未开始: ${categorized.notStarted.length} 门`);
            console.log(`  - ✅ 已完成: ${categorized.completed.length} 门 (将跳过)`);
            console.log(`  - 📚 需要学习: ${categorized.toLearn.length} 门`);
            return categorized;
        },
        getSortedLearningList(courses) {
            const categorized = this.categorizeAndSortCourses(courses);
            const sortedList = [ ...categorized.inProgress, ...categorized.notStarted ];
            console.log(`[CbeadScanner] 学习顺序:`);
            sortedList.forEach((course, index) => {
                let prefix = course.status === "in_progress" ? "📖" : "📝";
                console.log(`  ${index + 1}. ${prefix} ${course.title} (${course.progress}%)`);
            });
            if (categorized.completed.length > 0) {
                console.log(`[CbeadScanner] 以下课程将跳过（已完成）:`);
                categorized.completed.forEach(course => {
                    console.log(`  ✅ ${course.title} (${course.progress}%)`);
                });
            }
            return sortedList;
        },
        async scanCoursesFromBranchListPage() {
            const courses = [];
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            console.log(`[CbeadScanner] 开始扫描课程列表...`);
            console.log(`[CbeadScanner] 选择器配置:`);
            console.log(`  - 容器选择器: ${config.CONTAINER_SELECTOR}`);
            console.log(`  - 课程项选择器: ${config.ITEM_SELECTOR}`);
            console.log(`  - 卡片容器选择器: ${config.CARD_BOX_SELECTOR}`);
            console.log(`  - 标题选择器: ${config.TITLE_SELECTOR}`);
            console.log(`  - 状态选择器: ${config.STATUS_SELECTOR}`);
            let container = document.querySelector(config.CONTAINER_SELECTOR);
            let attempts = 0;
            const maxAttempts = 20;
            while (!container && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                container = document.querySelector(config.CONTAINER_SELECTOR);
                attempts++;
            }
            if (attempts > 0) {
                console.log(`[CbeadScanner] 等待页面加载完成，尝试 ${attempts} 次`);
            }
            if (!container) {
                console.warn(`[CbeadScanner] ❌ 未找到课程列表容器: ${config.CONTAINER_SELECTOR}`);
                const altContainer = document.querySelector(".card-wrapper") || document.querySelector(".card-box");
                if (altContainer) {
                    console.log(`[CbeadScanner] ✅ 找到备选容器: ${altContainer.className}`);
                }
                return courses;
            }
            console.log(`[CbeadScanner] ✅ 找到课程列表容器`);
            const courseItems = container.querySelectorAll(config.ITEM_SELECTOR);
            console.log(`[CbeadScanner] 📚 使用 ${config.ITEM_SELECTOR} 找到 ${courseItems.length} 个课程项`);
            if (courseItems.length === 0) {
                console.log(`[CbeadScanner] 使用 ${config.ITEM_SELECTOR} 未找到课程项，尝试备选选择器...`);
                const altItems = container.querySelectorAll(config.CARD_BOX_SELECTOR);
                if (altItems.length > 0) {
                    console.log(`[CbeadScanner] ✅ 使用备选选择器 ${config.CARD_BOX_SELECTOR} 找到 ${altItems.length} 个课程项`);
                }
            }
            courseItems.forEach((item, index) => {
                try {
                    const courseInfo = this._extractCourseInfoFromBranchListItem(item, index);
                    if (courseInfo) {
                        courses.push(courseInfo);
                    }
                } catch (error) {
                    console.error(`[CbeadScanner] 处理课程项失败 (索引 ${index}):`, error);
                }
            });
            if (courses.length > 0) {
                console.log(`[CbeadScanner] 从DOM成功提取 ${courses.length} 门课程`);
                return courses;
            }
            const vueCourses = await this._extractCoursesFromVueData();
            if (vueCourses && vueCourses.length > 0) {
                console.log(`[CbeadScanner] 从Vue组件数据成功提取 ${vueCourses.length} 门课程`);
                return vueCourses;
            }
            const apiCourses = await this._fetchCoursesFromApi();
            if (apiCourses && apiCourses.length > 0) {
                console.log(`[CbeadScanner] 从API成功提取 ${apiCourses.length} 门课程`);
                return apiCourses;
            }
            const deepVueCourses = await this._extractFromVueDeepScan();
            if (deepVueCourses && deepVueCourses.length > 0) {
                console.log(`[CbeadScanner] 从Vue深度扫描成功提取 ${deepVueCourses.length} 门课程`);
                return deepVueCourses;
            }
            console.log(`[CbeadScanner] 成功扫描 ${courses.length} 门课程`);
            return courses;
        },
        async _fetchCoursesFromApi() {
            const courses = [];
            try {
                const hash = window.location.hash || "";
                const match = hash.match(/branch-list-v\/([a-f0-9-]+)/i);
                const organizationId = match ? match[1] : null;
                if (!organizationId) {
                    console.debug("[CbeadScanner] 无法从URL提取组织ID");
                    return courses;
                }
                console.log(`[CbeadScanner] 尝试从API获取课程列表，组织ID: ${organizationId.substring(0, 8)}...`);
                const apiUrl = `/api/v1/audience/course/list`;
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        organizationId: organizationId,
                        pageNum: 1,
                        pageSize: 20
                    })
                });
                if (!response.ok) {
                    console.debug(`[CbeadScanner] API请求失败: ${response.status}`);
                    return courses;
                }
                const data = await response.json();
                console.log(`[CbeadScanner] API返回数据:`, data);
                if (data.code === 200 || data.code === 0 || data.success) {
                    const records = data.data?.records || data.records || data.list || data.data || [];
                    if (Array.isArray(records) && records.length > 0) {
                        for (const item of records) {
                            const courseInfo = this._buildCourseInfoFromApiData(item);
                            if (courseInfo && courseInfo.id) {
                                courses.push(courseInfo);
                            }
                        }
                        console.log(`[CbeadScanner] 从API解析到 ${courses.length} 门课程`);
                    }
                }
            } catch (error) {
                console.debug(`[CbeadScanner] 从API获取课程失败:`, error.message);
            }
            return courses;
        },
        _extractCoursesFromVueData() {
            const courses = [];
            const vueElements = document.querySelectorAll("[data-v-]");
            for (const el of vueElements) {
                if (el.__vue__) {
                    const vueInstance = el.__vue__;
                    const courseData = this._parseVueInstanceData(vueInstance);
                    if (courseData.length > 0) {
                        courses.push(...courseData);
                    }
                }
            }
            if (window.__VueApp__ || window.__vue__ || window.Vue) {
                try {
                    const vueApp = window.__VueApp__ || window.__vue__ || window.Vue;
                    if (vueApp && vueApp.componentInstances) {
                        for (const instance of vueApp.componentInstances) {
                            const courseData = this._parseVueInstanceData(instance);
                            if (courseData.length > 0) {
                                courses.push(...courseData);
                            }
                        }
                    }
                } catch (e) {
                    console.debug("[CbeadScanner] 无法访问全局Vue实例:", e);
                }
            }
            const cardItems = document.querySelectorAll(".card-item");
            for (const card of cardItems) {
                const parentVue = this._findParentVueInstance(card);
                if (parentVue) {
                    const courseData = this._parseVueInstanceData(parentVue);
                    if (courseData.length > 0) {
                        for (const course of courseData) {
                            if (!courses.find(c => c.id === course.id)) {
                                courses.push(course);
                            }
                        }
                    }
                }
            }
            return courses;
        },
        _findParentVueInstance(element) {
            let el = element;
            const maxDepth = 10;
            let depth = 0;
            while (el && depth < maxDepth) {
                if (el.__vue__) {
                    return el.__vue__;
                }
                if (el._vueParent) {
                    return el._vueParent;
                }
                el = el.parentElement;
                depth++;
            }
            return null;
        },
        _parseVueInstanceData(vueInstance) {
            const courses = [];
            if (!vueInstance) return courses;
            const dataProps = [ "courseList", "list", "courses", "items", "data", "courseData", "tableData", "tableList", "$data", "data", "propsData" ];
            for (const prop of dataProps) {
                try {
                    let data = vueInstance[prop];
                    if (!data && vueInstance.$data) {
                        data = vueInstance.$data[prop];
                    }
                    if (data && Array.isArray(data) && data.length > 0) {
                        const firstItem = data[0];
                        if (firstItem.id || firstItem.courseId || firstItem.dsUnitId || firstItem.courseName || firstItem.title) {
                            for (const item of data) {
                                const courseInfo = this._buildCourseInfoFromApiData(item);
                                if (courseInfo && courseInfo.id) {
                                    courses.push(courseInfo);
                                }
                            }
                            console.log(`[CbeadScanner] 从Vue数据属性 ${prop} 提取到 ${courses.length} 门课程`);
                            return courses;
                        }
                    }
                } catch (e) {}
            }
            try {
                const keys = Object.keys(vueInstance);
                for (const key of keys) {
                    if (key.startsWith("_") || key === "constructor") continue;
                    try {
                        const value = vueInstance[key];
                        if (value && typeof value === "object") {
                            if (Array.isArray(value)) {
                                const courseData = this._checkAndParseCourseArray(value);
                                if (courseData.length > 0) {
                                    courses.push(...courseData);
                                }
                            }
                            if (value.data && Array.isArray(value.data)) {
                                const courseData = this._checkAndParseCourseArray(value.data);
                                if (courseData.length > 0) {
                                    courses.push(...courseData);
                                }
                            }
                            if (value.list && Array.isArray(value.list)) {
                                const courseData = this._checkAndParseCourseArray(value.list);
                                if (courseData.length > 0) {
                                    courses.push(...courseData);
                                }
                            }
                        }
                    } catch (e) {}
                }
            } catch (e) {
                console.debug("[CbeadScanner] 解析Vue实例数据失败:", e);
            }
            return courses;
        },
        _checkAndParseCourseArray(arr) {
            const courses = [];
            if (!arr || arr.length === 0) return courses;
            const firstItem = arr[0];
            const hasCourseFields = firstItem.id || firstItem.courseId || firstItem.dsUnitId || firstItem.courseName || firstItem.title || firstItem.name;
            if (hasCourseFields) {
                for (const item of arr) {
                    const courseInfo = this._buildCourseInfoFromApiData(item);
                    if (courseInfo && courseInfo.id) {
                        courses.push(courseInfo);
                    }
                }
            }
            return courses;
        },
        _buildCourseInfoFromApiData(data) {
            const courseId = data.id || data.courseId || data.dsUnitId || null;
            if (!courseId) return null;
            const title = data.courseName || data.title || data.name || "未知课程";
            const studyLink = `#/study/course/detail/${courseId}`;
            let progress = 0;
            let status = "not_started";
            if (data.studyProgress !== undefined) {
                progress = data.studyProgress;
            } else if (data.progress !== undefined) {
                progress = data.progress;
            } else if (data.percentage !== undefined) {
                progress = data.percentage;
            }
            if (progress >= CBEAD_CONSTANTS.THRESHOLDS.COMPLETED_PROGRESS) {
                status = "completed";
            } else if (progress > 0) {
                status = "in_progress";
            }
            if (data.studyStatus === 1 || data.studyStatus === "studying") {
                status = "in_progress";
                progress = progress || 50;
            } else if (data.studyStatus === 2 || data.studyStatus === "completed") {
                status = "completed";
                progress = 100;
            } else if (data.studyStatus === 0 || data.studyStatus === "not_started") {
                status = "not_started";
                progress = 0;
            }
            return {
                id: courseId,
                courseId: courseId,
                dsUnitId: courseId,
                title: title,
                courseName: title,
                link: studyLink,
                progress: progress,
                isCompleted: progress >= CBEAD_CONSTANTS.THRESHOLDS.COMPLETED_PROGRESS,
                status: status,
                element: null,
                source: "cbead_vue_data_scan",
                rawData: data
            };
        },
        _extractCourseInfoFromBranchListItem(item, index) {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const titleEl = item.querySelector(config.TITLE_SELECTOR);
            const title = titleEl?.textContent?.trim() || null;
            if (!title) {
                console.warn(`[CbeadScanner] 无法提取课程标题 (索引 ${index})`);
                return null;
            }
            let courseId = null;
            let studyLink = null;
            courseId = item.getAttribute("data-id") || item.getAttribute("data-course-id") || item.getAttribute("data-key") || item.getAttribute("data-vid") || item.getAttribute("data-idx");
            if (!courseId && item.id) {
                const idMatch = item.id.match(/([a-f0-9-]{36}|[a-f0-9]{32})/i);
                if (idMatch) courseId = idMatch[1];
            }
            if (!courseId) {
                const dataIdEl = item.querySelector("[data-id], [data-course-id]");
                if (dataIdEl) {
                    courseId = dataIdEl.getAttribute("data-id") || dataIdEl.getAttribute("data-course-id");
                }
            }
            if (!studyLink) {
                const linkEl = item.querySelector('a[href*="/study/course/detail/"]');
                if (linkEl) {
                    const href = linkEl.getAttribute("href");
                    if (href && href.includes("/study/course/detail/")) {
                        studyLink = href;
                        if (!courseId) {
                            const linkMatch = href.match(/detail\/([^&\/]+)/);
                            if (linkMatch) courseId = linkMatch[1];
                        }
                    }
                }
            }
            if (!courseId || !studyLink) {
                const vueData = this._scanVueInstanceForCourseData(item, title);
                if (vueData) {
                    if (!courseId && vueData.id) courseId = vueData.id;
                    if (!studyLink && vueData.link) studyLink = vueData.link;
                }
            }
            if (!courseId) {
                const dynamicKey = item.getAttribute("data-dynamic-key") || item.querySelector("[data-dynamic-key]")?.getAttribute("data-dynamic-key");
                if (dynamicKey && /^[a-f0-9-]{36}$/i.test(dynamicKey)) {
                    courseId = dynamicKey;
                }
            }
            if (!courseId || !studyLink) {
                const clickEl = item.querySelector("[onclick], [data-link], [data-url]");
                if (clickEl) {
                    const onclick = clickEl.getAttribute("onclick") || clickEl.getAttribute("data-link") || clickEl.getAttribute("data-url");
                    if (onclick) {
                        const linkMatch = onclick.match(/['"]?([^'"]*\/study\/course\/detail\/[^'"]*)['"]?/) || onclick.match(/detail\/([^&\/]+)/);
                        if (linkMatch) {
                            const link = linkMatch[1] || linkMatch[0];
                            studyLink = link.includes("#") ? link : `#/study/course/detail/${link}`;
                            if (!courseId) {
                                const idMatch = link.match(/detail\/([^&\/]+)/);
                                if (idMatch) courseId = idMatch[1];
                            }
                        }
                    }
                }
            }
            if (courseId && !studyLink) {
                studyLink = `#/study/course/detail/${courseId}`;
            }
            const statusEl = item.querySelector(config.STATUS_SELECTOR);
            const statusText = statusEl?.textContent?.trim() || "";
            let progress = 0;
            let status = "not_started";
            if (statusText === "学习中") {
                status = "in_progress";
                progress = 50;
            } else if (statusText === "已完成") {
                status = "completed";
                progress = 100;
            } else if (statusText === "未开始") {
                status = "not_started";
                progress = 0;
            }
            const progressBar = item.querySelector('.progress-bar, .completed-rate-bar, [class*="progress"]');
            if (progressBar) {
                const style = progressBar.getAttribute("style") || "";
                const progressMatch = style.match(/width:\s*(\d+)%/);
                if (progressMatch) {
                    progress = parseInt(progressMatch[1], 10);
                    if (progress >= CBEAD_CONSTANTS.THRESHOLDS.COMPLETED_PROGRESS) {
                        status = "completed";
                    } else if (progress > 0) {
                        status = "in_progress";
                    }
                }
            }
            const courseInfo = {
                id: courseId,
                courseId: courseId,
                dsUnitId: courseId,
                title: title,
                courseName: title,
                link: studyLink,
                element: item,
                progress: progress,
                isCompleted: progress >= CBEAD_CONSTANTS.THRESHOLDS.COMPLETED_PROGRESS,
                status: status,
                statusText: statusText,
                source: "cbead_branch_list_scan"
            };
            const statusTextDisplay = {
                completed: "✅ 已完成",
                in_progress: "📖 学习中",
                not_started: "📝 未开始"
            };
            const idDisplay = courseId ? `[ID:${courseId.substring(0, 8)}...]` : "[无ID]";
            const linkDisplay = studyLink ? `[链接:${studyLink}]` : "[无链接]";
            console.log(`[CbeadScanner] 课程 ${index + 1}: ${title} - ${statusTextDisplay[status]} (${progress}%) ${idDisplay} ${linkDisplay}`);
            return courseInfo;
        },
        _scanVueInstanceForCourseData(element, title) {
            const vueInstances = [];
            let el = element;
            for (let depth = 0; depth < 15 && el; depth++) {
                if (el.__vue__) {
                    vueInstances.push(el.__vue__);
                }
                if (el.__vue__) {
                    const vm = el.__vue__;
                    if (vm.$root && vm.$root !== vm && !vueInstances.includes(vm.$root)) {
                        vueInstances.push(vm.$root);
                    }
                    if (vm.$parent && vm.$parent !== vm && !vueInstances.includes(vm.$parent)) {
                        vueInstances.push(vm.$parent);
                    }
                }
                el = el.parentElement;
            }
            for (const vm of vueInstances) {
                try {
                    const result = this._scanVueForCourse(vm, title);
                    if (result) return result;
                } catch (e) {}
            }
            const dataVElements = element.querySelectorAll("[data-v-]");
            for (const el of dataVElements) {
                if (el.__vue__) {
                    try {
                        const result = this._scanVueForCourse(el.__vue__, title);
                        if (result) return result;
                    } catch (e) {}
                }
            }
            return null;
        },
        _scanVueForCourse(vm, title) {
            if (!vm || typeof vm !== "object") return null;
            const keys = Object.keys(vm);
            for (const key of keys) {
                if (key.startsWith("_") || key === "constructor") continue;
                try {
                    const val = vm[key];
                    if (!val || typeof val !== "object") continue;
                    if (Array.isArray(val)) {
                        for (const item of val) {
                            if (item && typeof item === "object") {
                                const matchTitle = item.title || item.courseName || item.name;
                                if (matchTitle === title) {
                                    if (item.id || item.courseId || item.dsUnitId) {
                                        return {
                                            id: item.id || item.courseId || item.dsUnitId,
                                            link: item.link || item.url || item.href || item.studyLink
                                        };
                                    }
                                }
                            }
                        }
                    }
                    if (val.id && /^[a-f0-9-]{8}/i.test(String(val.id))) {
                        const matchTitle = val.title || val.courseName || val.name;
                        if (matchTitle === title) {
                            return {
                                id: val.id,
                                link: val.link || val.url || val.href
                            };
                        }
                    }
                    if ((val.link || val.url || val.href) && String(val.link || val.url || val.href).includes("/study/course/detail/")) {
                        const matchTitle = val.title || val.courseName || val.name;
                        if (matchTitle === title) {
                            const link = val.link || val.url || val.href;
                            const idMatch = link.match(/detail\/(?:[^/]*@@)?([a-f0-9-]{36})/i);
                            return {
                                id: idMatch ? idMatch[1] : null,
                                link: link
                            };
                        }
                    }
                } catch (e) {}
            }
            if (vm.$data) {
                const data = vm.$data;
                const listKeys = [ "list", "courses", "courseList", "items", "data", "tableData" ];
                for (const listKey of listKeys) {
                    const list = data[listKey];
                    if (Array.isArray(list)) {
                        for (const item of list) {
                            if (item && typeof item === "object") {
                                const matchTitle = item.title || item.courseName || item.name;
                                if (matchTitle === title) {
                                    if (item.id || item.courseId) {
                                        return {
                                            id: item.id || item.courseId,
                                            link: item.link || item.url || item.href
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return null;
        },
        _getTotalPagesFromText() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const paginationBox = document.querySelector(config.PAGINATION_BOX_SELECTOR);
            if (paginationBox) {
                const pageText = paginationBox.textContent || "";
                const totalMatch = pageText.match(/共\s*(\d+)\s*页/);
                if (totalMatch) {
                    const total = parseInt(totalMatch[1], 10);
                    console.log(`[CbeadScanner] 从文本匹配到总页数: ${total}`);
                    return total;
                }
                const slashMatch = pageText.match(/(\d+)\s*\/\s*(\d+)/);
                if (slashMatch) {
                    const total = parseInt(slashMatch[2], 10);
                    console.log(`[CbeadScanner] 从 slash 格式匹配到总页数: ${total}`);
                    return total;
                }
            }
            const lastPageBtn = document.querySelector(`${config.PAGINATION_SELECTOR} .zxy-pagination-item-last`);
            if (lastPageBtn) {
                const lastPage = lastPageBtn.getAttribute("data-page");
                if (lastPage) {
                    const total = parseInt(lastPage, 10);
                    console.log(`[CbeadScanner] 从尾页按钮匹配到总页数: ${total}`);
                    return total;
                }
            }
            console.warn(`[CbeadScanner] 无法从文本确定总页数`);
            return 0;
        },
        _getTotalPages() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const paginationBox = document.querySelector(config.PAGINATION_BOX_SELECTOR);
            if (paginationBox) {
                const pageText = paginationBox.textContent || "";
                const totalMatch = pageText.match(/共\s*(\d+)\s*页/);
                if (totalMatch) {
                    const total = parseInt(totalMatch[1], 10);
                    console.log(`[CbeadScanner] 从文本匹配到总页数: ${total}`);
                    return total;
                }
                const slashMatch = pageText.match(/(\d+)\s*\/\s*(\d+)/);
                if (slashMatch) {
                    const total = parseInt(slashMatch[2], 10);
                    console.log(`[CbeadScanner] 从 slash 格式匹配到总页数: ${total}`);
                    return total;
                }
            }
            const lastPageBtn = document.querySelector(`${config.PAGINATION_SELECTOR} .zxy-pagination-item-last`);
            if (lastPageBtn) {
                const lastPage = lastPageBtn.getAttribute("data-page");
                if (lastPage) {
                    const total = parseInt(lastPage, 10);
                    console.log(`[CbeadScanner] 从尾页按钮匹配到总页数: ${total}`);
                    return total;
                }
            }
            console.warn(`[CbeadScanner] 无法确定总页数，默认为 1`);
            return 1;
        },
        _isPageLoaded() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const container = document.querySelector(config.CONTAINER_SELECTOR);
            const items = container?.querySelectorAll(config.ITEM_SELECTOR);
            return items && items.length > 0;
        },
        async _waitForPageLoad(timeout) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                if (this._isPageLoaded()) {
                    return true;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return false;
        },
        _isLastPage() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const nextBtn = document.querySelector(config.NEXT_BTN_SELECTOR);
            if (nextBtn) {
                const parentLi = nextBtn.closest("li");
                if (parentLi && parentLi.classList.contains("zxy-pagination-disabled")) {
                    console.log(`[CbeadScanner] 检测到父元素 li 包含禁用类（最后一页）`);
                    return true;
                }
                if (nextBtn.classList.contains("is-disabled") || nextBtn.classList.contains("disabled") || nextBtn.classList.contains(config.DISABLED_PAGINATION_CLASS)) {
                    console.log(`[CbeadScanner] 检测到下一页按钮包含禁用类（最后一页）`);
                    return true;
                }
                if (nextBtn.hasAttribute("disabled") || nextBtn.getAttribute("aria-disabled") === "true") {
                    console.log(`[CbeadScanner] 检测到下一页按钮已禁用（最后一页）`);
                    return true;
                }
                const style = nextBtn.getAttribute("style") || "";
                if (style.includes("display: none") || style.includes("visibility: hidden")) {
                    console.log(`[CbeadScanner] 检测到下一页按钮隐藏（最后一页）`);
                    return true;
                }
            }
            const disabledNext = document.querySelector(".zxy-pagination-next.is-disabled, .zxy-pagination-next.disabled, .zxy-pagination-next.zxy-pagination-disabled");
            if (disabledNext) {
                console.log(`[CbeadScanner] 检测到禁用的下一页按钮（最后一页）`);
                return true;
            }
            const nextLi = document.querySelector(".zxy-pagination-next")?.closest("li");
            if (nextLi && nextLi.classList.contains("zxy-pagination-disabled")) {
                console.log(`[CbeadScanner] 检测到下一页父元素 li.zxy-pagination-disabled（最后一页）`);
                return true;
            }
            const disabledItems = document.querySelectorAll(`${config.PAGINATION_SELECTOR} .is-disabled, ${config.PAGINATION_SELECTOR} .disabled`);
            for (const item of disabledItems) {
                if (item.classList.contains("zxy-pagination-next") || item.querySelector(".zxy-pagination-next")) {
                    console.log(`[CbeadScanner] 检测到禁用的下一页分页项（最后一页）`);
                    return true;
                }
            }
            const currentPage = this._getCurrentPage();
            const totalPages = this._getTotalPagesFromText();
            console.log(`[CbeadScanner] 当前页: ${currentPage}, 总页数: ${totalPages}`);
            if (currentPage >= totalPages && totalPages > 0) {
                console.log(`[CbeadScanner] 当前页码 >= 总页数（最后一页）`);
                return true;
            }
            return false;
        },
        async _clickNextPage() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            if (this._isLastPage()) {
                console.log(`[CbeadScanner] 已到达最后一页`);
                return false;
            }
            const paginationContainer = document.querySelector(config.PAGINATION_BOX_SELECTOR);
            if (!paginationContainer) {
                console.warn(`[CbeadScanner] 未找到分页容器: ${config.PAGINATION_BOX_SELECTOR}`);
                return false;
            }
            const nextBtn = paginationContainer.querySelector(".zxy-pagination-next");
            if (!nextBtn) {
                console.warn(`[CbeadScanner] 未找到下一页按钮`);
                return false;
            }
            const currentUrl = window.location.href;
            console.log(`[CbeadScanner] 点击前 URL: ${currentUrl}`);
            const parentLi = nextBtn.closest("li");
            if (parentLi) {
                console.log(`[CbeadScanner] 找到下一页按钮，父元素类名: ${parentLi.className}`);
            }
            if (parentLi && parentLi.classList.contains("zxy-pagination-disabled")) {
                console.log(`[CbeadScanner] 下一页按钮父元素 li 已禁用（最后一页）`);
                return false;
            }
            if (nextBtn.classList.contains("is-disabled") || nextBtn.classList.contains("disabled") || nextBtn.classList.contains(config.DISABLED_PAGINATION_CLASS) || nextBtn.hasAttribute("disabled") || nextBtn.getAttribute("aria-disabled") === "true") {
                console.log(`[CbeadScanner] 下一页按钮已禁用（最后一页）`);
                return false;
            }
            const currentPage = this._getCurrentPage();
            console.log(`[CbeadScanner] 正在从第 ${currentPage} 页点击下一页...`);
            nextBtn.click();
            console.log(`[CbeadScanner] ✅ 已点击下一页按钮`);
            await new Promise(resolve => setTimeout(resolve, config.PAGINATION_DELAY));
            console.log(`[CbeadScanner] 点击后 URL: ${window.location.href}`);
            if (window.location.pathname === "/" && !window.location.hash) {
                console.error(`[CbeadScanner] ⚠️ 检测到异常跳转到根路径！`);
                return false;
            }
            let newPage = this._getCurrentPage();
            let attempts = 0;
            const maxAttempts = 5;
            while (newPage === currentPage && attempts < maxAttempts) {
                attempts++;
                console.log(`[CbeadScanner] 页面未变化（第${attempts}次尝试），继续等待...`);
                if (this._isLastPage()) {
                    console.log(`[CbeadScanner] 检测到已到达最后一页`);
                    return false;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
                newPage = this._getCurrentPage();
            }
            console.log(`[CbeadScanner] 页面变化: ${currentPage} -> ${newPage}`);
            if (newPage === currentPage) {
                console.warn(`[CbeadScanner] 页面未变化，可能已到最后一页或加载失败`);
                if (this._isLastPage()) {
                    return false;
                }
                console.warn(`[CbeadScanner] 页面加载异常，停止翻页`);
                return false;
            }
            const totalPages = this._getTotalPagesFromText();
            if (totalPages > 0 && newPage > totalPages) {
                console.warn(`[CbeadScanner] 页码异常: 新页码 ${newPage} 超过总页数 ${totalPages}`);
                return false;
            }
            return true;
        },
        _getCurrentPage() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const activeItem = document.querySelector(config.ACTIVE_PAGE_SELECTOR);
            if (activeItem) {
                const pageNum = parseInt(activeItem.textContent?.trim(), 10);
                if (!isNaN(pageNum)) {
                    return pageNum;
                }
            }
            const isActiveItem = document.querySelector(`${config.PAGINATION_SELECTOR} .is-active`);
            if (isActiveItem) {
                const pageNum = parseInt(isActiveItem.textContent?.trim(), 10);
                if (!isNaN(pageNum)) {
                    return pageNum;
                }
            }
            return 1;
        },
        async scanAllCoursesWithPagination() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const allCourses = [];
            let currentPage = 1;
            console.log(`[CbeadScanner] 开始翻页扫描课程...`);
            while (true) {
                const pageCourses = await this.scanCoursesFromBranchListPage();
                console.log(`[CbeadScanner] 第 ${currentPage} 页: 扫描到 ${pageCourses.length} 门课程`);
                allCourses.push(...pageCourses);
                const hasNext = await this._clickNextPage();
                if (!hasNext) {
                    console.log(`[CbeadScanner] 已到达最后一页，停止扫描`);
                    break;
                }
                currentPage++;
                const loaded = await this._waitForPageLoad(config.PAGE_LOAD_TIMEOUT);
                if (!loaded) {
                    console.warn(`[CbeadScanner] 页面 ${currentPage} 加载超时，停止扫描`);
                    break;
                }
            }
            console.log(`[CbeadScanner] 翻页扫描完成，共 ${allCourses.length} 门课程`);
            console.log(`[CbeadScanner] 📤 返回 ${allCourses.length} 门课程`);
            return allCourses;
        },
        _getTagList() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const tagContainer = document.querySelector(config.TAG_CONTAINER_SELECTOR);
            if (!tagContainer) {
                console.warn(`[CbeadScanner] 未找到标签容器: ${config.TAG_CONTAINER_SELECTOR}`);
                return [];
            }
            const tagBtns = tagContainer.querySelectorAll(config.TAG_BTN_SELECTOR);
            return Array.from(tagBtns);
        },
        async clickTagFilter(tagBtn) {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            if (!tagBtn) {
                return false;
            }
            if (tagBtn.classList.contains("is-active") || tagBtn.classList.contains("active")) {
                console.log(`[CbeadScanner] 标签已激活，跳过`);
                return false;
            }
            const tagText = tagBtn.textContent?.trim() || "未知标签";
            console.log(`[CbeadScanner] 点击标签: ${tagText}`);
            tagBtn.click();
            await new Promise(resolve => setTimeout(resolve, config.TAG_SWITCH_DELAY));
            return true;
        },
        async scanAllCoursesWithTagFilter(skipAllTag = true) {
            const allCourses = [];
            const seenLinks = new Set;
            console.log(`[CbeadScanner] 开始扫描所有标签下的课程...`);
            const tagList = this._getTagList();
            if (tagList.length === 0) {
                console.warn(`[CbeadScanner] 未找到标签，尝试普通扫描`);
                return this.scanAllCoursesWithPagination();
            }
            for (let i = 0; i < tagList.length; i++) {
                const tagBtn = tagList[i];
                const tagText = tagBtn.textContent?.trim() || `标签${i + 1}`;
                if (skipAllTag && (tagText === "全部" || tagText === "All" || tagText === "全部标签")) {
                    console.log(`[CbeadScanner] 跳过"全部"标签`);
                    continue;
                }
                console.log(`[CbeadScanner] 处理标签: ${tagText}`);
                if (i > 0 || !skipAllTag) {
                    const clicked = await this.clickTagFilter(tagBtn);
                    if (!clicked) {
                        console.log(`[CbeadScanner] 标签 ${tagText} 无需切换或切换失败`);
                    }
                }
                const tagCourses = await this.scanAllCoursesWithPagination();
                for (const course of tagCourses) {
                    if (!seenLinks.has(course.link)) {
                        seenLinks.add(course.link);
                        allCourses.push(course);
                    }
                }
                console.log(`[CbeadScanner] 标签 ${tagText}: ${tagCourses.length} 门课程（累计 ${allCourses.length} 门）`);
            }
            console.log(`[CbeadScanner] 标签扫描完成，共 ${allCourses.length} 门课程（去重后）`);
            return allCourses;
        },
        async scanCoursesFromBranchList(options = {}) {
            const {useTagFilter: useTagFilter = false, skipAllTag: skipAllTag = true} = options;
            console.log(`[CbeadScanner] 开始扫描 branch-list-v 页面`);
            console.log(`[CbeadScanner] 选项: useTagFilter=${useTagFilter}, skipAllTag=${skipAllTag}`);
            console.log(`[CbeadScanner] 当前页面URL: ${window.location.href}`);
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            let container = document.querySelector(config.CONTAINER_SELECTOR);
            let attempts = 0;
            const maxAttempts = 20;
            while (!container && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                container = document.querySelector(config.CONTAINER_SELECTOR);
                attempts++;
            }
            if (attempts > 0) {
                console.log(`[CbeadScanner] 等待页面加载完成，尝试 ${attempts} 次`);
            }
            if (useTagFilter) {
                console.log(`[CbeadScanner] 使用标签筛选模式...`);
                return await this.scanAllCoursesWithTagFilter(skipAllTag);
            } else {
                console.log(`[CbeadScanner] 使用普通翻页模式...`);
                return await this.scanAllCoursesWithPagination();
            }
        },
        async scanCoursesFromColumnPage() {
            console.log(`[CbeadScanner] 开始扫描专题班课程...`);
            const pageStyle = this._detectColumnPageStyle();
            console.log(`[CbeadScanner] 检测到页面样式: ${pageStyle}`);
            if (pageStyle === "activity") {
                return await this._scanFromActivityPageStyle();
            } else if (pageStyle === "layout") {
                return await this._scanFromLayoutStyle();
            } else {
                console.warn(`[CbeadScanner] 未识别的页面样式，尝试所有扫描方法`);
                let courses = await this._scanFromActivityPageStyle();
                if (courses.length > 0) return courses;
                courses = await this._scanFromLayoutStyle();
                return courses;
            }
        },
        _detectColumnPageStyle() {
            const config = CBEAD_CONSTANTS.COLUMN_PAGE;
            const activityContainer = document.querySelector(config.ACTIVITY_STYLE.CONTAINER_SELECTOR);
            if (activityContainer) {
                if (activityContainer.querySelector("ul.list")) {
                    console.log(`[CbeadScanner] 检测到活动清单样式 (.activity-page) - 通过 ul.list`);
                    return "activity";
                }
                const courseItems = activityContainer.querySelectorAll("li.clearfix");
                if (courseItems.length > 0) {
                    console.log(`[CbeadScanner] 检测到活动清单样式 (.activity-page) - 通过课程项`);
                    return "activity";
                }
                const allItems = activityContainer.querySelectorAll('[class*="activity-stage"]');
                if (allItems.length > 0) {
                    console.log(`[CbeadScanner] 检测到活动清单样式 (.activity-page) - 通过 stage 元素`);
                    return "activity";
                }
                console.log(`[CbeadScanner] 检测到活动清单样式 (.activity-page) - 容器存在`);
                return "activity";
            }
            const layoutContainer = document.querySelector(config.LAYOUT_STYLE.CONTAINER_SELECTOR);
            if (layoutContainer) {
                const listElements = layoutContainer.querySelector(config.LAYOUT_STYLE.LIST_SELECTOR);
                if (listElements || layoutContainer.querySelector(config.LAYOUT_STYLE.ITEM_SELECTOR)) {
                    console.log(`[CbeadScanner] 检测到layout样式 (.class-layout)`);
                    return "layout";
                }
            }
            console.log(`[CbeadScanner] 无法确定页面样式`);
            return "unknown";
        },
        async _scanFromActivityPageStyle() {
            const config = CBEAD_CONSTANTS.COLUMN_PAGE.ACTIVITY_STYLE;
            let container = document.querySelector(config.CONTAINER_SELECTOR);
            let attempts = 0;
            const maxAttempts = 20;
            while (!container && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                container = document.querySelector(config.CONTAINER_SELECTOR);
                attempts++;
            }
            if (attempts > 0) {
                console.log(`[CbeadScanner] 等待页面加载完成，尝试 ${attempts} 次`);
            }
            const courses = [];
            if (!container) {
                console.warn(`[CbeadScanner] 未找到专题班课程列表容器: ${config.CONTAINER_SELECTOR}`);
                return courses;
            }
            const allLists = container.querySelectorAll(".activity-stage ul.list");
            console.log(`[CbeadScanner] 专题班页面找到 ${allLists.length} 个课程列表模块`);
            allLists.forEach((list, moduleIndex) => {
                const moduleTitleEl = list.parentElement?.querySelector(".activity-stage-name");
                const moduleTitle = moduleTitleEl?.textContent?.trim() || `模块${moduleIndex + 1}`;
                const courseItems = list.querySelectorAll(config.ITEM_SELECTOR);
                console.log(`[CbeadScanner] ${moduleTitle}模块: 找到 ${courseItems.length} 个课程项`);
                courseItems.forEach((item, index) => {
                    try {
                        const titleEl = item.querySelector(config.TITLE_SELECTOR);
                        if (!titleEl) {
                            console.warn(`[CbeadScanner] ${moduleTitle} 课程 ${index + 1}: 未找到标题元素`);
                            return;
                        }
                        const idMatch = titleEl.id?.match(/D75itemDetail1-([a-f0-9-]+)/);
                        if (!idMatch) {
                            const altIdMatch = item.id?.match(/([a-f0-9-]{36})/i);
                            if (!altIdMatch) {
                                console.warn(`[CbeadScanner] ${moduleTitle} 课程 ${index + 1}: 无法提取课程ID`);
                                return;
                            }
                            var courseId = altIdMatch[1];
                        } else {
                            courseId = idMatch[1];
                        }
                        const title = titleEl.textContent?.trim() || `课程${courseId.substring(0, 8)}`;
                        const progressBar = item.querySelector(config.PROGRESS_BAR_SELECTOR);
                        const style = progressBar?.getAttribute("style") || "";
                        const progressMatch = style.match(/width:\s*(\d+)%/);
                        const progress = progressMatch ? parseInt(progressMatch[1]) : 0;
                        const studyLink = `#/study/course/detail/${courseId}`;
                        let status = "not_started";
                        if (progress >= CBEAD_CONSTANTS.THRESHOLDS.COMPLETED_PROGRESS) {
                            status = "completed";
                        } else if (progress > 0) {
                            status = "in_progress";
                        }
                        courses.push({
                            id: courseId,
                            courseId: courseId,
                            dsUnitId: courseId,
                            title: title,
                            courseName: title,
                            link: studyLink,
                            progress: progress,
                            isCompleted: progress >= CBEAD_CONSTANTS.THRESHOLDS.COMPLETED_PROGRESS,
                            status: status,
                            element: item,
                            source: "cbead_column_activity_style",
                            module: moduleTitle
                        });
                        const statusTextDisplay = {
                            completed: "✅ 已完成",
                            in_progress: "📖 学习中",
                            not_started: "📝 未开始"
                        };
                        console.log(`[CbeadScanner] ${moduleTitle} 课程 ${index + 1}: ${title} - ${statusTextDisplay[status]} (${progress}%)`);
                    } catch (error) {
                        console.error(`[CbeadScanner] ${moduleTitle} 处理课程项失败 (索引 ${index}):`, error);
                    }
                });
            });
            console.log(`[CbeadScanner] 活动清单样式扫描完成，共 ${courses.length} 门课程`);
            return courses;
        },
        async _scanFromLayoutStyle() {
            const config = CBEAD_CONSTANTS.COLUMN_PAGE.LAYOUT_STYLE;
            let container = document.querySelector(config.CONTAINER_SELECTOR);
            let attempts = 0;
            const maxAttempts = 20;
            while (!container && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                container = document.querySelector(config.CONTAINER_SELECTOR);
                attempts++;
            }
            if (attempts > 0) {
                console.log(`[CbeadScanner] 等待页面加载完成，尝试 ${attempts} 次`);
            }
            if (!container) {
                console.warn(`[CbeadScanner] 未找到layout样式课程列表容器: ${config.CONTAINER_SELECTOR}`);
                return [];
            }
            const tabContainer = document.querySelector(config.TAB_SWITCH.CONTAINER_SELECTOR);
            const hasTabs = tabContainer !== null;
            if (hasTabs) {
                console.log(`[CbeadScanner] 检测到标签切换，将遍历所有标签`);
                return await this._scanFromLayoutStyleWithTabs(container, tabContainer);
            } else {
                console.log(`[CbeadScanner] 未检测到标签切换，扫描单个列表`);
                return await this._scanFromLayoutStyleSingle(container);
            }
        },
        async _scanFromLayoutStyleWithTabs(container, tabContainer) {
            const config = CBEAD_CONSTANTS.COLUMN_PAGE.LAYOUT_STYLE;
            const allCourses = [];
            const seenCourseIds = new Set;
            const tabItems = tabContainer.querySelectorAll(config.TAB_SWITCH.TAB_ITEM_SELECTOR);
            console.log(`[CbeadScanner] 找到 ${tabItems.length} 个标签`);
            for (let tabIndex = 0; tabIndex < tabItems.length; tabIndex++) {
                const tab = tabItems[tabIndex];
                const tabName = tab.textContent?.trim() || `标签${tabIndex + 1}`;
                const isActive = tab.classList.contains(config.TAB_SWITCH.ACTIVE_CLASS);
                if (!isActive) {
                    console.log(`[CbeadScanner] 切换到标签: ${tabName}`);
                    tab.click();
                    await new Promise(resolve => setTimeout(resolve, config.TAB_SWITCH.SWITCH_DELAY));
                } else {
                    console.log(`[CbeadScanner] 当前已在标签: ${tabName}`);
                }
                const courseList = container.querySelector(config.LIST_SELECTOR);
                if (!courseList) {
                    console.warn(`[CbeadScanner] 标签 "${tabName}" 未找到课程列表`);
                    continue;
                }
                const courseItems = courseList.querySelectorAll(config.ITEM_SELECTOR);
                console.log(`[CbeadScanner] 标签 "${tabName}": 找到 ${courseItems.length} 个课程项`);
                for (let itemIndex = 0; itemIndex < courseItems.length; itemIndex++) {
                    const item = courseItems[itemIndex];
                    try {
                        const courseInfo = this._extractCourseFromLayoutItem(item, config, itemIndex, tabName);
                        if (courseInfo && courseInfo.id && !seenCourseIds.has(courseInfo.id)) {
                            seenCourseIds.add(courseInfo.id);
                            allCourses.push(courseInfo);
                        } else if (courseInfo && seenCourseIds.has(courseInfo.id)) {
                            console.log(`[CbeadScanner] 标签 "${tabName}" 课程 ${itemIndex + 1}: ${courseInfo.title} - 已存在，跳过`);
                        }
                    } catch (error) {
                        console.error(`[CbeadScanner] 标签 "${tabName}" 处理课程项失败 (索引 ${itemIndex}):`, error);
                    }
                }
            }
            console.log(`[CbeadScanner] layout样式（带标签）扫描完成，共 ${allCourses.length} 门课程（去重后）`);
            return allCourses;
        },
        async _scanFromLayoutStyleSingle(container) {
            const config = CBEAD_CONSTANTS.COLUMN_PAGE.LAYOUT_STYLE;
            const courses = [];
            const courseList = container.querySelector(config.LIST_SELECTOR);
            if (!courseList) {
                console.warn(`[CbeadScanner] 未找到课程列表: ${config.LIST_SELECTOR}`);
                return courses;
            }
            const courseItems = courseList.querySelectorAll(config.ITEM_SELECTOR);
            console.log(`[CbeadScanner] layout样式找到 ${courseItems.length} 个课程项`);
            courseItems.forEach((item, index) => {
                try {
                    const courseInfo = this._extractCourseFromLayoutItem(item, config, index);
                    if (courseInfo) {
                        courses.push(courseInfo);
                    }
                } catch (error) {
                    console.error(`[CbeadScanner] layout样式 处理课程项失败 (索引 ${index}):`, error);
                }
            });
            console.log(`[CbeadScanner] layout样式扫描完成，共 ${courses.length} 门课程`);
            return courses;
        },
        _extractCourseFromLayoutItem(item, config, index, tabName = "") {
            const titleEl = item.querySelector(config.TITLE_SELECTOR);
            if (!titleEl) {
                console.warn(`[CbeadScanner] ${tabName ? `标签"${tabName}" ` : ""}课程 ${index + 1}: 未找到标题元素`);
                return null;
            }
            let courseId = null;
            const idMatch = titleEl.id?.match(/D74itemDetail-([a-f0-9-]+)/i);
            if (idMatch) {
                courseId = idMatch[1];
            } else {
                courseId = item.getAttribute("data-activityid");
                if (!courseId) {
                    const altIdMatch = titleEl.id?.match(/([a-f0-9-]{36})/i);
                    if (altIdMatch) {
                        courseId = altIdMatch[1];
                    } else {
                        console.warn(`[CbeadScanner] ${tabName ? `标签"${tabName}" ` : ""}课程 ${index + 1}: 无法提取课程ID`);
                        return null;
                    }
                }
            }
            const title = titleEl.textContent?.trim() || `课程${courseId.substring(0, 8)}`;
            const statusEl = item.querySelector(config.STATUS_SELECTOR);
            const statusText = statusEl?.textContent?.trim() || "";
            let progress = 0;
            let status = "not_started";
            if (statusText === config.STATUS_TEXT.COMPLETED) {
                status = "completed";
                progress = 100;
            } else if (statusText === config.STATUS_TEXT.IN_PROGRESS) {
                status = "in_progress";
                progress = 50;
            } else if (statusText === config.STATUS_TEXT.UNFINISHED) {
                status = "not_started";
                progress = 0;
            } else {
                status = "not_started";
                progress = 0;
            }
            const studyLink = `#/study/course/detail/${courseId}`;
            const statusTextDisplay = {
                completed: "✅ 已完成",
                in_progress: "📖 学习中",
                not_started: "📝 未开始"
            };
            const tabPrefix = tabName ? `[${tabName}] ` : "";
            console.log(`[CbeadScanner] ${tabPrefix}课程 ${index + 1}: ${title} - ${statusTextDisplay[status]} (${progress}%) [状态文本: "${statusText}"]`);
            return {
                id: courseId,
                courseId: courseId,
                dsUnitId: courseId,
                title: title,
                courseName: title,
                link: studyLink,
                progress: progress,
                isCompleted: progress >= CBEAD_CONSTANTS.THRESHOLDS.COMPLETED_PROGRESS,
                status: status,
                element: item,
                source: "cbead_column_layout_style",
                statusText: statusText,
                tabName: tabName || null
            };
        },
        detectPageType() {
            const hash = window.location.hash || "";
            if (hash.includes(CBEAD_CONSTANTS.PATH_PATTERNS.BRANCH_LIST)) {
                return {
                    pageType: "branch-list",
                    pageName: "在线自学课程列表",
                    scanMethod: () => this.scanCoursesFromBranchListPage()
                };
            }
            if (hash.includes(CBEAD_CONSTANTS.PATH_PATTERNS.COLUMN)) {
                return {
                    pageType: "column",
                    pageName: "专题班详情",
                    scanMethod: () => this.scanCoursesFromColumnPage()
                };
            }
            const branchContainer = document.querySelector(CBEAD_CONSTANTS.BRANCH_LIST.CONTAINER_SELECTOR);
            if (branchContainer) {
                return {
                    pageType: "branch-list",
                    pageName: "在线自学课程列表",
                    scanMethod: () => this.scanCoursesFromBranchListPage()
                };
            }
            const columnContainerActivity = document.querySelector(CBEAD_CONSTANTS.COLUMN_PAGE.ACTIVITY_STYLE.CONTAINER_SELECTOR);
            const columnContainerLayout = document.querySelector(CBEAD_CONSTANTS.COLUMN_PAGE.LAYOUT_STYLE.CONTAINER_SELECTOR);
            if (columnContainerActivity || columnContainerLayout) {
                return {
                    pageType: "column",
                    pageName: "专题班详情",
                    scanMethod: () => this.scanCoursesFromColumnPage()
                };
            }
            return {
                pageType: "unknown",
                pageName: "未知页面",
                scanMethod: null
            };
        },
        async _extractFromVueDeepScan() {
            const courses = [];
            try {
                const vueInstances = [];
                const allElements = document.querySelectorAll("*");
                for (const el of allElements) {
                    if (el.__vue__) {
                        vueInstances.push(el.__vue__);
                    }
                }
                console.log(`[CbeadScanner] 找到 ${vueInstances.length} 个Vue实例进行深度扫描`);
                for (const instance of vueInstances) {
                    const instanceCourses = this._deepScanVueInstance(instance);
                    for (const course of instanceCourses) {
                        if (!courses.find(c => c.id === course.id)) {
                            courses.push(course);
                        }
                    }
                }
            } catch (error) {
                console.debug("[CbeadScanner] Vue深度扫描失败:", error.message);
            }
            return courses;
        },
        _deepScanVueInstance(obj, visited = new Set, depth = 0) {
            const courses = [];
            const maxDepth = 15;
            const maxItems = 5e3;
            if (depth > maxDepth) return courses;
            if (visited.size > maxItems) return courses;
            if (!obj || typeof obj !== "object") return courses;
            visited.add(obj);
            try {
                if (Array.isArray(obj)) {
                    for (const item of obj) {
                        if (item && typeof item === "object") {
                            const courseInfo = this._tryBuildCourseInfo(item);
                            if (courseInfo) {
                                courses.push(courseInfo);
                            } else {
                                courses.push(...this._deepScanVueInstance(item, visited, depth + 1));
                            }
                        }
                    }
                } else {
                    const courseInfo = this._tryBuildCourseInfo(obj);
                    if (courseInfo) {
                        courses.push(courseInfo);
                    }
                    for (const key of Object.keys(obj)) {
                        if (key.startsWith("_") || key === "constructor") continue;
                        try {
                            const value = obj[key];
                            if (value && typeof value === "object" && !visited.has(value)) {
                                courses.push(...this._deepScanVueInstance(value, visited, depth + 1));
                            }
                        } catch (e) {}
                    }
                }
            } catch (error) {}
            return courses;
        },
        _tryBuildCourseInfo(data) {
            if (!data || typeof data !== "object") return null;
            const id = data.id || data.courseId || data.dsUnitId || data.courseCode;
            const title = data.title || data.courseName || data.name || data.courseTitle;
            if (!id || !title) return null;
            if (!/^[a-f0-9]{8}-?[a-f0-9]{4}/i.test(String(id))) {
                return null;
            }
            const lowerTitle = String(title).toLowerCase();
            const invalidKeywords = [ "分院", "主页", "专题班", "在线自学", "专栏", "个人中心", "AI教练", "最近活动", "往期回顾", "课程目录体系", "其他课程", "分享到问道", "默认配置", "配置", "设置", "导航", "菜单", "页脚", "皮肤", "标签", "学习任务", "数据归档", "密码安全", "第三方平台", "最近学习", "备案信息", "登录页", "协议", "logo", "勋章", "纷享", "打赏", "限流", "防刷", "飘窗", "学币", "分院统计", "语言配置", "播放器", "数据导出", "账户登录", "身份验证", "证书获取", "人脸", "重操作", "防录屏", "扫码下载", "扫码关注", "问吧", "知识付费", "APP状态栏", "移动端", "管理员", "默认首页", "详情页", "个人信息", "网页置灰", "分享", "重操作显示", "课程目录体系", "其他课程", "系统配置", "系统设置", "微信", "QQ空间", "新浪微搏", "微博", "安徽", "北京", "上海", "广东", "深圳", "浙江", "江苏", "政治理论", "党性教育", "时政热点", "宏观经济", "产业发展", "管理理论", "实践", "国企改革", "国企党建", "转型升级", "人文素养", "安全生产", "工会工作", "合规管理", "创新管理", "二十大", "三中全会", "现代企业制度", "理想信念", "创新思维", "战略管理", "八项规定", "创新转型", "ESG", "领导力", "科改", "技术发展", "调查研究", "行业发展", "主题教育", "职业素养", "人才培养", "人工智能", "数字化转型", "碳达峰", "碳中和", "党的宗旨", "党建生产", "深度融合", "世界一流", "新质生产力", "资本运营", "财务管理", "企业文化", "廉政教育", "全面从严治党", "市场化", "经营机制", "金融形势", "品牌建设", "党史", "国史", "科技创新", "好干部", "国企改革趋势", "总体要求", "国有企业简史", "特色课程", "乡村振兴", "转型发展", "领导力", "形势政策", "政治经济", "并购重组", "传统文化", "审计", "应急管理", "纪检监察", "产业形势", "思想政治", "职场胜任", "宏观形势", "行业领域", "资本市场", "生态文明", "采购管理", "治国理政", "危机领导力", "绿色发展", "数智化", "国际化", "涉外", "风险管理", "业财融合", "新发展", "政治能力", "创新发展", "激励与绩效", "金融风险", "支部建设", "理论学习", "国资监管", "风控体系", "条例", "变革领导力", "报表分析", "团队领导力", "混合所有制", "新闻宣传", "国际化经营", "国际形势", "梯队建设", "演讲与沟通", "三项制度", "外交政策", "绿色金融", "媒介素养", "廉洁从业", "宏观政策", "形势教育", "公共关系", "物流与供应链", "战略人力", "基本理论", "产业创新", "企业管理", "党建", "改革发展", "个人修养", "党性修养", "政治能力" ];
            for (const keyword of invalidKeywords) {
                if (lowerTitle.includes(keyword.toLowerCase())) {
                    return null;
                }
            }
            const invalidPrefixes = [ "系统", "后台", "配置", "设置", "菜单" ];
            for (const prefix of invalidPrefixes) {
                if (lowerTitle.startsWith(prefix.toLowerCase())) {
                    return null;
                }
            }
            if (/^[a-f0-9]{32}$/i.test(lowerTitle) || /^[a-f0-9]{8}-[a-f0-9]{4}/i.test(lowerTitle)) {
                return null;
            }
            const titleLength = String(title).length;
            if (titleLength < 4 || titleLength > 50) {
                return null;
            }
            return this._buildCourseInfoFromApiData(data);
        },
        async detectCourseStatusBatch(courseItems) {
            if (!Array.isArray(courseItems) || courseItems.length === 0) {
                console.warn("[CbeadScanner] 检测状态收到空课程列表");
                return [];
            }
            console.log(`[CbeadScanner] 开始批量检测课程状态，共 ${courseItems.length} 个课程项`);
            const hasDomElements = courseItems.some(item => item && typeof item.querySelector === "function");
            let statusResults;
            if (hasDomElements) {
                statusResults = CourseStatusDetector.detectBatch(courseItems);
            } else {
                console.log(`[CbeadScanner] 输入为课程对象数组，跳过状态检测`);
                statusResults = courseItems.map((item, index) => {
                    const status = item.status || "not_started";
                    const progress = item.progress || 0;
                    return {
                        index: index,
                        element: item.element || null,
                        status: status,
                        confidence: 100,
                        isCompleted: item.isCompleted || progress >= 100,
                        isInProgress: status === "in_progress",
                        isNotStarted: status === "not_started",
                        title: item.title || item.courseName || "未知课程",
                        courseId: item.id || item.courseId || null
                    };
                });
            }
            const coursesWithStatus = statusResults.map((result, index) => {
                const item = courseItems[index];
                const title = result.title || item && (item.title || item.courseName) || this._safeExtractTitle(item);
                const courseId = result.courseId || item && (item.id || item.courseId) || this._safeExtractId(item);
                let status = "not_started";
                let progress = 0;
                if (result.status === CourseStatusDetector.STATUS.COMPLETED) {
                    status = "completed";
                    progress = 100;
                } else if (result.status === CourseStatusDetector.STATUS.IN_PROGRESS) {
                    status = "in_progress";
                    progress = 50;
                }
                return {
                    id: courseId,
                    courseId: courseId,
                    dsUnitId: courseId,
                    title: title,
                    courseName: title,
                    link: item?.link || (courseId ? `#/study/course/detail/${courseId}` : null),
                    element: item?.element || item,
                    progress: progress,
                    isCompleted: result.isCompleted,
                    status: status,
                    statusConfidence: result.confidence,
                    statusSources: result.sources,
                    source: "cbead_status_detector"
                };
            });
            const stats = CourseStatusDetector.getStatistics(statusResults);
            console.log(`[CbeadScanner] 状态检测统计: 全部${stats.total}, 已完成${stats.completed}, 学习中${stats.inProgress}, 未开始${stats.notStarted}, 平均置信度${stats.avgConfidence}%`);
            return coursesWithStatus;
        },
        _safeExtractTitle(element) {
            if (!element || typeof element.querySelector !== "function") {
                return "未知课程";
            }
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const titleEl = element.querySelector(config.TITLE_SELECTOR);
            return titleEl?.textContent?.trim() || "未知课程";
        },
        _safeExtractId(element) {
            if (!element || typeof element.querySelector !== "function") {
                return null;
            }
            const linkEl = element.querySelector('a[href*="/study/course/detail/"]');
            if (linkEl) {
                const href = linkEl.getAttribute("href");
                const match = href.match(/detail\/([^&\/]+)/);
                if (match) return match[1];
            }
            return element.getAttribute("data-id") || null;
        },
        _extractIdFromElement(element) {
            const linkEl = element.querySelector('a[href*="/study/course/detail/"]');
            if (linkEl) {
                const href = linkEl.getAttribute("href");
                const match = href.match(/detail\/([^&\/]+)/);
                if (match) return match[1];
            }
            return element.getAttribute("data-id") || null;
        },
        async getLearningQueueWithSmartFilter(courseItems) {
            console.log("[CbeadScanner] 使用智能过滤获取学习队列...");
            const courses = await this.detectCourseStatusBatch(courseItems);
            const toLearn = CourseStatusDetector.filterLearningNeeded(courses.map(c => ({
                status: c.status,
                confidence: c.statusConfidence,
                title: c.title
            })));
            const courseIdsToLearn = new Set(toLearn.map(t => t.title));
            const learningQueue = courses.filter(c => courseIdsToLearn.has(c.title));
            const stats = {
                total: courses.length,
                toLearn: learningQueue.length,
                skip: courses.length - learningQueue.length,
                byStatus: {
                    completed: courses.filter(c => c.status === "completed").length,
                    inProgress: courses.filter(c => c.status === "in_progress").length,
                    notStarted: courses.filter(c => c.status === "not_started").length
                }
            };
            console.log(`[CbeadScanner] 智能过滤结果: 共${stats.total}门, 待学习${stats.toLearn}门, 跳过${stats.skip}门`);
            return {
                courses: learningQueue,
                statistics: stats
            };
        },
        async validateAndInitializePage() {
            console.log("[CbeadScanner] 验证并初始化页面...");
            const pageInfo = await BranchListValidator.validateAndGetInfo();
            if (!pageInfo.isValid) {
                console.error("[CbeadScanner] 页面验证失败:", pageInfo.error);
                return {
                    success: false,
                    pageInfo: pageInfo
                };
            }
            console.log("[CbeadScanner] 页面验证成功:", {
                "页码": pageInfo.pageNumber,
                "总页数": pageInfo.totalPages,
                "课程数": pageInfo.courseCount
            });
            return {
                success: true,
                pageInfo: pageInfo
            };
        }
    };
    const learningState = {
        failed: false,
        failureReason: null,
        markFailed(reason) {
            this.failed = true;
            this.failureReason = reason;
            console.error(`[CbeadProgressManager] 🚨 课程已标记为失败: ${reason}`);
        },
        reset() {
            this.failed = false;
            this.failureReason = null;
        },
        isFailed() {
            return this.failed;
        },
        getFailureReason() {
            return this.failureReason;
        }
    };
    const CbeadProgressManager = {
        getLearningState() {
            return learningState;
        },
        clearLearningProgress() {
            try {
                localStorage.removeItem(CBEAD_CONSTANTS.STORAGE_KEYS.LEARNING_PROGRESS);
                console.log("[CbeadProgressManager] 学习进度已清除");
            } catch (error) {
                console.error("[CbeadProgressManager] 清除学习进度失败:", error);
            }
        },
        saveLearningQueue(learningList, totalCourses, pageUrl) {
            try {
                const data = {
                    learningList: learningList.map(c => ({
                        id: c.id,
                        title: c.title,
                        link: c.link,
                        progress: c.progress,
                        status: c.status
                    })),
                    totalCourses: totalCourses,
                    currentIndex: 0,
                    pageUrl: pageUrl,
                    timestamp: Date.now()
                };
                localStorage.setItem(CBEAD_CONSTANTS.STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(data));
                console.log(`[CbeadProgressManager] 学习队列已保存: ${learningList.length} 门课程`);
            } catch (error) {
                console.error("[CbeadProgressManager] 保存学习队列失败:", error);
            }
        },
        loadLearningQueue() {
            try {
                const data = localStorage.getItem(CBEAD_CONSTANTS.STORAGE_KEYS.LEARNING_PROGRESS);
                if (!data) {
                    console.log("[CbeadProgressManager] 未找到学习队列");
                    return null;
                }
                const parsed = JSON.parse(data);
                const QUEUE_TIMEOUT = 24 * 60 * 60 * 1e3;
                if (Date.now() - parsed.timestamp > QUEUE_TIMEOUT) {
                    console.log("[CbeadProgressManager] 学习队列已超时，清除");
                    this.clearLearningProgress();
                    return null;
                }
                console.log(`[CbeadProgressManager] 学习队列已加载: 当前索引 ${parsed.currentIndex}/${parsed.learningList.length}`);
                return parsed;
            } catch (error) {
                console.error("[CbeadProgressManager] 加载学习队列失败:", error);
                return null;
            }
        },
        updateCurrentIndex(newIndex) {
            try {
                const data = this.loadLearningQueue();
                if (data) {
                    data.currentIndex = newIndex;
                    data.timestamp = Date.now();
                    localStorage.setItem(CBEAD_CONSTANTS.STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(data));
                    console.log(`[CbeadProgressManager] 当前索引已更新: ${newIndex}`);
                }
            } catch (error) {
                console.error("[CbeadProgressManager] 更新索引失败:", error);
            }
        },
        hasValidQueue(currentUrl) {
            const data = this.loadLearningQueue();
            if (!data) return false;
            if (!data.learningList || !Array.isArray(data.learningList)) {
                console.warn("[CbeadProgressManager] 队列数据结构无效: 缺少 learningList");
                return false;
            }
            if (typeof data.currentIndex !== "number") {
                console.warn("[CbeadProgressManager] 队列数据结构无效: 缺少 currentIndex");
                return false;
            }
            if (data.learningList.length === 0) {
                console.warn("[CbeadProgressManager] 学习队列为空");
                return false;
            }
            if (data.currentIndex < 0 || data.currentIndex >= data.learningList.length) {
                console.warn(`[CbeadProgressManager] currentIndex ${data.currentIndex} 超出范围 [0, ${data.learningList.length})`);
                return false;
            }
            if (currentUrl && data.pageUrl) {
                try {
                    const currentUrlObj = new URL(currentUrl, "https://dummy.com");
                    const savedUrlObj = new URL(data.pageUrl, "https://dummy.com");
                    if (currentUrlObj.origin !== savedUrlObj.origin) {
                        console.warn("[CbeadProgressManager] URL 域名不匹配");
                        return false;
                    }
                    const currentPath = currentUrlObj.pathname || "";
                    const savedPath = savedUrlObj.pathname || "";
                    if (currentPath !== savedPath) {
                        if (!savedPath.startsWith(currentPath) && !currentPath.startsWith(savedPath)) {
                            console.warn(`[CbeadProgressManager] URL 路径不匹配: ${currentPath} vs ${savedPath}`);
                            return false;
                        }
                    }
                } catch (e) {
                    console.warn("[CbeadProgressManager] URL 解析失败，跳过 URL 匹配检查");
                }
            }
            console.log("[CbeadProgressManager] 学习队列有效");
            return true;
        },
        async returnToList(returnUrl) {
            console.log("[CbeadProgressManager] 准备返回列表页...");
            this.clearLearningProgress();
            await new Promise(resolve => setTimeout(resolve, CBEAD_CONSTANTS.TIMING.NEXT_COURSE_DELAY));
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `🔄 返回列表页，扫描后自动继续...`,
                type: "info"
            });
            if (returnUrl && !returnUrl.includes("study/course/detail")) {
                console.log(`[CbeadProgressManager] 🚀 返回列表页: ${returnUrl}`);
                window.location.href = returnUrl;
            } else {
                console.warn("[CbeadProgressManager] ⚠️ 没有有效的返回 URL，尝试使用浏览器后退");
                window.history.back();
            }
        },
        publishCompletionStats(totalCourses) {
            EventBus.publish(CONSTANTS.EVENTS.STATISTICS_UPDATE, {
                total: totalCourses,
                completed: totalCourses,
                learned: totalCourses,
                failed: 0,
                skipped: 0
            });
            EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "学习完成");
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `🎉 专题班全部课程学习完成！共 ${totalCourses} 门课程`,
                type: "success"
            });
        },
        normalizeCourseId(rawId) {
            if (!rawId) return null;
            const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
            if (uuidPattern.test(rawId)) {
                return rawId;
            }
            if (/^\d+$/.test(rawId)) {
                return rawId;
            }
            const match = rawId.match(/[a-f0-9-]{36}/);
            return match ? match[0] : rawId;
        },
        extractPlayerParams() {
            const hash = window.location.hash;
            const newMatch = hash.match(/detail\/(?:[^/]*@@)?([a-f0-9-]{36})/i);
            if (newMatch) {
                console.log(`[CbeadProgressManager] ✅ 使用新 URL 格式提取参数`);
                return {
                    uuid: newMatch[1],
                    courseId: newMatch[1],
                    coursewareId: newMatch[1]
                };
            }
            const oldMatch = hash.match(/detail\/(\d+)&([a-f0-9-]+)&(\d+)\/(\d+)\/(\d+)/);
            if (oldMatch) {
                console.log(`[CbeadProgressManager] ⚠️ 使用旧 URL 格式提取参数（兼容模式）`);
                return {
                    courseId: oldMatch[1],
                    uuid: oldMatch[2],
                    sectionIndex: oldMatch[3],
                    totalSections: oldMatch[4],
                    currentIndex: oldMatch[5]
                };
            }
            console.warn(`[CbeadProgressManager] ⚠️ 无法从 URL 提取参数: ${hash}`);
            return null;
        }
    };
    class IntervalManager {
        constructor() {
            this.intervals = new Set;
            this.timeouts = new Set;
        }
        setInterval(callback, delay) {
            const id = setInterval(callback, delay);
            this.intervals.add(id);
            return id;
        }
        setTimeout(callback, delay) {
            const id = setTimeout(callback, delay);
            this.timeouts.add(id);
            return id;
        }
        clearInterval(id) {
            clearInterval(id);
            this.intervals.delete(id);
        }
        clearTimeout(id) {
            clearTimeout(id);
            this.timeouts.delete(id);
        }
        clearAll() {
            this.intervals.forEach(id => clearInterval(id));
            this.intervals.clear();
            this.timeouts.forEach(id => clearTimeout(id));
            this.timeouts.clear();
            console.log("[CbeadPlayer] ✅ 已清理所有定时器");
        }
        getCounts() {
            return {
                intervals: this.intervals.size,
                timeouts: this.timeouts.size
            };
        }
    }
    const CbeadPlayer = {
        DEBUG: false,
        _debugLog(...args) {
            if (this.DEBUG) {
                console.log(...args);
            }
        },
        detectVideoPlayer() {
            const videoJsPlayer = document.querySelector("video.vjs-tech");
            if (videoJsPlayer) {
                console.log("[CbeadPlayer] 检测到 Video.js 播放器");
                const videoJsInstance = window.player || videoJsPlayer.player && videoJsPlayer.player;
                return {
                    type: "videojs",
                    element: videoJsPlayer,
                    player: videoJsInstance,
                    getCurrentTime: () => videoJsPlayer.currentTime,
                    setCurrentTime: time => {
                        videoJsPlayer.currentTime = time;
                    },
                    getDuration: () => videoJsPlayer.duration,
                    play: () => videoJsPlayer.play(),
                    pause: () => videoJsPlayer.pause(),
                    setMuted: muted => {
                        videoJsPlayer.muted = muted;
                        if (videoJsInstance && typeof videoJsInstance.muted === "function") {
                            try {
                                videoJsInstance.muted(muted);
                            } catch (e) {
                                console.warn("[CbeadPlayer] Video.js实例静音失败:", e);
                            }
                        }
                        if (muted) {
                            videoJsPlayer.volume = 0;
                        }
                    },
                    getMuted: () => videoJsPlayer.muted
                };
            }
            const genericVideo = document.querySelector("video");
            if (genericVideo) {
                console.log("[CbeadPlayer] 使用通用 video 元素");
                return {
                    type: "generic",
                    element: genericVideo,
                    getCurrentTime: () => genericVideo.currentTime,
                    setCurrentTime: time => {
                        genericVideo.currentTime = time;
                    },
                    getDuration: () => genericVideo.duration,
                    play: () => genericVideo.play(),
                    pause: () => genericVideo.pause(),
                    setMuted: muted => {
                        genericVideo.muted = muted;
                    },
                    getMuted: () => genericVideo.muted
                };
            }
            console.warn("[CbeadPlayer] 未找到视频播放器");
            return null;
        },
        parseTimeToSeconds(timeStr) {
            if (!timeStr) return 0;
            const match = timeStr.match(/(\d+):(\d+)/);
            if (!match) return 0;
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            return minutes * 60 + seconds;
        },
        extractChapterProgress(verbose = true) {
            const catalogSelectors = [ ".course-side-catalog", ".new-course-side-catalog", ".course-catalog", '[class*="side-catalog"]', '[class*="catalog"]' ];
            let catalog = null;
            for (const selector of catalogSelectors) {
                catalog = document.querySelector(selector);
                if (catalog) {
                    if (verbose) console.log(`[CbeadPlayer] 使用目录选择器: ${selector}`);
                    break;
                }
            }
            if (!catalog) {
                const allElements = document.querySelectorAll("*");
                for (const el of allElements) {
                    if (el.className && typeof el.className === "string" && el.className.includes("catalog")) {
                        catalog = el;
                        if (verbose) console.log(`[CbeadPlayer] 通过类名找到目录: ${el.className}`);
                        break;
                    }
                }
            }
            if (!catalog) {
                if (verbose) console.warn("[CbeadPlayer] 未找到章节目录");
                return null;
            }
            const boxSelectors = [ ".chapter-list-box", '[class*="chapter-list-box"]', ".chapter-list", '[class*="chapter-box"]' ];
            let chapterBoxes = null;
            for (const selector of boxSelectors) {
                chapterBoxes = catalog.querySelectorAll(selector);
                if (chapterBoxes.length > 0) {
                    if (verbose) console.log(`[CbeadPlayer] 使用章节框选择器: ${selector}`);
                    break;
                }
            }
            if (!chapterBoxes || chapterBoxes.length === 0) {
                const jspPane = catalog.querySelector(".jspPane");
                if (jspPane) {
                    chapterBoxes = jspPane.querySelectorAll(".chapter-list-box");
                    if (chapterBoxes.length > 0) {
                        if (verbose) console.log("[CbeadPlayer] 从 .jspPane 中找到章节框");
                    }
                }
            }
            if (!chapterBoxes || chapterBoxes.length === 0) {
                const allBoxes = catalog.querySelectorAll('[class*="chapter"]');
                const validBoxes = Array.from(allBoxes).filter(box => box.querySelector(".item-completed") || box.querySelector(".item.sub.item-completed") || box.textContent?.includes("完成率"));
                if (validBoxes.length > 0) {
                    chapterBoxes = validBoxes;
                    if (verbose) console.log(`[CbeadPlayer] 通过 item-completed 筛选找到 ${chapterBoxes.length} 个章节`);
                }
            }
            if (!chapterBoxes || chapterBoxes.length === 0) {
                if (verbose) console.warn("[CbeadPlayer] 未找到章节元素");
                return null;
            }
            const chapters = [];
            chapterBoxes.forEach((box, index) => {
                try {
                    const titleEl = box.querySelector(".chapter-item .text-overflow");
                    const title = titleEl?.textContent?.trim() || `章节${index + 1}`;
                    this._debugLog(`\n[调试] 处理章节 ${index + 1}: ${title}`);
                    const allItems = box.querySelectorAll(".item");
                    this._debugLog(`  [调试] 找到 ${allItems.length} 个 .item 元素:`);
                    allItems.forEach((el, i) => {
                        const cls = el.className || "";
                        const text = el.textContent?.trim() || "";
                        this._debugLog(`    [调试] .item[${i}]: class="${cls}", text="${text}"`);
                    });
                    const statusEls = box.querySelectorAll(".item.item22");
                    this._debugLog(`  [调试] .item.item22 数量: ${statusEls.length}`);
                    const statusEl = statusEls[statusEls.length - 1];
                    const statusText = statusEl?.textContent?.trim() || "";
                    this._debugLog(`  [调试] statusText: "${statusText}"`);
                    const completedEl = box.querySelector(".item-completed") || box.querySelector(".item.sub.item-completed") || box.querySelector('[class*="item-completed"]') || box.querySelector(".item.sub");
                    const completedText = completedEl?.textContent?.trim() || "";
                    const progressMatch = completedText.match(/完成率[：:]\s*(\d+)%/);
                    const progress = progressMatch ? parseInt(progressMatch[1]) : 0;
                    this._debugLog(`  [调试] completedEl: ${completedEl ? "找到" : "未找到"}`);
                    this._debugLog(`  [调试] completedText: "${completedText}"`);
                    this._debugLog(`  [调试] progress: ${progress}%`);
                    let status = "unknown";
                    let isCompleted = false;
                    const normalizedStatusText = statusText.trim();
                    if (normalizedStatusText === "已完成") {
                        status = "completed";
                        isCompleted = true;
                    } else if (normalizedStatusText === "学习中") {
                        status = "in_progress";
                        isCompleted = false;
                    } else if (normalizedStatusText === "未开始") {
                        status = "not_started";
                        isCompleted = false;
                    } else {
                        if (progress > 0) {
                            status = "in_progress";
                            isCompleted = false;
                        } else {
                            status = "not_started";
                            isCompleted = false;
                        }
                    }
                    const statusInfo = {
                        completed: {
                            icon: "✅",
                            text: "已完成"
                        },
                        in_progress: {
                            icon: "📖",
                            text: "学习中"
                        },
                        not_started: {
                            icon: "📝",
                            text: "未开始"
                        },
                        unknown: {
                            icon: "❓",
                            text: "未知"
                        }
                    };
                    const statusDisplay = statusInfo[status] || statusInfo["unknown"];
                    chapters.push({
                        index: index + 1,
                        title: title,
                        status: status,
                        statusText: statusText,
                        progress: progress,
                        isCompleted: isCompleted,
                        element: box
                    });
                    if (verbose) {
                        console.log(`  ${statusDisplay.icon} 章节 ${index + 1}: ${title} - ${statusDisplay.text} (${progress}%)`);
                    }
                } catch (error) {
                    if (verbose) console.error(`[CbeadPlayer] 处理章节失败 (索引 ${index}):`, error);
                }
            });
            if (chapters.length === 0) {
                if (verbose) console.warn("[CbeadPlayer] 未找到章节");
                return null;
            }
            const stats = {
                completed: chapters.filter(ch => ch.status === "completed").length,
                inProgress: chapters.filter(ch => ch.status === "in_progress").length,
                notStarted: chapters.filter(ch => ch.status === "not_started").length
            };
            const firstIncomplete = chapters.find(ch => !ch.isCompleted);
            if (verbose) {
                console.log(`[CbeadPlayer] 找到 ${chapters.length} 个章节:`);
                console.log(`  - ✅ 已完成: ${stats.completed} 门`);
                console.log(`  - 📖 学习中: ${stats.inProgress} 门`);
                console.log(`  - 📝 未开始: ${stats.notStarted} 门`);
                if (firstIncomplete) {
                    const statusInfo = {
                        completed: {
                            icon: "✅",
                            text: "已完成"
                        },
                        in_progress: {
                            icon: "📖",
                            text: "学习中"
                        },
                        not_started: {
                            icon: "📝",
                            text: "未开始"
                        }
                    };
                    const statusDisplay = statusInfo[firstIncomplete.status] || {
                        text: "未知"
                    };
                    console.log(`[CbeadPlayer] 💡 当前章节: ${firstIncomplete.index} - ${statusDisplay.text} (${firstIncomplete.progress}%)`);
                }
            }
            return {
                total: chapters.length,
                completed: stats.completed,
                inProgress: stats.inProgress,
                notStarted: stats.notStarted,
                chapters: chapters,
                firstIncomplete: firstIncomplete ?? null,
                allCompleted: firstIncomplete == null
            };
        },
        isCourseReallyCompleted() {
            const chapterProgress = this.extractChapterProgress();
            if (!chapterProgress) {
                console.warn("[CbeadPlayer] 无法判断章节进度，假设未完成");
                return false;
            }
            const isCompleted = chapterProgress.allCompleted;
            if (isCompleted) {
                console.log(`[CbeadPlayer] ✅ 所有章节已完成 (${chapterProgress.completed}/${chapterProgress.total})`);
            } else {
                const first = chapterProgress.firstIncomplete;
                if (first) {
                    console.log(`[CbeadPlayer] 📖 章节 ${first.index} 未完成 (${first.status}, ${first.progress}%)`);
                    console.log(`[CbeadPlayer] 💡 判断标准：章节右侧的"已完成"标记，而非完成率百分比`);
                } else {
                    console.warn(`[CbeadPlayer] ⚠️ 章节状态异常: firstIncomplete为null但allCompleted为false`);
                    console.log(`[CbeadPlayer] 📊 统计信息: ${chapterProgress.completed}已完成/${chapterProgress.total}总计`);
                    return chapterProgress.completed >= chapterProgress.total;
                }
            }
            return isCompleted;
        },
        extractChapterList() {
            const catalog = document.querySelector(".course-side-catalog");
            if (!catalog) {
                console.warn("[CbeadPlayer] 未找到章节目录");
                return [];
            }
            const chapters = [];
            const chapterBoxes = catalog.querySelectorAll(".chapter-list-box");
            console.log(`[CbeadPlayer] 找到 ${chapterBoxes.length} 个章节`);
            chapterBoxes.forEach((box, index) => {
                try {
                    const titleEl = box.querySelector(".chapter-item .text-overflow");
                    const title = titleEl?.textContent?.trim() || `第${index + 1}章`;
                    const sections = box.querySelectorAll(".section-item-wrapper");
                    const sectionList = [];
                    sections.forEach(section => {
                        const durationText = section.querySelector(".section-item .item:last-child")?.textContent?.trim();
                        const duration = this.parseTimeToSeconds(durationText);
                        const completedEl = section.closest(".chapter-list-box")?.querySelector(".item-completed");
                        const completedText = completedEl?.textContent?.trim() || "";
                        const progressMatch = completedText.match(/完成率[：:]\s*(\d+)%/);
                        const progress = progressMatch ? parseInt(progressMatch[1]) : 0;
                        sectionList.push({
                            title: `${title} - 节`,
                            duration: duration,
                            progress: progress,
                            isCompleted: progress >= 100
                        });
                    });
                    chapters.push({
                        title: title,
                        sections: sectionList
                    });
                    console.log(`[CbeadPlayer] 章节 ${index + 1}: ${title} (${sectionList.length} 节)`);
                } catch (error) {
                    console.error(`[CbeadPlayer] 处理章节失败 (索引 ${index}):`, error);
                }
            });
            console.log(`[CbeadPlayer] 成功提取 ${chapters.length} 个章节`);
            return chapters;
        },
        clickChapter(chapterTitle) {
            try {
                console.log(`[CbeadPlayer] 🔍 查找章节: ${chapterTitle}`);
                const catalog = document.querySelector(".course-side-catalog");
                if (!catalog) {
                    console.warn("[CbeadPlayer] 未找到章节目录");
                    return false;
                }
                const chapterBoxes = catalog.querySelectorAll(".chapter-list-box");
                for (const box of chapterBoxes) {
                    const titleEl = box.querySelector(".chapter-item .text-overflow");
                    const title = titleEl?.textContent?.trim();
                    if (title === chapterTitle || title?.includes(chapterTitle)) {
                        console.log(`[CbeadPlayer] ✅ 找到目标章节: ${title}`);
                        box.click();
                        const playBtn = box.querySelector(".section-item");
                        if (playBtn) {
                            playBtn.click();
                        }
                        return true;
                    }
                }
                console.warn(`[CbeadPlayer] 未找到章节: ${chapterTitle}`);
                return false;
            } catch (error) {
                console.error(`[CbeadPlayer] 点击章节失败:`, error);
                return false;
            }
        },
        async waitForPlayerReady(maxWaitTime = CBEAD_CONSTANTS.TIMING.PLAYER_INIT_TIMEOUT, checkInterval = CBEAD_CONSTANTS.TIMING.PLAYER_CHECK_INTERVAL) {
            const startTime = Date.now();
            const manager = new IntervalManager;
            console.log("[CbeadPlayer] ⏳ 等待播放器准备就绪...");
            console.log(`[CbeadPlayer] 📋 配置: 最大等待=${maxWaitTime}ms, 检查间隔=${checkInterval}ms`);
            return new Promise(resolve => {
                manager.setInterval(() => {
                    try {
                        const elapsed = Date.now() - startTime;
                        const player = this.detectVideoPlayer();
                        if (player) {
                            const duration = player.getDuration();
                            const currentTime = player.getCurrentTime();
                            const isMuted = player.getMuted();
                            console.log(`[CbeadPlayer] 🔍 检查 #${Math.floor(elapsed / checkInterval)}: 播放器=${player.type}, duration=${duration}s, currentTime=${currentTime}s, muted=${player.getMuted()}`);
                            if (duration && duration > 0 && isFinite(duration)) {
                                manager.clearAll();
                                console.log(`[CbeadPlayer] ✅ 播放器已就绪 (等待 ${elapsed}ms)`);
                                console.log(`[CbeadPlayer] 📹 播放器详情: type=${player.type}, duration=${Math.round(duration)}s, currentTime=${Math.round(currentTime)}s`);
                                resolve(player);
                                return;
                            } else {
                                console.log(`[CbeadPlayer] ⏳ duration 未就绪: ${duration} (需要 > 0)`);
                            }
                        } else {
                            console.log(`[CbeadPlayer] ⏳ 检查 #${Math.floor(elapsed / checkInterval)}: 未检测到播放器`);
                        }
                        if (elapsed >= maxWaitTime) {
                            manager.clearAll();
                            console.warn(`[CbeadPlayer] ⚠️ 播放器等待超时 (${maxWaitTime}ms)`);
                            resolve(null);
                            return;
                        }
                    } catch (error) {
                        console.error("[CbeadPlayer] 播放器检测异常:", error);
                        manager.clearAll();
                        resolve(null);
                    }
                }, checkInterval);
                manager.setTimeout(() => {
                    if (manager.getCounts().intervals > 0) {
                        console.warn("[CbeadPlayer] ⏰ 超时保护触发，强制清理定时器");
                        manager.clearAll();
                        resolve(null);
                    }
                }, maxWaitTime + CBEAD_CONSTANTS.TIMING.PROTECTION_TIMEOUT);
            });
        },
        getCurrentChapterName() {
            try {
                const chapterProgress = this.extractChapterProgress(false);
                if (chapterProgress && chapterProgress.chapters && chapterProgress.chapters.length > 0) {
                    return chapterProgress.chapters[0].title;
                }
            } catch (error) {}
            return null;
        },
        createIntervalManager() {
            return new IntervalManager;
        },
        getServerProgress(currentChapterIndex = null) {
            try {
                const chapterProgress = this.extractChapterProgress(false);
                if (!chapterProgress) return null;
                if (currentChapterIndex !== null) {
                    const currentChapter = chapterProgress.chapters.find(ch => ch.index === currentChapterIndex);
                    if (currentChapter) return currentChapter.progress;
                }
                if (chapterProgress.firstIncomplete) {
                    return chapterProgress.firstIncomplete.progress;
                }
                return null;
            } catch (e) {
                return null;
            }
        },
        cleanupPlaybackResources(resources, reason = "未知原因") {
            const {wakeLock: wakeLock, handleVisibilityChange: handleVisibilityChange, timerManager: timerManager} = resources;
            console.log(`[CbeadPlayer] 🧹 清理播放资源 (${reason})`);
            if (wakeLock) {
                try {
                    wakeLock.release();
                    console.log("[CbeadPlayer] 📱 已释放屏幕常亮锁");
                } catch (err) {
                    console.warn("[CbeadPlayer] ⚠️ 释放 Wake Lock 失败:", err);
                }
            }
            if (handleVisibilityChange) {
                try {
                    document.removeEventListener("visibilitychange", handleVisibilityChange);
                    console.log("[CbeadPlayer] 🧹 已移除可见性监听器");
                } catch (err) {
                    console.warn("[CbeadPlayer] ⚠️ 移除可见性监听器失败:", err);
                }
            }
            if (timerManager) {
                try {
                    timerManager.clearAll();
                } catch (err) {
                    console.warn("[CbeadPlayer] ⚠️ 清理定时器失败:", err);
                }
            }
            console.log("[CbeadPlayer] ✅ 资源清理完成");
        }
    };
    const WORKER_CODE = `\n  let timer = null;\n  let config = null;\n\n  self.onmessage = async function(e) {\n    const { action, data } = e.data;\n\n    if (action === 'start') {\n      config = data;\n      console.log('[CbeadHeartbeatWorker] 🚀 Worker 启动，心跳间隔:', config?.interval || 10000, 'ms');\n\n      timer = setInterval(async () => {\n        try {\n          // 【TODO】后续补充企业分院 API 调用\n          // 目前仅发送心跳消息保活 Worker 框架\n          // 浦东分院 API (/inc/nc/course/play/pulseSaveRecord) 在企业分院无效\n          // 企业分院专用 API 待探索\n\n          // 示例调用（待实现）:\n          // const result = await sendHeartbeat({\n          //   courseId: config.courseId,\n          //   chapterId: config.chapterId,\n          //   timestamp: Date.now()\n          // });\n\n          self.postMessage({\n            type: 'heartbeat',\n            timestamp: Date.now(),\n            config: config\n          });\n        } catch (err) {\n          self.postMessage({\n            type: 'error',\n            error: err.message,\n            timestamp: Date.now()\n          });\n        }\n      }, config?.interval || 10000);\n\n    } else if (action === 'stop') {\n      if (timer) {\n        clearInterval(timer);\n        timer = null;\n      }\n      config = null;\n      console.log('[CbeadHeartbeatWorker] 🛑 Worker 已停止');\n\n    } else if (action === 'ping') {\n      self.postMessage({\n        type: 'pong',\n        timestamp: Date.now(),\n        config: config\n      });\n    }\n  };\n`;
    const CbeadHeartbeatWorker = {
        createWorker() {
            const blob = new Blob([ WORKER_CODE ], {
                type: "application/javascript"
            });
            const workerUrl = URL.createObjectURL(blob);
            return new Worker(workerUrl);
        },
        start(courseInfo) {
            const worker = this.createWorker();
            worker.onmessage = e => {
                const {type: type, timestamp: timestamp, config: config} = e.data;
                switch (type) {
                  case "heartbeat":
                    console.log(`[CbeadHeartbeatWorker] 💓 心跳 ${timestamp} - 课程: ${config?.courseId || "N/A"}`);
                    break;

                  case "error":
                    console.error(`[CbeadHeartbeatWorker] ❌ 心跳错误: ${e.data.error}`);
                    break;

                  case "pong":
                    console.log(`[CbeadHeartbeatWorker] 🔵 Pong ${timestamp}`);
                    break;

                  default:
                    console.log(`[CbeadHeartbeatWorker] 📨 消息:`, e.data);
                }
            };
            worker.onerror = error => {
                console.error(`[CbeadHeartbeatWorker] 💥 Worker 错误:`, error);
            };
            worker.postMessage({
                action: "start",
                data: {
                    courseId: courseInfo.courseId,
                    chapterId: courseInfo.chapterId,
                    interval: courseInfo.interval || 1e4
                }
            });
            console.log(`[CbeadHeartbeatWorker] ✅ Worker 已启动`);
            return worker;
        },
        stop(worker) {
            if (worker) {
                worker.postMessage({
                    action: "stop"
                });
                worker.terminate();
                console.log(`[CbeadHeartbeatWorker] 🛑 Worker 已终止`);
            }
        },
        async ping(worker) {
            if (!worker) return false;
            return new Promise(resolve => {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 2e3);
                worker.onmessage = e => {
                    if (e.data.type === "pong") {
                        clearTimeout(timeout);
                        resolve(true);
                    }
                };
                worker.postMessage({
                    action: "ping"
                });
            });
        }
    };
    function debugLog(...args) {}
    const CBEAD_API_CONFIG = {
        baseUrl: null,
        endpoints: {
            GET_PLAY_TREND: "/inc/nc/course/play/getPlayTrend",
            GET_COURSE_LIST: "/inc/nc/course/getCourseList",
            PULSE_SAVE_RECORD: "/inc/nc/course/play/pulseSaveRecord",
            GET_STUDY_RECORD: "/inc/nc/course/getStudyRecord",
            GET_COURSEWARE_DETAIL: "/inc/nc/course/play/getCoursewareDetail",
            GET_PACK_BY_ID: "/inc/nc/course/pd/getPackById"
        },
        getBaseUrl() {
            const config = ServiceLocator.get(ServiceNames.CONFIG);
            this.baseUrl = config?.CBEAD_API_BASE || `https://${window.location.hostname}`;
            return this.baseUrl;
        },
        getUrl(endpoint) {
            const baseUrl = this.getBaseUrl();
            const endpointPath = this.endpoints[endpoint] || endpoint;
            return baseUrl + endpointPath;
        }
    };
    function _buildUrl(endpoint, params = {}) {
        let url = CBEAD_API_CONFIG.getUrl(endpoint);
        const queryString = new URLSearchParams({
            ...params,
            _t: Date.now()
        }).toString();
        return `${url}?${queryString}`;
    }
    const CbeadApi = {
        ...ApiCore,
        isSuccessResponse(result) {
            return result && (result.success === true || result.code === 200 || result.code === 2e4 || result.state === 2e4 || result.status === "success" || result.status === "ok" || result.code >= 200 && result.code < 300 || result.result === "success" || result.success === 1);
        },
        async getPlayInfo(courseId, coursewareId = null, courseDuration = null) {
            const {Utils: Utils} = await Promise.resolve().then(function() {
                return utils;
            });
            try {
                debugLog(`[getPlayInfo] 获取课程 ${courseId} 的播放信息`);
                const response = await this.get(_buildUrl("GET_PLAY_TREND", {
                    courseId: courseId
                }));
                if (response?.success && response?.data) {
                    const data = response.data;
                    let videoId = null;
                    let duration = 0;
                    let lastLearnedTime = 0;
                    let foundCoursewareId = coursewareId;
                    if (coursewareId && data.playTree?.children) {
                        const target = data.playTree.children.find(c => String(c.id) === String(coursewareId));
                        if (target) {
                            videoId = target.id;
                            foundCoursewareId = target.id;
                            duration = target.sumDurationLong || 0;
                            lastLearnedTime = target.lastWatchPoint ? Utils.parseTimeToSeconds(target.lastWatchPoint) : 0;
                            debugLog(`成功匹配到课件: ${target.title}`);
                        }
                    }
                    if (!videoId && data.locationSite) {
                        videoId = data.locationSite.id;
                        foundCoursewareId = data.locationSite.id;
                        duration = data.locationSite.sumDurationLong || 0;
                        lastLearnedTime = data.locationSite.lastWatchPoint ? Utils.parseTimeToSeconds(data.locationSite.lastWatchPoint) : 0;
                    }
                    if (duration === 0 && courseDuration) {
                        duration = Utils.parseDuration(courseDuration);
                    }
                    if (duration === 0) {
                        duration = CONSTANTS.TIME_FORMATS.DEFAULT_DURATION;
                    }
                    if (!videoId) {
                        videoId = `mock_video_${courseId}`;
                        debugLog("无法获取真实 videoId，使用模拟ID");
                    }
                    return {
                        courseId: courseId,
                        coursewareId: foundCoursewareId,
                        videoId: videoId,
                        duration: duration,
                        lastLearnedTime: lastLearnedTime,
                        playURL: `https://zpyapi.shsets.com/player/get?videoId=${videoId}`,
                        dataSource: videoId.startsWith("mock_") ? "fallback" : "api"
                    };
                }
                return null;
            } catch (error) {
                debugLog(`[getPlayInfo] 出错: ${error.message}`);
                return null;
            }
        },
        async reportProgress(playInfo, currentTime) {
            const {Utils: Utils} = await Promise.resolve().then(function() {
                return utils;
            });
            const watchPoint = Utils.formatTime(currentTime);
            const progress = Math.round(currentTime / playInfo.duration * 100);
            const payload = new URLSearchParams({
                courseId: playInfo.courseId,
                coursewareId: playInfo.coursewareId || playInfo.videoId,
                videoId: playInfo.videoId || "",
                watchPoint: watchPoint,
                currentTime: currentTime,
                duration: playInfo.duration,
                progress: progress,
                pulseTime: 10,
                pulseRate: 1,
                _t: Date.now()
            }).toString();
            try {
                return await this.post(_buildUrl("PULSE_SAVE_RECORD"), payload, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            } catch (error) {
                debugLog(`[进度同步] 失败: ${error.message}`);
                throw error;
            }
        },
        async checkCompletion(courseId, coursewareId = null) {
            try {
                const response = await this.get(_buildUrl("GET_PLAY_TREND", {
                    courseId: courseId
                }));
                const config = ServiceLocator.get(ServiceNames.CONFIG);
                if (response?.success && response?.data) {
                    const data = response.data;
                    if (coursewareId && data.playTree?.children) {
                        const target = data.playTree.children.find(c => String(c.id) === String(coursewareId));
                        if (target) {
                            const finishedRate = parseInt(target.finishedRate || 0);
                            return {
                                isCompleted: finishedRate >= (config?.COMPLETION_THRESHOLD || 80),
                                finishedRate: finishedRate,
                                method: "playTree_match"
                            };
                        }
                    }
                    if (data.locationSite && data.locationSite.finishedRate !== undefined) {
                        const finishedRate = parseInt(data.locationSite.finishedRate);
                        return {
                            isCompleted: finishedRate >= (config?.COMPLETION_THRESHOLD || 80),
                            finishedRate: finishedRate,
                            method: "playTrend_total"
                        };
                    }
                }
                return {
                    isCompleted: false,
                    finishedRate: 0,
                    method: "default"
                };
            } catch (error) {
                debugLog(`完成度检查失败: ${error.message}`);
                return {
                    isCompleted: false,
                    finishedRate: 0,
                    method: "error"
                };
            }
        },
        async getCoursewareList(courseId) {
            try {
                debugLog(`正在获取课程包详细信息 (ID: ${courseId})...`);
                const endpoints = [ _buildUrl("GET_PLAY_TREND", {
                    courseId: courseId
                }), _buildUrl("GET_COURSEWARE_DETAIL", {
                    courseId: courseId
                }) ];
                for (const endpoint of endpoints) {
                    try {
                        const response = await this.get(endpoint);
                        if (response && response.success && response.data) {
                            const data = response.data;
                            if (data.playTree && data.playTree.children && Array.isArray(data.playTree.children)) {
                                const videos = data.playTree.children.filter(c => c.rTypeValue === "video" || c.rTypeValue === "courseware");
                                if (videos.length > 0) {
                                    debugLog(`从 playTree 获取到 ${videos.length} 个课件`);
                                    return videos.map((v, index) => CourseAdapter.normalize({
                                        id: courseId,
                                        courseId: courseId,
                                        dsUnitId: v.id,
                                        title: v.title || `${data.title || "课程"} - 视频${index + 1}`,
                                        duration: v.sumDurationLong || 0
                                    }, "cbead_api_tree"));
                                }
                            }
                            if (data.coursewareIdList && Array.isArray(data.coursewareIdList) && data.coursewareIdList.length > 0) {
                                debugLog(`从 coursewareIdList 获取到 ${data.coursewareIdList.length} 个课件`);
                                return data.coursewareIdList.map((cw, index) => CourseAdapter.normalize({
                                    id: courseId,
                                    courseId: courseId,
                                    dsUnitId: cw.id || cw.coursewareId,
                                    title: cw.name || cw.title || `${data.title || "课程"} - 视频${index + 1}`,
                                    duration: cw.duration || 0
                                }, "cbead_api_list"));
                            }
                            const list = data.subList || data.courseList || data.lessons;
                            if (list && Array.isArray(list) && list.length > 0) {
                                debugLog(`从 API 子列表获取到 ${list.length} 个视频`);
                                return list.map(item => CourseAdapter.normalize(item, "cbead_api_sublist"));
                            }
                        }
                    } catch {
                        continue;
                    }
                }
                return [];
            } catch (error) {
                debugLog(`获取课件列表失败: ${error.message}`);
                return [];
            }
        },
        async getPackById(packId) {
            try {
                debugLog(`获取课程包信息 (ID: ${packId})`);
                return await this.get(_buildUrl("GET_PACK_BY_ID", {
                    id: packId
                }));
            } catch (error) {
                debugLog(`获取课程包信息失败: ${error.message}`);
                return null;
            }
        }
    };
    const LOG_LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        NONE: 4
    };
    const defaultConfig$1 = {
        level: LOG_LEVELS.INFO,
        showTimestamp: true,
        showModule: true,
        disableInProduction: true
    };
    let config$1 = {
        ...defaultConfig$1
    };
    function getTimestamp() {
        const now = new Date;
        return now.toISOString().split("T")[1].replace("Z", "").slice(0, -1);
    }
    function formatMessage(level, module, args) {
        const parts = [];
        if (config$1.showTimestamp) {
            parts.push(`[${getTimestamp()}]`);
        }
        parts.push(`[${level}]`);
        if (config$1.showModule && module) {
            parts.push(`[${module}]`);
        }
        return [ parts.join(" "), ...args ];
    }
    const Logger = {
        setLevel(level) {
            if (typeof level === "string") {
                const upperLevel = level.toUpperCase();
                config$1.level = LOG_LEVELS[upperLevel] !== undefined ? LOG_LEVELS[upperLevel] : LOG_LEVELS.INFO;
            } else if (typeof level === "number") {
                config$1.level = level >= 0 && level <= 4 ? level : LOG_LEVELS.INFO;
            }
            if (typeof window !== "undefined") {
                const isDev = window.location?.hostname?.includes("localhost") || window.location?.hostname?.includes("dev");
                if (isDev && config$1.level === LOG_LEVELS.INFO) {
                    config$1.level = LOG_LEVELS.DEBUG;
                }
            }
        },
        getLevel() {
            return config$1.level;
        },
        debug(...args) {
            if (config$1.level <= LOG_LEVELS.DEBUG) {
                console.debug(...formatMessage("DEBUG", null, args));
            }
        },
        debugM(module, ...args) {
            if (config$1.level <= LOG_LEVELS.DEBUG) {
                console.debug(...formatMessage("DEBUG", module, args));
            }
        },
        info(...args) {
            if (config$1.level <= LOG_LEVELS.INFO) {
                console.info(...formatMessage("INFO", null, args));
            }
        },
        infoM(module, ...args) {
            if (config$1.level <= LOG_LEVELS.INFO) {
                console.info(...formatMessage("INFO", module, args));
            }
        },
        warn(...args) {
            if (config$1.level <= LOG_LEVELS.WARN) {
                console.warn(...formatMessage("WARN", null, args));
            }
        },
        warnM(module, ...args) {
            if (config$1.level <= LOG_LEVELS.WARN) {
                console.warn(...formatMessage("WARN", module, args));
            }
        },
        error(...args) {
            if (config$1.level <= LOG_LEVELS.ERROR) {
                console.error(...formatMessage("ERROR", null, args));
            }
        },
        errorM(module, ...args) {
            if (config$1.level <= LOG_LEVELS.ERROR) {
                console.error(...formatMessage("ERROR", module, args));
            }
        },
        log(level, ...args) {
            const upperLevel = level.toUpperCase();
            const levelValue = LOG_LEVELS[upperLevel] !== undefined ? LOG_LEVELS[upperLevel] : LOG_LEVELS.INFO;
            if (config$1.level <= levelValue) {
                console.log(...formatMessage(upperLevel, null, args));
            }
        },
        group(label, collapsed = false) {
            if (config$1.level <= LOG_LEVELS.DEBUG) {
                if (collapsed) {
                    console.groupCollapsed(label);
                } else {
                    console.group(label);
                }
            }
        },
        groupEnd() {
            if (config$1.level <= LOG_LEVELS.DEBUG) {
                console.groupEnd();
            }
        },
        time(label) {
            if (config$1.level <= LOG_LEVELS.DEBUG) {
                console.time(label);
            }
        },
        timeEnd(label) {
            if (config$1.level <= LOG_LEVELS.DEBUG) {
                console.timeEnd(label);
            }
        },
        table(label, data) {
            if (config$1.level <= LOG_LEVELS.DEBUG && Array.isArray(data)) {
                this.group(label);
                console.table(data);
                this.groupEnd();
            }
        },
        configure(newConfig) {
            config$1 = {
                ...config$1,
                ...newConfig
            };
        },
        reset() {
            config$1 = {
                ...defaultConfig$1
            };
        }
    };
    function createLogger(moduleName) {
        return {
            debug: (...args) => Logger.debugM(moduleName, ...args),
            info: (...args) => Logger.infoM(moduleName, ...args),
            warn: (...args) => Logger.warnM(moduleName, ...args),
            error: (...args) => Logger.errorM(moduleName, ...args),
            group: (label, collapsed) => Logger.group(`[${moduleName}] ${label}`, collapsed),
            time: label => Logger.time(`[${moduleName}] ${label}`),
            timeEnd: label => Logger.timeEnd(`[${moduleName}] ${label}`)
        };
    }
    const WAIT_LOGGER = createLogger("WaitHelper");
    const defaultConfig = {
        elementTimeout: 1e4,
        stableTimeout: 2e3,
        randomMin: 500,
        randomMax: 2e3,
        observerInterval: 100,
        retryCount: 3,
        retryDelay: 1e3
    };
    let config = {
        ...defaultConfig
    };
    const WaitHelper = {
        async forElement(selector, timeout = config.elementTimeout) {
            const existing = document.querySelector(selector);
            if (existing) {
                WAIT_LOGGER.debug(`元素已存在: ${selector}`);
                return existing;
            }
            WAIT_LOGGER.debug(`等待元素: ${selector} (超时: ${timeout}ms)`);
            return new Promise((resolve, _reject) => {
                const observer = new MutationObserver(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        observer.disconnect();
                        WAIT_LOGGER.debug(`找到元素: ${selector}`);
                        resolve(el);
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                setTimeout(() => {
                    observer.disconnect();
                    const el = document.querySelector(selector);
                    if (el) {
                        resolve(el);
                    } else {
                        WAIT_LOGGER.warn(`等待元素超时: ${selector}`);
                        resolve(null);
                    }
                }, timeout);
            });
        },
        async forElements(selector, minCount = 1, timeout = config.elementTimeout) {
            const checkElements = () => {
                const elements = document.querySelectorAll(selector);
                return elements.length >= minCount ? elements : null;
            };
            const existing = checkElements();
            if (existing) {
                WAIT_LOGGER.debug(`元素已满足条件: ${selector} (${existing.length} 个)`);
                return existing;
            }
            WAIT_LOGGER.debug(`等待至少 ${minCount} 个元素: ${selector}`);
            return new Promise(resolve => {
                const observer = new MutationObserver(() => {
                    const elements = checkElements();
                    if (elements) {
                        observer.disconnect();
                        WAIT_LOGGER.debug(`找到 ${elements.length} 个元素: ${selector}`);
                        resolve(elements);
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                setTimeout(() => {
                    observer.disconnect();
                    const elements = checkElements();
                    if (elements) {
                        resolve(elements);
                    } else {
                        WAIT_LOGGER.warn(`等待元素超时: ${selector}`);
                        resolve(null);
                    }
                }, timeout);
            });
        },
        async forStable(timeout = config.stableTimeout) {
            WAIT_LOGGER.debug(`等待页面稳定 (${timeout}ms)`);
            let stableTime = 0;
            let lastState = document.body?.innerHTML?.length || 0;
            return new Promise(resolve => {
                const observer = new MutationObserver(() => {
                    stableTime = 0;
                    lastState = document.body?.innerHTML?.length || 0;
                });
                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        characterData: true
                    });
                }
                const interval = setInterval(() => {
                    const currentState = document.body?.innerHTML?.length || 0;
                    if (Math.abs(currentState - lastState) > 100) {
                        stableTime = 0;
                        lastState = currentState;
                    } else {
                        stableTime += config.observerInterval;
                    }
                    if (stableTime >= timeout) {
                        clearInterval(interval);
                        observer.disconnect();
                        WAIT_LOGGER.debug("页面已稳定");
                        resolve(true);
                    }
                }, config.observerInterval);
                setTimeout(() => {
                    clearInterval(interval);
                    observer.disconnect();
                    if (stableTime >= timeout / 2) {
                        WAIT_LOGGER.debug("页面接近稳定，继续执行");
                        resolve(true);
                    } else {
                        WAIT_LOGGER.warn("页面稳定超时");
                        resolve(false);
                    }
                }, timeout + 1e3);
            });
        },
        async forVue(options = {}) {
            const {vueTimeout: vueTimeout = 12e3, skeletonTimeout: skeletonTimeout = 15e3, contentTimeout: contentTimeout = 15e3} = options;
            WAIT_LOGGER.debug("等待 Vue 组件就绪");
            if (window.Vue || document.querySelector("[data-v-]")?.__vue__) {
                WAIT_LOGGER.debug("检测到 Vue 实例");
                return true;
            }
            const skeletonSelectors = [ ".el-loading-mask", ".v-loading", ".ant-spin-mask", ".loading-mask", '[class*="loading"]' ];
            const startTime = Date.now();
            return new Promise(resolve => {
                const checkVueReady = () => {
                    const elapsed = Date.now() - startTime;
                    if (window.Vue || document.querySelector("[data-v-]")?.__vue__) {
                        return {
                            ready: true,
                            reason: "Vue 实例检测到"
                        };
                    }
                    const contentSelectors = [ ".el-main", ".main-content", ".content-area", ".app-main" ];
                    for (const selector of contentSelectors) {
                        const el = document.querySelector(selector);
                        if (el && el.children.length > 0) {
                            return {
                                ready: true,
                                reason: `内容区域 ${selector} 有内容`
                            };
                        }
                    }
                    let hasSkeleton = false;
                    for (const selector of skeletonSelectors) {
                        if (document.querySelector(selector)) {
                            hasSkeleton = true;
                            break;
                        }
                    }
                    if (!hasSkeleton && elapsed > skeletonTimeout) {
                        return {
                            ready: true,
                            reason: "骨架屏超时但无 Vue"
                        };
                    }
                    if (elapsed > contentTimeout) {
                        return {
                            ready: true,
                            reason: "内容加载超时，继续执行"
                        };
                    }
                    return {
                        ready: false
                    };
                };
                const interval = setInterval(() => {
                    const result = checkVueReady();
                    if (result.ready) {
                        clearInterval(interval);
                        WAIT_LOGGER.debug(`Vue 就绪: ${result.reason}`);
                        resolve(true);
                    }
                }, 200);
                setTimeout(() => {
                    clearInterval(interval);
                    const result = checkVueReady();
                    if (result.ready) {
                        resolve(true);
                    } else {
                        WAIT_LOGGER.warn("Vue 等待超时，继续执行");
                        resolve(true);
                    }
                }, Math.max(vueTimeout, skeletonTimeout, contentTimeout));
            });
        },
        async random(min = config.randomMin, max = config.randomMax) {
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            WAIT_LOGGER.debug(`随机延时: ${delay}ms`);
            return new Promise(resolve => setTimeout(resolve, delay));
        },
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async retry(asyncFn, options = {}) {
            const {count: count = config.retryCount, delay: retryDelay = config.retryDelay, onRetry: onRetry = null} = options;
            let lastError;
            for (let i = 0; i < count; i++) {
                try {
                    return await asyncFn();
                } catch (error) {
                    lastError = error;
                    WAIT_LOGGER.warn(`重试 ${i + 1}/${count} 失败: ${error.message}`);
                    if (onRetry) {
                        await onRetry(error, i + 1);
                    }
                    if (i < count - 1) {
                        await this.delay(retryDelay);
                    }
                }
            }
            throw lastError;
        },
        async forIframe(selector, timeout = config.elementTimeout) {
            const iframe = await this.forElement(selector, timeout);
            if (!iframe) {
                return null;
            }
            if (iframe.contentDocument?.readyState === "complete") {
                return iframe;
            }
            return new Promise(resolve => {
                const onLoad = () => {
                    resolve(iframe);
                };
                iframe.addEventListener("load", onLoad);
                setTimeout(() => {
                    iframe.removeEventListener("load", onLoad);
                    WAIT_LOGGER.warn(`iframe 加载超时: ${selector}`);
                    resolve(iframe);
                }, timeout);
            });
        },
        configure(newConfig) {
            config = {
                ...config,
                ...newConfig
            };
        },
        reset() {
            config = {
                ...defaultConfig
            };
        }
    };
    const CbeadPlayerFlow = {
        async learnWithRealPlayback(course) {
            console.log(`[CbeadPlayerFlow] ========== 开始真实播放学习 ==========`);
            console.log(`[CbeadPlayerFlow] 📚 课程名称: ${course.title}`);
            console.log(`[CbeadPlayerFlow] 🆔 课程ID: ${course.id || course.courseId || "N/A"}`);
            console.log(`[CbeadPlayerFlow] 🔗 当前URL: ${window.location.href}`);
            const learningState = CbeadProgressManager.getLearningState();
            learningState.reset();
            console.log(`[CbeadPlayerFlow] 🔄 学习状态已重置`);
            const timerManager = CbeadPlayer.createIntervalManager();
            let chapterName = course.title;
            let currentChapterIndex = null;
            try {
                console.log(`[CbeadPlayerFlow] ⏳ 等待章节目录加载...`);
                const catalogSelectors = [ ".course-side-catalog", ".new-course-side-catalog", ".course-catalog" ];
                let catalogLoaded = false;
                for (const selector of catalogSelectors) {
                    const catalog = await WaitHelper.forElement(selector, 5e3);
                    if (catalog) {
                        console.log(`[CbeadPlayerFlow] ✅ 章节目录已加载: ${selector}`);
                        catalogLoaded = true;
                        break;
                    }
                }
                if (!catalogLoaded) {
                    console.warn(`[CbeadPlayerFlow] ⚠️ 章节目录未加载，尝试继续提取`);
                }
                let chapterProgress = null;
                for (let i = 0; i < 2; i++) {
                    chapterProgress = CbeadPlayer.extractChapterProgress(false);
                    if (chapterProgress && chapterProgress.firstIncomplete) {
                        break;
                    }
                    if (i < 1) {
                        console.log(`[CbeadPlayerFlow] ⏳ 第${i + 1}次提取未完成，等待2秒后重试...`);
                        await new Promise(resolve => setTimeout(resolve, 2e3));
                    }
                }
                if (chapterProgress && chapterProgress.firstIncomplete) {
                    chapterName = chapterProgress.firstIncomplete.title;
                    currentChapterIndex = chapterProgress.firstIncomplete.index;
                    console.log(`[CbeadPlayerFlow] 📖 章节名称: ${chapterName}`);
                    console.log(`[CbeadPlayerFlow] 📌 章节索引: ${currentChapterIndex}`);
                    if (currentChapterIndex > 1) {
                        console.log(`[CbeadPlayerFlow] ⏭️ 已跳过 ${currentChapterIndex - 1} 个已完成章节`);
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: `⏭️ 已跳过 ${currentChapterIndex - 1} 个已完成章节，开始学习: ${chapterName}`,
                            type: "info"
                        });
                    }
                } else {
                    console.warn(`[CbeadPlayerFlow] ⚠️ 未能提取到章节信息，使用课程标题`);
                }
            } catch (error) {
                console.warn(`[CbeadPlayerFlow] 无法提取章节信息，使用课程名:`, error);
            }
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `📖 开始学习: ${chapterName}`,
                type: "info"
            });
            console.log(`[CbeadPlayerFlow] 🔍 立即检查章节状态...`);
            const initialChapterProgress = CbeadPlayer.extractChapterProgress(false);
            if (initialChapterProgress && currentChapterIndex !== null) {
                const targetChapter = initialChapterProgress.chapters.find(ch => ch.index === currentChapterIndex);
                if (targetChapter && targetChapter.status === "completed") {
                    console.log(`[CbeadPlayerFlow] ✅ 章节 ${currentChapterIndex} 已完成，跳过播放`);
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: `⏭️ 章节已完成，跳过: ${targetChapter.title}`,
                        type: "info"
                    });
                    return {
                        success: true,
                        method: "skip_completed",
                        duration: 0,
                        watched: 0,
                        chapterName: targetChapter.title,
                        chapterCompleted: true,
                        earlyTermination: true,
                        reason: "章节已是已完成状态",
                        savedPercent: 100
                    };
                }
            }
            if (initialChapterProgress && currentChapterIndex !== null) {
                const targetChapter = initialChapterProgress.chapters.find(ch => ch.index === currentChapterIndex);
                if (targetChapter) {
                    console.log(`[CbeadPlayerFlow] 📖 目标章节: ${targetChapter.title}, 状态: ${targetChapter.status}`);
                    const currentVideo = document.querySelector("video");
                    const currentPlayer = CbeadPlayer.detectVideoPlayer();
                    if (currentPlayer && currentVideo) {
                        currentPlayer.getCurrentTime();
                        currentPlayer.getDuration();
                        const targetServerProgress = targetChapter.progress || 0;
                        if (targetServerProgress > 80 || targetServerProgress < 5) {
                            console.log(`[CbeadPlayerFlow] 🔄 服务器进度 ${targetServerProgress}%，尝试切换到目标章节: ${targetChapter.title}`);
                            const clicked = CbeadPlayer.clickChapter(targetChapter.title);
                            if (clicked) {
                                console.log(`[CbeadPlayerFlow] ✅ 已点击切换到章节: ${targetChapter.title}`);
                                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                                    message: `🔄 切换到章节: ${targetChapter.title}`,
                                    type: "info"
                                });
                                await new Promise(resolve => setTimeout(resolve, CBEAD_CONSTANTS.TIMING.CHAPTER_SWITCH_DELAY));
                            } else {
                                console.warn(`[CbeadPlayerFlow] ⚠️ 章节切换失败，可能已在正确章节`);
                            }
                        } else {
                            console.log(`[CbeadPlayerFlow] ✅ 服务器进度 ${targetServerProgress}%，似乎在正确的章节`);
                        }
                    }
                }
            }
            try {
                console.log(`[CbeadPlayerFlow] ⏳ 步骤 1/7: 等待播放器初始化...`);
                const player = await CbeadPlayer.waitForPlayerReady();
                if (!player) {
                    console.error(`[CbeadPlayerFlow] ❌ 播放器初始化失败`);
                    throw new Error("播放器初始化超时，无法获取视频信息");
                }
                console.log(`[CbeadPlayerFlow] ✅ 步骤 1/7: 播放器初始化完成`);
                console.log(`[CbeadPlayerFlow] 📹 播放器类型: ${player.type}`);
                console.log(`[CbeadPlayerFlow] ⏳ 步骤 2/7: 获取视频信息...`);
                const duration = player.getDuration();
                const currentTime = player.getCurrentTime();
                const durationMinutes = Math.round(duration / 60);
                const serverProgress = CbeadPlayer.getServerProgress(currentChapterIndex);
                console.log(`[CbeadPlayerFlow] ✅ 步骤 2/7: 视频信息获取完成`);
                console.log(`[CbeadPlayerFlow] ⏱️ 总时长: ${Math.round(duration)}秒 (${durationMinutes}分钟)`);
                console.log(`[CbeadPlayerFlow] ⏯️ 当前位置: ${Math.round(currentTime)}秒 (服务器进度: ${serverProgress !== null ? serverProgress + "%" : "N/A"})`);
                console.log(`[CbeadPlayerFlow] ⏳ 步骤 3/7: 设置静音...`);
                player.setMuted(true);
                console.log(`[CbeadPlayerFlow] 🔇 已调用 setMuted(true)`);
                const mutedAfter = player.getMuted();
                console.log(`[CbeadPlayerFlow] 🔍 静音状态验证: ${mutedAfter ? "成功" : "失败"}`);
                console.log(`[CbeadPlayerFlow] ✅ 步骤 3/7: 静音设置完成`);
                console.log(`[CbeadPlayerFlow] ⏳ 步骤 4/7: 设置播放位置...`);
                if (serverProgress > 0) {
                    const targetTime = serverProgress / 100 * duration;
                    console.log(`[CbeadPlayerFlow] 📍 策略: 恢复进度 (服务器 ${serverProgress}% → ${Math.round(targetTime)}s / ${Math.round(duration)}s)`);
                    player.setCurrentTime(targetTime);
                } else if (currentTime < CBEAD_CONSTANTS.THRESHOLDS.VIDEO_START_THRESHOLD) {
                    console.log(`[CbeadPlayerFlow] 📍 策略: 从头播放`);
                    player.setCurrentTime(0);
                } else {
                    console.log(`[CbeadPlayerFlow] 📍 策略: 断点续播 (当前位置: ${Math.round(currentTime)}s)`);
                }
                console.log(`[CbeadPlayerFlow] ✅ 步骤 4/7: 播放位置设置完成`);
                console.log(`[CbeadPlayerFlow] ⏳ 步骤 5/7: 启动播放器...`);
                const currentPlayer = CbeadPlayer.detectVideoPlayer();
                if (!currentPlayer) {
                    console.error(`[CbeadPlayerFlow] ❌ 播放器检测失败，可能已被销毁`);
                    throw new Error("播放器在启动前被销毁");
                }
                const {clickMaskButton: clickMaskButton} = await Promise.resolve().then(function() {
                    return infraDomHelper;
                });
                clickMaskButton();
                const bigPlayButton = document.querySelector(".vjs-big-play-button");
                if (bigPlayButton) {
                    console.log(`[CbeadPlayerFlow] 🎯 发现大播放按钮遮罩，准备点击...`);
                    bigPlayButton.click();
                    console.log(`[CbeadPlayerFlow] ✅ 已点击大播放按钮`);
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
                if (currentPlayer.element.paused) {
                    const playControlBtn = document.querySelector(".vjs-play-control");
                    if (playControlBtn) {
                        console.log(`[CbeadPlayerFlow] 🎯 发现播放控制按钮，准备点击...`);
                        playControlBtn.click();
                        await new Promise(resolve => setTimeout(resolve, 500));
                        console.log(`[CbeadPlayerFlow] ✅ 已点击播放控制按钮`);
                    }
                }
                if (!currentPlayer.element.paused) {
                    console.log(`[CbeadPlayerFlow] ✅ 播放器成功启动`);
                } else {
                    console.error(`[CbeadPlayerFlow] ❌ 播放器启动失败`);
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: "⚠️ 自动播放失败，请手动点击播放按钮",
                        type: "warn"
                    });
                }
                console.log(`[CbeadPlayerFlow] ✅ 步骤 5/7: 播放器启动完成`);
                console.log(`[CbeadPlayerFlow] ⏳ 步骤 6/7: 设置播放监听器...`);
                let notificationPermission = "default";
                if ("Notification" in window) {
                    try {
                        notificationPermission = await Notification.requestPermission();
                    } catch (err) {
                        console.warn(`[CbeadPlayerFlow] ⚠️ 请求通知权限失败:`, err);
                    }
                }
                let wakeLock = null;
                if ("wakeLock" in navigator) {
                    try {
                        wakeLock = await navigator.wakeLock.request("screen");
                        console.log(`[CbeadPlayerFlow] 📱 已启用屏幕常亮锁`);
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: "📱 已启用屏幕常亮，防止屏幕关闭",
                            type: "info"
                        });
                    } catch (err) {
                        console.warn(`[CbeadPlayerFlow] ⚠️ 无法启用屏幕常亮锁:`, err);
                    }
                }
                const handleVisibilityChange = () => {
                    if (document.hidden) {
                        console.warn(`[CbeadPlayerFlow] ⚠️ 页面已隐藏到后台！`);
                        if (CBEAD_CONSTANTS.HEARTBEAT.ENABLED) {
                            console.log(`[CbeadPlayerFlow] 📱 页面进入后台，启动 Worker 心跳`);
                            heartbeatWorker = CbeadHeartbeatWorker.start({
                                courseId: course.id || course.courseId,
                                chapterId: currentChapterIndex,
                                interval: CBEAD_CONSTANTS.HEARTBEAT.INTERVAL
                            });
                        }
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: "⚠️ 页面已隐藏到后台，已启动Worker心跳保活",
                            type: "warn"
                        });
                        if ("Notification" in window && notificationPermission === "granted") {
                            try {
                                new Notification("学习提醒", {
                                    body: "页面已隐藏，请返回前台继续学习",
                                    icon: "📺",
                                    requireInteraction: true
                                });
                            } catch (err) {
                                console.warn(`[CbeadPlayerFlow] 发送通知失败:`, err);
                            }
                        }
                    } else {
                        console.log(`[CbeadPlayerFlow] ✅ 页面已返回前台`);
                        if (heartbeatWorker) {
                            console.log(`[CbeadPlayerFlow] 📱 页面回到前台，停止 Worker 心跳`);
                            CbeadHeartbeatWorker.stop(heartbeatWorker);
                            heartbeatWorker = null;
                        }
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: "✅ 页面已返回前台，继续学习",
                            type: "info"
                        });
                    }
                };
                document.removeEventListener("visibilitychange", handleVisibilityChange);
                document.addEventListener("visibilitychange", handleVisibilityChange);
                console.log(`[CbeadPlayerFlow] ✅ 步骤 7/7: 监听器设置完成`);
                console.log(`[CbeadPlayerFlow] ========== 开始播放，等待完成 ==========`);
                let heartbeatWorker = null;
                return new Promise((resolve, reject) => {
                    let chapterCompletedDetected = false;
                    currentPlayer.element.addEventListener("ended", () => {
                        console.log(`[CbeadPlayerFlow] ========== 播放完成 ==========`);
                        console.log(`[CbeadPlayerFlow] ✅ 视频播放完成！`);
                        if (heartbeatWorker) {
                            CbeadHeartbeatWorker.stop(heartbeatWorker);
                            heartbeatWorker = null;
                        }
                        if (wakeLock) {
                            wakeLock.release();
                            wakeLock = null;
                        }
                        document.removeEventListener("visibilitychange", handleVisibilityChange);
                        const finalWatched = Math.round(duration) - Math.round(currentTime);
                        resolve({
                            success: true,
                            method: "real_playback",
                            duration: Math.round(duration),
                            watched: finalWatched,
                            chapterName: chapterName,
                            chapterCompleted: chapterCompletedDetected,
                            earlyTermination: chapterCompletedDetected,
                            reason: chapterCompletedDetected ? "章节状态变更为已完成" : "视频播放完成"
                        });
                    }, {
                        once: true
                    });
                    currentPlayer.element.addEventListener("error", error => {
                        console.error(`[CbeadPlayerFlow] 播放错误:`, error);
                        if (heartbeatWorker) {
                            CbeadHeartbeatWorker.stop(heartbeatWorker);
                            heartbeatWorker = null;
                        }
                        if (wakeLock) wakeLock.release();
                        document.removeEventListener("visibilitychange", handleVisibilityChange);
                        reject(new Error("视频播放出错"));
                    }, {
                        once: true
                    });
                    timerManager.setInterval(() => {
                        if (learningState.isFailed()) {
                            console.warn(`[CbeadPlayerFlow] 🚨 检测到课程失败，立即停止播放`);
                            if (heartbeatWorker) {
                                CbeadHeartbeatWorker.stop(heartbeatWorker);
                                heartbeatWorker = null;
                            }
                            timerManager.clearAll();
                            if (wakeLock) wakeLock.release();
                            document.removeEventListener("visibilitychange", handleVisibilityChange);
                            currentPlayer.pause();
                            reject(new Error(`进度上报失败: ${learningState.getFailureReason()}`));
                            return;
                        }
                        const currentTime = currentPlayer.getCurrentTime();
                        const serverProgress = CbeadPlayer.getServerProgress(currentChapterIndex);
                        console.log(`[CbeadPlayerFlow] 📊 已播放: ${Math.round(currentTime)}秒 / ${Math.round(duration)}秒 (服务器进度: ${serverProgress !== null ? serverProgress + "%" : "N/A"})`);
                        if (currentPlayer.element.paused) {
                            console.warn(`[CbeadPlayerFlow] ⚠️ 检测到播放暂停，尝试恢复播放...`);
                            const playPromise = currentPlayer.play();
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    console.log(`[CbeadPlayerFlow] ✅ 播放已恢复`);
                                }).catch(error => {
                                    console.warn(`[CbeadPlayerFlow] ⚠️ 恢复播放失败: ${error.message}`);
                                    if (document.hidden && "Notification" in window && notificationPermission === "granted") {
                                        try {
                                            new Notification("学习暂停提醒", {
                                                body: "⚠️ 视频已暂停！请返回前台继续学习。",
                                                icon: "⚠️",
                                                requireInteraction: true
                                            });
                                        } catch (err) {
                                            console.warn(`[CbeadPlayerFlow] 发送通知失败:`, err);
                                        }
                                    }
                                });
                            }
                        }
                    }, CBEAD_CONSTANTS.TIMING.PROGRESS_REPORT_INTERVAL);
                    timerManager.setInterval(() => {
                        if (learningState.isFailed()) {
                            console.warn(`[CbeadPlayerFlow] 🚨 检测到课程失败，立即停止播放`);
                            timerManager.clearAll();
                            if (wakeLock) wakeLock.release();
                            document.removeEventListener("visibilitychange", handleVisibilityChange);
                            currentPlayer.pause();
                            reject(new Error(`进度上报失败: ${learningState.getFailureReason()}`));
                            return;
                        }
                        const serverProgress = CbeadPlayer.getServerProgress(currentChapterIndex);
                        if (serverProgress !== null && serverProgress < CBEAD_CONSTANTS.THRESHOLDS.CHAPTER_CHECK_MIN_PROGRESS) {
                            return;
                        }
                        console.log(`[CbeadPlayerFlow] 🔍 检查章节状态 (服务器进度: ${serverProgress}%)...`);
                        const chapterProgress = CbeadPlayer.extractChapterProgress(false);
                        if (chapterProgress && chapterProgress.completed === chapterProgress.total) {
                            console.log(`[CbeadPlayerFlow] 🎉 检测到所有章节已完成！`);
                            chapterCompletedDetected = true;
                            if (heartbeatWorker) {
                                CbeadHeartbeatWorker.stop(heartbeatWorker);
                                heartbeatWorker = null;
                            }
                            timerManager.clearAll();
                            if (wakeLock) wakeLock.release();
                            document.removeEventListener("visibilitychange", handleVisibilityChange);
                            currentPlayer.pause();
                            currentPlayer.setCurrentTime(duration);
                            resolve({
                                success: true,
                                method: "real_playback",
                                duration: Math.round(duration),
                                watched: Math.round(currentTime),
                                chapterName: chapterName,
                                chapterCompleted: true,
                                earlyTermination: true,
                                reason: "所有章节已完成",
                                savedPercent: 100 - (serverProgress || 0)
                            });
                        }
                        if (chapterProgress && currentChapterIndex !== null) {
                            const currentChapter = chapterProgress.chapters.find(ch => ch.index === currentChapterIndex);
                            if (currentChapter && currentChapter.status === "completed") {
                                console.log(`[CbeadPlayerFlow] 🎉 检测到章节状态变化: 章节 ${currentChapterIndex} 已完成！`);
                                chapterCompletedDetected = true;
                                if (heartbeatWorker) {
                                    CbeadHeartbeatWorker.stop(heartbeatWorker);
                                    heartbeatWorker = null;
                                }
                                timerManager.clearAll();
                                if (wakeLock) wakeLock.release();
                                document.removeEventListener("visibilitychange", handleVisibilityChange);
                                currentPlayer.pause();
                                currentPlayer.setCurrentTime(duration);
                                resolve({
                                    success: true,
                                    method: "real_playback",
                                    duration: Math.round(duration),
                                    watched: Math.round(currentTime),
                                    chapterName: chapterName,
                                    chapterCompleted: true,
                                    earlyTermination: true,
                                    reason: "章节状态变更为已完成",
                                    savedPercent: 100 - (serverProgress || 0)
                                });
                            }
                        }
                    }, CBEAD_CONSTANTS.TIMING.CHAPTER_CHECK_INTERVAL);
                });
            } catch (error) {
                timerManager.clearAll();
                console.error(`[CbeadPlayerFlow] 学习失败: ${course.title}`, error);
                throw error;
            }
        }
    };
    const CbeadHandler = {
        PAGE_TYPES: {
            PLAYER: "player",
            BRANCH_LIST: "branch_list",
            COLUMN: "column",
            HOME_V: "home_v",
            UNKNOWN: "unknown"
        },
        SELECTORS: {
            COURSE_ITEMS: [ ".activity-stage .list li", ".list-item", ".activity-list .list-item" ],
            ENTER_BTN: ".study-btn",
            PLAYER_CONTAINER: ".player-content",
            VIDEO_ELEMENT: "video",
            CHAPTER_CONTAINER: ".course-side-catalog",
            BRANCH_LIST: {
                CONTAINER: ".activity-main-area .vertical",
                ITEM: ".list-item",
                PAGINATION: ".e-pagination-box .zxy-pagination",
                NEXT_BTN: ".zxy-pagination-item-next",
                TAG_CONTAINER: ".label .tag-list",
                TAG_BTN: ".label-btn"
            }
        },
        identifyPage() {
            const url = window.location.href;
            if (url.includes(CBEAD_CONSTANTS.PATH_PATTERNS.PLAYER)) return this.PAGE_TYPES.PLAYER;
            if (url.includes(CBEAD_CONSTANTS.PATH_PATTERNS.BRANCH_LIST)) return this.PAGE_TYPES.BRANCH_LIST;
            if (url.includes(CBEAD_CONSTANTS.PATH_PATTERNS.COLUMN)) return this.PAGE_TYPES.COLUMN;
            if (url.includes(CBEAD_CONSTANTS.PATH_PATTERNS.HOME_V)) return this.PAGE_TYPES.HOME_V;
            return this.PAGE_TYPES.UNKNOWN;
        },
        isCbeadMode() {
            return CONFIG$1.CBEAD_MODE === true;
        },
        extractId() {
            const hash = window.location.hash;
            const match = hash.match(/class-detail\/([a-f0-9-]+)/);
            if (match) return match[1];
            const courseMatch = hash.match(/course\/detail\/[\d&]+\/([a-f0-9-]+)/);
            if (courseMatch) return courseMatch[1];
            return null;
        },
        getCourses() {
            return CbeadScanner.getCourses(this.SELECTORS);
        },
        scanCoursesFromColumnPage() {
            return CbeadScanner.scanCoursesFromColumnPage();
        },
        async scanCoursesFromBranchList(options = {}) {
            return await CbeadScanner.scanCoursesFromBranchList(options);
        },
        async scanCoursesFromBranchListPage() {
            return await CbeadScanner.scanCoursesFromBranchListPage();
        },
        async clickNextPage() {
            return await CbeadScanner._clickNextPage();
        },
        getTotalPages() {
            return CbeadScanner._getTotalPages();
        },
        categorizeAndSortCourses(courses) {
            return CbeadScanner.categorizeAndSortCourses(courses);
        },
        getSortedLearningList(courses) {
            return CbeadScanner.getSortedLearningList(courses);
        },
        saveLearningProgress(learningList, currentIndex) {
            return CbeadProgressManager.saveLearningProgress(learningList, currentIndex);
        },
        loadLearningProgress() {
            return CbeadProgressManager.loadLearningProgress();
        },
        clearLearningProgress() {
            return CbeadProgressManager.clearLearningProgress();
        },
        hasPendingLearningTask() {
            return CbeadProgressManager.hasPendingLearningTask();
        },
        saveLearningQueue(learningList, totalCourses, pageUrl) {
            return CbeadProgressManager.saveLearningQueue(learningList, totalCourses, pageUrl);
        },
        loadLearningQueue() {
            return CbeadProgressManager.loadLearningQueue();
        },
        updateCurrentIndex(newIndex) {
            return CbeadProgressManager.updateCurrentIndex(newIndex);
        },
        hasValidQueue(currentUrl) {
            return CbeadProgressManager.hasValidQueue(currentUrl);
        },
        returnToList(returnUrl) {
            return CbeadProgressManager.returnToList(returnUrl);
        },
        publishCompletionStats(totalCourses) {
            return CbeadProgressManager.publishCompletionStats(totalCourses);
        },
        normalizeCourseId(rawId) {
            return CbeadProgressManager.normalizeCourseId(rawId);
        },
        extractPlayerParams() {
            return CbeadProgressManager.extractPlayerParams();
        },
        detectVideoPlayer() {
            return CbeadPlayer.detectVideoPlayer();
        },
        extractChapterProgress(verbose) {
            return CbeadPlayer.extractChapterProgress(verbose);
        },
        isCourseReallyCompleted() {
            return CbeadPlayer.isCourseReallyCompleted();
        },
        extractChapterList() {
            return CbeadPlayer.extractChapterList();
        },
        extractPageCourseTitle() {
            const selectors = [ ".course-title", ".video-course-title", ".detail-title", ".study-detail-title", "h1.title", ".header-title", ".course-name", '[class*="title"]' ];
            for (const selector of selectors) {
                const el = document.querySelector(selector);
                if (el && el.textContent?.trim()) {
                    const text = el.textContent.trim();
                    if (text.length > 5 && text.length < 200 && !text.includes("中国干部网络学院")) {
                        return text;
                    }
                }
            }
            const pageText = document.body?.textContent || "";
            const courseNameMatch = pageText.match(/《([^》]+)》/);
            if (courseNameMatch && courseNameMatch[1]) {
                return courseNameMatch[1];
            }
            return null;
        },
        parseTimeToSeconds(timeStr) {
            return CbeadPlayer.parseTimeToSeconds(timeStr);
        },
        waitForPlayerReady(maxWaitTime, checkInterval) {
            return CbeadPlayer.waitForPlayerReady(maxWaitTime, checkInterval);
        },
        clickChapter(chapterTitle) {
            return CbeadPlayer.clickChapter(chapterTitle);
        },
        getServerProgress(currentChapterIndex = null) {
            return CbeadPlayer.getServerProgress(currentChapterIndex);
        },
        cleanupPlaybackResources(resources, reason) {
            return CbeadPlayer.cleanupPlaybackResources(resources, reason);
        },
        getCurrentChapterName() {
            return CbeadPlayer.getCurrentChapterName();
        },
        getLearningState() {
            return CbeadProgressManager.getLearningState();
        },
        createIntervalManager() {
            return CbeadPlayer.createIntervalManager();
        },
        async learnWithRealPlayback(course) {
            return await CbeadPlayerFlow.learnWithRealPlayback(course);
        },
        init() {
            if (!this.isCbeadMode()) {
                console.log("[CbeadHandler] 非企业分院环境，跳过初始化");
                return;
            }
            const pageType = this.identifyPage();
            console.log(`[CbeadHandler] 检测到页面类型: ${pageType}`);
            EventBus.publish("cbead:pageDetected", {
                pageType: pageType,
                url: window.location.href,
                id: this.extractId()
            });
        }
    };
    let currentPlayerLearningId = null;
    const CbeadLearner = {
        getCurrentPlayerLearningId() {
            return currentPlayerLearningId;
        },
        setCurrentPlayerLearningId(id) {
            const oldId = currentPlayerLearningId;
            currentPlayerLearningId = id;
            console.log(`[CbeadLearner] 📍 更新播放页学习任务ID: ${oldId || "none"} → ${id || "none"}`);
        },
        _validatePageType(pageType) {
            const allowedTypes = [ CbeadHandler.PAGE_TYPES.PLAYER, CbeadHandler.PAGE_TYPES.COLUMN, CbeadHandler.PAGE_TYPES.BRANCH_LIST ];
            if (allowedTypes.includes(pageType)) {
                return true;
            }
            if (pageType === CbeadHandler.PAGE_TYPES.HOME_V) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "⚠️ 当前是展示主页页面，没有可学习的课程列表。请进入课程详情页或列表页。",
                    type: "warn"
                });
                EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "展示页无课程");
            } else {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "⚠️ 当前页面不支持自动学习。请进入专题详情页或课程列表页。",
                    type: "warn"
                });
                EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "页面不支持");
            }
            return false;
        },
        async selectAndExecute() {
            if (!CONFIG$1.CBEAD_MODE) {
                return null;
            }
            const pageType = CbeadHandler.identifyPage();
            if (!this._validatePageType(pageType)) {
                return false;
            }
            const href = window.location.href;
            if (href.includes("study/course/detail")) {
                return await this._handlePlayerPage();
            }
            if (href.includes("train-new/class-detail")) {
                return await this._handleColumnPage();
            }
            if (href.includes("branch-list-v")) {
                return await this._handleBranchListPage();
            }
            return null;
        },
        async _handlePlayerPage() {
            return await this.startPlayerFlow();
        },
        async _handleColumnPage() {
            const {findSignUpButton: findSignUpButton, getSignUpButtonText: getSignUpButtonText} = await Promise.resolve().then(function() {
                return infraDomHelper;
            });
            const signUpButton = findSignUpButton();
            if (signUpButton) {
                const buttonText = getSignUpButtonText(signUpButton);
                const errorMsg = `🚫 该专栏/专题班未报名，无法开始自动学习。请先点击"${buttonText}"按钮完成报名。`;
                console.error(`[CbeadLearner] ${errorMsg}`);
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: errorMsg,
                    type: "error"
                });
                EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "未报名");
                throw new Error("专栏/专题班未报名");
            }
            const sourceUrl = sessionStorage.getItem("cbeadLearnSourceUrl");
            if (!sourceUrl) {
                const currentUrl = `#${window.location.hash || ""}`;
                sessionStorage.setItem("cbeadLearnSourceUrl", currentUrl);
                console.log(`[CbeadLearner] 📌 保存来源 URL: ${currentUrl}`);
            }
            await this.startBatchFlow();
            return true;
        },
        async _handleBranchListPage() {
            const oldSavedUrl = sessionStorage.getItem("cbeadBranchListUrl");
            if (oldSavedUrl) {
                console.log(`[CbeadLearner] 🧹 清除旧的分支列表页URL保存`);
                sessionStorage.removeItem("cbeadBranchListUrl");
            }
            const sourceUrl = sessionStorage.getItem("cbeadLearnSourceUrl");
            if (!sourceUrl) {
                console.log(`[CbeadLearner] 💡 进入列表页，请点击"开始学习"按钮开始批量学习`);
                return CONSTANTS.FLOW_RESULTS.WAITING_FOR_USER;
            }
            console.log(`[CbeadLearner] 🔄 检测到批量学习流程，继续执行...`);
            await this.startBranchListFlow();
            return true;
        },
        async startPlayerFlow() {
            const playerParams = CbeadHandler.extractPlayerParams();
            const currentPageCourseId = playerParams?.uuid;
            if (currentPageCourseId && currentPlayerLearningId === currentPageCourseId) {
                console.log(`[CbeadLearner] ⏭️ 播放页学习任务已在进行中，跳过重复执行: ${currentPageCourseId.substring(0, 8)}...`);
                return false;
            }
            if (currentPageCourseId) {
                this.setCurrentPlayerLearningId(currentPageCourseId);
            }
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "🎬 检测到企业分院播放页，直接处理当前视频",
                type: "info"
            });
            const isReallyCompleted = CbeadHandler.isCourseReallyCompleted();
            if (isReallyCompleted) {
                this.setCurrentPlayerLearningId(null);
                return await this._handleAllChaptersCompleted();
            }
            return await this._learnCurrentVideo();
        },
        async _handleAllChaptersCompleted() {
            console.log("[CbeadLearner] ✅ 检测到所有章节已完成，跳过播放");
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "✅ 该课程所有章节已完成！",
                type: "success"
            });
            this._resetToggleButton("学习完成");
            return false;
        },
        async _learnCurrentVideo() {
            const playerParams = CbeadHandler.extractPlayerParams();
            if (!playerParams || !playerParams.uuid) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "❌ 无法从URL提取视频UUID",
                    type: "error"
                });
                return false;
            }
            const courseTitle = CbeadHandler.extractPageCourseTitle() || document.title;
            const currentCourse = {
                id: playerParams.uuid,
                courseId: playerParams.uuid,
                dsUnitId: playerParams.uuid,
                title: courseTitle,
                courseName: courseTitle,
                source: "cbead_current_video"
            };
            LearningState.reset();
            const success = await this._executeVideoLearning(currentCourse);
            if (success) {
                return await this._handleVideoCompleted(currentCourse);
            } else {
                await this._handleVideoFailed();
                return false;
            }
        },
        async _executeVideoLearning(course) {
            return await CbeadHandler.learnWithRealPlayback(course);
        },
        async _handleVideoCompleted(course) {
            const isReallyCompleted = CbeadHandler.isCourseReallyCompleted();
            if (!isReallyCompleted) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "✅ 当前章节学习完成，继续下一章节...",
                    type: "info"
                });
                await new Promise(resolve => setTimeout(resolve, 1e3));
                const {Learner: Learner} = await Promise.resolve().then(function() {
                    return bizLearner;
                });
                await Learner.startLearning();
                return true;
            }
            console.log("[CbeadLearner] ✅ 课程学习完成");
            this.setCurrentPlayerLearningId(null);
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "✅ 当前视频学习完成！",
                type: "success"
            });
            const returnUrl = sessionStorage.getItem("cbeadLearnSourceUrl");
            if (!returnUrl) {
                console.warn("[CbeadLearner] ⚠️ 未找到来源 URL，无法返回继续学习");
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "⚠️ 学习完成，但无法返回来源页面",
                    type: "warn"
                });
                this._resetToggleButton("学习完成");
                return false;
            }
            console.log(`[CbeadLearner] 🔄 返回来源页面: ${returnUrl}`);
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `🔄 返回列表页扫描继续...`,
                type: "info"
            });
            await new Promise(resolve => setTimeout(resolve, 2e3));
            window.location.href = returnUrl;
            this._resetToggleButton("学习完成");
            return false;
        },
        async _handleVideoFailed() {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "❌ 视频学习失败",
                type: "error"
            });
            this._resetToggleButton("学习失败");
        },
        async startBatchFlow() {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "📋 检测到专题班/专栏，开始批量学习流程",
                type: "info"
            });
            const allCourses = await CbeadHandler.scanCoursesFromColumnPage();
            if (allCourses.length === 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "❌ 未找到课程",
                    type: "error"
                });
                return false;
            }
            const learningList = CbeadHandler.getSortedLearningList(allCourses);
            if (learningList.length === 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "✅ 所有课程已完成！",
                    type: "success"
                });
                return false;
            }
            const totalCourses = allCourses.length;
            const skippedCount = totalCourses - learningList.length;
            EventBus.publish(CONSTANTS.EVENTS.STATISTICS_UPDATE, {
                total: totalCourses,
                completed: skippedCount,
                learned: 0,
                failed: 0,
                skipped: skippedCount
            });
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `📚 准备学习 ${learningList.length} 门课程`,
                type: "info"
            });
            const firstCourse = learningList[0];
            await this._navigateToCourse(firstCourse);
            return true;
        },
        async startBranchListFlow() {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "📋 检测到分支列表页，开始边扫描边学习",
                type: "info"
            });
            await this._waitForPageReady();
            const scanPage = this._loadScanPage();
            let currentPage = scanPage;
            console.log(`[CbeadLearner] 📄 当前扫描页码: ${currentPage}`);
            const result = await this._scanAndLearnBranchList(currentPage);
            if (result && result.completed) {
                this._clearScanPage();
                try {
                    sessionStorage.removeItem("cbeadLearnSourceUrl");
                    console.log(`[CbeadLearner] 🧹 清除来源 URL`);
                } catch (e) {
                    console.warn("[CbeadLearner] 清除来源 URL 失败:", e);
                }
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "✅ 所有课程已完成！",
                    type: "success"
                });
                this._resetToggleButton("学习完成");
            }
            return true;
        },
        async _scanAndLearnBranchList(startPage) {
            const pageCourses = await CbeadScanner.scanCoursesFromBranchListPage();
            if (!pageCourses || pageCourses.length === 0) {
                console.log("[CbeadLearner] 当前页没有找到课程");
                const hasNext = await CbeadScanner._clickNextPage();
                if (hasNext) {
                    return {
                        continue: true,
                        nextPage: startPage + 1
                    };
                } else {
                    return {
                        completed: true
                    };
                }
            }
            const incompleteCourses = pageCourses.filter(c => c.progress < 100);
            if (incompleteCourses.length > 0) {
                const currentUrl = `#${window.location.hash || ""}`;
                sessionStorage.setItem("cbeadLearnSourceUrl", currentUrl);
                console.log(`[CbeadLearner] 📌 保存来源 URL: ${currentUrl}`);
                await this._navigateToCourse(incompleteCourses[0]);
                return {
                    continue: true,
                    nextPage: startPage
                };
            }
            const hasNext = await CbeadScanner._clickNextPage();
            if (hasNext) {
                const loaded = await this._waitForPageLoad();
                if (loaded) {
                    return await this._scanAndLearnBranchList(startPage + 1);
                }
                return {
                    continue: true,
                    nextPage: startPage + 1
                };
            } else {
                return {
                    completed: true
                };
            }
        },
        _loadScanPage() {
            try {
                const data = sessionStorage.getItem("cbeadScanPage");
                if (data) {
                    return parseInt(data, 10);
                }
            } catch (e) {
                console.warn("[CbeadLearner] 读取扫描页码失败:", e);
            }
            return 1;
        },
        _saveScanPage(page) {
            try {
                sessionStorage.setItem("cbeadScanPage", page.toString());
            } catch (e) {
                console.warn("[CbeadLearner] 保存扫描页码失败:", e);
            }
        },
        _clearScanPage() {
            try {
                sessionStorage.removeItem("cbeadScanPage");
            } catch (e) {
                console.warn("[CbeadLearner] 清除扫描页码失败:", e);
            }
        },
        _clearBranchListUrl() {
            try {
                sessionStorage.removeItem("cbeadBranchListUrl");
            } catch (e) {
                console.warn("[CbeadLearner] 清除分支列表页URL失败:", e);
            }
        },
        async _waitForPageLoad() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const timeout = CBEAD_CONSTANTS.TIMEOUT?.PAGE_LOAD;
            console.log("[CbeadLearner] ⏳ 等待翻页加载完成...");
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const container = document.querySelector(config.CONTAINER_SELECTOR);
                if (container) {
                    const items = container.querySelectorAll(config.ITEM_SELECTOR);
                    if (items.length > 0) {
                        console.log(`[CbeadLearner] ✅ 翻页加载完成，找到 ${items.length} 个课程项`);
                        return true;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            console.warn("[CbeadLearner] ⚠️ 翻页加载超时，继续执行");
            return false;
        },
        async _waitForPageReady() {
            const config = CBEAD_CONSTANTS.BRANCH_LIST;
            const timeout = CBEAD_CONSTANTS.TIMEOUT?.PAGE_LOAD;
            console.log("[CbeadLearner] ⏳ 等待页面渲染完成...");
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const container = document.querySelector(config.CONTAINER_SELECTOR);
                if (container) {
                    const items = container.querySelectorAll(config.ITEM_SELECTOR);
                    if (items.length > 0) {
                        console.log(`[CbeadLearner] ✅ 页面渲染完成，找到 ${items.length} 个课程项`);
                        return true;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            console.warn("[CbeadLearner] ⚠️ 等待页面渲染超时，继续执行");
            return false;
        },
        async selectCourse(options = {}) {
            const {scanMethod: scanMethod} = options;
            if (!scanMethod) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "❌ 未提供扫描方法",
                    type: "error"
                });
                return false;
            }
            const allCourses = await scanMethod();
            if (allCourses.length === 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "❌ 未找到课程",
                    type: "error"
                });
                return false;
            }
            const learningList = CbeadHandler.getSortedLearningList(allCourses);
            if (learningList.length === 0) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "✅ 所有课程已完成！",
                    type: "success"
                });
                return false;
            }
            const totalCourses = allCourses.length;
            const skippedCount = totalCourses - learningList.length;
            EventBus.publish(CONSTANTS.EVENTS.STATISTICS_UPDATE, {
                total: totalCourses,
                completed: skippedCount,
                learned: 0,
                failed: 0,
                skipped: skippedCount
            });
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `📚 准备学习 ${learningList.length} 门课程`,
                type: "info"
            });
            const firstCourse = learningList[0];
            await this._navigateToCourse(firstCourse);
            return true;
        },
        async _navigateToCourse(course) {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `\n📖 开始学习: ${course.title} (${course.progress}%)`,
                type: "info"
            });
            const currentUrl = window.location.href;
            const sourceUrl = `#${currentUrl.split("#")[1] || ""}`;
            sessionStorage.setItem("cbeadLearnSourceUrl", sourceUrl);
            console.log(`[CbeadLearner] 📌 保存来源 URL: ${sourceUrl}`);
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `📌 保存来源页: ${sourceUrl}`,
                type: "info"
            });
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `🔄 正在跳转到播放页...`,
                type: "info"
            });
            await new Promise(resolve => setTimeout(resolve, 1e3));
            window.location.href = course.link;
        },
        _resetToggleButton(statusText) {
            const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
            if (toggleBtn) {
                toggleBtn.setAttribute("data-state", "stopped");
                toggleBtn.textContent = "开始学习";
            }
            EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, statusText);
        }
    };
    var learner = Object.freeze({
        __proto__: null,
        CbeadLearner: CbeadLearner,
        default: CbeadLearner
    });
    const ENVIRONMENT_IDS = {
        PUDONG: "pudong",
        CBEAD: "cbead"
    };
    const ApiFactory = {
        _instances: {
            [ENVIRONMENT_IDS.PUDONG]: null,
            [ENVIRONMENT_IDS.CBEAD]: null
        },
        createApi(envId) {
            if (this._instances[envId]) {
                return this._instances[envId];
            }
            let apiInstance;
            switch (envId) {
              case ENVIRONMENT_IDS.PUDONG:
                apiInstance = PudongApi;
                break;

              case ENVIRONMENT_IDS.CBEAD:
                apiInstance = CbeadApi;
                break;

              default:
                throw new Error(`未知的 API 类型: ${envId}`);
            }
            this._instances[envId] = apiInstance;
            return apiInstance;
        },
        getPudongApi() {
            return this.createApi(ENVIRONMENT_IDS.PUDONG);
        },
        getCbeadApi() {
            return this.createApi(ENVIRONMENT_IDS.CBEAD);
        },
        getCurrentApi() {
            const config = ServiceLocator.get(ServiceNames.CONFIG);
            if (config?.PUDONG_MODE) {
                return this.getPudongApi();
            }
            if (config?.CBEAD_MODE) {
                return this.getCbeadApi();
            }
            return this.getPudongApi();
        },
        getCurrentConfig() {
            const config = ServiceLocator.get(ServiceNames.CONFIG);
            if (config?.PUDONG_MODE) {
                return PUDONG_API_CONFIG;
            }
            if (config?.CBEAD_MODE) {
                return CBEAD_API_CONFIG;
            }
            return PUDONG_API_CONFIG;
        },
        clearCache() {
            this._instances = {
                [ENVIRONMENT_IDS.PUDONG]: null,
                [ENVIRONMENT_IDS.CBEAD]: null
            };
        }
    };
    const API$1 = Object.assign({}, PudongApi, CbeadApi, PUDONG_API_CONFIG, CBEAD_API_CONFIG, {
        factory: ApiFactory
    });
    const UI_CSS_CONTENT = '#api-learner-panel { all: initial !important; position: fixed !important; bottom: 20px !important; right: 20px !important; left: auto !important; top: auto !important; width: 400px !important; height: auto !important; min-height: 200px !important; margin: 0 !important; padding: 0 !important; transform: none !important; zoom: 1 !important; background: #ffffff !important; border: 1px solid #dddddd !important; border-radius: 8px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; z-index: 2147483647 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important; font-size: 14px !important; color: #333333 !important; line-height: 1.5 !important; text-align: left !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; overflow: hidden !important; } #api-learner-panel * { all: unset !important; box-sizing: border-box !important; font-family: inherit !important; background: transparent !important; margin: 0 !important; padding: 0 !important; border: none !important; } #api-learner-panel *:before, #api-learner-panel *:after { content: none !important; display: none !important; } #api-learner-panel .header { display: block !important; background: #f7f7f7 !important; padding: 10px 15px !important; font-weight: bold !important; border-bottom: 1px solid #ddd !important; width: 100% !important; } #api-learner-panel .content { display: block !important; padding: 15px !important; width: 100% !important; background: #ffffff !important; flex-grow: 1 !important; } #api-learner-panel .status { display: block !important; margin-bottom: 10px !important; font-weight: bold !important; } #api-learner-panel .statistics { display: flex !important; justify-content: space-between !important; margin-bottom: 10px !important; padding: 8px !important; background: #f9f9f9 !important; border-radius: 4px !important; font-size: 12px !important; width: 100% !important; } #api-learner-panel .stat-item { display: block !important; text-align: center !important; flex: 1 !important; } #api-learner-panel .progress-bar { display: block !important; height: 8px !important; background: #eeeeee !important; border-radius: 4px !important; overflow: hidden !important; margin-bottom: 10px !important; width: 100% !important; } #api-learner-panel #learner-progress-inner { display: block !important; height: 100% !important; width: 0% !important; background: #4caf50 !important; transition: width 0.3s ease !important; } #api-learner-panel .log-container { display: block !important; height: 150px !important; overflow-y: auto !important; background: #fafafa !important; padding: 8px !important; border: 1px solid #eeeeee !important; border-radius: 4px !important; font-size: 11px !important; line-height: 1.4 !important; font-family: monospace !important; width: 100% !important; } #api-learner-panel .log-entry { display: block !important; margin-bottom: 4px !important; border-left: 2px solid #ccc !important; padding-left: 6px !important; word-break: break-all !important; } #api-learner-panel .log-entry.error { color: #f44336 !important; border-left-color: #f44336 !important; } #api-learner-panel .log-entry.success { color: #4caf50 !important; border-left-color: #4caf50 !important; } #api-learner-panel .log-entry.warn { color: #ff9800 !important; border-left-color: #ff9800 !important; } #api-learner-panel .log-entry.info { color: #2196f3 !important; border-left-color: #2196f3 !important; } #api-learner-panel .footer { display: block !important; padding: 10px 15px !important; border-top: 1px solid #dddddd !important; text-align: center !important; width: 100% !important; background: #ffffff !important; } #api-learner-panel button { display: inline-block !important; padding: 8px 16px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 13px !important; font-weight: bold !important; line-height: 1.2 !important; background-color: #2196f3 !important; color: #ffffff !important; margin-left: 8px !important; vertical-align: middle !important; } #api-learner-panel button#toggle-learning-btn[data-state="running"] { background-color: #f44336 !important; } #api-learner-panel .incompatible-banner { display: flex !important; align-items: center !important; padding: 12px 15px !important; background: #fff9e6 !important; border-bottom: 1px solid #ffe082 !important; } #api-learner-panel .incompatible-banner .warning-icon { font-size: 24px !important; margin-right: 12px !important; opacity: 0.8 !important; } #api-learner-panel .incompatible-banner .warning-content { flex: 1 !important; } #api-learner-panel .incompatible-banner .warning-title { font-size: 14px !important; font-weight: bold !important; color: #f57c00 !important; margin-bottom: 3px !important; } #api-learner-panel .incompatible-banner .warning-message { font-size: 12px !important; color: #f57c00 !important; line-height: 1.4 !important; opacity: 0.85 !important; } #api-learner-panel.incompatible-mode { border: 2px solid #ffe082 !important; box-shadow: 0 2px 8px rgba(245, 124, 0, 0.15) !important; } #api-learner-panel.incompatible-mode .header { background: #fffde7 !important; color: #f57c00 !important; }';
    const UI = {
        logs: [],
        logBuffer: [],
        logUpdateTimeout: null,
        statistics: {
            total: 0,
            completed: 0,
            learned: 0,
            failed: 0,
            skipped: 0
        },
        createPanel: () => {
            const panel = document.createElement("div");
            panel.id = "api-learner-panel";
            panel.innerHTML = `\n            <div class="header">\n                cela学习助手 v4.0.0\n            </div>\n            <div class="content">\n                <div class="status">状态: <span id="learner-status">待命</span></div>\n                <div class="statistics">\n                    <div class="stat-item">总计: <span id="stat-total">0</span></div>\n                    <div class="stat-item">已完成: <span id="stat-completed">0</span></div>\n                    <div class="stat-item">新学习: <span id="stat-learned">0</span></div>\n                    <div class="stat-item">失败: <span id="stat-failed">0</span></div>\n                    <div class="stat-item">跳过: <span id="stat-skipped">0</span></div>\n                </div>\n                <div class="progress-bar"><div id="learner-progress-inner"></div></div>\n\n                <div class="log-container"></div>\n            </div>\n            <div class="footer">\n                <button id="toggle-learning-btn" data-state="stopped">开始学习</button>\n            </div>\n        `;
            document.body.appendChild(panel);
            UI.addStyles();
            UI.initEventListeners();
        },
        log: function(message, type = "info") {
            const timestamp = (new Date).toLocaleTimeString();
            const logMessage = `[${timestamp}] ${message}`;
            this.logBuffer.push({
                message: logMessage,
                type: type
            });
            if (this.logUpdateTimeout) clearTimeout(this.logUpdateTimeout);
            this.logUpdateTimeout = setTimeout(() => this.flushLogBuffer(), CONSTANTS.UI_LIMITS.LOG_FLUSH_DELAY);
            if (typeof CONFIG !== "undefined" && CONFIG.DEBUG_MODE) {
                const debugMessage = `[API Learner Debug] ${logMessage}`;
                console.log(debugMessage);
                this.logs.push(debugMessage);
            }
        },
        initEventListeners: function() {
            EventBus.subscribe(CONSTANTS.EVENTS.LOG, ({message: message, type: type}) => this.log(message, type));
            EventBus.subscribe(CONSTANTS.EVENTS.STATUS_UPDATE, status => this.updateStatus(status));
            EventBus.subscribe(CONSTANTS.EVENTS.PROGRESS_UPDATE, progress => this.updateProgress(progress));
            EventBus.subscribe(CONSTANTS.EVENTS.STATISTICS_UPDATE, stats => this.updateStatistics(stats));
            EventBus.subscribe(CONSTANTS.EVENTS.LEARNING_START, () => {
                const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
                if (toggleBtn) {
                    toggleBtn.setAttribute("data-state", "running");
                    toggleBtn.textContent = "停止学习";
                }
            });
            EventBus.subscribe(CONSTANTS.EVENTS.LEARNING_STOP, () => {
                const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
                if (toggleBtn) {
                    toggleBtn.setAttribute("data-state", "stopped");
                    toggleBtn.textContent = "开始学习";
                }
            });
            EventBus.subscribe(CONSTANTS.EVENTS.COURSE_START, ({course: course, index: index, total: total}) => {
                this.log(`\n📚 处理第 ${index}/${total} 门课程: ${course.title}`);
            });
            EventBus.subscribe(CONSTANTS.EVENTS.COURSE_COMPLETE, ({course: course}) => {
                this.log(`✅ 课程学习完成: ${course.title}`, "success");
            });
            EventBus.subscribe(CONSTANTS.EVENTS.COURSE_SKIP, ({course: course, reason: reason}) => {
                this.log(`✅ 课程已完成，跳过: ${course.title} (${reason})`, "success");
            });
            EventBus.subscribe(CONSTANTS.EVENTS.COURSE_ERROR, ({course: course, reason: reason}) => {
                this.log(`❌ 课程处理失败: ${course.title} - ${reason}`, "error");
            });
            EventBus.subscribe(CONSTANTS.EVENTS.PROGRESS_REPORT, _data => {});
            EventBus.subscribe(CONSTANTS.EVENTS.PROGRESS_SUCCESS, ({message: message, _progress: _progress}) => {
                this.log(message, "success");
            });
            EventBus.subscribe(CONSTANTS.EVENTS.PROGRESS_ERROR, ({message: message}) => {
                this.log(message, "warn");
            });
        },
        flushLogBuffer: function() {
            const logContainer = document.querySelector(CONSTANTS.SELECTORS.LOG_CONTAINER);
            if (!logContainer || this.logBuffer.length === 0) return;
            const fragment = document.createDocumentFragment();
            this.logBuffer.forEach(log => {
                const logEntry = document.createElement("div");
                logEntry.className = `log-entry ${log.type}`;
                logEntry.textContent = log.message;
                fragment.appendChild(logEntry);
            });
            logContainer.appendChild(fragment);
            logContainer.scrollTop = logContainer.scrollHeight;
            const entries = logContainer.querySelectorAll(".log-entry");
            if (entries.length > CONSTANTS.UI_LIMITS.MAX_LOG_ENTRIES) {
                for (let i = 0; i < entries.length - CONSTANTS.UI_LIMITS.MAX_LOG_ENTRIES; i++) {
                    entries[i].remove();
                }
            }
            this.logBuffer = [];
        },
        updateStatus: status => {
            const statusEl = document.getElementById(CONSTANTS.SELECTORS.STATUS_DISPLAY.replace("#", ""));
            if (statusEl) statusEl.textContent = status;
        },
        updateProgress: percentage => {
            const progressInner = document.getElementById(CONSTANTS.SELECTORS.PROGRESS_INNER.replace("#", ""));
            if (progressInner) progressInner.style.width = `${percentage}%`;
        },
        updateStatistics: stats => {
            Object.assign(UI.statistics, stats);
            const totalEl = document.getElementById(CONSTANTS.SELECTORS.STAT_TOTAL.replace("#", ""));
            const completedEl = document.getElementById(CONSTANTS.SELECTORS.STAT_COMPLETED.replace("#", ""));
            const learnedEl = document.getElementById(CONSTANTS.SELECTORS.STAT_LEARNED.replace("#", ""));
            const failedEl = document.getElementById(CONSTANTS.SELECTORS.STAT_FAILED.replace("#", ""));
            const skippedEl = document.getElementById(CONSTANTS.SELECTORS.STAT_SKIPPED.replace("#", ""));
            if (totalEl) totalEl.textContent = UI.statistics.total;
            if (completedEl) completedEl.textContent = UI.statistics.completed;
            if (learnedEl) learnedEl.textContent = UI.statistics.learned;
            if (failedEl) failedEl.textContent = UI.statistics.failed;
            if (skippedEl) skippedEl.textContent = UI.statistics.skipped;
        },
        addStyles: () => {
            {
                const styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.textContent = UI_CSS_CONTENT;
                document.head.appendChild(styleSheet);
            }
        },
        setIncompatible: reason => {
            UI.updateStatus("⚠️ 当前页面暂不兼容");
            UI.log(`[兼容性检查] ${reason}`, "warn");
            const panel = document.getElementById("api-learner-panel");
            if (!panel) return;
            panel.classList.add("incompatible-mode");
            if (panel.querySelector(".incompatible-banner")) return;
            const warningBanner = document.createElement("div");
            warningBanner.className = "incompatible-banner";
            warningBanner.innerHTML = `\n            <div class="warning-icon">⚠️</div>\n            <div class="warning-content">\n                <div class="warning-title">当前环境暂不支持</div>\n                <div class="warning-message">${reason}</div>\n            </div>\n        `;
            const header = panel.querySelector(".header");
            if (header) {
                panel.insertBefore(warningBanner, header);
            }
        },
        exportLogs: () => {
            if (UI.logs.length === 0) {
                alert("没有可导出的调试日志。");
                return;
            }
            const blob = new Blob([ UI.logs.join("\r\n") ], {
                type: "text/plain;charset=utf-8"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `api_learner_debug_log_${(new Date).toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    const SM_LOGGER = createLogger("PudongStateManager");
    CONSTANTS.LEARNING_STATES;
    const PudongStateManager = {
        status: CONSTANTS.LEARNING_STATES.IDLE,
        currentCourse: null,
        progress: {
            currentPercent: 0,
            watchedSeconds: 0,
            totalSeconds: 0,
            currentChapter: 0,
            totalChapters: 0
        },
        failureReason: null,
        async startCourse(course) {
            this.currentCourse = course;
            this.status = CONSTANTS.LEARNING_STATES.PREPARING;
            this.failureReason = null;
            this.progress = {
                currentPercent: 0,
                watchedSeconds: 0,
                totalSeconds: 0,
                currentChapter: 0,
                totalChapters: 0
            };
            EventBus.publish(CONSTANTS.EVENTS.COURSE_START, {
                course: course,
                status: this.status
            });
            SM_LOGGER.info(`开始课程: ${course.title}`);
        },
        async updateProgress(updates) {
            this.progress = {
                ...this.progress,
                ...updates
            };
            EventBus.publish(CONSTANTS.EVENTS.PROGRESS_UPDATE, {
                percent: this.progress.currentPercent,
                watched: this.progress.watchedSeconds,
                total: this.progress.totalSeconds
            });
        },
        async setLearning() {
            this.status = CONSTANTS.LEARNING_STATES.LEARNING;
            SM_LOGGER.debug("进入学习状态");
        },
        async complete(result = {}) {
            this.status = CONSTANTS.LEARNING_STATES.COMPLETED;
            EventBus.publish(CONSTANTS.EVENTS.COURSE_COMPLETE, {
                course: this.currentCourse,
                result: result
            });
            SM_LOGGER.info(`课程完成: ${this.currentCourse?.title}`, result);
        },
        async skip(reason) {
            this.status = CONSTANTS.LEARNING_STATES.SKIPPED;
            EventBus.publish(CONSTANTS.EVENTS.COURSE_SKIP, {
                course: this.currentCourse,
                reason: reason
            });
            SM_LOGGER.info(`课程跳过: ${this.currentCourse?.title}, 原因: ${reason}`);
        },
        async fail(reason, error = null) {
            this.status = CONSTANTS.LEARNING_STATES.FAILED;
            this.failureReason = reason;
            EventBus.publish(CONSTANTS.EVENTS.COURSE_ERROR, {
                course: this.currentCourse,
                reason: reason,
                error: error
            });
            SM_LOGGER.error(`课程失败: ${this.currentCourse?.title}, 原因: ${reason}`, error);
        },
        async reset() {
            this.status = CONSTANTS.LEARNING_STATES.IDLE;
            this.currentCourse = null;
            this.failureReason = null;
            this.progress = {
                currentPercent: 0,
                watchedSeconds: 0,
                totalSeconds: 0,
                currentChapter: 0,
                totalChapters: 0
            };
            SM_LOGGER.info("状态已重置");
        },
        isLearning() {
            return this.status === CONSTANTS.LEARNING_STATES.LEARNING;
        },
        isCompleted() {
            return this.status === CONSTANTS.LEARNING_STATES.COMPLETED;
        },
        getState() {
            return {
                status: this.status,
                course: this.currentCourse,
                progress: this.progress,
                failureReason: this.failureReason
            };
        }
    };
    const PROC_LOGGER = createLogger("PudongProcessor");
    const PudongProcessor = {
        async processCourse(course, options = {}) {
            const {skipCompleted: skipCompleted = true} = options;
            const courseId = course.id || course.courseId;
            course.dsUnitId;
            PROC_LOGGER.info(`开始处理课程: ${course.title}`, {
                courseId: courseId
            });
            EventBus.publish(CONSTANTS.EVENTS.COURSE_START, {
                course: course,
                courseId: courseId
            });
            try {
                const prepResult = await this.prepare(course, {
                    skipCompleted: skipCompleted
                });
                if (prepResult.action === "skip") {
                    PROC_LOGGER.info(`课程跳过: ${course.title}, 原因: ${prepResult.reason}`);
                    return {
                        action: "skip",
                        course: course,
                        reason: prepResult.reason
                    };
                }
                if (prepResult.action === "fail") {
                    PROC_LOGGER.warn(`课程准备失败: ${course.title}`);
                    return {
                        action: "fail",
                        course: course,
                        reason: prepResult.reason
                    };
                }
                const execResult = await this.execute(course, prepResult.playInfo);
                if (!execResult.success) {
                    await PudongStateManager.fail(execResult.reason || "学习执行失败");
                    return {
                        action: "fail",
                        course: course,
                        reason: execResult.reason
                    };
                }
                await this.cleanup();
                await PudongStateManager.complete(execResult);
                PROC_LOGGER.info(`课程完成: ${course.title}`, execResult);
                return {
                    action: "complete",
                    course: course,
                    result: execResult
                };
            } catch (error) {
                PROC_LOGGER.error(`课程处理异常: ${course.title}`, error);
                await PudongStateManager.fail("unknown_error", error);
                return {
                    action: "fail",
                    course: course,
                    reason: error.message
                };
            }
        },
        async prepare(course, options = {}) {
            const {skipCompleted: skipCompleted = true} = options;
            const courseId = course.id || course.courseId;
            const coursewareId = course.dsUnitId;
            await PudongStateManager.startCourse(course);
            if (skipCompleted && CONSTANTS.SKIP_COMPLETED_COURSES) {
                try {
                    const completionCheck = await PudongApi.checkCompletion(courseId, coursewareId);
                    if (completionCheck.isCompleted) {
                        await PudongStateManager.skip(`已完成 (${completionCheck.finishedRate}%)`);
                        return {
                            action: "skip",
                            reason: "课程已完成"
                        };
                    }
                } catch (e) {
                    PROC_LOGGER.warn("完成度检查失败，继续学习", e);
                }
            }
            let playInfo;
            try {
                playInfo = await PudongApi.getPlayInfo(courseId, course.dsUnitId, course.durationStr);
            } catch (e) {
                PROC_LOGGER.warn("获取播放信息失败，使用默认值", e);
                playInfo = {
                    courseId: courseId,
                    coursewareId: coursewareId || courseId,
                    videoId: `mock_${courseId}`,
                    duration: CONSTANTS.TIME_FORMATS.DEFAULT_DURATION,
                    lastLearnedTime: 0
                };
            }
            if (!playInfo) {
                await PudongStateManager.fail("无法获取播放信息");
                return {
                    action: "fail",
                    reason: "无法获取课程播放信息"
                };
            }
            await PudongStateManager.updateProgress({
                totalSeconds: playInfo.duration,
                watchedSeconds: playInfo.lastLearnedTime
            });
            const progressPercent = Math.floor(playInfo.lastLearnedTime / playInfo.duration * 100);
            if (progressPercent >= CONSTANTS.COMPLETION_THRESHOLD) {
                await PudongStateManager.skip(`进度已达 ${progressPercent}%`);
                return {
                    action: "skip",
                    reason: "播放信息确认已完成"
                };
            }
            PROC_LOGGER.info(`课程准备完成: ${course.title}`, {
                progress: `${progressPercent}%`,
                duration: playInfo.duration
            });
            return {
                action: "learn",
                playInfo: playInfo
            };
        },
        async execute(course, playInfo) {
            await PudongStateManager.setLearning();
            try {
                const courseInfo = {
                    ...course,
                    ...playInfo,
                    title: course.title || course.courseName,
                    courseId: course.id || course.courseId
                };
                const success = await PudongApi.reportProgress(playInfo, playInfo.duration - 30);
                if (success) {
                    return {
                        success: true,
                        reason: "策略执行成功"
                    };
                } else {
                    return {
                        success: false,
                        reason: "策略执行失败"
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    reason: error.message
                };
            }
        },
        async cleanup() {
            PROC_LOGGER.debug("课后清理完成");
        },
        async coolingDown(isLast, stopChecker = null) {
            if (isLast) return;
            const {CONFIG: CONFIG} = await Promise.resolve().then(function() {
                return infraConfig;
            });
            const minDelay = CONFIG.COOLING_MIN_DELAY || 5e3;
            const maxDelay = CONFIG.COOLING_MAX_DELAY || 1e4;
            const delay = Math.random() * (maxDelay - minDelay) + minDelay;
            const seconds = Math.round(delay / 1e3);
            PROC_LOGGER.info(`冷却等待: ${seconds}秒`);
            for (let i = seconds; i > 0; i--) {
                if (stopChecker && stopChecker()) {
                    PROC_LOGGER.info("冷却被中断");
                    return;
                }
                EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, `等待中 (${i}s)`);
                await new Promise(r => setTimeout(r, 1e3));
            }
        }
    };
    const PudongLearner = {
        PAGE_TYPES: {
            PLAYER: "player",
            COLUMN: "column",
            INDEX: "index",
            UNKNOWN: "unknown"
        },
        identifyPage() {
            return PudongHandler.identifyPage();
        },
        isPudongMode() {
            return PudongHandler.isPudongMode();
        },
        async selectAndExecute() {
            if (!this.isPudongMode()) {
                return null;
            }
            const pageType = this.identifyPage();
            if (pageType === this.PAGE_TYPES.PLAYER) {
                return await this._handlePlayerPage();
            }
            if (pageType === this.PAGE_TYPES.COLUMN) {
                return await this._handleColumnPage();
            }
            if (pageType === this.PAGE_TYPES.INDEX) {
                return await this._handleIndexPage();
            }
            return null;
        },
        async _handlePlayerPage() {
            console.log("[PudongLearner] 处理浦东播放页");
            try {
                const result = await PudongHandler.startPlayerFlow();
                if (result) {
                    EventBus.publish(CONSTANTS.EVENTS.LEARNING_START, {
                        source: "pudong_player"
                    });
                    return true;
                }
                return false;
            } catch (error) {
                console.error("[PudongLearner] 播放页处理失败:", error);
                return false;
            }
        },
        async _handleColumnPage() {
            console.log("[PudongLearner] 处理浦东专栏页");
            try {
                const courses = await PudongHandler.scanCourses();
                if (courses && courses.length > 0) {
                    console.log(`[PudongLearner] 扫描到 ${courses.length} 门课程`);
                    return false;
                }
                return false;
            } catch (error) {
                console.error("[PudongLearner] 专栏页处理失败:", error);
                return false;
            }
        },
        async _handleIndexPage() {
            console.log("[PudongLearner] 处理浦东首页");
            try {
                const courses = await PudongHandler.scanCourses();
                console.log(`[PudongLearner] 首页扫描到 ${courses?.length || 0} 门课程`);
                return false;
            } catch (error) {
                console.error("[PudongLearner] 首页处理失败:", error);
                return false;
            }
        },
        async processCourses(courses, options = {}) {
            const results = {
                total: courses.length,
                completed: 0,
                skipped: 0,
                failed: 0,
                details: []
            };
            const {stopChecker: stopChecker = null} = options;
            for (let i = 0; i < courses.length; i++) {
                if (stopChecker && stopChecker()) {
                    console.log("[PudongLearner] 用户停止学习");
                    break;
                }
                const course = courses[i];
                const isLast = i === courses.length - 1;
                try {
                    const result = await PudongProcessor.processCourse(course, {
                        skipCompleted: true
                    });
                    if (result.action === "complete") {
                        results.completed++;
                    } else if (result.action === "skip") {
                        results.skipped++;
                    } else {
                        results.failed++;
                    }
                    results.details.push({
                        courseId: course.id || course.courseId,
                        title: course.title || course.courseName,
                        action: result.action,
                        reason: result.reason
                    });
                    EventBus.publish(CONSTANTS.EVENTS.STATISTICS_UPDATE, results);
                    if (!isLast && result.action !== "fail") {
                        await PudongProcessor.coolingDown(isLast, stopChecker);
                    }
                } catch (error) {
                    console.error(`[PudongLearner] 处理课程失败: ${course.title}`, error);
                    results.failed++;
                    results.details.push({
                        courseId: course.id || course.courseId,
                        title: course.title || course.courseName,
                        action: "error",
                        reason: error.message
                    });
                }
            }
            console.log("[PudongLearner] 批量处理完成", results);
            return results;
        },
        async getPlayerCoursewareList() {
            const courseId = this._extractCourseIdFromUrl();
            if (!courseId) {
                console.warn("[PudongLearner] 无法提取课程ID");
                return [];
            }
            return await PudongApi.getCoursewareList(courseId);
        },
        _extractCourseIdFromUrl() {
            const url = new URL(window.location.href);
            return url.searchParams.get("courseId") || url.searchParams.get("id");
        },
        async reset() {
            await PudongStateManager.reset();
        },
        getState() {
            return PudongStateManager.getState();
        }
    };
    const FlowOrchestrator = {
        async selectAndExecute() {
            if (CONFIG$1.CBEAD_MODE) {
                const cbeadResult = await CbeadLearner.selectAndExecute();
                if (cbeadResult !== null) {
                    return cbeadResult;
                }
            }
            if (CONFIG$1.PUDONG_MODE) {
                const pudongResult = await PudongLearner.selectAndExecute();
                if (pudongResult !== null) {
                    return pudongResult;
                }
            }
            return null;
        },
        getCurrentApi() {
            return ApiFactory.getCurrentApi();
        },
        getPudongApi() {
            return ApiFactory.getPudongApi();
        },
        getCbeadApi() {
            return ApiFactory.getCbeadApi();
        }
    };
    let API = null;
    function setAPI(api) {
        API = api;
    }
    const Learner = {
        state: CONSTANTS.LEARNING_STATES.IDLE,
        isRunning: false,
        stopRequested: false,
        stop: function() {
            this.isRunning = false;
            this.stopRequested = true;
            this.state = CONSTANTS.LEARNING_STATES.IDLE;
            if (API && API.abortController) {
                API.abortController.abort();
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "🛑 正在中止所有网络请求...",
                    type: "info"
                });
            }
            const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
            if (toggleBtn) {
                toggleBtn.setAttribute("data-state", "stopped");
                toggleBtn.textContent = "开始学习";
            }
            EventBus.publish(CONSTANTS.EVENTS.LEARNING_STOP);
            EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "已停止");
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "⏹️ 学习流程已停止",
                type: "warn"
            });
        },
        hasValidId: function() {
            if (CONFIG$1.IS_PORTAL || CONFIG$1.UNSUPPORTED_BRANCH) return false;
            const href = window.location.href;
            if (href.includes("pagehome/index") || document.querySelector('[module-name="nc.pagehome.index"]')) {
                return false;
            }
            const isCoursePlayerPage = window.location.href.includes("/coursePlayer");
            const isSpecialDetailPage = window.location.href.includes("/specialdetail");
            const isChannelDetailPage = window.location.href.includes("channelDetail");
            const isPudongSpecialPage = PudongHandler.identifyPage() === PudongHandler.PAGE_TYPES.COLUMN;
            const isCbeadTrainNewPage = window.location.href.includes("train-new/class-detail");
            const isCbeadPlayerPage = window.location.href.includes("study/course/detail");
            const isChannelListPage = window.location.href.includes("channelList");
            if (isChannelListPage) {
                return false;
            }
            if (isCoursePlayerPage || isSpecialDetailPage || isChannelDetailPage || isPudongSpecialPage || isCbeadTrainNewPage || isCbeadPlayerPage) {
                let id = null;
                const urlParams = new URLSearchParams(window.location.search);
                id = urlParams.get("id");
                if (!id) {
                    const hash = window.location.hash;
                    if (hash.includes("?")) {
                        const hashParams = new URLSearchParams(hash.split("?")[1]);
                        id = hashParams.get("id");
                    }
                    if (!id) {
                        const match = hash.match(/[?&]id=([^&]+)/);
                        if (match) {
                            id = match[1];
                        }
                    }
                    if (!id) {
                        const uuidMatch = hash.match(/class-detail\/([a-f0-9-]+)/);
                        if (uuidMatch) {
                            id = uuidMatch[1];
                        }
                    }
                    if (!id) {
                        const playerMatch = hash.match(/detail\/\d+&([a-f0-9-]+)&/);
                        if (playerMatch) {
                            id = playerMatch[1];
                        }
                    }
                }
                return !!id;
            }
            const urlParams = new URLSearchParams(window.location.search);
            let id = urlParams.get("id");
            if (!id) {
                const hash = window.location.hash;
                if (hash.includes("?")) {
                    const hashParams = new URLSearchParams(hash.split("?")[1]);
                    id = hashParams.get("id");
                }
                if (!id) {
                    const match = hash.match(/[?&]id=([^&]+)/);
                    if (match) {
                        id = match[1];
                    }
                }
            }
            if (!id) {
                const hasCourseElements = CONSTANTS.COURSE_SELECTORS.some(selector => document.querySelector(selector));
                if (hasCourseElements) {
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: "[校验] 虽然URL没发现ID，但页面检测到课程元素，允许启动",
                        type: "info"
                    });
                    return true;
                }
            }
            return !!id;
        },
        async startLearning() {
            try {
                const result = await FlowOrchestrator.selectAndExecute();
                if (result === CONSTANTS.FLOW_RESULTS.WAITING_FOR_USER) {
                    console.log("[Learner] 用户主动点击按钮，开始学习流程");
                    const {CbeadLearner: CbeadLearner} = await Promise.resolve().then(function() {
                        return learner;
                    });
                    await CbeadLearner.startBranchListFlow();
                    return;
                }
                if (result === false) {
                    this._resetToggleButton("页面不支持");
                    return;
                }
                if (result === true) {
                    if (!this.stopRequested) {
                        this._resetToggleButton();
                    }
                    return;
                }
            } catch (error) {
                this._handleLearningError(error);
            }
        },
        _resetToggleButton(statusText = "学习完成") {
            const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
            if (toggleBtn) {
                toggleBtn.setAttribute("data-state", "stopped");
                toggleBtn.textContent = "开始学习";
            }
            EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, statusText);
        },
        _handleLearningError(error) {
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `❌ 学习流程出错: ${error.message}`,
                type: "error"
            });
            console.error("学习流程错误:", error);
            this._resetToggleButton("学习出错");
        }
    };
    var bizLearner = Object.freeze({
        __proto__: null,
        Learner: Learner,
        setAPI: setAPI
    });
    const LearningStrategies = {
        async instant_finish(context) {
            const {duration: duration} = context;
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "🚀 采用极速完成策略 - 直接冲刺",
                type: "info"
            });
            const learner = ServiceLocator.get(ServiceNames.LEARNER);
            const delay = Math.floor(Math.random() * 500 + 500);
            const steps = 5;
            const stepDelay = delay / steps;
            for (let i = 0; i < steps; i++) {
                if (learner && learner.stopRequested) {
                    EventBus.publish(CONSTANTS.EVENTS.LOG, {
                        message: "🛑 用户中断学习",
                        type: "warn"
                    });
                    return false;
                }
                await new Promise(resolve => setTimeout(resolve, stepDelay));
            }
            const finalTime = Math.max(0, duration - 30);
            if (learner && learner.stopRequested) {
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: "🛑 用户中断学习",
                    type: "warn"
                });
                return false;
            }
            const api = ServiceLocator.get(ServiceNames.API);
            return await api.reportProgressWithDelay(context.playInfo, finalTime);
        }
    };
    var bizStrategies = Object.freeze({
        __proto__: null,
        LearningStrategies: LearningStrategies
    });
    function setupDependencyInjection() {
        if (typeof window !== "undefined") {
            window.UI = UI;
            window.CbeadLearner = CbeadLearner;
        }
        ServiceLocator.register(ServiceNames.UI, UI);
        ServiceLocator.register(ServiceNames.API, API$1);
        ServiceLocator.register(ServiceNames.LEARNER, Learner);
        ServiceLocator.register(ServiceNames.CONFIG, CONFIG$1);
        setAPI(API$1);
    }
    function initScript() {
        Settings.load();
        setupDependencyInjection();
        UI.createPanel();
        detectEnvironment();
        PudongHandler.init();
        CbeadHandler.init();
        GM_registerMenuCommand("导出调试日志", UI.exportLogs, "e");
        const toggleBtn = document.getElementById(CONSTANTS.SELECTORS.TOGGLE_BTN.replace("#", ""));
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                const isRunning = toggleBtn.getAttribute("data-state") === "running";
                if (isRunning) {
                    Learner.stop();
                } else {
                    Learner.stopRequested = false;
                    Learner.isRunning = true;
                    Learner.state = CONSTANTS.LEARNING_STATES.LEARNING;
                    EventBus.publish(CONSTANTS.EVENTS.LEARNING_START);
                    EventBus.publish(CONSTANTS.EVENTS.STATUS_UPDATE, "学习中...");
                    if (CONFIG$1.PUDONG_MODE) {
                        EventBus.publish("pudong:startLearning");
                        return;
                    }
                    Learner.startLearning().catch(error => {
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: `❌ 启动学习流程失败: ${error.message}`,
                            type: "error"
                        });
                        Learner.stop();
                    });
                }
            });
        }
        EventBus.publish(CONSTANTS.EVENTS.LOG, {
            message: "🚀 cela学习助手 v4.0 初始化完成",
            type: "success"
        });
        setTimeout(() => {
            checkAndStartAutoLearning();
        }, 1e3);
        setupRouteListener();
        if (CONFIG$1.CBEAD_MODE) {
            setupProgressErrorMonitor();
        }
    }
    let isAutoStarting = false;
    function checkAndStartAutoLearning() {
        if (CONFIG$1.CBEAD_MODE && window.location.href.includes("study/course/detail")) {
            console.log("[Init] 🔍 检测到企业分院播放页，准备开始学习...");
            if (isAutoStarting) {
                console.log("[Init] ⚠️ 学习任务已在进行中，跳过重复启动");
                return;
            }
            isAutoStarting = true;
            console.log("[Init] 🔒 设置防重复标志，开始学习...");
            const toggleBtn = document.getElementById("toggle-learning-btn");
            if (toggleBtn) {
                toggleBtn.setAttribute("data-state", "learning");
                toggleBtn.textContent = "停止学习";
            }
            Learner.startLearning();
            setTimeout(() => {
                isAutoStarting = false;
                console.log("[Init] 🔓 重置防重复标志（超时重置）");
            }, 6e4);
        }
    }
    function setupRouteListener() {
        if (!CONFIG$1.CBEAD_MODE) {
            console.log("[Init] 📌 非企业分院环境，不设置路由监听");
            return;
        }
        console.log("[Init] 📡 设置路由监听（企业分院 SPA 模式）");
        let lastUrl = window.location.href;
        window.addEventListener("hashchange", async () => {
            try {
                const currentUrl = window.location.href;
                console.log(`[Init] 🔄 检测到路由变化:`);
                console.log(`   - 旧 URL: ${lastUrl}`);
                console.log(`   - 新 URL: ${currentUrl}`);
                if (currentUrl.includes("study/errors/") && lastUrl.includes("study/course/detail")) {
                    console.warn("[Init] ⚠️ 检测到跳转到错误页面！");
                    console.warn("[Init] 💡 可能原因：课程不存在、无访问权限或已被删除");
                    const uuidMatch = currentUrl.match(/errors\/([a-f0-9-]+)/);
                    if (uuidMatch) {
                        const failedUuid = uuidMatch[1];
                        console.warn(`[Init] 📌 失败课程 UUID: ${failedUuid}`);
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: `❌ 课程加载失败（UUID: ${failedUuid.substring(0, 8)}...），可能无访问权限`,
                            type: "error"
                        });
                        LearningState.markFailed("课程加载失败（跳转到错误页面）");
                        setTimeout(() => {
                            if (typeof CbeadHandler !== "undefined" && CbeadHandler.returnToList) {
                                console.log("[Init] 🔄 返回列表页...");
                                const returnUrl = "#/branch-list-v";
                                CbeadHandler.returnToList(returnUrl);
                            }
                        }, 2e3);
                    }
                }
                if (currentUrl.includes("study/course/detail") && !lastUrl.includes("study/course/detail")) {
                    console.log("[Init] 🎯 导航到播放页，立即检查批量学习任务...");
                    checkAndStartAutoLearning();
                }
                if (currentUrl.includes("train-new/class-detail") || currentUrl.includes("class-detail") || currentUrl.includes("branch-list-v")) {
                    console.log("[Init] 📋 导航到列表页，触发学习流程...");
                    setTimeout(() => {
                        CbeadLearner.selectAndExecute();
                    }, 2e3);
                }
                lastUrl = currentUrl;
            } catch (error) {
                console.error("[Init] ❌ hashchange 事件处理出错:", error);
                EventBus.publish(CONSTANTS.EVENTS.LOG, {
                    message: `路由变化处理失败: ${error.message}`,
                    type: "error"
                });
            }
        });
        setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                console.log(`[Init] 🔄 检测到 URL 变化（轮询）:`);
                console.log(`   - 旧 URL: ${lastUrl}`);
                console.log(`   - 新 URL: ${currentUrl}`);
                if (currentUrl.includes("study/errors/") && lastUrl.includes("study/course/detail")) {
                    console.warn("[Init] ⚠️ 检测到跳转到错误页面（轮询）！");
                    console.warn("[Init] 💡 可能原因：课程不存在、无访问权限或已被删除");
                    const uuidMatch = currentUrl.match(/errors\/([a-f0-9-]+)/);
                    if (uuidMatch) {
                        const failedUuid = uuidMatch[1];
                        console.warn(`[Init] 📌 失败课程 UUID: ${failedUuid}`);
                        EventBus.publish(CONSTANTS.EVENTS.LOG, {
                            message: `❌ 课程加载失败（UUID: ${failedUuid.substring(0, 8)}...），可能无访问权限`,
                            type: "error"
                        });
                        LearningState.markFailed("课程加载失败（跳转到错误页面）");
                        setTimeout(() => {
                            if (typeof CbeadHandler !== "undefined" && CbeadHandler.returnToList) {
                                console.log("[Init] 🔄 返回列表页...");
                                const returnUrl = "#/branch-list-v";
                                CbeadHandler.returnToList(returnUrl);
                            }
                        }, 2e3);
                    }
                }
                if (currentUrl.includes("study/course/detail") && !lastUrl.includes("study/course/detail")) {
                    console.log("[Init] 🎯 导航到播放页，立即检查批量学习任务...");
                    checkAndStartAutoLearning();
                }
                if (currentUrl.includes("train-new/class-detail") || currentUrl.includes("class-detail") || currentUrl.includes("branch-list-v")) {
                    console.log("[Init] 📋 导航到列表页，触发学习流程（轮询）...");
                    setTimeout(() => {
                        CbeadLearner.selectAndExecute();
                    }, 2e3);
                }
                lastUrl = currentUrl;
            }
        }, 1e3);
    }
    function setupProgressErrorMonitor() {
        console.log("[Init] 📡 设置进度错误监听器（企业分院专用）...");
        LearningState.reset();
        const skipCurrentCourse = reason => {
            if (LearningState.isFailed()) {
                console.log("[ProgressError] ⚠️ 跳过已触发，忽略重复调用");
                return;
            }
            LearningState.markFailed(reason);
            console.warn(`[ProgressError] 🚨 检测到进度上报失败，标记当前课程为失败: ${reason}`);
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: `❌ 进度上报失败（${reason}），标记当前课程为失败`,
                type: "error"
            });
            EventBus.publish(CONSTANTS.EVENTS.LOG, {
                message: "💡 服务器无法记录学习进度，继续播放无意义",
                type: "info"
            });
            EventBus.publish("course:failed", {
                reason: `进度上报失败: ${reason}`
            });
            setTimeout(() => {
                if (typeof Learner !== "undefined" && Learner.state === CONSTANTS.LEARNING_STATES.LEARNING) {
                    console.log("[ProgressError] 🛑 停止当前学习流程...");
                    Learner.stop();
                }
                console.log("[ProgressError] ✅ 已标记当前课程为失败");
            }, 500);
        };
        window.celaAutoResetCourseFail = () => {
            LearningState.reset();
        };
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._method = method;
            this._url = url;
            return originalXHROpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function() {
            if (this._url && this._url.includes("update-progress")) {
                this.addEventListener("load", function() {
                    if (this.status === 422) {
                        console.error("[ProgressError] POST 422:", this._url);
                        skipCurrentCourse("422 Unprocessable Content");
                    }
                });
            }
            return originalXHRSend.apply(this, arguments);
        };
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            return originalFetch.apply(this, arguments).then(response => {
                if (typeof url === "string" && url.includes("update-progress") && response.status === 422) {
                    console.error("[ProgressError] POST 422:", url);
                    skipCurrentCourse("422 Unprocessable Content");
                }
                return response;
            });
        };
        console.log("[Init] ✅ 进度错误监听器已启动（422 错误将自动跳过课程）");
    }
    function immediateMuteAllVideos() {
        console.log("[Init] 🔇 立即静音模式启动...");
        const videos = document.querySelectorAll("video");
        console.log(`[Init] 📹 找到 ${videos.length} 个现有的 video 元素`);
        videos.forEach((video, index) => {
            video.muted = true;
            video.volume = 0;
            if (window.player && typeof window.player.muted === "function") {
                try {
                    window.player.muted(true);
                } catch (e) {}
            }
            console.log(`[Init] 🔇 video #${index + 1} 已静音`);
        });
        const audios = document.querySelectorAll("audio");
        console.log(`[Init] 🎵 找到 ${audios.length} 个现有的 audio 元素`);
        audios.forEach((audio, index) => {
            audio.muted = true;
            audio.volume = 0;
            audio.pause();
            console.log(`[Init] 🔇 audio #${index + 1} 已静音并暂停`);
        });
        let pollCount = 0;
        const maxPolls = 100;
        const pollInterval = setInterval(() => {
            pollCount++;
            const allVideos = document.querySelectorAll("video");
            let hasUnmuted = false;
            allVideos.forEach(video => {
                if (!video.muted || video.volume !== 0) {
                    video.muted = true;
                    video.volume = 0;
                    if (!hasUnmuted) {
                        console.log(`[Init] 🔇 轮询发现未静音的 video，立即静音 (第${pollCount}次)`);
                        hasUnmuted = true;
                    }
                }
                if (window.player && typeof window.player.muted === "function") {
                    try {
                        if (!window.player.muted()) {
                            window.player.muted(true);
                        }
                    } catch (e) {}
                }
            });
            const allAudios = document.querySelectorAll("audio");
            allAudios.forEach(audio => {
                if (!audio.muted || audio.volume !== 0) {
                    audio.muted = true;
                    audio.volume = 0;
                    audio.pause();
                    console.log(`[Init] 🔇 轮询发现未静音的 audio，立即静音 (第${pollCount}次)`);
                }
            });
            if (pollCount >= maxPolls) {
                clearInterval(pollInterval);
                console.log("[Init] ✅ 高频轮询完成");
            }
        }, 100);
        console.log("[Init] 📡 高频轮询已启动（每100ms，持续10秒）");
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === "VIDEO") {
                        console.log("[Init] 🔇 MutationObserver: 检测到新创建的 video 元素，立即静音并暂停");
                        node.muted = true;
                        node.volume = 0;
                        node.autoplay = false;
                        node.pause();
                    }
                    if (node.nodeName === "AUDIO") {
                        console.log("[Init] 🔇 MutationObserver: 检测到新创建的 audio 元素，立即静音并暂停");
                        node.muted = true;
                        node.volume = 0;
                        node.autoplay = false;
                        node.pause();
                    }
                    if (node.querySelectorAll) {
                        const newVideos = node.querySelectorAll("video");
                        newVideos.forEach(video => {
                            console.log("[Init] 🔇 MutationObserver: 检测到新创建的子 video 元素，立即静音并暂停");
                            video.muted = true;
                            video.volume = 0;
                            video.autoplay = false;
                            video.pause();
                        });
                        const newAudios = node.querySelectorAll("audio");
                        newAudios.forEach(audio => {
                            console.log("[Init] 🔇 MutationObserver: 检测到新创建的子 audio 元素，立即静音并暂停");
                            audio.muted = true;
                            audio.volume = 0;
                            audio.autoplay = false;
                            audio.pause();
                        });
                    }
                });
            });
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        console.log("[Init] ✅ MutationObserver 已启动，将持续监听并静音新媒体元素");
        console.log("[Init] 🛡️ 检查遮罩并点击按钮...");
        const maskCheck = detectMask();
        if (maskCheck.exists) {
            console.log(`[Init] 🛡️ 检测到 ${maskCheck.masks.length} 个遮罩，尝试点击按钮...`);
            const clickResult = clickMaskButton();
            console.log(`[Init] 🖱️ 已点击 ${clickResult.clicked} 个遮罩按钮`);
        }
        startMaskObserver();
    }
    const hasVideoElement = document.querySelector("video") !== null;
    if (window.location.href.includes("study/course/detail") && hasVideoElement) {
        immediateMuteAllVideos();
    }
    setTimeout(initScript, 1e3);
    exports.API = API$1;
    exports.ApiFactory = ApiFactory;
    exports.CONFIG = CONFIG$1;
    exports.CONSTANTS = CONSTANTS;
    exports.CbeadHandler = CbeadHandler;
    exports.CbeadLearner = CbeadLearner;
    exports.CourseAdapter = CourseAdapter;
    exports.EventBus = EventBus;
    exports.Learner = Learner;
    exports.LearningStrategies = LearningStrategies;
    exports.PudongHandler = PudongHandler;
    exports.RequestQueue = RequestQueue;
    exports.Settings = Settings;
    exports.UI = UI;
    exports.Utils = Utils;
    exports.detectEnvironment = detectEnvironment;
    return exports;
})({});
