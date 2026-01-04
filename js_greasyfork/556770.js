// ==UserScript==
// @name         FMP Match Analysis
// @namespace    https://greasyfork.org/users/1304483
// @version      0.2
// @description  player match analysis
// @match        https://footballmanagerproject.com/Matches/Match*
// @match        https://www.footballmanagerproject.com/Matches/Match*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556770/FMP%20Match%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/556770/FMP%20Match%20Analysis.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {
    try{
        if (window.matchView.report && window.PlTable && window.LiveMatch.ajaxResult) {
            const div = document.getElementsByClassName("lheader")[1];
            const button = document.createElement("button");
            button.className = 'btn btn-primary w-200';
            button.style.float = "right";
            button.textContent = "Match Analysis";
            button.addEventListener("click", () => showMatchAnalysis());
            div.appendChild(button);
            console.log(window.matchView.report);
            observer.disconnect(); // 成功后断开观察
        }
    }catch(error){
        console.log(error);
        observer.disconnect(); // 失败后断开观察
    }
});

observer.observe(document, { childList: true, subtree: true });

function showMatchAnalysis(){
// ===== 深色背景 + 毛玻璃 =====
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.65)";
    overlay.style.backdropFilter = "blur(6px)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    // ===== 深色内容卡片 =====
    const card = document.createElement("div");
    card.style.width = "85%";
    card.style.maxWidth = "1200px";
    card.style.maxHeight = "90%";
    card.style.background = "rgba(30,30,30,0.95)";
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.borderRadius = "12px";
    card.style.padding = "25px 32px";
    card.style.overflowY = "auto";
    card.style.boxShadow = "0 0 25px rgba(0,0,0,0.6)";
    card.style.color = "#e5e7eb";   // 全局浅色字体
    overlay.appendChild(card);

    // ===== 关闭按钮（深色风格） =====
    const closeButton = document.createElement("div");
    closeButton.textContent = "✕";
    closeButton.style.position = "absolute";
    closeButton.style.top = "18px";
    closeButton.style.right = "28px";
    closeButton.style.fontSize = "26px";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "#ffffff";
    closeButton.style.opacity = "0.8";
    closeButton.style.transition = "0.2s";
    closeButton.onmouseenter = () => closeButton.style.opacity = "1";
    closeButton.onmouseleave = () => closeButton.style.opacity = "0.8";
    closeButton.addEventListener("click", () => overlay.remove());
    overlay.appendChild(closeButton);

    // ===== 标题（深色主题） =====
    const teamInfo = document.createElement("div");
    teamInfo.style.textAlign = "center";
    teamInfo.style.fontSize = "26px";
    teamInfo.style.fontWeight = "700";
    teamInfo.style.marginBottom = "20px";
    teamInfo.style.color = "#f0f0f0";
    teamInfo.textContent = "Match Analysis";
    card.appendChild(teamInfo);

    // ===== 左右容器 =====
    const playerInfo = document.createElement("div");
    playerInfo.style.display = "flex";
    playerInfo.style.gap = "20px";
    playerInfo.style.width = "100%";
    playerInfo.style.alignItems = "flex-start";
    card.appendChild(playerInfo);

    // ===== 共享板块样式（深灰 + 微光） =====
    const panelStyle = {
        flex: "1",
        background: "rgba(45,45,45,0.9)",
        borderRadius: "10px",
        padding: "18px",
        boxShadow: "0 0 10px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.05)"
    };

    const homePlayer = document.createElement("div");
    Object.assign(homePlayer.style, panelStyle);
    playerInfo.appendChild(homePlayer);

    const awayPlayer = document.createElement("div");
    Object.assign(awayPlayer.style, panelStyle);
    playerInfo.appendChild(awayPlayer);

    // ===== 保持你原有的表格逻辑不变 =====
    document.body.appendChild(overlay);

    const data = getData();
    const homeDividePlayer = divideGK(data.home.player);
    const awayDividePlayer = divideGK(data.away.player);
    const playerNameMap = {};
    // 主队 = #a0ff38
    for (const [pid, p] of Object.entries(data.home.player)) {
        playerNameMap[pid] = {
            name: p.info.name + " " + p.info.lastName,
            color: "#a0ff38"
        };
    }

    // 客队 = #37d3e9
    for (const [pid, p] of Object.entries(data.away.player)) {
        playerNameMap[pid] = {
            name: p.info.name + " " + p.info.lastName,
            color: "#37d3e9"
        };
    }
    console.log(data);
    homePlayer.appendChild(renderTable(GKStaticTableData(homeDividePlayer.GK), gkColumns, playerNameMap));
    homePlayer.appendChild(renderTable(playerStaticTableData(homeDividePlayer.noGK), fieldColumns, playerNameMap));

    awayPlayer.appendChild(renderTable(GKStaticTableData(awayDividePlayer.GK), gkColumns, playerNameMap));
    awayPlayer.appendChild(renderTable(playerStaticTableData(awayDividePlayer.noGK), fieldColumns, playerNameMap));
}

