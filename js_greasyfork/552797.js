// ==UserScript==
// @name         FMP Position Ratings 
// @name:en      FMP Position Ratings 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show Position Ratings with Modern Design
// @description:en  Show Position Ratings with Modern Design
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @match        https://footballmanagerproject.com/Team/Player/?id=*
// @match        https://www.footballmanagerproject.com/Team/Player?id=*
// @match        https://www.footballmanagerproject.com/Team/Player/?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552797/FMP%20Position%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/552797/FMP%20Position%20Ratings.meta.js
// ==/UserScript==

const RatingRate={
    //  Han,One,Ref,Aer,Jum,Ele,Kic,Thr,Pos,Sta,Pac
    0: [1.0,0.8,1.0,0.6,0.6,0.5,0.5,0.5,0.7,0.5,0.6],//GK
    //  Mar,Tak,Tec,Pas,Cro,Fin,Hea,Lon,Pos,Sta,Pac
    4: [1.0,1.0,0.5,0.5,0.3,0.2,1.0,0.6,0.9,0.8,0.5],//DC
    5: [0.6,1.0,0.6,0.6,1.0,0.4,0.6,0.6,0.6,0.8,0.5],//DL
    6: [0.6,1.0,0.6,0.6,1.0,0.4,0.6,0.6,0.6,0.8,0.5],//DR
    8: [0.7,0.9,0.6,0.7,0.3,0.4,0.9,0.7,0.8,0.8,0.5],//DMC
    9: [0.5,1.0,0.6,0.7,1.0,0.4,0.6,0.6,0.6,0.8,0.5],//DML
    10:[0.8,0.5,0.5,1.0,0.6,0.6,0.6,1.0,0.6,0.4,0.6],//DMR
    16:[0.5,0.7,0.8,1.0,0.4,0.5,0.6,0.7,0.8,0.8,0.5],//MC
    17:[0.4,0.6,0.6,0.8,1.0,0.6,0.6,0.7,0.7,0.8,0.5],//ML
    18:[0.4,0.6,0.6,0.8,1.0,0.6,0.6,0.7,0.7,0.8,0.5],//MR
    32:[0.3,0.3,0.7,1.0,0.4,0.9,0.7,1.0,0.7,0.8,0.5],//AMC
    33:[0.3,0.5,0.7,0.8,1.0,0.6,0.6,0.7,0.8,0.8,0.5],//AML
    34:[0.3,0.5,0.7,0.8,1.0,0.6,0.6,0.7,0.8,0.8,0.5],//AMR
    64:[0.2,0.5,0.7,0.7,0.4,1.0,1.0,0.8,0.7,0.8,0.5],//FC
};

const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
const id = urlObj.searchParams.get('id');

function getId(id){
    const idDIv = document.createElement('tr');
    idDIv.innerHTML = '<th>ID</th><td>'+id+'</td>';
    return idDIv
}

function getRating(rating) {
    const ratingDiv = document.createElement('tr');
    ratingDiv.innerHTML = '<th>Rating</th><td>'+rating/10+'</td>';
    let infoTable = document.getElementsByClassName("infotable");
    infoTable[0].appendChild(ratingDiv);
}

function getBirthday(birthday) {
    const birthtime = new Date(FMP.Day0)
    birthtime.setDate(birthtime.getDate() + birthday);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Translated

    const birthdayDiv = document.createElement('tr');
    birthdayDiv.innerHTML = '<th>Birth Date</th><td><span title="' + weekdays[birthtime.getDay()] + '">' + birthday + '</span>\t<span>' + weekdays[birthtime.getDay()] + '</span></td>';
    let infoTable = document.getElementsByClassName("infotable");
    infoTable[0].appendChild(birthdayDiv);

    console.log(birthtime);
}

