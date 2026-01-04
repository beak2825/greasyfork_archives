// ==UserScript==
// @name         Zone4 FIS Tooklit
// @namespace    http://zone4.ca/
// @version      2025-11-25
// @description  FIS Toolkit for Zone4
// @author       linden @ zone4
// @include      https://zone4.ca/manage/race/*
// @include      https://10.23.33.254/manage/race/*
// @include      https://remote.zone4.ca:20033/manage/race/*
// @icon         https://upload.wikimedia.org/wikipedia/en/thumb/0/07/F%C3%A9d%C3%A9ration_internationale_de_ski_%28logo%29.svg/1094px-F%C3%A9d%C3%A9ration_internationale_de_ski_%28logo%29.svg.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556929/Zone4%20FIS%20Tooklit.user.js
// @updateURL https://update.greasyfork.org/scripts/556929/Zone4%20FIS%20Tooklit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const toolkitMenuHTML = `
    <div class="toolkit-button" style="padding: 75px;" onclick="$('ul.toolkit-menu').toggle();" ondblclick="$('div.toolkit-button').hide();$('ul.toolkit-menu').hide();">Toolkit</div>
    <ul class="toolkit-menu" style="background-color:grey;">
    <li>Debug</li>
    <ul>
        <li onclick="toolkit.logFields();">Log Fields</li>
        <li onclick="toolkit.logRacers();">Log Racers</li>
        <li onclick="toolkit.logStartGroups();">Log Start Groups</li>
        <li onclick="toolkit.logResults();">Log Results</li>
        <li onclick="toolkit.logBiathlonResults();">Log Biathlon Results</li>
    </ul>
    <li>General</li>
    <ul>
        <li onclick="$('div.csv-update').toggle();">CSV Update</li>
        <li onclick="toolkit.setFactorToClassic();">Set Factor to Classic</li>
        <li onclick="toolkit.setFactorToFree();">Set Factor to Free</li>
    </ul>
    <li>Sprint</li>
    <ul>
        <li onclick="toolkit.logSprintSemiFinals();">Log Sprint Semi-Finals</li>
        <li onclick="toolkit.logSprintFinal();">Log Sprint Final</li>
        <li onclick="toolkit.logSprintFinalResults();">Log Sprint Final Results</li>
        <li onclick="toolkit.setHeatChips();">Set Heat Chips</li>
        <li onclick="toolkit.setHeatStartGaps();">Set Heat Start Gaps</li>
        <li onclick="toolkit.setSprintUnsetLevel();">Set Sprint Unset Level</li>
        <li onclick="toolkit.clearSprintLevel();">Clear Sprint Level</li>
        <li onclick="toolkit.reDrawSprintFinalResults();">Re-Draw Sprint Final Results</li>
    </ul>
    <li>Biathlon</li>
    <ul>
        <li onclick="toolkit.setMissPenalty();">Set Miss Penalty</li>
        <li onclick="toolkit.setBiathlonTimes();">Set Biathlon Times</li>
        <li onclick="toolkit.reDrawBiathlonSanctions();">Re-Draw Biathlon Sanctions</li>
        <li onclick="toolkit.logBiathlonPursuit();">Log Biathlon Pursuit</li>
        <li onclick="toolkit.setBiathlonPursuitStart();">Set Biathlon Pusuit Start</li>
        <li onclick="toolkit.log2LaneStartList();">Log 2 Lane Start List</li>
    </ul>
    <li>Start List</li>
    <ul>
        <li onclick="toolkit.reDrawStartList();">Re-Draw Start List</li>
    </ul>
    <li>Results</li>
    <ul>
        <li onclick="toolkit.calculateDeltaTime();">Calculate Delta Time</li>
        <li onclick="toolkit.calculateXPoints();">Calculate X Points</li>
        <li onclick="toolkit.calculateWCPoints();">Calculate WC Points</li>
        <li onclick="toolkit.calculateWCPointsQ();">Calculate WC Points Q</li>
        <li onclick="toolkit.calculateWCPointsH();">Calculate WC Points H</li>
        <li onclick="toolkit.calculateWCPointsF();">Calculate WC Points F</li>
        <li onclick="toolkit.reDrawResults();">Re-Draw Results</li>
    </ul>
        <li onclick="toolkit.temp();">Temp</li>
    </ul>
    <div class="csv-update">
        <textarea class="csv-update-input">lookup_field_key,update_field1_key,update_field2_key,...,update_fieldN_key\nlookup_field_value1,update_field1_value1,update_field2_value1,...,update_fieldN_value1\nlookup_field_value1,update_field1_value2,update_field2_value2,...,update_fieldN_value2\n...\nlookup_field_value1,update_field1_valueM,update_field2_valueM,...,update_fieldN_valueM</textarea>
        <input type="button" value="Update" onclick="$('div.csv-update').hide();toolkit.csvUpdate($('textarea.csv-update-input')[0].value);">
    </div>
    `;

    setTimeout(function() {
        $("body").prepend(toolkitMenuHTML);
        $("div.overtop-page").prepend(toolkitMenuHTML);
        $("ul.toolkit-menu").hide();
        $("div.csv-update").hide();
    }, 4000);

    var toolkitFunctions = window.toolkit = {};

    toolkitFunctions.formatTimeSeconds = function(timeSeconds, isSigned, precision) {
        const timeSecondsAbs = Math.abs(timeSeconds);
        var hours = Math.floor(timeSecondsAbs / 3600);
        var minutes = Math.floor((timeSecondsAbs - (hours * 3600)) / 60);
        var seconds = timeSecondsAbs - (hours * 3600) - (minutes * 60);
        var timeString = "";
        if (hours > 0) {
            timeString = hours + ":";
        }
        if (hours > 0 && minutes >= 0 && minutes < 10) {
            timeString = timeString + "0" + minutes + ":";
        } else if (minutes > 0) {
            timeString = timeString + minutes + ":";
        }

        seconds = toolkitFunctions.truncateDecimals(seconds, precision);
        if (minutes > 0 && seconds < 10) {
            timeString = timeString + "0" + seconds;
        } else {
            timeString = timeString + seconds;
        }

        if (isSigned) {
            if (timeSeconds > 0) {
                return "+" + timeString;
            } else if (timeSeconds < 0) {
                return "-" + timeString;
            }
        } else {
            return timeString;
        }
    };

    toolkitFunctions.truncateDecimals = function(number, digits) {
        var multiplier = Math.pow(10, digits),
            adjustedNum = number * multiplier,
            truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

        var stringNumber = "" + (truncatedNum / multiplier);
        var stringNumberSplit = stringNumber.split(".");
        if (stringNumberSplit.length == 1) {
            stringNumber = stringNumber + "." + "".padEnd(digits, "0");
        } else if (stringNumberSplit.length == 2 && stringNumberSplit[1].length < digits) {
            stringNumber = stringNumber + "".padEnd(digits - stringNumberSplit[1].length, "0");
        }

        return stringNumber;
    };

    toolkitFunctions.changeText = function(jQuery, oldText, newText) {
        $(jQuery).each(function(index) {
            if (this.innerText === oldText) {
                this.innerText = newText;
            };
        });
    };

    toolkitFunctions.appendText = function(jQuery, append) {
        $(jQuery).each(function(index) {
            this.innerText = this.innerText + append;
        });
    };

    toolkitFunctions.parseTime = function(time) {
        var timeSplit = time.replace("+", "").split(":");
        if (timeSplit.length == 1) {
            return Number(timeSplit[0]);
        } else if (timeSplit.length == 2) {
            return Number(timeSplit[0]) * 60 + Number(timeSplit[1]);
        } else if (timeSplit.length == 3) {
            return Number(timeSplit[0]) * 60 * 60 + Number(timeSplit[1]) * 60 + Number(timeSplit[2]);
        }
    };

    toolkitFunctions.scrapeResults = function() {
        var results = [];

        for (const resultGroup of Object.values($("div.z4-results-container.content-section")[0].children)) {
            var racers = [];
            var nations = {};

            var racerList = resultGroup.querySelector("div.racer-list-container");
            var summaryRow = resultGroup.querySelector("div.summary-row");

            for (const racerResult of Object.values(racerList.querySelector("ul.racer-list").children)) {
                var line1 = racerResult.querySelector(".racer-line-1");
                var line1Columns = line1.querySelector("div.fields-columns");
                var line1LeftTimeColumns = line1.querySelector("div.lap-times");
                var line1RightTimeColumns = line1.querySelector("div.right-columns");
                var line2 = racerResult.querySelector("div.info");

                var line1LeftTimeColumnsChildren = line1LeftTimeColumns.children;

                var skiTimeSeconds = 0;
                try {
                    skiTimeSeconds = toolkitFunctions.parseTime(line1LeftTimeColumnsChildren[0].children[0].innerText);
                } catch (error) {
                }

                //console.log(line2);
                //console.log(line2.querySelector("span.bib"));
                //console.log(line2.querySelector("span.bib").innerText);
                var racer = ui.current_view.race.getRacerByBibOrChip(line2.querySelector("span.bib").innerText);
                //var racer = ui.current_view.race.getRacerByBibOrChip(line1Columns.querySelector("span.bib").innerText);

                var name;
                try {
                    //console.log(line1Columns);
                    //console.log(line1Columns.querySelector("a.main-field.getName"));
                    //console.log(line1Columns.querySelector("a.main-field.getName").innerText);
                    name = line1Columns.querySelector("a.main-field.getName").innerText;
                } catch (error) {
                    //console.log(line1Columns);
                    //console.log(line1Columns.querySelector("a.main-field.name"));
                    //console.log(line1Columns.querySelector("a.main-field.name").querySelector("span.getName").innerText);
                    name = line1Columns.querySelector("a.main-field.name").querySelector("span.getName").innerText;
                }

                var racerResult1 = {
                    racer: racer,
                    place: line1.querySelector("div.place-column").querySelector("span.place").innerText,
                    name: name,
                    //realTimeSeconds: toolkitFunctions.parseTime(line1LeftTimeColumnsChildren[line1LeftTimeColumnsChildren.length - 1].querySelector("span.time").innerText),
                    timeSeconds: toolkitFunctions.parseTime(line1RightTimeColumns.querySelector("span.finish.time").innerText),
                    skiTimeSeconds: skiTimeSeconds
                    //diffSeconds: toolkitFunctions.parseTime(line1RightTimeColumns.querySelector("span.diff").innerText)
                };
                try {
                    racerResult1["realTimeSeconds"] = toolkitFunctions.parseTime(line1LeftTimeColumnsChildren[line1LeftTimeColumnsChildren.length - 1].querySelector("span.time").innerText);
                } catch (error) {
                    console.log("scrapeResults: no Real Time column");
                }

                racers.push(racerResult1);

                nations[racer.nation] = "";
            }

            results.push({
                name: resultGroup.querySelector("div.group-head.admin-group-head").querySelector("div.title").querySelector("h2").innerText.split("\u00a0")[0],
                registered: summaryRow.children[0].innerText.split(" ")[0],
                finished: summaryRow.children[1].innerText.split(" ")[0],
                dns: summaryRow.children[2].innerText.split(" ")[0],
                dnf: summaryRow.children[3].innerText.split(" ")[0],
                dsq: summaryRow.children[4].innerText.split(" ")[0],
                nations: Object.keys(nations).length,
                racers: racers
            });
        }

        var resultGroupNations = {};
        for (const resultGroup of Object.values(results)) {
            resultGroupNations[resultGroup.name] = resultGroup.nations;
        }
        ui.current_view.race.save({resultGroupNations: resultGroupNations});

        return results;
    };

    toolkitFunctions.scrapeBiathlonResults = function() {
        var results = toolkitFunctions.scrapeResults();
        for (const resultGroup of Object.values(results)) {
            for (const racer of Object.values(resultGroup.racers)) {
                var entity = racer.racer.getEntities()[0];
                if (Number(entity.penalty) > 0 || Number(entity.penalty) < 0) {
                    racer.realTimeSeconds -= Number(entity.penalty) / 1000000;
                }
                racer.totalMisses = toolkitFunctions.getEntityTotalMisses(entity);
            }
        }

        return results;
    };

    toolkitFunctions.logFields = function() {
        ui.current_view.race.getAllFieldsList().forEach(function(field) {
            console.log(field);
        });
    };

    toolkitFunctions.logRacers = function() {
        ui.current_view.race.getEntities().forEach(function(entity) {
            var racer = entity.getRacer();
            if (racer.fislicence == 100214) {
                //console.log(racer.first_name, racer.last_name, entity, racer);
            }
            console.log(racer.first_name, racer.last_name, entity, racer);
        });
    };

    toolkitFunctions.logResults = function() {
        console.log(toolkitFunctions.scrapeResults());
    };

    toolkitFunctions.logBiathlonResults = function() {
        console.log(toolkitFunctions.scrapeBiathlonResults());
    };

    toolkitFunctions.logStartGroups = function() {
        ui.current_view.race.children('StartGroup', 'ordinal').forEach(function(startGroup) {
            console.log(startGroup);
        });
    };

    toolkitFunctions.csvUpdate = function(csv) {
        console.log(csv);
        var lines = csv.split("\n");
        var keys = lines[0].split(",");
        console.log(keys);
        var updated = 0;

        for (var line = 1; line < lines.length; line++) {
            var values = lines[line].split(",");

            ui.current_view.race.getEntities().forEach(function(e) {
                var racer = e.getRacer();
                //console.log(racer[keys[0]], values[0]);
                if (racer[keys[0]] === values[0]) {
                    for (var key = 1; key < keys.length; key++) {
                        var value = values[key];
                        if (keys[key] === "chip_list") {
                            value = [value];
                        }

                        console.log(keys[key], value, {[keys[key]]: value});
                        racer.save({[keys[key]]: value});
                    }
                    updated++;
                }
            });
        }

        console.log("csvUpdate: updated", updated, "racers");
    };

    toolkitFunctions.setHeader

    toolkitFunctions.setFactorToClassic = function() {
        var updated = 0;

        ui.current_view.race.getEntities().forEach(function(e) {
            var racer = e.getRacer();
            e.save({para_factor: racer.classicfactor});
            updated++;
        });

        console.log("setFactorToClassic: updated", updated, "racers");
    };

    toolkitFunctions.setFactorToFree = function() {
        var updated = 0;

        ui.current_view.race.getEntities().forEach(function(e) {
            var racer = e.getRacer();
            e.save({para_factor: racer.factor});
            updated++;
        });

        console.log("setFactorToFree: updated", updated, "racers");
    };

    toolkitFunctions.getEntityTotalMisses = function(entity) {
        var totalMisses = 0;

        for (const entityKey of Object.keys(entity)) {
            if (entityKey.includes("biathlon_dict")) {
                if (entity[entityKey].misses) {
                    var misses = Number(entity[entityKey].misses);
                    if (misses > 0) {
                        totalMisses += misses;
                    }
                }
            }
        }

        return totalMisses;
    };

    const SPRINT_MISS_PENALTY_SECONDS = 15;
    const INDIVIDUAL_MISS_PENALTY_SECONDS = 60;

    toolkitFunctions.setMissPenalty = function() {
        ui.current_view.race.getEntities().forEach(function(entity) {
            var racer = entity.getRacer();
            var totalMisses = toolkitFunctions.getEntityTotalMisses(entity);

            var totalPenaltySeconds = 0;
            if (Number(racer.jurypenalty) > 0 || Number(racer.jurypenalty) < 0) {
                totalPenaltySeconds = Number(racer.jurypenalty);
            }
            if (ui.current_view.race.name.includes("Sprint")) {
                totalPenaltySeconds += totalMisses * SPRINT_MISS_PENALTY_SECONDS;
            } else if (ui.current_view.race.name.includes("Individual")) {
                totalPenaltySeconds += totalMisses * INDIVIDUAL_MISS_PENALTY_SECONDS;
            }

            console.log(racer.last_name + " " + racer.first_name, Number(racer.jurypenalty), Number(racer.jurypenalty) > 0 || Number(racer.jurypenalty) < 0, totalMisses, totalPenaltySeconds);
            racer.save({misspenalty: totalPenaltySeconds});
            entity.save({is_set_penalty: true, penalty: totalPenaltySeconds * 1000000});
        });
    };

    toolkitFunctions.setMaxFISPoints = function() {
        var updated = 0;

        ui.current_view.race.getEntities().forEach(function(e) {
            var racer = e.getRacer();
            if (!racer.fispoints || racer.fispoints == "") {
                racer.save({fispoints: "99999999"});
                updated++;
            }
        });

        console.log("setMaxFISPoints: updated", updated, "racers");
    };

    toolkitFunctions.clearMaxFISPoints = function() {
        var updated = 0;

        ui.current_view.race.getEntities().forEach(function(e) {
            var racer = e.getRacer();
            if (racer.fispoints == "99999999") {
                racer.save({fispoints: ""});
                updated++;
            }
        });

        console.log("clearMaxFISPoints: updated", updated, "racers");
    };

    toolkitFunctions.calculateDeltaTime = function() {
        var updated = 0;
        var results = toolkitFunctions.scrapeResults();

        for (const resultGroup of Object.values(results)) {
            if (resultGroup.finished > 0) {
                var winnerTimeSeconds = resultGroup.racers[0].timeSeconds;

                for (const racer of Object.values(resultGroup.racers)) {
                    var place = Number(racer.place);
                    if (place == 1) {
                        racer.racer.save({deltatime: ""});
                    } else if (place > 1) {
                        var deltaTimeSeconds = racer.realTimeSeconds - winnerTimeSeconds / (Number(racer.racer.getEntities()[0].para_factor) / 100);
                        console.log(racer.racer.bib, deltaTimeSeconds, toolkitFunctions.formatTimeSeconds(deltaTimeSeconds, false, Number(ui.current_view.race.precision)));
                        racer.racer.save({deltatime: toolkitFunctions.formatTimeSeconds(deltaTimeSeconds, false, Number(ui.current_view.race.precision))});
                        updated++;
                    }
                }
            }
        }

        console.log("calculateDeltaTime: updated", updated, "racers");
        if (updated < 1) {
            window.alert("calculateDeltaTime: nothing was updated\nUsage: This must be run with a result set open and bib as a line 2 field.");
        }
    }

    toolkitFunctions.calculateXPoints = function() {
        var updated = 0;
        var results = toolkitFunctions.scrapeResults();

        for (const resultGroup of Object.values(results)) {
            for (const racer of Object.values(resultGroup.racers)) {
                var place = Number(racer.place);
                if (place > 0) {
                    var xPoints = Math.max(0.001, (racer.timeSeconds / resultGroup.racers[0].timeSeconds - 1) * 800);
                    racer.racer.save({ibupoints: xPoints});
                    updated++;
                } else {
                    racer.racer.save({fispoints1: ""});
                }
            }
        }

        console.log("calculateXPoints: updated", updated, "racers");
        if (updated < 1) {
            window.alert("calculateXPoints: nothing was updated\nUsage: This must be run with a result set open and bib as a line 2 field.");
        }
    };

    const WC_POINTS_FINISHERS_CAPPED_5_PLACE = {
        1: {
            1: 50
        },
        2: {
            1: 60,
            2: 40
        },
        3: {
            1: 80,
            2: 50,
            3: 30
        },
        4: {
            1: 90,
            2: 75,
            3: 50,
            4: 20
        },
        5: {
            1: 100,
            2: 95,
            3: 90,
            4: 85,
            5: 80,
            6: 75,
            7: 72,
            8: 69,
            9: 66,
            10: 63,
            11: 60,
            12: 58,
            13: 56,
            14: 54,
            15: 52,
            16: 50,
            17: 48,
            18: 46,
            19: 44,
            20: 42,
            21: 40,
            22: 38,
            23: 36,
            24: 34,
            25: 32,
            26: 30,
            27: 28,
            28: 26,
            29: 24,
            30: 22
        }
    };

    toolkitFunctions.calculateWCPoints = function() {
        var updated = 0
        var results = toolkitFunctions.scrapeResults();

        for (const resultGroup of Object.values(results)) {
            var finishersCapped5 = Math.min(resultGroup.finished, 5);
            var resultGroupWCPointsTimeLimitSeconds = resultGroup.racers[0].timeSeconds * 1.3;

            for (const racer of Object.values(resultGroup.racers)) {
                var place = Number(racer.place);
                if (place > 0 && place <= 30 && racer.timeSeconds <= resultGroupWCPointsTimeLimitSeconds) {
                    var wcPoints = WC_POINTS_FINISHERS_CAPPED_5_PLACE[finishersCapped5][place];
                    racer.racer.save({wcpoints: wcPoints});
                    updated++;
                } else {
                    racer.racer.save({wcpoints: ""});
                }
            }
        }

        console.log("calculateWCPoints: updated", updated, "racers");
        if (updated < 1) {
            window.alert("calculateWCPoints: nothing was updated\nUsage: This must be run with a result set open and bib as a line 2 field.");
        }
    };

    const WC_POINTS_Q_PLACE = {
        1: 15,
        2: 12,
        3: 10,
        4: 8,
        5: 6,
        6: 5,
        7: 4,
        8: 3,
        9: 2,
        10: 1
    };

    toolkitFunctions.calculateWCPointsQ = function() {
        var updated = 0
        var results = toolkitFunctions.scrapeResults();

        for (const resultGroup of Object.values(results)) {
            var resultGroupWCPointsTimeLimitSeconds = resultGroup.racers[0].timeSeconds * 1.3;

            for (const racer of Object.values(resultGroup.racers)) {
                var place = Number(racer.place);
                if (place > 0 && place <= 10 && racer.timeSeconds <= resultGroupWCPointsTimeLimitSeconds) {
                    var wcPointsQ = WC_POINTS_Q_PLACE[place];
                    racer.racer.save({wcpointsq: wcPointsQ});
                    updated++;
                } else {
                    racer.racer.save({wcpointsq: ""});
                }
            }
        }

        console.log("calculateWCPointsQ: updated", updated, "racers");
        if (updated < 1) {
            window.alert("calculateWCPointsQ: nothing was updated\nUsage: This must be run with a result set open and bib as a line 2 field.");
        }
    };

    toolkitFunctions.calculateWCPointsH = function() {
        var updated = 0
        var results = toolkitFunctions.scrapeResults();
        console.log(results);

        for (const resultGroup of Object.values(results)) {
            var finishersCapped5 = Math.min(resultGroup.finished, 5);
            var resultGroupWCPointsTimeLimitSeconds = resultGroup.racers[0].timeSeconds * 1.3;

            for (const racer of Object.values(resultGroup.racers)) {
                console.log(Number(racer.racer.finalplace));
                var place = Number(racer.place);
                var finalPlace = Number(racer.racer.finalplace);
                if (finalPlace > 0) {
                    place = finalPlace;
                }

                if (place > 0 && place <= 30 && racer.timeSeconds <= resultGroupWCPointsTimeLimitSeconds) {
                    var wcPointsH = WC_POINTS_FINISHERS_CAPPED_5_PLACE[finishersCapped5][place];
                    racer.racer.save({wcpointsh: wcPointsH});
                    updated++;
                } else {
                    racer.racer.save({wcpointsh: ""});
                }
            }
        }

        console.log("calculateWCPointsH: updated", updated, "racers");
        if (updated < 1) {
            window.alert("calculateWCPointsH: nothing was updated\nUsage: This must be run with a result set open and bib as a line 2 field.");
        }
    };

    toolkitFunctions.calculateWCPointsF = function() {
        for (const entity of Object.values(ui.current_view.race.getEntities())) {
            var racer = entity.getRacer();
            var wcPointsF = 0;
            if (Number(racer.wcpointsq) > 0) {
                wcPointsF += Number(racer.wcpointsq);
            }
            if (Number(racer.wcpointsh) > 0) {
                wcPointsF += Number(racer.wcpointsh);
            }
            if (wcPointsF > 0) {
                racer.save({wcpointsf: wcPointsF});
            }
        }
    }

    //const HEADER_SITTING_DISTANCE = `<div class="results-header content-block"><div class="header-section"><span class="title">Competition Jury</span><div class="text-section"><div class="text-item"><span class="text-title">Technical Delegate</span><span class="text">John Aalberg (CAN)</span></div><div class="text-item"><span class="text-title">Assistant Technical Delegate</span><span class="text">Fred Bailey (USA)</span></div><div class="text-item"><span class="text-title">Chief of Competition</span><span class="text">Tom Holland (CAN)</span></div><div class="text-item"><span class="text-title">Race Director</span><span class="text">Georg Zipfel (FIS)</span></div><div class="text-item"><span class="text-title">National Technical Delegate</span><span class="text">Jennifer Tomlinson (CAN)</span></div><div class="text-item"><span class="text-title">Adaptive Equipment Controller</span><span class="text">Sue Sandwick (USA)</span></div><div class="text-item"><span class="text-title">Equipment Controller</span><span class="text">Sue Schwartz (CAN)</span></div></div></div><div class="header-section"><span class="title">Race Data Overview</span><div class="text-section"><div class="text-item"><span class="text-title">Track Name</span><span class="text">Sitting 2.5 course</span></div><div class="text-item"><span class="text-title">Height Difference</span><span class="text">20m</span></div><div class="text-item"><span class="text-title">Maximum Climb</span><span class="text">10m</span></div><div class="text-item"><span class="text-title">Total Climb</span><span class="text">53m</span></div><div class="text-item"><span class="text-title">Laps</span><span class="text">4</span></div><div class="text-item"><span class="text-title">Length of Laps</span><span class="text">2636m</span></div><div class="text-item"><span class="text-title">Weather</span><span class="text">partly cloudy</span></div><div class="text-item"><span class="text-title">Snow Conditions</span><span class="text">packed</span></div><div class="text-item"><span class="text-title">Air Temperature</span><span class="text">-0.8C</span></div><div class="text-item"><span class="text-title">Wind</span><span class="text">12 km/hr</span></div></div></div></div>`;

    //const HEADER_STANDING_DISTANCE = `<div class="results-header content-block"><div class="header-section"><span class="title">Competition Jury</span><div class="text-section"><div class="text-item"><span class="text-title">Technical Delegate</span><span class="text">John Aalberg (CAN)</span></div><div class="text-item"><span class="text-title">Assistant Technical Delegate</span><span class="text">Fred Bailey (USA)</span></div><div class="text-item"><span class="text-title">Chief of Competition</span><span class="text">Tom Holland (CAN)</span></div><div class="text-item"><span class="text-title">Race Director</span><span class="text">Georg Zipfel (FIS)</span></div><div class="text-item"><span class="text-title">National Technical Delegate</span><span class="text">Jennifer Tomlinson (CAN)</span></div><div class="text-item"><span class="text-title">Adaptive Equipment Controller</span><span class="text">Sue Sandwick (USA)</span></div><div class="text-item"><span class="text-title">Equipment Controller</span><span class="text">Sue Schwartz (CAN)</span></div></div></div><div class="header-section"><span class="title">Race Data Overview</span><div class="text-section"><div class="text-item"><span class="text-title">Track Name</span><span class="text">Standing/VI 2.5k Course</span></div><div class="text-item"><span class="text-title">Height Difference</span><span class="text">25m</span></div><div class="text-item"><span class="text-title">Maximum Climb</span><span class="text">13m</span></div><div class="text-item"><span class="text-title">Total Climb</span><span class="text">74m</span></div><div class="text-item"><span class="text-title">Laps</span><span class="text">4</span></div><div class="text-item"><span class="text-title">Length of Laps</span><span class="text">2537m</span></div><div class="text-item"><span class="text-title">Weather</span><span class="text">partly cloudy</span></div><div class="text-item"><span class="text-title">Snow Conditions</span><span class="text">packed</span></div><div class="text-item"><span class="text-title">Air Temperature</span><span class="text">1C</span></div><div class="text-item"><span class="text-title">Wind</span><span class="text">7 km/hr</span></div></div></div></div>`;

    const HEADER_SITTING_SPRINT = `<div class="results-header content-block"><div class="header-section"><span class="title">Competition Jury</span><div class="text-section"><div class="text-item"><span class="text-title">Technical Delegate</span><span class="text">John Aalberg (CAN)</span></div><div class="text-item"><span class="text-title">Assistant Technical Delegate</span><span class="text">Fred Bailey (USA)</span></div><div class="text-item"><span class="text-title">Chief of Competition</span><span class="text">Tom Holland (CAN)</span></div><div class="text-item"><span class="text-title">Race Director</span><span class="text">Georg Zipfel (FIS)</span></div><div class="text-item"><span class="text-title">National Technical Delegate</span><span class="text">Jennifer Tomlinson (CAN)</span></div><div class="text-item"><span class="text-title">Adaptive Equipment Controller</span><span class="text">Sue Sandwick (USA)</span></div><div class="text-item"><span class="text-title">Equipment Controller</span><span class="text">Sue Schwartz (CAN)</span></div></div></div><div class="header-section"><span class="title">Race Data Overview</span><div class="text-section"><div class="text-item"><span class="text-title">Track Name</span><span class="text">Sitting Sprint Course</span></div><div class="text-item"><span class="text-title">Height Difference</span><span class="text">8m</span></div><div class="text-item"><span class="text-title">Maximum Climb</span><span class="text">8m</span></div><div class="text-item"><span class="text-title">Total Climb</span><span class="text">19m</span></div><div class="text-item"><span class="text-title">Laps</span><span class="text">1</span></div><div class="text-item"><span class="text-title">Length of Laps</span><span class="text">959m</span></div><div class="text-item"><span class="text-title">Weather</span><span class="text">partly cloudy</span></div><div class="text-item"><span class="text-title">Snow Conditions</span><span class="text">packed</span></div><div class="text-item"><span class="text-title">Air Temperature</span><span class="text">-14C</span></div><div class="text-item"><span class="text-title">Wind</span><span class="text">4km/hr from east</span></div></div></div></div>`;

    const HEADER_STANDING_SPRINT = `<div class="results-header content-block"><div class="header-section"><span class="title">Competition Jury</span><div class="text-section"><div class="text-item"><span class="text-title">Technical Delegate</span><span class="text">John Aalberg (CAN)</span></div><div class="text-item"><span class="text-title">Assistant Technical Delegate</span><span class="text">Fred Bailey (USA)</span></div><div class="text-item"><span class="text-title">Chief of Competition</span><span class="text">Tom Holland (CAN)</span></div><div class="text-item"><span class="text-title">Race Director</span><span class="text">Georg Zipfel (FIS)</span></div><div class="text-item"><span class="text-title">National Technical Delegate</span><span class="text">Jennifer Tomlinson (CAN)</span></div><div class="text-item"><span class="text-title">Adaptive Equipment Controller</span><span class="text">Sue Sandwick (USA)</span></div><div class="text-item"><span class="text-title">Equipment Controller</span><span class="text">Sue Schwartz (CAN)</span></div></div></div><div class="header-section"><span class="title">Race Data Overview</span><div class="text-section"><div class="text-item"><span class="text-title">Track Name</span><span class="text">Standing Sprint Course</span></div><div class="text-item"><span class="text-title">Height Difference</span><span class="text">25m</span></div><div class="text-item"><span class="text-title">Maximum Climb</span><span class="text">19m</span></div><div class="text-item"><span class="text-title">Total Climb</span><span class="text">41m</span></div><div class="text-item"><span class="text-title">Laps</span><span class="text">1</span></div><div class="text-item"><span class="text-title">Length of Laps</span><span class="text">1370m</span></div><div class="text-item"><span class="text-title">Weather</span><span class="text">partly cloudy</span></div><div class="text-item"><span class="text-title">Snow Conditions</span><span class="text">packed</span></div><div class="text-item"><span class="text-title">Air Temperature</span><span class="text">-14C</span></div><div class="text-item"><span class="text-title">Wind</span><span class="text">4km/hr from east</span></div></div></div></div>`;

    const HEADER_SITTING_DISTANCE = `<div class="results-header content-block"><div class="header-section"><span class="title">Competition Jury</span><div class="text-section"><div class="text-item"><span class="text-title">Technical Delegate</span><span class="text">John Aalberg (CAN)</span></div><div class="text-item"><span class="text-title">Assistant Technical Delegate</span><span class="text">Fred Bailey (USA)</span></div><div class="text-item"><span class="text-title">Chief of Competition</span><span class="text">Tom Holland (CAN)</span></div><div class="text-item"><span class="text-title">Race Director</span><span class="text">Georg Zipfel (FIS)</span></div><div class="text-item"><span class="text-title">National Technical Delegate</span><span class="text">Jennifer Tomlinson (CAN)</span></div><div class="text-item"><span class="text-title">Adaptive Equipment Controller</span><span class="text">Sue Sandwick (USA)</span></div><div class="text-item"><span class="text-title">Equipment Controller</span><span class="text">Sue Schwartz (CAN)</span></div></div></div><div class="header-section"><span class="title">Race Data Overview</span><div class="text-section"><div class="text-item"><span class="text-title">Track Name</span><span class="text">Sitting 2.5 course</span></div><div class="text-item"><span class="text-title">Height Difference</span><span class="text">20m</span></div><div class="text-item"><span class="text-title">Maximum Climb</span><span class="text">10m</span></div><div class="text-item"><span class="text-title">Total Climb</span><span class="text">53m</span></div><div class="text-item"><span class="text-title">Laps</span><span class="text">4</span></div><div class="text-item"><span class="text-title">Length of Laps</span><span class="text">2636m</span></div><div class="text-item"><span class="text-title">Weather</span><span class="text">overcast</span></div><div class="text-item"><span class="text-title">Snow Conditions</span><span class="text">packed</span></div><div class="text-item"><span class="text-title">Air Temperature</span><span class="text">0.1C</span></div><div class="text-item"><span class="text-title">Wind</span><span class="text">12.7km/hr from NW</span></div></div></div></div>`;

    const HEADER_STANDING_DISTANCE = `<div class="results-header content-block"><div class="header-section"><span class="title">Competition Jury</span><div class="text-section"><div class="text-item"><span class="text-title">Technical Delegate</span><span class="text">John Aalberg (CAN)</span></div><div class="text-item"><span class="text-title">Assistant Technical Delegate</span><span class="text">Fred Bailey (USA)</span></div><div class="text-item"><span class="text-title">Chief of Competition</span><span class="text">Tom Holland (CAN)</span></div><div class="text-item"><span class="text-title">Race Director</span><span class="text">Georg Zipfel (FIS)</span></div><div class="text-item"><span class="text-title">National Technical Delegate</span><span class="text">Jennifer Tomlinson (CAN)</span></div><div class="text-item"><span class="text-title">Adaptive Equipment Controller</span><span class="text">Sue Sandwick (USA)</span></div><div class="text-item"><span class="text-title">Equipment Controller</span><span class="text">Sue Schwartz (CAN)</span></div></div></div><div class="header-section"><span class="title">Race Data Overview</span><div class="text-section"><div class="text-item"><span class="text-title">Track Name</span><span class="text">Standing/VI 2.5k Course</span></div><div class="text-item"><span class="text-title">Height Difference</span><span class="text">25m</span></div><div class="text-item"><span class="text-title">Maximum Climb</span><span class="text">13m</span></div><div class="text-item"><span class="text-title">Total Climb</span><span class="text">74m</span></div><div class="text-item"><span class="text-title">Laps</span><span class="text">4</span></div><div class="text-item"><span class="text-title">Length of Laps</span><span class="text">2537m</span></div><div class="text-item"><span class="text-title">Weather</span><span class="text">overcast</span></div><div class="text-item"><span class="text-title">Snow Conditions</span><span class="text">packed</span></div><div class="text-item"><span class="text-title">Air Temperature</span><span class="text">0.1C</span></div><div class="text-item"><span class="text-title">Wind</span><span class="text">12.7km/hr from NW</span></div></div></div></div>`;


    toolkitFunctions.reDrawHeader = function() {
        if ($("h1.print-title")[0].innerText.includes("Sprint")) {
            if ($("h2")[0].innerText.includes("Sitting")) {
                $("div.results-header.content-block").replaceWith(HEADER_SITTING_SPRINT);
            } else {
                $("div.results-header.content-block").replaceWith(HEADER_STANDING_SPRINT);
            }
        } else {
            if ($("h2")[0].innerText.includes("Sitting")) {
                $("div.results-header.content-block").replaceWith(HEADER_SITTING_DISTANCE);
            } else {
                $("div.results-header.content-block").replaceWith(HEADER_STANDING_DISTANCE);
            }
        }
    };

    toolkitFunctions.reDrawStartList = function() {
        toolkitFunctions.reDrawHeader();

        toolkitFunctions.changeText("span.top-field.fislicence", "FIS Licence", "FIS Code");
        toolkitFunctions.changeText("span.top-field.classification", "Classification", "Sport Class");
        toolkitFunctions.changeText("span.top-field.para_factor", "Time Factor", "");
        toolkitFunctions.changeText("span.top-field.classicfactor", "Classic Factor", "");
        toolkitFunctions.changeText("span.top-field.classicfactor", "Free Factor", "");
        toolkitFunctions.appendText("span.top-field.para_factor", "%");
        toolkitFunctions.appendText("span.top-field.classicfactor", "%");
        toolkitFunctions.appendText("span.top-field.freefactor", "%");
        $("div.content-block.app-container").append($("div.results-header.content-block"));

        try {
            var resultGroupNations = JSON.parse(ui.current_view.race.resultGroupNations);
            $("li.summary-row").each(function(index) {
                var startGroupName = this.parentElement.parentElement.querySelector("div.group-head").querySelector("h2").innerText;
                for (const resultGroupNationsName of Object.keys(resultGroupNations)) {
                    if (startGroupName.includes(resultGroupNationsName)) {
                        this.insertAdjacentHTML(
                            "beforeend",
                            "<span class='item'><strong class='count'>" + resultGroupNations[resultGroupNationsName] + "</strong> Nations</span>"
                        );
                    }
                }
            });
        } catch (error) {
            console.log("reDrawStartList: skipping nations");
        }
    };

    toolkitFunctions.reDrawResults = function() {
        toolkitFunctions.reDrawHeader();

        toolkitFunctions.changeText("span.main-field.fislicence", "FIS Licence", "FIS Code");
        toolkitFunctions.changeText("span.main-field.field-label.classification", "Classification", "Sport Class");
        toolkitFunctions.changeText("span.main-field.field-label.para_factor", "Time Factor", "");
        toolkitFunctions.changeText("span.classicfactor", "Classic Factor", "");
        toolkitFunctions.changeText("span.classicfactor", "Free Factor", "");
        toolkitFunctions.appendText("span.para_factor.main-field", "%");
        toolkitFunctions.appendText("span.classicfactor", "%");
        toolkitFunctions.appendText("span.freefactor", "%");
        toolkitFunctions.changeText("span.main-field.field-label.wcpointsq", "WC Points Q", "WC Points");
        toolkitFunctions.changeText("span.main-field.field-label.wcpointsh", "WC Points H", "WC Points");
        toolkitFunctions.changeText("span.main-field.field-label.wcpointsf", "WC Points F", "WC Points");
        toolkitFunctions.changeText("span.lap.right", "Raw Time", "Real Time");
        toolkitFunctions.changeText("span.diffs-header", "Diffs", "Behind");
        $("div.content-block.app-container").append($("div.results-header.content-block"));

        try {
            $("div.summary-row").each(function(index) {
                var resultGroupName = this.parentElement.parentElement.querySelector("div.public-heading.group-head").querySelector("h2").innerText;
                var resultGroupNations = JSON.parse(ui.current_view.race.resultGroupNations);
                for (const resultGroupNationsName of Object.keys(resultGroupNations)) {
                    if (resultGroupName.includes(resultGroupNationsName)) {
                        this.insertAdjacentHTML(
                            "beforeend",
                            "<span class='item'><strong class='count'>" + resultGroupNations[resultGroupNationsName] + "</strong> Nations</span>"
                        );
                    }
                }
            });
        } catch (error) {
            console.log("reDrawStartList: skipping nations");
        }
    };

    toolkitFunctions.reDrawBiathlonSanctions = function() {
        $("li.help.text").each(function(index) {
            const bib = this.innerHTML.match(/#(\d+)/)[1];
            var racer = ui.current_view.race.getRacerByBibOrChip(bib);
            console.log(this, bib, racer, racer.jurypenalty, this.querySelectorAll("strong")[1]);
            if (racer.jurypenalty) {
                this.querySelectorAll("strong")[1].innerText = toolkitFunctions.formatTimeSeconds(racer.jurypenalty, true, 0);
            }
        });
    };

    const SF1_PLACES = [1, 4, 5, 8, 9, 12];
    const SF2_PLACES = [2, 3, 6, 7, 10, 11];
    const SF1_PLACES_VI = [1, 4, 5, 8];
    const SF2_PLACES_VI = [2, 3, 6, 7];

    toolkitFunctions.logSprintSemiFinals = function() {
        var csv = "";
        var results = toolkitFunctions.scrapeResults();

        csv += "fislicence,bib,heat,startgap,lanechoice\n";
        for (const resultGroup of Object.values(results)) {
            var bib = 1;
            for (const racer of Object.values(resultGroup.racers)) {
                var place = Number(racer.place);
                if (place > 0) {
                    if (resultGroup.name.includes("Vision Impaired")) {
                        if (SF1_PLACES_VI.includes(place)) {
                            csv += racer.racer.fislicence + "," + bib + "," + resultGroup.name + " Semi-Final 1," + Math.round(resultGroup.racers[0].realTimeSeconds - (resultGroup.racers[0].timeSeconds) * (100 / Number(racer.racer.getEntities()[0].para_factor))) + "," + (SF1_PLACES_VI.indexOf(place) + 1) + "\n";
                        } else if (SF2_PLACES_VI.includes(place)) {
                            csv += racer.racer.fislicence + "," + bib + "," + resultGroup.name + " Semi-Final 2," + Math.round(resultGroup.racers[0].realTimeSeconds - (resultGroup.racers[0].timeSeconds) * (100 / Number(racer.racer.getEntities()[0].para_factor))) + "," + (SF2_PLACES_VI.indexOf(place) + 1) + "\n";
                        }
                    } else {
                        if (SF1_PLACES.includes(place)) {
                            csv += racer.racer.fislicence + "," + bib + "," + resultGroup.name + " Semi-Final 1," + Math.round(resultGroup.racers[0].realTimeSeconds - (resultGroup.racers[0].timeSeconds) * (100 / Number(racer.racer.getEntities()[0].para_factor))) + "," + (SF1_PLACES.indexOf(place) + 1) + "\n";
                        } else if (SF2_PLACES.includes(place)) {
                            csv += racer.racer.fislicence + "," + bib + "," + resultGroup.name + " Semi-Final 2," + Math.round(resultGroup.racers[0].realTimeSeconds - (resultGroup.racers[0].timeSeconds) * (100 / Number(racer.racer.getEntities()[0].para_factor))) + "," + (SF2_PLACES.indexOf(place) + 1) + "\n";
                        }
                    }
                    bib++;
                }
            }
        }
        console.log(csv);
    };

    toolkitFunctions.logSprintFinal = function() {
        var results = toolkitFunctions.scrapeResults();
        //console.log(results);

        var csv = "fislicence,bib,chip_list,heat,startgap,lanechoice\n";
        if (Number(results[0].racers[0].racer.bib) < Number(results[1].racers[0].racer.bib)) {
            csv += results[0].racers[0].racer.fislicence + "," + results[0].racers[0].racer.bib + "," + results[0].racers[0].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[0].racers[0].racer.startgap + ",1\n";
            csv += results[1].racers[0].racer.fislicence + "," + results[1].racers[0].racer.bib + "," + results[1].racers[0].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[1].racers[0].racer.startgap + ",2\n";
        } else {
            csv += results[0].racers[0].racer.fislicence + "," + results[0].racers[0].racer.bib + "," + results[0].racers[0].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[0].racers[0].racer.startgap + ",2\n";
            csv += results[1].racers[0].racer.fislicence + "," + results[1].racers[0].racer.bib + "," + results[1].racers[0].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[1].racers[0].racer.startgap + ",1\n";
        }
        if (Number(results[0].racers[1].racer.bib) < Number(results[1].racers[1].racer.bib)) {
            csv += results[0].racers[1].racer.fislicence + "," + results[0].racers[1].racer.bib + "," + results[0].racers[1].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[0].racers[1].racer.startgap + ",3\n";
            csv += results[1].racers[1].racer.fislicence + "," + results[1].racers[1].racer.bib + "," + results[1].racers[1].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[1].racers[1].racer.startgap + ",4\n";
        } else {
            csv += results[0].racers[1].racer.fislicence + "," + results[0].racers[1].racer.bib + "," + results[0].racers[1].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[0].racers[1].racer.startgap + ",4\n";
            csv += results[1].racers[1].racer.fislicence + "," + results[1].racers[1].racer.bib + "," + results[1].racers[1].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[1].racers[1].racer.startgap + ",3\n";
        }
        if (!results[0].name.includes("Vision Impaired")) {
            if (Number(results[0].racers[2].racer.bib) < Number(results[1].racers[2].racer.bib)) {
                csv += results[0].racers[2].racer.fislicence + "," + results[0].racers[2].racer.bib + "," + results[0].racers[2].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[0].racers[2].racer.startgap + ",5\n";
                csv += results[1].racers[2].racer.fislicence + "," + results[1].racers[2].racer.bib + "," + results[1].racers[2].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[1].racers[2].racer.startgap + ",6\n";
            } else {
                csv += results[0].racers[2].racer.fislicence + "," + results[0].racers[2].racer.bib + "," + results[0].racers[2].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[0].racers[2].racer.startgap + ",6\n";
                csv += results[1].racers[2].racer.fislicence + "," + results[1].racers[2].racer.bib + "," + results[1].racers[2].racer.chip_list[0] + "," + results[0].name.replace("Semi-Final 1", "Final") + "," + results[1].racers[2].racer.startgap + ",5\n";
            }
        }
        console.log(csv);

        csv = "fislicence,finalplace,level\n";
        if (!results[0].name.includes("Vision Impaired")) {
            if (Number(results[0].racers[3].racer.bib) < Number(results[1].racers[3].racer.bib)) {
                csv += results[0].racers[3].racer.fislicence + ",7,Semi-Finals\n";
                csv += results[1].racers[3].racer.fislicence + ",8,Semi-Finals\n";
            } else {
                csv += results[0].racers[3].racer.fislicence + ",8,Semi-Finals\n";
                csv += results[1].racers[3].racer.fislicence + ",7,Semi-Finals\n";
            }
            if (Number(results[0].racers[4].racer.bib) < Number(results[1].racers[4].racer.bib)) {
                csv += results[0].racers[4].racer.fislicence + ",9,Semi-Finals\n";
                csv += results[1].racers[4].racer.fislicence + ",10,Semi-Finals\n";
            } else {
                csv += results[0].racers[4].racer.fislicence + ",10,Semi-Finals\n";
                csv += results[1].racers[4].racer.fislicence + ",9,Semi-Finals\n";
            }
            if (Number(results[0].racers[5].racer.bib) < Number(results[1].racers[5].racer.bib)) {
                csv += results[0].racers[5].racer.fislicence + ",11,Semi-Finals\n";
                csv += results[1].racers[5].racer.fislicence + ",12,Semi-Finals\n";
            } else {
                csv += results[0].racers[5].racer.fislicence + ",12,Semi-Finals\n";
                csv += results[1].racers[5].racer.fislicence + ",11,Semi-Finals\n";
            }
        } else {
            if (Number(results[0].racers[2].racer.bib) < Number(results[1].racers[2].racer.bib)) {
                csv += results[0].racers[2].racer.fislicence + ",7,Semi-Finals\n";
                csv += results[1].racers[2].racer.fislicence + ",8,Semi-Finals\n";
            } else {
                csv += results[0].racers[2].racer.fislicence + ",8,Semi-Finals\n";
                csv += results[1].racers[2].racer.fislicence + ",7,Semi-Finals\n";
            }
            if (Number(results[0].racers[3].racer.bib) < Number(results[1].racers[3].racer.bib)) {
                csv += results[0].racers[3].racer.fislicence + ",9,Semi-Finals\n";
                csv += results[1].racers[3].racer.fislicence + ",10,Semi-Finals\n";
            } else {
                csv += results[0].racers[3].racer.fislicence + ",10,Semi-Finals\n";
                csv += results[1].racers[3].racer.fislicence + ",9,Semi-Finals\n";
            }
        }
        console.log(csv);
    }

    toolkitFunctions.logSprintFinalResults = function() {
        var results = toolkitFunctions.scrapeResults();

        var csv = "fislicence,finalplace,level\n";
        csv += results[0].racers[0].racer.fislicence + ",1,Final\n";
        csv += results[0].racers[1].racer.fislicence + ",2,Final\n";
        csv += results[0].racers[2].racer.fislicence + ",3,Final\n";
        csv += results[0].racers[3].racer.fislicence + ",4,Final\n";
        if (!results[0].name.includes("Vision Impaired")) {
            csv += results[0].racers[4].racer.fislicence + ",5,Final\n";
            csv += results[0].racers[5].racer.fislicence + ",6,Final\n";
        }
        console.log(csv);
    }

    toolkitFunctions.setHeatChips = function() {
        ui.current_view.race.children('StartGroup', 'ordinal').forEach(function(startGroup) {
            var entities = startGroup.getEntities();
            for (const entity of entities) {
                var racer = entity.getRacer();
                var chip;
                if (startGroup.name.includes("Sitting Women")) {
                    chip = "F" + racer.bib;
                } else if (startGroup.name.includes("Sitting Men")) {
                    chip = "F" + (Number(racer.bib) + 20);
                } else if (startGroup.name.includes("Standing Women")) {
                    chip = "F" + (Number(racer.bib) + 40);
                } else if (startGroup.name.includes("Standing Men")) {
                    chip = "F" + (Number(racer.bib) + 60);
                } else if (startGroup.name.includes("Vision Impaired Women")) {
                    chip = "W" + racer.bib;
                } else if (startGroup.name.includes("Vision Impaired Men")) {
                    chip = "W" + (Number(racer.bib) + 20);
                }

                racer.save({chip_list: [chip]});
            }
        });
    };

    toolkitFunctions.setHeatStartTimes = function() {
        var heatStartTime = 0;
        ui.current_view.race.children('StartGroup', 'ordinal').forEach(function(startGroup) {
            if (heatStartTime == 0) {
                heatStartTime = startGroup.first_start_time;
            } else {
                heatStartTime += 5 * 60 * 1000000;
                startGroup.save({first_start_time: heatStartTime});
            }
        });
    }

    toolkitFunctions.setHeatStartGaps = function() {
        ui.current_view.race.children('StartGroup', 'ordinal').forEach(function(startGroup) {
            var entities = startGroup.getEntities();
            var minStartGap = 9999;
            for (const entity of entities) {
                var racer1 = entity.getRacer();
                minStartGap = Math.min(minStartGap, racer1.startgap);
            }
            console.log(startGroup, minStartGap);
            for (const entity of entities) {
                var racer2 = entity.getRacer();
                var startGapHeat = racer2.startgap - minStartGap;
                //racer2.save({startgapheat: startGapHeat});
                entity.save({scheduled_start_time: startGroup.first_start_time + startGapHeat * 1000000});
                entity.save({time_0_list: [startGroup.first_start_time, undefined]});
            }
        });
    };

    toolkitFunctions.logBiathlonPursuit = function() {
        var results = toolkitFunctions.scrapeBiathlonResults();
        console.log(results);
        for (const resultGroup of Object.values(results)) {
            var csv = resultGroup.name + "\nibuid,first_name,last_name,para_factor,timetotalmisses,realtimeseconds,timeseconds\n";
            var resultGroupTimeLimitSeconds = resultGroup.racers[0].timeSeconds * 1.3

            for (const racer of Object.values(resultGroup.racers)) {
                if (Number(racer.place) > 0 && racer.timeSeconds <= resultGroupTimeLimitSeconds) {
                    //console.log(racer);
                    //console.log(racer.racer.getEntities());
                    csv += racer.racer.ibuid + "," + racer.racer.first_name + "," + racer.racer.last_name + "," + racer.racer.getEntities()[0].para_factor + "," + racer.totalMisses + "," + racer.realTimeSeconds + "," + racer.timeSeconds + "\n"
                    racer.racer.save({pursuit: "Qualified"});
                } else {
                    racer.racer.save({pursuit: ""});
                }
            }
            console.log(csv);
        }
    };

    toolkitFunctions.setBiathlonPursuitStart = function() {
        ui.current_view.race.children('StartGroup', 'ordinal').forEach(function(startGroup) {
            var entities = startGroup.getEntities();
            for (const entity of entities) {
                var racer = entity.getRacer();
                entity.save({scheduled_start_time: startGroup.first_start_time + racer.startgap * 1000000});
                entity.save({time_0_list: [startGroup.first_start_time, undefined]});
            }
        });
    };

    toolkitFunctions.log2LaneStartList = function() {
        $("div.start-group").each(function(index) {
            var csv = this.querySelector("div.group-head").querySelector("h2").innerText + "\n";
            var racerIndex = 0;
            for (const racerRow of Object.values(this.querySelector("ul.racer-list").querySelectorAll("li.racer-row"))) {
                csv += racerRow.querySelector("span.top-field.narrow").innerText + "," + racerRow.querySelector("a.name").innerText + "," + racerRow.querySelector("span.top-field.time.scheduled").innerText
                if (racerIndex % 2 == 0) {
                    csv += ",";
                } else {
                    csv += "\n";
                }
                racerIndex++;
            }
            console.log(csv);
        });
    };

    toolkitFunctions.setBiathlonTimes = function() {
        var results = toolkitFunctions.scrapeBiathlonResults();
        console.log(results);

        for (const resultGroup of Object.values(results)) {
            for (const racer of Object.values(resultGroup.racers)) {
                var entity = racer.racer.getEntities()[0];
                var penaltySeconds = 0;
                if (Number(entity.penalty) > 0 || Number(entity.penalty) < 0) {
                    penaltySeconds = racer.racer.getEntities()[0].penalty / 1000000;
                }

                console.log(penaltySeconds);
                var realTimeSeconds = racer.skiTimeSeconds - penaltySeconds;
                var calculatedTimeSeconds = racer.timeSeconds - penaltySeconds;
                if (realTimeSeconds > 0) {
                    racer.racer.save({
                        realtime: toolkitFunctions.formatTimeSeconds(realTimeSeconds, false, 1),
                        calculatedtime1: toolkitFunctions.formatTimeSeconds(calculatedTimeSeconds, false, 1)
                    });
                } else {
                    racer.racer.save({
                        realtime: "",
                        calculatedtime1: ""
                    });
                }
            }
        }
    };

    toolkitFunctions.clearSprintLevel = function() {
        ui.current_view.race.getEntities().forEach(function(e) {
            var racer = e.getRacer();
            racer.save({level: ""});
        });
    };

    toolkitFunctions.setSprintUnsetLevel = function() {
        ui.current_view.race.getEntities().forEach(function(e) {
            var racer = e.getRacer();
            if (!racer.level) {
                racer.save({level: "Qualification"});
            }
        });
    };

    toolkitFunctions.reDrawSprintFinalResults = function() {
        toolkitFunctions.changeText("span.total-time", "Time", "Qualification");
        $("ul.racer-list").each(function(index) {
            var heatPlaceDepth = 12;
            if (this.parentElement.parentElement.querySelector("h2").innerText.includes("Vision")) {
                heatPlaceDepth = 8;
            }
            var heatRacers = [];
            var racers = this.children;
            for (var racerIndex = 0; racerIndex < Math.min(racers.length, heatPlaceDepth); racerIndex++) {
                var racer = ui.current_view.race.getRacerByBibOrChip(racers[racerIndex].querySelector("div.info").querySelector("span.bib").innerText);
                for (const placeDisplay of Object.values(racers[racerIndex].querySelector(".racer-line-1").querySelector("div.place-column").children)) {
                    placeDisplay.innerText = racer.finalplace;
                }
                heatRacers[racer.finalplace] = racers[racerIndex];
            }
            for (const heatRacer of Object.values(heatRacers)) {
                heatRacer.remove();
            }
            for (var heatRacerIndex = heatRacers.length - 1; heatRacerIndex > 0; heatRacerIndex--) {
                this.prepend(heatRacers[heatRacerIndex]);
            }
        });
    }

    toolkitFunctions.temp = function() {
        ui.current_view.race.getEntities().forEach(function(entity) {
            var racer = entity.getRacer();
            racer.save({misspenalty: 0});
            entity.save({penalty: 0});
        });
    }
})();
