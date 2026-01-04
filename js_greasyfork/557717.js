// ==UserScript==
// @name         SI-Iteung Pro
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  Iteung Premium mode
// @author       Iqionly
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kabayan.id
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @match        *
//
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment-with-locales.min.js#sha512-4F1cxYdMiAW98oomSLaygEwmCnIP38pb4Kx70yQYqRwLVCs3DbRumfBq82T08g/4LJ/smbFGFpmeFlQgoDccgg==
//
//
// @downloadURL https://update.greasyfork.org/scripts/557717/SI-Iteung%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/557717/SI-Iteung%20Pro.meta.js
// ==/UserScript==
/* globals moment, jQuery, $ */

(function($) {
    'use strict';

    const factorOvertime = 1.28;
    const workingHour = 8;
    const workingMinute = 30;
    const workingTotalMinute = workingHour * 60 + workingMinute;
    const formatDate = 'YYYY-MM-DD';
    const formatTime = 'HH:mm:ss';
    const formatTimeHm = formatTime;

    let unixLoad = (new Date()).setSeconds(0, 0);
    let nowDate = moment();
    let kehadiranString = '00:00:00';
    let nowDateString = nowDate.format('YYYY-MM-DD');
    let kehadiranDateTime = nowDate.unix();
    let recommendClockOut = kehadiranDateTime
    let recommendClockOutString = nowDate.format(formatTime)
    let clockOutEl = function (text = 'Recommend', time = "00:00:00", h = 3) {
        return "<h" + h + " class='col-5 border border-gray-300 border-dashed rounded min-w-125px py-3 px-3' style=margin-bottom:1em;>" + text + " Logout:<br/><span style='position:relative;'>" + time + "<span class='badge badge-danger' style='padding: 2px; display: inline-block;vertical-align: top;position: absolute;right: -20px;top: 0;font-size: 8px;'>+1m</span></span></h" + h + ">";
    }
    let recommendClockOutEl = function(time = '00:00:00', h = 3) {
        return clockOutEl("Recommend<br/>", time,h);
    }
    let createCardWrapperEl = function (content = "", color = 'wave-danger') {
        let speed = 'wave-animate-fast'
        if(color == 'wave-danger') {
            speed = 'wave-animate-faster'
        } else if(color == 'wave-primary') {
            speed = 'wave-animate-slow'
        }
        return `<div class="card card-custom wave ` + speed + ` ` + color + ` mb-4 mb-lg-4">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-center p-1">
                    ` + content + `
                </div>
                <span class="small text-muted">*This is just prediction of salaries, based on table Kehadiran. So it not relate to actual your salary, it can be high or low.</span>
            </div>
        </div>`;
    }
    let createCardEl = function (title = "Your Title", description = "", color = 'badge-danger') {
        return `<div class="d-flex flex-column m-2">
            <a href="#" class="text-dark text-hover-primary text-center fw-bold fs-4 mb-3">
            ` + title + `
            </a>
            <div class="badge ` + color + `">
                ` + description + `
            </div>
        </div>`;
    }

    let notifiedLeftTime = false;

    function haveBeenNotifiedOnce() {
        setCookie('haveNotified', 1);
    }

    function isHaveBeenNotified() {
        return getCookie('haveNotified') ?? 0;
    }

    let getListSessions = function () {

        let getExpireDataStorage = localStorage.getItem('listSessionDataExpire');

        let defaultSessions = [];

        let rootElement = null;
        let sessionElement = [];
        let sessionTextElement = [];

        let accumulateSessionMinutes = 0;
        let lastStartSession = 0;
        let differenceMinutes = 0;

        function loadElements() {
            let possibleRootElements = $('.alert.alert-warning[role="alert"]');
            rootElement = possibleRootElements.filter((i, e) => e.innerText.indexOf('Sesi Saat Ini') == 0 ).first();
            sessionElement = rootElement.children().filter((i, e) => e.innerText.match(/^Sesi\s[0-9]+/));
        }

        function loadSessions() {
            let data = $('#tableAllSession');
            if(data.length){
                data = data.DataTable().data().toArray();
                defaultSessions = data;
                let end_before = null;
                for(let i = 0; i < data.length; i++) {
                    let e = data[i];
                    let end = 0;
                    let start = moment(nowDate.format(formatDate) + 'T' + e[1]).unix();
                    lastStartSession = start;
                    if(i != data.length-1) {
                        end = moment(nowDate.format(formatDate) + 'T' + e[2]).unix();
                        accumulateSessionMinutes += Math.floor((end - start) / 60); // we need to devide 60 for this second time
                    }
                    if(i > 0) {
                        differenceMinutes += Math.floor((start - end_before) / 60);
                    }
                    end_before = end;
                }
            }
        }

        function getNeighbor() {
            for(let i = 0; i < sessionElement.length; i++) {
                sessionTextElement.push(sessionElement[i].nextSibling.textContent.replace(/\r?\n|\r|\s/g, ""));
            }
        }

        function init() {
            loadElements();
            loadSessions();
            getNeighbor();
            localStorage.setItem('listSessionDataExpire', moment().add(1, 'days').unix());
        }

        let result = null;

        if(getExpireDataStorage == null || parseFloat(getExpireDataStorage) < moment().unix()) {
            init();
            result = {
                'sessions': defaultSessions,
                'sessionEl': sessionElement,
                'sessionContent': sessionTextElement,
                'differenceMinutes': differenceMinutes,
                'lastStartSession': lastStartSession,
            };
            localStorage.setItem('listSessionData', JSON.stringify(result));
        } else {
            result = JSON.parse(localStorage.getItem('listSessionData'));
        }

        function totalMinutes() {
            return accumulateSessionMinutes + ((moment().unix() - result.lastStartSession) / 60);
        }

        result.totalMinutes = totalMinutes;

        return result;
    }

    let getPredictSalary = function () {
        let initiated = false;
        let valueSalaries = [];
        let elements, elementSalaries, component, table, tableData, data, totalVarSalary, totalVarSalaryBefore, tempLocaleTVS, tempLocaleTVSBefore = null;
        let valueOverTimeMinutes = 0;
        let payOvertime = 0;

        function computeData(dataTableId) {
            let t = $(dataTableId);
            if(t.length == 0) {
                return [0, 0];
            }
            t = t.DataTable();
            let td = t.data();
            let tmpd = td.map((e) => {
                let d = e[4].match(/[0-9\.]+/gm); // use 4 because column workday on index is 4 from table log kehadiran
                if(moment(e[0]).weekday() == 6 || moment(e[0]).weekday() == 0) { // we need to compute work hour, because this is overtime in weekdays (Sat, Sun).
                    valueOverTimeMinutes = parseInt(valueOverTimeMinutes) + parseInt(e[1]);
                }
                if(d == null) {
                    return 0;
                }
                return parseFloat(d.toString());
            }).toArray();

            // Check minutes overtime cost, base on factorOvertime * valueSalaries[1]
            payOvertime = (factorOvertime * parseFloat(valueSalaries[1])) / 510 // 510 for minutes work a day
            let totalOvertime = payOvertime * valueOverTimeMinutes;
            unsafeWindow.tmpd = tmpd;
            unsafeWindow.valueSalaries = valueSalaries;
            unsafeWindow.totalOvertime = totalOvertime;

            let total = parseFloat(tmpd.reduce((a, b) => a + b, 0) * (valueSalaries[1] ?? 0) + parseFloat(valueSalaries[0] ?? 0)) + totalOvertime;
            let totalString = total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR'});

            return [total, totalString];
        }


        if(!initiated) {
            elements = $('p.mb-0.fw-bolder.text-muted.text-hover-dark');
            elementSalaries = elements.filter((i, e) => e.textContent.match(/Rp\.[0-9\,]+/gm) != null)
            elementSalaries.each((i,e) => valueSalaries.push(e.textContent.match(/[0-9\,]+/).toString().replaceAll(',', '')));
            initiated = true;

            [totalVarSalaryBefore, tempLocaleTVSBefore] = computeData('#tableAttendanceLogLastMonth');
            [totalVarSalary, tempLocaleTVS] = computeData('#tableAttendanceLogThisMonth');
        }

        return {
            salariesEl: elementSalaries,
            salariesVal: valueSalaries,
            actualSalary: (valueSalaries[0] ?? 0) * 2,
            constElement: valueSalaries[0] ?? 0,
            varElement: valueSalaries[1] ?? 0,
            totalVarSalaryBefore: totalVarSalaryBefore,
            totalVarSalary: totalVarSalary,
            localeTotalVarSalaryBefore: tempLocaleTVSBefore,
            localeTotalVarSalary: tempLocaleTVS,
        };
    }

    function setCookie(cname, cvalue, exdays = 1) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    function clearStorageExpired() {
        localStorage.clear();
    }

    $(document).ready(function() {
        // For Homepage
        if($('#liveClock').length) {
            // Get Waktu Absen Elem
            let listLoginTimeEl = $('.fw-bold.fs-6.text-gray-400');
            $(listLoginTimeEl).each((idx, el) => {
                if(el.innerText == 'Waktu Bekerja') {
                    // Jika ada Waktu Kehadiran, ambil elemen sebelumnya
                    let waktuKehadiranEl = $(el).prev()
                    if(waktuKehadiranEl.length > 0) {
                        waktuKehadiranEl = waktuKehadiranEl[0];
                        kehadiranString = nowDate.format(formatDate) + 'T' + waktuKehadiranEl.innerText
                    }
                }
            });

            // Compute Waktu Absen
            kehadiranDateTime = moment(kehadiranString);

            let listSession = getListSessions();
            let salaryData = getPredictSalary();

            recommendClockOut = kehadiranDateTime.add(workingTotalMinute, 'm').add(listSession.differenceMinutes, 'm');
            recommendClockOutString = recommendClockOut.format(formatTimeHm);

            let halfRecommendClockOut = recommendClockOut.subtract(workingTotalMinute * 0.5, 'm'); // factor half

            // Compute Waktu based sesi
            console.log(recommendClockOut, kehadiranDateTime, workingTotalMinute, listSession);
            if(recommendClockOut.isValid()) {
                // Put Recommend Clock Out El
                let clocks = clockOutEl('Half Workhour<br/>', halfRecommendClockOut.format(formatTimeHm)) + recommendClockOutEl(recommendClockOutString);
                $('#liveClock').after('<div class="row text-center d-flex justify-content-evenly align-items-center p-0 m-0">' + clocks + '</div>');

                let iterate = 0;
                let factor = 1;
                // Background Task
                setInterval(function() {
                    let totalMinutes = listSession.totalMinutes();
                    if(totalMinutes > 500 && isHaveBeenNotified() == 0) {
                        GM_notification({
                            text: "Your Iteung Minutes will achieve 510, in just " + (510 - totalMinutes) + " minutes! Check it!",
                            title: "Notification Iteung",
                            url: "https://siiteung.kabayan.id/",
                            onclick: (event) => {
                                // The userscript is still running, so don't open example.com
                                event.preventDefault();
                            }
                        });
                        haveBeenNotifiedOnce();
                    } else if(totalMinutes > 510 && isHaveBeenNotified() == 1 && iterate > 24) {
                        GM_notification({
                            text: "You're in Lembur Mode, working minutes is " + totalMinutes + "! Be Careful to 600!",
                            title: "Notification Iteung",
                            url: "https://siiteung.kabayan.id/",
                            onclick: (event) => {
                                // The userscript is still running, so don't open example.com
                                event.preventDefault();
                            }
                        });
                        iterate = (iterate * -1) - (24 * factor);
                        factor++;
                    }
                    iterate++;
                }, 5000);
            }

            // Put Card Salary before log kehadiran
            let logKehadiranCard = $('#attendanceLogLastMonth').closest('div.card');
            if(logKehadiranCard.length) {
                function getColor(total, actual) {
                    let color = 'success';
                    let percent = (total / actual) * 100;
                    if(percent < 70) {
                        color = 'warning';
                    } else if(percent < 80) {
                        color = 'info';
                    } else if(percent < 90) {
                        color = 'primary';
                    } else if(percent <= 100) {
                        color = 'success';
                    }
                    return color;
                }
                let perbandingan = salaryData.totalVarSalary - salaryData.totalVarSalaryBefore;
                let content = createCardEl('Salary Before', salaryData.localeTotalVarSalaryBefore, 'badge-' + getColor(salaryData.totalVarSalaryBefore, salaryData.actualSalary));
                if(perbandingan > -500000) {
                    content += `<div class="d-flex flex-column m-2 h1">&lt</div>`;
                } else if (perbandingan < 500000) {
                    content += `<div class="d-flex flex-column m-2 h1">&gt</div>`;
                }
                content += createCardEl('Next Salary', salaryData.localeTotalVarSalary, 'badge-' + getColor(salaryData.totalVarSalary, salaryData.actualSalary));
                logKehadiranCard.before(createCardWrapperEl(content, 'wave-' + getColor(salaryData.totalVarSalary, salaryData.totalVarSalaryBefore)));
            }
        }

        // Debugging
        unsafeWindow.test = getPredictSalary();
    });

    $(document).on('click', '#btnPresenceOut', function() {
        clearStorageExpired();
    });


})(jQuery);