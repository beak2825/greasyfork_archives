// ==UserScript==
// @name         FMP Training History
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  look players training history
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @match        https://footballmanagerproject.com/Team/Player/?id=*
// @match        https://www.footballmanagerproject.com/Team/Player?id=*
// @match        https://www.footballmanagerproject.com/Team/Player/?id=*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @require      https://code.highcharts.com/highcharts.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561725/FMP%20Training%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/561725/FMP%20Training%20History.meta.js
// ==/UserScript==

let skillChart = null;
let deltaChart = null;

const FP2POS = {
    GK:0,
    DC:4,
    DL:5,
    DR:6,
    DMC:8,
    DML:9,
    DMR:10,
    MC:16,
    ML:17,
    MR:18,
    OMC:32,
    OML:33,
    OMR:34,
    FC:64
};


(function () {
    'use strict';

    init();

})();

async function init() {
    const id = new URL(window.location.href).searchParams.get('id');
    if (!id) return;

    const res = await $.ajax({
        type: "GET",
        url: "/Team/Player",
        dataType: "json",
        data: { handler: "PlayerData", playerId: id }
    });

    if (!res?.isOwner) return;

    const pos = FP2POS[res.player.fp];
    const birthday = res.player.birthday;

    const skillHistory = await getSkillHistory(id);

    skillHistory.forEach(r => {
        r.skillDecode = decode(r.skills, pos);
        r.age = r.day - birthday;
    });

    addSkillHistoryButton(skillHistory,pos);
}

function getSkillHistory(pid) {
    return $.ajax({
        type: "POST",
        url: "/Mongo/GetArchive",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: Number(pid)
        })
    }).then(result => {
        return result?.trainings?.skillsHistory ?? [];
    }).catch(err => {
        console.error("POST failed:", err);
        return [];
    });
}

function showSkillHistory(skillHistory,pos) {
    const id = new URL(window.location.href).searchParams.get('id');
    if (!id) return;

    const { content } = createDarkOverlay("Skill History");

    const chartDiv1 = document.createElement("div");
    chartDiv1.style.height = "360px";
    chartDiv1.style.marginBottom = "20px";
    content.appendChild(chartDiv1);

    renderSkillChart(chartDiv1, skillHistory);

    const chartDiv2 = document.createElement("div");
    chartDiv2.style.height = "360px";
    chartDiv2.style.marginBottom = "20px";
    content.appendChild(chartDiv2);
    renderSkillDeltaLineChart(chartDiv2, skillHistory);

    const tableHTML = buildSkillTable(skillHistory,pos);

    const panel = document.createElement("div");
    panel.style.background = "rgba(45,45,45,0.9)";
    panel.style.borderRadius = "10px";
    panel.style.padding = "18px";
    panel.style.border = "1px solid rgba(255,255,255,0.05)";
    panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.35)";
    panel.innerHTML = tableHTML;

    content.appendChild(panel);
}


function decode(binsk, pos) {
    var skills = Uint8Array.from(atob(binsk), c => c.charCodeAt(0));
    var sk = {};
    if (pos === 0) {
        sk.Han = skills[0]/10;
        sk.One = skills[1]/10;
        sk.Ref = skills[2]/10;
        sk.Aer = skills[3]/10;
        sk.Ele = skills[4]/10;
        sk.Jum = skills[5]/10;
        sk.Kic = skills[6]/10;
        sk.Thr = skills[7]/10;
        sk.Pos = skills[8]/10;
        sk.Sta = skills[9]/10;
        sk.Pac = skills[10]/10;
        sk.For = skills[11]/10;
        sk.Rou = (skills[12] * 256 + skills[13])/100;
    }
    else {
        sk.Mar = skills[0]/10;
        sk.Tak = skills[1]/10;
        sk.Tec = skills[2]/10;
        sk.Pas = skills[3]/10;
        sk.Cro = skills[4]/10;
        sk.Fin = skills[5]/10;
        sk.Hea = skills[6]/10;
        sk.Lon = skills[7]/10;
        sk.Pos = skills[8]/10;
        sk.Sta = skills[9]/10;
        sk.Pac = skills[10]/10;
        sk.For = skills[11]/10;
        sk.Rou = (skills[12] * 256 + skills[13])/100;
    }

    return sk;
}

