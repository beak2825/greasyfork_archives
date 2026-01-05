// ==UserScript==
// @name        Contact List Auditor
// @namespace   fear.math@gmail.com
// @author		Math
// @description Checks contact list settings in hack logs in the RC/SP Infocenter.
// @include     https://www.wiremybike.com/rc/infocenter/hack_details.php?id=*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7104/Contact%20List%20Auditor.user.js
// @updateURL https://update.greasyfork.org/scripts/7104/Contact%20List%20Auditor.meta.js
// ==/UserScript==

//v1.0 Only checks foes against outlaw list at script launch. Current outlaws imported from Fed Outlaw Assistant.
//v1.1 Will now check squad access as well, and both features can be turned on or off. Current squad commanders list is for testing only.
//v1.2 Added ability to check "friend" (all but squad) list, and "foe" (all but TB) list. Both lists are currently for testing only.
//v2.0 Revamp for the RC/SP logger and 2020.

//---------------
// USER VARIABLES
//---------------

// Turn features on (true) or off (false):
const checkOutlaws = true;
const checkSquadAccess = true;
const checkFriendList = true;
const checkFoeList = true;

// Outlaw list. Can be copy and pasted from Fed Outlaw Assistant.
const outlaws = [
    'Corpse',
    'Eternal Fury',
    'Conquer Monkey',
    'Korzythozyraxlliiyt',
    'Neotrunks',
    'Rage',
    'Rei Teryoku',
    'Spaceace',
    'Westwood',
    'Wun Weg Wun Dar Wun',
    'Amerifax',
    'Amazing Joe',
    'Andriuz',
    'Anne Bonny',
    'Black Bill',
    'Braindead',
    'Candy',
    'Exaiphnes',
    'Joukyuu',
    'Lgnairre',
    'Palkkipantteri',
    'Poko Loko',
    'Rauko The Expendable',
    'Turtler',
    'Amon Amarth',
    'Rynak',
    'Doc Spalanzani',
    'Rax',
    'Skitus Bell',
    'Capt stanned',
    'Innocent Citizen'
];

// Squad commander list.
const squadCommanders = [
    'Bocaj',
    'Dagobert',
    'Deuteriumoxide',
    'Dybbuk',
    'Hurric',
    'Interessent',
    'Jimmeofdoom',
    'Lola',
    'Marcus Cicero',
    'Monstrosity',
    'Nuno',
    'Palin Ironthumb',
    'Slider',
    'Tacoman',
    'Tonka',
    'Wasted Soul',
    'Wayward Son',
    'Wes',
    'Wildfire'
];

// 'Friend' list: those who should be set to green for all but squads. Managers of key SBs should be manually checked for tighter settings.
const friendList = [
    'Radioactive Rabbit',
    'Tarrus Siul',
    'DABOO Corp',
    'E.R.A',
    'Extinction Agenda',
    'F.E.A.R.',
    'Union Liberation Front',
    'Federation Falcons',
    'Free Trade Syndicate',
    'Imperial Paladins',
    'Orions Guardians',
    'Quinto Imperio',
    'Rashkan Homeworld Alliance',
    'Red Cell',
    'S and M Initiative ',
    'Soverign Free Trade Guild',
    'Shadow Phoenix',
    'Terran Federation Academy',
    'The Fannucci Family',
    'The Order of Orion',
    'The Republic',
    'The Sindarin Trade Society',
    'The Traders Guild',
    'The Triad',
    'Unison',
    'Vitality',
    'Freeholders Alliance',
    'Solar Hawks',
    'The academy',
    'Azure Guard',
    'Commonwealth',
    'Exo Solar Alliance ESA'
];

// 'Foe' list: those who should be set to red for all but TBs.
const foeList = [
    'Empaya',
    'Angels of Liberty', 
    'Edge of Collapse', 
    'Grand Unifying Alliance', 
    'M.E.R.C', 
    'Onizuka', 
    'Viper Squadron', 
    'Reapers', 
    'Doom of every sissy'
];

//-------------------
// END USER VARIABLES
//-------------------

const green = 'ui_flag_green.png';
const red = 'ui_flag_red.png';

const contactColumns = ['name', 'type', 'trade', 'starbase', 'squad', 'mo', 'ambush', 'timebomb'];

// Get the contacts table
let contacts = [];
let tables = document.getElementsByTagName('table');

for (let i = 0; i < tables.length; i++) {
    let title = tables[i].rows[0].firstChild.innerHTML;

    if (title == 'Contacts') {
        contacts = tables[i].rows;
        break;
    }
}

