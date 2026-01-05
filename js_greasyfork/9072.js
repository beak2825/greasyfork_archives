// ==UserScript==
// @name         Prestige Calculator
// @namespace    http://www.hackforums.net/member.php?action=profile&uid=2525478
// @version      0.6
// @description  Calculates HF Prestige
// @author       TyrantKingBen
// @match        http://www.hackforums.net/member.php?action=profile&uid=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/9072/Prestige%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/9072/Prestige%20Calculator.meta.js
// ==/UserScript==

var a = GM_getValue("a", 50);
var b = GM_getValue("b", 90000);
var c = GM_getValue("c", 16);
var d = GM_getValue("d", 0.04);
var ai = GM_getValue("ai", 0);
var bi = GM_getValue("bi", 0);
var ci = GM_getValue("ci", 0);
var di = GM_getValue("di", 0);

var posts = 0;
var seconds = 0;
var reputation = 0;
var awards = 0;
var prestige = 0;
var calculatedPrestige = 0;
var percentError = 0;
var errorClass;

var secondsIncrement = [1, 60, 3600, 86400, 604800, 2592000, 31536000];
var secondsNames = ["Second", "Minute", "Hour", "Day", "Week", "Month", "Year"];
var table;
var tds = document.getElementsByTagName("td");

for (var i = 0; i < tds.length; i++) {
    if (tds[i].innerHTML.indexOf("Total Posts:") != -1) {
        posts = parseInt(tds[i + 1].innerHTML.replace(",", "").split(" ")[0]);
        table = tds[i + 1].parentNode.parentNode;
    } else if (tds[i].innerHTML.indexOf("Time Spent Online:") != -1) {
        var text = tds[i + 1].innerHTML;
        var amounts = text.split(", ");
        for (var j = amounts.length - 1; j >= 0; j--) {
            var amount = amounts[j].split(" ");
            if (amount[1].substr(amount[1].length - 1) == "s") amount[1] = amount[1].substr(0, amount[1].length - 1);
            seconds += parseInt(amount[0]) * secondsIncrement[secondsNames.indexOf(amount[1])];
        }
    } else if (tds[i].innerHTML.indexOf("Reputation:") != -1) {
        reputation = parseInt(tds[i + 1].innerHTML.match(/-?\d+/));
    } else if (tds[i].innerHTML.indexOf("Prestige:") != -1) {
        prestige = parseInt(tds[i + 1].innerHTML);
    } else if (tds[i].innerHTML.indexOf("Awards:") != -1) {
        awards = parseInt(tds[i + 1].innerHTML.match(/\d+/));
    }
}

calculatedPrestige = makeThisBitchAnInteger(posts / a, ai) + makeThisBitchAnInteger(seconds / b, bi) + makeThisBitchAnInteger(reputation / c, ci) + makeThisBitchAnInteger(awards / d, di);
if (prestige == 0) percentError = 0;
else percentError = parseFloat((calculatedPrestige - prestige) / prestige * 100).toFixed(2);
if (percentError < 0) errorClass = "reputation_negative";
else if (percentError > 0) errorClass = "reputation_positive";
else errorClass = "reputation_neutral";

var tr = document.createElement("tr");
var td1 = document.createElement("td");
td1.setAttribute("class", "trow1");
var strong = document.createElement("strong");
var strongText = document.createTextNode("Calculated Prestige:");
strong.appendChild(strongText);
td1.appendChild(strong);
tr.appendChild(td1);
var td2 = document.createElement("td");
td2.setAttribute("class", "trow1");

var prestigeSpan = document.createElement("span");
var prestigeStrong = document.createElement("strong");
prestigeStrong.setAttribute("class", errorClass);
prestigeStrong.appendChild(document.createTextNode(String(Math.abs(calculatedPrestige - prestige)) + ", " + String(Math.abs(percentError)) + "%"));
prestigeSpan.appendChild(document.createTextNode(String(calculatedPrestige) + " ("));
prestigeSpan.appendChild(prestigeStrong);
prestigeSpan.appendChild(document.createTextNode(")"));
td2.appendChild(prestigeSpan);

var settings = document.createElement("span");
var settingsText = document.createTextNode(" [Options] ");
settings.appendChild(settingsText);
settings.style.color = "#FFF";
settings.style.cursor = "pointer";
td2.appendChild(settings);
tr.appendChild(td2);
table.appendChild(tr);

strong.addEventListener("mouseover", function() {

});

var open = false;
var div;

