// ==UserScript==
// @name        BvS Banked Hangouts
// @description Modifies the Top Friend Rankings page to show only the allies you need to hang out with for retail
// @namespace   Terrec
// @author      Terrec
// @match       *://*.animecubed.com/billy/bvs/shop-retail.html
// @match       *://*.animecubed.com/billy/bvs/team.html
// @match       *://*.animecubed.com/billy/bvs/friends.html
// @match       *://*.animecubed.com/billy/bvs/oneuseitems.html
// @match       *://*.animecubed.com/billy/bvs/missions/*
// @match       *://*.animecubed.com/billy/bvs/pages/main.html
// @match       *://*.animecubedgaming.com/billy/bvs/shop-retail.html
// @match       *://*.animecubedgaming.com/billy/bvs/team.html
// @match       *://*.animecubedgaming.com/billy/bvs/friends.html
// @match       *://*.animecubedgaming.com/billy/bvs/oneuseitems.html
// @match       *://*.animecubedgaming.com/billy/bvs/missions/*
// @match       *://*.animecubedgaming.com/billy/bvs/pages/main.html
// @version     2.3
// @history     2.3 One last bug. I think that's probably all of them.
// @history     2.2 Fixed another bug, and made the filters and refresh button automatically unfocus.
// @history     2.1 Fixed a bug, and added a button to update the rankings without refreshing the page.
// @history     2.0 Replaces the main table with a flex box for easier sorting, adds more filtering options, and adds ability to change alt on the Rankings page. Also replaced all uses of var with let.
// @history     1.14 Bugfix for the sorting algorithm
// @history     1.13 Uses localStorage if GM_ functions are missing
// @history     1.12 Made compatible with new site, made https compatible, and switched from @include to @match. Matches for old site left in for now.
// @history     1.11 The new Hammergirl ad broke the Hide/Show feature
// @history     1.10 Bugfix
// @history     1.9 Overnight friend point hangouts now reset the relevant allies' friend points
// @history     1.8 Bugfix, Bugman Lvl. 2 is considered to need ten million friend points to hang out with
// @history     1.7 Bugfix, Rankings page now sorts unbanked allies by how close they are to the minimum number of FP required to hang out with them
// @history     1.6 Parentheses hate me
// @history     1.5 Realized the messages have identifiers. Much better than timestamps
// @history     1.4 Now notices overnight friendship point hangouts and resets lists upon looping
// @history     1.3 Rankings page now defaults to only showing allies that need hangouts
// @history     1.2 Bugfix, compatibility fix for the Ally Types script, added friend point updater to missions, added the heng to the Rankings page, and changed the current friend points colors from red/black to blue/green
// @history     1.1 Added alt compatibility, added a mark next to the friend points of allies that need hangouts on the team page, and reworked the Rankings page changes
// @history     1.0 Initial release
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/5971/BvS%20Banked%20Hangouts.user.js
// @updateURL https://update.greasyfork.org/scripts/5971/BvS%20Banked%20Hangouts.meta.js
// ==/UserScript==

try {
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
        this.GM_getValue=function (key,def) {
            return localStorage['BvSBankedHangouts.'+key] || def;
        };
        this.GM_setValue=function (key,value) {
            return localStorage['BvSBankedHangouts.'+key];
        };
        this.GM_deleteValue=function (key) {
            return delete localStorage['BvSBankedHangouts.'+key];
        };
        this.GM_listValues=function(){
            return Object.keys(localStorage).filter(function(a){
                a.startsWith('BvSBankedHangouts.');
            });
        }
    }
} catch (e) {}

let alt = document.getElementsByName('player')[0];
if(alt){
    alt = alt.value;
    GM_setValue('lastAlt',alt);
}
else alt = GM_getValue('lastAlt');
let data = JSON.parse(GM_getValue(alt,'{}'));
if(!data.banked){
    data.banked = [];
}
if(!data.allies){
    data.allies=[];
}
if(!data.friendPoints){
    data.friendPoints=[];
}

//If you add another value with GM_setValue, also add it to this array.
let nonAltSaveData = ['lastAlt','defaultOption'];

