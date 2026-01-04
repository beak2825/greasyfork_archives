// ==UserScript==
// @name Gaston's - Video/Image Downloader Revamped
// @namespace http://tampermonkey.net
// @version 11.4
// @supportURL https://greasyfork.org/en/scripts/496975-gaston-s-video-image-downloader/feedback
// @homepageURL https://greasyfork.org/en/users/689441-gaston
// @description Instagram/Twitch/YouTube/TikTok Video/Audio Downloader (frequently updated) Includes YT Ad block
// @author gaston1799
// @match *://www.youtube.com/*
// @match *://yt.savetube.me/*
// @match *://production.assets.clips.twitchcdn.net/*
// @match *://www.instagram.com/*
// @match *://music.youtube.com/*
// @match *://y2mate.nu/*
// @match *://p.savenow.to/*
// @match *://www.twitch.tv/*
// @match *://www.socialplug.io/*
// @match *://snapinst.app/*
// @match *://loader.to/*
// @match *://onlymp3.app/*
// @match *://qdownloader.cc/*
// @match *://tubemp4.is/*
// @match *://snapsave.io/*
// @match *://dashboard.twitch.tv/*
// @match *://clips.twitch.tv/*
// @match *://twitch.tv/*
// @match *://onlymp3.to/*
// @match *://fastdl.app/*
// @match *://en.onlymp3.app/*
// @match *://clipr.xyz/*
// @match *://studio.youtube.com/*
// @match *://www.yt2conv.com/*
// @match *://soundcloud.com/*
// @match *://sclouddownloader.net/*
// @match *://www.tiktok.com/*
// @match *://en3.onlinevideoconverter.pro/*
// @match *://savetik.co/*
// @match *://yt5s.biz/*
// @match *://sss.instasaverpro.com/*
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_info
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant window.onurlchange
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_addValueChangeListener
// @grant GM_removeValueChangeListener
// @require https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @require https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551724/Gaston%27s%20-%20VideoImage%20Downloader%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/551724/Gaston%27s%20-%20VideoImage%20Downloader%20Revamped.meta.js
// ==/UserScript==
! function() {
    info = {};
    class videoPlayer {
#e = function() {
            return this.isFullScreen
        };
#t = function() {
            return this.isTheater
        };