settings.addEventListener("click", function() {
    if (open) {
        td2.removeChild(div);
        open = false;
    } else {
        div = document.createElement("div");
        var j = 0;
        var k = 0;
        var settingsLabels = ["a", "b", "c", "d"];
        var settingsOptions = ["Floor", "Ceiling", "Round"];
        var settingsValues = [a, b, c, d];
        var settingsIntegers = [ai, bi, ci, di];
        var settingsTable = document.createElement("table");

        var settingsRows = [];
        for (var i = 0; i < 4; i++) {
            settingsRows.push(document.createElement("tr"));
        }

        var settingsData = [];
        for (var i = 0; i < 12; i++) {
            settingsData.push(document.createElement("td"));
            if (i % 3 == 0) {
                settingsData[i].appendChild(document.createTextNode(settingsLabels[j] + ": "));
                j++;
            }
        }
        j = 0;

        var settingsInputs = [];
        for (var i = 0; i < 8; i++) {
            if (i % 2 == 0) {
                settingsInputs.push(document.createElement("input"));
                settingsInputs[i].setAttribute("type", "text");
                settingsInputs[i].setAttribute("value", settingsValues[j]);
                settingsInputs[i].style.background = "#CCCCCC";
                settingsInputs[i].style.border = "1px solid #072948";
                settingsInputs[i].style.width = "10em";
                j++;
            } else {
                var select = document.createElement("select");
                for (var l = 0; l < 3; l++) {
                    var option = document.createElement("option");
                    option.appendChild(document.createTextNode(settingsOptions[l]));
                    if (settingsIntegers[k] == l) option.setAttribute("selected", "true");
                    select.appendChild(option);
                }
                settingsInputs.push(select);
                k++;
            }
        }
        j = 0;
        k = 0;

        var change = document.createElement("input");
        change.setAttribute("type", "button");
        change.setAttribute("value", "Update");

        for (var i = 1; i < 12; i += 3) {
            settingsData[i].appendChild(settingsInputs[j]);
            j += 2;
        }
        j = 1;

        for (var i = 2; i < 12; i += 3) {
            settingsData[i].appendChild(settingsInputs[j]);
            j += 2;
        }
        j = 0;

        for (var i = 0; i < 12; i++) {
            settingsRows[j].appendChild(settingsData[i]);
            if ((i + 1) % 3 == 0) j++;
        }
        j = 0;

        for (var i = 0; i < 4; i++) {
            settingsTable.appendChild(settingsRows[i]);
        }

        settingsTable.style.margin = "auto auto";
        div.appendChild(settingsTable);

        div.appendChild(change);
        div.style.textAlign = "center";
        td2.appendChild(div);
        open = true;

        change.addEventListener("click", function() {
            a = parseFloat(settingsInputs[0].value);
            b = parseFloat(settingsInputs[2].value);
            c = parseFloat(settingsInputs[4].value);
            d = parseFloat(settingsInputs[6].value);
            ai = settingsInputs[1].selectedIndex;
            bi = settingsInputs[3].selectedIndex;
            ci = settingsInputs[5].selectedIndex;
            di = settingsInputs[7].selectedIndex;
            GM_setValue("a", a);
            GM_setValue("b", b);
            GM_setValue("c", c);
            GM_setValue("d", d);
            GM_setValue("ai", ai);
            GM_setValue("bi", bi);
            GM_setValue("ci", ci);
            GM_setValue("di", di);

            calculatedPrestige = makeThisBitchAnInteger(posts / a, ai) + makeThisBitchAnInteger(seconds / b, bi) + makeThisBitchAnInteger(reputation / c, ci) + makeThisBitchAnInteger(awards / d, di);
            if (prestige == 0) percentError = 0;
            else percentError = parseFloat((calculatedPrestige - prestige) / prestige * 100).toFixed(2);
            if (percentError < 0) errorClass = "reputation_negative";
            else if (percentError > 0) errorClass = "reputation_positive";
            else errorClass = "reputation_neutral";

            td2.removeChild(prestigeSpan);

            prestigeSpan = document.createElement("span");
            prestigeStrong = document.createElement("strong");
            prestigeStrong.setAttribute("class", errorClass);
            prestigeStrong.appendChild(document.createTextNode(String(Math.abs(calculatedPrestige - prestige)) + ", " + String(Math.abs(percentError) + "%")));
            prestigeSpan.appendChild(document.createTextNode(String(calculatedPrestige) + " ("));
            prestigeSpan.appendChild(prestigeStrong);
            prestigeSpan.appendChild(document.createTextNode(")"));

            td2.insertBefore(prestigeSpan, settings);
        });
    }
});

settings.addEventListener("mouseenter", function() {
    this.style.color = "#499FED";
});

settings.addEventListener("mouseleave", function() {
    this.style.color = "#FFF";
});

function makeThisBitchAnInteger(e, f) {
    switch (f) {
        case 0:
            return Math.floor(e);
        case 1:
            return Math.ceil(e);
        case 2:
            return Math.round(e);
    }
}