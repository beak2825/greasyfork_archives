// ==UserScript==
// @name         Cookie Clicker Hack (Reworked)
// @namespace    https://greasyfork.org/ru/scripts/392425-cookie-clicker-hack
// @version      1.6
// @license      MIT
// @description  Just a cookie clicker hack, now googol-safe!
// @author       ItsSAE
// @match        *://orteil.dashnet.org/cookieclicker/*
// @match        *://orteil.dashnet.org/cookieclicker/
// @grant        none
// ==/UserScript==

console.log('[== Starting hack... ==]');

var ans = '';
var confirmans = false;
var forCookies = { iter: 0, ctr: 0 };

const hinfo = { version: '1.6', changes: 'Googol-safe hack added' };

var ac = {
    sure: false,
    click: function() { document.getElementById('bigCookie').click(); },
    timer: null,
    termtimer: function() { if (ac.timer === null) { alert('false ac.termtimer() call'); console.log(ac); } else { clearTimeout(ac.timer); } },
    warning: false
};

var mwheel = { active: false, active2: false };
var getFree = { itemName: '', wrongItem: false };
var buffs = { duration: 0, pow: 0 };

var CookiePatcher = {
    patchedGrimoireBackfire: function(spell){ return 0; },
    originalGrimoireBackfire: function(spell){
        var failChance=0.15;
        if(Game.hasBuff('Magic adept')) failChance*=0.1;
        if(Game.hasBuff('Magic inept')) failChance*=5;
        if(spell.failFunc) failChance=spell.failFunc(failChance);
        return failChance;
    }
};

document.onkeydown = function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    if(key===72){ hackMenu(); }
    else if(key===67){ ac.termtimer(); }
};

var hmenuText = 'Welcome to Cookie Clicker Hack v.' + hinfo.version + '!\nChoose a function:\n1) Earn free cookies\n2) Spawn golden cookies\n3) Autoclicker\n4) Mouse Wheel mode\n5) Buy for Free\n6) Earn Sugar lumps\n7) Gain buffs\n8) Grimoire hacks';