function marker() {
    let marker = document.createElement('b');
    marker.style.color = 'red';
    marker.textContent = ' ꜧ';
    marker.classList.add('heng');
    return marker;
}

if (location.pathname == '/billy/bvs/pages/main.html' && document.body.innerHTML.indexOf('dailyfail.gif') > -1) {
    let dann = document.getElementById('dann');
    if(dann){
        if(data.lastMessage) {
            let b = dann.getElementsByTagName('b');
            for(let i of b) {
                let test = i.textContent.match(/Hanging Out/);
                let ally = i.parentNode.textContent.match(/hanging out with (.*) via Friend Points/);
                if(test) {
                    let message = parseInt(i.previousSibling.name.substr(1));
                    if(message > data.lastMessage){
                        data.banked.push(ally[1]);
                        if(data.allies.includes(ally[1])){
                            data.friendPoints[data.allies.indexOf(ally[1])]='0';
                        }
                    }
                }
            }
        }
        let input = dann.getElementsByTagName('input');
        data.lastMessage = parseInt(input[0].name.substr(1));
    }
    
    let season;
    let temp = document.querySelectorAll('td[bgcolor="1C1BC8"] i');
    for(let i of temp) {
        if(/Season \d+!/.exec(i.textContent)){
            season = i.textContent;
        }
    }
    if(season && data.season && data.season != season) {
        data.banked = [];
        data.allies = [];
        data.friendPoints = [];
        data.season = season;
    } else if(season && !data.season){
        data.season = season;
    }
    GM_setValue(alt, JSON.stringify(data));
}

if (location.pathname == '/billy/bvs/shop-retail.html') {
    let font = document.getElementsByTagName('font');
    if (document.body.textContent.indexOf('Bonus Shifts given: ')>-1){
        let img = document.querySelectorAll("img[src^='/billy/layout/nin/']");
        for(let i of img) {
            let temp = data.banked.indexOf(i.attributes.src.value.replace(/_/g,' ').replace('/billy/layout/nin/','').replace(/(?: Lvl\. \d)?\.gif/,''));
            if(temp>-1){
                data.banked.splice(temp,1);
            }
        }
        GM_setValue(alt, JSON.stringify(data));
    }
    else {
        for(let i of font) {
            if (i.textContent.indexOf('(Allies who owe you one: ') > -1) {
                data.banked = i.textContent.replace(/ Lvl\. \d/g, '').slice(25, - 1).split(', ');
                GM_setValue(alt, JSON.stringify(data));
                break;
            }
        }
    }
}

if (location.pathname == '/billy/bvs/oneuseitems.html' && document.body.textContent.indexOf('Sneaky Potato Used!') > -1) {
    let pitem = document.getElementById('pitem').getElementsByTagName('i');
    for(let i of pitem){
        let temp = i.textContent.match(/20 \/ 20: (.*) offers a shift for the potato!/);
        if(temp) {
            data.banked.push(temp[1].replace(/ Lvl\. \d/,''));
            GM_setValue(alt, JSON.stringify(data));
        }
    }
}

if (location.pathname == '/billy/bvs/team.html') {
    data.allies=[];
    data.friendPoints=[];
    if (document.body.innerHTML.indexOf("<b>Reorganize Allies</b>") > -1) {
        let allyList = document.getElementById('teamrep').firstElementChild.rows;
        for(let i of allyList) {
            let b = i.getElementsByTagName('b')[0];
            let newAlly = b.textContent.replace(/ Lvl\. ./g, '').replace(/\[.*\]/,"");
            data.allies.push(newAlly);
            let parent = b.parentNode;
            let fpNode;
            for(let j of parent.children){
                if(j.textContent.indexOf('Friend Points: ') > -1){
                    fpNode = j;
                }
            }
            let newAllyFP = fpNode.textContent.match(/\(Friend Points: (.*)\)/)[1]
            data.friendPoints.push(parseInt(newAllyFP.replace(/,/g,'')));
            if (!data.banked.includes(newAlly)) {
                //Mark the ally as needing a hangout
                parent.insertBefore(marker(),fpNode.nextSibling);
            }
        }
        if(document.getElementById('teamrep').textContent.indexOf('Bugman Lvl. 2') > -1){
            data.hologram = true;
        }
        else {
            data.hologram = false;
        }
        GM_setValue(alt, JSON.stringify(data));
    }
}

