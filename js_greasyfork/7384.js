// ==UserScript==
// @name           Memrise: Make Me Type
// @description    This script converts Memrise multiple-choice questions to typing
//                 questions, where possible.
// @match          http://www.memrise.com/course/*/garden/*
// @match          http://www.memrise.com/garden/water/*
// @grant          none
// @run-at         document-start
// @version 0.0.1.20150117093009
// @namespace https://greasyfork.org/users/8248
// @downloadURL https://update.greasyfork.org/scripts/7384/Memrise%3A%20Make%20Me%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/7384/Memrise%3A%20Make%20Me%20Type.meta.js
// ==/UserScript==

function convertMultipleChoiceToTyping(e) {
    // Always jump to session level 6.
    sessionTypes = ['WaterSession', 'WaterLevelSession', 'WaterCourseSession',
        'WaterCategorySession', 'Session', 'ReviewThingsSession',
        'ReviewSession', 'ReviewLevelSession', 'ReviewCourseSession',
        'LevelTestSession', 'LevelSession', 'GrowSession', 'CourseSession',
        'CategorySession'];
    for (st in sessionTypes) {
        p = MEMRISE.garden.sessions[sessionTypes[st]];
        console.log(sessionTypes[st]);
        var x = 10;
        var highestLevel = null;
        while (true) {
            if (x == 0) { break; }
            level = p['make_at_level_'+x];
            if (highestLevel == null && typeof level != 'undefined') {
                highestLevel = level;
            }
            level = highestLevel;
            x--;
        }
        console.log(p);
    }
}

document.addEventListener("afterscriptexecute", convertMultipleChoiceToTyping, true);
