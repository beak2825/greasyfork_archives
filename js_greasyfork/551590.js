// ==UserScript==
// @name         Gametora Umamusume Skill Condition Explainer
// @namespace    http://tampermonkey.net/
// @version      2025-10-04--05
// @description  Turns the condition code in the skill overview into something more readable.
// @author       ividyon
// @match        https://gametora.com/umamusume/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gametora.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551590/Gametora%20Umamusume%20Skill%20Condition%20Explainer.user.js
// @updateURL https://update.greasyfork.org/scripts/551590/Gametora%20Umamusume%20Skill%20Condition%20Explainer.meta.js
// ==/UserScript==

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function charaIdFormat(val) {
    switch (val) {
            // NYI
    }
    return `Umamusume ID #${val}`;
}
function skillIdFormat(val) {
    switch (val) {
            // NYI
    }
    return `ID #${val}`;
}
function trackIdFormat(val) {
    switch (val) {
        case "10001":
            return "Sapporo";
        case "10002":
            return "Hakodate";
        case "10003":
            return "Niigata";
        case "10004":
            return "Fukushima";
        case "10005":
            return "Nakayama";
        case "10006":
            return "Tokyo";
        case "10007":
            return "Chukyo";
        case "10008":
            return "Kyoto";
        case "10009":
            return "Hanshin";
        case "10010":
            return "Kokura";
        case "10101":
            return "Oi";
        case "10103":
            return "Kawasaki";
        case "10104":
            return "Funabashi";
        case "10105":
            return "Morioka";
    }
    return `ID #${val}`;
}

function indexFormat(val) {
    switch (val) {
        case "1":
            return "1st";
        case "2":
            return "2nd";
        case "3":
            return "3rd";
        case "4":
            return "4th";
    }
}

function moodFormat(val) {
    switch (val) {
        case "1":
            return "Awful";
        case "2":
            return "Bad";
        case "3":
            return "Normal";
        case "4":
            return "Good";
        case "5":
            return "Great";
    }
}

function distanceTypeFormat(val) {
    switch (val) {
        case "1":
            return "Sprint";
        case "2":
            return "Mile";
        case "3":
            return "Medium";
        case "4":
            return "Long";
    }
}

function phaseFormat(val) {
    switch (val) {
        case "0":
            return "Early-Race";
        case "1":
            return "Mid-Race";
        case "2":
            return "Late-Race";
        case "3":
            return "Last Spurt";
    }
}
function rotationFormat(val) {
    switch (val) {
        case "1":
            return "right-handed";
        case "2":
            return "left-handed";
    }
}

function daytimeFormat(val) {
    switch (val) {
        case "0":
            return "any";
        case "1":
            return "Morning";
        case "2":
            return "Day";
        case "3":
            return "Evening";
        case "4":
            return "Night";
    }
}

function weatherFormat(val) {
    switch (val) {
        case "1":
            return "Sunny";
        case "2":
            return "Cloudy";
        case "3":
            return "Rainy";
        case "4":
            return "Snowy";
    }
}

function runningStyleFormat(val) {
    switch (val) {
        case "1":
            return "Front Runner";
        case "2":
            return "Pace Chaser";
        case "3":
            return "Late Surger";
        case "4":
            return "End Closer";
    }
}

function seasonFormat(val) {
    switch (val) {
        case "1":
            return "Spring (Early)";
        case "2":
            return "Summer";
        case "3":
            return "Fall";
        case "4":
            return "Winter";
        case "5":
            return "Spring (Late, Cherry Blossom)";
    }
}

function groundConditionFormat(val) {
    switch (val) {
        case "1":
            return "Firm";
        case "2":
            return "Good";
        case "3":
            return "Soft";
        case "4":
            return "Heavy";
    }
}

function trackTypeFormat(val) {
    switch (val) {
        case "1":
            return "Turf";
        case "2":
            return "Dirt";
    }
}

function gradeFormat(val) {
    switch (val) {
        case "100":
            return "G1";
        case "200":
            return "G2";
        case "300":
            return "G3";
        case "400":
            return "OP";
        case "700":
            return "Pre-OP";
        case "800":
            return "Maiden";
        case "900":
            return "Make Debut";
        case "999":
            return "Daily";
    }
}