let tooltip;
function ensureTooltip() {
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.style.position = "fixed";
    tooltip.style.background = "rgba(0,0,0,0.85)";
    tooltip.style.border = "1px solid rgba(255,255,255,0.1)";
    tooltip.style.borderRadius = "6px";
    tooltip.style.padding = "8px 10px";
    tooltip.style.fontSize = "13px";
    tooltip.style.color = "#eee";
    tooltip.style.zIndex = "20000";
    tooltip.style.pointerEvents = "none";
    tooltip.style.display = "none";
    tooltip.style.whiteSpace = "nowrap";
    document.body.appendChild(tooltip);
    return tooltip;
}

function showTooltip(html, x, y) {
    const t = ensureTooltip();
    t.innerHTML = html;
    t.style.left = (x + 14) + "px";
    t.style.top = (y + 14) + "px";
    t.style.display = "block";
}

function hideTooltip() {
    if (tooltip) tooltip.style.display = "none";
}

function formatEvent(evt, playerNameMap) {
    const m = minuteToString(evt.min) + "'";
    const zone = zoneString[evt.zone] ?? "-";
    const zoneHTML = zone ? `<span class="pitch-position pitch-${zone[0].toLowerCase()}">${zone}</span>` : "-";
    const act = actionTypeString[evt.actType] ?? "-";
    const fin = finTypeString[evt.finType] ?? "";
    const atk = playerNameMap[evt.atkId] ? `<span style="color:${playerNameMap[evt.atkId].color}">${playerNameMap[evt.atkId].name}</span>` : "-";
    const def = playerNameMap[evt.defId] ? `<span style="color:${playerNameMap[evt.defId].color}">${playerNameMap[evt.defId].name}</span>` : "-";
    return `${m} ${zoneHTML} ${act} ${fin} ${atk} ${def}`;
}

function bindTooltip(td, events, playerNameMap) {
    if (!events) return;
    td.addEventListener("mouseenter", e => {
        if (!events.length) {
            showTooltip("", e.clientX, e.clientY);
            return;
        }
        let html = "";
        for (const evt of events) html += formatEvent(evt, playerNameMap) + "<br>";
        showTooltip(html, e.clientX, e.clientY);
    });
    td.addEventListener("mousemove", e => {
        if (!tooltip) return;
        tooltip.style.left = (e.clientX + 14) + "px";
        tooltip.style.top = (e.clientY + 14) + "px";
    });
    td.addEventListener("mouseleave", hideTooltip);
}