function getRatingTable(skills, pos ,nowRating) {
    const targerElement = document.querySelectorAll('.d-flex.flex-wrap.justify-content-around');
    let postions = [4,5,8,9,16,17,32,33,64];
    let index=0;
    let table={};
    if (pos === 0) {
        return;
    }
    else {
        switch (pos) {
            case 4: index=4;break;
            case 5: index=5;break;
            case 6: index=5;break;
            case 8: index=8;break;
            case 9: index=9;break;
            case 10: index=9;break;
            case 16: index=16;break;
            case 17: index=17;break;
            case 18: index=17;break;
            case 32: index=32;break;
            case 33: index=33;break;
            case 34: index=33;break;
            case 64: index=64;break;
        }
        for (let i of postions) {
            table[i] = getPosRating(skills,i);
        }
    }
    let predTable=predictRating(table,index,nowRating);
    
    // Create modern styled container
    let containerDiv = document.createElement('div');
    containerDiv.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border-radius: 12px;
        padding: 20px;
        margin: 20px auto;
        max-width: 800px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        border: 1px solid #333;
    `;
    
    // Create title
    let titleDiv = document.createElement('div');
    titleDiv.style.cssText = `
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #444;
    `;
    titleDiv.textContent = 'Position Ratings';
    
    // Create grid container
    let gridDiv = document.createElement('div');
    gridDiv.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 15px;
    `;
    
    // Find max value
    const maxValue = Math.max(...Object.values(predTable));
    const maxKey = Object.keys(predTable).find(key => predTable[key] === maxValue);
    
    const positionLabels = {
        4: 'DC',
        5: 'DL/DR',
        8: 'DMC',
        9: 'DML/DMR',
        16: 'MC',
        17: 'ML/MR',
        32: 'OMC',
        33: 'OML/OMR',
        64: 'FC'
    };
    
    // Create position cards
    for (let i of postions) {
        let card = document.createElement('div');
        let rating = predTable[i].toFixed(1);
        let color;
        
        // Determine color based on rating
        if (parseFloat(rating) >= 15) {
            color = '#00ff00'; // Green
        } else if (parseFloat(rating) >= 12) {
            color = '#ffff00'; // Yellow
        } else if (parseFloat(rating) >= 9) {
            color = '#ff7f00'; // Orange
        } else {
            color = '#ff4444'; // Red
        }
        
        // Highlight current position and best alternative
        let borderColor = '#444';
        let bgColor = '#2a2a2a';
        if (i == maxKey && i != index) {
            borderColor = '#00ff00'; // Best alternative
            bgColor = '#1a3a1a';
        } else if (i == index) {
            borderColor = '#ffff00'; // Current position
            bgColor = '#3a3a1a';
        }
        
        card.style.cssText = `
            background: ${bgColor};
            border: 2px solid ${borderColor};
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        card.innerHTML = `
            <div style="color: #ccc; font-size: 14px; font-weight: bold; margin-bottom: 8px;">${positionLabels[i]}</div>
            <div style="color: ${color}; font-size: 28px; font-weight: bold; text-shadow: 0 0 10px ${color};">${rating}</div>
        `;
        
        // Add hover effect
        card.onmouseover = () => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = `0 0 15px ${borderColor}`;
        };
        card.onmouseout = () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = 'none';
        };
        
        gridDiv.appendChild(card);
    }
    
    // Create legend
    let legendDiv = document.createElement('div');
    legendDiv.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #444;
        font-size: 12px;
    `;
    
    legendDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 15px; height: 15px; background: #3a3a1a; border: 2px solid #ffff00; border-radius: 3px;"></div>
            <span style="color: #ccc;">Current Position</span>
        </div>
        <div style="display: flex; align-items: center; gap: 5px;">
            <div style="width: 15px; height: 15px; background: #1a3a1a; border: 2px solid #00ff00; border-radius: 3px;"></div>
            <span style="color: #ccc;">Best Alternative</span>
        </div>
    `;
    
    // Create note
    let noteDiv = document.createElement('div');
    noteDiv.style.cssText = `
        text-align: center;
        color: #ff9800;
        font-size: 11px;
        margin-top: 10px;
        font-style: italic;
    `;
    noteDiv.textContent = '* Ratings are estimated for reference only';
    
    // Assemble everything
    containerDiv.appendChild(titleDiv);
    containerDiv.appendChild(gridDiv);
    containerDiv.appendChild(legendDiv);
    containerDiv.appendChild(noteDiv);
    
    targerElement[0].after(containerDiv);
}

function predictRating(ratingTable,index,posRating){
    let predBouns=posRating/10/ratingTable[index];
    return Object.entries(ratingTable).reduce((newTable, [key, value]) => {
        newTable[key] = value * predBouns;
        return newTable;
    }, {});
}

function getPubTalent(pubTalent,pos) {
    const talentsDiv = document.getElementsByClassName("talents");
    const tdDiv = talentsDiv[0].getElementsByTagName("td");
    if (pos === 0) {
        tdDiv[0].textContent+=pubTalent.agi+1;
        tdDiv[1].textContent+=pubTalent.set+1;
        tdDiv[2].textContent+=pubTalent.str+1;
    }
    else {
        tdDiv[0].textContent+=pubTalent.ada+1;
        tdDiv[1].textContent+=pubTalent.agi+1;
        tdDiv[2].textContent+=pubTalent.set+1;
        tdDiv[3].textContent+=pubTalent.str+1;
    }
}

function getPosRating(skills,pos){
    let skillValue = [];
    if(pos === 0) {
        skillValue = [skills.Han,
                      skills.One,
                      skills.Ref,
                      skills.Aer,
                      skills.Jum,
                      skills.Ele,
                      skills.Kic,
                      skills.Thr,
                      skills.Pos,
                      skills.Sta,
                      skills.Pac];
    }
    else {
        skillValue = [skills.Mar,
                      skills.Tak,
                      skills.Tec,
                      skills.Pas,
                      skills.Cro,
                      skills.Fin,
                      skills.Hea,
                      skills.Lon,
                      skills.Pos,
                      skills.Sta,
                      skills.Pac];
    }
    const rating = skillValue.reduce((total, currentSkill, index) => {
        return total + currentSkill * RatingRate[pos][index];
    }, 0);
    const sum = RatingRate[pos].reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return rating/sum;
}

function getPlayers(pid,rating,ratingtable,pubtalents,birthdate){
    $.getJSON({
      "url": ("/Team/Player?handler=PlayerData&playerId=" + pid),
      "datatype": "json",
      "contentType": "application/json",
      "type": "GET"
    },
      function (ajaxResults) {
        rating(ajaxResults.player.marketInfo.rating);
        ajaxResults.player.pos=fp2pos(ajaxResults.player.fp);
        var skills=decode(ajaxResults.player.skills,ajaxResults.player.pos)
        ratingtable(skills,ajaxResults.player.pos,ajaxResults.player.marketInfo.rating);
        pubtalents(ajaxResults.player.pubTalents,ajaxResults.player.pos);
        birthdate(ajaxResults.player.birthday);
      }
    );
}

function decode(binsk, pos) {
    var skills = Uint8Array.from(atob(binsk), c => c.charCodeAt(0));
    var sk = {};
    if (pos === 0) {
        sk.Han = skills[0] / 10;
        sk.One = skills[1] / 10;
        sk.Ref = skills[2] / 10;
        sk.Aer = skills[3] / 10;
        sk.Ele = skills[4] / 10;
        sk.Jum = skills[5] / 10;
        sk.Kic = skills[6] / 10;
        sk.Thr = skills[7] / 10;
        sk.Pos = skills[8] / 10;
        sk.Sta = skills[9] / 10;
        sk.Pac = skills[10] / 10;
        sk.For = skills[11] / 10;
        sk.Rou = (skills[12] * 256 + skills[13]) / 100;
    }
    else {
        sk.Mar = skills[0] / 10;
        sk.Tak = skills[1] / 10;
        sk.Tec = skills[2] / 10;
        sk.Pas = skills[3] / 10;
        sk.Cro = skills[4] / 10;
        sk.Fin = skills[5] / 10;
        sk.Hea = skills[6] / 10;
        sk.Lon = skills[7] / 10;
        sk.Pos = skills[8] / 10;
        sk.Sta = skills[9] / 10;
        sk.Pac = skills[10] / 10;
        sk.For = skills[11] / 10;
        sk.Rou = (skills[12] * 256 + skills[13]) / 100;
    }

    return sk;
}

function fp2pos(fp) {
  switch (fp) {
    case "GK": return 0;
    case "DC": return 4;
    case "DL": return 5;
    case "DR": return 6;
    case "DMC": return 8;
    case "DML": return 9;
    case "DMR": return 10;
    case "MC": return 16;
    case "ML": return 17;
    case "MR": return 18;
    case "OMC": return 32;
    case "OML": return 33;
    case "OMR": return 34;
    case "FC": return 64;
  }

  return -1;
}

function pos2fp(pos) {
  switch (pos) {
    case 0: return "GK";
    case 4: return "DC";
    case 5: return "DL";
    case 6: return "DR";
    case 8: return "DMC";
    case 9: return "DML";
    case 10: return "DMR";
    case 16: return "MC";
    case 17: return "ML";
    case 18: return "MR";
    case 32: return "OMC";
    case 33: return "OML";
    case 34: return "OMR";
    case 64: return "FC";
  }

  return "";
}

function xpBonus(rou) {
    return 5*rou/(rou+10)/100;
}

let observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            let infoTable = document.getElementsByClassName("infotable");
            if (infoTable[0] && infoTable[0].firstChild) {
                infoTable[0].insertBefore(getId(id),infoTable[0].firstChild);
                getPlayers(id,getRating,getRatingTable,getPubTalent,getBirthday);
                observer.disconnect();
                break;
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