function countFormat(op, val, prefix = "", preposition = "") {
    if (prefix != "") prefix = `${prefix} `;
    if (preposition != "") preposition = `${preposition} `;
    switch (op) {
        case "!=":
            if (preposition.startsWith("has") || preposition.startsWith("had")) return `${preposition.replace("has ","does not have ").replace("had ","does not have ")}${prefix}${val}`;
            return `not ${preposition}${prefix}${val}`;
        case "==":
            return `${preposition}${prefix}${val}`;
        case ">=":
            return `${preposition}at least ${prefix}${val}`;
        case "<=":
            return `${preposition}${prefix}${val} or less`;
        case ">":
            return `${preposition}${prefix}over ${val}`;
        case "<":
            return `${preposition}${prefix}under ${val}`;
    }
}
function countUpDownFormat(op, val, prefix = "", preposition = "") {
    if (prefix != "") prefix = `${prefix} `;
    if (preposition != "") preposition = `${preposition} `;
    switch (op) {
        case "!=":
            if (preposition.startsWith("has") || preposition.startsWith("had")) return `${preposition.replace("has ","does not have ").replace("had ","does not have ")}${prefix}${val}`;
            return `not ${preposition}${prefix}${val}`;
        case "==":
            return `${preposition}${prefix}${val}`;
        case ">=":
            return `${preposition}${prefix}${val} or higher`;
        case "<=":
            return `${preposition}${prefix}${val} or lower`;
        case ">":
            return `${preposition}higher than ${prefix}${val}`;
        case "<":
            return `${preposition}lower than ${prefix}${val}`;
    }
}
function countRatingFormat(op, val, prefix = "", preposition = "") {
    if (prefix != "") prefix = `${prefix} `;
    if (preposition != "") preposition = `${preposition} `;
    switch (op) {
        case "!=":
            if (preposition.startsWith("has") || preposition.startsWith("had")) return `${preposition.replace("has ","does not have ").replace("had ","does not have ")}${prefix}${val}`;
            return `not ${preposition}${prefix}${val}`;
        case "==":
            return `${preposition}${prefix}${val}`;
        case ">=":
            return `${preposition}at least ${prefix}${val}`;
        case "<=":
            return `${preposition}${prefix}${val} or worse`;
        case ">":
            return `${preposition}better than ${prefix}${val}`;
        case "<":
            return `${preposition}worse than ${prefix}${val}`;
    }
}
function countTimeFormat(op, val, prefix = "", preposition = "") {
    if (prefix != "") prefix = `${prefix} `;
    if (preposition != "") preposition = `${preposition} `;
    switch (op) {
        case "!=":
            if (preposition.startsWith("has") || preposition.startsWith("had")) return `${preposition.replace("has ","does not have ").replace("had ","does not have ")}${prefix}${val}`;
            return `not ${preposition}${prefix}${val}`;
        case "==":
            return `${preposition}${prefix}${val}`;
        case ">=":
            return `${preposition}${prefix}${val} or later`;
        case "<=":
            return `${preposition}${prefix}${val} or earlier`;
        case ">":
            return `${preposition}later than ${prefix}${val}`;
        case "<":
            return `${preposition}earlier than ${prefix}${val}`;
    }
}
function countRatingInvertedFormat(op, val, prefix = "", preposition = "") {
    if (prefix != "") prefix = `${prefix} `;
    if (preposition != "") preposition = `${preposition} `;
    switch (op) {
        case "!=":
            if (preposition.startsWith("has") || preposition.startsWith("had")) return `${preposition.replace("has ","does not have ").replace("had ","does not have ")}${prefix}${val}`;
            return `not ${preposition}${prefix}${val}`;
        case "==":
            return `${preposition}${prefix}${val}`;
        case ">=":
            return `${preposition}${prefix}${val} or worse`;
        case "<=":
            return `${preposition}at least ${prefix}${val}`;
        case ">":
            return `${preposition}worse than ${prefix}${val}`;
        case "<":
            return `${preposition}better than ${prefix}${val}`;
    }
}