function buildSkillTable(skillHistory,pos) {
    if (!Array.isArray(skillHistory) || skillHistory.length === 0) {
        return "<p>No data</p>";
    }

    const skillKeys = new Set();
    skillHistory.forEach(r => {
        if (r.skillDecode) {
            Object.keys(r.skillDecode).forEach(k => skillKeys.add(k));
        }
    });

    let headers;
    if (pos===0) {
        headers = ["Age", "Sta","Pac", "Han","One","Pos", "Ref","Aer","Ele", "Jum","Kic","Thr", "Rou", "For"];
    }else{
        headers = ["Age", "Sta","Pac", "Mar","Tak","Pos", "Pas","Tec","Cro", "Fin","Hea","Lon", "Rou", "For"];
    }

    let html = `
    <table style="
        width:100%;
        border-collapse:collapse;
        color:#ddd;
        font-size:13px;
        background:rgba(50,50,50,0.6);
        border:1px solid rgba(255,255,255,0.1);
        border-radius:6px;
    ">
    <thead>
        <tr style="background:rgba(255,255,255,0.08)">
    `;
    if (pos===0) {
        headers.forEach(h => {
            if(h==='Age'){
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["common.Year"]}</th>`;
            }else if(h==='Rou'){
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["sk.Rou"]}</th>`;
            }else if(h==='For'){
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["player.Form"]}</th>`;
            }else{
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["gkSkillNames."+h]}</th>`;
            }
        });
    }else {
        headers.forEach(h => {
            if(h==='Age'){
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["common.Year"]}</th>`;
            }else if(h==='Rou'){
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["sk.Rou"]}</th>`;
            }else if(h==='For'){
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["player.Form"]}</th>`;
            }else{
                html += `<th style="padding:6px;border:1px solid rgba(255,255,255,0.15);text-align:center">${trxt["plSkillNames."+h]}</th>`;
            }
        });
    }

    html += "</tr></thead><tbody>";

    for (let i = 0; i < skillHistory.length; i++) {
        const curr = skillHistory[i];
        const prev = skillHistory[i - 1];

        html += "<tr>";

        headers.forEach(h => {
            if (h === "Age") {
                html += `
            <td style="padding:4px;border:1px solid rgba(255,255,255,0.08);text-align:center">
                ${formatAgeYM(curr.age)}
            </td>`;
            } else {
                const v2 = curr.skillDecode?.[h];
                const v1 = prev?.skillDecode?.[h];

                html += `
            <td style="padding:4px;border:1px solid rgba(255,255,255,0.08);text-align:center">
                ${v2 !== undefined ? formatSkillWithDelta(v2, v1) : ""}
            </td>`;
            }
        });

        html += "</tr>";
    }

    html += "</tbody></table>";
    return html;
}

function createDarkOverlay(titleText) {
    // ===== 遮罩 =====
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

    // ===== 内容卡片 =====
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
    card.style.color = "#e5e7eb";
    overlay.appendChild(card);

    // ===== 关闭按钮 =====
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

    // ===== 标题 =====
    const title = document.createElement("div");
    title.style.textAlign = "center";
    title.style.fontSize = "26px";
    title.style.fontWeight = "700";
    title.style.marginBottom = "20px";
    title.style.color = "#f0f0f0";
    title.textContent = titleText;
    card.appendChild(title);

    // ===== 内容容器（关键） =====
    const content = document.createElement("div");
    card.appendChild(content);

    document.body.appendChild(overlay);

    return { overlay, card, content };
}

function addSkillHistoryButton(skillHistory,pos) {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.style.right = "20px";
    btn.style.bottom = "20px";
    btn.textContent = "Skill History";

    btn.addEventListener("click", () => showSkillHistory(skillHistory,pos));
    const graph = document.querySelector('#growth-graph');
    graph.parentElement.appendChild(btn);
}

function getDynamicSkillFields(skillHistory) {
    if (!skillHistory || !skillHistory.length) return [];
    return Object.keys(skillHistory[0].skillDecode || {});
}

const DEFAULT_NOT_VISIBLE = new Set(["For", "Rou"]);

function buildSkillSeries(skillHistory) {
    const fields = getDynamicSkillFields(skillHistory);
    return fields.map(field => ({
        name: field,
        visible: !DEFAULT_NOT_VISIBLE.has(field),
        data: skillHistory
            .filter(r => r.skillDecode?.[field] !== undefined)
            .map(r => [r.age, r.skillDecode[field]])
    }));
}

function renderSkillChart(container, skillHistory) {
    const series = buildSkillSeries(skillHistory);

    skillChart = Highcharts.chart(container, {
        chart: {
            backgroundColor: "transparent",
            type: "line",
            zoomType: 'x',
            resetZoomButton: {
                position: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 10
                }
            }
        },
        title: {
            text: "Skill Growth vs Age",
            style: { color: "#f0f0f0" }
        },
        xAxis: {
            title: { text: "Age", style: { color: "#ccc" } },
            labels: { style: { color: "#ccc" },
                     formatter: function () {
                         return formatAgeYM(this.value);
                     }
                    },

        },
        yAxis: {
            title: { text: "Skill Value", style: { color: "#ccc" } },
            labels: { style: { color: "#ccc" } }
        },
        legend: {
            itemStyle: { color: "#ddd" },
            itemHoverStyle: { color: "#fff" }
        },
        tooltip: {
            formatter() {
                return formatAgeYM(this.x) + `<br>` +
                    this.points.map(p =>
                                    `<span style="color:${p.color}">●</span> ${p.series.name}: ${p.y}`
                                   ).join('<br/>');
            },
            shared: true,
            backgroundColor: "rgba(30,30,30,0.9)",
            style: { color: "#eee" }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                },
                lineWidth: 2,
                states: {
                    inactive: {
                        opacity: 0.25
                    },
                    hover: {
                        lineWidthPlus: 2
                    }
                },
                point: {
                    events: {
                        mouseOver: function () {
                            syncHover(skillChart, deltaChart, this.x);
                        }
                    }
                }
            }
        },
        series
    });
}

function formatAgeYM(age) {
    const year = Math.floor(age/84);
    const month = Math.floor((age - year * 84)/7);
    return `${year}.${String(month).padStart(2, '0')}`;
}

function buildSkillDeltaSeries(skillHistory ) {
    if (!Array.isArray(skillHistory) || skillHistory.length < 2) return [];
    const fields = getDynamicSkillFields(skillHistory);
    return fields.map(field => {
        const data = [];

        for (let i = 1; i < skillHistory.length; i++) {
            const prev = skillHistory[i - 1];
            const curr = skillHistory[i];

            const v1 = prev.skillDecode?.[field];
            const v2 = curr.skillDecode?.[field];
            if (v1 === undefined || v2 === undefined) continue;
            data.push([
                curr.age,
                Math.round((v2 - v1) * 10) / 10
            ]);
        }

        return {
            name: field,
            data,
            visible: !["Rou", "For"].includes(field)
        };
    });
}

function renderSkillDeltaLineChart(container, skillHistory) {
    const series = buildSkillDeltaSeries(skillHistory);

    deltaChart = Highcharts.chart(container, {
        chart: {
            type: "line",
            zoomType: "x",
            backgroundColor: "transparent"
        },

        title: {
            text: "Skill Change by Age (Δ)",
            style: { color: "#f0f0f0" }
        },

        xAxis: {
            title: { text: "Age" },
            labels: {
                formatter: function () {
                    return formatAgeYM(this.value);
                }
            },
        },

        yAxis: {
            title: { text: "Δ Skill" },
            plotLines: [{
                value: 0,
                color: "#888",
                width: 1
            }]
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                },
                lineWidth: 2,
                states: {
                    inactive: { opacity: 0.25 },
                    hover: { lineWidthPlus: 2 }
                },
                point: {
                    events: {
                        mouseOver: function () {
                            syncHover(deltaChart, skillChart, this.x);
                        }
                    }
                }
            }
        },

        tooltip: {
            shared: true,
            formatter: function () {
                const y = Math.floor(this.x);
                const m = Math.round((this.x - y) * 12);
                let html = formatAgeYM(this.x)+`<br>`;
                this.points.forEach(p => {
                    const sign = p.y > 0 ? "+" : "";
                    html += `<span style="color:${p.color}">●</span>
                             ${p.series.name}: ${sign}${p.y}<br/>`;
                });
                return html;
            }
        },

        legend: {
            itemStyle: { color: "#ddd" },
            itemHoverStyle: { color: "#fff" }
        },

        series
    });
}

let isSyncing = false;

function syncHover(sourceChart, targetChart, xValue) {
    if (!targetChart || isSyncing) return;

    const points = [];
    targetChart.series.forEach(series => {
        if (!series.visible) return;
        const p = series.points.find(pt => pt.x === xValue);
        if (p) points.push(p);
    });

    if (points.length) {
        isSyncing = true;
        targetChart.tooltip.refresh(points);
        targetChart.xAxis[0].drawCrosshair(null, points[0]);
        isSyncing = false;
    }
}

function formatSkillWithDelta(curr, prev) {
    if (prev === undefined) {
        return curr.toFixed(1);
    }

    const delta = Math.round((curr - prev) * 10) / 10;
    if (delta === 0) {
        return `${curr.toFixed(1)} <span style="color:#999">(0.0)</span>`;
    }

    const color = delta > 0 ? "#6ee7b7" : "#fca5a5";
    const d = Math.abs(delta) < 1e-9 ? 0 : delta;
    const deltaText = Math.abs(d).toFixed(1);
    return `${curr.toFixed(1)} <span style="color:${color}">(${deltaText})</span>`;
}
