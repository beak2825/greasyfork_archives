// ==UserScript==
// @name         Garmin Connect: Export Pulse Ox Data
// @namespace    http://tampermonkey.net/
// @description  Adds an export button to the daily pulse ox page; exports to CSV or JSON
// @author       You
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      0.11
// @downloadURL https://update.greasyfork.org/scripts/548382/Garmin%20Connect%3A%20Export%20Pulse%20Ox%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/548382/Garmin%20Connect%3A%20Export%20Pulse%20Ox%20Data.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // https://connect.garmin.com/modern/pulse-ox/DATE
    // https://connect.garmin.com/modern/pulse-ox-acclimation/DATE
    const urlPrefix = 'https://connect.garmin.com/modern/pulse-ox'
    let currentPageMatchesUrl = false;

    const toggleQuery = '#pageContainer .navButtons';

    let tasks = []

    // ===================================================================

    function loadCss(url) {
        const fileref = document.createElement("link")
        fileref.rel = "stylesheet";
        fileref.type = "text/css";
        fileref.href = url
        document.head.appendChild(fileref);
    }
    //https://stackoverflow.com/a/31374433
    const loadJS = function(url, location, onload, onerror){
        //url is URL of external file, onload, onerror is the code
        //to be called from the file, location is the location to 
        //insert the <script> element

        var scriptTag = document.createElement('script');
        scriptTag.src = url;

        scriptTag.onload = onload;
        // scriptTag.onreadystatechange = implementationCode;
        scriptTag.onerror= onerror ;

        location.appendChild(scriptTag);
    };

    let haveNotyf = false;
    const onLoadJs = function() {
        haveNotyf = true;
        waitForUrl()
    };
    const onLoadJsFailed = function() {
        waitForUrl()
    };

    //https://github.com/caroso1222/notyf
    loadCss('https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css');
    loadJS('https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js', document.body, onLoadJs, onLoadJsFailed);

    // ===================================================================

    function waitForUrl() {
        // if (window.onurlchange == null) {
            // feature is supported
            window.addEventListener('urlchange', onUrlChange);
        // }
        onUrlChange();
    }

    function onUrlChange() {
        const urlMatches = window.location.href.startsWith(urlPrefix);
        if (!currentPageMatchesUrl) {
            if (urlMatches) {
                currentPageMatchesUrl = true;
                init();
            }
        } else {
            if (!urlMatches) {
                currentPageMatchesUrl = false;
                deinit();
            } else {
                deinit();
                init();
            }
        }
    }

    function init() {
        tasks = [];
        tasks.push(runWhenReady(toggleQuery, installHandler));
    }
    function deinit() {
        tasks.forEach(task => task.stop());
        tasks = [];
    }

    function runWhenReady(readySelector, callback) {
        let numAttempts = 0;
        let timer = undefined

        const tryNow = function () {
            const elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
                } else {
                    timer = setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };

        const stop = function () {
            clearTimeout(timer);
            timer = undefined
        }

        tryNow();
        return {
            stop
        }
    }

    // =============================================================

    function installHandler() {
        const pulseox_btn_id = '_export_pulseox_btn';
        if (!document.getElementById(pulseox_btn_id)) {
            // pulse ox page
            let navButtons = document.querySelector('span.navButtons');
            if (navButtons) {
                const parentNode = navButtons.parentNode;
                const todayButton = parentNode.querySelector('button');
                const exportButton = todayButton.cloneNode();
                exportButton.id = pulseox_btn_id;
                exportButton.innerText = "Export";
                exportButton.disabled = null;
                exportButton.addEventListener('click', exportPulseox)
                parentNode.insertBefore(exportButton, todayButton);

            } else {
                // pulse ox acclimation page
                navButtons = document.querySelector('div.navButtons');
                if (navButtons) {
                    const exportButton = document.createElement('button')
                    exportButton.id = pulseox_btn_id;
                    exportButton.innerText = "Export";
                    exportButton.disabled = null;
                    exportButton.style = `
display: inline-flex;
align-items: center;
justify-content: center;
flex-direction: row;
gap: 8px;
margin: 0;
border: none;
border-radius: var(--sizing-spacing-x-small);
color: white;
font-weight: 600;
transition: background-color 200ms, outline 50ms;
cursor: pointer;
min-width: 24px;
min-height: 24px;
height: fit-content;

background-color: var(--accent-fills-light);
padding: var(--sizing-spacing-x-small) var(--sizing-spacing-medium);
font-size: 12px;
line-height: 20px;
margin-right: 7px;
`
                    exportButton.addEventListener('click', exportPulseox)
                    navButtons.insertBefore(exportButton, navButtons.querySelector('button'));

                }
            }
        }
    }

    // =============================================================

    function exportPulseox() {
        const loc = window.location.href

        const connectURL = "https://connect.garmin.com";
        const dailyURL = "https://connect.garmin.com/modern/pulse-ox/"
        const otherDailyURL = "https://connect.garmin.com/modern/pulse-ox-acclimation/"
        if (loc.indexOf(connectURL) != 0 || typeof jQuery === "undefined") {
            alert(
    `You must be logged into Garmin Connect to run this script. Log into ${connectURL} and try again.`
    );
            return;
        }

        // Garmin Connect uses jQuery, so it's available for this script
        // (but really it should be rewritten so it doesn't use jquery - TODO)
        jQuery("#_gc-pulseox_modal").remove();

        _gcExportPulseox();

        function _gcExportPulseox() {
            let today = new Date();

            let haveDate = false;
            if (loc.indexOf(dailyURL) == 0 || loc.indexOf(otherDailyURL) == 0) {
                haveDate = true;
                let todayStr = loc.replace(otherDailyURL, "").replace(dailyURL, "");
                const dateRegExp = /^(\d\d\d\d)-(\d\d)-(\d\d)/;
                const match = todayStr.match(dateRegExp);
                if (match && match.length !== 0) {
                    today = new Date(match[1], match[2]-1, match[3]);
                }
            }

            let startDate = formatDate(today);

            if (!haveDate) {
                let date = promptDate(
        `Export Garmin Connect Pulse Ox data

        Enter date to export (YYYY-MM-DD):
        `,
                    startDate
                )
                if (!date) {
                    return;
                }

                startDate = formatDate(date);
            }


            const xhr = new XMLHttpRequest();

            const token = document.querySelector('meta[name="csrf-token"]')
            if (token) {
                xhr.open('GET', `https://connect.garmin.com/gc-api/wellness-service/wellness/daily/spo2acclimation/${startDate}`);
                xhr.setRequestHeader('connect-csrf-token', token.content);
            } else {
                xhr.open('GET', `https://connect.garmin.com/wellness-service/wellness/daily/spo2acclimation/${startDate}`);
                xhr.setRequestHeader('Authorization', 'Bearer '+JSON.parse(localStorage.token).access_token);
                xhr.setRequestHeader("NK", "NT")
                xhr.setRequestHeader('di-backend', 'connectapi.garmin.com')
            }

            xhr.onload = function () {
                if (xhr.status !== 200) {
                    alert(`⚠️ Error exporting data: ${xhr.status} ${xhr.statusText}\n\nMake sure you are logged into Garmin Connect and try again.`)
                    return;
                }
                let obj = JSON.parse(xhr.response)
                addDialog(obj, startDate)
            };
            xhr.onerror = function(error) {
                alert(`⚠️ Error exporting data: ${error}\n\nnMake sure you are logged into Garmin Connect and try again.`)
            }
            xhr.send()
        }


        function formatDate(date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        function formatDateAndTime(date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return `${[year, month, day].join('-')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        }

        function promptDate(str, def) {
            while (true) {
                const val = prompt(str, def);
                if (!val) {
                    return val;
                }

                const dateRegExp = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
                const match = val.match(dateRegExp);
                if (!match || match.length == 0) {
                    continue;
                }
                const d = new Date(match[1], match[2]-1, match[3], 0, 0, 0);
                // console.log(d)
                return d;
            }
        }

        function formatCSVPercentage(v) {
            if (v === null || v === undefined) {
                return '';
            }

            return `${v}%`
        }

        function formatCSVNumber(v) {
            if (v === null || v === undefined) {
                return '';
            }

            return Math.round(v * 100) / 100;
        }

        function getCSV(data) {
            let csv =
    `Section,Date/Time,Single Pulse Ox Reading (%),Pulse Ox Hourly Average (%),Elevation (m),Summary Label,Summary Value\n`;
            csv += `Summary,,,,,\n`;
            csv += `,,,,,File Description,Pulse Ox Export (single readings + hourly averages)\n`;
            csv += `,,,,,Date,${data.calendarDate}\n`;
            csv += `,,,,,Average Pulse Ox (today),${formatCSVPercentage(data.averageSpO2)}\n`;
            csv += `,,,,,Lowest Pulse Ox (today),${formatCSVPercentage(data.lowestSpO2)}\n`;
            csv += `,,,,,Average Sleep Pulse Ox (today),${formatCSVPercentage(data.avgSleepSpO2)}\n`;
            csv += `,,,,,Average Sleep Pulse Ox (tomorrow),${formatCSVPercentage(data.avgTomorrowSleepSpO2)}\n`;
            csv += `,,,,,Average Pulse Ox (last 7 days),${formatCSVPercentage(data.lastSevenDaysAvgSpO2)}\n`;

            csv += `Pulse Ox (Single Readings),,,,,\n`;
            for (const val of data.spO2SingleValues || []) {
                const d = new Date(0);
                d.setUTCSeconds(val[0] / 1000);
                csv += `,${formatDateAndTime(d)},${formatCSVPercentage(val[1])},,,,\n`;
            }

            csv += `Pulse Ox Acclimation (Hourly Averages / Elevation),,,,,\n`;
            for (const val of data.spO2HourlyAverages || []) {
                var d = new Date(0);
                d.setUTCSeconds(val[0] / 1000);
                csv += `,${formatDateAndTime(d)},,${formatCSVPercentage(val[1])},${formatCSVNumber(val[2])},,\n`;
            }

            return csv;
        }

        function addDialog(data, startDate) {
            _addDialog(data, startDate, {
                csv_filename: `pulse-ox-export-${startDate}.csv`,
                json_filename: `pulse-ox-json-export-${startDate}.txt`,
                modal_id: '_gc-pulseox_modal',
                modal_class: '_gc-pulseox-modalDialog',
                title: `Garmin Pulse Ox Data: ${startDate}`,
            })
        }

        // ==============================
        //  generic code below

        function _addDialog(data, startDate, options) {
            const {
                csv_filename,
                json_filename,
                modal_id,
                modal_class,
                title,
            } = options;

            _addCSS(modal_class);
            jQuery(`#${modal_id}`).remove();

            const output = JSON.stringify(data, null, 2);
            // console.log(data) // DEBUG
            const csv = getCSV(data);

            jQuery('body').append(`
<div id="${modal_id}" class="${modal_class}">
    <div class="_gc-modal-inner">
        <a href="#" title="Close" class="_gc-modal-close">X</a>
        <h2>${title}</h2>

        <b>CSV (edited)</b><br>
        • can be opened in Excel / Numbers / Google Sheets<br>
        • this is an edited form of the original JSON data (below)<br>
        • does not contain user profile ID<br>
        <textarea readonly class="_gc-modal-csv-textarea" rows="4" style="width:100%" spellcheck="false"
        >${csv}</textarea>
        <br>
        <br>
        <div>
            <div style="float:left">
                <button class="_gc-misc-btn _gc-modal-csv-copy" style="margin-right: 5px">Copy CSV to Clipboard</button>
                <span class="_gc-modal-csv-copied fade"><b>CSV data copied to clipboard 👍</b></span>
            </div>
             <div style="float: right">
                <a class="_gc-primary-btn _gc-misc-btn"
                    download='${csv_filename}' href='data:text/plain;charset=utf-8,${encodeURIComponent(csv)}'>Download CSV</a>
            </div>
            <div style="clear:both"></div>
        </div>
        <div style="margin-top: 5px">
            <span style="float: right">
                <b>You probably want to press this button 👆</b>
            </span>
            <div style="clear:both"></div>
        </div>

        <hr>

        <b>JSON (original)</b><br>
        • can't be opened in Excel / Numbers / Google Sheets<br>
        • contains original, unedited data from Garmin API<br>
        • ⚠️ contains user profile ID which uniquely identifies your Connect account<br>
        <textarea readonly class="_gc-modal-json-textarea" rows="4" style="width:100%" spellcheck="false"
        >${output}</textarea>
        <br>
        <br>
        <div>
            <div style="float:left">
                <button class="_gc-misc-btn _gc-modal-json-copy" style="margin-right: 5px">Copy JSON to Clipboard</button>
                <span class="_gc-modal-json-copied fade"><b>JSON data copied to clipboard 👍</b></span>
            </div>
            <div style="float:right">
                <a class="_gc-misc-btn"
                    download='${json_filename}' href='data:text/plain;charset=utf-8,${encodeURIComponent(output)}'>Download JSON</a>
            </div>
            <div style="clear:both"></div>
        </div>
    </div>
</div>
        `);

            function closeModal() {
                jQuery(`#${modal_id}`).remove();
                window.removeEventListener("keydown", onKeydown)
            }
            window.addEventListener("keydown", onKeydown)

            function onKeydown(e) {
                console.log('keydown')
                console.log(e)
                if (e.keyCode === 27) {
                    closeModal();
                }
            }

            let notyf = haveNotyf ? new Notyf({position: {x: 'center', y: 'bottom'}}) : null;

            jQuery(`#${modal_id}`).click(function (e) {
                closeModal();
                return false;
            })

            jQuery(`#${modal_id} ._gc-modal-inner`).click(function (e) {
                e.stopPropagation();
            })

            jQuery(`#${modal_id} ._gc-modal-close`).click(function() {
                closeModal();
                return false;
            });
            jQuery(`#${modal_id} ._gc-modal-json-copy`).click(function() {
                let el = jQuery(`#${modal_id} ._gc-modal-json-textarea`);
                el.select();
                document.execCommand('copy');

                if (notyf) {
                    notyf.success('JSON data copied to clipboard')
                } else {
                    jQuery(`#${modal_id} ._gc-modal-json-copied`).addClass('show');
                    setTimeout(() => {
                        jQuery(`#${modal_id} ._gc-modal-json-copied`).removeClass('show');
                    }, 2000);
                }
                return false;
            });
            jQuery(`#${modal_id} ._gc-modal-csv-copy`).click(function() {
                let el = jQuery(`#${modal_id} ._gc-modal-csv-textarea`);
                el.select();
                document.execCommand('copy');
                if (notyf) {
                    notyf.success('CSV data copied to clipboard')
                } else {
                    jQuery(`#${modal_id} ._gc-modal-csv-copied`).addClass('show');
                    setTimeout(() => {
                        jQuery(`#${modal_id} ._gc-modal-csv-copied`).removeClass('show');
                    }, 2000);
                }
                return false;
            });
        }

        function _addCSS(modal_class) {
            // based on https://jsfiddle.net/kumarmuthaliar/GG9Sa/1/
            const modal_zindex = 99999;
            const styles = `
.notyf {
    z-index: ${modal_zindex+1} !important;
}

.${modal_class} {
    position: fixed;
    font-family: Arial, Helvetica, sans-serif;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: ${modal_zindex};
    // opacity:0;
    -webkit-transition: opacity 400ms ease-in;
    -moz-transition: opacity 400ms ease-in;
    transition: opacity 400ms ease-in;
}

.${modal_class} > div {
    width: 600px;
    position: relative;
    margin: 20px auto;
    padding: 5px 20px 13px 20px;
    border-radius: 10px;
    background: #eee;
    /*background: -moz-linear-gradient(#fff, #999);
    background: -webkit-linear-gradient(#fff, #999);
    background: -o-linear-gradient(#fff, #999);*/
}
.${modal_class} ._gc-modal-close {
    background: #606061;
    color: #FFFFFF;
    line-height: 25px;
    position: absolute;
    right: -12px;
    text-align: center;
    top: -10px;
    width: 24px;
    text-decoration: none;
    font-weight: bold;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    -moz-box-shadow: 1px 1px 3px #000;
    -webkit-box-shadow: 1px 1px 3px #000;
    box-shadow: 1px 1px 3px #000;
}
.${modal_class} ._gc-modal-close:hover {
    background: #00d9ff;
}

.${modal_class} ._gc-primary-btn,
.${modal_class} ._gc-primary-btn:hover,
.${modal_class} ._gc-primary-btn:visited,
.${modal_class} ._gc-primary-btn:active {
    color: #fff;
    background-color: #337ab7 !important;
    border-color: #2e6da4 !important;
}

.${modal_class} ._gc-misc-btn,
.${modal_class} ._gc-misc-btn:hover,
.${modal_class} ._gc-misc-btn:visited,
.${modal_class} ._gc-misc-btn:active {
    color: #fff;
    text-decoration:none;
    background-color: #6c757d;
    border-color: #6c757d;

    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    border-radius: 4px;
}

.${modal_class} ._gc-modal-json-textarea,
.${modal_class} ._gc-modal-csv-textarea {
    font-family: "Lucida Console", Monaco, Monospace
}

.${modal_class} .fade {
    /* use bootstrap default (.15s) */
    transition: opacity .15s linear;
    opacity: 0;
}

.${modal_class} .fade.show {
    opacity: 1;
    display: inline;
}
`;

            const stylesheetId = `${modal_class}_styles`
            jQuery(`#${stylesheetId}`).remove();
            const styleSheet = document.createElement("style")
            // styleSheet.type = "text/css";
            styleSheet.id = stylesheetId;
            styleSheet.innerText = styles
            document.head.appendChild(styleSheet);
        }
    }
})();
