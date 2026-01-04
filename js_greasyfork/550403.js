// ==UserScript==
// @name         YT Polymer Mid 2019 - Early 2021 script
// @version      2.6.4
// @description  Modifies things like the old icons and more stuff prior to March 2021. Works best with YT Late '19-Mid '20 and CSS tweaks for NRD userstyle.
// @author       Magma_Craft
// @license MIT
// @match        *://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/550403/YT%20Polymer%20Mid%202019%20-%20Early%202021%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/550403/YT%20Polymer%20Mid%202019%20-%20Early%202021%20script.meta.js
// ==/UserScript==
// ==/UserScript==
 
// Attributes to remove from <html>
const ATTRS = [
    "refresh",
    "system-icons",
    "darker-dark-theme",
    "darker-dark-theme-deprecate",
    "typography",
    "typography-spacing"
];
 
// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: true
}
 
// Experiment flags.
const EXPFLAGS = {
    kevlar_system_icons: false,
    enable_channel_page_header_profile_section: false,
    enable_header_channel_handler_ui: false,
    kevlar_unavailable_video_error_ui_client: false,
    kevlar_refresh_on_theme_change: false,
    kevlar_modern_sd_v2: false,
    kevlar_watch_cinematics: false,
    kevlar_watch_comments_panel_button: false,
    kevlar_watch_grid: false,
    kevlar_watch_grid_hide_chips: false,
    kevlar_watch_metadata_refresh_no_old_secondary_data: false,
    kevlar_watch_metadata_refresh_attached_subscribe: false,
    kevlar_watch_metadata_refresh_clickable_description: false,
    kevlar_watch_metadata_refresh_compact_view_count: false,
    kevlar_watch_metadata_refresh_description_info_dedicated_line: false,
    kevlar_watch_metadata_refresh_description_inline_expander: false,
    kevlar_watch_metadata_refresh_description_primary_color: false,
    kevlar_watch_metadata_refresh_for_live_killswitch: false,
    kevlar_watch_metadata_refresh_full_width_description: false,
    kevlar_watch_metadata_refresh_narrower_item_wrap: false,
    kevlar_watch_metadata_refresh_relative_date: false,
    kevlar_watch_modern_panels: false,
    kevlar_watch_panel_height_matches_player: false,
    smartimation_background: false,
    web_amsterdam_playlists: false,
    web_animated_actions: false,
    web_animated_like: false,
    web_button_rework: true,
    web_button_rework_with_live: true,
    web_darker_dark_theme: false,
    web_enable_youtab: false,
    web_guide_ui_refresh: false,
    web_modern_ads: false,
    web_modern_buttons: true,
    web_modern_chips: false,
    web_modern_collections_v2: false,
    web_modern_dialogs: false,
    web_modern_playlists: false,
    web_modern_subscribe: true,
    web_modern_tabs: false,
    web_modern_typography: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_searchbar_style: "default",
    web_segmented_like_dislike_button: false,
    web_sheets_ui_refresh: false,
    web_snackbar_ui_refresh: false,
    web_watch_rounded_player_large: false,
    // Extra additions to remove the watch grid UI
    web_player_enable_featured_product_banner_exclusives_on_desktop: false,
    kevlar_watch_comments_panel_button: false,
    fill_view_models_on_web_vod: true,
    kevlar_watch_flexy_metadata_height: "136",
    kevlar_watch_max_player_width: "1280",
    live_chat_over_engagement_panels: false,
    live_chat_scaled_height: false,
    live_chat_smaller_min_height: false,
    main_app_controller_extraction_batch_18: false,
    main_app_controller_extraction_batch_19: false,
    no_iframe_for_web_stickiness: false,
    optimal_reading_width_comments_ep: false,
    remove_masthead_channel_banner_on_refresh: false,
    small_avatars_for_comments: false,
    small_avatars_for_comments_ep: false,
    web_watch_compact_comments: false,
    web_watch_compact_comments_header: false,
    web_watch_log_theater_mode: false,
    web_watch_theater_chat: false,
    web_watch_theater_fixed_chat: false,
    wn_grid_max_item_width: 0,
    wn_grid_min_item_width: 0
}
 
// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
    web_rounded_containers: "false",
    web_rounded_thumbnails: "false"
}
 
class YTP {
    static observer = new MutationObserver(this.onNewScript);
 
    static _config = {};
 
    static isObject(item) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }
 
    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
 
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
 
        return this.mergeDeep(target, ...sources);
    }
 
 
    static onNewScript(mutations) {
        for (var mut of mutations) {
            for (var node of mut.addedNodes) {
                YTP.bruteforce();
            }
        }
    }
 
    static start() {
        this.observer.observe(document, {childList: true, subtree: true});
    }
 
    static stop() {
        this.observer.disconnect();
    }
 
    static bruteforce() {
        if (!window.yt) return;
        if (!window.yt.config_) return;
 
        this.mergeDeep(window.yt.config_, this._config);
    }
 
    static setCfg(name, value) {
        this._config[name] = value;
    }
 
    static setCfgMulti(configs) {
        this.mergeDeep(this._config, configs);
    }
 
    static setExp(name, value) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};
 
        this._config.EXPERIMENT_FLAGS[name] = value;
    }
 
    static setExpMulti(exps) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};
 
        this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps);
    }
 
    static decodePlyrFlags(flags) {
        var obj = {},
            dflags = flags.split("&");
 
        for (var i = 0; i < dflags.length; i++) {
            var dflag = dflags[i].split("=");
            obj[dflag[0]] = dflag[1];
        }
 
        return obj;
    }
 
    static encodePlyrFlags(flags) {
        var keys = Object.keys(flags),
            response = "";
 
        for (var i = 0; i < keys.length; i++) {
            if (i > 0) {
                response += "&";
            }
            response += keys[i] + "=" + flags[keys[i]];
        }
 
        return response;
    }
 
    static setPlyrFlags(flags) {
        if (!window.yt) return;
        if (!window.yt.config_) return;
        if (!window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) return;
        var conCfgs = window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
        if (!("WEB_PLAYER_CONTEXT_CONFIGS" in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {};
 
        for (var cfg in conCfgs) {
            var dflags = this.decodePlyrFlags(conCfgs[cfg].serializedExperimentFlags);
            this.mergeDeep(dflags, flags);
            this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
                serializedExperimentFlags: this.encodePlyrFlags(dflags)
            }
        }
    }
}
 
window.addEventListener("yt-page-data-updated", function tmp() {
    YTP.stop();
    for (i = 0; i < ATTRS.length; i++) {
        document.getElementsByTagName("html")[0].removeAttribute(ATTRS[i]);
    }
    window.removeEventListener("yt-page-date-updated", tmp);
});
 
YTP.start();
 
YTP.setCfgMulti(CONFIGS);
YTP.setExpMulti(EXPFLAGS);
YTP.setPlyrFlags(PLYRFLAGS);
 
function $(q) {
    return document.querySelector(q);
}

// Auto redirect shorts to watch page
var oldHref = document.location.href;
if (window.location.href.indexOf('youtube.com/shorts') > -1) {
    window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('youtube.com/shorts') > -1) {
                    window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
                }
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
};
 
// Fully replace shorts links with regular videos
/**
 * Shorts URL redirect.
 *
 * This is called on initial visit only. Successive navigations
 * are managed by modifying the YouTube Desktop application.
 */
(function(){
 
/** @type {string} */
var path = window.location.pathname;
 
if (0 == path.search("/shorts"))
{
    // Extract the video ID from the shorts link and redirect.
 
    /** @type {string} */
    var id = path.replace(/\/|shorts|\?.*/g, "");
 
    window.location.replace("https://www.youtube.com/watch?v=" + id);
}
 
})();
 
/**
 * YouTube Desktop Shorts remover.
 *
 * If the initial URL was not a shorts link, traditional redirection
 * will not work. This instead modifies video elements to replace them with
 * regular links.
 */
(function(){
 
/**
 * @param {string} selector (CSS-style) of the element
 * @return {Promise<Element>}
 */
async function querySelectorAsync(selector)
{
    while (null == document.querySelector(selector))
    {
        // Pause for a frame and let other code go on.
        await new Promise(r => requestAnimationFrame(r));
    }
 
    return document.querySelector(selector);
}
 
/**
 * Small toolset for interacting with the Polymer
 * YouTube Desktop application.
 *
 * @author Taniko Yamamoto <kirasicecreamm@gmail.com>
 * @version 1.0
 */
class YtdTools
{
    /** @type {string} Page data updated event */
    static EVT_DATA_UPDATE = "yt-page-data-updated";
 
    /** @type {Element} Main YT Polymer manager */
    static YtdApp;
 
    /** @type {bool} */
    static hasInitialLoaded = false;
 
    /** @return {Promise<bool>} */
    static async isPolymer()
    {
        /** @return {Promise<void>} */
        function waitForBody() // nice hack lazy ass
        {
            return new Promise(r => {
                document.addEventListener("DOMContentLoaded", function a(){
                    document.removeEventListener("DOMContentLoaded", a);
                    r();
                });
            });
        }
 
        await waitForBody();
 
        if ("undefined" != typeof document.querySelector("ytd-app"))
        {
            this.YtdApp = document.querySelector("ytd-app");
            return true;
        }
        return false;
    }
 
    /** @async @return {Promise<void|string>} */
    static waitForInitialLoad()
    {
        var updateEvent = this.EVT_DATA_UPDATE;
        return new Promise((resolve, reject) => {
            if (!this.isPolymer())
            {
                reject("Not Polymer :(");
            }
 
            function _listenerCb()
            {
                document.removeEventListener(updateEvent, _listenerCb);
                resolve();
            }
 
            document.addEventListener(updateEvent, _listenerCb);
        });
    }
 
    /** @return {string} */
    static getPageType()
    {
        return this.YtdApp.data.page;
    }
}
 
class ShortsTools
{
    /** @type {MutationObserver} */
    static mo = new MutationObserver(muts => {
        muts.forEach(mut => {
            Array.from(mut.addedNodes).forEach(node => {
                if (node instanceof HTMLElement) {
                    this.onMutation(node);
                }
            });
        });
    });
 
    /** @return {void} */
    static watchForShorts()
    {
        /*
        this.mo.observe(YtdTools.YtdApp, {
            childList: true,
            subtree: true
        });
        */
        var me = this;
        YtdTools.YtdApp.arrive("ytd-video-renderer, ytd-grid-video-renderer", function() {
            me.onMutation(this);
 
            // This is literally the worst hack I ever wrote, but it works ig...
            (new MutationObserver(function(){
                if (me.isShortsRenderer(this))
                {
                    me.onMutation(this);
                }
            }.bind(this))).observe(this, {"subtree": true, "childList": true, "characterData": "true"});
        });
    }
 
    /** @return {void} */
    static stopWatchingForShorts()
    {
        this.mo.disconnect();
    }
 
    /**
     * @param {HTMLElement} node
     * @return {void}
     */
    static onMutation(node)
    {
        if (node.tagName.search("VIDEO-RENDERER") > -1 && this.isShortsRenderer(node))
        {
            this.transformShortsRenderer(node);
        }
    }
 
    /** @return {bool} */
    static isShortsRenderer(videoRenderer)
    {
        return "WEB_PAGE_TYPE_SHORTS" == videoRenderer?.data?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.webPageType;
    }
 
    /** @return {string} */
    static extractLengthFromA11y(videoData)
    {
        // A11y = {title} by {creator} {date} {*length*} {viewCount} - play Short
        // tho hopefully this works in more than just English
        var a11yTitle = videoData.title.accessibility.accessibilityData.label;
 
        var publishedTimeText = videoData.publishedTimeText.simpleText;
        var viewCountText = videoData.viewCountText.simpleText;
 
        var isolatedLengthStr = a11yTitle.split(publishedTimeText)[1].split(viewCountText)[0]
            .replace(/\s/g, "");
 
        var numbers = isolatedLengthStr.split(/\D/g);
 
        var string = "";
 
        // Remove all empties before iterating it
        for (var i = 0; i < numbers.length; i++)
        {
            if ("" === numbers[i])
            {
                numbers.splice(i, 1);
                i--;
            }
        }
 
        for (var i = 0; i < numbers.length; i++)
        {
            // Lazy 0 handling idc im tired
            if (1 == numbers.length)
            {
                string += "0:";
                if (1 == numbers[i].length)
                {
                    string += "0" + numbers[i];
                }
                else
                {
                    string += numbers[i];
                }
 
                break;
            }
 
            if (0 != i) string += ":";
            if (0 != i && 1 == numbers[i].length) string += "0";
            string += numbers[i];
        }
 
        return string;
    }
 
    /**
     * @param {HTMLElement} videoRenderer
     * @return {void}
     */
    static transformShortsRenderer(videoRenderer)
    {
 
        /** @type {string} */
        var originalOuterHTML = videoRenderer.outerHTML;
 
        /** @type {string} */
        var lengthText = videoRenderer.data?.lengthText?.simpleText ?? this.extractLengthFromA11y(videoRenderer.data);
 
        /** @type {string} */
        var lengthA11y = videoRenderer.data?.lengthText?.accessibility?.accessibilityData?.label ?? "";
 
        /** @type {string} */
        var originalHref = videoRenderer.data.navigationEndpoint.commandMetadata.webCommandMetadata.url;
        var href = "/watch?v=" + originalHref.replace(/\/|shorts|\?.*/g, "");
 
        var reelWatchEndpoint = videoRenderer.data.navigationEndpoint.reelWatchEndpoint;
 
        var i;
        videoRenderer.data.thumbnailOverlays.forEach((a, index) =>{
            if ("thumbnailOverlayTimeStatusRenderer" in a)
            {
                i = index;
            }
        });
 
        // Set the thumbnail overlay style
        videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.style = "DEFAULT";
 
        delete videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.icon;
 
        // Set the thumbnail overlay text
        videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.text.simpleText = lengthText;
 
        // Set the thumbnail overlay accessibility label
        videoRenderer.data.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer.text.accessibility.accessibilityData.label = lengthA11y;
 
        // Set the navigation endpoint metadata (used for middle click)
        videoRenderer.data.navigationEndpoint.commandMetadata.webCommandMetadata.webPageType = "WEB_PAGE_TYPE_WATCH";
        videoRenderer.data.navigationEndpoint.commandMetadata.webCommandMetadata.url = href;
 
        videoRenderer.data.navigationEndpoint.watchEndpoint = {
            "videoId": reelWatchEndpoint.videoId,
            "playerParams": reelWatchEndpoint.playerParams,
            "params": reelWatchEndpoint.params
        };
        delete videoRenderer.data.navigationEndpoint.reelWatchEndpoint;
 
        //var _ = videoRenderer.data; videoRenderer.data = {}; videoRenderer.data = _;
 
        // Sometimes the old school data cycle trick fails,
        // however this always works.
        var _ = videoRenderer.cloneNode();
        _.data = videoRenderer.data;
        for (var i in videoRenderer.properties)
        {
            _[i] = videoRenderer[i];
        }
        videoRenderer.insertAdjacentElement("afterend", _);
        videoRenderer.remove();
    }
}
 
/**
 * Sometimes elements are reused on page updates, so fix that
 *
 * @return {void}
 */
function onDataUpdate()
{
    var videos = document.querySelectorAll("ytd-video-renderer, ytd-grid-video-renderer");
 
    for (var i = 0, l = videos.length; i < l; i++) if (ShortsTools.isShortsRenderer(videos[i]))
    {
        ShortsTools.transformShortsRenderer(videos[i]);
    }
}
 
/**
 * I hope she makes lotsa spaghetti :D
 * @async @return {Promise<void>}
 */
async function main()
{
    // If not Polymer, nothing happens
    if (await YtdTools.isPolymer())
    {
        ShortsTools.watchForShorts();
 
        document.addEventListener("yt-page-data-updated", onDataUpdate);
    }
}
 
main();
 
})();

// Re-add Trending tab on top sidebar
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

    function restoreTrending() {

        var trendingData = {
            "navigationEndpoint": {
                "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/feed/trending",
                        "webPageType": "WEB_PAGE_TYPE_BROWSE",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": "FEtrending"
                }
            },
            "icon": {
                "iconType": "TRENDING"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "Trending"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "Trending"
                }
            },
            "isPrimary": true
        };

        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = trendingData;

        var miniguidetemplate = `<ytd-mini-guide-entry-renderer class="style-scope ytd-mini-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-mini-guide-entry-renderer:nth-child(2)`).data = trendingData;

    }


waitForElm("#items.ytd-guide-section-renderer").then((elm) => {
    restoreTrending();
});

waitForElm("#items.ytd-mini-guide-section-renderer").then((elm) => {
    restoreTrending();
});

// Restore old Comments UI
var observingComments = false;
var hl;

const cfconfig = {
    unicodeEmojis: true
};

const cfi18n = {
    en: {
        viewSingular: "View reply",
        viewMulti: "View %s replies",
        viewSingularOwner: "View reply from %s",
        viewMultiOwner: "View %s replies from %s and others",
        hideSingular: "Hide reply",
        hideMulti: "Hide replies",
        replyCountIsolator: /( REPLIES)|( REPLY)/
    }
}

/**
 * Get a string from the localization strings.
 *
 * @param {string}   string  Name of string to get
 * @param {string}   hl      Language to use.
 * @param {...array} args    Strings.
 * @returns {string}
 */
 function getString(string, hl = "en", ...args) {
    if (!string) return;
    var str;
    if (cfi18n[hl]) {
        if (cfi18n[hl][string]) {
            str = cfi18n[hl][string];
        } else if (cfi18n.en[string]) {
            str = cfi18n.en[string];
        } else {
            return;
        }
    } else {
        if (cfi18n.en[string]) str = cfi18n.en[string];
    }

    for (var i = 0; i < args.length; i++) {
        str = str.replace(/%s/, args[i]);
    }

    return str;
}

/**
 * Wait for a selector to exist
 *
 * @param {string}       selector  CSS Selector
 * @param {HTMLElement}  base      Element to search inside
 * @returns {Node}
 */
async function waitForElm(selector, base = document) {
    if (!selector) return null;
    if (!base.querySelector) return null;
    while (base.querySelector(selector) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return base.querySelector(selector);
};

/**
 * Is a value in an array?
 *
 * @param {*}     needle    Value to search
 * @param {Array} haystack  Array to search
 * @returns {boolean}
 */
 function inArray(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
        if (needle == haystack[i]) return true;
    }
    return false;
}

/**
 * Get text of an InnerTube string.
 *
 * @param {object} object  String container.
 */
function getSimpleString(object) {
    if (object.simpleText) return object.simpleText;

    var str = "";
    for (var i = 0; i < object.runs.length; i++) {
        str += object.runs[i].text;
    }
    return str;
}

/**
 * Format a commentRenderer.
 *
 * @param {object} comment  commentRenderer from InnerTube.
 */
function formatComment(comment) {
    if (cfconfig.unicodeEmojis) {
        var runs;
        try {
            runs = comment.contentText.runs
            for (var i = 0; i < runs.length; i++) {
                delete runs[i].emoji;
                delete runs[i].loggingDirectives;
            }
        } catch(err) {}
    }

    return comment;
}

/**
 * Format a commentThreadRenderer.
 *
 * @param {object} thread  commentThreadRenderer from InnerTube.
 */
async function formatCommentThread(thread) {
    if (thread.comment.commentRenderer) {
        thread.comment.commentRenderer = formatComment(thread.comment.commentRenderer);
    }

    var replies;
    try {
        replies = thread.replies.commentRepliesRenderer;
        if (replies.viewRepliesIcon) {
            replies.viewReplies.buttonRenderer.icon = replies.viewRepliesIcon.buttonRenderer.icon;
            delete replies.viewRepliesIcon;
        }

        if (replies.hideRepliesIcon) {
            replies.hideReplies.buttonRenderer.icon = replies.hideRepliesIcon.buttonRenderer.icon;
            delete replies.hideRepliesIcon;
        }

        var creatorName;
        try {
            creatorName = replies.viewRepliesCreatorThumbnail.accessibility.accessibilityData.label;
            delete replies.viewRepliesCreatorThumbnail;
        } catch(err) {}

        var replyCount = getSimpleString(replies.viewReplies.buttonRenderer.text);
        replyCount = +replyCount.replace(getString("replyCountIsolator", hl), "");

        var viewMultiString = creatorName ? "viewMultiOwner" : "viewMulti";
        var viewSingleString = creatorName ? "viewSingularOwner" : "viewSingular";

        replies.viewReplies.buttonRenderer.text = {
            runs: [
                {
                    text: (replyCount > 1) ? getString(viewMultiString, hl, replyCount, creatorName) : getString(viewSingleString, hl, creatorName)
                }
            ]
        }

        replies.hideReplies.buttonRenderer.text = {
            runs: [
                {
                    text: (replyCount > 1) ? getString("hideMulti", hl) :  getString("hideSingular", hl)
                }
            ]
        };
    } catch(err) {}

    return thread;
}

