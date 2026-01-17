// ==UserScript==
// @name         Gym Ratio Tracker
// @version      3.1.1
// @description  Monitors battle stat ratios and provides warnings if they approach levels that would preclude access to special gyms
// @author       V1rul3nt_Sm0g [2861188]
// @include      *.torn.com/gym.php*
// @grant        none
// @license      GNU
// @namespace https://greasyfork.org/users/1560215
// @downloadURL https://update.greasyfork.org/scripts/562625/Gym%20Ratio%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/562625/Gym%20Ratio%20Tracker.meta.js
// ==/UserScript==

// Based off Custom Gym Ratios by RGiskard [1953860], assistance by Xiphias [187717] - Torn PDA adaptation v1 [Manuito] https://github.com/Manuito83/torn-pda/raw/master/userscripts/Custom%20Gym%20Ratios%20(Torn%20PDA).js
// Which was in turn based off Torn Gym Pony by Zanoab (http://puu.sh/jFtro/1af393771e.user.js).

function loadGym() {
    let statSafeDistance = localStorage.statSafeDistance || 1000000;

    let customRatios = JSON.parse(localStorage.getItem('customGymRatios')) || {
        strength: 25, defense: 25, speed: 25, dexterity: 25
    };

    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function refreshGymStatus() {
        const stats = getStats();
        let total = 0;
        for (const stat in stats) { total += stats[stat]; }

        const $statContainers = $('[class^="gymContent__"], [class*=" gymContent__"]').find("li");
        const totalRatio = customRatios.strength + customRatios.defense + customRatios.speed + customRatios.dexterity;

        // Specialty Gym Threshold Math
        const primarySum = stats.strength + stats.speed;
        const secondarySum = stats.defense + stats.dexterity;
        const sortedStats = Object.values(stats).sort((a, b) => b - a);
        const secondHighest = sortedStats[1];

        $statContainers.each(function (_, element) {
            const $element = $(element);
            let stat = $element.attr("zStat") || $element.find('[class^="title__"]').text().toLowerCase();

            if (stat === "str") stat = "strength";
            if (stat === "def") stat = "defense";
            if (stat === "spd") stat = "speed";
            if (stat === "dex") stat = "dexterity";

            const targetValue = total * (customRatios[stat] / (totalRatio || 1));
            const diff = stats[stat] - targetValue;
            const absDiff = Math.abs(diff);
            const warningThreshold = stats[stat] * 0.01; // 1% of the stat itself

            let gymStatus = "";
            const formattedDiff = FormatAbbreviatedNumber(absDiff, 1);
            const statName = stat.capitalizeFirstLetter();

            // 1. Ratio Targeting Logic (Always Visible)
            if (absDiff <= warningThreshold) {
                gymStatus = `<div class="gymstatus t-green bold">🎯 ${statName} is at target ratio! (±${formattedDiff})</div>`;
            } else if (diff < 0) {
                gymStatus = `<div class="gymstatus t-red bold">${statName} is ${formattedDiff} below target</div>`;
            } else {
                gymStatus = `<div class="gymstatus t-orange bold">${statName} is ${formattedDiff} over target</div>`;
            }

            // 2. Specialty Gym Access Logic (Only visible if within 1% of the threshold)
            let gymNotifiers = [];

            // Specialist Gyms (Gym 3000, Isoyamas, etc.)
            const specialistThreshold = secondHighest * 1.25;
            const distToSpecialist = stats[stat] - specialistThreshold;

            if (Math.abs(distToSpecialist) <= warningThreshold) {
                const gymName = stat === "strength" ? "Gym 3000" : stat === "defense" ? "Mr. Isoyamas" : stat === "speed" ? "Total Rebound" : "Elites";
                const color = distToSpecialist >= 0 ? "t-green" : "t-red";
                const statusText = distToSpecialist >= 0 ? `Access Active: ${gymName}` : `LOCKED: ${gymName}`;
                gymNotifiers.push(`<span class="${color}">${statusText}</span>`);
            }

            // Combo Gyms (Frontline / Balboas)
            if (stat === "strength" || stat === "speed") {
                const distToFrontline = primarySum - (secondarySum * 1.25);
                if (Math.abs(distToFrontline) <= (primarySum * 0.01)) {
                    const color = distToFrontline >= 0 ? "t-green" : "t-red";
                    const text = distToFrontline >= 0 ? "Frontline: OK" : "Frontline: LOCKED";
                    gymNotifiers.push(`<span class="${color}">${text}</span>`);
                }
            } else if (stat === "defense" || stat === "dexterity") {
                const distToBalboas = secondarySum - (primarySum * 1.25);
                if (Math.abs(distToBalboas) <= (secondarySum * 0.01)) {
                    const color = distToBalboas >= 0 ? "t-green" : "t-red";
                    const text = distToBalboas >= 0 ? "Balboas: OK" : "Balboas: LOCKED";
                    gymNotifiers.push(`<span class="${color}">${text}</span>`);
                }
            }

            // 3. Append Gym Info only if we are in the 1% range
            gymNotifiers.forEach(warn => {
                gymStatus += `<div class="gymstatus bold" style="font-size: 11px; margin-top: 2px; border-top: 1px solid #444; padding-top: 2px;">⚠️ ${warn}</div>`;
            });

            const $info = $element.find('[class^="description__"], [class*=" description__"]');
            $info.find(".gymstatus").remove();
            $info.append(gymStatus);
        });
    }

    function updateAndBalanceRatios(activeStat, newValue) {
        const stats = ['strength', 'defense', 'speed', 'dexterity'];
        const oldValue = customRatios[activeStat];
        const diff = newValue - oldValue;

        customRatios[activeStat] = newValue;

        const otherStats = stats.filter(s => s !== activeStat);
        const sumOthers = otherStats.reduce((sum, s) => sum + customRatios[s], 0);

        if (sumOthers > 0) {
            otherStats.forEach(s => {
                const share = customRatios[s] / sumOthers;
                customRatios[s] = Math.max(0, customRatios[s] - (diff * share));
            });
        } else {
            otherStats.forEach(s => {
                customRatios[s] = Math.max(0, (100 - newValue) / 3);
            });
        }

        const finalSum = stats.reduce((sum, s) => sum + customRatios[s], 0);
        const correction = (100 - finalSum) / 4;

        stats.forEach(s => {
            customRatios[s] = Math.max(0, customRatios[s] + correction);
            // Update both slider and input box to stay in sync
            $(`#slider-${s}`).val(customRatios[s]);
            $(`#input-${s}`).val(Math.round(customRatios[s]));
        });

        localStorage.setItem('customGymRatios', JSON.stringify(customRatios));
        refreshGymStatus();
    }

    function createSliderUI($container) {
        const stats = ['strength', 'defense', 'speed', 'dexterity'];
        const $sliderBox = $('<div id="custom-sliders" style="margin-top: 10px; border-top: 1px solid #333; padding-top: 10px;"></div>');

        stats.forEach(stat => {
            const $wrapper = $('<div style="margin: 8px 0;"></div>');

            // Label and Input Box on one line
            const $labelRow = $(`
            <div style="display:flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 4px;">
                <span style="color: #ccc;">${stat.capitalizeFirstLetter()}:</span>
                <div style="display: flex; align-items: center;">
                    <input type="number" id="input-${stat}" min="0" max="100" 
                        value="${Math.round(customRatios[stat])}" 
                        style="width: 40px; background: #111; color: #fff; border: 1px solid #444; text-align: center; border-radius: 3px; font-size: 11px; padding: 2px;">
                    <span style="margin-left: 3px; color: #888;">%</span>
                </div>
            </div>
        `);

            // Handle typing in the box
            $labelRow.find('input').on("change", function() {
                let val = parseInt($(this).val());
                if (isNaN(val)) val = 0;
                val = Math.max(0, Math.min(100, val));
                updateAndBalanceRatios(stat, val);
            });

            // The Slider underneath
            const $slider = $("<input>", {
                type: "range",
                id: `slider-${stat}`,
                min: 0,
                max: 100,
                step: 1,
                value: customRatios[stat],
                style: "width: 100%; cursor: pointer; height: 12px;"
            }).on("input", function() {
                updateAndBalanceRatios(stat, parseInt($(this).val()));
            });

            $wrapper.append($labelRow).append($slider);
            $sliderBox.append($wrapper);
        });

        // Reset Button
        const $resetBtn = $("<button>", {
            text: "Reset to 25% Equal",
            style: "width: 100%; margin-top: 10px; cursor: pointer; padding: 6px; background: #333; color: #fff; border: 1px solid #555; border-radius: 3px; font-size: 11px;"
        }).on("click", function() {
            stats.forEach(s => {
                customRatios[s] = 25;
                $(`#slider-${s}`).val(25);
                $(`#input-${s}`).val(25);
            });
            localStorage.setItem('customGymRatios', JSON.stringify(customRatios));
            refreshGymStatus();
        });

        $sliderBox.append($resetBtn);
        $container.append($sliderBox);
    }

        const cleanNumber = function (a) {
            return Number(a.replace(/[$,]/g, "").trim());
        };

        /**
         * Formats a number into an abbreviated string with an appropriate trailing descriptive unit
         * up to 't' for trillion.
         * @param {number} number the number to be formatted
         * @param {int} maxFractionDigits the maximum number of fractional digits to display
         * @returns a string representing the number, abbreviated if appropriate
         **/
        const FormatAbbreviatedNumber = function (number, maxFractionDigits) {
            const abbreviations = [];
            abbreviations[0] = "";
            abbreviations[1] = "k";
            abbreviations[2] = "M";
            abbreviations[3] = "B";
            abbreviations[4] = "T";

            let outputNumber = number;
            let abbreviationIndex = 0;
            for (; outputNumber >= 1000 && abbreviationIndex < abbreviations.length; ++abbreviationIndex) {
                outputNumber = outputNumber / 1000;
            }

            return (outputNumber.toLocaleString("EN", {maximumFractionDigits: maxFractionDigits,}) + abbreviations[abbreviationIndex]);
        };

        const getStats = function ($doc) {
            const ReplaceStatValueAndReturnCleanNumber = function (query) {
                const $statTotalElement = $doc.find(query);
                if ($statTotalElement.size() === 0) throw 'No element found with id "' + elementId + '".';
                return cleanNumber($statTotalElement.text());
            };
            $doc = $($doc || document);
            return {
                strength: ReplaceStatValueAndReturnCleanNumber("[class*=gymContent__] [class*=strength__] [class*=propertyValue__]"),
                defense: ReplaceStatValueAndReturnCleanNumber("[class*=gymContent__] [class*=defense__] [class*=propertyValue__]"),
                speed: ReplaceStatValueAndReturnCleanNumber("[class*=gymContent__] [class*=speed__] [class*=propertyValue__]"),
                dexterity: ReplaceStatValueAndReturnCleanNumber("[class*=gymContent__] [class*=dexterity__] [class*=propertyValue__]"),
            };
        };

        const noBuildKeyValue = {value: "none", text: "No specialty gyms"};
        const defenseDexterityGymKeyValue = {
            value: "balboas", text: "Defense and dexterity specialist",
            stat1: "defense", stat2: "dexterity", secondarystat1: "strength", secondarystat2: "speed",
        };
        const strengthSpeedGymKeyValue = {
            value: "frontline", text: "Strength and speed specialist",
            stat1: "strength", stat2: "speed", secondarystat1: "defense", secondarystat2: "dexterity",
        };
        const customDefenseBuildKeyValue = {
            value: "customdefense", text: "Custom Ratios",
            stat: "defense", secondarystat: "strength", combogym: strengthSpeedGymKeyValue,
        };
        const strengthComboGymKeyValue = {
            value: "frontlinegym3000", text: "Strength combo specialist (Baldr's Ratio)",
            stat: "strength", combogym: strengthSpeedGymKeyValue,
        };
        const defenseComboGymKeyValue = {
            value: "balboasisoyamas", text: "Defense combo specialist (Baldr's Ratio)",
            stat: "defense", combogym: defenseDexterityGymKeyValue,
        };
        const speedComboGymKeyValue = {
            value: "frontlinetotalrebound", text: "Speed combo specialist (Baldr's Ratio)",
            stat: "speed", combogym: strengthSpeedGymKeyValue,
        };
        const dexterityComboGymKeyValue = {
            value: "balboaselites", text: "Dexterity combo specialist (Baldr's Ratio)",
            stat: "dexterity", combogym: defenseDexterityGymKeyValue,
        };
        const strengthGymKeyValue = {
            value: "gym3000", text: "Strength specialist (Hank's Ratio)",
            stat: "strength", combogym: defenseDexterityGymKeyValue,
        };
        const defenseGymKeyValue = {
            value: "isoyamas", text: "Defense specialist (Hank's Ratio)",
            stat: "defense", combogym: strengthSpeedGymKeyValue,
        };
        const speedGymKeyValue = {
            value: "totalrebound", text: "Speed specialist (Hank's Ratio)",
            stat: "speed", combogym: defenseDexterityGymKeyValue,
        };
        const dexterityGymKeyValue = {
            value: "elites", text: "Dexterity specialist (Hank's Ratio)",
            stat: "dexterity", combogym: strengthSpeedGymKeyValue,
        };

        function GetStoredGymKeyValuePair() {
            if (localStorage.specialistGymType === defenseDexterityGymKeyValue.value) return defenseDexterityGymKeyValue;
            if (localStorage.specialistGymType === strengthSpeedGymKeyValue.value) return strengthSpeedGymKeyValue;
            if (localStorage.specialistGymType === customDefenseBuildKeyValue.value) return customDefenseBuildKeyValue;
            if (localStorage.specialistGymType === strengthComboGymKeyValue.value) return strengthComboGymKeyValue;
            if (localStorage.specialistGymType === defenseComboGymKeyValue.value) return defenseComboGymKeyValue;
            if (localStorage.specialistGymType === speedComboGymKeyValue.value) return speedComboGymKeyValue;
            if (localStorage.specialistGymType === dexterityComboGymKeyValue.value) return dexterityComboGymKeyValue;
            if (localStorage.specialistGymType === strengthGymKeyValue.value) return strengthGymKeyValue;
            if (localStorage.specialistGymType === defenseGymKeyValue.value) return defenseGymKeyValue;
            if (localStorage.specialistGymType === speedGymKeyValue.value) return speedGymKeyValue;
            if (localStorage.specialistGymType === dexterityGymKeyValue.value) return dexterityGymKeyValue;
            return noBuildKeyValue;
        }

        // Get rid of box before re-adding, which is an issue for iOS
        for (let box of document.querySelectorAll('.hank-box')) {
            box.remove();
        }

        const $hanksRatioDiv = $('<div></div>', {'class': 'hank-box'});
        const $titleDiv = $("<div>", {
            "class": "title-black top-round",
            "aria-level": "5",
            "text": "Gym Ratios",
        }).css("margin-top", "10px");
        $hanksRatioDiv.append($titleDiv);
        const $bottomDiv = $('<div class="bottom-round gym-box cont-gray p10"></div>');
        $bottomDiv.append($('<p class="sub-title">Select desired specialist build:</p>'));
        const $specialistGymBuild = $("<select>", {"class": "vinkuun-enemeyDifficulty",}).css("margin-top", "10px").on("change", function () {
            localStorage.specialistGymType = $specialistGymBuild.val();
        });

        $specialistGymBuild.append($("<option>", noBuildKeyValue));
        $specialistGymBuild.append($("<option>", customDefenseBuildKeyValue));
        $specialistGymBuild.append($("<option>", defenseDexterityGymKeyValue));
        $specialistGymBuild.append($("<option>", strengthSpeedGymKeyValue));
        $specialistGymBuild.append($("<option>", strengthComboGymKeyValue));
        $specialistGymBuild.append($("<option>", defenseComboGymKeyValue));
        $specialistGymBuild.append($("<option>", speedComboGymKeyValue));
        $specialistGymBuild.append($("<option>", dexterityComboGymKeyValue));
        $specialistGymBuild.append($("<option>", strengthGymKeyValue));
        $specialistGymBuild.append($("<option>", defenseGymKeyValue));
        $specialistGymBuild.append($("<option>", speedGymKeyValue));
        $specialistGymBuild.append($("<option>", dexterityGymKeyValue));
        // Set default to custom defense build if no preference is stored
        if (!localStorage.specialistGymType) {
            localStorage.specialistGymType = customDefenseBuildKeyValue.value;
        }
        localStorage.specialistGymType = GetStoredGymKeyValuePair().value; // In case there is bad data, replace it.
        $specialistGymBuild.val(GetStoredGymKeyValuePair().value);
        $bottomDiv.append($specialistGymBuild);
        createSliderUI($bottomDiv);
        $hanksRatioDiv.append($bottomDiv);
        $("#gymroot").append($hanksRatioDiv);

    let oldTotal = 0;
    let oldBuild = "";

    setInterval(function () {
        const stats = getStats();
        let total = 0;
        for (const stat in stats) { total += stats[stat]; }

        const currentBuild = $specialistGymBuild.val();

        // Toggle Slider Visibility
        if (currentBuild === "customdefense") { $('#custom-sliders').show(); }
        else { $('#custom-sliders').hide(); }

        if (oldTotal === total && oldBuild === currentBuild && $(".gymstatus").length !== 0) return;

        const $statContainers = $('[class^="gymContent__"], [class*=" gymContent__"]').find("li");

        // 1. CUSTOM LOGIC
        if (currentBuild === "customdefense") {
            refreshGymStatus();
            oldTotal = total;
            oldBuild = currentBuild;
            return;
        }

        // 2. LEGACY LOGIC (Only runs if not custom)
        const activeBuild = GetStoredGymKeyValuePair();
        let highestSecondaryStat = 0;
        for (const stat in stats) {
            if (activeBuild.stat && activeBuild.stat !== stat && stats[stat] > highestSecondaryStat) {
                highestSecondaryStat = stats[stat];
            }
        }

            const isComboGymOnlyRatio = (
                localStorage.specialistGymType === defenseDexterityGymKeyValue.value ||
                localStorage.specialistGymType === strengthSpeedGymKeyValue.value);
            const isComboGymCombinedRatio = (
                localStorage.specialistGymType === strengthComboGymKeyValue.value ||
                localStorage.specialistGymType === defenseComboGymKeyValue.value ||
                localStorage.specialistGymType === speedComboGymKeyValue.value ||
                localStorage.specialistGymType === dexterityComboGymKeyValue.value);
            const isSingleGymRatio = (
                localStorage.specialistGymType === strengthGymKeyValue.value ||
                localStorage.specialistGymType === defenseGymKeyValue.value ||
                localStorage.specialistGymType === speedGymKeyValue.value ||
                localStorage.specialistGymType === dexterityGymKeyValue.value);

            // The combined total of the primary stats must be 25% higher than the total of the secondary stats.
            let minPrimaryComboSum = 0;    // The minimum amount the combined primary stats must be to unlock the gym based on the secondary stat sum.
            let maxSecondaryComboSum = 0;  // The maximum amount the combined secondary stats must be to unlock the gym based on the primary stat sum.
            // The primary stat needs to be 25% higher than the second-highest stat.
            let minPrimaryStat = 0;
            let maxSecondaryStat = 0;
            let comboGymKeyValuePair = noBuildKeyValue;
            let primaryGymKeyValuePair = noBuildKeyValue;
            if (isComboGymOnlyRatio) {
                comboGymKeyValuePair = GetStoredGymKeyValuePair();
            } else if (isComboGymCombinedRatio || isSingleGymRatio) {
                primaryGymKeyValuePair = GetStoredGymKeyValuePair();
                comboGymKeyValuePair = primaryGymKeyValuePair.combogym;
                minPrimaryStat = highestSecondaryStat * 1.25;
                maxSecondaryStat = stats[primaryGymKeyValuePair.stat] / 1.25;
            } else {
                console.debug("Somehow attempted to calculate stat requirements for invalid gym: " + GetStoredGymKeyValuePair());
                return;
            }
            minPrimaryComboSum = (stats[comboGymKeyValuePair.secondarystat1] + stats[comboGymKeyValuePair.secondarystat2]) * 1.25;
            maxSecondaryComboSum = (stats[comboGymKeyValuePair.stat1] + stats[comboGymKeyValuePair.stat2]) / 1.25;

            const distanceFromComboGymMin = minPrimaryComboSum - stats[comboGymKeyValuePair.stat1] - stats[comboGymKeyValuePair.stat2];
            const distanceToComboGymMax = maxSecondaryComboSum - stats[comboGymKeyValuePair.secondarystat1] - stats[comboGymKeyValuePair.secondarystat2];

            $statContainers.each(function (_, element) {
                const $element = $(element);
                const title = $element.find('[class^="title__"], [class*=" title__"]');
                let stat = $element.attr("zStat");

                if (!stat) {
                    stat = title.text().toLowerCase();

                    // Change stat for mobile stat names (Torn PDA)
                    if (stat === "str") stat = "strength";
                    if (stat === "dex") stat = "dexterity";
                    if (stat === "spd") stat = "speed";
                    if (stat === "def") stat = "defense";

                    $element.attr("zStat", stat);
                }
                if (stats[stat]) {
                    let gymStatus;
                    let statIdentifierString;
                    if (isComboGymOnlyRatio) {
                        if (stat === comboGymKeyValuePair.stat1 || stat === comboGymKeyValuePair.stat2) {
                            statIdentifierString = GetStatAbbreviation(comboGymKeyValuePair.stat1).capitalizeFirstLetter() +
                                " + " + GetStatAbbreviation(comboGymKeyValuePair.stat2);
                            if (distanceFromComboGymMin > 0) {
                                gymStatus = '<span class="gymstatus t-red bold">' + statIdentifierString + " is " + FormatAbbreviatedNumber(distanceFromComboGymMin, 1) + " too low!</span>";
                            } else if (distanceFromComboGymMin < statSafeDistance) {
                                gymStatus = '<span class="gymstatus t-red bold">' + statIdentifierString + " is " + FormatAbbreviatedNumber(-distanceFromComboGymMin, 1) + " above the limit.</span>";
                            } else {
                                gymStatus = '<span class="gymstatus t-green">' + statIdentifierString + " is " + FormatAbbreviatedNumber(-distanceFromComboGymMin, 1) + " above the limit.</span>";
                            }
                        } else {
                            statIdentifierString = GetStatAbbreviation(comboGymKeyValuePair.secondarystat1).capitalizeFirstLetter() +
                                " + " + GetStatAbbreviation(comboGymKeyValuePair.secondarystat2);
                            if (distanceToComboGymMax < 0) {
                                gymStatus = '<span class="gymstatus t-red bold">' + statIdentifierString + " is " + FormatAbbreviatedNumber(-distanceToComboGymMax, 1) + " too high!</span>";
                            } else if (distanceToComboGymMax < statSafeDistance) {
                                gymStatus = '<span class="gymstatus t-red bold">' + statIdentifierString + " is " + FormatAbbreviatedNumber(distanceToComboGymMax, 1) + " below the limit.</span>";
                            } else {
                                gymStatus = '<span class="gymstatus t-green">' + statIdentifierString + " is " + FormatAbbreviatedNumber(distanceToComboGymMax, 1) + " below the limit.</span>";
                            }
                        }
                    } else {
                        const distanceFromSpecialistGymMin = minPrimaryStat - stats[stat];
                        const distanceToSpecialistGymMax = maxSecondaryStat - stats[stat];

                        let distanceToMax = 0;
                        statIdentifierString = stat.capitalizeFirstLetter();
                        if (stat === primaryGymKeyValuePair.stat) {
                            if (distanceFromSpecialistGymMin <= 0) {
                                if (isSingleGymRatio) {
                                    // Specialist stat for Hank's Gym Ratio is never one of the primary combo stats.
                                    // Only set the identifier if we don't already know this stat is too low to unlock its own specific gym.
                                    distanceToMax = distanceToComboGymMax;
                                    if (distanceToMax < 0) {
                                        statIdentifierString = GetStatAbbreviation(comboGymKeyValuePair.secondarystat1).capitalizeFirstLetter() +
                                            " + " + GetStatAbbreviation(comboGymKeyValuePair.secondarystat2);
                                    }
                                } else {
                                    // Specialist stat IS the combo stat; we only care to show how it's doing in relation to the specialist gym.
                                    distanceToMax = distanceFromSpecialistGymMin;
                                }
                            }
                        } else if (stat === comboGymKeyValuePair.stat1 || stat === comboGymKeyValuePair.stat2) {
                            // We don't have to worry about this stat going too high for the combo gym.
                            distanceToMax = distanceToSpecialistGymMax;
                        } else {
                            // This stat is neither the primary stat nor a combo gym stat, so it's limited by both.
                            distanceToMax = Math.min(distanceToSpecialistGymMax, distanceToComboGymMax);
                            if (distanceToComboGymMax < distanceToSpecialistGymMax && distanceToMax < 0) {
                                statIdentifierString = GetStatAbbreviation(comboGymKeyValuePair.secondarystat1).capitalizeFirstLetter() +
                                    " + " + GetStatAbbreviation(comboGymKeyValuePair.secondarystat2);
                            }
                        }

                        if (stat === primaryGymKeyValuePair.stat) {
                            console.debug(stat + " distanceFromSpecialistGymMin: " + distanceFromSpecialistGymMin);
                            console.debug(stat + " distanceToComboGymMax: " + distanceToComboGymMax);
                        } else if (stat === comboGymKeyValuePair.stat1 || stat === comboGymKeyValuePair.stat2) {
                            console.debug(stat + " distanceToSpecialistGymMax: " + distanceToSpecialistGymMax);
                            console.debug(stat + " distanceFromComboGymMin: " + distanceFromComboGymMin);
                        } else {
                            console.debug(stat + " distanceToSpecialistGymMax: " + distanceToSpecialistGymMax);
                            console.debug(stat + " distanceToComboGymMax: " + distanceToComboGymMax);
                        }
                        console.debug(stat + " distanceToMax: " + distanceToMax);

                        if (stat === primaryGymKeyValuePair.stat && distanceFromSpecialistGymMin > 0) {
                            gymStatus = '<span class="gymstatus t-red bold">' + statIdentifierString + " is " + FormatAbbreviatedNumber(distanceFromSpecialistGymMin, 1) + " too low!</span>";
                        } else if (distanceToMax < 0) {
                            if (stat === primaryGymKeyValuePair.stat && (isComboGymCombinedRatio)) {
                                gymStatus = '<span class="gymstatus t-green">' + statIdentifierString + " is " + FormatAbbreviatedNumber(-distanceToMax, 1) + " above the limit.</span>";
                            } else {
                                gymStatus = '<span class="gymstatus t-red bold">' + statIdentifierString + " is " + FormatAbbreviatedNumber(-distanceToMax, 1) + " too high!</span>";
                            }
                        } else if (distanceToMax < statSafeDistance) {
                            gymStatus = '<span class="gymstatus t-red bold">' + statIdentifierString + " is " + FormatAbbreviatedNumber(distanceToMax, 1) + " below the limit.</span>";
                        } else {
                            gymStatus = '<span class="gymstatus t-green">' + statIdentifierString + " is " + FormatAbbreviatedNumber(distanceToMax, 1) + " below the limit.</span>";
                        }
                    }

                    const $statInfoDiv = $element.find('[class^="description__"], [class*=" description__"]');
                    const $insertedElement = $statInfoDiv.find(".gymstatus");
                    $insertedElement.remove();
                    $statInfoDiv.append(gymStatus);
                }
            });
            oldTotal = total; oldBuild = currentBuild;
            console.debug("Stat spread updated!");
        }, 400);

    function GetStatAbbreviation(statString) {
        if (statString === "strength") {
            return "str";
        } else if (statString === "defense") {
            return "def";
        } else if (statString === "speed") {
            return "spd";
        } else if (statString === "dexterity") {
            return "dex";
        }
        return statString;
    }
}

let waitForElementsAndRun = setInterval(() => {
    if (document.querySelector("#gymroot")) {
        loadGym();
        return clearInterval(waitForElementsAndRun);
    }
}, 300);