function renderTable(playerData, columns, playerNameMap) {
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.margin = "20px 0";
    table.style.background = "rgba(50,50,50,0.6)";
    table.style.border = "1px solid rgba(255,255,255,0.1)";
    table.style.borderRadius = "6px";
    table.style.fontSize = "14px";
    table.style.color = "#ddd";

    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    hr.style.background = "rgba(255,255,255,0.08)";
    for (const col of columns) {
        const th = document.createElement("th");
        th.textContent = col.label;
        th.style.padding = "6px 4px";
        th.style.border = "1px solid rgba(255,255,255,0.15)";
        th.style.textAlign = "center";
        th.style.fontWeight = "600";
        hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    playerData.forEach(player => {
        const tr = document.createElement("tr");
        tr.onmouseenter = () => tr.style.background = "rgba(255,255,255,0.07)";
        tr.onmouseleave = () => tr.style.background = "transparent";

        for (const col of columns) {
            const td = document.createElement("td");
            td.style.border = "1px solid rgba(255,255,255,0.08)";
            td.style.textAlign = col.align || "center";
            td.style.padding = "4px 6px";

            const v = typeof col.value === "function" ? col.value(player) : player[col.key];
            td.innerHTML = v;

            // === 名字 Tooltip：上场/下场 ===
            if (col.nameHover) {
                td.addEventListener("mouseenter", e => {

                    const subIn  = (player.subIn  === "-" || player.subIn === "0") ? null : player.subIn;
                    const subOut = (player.subOut === "-") ? null : player.subOut;

                    let html = "";

                    if (subIn) {
                        html += `
                        <div style="display:flex;align-items:center;gap:6px;">
                        <img src="/icons/SubIn.png" style="width:14px;">
                        <span>${subIn}'</span>
                        </div>
                        `;
                    }

                    if (subOut) {
                        html += `
                        <div style="display:flex;align-items:center;gap:6px;">
                        <img src="/icons/SubOut.png" style="width:14px;">
                        <span>${subOut}'</span>
                        </div>
                        `;
                    }
                    showTooltip(html, e.clientX, e.clientY);
                });

                td.addEventListener("mousemove", e => {
                    tooltip.style.left = e.clientX + 14 + "px";
                    tooltip.style.top  = e.clientY + 14 + "px";
                });

                td.addEventListener("mouseleave", hideTooltip);
            }

            // === 数据列 Tooltip（事件列表） ===
            if (col.eventsKey) {
                bindTooltip(td, player[col.eventsKey], playerNameMap);
            }

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}

const gkColumns = [
    {
        label: "球员",
        align: "left",
        value: p => p.name,
        nameHover: true
    },
    { label: "扑救", key: "saved", eventsKey: "savedEvents" },
    { label: "失球", key: "goals", eventsKey: "goalEvents" }
];

const fieldColumns = [
    {
        label: "球员",
        align: "left",
        value: p => p.name,
        nameHover: true
    },
    { label: "成功传球", key: "atkWinAction", eventsKey: "atkWinActionEvents" },
    { label: "失败传球", key: "atkLostAction", eventsKey: "atkLostActionEvents" },
    { label: "成功对抗", key: "atkWinTakle", eventsKey: "atkWinTakleEvents" },
    { label: "失败对抗", key: "atkLostTakle", eventsKey: "atkLostTakleEvents" },
    { label: "射正", key: "kickIn", eventsKey: "kickInEvents" },
    { label: "射失", key: "kickout", eventsKey: "kickoutEvents" },
    { label: "进球", key: "goal", eventsKey: "goalEvents" },
    { label: "任意球", key: "kick", eventsKey: "kickEvents" },
    { label: "造任意球", key: "clash", eventsKey: "clashEvents" },
    { label: "成功断球", key: "defWinAction", eventsKey: "defWinActionEvents" },
    { label: "失败断球", key: "defLostAction", eventsKey: "defLostActionEvents" },
    { label: "防守致任意球", key: "defClash", eventsKey: "defClashEvents" },
];


function divideGK(playerData){
    const [GK, noGK] = Object.entries(playerData).reduce(
        ([gk, nogk], [key, value]) => {
            value.info.fp === "GK" ? gk[key] = value : nogk[key] = value;
            return [gk, nogk];
        },
        [{}, {}]
    );
    return {GK:GK,noGK:noGK};
}

function GKStaticTableData(teamPlayerInfo){
    var playerStaticData=[];
    for (const [key, value] of Object.entries(teamPlayerInfo)) {
        const static={
            index:value.index,
            name:value.info.name+" "+value.info.lastName,
            subIn:value.onField.subIn.time===null? '-': minuteToString(value.onField.subIn.time),
            subOut:value.onField.subOut.time===null? '-': minuteToString(value.onField.subOut.time),

            saved:value.defStatic.saved.length
                 + value.defStatic.defDirKick.length
                 + value.defStatic.defFreekick.length
                 + value.defStatic.defpenalty.length
                 + value.defStatic.gkCorner.length,

            goals:value.defStatic.goal.length,

            savedEvents: [
                ...value.defStatic.saved,
                ...value.defStatic.defDirKick,
                ...value.defStatic.defFreekick,
                ...value.defStatic.defpenalty,
                ...value.defStatic.gkCorner
            ],

            goalEvents:value.defStatic.goal
        };
        playerStaticData.push(static);
    };
    playerStaticData.sort((a,b)=>a.index-b.index);
    return playerStaticData;
}

function playerStaticTableData(teamPlayerInfo){
    var playerStaticData = [];
    for (const [key, value] of Object.entries(teamPlayerInfo)) {
        const static = {
            index: value.index,
            name: value.info.name + " " + value.info.lastName,
            subIn:  value.onField.subIn.time === null ? '-' : minuteToString(value.onField.subIn.time),
            subOut: value.onField.subOut.time === null ? '-' : minuteToString(value.onField.subOut.time),

            // 统计
            atkWinAction:  value.atkStatic.winAction.length,
            atkLostAction: value.atkStatic.lostAction.length,
            atkWinTakle:   value.atkStatic.winTakle.length
            +value.defStatic.winTakle.length,
            atkLostTakle:  value.atkStatic.lostTakle.length
            +value.defStatic.lostTakle.length,
            kickIn: value.atkStatic.gkCorner.length
            +value.atkStatic.saved.length
            +value.atkStatic.goal.length,
            kickout: value.atkStatic.kickout.length,
            goal:value.atkStatic.goal.length,
            kick:value.atkStatic.kickAction.length,
            clash:value.atkStatic.clashCorner.length
            +value.atkStatic.clashDirKick.length
            +value.atkStatic.clashFreekick.length
            +value.atkStatic.penalty.length,
            defWinAction:value.defStatic.winAction.length,
            defLostAction:value.defStatic.lostAction.length,
            defClash:value.defStatic.defpenalty.length
            +value.defStatic.defCorner.length
            +value.defStatic.defDirKick.length
            +value.defStatic.defFreekick.length,

            // Tooltip 用：对应的事件数组
            atkWinActionEvents:  value.atkStatic.winAction,
            atkLostActionEvents: value.atkStatic.lostAction,
            atkWinTakleEvents:[
                ...value.atkStatic.winTakle,
                ...value.defStatic.winTakle,
            ],
            atkLostTakleEvents:[
                ...value.atkStatic.lostTakle,
                ...value.defStatic.lostTakle,
            ],
            kickInEvents: [
                ...value.atkStatic.gkCorner,
                ...value.atkStatic.saved,
                ...value.atkStatic.goal,
            ],
            kickoutEvents:value.atkStatic.kickout,
            goalEvents:value.atkStatic.goal,
            kickEvents:value.atkStatic.kickAction,
            clashEvents:[
                ...value.atkStatic.clashCorner,
                ...value.atkStatic.clashDirKick,
                ...value.atkStatic.clashFreekick,
                ...value.atkStatic.penalty,
            ],
            defWinActionEvents:value.defStatic.winAction,
            defLostActionEvents:value.defStatic.lostAction,
            defClashEvents:[
                ...value.defStatic.defCorner,
                ...value.defStatic.defDirKick,
                ...value.defStatic.defFreekick,
                ...value.defStatic.defpenalty,
            ],
        };
        playerStaticData.push(static);
    }
    playerStaticData.sort((a, b) => a.index - b.index);
    console.log(playerStaticData);
    return playerStaticData;
}


function minuteToString(min) {
    const halfmin = min % 60 + 1;
    const half = Math.floor(min / 60);

    var strmin = "";

    if (half === 0) {
        if (halfmin > 45){
            strmin = "45+" + (halfmin - 45);
        }
        else{
            strmin = halfmin;
        }
    }
    else if (half === 1) {
        if (halfmin > 45){
            strmin = "90+" + (halfmin - 45);
        }
        else{
            strmin = (halfmin + 45);
        }
    }
    else if (half === 2) {
        if (halfmin > 15){
            strmin = "105+" + (halfmin - 15);
        }
        else{
            strmin = (halfmin + 90);
        }
    }
    else if (half === 3) {
        if (halfmin > 15){
            strmin = "120+" + (halfmin - 15);
        }
        else{
            strmin = (halfmin + 105);
        }
    }
    else if (half === 4) {
        strmin = "120";
    }

    return strmin;
}

function getData(){
    const rawReport=matchView.report;
    const idMinutes=getActionMinutes(rawReport);
    const playerInfo={home:PlTable.homeList.startList, away:PlTable.awayList.startList};
    const report=fixReport(rawReport);
    var homePlayerData={};
    var awayPlayerData={};

    //getActions
    const playerAction=report.filter(item => item.repType !== reportType.settingPlayers
                                        && item.repType !== reportType.sub
                                        && item.repType !== reportType.setCapt
                                        && item.repType !== reportType.injury
                                        && item.repType !== reportType.injurySub
                                        && item.repType !== reportType.hurt
                                        && item.repType !== reportType.movePlayer);
    playerInfo.home.forEach((player)=>{
        homePlayerData[player.id]=getPlayerData(playerAction,player.id,player.fp);
    });
    playerInfo.away.forEach((player)=>{
        awayPlayerData[player.id]=getPlayerData(playerAction,player.id,player.fp);
    });
    //getOnField
    const lastMinute=rawReport[rawReport.length - 1].min;
    const subInfo=rawReport.filter(item => item.repType === reportType.sub
                                   || item.repType === reportType.injurySub);
    playerInfo.home.forEach((player,index)=>{
        homePlayerData[player.id].onField=getPlayerOnFieldData(subInfo,player.id);
        if(index<11){
            homePlayerData[player.id].onField.subIn={time:0,pos:player.position}
        }
        if(homePlayerData[player.id].onField.subIn.time !== null
           && homePlayerData[player.id].onField.subOut.time === null){
            homePlayerData[player.id].onField.subOut.time=lastMinute;
        }
    });
    playerInfo.away.forEach((player,index)=>{
        awayPlayerData[player.id].onField=getPlayerOnFieldData(subInfo,player.id);
        if(index<11){
            awayPlayerData[player.id].onField.subIn={time:0,pos:player.position}
        }
        if(awayPlayerData[player.id].onField.subIn.time !== null
           && awayPlayerData[player.id].onField.subOut.time === null){
            awayPlayerData[player.id].onField.subOut.time=lastMinute;
        }
    });
    //getEnergy
    const energySet=getEnergySet(rawReport,idMinutes);
    playerInfo.home.forEach((player)=>{
        homePlayerData[player.id].energy=getPlayerEnergy(energySet,player.id);
    });
    playerInfo.away.forEach((player)=>{
        awayPlayerData[player.id].energy=getPlayerEnergy(energySet,player.id);
    });
    //basicInfo
    playerInfo.home.forEach((player,index)=>{
        homePlayerData[player.id].info=player;
        homePlayerData[player.id].index=index;
    });
    playerInfo.away.forEach((player,index)=>{
        awayPlayerData[player.id].info=player;
        awayPlayerData[player.id].index=index;
    });
    return {home:{team:null,player:homePlayerData},away:{team:null,player:awayPlayerData}}
}

function getActionMinutes(rawReport){
    const lastID=rawReport[rawReport.length - 1].id;
    let idMinutes=[];
    for(let i=1;i<=lastID;i++){
        const IDSet=rawReport.filter(item => item.id === i);
        const tmp=IDSet.filter(item => "min" in item);
        const minValues = tmp.map(item => item.min);
        const minValue = Math.min(...minValues);
        const idMin={id: i, min: minValue};
        idMinutes.push(idMin);
    }
    //check minutes and fix
    idMinutes.forEach((item, index) => {
        if (index > 0 && index < lastID - 1) {
            const prevMin = idMinutes[index - 1].min;
            const nextMin = idMinutes[index + 1].min;
            if (item.min < prevMin) {
                item.min = nextMin;
            }
        }
    });
    return idMinutes;
}

function getEnergySet(rawReport,idMinutes){
    const result=rawReport.filter(item => item.repType === reportType.setEnergy);
    result.forEach((item)=>{
        const min=idMinutes.filter(itemMin => itemMin.id === item.id);
        item.min=min[0].min;
    });
    return result;
}

function fixReport(rawReport){
    var report=JSON.parse(JSON.stringify(rawReport));
    report.forEach((item,index)=>{
        if(item.repType === reportType.stopAction){
            item.atkId=report[index-1].atkId;
        }
    });
    return report;
}

function getPlayerEnergy(energySet,playerID){
    var playerEnergySet=[];
    energySet.forEach((set)=>{
        const minEnergy={min:set.min,id:set.id===1 ? 2:set.id,energy:set.energy[playerID] ?? null};
        playerEnergySet.push(minEnergy);
    });
    return playerEnergySet;
}

function getPlayerOnFieldData(subInfo,playerID){
    const subIn=subInfo.filter(item => item.assId === playerID);
    const subOut=subInfo.filter(item => item.atkId === playerID);
    const onField={subIn:{time:subIn[0]?.min ?? null,pos:subIn[0]?.fpPos ?? null},
                   subOut:{time:subOut[0]?.min ?? null}};
    return onField;
}

function getPlayerData(playerAction,playerID,playerfp){
    var playerData;
    const playerAtk=playerAction.filter(item => item.atkId === playerID);
    const playerDef=playerAction.filter(item => item.defId === playerID);

    if(playerfp==='GK'){
        playerData=getGKPlayerData(playerAtk,playerDef);
    }
    else{
        playerData=getFieldPlayerData(playerAtk,playerDef);
    }
    return playerData;
}

function getGKPlayerData(playerAtk,playerDef){
    const playerAtkStatic={
        winAction:playerAtk.filter(item => item.repType === reportType.winAction),
        lostAction:playerAtk.filter(item => item.repType === reportType.stopAction),
        winTakle:playerAtk.filter(item => item.repType === reportType.winTakle),
        lostTakle:playerAtk.filter(item => item.repType === reportType.lostTakle),
        kickAction:playerAtk.filter(item => item.repType === reportType.kickAction),
        gkCorner:playerAtk.filter(item => item.repType === reportType.gkCorner),
        clashCorner:playerAtk.filter(item => item.repType === reportType.clashToCorner),
        clashFreekick:playerAtk.filter(item => item.repType === reportType.clashToFreekick),
        clashDirKick:playerAtk.filter(item => item.repType === reportType.clashToDirkick),
        kickout:playerAtk.filter(item => item.repType === reportType.kickout),
        goal:playerAtk.filter(item => item.repType === reportType.goals),
        penalty:playerAtk.filter(item => item.repType === reportType.penalty),
        saved:playerAtk.filter(item => item.repType === reportType.saved),
    }
    const atkLen=Object.values(playerAtkStatic).reduce((sum, arr) => sum + arr.length, 0);
    if (atkLen!=playerAtk.length){
        console.log(playerAtk);
        console.log(playerAtkStatic);
        console.error(atkLen);
    }


    const playerDefStatic={
        //lostAction:playerDef.filter(item => item.repType === reportType.winAction),
        //winAction:playerDef.filter(item => item.repType === reportType.stopAction),
        //lostTakle:playerDef.filter(item => item.repType === reportType.winTakle),
        //winTakle:playerDef.filter(item => item.repType === reportType.lostTakle),
        //kickAction:playerDef.filter(item => item.repType === reportType.kickAction),
        gkCorner:playerDef.filter(item => item.repType === reportType.gkCorner),
        //defCorner:playerDef.filter(item => item.repType === reportType.clashToCorner),
        defFreekick:playerDef.filter(item => item.repType === reportType.clashToFreekick),
        defDirKick:playerDef.filter(item => item.repType === reportType.clashToDirkick),
        kickout:playerDef.filter(item => item.repType === reportType.kickout),
        goal:playerDef.filter(item => item.repType === reportType.goals),
        defpenalty:playerDef.filter(item => item.repType === reportType.penalty),
        saved:playerDef.filter(item => item.repType === reportType.saved),
    }
    const defLen=Object.values(playerDefStatic).reduce((sum, arr) => sum + arr.length, 0);
    if (defLen!=playerDef.length){
        console.log(playerDef);
        console.log(playerDefStatic);
        console.error(defLen);
    }
    return {atkStatic:null,defStatic:playerDefStatic};
}

function getFieldPlayerData(playerAtk,playerDef){
    const playerAtkStatic={
        winAction:playerAtk.filter(item => item.repType === reportType.winAction),
        lostAction:playerAtk.filter(item => item.repType === reportType.stopAction),
        winTakle:playerAtk.filter(item => item.repType === reportType.winTakle),
        lostTakle:playerAtk.filter(item => item.repType === reportType.lostTakle),
        kickAction:playerAtk.filter(item => item.repType === reportType.kickAction),
        gkCorner:playerAtk.filter(item => item.repType === reportType.gkCorner),
        clashCorner:playerAtk.filter(item => item.repType === reportType.clashToCorner),
        clashFreekick:playerAtk.filter(item => item.repType === reportType.clashToFreekick),
        clashDirKick:playerAtk.filter(item => item.repType === reportType.clashToDirkick),
        kickout:playerAtk.filter(item => item.repType === reportType.kickout),
        goal:playerAtk.filter(item => item.repType === reportType.goals),
        penalty:playerAtk.filter(item => item.repType === reportType.penalty),
        saved:playerAtk.filter(item => item.repType === reportType.saved),
    }
    const atkLen=Object.values(playerAtkStatic).reduce((sum, arr) => sum + arr.length, 0);
    if (atkLen!=playerAtk.length){
        console.log(playerAtk);
        console.log(playerAtkStatic);
        console.error(atkLen);
    }

    const playerDefStatic={
        lostAction:playerDef.filter(item => item.repType === reportType.winAction),
        winAction:playerDef.filter(item => item.repType === reportType.stopAction),
        lostTakle:playerDef.filter(item => item.repType === reportType.winTakle),
        winTakle:playerDef.filter(item => item.repType === reportType.lostTakle),
        //kickAction:playerDef.filter(item => item.repType === reportType.kickAction),
        //gkCorner:playerDef.filter(item => item.repType === reportType.gkCorner),
        defCorner:playerDef.filter(item => item.repType === reportType.clashToCorner),
        defFreekick:playerDef.filter(item => item.repType === reportType.clashToFreekick),
        defDirKick:playerDef.filter(item => item.repType === reportType.clashToDirkick),
        //kickout:playerDef.filter(item => item.repType === reportType.kickout),
        //goal:playerDef.filter(item => item.repType === reportType.goals),
        defpenalty:playerDef.filter(item => item.repType === reportType.penalty),
        //saved:playerDef.filter(item => item.repType === reportType.saved),
    }
    const defLen=Object.values(playerDefStatic).reduce((sum, arr) => sum + arr.length, 0);
    if (defLen!=playerDef.length){
        console.log(playerDef);
        console.log(playerDefStatic);
        console.error(defLen);
    }

    return {atkStatic:playerAtkStatic,defStatic:playerDefStatic};
}

const reportType={
    initAction:0,
    kickoff:1,

    continueAction:3,
    stopAction:4,
    winAction:5,
    lostTakle:6,
    winTakle:7,
    kickout:8,
    gkCorner:9,//造门将角球
    clashToCorner:10,//造角球
    clashToFreekick:11,//造间接任意
    clashToDirkick:12,//造直接任意
    saved:13,//被扑救
    goals:14,
    kickAction:15,
    settingPlayers:16,

    penalty:18,//造点球
    injury:19,
    injurySub:20,
    hurt:21,
    restart:22,
    sub:23,
    tacChange:24,
    pressChange:25,
    movePlayer:26,
    shotoff:27,
    timeEvent:28,
    noSub:29,
    setCapt:30,
    setClock:31,
    setEnergy:32,
    extraTime:33,
    sideChange:34
};

const actionType={
    Thr:0,
    Sho:1,
    Lon:2,
    Cou:3,
    Win:4,
    Cor:5,
    Fre:6,
    Dir:7,
    Pen:8,
    Inj:9,
    Sub:10,
    Restart:11,
    Tac:12,
    Press:13,
}

const actionTypeString={
    0:"直塞",
    1:"短传",
    2:"长传",
    3:"直接",
    4:"边路",
    5:"角球",
    6:"间任",
    7:"直任",
    8:"点球"
}

const finTypeString={
    0:"射门",
    1:"远射",
    2:"头球",
    3:"倒钩",
    4:"吊射",
    5:"点球",
    6:"任意",
}

const zoneString={
    1:"DR",
    2:"DC",
    3:"DL",
    4:"MR",
    5:"MC",
    6:"ML",
    7:"FR",
    8:"FC",
    9:"FL",
    10:"NN"
}
