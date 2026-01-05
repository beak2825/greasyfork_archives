// ==UserScript==
// @name                WME Validator Virginia Localization
// @version             0.1.4
// @description         This script localizes WME Validator for United States. You also need main package (WME Validator) installed.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @namespace https://greasyfork.org/users/6285
// @downloadURL https://update.greasyfork.org/scripts/6859/WME%20Validator%20Virginia%20Localization.user.js
// @updateURL https://update.greasyfork.org/scripts/6859/WME%20Validator%20Virginia%20Localization.meta.js
// ==/UserScript==
//

/*
 * 0.1.0 - New State Standards for SR < (600 && 785 && 985) and VA > 600 &!(785|895)
 */


/*
  See Settings->About->Available checks for complete list of checks and their params.

  Examples:

  Enable #170 "Lowercase street name" but allow lowercase "exit" and "to":
    "170.enabled": true,
    "170.params": {
        "regexp": "/^((exit|to) )?[a-z]/",
    "},

  Enable #130 "Custom check" to find a dot in street names, but allow dots at Ramps:
    "130.enabled": true,
    "130.params": {
        "titleEN": "Street name with a dot",
        "problemEN": "There is a dot in the street name (excluding Ramps)",
        "solutionEN": "Expand the abbreviation or remove the dot",
        "template": "${type}:${street}",
        "regexp": "D/^[^4][0-9]?:.*\\./",
    },
    *Note: use D at the beginning of RegExp to enable debugging on JS console.
    *Note: do not forget to escape backslashes in strings, i.e. use "\\" instead of "\".
*/

window.WME_Validator_United_States = {
  ".country": "United States",
  ".codeISO": "US",
  ".author": "SuperMedic",
  ".updated": "2014-12-02",
  ".link": "https://greasyfork.org/en/scripts/6859-wme-validator-virginia-localization",
// Ramp name too long
  "112.enabled": false,
  "112.params": {
  "n": 55,
  },
// Custom Check
  "130.enabled": true,
  "130.params": {
    "titleEN": "Potential Incorrect Abbreviation",
    "problemEN": "Name abbreviation may be incorrect. Alternative routes should be labeled ALT and abbreviations ALT, BUS, BYP, CONN, LOOP, SCN, SPUR, or TRUCK should be in ALL CAPS",
    "solutionEN": "Change abbreviation to ALT, BUS, BYP, CONN, LOOP, SCN, SPUR, or TRUCK in ALL CAPS",
    "template": "${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": "/!?[0-9].+(Alt|Business|Bus|Byp|Conn|Loop|Scn|Spur|Truck)\\b/"
  },
// Custom Check
  "131.enabled": true,
  "131.params": {
    "titleEN": "Wrong name on US Highway",
    "problemEN": "All US highways should be named US-###",
    "solutionEN": "Change name to US-###",
    "template": "${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": ".*\\b(?:US Highway |US Hwy Route |US Hwy Rte |US Hwy |US Rte |US- |US )[0-9]{1,3}\\b/i"
  },
  "131.solutionLink": "W:Virginia#Roads",
// Custom Check
  "132.enabled": true,
  "132.params": {
    "titleEN": "Wrong road type (Major)",
    "problemEN": "All US Highways should be at least Major Highway (except BUS, SPUR, LOOP)",
    "solutionEN": "Change the road type to Major Highway",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![245]).*#(?:US Hwy |US-)[0-9]+(?: ALT| BYP| CONN| TRUCK| SCN| Scenic| [NSWE])*@/i"
  },
  "132.solutionLink": "W:Road_types/USA#Major_Highway",
// Custom Check
  "133.enabled": true,
  "133.params": {
    "titleEN": "Wrong road type (Minor)",
    "problemEN": "All US BUS, SPUR, LOOP Highways and all State Highways (except BUS, SPUR, LOOP) should be at least Minor Highway type",
    "solutionEN": "Change the road type to Minor Highway",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![2-5]).*#(?:(?:State Hwy |SH-|K-|LA-|M-|MA-|MS-|NC-|SC-)[0-9]+(?:| ALT| BYP| CONN| TRUCK| SCN| Scenic| [NSWE])*|(?:US Hwy |US-)[0-9]+(?: BUS| LOOP| SPUR)+(?: [NSWE])?)@/i"
  },
  "133.solutionLink": "W:Road_types/USA#Minor_Highway",