#o = function() {
            return this.isMini
        };
        set isMini(e) {
            e && !this.#o() ? document.querySelector('[title="Miniplayer (i)"]').click() : !e && this.#o() && document.querySelector('[title="Expand (i)"]').click()
        }
        get isMini() {
            return !!document.querySelector('[title="Expand (i)"]')
        }
        set isTheater(e) {
            !e && this.#t() ? document.querySelector('[title="Default view (t)"]').click() : e && !this.#t() && document.querySelector('[title="Theater mode (t)"]').click()
        }
        get isTheater() {
            return !document.querySelector('[title="Theater mode (t)"]')
        }
        set isFullScreen(e = this.#e()) {
            e && !this.#e() ? document.querySelector('[title="Full screen (f)"]').click() : !e && this.#e() && document.querySelector('[title="Exit full screen (f)"]').click()
        }
        get isFullScreen() {
            return !document.querySelector('[title="Full screen (f)"]')
        }
    }
    class element {
        static get br() {
            return new element("br")
        }
        constructor(e, t = {}) {
            if (e instanceof HTMLElement) this.element = e;
            else {
                this.element = document.createElement(e);
                for (let e in t) "className" === e ? this.element.className = t[e] : this.element.setAttribute(e, t[e])
            }
        }
        style(e) {
            for (let t in e) this.element.style[t] = e[t];
            return this
        }
        append(e, ...t) {
            this.element.append(e.element || e);
            for (let e = 0; e < t.length; e++) this.element.append(t[e].element || t[e]);
            return this
        }
        appendTo(e) {
            return (e.element || ("string" == typeof e ? document.querySelector(e) : e)).append(this.element), this
        }
        on(e, t) {
            return this.element.addEventListener(e, t), this
        }
        set(e, t) {
            return "className" === e ? ("string" == typeof t && t.startsWith(".") && (t = t.substring(1)), this.element.className = t) : this.element[e] = t, this
        }
        remove() {
            return this.element.remove(), this
        }
        get(e) {
            return this.element[e]
        }
        get children() {
            return Array.from(this.element.children)
        }
    }
    const _e = element;
    class CustomLogging {
        constructor(e) {
            this.title = {
                body: e || "---",
                color: "darkgrey",
                size: "1rem"
            }, this.body = {
                color: "#008f68",
                size: "1rem"
            }
        }
        setTitleBody(e) {
            return this.title.body = e, this
        }
        setTitleStyle({
            color: e,
            size: t
        }) {
            return void 0 !== e && (this.title.color = e), void 0 !== t && (this.title.size = t), this
        }
        setBodyStyle({
            color: e,
            size: t
        }) {
            return void 0 !== e && (this.body.color = e), void 0 !== t && (this.body.size = t), this
        }
        log(e = "") {
            console.log(`%c${this.title.body} | %c${e}`, `color: ${this.title.color}; font-weight: bold; font-size: ${this.title.size};`, `color: ${this.body.color}; font-weight: bold; font-size: ${this.body.size}; text-shadow: 0 0 5px rgba(0,0,0,0.2);`)
        }
    }
    const _origConsole = {...console
        },
        logProxy = new CustomLogging("Console"),
        logger_ = new CustomLogging("Base"),
        logger = logger_,
        log_ = function(e) {
            let t = getCallerName();
            new CustomLogging(t).log(e)
        },
        error_ = function(e) {
            let t = getCallerName();
            new CustomLogging(t).error(e)
        },
        warn_ = function(e) {
            let t = getCallerName();
            new CustomLogging(t).warn(e)
        },
        YouTubeStyleButtonClass = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment",
        actions = [{
            test: e => e.includes("onlymp3.app") || e.includes("onlymp3.to"),
            action: async() => {
                console.log("Executing onlymp3 action!"), console.log("onlymp3.app");
                setInterval((() => {
                    document.getElementById("error-text").innerText.length > 5 && location.reload()
                }), 2e4), console.log("Getting MP3"), tF((function(e = function() {}) {
                    ! function() {
                        var [e, t] = name.split(",");
                        txtUrl.value = `https://www.youtube.com/${"1"==t?"shorts/":"watch?v="}${e}`, getListFormats()
                    }(), tF((function(e = function() {}) {
                        ! function() {
                            var e = videoTitle.innerText.split("\n"),
                                t = e.map((e => e.match(/[:\d]+/gi))).filter((e => !!e)).pop().pop(),
                                o = e[0].split("Title: ")[1],
                                n = findhref2(videoTitle.parentNode)[0].href,
                                l = {
                                    id: setElement(location.href),
                                    href: n,
                                    title: o,
                                    length: t
                                };
                            (opener || window).postMessage(l, "*"), console.log("Poasted")
                        }()
                    }), {
                        callback: close
                    })
                }), {
                    callback: function() {}
                })
            }
        }, {
            test: e => new URL(e).host.includes("tiktok"),
            action() {
                console.log("OK, let's go2"), addEventListener("load", (function() {
                    function e() {
                        const e = abc_("browse-copy", "data-e2e") || abc_("browse-user-avatar", "data-e2e") ? (abc_("browse-copy", "data-e2e") || abc_("browse-user-avatar", "data-e2e")).parentNode : null;
                        e ? e.querySelector(".tt1") ? console.log("Buttons already exist, chillin'.") : (console.log("Buttons not found, appending now."), e.append(tiktokButton.element), e.append(tiktokButton2.element)) : console.log("Target element not found, fam.")
                    }
                    console.log("OK, let's go"), e(), setInterval(e, 4e3)
                }))
            },
            action2() {
                console.log("OK lets go2"), addEventListener("load", (function() {
                    console.log("OK lets go")
                }))
            }
        }, {
            test: e => new URL(e).host.includes("youtube"),
            action() {
                tF((function() {
                    if (_ex_(), !_ex_()) throw "Cant append buttons yet";
                    return console.log("Posting"), appendButtons()
                }), {
                    callback: function() {}
                })
            }
        }, {
            test: e => new URL(e).host.includes("music"),
            action() {
                console.log("Added MiniPlayer Toggle with I"), addEventListener("keypress", (function({
                    isTrusted: e,
                    ctrlKey: t,
                    shiftKey: o,
                    code: n,
                    target: l,
                    target: {
                        tagName: r
                    }
                }) {
                    ["INPUT", "TEXTAREA"].includes(r) || t || o || !e || "KeyI" != n || (abc_("Close player page") || abc_("Open player page")[1]).click()
                }))
            }
        }, {
            test: e => new URL(e).host.includes("laoder.to") && location.href.includes("/api/"),
            action() {
                console.warn("using loader.to api")
            }
        }],
        domainActions = {
            "p.savenow.to": async function() {
                async function e(e, t) {
                    void 0 === t && (t = 2e4);
                    var o = !1;
                    for (setTimeout((function() {
                            console.log("TimeOut for", e), o = !0
                        }), t); !document.querySelector(e) && (await sleep(500), !o););
                    if (o) throw "NotFound";
                    return document.querySelector(e)
                }
                log_("Booting up Loader"), log_("Waiting for URL");
                var t = await e("#cardUrl"),
                    o = await e("#downloadButton");
                log_("got url:" + t.innerText);
                var n = setElement(t.innerText),
                    l = !1;
                GM_setValue(n, null), GM_addValueChangeListener(n, (async function(e, t, r, i) {
                    if (!l) {
                        l = !0, log_("Requesting to download as:" + r);
                        var a = {
                            mp3: 0,
                            mp4: 5
                        }[r];
                        if ("number" == typeof a) {
                            var c = document.querySelector(".custom-select");
                            c && c.options[a] && (c.options[a].selected = !0), o.click(), log_("waiting for downloadLink to appear");
                            for (var s = 0;
                                (!o.href || "" === o.href) && s < 3e4;) await sleep(500), s += 500;
                            o.href && "" !== o.href ? (log_("Download link ready: " + o.href), window.open(o.href, "_blank"), GM_setValue(n, !0)) : console.warn("Download link timeout for " + r)
                        }
                        l = !1, GM_setValue(n, !1)
                    }
                }))
            },
            "qdownloader.cc": async() => {
                async function e(e, t = 2e4) {
                    let o = !1;
                    for (setTimeout((() => {
                            console.log("TimeOut for", e), o = !0
                        }), t); !document.querySelector(e) && (console.log("_", e, o), await sleep(500), !o););
                    if (console.log(e, o), o) throw "NotFound";
                    return document.querySelector(e)
                }! function() {
                    const e = document.createElement;
                    document._createElement = function(t, o) {
                        const n = e.call(document, t, o);
                        return n._click = n.click, n.click = function() {
                            if (console.log(n, "was clicked", n.tagName), "A" === n.tagName) {
                                console.log("Caught", n);
                                const e = n.download,
                                    t = n.href;
                                f = {
                                    id: new URL(location.href).searchParams.get("v"),
                                    href: t,
                                    title: e
                                }
                            } else n._click.apply(n);
                            return console.log(n, "was created", n.tagName), n
                        }, console.log(n, "was created", n.tagName), n
                    }
                }();
                try {
                    await async function() {
                        if (location.href.includes("vidbutton")) throw "vidbutton";
                        var t = !1;
                        GM_setValue("dlbutton", ""), GM_addValueChangeListener("dlbutton", (async function(e, t, o, n) {
                            console.log({
                                a: e,
                                b: t,
                                c: o,
                                d: n
                            }), o.includes("video download successful\ncheck downloads folder") && (await sleep(1e3), close())
                        }));
                        const o = await e("#url"),
                            n = await e("#downloadBtn"),
                            l = new URL(location.href).searchParams.get("v");
                        ! function(e, t) {
                            ["focus", "input", "change", "blur"].forEach((o => {
                                const n = new Event(o, {
                                    bubbles: !0,
                                    isTrusted: !0
                                });
                                e[`on${o}`] && e[`on${o}`](n), "input" === o && (e.value = t), e.dispatchEvent(n)
                            }))
                        }(o, `https://www.youtube.com/watch?v=${l}`);
                        let r = `started_${l}`;
                        for (GM_addValueChangeListener(r, (async function(e, o, n, l) {
                                console.log("Started", {
                                    a: e,
                                    b: o,
                                    c: n,
                                    d: l
                                }), t = n
                            })), GM_setValue(r, !1), alert(r + " not start"), n.click(); !t;) await sleep(5e3), n.click();
                        GM_deleteValue(r)
                    }()
                } catch (t) {
                    "vidbutton" === t ? await async function() {
                        console.log("Best Quality Video");
                        let t = `started_${new URL(new URL(location.href).searchParams.get("url")).searchParams.get("v")}`;
                        GM_setValue(t, !0), await e("#height").then((o => {
                            GM_setValue(t, !0), height.selectedIndex = height.options.length - 1, dlbutton.click(), window.open = function(e, t, o) {
                                console.log({
                                    a: e,
                                    b: t,
                                    c: o
                                })
                            }, e("#dlbutton").then((e => {
                                let t = "";
                                setInterval((() => {
                                    t !== e.innerText && (t = e.innerText, GM_setValue("dlbutton", t))
                                }), 100)
                            }))
                        }))
                    }() : console.error(t)
                }
            },
            "snapsave.io": async() => {
                async function e(e, t = 2e4) {
                    let o = !1;
                    for (setTimeout((() => {
                            console.log("TimeOut for", e), o = !0
                        }), t); !document.querySelector(e) && (console.log("_", e, o), await sleep(500), !o););
                    if (console.log(e, o), o) throw "NotFound";
                    return document.querySelector(e)
                }
                _wfs = e;
                var t = await e("#s_input", 3e4);
                if (t) {
                    console.log("Converting"), id_ = new URL(location.href).searchParams.get("v"), t.value = `https://www.youtube.com/watch?v=${id_}`, ksearchvideo(), setTimeout(ksearchvideo(), 1e3);
                    var o = await e("#formatSelect");
                    await e("#btn-action");
                    o.selectedIndex = 0, o.options[0].selected = !0;
                    for (var n = await e("#asuccess"); !(n = await e("#asuccess"));) await sleep(0);
                    for (convertFile(0);
                        "#" == n.getAttribute("href");) await sleep(0), n = await e("#asuccess");
                    console.log(n.href);
                    var l = (await _wfs(".clearfix")).querySelector("h3").innerText,
                        r = {
                            id: id_,
                            href: n.href,
                            title: l,
                            length: {}
                        };
                    console.log("Posted", r), (opener || window).postMessage(r, "*")
                } else alert("Input was not Found"), console.warn("?!!")
            },
            "soundcloud.com": async() => {
                getSoundCloadI = function() {
                    _setV("SC", getSoundCloudUrl()), open("https://sclouddownloader.net/", "SC").onclose = function(e) {
                        console.log("Win closed")
                    }
                }
            },
            "sclouddownloader.net": async function() {
                var e = _getV("sc");
                async function t(e, t) {
                    return await new Promise((async(o, n) => {
                        var l = !1;
                        setTimeout((() => (l = 0, n())), t);
                        for (; !document.querySelector(e);)
                            if (await sleep(), l) {
                                n();
                                break
                            }
                        return o(document.querySelector(e))
                    })).then((e => !0), (e => !1))
                }
                if ("/download-sound-track" == location.pathname) {
                    for (await t("#trackTitle"); !trackTitle.innerText.length;) await sleep(0);
                    for (await t("#trackLink"); !trackLink.href.length;) await sleep(0);
                    var o = {
                        name: trackTitle.innerText,
                        href: trackLink.href
                    };
                    o.href == location.href ? (trackLink.click(), setTimeout((() => {
                        close()
                    }), 1e3)) : (console.log(o), _setV("SCinfo", o), close())
                } else {
                    if (!_getV("SC")) throw "Bruv";
                    var n = "#urlInput";
                    if (await t(n, 2e3), await t(n, 2e3)) {
                        for (document.querySelector(n).value = e, console.log("EZ url", !!window.formSubmit);
                            "undefined" == typeof formSubmit;) {
                            document.querySelector(n).value = e;
                            try {
                                await sleep(0), console.log("EZ url", formSubmit), formSubmit()
                            } catch {}
                        }
                        console.log("EZ url", formSubmit), formSubmit(), console.warn("Got"), setInterval((() => {
                            document.querySelector(n).value = e, formSubmit()
                        }), 1e3)
                    }
                }
            },
            "studio.youtube.com": async() => {
                var e;
                setInterval((() => {
                    var t;
                    try {
                        [...[...document.querySelectorAll("#video-list")].map((e => [e, [...e.classList]])).filter((e => e[1].includes("ytcp-video-section")))[0][0].children[1].children].map((e => [e, [...e.classList], e.tagName])).filter((e => "YTCP-VIDEO-ROW" == e[2])).filter((e => "Public" == e[0].children[0].querySelectorAll(".cell-body.tablecell-visibility.style-scope.ytcp-video-row")[0].innerText)).map((e => e[0].children[0].querySelectorAll(".cell-body.tablecell-visibility.style-scope.ytcp-video-row")[0])).forEach((e => {
                            console.log(e), e.append(new _e("br").element);
                            new _e("button").set("innerText", "MP3").on("click", (function(e) {
                                let t = e.target.parentElement.parentElement.querySelector("#hover-items").children[3];
                                console.log(t);
                                const {
                                    id: o,
                                    href: n,
                                    short: l
                                } = {
                                    href: t.href,
                                    short: t.href.includes("/short"),
                                    id: setElement(t.href)
                                };
                                console.log({
                                    id: o,
                                    href: n,
                                    short: l
                                }), downloadT(o, !1, !0, !1, !1, new URL(n))
                            }));
                            var t = new _e("button").set("innerText", "MP4").on("click", (function(e) {
                                let t = e.target.parentElement.parentElement.querySelector("#hover-items").children[3];
                                console.log(t);
                                const {
                                    id: o,
                                    href: n,
                                    short: l
                                } = {
                                    href: t.href,
                                    short: t.href.includes("/short"),
                                    id: setElement(t.href)
                                };
                                console.log({
                                    id: o,
                                    href: n,
                                    short: l
                                }), downloadT(o, !1, !0, !0, !1, new URL(n))
                            }));
                            e.prepend(t.element)
                        })), t = !0
                    } catch {
                        t = !1
                    }
                    e != t && (e = t, console.log("Change?", t ? "Found" : "Not FOund"))
                }), 0)
            },
            "www.socialplug.io": async() => {
                async function e(e, t = 5e3) {
                    let o = !1;
                    for (setTimeout((() => {
                            console.log("TimeOut for", e), o = !0
                        }), t); !document.querySelector(e) && (console.log("_", e, o), await sleep(500), !o););
                    if (console.log(e, o), o) throw "NotFound";
                    return document.querySelector(e)
                }
                location.pathname.split("/")[1] != GM_getValue(document.domain) && (GM_setValue(document.domain, location.pathname.split("/")[1]), console.warn("updated"));
                let [t, o] = name.split(",");
                if (!t.length || !o.length) return console.warn("No info Preset");
                var n = `https://www.youtube.com/${"1"==o?"shorts/":"watch?v="}${t}`;
                for (await e("#video-url"), console.log("Input Loaded"), document.querySelector("#video-url").value = n, await e("#get-video-button"), console.log("GEtting res"), await sleep(100), document.querySelector("#get-video-button").click(), await e("#quality-options", 2e4); !document.getElementById("quality-options").children.length;) await sleep(100);
                for (document.getElementById("quality-options").children[document.getElementById("quality-options").children.length - 1].click(), console.log("Stating Download"); Number(document.querySelector(".indicator").style.width.replace("%", "")) < 100;) await sleep(10), "An error occurred while starting the download" == error.innerText && (document.getElementById("quality-options").children[document.getElementById("quality-options").children.length - 1].click(), console.warn("Stating Download again"), error.innerText = "", await sleep(1e3));
                for (console.log("Done Loading"), console.log("Unloading video"); Number(document.querySelector(".indicator").style.width.replace("%", ""));) await sleep(10);
                close()
            },
            "y2mate.nu": async() => {
                location.pathname.split("/")[1] != GM_getValue("y2mate.nu") && (GM_setValue("y2mate.nu", location.pathname.split("/")[1]), console.warn("updated"), close());
                let id_ = new URL(location.href).searchParams.get("v"),
                    IsShort = 1 == new URL(location.href).searchParams.get("s"),
                    mp4 = new URL(location.href).searchParams.get("mp4"),
                    useT = new URL(location.href).searchParams.get("useT"),
                    _ = id_ + mp4 + useT;
                for (id_ || ([id_, IsShort, mp4, useT] = name.split(",").map((e => {
                        try {
                            return !!eval(e)
                        } catch {
                            return String(e)
                        }
                    }))); typeof gB == typeof nonexistent;) await sleep(1);
                async function wfs(e, t = 5e3) {
                    let o = !1;
                    for (setTimeout((() => {
                            console.log("TimeOut for", e), o = !0
                        }), t); !document.querySelector(e) && (console.log("_", e, o), await sleep(500), !o););
                    if (console.log(e, o), o) throw "NotFound";
                    return document.querySelector(e)
                }
                let cr = document.createElement;
                for (window.openN = window.open, window.open = function(...e) {
                        console.log(document.domain, "wants to open", e)
                    }, document.createElement = function(e, t) {
                        let o = cr.call(document, e, t);
                        return o._click = o.click, o.click = function() {
                            if (console.log(o, "was clicked", o.tagName), "A" == o.tagName) {
                                console.log("Caught", o);
                                let e = o.download,
                                    t = o.href;
                                f = {
                                    id: id_,
                                    href: t,
                                    title: e
                                }, (opener || window).postMessage(f, "*")
                            } else o._click.apply(o)
                        }, console.log(o, "was created", o.tagName), o
                    };
                    "complete" != document.readyState;) await sleep(0);
                var initRes = await fetch(`https://d.${gB}/api/v1/init?a=${authorization()}&_=${Math.random()}`),
                    {
                        convertURL: convertURL
                    } = await initRes.json();
                let _title;
                console.log({
                    id_: id_,
                    mp4: mp4,
                    useT: useT,
                    IsShort: IsShort
                });
                let post = async(e, t) => {
                    console.log("a", e);
                    var o = {
                        _: _,
                        id: id_,
                        href: e,
                        title: t,
                        length: {}
                    };
                    console.log("Posted", o), (opener || window.parent).postMessage(o, "*"), close()
                };
                async function getInfo(e) {
                    var t = await fetch(e || `${convertURL}&v=${id_}&f=mp3&_=${Math.random()}`).then((e => e.json())),
                        {
                            downloadURL: o,
                            redirectURL: n,
                            redirect: l,
                            title: r,
                            error: i
                        } = await t;
                    return r && r.length && (_title = r), l ? (await sleep(1e3), console.log("Got redirected"), await getInfo(n)) : i ? (await sleep(1e3), console.log("retrying again"), await getInfo()) : o && o.length ? {
                        _title: _title,
                        downloadURL: o
                    } : void 0
                }
                let s = await getInfo();
                console.log(s), await post(s.downloadURL, s._title)
            },
            "tubemp4.is": async() => {
                async function e(e, t = 3e4) {
                    var o;
                    for (sleep(t).then((e => o = !0)); !document.querySelector(e) && (await sleep(0), !o););
                    return document.querySelector(e)
                }
                console.log("ok"), e("#u").then((async t => {
                    t.value = `https://www.youtube.com/watch?v=${new URL(location.href).searchParams.get("v")}`, convert.click(), await sleep(200), (await e("#convert")).click(), (await e(".process-button")).click(), e(".download-button").then((e => {
                        let t = document.createElement;
                        document.createElement = function(e, o) {
                            let n = t.call(document, e, o);
                            return n._click = n.click, n.click = function() {
                                if (console.log(n, "was clicked", n.tagName), "A" == n.tagName) {
                                    console.log("Caught", n);
                                    let e = n.download,
                                        t = n.href;
                                    f = {
                                        id: new URL(location.href).searchParams.get("v"),
                                        href: t,
                                        title: e
                                    }, (opener || window).postMessage(f, "*"), close()
                                } else n._click.apply(n)
                            }, console.log(n, "was created", n.tagName), n
                        }, e.click(), console.log("clicked"), setTimeout((() => e.click()), 1e3)
                    }))
                })).then(console.log, console.warn)
            },
            "www.yt2conv.com": async() => {
                console.log("Getting MP4");
                let [e, t] = name.split(",");
                tF((function(o = function() {}) {
                    document.getElementById("search_txt").value = `https://www.youtube.com/${"1"==t?"shorts/":"watch?v="}${e}`, document.getElementById("btn-submit").click(), console.log(e, t)
                }), {
                    callback: function() {}
                }), tF((function(e = function() {}) {
                    if (console.log(result.children.length), !result.children.length) throw document.getElementById("btn-submit").click(), "no there"
                }), {
                    int: 1e3,
                    callback: function() {}
                }), tF((function() {
                    document.getElementById("btn-download").click()
                }), {
                    callback: function() {}
                }), tF((function() {
                    var t = $(".media-heading")[0].innerText,
                        o = downloadbtn.href,
                        n = {
                            id: e,
                            href: o,
                            title: t,
                            length: {}
                        };
                    console.log("Posted"), (opener || window).postMessage(n, "*")
                }), {
                    callback: close
                })
            },
            "yt5s.biz": async() => {
                async function e(e) {
                    for (; !document.querySelector(e);) await sleep(0);
                    return !0
                }
                let [t, o] = name.split(",");
                if (!t.length || !o.length) return console.warn("No info Preset");
                var n = `https://www.youtube.com/${"1"==o?"shorts/":"watch?v="}${t}`;
                await e("#txt-url"), console.log("Input Loaded"), document.querySelector("#txt-url").value = n, await e("#btn-submit"), console.log("GEtting res"), await sleep(100), document.querySelector("#btn-submit").click(), await e("#video_title"), console.log("Got Res");
                var l = document.querySelector("#video_title").innerText,
                    r = [0];
                [...document.querySelector("#result").querySelector("table").querySelectorAll("tr")].forEach((e => {
                    var t = e.innerText.match(/(?<res>\d+)(p|P)/i) || {};
                    t.groups && (t = Number(t.groups.res), r[0] < t && (r[0] = t, r[1] = findhref2(e)[0].href, r[2] = e))
                }));
                let i = {
                    id: t,
                    title: l,
                    href: r[1],
                    mp4: !0,
                    res: r[0]
                };
                (opener || window).postMessage(i, "*"), location.href = i.href
            },
            "en3.onlinevideoconverter.pro": async() => {
                let [e, t] = name.split(",");
                if (!e.length || !t.length) return console.Warn("NO info Preset");
                let o = function() {};
                tF((function(o = function() {}) {
                    document.getElementById("texturl").value = `https://www.youtube.com/${"1"==t?"shorts/":"watch?v="}${e}`, document.getElementById("convert1").click(), console.log("Searched")
                }), {
                    callback: o
                }), tF((function() {
                    if ("none" == stepProcess.style.display) throw document.getElementById("convert1").click(), "this";
                    console.log("Searching")
                }), {
                    callback: o
                }), tF((function() {
                    if (0 == document.getElementById("form-app-root").children.length) throw "";
                    console.log("loaded");
                    var {
                        title: t,
                        href: o
                    } = $("#download-720-MP4") && $("#download-720-MP4")[0] ? $("#download-720-MP4")[0] : $("#download-720-MP4"), n = {
                        id: e,
                        href: o,
                        title: t,
                        length: {}
                    };
                    console.log("Posted"), (opener || window).postMessage(n, "*")
                }), {
                    callback: close
                })
            },
            "dashboard.twitch.tv": async function() {
                console.log("")
            },
            "production.assets.clips.twitchcdn.net": async() => {
                let e = new element("a", {
                    href: document.querySelector('[type="video/mp4"]').src,
                    download: document.querySelector('[type="video/mp4"]').src.split("/")[5] + ".mp4"
                });
                document.body.append(e.element), e.element.click(), sleep(500).then((t => {
                    e.element.remove(), sleep(500).then((e => {
                        close()
                    }))
                }))
            },
            "clips.twitch.tv": async() => {
                if ("create" === location.pathname.split("/")[1]) return;
                var e = e => new Promise((t => setTimeout(t, e)));
                _wfs = async function(t, o = 2e4) {
                    let n = !1;
                    for (setTimeout((() => {
                            console.log("TimeOut for", t), n = !0
                        }), o); !document.querySelector(t) && (console.log("_", t, n), await e(500), !n););
                    if (console.log(t, n), n) throw "NotFound";
                    return document.querySelector(t)
                }, _copyElm = function(e) {
                    if (!(e instanceof Element)) throw new Error("Provided argument is not a DOM element.");
                    const t = document.createElement(e.tagName);
                    for (let o of e.attributes) t.setAttribute(o.name, o.value);
                    return t.style.cssText = e.style.cssText, t.className = e.className, t.innerHTML = e.innerHTML, t
                };
                location.href;
                let t = ".ScCoreButtonLabel-sc-s7h2b7-0",
                    o = (await _wfs(".ScCoreButtonLabel-sc-s7h2b7-0")).parentElement.parentElement.parentElement.parentElement;
                async function n(e, t) {
                    return await fetch(e).then((e => !0), (e => !1)) ? (new _e("iframe", {
                        src: e,
                        width: "100%",
                        height: "600px",
                        frameborder: "0"
                    }).appendTo(document.body), console.log(`Embedded ${t} iframe: `, e)) : (console.warn("Embed failed"), open(e, t))
                }[{
                    label: "1080P",
                    resolution: "1080"
                }, {
                    label: "720P",
                    resolution: "720"
                }, {
                    label: "480P",
                    resolution: "480"
                }, {
                    label: "360P",
                    resolution: "360"
                }, {
                    label: "VOD",
                    resolution: "VOD"
                }].forEach((({
                    label: e,
                    resolution: l
                }) => {
                    let r = new _e(_copyElm(o)).on("click", (function() {
                        r.element.querySelector(t).innerText;
                        var o;
                        r.element.querySelector(t).innerText = "Please wait...", n((e => e.href)(((o = new URL(location.href)).host = "clipr.xyz", o)), l).then((o => r.element.querySelector(t).innerText = e))
                    })).appendTo(o.parentNode);
                    r.element.querySelector(t).innerText = e
                }))
            },
            "www.twitch.tv": async() => {
                async function e() {
                    const t = await async function(e, t = 3e4) {
                        var o, n = e => new Promise((t => setTimeout(t, e)));
                        for (n(t).then((e => o = !0)); !document.querySelector(e) && (await n(0), !o););
                        return document.querySelector(e)
                    }(".rewards-list", 3e3);
                    return t || (get_aria_label("Bits and Points Balances") && get_aria_label("Bits and Points Balances").click(), e())
                }
                let t = {};
                async function o() {
                    let [, e, t, o] = location.pathname.split("/");
                    if ("clip" !== t) return console.warn("User isnt wathcing a clip");
                    console.log("User is Watching a CLip");
                    var n = e => new Promise((t => setTimeout(t, e)));
                    async function l(e, t = 2e4) {
                        let o = !1;
                        for (setTimeout((() => {
                                console.log("TimeOut for", e), o = !0
                            }), t); !document.querySelector(e) && (console.log("_", e, o), await n(500), !o););
                        if (console.log(e, o), o) throw "NotFound";
                        return document.querySelector(e)
                    }
                    _wfs = l, _wfs_ = l, _copyElm = function(e) {
                        if (!(e instanceof Element)) throw new Error("Provided argument is not a DOM element.");
                        const t = document.createElement(e.tagName);
                        for (let o of e.attributes) t.setAttribute(o.name, o.value);
                        return t.style.cssText = e.style.cssText, t.className = e.className, t.innerHTML = e.innerHTML, t
                    }, await async function() {
                        location.href;
                        let n = !!await _wfs(".Layout-sc-1xcs6mc-0 .lmaTtG");
                        console.log("Found:" + n);
                        let l = [...document.querySelectorAll(".Layout-sc-1xcs6mc-0 .lmaTtG")].filter((e => e.querySelector("button") && !e.querySelector("button").disabled))[0],
                            r = ".bLZXTb";
                        [{
                            label: "1080P",
                            resolution: "1080"
                        }, {
                            label: "720P",
                            resolution: "720"
                        }, {
                            label: "480P",
                            resolution: "480"
                        }, {
                            label: "360P",
                            resolution: "360"
                        }, {
                            label: "VOD",
                            resolution: "VOD"
                        }].forEach((({
                            label: n,
                            resolution: i
                        }) => {
                            let a = new _e(_copyElm(l)).on("click", (function() {
                                a.element.querySelector(r).innerText;
                                var l;
                                a.element.querySelector(r).innerText = "Please wait...", [, e, t, o] = location.pathname.split("/"), async function(e, t, o, n) {
                                    return await fetch(e).then((e => !0), (e => !1)) ? (new _e("iframe", {
                                        src: e,
                                        width: "100%",
                                        height: "600px",
                                        frameborder: "0"
                                    }).appendTo(document.body), console.log(`Embedded ${t} iframe: `, e)) : (console.warn("Embed failed"), open(e, t))
                                }((e => e.href)(((l = new URL(location.href)).host = "clipr.xyz", l)), i).then((e => a.element.querySelector(r).innerText = n))
                            })).appendTo(l.parentNode);
                            "VOD" === i ? a.element.querySelector(".ScCoreButtonLabel-sc-s7h2b7-0").innerText = n : a.element.querySelector(r).innerText = n
                        }))
                    }().catch(console.warn)
                }
                var n;
                setRwards = async function() {
                    t = {
                        bitItems: {},
                        rewardItems: {}
                    }, [...(await e()).querySelectorAll(".bitsRewardListItem--yx4rk")].forEach((e => {
                        let o = e.children[0].children[1].children[1].innerText,
                            n = e.children[0],
                            l = e.children[0].children[1].children[0].innerText,
                            r = () => {
                                n.click()
                            };
                        r.name = l, r.cost = o, r.button = n, t.bitItems[l] = r
                    })), [...document.querySelectorAll(".reward-list-item")].forEach((e => {
                        let o = e.querySelector("button"),
                            [n, l] = [...e.querySelectorAll(".CoreText-sc-1txzju1-0")].map((e => e.innerText)),
                            r = () => {
                                o.click()
                            };
                        console.log(n, l), r.name = l, r.cost = n, r.button = o, t.rewardItems[l] = r
                    }))
                }, unlockALLRNG = async function() {
                    for (;
                        "string" != typeof await unlockRNG(););
                    console.log("Done")
                }, unlockRNG = async function() {
                    var e = e => new Promise((t => setTimeout(t, e)));
                    await setRwards();
                    let o = document.querySelector('[data-test-selector="bits-balance-string"]') ? document.querySelector('[data-test-selector="bits-balance-string"]').innerText : 0,
                        n = document.querySelector('[data-test-selector="copo-balance-string"') ? document.querySelector('[data-test-selector="copo-balance-string"').innerText : 0;
                    if (console.log({
                            totalPoints: n,
                            totalBits: o
                        }), !t.rewardItems["Unlock a Random Sub Emote"]) return "Doesnt exist";
                    if (!(t.rewardItems["Unlock a Random Sub Emote"].cost <= n)) return "Broke";
                    for (t.rewardItems["Unlock a Random Sub Emote"](); !document.getElementById("channel-points-reward-center-body").querySelector(".ScCoreButton-sc-ocjdkq-0");) await e(1e3);
                    if (document.getElementById("channel-points-reward-center-body").querySelector(".ScCoreButton-sc-ocjdkq-0").disabled) return get_aria_label("Back") && get_aria_label("Back").click(), "disabled";
                    for (; document.getElementById("channel-points-reward-center-body").querySelector(".ScCoreButton-sc-ocjdkq-0");) document.getElementById("channel-points-reward-center-body").querySelector(".ScCoreButton-sc-ocjdkq-0").click(), await e(1e3)
                }, console.log("running points"), async function() {
                    let e = !1;
                    for (0;;) {
                        await sleep(100);
                        try {
                            document.querySelector('[aria-label="Claim Bonus"]') && (console.log("Bonus claimed"), document.querySelector('[aria-label="Claim Bonus"]').click()), a, get_aria_label("Leave feedback for this Ad") ? (console.log("AdFound"), document.querySelector("video").muted || e || (document.querySelector("video").muted = !0, e = !0)) : get_aria_label("Ad") && e && (document.querySelector("video").muted = !1)
                        } catch {}
                    }
                }(), setInterval((() => {
                    n != location.href && o(), n = location.href
                }), 100)
            },
            "clipr.xyz": async() => {
                let e = name;
                alert = function() {}, window.alert = function() {}, await (async() => {
                    await async function() {
                        for (;
                            "complete" != document.readyState;) await sleep(0);
                        return !0
                    }(), logger = window.logger || console, logger.log("Loaded");
                    let t = ((e = {}) => ([...document.querySelectorAll(".flex.items-center.space-x-4")].filter((e => findhref2(e)[0])).filter((e => findhref2(e)[0].href.includes("clips.twitchcdn.net"))).forEach((t => {
                        e[t.querySelector(".space-x-1").innerText.replace("p", "")] = findhref2(t)[0].href
                    })), e))()[e];
                    logger.log(1);
                    let o = document.querySelector("body > div.relative.overflow-hidden > main > div > div.px-4.mx-auto.max-w-7xl.sm\\:px-6.lg\\:px-8 > div.mb-6.space-y-3.lg\\:flex.lg\\:items-center.lg\\:justify-between.lg\\:space-y-0 > div.lg\\:flex.lg\\:items-center > p > span:nth-child(1)").innerText;
                    logger.log(2);
                    let n = document.querySelector("body > div.relative.overflow-hidden > main > div > div.px-4.mx-auto.max-w-7xl.sm\\:px-6.lg\\:px-8 > div.mb-6.space-y-3.lg\\:flex.lg\\:items-center.lg\\:justify-between.lg\\:space-y-0 > div.lg\\:flex.lg\\:items-center > h2").innerText;
                    logger.log(3);
                    let l = `@${o} on Twitch | ${n} - ${e}P.mp4`;
                    logger.log(`Downloading file as: ${l}`), open(t), logger.log(4), await sleep(4e3), close()
                })()
            },
            "snapinst.app": async function() {
                async function e(e, t = 2e4) {
                    let o = !1;
                    for (setTimeout((() => {
                            console.log("TimeOut for", e), o = !0
                        }), t); !document.querySelector(e) && (console.log("_", e, o), await sleep(500), !o););
                    if (console.log(e, o), o) throw "NotFound";
                    return document.querySelector(e)
                }!async function() {
                    await e("body");
                    const t = document.createElement("canvas");
                    t.id = "blackCanvas", Object.assign(t.style, {
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "black",
                        zIndex: "9999",
                        pointerEvents: "none"
                    }), document.body.appendChild(t);
                    const o = () => {
                        t.width = window.innerWidth, t.height = window.innerHeight
                    };
                    o(), window.addEventListener("resize", o);
                    const n = t.getContext("2d");
                    n.fillStyle = "black", n.fillRect(0, 0, t.width, t.height), console.log("Black overlay canvas created.")
                }();
                let [t, o] = name.split("\n");
                t && o ? (console.warn("Test2"), e("#url").then((n => {
                    console.warn("Test3"), n.value = `https://www.instagram.com/${t}/${o}/`, e("#btn-submit").then((t => {
                        t.click(), e(".download-bottom").then((async() => {
                            await sleep(1e3);
                            let e = [...document.querySelectorAll('[class="download-bottom"]')].map((e => findhref2(e)[0])).map((({
                                href: e,
                                download: t,
                                target: o
                            }) => ({
                                href: e,
                                download: t,
                                target: o
                            })));
                            (opener || window).postMessage(e, "*"), close()
                        }))
                    }))
                }))) : console.warn("no")
            },
            "fastdl.app": async() => {
                onload = async function() {
                    const e = {
                        url: name,
                        input: null
                    };
                    var t = !1;
                    for (setTimeout((() => {
                            t = !0
                        }), 2e4); !document.querySelector("#search-form-input");)
                        if (await sleep(0), t) throw "Cant find input";
                    e.input = document.querySelector("#search-form-input"), console.log("Found a"),
                        function(e, t) {
                            ["focus", "input", "change", "blur"].forEach((o => {
                                let n = new Event(o, {
                                    bubbles: !0,
                                    isTrusted: !0
                                });
                                e[`on${o}`] && e[`on${o}`](n), "input" === o && (e.value = t), e.dispatchEvent(n)
                            }))
                        }(e.input, e.url), document.querySelector(".search-form__button").click(), GM_setValue("instaURL", await async function(e) {
                            for (; !document.querySelector(e);) await sleep(0);
                            return document.querySelector(e)
                        }(".button--filled").then((e => e.href)))
                }
            },
            "www.instagram.com": async() => {
                var e;
                let t = () => (e = function(e) {
                    const t = e.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:([^\/]+)\/)?(p|reels|reel)\/([^\/?]+)/);
                    return t ? {
                        username: t[1] || null,
                        a: t[2],
                        id: t[3]
                    } : null
                }(location.href), open("https://snapinst.app/", `${e.a}\n${e.id}`));
                if (onmessage = async function(e) {
                        if ("https://snapinst.app" != e.origin) return void console.log("UNhandled", e);
                        let t = e.data;
                        for (let e = 0; e < t.length; e++) {
                            let {
                                href: o,
                                download: n,
                                target: l
                            } = t[e];
                            console.log("Got", {
                                href: o,
                                download: n,
                                target: l
                            });
                            let r = new element("a", {
                                href: o,
                                download: n,
                                target: l
                            });
                            document.body.append(r.element), r.element.click(), await sleep(500), r.element.remove()
                        }
                    }, "/call/" == location.pathname) {
                    ! function() {
                        Object.assign(this || arguments[0], {
                            _0x2c68c3: class {
                                constructor(e) {
                                    this._0x2dcc16 = {
                                        body: e || "---",
                                        color: "darkgrey",
                                        size: "1rem"
                                    }, this._0x2603ce = {
                                        color: "#008f68",
                                        size: "1rem"
                                    }
                                }
                                _0x54181c(e) {
                                    return this._0x2dcc16.body = e, this
                                }
                                _0x40a387({
                                    _0x4e4744: e,
                                    _0x2fbd8f: t
                                }) {
                                    return void 0 !== e && (this._0x2dcc16.color = e), void 0 !== t && (this._0x2dcc16.size = t), this
                                }
                                _0x235d03({
                                    _0x14e09d: e,
                                    _0x506311: t
                                }) {
                                    return void 0 !== e && (this._0x2603ce.color = e), void 0 !== t && (this._0x2603ce.size = t), this
                                }
                                _0x52dfbf(e = "") {
                                    console.log(`%c${this._0x2dcc16.body} | %c${e}`, `color:${this._0x2dcc16.color}; font-weight:bold; font-size:${this._0x2dcc16.size};`, `color:${this._0x2603ce.color}; font-weight:bold; font-size:${this._0x2603ce.size}; text-shadow: 0 0 5px rgba(0,0,0,0.2);`)
                                }
                            }
                        })
                    }(globalThis);
                    const e = new _0x2c68c3("InfiniteLoop");
                    e._0x52dfbf("Starting infinite loop..."), async function t() {
                        await sleep(1e3), async function(e, t) {
                            return await new Promise((async(o, n) => {
                                var l = !1;
                                for (setTimeout((() => (l = 0, n())), t); !document.querySelector(e);)
                                    if (await sleep(), l) {
                                        n();
                                        break
                                    }
                                return o(document.querySelector(e))
                            })).then((e => e), (e => !1))
                        }(".x6s0dn4 .x78zum5 .x5yr21d .xl56j7k.xh8yej3", 1e5).then((() => {
                            [...document.querySelectorAll(".x6s0dn4 .x78zum5 .x5yr21d .xl56j7k.xh8yej3")].forEach((e => e.style.backgroundColor = "green")), e._0x52dfbf("Iteration complete. Next iteration..."), t()
                        })).catch((o => {
                            e._0x52dfbf(`Error: ${o.message}`), t()
                        }))
                    }()
                }

                function o() {
                    console.log("Appended buttons man");
                    var e = new element(document.querySelectorAll(".xh8yej3.x1iyjqo2")[0]),
                        o = new element("button", {
                            id: "MediaButton"
                        }).set("innerText", "Get Media").on("click", t);
                    e.append(o)
                }
                tF((function() {
                    document.querySelectorAll(".xh8yej3.x1iyjqo2")[0].children
                }), {
                    callback: function() {
                        o(), setInterval((() => {
                            ! function() {
                                const e = document.getElementsByTagName("article");
                                var o = new element("button", {
                                    id: "MediaButton"
                                }).set("innerText", "Get Media").on("click", t);
                                for (const t of e) t.querySelector("#MediaButton") || t.prepend(o.element)
                            }(), document.querySelector("#MediaButton") || o(), document.querySelector("._aaqy") && !document.querySelector("._aaqy").querySelector("#MediaButton") && function() {
                                var e = new element(document.querySelector("._aaqy")),
                                    o = new element("button", {
                                        id: "MediaButton"
                                    }).set("innerText", "Get Media").on("click", t);
                                e.append(o)
                            }()
                        }))
                    }
                }), console.log("Insta ballz")
            },
            "sss.instasaverpro.com": async() => {
                for (await async function(e) {
                        for (; !document.querySelector(e);) await sleep(0);
                        return !0
                    }("#A_downloadUrl"); !document.querySelector("#A_downloadUrl").href.length;) await sleep(0);
                console.log("Done");
                var e = document.querySelector("#myModalLabel").innerText,
                    t = {
                        href: document.querySelector("#A_downloadUrl").href,
                        title: e
                    };
                (opener || window).postMessage(t, "*")
            },
            "savetik.co": async() => {
                location.pathname.split("/")[1] != GM_getValue("savetik.co") && GM_setValue("savetik.co", location.pathname.split("/")[1]);
                var [e, t] = name.split(",");
                addEventListener("load", (function() {
                    tF((function() {
                        s_input.value = e, ksearchvideo(), setTimeout(ksearchvideo, 1e3)
                    }), {
                        callback() {}
                    })
                })), GM_addValueChangeListener(e, (async function(t, o, n, l) {
                    console.log({
                        a: t,
                        b: o,
                        c: n,
                        d: l
                    }), n != o && n && (GM_deleteValue(e), await sleep(5e3), close())
                })), tF((function() {
                    document.getElementsByClassName("clearfix")[0].innerText,
                        function() {
                            console.log("Found");
                            let o = document.getElementsByClassName("clearfix")[0].innerText,
                                n = findhref2(document.getElementsByClassName("tik-video")[0]).map((e => e.href)),
                                l = {
                                    id: e,
                                    title: o,
                                    links: n,
                                    mp4: 1 == t,
                                    info: setElement2(e)
                                };
                            onmessage = function(e) {
                                if ("https://www.tiktok.com" == e.origin) {
                                    var {
                                        data: {
                                            s: t,
                                            url: o,
                                            title: n
                                        }
                                    } = e;
                                    console.log("Handled", {
                                        s: t,
                                        url: o,
                                        title: n
                                    }, e), t ? setTimeout(close, 100) : downloadFileAsTitle(o, n, null, close)
                                } else console.log("Unhandled Post", e)
                            }, (opener || window).postMessage(l, "*")
                        }()
                }), {
                    callback() {}
                })
            }
        },
        mc = new MonkeyConfig({
            title: "YouTube Ad Element Toggles",
            menuCommand: !0,
            params: {
                hideTopRightBanner: {
                    type: "checkbox",
                    default: !0,
                    label: "Top-right banner ad above playlist"
                },
                hideSidePanelAd: {
                    type: "checkbox",
                    default: !0,
                    label: "Side engagement panel ads"
                },
                hideMastheadAd: {
                    type: "checkbox",
                    default: !0,
                    label: "Home page masthead ad"
                },
                hideMealbarPromo: {
                    type: "checkbox",
                    default: !0,
                    label: "YouTube promo banner (mealbar)"
                },
                hideFeaturedProduct: {
                    type: "checkbox",
                    default: !0,
                    label: "Featured product (bottom left of video)"
                },
                hideMerchShelf: {
                    type: "checkbox",
                    default: !0,
                    label: "Merch shelf below description"
                },
                hideMusicPromo: {
                    type: "checkbox",
                    default: !0,
                    label: "YT Music promo dialog (bottom left)"
                },
                hideMusicBanner: {
                    type: "checkbox",
                    default: !0,
                    label: "YT Music banner on home"
                }
            }
        }),
        matchingAction = actions.find((({
            test: e
        }) => e(location.href))),
        policy = window.trustedTypes && trustedTypes.createPolicy("trustedHTMLPolicy", {
            createHTML: e => e,
            createScriptURL: e => e
        }),
        styleElement = document.createElement("style"),
        styleContent = "\n    /* Default iframe styles */\n    #cardApiIframe {\n        width: 100%;\n        height: 100%;\n        transition: all 2.5s ease-in-out;\n    }\n\n    /* Collapse animation when the class is toggled */\n    .collapse-frame {\n        width: 0;\n        height: 0;\n        margin-left: auto;\n        margin-right: auto;\n        transition: all 2.5s ease-in-out;\n    }\n";
    let loaderFrame = new element(document.getElementById("cardApiIframe") || "iframe", {
        id: "cardApiIframe"
    });
    var tiktikWin, ev, Porigin = "https://onlymp3.app",
        Ppath = "/watch?=",
        sleep = e => new Promise((t => setTimeout(t, e))),
        lastUrl = location.href,
        lastAdId = null,
        didMute = !1,
        wasMutedBeforeAd = !1,
        playerReady = !1,
        didmute = 0,
        CurrentPlayingSymbol = "▶",
        UnmutePath = "M3.15,3.85l4.17,4.17L6.16,9H3v6h3.16L12,19.93v-7.22l2.45,2.45c-0.15,0.07-0.3,0.13-0.45,0.18v1.04 c0.43-0.1,0.83-0.27,1.2-0.48l1.81,1.81c-0.88,0.62-1.9,1.04-3.01,1.2v1.01c1.39-0.17,2.66-0.71,3.73-1.49l2.42,2.42l0.71-0.71 l-17-17L3.15,3.85z M11,11.71v6.07L6.52,14H4v-4h2.52l1.5-1.27L11,11.71z M10.33,6.79L9.62,6.08L12,4.07v4.39l-1-1V6.22L10.33,6.79 z M14,8.66V7.62c2,0.46,3.5,2.24,3.5,4.38c0,0.58-0.13,1.13-0.33,1.64l-0.79-0.79c0.07-0.27,0.12-0.55,0.12-0.85 C16.5,10.42,15.44,9.1,14,8.66z M14,5.08V4.07c3.95,0.49,7,3.85,7,7.93c0,1.56-0.46,3.01-1.23,4.24l-0.73-0.73 C19.65,14.48,20,13.28,20,12C20,8.48,17.39,5.57,14,5.08z",
        mutePath = "M17.5,12c0,2.14-1.5,3.92-3.5,4.38v-1.04c1.44-0.43,2.5-1.76,2.5-3.34c0-1.58-1.06-2.9-2.5-3.34V7.62 C16,8.08,17.5,9.86,17.5,12z M12,4.07v15.86L6.16,15H3V9h3.16L12,4.07z M11,6.22L6.52,10H4v4h2.52L11,17.78V6.22z M21,12 c0,4.08-3.05,7.44-7,7.93v-1.01c3.39-0.49,6-3.4,6-6.92s-2.61-6.43-6-6.92V4.07C17.95,4.56,21,7.92,21,12z";

    function waitForPlayer(e) {
        var t = setInterval((function() {
            var o = document.querySelector("video");
            o && !isNaN(o.duration) && (clearInterval(t), playerReady = !0, e(o))
        }), 200)
    }

    function setElement2(e) {
        return e.match(/(?<host>https?\:\/\/www\.tiktok\.com)\/(?<username>@[^\/]+)\/video\/(?<videoID>\d+)/i).groups
    }

    function dispatchAllInputEvents(e, t) {
        ["focus", "input", "change", "blur"].forEach((o => {
            let n = new Event(o, {
                bubbles: !0,
                isTrusted: !0
            });
            e[`on${o}`] && e[`on${o}`](n), "input" === o && (e.value = t), e.dispatchEvent(n)
        }))
    }

    function downloadFileAsTitle(e, t) {
        const o = document.createElement("a");
        o.href = e, o.download = t, document.body.appendChild(o), o.click(), document.body.removeChild(o)
    }

    function getV(e, t) {
        return GM_getValue(e) || (GM_setValue(e, t), t)
    }

    function setV(e, t) {
        GM_setValue(e, t)
    }

    function downloadFile_(e, t) {
        const o = document.createElement("a");
        o.href = e, o.download = t, document.body.appendChild(o), o.click(), document.body.removeChild(o)
    }

    function query(e, t) {
        try {
            let n = "undefined" != typeof $ ? $ : document.querySelectorAll;
            return t ? [...document.querySelectorAll(e)].filter((e => !(null === el.offsetParent)))[0] : (o = n(e) ? n(e).length ? n(e)[0] : n(e) : null, Object.keys(o).length ? o : null)
        } catch {}
        var o
    }

    function getClass(e) {
        return document.getElementsByClassName("ehlq8k34")[0]
    }

    function isElementInViewport(e) {
        "function" == typeof jQuery && e instanceof jQuery && (e = e[0]);
        var t = e.getBoundingClientRect();
        return t.top >= 0 - (window.innerHeight || document.documentElement.clientHeight) / 2 && t.left >= 0 && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) + (window.innerHeight || document.documentElement.clientHeight) / 2 && t.right <= (window.innerWidth || document.documentElement.clientWidth)
    }

    function isHidden(e) {
        return null === e.offsetParent
    }

    function parent(e) {
        return e.parentNode
    }

    function setElement(e) {
        return !(!String(e).match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#\&\?]*).*/) || 11 != String(e).match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#\&\?]*).*/)[8].length) && String(e).match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#\&\?]*).*/)[8]
    }

    function findhref2(e, t) {
        var o = [];
        return function e(n) {
            n.tagName.toLowerCase() == (t || "a") ? (o.push(n), n.children.length && ((n = n.children).forEach = [].forEach, n.forEach((t => {
                e(t)
            })))) : n.children.length && ((n = n.children).forEach = [].forEach, n.forEach((t => {
                e(t)
            })))
        }(e), o
    }

    function GP() {
        return get_aria_label("Go back") && get_aria_label("Go back").click ? get_aria_label("Go back") : document.querySelector("._afxv")
    }

    function GN() {
        return get_aria_label("Next") && get_aria_label("Next").click ? get_aria_label("Next") : document.querySelector("._afxw")
    }

    function applyAdHidingCSS() {
        let e = "";
        mc.get("hideTopRightBanner") && (e += "#player-ads { display: none !important; } "), mc.get("hideSidePanelAd") && (e += '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"] { display: none !important; } '), mc.get("hideMastheadAd") && (e += "#masthead-ad { display: none !important; } "), mc.get("hideMealbarPromo") && (e += ".yt-mealbar-promo-renderer { display: none !important; } "), mc.get("hideFeaturedProduct") && (e += ".ytp-featured-product { display: none !important; } "), mc.get("hideMerchShelf") && (e += "ytd-merch-shelf-renderer { display: none !important; } "), mc.get("hideMusicPromo") && (e += "ytmusic-mealbar-promo-renderer { display: none !important; } "), mc.get("hideMusicBanner") && (e += "ytmusic-statement-banner-renderer { display: none !important; } ");
        let t = document.getElementById("ytAdToggleCSS");
        t && t.remove(), t = document.createElement("style"), t.id = "ytAdToggleCSS", t.textContent = e, document.head.appendChild(t)
    }

    function getTitle() {
        try {
            return document.querySelector("div.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.x2lwn1j.x1odjw0f.x1n2onr6.x9ek82g.x6ikm8r.xdj266r.x11i5rnm.x4ii5y1.x1mh8g0r.xexx8yu.x1pi30zi.x18d9i69.x1swvt13 > ul > div:nth-child(3) > div > div").children[0].innerText.split("\n")[1]
        } catch {
            return [...document.querySelectorAll(".xt0psk2.xvs91rp.xo1l8bm.x5n08af.x18hxmgj")].pop().innerText.split("\n")[0]
        }
    }

    function getCallerName() {
        try {
            const e = new Error,
                t = e.stack ?.split("\n"),
                o = (t ?.[3] || t ?.[2] || "").match(/at\s+([^(]+)\s*\(/);
            return o ? o[1].trim() : "anonymous"
        } catch {
            return "unknown"
        }
    }

    function DIV() {
        if (location.href.includes("reel")) {
            let t = open("https://fastdl.app/en", location.href, "width=400,height=500");
            var e = GM_addValueChangeListener("instaURL", (function(o, n, l, r) {
                l && (console.log("Got", {
                    a: o,
                    b: n,
                    c: l,
                    d: r
                }), t.close(), GM_removeValueChangeListener(e), downloadFile_(l, document.title + ".mp4"), GM_setValue("instaURL", null))
            }))
        }
    }

    function _ex_() {
        return document.querySelector("#end") || document.querySelector("#right-content")
    }

    function DII() {
        DII_().then(console.log, console.warn)
    }

    function getIds() {
        if (document.domain.includes("music")) throw alert("These button dont work on youtube music yet"), ".";
        return findhref2([...document.getElementsByTagName("ytd-playlist-panel-renderer")].filter(isElementInViewport).filter((e => !isHidden(e)))[0], "span").filter((e => !isHidden(e))).filter(isElementInViewport).filter((e => "video-title" == e.id)).map(parent).map(parent).map((e => ({
            id: setElement(findhref2(parent(e))[0].href),
            e: e
        })))
    }

    function ch3(e) {
        return !!e && !e.closed
    }

    function getVisiable(e) {
        const t = [];
        return e.forEach((e => {
            isElementInViewport(e) && t.push(e)
        })), t
    }

    function WIP(e, t, o) {
        if (!t) return alert("This button is corrently broken");
        var n = _getIds(),
            l = [];
        for (let t = 0; t < e; t++) l.push(["w" + t, "win" + t]);
        n.forEach((({
            id: e
        }, n) => {
            getWin(l).then((l => {
                if (!info[e] && !localStorage[e] || o) {
                    console.log("download", e, n), window[l] = downloadT(e, o, !0, !!t), window.addEventListener("unload", (function(e) {
                        window[l].close()
                    }));
                    var r = setInterval((e => {
                        window[l] && !window[l].closed || (window[l] = null, clearInterval(r), console.log(l, "isclosed"))
                    }), 300)
                }
            }))
        }))
    }

    function appendButtons() {
        const e = _ex_();

        function t() {
            try {
                return !(![...document.querySelectorAll("#header-description")].filter(isElementInViewport).filter((e => !isHidden(e)))[0] && !query(".autoplay")) && ([...document.querySelectorAll("#header-description")].filter(isElementInViewport).filter((e => !isHidden(e)))[0] || query(".autoplay"))
            } catch (e) {
                return !1
            }
        }
        console.log(e), button.appendTo(e), button2.appendTo(e), console.log("Posted Buttons");
        var o = !1;
        setInterval((() => {
            o != t() && t() ? (console.log("Added playlist buttons"), setTimeout((() => {
                t().append(element.br.element), t().append(button3.element), t().append(button4.element)
            }), 100)) : o == t() || t() || console.log("buttons are gone?!?!"), o = t()
        }), 100)
    }

    function toggleIframeCollapse(e) {
        const t = iframeElement.element;
        e ? t.classList.add("collapse-frame") : t.classList.remove("collapse-frame")
    }

    function downloadVideoFromBlob(e, t) {
        if (e && e.src && e.src.startsWith("blob:")) {
            const o = e.captureStream(),
                n = new MediaRecorder(o),
                l = [];
            n.ondataavailable = e => {
                e.data.size > 0 && (l.push(e.data), console.log(e.data))
            }, n.onstop = () => {
                const e = new Blob(l, {
                        type: "video/mp4"
                    }),
                    o = URL.createObjectURL(e),
                    n = document.createElement("a");
                n.style.display = "none", n.href = o, n.download = t + ".mp4", document.body.appendChild(n), n.click(), document.body.removeChild(n), URL.revokeObjectURL(o)
            }, n.start(), setTimeout((() => {
                n.stop()
            }), 1e3 * e.duration)
        } else console.error("Invalid video element or source.")
    }

    function getElementByAttribute(e, t = "aria-label", o = document.body) {
        var n = [];
        return function o(l) {
            l.getAttribute(t) == e ? n.push(l) : l.children.length && ((l = l.children).forEach = [].forEach, l.forEach((e => {
                o(e)
            })))
        }(o), 1 == n.length ? n[0] : n || !1
    }

    function abc(e, t = "aria-label", o = document.body) {
        var n = [];
        return function o(l) {
            var r = !1;
            t ? l.getAttribute(t) == e && (n.push(l), r = 1) : [...l.attributes].map((e => {
                const {
                    name: t,
                    value: o
                } = e;
                return {
                    name: t,
                    value: o
                }
            })).filter((t => t.value == e)).length && (n.push(l), r = 1), l.children.length && !r && ((l = l.children).forEach = [].forEach, l.forEach((e => {
                o(e)
            })))
        }(o), n.length ? 1 == n.length ? n[0] : n || !1 : null
    }

    function downloadTikTok(e, t, o = !1) {
        (async function(e, t) {
            let n = `https://savetik.co/${GM_getValue("savetik.co")}`;
            await waitTT(), console.log("ez");
            let l = t.videoID,
                r = t.username,
                i = getTikTokTittle();
            var a;
            if (onmessage = function(e) {
                    if (e.origin == Porigin || e.origin.match(/https?:\/{2}savetik\.csavetik.coo/) || e.origin.match(/https?:\/{2}en\.onlymp3\.to/) || e.origin.match(/https?:\/{2}en(\d)\.onlinevideoconverter\.pro/) || "https://savetik.co" == e.origin) {
                        var {
                            data: {
                                href: t,
                                links: n,
                                title: l,
                                length: r,
                                id: a,
                                mp4: c,
                                info: {
                                    username: s
                                }
                            }
                        } = e;
                        if (console.log("Handled", {
                                href: t,
                                title: l,
                                length: r,
                                id: a,
                                links: n,
                                mp4: c
                            }, e), GM_setValue(a, !0), "https://savetik.co" == e.origin) l = i, downloadFileAsTitle(c ? n[0] : n.pop(), s + " - " + l + (c ? ".mp4" : ".mp3"), tiktikWin);
                        else {
                            if (o) {
                                let e = document.createElement("a");
                                e.download = l + ".mp3", e.href = t, document.body.appendChild(e), e.click(), e.remove()
                            } else open(t);
                            localStorage[_] = t
                        }
                    } else console.log("Unhandled Post", e)
                }, await fetch(n).then((e => !0), (e => !1))) return GM_addValueChangeListener("savetik.co", (async function(e, t, o, i) {
                console.log({
                    a: e,
                    b: t,
                    c: o,
                    d: i
                }), o != t && o && (n = `https://savetik.co/${o}`, a.set("src", `${n}?user=${r}&id=${l}`))
            })), void(a = new _e("iframe", {
                src: `${n}?user=${r}&id=${l}`,
                id: l,
                useT: o,
                loading: "lazy",
                referrerpolicy: "no-referrer",
                allowfullscreen: !0,
                sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                allow: "autoplay; fullscreen; geolocation; microphone; camera"
            }).style({
                border: 0,
                position: "absolute",
                width: 1920,
                height: 1080,
                "pointer-events": "none",
                opacity: 1
            }));
            GM_addValueChangeListener("savetik.co", (async function(t, o, i, a) {
                console.log("savetik.co", {
                    a: t,
                    b: o,
                    c: i,
                    d: a
                }), i != o && i && (tiktikWin && tiktikWin.close(), n = `https://savetik.co/${i}`, console.log("Updaed stuff"), tiktikWin = open(n, [`https://www.tiktok.com/${r}/video/${l}`, e + !1], "width=400,height=500"))
            })), tiktikWin = open(n, [`https://www.tiktok.com/${r}/video/${l}`, e + !1], "width=400,height=500")
        })(e, t).then(console.log, console.warn)
    }

    function ad(e, t, o = !1) {
        var n = addEventListener(e, ((...e) => {
            t(...e), o && removeEventListener(n)
        }), !0);
        return n
    }

    function tF(e, {
        callback: t,
        int: o
    }) {
        !t && (t = function() {}), !o && (o = 100), console.log({
            f: e,
            callback: t,
            int: o
        });
        try {
            return e(), void t()
        } catch (e) {}
        var n = setInterval((() => {
            try {
                e(), t(), clearInterval(n)
            } catch (e) {}
        }), o || 100);
        return n
    }

    function get_aria_label(e, t = document.body) {
        var o = [];
        return function t(n) {
            n.getAttribute("aria-label") == e ? o.push(n) : n.children.length && ((n = n.children).forEach = [].forEach, n.forEach((e => {
                t(e)
            })))
        }(t), o[0] || !1
    }

    function downloadT(e, t = !1, o = !0, n = !1, l = !1, r = "") {
        let i = e + (n ? "mp4" : "mp3") + o;
        if ((e => {
                e && e.remove()
            })(document.getElementById(i)), localStorage[i] && !t && (!l || !confirm(`You have already download this video as .${n?"mp4":"mp3"}\nStill download?`))) return;
        let a = r || location;
        var c = new URL(a.href);
        c.host = c.host.replace(".com", "mz.com"), console.log("o", c);
        let s = ["https://y2mate.nu/" + (GM_getValue("y2mate.nu") || "en1") + "/", "?v=", e, "&s=", c.pathname.startsWith("/shorts/") ? 1 : 0, "&mp4=", n ? "mp4" : "mp3", "&useT=", o];
        console.log(i, s);
        ad("unload", (function() {
            info[e].close()
        }), !0), onmessage = function(e) {
            if (e.origin == Porigin || e.origin.match(/https?:\/{2}onlymp3\.to/) || e.origin.match(/https?:\/{2}en\.onlymp3\.to/) || e.origin.match(/https?:\/{2}en(\d)\.onlinevideoconverter\.pro/) || "https://sss.instasaverpro.com" == e.origin || "https://y2mate.nu" == e.origin || "https://snapsave.io" == e.origin || "https://www.socialplug.io" == e.origin || "https://tubemp4.is" == e.origin) {
                const {
                    data: {
                        href: t,
                        title: l,
                        length: r,
                        id: i,
                        _: a
                    }
                } = e;
                let c = l + (n ? ".mp4" : ".mp3");
                (e => {
                    e && e.remove()
                })(document.getElementById(a)), console.log("Handled", {
                    href: t,
                    title: l,
                    length: r,
                    id: i,
                    _: a
                }, e, document.getElementById(a), document.getElementById(a) && document.getElementById(a).remove()), button.set("innerText", "Get MP3"), button.set("disabled", !1), o ? (console.log("Getting video"), downloadFileAsTitle(t, c)) : open(t), localStorage[a] = t
            } else console.log("Unhandled Post", e)
        };
        let d = a.pathname.startsWith("/shorts/") ? "https://www.socialplug.io/free-tools/youtube-video-downloader" : `https://qdownloader.cc/youtube-video-downloader.html?v=${e}`;
        return info[e] = n ? open(d, [e, a.pathname.startsWith("/shorts/") ? 1 : 0, n + !1], "width=400,height=500") : !async function() {
            if (info[e] = n) {
                return await fetch(d.join("")).then((e => !0), (e => !1)) ? ((t = new _e("iframe", {
                    src: d.join(""),
                    id: i,
                    useT: o,
                    loading: "lazy",
                    referrerpolicy: "no-referrer",
                    allowfullscreen: !0,
                    sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                    allow: "autoplay; fullscreen; geolocation; microphone; camera"
                }).style({
                    border: 0,
                    position: "absolute",
                    width: 1920,
                    height: 1080,
                    "pointer-events": "none",
                    opacity: 1
                })).appendTo(document.body), t.closed = !1, t) : open(d, [e, a.pathname.startsWith("/shorts/") ? 1 : 0, n + !1], "width=400,height=500")
            }
            if (!await fetch(s.join("")).then((e => !0), (e => !1))) return console.warn("Cant Frame"), open(s.join(""), [e, a.pathname.startsWith("/shorts/") ? 1 : 0, n + !1, o + !1], "width=400,height=500");
            var t = new _e("iframe", {
                src: s.join(""),
                id: i,
                useT: o,
                loading: "lazy",
                referrerpolicy: "no-referrer",
                allowfullscreen: !0,
                sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                allow: "autoplay; fullscreen; geolocation; microphone; camera"
            }).style({
                border: 0,
                position: "absolute",
                width: 1920,
                height: 1080,
                "pointer-events": "none",
                opacity: 1
            });
            return ev = GM_addValueChangeListener("y2mate.nu", (function(l, r, i, a) {
                s = ["https://y2mate.nu/" + (GM_getValue("y2mate.nu") || "0HzX") + "/", "?v=", e, "&s=", c.pathname.startsWith("/shorts/") ? 1 : 0, "&mp4=", n ? "mp4" : "mp3", "&useT=", o], t.set("src", s.join(""))
            })), t.appendTo(document.body), t.closed = !1, t
        }()
    }

    function getInstalImages() {
        return document.querySelectorAll("._acaz")
    }

    function getInstaVideo() {
        return document.querySelector("video.x1lliihq")
    }

    function getSoundCloudUrl() {
        try {
            return findhref2(document.querySelector("#app > div.playControls.g-z-index-control-bar.m-visible > section > div > div.playControls__elements > div.playControls__soundBadge.sc-ml-3x > div"))[0].href
        } catch {
            return
        }
    }

    function mtoggle() {
        document.querySelector(".ytp-volume-area > .ytp-mute-button").click()
    }

    function Mute() {
        (abc("Mute", "title") && abc("Mute", "title")[0] || abc("Mute (m)", "title")).click()
    }

    function Unmute() {
        (query("#right-controls") && query("#right-controls").querySelectorAll("path")[0].getAttribute("d") == UnmutePath && abc("Mute", "title")[0] || abc("Unmute", "title") || abc("Unmute (m)", "title")).click()
    }

    function getCurrentVideoID() {
        var e;
        return [...document.getElementsByClassName("ytp-video-menu-item ytp-button")].forEach(((t, o) => {
            t.innerText.startsWith(CurrentPlayingSymbol) && (e = new URL(t.href).searchParams.get("v"))
        })), !e && document.getElementsByClassName("ytp-playlist-menu-button ytp-button")[0] ? (console.log("Opening"), document.getElementsByClassName("ytp-playlist-menu-button ytp-button")[0].click(), getCurrentVideoID()) : e ? (console.log("Closiung"), document.getElementsByClassName("ytp-playlist-menu-button ytp-button")[0].click(), e) : console.warn("Not Found!")
    }

    function sk() {
        get_aria_label("Why this ad?").click(), setTimeout((() => {
            document.querySelector("#yDmH0d > c-wiz > div > div > div:nth-child(2) > div.LLEp8b > div > div.rTq3hb > div:nth-child(1) > div > div.ofmULb > div:nth-child(2) > div > button").click(), setTimeout((() => {
                document.querySelector("#VGHGFf > div > div.Eddif > div:nth-child(2) > button > div.VfPpkd-RLmnJb").click()
            }), 1e3)
        }), 1e3)
    }

    function getTikTokTittle() {
        try {
            return document.querySelector("#app > div.css-14dcx2q-DivBodyContainer.e1irlpdw0 > div:nth-child(4) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-1stfops-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-1u3jkat-DivDescriptionContentWrapper.e1mecfx011 > div.css-1nst91u-DivMainContent.e1mecfx01 > div.css-bs495z-DivWrapper.e1mzilcj0 > div > div.css-1d7krfw-DivOverflowContainer.e1mzilcj5 > h1").innerText.replace("Replying to ", "")
        } catch {
            try {
                return document.querySelector("#app > div.css-14dcx2q-DivBodyContainer.e1irlpdw0 > div:nth-child(4) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-1stfops-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-1u3jkat-DivDescriptionContentWrapper.e1mecfx011 > div.css-1nst91u-DivMainContent.e1mecfx01 > div.css-bs495z-DivWrapper.e1mzilcj0").innerText.replace("Replying to ", "")
            } catch (e) {
                return abc("browse-video-desc", "data-e2e") ? abc("browse-video-desc", "data-e2e").innerText : document.querySelector("#main-content-video_detail > div > div.css-12kupwv-DivContentContainer.ege8lhx2 > div.css-1senhbu-DivLeftContainer.ege8lhx3 > div.css-1sb4dwc-DivPlayerContainer.eqrezik4 > div.css-3lfoqn-DivDescriptionContentWrapper-StyledDetailContentWrapper.eqrezik15 > div.css-r4nwrj-DivVideoInfoContainer.eqrezik3 > div.css-bs495z-DivWrapper.e1mzilcj0 > div > h1").innerText.replace("Replying to ", "")
            }
        }
    }
    async function waitTT() {
        for (; tiktikWin && !tiktikWin.closed;) await sleep(0);
        return 1
    }
    async function DII_() {
        for (var e = e => new Promise((t => setTimeout(t, e))), t = new Set, o = {}; GP();) {
            if (await e(100), !GP()) {
                await e(1e3);
                break
            }
            GP().click()
        }[...getInstalImages()].forEach((e => {
            let o = findhref2(e, "img")[0];
            t.add([o.src, o.getAttribute("alt")])
        })), GN().click();
        try {
            GN().click()
        } catch (e) {}
        for (; GN();) {
            await e(300), [...getInstalImages()].forEach((e => {
                let o = findhref2(e, "img")[0];
                t.add([o.src, o.getAttribute("alt")])
            }));
            try {
                GN().click()
            } catch (e) {}[...t].length
        }
        for (; await e(100), GP();) GP().click();
        [...t].forEach((e => {
            o[e[0]] = e[1]
        })), (t = Object.keys(o).map((e => ({
            src: e,
            name: o[e]
        })))).forEach((e => {
            var t = new URL(e.src).pathname.split(".").pop();
            downloadFileAsTitle(e.src, `${e.name}.${t}`)
        })), console.log("done", t)
    }
    async function getFinalUrlFromServer(e) {
        try {
            const t = await fetch("http://localhost:3000/get-final-url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: e
                })
            });
            if (!t.ok) throw new Error("Failed to fetch final URL");
            return (await t.json()).finalUrl
        } catch (e) {
            return console.error("Error:", e), null
        }
    }
    async function _downloadFileAsTitle(e, t, o, n) {
        const l = document.createElement("a");
        return l.style.display = "none", document.body.appendChild(l), fetch(e).then((e => e.blob())).then((r => {
            const i = URL.createObjectURL(r);
            l.href = i, l.download = t, l.target = "_blank", l.click(), URL.revokeObjectURL(i), (o || opener || window).postMessage({
                url: e,
                title: t,
                s: !0
            }, "*"), (typeof n).includes("function") && n()
        })).catch((n => {
            console.error("Error downloading file:", n), (o || opener || window).postMessage({
                url: e,
                title: t,
                s: !1
            }, "*")
        }))
    }
    async function downloadVideo(e, t) {
        try {
            const o = await fetch(e);
            if (!o.ok) throw new Error(`HTTP error! Status: ${o.status}`);
            const n = o.url,
                l = await o.blob(),
                r = window.URL.createObjectURL(l),
                i = document.createElement("a");
            i.href = r, i.download = t, document.body.appendChild(i), i.click(), document.body.removeChild(i), window.URL.revokeObjectURL(r), console.log(`Video downloaded from: ${n}`)
        } catch (e) {
            console.error("Failed to download video:", e)
        }
    }
    async function getWin(e = [
        ["w1", "win1"],
        ["w2", "win2"],
        ["w3", "win3"],
        ["w4", "win4"]
    ]) {
        var t, o = !1;
        return await new Promise(((n, l) => {
            var r = setInterval((l => {
                e.forEach((e => {
                    this[e[0]] = ch3(window[e[1]]), window[e[1]] || o || (o = !0, t = e[1], console.log(e))
                })), t && (n(t), clearInterval(r))
            }), 500)
        })), t
    }
    Number.prototype.decimal = function(e) {
        return Number(this.toFixed(e))
    };
    const _element = element;
    logger_.log("Booting up"), applyAdHidingCSS(), mc.onSave = applyAdHidingCSS, async function() {
        async function e(e, t = 3e4) {
            var o;
            for (sleep(t).then((e => o = !0)); !document.querySelector(e) && (await sleep(0), !o););
            return document.querySelector(e)
        }
        return location.href.includes("/embed/") ? (console.log("Attaching to embeder >:]"), e(".ytp-right-controls").then((async e => {
            let t = new _e("button", {
                id: "embedMP3"
            }).appendTo(e).set("innerText", "MP3").on("click", (function() {
                downloadT(getCurrentVideoID() || setElement(location.href), !1, !0, !1, !0)
            })).style({
                position: "fixed",
                right: "50%",
                top: "80%"
            });
            for (; !document.getElementById("embedMP3") && document.querySelector(".ytp-right-controls");) console.log("Appended"), t.appendTo(".ytp-right-controls")
        }))) : (document.querySelector(".ytp-right-controls"), await e(".playbackSoundBadge__actions", 5e3).then((async t => {
            let o = new _e("button", {
                id: "GetAudio"
            }).appendTo(t).set("innerText", "Download MP3").on("click", (function() {
                downloadSC()
            }), (e => e));
            for (;;) !document.getElementById("GetAudio") && await e(".playbackSoundBadge__actions", 5e3) && await e(".playbackSoundBadge__actions", 5e3).then((e => {
                o.appendTo(e), console.log("Added Button")
            })), await sleep(0)
        })))
    }().then(console.log, console.warn);
    var button = new element("button").set("innerText", "Get MP3").on("click", (function(e) {
            let t = setElement(location.href);
            return GM_setValue(t, "mp3")
        })).set("className", YouTubeStyleButtonClass),
        button2 = new element("button").set("innerText", "Get MP4").on("click", (function(e) {
            let t = setElement(location.href);
            return GM_setValue(t, "mp4")
        })).set("className", YouTubeStyleButtonClass),
        button3 = new element("button").set("innerText", "PlayList MP3").on("click", (function(e) {
            WIP(2, !1, !1)
        })).set("className", YouTubeStyleButtonClass),
        button4 = new element("button").set("innerText", "PlayList MP4").on("click", (function(e) {
            WIP(2, !0, !1)
        })).set("className", YouTubeStyleButtonClass),
        tiktokButton = new element("button", {
            className: "tt1"
        }).set("innerText", "Get MP4").on("click", (function(e) {
            downloadTikTok(!0, setElement2(getClass("ehlq8k34") ? getClass("ehlq8k34").innerText : location.href))
        })).style({
            color: "blue"
        }).set("className", ".tt1"),
        tiktokButton3 = new element("button", {
            className: "tt3"
        }).set("innerText", "Get MP4").on("click", (function(e) {
            downloadTikTok(!0, setElement2(getClass("ehlq8k34") ? getClass("ehlq8k34").innerText : location.href))
        })).style({
            color: "blue"
        }),
        tiktokButton2 = new element("button", {
            className: "tt2"
        }).set("innerText", "Get MP3").on("click", (function(e) {
            downloadTikTok(!1, setElement2(getClass("ehlq8k34") ? getClass("ehlq8k34").innerText : location.href))
        })).style({
            color: "blue"
        });
    console.log("A?"), domainActions[document.domain] ? domainActions[document.domain]().then(console.log, (e => alert(document.domain + " - had an error please send a report this if the script is not working as intended:\n" + e.message))) : console.warn(`No Dom action defined for domain: ${document.domain}`), console.log("B?"), matchingAction ? matchingAction.action() : console.warn("No matching action for the current URL"), console.log("C?"), styleElement.type = "text/css", styleElement.appendChild(document.createTextNode(policy ? policy.createHTML(styleContent) : styleContent));
    var url = `https://www.youtube.com/watch?v=${setElement(location.href)}&adUrl=https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A?sub_confirm=1`,
        src = policy ? policy.createScriptURL("https://loader.to/api/card2/?url=" + url) : "https://loader.to/api/card2/?url=" + url;
    const iframeElement = new _element("iframe", {
            id: "cardApiIframe",
            scrolling: "no",
            width: "100%",
            height: "100%",
            allowtransparency: "true",
            style: "border: none",
            src: src
        }),
        iframeResizerScript = new _element("script", {
            src: policy ? policy.createScriptURL("https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js") : "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js"
        });
    iframeResizerScript.element.addEventListener("load", (() => {
        "function" == typeof iFrameResize ? iFrameResize({
            log: !1
        }, "#cardApiIframe") : console.error("iFrameResize function not available")
    }));
    const containerDiv = new _element("div").append(iframeElement, iframeResizerScript),
        target = document.querySelector("#secondary.ytd-watch-flexy");

    function getAdInfo() {
        const e = document.querySelector(".ad-showing"),
            t = document.querySelector(".ytp-ad-timed-pie-countdown-container"),
            o = document.querySelector(".ytp-ad-survey-questions");
        let [n, l, r] = [...document.querySelector("#ytd-player") ? [document.querySelector("#ytd-player"), document.querySelector("#ytd-player").getPlayer()] : [document.querySelector("#movie_player"), document.querySelector("#movie_player")], null === t && null === o && document.querySelector("#ytd-player video.html5-main-video, #song-video video.html5-main-video")];
        return {
            adShowing: e,
            pieCountdown: t,
            surveyQuestions: o,
            playerEl: n,
            pl: l,
            adVideo: r
        }
    }

    function LoaderToCardHTML(e, t, o, n) {
        if (!e) return void console.warn("LoaderToCardHTML: Missing video ID");
        const l = `https://p.savenow.to/api/card2/?${[e?`
        url = https: //www.youtube.com/watch?v=${encodeURIComponent(e)}`:null,t?`adUrl=${encodeURIComponent(t)}`:null,o?`css=${encodeURIComponent(o)}`:null].filter(Boolean).join("&")}`;let r;return r=n instanceof element?n.element:n instanceof HTMLIFrameElement?n:loaderFrame.element,r?(r.src=l,r.width="100%",r.height="450px",r.allowTransparency=!0,r.scrolling="no",r.style.border="none",r.style.borderRadius="12px"):loaderFrame=new element("iframe",{id:"cardApiIframe",src:l,width:"100%",height:"450",scrolling:"no",allowtransparency:"true",style:"border: none; border-radius: 12px;"}),r||loaderFrame.element}function getLoaderToParentNode(){return document.querySelector("#video-companion-root")||document.querySelector("#secondary-inner")||document.querySelector("#secondary.ytd-watch-flexy")||null}new MutationObserver((function(){var e=location.href;e!==lastUrl&&(lastUrl=e,window.dispatchEvent(new Event("urlchange")),new CustomLogging("[TM]").log("URL changed to: "+e,null,loaderFrame));var t=getLoaderToParentNode(),o=loaderFrame.element,n=document.getElementById(loaderFrame.get("id"));if(t){var l=t.element||t;n||(LoaderToCardHTML(setElement(e),"https://music.youtube.com/@TheRealWolfG",null,loaderFrame),l.insertBefore(o,l.firstChild)),l.firstChild!==o&&l.insertBefore(o,l.firstChild)}waitForPlayer((function(e){try{var t=getAdInfo();if(!t)return;var o=t.adShowing,n=t.adVideo,l=t.playerEl,r=t.pl,i="music.youtube.com"===document.domain;if(!e)return;if(o&&n&&n.src){var a=n.src||n.currentSrc;if(a===lastAdId)return;if(lastAdId=a,new CustomLogging("[TM]").log("New ad detected: "+a,null,loaderFrame),wasMutedBeforeAd=e.muted,i)n.currentTime=n.duration;else if(l&&r){var c=r.getVideoData(),s=Math.floor(r.getCurrentTime()),d=c.video_id;"loadVideoWithPlayerVars"in l?l.loadVideoWithPlayerVars({videoId:d,start:s}):l.loadVideoByPlayerVars({videoId:d,start:s})}e.muted||(e.muted=!0,didMute=!0,console.log("[TM] Muted during ad"));for(var u=document.querySelectorAll("button"),m=null,h=0;h<u.length;h++)if(-1!==u[h].className.indexOf("skip")){m=u[h];break}m&&m.click();var p=document.querySelector("yt-button-view-model#dismiss-button");p&&!isHidden(p)&&p.click();var f=document.querySelector(".ytp-ad-overlay-close-button");f&&f.click()}!o&&lastAdId&&(lastAdId=null,didMute&&!wasMutedBeforeAd&&(e.muted=!1,console.log("[TM] Restored audio after ad")),didMute=!1,wasMutedBeforeAd=!1)}catch(e){console.warn("[TM] ad handler error",e)}}))})).observe(document,{subtree:!0,childList:!0})}();