function hackMenu() {
    ans = prompt(hmenuText);
    ////////////////////////////////////////////////////
    // 1) Earn free cookies
    if(ans=='1'){
        ans = prompt('How many cookies do you want to earn? (Type "infinite" for a googol!)');
        if(ans === "" || ans === null){ alert('Cancelled.'); }
        else {
            let cookiesToAdd;
            if(ans.toLowerCase() === 'infinite'){ cookiesToAdd = 1e100; } // googol
            else {
                cookiesToAdd = Number(ans);
                if(isNaN(cookiesToAdd)){
                    alert('Not a number. Giving you a googol instead!');
                    cookiesToAdd = 1e100;
                }
            }
            Game.cookies += cookiesToAdd;
            Game.cookiesEarned += cookiesToAdd;
            alert(`Added ${cookiesToAdd} cookies!`);
        }
    ////////////////////////////////////////////////////
    // 2) Spawn golden cookies
    } else if(ans=='2'){
        ans = prompt('How many cookies do you want to spawn?');
        if(!(ans === "" || ans === null) && Number(ans) > 0){
            forCookies.iter = Number(ans);
            for(;forCookies.ctr<forCookies.iter;forCookies.ctr++){
                new Game.shimmer("golden");
                console.log(`Golden cookie spawned. Iteration ${forCookies.ctr}`);
            }
            forCookies.iter=0; forCookies.ctr=0;
        } else alert('Cancelled.');
    ////////////////////////////////////////////////////
    // 3) Autoclicker
    } else if(ans=='3'){
        ans = prompt('Enter delay between clicks in ms (1000 = 1s). Press "c" to disable.');
        if(ans === null || ans === "" || ans === '0' || Number(ans)<1){ alert('Cancelled.'); }
        else{
            if(Number(ans)<=100){ confirmans = confirm('Delay <100ms may lag. Continue?'); if(!confirmans) return; }
            ac.timer = setInterval(ac.click, Number(ans));
        }
    ////////////////////////////////////////////////////
    // 4) Mouse wheel mode
    } else if(ans=='4'){
        if(!mwheel.active){ confirmans = confirm('Activate mouse wheel mode?'); mwheel.active2 = confirmans; }
        else { confirmans = confirm('Deactivate mouse wheel mode?'); mwheel.active2 = !confirmans; }
        mwheel.active = mwheel.active2;
        document.onmousewheel = mwheel.active ? ac.click : null;
    ////////////////////////////////////////////////////
    // 5) Buy for free
    } else if(ans=='5'){
        ans = prompt('Select what item you want to get for free:\n1) Cursor\n2) Alchemy lab\n3) Antimatter condenser\n4) Bank\n5) Chancemaker\n6) Factory\n7) Farm\n8) Fractal engine\n9) Grandma\n10) Javascript console\n11) Mine\n12) Portal\n13) Prism\n14) Shipment\n15) Temple\n16) Time machine\n17) Wizard tower');
        let map = { '1':'Cursor','2':'Alchemy lab','3':'Antimatter condenser','4':'Bank','5':'Chancemaker','6':'Factory','7':'Farm','8':'Fractal engine','9':'Grandma','10':'Javascript console','11':'Mine','12':'Portal','13':'Prism','14':'Shipment','15':'Temple','16':'Time machine','17':'Wizard tower' };
        if(map[ans]){ getFree.itemName=map[ans]; } else { alert('Cancelled.'); getFree.wrongItem=true; }
        if(!getFree.wrongItem){
            ans = prompt(`How many '${getFree.itemName}' do you want for free? (Type "infinite" for googol amount!)`);
            let amount = ans.toLowerCase() === 'infinite' ? 1e100 : Number(ans);
            if(isNaN(amount)){ alert('Not a number! Using googol.'); amount = 1e100; }
            Game.Objects[getFree.itemName].getFree(amount);
        }
    ////////////////////////////////////////////////////
    // 6) Earn sugar lumps
    } else if(ans=='6'){
        ans = prompt('How many sugar lumps do you want?');
        if(ans===null||ans==="") { alert('Cancelled'); return; }
        let lumps = Number(ans); if(isNaN(lumps)){ alert('Not a number'); return; }
        Game.gainLumps(lumps);
        Game.Notify('Note from the hack', `${lumps} sugar lump(s) gained.`);
    ////////////////////////////////////////////////////
    // 7) Gain buffs
    } else if(ans=='7'){
        ans = prompt('Enter buff number:\n1) Frenzy');
        if(ans=='1'){
            buffs.duration = Number(prompt('Enter duration in seconds')); if(isNaN(buffs.duration)){ alert('Not a number'); return; }
            buffs.pow = Number(prompt('Enter power multiplier')); if(isNaN(buffs.pow)){ alert('Not a number'); return; }
            Game.gainBuff('frenzy', buffs.duration, buffs.pow);
        }
    ////////////////////////////////////////////////////
    // 8) Grimoire hacks
    } else if(ans=='8'){
        if(Game.Objects["Wizard tower"].amount<=0||Game.Objects["Wizard tower"].level<2){ alert('Wizard tower not unlocked'); return; }
        ans = prompt('Grimoire hacks:\n1) Set backfire chance to 0\n2) Set backfire chance to normal');
        if(ans=='1'){ Game.Objects["Wizard tower"].minigame.getFailChance = CookiePatcher.patchedGrimoireBackfire; Game.Notify('Grimoire patched', 'Backfire chance = 0'); }
        else if(ans=='2'){ Game.Objects["Wizard tower"].minigame.getFailChance = CookiePatcher.originalGrimoireBackfire; Game.Notify('Grimoire patched', 'Backfire restored'); }
    ////////////////////////////////////////////////////
    } else if(ans===null||ans==="") { console.log('Cancelled'); }
    else alert('Function not found.');
}

console.log('[== Hack started. v.'+hinfo.version+' ==]');