function timeOnOpFormat(op) {
    switch (op) {
        case "!=":
            return `not on`;
        case "==":
            return `on`;
        case ">=":
            return `on or after`;
        case "<=":
            return `on or before`;
        case ">":
            return `after`;
        case "<":
            return `before`;
    }
}
function timeInOpFormat(op) {
    switch (op) {
        case "!=":
            return `not in`;
        case "==":
            return `in`;
        case ">=":
            return `in or after`;
        case "<=":
            return `in or before`;
        case ">":
            return `after`;
        case "<":
            return `before`;
    }
}

(async function() {
    'use strict';

    let stopped = false

    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type != "childList") continue;
            for (const addedElement of [...record.addedNodes].filter((node) => node instanceof Element)) {
                for (const conditionContainer of [...addedElement.querySelectorAll('.tooltips_tooltip_line__OStyx')]
                    .filter((elm) => elm.firstElementChild.textContent == "Conditions:")) {
                    const conditionElm = conditionContainer.children.item(1);
                    if (conditionElm == null) continue;
                    console.debug("ivi tooltip was added!!");
                    let splitByOr = conditionElm.textContent.replace('\n', '').split('@');
                    splitByOr = splitByOr.map((orPart) => {
                        const conditions = orPart.split('&').map((condition) => {
                            console.debug(condition);
                            const operatorMatch = condition.match(/(.*?)(!=|==|<=|>=|<|>)(.*)/);
                            console.debug(operatorMatch);
                            const cond = operatorMatch[1];
                            const op = operatorMatch[2];
                            const val = operatorMatch[3];

                            let fullRewrite = false;

                            let prettyCond = cond;
                            let prettyOp = op;
                            let prettyVal = val;
                            switch (op) {
                                case "!=":
                                    prettyOp = "is not";
                                    break;
                                case "==":
                                    prettyOp = "is";
                                    break;
                                case ">=":
                                    prettyOp = "is greater or equal than"
                                    break;
                                case "<=":
                                    prettyOp = "is less or equal than"
                                    break;
                                case ">":
                                    prettyOp = "is greater than"
                                    break;
                                case "<":
                                    prettyOp = "is less than"
                                    break;
                            }

                            if (cond == "accumulatetime") {
                                return `Race ongoing for ${countFormat(op, val)} sec.`;
                            }
                            else if (cond == "activate_count_all") {
                                return `Activated ${countFormat(op, val)} skills total`;
                            }
                            else if (cond == "activate_count_all_team") {
                                return `Team activated ${countFormat(op, val)} skills total`;
                            }
                            else if (cond == "activate_count_end_after") {
                                return `Activated ${countFormat(op, val)} skills in Late-Race or Last Spurt`;
                            }
                            else if (cond == "activate_count_heal") {
                                return `Activated ${countFormat(op, val)} recovery skills`;
                            }
                            else if (cond == "activate_count_later_half") {
                                return `Activated ${countFormat(op, val)} skills in 2nd half of race`;
                            }
                            else if (cond == "activate_count_middle") {
                                return `Activated ${countFormat(op, val)} skills in Mid-Race`;
                            }
                            else if (cond == "activate_count_start") {
                                return `Activated ${countFormat(op, val)} skills in Early-Race`;
                            }
                            else if (cond == "all_corner_random") {
                                return `At random in any corner`;
                            }
                            else if (cond == "always") {
                                return `Always`;
                            }
                            else if (cond == "base_guts") {
                                return `Has ${countFormat(op, val)} Guts`;
                            }
                            else if (cond == "base_power") {
                                return `Has ${countFormat(op, val)} Power`;
                            }
                            else if (cond == "base_speed") {
                                return `Has ${countFormat(op, val)} Speed`;
                            }
                            else if (cond == "base_stamina") {
                                return `Has ${countFormat(op, val)} Stamina`;
                            }
                            else if (cond == "base_wiz") {
                                return `Has ${countFormat(op, val)} Wits`;
                            }
                            else if (cond == "bashin_diff_behind") {
                                let noun = "lengths";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) noun = "length";
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} between you and runner behind`;
                            }
                            else if (cond == "bashin_diff_infront") {
                                let noun = "lengths";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) noun = "length";
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} between you and runner ahead`;
                            }
                            else if (cond == "behind_near_lane_time") {
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "has an runner right behind for"))} sec.`;
                            }
                            else if (cond == "behind_near_lane_time_set1") {
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "has an runner behind for"))} sec.`;
                            }
                            else if (cond == "blocked_all_continuetime") {
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "blocked on the front and side for"))} sec.`;
                            }
                            else if (cond == "blocked_front") {
                                return `Blocked on the front`;
                            }
                            else if (cond == "blocked_front_continuetime") {
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "blocked on the front for"))} sec.`;
                            }
                            else if (cond == "blocked_side_continuetime") {
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "blocked on the side for"))} sec.`;
                            }
                            else if (cond == "change_order_onetime") {
                                if ( op==">" ) return `Just got passed by another runner`;
                                return `Just passed another runner`;
                            }
                            else if (cond == "change_order_up_end_after") {
                                return `Overtook an runner since entering Late-Race ${countFormat(op, val)} times`;
                            }
                            else if (cond == "change_order_up_finalcorner_after") {
                                return `Overtook an runner since entering Final Corner ${countFormat(op, val)} times`;
                            }
                            else if (cond == "change_order_up_middle") {
                                return `Passed an runner during Mid-Race ${countFormat(op, val)} times`;
                            }
                            if (cond == "compete_fight_count") {
                                return `Had a showdown with an runner in the Final Straight ${countFormat(op, val)} times`;
                            }
                            else if (cond == "corner") {
                                if (op == "!=" && val == "0") return `Is in any corner`;
                                if (op == "==" && val == "0") return `Is not in a corner`;
                                switch (op) {
                                    case "!=":
                                        return `Is not in the ${indexFormat(val)} corner`;
                                    case "==":
                                        return `Is in the ${indexFormat(val)} corner`;
                                    case ">=":
                                        return `Is in a corner no earlier than the ${indexFormat(val)}`;
                                    case "<=":
                                        return `Is in a corner no later than the ${indexFormat(val)}`;
                                    case ">":
                                        return `Is in a corner after the ${indexFormat(val)}`;
                                    case "<":
                                        return `Is in a corner before ${indexFormat(val)}`;
                                }
                                return `Is ${timeOpFormat(op)} the ${indexedCornerToString(val)}`;
                            }
                            else if (cond == "corner_count") {
                                // NYI
                            }
                            else if (cond == "corner_random") {
                                return `At a random point in the ${indexFormat(val)} corner`;
                            }
                            else if (cond == "course_distance") {
                                return `Total race length is ${countFormat(op, val)}m`;
                            }
                            else if (cond == "distance_diff_rate") {
                                switch (op) {
                                    case "!=":
                                        return `Currently not at the exact ${val}% of the pack (by distance)`;
                                    case "==":
                                        return `Currently at the exact ${val}% of the pack (by distance)`;
                                    case ">=":
                                        return `Currently in the last ${100 - parseInt(val)}% of the pack (by distance)`;
                                    case "<=":
                                        return `Currently in the leading ${val}% of the pack (by distance)`;
                                    case ">":
                                        return `Currently in the last ${100 - parseInt(val)}% of the pack (by distance)`;
                                    case "<":
                                        return `Currently in the leading ${val}% of the pack (by distance)`;
                                }
                            }
                            else if (cond == "distance_diff_top") {
                                return `Is ${countFormat(op, val / 10)}m from the leading runner`;
                            }
                            else if (cond == "distance_diff_top_float") {
                                return `Is ${countFormat(op, val / 10)}m from the leading runner`;
                            }
                            else if (cond == "distance_rate") {
                                return `Race progress is ${countFormat(op, val, "at")}%`;
                            }
                            else if (cond == "distance_rate_after_random") {
                                return `At random time after ${val}% of race progression`;
                            }
                            else if (cond == "distance_type") {
                                return `${capitalizeFirstLetter(countFormat(op, distanceTypeFormat(val), "a", "in"))} race`;
                            }
                            else if (cond == "down_slope_random") {
                                return `At a random point on a downhill`;
                            }
                            else if (cond == "furlong") {
                                // NYI
                            }
                            else if (cond == "grade") {
                                return `${capitalizeFirstLetter(countFormat(op, gradeFormat(val), "a", "in"))} race`;
                            }
                            else if (cond == "ground_condition") {
                                return `Ground condition is ${countFormat(op, groundConditionFormat(val))}`;
                            }
                            else if (cond == "ground_type") {
                                return `${capitalizeFirstLetter(countFormat(op, trackTypeFormat(val), "a", "on"))} race track`;
                            }
                            else if (cond == "hp_per") {
                                prettyCond = "Remaining Endurance";
                                prettyVal = `${val}%`;
                            }
                            else if (cond == "infront_near_lane_time") {
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "has an runner in front for"))} sec.`;
                            }
                            else if (cond == "is_activate_any_skill") {
                                return `Just activated any other skill`;
                            }
                            else if (cond == "is_activate_heal_skill") {
                                // NYI
                            }
                            else if (cond == "is_badstart") {
                                if (val == 0) return `Did not have a late start`;
                                return `Had a late start`;
                            }
                            else if (cond == "is_basis_distance") {
                                if (val == 0) return `On a Non-Standard Distance race track (not multiple of 400m)`;
                                return `On a Standard Distance track (multiple of 400m)`;
                            }
                            else if (cond == "is_behind_in") {
                                if (val == 0) return `Closer to inside fence than runner behind`;
                                return `Further from inside fence than runner behind`;
                            }
                            else if (cond == "is_dirtgrade") {
                                if (val == 0) return `On a Central (not local) race track`;
                                return `On a local/regional race track`;
                            }
                            else if (cond == "is_exist_chara_id") {
                                return `${charaIdFormat(val)} is participating in the race (any outfit)`;
                            }
                            else if (cond == "is_exist_skill_id") {
                                // NYI
                            }
                            else if (cond == "is_finalcorner") {
                                if (val == 1) return `In the final corner or the straight after`;
                                return `Not yet reached the final corner`;
                            }
                            else if (cond == "is_finalcorner_laterhalf") {
                                if (val == 1) return `In the 2nd half of the final corner`;
                                return `Not yet reached the 2nd half of the final corner`;
                            }
                            else if (cond == "is_finalcorner_random") {
                                return `At a random point on the final corner`;
                            }
                            else if (cond == "is_hp_empty_onetime") {
                                if (val == 1) return `Has fully exhausted endurance at least once`;
                                return `Has not yet fully exhausted endurance`;
                            }
                            else if (cond == "is_last_straight") {
                                if (val == 1) return `On the last (or only) straight`;
                                return `Before the last straight`;
                            }
                            else if (cond == "is_last_straight_onetime") {
                                return `Just entered the last straight`;
                            }
                            else if (cond == "is_lastspurt") {
                                if (val == 1) return `In "last spurt" mode in the Late-Race`;
                                return `Not in "last spurt" mode`;
                            }
                            else if (cond == "is_move_lane") {
                                if (val == 1) return `Just moved lanes towards the inside`;
                                return `Just moved lanes towards the outside`;
                            }
                            else if (cond == "is_other_character_activate_advantage_skill") {
                                return `Another runner just activated a ${advantageSkillFormat(val)} skill`;
                            }
                            else if (cond == "is_overtake") {
                                if (val == 1) return `Has a target runner ahead to attempt to pass`;
                                return `Does not have a target runner ahead to attempt to pass`;
                            }
                            else if (cond == "is_surrounded") {
                                if (val == 1) return `Currently surrounded by other runners`;
                                return `Not currently surrounded by other runners`;
                            }
                            else if (cond == "is_temptation") {
                                if (val == 1) return `Currently in "Rushed" state`;
                                return `Not currently in "Rushed" state`;
                            }
                            else if (cond == "is_used_skill_id") {
                                return `Activated the skill ${skillIdFormat(val)} at least once during the race`;
                            }
                            else if (cond == "lane_type") {
                                let laneVal;
                                if (val <= 0.2) laneVal = "on an inside lane";
                                else if (val <= 0.4) laneVal = "on a middle lane";
                                else if (val <= 0.6) laneVal = "on an outer lane";
                                else laneVal = "on the outside";
                                switch (op) {
                                    case "!=":
                                        return `Is not ${laneVal}`;
                                    case "==":
                                        return `Is ${laneVal}`;
                                    case ">=":
                                        if (val > 0.6) return `Is on the outside`;
                                        return `Is ${laneVal} or further outside`;
                                    case "<=":
                                        return `Is ${laneVal} or further inside`;
                                    case ">":
                                        return `Is ${laneVal.replace("on ","beyond ")}`;
                                    case "<":
                                        return `Is ${laneVal.replace("on ","closer inside than ")}`;
                                }
                            }
                            else if (cond == "last_straight_random") {
                                return `At a random point on the final straight`;
                            }
                            else if (cond == "lastspurt") {
                                if (val == 1) return `Lacks the endurance to finish the race's last spurt at maximum speed`;
                                if (val == 2) return `Has the endurance to finish the race's last spurt at maximum speed`;
                                return `Lacks the endurance to finish the race's last spurt at base speed`;
                            }
                            else if (cond == "motivation") {
                                return `Mood is ${countRatingFormat(op, moodFormat(val))}`;
                            }
                            else if (cond == "near_count") {
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) noun = "runner";
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "has"))} ${noun} nearby`;
                            }
                            else if (cond == "near_infront_count") {
                                // NYI
                            }
                            else if (cond == "order") {
                                return `Currently ranked ${countRatingFormat(op, `#${val}`)} in the race`;
                            }
                            else if (cond == "order_rate") {
                                switch (op) {
                                    case "!=":
                                        return `Currently not at the exact ${val}% of the pack (by ranking)`;
                                    case "==":
                                        return `Currently at the exact ${val}% of the pack (by ranking)`;
                                    case ">=":
                                        return `Currently in the last ${100 - parseInt(val)}% of the pack (by ranking)`;
                                    case "<=":
                                        return `Currently in the leading ${val}% of the pack (by ranking)`;
                                    case ">":
                                        return `Currently in the last ${100 - parseInt(val)}% of the pack (by ranking)`;
                                    case "<":
                                        return `Currently in the leading ${val}% of the pack (by ranking)`;
                                }
                            }
                            else if (cond == "order_rate_in20_continue") {
                                if (val == 1) return `Has been in the top 20% of the ranking since the start`;
                                return `Dipped below the top 20% of the ranking at some point`;
                            }
                            else if (cond == "order_rate_in40_continue") {
                                if (val == 1) return `Has been in the top 40% of the ranking since the start`;
                                return `Dipped below the top 40% of the ranking at some point`;
                            }
                            else if (cond == "order_rate_in50_continue") {
                                if (val == 1) return `Has been in the top 50% of the ranking since the start`;
                                return `Dipped below the top 50% of the ranking at some point`;
                            }
                            else if (cond == "order_rate_in80_continue") {
                                if (val == 1) return `Has been in the top 80% of the ranking since the start`;
                                return `Dipped below the top 80% of the ranking at some point`;
                            }
                            else if (cond == "order_rate_out20_continue") {
                                if (val == 1) return `Stayed in the bottom 20% of the ranking since the start`;
                                return `Left the bottom 20% of the ranking at some point`;
                            }
                            else if (cond == "order_rate_out40_continue") {
                                if (val == 1) return `Stayed in the bottom 40% of the ranking since the start`;
                                return `Left the bottom 40% of the ranking at some point`;
                            }
                            else if (cond == "order_rate_out50_continue") {
                                if (val == 1) return `Stayed in the bottom 50% of the ranking since the start`;
                                return `Left the bottom 50% of the ranking at some point`;
                            }
                            else if (cond == "order_rate_out70_continue") {
                                if (val == 1) return `Never reached the top 30% of the ranking`;
                                return `Reached the top 30% of the ranking at some point`;
                            }
                            else if (cond == "overtake_target_no_order_up_time") {
                                return `Had a target runner ahead to attempt to pass for ${countFormat(op, val)} sec.`
                            }
                            else if (cond == "overtake_target_time") {
                                return `${capitalizeFirstLetter(countFormat(op, val, "", "has been an target for another runner to attempt to pass for"))} sec.`
                            }
                            else if (cond == "phase") {
                                return `${capitalizeFirstLetter(countTimeFormat(op, phaseFormat(val), "", "currently"))}`
                            }
                            else if (cond == "phase_corner_random") {
                                return `At a random point on a corner during the ${phaseFormat(val)}`;
                            }
                            else if (cond == "phase_first_half_straight_random") {
                                // NYI
                            }
                            else if (cond == "phase_firsthalf") {
                                // NYI
                            }
                            else if (cond == "phase_firsthalf_random") {
                                return `At a random point in the first half of the ${phaseFormat(val)}`;
                            }
                            else if (cond == "phase_firstquarter") {
                                // NYI
                            }
                            else if (cond == "phase_firstquarter_random") {
                                return `At a random point in the first quarter of the ${phaseFormat(val)}`;
                            }
                            else if (cond == "phase_laterhalf") {
                                // NYI
                            }
                            else if (cond == "phase_laterhalf_random") {
                                return `At a random point in the second half of the ${phaseFormat(val)}`;
                            }
                            else if (cond == "phase_latter_half_straight_random") {
                                // NYI
                            }
                            else if (cond == "phase_random") {
                                return `At a random point during the ${phaseFormat(val)}`;
                            }
                            else if (cond == "phase_straight_random") {
                                // NYI
                            }
                            else if (cond == "popularity") {
                                return `Popularity is ${countRatingInvertedFormat(op, `#${val}`)}`;
                            }
                            else if (cond == "post_number") {
                                return `Positioned in starting gate bracket (not individual gate) ${countUpDownFormat(op, val)}`;
                            }
                            else if (cond == "random_lot") {
                                return `${val}% chance to activate`
                            }
                            else if (cond == "remain_distance") {
                                return `Remaining distance is ${countFormat(op, val)}m`;
                            }
                            else if (cond == "remain_distance_viewer_id") {
                                return `Remaining distance for any non-NPC runner is ${countFormat(op, val)}m`;
                            }
                            else if (cond == "rotation") {
                                return `${capitalizeFirstLetter(countFormat(op, rotationFormat(val), "a", "on"))} race track`;
                            }
                            else if (cond == "running_style") {
                                return `Using ${countFormat(op, runningStyleFormat(val))} strategy`;
                            }
                            else if (cond == "running_style_count_nige_otherself") {
                                let verb = "are";
                                let noun = "Front Runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Front Runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val, "", `there ${verb}`))} ${noun} in the race (except you)`;
                            }
                            else if (cond == "running_style_count_oikomi_otherself") {
                                let verb = "are";
                                let noun = "End Closers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "End Closer"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val, "", `there ${verb}`))} ${noun} in the race (except you)`;
                            }
                            else if (cond == "running_style_count_sashi_otherself") {
                                let verb = "are";
                                let noun = "Late Surgers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Late Surger"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val, "", `there ${verb}`))} ${noun} in the race (except you)`;
                            }
                            else if (cond == "running_style_count_senko_otherself") {
                                let verb = "are";
                                let noun = "Pace Chasers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Pace Chaser"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val, "", `there ${verb}`))} ${noun} in the race (except you)`;
                            }
                            else if (cond == "running_style_count_same") {
                                let verb = "are";
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "runner"
                                }
                                return `There ${verb} ${countFormat(op, parseInt(val) - 1)} other ${noun} in the race sharing your running style`;
                            }
                            else if (cond == "running_style_count_same_rate") {
                                return `${capitalizeFirstLetter(countFormat(op, parseInt(val) - 1))}% of runners in the race share your running style`;
                            }
                            else if (cond == "running_style_equal_popularity_one") {
                                if (val == 1) return `The #1 most popular runner shares your running style`;
                                return `The #1 most popular runner does not share your running style`;
                            }
                            else if (cond == "running_style_temptation_count_nige") {
                                let verb = "are";
                                let noun = "Front Runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Front Runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} ${verb} currently Rushed (including you)`;
                            }
                            else if (cond == "running_style_temptation_count_oikomi") {
                                let verb = "are";
                                let noun = "End Closers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "End Closer"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} ${verb} currently Rushed (including you)`;
                            }
                            else if (cond == "running_style_temptation_count_sashi") {
                                let verb = "are";
                                let noun = "Late Surgers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Late Surger"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} ${verb} currently Rushed (including you)`;
                            }
                            else if (cond == "running_style_temptation_count_senko") {
                                let verb = "are";
                                let noun = "Pace Chasers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Pace Chaser"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} ${verb} currently Rushed (including you)`;
                            }
                            else if (cond == "running_style_temptation_opponent_count_nige") {
                                let verb = "are";
                                let noun = "Front Runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Front Runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} opponent ${noun} ${verb} currently Rushed`;
                            }
                            else if (cond == "running_style_temptation_opponent_count_oikomi") {
                                let verb = "are";
                                let noun = "End Closers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "End Closer"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} opponent ${noun} ${verb} currently Rushed`;
                            }
                            else if (cond == "running_style_temptation_opponent_count_sashi") {
                                let verb = "are";
                                let noun = "Late Surgers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Late Surger"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} opponent ${noun} ${verb} currently Rushed`;
                            }
                            else if (cond == "running_style_temptation_opponent_count_senko") {
                                let verb = "are";
                                let noun = "Pace Chasers";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "Pace Chaser"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} enemy ${noun} ${verb} currently Rushed)`;
                            }
                            else if (cond == "same_skill_horse_count") {
                                let verb = "own";
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "owns";
                                    noun = "runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} in the race ${verb} the same skill (including you)`;
                            }
                            else if (cond == "season") {
                                return `The season is ${countTimeFormat(op, seasonFormat(val))}`;
                            }
                            else if (cond == "slope") {
                                if (val == 1) return `Currently running uphill`;
                                if (val == 2) return `Currently running downhill`;
                                return `Currently not on a slope`;
                            }
                            else if (cond == "straight_front_type") {
                                if (val == 1) return `Currently on the homestretch`;
                                if (val == 2) return `Currently on the backstretch`;
                            }
                            else if (cond == "straight_random") {
                                return `At a random point on any straight`;
                            }
                            else if (cond == "temptation_count") {
                                return `Became Rushed during the race ${countFormat(op, val)} times`;
                            }
                            else if (cond == "temptation_count_behind") {
                                let verb = "are";
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} behind ${verb} currently Rushed`;
                            }
                            else if (cond == "temptation_count_infront") {
                                let verb = "are";
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} ahead ${verb} currently Rushed`;
                            }
                            else if (cond == "temptation_opponent_count_behind") {
                                let verb = "are";
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} opponent ${noun} behind ${verb} currently Rushed`;
                            }
                            else if (cond == "temptation_opponent_count_infront") {
                                let verb = "are";
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} opponent ${noun} behind ${verb} currently Rushed`;
                            }
                            else if (cond == "time") {
                                return `The time of day is ${countTimeFormat(op, daytimeFormat(val))}`;
                            }
                            else if (cond == "track_id") {
                                return `${capitalizeFirstLetter(countFormat(op, trackIdFormat(val), "a", "on"))} race track`;
                            }
                            else if (cond == "up_slope_random") {
                                return `At a random point on an uphill`;
                            }
                            else if (cond == "up_slope_random_later_half") {
                                // NYI
                            }
                            else if (cond == "visiblehorse") {
                                let verb = "are";
                                let noun = "runners";
                                if (val == "1" && (op == "==" || op == "!=" || op == ">=")) {
                                    verb = "is";
                                    noun = "runner"
                                }
                                return `${capitalizeFirstLetter(countFormat(op, val))} ${noun} ${verb} currently in line of sight`;
                            }
                            else if (cond == "weather") {
                                return `The weather is ${countTimeFormat(op, weatherFormat(val))}`;
                            }

                            return `${prettyCond} ${prettyOp} ${prettyVal}`;
                        });
                        return `<ul style="line-height: 1.5;margin: 0.5em 0;padding-left: 1.5em;white-space:normal;">${conditions.map((c) => `<li>${c}</li>`).join('\n')}</ul>`;
                    });
                    conditionElm.innerHTML = splitByOr.join("<div>- OR -</div>");
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
        });
})();