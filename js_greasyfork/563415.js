// ==UserScript==
// @name           Disney+ Subtitles Downloader Improved
// @name:fr        Disney+ Subtitles Downloader Improved
// @namespace      https://greasyfork.org/users/572942-stegner
// @homepage       https://greasyfork.org/scripts/404223-disney-subtitles-downloader
// @description    Download subtitles from Disney+
// @description:fr Télécharger les sous-titres de Disney+
// @version        2.16
// @author         stegner
// @license        MIT; https://opensource.org/licenses/MIT
// @match          https://www.disneyplus.com/*
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @connect        *.dssott.com
// @connect        *.dssedge.com
// @connect        *.disney.com
// @connect        *.disneyplus.com
// @require        https://cdn.jsdelivr.net/npm/jszip@3.5.0/dist/jszip.min.js
// @require        https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/563415/Disney%2B%20Subtitles%20Downloader%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/563415/Disney%2B%20Subtitles%20Downloader%20Improved.meta.js
// ==/UserScript==

(function(open, send) {
    'use strict';

    var debug = (location.hash === "#debug");
    var MAX_RETRIES = 5;

    // Encapsulated state - no longer pollutes document object
    var state = {
        initialized: false,
        langs: [],
        segments: "",
        wait: false,
        m3u8found: false,
        url: null,
        baseurl: "",
        oldlocation: null,
        filename: "",
        episode: "",
        downloadall: false,
        downloadid: 0,
        waitsub: false,
        segid: 0,
        vttlist: [],
        globalization: null,
        langid: 0,
        forced: false,
        waitInterval: null,
        handleinterval: null,
        downloadinterval: null,
        zip: null,
        audios: []
    };

    debuglog("Script loaded : Disney+ Subtitles Downloader");

    function init() {
        debuglog("Document state : " + document.readyState);
        if (document.readyState === "complete" || document.readyState === "loaded") {
            start();
            debuglog("Already loaded");
        } else {
            window.addEventListener("load", start, false);
            debuglog("Onload method : addEventListener");
        }
        state.initialized = true;
    }

    function start() {
        debuglog("start");
        initsub();
        listensend();
        state.handleinterval = setInterval(buttonhandle, 100);
    }

    if (!state.initialized) {
        init();
    }

    function initsub() {
        debuglog("initsub");
        state.langs = [];
        state.segments = "";
        state.wait = false;
        state.m3u8found = false;
        state.url = null;
        state.oldlocation = null;
        state.filename = "";
        state.episode = "";
        state.downloadall = false;
        state.downloadid = 0;
        state.waitsub = false;
        state.segid = 0;
        state.vttlist = [];

        // Add download icon
        document.styleSheets[0].addRule('#subtitleTrackPicker > div:before', 'content:"";color:#fff;padding-right:25px;padding-top:2px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAIGNIUk0AAHonAACAgwAA+mQAAIDSAAB2hgAA7OkAADmeAAAV/sZ+0zoAAAE4SURBVHja1JS7LkRRFIa/M6aYRCEuCUEUgihFBolGVGqiFY1ConfpNB7CiygUGm8hOiMukwiCCMl8mj2xc5yZM8M0/mTlrLP2v75zydo7UclRL3AGlIAl4L6ZuUC+5oEZYBoo55lbAdai/LPTwFongG3pfwI3gZ3ovhjlXVG+BWz/6FbjKPuto1CbjWoLobYf1RZjRho4pt5F5g11QK2F6FFXo/UXdbwZEHVQvY2aztWPECdR/TkNawREHUpB03pSJ7J6Cf9gL3xOvDiiXmfAHtSplLek7qorqI/BeJjxxFG1kgNDPQjrn4VoLPozRqgCzAGXwFXILzJ8w+H6XgRegW7grcGs3gCTOfP8UgfGg139wwapxrugDl0H+oCkTZjAcsiTxBaO7HZUBI6BtfCmv4Un4aw8/RoA7wq6AO4uOhAAAAAASUVORK5CYII=) no-repeat right;width:20px;height:20px;position:absolute;top:6px;right:10px;opacity:0.6;cursor:pointer;');
        document.styleSheets[0].addRule('#subtitleTrackPicker > div:hover:before', 'opacity:1;');
        document.styleSheets[0].addRule('#subtitleTrackPicker > div:first-child:before', 'content:"All";');
    }

    // Catch M3U8 files
    function listensend() {
        debuglog("listensend");

        var newOpen = function(...args) {
            if (!state.m3u8found && args.length >= 2) {
                if (args[1].indexOf(".m3u8") > 0 && state.url !== args[1]) {
                    // m3u8 url
                    debuglog("m3u8 found : " + args[1]);
                    state.url = args[1];
                    state.langs = [];
                    state.baseurl = state.url.substring(0, state.url.lastIndexOf('/') + 1);
                    state.m3u8found = true;
                    getpagecontent(m3u8loaded, state.url);
                }
            }

            open.call(this, ...args);
        };

        var newSend = function(...args) {
            if (args[0] && args[0].match && args[0].match(/globalization/)) {
                this.addEventListener('readystatechange', function(e) {
                    try {
                        state.globalization = JSON.parse(e.target.response).data.globalization;
                    } catch(err) {}
                }, false);
            }
            send.call(this, ...args);
        };

        if (typeof unsafeWindow !== "undefined") {
            debuglog("Window state : unsafe");
            var define = Object.defineProperty;
            define(unsafeWindow.XMLHttpRequest.prototype, "open", {value: exportFunction(newOpen, window)});
            define(unsafeWindow.XMLHttpRequest.prototype, "send", {value: exportFunction(newSend, window)});
        } else {
            debuglog("Window state : safe");
            XMLHttpRequest.prototype.open = newOpen;
            XMLHttpRequest.prototype.send = newSend;
        }
    }

    function m3u8loaded(response) {
        debuglog("m3u8loaded");
        m3u8sub(response);
    }

    function m3u8sub(response) {
        var regexpm3u8 = /^#.{0,}GROUP-ID="sub-main".{0,}\.m3u8"$/gm;
        var regexpvtt = /^[\w-_\/]{0,}MAIN[\w-_\/]{0,}.vtt$/gm;
        var regexpvtt2 = /^[\w-_\/]{0,}.vtt$/gm;

        if (response.indexOf('#EXT-X-INDEPENDENT-SEGMENTS') > 0) {
            // sub infos
            var lines = response.match(regexpm3u8);
            if (lines) {
                lines.forEach(function(line) {
                    var lang = linetoarray(line);
                    if (state.globalization && state.globalization.timedText) {
                        lang.LOCALIZED = state.globalization.timedText.find(t => t.language === lang.LANGUAGE);
                    }
                    state.langs.push(lang);
                    debuglog("Sub found : " + lang.NAME);
                });
            }
        } else if (response.indexOf('.vtt') > 0) {
            // vtt urls
            debuglog("vtt found");
            var lines = response.match(regexpvtt);
            if (!lines) {
                lines = response.match(regexpvtt2);
            }
            if (lines) {
                lines.forEach(function(line) {
                    var url = state.baseurl;
                    var uri = state.langs[state.langid].URI;
                    url += uri.substring(0, 2);
                    if (line.indexOf("/") < 0) {
                        url += uri.substring(2, uri.lastIndexOf("/") + 1);
                    }
                    url += line;
                    state.vttlist.push(url);
                });
            } else {
                alert("Unable to parse the m3u8 file, please report a bug for this video.");
            }

            if (state.vttlist.length > 0) {
                getsegment();
            } else {
                alert("Unknown error, please report a bug for this video.");
            }
        }
    }

    function vttloaded(response) {
        debuglog("vttloaded");
        // save segment
        state.segments += response.substring(response.indexOf("-->") - 13);
        state.segid++;
        if (state.segid < state.vttlist.length) {
            getsegment();
        } else if (state.segments.length > 0) {
            // export segments
            exportfile(vtttosrt(state.segments));
            state.segments = "";
            state.vttlist = [];
            state.segid = 0;
        } else {
            alert("Unknown error, please report a bug for this video.");
        }
    }

    function vtttosrt(vtt) {
        var lines = vtt.split(/\r\n|\r|\n/);
        var result = [];
        var subcount = 0;

        lines.forEach(function(line) {
            if (line.indexOf("-->") === 13) {
                subcount++;
                result.push(subcount);
                result.push(line.substring(0, 29).replace(/[.]/g, ','));
            } else if (subcount > 0) {
                result.push(line.replace(/<\/?c(\.\w{1,})?>/g, '').replace(/&amp;/g, '&'));
            }
        });

        return result.join('\r\n');
    }

    function linetoarray(line) {
        var result = [];
        var values = line.split(',');
        values.forEach(function(value) {
            var data = value.replace(/\r\n|\r|\n/g, '').split('=');
            if (data.length > 1) {
                var key = data[0];
                var content = data[1].replace(/"/g, '');
                result[key] = content;
            }
        });
        return result;
    }

    function buttonhandle() {
        var buttons = document.getElementsByClassName("control-icon-btn");
        if (buttons.length > 0) {
            clickhandlesub();

            state.filename = document.getElementsByClassName("title-field")[0]?.innerText;
            if (document.getElementsByClassName("subtitle-field").length > 0) {
                state.episode = document.getElementsByClassName("subtitle-field")[0]?.innerText;
            }
        }

        if (state.oldlocation !== window.location.href && state.oldlocation !== null) {
            // location changed
            state.m3u8found = false;
            state.langs = [];
            state.audios = [];
        }

        state.oldlocation = window.location.href;
    }

    function clickhandlesub() {
        var picker = document.getElementsByClassName("options-picker subtitle-track-picker");
        if (picker && picker[0]) {
            picker[0].childNodes.forEach(function(child) {
                if (child.onclick === null) {
                    child.onclick = selectsub;
                }
            });
        }
    }

    function selectsub(e) {
        debuglog("selectsub");
        var width = this.offsetWidth;
        // Check click position
        if (e.layerX >= width - 30 && e.layerX <= width - 10 && e.layerY >= 5 && e.layerY <= 25) {
            var lang = this.childNodes[0].childNodes[1].innerHTML;
            if (lang === "Off") {
                // Download all subs
                debuglog("Download all subs");
                state.zip = new JSZip();
                state.downloadall = true;
                state.downloadid = -1;
                downloadnext();
            } else {
                // Download sub
                state.downloadall = false;
                download(lang);
            }
            // Cancel selection
            return false;
        }
    }

    function downloadnext() {
        state.downloadid++;

        if (state.downloadid < state.langs.length) {
            document.styleSheets[0].addRule('#subtitleTrackPicker > div:first-child:before', 'padding-right:35px;content:"' + Math.round((state.downloadid / state.langs.length) * 100) + '%";');
            download(state.langs[state.downloadid].NAME, false, false);
        } else {
            debuglog("Subs downloaded");
            clearInterval(state.downloadinterval);
            document.styleSheets[0].addRule('#subtitleTrackPicker > div:first-child:before', 'padding-right:25px;content:"All";');

            debuglog("Save zip");
            state.zip.generateAsync({type: "blob"}).then(function(content) {
                var output = state.filename;
                if (state.episode !== "") {
                    output += " - " + state.episode.replace(':', '');
                }
                saveAs(content, output + ".zip");
            });
        }
    }

    function download(langname, withForced, localized) {
        withForced = withForced !== false;
        localized = localized !== false;

        if (!state.wait) {
            debuglog("Download sub : " + langname);
            var language;
            var count = 0;
            state.forced = false;
            state.langs.forEach(function(lang) {
                if (lang.NAME === langname || (localized && lang.LOCALIZED && Object.values(lang.LOCALIZED.renditions).includes(langname) && lang.FORCED === "NO")) {
                    language = lang.LANGUAGE;
                    state.langid = count;
                    getpagecontent(m3u8loaded, state.baseurl + lang.URI);
                    state.wait = true;
                }
                count++;
            });
            if (withForced) {
                count = 0;
                var subid;
                state.langs.forEach(function(lang) {
                    if (lang.LANGUAGE === language && lang.NAME !== langname && lang.FORCED === "YES") {
                        subid = count;
                        state.waitsub = true;
                        state.waitInterval = setInterval(function() {
                            if (!state.wait) {
                                debuglog("Download forced : " + langname);
                                clearInterval(state.waitInterval);
                                state.langid = subid;
                                getpagecontent(m3u8loaded, state.baseurl + lang.URI);
                                state.wait = true;
                            }
                        }, 10);
                    }
                    count++;
                });
            }

            if (count === 0) {
                alert("An error has occurred, please reload the page.");
            }
        }
    }

    function getsegment() {
        debuglog("getsegment " + state.segid);
        getpagecontent(vttloaded, state.vttlist[state.segid]);
    }

    function exportfile(text) {
        debuglog("exportfile");
        var output = state.filename;
        if (state.episode !== "") {
            output += " - " + state.episode.replace(':', '');
        }
        output += "." + state.langs[state.langid].LANGUAGE;
        if (state.langs[state.langid].FORCED === "YES") {
            output += ".forced";
            state.waitsub = false;
        }
        output += ".srt";

        if (state.downloadall) {
            debuglog("Add to zip");
            state.zip.file(output, text);
            state.downloadinterval = setTimeout(function() {
                state.wait = false;
                if (!state.waitsub) {
                    downloadnext();
                }
            }, 20);
        } else {
            debuglog("Save sub");
            var hiddenElement = document.createElement('a');

            hiddenElement.href = 'data:attachment/text,' + encodeURI(text).replace(/#/g, '%23');
            hiddenElement.target = '_blank';
            hiddenElement.download = output;
            hiddenElement.click();
            setTimeout(function() { state.wait = false; }, 50);
        }
    }

    function getpagecontent(callback, url, retryCount) {
        retryCount = retryCount || 0;
        debuglog("Downloading : " + url + (retryCount > 0 ? " (retry " + retryCount + ")" : ""));
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    callback(response.responseText);
                } else if (response.status === 404) {
                    debuglog("Not found");
                    callback("");
                } else {
                    if (retryCount < MAX_RETRIES) {
                        debuglog("Unknown error (status: " + response.status + "), retrying...");
                        setTimeout(function() { getpagecontent(callback, url, retryCount + 1); }, 100);
                    } else {
                        debuglog("Max retries reached for: " + url);
                        callback("");
                    }
                }
            },
            onerror: function() {
                if (retryCount < MAX_RETRIES) {
                    debuglog("Network error, retrying...");
                    setTimeout(function() { getpagecontent(callback, url, retryCount + 1); }, 100);
                } else {
                    debuglog("Max retries reached for: " + url);
                    callback("");
                }
            }
        });
    }

    function debuglog(message) {
        if (debug) {
            console.log("%c [debug] " + message, 'background: #222; color: #bada55');
        }
    }
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