if (location.pathname.startsWith('/billy/bvs/missions/')) {
    if(document.body.textContent.indexOf('Jutsu XP:') > -1){
        let span = document.getElementsByTagName('span');
        for(let i of span){
            if(i.title.indexOf('Friend Points: ')>-1){
                let ally = i.title.match(/header=\[(.*)\] body/)[1].replace(/ Lvl\. \d/,'');
                let FP = i.title.match(/Friend Points\: (.*)\s\s\] offsetx/)[1];
                if(data.allies.includes(ally)){
                    data.friendPoints[data.allies.indexOf(ally)]=parseInt(FP.replace(/,/g,''));
                }
            }
        }
        GM_setValue(alt, JSON.stringify(data));
    }
}

if (location.pathname == '/billy/bvs/friends.html') {
    let table = document.evaluate(".//table[contains(./tbody/tr/td/font,'Top Friend Rankings')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let flex = document.createElement('div');
    flex.id = 'allyFlex';
    let flexTop = flex.appendChild(document.createElement('div'));
    flexTop.id = 'flexTop';
    flexTop.style.order = '-1';
    table.replaceWith(flex);
    flexTop.innerHTML = table.rows[0].firstChild.innerHTML;

    let friendList = table.getElementsByTagName('i');
    //A hopefully complete list of all allies
    let allAllies = ["A A Ron","Annie","Anonymous","Big Bo","Big Ro","Big Shammy","Billy","Blind Fury","Blondie","Bones","Bruce Jr.",
                     "Bruce Sr.","Bucketface","Bugman","Cato","Chunks","Cici","Cipher","Dora","Doughman","ElevenCats","Emosuke",
                     "Euthanasia","Fletch","Flipper","Flutie","Good Boy","Grandmaster P","Haro","Haus","Hermano","Hotsumoto","Hyuk",
                     "J-Diddy","Jaws","K-Dog","K.Y.","Kagamin","Karen","Kona-chan","Larry","Lil' Bo","Lil' Rack","Lil' Ro","Lil' Shammy",
                     "Lil' Whitey","LisaLisa","Lulu","MC Stripeypants","Mafuru","Master P","Meatballs","Mimi","Miss Kitty","Mister Six",
                     "Mister Tea","Mr. Sandman","Mr. Smith","Nadeshiko","Nana","Ol' Whitey","Olmek","Palmface","Pandabear","Pinky",
                     "Potatoes","Proof Reader","Rayne","Red Rover","Right","Robogirl","Rover's Mom","SNAKEMAN","Scary","Shorty","Sicko",
                     "Smiley","Smokey the Bear","Sporty","Spot","Stalkergirl","Sticky","Strawberry","Su-chan","Sue","TACOS","Tats",
                     "Tempest Kitsune","Terri","The HoClaus","The Paper","The Rack","The Scar","The Twins","Threads","TicTac","Timmy",
                     "Touchy","Trapchan","Triple H","Tsukasa","Tubby","Vanilla","Venus","Yuki-chan","Yuri","Z-Dog"];
    //Just in case you have some not in the list
    allAllies = allAllies.concat(data.allies.filter(function(a){!allAllies.includes(a)}));
    let remainingAllies = allAllies.slice(0);
    let allyTables = [];

    //Allies who didn't hang out with anyone don't appear. Need to fix that.
    function generateTable(allyName){
        let div = document.createElement('div');
        let allyFP = data.friendPoints[data.allies.indexOf(allyName)];
        let txt = '<table width="235" style="border-width:1px;border-style:solid;font-family:arial;';
        if(typeof allyFP == 'number'){
            txt += 'order:'+ (allyFP > 999 ? 10000000 + allyFP - 999 : 999 - allyFP) +';"';
            txt += ' class="obtained ';
            if(allyFP > 999){
                txt += 'enoughLove';
            } else {
                txt += 'needsMoreLove';
            }
            if(data.banked.includes(allyName)) {
                txt += ' banked';
            } else {
                txt += ' unbanked';
            }
        } else {
            txt += '" class="unobtained';
        }
        txt += '"><tbody><tr><td colspan="2" align="center"><img src="/billy/layout/nin/'+allyName.replace(/\s+/g,'_')+'.gif"><br><i><b>'+allyName+'</b></i>';
        txt += '<b style="color: red;" class="heng"> ꜧ</b><span class="allyFP"><br>';
        if(typeof allyFP == 'number'){
            txt += allyFP.toLocaleString();
        } else {
            txt += '<br>';
        }
        txt += '</span></td></tr></tbody></table>';
        div.innerHTML = txt;
        return div.firstElementChild;
    }
    function findTargetFP(i, newAlly){
        let td = i.parentNode.parentNode.nextElementSibling.getElementsByTagName('td')[1];
        let targetFP = td.innerHTML.replace(/,/g,'').match(/(\d+)/g);
        if(targetFP.length==10){
            return targetFP[targetFP.length-1];
        }
        return 999;
    }
    function foo(i, newAlly, targetFP){
        let span = document.createElement('span');
        span.className = 'allyFP';
        i.parentNode.appendChild(marker());
        i.parentNode.appendChild(span);
        let table = i.closest('table');
        if(data.allies.includes(newAlly)) {
            table.classList.add('obtained');
            let allyFP = data.friendPoints[data.allies.indexOf(newAlly)];
            let fpNeeded = ((newAlly=='Bugman' && data.hologram) ? 10000000 : targetFP) - allyFP;
            span.innerHTML="<br>"+allyFP.toLocaleString();
            if(fpNeeded < 0){
                table.classList.add('enoughLove');
                table.style.order = 10000000 - fpNeeded;
            } else {
                table.classList.add('needsMoreLove');
                table.style.order = fpNeeded;
            }
            if (data.banked.includes(newAlly)) {
                table.classList.add('banked');
            } else {
                table.classList.add('unbanked');
            }
            allyTables.push({table: table, targetFP: targetFP, ally: newAlly, spanFP: span});
        }
        else {
            span.innerHTML="<br><br>";
            table.classList.add('unobtained');
            allyTables.push({table: table, targetFP: targetFP, ally: newAlly, spanFP: span});
        }
    }

    for(let i of friendList) {
        let newAlly = i.textContent;
        let targetFP = findTargetFP(i,newAlly);
        foo(i, newAlly, targetFP);
        if(remainingAllies.includes(newAlly)){
            remainingAllies.splice(remainingAllies.indexOf(newAlly),1);
        }
    }
    for(let i of remainingAllies) {
            let targetFP =999;
            let table = generateTable(i);
            allyTables.push({table: table, targetFP: targetFP, ally:i, spanFP: table.querySelector('span.allyFP')});
    }
    allyTables.sort(function(a, b) {
        if(a.ally.toLowerCase() > b.ally.toLowerCase()){
            return 1;
        }
        if(a.ally.toLowerCase() < b.ally.toLowerCase()){
            return -1;
        }
        return 0;
    });

    for(let i of allyTables){
        flex.appendChild(i.table);
    }
    //Add one last table element in case an odd number of allies is visible
    let flexEnd = flex.appendChild(document.createElement('div'));
    flexEnd.style.width = '235px';
    flexEnd.style.margin = '0';
    flexEnd.style.order = '2147483647'; //Maximum value, to make sure it's always at the end

    let labelHolder = flexTop.appendChild(document.createElement('div'));
    labelHolder.className = 'labelHolder';
    labelHolder.setAttribute('onclick','event.target.blur();');
    let labelShowAll = labelHolder.appendChild(document.createElement('label'));
    labelShowAll.innerHTML = '<input type="radio" name="allyToggle" value="showAll">Show All Allies';
    let labelHideUnobtained = labelHolder.appendChild(document.createElement('label'));
    labelHideUnobtained.innerHTML = '<input type="radio" name="allyToggle" value="hideUnobtained">Hide Unobtained Allies';
    let labelHideBanked = labelHolder.appendChild(document.createElement('label'));
    labelHideBanked.innerHTML = '<input type="radio" name="allyToggle" value="hideBanked">Hide Banked and Unobtained Allies';
    let labelShowUnobtained = labelHolder.appendChild(document.createElement('label'));
    labelShowUnobtained.innerHTML = '<input type="radio" name="allyToggle" value="showUnobtained">Only Show Unobtained Allies';

    if(GM_listValues().length > (nonAltSaveData.length+1)){
        flexTop.appendChild(document.createTextNode('Change alt: '));
        let altSelect = flexTop.appendChild(document.createElement('select'));
        altSelect.name = 'altSelect';
        for(let i of GM_listValues()){
            if(!nonAltSaveData.includes(i)){
                altSelect.options.add(new Option(i,i,i==alt,i==alt));
            }
        }
        flexTop.appendChild(document.createTextNode(' '));
    }
    let refreshButton = flexTop.appendChild(document.createElement('button'));
    refreshButton.textContent = 'Refresh Rankings';
    refreshButton.name = 'altSelect';
    refreshButton.setAttribute('onclick',"this.dispatchEvent(new Event('input',{bubbles:true}));this.blur();");
    document.addEventListener('input',function(e){
        if(e.target.name == 'allyToggle'){
            document.getElementById('allyFlex').className = e.target.value;
            GM_setValue('defaultOption',e.target.value);
        } else if(e.target.name == 'altSelect'){
            alt = e.target.value || alt;
            data = JSON.parse(GM_getValue(alt,'{}'));
            GM_setValue('lastAlt',alt);
            if(!data.banked){
                data.banked = [];
            }
            if(!data.allies){
                data.allies=[];
            }
            if(!data.friendPoints){
                data.friendPoints=[];
            }
            for(let i of allyTables){
                if(data.allies.includes(i.ally)){
                    i.table.className = 'obtained';
                    if(data.banked.includes(i.ally)){
                       i.table.classList.add('banked');
                    } else {
                        i.table.classList.add('unbanked');
                    }
                    let allyFP = data.friendPoints[data.allies.indexOf(i.ally)];
                    let fpNeeded = ((i.ally=='Bugman' && data.hologram) ? 10000000 : i.targetFP) - allyFP;
                    i.spanFP.innerHTML = '<br>' + allyFP.toLocaleString();
                    if(fpNeeded < 0){
                        i.table.classList.add('enoughLove');
                        i.table.style.order = 10000000 - fpNeeded;
                    } else {
                        i.table.classList.add('needsMoreLove');
                        i.table.style.order = fpNeeded;
                    }
                } else {
                    i.table.className = 'unobtained';
                    i.spanFP.innerHTML = '<br><br>';
                }
            }
        }
    }, false);

    let defaultOption = GM_getValue('defaultOption','hideUnobtained');
    flex.className = defaultOption;
    labelHolder.querySelector('input[value="'+defaultOption+'"]').checked = true;

    let style = document.head.appendChild(document.createElement('style'));
    style.textContent = `
#allyFlex {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    width: 500px;
}
#allyFlex > * {
    margin: 2px 0;
}
.showAll > *,.showUnobtained > * {
    order: 0 !important;
}
.hideBanked > .banked, .hideBanked > .unobtained {
    display: none;
}
.hideUnobtained > .unobtained {
    display: none;
}
.onlyUnbanked > .unobtained {
    display: none;
}
.showUnobtained > .obtained {
    display: none;
}

.banked .heng, .unobtained .heng {
    display:none;
}
.needsMoreLove .allyFP {
    color: blue;
}
.enoughLove .allyFP {
    color: green;
}

.labelHolder {
    display: flex;
    flex-flow: row wrap;
    text-align: left;
    justify-content: space-evenly;
    margin: -2px 0;
}
.labelHolder label {
    display: block;
    margin: 2px 0;
    width: 235px;
}
`;
}
