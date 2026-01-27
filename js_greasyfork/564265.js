// ==UserScript==
// @name         Seedbox dashboard improvement
// @version      1.0
// @namespace    https://violentmonkey.github.io/
// @description  Add daily detailed network progress to dashboard
// @author       SeaMLess
// @match        https://*.itsby.design/
// @icon         https://f8.allesedv.com/16/hostingby.design
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564265/Seedbox%20dashboard%20improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/564265/Seedbox%20dashboard%20improvement.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // user variable array
    var variablesArr = {
        "cutoffDay": {
            "title": "Billing day",
            "descr": "",
            "value": ""
        },
        "speedAllowance": {
            "title": "Speed allowance",
            "descr": "",
            "value": 0.1
        },
        "usedMinAllowance": {
            "title": "Bandwidth allowance (min)",
            "descr": "",
            "value": 1
        },
        "usedMaxAllowance": {
            "title": "Bandwidth allowance (max)",
            "descr": "",
            "value": 1
        }
    };

    let netUsed = ""; // root level value for comparison

    getVarsFromStorage();
    buildDailyLimitsUI();
    refreshCalc(); // fire once for page load
    setInterval(refreshCalc, 60 * 1000); // and then every minute - 60 * 1000 milsec
    buildVarsBlock();
    addButton();

    mainLoop: // here we check if values exist; if at least one is empty - we'll force form open
    for (const key in variablesArr) {

        const currValue = variablesArr[key].value;
        if (!currValue) {
            document.getElementById('userVariablesBlock').style.display = "flex";
            document.getElementById('editButton').style.display = "none";
            document.getElementById('dailyLimits').style.display = "none";
            document.getElementById("dailyLimits4").style.display = "none";
            break mainLoop;
        }
    }



    function getVarsFromStorage() {

        for (const key in variablesArr) {

            const currValueStored = GM_getValue(variablesArr[key].title);
            if (!(currValueStored === undefined)) {
                variablesArr[key].value = currValueStored;
            }
        }
    }

    function buildDailyLimitsUI() {

        // -- A BIT OF UI PAL --

        // finding the required card
        const network_card = document.querySelector('.card-columns').lastElementChild.querySelector('.card-body');

        // creating parent div, adding properties
        const newParDiv = document.createElement("div");
        newParDiv.style.cssText = "display: flex; flex-flow: row; justify-content: space-around; margin-bottom: .5rem;"
        newParDiv.classList.add("dailyLimits");
        newParDiv.setAttribute("id", "dailyLimits");
        network_card.appendChild(newParDiv);

        // div #1: daily limit
        const childDiv1 = document.createElement("div");
        childDiv1.classList.add("text-center");
        childDiv1.setAttribute("id", "dailyLimits1");
        const childDiv1HeaderCont = document.createElement("h5");
        const childDiv1HeaderText = document.createTextNode("Daily limit");
        const childDiv1BodyCont = document.createElement("span");

        childDiv1HeaderCont.appendChild(childDiv1HeaderText);
        childDiv1.appendChild(childDiv1HeaderCont);
        childDiv1.appendChild(childDiv1BodyCont);
        newParDiv.appendChild(childDiv1);

        // div #2: threshold
        const childDiv2 = document.createElement("div");
        childDiv2.classList.add("text-center");
        childDiv2.setAttribute("id", "dailyLimits2");

        const childDiv2HeaderCont = document.createElement("h5");
        const childDiv2HeaderText = document.createTextNode("Threshold");
        const childDiv2BodyCont = document.createElement("span");

        childDiv2HeaderCont.appendChild(childDiv2HeaderText);
        childDiv2.appendChild(childDiv2HeaderCont);
        childDiv2.appendChild(childDiv2BodyCont);
        newParDiv.appendChild(childDiv2);

        // div #3: summary
        const childDiv3 = document.createElement("div");
        childDiv3.style.cssText = "align-self: start; margin-top: auto; margin-bottom: auto;";
        childDiv3.classList.add("alert");
        childDiv3.setAttribute("id", "dailyLimits3");
        const childDiv3BodyText = document.createTextNode("");

        childDiv3.appendChild(childDiv3BodyText);
        newParDiv.appendChild(childDiv3);

        // div #4: recommended speed
        const childDiv4 = document.createElement("div");
        childDiv4.style.cssText = "display: flex; justify-content: center; font-size: 90%;"
        const childDiv4BodyText = document.createTextNode("");
        childDiv4.setAttribute("id", "dailyLimits4");
        childDiv4.appendChild(childDiv4BodyText);
        network_card.appendChild(childDiv4);

    }

    // function to refresh daily limits data in UI
    async function refreshCalc(arg) {

        // User values shortcuts
        const cutoffDay = variablesArr.cutoffDay.value; // Billing day of month
        const speedAllowance = variablesArr.speedAllowance.value; // What % of speed is allowed on top of maximum, calculated with presumption of 100% load. Default = 0.1 (10%)
        const usedMinAllowance = variablesArr.usedMinAllowance.value; // How many days worth of traffic consumption you need to have in store for the script to consider you "going too slow". Default = 1
        const usedMaxAllowance = variablesArr.usedMaxAllowance.value; // How many days worth of traffic consumption you need to lack, so the script would consider you "going too fast". Default = 1

        // checking if it needs to be fired
        const currentUsed = (await getNetUsed()).netused;
        if ((currentUsed == netUsed) && !(arg == "force")) {
            // console.log("refresh not needed");
            return;
        } else {
            netUsed = currentUsed;
        }

        // -- CALCULATION LOGIC --

        // finding out where we are in current period and its dates
        const currDate = new Date();
        const currDay = currDate.getDate();
        let periodStart = "";
        let periodEnd = "";

        if (currDay >= cutoffDay) {
            console.log("Cutoff date is behind")
            periodStart = new Date(currDate.getFullYear(), currDate.getMonth(), cutoffDay);
            periodEnd = new Date(currDate.getFullYear(), currDate.getMonth() + 1, cutoffDay);

        } else {
            console.log("Cutoff date is coming")
            periodStart = new Date(currDate.getFullYear(), currDate.getMonth() - 1, cutoffDay);
            periodEnd = new Date(currDate.getFullYear(), currDate.getMonth(), cutoffDay)
        }

        const periodLength = (periodEnd - periodStart) / (1000 * 3600 * 24);
        const daysGone = (currDate - periodStart) / (1000 * 3600 * 24);

        // dates have been figured out, now to the limits

        const periodLimitRaw = (await getNetUsed()).nettotal;
        const periodLimit = numberClean(periodLimitRaw);
        const dailyLimit = (periodLimit / periodLength);
        const currentUsedExact = daysGone * dailyLimit;
        const currentUsedMin = currentUsedExact - (usedMinAllowance * dailyLimit);
        const currentUsedMax = currentUsedExact + (usedMaxAllowance * dailyLimit);
        const currentUsedNumberFinal = numberClean(currentUsed);
        const recomSpeed = Math.round(((periodLimit * 1000 * 1000) / periodLength / 24 / 60 / 60) * (1 + speedAllowance));
        const usedPercent = (await getNetUsed()).perutil;


        // printing debug info to console
        console.log("Current date: " + currDate);
        console.log("Start date: " + periodStart)
        console.log("End date: " + periodEnd)
        console.log("Currently used: " + currentUsedNumberFinal);
        console.log("Supposed to be used: " + currentUsedExact);
        console.log("Minimum threshold: " + currentUsedMin)
        console.log("Maximum threshold: " + currentUsedMax)

        // defining variables
        const childDiv1 = document.getElementById("dailyLimits1").getElementsByTagName('span')[0];
        const childDiv2 = document.getElementById("dailyLimits2").getElementsByTagName('span')[0];
        const childDiv3 = document.getElementById("dailyLimits3")
        const childDiv4 = document.getElementById("dailyLimits4")


        // replacing values
        childDiv1.innerText = Math.round(dailyLimit) + " Gb";
        childDiv2.innerText = Math.round(currentUsedExact) + " Gb";
        childDiv3.className = "";

        if (usedPercent >= 69.00 && usedPercent < 70.00) {
            childDiv3.classList.add("alert","alert-info");
            childDiv3.firstChild.nodeValue = "69% - nice 😏";
        } else if (currentUsedMin > currentUsedNumberFinal) {
            childDiv3.classList.add("alert","alert-success");
            childDiv3.firstChild.nodeValue = "Crank that upload speed up!";
        } else if (currentUsedMin <= currentUsedNumberFinal && currentUsedNumberFinal < currentUsedMax) {
            childDiv3.classList.add("alert","alert-warning");
            childDiv3.firstChild.nodeValue = "You are about fine!";
        } else if (currentUsedNumberFinal >= currentUsedMax) {
            childDiv3.classList.add("alert","alert-danger");
            childDiv3.firstChild.nodeValue = "Slow down there pal!";
        } else {
            childDiv3.classList.add("alert","alert-danger");
            childDiv3.firstChild.nodeValue = "ERROR!";
        }
        childDiv4.firstChild.nodeValue = "Recommended upload speed: " + recomSpeed + " KB/s";

    }


    function buildVarsBlock() {

        // finding the required card
        const network_card = document.querySelector('.card-columns').lastElementChild.querySelector('.card-body');

        // parent div
        const newParDiv = document.createElement("div");
        newParDiv.setAttribute("id", "userVariablesBlock");
        newParDiv.style.cssText = "display: none; flex-flow: row; justify-content: space-around; margin-top: 1rem; flex-wrap: wrap;"
        newParDiv.classList.add("userVariablesBlock");
        network_card.appendChild(newParDiv);


        for (const key in variablesArr) {

            // block body
            const newChildDiv = document.createElement("div");
            newChildDiv.classList.add(key, "text-center");
            newChildDiv.style.cssText = "align-self: end; flex-basis: 25%;"

            // block title
            const newChildDivTitle = document.createElement("h6");
            const newChildDitTitleText = document.createTextNode(variablesArr[key].title);

            // text field
            const newChildDivField = document.createElement("INPUT");
            newChildDivField.setAttribute("type", "number");
            newChildDivField.setAttribute("id", key);
            newChildDivField.setAttribute("value", variablesArr[key].value);
            newChildDivField.style.cssText = "width: 80%;"


            // building it together
            newChildDivTitle.appendChild(newChildDitTitleText);
            newChildDiv.appendChild(newChildDivTitle);
            newChildDiv.appendChild(newChildDivField);
            newParDiv.appendChild(newChildDiv);

        }

        // button
        const submitButton = document.createElement("div");
        submitButton.style.cssText = "flex-basis: 100%; margin-top: 1rem;";
        submitButton.classList.add("text-center");
        const sumbitButtonInner = document.createElement("button");
        sumbitButtonInner.innerHTML = "Save";
        sumbitButtonInner.classList.add("btn", "btn-primary") ;
        submitButton.appendChild(sumbitButtonInner);
        newParDiv.appendChild(submitButton);

        sumbitButtonInner.addEventListener('click', function() {

            for (const key in variablesArr) {
                const val = Number(document.getElementById(key).value);
                variablesArr[key].value = val;
                GM_setValue(variablesArr[key].title, val);
            }

            toggleVisibility('userVariablesBlock', "flex");
            document.getElementById('editButton').style.display = "block";
            refreshCalc("force");
            document.getElementById('dailyLimits').style.display = "flex";
            document.getElementById("dailyLimits4").style.display = "flex";
        });

    }



    function addButton() {

        const network_card = document.querySelector('.card-columns').lastElementChild.querySelector('.card-body');
        const editButton = document.createElement("div");
        editButton.classList.add("text-right", "small");
        editButton.setAttribute("id", "editButton");
        const editButtonInner = document.createElement("a");
        editButtonInner.setAttribute("href", "#");
        editButtonInner.innerText = "Edit";
        editButton.appendChild(editButtonInner);
        network_card.appendChild(editButton);

        editButton.addEventListener('click', function() {
            toggleVisibility('userVariablesBlock', "flex");
            editButton.style.display = "none";
        });
    }

    function toggleVisibility(id, disp) {

        const elem = document.getElementById(id);
        if (elem.style.display === "none") {
            elem.style.display = disp;
        } else {
            elem.style.display = "none";
        }
    }





    // helper function to clean data
    function numberClean(num) {

        const cleanNum = num.replace(/[^\d.-]/g, '');
        const cleanUnit = num.replace(/[^a-zA-Z]+/g, '');
        let cleanNumFinal = "";

        switch (cleanUnit) {
            case "TiB":
                cleanNumFinal = Number(cleanNum) * 1000;
                break;
            case "GiB":
                cleanNumFinal = Number(cleanNum);
                break;
            case "MiB":
                cleanNumFinal = Number(cleanNum) / 1000;
                break;
        }

        return cleanNumFinal;
    }

    // function to get network data in async mode
    async function getNetUsed() {
        var host = "https://" + window.location.host;
        let response = await fetch(host + "/stats/network").then(response => response.json());
        return response;

    };

})();