// Custom Check
  "134.enabled": true,
  "134.params": {
    "titleEN": "Wrong road type (Primary)",
    "problemEN": "All State BUS, SPUR, LOOP Highways should be at least Primary Street type",
    "solutionEN": "Change the road type to Primary Street",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![1-5]).*#(?:State Hwy |SH-|K-|LA-|M-|MA-|MS-|NC-|SC-)[0-9]+(?: BUS| LOOP| SPUR)+(?: [NSWE])?@/i"
  },
  "134.solutionLink": "W:Road_types/USA#Primary_Street",
// Custom Check - State Name = Virginia
  "135.enabled": true,
  "135.params": {
    "titleEN": "Not VA State",
    "problemEN": "Incorrect State Name - State name should be Virginia (are you in Virginia?)",
    "solutionEN": "Verify correct state name on segment.",
    "template": "${state}",
    "regexp": "!/^Virginia$/"
  },
  "135.solutionLink": "W:Virginia",
  // Custom Check
  "136.enabled": true,
  "136.params": {
    "titleEN": "Wrong name on Virginia Primary Route",
    "problemEN": "All primary routes numberd < 600 and 785 and 895 named SR-### in Virginia",
    "solutionEN": "Change name to SR-###",
    "template": "${state}:##${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": "/^Virginia:.*(?:State Hwy |State Rd |State Rte |VA |VA- |VA Hwy |VA-Hwy |V A |SH-)(?:[1-5]{0,1}[1-9]{0,2})#/i"
  },
  "136.solutionLink": "W:Virginia#Roads",
// Custom Check
  "137.enabled": true,
  "137.params": {
    "titleEN": "Wrong name on Virginia Secondary Route",
    "problemEN": "All primary routes numberd > 600 NOT 785 and 895 named VA-### in Virginia",
    "solutionEN": "Change name to VA-###",
    "template": "${state}:##${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": "/^Virginia:.*(?:State Hwy |State Rd |State Rte |SR |SR- |VA Hwy |VA-Hwy |V A |SH-)(?:(?:[6-9][1-9]{2,})|(?:[1-9]{4,}))#/i"
  },
  "137.solutionLink": "W:Road_types/USA#Service_Road",
// Custom Check
  "138.enabled": true,
  "138.params": {
    "titleEN": "Service Road",
    "problemEN": "Incorrect Function Class - Do not use Service Road Function Class",
    "solutionEN": "Change Function Class to Street",
    "template": "${typeRank}",
    "regexp": "/^9$/"
  },
  "138.solutionLink": "W:Road_types/USA#Service_Road",
// Custom Check
  "139.enabled": true,
  "139.params": {
    "titleEN": "Bad Street Name",
    "problemEN": "Street Name has been identified as mass entered name that is incorrect. (dfa, nul, or null)",
    "solutionEN": "Correct the street name to remove dfa, nul, or null",
    "template": "${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": ".*\\b(dfa|nul|null)\\b/i"
  },
  "139.solutionLink": "W:Road_types/USA#Primary_Street",
  //No lock on freeway
  "150.enabled": true,
  "150.params": {
// {number} minimum lock level
  "n": 5,
  },
//No lock on major highway
  "151.enabled": true,
  "151.params": {
  // {number} minimum lock level
  "n": 3,
  },
//No lock on minor highway
  "152.enabled": true,
  "152.params": {
  // {number} minimum lock level
  "n": 2,
  },
//No lock on ramp
  "153.enabled": true,
  "153.params": {
    // {number} minimum lock level
    "n": 4,
  },
//No lock on primary street
  "154.enabled": false,
  "154.params": {
  // {number} minimum lock level
  "n": 1,
  },
//No State name selected
  "106.enabled": true,
};