if (checkOutlaws) {
    //Find all pilots who are currently set to red for ALL settings
    let foes = [];

    for (let i = 2; i < contacts.length; i++) {
        let trade = contacts[i].getElementsByTagName("td")[2].childNodes[0].src.indexOf(red) > -1;
        let sb = contacts[i].getElementsByTagName("td")[3].childNodes[0].src.indexOf(red) > -1;
        let squad = contacts[i].getElementsByTagName("td")[4].childNodes[0].src.indexOf(red) > -1;
        let mo = contacts[i].getElementsByTagName("td")[5].childNodes[0].src.indexOf(red) > -1;
        let ambush = contacts[i].getElementsByTagName("td")[6].childNodes[0].src.indexOf(red) > -1;
        let tb = contacts[i].getElementsByTagName("td")[7].childNodes[0].src.indexOf(red) > -1;
        
        if (trade && sb && squad && mo && ambush && tb) {
            let name = contacts[i].getElementsByTagName("td")[0].innerHTML;
            foes.push(name);
        }
    }

    //Find lists of extra outlaws and missing outlaws
    let extraOutlaws = setDifference(foes, outlaws);
    let missingOutlaws = setDifference(outlaws, foes);

    //Display (extra) and missing outlaws at the top of the hack
    //displayList("Extra Outlaws", extraOutlaws); //commented out because people often have many personal foes which is fine
    displayList("Missing Outlaws", missingOutlaws);
}

if (checkSquadAccess) {
    //Find all pilots who currently have squad access
    let squadAccess = [];

    for (let i = 2; i < contacts.length; i++) {
        let squad = contacts[i].getElementsByTagName("td")[4].childNodes[0].src.indexOf(green) > -1;

        if (squad) {
            let name = contacts[i].getElementsByTagName("td")[0].innerHTML;
            squadAccess.push(name);
        }
    }

    //Find the lists of extra squad commanders and missing squad commanders
    let extraSquadCommanders = setDifference(squadAccess, squadCommanders);
    let missingSquadCommanders = setDifference(squadCommanders, squadAccess);

    //Display extra/missing squad commanders at the top of the hack
    displayList("Extra Squad Commanders", extraSquadCommanders);
    displayList("Missing Squad Commanders", missingSquadCommanders);
}

if (checkFriendList) {
    //Find all pilots who are currently set to green for ALL settings but squad access
    let currentFriends = [];

    for (let i = 2; i < contacts.length; i++) {
        let trade = contacts[i].getElementsByTagName("td")[2].childNodes[0].src.indexOf(green) > -1;
        let sb = contacts[i].getElementsByTagName("td")[3].childNodes[0].src.indexOf(green) > -1;
        let mo = contacts[i].getElementsByTagName("td")[5].childNodes[0].src.indexOf(green) > -1;
        let ambush = contacts[i].getElementsByTagName("td")[6].childNodes[0].src.indexOf(green) > -1;
        let tb = contacts[i].getElementsByTagName("td")[7].childNodes[0].src.indexOf(green) > -1;
        
        if (trade && sb && mo && ambush && tb) {
            let name = contacts[i].getElementsByTagName("td")[0].innerHTML;
            currentFriends.push(name);
        }
    }

    //Find the lists of extra friends and missing friends
    let extraFriends = setDifference(currentFriends, friendList);
    let missingFriends = setDifference(friendList, currentFriends);

    //Display extra/missing squad commanders at the top of the hack
    displayList("Extra Friends",extraFriends);
    displayList("Missing Friends",missingFriends);
}

if (checkFoeList) {
    //Find all pilots who are currently set to red for ALL settings but TBs
    let currentFoes = [];

    for (let i = 2; i < contacts.length; i++) {
        let trade = contacts[i].getElementsByTagName("td")[2].childNodes[0].src.indexOf(red) > -1;
        let sb = contacts[i].getElementsByTagName("td")[3].childNodes[0].src.indexOf(red) > -1;
        let squad = contacts[i].getElementsByTagName("td")[4].childNodes[0].src.indexOf(red) > -1;
        let mo = contacts[i].getElementsByTagName("td")[5].childNodes[0].src.indexOf(red) > -1;
        let ambush = contacts[i].getElementsByTagName("td")[6].childNodes[0].src.indexOf(red) > -1;
        
        if (trade && sb && squad && mo && ambush) {
            let name = contacts[i].getElementsByTagName("td")[0].innerHTML;
            currentFoes.push(name);
        }
    }

    //Find the lists of extra friends and missing friends
    let extraFoes = setDifference(currentFoes, foeList);
    let missingFoes = setDifference(foeList, currentFoes);

    //Display extra/missing squad commanders at the top of the hack
    //displayList("Extra Foes",extraFoes); //commented out because people often have many personal foes which is fine
    displayList("Missing Foes", missingFoes);
}

// Compares two arrays, outputting all entries in the first array that are not in the second array. Equivalent to A-B (set difference).
function setDifference(A,B) {
    let diff = [];

    // check if each entry of A is in B
    for (let i = 0; i < A.length; i++) {
        if (B.indexOf(A[i]) === -1) {
            diff.push(A[i]);
        }
    }

    return diff;
}

// Displays the contents of an array within the hack above "Hack Log - Details"
function displayList(title, list) {
    //Translate the array into a nicely formatted list that can be read by normal people
    let result = title + ": ";

    if (list.length === 0) {
        result += "None";
    }
    else {
        result += list.join(', ');
    }

    //Put the list at the top of the hack log
    let top = document.getElementsByTagName("h2")[0];
    let para = document.createElement("p");

    para.innerHTML = result;
    top.parentNode.insertBefore(para,top);
}