/**
 * Force Polymer to refresh data of an element.
 *
 * @param {Node} element  Element to refresh data of.
 */
function refreshData(element) {
    var clone = element.cloneNode();
    clone.data = element.data;
    // Let the script know we left our mark
    // in a way that doesn't rely on classes
    // because Polymer likes to cast comments
    // into the void for later reuse
    clone.data.fixedByCF = true;
    for (var i in element.properties) {
        clone[i] = element[i];
    }
    element.insertAdjacentElement("afterend", clone);
    element.remove();
}

var commentObserver = new MutationObserver((list) => {
    list.forEach(async (mutation) => {
        if (mutation.addedNodes) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var elm = mutation.addedNodes[i];
                if (elm.classList && elm.data && !elm.data.fixedByCF) {
                    if (elm.tagName == "YTD-COMMENT-THREAD-RENDERER") {
                        elm.data = await formatCommentThread(elm.data);
                        refreshData(elm);
                    } else if (elm.tagName == "YTD-COMMENT-RENDERER") {
                        if (!elm.classList.contains("ytd-comment-thread-renderer")) {
                            elm.data = formatComment(elm.data);
                            refreshData(elm);
                        }
                    }
                }
            }
        }
    });
});

document.addEventListener("yt-page-data-updated", async (e) => {
    hl = yt.config_.HL;
    commentObserver.observe(document.querySelector("ytd-app"),  { childList: true, subtree: true });
});

