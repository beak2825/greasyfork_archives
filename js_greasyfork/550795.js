// ==UserScript==
// @name         Garmin Connect: Use speed targets in running workouts
// @namespace    http://tampermonkey.net/
// @description  Modifies the Connect workout page so running workouts use speed targets for display and configuration, in addition to pace targets
// @author       flowstate
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      0.7
// @downloadURL https://update.greasyfork.org/scripts/550795/Garmin%20Connect%3A%20Use%20speed%20targets%20in%20running%20workouts.user.js
// @updateURL https://update.greasyfork.org/scripts/550795/Garmin%20Connect%3A%20Use%20speed%20targets%20in%20running%20workouts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let alreadyHere = false

    let tasks = [];

    oneTimeInit();

    function oneTimeInit() {
        waitForUrl();
    }

    function waitForUrl() {
        // if (window.onurlchange == null) {
            // feature is supported
            window.addEventListener('urlchange', onUrlChange);
        // }
        onUrlChange();
    }

    function onUrlChange() {
        const urlMatches = window.location.href.startsWith('https://connect.garmin.com/modern/workout/');
        if (!alreadyHere) {
            if (urlMatches) {
                alreadyHere = true;
                init();
            }
        } else {
            if (!urlMatches) {
                alreadyHere = false;
                deinit();
            }
        }
    }

    function init() {
        tasks = [];
        tasks.push(waitForElement(`.workoutPage`, waitForChanges));
    }

    function deinit() {
        tasks.forEach(task => task.stop());
        tasks = [];
        observer && observer.disconnect()
        observer = null

    }

    // function addStyle(styleString) {
    //     const style = document.createElement('style');
    //     style.textContent = styleString;
    //     document.head.append(style);
    // }

    function waitForElement(readySelector, callback) {
        let timer = undefined;

        const tryNow = function () {
            const elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                timer = setTimeout(tryNow, 300);
            }
        };

        const stop = function () {
            clearTimeout(timer);
            timer = undefined;
        }

        tryNow();
        return {
            stop
        }
    }

    let observer

    function waitForChanges(element) {
        const config = { childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            onElementChanged()
        };

        // Create an observer instance linked to the callback function
        observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(element, config);
    }

    function onElementChanged() {
        const stepDataFields = document.querySelectorAll("[class*=StepDataField_data]")
        for (const field of stepDataFields) {
            if (!field.getAttribute(speedModAttr)) {
                modifyStepDataField(field)
            }
        }
        const paceInputField = document.getElementById("target-pace-to")
        if (paceInputField) {
            modifyPaceInputField(paceInputField);
        }
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    const speedModAttr = "_speed-mod"
    function modifyStepDataField(element) {
        let innerText = element.innerText
        let metric = true
        // TODO fix this so it works for language which don't use "km"/"mi"
        if (innerText.includes("/km") || innerText.includes("/mi")) {
            if (innerText.includes("/mi")) {
                metric = false
                innerText = replaceAll(innerText, "mi", "km")
            }
            const exp = /(\d*:\d*) *\/km(\s)*\((\d*:\d*)-(\d*:\d*) *\/km\)/
            const matches = innerText.match(exp)
            if (matches.length < 5) {
                return
            }

            const target = matches[1]
            const targetLow = matches[3]
            const targetHigh = matches[4]
            const unit = metric ? "/km" : "/mi"
            // TODO see if localized strings can be used
            // (but Garmin uses "kph" which is frowned upon / nonstandard)
            const speedUnit = metric ? "km/h" : "mph"
            const newText =
`${target} ${unit}
(${targetLow} - ${targetHigh} ${unit})

${paceToSpeed(target)} ${speedUnit}
(${paceToSpeed(targetHigh)} - ${paceToSpeed(targetLow)} ${speedUnit})`

            element.innerText = newText
            element.setAttribute(speedModAttr, true)
        }
    }

    const paceModAttr = "_pace-mod"
    function modifyPaceInputField(element) {
        if (element.getAttribute(paceModAttr)) {
            return
        }
        element.setAttribute(paceModAttr, true)

        const wrapper = element.closest("[class*=RangeInput_content]");
        const clone = wrapper.cloneNode(true)

        const label = clone.querySelector("label")
        if (label) {
            label.innerText = "Speed"
        }

        let metric = true
        const originalUnitsLabel = wrapper.querySelector("[class*=TimeDurationInput_appendedLabel]")
        if (!originalUnitsLabel.innerText.includes("km")) {
            metric = false
        }
        const unitsLabel = clone.querySelector("[class*=TimeDurationInput_appendedLabel]")
        if (unitsLabel) {
            unitsLabel.innerText = metric ? "km/h" : "mph"
        }

        let minsFields = clone.querySelectorAll("[class*=TimeDurationInput_minutes]")
        for (const field of minsFields) {
            let html = field.parentNode.innerHTML
            html = replaceAll(html, ":", "")
            field.parentNode.innerHTML = html
        }
        minsFields = clone.querySelectorAll("[class*=TimeDurationInput_minutes]")
        for (const field of minsFields) {
            field.remove()
        }

        const secsFields = clone.querySelectorAll("[class*=TimeDurationInput_seconds]")
        // reverse order
        const fieldIds = ["_speed-mod-sec-max", "_speed-mod-sec-min"]
        // reverse order
        const paceFields = ["target-pace-input", "target-pace-to"]
        for (const field of secsFields) {
            field.style.width = "64px"
            field.setAttribute("placeholder", "")

            field.setAttribute("style",
`
    // background-color: inherit !important;
    caret-color: inherit !important;
    color: #555 !important;
    text-align: left !important;
    box-shadow: none !important;
    border: none !important;
    width: 64px !important;
    -webkit-user-select: text !important;
    -khtml-user-select: text !important;
    -moz-user-select: text !important;
    -o-user-select: text !important;
    user-select: text !important;
`)

            field.parentNode.setAttribute("style",
`
     -webkit-user-select: text !important;
    -khtml-user-select: text !important;
    -moz-user-select: text !important;
    -o-user-select: text !important;
    user-select: text !important;
`
            )

            field.id = fieldIds.pop()
            linkSpeedAndPaceField(field, paceFields.pop())

            if (fieldIds.length === 0) {
                break
            }
        }

        clone.style.marginTop = "-8px"
        const parent = wrapper.parentNode
        parent.appendChild(clone)
    }


    function createOnPaceFieldChanged(minsField, secsField, speedField) {
        return (function () {
            const min = minsField.value
            const sec = secsField.value

            const speed = paceToSpeed(`${min}:${sec}`)
            speedField.value = speed
        })
    }

    function createSpeedFieldChanged(minsField, secsField, speedField) {
        return (function () {
            try {
                let { min, sec } = speedToPace(speedField.value)
                if (min === 0 && sec === 0) {
                    sec = 1
                }

                if (min > 99) {
                    min = 99
                    sec = 59
                }

                minsField.value = min
                minsField.focus() // update internal component as if user typed value

                secsField.value = sec.toString().padStart(2, "0")
                secsField.focus()

                speedField.focus()
            } catch (e) {
                console.log(e)
            }
        })
    }

    function linkSpeedAndPaceField(speedField, paceId) {
        const paceFieldMins = document.getElementById(paceId)
        const paceFieldSecs = paceFieldMins.parentNode.querySelector("[class*=TimeDurationInput_seconds")

        const paceHandler = createOnPaceFieldChanged(paceFieldMins, paceFieldSecs, speedField)

        paceFieldMins.addEventListener("change", paceHandler)
        paceFieldMins.addEventListener("input", paceHandler)
        paceFieldMins.addEventListener("keydown", paceHandler)

        paceFieldSecs.addEventListener("change", paceHandler)
        paceFieldSecs.addEventListener("input", paceHandler)
        paceFieldSecs.addEventListener("keydown", paceHandler)

        paceHandler()

        const speedHandler = createSpeedFieldChanged(paceFieldMins, paceFieldSecs, speedField)
        speedField.addEventListener("change", speedHandler)
        // Can't update pace field immediately because the lower and upper range
        // are instantly validated against each other, so typing "1" for the upper speed (for example)
        // will instantly set a lower pace of "60:00" which will cause the upper pace to increase
        // to "60:00"
        //
        // speedField.addEventListener("input", speedHandler)
        // speedField.addEventListener("keydown", speedHandler)
    }

    // "5:00" => "12.00"
    function paceToSpeed(str) {
        const components = str.split(":")
        const min = parseInt(components[0], 10)
        const seconds = parseInt(components[1], 10)

        const secondsPerUnitDistance = min * 60 + seconds
        const unitDistancePerSecond = 1 / secondsPerUnitDistance
        const unitDistancePerHour = unitDistancePerSecond * 3600

        return (Math.round(unitDistancePerHour * 100) / 100).toFixed(2)
    }

    // "12.00" => { min: 5, sec: 0 }
    function speedToPace(str) {
        const speed = parseFloat(str)
        if (isNaN(speed)) {
            console.log("invalid speed " + str)
            throw Error("invalid speed")
        }

        const unitDistancePerSecond = speed / 3600
        const secondsPerUnitDistance = Math.round(1 / unitDistancePerSecond)

        const min = Math.floor(secondsPerUnitDistance / 60)
        const sec = secondsPerUnitDistance % 60
        return {
            min,
            sec,
        }
    }
})();