// Revert Old Icons and other adjustements including the 'Old Seek UI'
(function() {var css = [
	"/*home*/",
	"  [d*=\"m12 4.44 7 6.09V20h-4v-6H9v6H5v-9.47l7-6.09m0-1.32-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z\"] {",
	"    d: path(\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8\")",
	"  }",
	"  [d*=\"M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5h-5v-7h-3v7h-5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146ZM18.5 9.621l-6.5-6.5-6.5 6.5V19.5H9V13a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6.5h3.5V9.621Z\"] {",
	"    d: path(\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8\")",
	"  }",
	"  [d*=\"M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z\"] {",
	"    d: path(\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8\")",
	"  }",
	"  [d*=\"M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5H14v-8h-4v8H5.5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146Z\"] {",
	"    d: path(\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8\")",
	"  }",
	"/*explore*/",
	"  [d*=\"m9.8 9.8-3.83 8.23 8.23-3.83 3.83-8.23L9.8 9.8zm3.28 2.97c-.21.29-.51.48-.86.54-.07.01-.15.02-.22.02-.28 0-.54-.08-.77-.25-.29-.21-.48-.51-.54-.86-.06-.35.02-.71.23-.99.21-.29.51-.48.86-.54.35-.06.7.02.99.23.29.21.48.51.54.86.06.35-.02.7-.23.99zM12 3c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9m0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z\"] {",
	"    d: path(\"M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z\")",
	"  }",
	"  [d*=\"M9.8,9.8l-3.83,8.23l8.23-3.83l3.83-8.23L9.8,9.8z M13.08,12.77c-0.21,0.29-0.51,0.48-0.86,0.54 c-0.07,0.01-0.15,0.02-0.22,0.02c-0.28,0-0.54-0.08-0.77-0.25c-0.29-0.21-0.48-0.51-0.54-0.86c-0.06-0.35,0.02-0.71,0.23-0.99 c0.21-0.29,0.51-0.48,0.86-0.54c0.35-0.06,0.7,0.02,0.99,0.23c0.29,0.21,0.48,0.51,0.54,0.86C13.37,12.13,13.29,12.48,13.08,12.77z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2 L12,2z\"] {",
	"    d: path(\"M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z\")",
	"  }",
	"/*shorts*/",
	"  [d*=\"M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z\"] {",
	"    d: path(\"M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z\")",
	"  }",
	"  [d*=\"M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z\"] {",
	"    d: path(\"M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z\")",
	"  }",
	"  [d*=\"m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z\"] {",
	"    d: path(\"M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z\")",
	"  }",
	"  [d*=\"M18.45 8.851c1.904-1.066 2.541-3.4 1.422-5.214-1.119-1.814-3.57-2.42-5.475-1.355L5.55 7.247c-1.29.722-2.049 2.069-1.968 3.491.081 1.423.989 2.683 2.353 3.268l.942.404-1.327.742c-1.904 1.066-2.541 3.4-1.422 5.214 1.119 1.814 3.57 2.421 5.475 1.355l8.847-4.965c1.29-.722 2.049-2.068 1.968-3.49-.081-1.423-.989-2.684-2.353-3.269l-.942-.403 1.327-.743ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z\"] {",
	"    d: path(\"M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z\")",
	"  }",
	"/*subscriptions*/",
	"  [d*=\"M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z\"] {",
	"    d: path(\"M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z\")",
	"  }",
	"  [d*=\"M20 7H4V6h16v1zm2 2v12H2V9h20zm-7 6-5-3v6l5-3zm2-12H7v1h10V3z\"] {",
	"    d: path(\"M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z\")",
	"  }",
	"  [d*=\"M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z\"] {",
	"    d: path(\"M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z\")",
	"  }",
	"  [d*=\"M5.5 3A1.5 1.5 0 004 4.5h16A1.5 1.5 0 0018.5 3h-13ZM2 7.5A1.5 1.5 0 013.5 6h17A1.5 1.5 0 0122 7.5v11a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 18.5v-11Zm8 2.87a.5.5 0 01.752-.431L16 13l-5.248 3.061A.5.5 0 0110 15.63v-5.26Z\"] {",
	"    d: path(\"M18.7 8.7H5.3V7h13.4v1.7zm-1.7-5H7v1.6h10V3.7zm3.3 8.3v6.7c0 1-.7 1.6-1.6 1.6H5.3c-1 0-1.6-.7-1.6-1.6V12c0-1 .7-1.7 1.6-1.7h13.4c1 0 1.6.8 1.6 1.7zm-5 3.3l-5-2.7V18l5-2.7z\")",
	"  }",
	"/*library*/",
	"  [d*=\"m11 7 6 3.5-6 3.5V7zm7 13H4V6H3v15h15v-1zm3-2H6V3h15v15zM7 17h13V4H7v13z\"] {",
	"    d: path(\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z\")",
	"  }",
	"  [d*=\"M4 20h14v1H3V6h1v14zM21 3v15H6V3h15zm-4 7.5L11 7v7l6-3.5z\"] {",
	"    d: path(\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z\")",
	"  }",
    "/*you*/",
	"  [d*=\"M12 20.5c1.894 0 3.643-.62 5.055-1.666a5.5 5.5 0 00-10.064-.105.755.755 0 01-.054.099A8.462 8.462 0 0012 20.5Zm4.079-5.189a7 7 0 012.142 2.48 8.5 8.5 0 10-12.443 0 7 7 0 0110.3-2.48ZM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm2-12.5a2 2 0 11-4 0 2 2 0 014 0Zm1.5 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z\"] {",
	"    d: path(\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z\")",
	"  }",
	"  [d*=\"M18.37 19.709A9.98 9.98 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.98 9.98 0 003.63 7.709A9.96 9.96 0 0012 22a9.96 9.96 0 006.37-2.291ZM6.15 18.167a6.499 6.499 0 0111.7 0A8.47 8.47 0 0112 20.5a8.47 8.47 0 01-5.85-2.333ZM15.5 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z\"] {",
	"    d: path(\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z\")",
	"  }",
	"/*history*/",
	"  [d*=\"M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z\"] {",
	"    d: path(\"M11.9 3.75c-4.55 0-8.23 3.7-8.23 8.25H.92l3.57 3.57.04.13 3.7-3.7H5.5c0-3.54 2.87-6.42 6.42-6.42 3.54 0 6.4 2.88 6.4 6.42s-2.86 6.42-6.4 6.42c-1.78 0-3.38-.73-4.54-1.9l-1.3 1.3c1.5 1.5 3.55 2.43 5.83 2.43 4.58 0 8.28-3.7 8.28-8.25 0-4.56-3.7-8.25-8.26-8.25zM11 8.33v4.6l3.92 2.3.66-1.1-3.2-1.9v-3.9H11z\")",
	"  }",
	"  [d*=\"M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 2C8.73 2 5.8 3.44 4 5.83V3.02H2V9h6V7H5.62C7.08 5.09 9.36 4 12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8H2c0 5.51 4.49 10 10 10s10-4.49 10-10S17.51 2 12 2z\"] {",
	"    d: path(\"M11.9 3.75c-4.55 0-8.23 3.7-8.23 8.25H.92l3.57 3.57.04.13 3.7-3.7H5.5c0-3.54 2.87-6.42 6.42-6.42 3.54 0 6.4 2.88 6.4 6.42s-2.86 6.42-6.4 6.42c-1.78 0-3.38-.73-4.54-1.9l-1.3 1.3c1.5 1.5 3.55 2.43 5.83 2.43 4.58 0 8.28-3.7 8.28-8.25 0-4.56-3.7-8.25-8.26-8.25zM11 8.33v4.6l3.92 2.3.66-1.1-3.2-1.9v-3.9H11z\")",
	"  }",
	"  [d*=\"M14.203 4.83c-1.74-.534-3.614-.418-5.274.327-1.354.608-2.49 1.6-3.273 2.843H8.25c.414 0 .75.336.75.75s-.336.75-.75.75H3V4.25c0-.414.336-.75.75-.75s.75.336.75.75v2.775c.935-1.41 2.254-2.536 3.815-3.236 1.992-.894 4.241-1.033 6.328-.392 2.088.641 3.87 2.02 5.017 3.878 1.146 1.858 1.578 4.07 1.215 6.223-.364 2.153-1.498 4.1-3.19 5.48-1.693 1.379-3.83 2.095-6.012 2.016-2.182-.08-4.26-.949-5.849-2.447-1.588-1.499-2.578-3.523-2.784-5.697-.039-.412.264-.778.676-.817.412-.04.778.263.818.675.171 1.812.996 3.499 2.32 4.748 1.323 1.248 3.055 1.973 4.874 2.04 1.818.065 3.598-.532 5.01-1.681 1.41-1.15 2.355-2.773 2.657-4.567.303-1.794-.056-3.637-1.012-5.186-.955-1.548-2.44-2.697-4.18-3.231ZM12.75 7.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v4.886l.314.224 3.5 2.5c.337.241.806.163 1.046-.174.241-.337.163-.806-.174-1.046l-3.186-2.276V7.5Z\"] {",
	"    d: path(\"M11.9 3.75c-4.55 0-8.23 3.7-8.23 8.25H.92l3.57 3.57.04.13 3.7-3.7H5.5c0-3.54 2.87-6.42 6.42-6.42 3.54 0 6.4 2.88 6.4 6.42s-2.86 6.42-6.4 6.42c-1.78 0-3.38-.73-4.54-1.9l-1.3 1.3c1.5 1.5 3.55 2.43 5.83 2.43 4.58 0 8.28-3.7 8.28-8.25 0-4.56-3.7-8.25-8.26-8.25zM11 8.33v4.6l3.92 2.3.66-1.1-3.2-1.9v-3.9H11z\")",
	"  }",
	"/*your videos*/",
	"  [d*=\"m10 8 6 4-6 4V8zm11-5v18H3V3h18zm-1 1H4v16h16V4z\"] {",
	"    d: path(\"M18.45,3.75H5.55a1.81,1.81,0,0,0-1.8,1.8v12.8a1.8,1.8,0,0,0,1.7,1.9h12.9a1.8,1.8,0,0,0,1.9-1.69v-13A1.8,1.8,0,0,0,18.45,3.75Zm-.1,14.6H5.55V5.55h12.8Zm-3.2-6.1-5,3.2V9.05Z\")",
	"  }",
	"  [d*=\"M3.5 5.5h17v13h-17v-13ZM2 5.5C2 4.672 2.672 4 3.5 4h17c.828 0 1.5.672 1.5 1.5v13c0 .828-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.672-1.5-1.5v-13Zm7.748 2.927c-.333-.19-.748.05-.748.435v6.276c0 .384.415.625.748.434L16 12 9.748 8.427Z\"] {",
	"    d: path(\"M18.45,3.75H5.55a1.81,1.81,0,0,0-1.8,1.8v12.8a1.8,1.8,0,0,0,1.7,1.9h12.9a1.8,1.8,0,0,0,1.9-1.69v-13A1.8,1.8,0,0,0,18.45,3.75Zm-.1,14.6H5.55V5.55h12.8Zm-3.2-6.1-5,3.2V9.05Z\")",
	"  }",
	"/*watch later*/",
	"  [d*=\"M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z\"] {",
	"    d: path(\"M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z\")",
	"  }",
	"  [d*=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.97 14.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7z\"] {",
	"    d: path(\"M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z\")",
	"  }",
	"  [d*=\"M20.5 12c0 4.694-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12 7.306 3.5 12 3.5s8.5 3.806 8.5 8.5Zm1.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.25-5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v5.375l.3.225 4 3c.331.248.802.181 1.05-.15.248-.331.181-.801-.15-1.05l-3.7-2.775V7Z\"] {",
	"    d: path(\"M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z\")",
	"  }",
	"  [d*=\"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm1-15c0-.552-.448-1-1-1s-1 .448-1 1v5.5l.4.3 4 3c.442.331 1.069.242 1.4-.2.331-.442.242-1.069-.2-1.4L13 11.5V7Z\"] {",
	"    d: path(\"M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z\")",
	"  }",
	"/*playlist*/",
    "  [d*=\"M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z\"] {",
	"    d: path(\"M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z\")",
	"  }",
    "  [d*=\"M15 19v-8l7 4-7 4Zm7-12H2v2h20V7Zm-9 6H2v-2h11v2Zm0 4H2v-2h11v2Z\"] {",
	"    d: path(\"M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z\")",
	"  }",
    "  [d*=\"M3.75 5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 5 20.25 5H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 9 20.25 9H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-8.5Zm8.5 4c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h8.5Zm3.498-3.572c-.333-.191-.748.05-.748.434v6.276c0 .384.415.625.748.434L22 17l-6.252-3.572Z\"] {",
	"    d: path(\"M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z\")",
	"  }",
    "  [d*=\"M4 5c-.552 0-1 .448-1 1s.448 1 1 1h16c.552 0 1-.448 1-1s-.448-1-1-1H4Zm-1 5c0-.552.448-1 1-1h16c.552 0 1 .448 1 1s-.448 1-1 1H4c-.552 0-1-.448-1-1Zm11 3.862c0-.384.415-.625.748-.434L21 17l-6.252 3.573c-.333.19-.748-.05-.748-.435v-6.276ZM4 13c-.552 0-1 .448-1 1s.448 1 1 1h6c.552 0 1-.448 1-1s-.448-1-1-1H4Zm-1 5c0-.552.448-1 1-1h6c.552 0 1 .448 1 1s-.448 1-1 1H4c-.552 0-1-.448-1-1Z\"] {",
	"    d: path(\"M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z\")",
	"  }",
	"/*mix*/",
    "  [d*=\"M10.5 14.41V9.6l4.17 2.4-4.17 2.41zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z\"] {",
	"    d: path(\"M15,5.77,13.7,7.1a4.86,4.86,0,0,1,0,6.7L15,15.13a6.74,6.74,0,0,0,0-9.36ZM17.6,3.09,16.3,4.43a8.66,8.66,0,0,1,2.43,6,8.53,8.53,0,0,1-2.43,6l1.29,1.34a10.59,10.59,0,0,0,0-14.72ZM5.91,5.77a6.74,6.74,0,0,0,0,9.36L7.2,13.8a4.86,4.86,0,0,1,0-6.7ZM4.6,4.43,3.31,3.09a10.59,10.59,0,0,0,0,14.72l1.3-1.34a8.66,8.66,0,0,1-2.43-6A8.53,8.53,0,0,1,4.6,4.43Zm3.85,9V7.49l5.12,3Z\")",
	"  }",
	"/*browse channels*/",
    "  [d*=\"M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4v2zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z\"] {",
	"    d: path(\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z\")",
	"  }",
	"/*trending*/",
	"  [d*=\"M19,3.87v9.77C19,17.7,15.86,21,12,21c-3.86,0-7-3.3-7-7.37V13.5c0-1.06,0.22-2.13,0.62-3.09c0.5-1.19,1.29-2.21,2.27-2.97 c0.85-0.66,1.83-1.14,2.87-1.65c0.39-0.19,0.77-0.38,1.15-0.58c0.36-0.19,0.72-0.38,1.08-0.56V6v1.87l1.55-1.04L19,3.87 M20,2l-6,4 V3c-0.85,0.44-1.7,0.88-2.55,1.33c-1.41,0.74-2.9,1.34-4.17,2.32C6.15,7.52,5.26,8.7,4.7,10.02C4.24,11.11,4,12.31,4,13.5 c0,0.03,0,0.12,0,0.14C4,18.26,7.58,22,12,22c4.42,0,8-3.74,8-8.36V2L20,2z M9.45,12.89L14,10v5.7c0,1.82-1.34,3.3-3,3.3 s-3-1.47-3-3.3C8,14.51,8.58,13.47,9.45,12.89z\"] {",
	"    d: path(\"M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C8.9 6.4 7.9 10.07 9.1 13.22c.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12-.06-.05-.1-.1-.15-.17-1.1-1.43-1.28-3.48-.53-5.12C5.87 10 5 12.3 5.12 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.3 1.5-6.6l-.13-.26c-.2-.45-.47-.87-.78-1.25zm-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.38-2.2-.16-2.88-.82 1.2-.28 1.9-1.16 2.1-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.2-2.06.15.38.35.76.58 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.26z\")",
	"  }",
	"  [d*=\"M19 3.87v9.77C19 17.7 15.86 21 12 21s-7-3.3-7-7.37v-.13c0-1.06.22-2.13.62-3.09.5-1.19 1.29-2.21 2.27-2.97.85-.66 1.83-1.14 2.87-1.65.39-.19.77-.38 1.15-.58.36-.19.72-.38 1.08-.56v3.22l1.55-1.04L19 3.87M20 2l-6 4V3c-.85.44-1.7.88-2.55 1.33-1.41.74-2.9 1.34-4.17 2.32-1.13.87-2.02 2.05-2.58 3.37-.46 1.09-.7 2.29-.7 3.48v.14C4 18.26 7.58 22 12 22s8-3.74 8-8.36V2zM9.45 12.89 14 10v5.7c0 1.82-1.34 3.3-3 3.3s-3-1.47-3-3.3c0-1.19.58-2.23 1.45-2.81z\"] {",
	"    d: path(\"M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C8.9 6.4 7.9 10.07 9.1 13.22c.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12-.06-.05-.1-.1-.15-.17-1.1-1.43-1.28-3.48-.53-5.12C5.87 10 5 12.3 5.12 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.3 1.5-6.6l-.13-.26c-.2-.45-.47-.87-.78-1.25zm-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.38-2.2-.16-2.88-.82 1.2-.28 1.9-1.16 2.1-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.2-2.06.15.38.35.76.58 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.26z\")",
	"  }",
	"  [d*=\"m14 2-1.5.886-5.195 3.07C4.637 7.533 3 10.401 3 13.5c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5V1l-1.5 1-3 2L14 5V2ZM8.068 7.248l4.432-2.62v3.175l2.332-1.555L18.5 3.803V13.5c0 3.866-3.134 7-7 7s-7-3.134-7-7c0-2.568 1.357-4.946 3.568-6.252ZM9 15c0-1.226.693-2.346 1.789-2.894L15 10v5c0 1.657-1.343 3-3 3s-3-1.343-3-3Z\"] {",
	"    d: path(\"M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C8.9 6.4 7.9 10.07 9.1 13.22c.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12-.06-.05-.1-.1-.15-.17-1.1-1.43-1.28-3.48-.53-5.12C5.87 10 5 12.3 5.12 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.3 1.5-6.6l-.13-.26c-.2-.45-.47-.87-.78-1.25zm-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.38-2.2-.16-2.88-.82 1.2-.28 1.9-1.16 2.1-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.2-2.06.15.38.35.76.58 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.26z\")",
	"  }",
	"  [d*=\"M14 2 7.305 5.956C4.637 7.533 3 10.401 3 13.5c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5V1l-6 4V2ZM9 15c0-1.226.693-2.346 1.789-2.894L15 10v5c0 1.657-1.343 3-3 3s-3-1.343-3-3Z\"] {",
	"    d: path(\"M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C8.9 6.4 7.9 10.07 9.1 13.22c.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12-.06-.05-.1-.1-.15-.17-1.1-1.43-1.28-3.48-.53-5.12C5.87 10 5 12.3 5.12 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.3 1.5-6.6l-.13-.26c-.2-.45-.47-.87-.78-1.25zm-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.38-2.2-.16-2.88-.82 1.2-.28 1.9-1.16 2.1-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.2-2.06.15.38.35.76.58 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.26z\")",
	"  }",
	"/*music*/",
	"  [d*=\"M12 4v9.38c-.73-.84-1.8-1.38-3-1.38-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8h6V4h-7zM9 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm9-12h-5V5h5v2z\"] {",
	"    d: path(\"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z\")",
	"  }",
	"  [d*=\"M12 4v9.38c-.73-.84-1.8-1.38-3-1.38-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8h6V4h-7z\"] {",
	"    d: path(\"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z\")",
	"  }",
	"  [d*=\"M19 3c0-.271-.146-.521-.383-.654-.237-.133-.527-.127-.758.014l-9 5.5c-.223.136-.359.379-.359.64v7.901C8.059 16.146 7.546 16 7 16c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3v-7.08l7.5-4.583v6.064c-.441-.255-.954-.401-1.5-.401-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3Zm-1.5 13c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5Zm-9 3c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5Zm9-13.42L10 10.162V8.92l7.5-4.584V5.58Z\"] {",
	"    d: path(\"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z\")",
	"  }",
	"  [d*=\"M18.49 2.128A1 1 0 0119 3v13a3 3 0 11-2-2.83V7.784l-7 4.278V19a3 3 0 11-2-2.83V8.5a1 1 0 01.479-.853l9-5.5a1 1 0 011.01-.02Z\"] {",
	"    d: path(\"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z\")",
	"  }",
    "  [d*=\"M8 8.764V2h5v3H9v6a3 3 0 11-1-2.236Z\"] {",
	"    d: path(\"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z\")",
	"  }",
    "  [d*=\"M10.334 4.205a1.8 1.8 0 010 3.59 1.8 1.8 0 01-2.539 2.54 1.8 1.8 0 01-3.59-.001 1.8 1.8 0 01-2.538-2.539 1.8 1.8 0 010-3.59 1.8 1.8 0 012.538-2.539 1.8 1.8 0 013.59 0 1.8 1.8 0 012.539 2.539ZM6 3v2.668A1.75 1.75 0 107 7.25V4h1V3H6Z\"] {",
	"    d: path(\"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z\")",
	"  }",
	"/*movies and tv*/",
    "  [d*=\"m22.01 4.91-.5-2.96L1.64 5.19 2 8v13h20V8H3.06l18.95-3.09zM5 9l1 3h3L8 9h2l1 3h3l-1-3h2l1 3h3l-1-3h3v11H3V9h2z\"] {",
	"    d: path(\"M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z\")",
	"  }",
    "  [d*=\"m22.01 4.91-.5-2.96L1.64 5.19 2 8v13h20V8H3.06l18.95-3.09zM18 9l1 3h-3l-1-3h3zm-5 0 1 3h-3l-1-3h3zM8 9l1 3H6L5 9h3z\"] {",
	"    d: path(\"M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z\")",
	"  }",
    "  [d*=\"m3.116 5.998 16.79-2.66.157.988-16.79 2.66-.157-.988Zm-1.481.235c-.13-.819.428-1.587 1.247-1.717l16.79-2.659c.819-.13 1.587.429 1.716 1.247l.157.988.234 1.481-1.481.235L6.463 7.999H22v11.5c0 .829-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.671-1.5-1.5V8.539L1.79 7.22l-.156-.987Zm7.698 3.266h-2L9 11.999H6l-1.667-2.5H3.5v10h17v-10h-3.167L19 12h-3l-1.667-2.501h-2L14 12h-3L9.333 9.499Z\"] {",
	"    d: path(\"M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z\")",
	"  }",
    "  [d*=\"M2.882 4.515c-.819.13-1.377.898-1.247 1.717L2 8.538v10.961c0 .829.672 1.5 1.5 1.5h17c.828 0 1.5-.671 1.5-1.5v-11.5H6.456L21.78 5.572l-.39-2.47c-.13-.817-.898-1.376-1.717-1.246l-16.79 2.66ZM4 13h2.5l-2-3H4v3Zm16 0h-.5l-2-3H20v3ZM9.5 13h2l-2-3h-2l2 3Zm7 0h-2l-2-3h2l2 3Z\"] {",
	"    d: path(\"M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z\")",
	"  }",
	"/*live*/",
	"  [d*=\"M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z\"] {",
	"    d: path(\"M15.14,5.61,13.8,7a5,5,0,0,1,0,6.92l1.34,1.38a7,7,0,0,0,0-9.68Zm2.69-2.76L16.49,4.23A8.94,8.94,0,0,1,19,10.46a8.81,8.81,0,0,1-2.51,6.21l1.33,1.38a10.93,10.93,0,0,0,0-15.2ZM5.76,5.61a7,7,0,0,0,0,9.68L7.1,13.91A5,5,0,0,1,7.1,7ZM4.41,4.23,3.08,2.85a10.93,10.93,0,0,0,0,15.2l1.34-1.38A8.94,8.94,0,0,1,1.9,10.44,8.81,8.81,0,0,1,4.41,4.23Zm6,3.37A2.85,2.85,0,1,1,7.6,10.45,2.86,2.86,0,0,1,10.45,7.6Z\")",
	"  }",
	"  [d*=\"M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM6.36 6.33 4.95 4.92C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l1.41-1.41C4.9 16.22 4 14.21 4 12s.9-4.22 2.36-5.67zm12.69-1.41-1.41 1.41C19.1 7.78 20 9.79 20 12s-.9 4.22-2.36 5.67l1.41 1.41C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08zM9.19 9.16 7.77 7.75C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l1.41-1.41C8.46 14.11 8 13.11 8 12s.46-2.11 1.19-2.84zm7.04-1.41-1.41 1.41C15.54 9.89 16 10.89 16 12s-.46 2.11-1.19 2.84l1.41 1.41C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25z\"] {",
	"    d: path(\"M15.14,5.61,13.8,7a5,5,0,0,1,0,6.92l1.34,1.38a7,7,0,0,0,0-9.68Zm2.69-2.76L16.49,4.23A8.94,8.94,0,0,1,19,10.46a8.81,8.81,0,0,1-2.51,6.21l1.33,1.38a10.93,10.93,0,0,0,0-15.2ZM5.76,5.61a7,7,0,0,0,0,9.68L7.1,13.91A5,5,0,0,1,7.1,7ZM4.41,4.23,3.08,2.85a10.93,10.93,0,0,0,0,15.2l1.34-1.38A8.94,8.94,0,0,1,1.9,10.44,8.81,8.81,0,0,1,4.41,4.23Zm6,3.37A2.85,2.85,0,1,1,7.6,10.45,2.86,2.86,0,0,1,10.45,7.6Z\")",
	"  }",
	"  [d*=\"M5.636 5.636c.293-.293.293-.768 0-1.06-.293-.294-.768-.294-1.06 0-.976.974-1.75 2.132-2.277 3.406C1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.293.293.768.293 1.061 0 .293-.293.293-.768 0-1.061-.836-.836-1.499-1.828-1.95-2.92C3.232 14.352 3 13.182 3 12s.233-2.352.685-3.444c.452-1.092 1.115-2.084 1.951-2.92Zm2.828 1.768c.293.292.293.767 0 1.06-.464.464-.832 1.016-1.083 1.622C7.129 10.693 7 11.343 7 12c0 .656.13 1.306.38 1.913.252.607.62 1.158 1.084 1.622.293.293.293.768 0 1.06-.292.294-.767.294-1.06 0-.604-.603-1.083-1.32-1.41-2.108C5.669 13.7 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.293-.293.768-.293 1.06 0Zm7.072 0c.292-.293.767-.293 1.06 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.293.293-.768.293-1.06 0-.293-.293-.293-.768 0-1.06C16.473 14.597 17 13.325 17 12s-.527-2.598-1.464-3.536c-.293-.293-.293-.768 0-1.06Zm2.828-2.829c.293-.293.768-.293 1.06 0C21.395 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.293.293-.768.293-1.061 0-.293-.293-.293-.768 0-1.061C20.052 16.676 21 14.387 21 12s-.948-4.676-2.636-6.364c-.293-.293-.293-.768 0-1.06ZM12 14c1.105 0 2-.895 2-2 0-1.104-.895-2-2-2s-2 .896-2 2c0 1.105.895 2 2 2Z\"] {",
	"    d: path(\"M15.14,5.61,13.8,7a5,5,0,0,1,0,6.92l1.34,1.38a7,7,0,0,0,0-9.68Zm2.69-2.76L16.49,4.23A8.94,8.94,0,0,1,19,10.46a8.81,8.81,0,0,1-2.51,6.21l1.33,1.38a10.93,10.93,0,0,0,0-15.2ZM5.76,5.61a7,7,0,0,0,0,9.68L7.1,13.91A5,5,0,0,1,7.1,7ZM4.41,4.23,3.08,2.85a10.93,10.93,0,0,0,0,15.2l1.34-1.38A8.94,8.94,0,0,1,1.9,10.44,8.81,8.81,0,0,1,4.41,4.23Zm6,3.37A2.85,2.85,0,1,1,7.6,10.45,2.86,2.86,0,0,1,10.45,7.6Z\")",
	"  }",
	"  [d*=\"M5.99 5.99c.39-.391.39-1.024 0-1.415-.39-.39-1.024-.39-1.415 0C3.6 5.55 2.827 6.708 2.3 7.982 1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.39.39 1.024.39 1.415 0 .39-.39.39-1.024 0-1.415-.79-.789-1.416-1.726-1.843-2.757C3.72 14.222 3.5 13.116 3.5 12s.22-2.222.647-3.253C4.574 7.716 5.2 6.78 5.99 5.99Zm2.828 1.414c.39.39.39 1.023 0 1.414-.418.418-.75.914-.975 1.46-.227.546-.343 1.13-.343 1.722 0 .59.116 1.176.343 1.722.226.546.557 1.042.975 1.46.39.39.39 1.023 0 1.414-.39.39-1.024.39-1.414 0-.604-.604-1.083-1.32-1.41-2.109C5.669 13.698 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.39-.391 1.024-.391 1.414 0Zm6.364 0c.39-.391 1.024-.391 1.414 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.39.39-1.024.39-1.414 0-.39-.39-.39-1.024 0-1.414.844-.844 1.318-1.989 1.318-3.182 0-1.194-.474-2.338-1.318-3.182-.39-.39-.39-1.024 0-1.414Zm2.828-2.829c.39-.39 1.024-.39 1.415 0C21.394 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.39.39-1.024.39-1.415 0-.39-.39-.39-1.024 0-1.415 1.595-1.594 2.49-3.756 2.49-6.01s-.895-4.416-2.49-6.01c-.39-.391-.39-1.024 0-1.415ZM12 14.5c1.38 0 2.5-1.12 2.5-2.5S13.38 9.5 12 9.5 9.5 10.62 9.5 12s1.12 2.5 2.5 2.5Z\"] {",
	"    d: path(\"M15.14,5.61,13.8,7a5,5,0,0,1,0,6.92l1.34,1.38a7,7,0,0,0,0-9.68Zm2.69-2.76L16.49,4.23A8.94,8.94,0,0,1,19,10.46a8.81,8.81,0,0,1-2.51,6.21l1.33,1.38a10.93,10.93,0,0,0,0-15.2ZM5.76,5.61a7,7,0,0,0,0,9.68L7.1,13.91A5,5,0,0,1,7.1,7ZM4.41,4.23,3.08,2.85a10.93,10.93,0,0,0,0,15.2l1.34-1.38A8.94,8.94,0,0,1,1.9,10.44,8.81,8.81,0,0,1,4.41,4.23Zm6,3.37A2.85,2.85,0,1,1,7.6,10.45,2.86,2.86,0,0,1,10.45,7.6Z\")",
	"  }",
	"/*gaming*/",
	"  [d*=\"M10 12H8v2H6v-2H4v-2h2V8h2v2h2v2zm7 .5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm3-3c0-.83-.67-1.5-1.5-1.5S17 8.67 17 9.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm-3.03-4.35-4.5 2.53-.49.27-.49-.27-4.5-2.53L3 7.39v6.43l8.98 5.04 8.98-5.04V7.39l-3.99-2.24m0-1.15 4.99 2.8v7.6L11.98 20 2 14.4V6.8L6.99 4l4.99 2.8L16.97 4z\"] {",
	"    d: path(\"M22,13V8l-5-3l-5,3l0,0L7,5L2,8v5l10,6L22,13z M9,11H7v2H6v-2H4v-1h2V8h1v2h2V11z M15,13 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S15.55,13,15,13z M18,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S18.55,11,18,11z\")",
	"  }",
	"  [d*=\"m16.97 4-4.99 2.8L6.99 4 2 6.8v7.6l9.98 5.6 9.98-5.6V6.8L16.97 4zM10 12H8v2H6v-2H4v-2h2V8h2v2h2v2zm5.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 8 18.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z\"] {",
	"    d: path(\"M22,13V8l-5-3l-5,3l0,0L7,5L2,8v5l10,6L22,13z M9,11H7v2H6v-2H4v-1h2V8h1v2h2V11z M15,13 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S15.55,13,15,13z M18,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S18.55,11,18,11z\")",
	"  }",
	"  [d*=\"m12 7.75-.772-.464-4.186-2.511L2.5 7.803v6.307L12 19.29l9.5-5.181V7.803l-4.542-3.028-4.186 2.511L12 7.75ZM12 6 7.814 3.488c-.497-.298-1.122-.283-1.604.039L1.668 6.555C1.251 6.833 1 7.3 1 7.803v6.307c0 .548.3 1.054.782 1.316l9.5 5.182c.447.244.989.244 1.436 0l9.5-5.182c.482-.262.782-.768.782-1.316V7.803c0-.502-.25-.97-.668-1.248L17.79 3.527c-.482-.322-1.107-.337-1.604-.039L12 6Zm3.5 6.25c0 .69-.56 1.25-1.25 1.25S13 12.94 13 12.25 13.56 11 14.25 11s1.25.56 1.25 1.25ZM7 8c-.414 0-.75.336-.75.75v1.5h-1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.5v1.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5v-1.5C7.75 8.336 7.414 8 7 8Zm10.75 3c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z\"] {",
	"    d: path(\"M22,13V8l-5-3l-5,3l0,0L7,5L2,8v5l10,6L22,13z M9,11H7v2H6v-2H4v-1h2V8h1v2h2V11z M15,13 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S15.55,13,15,13z M18,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S18.55,11,18,11z\")",
	"  }",
	"  [d*=\"M1 7.803c0-.502.25-.97.668-1.248L6.21 3.527c.482-.322 1.107-.337 1.604-.039L12 6l4.186-2.512c.497-.298 1.122-.283 1.604.039l4.542 3.028c.417.278.668.746.668 1.248v6.307c0 .549-.3 1.054-.782 1.316l-9.5 5.182c-.447.244-.989.244-1.436 0l-9.5-5.182C1.3 15.164 1 14.658 1 14.11V7.803ZM16 12.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5Zm-9-5c-.552 0-1 .448-1 1V10H4.5c-.552 0-1 .448-1 1 0 .553.448 1 1 1H6v1.5c0 .553.448 1 1 1s1-.447 1-1V12h1.5c.552 0 1-.447 1-1 0-.552-.448-1-1-1H8V8.5c0-.552-.448-1-1-1ZM18.5 11c.828 0 1.5-.672 1.5-1.5S19.328 8 18.5 8 17 8.672 17 9.5s.672 1.5 1.5 1.5Z\"] {",
	"    d: path(\"M22,13V8l-5-3l-5,3l0,0L7,5L2,8v5l10,6L22,13z M9,11H7v2H6v-2H4v-1h2V8h1v2h2V11z M15,13 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S15.55,13,15,13z M18,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S18.55,11,18,11z\")",
	"  }",
	"/*sports*/",
	"  [d*=\"M18 5V2H6v3H3v6l3.23 1.61c.7 2.5 2.97 4.34 5.69 4.38L8 19v3h8v-3l-3.92-2.01c2.72-.04 4.99-1.88 5.69-4.38L21 11V5h-3zM6 11.38l-2-1V6h2v5.38zM15 21H9v-1.39l3-1.54 3 1.54V21zm2-10c0 2.76-2.24 5-5 5s-5-2.24-5-5V3h10v8zm3-.62-2 1V6h2v4.38z\"] {",
	"    d: path(\"M18.86,6.15V3H5.14V6.15H1V9a4.25,4.25,0,0,0,4.25,4.25h.52a6.85,6.85,0,0,0,6.21,4h0L7.89,19.62V22h8.23V19.62L12,17.24a6.84,6.84,0,0,0,5.29-2.49h0A7.15,7.15,0,0,0,18,13.66c.07-.12.12-.25.18-.38h.52A4.25,4.25,0,0,0,23,9V6.15ZM2.61,8.9V7.72H5.14v2.67a6.88,6.88,0,0,0,.13,1.29A2.79,2.79,0,0,1,2.61,8.9Zm18.78,0a2.79,2.79,0,0,1-2.66,2.78,6.88,6.88,0,0,0,.13-1.29V7.72h2.53Z\")",
	"  }",
	"  [d*=\"M18 5V2H6v3H3v6l3.23 1.61c.7 2.5 2.97 4.34 5.69 4.38L8 19v3h8v-3l-3.92-2.01c2.72-.04 4.99-1.88 5.69-4.38L21 11V5h-3zM6 11.38l-2-1V6h2v5.38zm14-1-2 1V6h2v4.38z\"] {",
	"    d: path(\"M18.86,6.15V3H5.14V6.15H1V9a4.25,4.25,0,0,0,4.25,4.25h.52a6.85,6.85,0,0,0,6.21,4h0L7.89,19.62V22h8.23V19.62L12,17.24a6.84,6.84,0,0,0,5.29-2.49h0A7.15,7.15,0,0,0,18,13.66c.07-.12.12-.25.18-.38h.52A4.25,4.25,0,0,0,23,9V6.15ZM2.61,8.9V7.72H5.14v2.67a6.88,6.88,0,0,0,.13,1.29A2.79,2.79,0,0,1,2.61,8.9Zm18.78,0a2.79,2.79,0,0,1-2.66,2.78,6.88,6.88,0,0,0,.13-1.29V7.72h2.53Z\")",
	"  }",
	"  [d*=\"M6.5 3.5h11V9c0 3.038-2.462 5.5-5.5 5.5S6.5 12.038 6.5 9V3.5ZM5 3.5C5 2.672 5.672 2 6.5 2h11c.828 0 1.5.672 1.5 1.5V4h2c.552 0 1 .448 1 1v3c0 2.493-1.825 4.56-4.212 4.938-1.082 1.588-2.8 2.707-4.788 2.991V17.5h1.5c.828 0 1.5.672 1.5 1.5v3H8v-3c0-.828.672-1.5 1.5-1.5H11v-1.57c-1.987-.285-3.706-1.404-4.788-2.992C3.825 12.56 2 10.493 2 8V5c0-.552.448-1 1-1h2v-.5Zm0 1.75H3.25V8c0 1.508.89 2.808 2.174 3.403C5.15 10.654 5 9.845 5 9V5.25Zm13.576 6.153C19.86 10.808 20.75 9.508 20.75 8V5.25H19V9c0 .844-.15 1.654-.424 2.403ZM9.5 20.5V19h5v1.5h-5Z\"] {",
	"    d: path(\"M18.86,6.15V3H5.14V6.15H1V9a4.25,4.25,0,0,0,4.25,4.25h.52a6.85,6.85,0,0,0,6.21,4h0L7.89,19.62V22h8.23V19.62L12,17.24a6.84,6.84,0,0,0,5.29-2.49h0A7.15,7.15,0,0,0,18,13.66c.07-.12.12-.25.18-.38h.52A4.25,4.25,0,0,0,23,9V6.15ZM2.61,8.9V7.72H5.14v2.67a6.88,6.88,0,0,0,.13,1.29A2.79,2.79,0,0,1,2.61,8.9Zm18.78,0a2.79,2.79,0,0,1-2.66,2.78,6.88,6.88,0,0,0,.13-1.29V7.72h2.53Z\")",
	"  }",
	"  [d*=\"M6.5 2C5.672 2 5 2.672 5 3.5V4H3c-.552 0-1 .448-1 1v3c0 2.493 1.825 4.56 4.212 4.938 1.082 1.588 2.8 2.707 4.788 2.991V18.5H9.5c-.828 0-1.5.672-1.5 1.5v2h8v-2c0-.828-.672-1.5-1.5-1.5H13v-2.57c1.988-.285 3.706-1.404 4.788-2.992C20.175 12.56 22 10.493 22 8V5c0-.552-.448-1-1-1h-2v-.5c0-.828-.672-1.5-1.5-1.5h-11ZM19 5.25V9c0 .844-.15 1.654-.424 2.403C19.86 10.808 20.75 9.508 20.75 8V5.25H19ZM5.424 11.403C5.15 10.654 5 9.845 5 9V5.25H3.25V8c0 1.508.89 2.808 2.174 3.403Z\"] {",
	"    d: path(\"M18.86,6.15V3H5.14V6.15H1V9a4.25,4.25,0,0,0,4.25,4.25h.52a6.85,6.85,0,0,0,6.21,4h0L7.89,19.62V22h8.23V19.62L12,17.24a6.84,6.84,0,0,0,5.29-2.49h0A7.15,7.15,0,0,0,18,13.66c.07-.12.12-.25.18-.38h.52A4.25,4.25,0,0,0,23,9V6.15ZM2.61,8.9V7.72H5.14v2.67a6.88,6.88,0,0,0,.13,1.29A2.79,2.79,0,0,1,2.61,8.9Zm18.78,0a2.79,2.79,0,0,1-2.66,2.78,6.88,6.88,0,0,0,.13-1.29V7.72h2.53Z\")",
	"  }",
	"/*learning*/",
	"  [d*=\"M16 21h-2.28c-.35.6-.98 1-1.72 1s-1.38-.4-1.72-1H8v-1h8v1zm4-11c0 2.96-1.61 5.54-4 6.92V19H8v-2.08C5.61 15.54 4 12.96 4 10c0-4.42 3.58-8 8-8s8 3.58 8 8zm-5 8v-1.66l.5-.29C17.66 14.8 19 12.48 19 10c0-3.86-3.14-7-7-7s-7 3.14-7 7c0 2.48 1.34 4.8 3.5 6.06l.5.28V18h6z\"] {",
	"    d: path(\"M18.45,8.45a8,8,0,0,1-4,6.92V17H12.62V10.09a1.21,1.21,0,1,0-1.28-1.36h0V17H9.59V8.73h0A1.2,1.2,0,0,0,8.38,7.68a1.21,1.21,0,0,0-.1,2.41V17H6.45V15.37a8,8,0,1,1,12-6.92Zm-12,11H8.73a2,2,0,0,0,3.44,0h2.28V18h-8Z\")",
	"  }",
	"  [d*=\"M16 21h-2.28c-.35.6-.98 1-1.72 1s-1.38-.4-1.72-1H8v-1h8v1zm4-11c0 2.96-1.61 5.54-4 6.92V19H8v-2.08C5.61 15.54 4 12.96 4 10c0-4.42 3.58-8 8-8s8 3.58 8 8z\"] {",
	"    d: path(\"M18.45,8.45a8,8,0,0,1-4,6.92V17H12.62V10.09a1.21,1.21,0,1,0-1.28-1.36h0V17H9.59V8.73h0A1.2,1.2,0,0,0,8.38,7.68a1.21,1.21,0,0,0-.1,2.41V17H6.45V15.37a8,8,0,1,1,12-6.92Zm-12,11H8.73a2,2,0,0,0,3.44,0h2.28V18h-8Z\")",
	"  }",
	"  [d*=\"m14.5 16.065.749-.434C17.196 14.505 18.5 12.404 18.5 10c0-3.59-2.91-6.5-6.5-6.5S5.5 6.41 5.5 10c0 2.404 1.304 4.505 3.251 5.631l.749.434V17.5h5v-1.435Zm1.5.865c2.391-1.383 4-3.969 4-6.93 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.961 1.609 5.546 4 6.93V19h8v-2.07ZM16 20v.5c0 .552-.448 1-1 1h-1.063c-.024.09-.053.179-.09.265-.1.243-.247.463-.433.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152s-.523-.052-.765-.152c-.243-.1-.463-.248-.65-.434-.185-.186-.332-.406-.433-.649-.036-.086-.065-.175-.088-.265H9c-.552 0-1-.448-1-1V20h8Z\"] {",
	"    d: path(\"M18.45,8.45a8,8,0,0,1-4,6.92V17H12.62V10.09a1.21,1.21,0,1,0-1.28-1.36h0V17H9.59V8.73h0A1.2,1.2,0,0,0,8.38,7.68a1.21,1.21,0,0,0-.1,2.41V17H6.45V15.37a8,8,0,1,1,12-6.92Zm-12,11H8.73a2,2,0,0,0,3.44,0h2.28V18h-8Z\")",
	"  }",
	"  [d*=\"M16 16.93c2.391-1.383 4-3.969 4-6.93 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.961 1.609 5.546 4 6.93V19h8v-2.07ZM16 20v.5c0 .552-.448 1-1 1h-1.063c-.024.09-.053.179-.09.265-.1.243-.247.463-.433.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152s-.523-.052-.765-.152c-.243-.1-.463-.248-.65-.434-.185-.186-.332-.406-.433-.649-.036-.086-.065-.175-.088-.265H9c-.552 0-1-.448-1-1V20h8Z\"] {",
	"    d: path(\"M18.45,8.45a8,8,0,0,1-4,6.92V17H12.62V10.09a1.21,1.21,0,1,0-1.28-1.36h0V17H9.59V8.73h0A1.2,1.2,0,0,0,8.38,7.68a1.21,1.21,0,0,0-.1,2.41V17H6.45V15.37a8,8,0,1,1,12-6.92Zm-12,11H8.73a2,2,0,0,0,3.44,0h2.28V18h-8Z\")",
	"  }",
	"  [d*=\"M11.271 2.689a1.5 1.5 0 011.457 0l9 5A1.5 1.5 0 0122.5 9v7a.75.75 0 01-1.5 0v-5.284l-1.5.833V17a.75.75 0 01-.741.75c-1.9.023-3.076.4-3.941.896-.71.407-1.229.895-1.817 1.448-.159.149-.322.302-.496.46a.75.75 0 01-1.046-.034l-.076-.08c-.702-.73-1.303-1.355-2.164-1.832-.875-.485-2.074-.84-3.976-.858A.75.75 0 014.5 17v-5.45l-2.228-1.24a1.5 1.5 0 010-2.622l9-5ZM6 12.383v3.891c1.703.096 2.946.468 3.946 1.022.858.475 1.508 1.07 2.08 1.652.575-.54 1.221-1.13 2.046-1.603.988-.566 2.215-.963 3.928-1.068v-3.894l-5.272 2.928a1.5 1.5 0 01-1.457 0L6 12.383ZM12 4l9 5-9 5-9-5 9-5Z\"] {",
	"    d: path(\"M18.45,8.45a8,8,0,0,1-4,6.92V17H12.62V10.09a1.21,1.21,0,1,0-1.28-1.36h0V17H9.59V8.73h0A1.2,1.2,0,0,0,8.38,7.68a1.21,1.21,0,0,0-.1,2.41V17H6.45V15.37a8,8,0,1,1,12-6.92Zm-12,11H8.73a2,2,0,0,0,3.44,0h2.28V18h-8Z\")",
	"  }",
	"/*fashion*/",
	"  [d*=\"M12.5 6.44v-.5C13.36 5.71 14 4.93 14 4c0-1.1-.9-2-2-2s-2 .9-2 2h1c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1h-.5v1.44L4 13h2v6h1v2h1v-2h2v3h1v-3h2v2h1v-2h1v-3h3v-3h2l-7.5-6.56zM6.66 12 12 7.33 17.34 12H6.66zM14 18H7v-5h7v5zm1-3v-2h2v2h-2z\"] {",
	"    d: path(\"M22.71,13.44,13.37,8.05h0V6.26h-.69V5.72A2.45,2.45,0,1,0,9.55,3.37h1.36a1.09,1.09,0,1,1,2.18,0A1.18,1.18,0,0,1,12,4.48l-.68,0V6.26h-.69V8.05L1.29,13.44a.5.5,0,0,0,.26.94H7.28v7.13h.64v1.58H9.29V21.51h1.37v1.58H12V21.51H13.4v1.58h1.38V21.51h.54V19.43h1.79v-5h5.34A.5.5,0,0,0,22.71,13.44ZM15.32,13H4.76L12,8.83,19.24,13Z\")",
	"  }",
	"  [d*=\"M12.5 6.44v-.5C13.36 5.71 14 4.93 14 4c0-1.1-.9-2-2-2s-2 .9-2 2h1c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1h-.5v1.44L4 13h2v6h1v2h1v-2h2v3h1v-3h2v2h1v-2h1v-3h3v-3h2l-7.5-6.56zM6.66 12 12 7.33 17.34 12H6.66z\"] {",
	"    d: path(\"M22.71,13.44,13.37,8.05h0V6.26h-.69V5.72A2.45,2.45,0,1,0,9.55,3.37h1.36a1.09,1.09,0,1,1,2.18,0A1.18,1.18,0,0,1,12,4.48l-.68,0V6.26h-.69V8.05L1.29,13.44a.5.5,0,0,0,.26.94H7.28v7.13h.64v1.58H9.29V21.51h1.37v1.58H12V21.51H13.4v1.58h1.38V21.51h.54V19.43h1.79v-5h5.34A.5.5,0,0,0,22.71,13.44ZM15.32,13H4.76L12,8.83,19.24,13Z\")",
	"  }",
	"  [d*=\"M11.58 2.03c.545-.078 1.1-.003 1.606.214.506.218.942.57 1.26 1.02.319.448.508.976.547 1.525.038.55-.075 1.099-.328 1.588-.252.489-.634.899-1.104 1.185-.254.154-.527.27-.81.343v.705l7.18 5.026c.267.187.383.527.284.84-.098.312-.388.524-.715.524H18v3c0 .552-.448 1-1 1h-2v3h-1v-1h-1v1h-1v-1h-1v1h-1v-1H9v1H8v-1H7v1H6v-7H4.5c-.327 0-.617-.212-.715-.524-.099-.313.017-.653.285-.84l7.18-5.026V7.25c0-.414.336-.75.75-.75.275 0 .545-.076.78-.219.235-.143.427-.348.553-.593.126-.244.183-.519.163-.793-.019-.275-.114-.539-.273-.763-.16-.225-.377-.4-.63-.51-.253-.109-.53-.146-.803-.107-.272.038-.53.151-.742.326-.213.174-.373.404-.464.664-.137.391-.564.597-.955.46-.391-.136-.598-.564-.461-.955.182-.52.503-.98.928-1.328.425-.35.939-.575 1.484-.652ZM15 15h1.5v2.5H15V15Zm2.12-1.5H6.88L12 9.915l5.12 3.585ZM7.5 15h6v4.5h-6V15Z\"] {",
	"    d: path(\"M22.71,13.44,13.37,8.05h0V6.26h-.69V5.72A2.45,2.45,0,1,0,9.55,3.37h1.36a1.09,1.09,0,1,1,2.18,0A1.18,1.18,0,0,1,12,4.48l-.68,0V6.26h-.69V8.05L1.29,13.44a.5.5,0,0,0,.26.94H7.28v7.13h.64v1.58H9.29V21.51h1.37v1.58H12V21.51H13.4v1.58h1.38V21.51h.54V19.43h1.79v-5h5.34A.5.5,0,0,0,22.71,13.44ZM15.32,13H4.76L12,8.83,19.24,13Z\")",
	"  }",
	"  [d*=\"M11.58 2.03c.545-.078 1.1-.003 1.606.214.506.218.942.57 1.26 1.02.319.448.508.976.547 1.525.038.55-.075 1.099-.328 1.588-.252.489-.634.899-1.104 1.185-.254.154-.527.27-.81.343v.705l7.18 5.026c.267.187.383.527.284.84-.098.312-.388.524-.715.524H18v3c0 .552-.448 1-1 1h-2v3h-1v-1h-1v1h-1v-1h-1v1h-1v-1H9v1H8v-1H7v1H6v-7H4.5c-.327 0-.617-.212-.715-.524-.099-.313.017-.653.285-.84l7.18-5.026V7.25c0-.414.336-.75.75-.75.275 0 .545-.076.78-.219.235-.143.427-.348.553-.593.126-.244.183-.519.163-.793-.019-.275-.114-.539-.273-.763-.16-.225-.377-.4-.63-.51-.253-.109-.53-.146-.803-.107-.272.038-.53.151-.742.326-.213.174-.373.404-.464.664-.137.391-.564.597-.955.46-.391-.136-.598-.564-.461-.955.182-.52.503-.98.928-1.328.425-.35.939-.575 1.484-.652ZM15 15h1.5v2.5H15V15Zm2.12-1.5H6.88L12 9.915l5.12 3.585Z\"] {",
	"    d: path(\"M22.71,13.44,13.37,8.05h0V6.26h-.69V5.72A2.45,2.45,0,1,0,9.55,3.37h1.36a1.09,1.09,0,1,1,2.18,0A1.18,1.18,0,0,1,12,4.48l-.68,0V6.26h-.69V8.05L1.29,13.44a.5.5,0,0,0,.26.94H7.28v7.13h.64v1.58H9.29V21.51h1.37v1.58H12V21.51H13.4v1.58h1.38V21.51h.54V19.43h1.79v-5h5.34A.5.5,0,0,0,22.71,13.44ZM15.32,13H4.76L12,8.83,19.24,13Z\")",
	"  }",
	"/*settings*/",
	"  [d*=\"M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.24h-2.44l-.55-2.2-.13-.51-.5-.18c-.6-.23-1.18-.56-1.72-.99l-.4-.32-.5.14-2.17.62-1.21-2.12 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.65-.08-.98s.03-.66.08-.98l.08-.51-.37-.36L3.6 8.56l1.22-2.11 2.17.62.5.14.4-.32c.53-.44 1.11-.77 1.72-.99l.5-.18.13-.51.54-2.21h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z\"] {",
	"    d: path(\"M18.32,10.43a6.67,6.67,0,0,0-.1-1.19L20.51,7,18.42,3.41l-3,.87a7.59,7.59,0,0,0-2.09-1.19L12.52,0H8.34L7.57,3.09A7.4,7.4,0,0,0,5.49,4.28L2.44,3.41.35,7,2.64,9.24a7.91,7.91,0,0,0,0,2.38L.35,13.84l2.09,3.61,3.05-.86a7.37,7.37,0,0,0,2.08,1.18l.77,3.09h4.18l.77-3.09a7.56,7.56,0,0,0,2.09-1.18l3,.86,2.09-3.61-2.29-2.22A6.67,6.67,0,0,0,18.32,10.43ZM10.43,14.6a4.17,4.17,0,1,1,4.17-4.17A4.17,4.17,0,0,1,10.43,14.6Z\")",
	"  }",
	"  [d*=\"M19.56 12c0-.39-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z\"] {",
	"    d: path(\"M18.32,10.43a6.67,6.67,0,0,0-.1-1.19L20.51,7,18.42,3.41l-3,.87a7.59,7.59,0,0,0-2.09-1.19L12.52,0H8.34L7.57,3.09A7.4,7.4,0,0,0,5.49,4.28L2.44,3.41.35,7,2.64,9.24a7.91,7.91,0,0,0,0,2.38L.35,13.84l2.09,3.61,3.05-.86a7.37,7.37,0,0,0,2.08,1.18l.77,3.09h4.18l.77-3.09a7.56,7.56,0,0,0,2.09-1.18l3,.86,2.09-3.61-2.29-2.22A6.67,6.67,0,0,0,18.32,10.43ZM10.43,14.6a4.17,4.17,0,1,1,4.17-4.17A4.17,4.17,0,0,1,10.43,14.6Z\")",
	"  }",
	"  [d*=\"m14.302 6.457-.668-.278L12.87 3.5h-1.737l-.766 2.68-.668.277c-.482.2-.934.463-1.344.778l-.575.44-2.706-.677-.868 1.504 1.938 2.003-.093.716c-.033.255-.05.514-.05.779 0 .264.017.524.05.779l.093.716-1.938 2.003.868 1.504 2.706-.677.575.44c.41.315.862.577 1.344.778l.668.278.766 2.679h1.737l.765-2.68.668-.277c.483-.2.934-.463 1.345-.778l.574-.44 2.706.677.869-1.504-1.938-2.003.092-.716c.033-.255.05-.514.05-.779 0-.264-.017-.524-.05-.779l-.092-.716 1.938-2.003-.869-1.504-2.706.677-.574-.44c-.41-.315-.862-.577-1.345-.778Zm4.436.214Zm-3.86-1.6-.67-2.346c-.123-.429-.516-.725-.962-.725h-2.492c-.446 0-.838.296-.961.725l-.67 2.347c-.605.251-1.17.58-1.682.972l-2.37-.593c-.433-.108-.885.084-1.108.47L2.717 8.08c-.223.386-.163.874.147 1.195l1.698 1.755c-.04.318-.062.642-.062.971 0 .329.021.653.062.97l-1.698 1.756c-.31.32-.37.809-.147 1.195l1.246 2.158c.223.386.675.578 1.109.47l2.369-.593c.512.393 1.077.72 1.681.972l.67 2.347c.124.429.516.725.962.725h2.492c.446 0 .839-.296.961-.725l.67-2.347c.605-.251 1.17-.58 1.682-.972l2.37.593c.433.108.885-.084 1.109-.47l1.245-2.158c.223-.386.163-.874-.147-1.195l-1.698-1.755c.04-.318.062-.642.062-.971 0-.329-.021-.653-.062-.97l1.698-1.756c.31-.32.37-.809.147-1.195L20.038 5.92c-.224-.386-.676-.578-1.11-.47l-2.369.593c-.512-.393-1.077-.72-1.681-.972ZM15.5 12c0 1.933-1.567 3.5-3.5 3.5S8.5 13.933 8.5 12s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5ZM14 12c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2Z\"] {",
	"    d: path(\"M18.32,10.43a6.67,6.67,0,0,0-.1-1.19L20.51,7,18.42,3.41l-3,.87a7.59,7.59,0,0,0-2.09-1.19L12.52,0H8.34L7.57,3.09A7.4,7.4,0,0,0,5.49,4.28L2.44,3.41.35,7,2.64,9.24a7.91,7.91,0,0,0,0,2.38L.35,13.84l2.09,3.61,3.05-.86a7.37,7.37,0,0,0,2.08,1.18l.77,3.09h4.18l.77-3.09a7.56,7.56,0,0,0,2.09-1.18l3,.86,2.09-3.61-2.29-2.22A6.67,6.67,0,0,0,18.32,10.43ZM10.43,14.6a4.17,4.17,0,1,1,4.17-4.17A4.17,4.17,0,0,1,10.43,14.6Z\")",
	"  }",
	"  [d*=\"M9.792 2.725A1 1 0 0110.753 2h2.492a1 1 0 01.961.725l.67 2.347c.605.251 1.17.58 1.682.972l2.37-.593a1 1 0 011.108.47l1.246 2.158a1 1 0 01-.147 1.195l-1.698 1.755a7.584 7.584 0 010 1.942l1.698 1.755a1 1 0 01.147 1.195l-1.245 2.158a1 1 0 01-1.11.47l-2.369-.593a7.494 7.494 0 01-1.681.972l-.67 2.347a1 1 0 01-.962.725h-2.492a1 1 0 01-.961-.725l-.67-2.347a7.494 7.494 0 01-1.682-.972l-2.37.593a1 1 0 01-1.108-.47L2.716 15.92a1 1 0 01.147-1.195l1.698-1.755a7.574 7.574 0 010-1.942L2.863 9.274a1 1 0 01-.147-1.195L3.962 5.92a1 1 0 011.109-.47l2.369.593a7.492 7.492 0 011.681-.972l.67-2.347ZM11.999 15a3 3 0 100-6 3 3 0 000 6Z\"] {",
	"    d: path(\"M18.32,10.43a6.67,6.67,0,0,0-.1-1.19L20.51,7,18.42,3.41l-3,.87a7.59,7.59,0,0,0-2.09-1.19L12.52,0H8.34L7.57,3.09A7.4,7.4,0,0,0,5.49,4.28L2.44,3.41.35,7,2.64,9.24a7.91,7.91,0,0,0,0,2.38L.35,13.84l2.09,3.61,3.05-.86a7.37,7.37,0,0,0,2.08,1.18l.77,3.09h4.18l.77-3.09a7.56,7.56,0,0,0,2.09-1.18l3,.86,2.09-3.61-2.29-2.22A6.67,6.67,0,0,0,18.32,10.43ZM10.43,14.6a4.17,4.17,0,1,1,4.17-4.17A4.17,4.17,0,0,1,10.43,14.6Z\")",
	"  }",
	"/*report*/",
	"  [d*=\"m13.18 4 .24 1.2.16.8H19v7h-5.18l-.24-1.2-.16-.8H6V4h7.18M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z\"] {",
	"    d: path(\"M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z\")",
	"  }",
	"  [d*=\"M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z\"] {",
	"    d: path(\"M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z\")",
	"  }",
	"  [d*=\"M4.75 3H4v18.25c0 .414.336.75.75.75s.75-.336.75-.75V14H11l.585 1.17c.254.509.774.83 1.342.83H18.5c.828 0 1.5-.672 1.5-1.5v-8c0-.828-.672-1.5-1.5-1.5H13l-.585-1.17C12.16 3.32 11.64 3 11.073 3H4.75Zm.75 9.5h6.427l.415.83.585 1.17H18.5v-8h-6.427l-.415-.83-.585-1.17H5.5v8Z\"] {",
	"    d: path(\"M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z\")",
	"  }",
	"  [d*=\"M5 3h6.073a1.5 1.5 0 011.342.83L13 5h5.5A1.5 1.5 0 0120 6.5v8a1.5 1.5 0 01-1.5 1.5h-5.573a1.5 1.5 0 01-1.342-.83L11 14H6v7a1 1 0 11-2 0V3h1Z\"] {",
	"    d: path(\"M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z\")",
	"  }",
	"/*help*/",
	"  [d*=\"M15.36 9.96c0 1.09-.67 1.67-1.31 2.24-.53.47-1.03.9-1.16 1.6l-.04.2H11.1l.03-.28c.14-1.17.8-1.76 1.47-2.27.52-.4 1.01-.77 1.01-1.49 0-.51-.23-.97-.63-1.29-.4-.31-.92-.42-1.42-.29-.59.15-1.05.67-1.19 1.34l-.05.28H8.57l.06-.42c.2-1.4 1.15-2.53 2.42-2.87 1.05-.29 2.14-.08 2.98.57.85.64 1.33 1.62 1.33 2.68zM12 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-15c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z\"] {",
	"    d: path(\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z\")",
	"  }",
	"  [d*=\"M13 14h-2v-2h2v2zm0-9h-2v6h2V5zm6-2H5v16.59l3.29-3.29.3-.3H19V3m1-1v15H9l-5 5V2h16z\"] {",
	"    d: path(\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z\")",
	"  }",
	"  [d*=\"M3.5 12c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5-3.806-8.5-8.5-8.5S3.5 7.306 3.5 12ZM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm2.245 7.505v-.003l-.003-.045c-.004-.044-.012-.114-.03-.2-.034-.174-.103-.4-.234-.619-.234-.39-.734-.883-1.978-.883s-1.744.494-1.978.883c-.131.22-.2.445-.235.62-.017.085-.025.155-.029.2l-.003.044v.004c-.004.415-.34.749-.755.749-.417 0-.755-.338-.755-.755H9h-.755v-.022l.001-.036.008-.114c.008-.092.023-.218.053-.367.058-.294.177-.694.42-1.1.517-.86 1.517-1.616 3.273-1.616 1.756 0 2.756.756 3.272 1.617.244.405.363.805.421 1.1.03.148.046.274.053.366l.008.114v.036l.001.013v.008L15 9.5h.755c0 .799-.249 1.397-.676 1.847-.374.395-.853.634-1.202.808l-.04.02c-.398.2-.646.333-.82.516-.136.143-.262.358-.262.809 0 .417-.338.755-.755.755s-.755-.338-.755-.755c0-.799.249-1.397.676-1.847.374-.395.853-.634 1.202-.808l.04-.02c.398-.2.646-.333.82-.516.135-.143.261-.356.262-.804ZM12 18.25c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z\"] {",
	"    d: path(\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z\")",
	"  }",
	"/*send feedback*/",
	"  [d*=\"m10 8 6 4-6 4V8zm11-5v18H3V3h18zm-1 1H4v16h16V4z\"] {",
	"    d: path(\"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z\")",
	"  }",
	"  [d*=\"M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z\"] {",
	"    d: path(\"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z\")",
	"  }",
	"  [d*=\"M6.379 17.5H19c.276 0 .5-.224.5-.5V5c0-.276-.224-.5-.5-.5H5c-.276 0-.5.224-.5.5v14.379l1.44-1.44.439-.439Zm-1.879 4-.033.033-.26.26-.353.353c-.315.315-.854.092-.854-.353V5c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H7l-2.5 2.5ZM12 6c.552 0 1 .448 1 1v4c0 .552-.448 1-1 1s-1-.448-1-1V7c0-.552.448-1 1-1Zm0 9.75c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z\"] {",
	"    d: path(\"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z\")",
	"  }",
	"/*hamburger*/",
    "  [d*=\"M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z\"] {",
	"    d: path(\"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z\")",
	"  }",
	"/*search icon*/",
	"  [d*=\"m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z\"] {",
	"    d: path(\"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\")",
	"  }",
	"  [d*=\"M16.296 16.996a8 8 0 11.707-.708l3.909 3.91-.707.707-3.909-3.909zM18 11a7 7 0 00-14 0 7 7 0 1014 0z\"] {",
	"    d: path(\"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\")",
	"  }",
	"/*mic icon*/",
	"  [d*=\"M12 3c-1.66 0-3 1.37-3 3.07v5.86c0 1.7 1.34 3.07 3 3.07s3-1.37 3-3.07V6.07C15 4.37 13.66 3 12 3zm6.5 9h-1c0 3.03-2.47 5.5-5.5 5.5S6.5 15.03 6.5 12h-1c0 3.24 2.39 5.93 5.5 6.41V21h2v-2.59c3.11-.48 5.5-3.17 5.5-6.41z\"] {",
	"    d: path(\"M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z\")",
	"  }",
	"/*create*/",
	"  [d*=\"M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z\"] {",
	"    d: path(\"M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z\")",
	"  }",
	"/*upload*/",
    "  [d*=\"M17 18v1H6v-1ZM6.49 9l.71.71 3.8-3.8V16h1V5.91l3.8 3.81.71-.72-5-5Z\"] {",
	"    d: path(\"M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z\")",
	"  }",
	"/*your channel*/",
	"  [d*=\"M3,3v18h18V3H3z M4.99,20c0.39-2.62,2.38-5.1,7.01-5.1s6.62,2.48,7.01,5.1H4.99z M9,10c0-1.65,1.35-3,3-3s3,1.35,3,3 c0,1.65-1.35,3-3,3S9,11.65,9,10z M12.72,13.93C14.58,13.59,16,11.96,16,10c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4 c0,1.96,1.42,3.59,3.28,3.93c-4.42,0.25-6.84,2.8-7.28,6V4h16v15.93C19.56,16.73,17.14,14.18,12.72,13.93z\"] {",
	"    d: path(\"M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z\")",
	"  }",
	"  [d*=\"M3,3v18h18V3H3z M20,20H4v-0.08c0.44-3.2,2.87-5.74,7.28-5.99C9.42,13.59,8,11.96,8,10c0-2.21,1.79-4,4-4 c2.21,0,4,1.79,4,4c0,1.96-1.42,3.59-3.28,3.93c4.41,0.25,6.84,2.8,7.28,5.99V20z\"] {",
	"    d: path(\"M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z\")",
	"  }",
	"/*creator studio*/",
	"  [d*=\"M10 9.35 15 12l-5 2.65ZM12 3a.73.73 0 00-.31.06L4.3 7.28a.79.79 0 00-.3.52v8.4a.79.79 0 00.3.52l7.39 4.22a.83.83 0 00.62 0l7.39-4.22a.79.79 0 00.3-.52V7.8a.79.79 0 00-.3-.52l-7.39-4.22A.73.73 0 0012 3m0-1a1.6 1.6 0 01.8.19l7.4 4.22A1.77 1.77 0 0121 7.8v8.4a1.77 1.77 0 01-.8 1.39l-7.4 4.22a1.78 1.78 0 01-1.6 0l-7.4-4.22A1.77 1.77 0 013 16.2V7.8a1.77 1.77 0 01.8-1.39l7.4-4.22A1.6 1.6 0 0112 2Zm0 4a.42.42 0 00-.17 0l-4.7 2.8a.59.59 0 00-.13.39v5.61a.65.65 0 00.13.37l4.7 2.8A.42.42 0 0012 18a.34.34 0 00.17 0l4.7-2.81a.56.56 0 00.13-.39V9.19a.62.62 0 00-.13-.37L12.17 6A.34.34 0 0012 6m0-1a1.44 1.44 0 01.69.17L17.39 8A1.46 1.46 0 0118 9.19v5.61a1.46 1.46 0 01-.61 1.2l-4.7 2.81A1.44 1.44 0 0112 19a1.4 1.4 0 01-.68-.17L6.62 16A1.47 1.47 0 016 14.8V9.19A1.47 1.47 0 016.62 8l4.7-2.8A1.4 1.4 0 0112 5Z\"] {",
	"    d: path(\"M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM10 15V9l5 3-5 3z\")",
	"  }",
	"/*switch account*/",
	"  [d*=\"M4 20h14v1H3V6h1v14zM6 3v15h15V3H6zm2.02 14c.36-2.13 1.93-4.1 5.48-4.1s5.12 1.97 5.48 4.1H8.02zM11 8.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0zm3.21 3.43A3.507 3.507 0 0017 8.5C17 6.57 15.43 5 13.5 5S10 6.57 10 8.5c0 1.69 1.2 3.1 2.79 3.43-3.48.26-5.4 2.42-5.78 5.07H7V4h13v13h-.01c-.38-2.65-2.31-4.81-5.78-5.07z\"] {",
	"    d: path(\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12zm-3 5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-9 8v1h12v-1c0-2-4-3.1-6-3.1S8 13 8 15z\")",
	"  }",
	"/*signout*/",
	"  [d*=\"M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z\"] {",
	"    d: path(\"M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z\")",
	"  }",
	"/*memberships*/",
	"  [d*=\"M12 3c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9m0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 7V7h-3V5h-2v2h-1c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h4v2H8v2h3v2h2v-2h1c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-4V9h6z\"] {",
	"    d: path(\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z\")",
	"  }",
	"/*your data*/",
	"  [d*=\"m12 3.06 7 3.21v4.84c0 1.3-.25 2.6-.75 3.86-.15.37-.33.76-.55 1.17-.15.27-.31.54-.48.81-1.32 2.01-3.17 3.42-5.23 3.98-2.06-.56-3.91-1.97-5.23-3.98-.17-.27-.33-.54-.48-.81-.22-.41-.4-.79-.55-1.17-.48-1.26-.73-2.56-.73-3.86V6.27l7-3.21m0-1.1L4 5.63v5.49c0 1.47.3 2.9.81 4.22.17.44.37.86.6 1.28.16.3.34.6.52.88 1.42 2.17 3.52 3.82 5.95 4.44l.12.02.12-.03c2.43-.61 4.53-2.26 5.95-4.43.19-.29.36-.58.52-.88.22-.41.43-.84.6-1.28.51-1.33.81-2.76.81-4.23V5.63l-8-3.67zm1.08 10.15c-.32-.06-.64-.11-.96-.12A2.997 2.997 0 0012 6a2.996 2.996 0 00-.12 5.99c-.32.01-.64.06-.96.12C8.64 12.58 7 14.62 7 17h10c0-2.38-1.64-4.42-3.92-4.89zM10 9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm1.12 4.09c.37-.08.64-.11.88-.11s.51.03.88.11c1.48.3 2.63 1.46 3 2.91H8.12c.37-1.45 1.52-2.61 3-2.91z\"] {",
	"    d: path(\"M12 1l9 4v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V5l9-4zM7.7 15.1A5.3 5.3 0 0 1 12 6.7a5.3 5.3 0 0 1 4.3 8.4c-.6-1.1-3-1.7-4.3-1.7-1.3 0-3.7.6-4.3 1.7zM12 8.3a2.2 2.2 0 0 0-2.2 2.2c0 1.2 1 2.2 2.2 2.2a2.2 2.2 0 0 0 2.2-2.2c0-1.2-1-2.2-2.2-2.2zm0-2.6A6.3 6.3 0 0 0 5.7 12a6.3 6.3 0 0 0 6.3 6.3 6.3 6.3 0 0 0 6.3-6.3A6.3 6.3 0 0 0 12 5.7z\")",
	"  }",
	"/*appearance light dark*/",
	"  [d*=\"M12 22C10.93 22 9.86998 21.83 8.83998 21.48L7.41998 21.01L8.83998 20.54C12.53 19.31 15 15.88 15 12C15 8.12 12.53 4.69 8.83998 3.47L7.41998 2.99L8.83998 2.52C9.86998 2.17 10.93 2 12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22ZM10.58 20.89C11.05 20.96 11.53 21 12 21C16.96 21 21 16.96 21 12C21 7.04 16.96 3 12 3C11.53 3 11.05 3.04 10.58 3.11C13.88 4.81 16 8.21 16 12C16 15.79 13.88 19.19 10.58 20.89Z\"] {",
	"    d: path(\"M8.49,3.51,12,0l3.51,3.51h5v5L24,12l-3.51,3.51v5h-5L12,24,8.49,20.49h-5v-5L0,12,3.51,8.49v-5Zm3.24,14.35A6,6,0,0,0,17.86,12a6,6,0,0,0-6.13-5.84A9.11,9.11,0,0,0,9,6.8,7.37,7.37,0,0,1,11.3,12a6.66,6.66,0,0,1-2.56,5.1A8.92,8.92,0,0,0,11.73,17.86Z\")",
	"  }",
	"/*language*/",
	"  [d*=\"M13.33 6c-1 2.42-2.22 4.65-3.57 6.52l2.98 2.94-.7.71-2.88-2.84c-.53.67-1.06 1.28-1.61 1.83l-3.19 3.19-.71-.71 3.19-3.19c.55-.55 1.08-1.16 1.6-1.83l-.16-.15c-1.11-1.09-1.97-2.44-2.49-3.9l.94-.34c.47 1.32 1.25 2.54 2.25 3.53l.05.05c1.2-1.68 2.29-3.66 3.2-5.81H2V5h6V3h1v2h7v1h-2.67zM22 21h-1l-1.49-4h-5.02L13 21h-1l4-11h2l4 11zm-2.86-5-1.86-5h-.56l-1.86 5h4.28z\"] {",
	"    d: path(\"M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z\")",
	"  }",
	"/*location*/",
	"  [d*=\"M11.99,1.98C6.46,1.98,1.98,6.47,1.98,12s4.48,10.02,10.01,10.02c5.54,0,10.03-4.49,10.03-10.02S17.53,1.98,11.99,1.98z M8.86,14.5c-0.16-0.82-0.25-1.65-0.25-2.5c0-0.87,0.09-1.72,0.26-2.55h6.27c0.17,0.83,0.26,1.68,0.26,2.55 c0,0.85-0.09,1.68-0.25,2.5H8.86z M14.89,15.5c-0.54,1.89-1.52,3.64-2.89,5.15c-1.37-1.5-2.35-3.25-2.89-5.15H14.89z M9.12,8.45 c0.54-1.87,1.52-3.61,2.88-5.1c1.36,1.49,2.34,3.22,2.88,5.1H9.12z M16.15,9.45h4.5c0.24,0.81,0.37,1.66,0.37,2.55 c0,0.87-0.13,1.71-0.36,2.5h-4.51c0.15-0.82,0.24-1.65,0.24-2.5C16.39,11.13,16.3,10.28,16.15,9.45z M20.29,8.45h-4.38 c-0.53-1.97-1.47-3.81-2.83-5.4C16.33,3.45,19.04,5.56,20.29,8.45z M10.92,3.05c-1.35,1.59-2.3,3.43-2.83,5.4H3.71 C4.95,5.55,7.67,3.44,10.92,3.05z M3.35,9.45h4.5C7.7,10.28,7.61,11.13,7.61,12c0,0.85,0.09,1.68,0.24,2.5H3.34 c-0.23-0.79-0.36-1.63-0.36-2.5C2.98,11.11,3.11,10.26,3.35,9.45z M3.69,15.5h4.39c0.52,1.99,1.48,3.85,2.84,5.45 C7.65,20.56,4.92,18.42,3.69,15.5z M13.09,20.95c1.36-1.6,2.32-3.46,2.84-5.45h4.39C19.08,18.42,16.35,20.55,13.09,20.95z\"] {",
	"    d: path(\"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z\")",
	"  }",
	"/*keyboard shortcuts*/",
	"  [d*=\"M16 16H8v-2h8v2zm0-5h-2v2h2v-2zm3 0h-2v2h2v-2zm-6 0h-2v2h2v-2zm-3 0H8v2h2v-2zm-3 0H5v2h2v-2zm9-3h-2v2h2V8zm3 0h-2v2h2V8zm-6 0h-2v2h2V8zm-3 0H8v2h2V8zM7 8H5v2h2V8zm15-3v14H2V5h20zm-1 1H3v12h18V6z\"] {",
	"    d: path(\"M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z\")",
	"  }",
	"/*add account*/",
	"  [d*=\"M13.72 11.93A4.004 4.004 0 0017 8c0-2.21-1.79-4-4-4S9 5.79 9 8c0 1.96 1.42 3.59 3.28 3.93C6.77 12.21 4 15.76 4 20h18c0-4.24-2.77-7.79-8.28-8.07zM10 8c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 4.9c5.33 0 7.56 2.99 7.94 6.1H5.06c.38-3.11 2.61-6.1 7.94-6.1zM4 12H2v-1h2V9h1v2h2v1H5v2H4v-2z\"] {",
	"    d: path(\"M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\")",
	"  }",
	"/*create post*/",
	"  [d*=\"M15.01,7.34l1.64,1.64L8.64,17H6.99v-1.64L15.01,7.34 M15.01,5.92l-9.02,9.02V18h3.06l9.02-9.02L15.01,5.92L15.01,5.92z M17.91,4.43l1.67,1.67l-0.67,0.67L17.24,5.1L17.91,4.43 M17.91,3.02L15.83,5.1l3.09,3.09L21,6.11L17.91,3.02L17.91,3.02z M21,10h-1 v10H4V4h10V3H3v18h18V10z\"] {",
	"    d: path(\"M18,10v8H6V6h8l2-2H6A2.15,2.15,0,0,0,4,6V18a2.15,2.15,0,0,0,2,2H18a2.15,2.15,0,0,0,2-2V8Z M8,14v2h2l7-7L15,7ZM19.15,6.85a.5.5,0,0,0,0-.71L17.85,4.85a.5.5,0,0,0-.71,0L16,6l2,2Z\")",
	"  }",
    "/*signin*/",
	"  [d*=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1c4.96 0 9 4.04 9 9 0 1.42-.34 2.76-.93 3.96-1.53-1.72-3.98-2.89-7.38-3.03A3.996 3.996 0 0016 9c0-2.21-1.79-4-4-4S8 6.79 8 9c0 1.97 1.43 3.6 3.31 3.93-3.4.14-5.85 1.31-7.38 3.03C3.34 14.76 3 13.42 3 12c0-4.96 4.04-9 9-9zM9 9c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm3 12c-3.16 0-5.94-1.64-7.55-4.12C6.01 14.93 8.61 13.9 12 13.9c3.39 0 5.99 1.03 7.55 2.98C17.94 19.36 15.16 21 12 21z\"] {",
	"    d: path(\"M12,0 C18.62375,0 24,5.37625 24,12 C24,18.62375 18.62375,24 12,24 C5.37625,24 0,18.62375 0,12 C0,5.37625 5.37625,0 12,0 Z M12,10.63625 C13.66,10.63625 15,9.29625 15,7.63625 C15,5.97625 13.66,4.63625 12,4.63625 C10.34,4.63625 9,5.97625 9,7.63625 C9,9.29625 10.34,10.63625 12,10.63625 Z M12,12.40875 C8.33375,12.40875 5.455,14.18125 5.455,15.8175 C6.84125,17.95 9.26875,19.3625 12,19.3625 C14.73125,19.3625 17.15875,17.95 18.545,15.8175 C18.545,14.18125 15.66625,12.40875 12,12.40875 Z\")",
	"  }",
	"/*clear history*/",
    "  [d*=\"M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z\"] {",
	"    d: path(\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\")",
	"  }",
	"/*pause history*/",
    "  [d*=\"M11,16H9V8h2V16z M15,8h-2v8h2V8z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12 s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z\"] {",
	"    d: path(\"M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z\")",
	"  }",
    "/*resume history*/",
    "  [d*=\"M10 8v8l6-4-6-4Zm2-5c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9Zm0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z\"] {",
	"    d: path(\"M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM9.5,16.93V7.07L16.9,12Z\")",
	"  }",
	"/*share*/",
	"  [d*=\"M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z\"] {",
	"    d: path(\"M14 9V3L22 12L14 21V15C8.44 15 4.78 17.03 2 21C3.11 15.33 6.22 10.13 14 9Z\")",
	"  }",
	"  [d*=\"M15,5.63L20.66,12L15,18.37V15v-1h-1c-3.96,0-7.14,1-9.75,3.09c1.84-4.07,5.11-6.4,9.89-7.1L15,9.86V9V5.63 M14,3v6 C6.22,10.13,3.11,15.33,2,21c2.78-3.97,6.44-6,12-6v6l8-9L14,3L14,3z\"] {",
	"    d: path(\"M14 9V3L22 12L14 21V15C8.44 15 4.78 17.03 2 21C3.11 15.33 6.22 10.13 14 9Z\")",
	"  }",
	"/*download*/",
	"  [d*=\"M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z\"] {",
	"    d: path(\"M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z\")",
	"  }",
	"/*save (new)*/",
	"  [d*=\"M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z\"] {",
	"    d: path(\"M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z\")",
	"  }",
	"/*save (old)*/",
	"  [d*=\"M18 4v15.06l-5.42-3.87-.58-.42-.58.42L6 19.06V4h12m1-1H5v18l7-5 7 5V3z\"] {",
	"    d: path(\"M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z\")",
	"  }",
	"/*show translate*/",
	"  [d*=\"M5,11h2v2H5V11z M15,15H5v2h10V15z M19,15h-2v2h2V15z M19,11H9v2h10V11z M22,6H2v14h20V6z M3,7h18v12H3V7z\"] {",
	"    d: path(\"M.45,3.45v14h20v-14Zm3,5h2v2h-2Zm10,6h-10v-2h10Zm4,0h-2v-2h2Zm0-4h-10v-2h10Z\")",
	"  }",
	"/*3 dots*/",
	"  [d*=\"M7.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm4.5-1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm6 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z\"] {",
	"    d: path(\"M5.45,10.45a2,2,0,1,1-2-2A2,2,0,0,1,5.45,10.45Zm5-2a2,2,0,1,0,2,2A2,2,0,0,0,10.45,8.45Zm7,0a2,2,0,1,0,2,2A2,2,0,0,0,17.45,8.45Z\")",
	"  }",
	"  [d*=\"M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z\"] {",
	"    d: path(\"M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z\")",
	"  }",
	"/*like*/",
    "  [d*=\"M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z\"] {",
	"    d: path(\"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z\")",
	"  }",
	"  [d*=\"M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z\"] {",
	"    d: path(\"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z\")",
	"  }",
    "  [d*=\"M14.813 5.018 14.41 6.5 14 8h5.192c.826 0 1.609.376 2.125 1.022.711.888.794 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H5c-1.105 0-2-.895-2-2v-8c0-1.105.895-2 2-2h2v.282c0-.834.26-1.647.745-2.325L12 1l1.1.472c1.376.59 2.107 2.103 1.713 3.546ZM7 10.5H5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5h2v-9Zm10.5 9h-9V9.282c0-.521.163-1.03.466-1.453l3.553-4.975c.682.298 1.043 1.051.847 1.77l-.813 2.981c-.123.451-.029.934.255 1.305.284.372.725.59 1.192.59h5.192c.37 0 .722.169.954.459.32.399.357.954.094 1.393l-.526.876c-.241.402-.28.894-.107 1.33l.165.412c.324.81.203 1.73-.32 2.428l-.152.202c-.195.26-.3.575-.3.9v.5c0 .828-.672 1.5-1.5 1.5Z\"] {",
	"    d: path(\"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z\")",
	"  }",
    "  [d*=\"M8 21V9.282a4 4 0 01.745-2.325L13 1l.551.33a3 3 0 011.351 3.363L14 8h5.192a2.722 2.722 0 012.334 4.123L21 13l.165.413a4 4 0 01-.514 3.885l-.151.202v.5a3 3 0 01-3 3H8ZM4.5 9A1.5 1.5 0 003 10.5v9A1.5 1.5 0 004.5 21H7V9H4.5Z\"] {",
	"    d: path(\"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z\")",
	"  }",
    "  [d*=\"M12.42,14A1.54,1.54,0,0,0,14,12.87l1-4.24C15.12,7.76,15,7,14,7H10l1.48-3.54A1.17,1.17,0,0,0,10.24,2a1.49,1.49,0,0,0-1.08.46L5,7H1v7ZM9.89,3.14A.48.48,0,0,1,10.24,3a.29.29,0,0,1,.23.09S9,6.61,9,6.61L8.46,8H14c0,.08-1,4.65-1,4.65a.58.58,0,0,1-.58.35H6V7.39ZM2,8H5v5H2Z\"] {",
	"    d: path(\"M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z\");",
	"		transform: scale(0.67)",
	"  }",
	"/*dislike*/",
    "  [d*=\"M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z\"] {",
	"    d: path(\"M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z\")",
	"  }",
    "  [d*=\"M18,4h3v10h-3V4z M5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21c0.58,0,1.14-0.24,1.52-0.65L17,14V4H6.57 C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14z\"] {",
	"    d: path(\"M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z\")",
	"  }",
    "  [d*=\"M3.54,2A1.55,1.55,0,0,0,2,3.13L1,7.37C.83,8.24,1,9,2,9H6L4.52,12.54A1.17,1.17,0,0,0,5.71,14a1.49,1.49,0,0,0,1.09-.46L11,9h4V2ZM6.07,12.86a.51.51,0,0,1-.36.14.28.28,0,0,1-.22-.09l0-.05L6.92,9.39,7.5,8H2a1.5,1.5,0,0,1,0-.41L3,3.35A.58.58,0,0,1,3.54,3H10V8.61ZM14,8H11l0-5h3Z\"] {",
	"    d: path(\"M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z\");",
	"		transform: scale(0.67)",
	"  }",
	"/*clip*/",
	"  [d*=\"M8 7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-1 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3.79-7.77L21 18.44V20h-3.27l-5.76-5.76-1.27 1.27c.19.46.3.96.3 1.49 0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.42 0 .81.08 1.19.2l1.37-1.37-1.11-1.11C8 10.89 7.51 11 7 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 .43-.09.84-.21 1.23zm-.71.71-.43-.44.19-.58c.11-.34.16-.64.16-.92 0-1.65-1.35-3-3-3S4 5.35 4 7s1.35 3 3 3c.36 0 .73-.07 1.09-.21l.61-.24.46.46 1.11 1.11.71.71-.71.71-1.37 1.37-.43.43-.58-.18C7.55 14.05 7.27 14 7 14c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3c0-.38-.07-.75-.22-1.12l-.25-.61.47-.47 1.27-1.27.71-.71.71.71L18.15 19H20v-.15l-9.92-9.91zM17.73 4H21v1.56l-5.52 5.52-2.41-2.41L17.73 4zm.42 1-3.67 3.67 1 1L20 5.15V5h-1.85z\"] {",
	"    d: path(\"M9.64,7.64A3.9,3.9,0,0,0,10,6a4,4,0,1,0-4,4,3.9,3.9,0,0,0,1.64-.36L10,12,7.64,14.36A3.9,3.9,0,0,0,6,14a4,4,0,1,0,4,4,3.9,3.9,0,0,0-.36-1.64L12,14l7,7h3V20ZM6,8A2,2,0,1,1,8,6,2,2,0,0,1,6,8ZM6,20a2,2,0,1,1,2-2A2,2,0,0,1,6,20Zm6-7.5a.5.5,0,1,1,.5-.5A.5.5,0,0,1,12,12.5ZM19,3,13,9l2,2,7-7V3Z\")",
	"  }",
	"  [d*=\"m8.042 9.456-.716.08c-.732.08-1.486-.16-2.043-.718-.977-.976-.977-2.559 0-3.535.976-.977 2.559-.977 3.535 0 .558.557.798 1.312.717 2.044l-.079.715.51.51 10.13 10.13c-.97.643-2.291.537-3.146-.318l-4.951-4.951-1.061 1.06 4.951 4.952c1.442 1.442 3.712 1.553 5.282.331.13-.1.255-.212.375-.331l.707-.707-1.06-1.061L15.534 12l5.657-5.657 1.06-1.06-.706-.708c-.12-.12-.245-.23-.376-.331-1.569-1.222-3.839-1.111-5.281.331L13.06 7.404l1.061 1.06 2.829-2.828c.855-.855 2.175-.961 3.146-.318l-4.56 4.56 1.06 1.061L15.536 12l-4.51-4.51c.128-1.164-.254-2.375-1.147-3.268-1.562-1.562-4.095-1.562-5.657 0-1.562 1.562-1.562 4.095 0 5.657.893.893 2.104 1.276 3.269 1.147l2.033 2.033 1.06-1.06-2.033-2.033-.509-.51Zm-.285-3.113c-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.024 0 1.415.39.39 1.024.39 1.414 0 .39-.391.39-1.024 0-1.415Zm-.43 8.122.715.079.51-.51.973-.973L8.465 12l-.975.974c-1.165-.128-2.375.254-3.268 1.147-1.562 1.562-1.562 4.095 0 5.657 1.562 1.562 4.094 1.562 5.657 0 .893-.893 1.275-2.104 1.147-3.269l.974-.973-1.06-1.061-.975.974-.509.509.079.716c.08.732-.16 1.486-.717 2.044-.976.976-2.56.976-3.536 0-.976-.977-.976-2.56 0-3.536.558-.558 1.312-.798 2.044-.717Zm-.984 3.192c.39.39 1.024.39 1.414 0 .39-.39.39-1.024 0-1.414-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.023 0 1.414Z\"] {",
	"    d: path(\"M9.64,7.64A3.9,3.9,0,0,0,10,6a4,4,0,1,0-4,4,3.9,3.9,0,0,0,1.64-.36L10,12,7.64,14.36A3.9,3.9,0,0,0,6,14a4,4,0,1,0,4,4,3.9,3.9,0,0,0-.36-1.64L12,14l7,7h3V20ZM6,8A2,2,0,1,1,8,6,2,2,0,0,1,6,8ZM6,20a2,2,0,1,1,2-2A2,2,0,0,1,6,20Zm6-7.5a.5.5,0,1,1,.5-.5A.5.5,0,0,1,12,12.5ZM19,3,13,9l2,2,7-7V3Z\")",
	"  }",
	"  [d*=\"M21.9 19.071c-1.563 1.562-4.095 1.562-5.657 0l-4.4-4.4-.994.995c.468 1.394.147 2.995-.964 4.105-1.562 1.562-4.094 1.562-5.656 0-1.563-1.562-1.563-4.095 0-5.657.98-.98 2.342-1.345 3.608-1.095l1.177-1.177-.928-.927c-1.334.356-2.817.01-3.864-1.036-1.562-1.562-1.562-4.095 0-5.657 1.562-1.562 4.094-1.562 5.657 0 1.046 1.047 1.392 2.53 1.035 3.865l.928.927.002-.002 2.83 2.83-.002.002 7.227 7.227ZM8.5 7c0-.828-.672-1.5-1.5-1.5-.829 0-1.5.672-1.5 1.5 0 .829.671 1.5 1.5 1.5.828 0 1.5-.671 1.5-1.5Zm7.584-2.228c1.563-1.562 4.097-1.56 5.659.001l-6.007 6.007-2.83-2.83 3.178-3.178ZM8.507 16.993c0 .828-.672 1.5-1.5 1.5-.829 0-1.5-.672-1.5-1.5 0-.829.671-1.5 1.5-1.5.828 0 1.5.671 1.5 1.5Z\"] {",
	"    d: path(\"M9.64,7.64A3.9,3.9,0,0,0,10,6a4,4,0,1,0-4,4,3.9,3.9,0,0,0,1.64-.36L10,12,7.64,14.36A3.9,3.9,0,0,0,6,14a4,4,0,1,0,4,4,3.9,3.9,0,0,0-.36-1.64L12,14l7,7h3V20ZM6,8A2,2,0,1,1,8,6,2,2,0,0,1,6,8ZM6,20a2,2,0,1,1,2-2A2,2,0,0,1,6,20Zm6-7.5a.5.5,0,1,1,.5-.5A.5.5,0,0,1,12,12.5ZM19,3,13,9l2,2,7-7V3Z\")",
	"  }",
	"/*thanks*/",
	"  [d*=\"M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm5.5-15c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2zm-3.75 17.85-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3 19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86z\"] {",
	"    d: path(\"M21.8,6.9c-0.2-0.7-0.5-1.4-1.1-2c-0.5-0.6-1.2-1.1-2-1.4C18,3.2,17.2,3,16.3,3c-0.8,0-1.7,0.2-2.4,0.6 C13.2,3.9,12.5,4.4,12,5c-0.5-0.6-1.2-1.1-1.9-1.5C9.3,3.2,8.5,3,7.7,3C6.8,3,6,3.2,5.2,3.5c-0.8,0.3-1.4,0.8-2,1.4 c-0.5,0.5-0.9,1.2-1.1,2C0.8,11.9,5.5,18,12,22C18.5,18,23.2,11.9,21.8,6.9z M15,10h-4.5v1.5H14c0.5,0,1,0.5,1,1V15c0,0.5-0.5,1-1,1 h-1v1.5h-2V16h-1c-0.5,0-1-0.5-1-1v-0.5h4.5V13H10c-0.5,0-1-0.5-1-1V9.5c0-0.5,0.5-1,1-1h1V7h2v1.5h1c0.5,0,1,0.5,1,1V10z\")",
	"  }",
	"/*show transcript*/",
	"  [d*=\"M5 11h2v2H5v-2zm10 4H5v2h10v-2zm4 0h-2v2h2v-2zm0-4H9v2h10v-2zm3-5H2v14h20V6zM3 7h18v12H3V7z\"] {",
	"    d: path(\"M.45,3.45v14h20v-14Zm3,5h2v2h-2Zm10,6h-10v-2h10Zm4,0h-2v-2h2Zm0-4h-10v-2h10Z\")",
	"  }",
	"/*add to queue*/",
    "  [d*=\"M21 16h-7v-1h7v1zm0-5H9v1h12v-1zm0-4H3v1h18V7zm-11 8-7-4v8l7-4z\"] {",
	"    d: path(\"M9,10 L18,10 L18,12 L9,12 L9,10 Z M6,6 L18,6 L18,8 L6,8 L6,6 Z M12,14 L18,14 L18,16 L12,16 L12,14 Z M6,12 L6,18 L10,15 L6,12 Z\")",
	"  }",
	"/*not interested*/",
    "  [d*=\"M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM3 12c0 2.31.87 4.41 2.29 6L18 5.29C16.41 3.87 14.31 3 12 3c-4.97 0-9 4.03-9 9zm15.71-6L6 18.71C7.59 20.13 9.69 21 12 21c4.97 0 9-4.03 9-9 0-2.31-.87-4.41-2.29-6z\"] {",
	"    d: path(\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z\")",
	"  }",
	"/*don't recommend channel*/",
    "  [d*=\"M12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm7 11H5v-2h14v2z\"] {",
	"    d: path(\"M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\")",
	"  }",
	"/*add videos*/",
    "  [d*=\"M20 12h-8v8h-1v-8H3v-1h8V3h1v8h8v1z\"] {",
	"    d: path(\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\")",
	"  }",
	"/*collaborate*/",
    "  [d*=\"M14 20c0-2.21 1.79-4 4-4s4 1.79 4 4h-8zm4-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-3-8c0-2.21-1.79-4-4-4S7 5.79 7 8c0 1.96 1.42 3.59 3.28 3.93C4.77 12.21 2 15.76 2 20h10.02L12 19H3.06c.38-3.11 2.61-6.1 7.94-6.1.62 0 1.19.05 1.73.13l.84-.84c-.58-.13-1.19-.23-1.85-.26A4.004 4.004 0 0015 8zm-4 3c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z\"] {",
	"    d: path(\"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z\")",
	"  }",
	"/*move to top*/",
    "  [d*=\"M7 5L7 4L18 4L18 5L7 5ZM7.5 11.6L8.2 12.3L12 8.6L12 19L13 19L13 8.6L16.8 12.4L17.5 11.7L12.5 6.7L7.5 11.6Z\"] {",
	"    d: path(\"M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z\")",
	"  }",
	"/*set as playlist thumbnail*/",
    "  [d*=\"M14.04 13.61 16.86 17H11.5l.3-.4 2.24-2.99m-5.11 1.08 1.24 1.86.3.45H7.08l1.85-2.31M14 12l-3 4-2-3-4 5h14l-5-6zm6-8v16H4V4h16m1-1H3v18h18V3z\"] {",
	"    d: path(\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\")",
	"  }",
    "/*eye*/",
    "  [d*=\"M12 8.91c1.7 0 3.09 1.39 3.09 3.09S13.7 15.09 12 15.09 8.91 13.7 8.91 12 10.3 8.91 12 8.91m0-1c-2.25 0-4.09 1.84-4.09 4.09s1.84 4.09 4.09 4.09 4.09-1.84 4.09-4.09S14.25 7.91 12 7.91zm0-1.73c3.9 0 7.35 2.27 8.92 5.82-1.56 3.55-5.02 5.82-8.92 5.82-3.9 0-7.35-2.27-8.92-5.82C4.65 8.45 8.1 6.18 12 6.18m0-1C7.45 5.18 3.57 8.01 2 12c1.57 3.99 5.45 6.82 10 6.82s8.43-2.83 10-6.82c-1.57-3.99-5.45-6.82-10-6.82z\"] {",
	"    d: path(\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\")",
	"  }",
    "  [d*=\"m3.85 3.15-.7.7L6.19 6.9C4.31 8.11 2.83 9.89 2 12c1.57 3.99 5.45 6.82 10 6.82 1.77 0 3.44-.43 4.92-1.2l3.23 3.23.71-.71L3.85 3.15zM13.8 14.5c-.51.37-1.13.59-1.8.59-1.7 0-3.09-1.39-3.09-3.09 0-.67.22-1.29.59-1.8l4.3 4.3zM12 17.82c-3.9 0-7.35-2.27-8.92-5.82.82-1.87 2.18-3.36 3.83-4.38L8.79 9.5c-.54.69-.88 1.56-.88 2.5 0 2.25 1.84 4.09 4.09 4.09.95 0 1.81-.34 2.5-.88l1.67 1.67c-1.27.61-2.69.94-4.17.94zm-.51-9.87c.17-.02.34-.05.51-.05 2.25 0 4.09 1.84 4.09 4.09 0 .17-.02.34-.05.51l-1.01-1.01c-.21-1.31-1.24-2.33-2.55-2.55l-.99-.99zM9.12 5.59c.92-.26 1.88-.41 2.88-.41 4.55 0 8.43 2.83 10 6.82-.58 1.47-1.48 2.78-2.61 3.85l-.72-.72c.93-.87 1.71-1.92 2.25-3.13C19.35 8.45 15.9 6.18 12 6.18c-.7 0-1.39.08-2.06.22l-.82-.81z\"] {",
	"    d: path(\"M9.94,6.4,8.39,4.85a10.07,10.07,0,0,1,2.06-.22,9.7,9.7,0,0,1,8.92,5.82,9.71,9.71,0,0,1-2.25,3.13L14.49,11a2.94,2.94,0,0,0,0-.51,4.1,4.1,0,0,0-4.09-4.09A4.4,4.4,0,0,0,9.94,6.4Zm1,1,2.55,2.55A3.09,3.09,0,0,0,10.93,7.39Zm7.34,12.24-4.11-4.11a9.6,9.6,0,0,1-3.71.75,9.7,9.7,0,0,1-8.92-5.82A9.72,9.72,0,0,1,5,6.33L1.29,2.61,2.7,1.2l17,17Zm-5.71-5.71-.71-.72a3,3,0,0,1-1.4.34,3.1,3.1,0,0,1-3.09-3.09,3.14,3.14,0,0,1,.34-1.4L7,8.33a4,4,0,0,0-.63,2.12,4.1,4.1,0,0,0,4.09,4.09A4,4,0,0,0,12.56,13.92Z\")",
	"  }",
	"/*public*/",
    "  [d*=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM3 12c0-.7.09-1.37.24-2.02L8 14.71v.79c0 1.76 1.31 3.22 3 3.46v1.98c-4.49-.5-8-4.32-8-8.94zm8.5 6C10.12 18 9 16.88 9 15.5v-1.21l-5.43-5.4C4.84 5.46 8.13 3 12 3c1.05 0 2.06.19 3 .53V5c0 .55-.45 1-1 1h-3v2c0 .55-.45 1-1 1H8v3h6c.55 0 1 .45 1 1v4h2c.55 0 1 .45 1 1v.69C16.41 20.12 14.31 21 12 21v-3h-.5zm7.47-.31C18.82 16.73 18 16 17 16h-1v-3c0-1.1-.9-2-2-2H9v-1h1c1.1 0 2-.9 2-2V7h2c1.1 0 2-.9 2-2V3.95c2.96 1.48 5 4.53 5 8.05 0 2.16-.76 4.14-2.03 5.69z\"] {",
	"    d: path(\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z\")",
	"  }",
	"/*unlisted*/",
    "  [d*=\"M17.78 16H13v-1h4.78c1.8 0 3.26-1.57 3.26-3.5S19.58 8 17.78 8H13V7h4.78c2.35 0 4.26 2.02 4.26 4.5S20.13 16 17.78 16zM11 15H6.19c-1.8 0-3.26-1.57-3.26-3.5S4.39 8 6.19 8H11V7H6.19c-2.35 0-4.26 2.02-4.26 4.5S3.84 16 6.19 16H11v-1zm5-4H8v1h8v-1z\"] {",
	"    d: path(\"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z\")",
	"  }",
	"/*private*/",
    "  [d*=\"M17 8V6.63C17 4.08 14.76 2 12 2S7 4.08 7 6.63V8H4v14h16V8h-3zM8 6.63c0-2.02 1.79-3.66 4-3.66s4 1.64 4 3.66V8H8V6.63zM19 21H5V9h14v12zm-7-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z\"] {",
	"    d: path(\"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z\")",
	"  }",
	"/*verified*/",
    "  [d*=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z\"] {",
	"    d: path(\"M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10 S17.52,2,12,2z M9.92,17.93l-4.95-4.95l2.05-2.05l2.9,2.9l7.35-7.35l2.05,2.05L9.92,17.93z\")",
	"  }",
    "  [d*=\"m9.8 17.3-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5zM12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9m0-1c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z\"] {",
	"    d: path(\"M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10 S17.52,2,12,2z M9.92,17.93l-4.95-4.95l2.05-2.05l2.9,2.9l7.35-7.35l2.05,2.05L9.92,17.93z\")",
	"  }",
    "  [d*=\"m9 18.7-5.4-5.4.7-.7L9 17.3 20.6 5.6l.7.7L9 18.7z\"] {",
	"    d: path(\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\")",
	"  }",
	"/*heart*/",
    "  [d*=\"M16.5 2c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2Z\"] {",
	"    d: path(\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\")",
	"  }",
    "  [d*=\"M16.5 3C19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86l-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3Zm0-1c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2Z\"] {",
	"    d: path(\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\")",
	"  }",
	"/*pinned*/",
    "  [d*=\"M16 11V3h1V2H7v1h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2zm1 3H7v-.59l1.71-1.71.29-.29V3h6v8.41l.29.29L17 13.41V14z\"] {",
	"    d: path(\"M16 5h.99L17 3H7v2h1v7l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2V5z\")",
	"  }",
	"/*location*/",
    "  [d*=\"M12 3c3.31 0 6 2.69 6 6 0 3.83-4.25 9.36-6 11.47C9.82 17.86 6 12.54 6 9c0-3.31 2.69-6 6-6m0-1C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-1c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"] {",
	"    d: path(\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\")",
	"  }",
	"/*bell notification*/",
	"  [d*=\"M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z\"] {",
	"    d: path(\"M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z\")",
	"  }",
    "  [d*=\"M21.5 9h-2v-.19c0-1.91-1.11-3.62-2.9-4.48l.87-1.8c2.49 1.19 4.03 3.6 4.03 6.28V9zm-17-.19c0-1.91 1.11-3.62 2.9-4.48l-.87-1.8C4.04 3.72 2.5 6.13 2.5 8.81V9h2v-.19zM12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm8-4.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87z\"] {",
	"    d: path(\"M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z\")",
	"  }",
    "  [d*=\"m3.85 3.15-.7.7 3.48 3.48C6.22 8.21 6 9.22 6 10.32v5.15l-2 1.88V19h14.29l1.85 1.85.71-.71-17-16.99zM5 18v-.23l2-1.88v-5.47c0-.85.15-1.62.41-2.3L17.29 18H5zm5 2h4c0 1.1-.9 2-2 2s-2-.9-2-2zM9.28 5.75l-.7-.7c.43-.29.9-.54 1.42-.7v-.39c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v4.14l-1-1v-3.05c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03-.27.11-.51.24-.75.4z\"] {",
	"    d: path(\"M12.1,21.5 C11,21.5 10.1,20.6 10.1,19.5 L14.1,19.5 C14.1,20.6 13.2,21.5 12.1,21.5 Z M17.8493827,18.5 L4.1,18.5 L4.1,17.5 L6.1,15.5 L6.1,10.5 C6.1,9.28787069 6.34383266,8.14803693 6.80191317,7.17284768 L4,4.3 L5.3,3 L8.39345122,6.17176644 C8.80987992,6.58774655 9.3,7.1 9.3,7.1 L21.1,19.2 L19.8,20.5 L17.8493827,18.5 Z M8.37723023,8.78804618 C8.20156515,9.32818052 8.1,9.91409026 8.1,10.5 L8.1,16.5 L15.8987654,16.5 L8.37723023,8.78804618 Z M18.1,13.7 L16.1,11.6 L16.1,10.5 C16.1,8 14.6,6 12.1,6 C11.6,6 11.2,6.1 10.8,6.2 L9.3,4.7 C9.7,4.5 10.1,4.3 10.6,4.2 L10.6,3.5 C10.6,2.7 11.3,2 12.1,2 C12.9,2 13.6,2.7 13.6,3.5 L13.6,4.2 C16.5,4.9 18.1,7.4 18.1,10.5 L18.1,13.7 Z\")",
	"  }",
	"/*arrow icons*/",
    "  [d*=\"m9.4 18.4-.7-.7 5.6-5.6-5.7-5.7.7-.7 6.4 6.4-6.3 6.3z\"] {",
	"    d: path(\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\")",
	"  }",
    "  [d*=\"M14.96 18.96 8 12l6.96-6.96.71.71L9.41 12l6.25 6.25-.7.71z\"] {",
	"    d: path(\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\")",
	"  }",
    "  [d*=\"M18.4 14.6 12 8.3l-6.4 6.3.8.8L12 9.7l5.6 5.7z\"] {",
	"    d: path(\"M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z\")",
	"  }",
    "  [d*=\"m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z\"] {",
	"    d: path(\"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z\")",
	"  }",
    "  [d*=\"m13.06 9 5.47 5.47c.293.293.293.767 0 1.06-.293.293-.767.293-1.06 0L12 10.06l-5.47 5.47c-.293.293-.767.293-1.06 0-.293-.293-.293-.767 0-1.06L10.94 9l.53-.53.53-.53.53.53.53.53Z\"] {",
	"    d: path(\"M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z\")",
	"  }",
    "  [d*=\"M5.47 8.47c.293-.293.767-.293 1.06 0L12 13.94l5.47-5.47c.293-.293.767-.293 1.06 0 .293.293.293.767 0 1.06l-6 6-.53.53-.53-.53-6-6c-.293-.293-.293-.767 0-1.06Z\"] {",
	"    d: path(\"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z\")",
	"  }",
	"/*x icon*/",
    "  [d*=\"m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z\"] {",
	"    d: path(\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\")",
	"  }",
	"/*search page icons*/",
    "  [d*=\"M15 17h6v1h-6v-1zm-4 0H3v1h8v2h1v-5h-1v2zm3-9h1V3h-1v2H3v1h11v2zm4-3v1h3V5h-3zM6 14h1V9H6v2H3v1h3v2zm4-2h11v-1H10v1z\"] {",
	"    d: path(\"M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z\")",
	"  }",
	"/*edit icon*/",
    "  [d*=\"m14.06 7.6 2.34 2.34L6.34 20H4v-2.34L14.06 7.6m0-1.41L3 17.25V21h3.75L17.81 9.94l-3.75-3.75zm3.55-2.14 2.37 2.37-1.14 1.14-2.37-2.37 1.14-1.14m0-1.42-2.55 2.55 3.79 3.79 2.55-2.55-3.79-3.79z\"] {",
	"    d: path(\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\")",
	"  }",
	"/*loop*/",
    "  [d*=\"M21 13h1v5l-18.07.03 2.62 2.62-.71.71-3.85-3.86 3.85-3.85.71.71-2.67 2.67L21 17v-4zM3 7l17.12-.03-2.67 2.67.71.71 3.85-3.85-3.85-3.85-.71.71 2.62 2.62L2 6v5h1V7z\"] {",
	"    d: path(\"M7 7H17V10L21 6L17 2V5H5V11H7V7ZM17 17H7V14L3 18L7 22V19H19V13H17V17Z\")",
	"  }",
	"/*shuffle*/",
    "  [d*=\"M18.15 13.65 22 17.5l-3.85 3.85-.71-.71L20.09 18H19c-2.84 0-5.53-1.23-7.39-3.38l.76-.65C14.03 15.89 16.45 17 19 17h1.09l-2.65-2.65.71-.7zM19 7h1.09l-2.65 2.65.71.71L22 6.51l-3.85-3.85-.71.71L20.09 6H19c-3.58 0-6.86 1.95-8.57 5.09l-.73 1.34C8.16 15.25 5.21 17 2 17v1c3.58 0 6.86-1.95 8.57-5.09l.73-1.34C12.84 8.75 15.79 7 19 7zM8.59 9.98l.75-.66C7.49 7.21 4.81 6 2 6v1c2.52 0 4.92 1.09 6.59 2.98z\"] {",
	"    d: path(\"M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z\")",
	"  }",
	"/*save to library*/",
    "  [d*=\"M4 20h14v1H3V6h1v14zm14-10h-4V6h-1v4H9v1h4v4h1v-4h4v-1zm3-7v15H6V3h15zm-1 1H7v13h13V4z\"] {",
	"    d: path(\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z\")",
	"  }",
	"/*sort*/",
    "  [d*=\"M21 6H3V5h18v1zm-6 5H3v1h12v-1zm-6 6H3v1h6v-1z\"] {",
	"    d: path(\"M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z\")",
	"  }",
    "/*left arrow*/",
    "  [d*=\"M21 11v1H5.64l6.72 6.72-.71.71-7.93-7.93 7.92-7.92.71.71L5.64 11H21z\"] {",
	"    d: path(\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\")",
	"  }",
	"/*grid icons*/",
    "  [d*=\"M8,11H2V4h6V11z M3,10h4V5H3V10z M8,20H2v-7h6V20z M3,19h4v-5H3V19z M15,11H9V4h6V11z M10,10h4V5h-4V10z M15,20H9v-7h6V20z M10,19h4v-5h-4V19z M22,11h-6V4h6V11z M17,10h4V5h-4V10z M22,20h-6v-7h6V20z M17,19h4v-5h-4V19z\"] {",
	"    d: path(\"M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z\")",
	"  }",
    "  [d*=\"M20 8H9V7h11v1zm0 3H9v1h11v-1zm0 4H9v1h11v-1zM7 7H4v1h3V7zm0 4H4v1h3v-1zm0 4H4v1h3v-1z\"] {",
	"    d: path(\"M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z\")",
	"  }"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();

(function() {
let css = `
#return-youtube-dislike-bar, #ryd-bar {
background: #909090 !important
}

.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
color: #909090 !important
}

.yt-spec-icon-badge-shape {
color: #606060 !important
}

#expand-icon, #icon.expand-icon.style-scope.ytd-info-row-renderer {
color: #909090 !important
}

#label-icon.yt-dropdown-menu, #icon-label.yt-dropdown-menu {
color: var(--yt-spec-text-secondary) !important
}

#call-to-action-icon {
color: #909090 !important
}

#expand-arrow, #collapse-arrow {
color: var(--yt-spec-text-secondary) !important
}

.style-scope.ytd-button-renderer.style-black {
color: #909090 !important
}

/* Other */
.ytp-settings-menu .ytp-menuitem-icon {
display: none !important
}

.ytp-settings-menu .ytp-menuitem-label {
padding-left: 20px !important
}

.ytp-big-mode .ytp-settings-menu .ytp-menuitem-label {
padding-left: 30px !important
}

ytd-guide-entry-renderer > a[href*="/feed/you"] path {
d: path("M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z")
}
 
ytd-guide-entry-renderer > a[href*="/feed/courses_destination"] path {
d: path("M18.45,8.45a8,8,0,0,1-4,6.92V17H12.62V10.09a1.21,1.21,0,1,0-1.28-1.36h0V17H9.59V8.73h0A1.2,1.2,0,0,0,8.38,7.68a1.21,1.21,0,0,0-.1,2.41V17H6.45V15.37a8,8,0,1,1,12-6.92Zm-12,11H8.73a2,2,0,0,0,3.44,0h2.28V18h-8Z")
}

yt-icon-button.ytd-notification-topbar-button-renderer div svg path {
d: path("M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z") !important
}

div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Create"] path {
d: path("M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z")
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

(function() {

    const ICONSET = {
        "back10": "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z M 16.9,22 H 16 V 18.7 L 15,19 v -0.7 l 1.8,-0.6 h .1 V 22 z m 4.3,-1.8 c 0,.3 0,.6 -0.1,.8 l -0.3,.6 c 0,0 -0.3,.3 -0.5,.3 -0.2,0 -0.4,.1 -0.6,.1 -0.2,0 -0.4,0 -0.6,-0.1 -0.2,-0.1 -0.3,-0.2 -0.5,-0.3 -0.2,-0.1 -0.2,-0.3 -0.3,-0.6 -0.1,-0.3 -0.1,-0.5 -0.1,-0.8 v -0.7 c 0,-0.3 0,-0.6 .1,-0.8 l .3,-0.6 c 0,0 .3,-0.3 .5,-0.3 .2,0 .4,-0.1 .6,-0.1 .2,0 .4,0 .6,.1 .2,.1 .3,.2 .5,.3 .2,.1 .2,.3 .3,.6 .1,.3 .1,.5 .1,.8 v .7 z m -0.9,-0.8 v -0.5 c 0,0 -0.1,-0.2 -0.1,-0.3 0,-0.1 -0.1,-0.1 -0.2,-0.2 -0.1,-0.1 -0.2,-0.1 -0.3,-0.1 -0.1,0 -0.2,0 -0.3,.1 l -0.2,.2 c 0,0 -0.1,.2 -0.1,.3 v 2 c 0,0 .1,.2 .1,.3 0,.1 .1,.1 .2,.2 .1,.1 .2,.1 .3,.1 .1,0 .2,0 .3,-0.1 l .2,-0.2 c 0,0 .1,-0.2 .1,-0.3 v -1.5 z",
        "forward10": "m 10,19 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 h -2 c 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 0,-3.3 2.7,-6 6,-6 v 4 l 5,-5 -5,-5 v 4 c -4.4,0 -8,3.6 -8,8 z m 6.8,3 H 16 V 18.7 L 15,19 v -0.7 l 1.8,-0.6 h .1 V 22 z m 4.3,-1.8 c 0,.3 0,.6 -0.1,.8 l -0.3,.6 c 0,0 -0.3,.3 -0.5,.3 C 20,21.9 19.8,22 19.6,22 19.4,22 19.2,22 19,21.9 18.8,21.8 18.7,21.7 18.5,21.6 18.3,21.5 18.3,21.3 18.2,21 18.1,20.7 18.1,20.5 18.1,20.2 v -0.7 c 0,-0.3 0,-0.6 .1,-0.8 l .3,-0.6 c 0,0 .3,-0.3 .5,-0.3 .2,0 .4,-0.1 .6,-0.1 .2,0 .4,0 .6,.1 .2,.1 .3,.2 .5,.3 .2,.1 .2,.3 .3,.6 .1,.3 .1,.5 .1,.8 v .7 z m -0.8,-0.8 v -0.5 c 0,0 -0.1,-0.2 -0.1,-0.3 0,-0.1 -0.1,-0.1 -0.2,-0.2 -0.1,-0.1 -0.2,-0.1 -0.3,-0.1 -0.1,0 -0.2,0 -0.3,.1 l -0.2,.2 c 0,0 -0.1,.2 -0.1,.3 v 2 c 0,0 .1,.2 .1,.3 0,.1 .1,.1 .2,.2 .1,.1 .2,.1 .3,.1 .1,0 .2,0 .3,-0.1 l .2,-0.2 c 0,0 .1,-0.2 .1,-0.3 v -1.5 z",
        "back5": "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z m -1.3,8.9 .2,-2.2 h 2.4 v .7 h -1.7 l -0.1,.9 c 0,0 .1,0 .1,-0.1 0,-0.1 .1,0 .1,-0.1 0,-0.1 .1,0 .2,0 h .2 c .2,0 .4,0 .5,.1 .1,.1 .3,.2 .4,.3 .1,.1 .2,.3 .3,.5 .1,.2 .1,.4 .1,.6 0,.2 0,.4 -0.1,.5 -0.1,.1 -0.1,.3 -0.3,.5 -0.2,.2 -0.3,.2 -0.4,.3 C 18.5,22 18.2,22 18,22 17.8,22 17.6,22 17.5,21.9 17.4,21.8 17.2,21.8 17,21.7 16.8,21.6 16.8,21.5 16.7,21.3 16.6,21.1 16.6,21 16.6,20.8 h .8 c 0,.2 .1,.3 .2,.4 .1,.1 .2,.1 .4,.1 .1,0 .2,0 .3,-0.1 L 18.5,21 c 0,0 .1,-0.2 .1,-0.3 v -0.6 l -0.1,-0.2 -0.2,-0.2 c 0,0 -0.2,-0.1 -0.3,-0.1 h -0.2 c 0,0 -0.1,0 -0.2,.1 -0.1,.1 -0.1,0 -0.1,.1 0,.1 -0.1,.1 -0.1,.1 h -0.7 z",
        "forward5": "m 10,19 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 h -2 c 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 0,-3.3 2.7,-6 6,-6 v 4 l 5,-5 -5,-5 v 4 c -4.4,0 -8,3.6 -8,8 z m 6.7,.9 .2,-2.2 h 2.4 v .7 h -1.7 l -0.1,.9 c 0,0 .1,0 .1,-0.1 0,-0.1 .1,0 .1,-0.1 0,-0.1 .1,0 .2,0 h .2 c .2,0 .4,0 .5,.1 .1,.1 .3,.2 .4,.3 .1,.1 .2,.3 .3,.5 .1,.2 .1,.4 .1,.6 0,.2 0,.4 -0.1,.5 -0.1,.1 -0.1,.3 -0.3,.5 -0.2,.2 -0.3,.2 -0.5,.3 C 18.3,22 18.1,22 17.9,22 17.7,22 17.5,22 17.4,21.9 17.3,21.8 17.1,21.8 16.9,21.7 16.7,21.6 16.7,21.5 16.6,21.3 16.5,21.1 16.5,21 16.5,20.8 h .8 c 0,.2 .1,.3 .2,.4 .1,.1 .2,.1 .4,.1 .1,0 .2,0 .3,-0.1 L 18.4,21 c 0,0 .1,-0.2 .1,-0.3 v -0.6 l -0.1,-0.2 -0.2,-0.2 c 0,0 -0.2,-0.1 -0.3,-0.1 h -0.2 c 0,0 -0.1,0 -0.2,.1 -0.1,.1 -0.1,0 -0.1,.1 0,.1 -0.1,.1 -0.1,.1 h -0.6 z",
        "backchapter": "m 16.436975,17.634454 c -0.573529,0 -1.191177,0.117647 -1.617647,0.441177 v 4.308938 c 0,0.191177 0.214706,0.132123 0.220588,0.132123 0.397059,-0.191176 0.970588,-0.323414 1.397059,-0.323414 0.57353,0 1.191177,0.117646 1.617647,0.441176 0.397059,-0.25 1.117648,-0.441176 1.617647,-0.441176 0.485295,0 0.985294,0.08846 1.397059,0.309053 0.120588,0.06177 0.220589,-0.05623 0.220589,-0.132698 v -4.294002 c -0.438235,-0.329412 -1.067647,-0.441177 -1.617648,-0.441177 -0.573529,0 -1.191176,0.117647 -1.617647,0.441177 -0.42647,-0.32353 -1.044117,-0.441177 -1.617647,-0.441177 z m 3.235294,0.588235 c 0.352942,0 0.705883,0.04411 1.029412,0.147059 v 3.382353 c -0.323529,-0.102941 -0.67647,-0.147059 -1.029412,-0.147059 -0.499999,0 -1.220588,0.191177 -1.617647,0.441177 v -3.382353 c 0.397059,-0.25 1.117648,-0.441177 1.617647,-0.441177 z m -0.674976,1.202322 v 1.303997 l 1.024241,-0.651999 z M 18,7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z",
        "forwardchapter": "m 16.436975,17.634454 c -0.573529,0 -1.191177,0.117647 -1.617647,0.441177 v 4.308938 c 0,0.191177 0.214706,0.132123 0.220588,0.132123 0.397059,-0.191176 0.970588,-0.323414 1.397059,-0.323414 0.57353,0 1.191177,0.117646 1.617647,0.441176 0.397059,-0.25 1.117648,-0.441176 1.617647,-0.441176 0.485295,0 0.985294,0.08846 1.397059,0.309053 0.120588,0.06177 0.220589,-0.05623 0.220589,-0.132698 v -4.294002 c -0.438235,-0.329412 -1.067647,-0.441177 -1.617648,-0.441177 -0.573529,0 -1.191176,0.117647 -1.617647,0.441177 -0.42647,-0.32353 -1.044117,-0.441177 -1.617647,-0.441177 z m 3.235294,0.588235 c 0.352942,0 0.705883,0.04411 1.029412,0.147059 v 3.382353 c -0.323529,-0.102941 -0.67647,-0.147059 -1.029412,-0.147059 -0.499999,0 -1.220588,0.191177 -1.617647,0.441177 v -3.382353 c 0.397059,-0.25 1.117648,-0.441177 1.617647,-0.441177 z m -0.674976,1.202322 v 1.303997 l 1.024241,-0.651999 z M 18,7 v 4 c -4.4,0 -8,3.6 -8,8 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 h -2 c 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 0,-3.3 2.7,-6 6,-6 v 4 l 5,-5 z"
    };
    const DEBUG = false;

    // Player API reference
    var api;
    var bezel;

    var animationStartTimer = 0;
    var animationShouldEndTimer = 0;

    function log(a)
    {
        if (DEBUG) console.log(a);
    }

    function getAnimationDuration(elm)
    {
        var prop = window.getComputedStyle(elm).animationDuration;

        switch (true)
        {
            case "ms" == prop.substr(-2):
                return +prop.replace("ms", "");
            case "s" == prop.substr(-1):
                return +(prop.replace("s", "")) * 1000;
        }
    }

    async function attemptEndAnimateBezel()
    {
        while (animationShouldEndTimer > Date.now())
        {
            await new Promise(r => requestAnimationFrame(r));
        }

        animationStartTimer = 0;
        animationShouldEndTimer = 0;
        bezel.style.display = "none";
    }

    function animateBezel()
    {
        var animationDuration = getAnimationDuration(bezel.querySelector(".ytp-bezel"));

        bezel.style.display = "";

        if (0 == animationShouldEndTimer)
        {
            animationStartTimer = Date.now();
            animationShouldEndTimer = animationStartTimer;
        }

        animationShouldEndTimer += animationDuration;

        attemptEndAnimateBezel();
    }

    function waitToAnimate()
    {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 10);
        });
    }

    function createBezel(direction, duration, text = "", chapter = false)
    {
        return new Promise(resolve => {
            log("Creating bezel");
            var bezelElm = api.querySelector(".ytp-bezel");
            bezel = bezelElm.parentNode;

            bezelElm.removeAttribute("aria-label");

            // Get the icon from the iconset
            var icon;
            if (chapter)
            {
                icon = ICONSET[direction + "chapter"];
            }
            else if (ICONSET[direction + duration])
            {
                icon = ICONSET[direction + duration];
            }
            else
            {
                icon = "";
            }

            var iconElm;
            if (iconElm = bezel.querySelector(".ytp-bezel-icon path"))
            {
                iconElm.setAttribute("d", icon);
            }
            else
            {
                bezel.querySelector(".ytp-bezel-icon").insertAdjacentHTML("beforeend",
                    `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                        <path class="ytp-svg-fill" d="${icon}"></path>
                    </svg>`
                );
            }

            if ("" === text)
            {
                bezel.setAttribute("class", "ytp-bezel-text-hide");
            }
            else
            {
                bezel.setAttribute("class", "");
                bezel.querySelector(".ytp-bezel-text").innerText = text;
            }

            bezel.style.display = "none";

            resolve();
        });
    }

    async function waitForElement(query, timeout = 500)
    {
        log("Waiting for element " + query + " with timeout in " + timeout + " ms.");
        var hasTimedOut = false;

        setTimeout(function() {
            log("Wait for element " + query + " has timed out.");
            hasTimedOut = true;
        }, timeout);

        while (null == document.querySelector(query) && !hasTimedOut)
        {
            await new Promise(r => requestAnimationFrame(r));
        }

        var a;
        if (a = document.querySelector(query))
        {
            return a;
        }
        else
        {
            return null;
        }
    }

    function handleSeekGui()
    {
        log("Handing seek GUI");
        var direction = this.dataset.side;
        var duration = this.querySelector(".ytp-doubletap-tooltip-label")
            .innerText.replace(/[\s|[A-Za-z]]*/g, "")
        ;
        var text = "";
        var isChapter = false;

        if (this.classList.contains("ytp-chapter-seek"))
        {
            var textContainer = this.querySelector(".ytp-chapter-seek-text-legacy")
            text = textContainer.innerText;
            duration = 0;
            isChapter = true;
        }

        createBezel(direction, duration, text, isChapter).then(waitToAnimate).then(animateBezel);
    }

    async function attemptHookPlayer()
    {
        log("Attempting to hook player");
        var playerApi = await waitForElement(".html5-video-player", 5000);

        if (playerApi)
        {
            log("Player API detected");
            api = playerApi;

            var doubleTapElm = api.querySelector(".ytp-doubletap-ui-legacy") ?? api.querySelector(".ytp-doubletap-ui") ?? null;

            if (doubleTapElm && !api.__oldSeekUi)
            {
                log("Doubletap detected: installing binding");
                (new MutationObserver(handleSeekGui.bind(doubleTapElm)))
                    .observe(doubleTapElm, {"subtree": true, "childList": true, "characterData": "true"});
                api.__oldSeekUi = true;
            }
        }
    }

    function insertContinuationEvent()
    {
        log("Inserting continuation events");
        if (window.ytspf && window.ytspf.enabled)
        {
            log("Inserted spf continuation events");
            document.addEventListener("spfdone", attemptHookPlayer);
        }
        else if (document.querySelector("ytd-app"))
        {
            log("Inserted kevlar continuation events");
            document.addEventListener("yt-page-data-updated", attemptHookPlayer);
        }
    }

    function installInitialStyles()
    {
        log("Installed initial styles");
        document.head.insertAdjacentHTML("beforeend",
            `<style>
                .ytp-doubletap-ui, .ytp-doubletap-ui-legacy
                {
                    display: none !important;
                }
            </style>`
        );
    }

    function handleDOMContentLoaded()
    {
        log("domcontentloaded event fired");
        installInitialStyles();
        document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
    }

    async function main()
    {
        log("Old seek ui script loaded");

        document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

        // The player needs more time to init
        // So wait until a little while after page load to attempt
        // hooking the player
        window.addEventListener("load", function handleLoad() {
            log("load event fired");
            attemptHookPlayer();
            insertContinuationEvent();
            window.removeEventListener("load", handleLoad);
        });
    }

    main();

})();
 
const abtnconfig = {
    unsegmentLikeButton: false,
    noFlexibleItems: true
};
 
function updateBtns() {
    var watchFlexy = document.querySelector("ytd-watch-flexy");
    var results = watchFlexy.data.contents.twoColumnWatchNextResults.results.results.contents;
 
    for (var i = 0; i < results.length; i++) {
        if (results[i].videoPrimaryInfoRenderer) {
            var actions = results[i].videoPrimaryInfoRenderer.videoActions.menuRenderer;
 
            if (abtnconfig.unsegmentLikeButton) {
                if (actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer) {
                    var segmented = actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer;
                    actions.topLevelButtons.splice(0, 1);
                    actions.topLevelButtons.unshift(segmented.dislikeButton);
                    actions.topLevelButtons.unshift(segmented.likeButton);
                }
            }
 
            if (abtnconfig.noFlexibleItems) {
                for (var i = 0; i < actions.flexibleItems.length; i++) {
                    actions.topLevelButtons.push(actions.flexibleItems[i].menuFlexibleItemRenderer.topLevelButton);
                }
 
                delete actions.flexibleItems
            }
        }
    }
 
    var temp = watchFlexy.data;
    watchFlexy.data = {};
    watchFlexy.data = temp;
}
 
document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType == "watch") {
        updateBtns();
    }
});

/* jshint esversion:8 */

((__CONTEXT01__) => {
  'use strict';


  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'ahceihvpbosz';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.
  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1'
      let frame = document.getElementById(frameId);
      let removeIframeFn = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = frameId;
        const blobURL = typeof webkitCancelAnimationFrame === 'function' && typeof kagi === 'undefined' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        if (blobURL) Promise.resolve().then(() => URL.revokeObjectURL(blobURL));

        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            e = n;
            n = win = removeIframeFn = 0;
            setTimeout ? setTimeout(() => e.remove(), 200) : e.remove();
          }
          if (!setTimeout || document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      try {
        const { requestAnimationFrame, setTimeout, clearTimeout } = fc;
        const res = { requestAnimationFrame, setTimeout, clearTimeout };
        for (let k in res) res[k] = res[k].bind(win); // necessary
        if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
        return res;
      } catch (e) {
        if (removeIframeFn) removeIframeFn();
        return null;
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const isWatchPageURL = (url) => {
    url = url || location;
    return location.pathname === '/watch' || location.pathname.startsWith('/live/')
  };

  cleanContext(win).then(__CONTEXT02__ => {
    if (!__CONTEXT02__) return null;

    const { ResizeObserver } = __CONTEXT01__;
    const { requestAnimationFrame, setTimeout, clearTimeout } = __CONTEXT02__;
    const elements = {};
    let rid1 = 0;
    let rid2 = 0;
    /** @type {MutationObserver | null} */
    let attrObserver = null;
    /** @type {ResizeObserver | null} */
    let resizeObserver = null;
    let isHTMLAttrApplied = false;
    const core = {
      begin() {
        document.addEventListener('yt-player-updated', core.hanlder, true);
        document.addEventListener('ytd-navigate-finish', core.hanlder, true);
      },
      hanlder: () => {
        rid1++;
        if (rid1 > 1e9) rid1 = 9;
        const tid = rid1;
        requestAnimationFrame(() => {
          if (tid !== rid1) return;
          core.runner();
        })
      },
      async runner() {
        if (!location.href.startsWith('https://www.youtube.com/')) return;
        if (!isWatchPageURL()) return;

        elements.ytdFlexy = document.querySelector('ytd-watch-flexy');
        elements.video = document.querySelector('ytd-watch-flexy #movie_player video, ytd-watch-flexy #movie_player audio.video-stream.html5-main-video');
        if (elements.ytdFlexy && elements.video) { } else return;
        elements.moviePlayer = elements.video.closest('#movie_player');
        if (!elements.moviePlayer) return;

        // resize Video
        let { ytdFlexy } = elements;
        if (!ytdFlexy.ElYTL) {
          ytdFlexy.ElYTL = 1;
          const ytdFlexyCnt = insp(ytdFlexy);
          if (typeof ytdFlexyCnt.calculateNormalPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateNormalPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateNormalPlayerSize_, 1);
          } else {
            console.warn('ytdFlexyCnt.calculateNormalPlayerSize_ is not a function.')
          }
          if (typeof ytdFlexyCnt.calculateCurrentPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateCurrentPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateCurrentPlayerSize_, 0);
          } else {
            console.warn('ytdFlexyCnt.calculateCurrentPlayerSize_ is not a function.')
          }
        }
        ytdFlexy = null;

        // when video is fetched
        elements.video.removeEventListener('canplay', core.triggerResizeDelayed, false);
        elements.video.addEventListener('canplay', core.triggerResizeDelayed, false);

        // when video is resized
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (typeof ResizeObserver === 'function') {
          resizeObserver = new ResizeObserver(core.triggerResizeDelayed);
          resizeObserver.observe(elements.moviePlayer);
        }

        // MutationObserver:[collapsed] @ ytd-live-chat-frame#chat
        if (attrObserver) {
          attrObserver.takeRecords();
          attrObserver.disconnect();
          attrObserver = null;
        }
        let chat = document.querySelector('ytd-watch-flexy ytd-live-chat-frame#chat');
        if (chat) {
          // resize due to DOM update
          attrObserver = new MutationObserver(core.triggerResizeDelayed);
          attrObserver.observe(chat, { attributes: true, attributeFilter: ["collapsed"] });
          chat = null;
        }

        // resize on idle
        Promise.resolve().then(core.triggerResizeDelayed);
      },
      resizeFunc(originalFunc, kb) {
        return function () {
          rid2++;
          if (!isHTMLAttrApplied) {
            isHTMLAttrApplied = true;
            Promise.resolve(0).then(() => {
              document.documentElement.classList.add('youtube-video-resize-fix');
            }).catch(console.warn);
          }
          if (document.fullscreenElement === null) {

            // calculateCurrentPlayerSize_ shall be always return NaN to make correct positioning of toolbars
            if (!kb) return { width: NaN, height: NaN };

            let ret = core.calculateSize();
            if (ret.height > 0 && ret.width > 0) {
              return ret;
            }
          }
          return originalFunc.apply(this, arguments);
        }
      },
      calculateSize_() {
        const { moviePlayer, video } = elements;
        const rect1 = { width: video.videoWidth, height: video.videoHeight }; // native values independent of css rules
        if (rect1.width > 0 && rect1.height > 0) {
          const rect2 = moviePlayer.getBoundingClientRect();
          const aspectRatio = rect1.width / rect1.height;
          let h2 = rect2.width / aspectRatio;
          let w2 = rect2.height * aspectRatio;
          return { rect2, h2, w2 };
        }
        return null;
      },
      calculateSize() {
        let rs = core.calculateSize_();
        if (!rs) return { width: NaN, height: NaN };
        const { rect2, h2, w2 } = rs;
        if (h2 > rect2.height) {
          return { width: w2, height: rect2.height };
        } else {
          return { width: rect2.width, height: h2 };
        }
      },
      triggerResizeDelayed: () => {
        rid2++;
        if (rid2 > 1e9) rid2 = 9;
        const tid = rid2;
        requestAnimationFrame(() => {
          if (tid !== rid2) return;
          const { ytdFlexy } = elements;
          let r = false;
          const ytdFlexyCnt = insp(ytdFlexy);
          const windowSize_ = ytdFlexyCnt.windowSize_;
          if (windowSize_ && typeof ytdFlexyCnt.onWindowResized_ === 'function') {
            try {
              ytdFlexyCnt.onWindowResized_(windowSize_);
              r = true;
            } catch (e) { }
          }
          if (!r) window.dispatchEvent(new Event('resize'));
        })
      }
    };
    core.begin();







    // YouTube Watch Page Reflect (WPR)



    // This script enhances the functionality of YouTube pages by reflecting changes in the page state.

    (async function youTubeWPR() {

      let checkPageVisibilityChanged = false;

      // A WeakSet to keep track of elements being monitored for mutations.
      const monitorWeakSet = new WeakSet();

      /** @type {globalThis.PromiseConstructor} */
      const Promise = (async () => { })().constructor;

      // Function to reflect the current state of the YouTube page.
      async function _reflect() {
        await Promise.resolve();

        const youtubeWpr = document.documentElement.getAttribute("youtube-wpr");
        let s = '';

        // Check if the current page is the video watch page.
        if (isWatchPageURL()) {
          let watch = document.querySelector("ytd-watch-flexy");
          let chat = document.querySelector("ytd-live-chat-frame#chat");

          if (watch) {
            // Determine the state of the chat and video player on the watch page and generate a state string.
            s += !chat ? 'h0' : (chat.hasAttribute('collapsed') || !document.querySelector('iframe#chatframe')) ? 'h1' : 'h2';
            s += watch.hasAttribute('is-two-columns_') ? 's' : 'S';
            s += watch.hasAttribute('fullscreen') ? 'F' : 'f';
            s += watch.hasAttribute('theater') ? 'T' : 't';
          }
        }

        // Update the reflected state if it has changed.
        if (s !== youtubeWpr) {
          document.documentElement.setAttribute("youtube-wpr", s);
        }

      }

      // Function to reflect changes in specific attributes of monitored elements.
      async function reflect(nodeName, attrNames, forced) {
        await Promise.resolve();

        if (!forced) {
          let skip = true;
          for (const attrName of attrNames) {
            if (nodeName === 'ytd-live-chat-frame') {
              if (attrName === 'collapsed') skip = false;
            } else if (nodeName === 'ytd-watch-flexy') {
              if (attrName === 'is-two-columns_') skip = false;
              else if (attrName === 'fullscreen') skip = false;
              else if (attrName === 'theater') skip = false;
            }
          }
          if (skip) return;
        }

        // Log the mutated element and its attributes.
        // console.log(nodeName, attrNames);

        // Call _reflect() to update the reflected state.
        _reflect();
      }

      // Callback function for the MutationObserver that tracks mutations in monitored elements.
      function callback(mutationsList) {
        const attrNames = new Set();
        let nodeName = null;
        for (const mutation of mutationsList) {
          if (nodeName === null && mutation.target) nodeName = mutation.target.nodeName.toLowerCase();
          attrNames.add(mutation.attributeName);
        }
        reflect(nodeName, attrNames, false);
      }

      function getParent(element) {
        return element.__shady_native_parentNode || element.__shady_parentNode || element.parentNode;
      }

      let lastPageTypeChanged = 0;
      function chatContainerMutationHandler() {
        if (Date.now() - lastPageTypeChanged < 800) _reflect();
      }

      // Function to start monitoring an element for mutations.
      function monitor(element) {
        if (!element) return;
        if (monitorWeakSet.has(element)) {
          return;
        }

        monitorWeakSet.add(element);

        const observer = new MutationObserver(callback);
        observer.observe(element, { attributes: true });

        if (element.id === 'chat') {
          const parentNode = getParent(element);
          if (parentNode instanceof Element && parentNode.id === 'chat-container' && !monitorWeakSet.has(parentNode)) {
            monitorWeakSet.add(parentNode);
            const observer = new MutationObserver(chatContainerMutationHandler);
            observer.observe(parentNode, { childList: true, subtree: false });
          }
        }

        return 1;
      }

      let timeout = 0;

      // Function to monitor relevant elements and update the reflected state.
      let g = async (forced) => {
        await Promise.resolve();
        let b = 0;
        b = b | monitor(document.querySelector("ytd-watch-flexy"));
        b = b | monitor(document.querySelector("ytd-live-chat-frame#chat"));
        if (b || forced) {
          _reflect();
        }
      }
      // let renderId = 0;
      // Event handler function that triggers when the page finishes navigation or page data updates.
      let eventHandlerFunc = async (evt) => {
        checkPageVisibilityChanged = true;
        timeout = Date.now() + 800;
        g(1);
        if (evt.type === 'yt-navigate-finish') {
          // delay required when page type is changed for #chat (home -> watch).
          setTimeout(() => {
            g(1);
          }, 80);
        } else if (evt.type === 'yt-page-type-changed') {
          lastPageTypeChanged = Date.now();
          // setTimeout(() => {
          //   if (renderId > 1e9) renderId = 9;
          //   const t = ++renderId;
          //   requestAnimationFrame(() => {
          //     if (t !== renderId) return;
          //     g(1);
          //   });
          // }, 180);
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
              g(1);
            });
          }
        }
      }

      let loadState = 0;

      // Function to initialize the script and start monitoring the page.
      async function actor() {
        if (loadState === 0) {
          if (!document.documentElement.hasAttribute("youtube-wpr")) {
            loadState = 1;
            document.documentElement.setAttribute("youtube-wpr", "");
            document.addEventListener("yt-navigate-finish", eventHandlerFunc, false);
            document.addEventListener("yt-page-data-updated", eventHandlerFunc, false);
            document.addEventListener("yt-page-type-changed", eventHandlerFunc, false);
          } else {
            loadState = -1;
            document.removeEventListener("yt-page-data-fetched", actor, false);
            return;
          }
        }
        if (loadState === 1) {
          timeout = Date.now() + 800;
          // Function to continuously monitor elements and update the reflected state.
          let pf = () => {
            g(0);
            if (Date.now() < timeout) requestAnimationFrame(pf);
          };
          pf();
        }
      }

      // Event listener that triggers when page data is fetched.
      document.addEventListener("yt-page-data-fetched", actor, false);

      // Update after visibility changed (looks like there are bugs due to inactive tab)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        if (checkPageVisibilityChanged) {
          checkPageVisibilityChanged = false;
          setTimeout(() => {
            g(1);
          }, 100);
          requestAnimationFrame(() => {
            g(1);
          });
        }
      }, false);


    })();

  });

})({ ResizeObserver });