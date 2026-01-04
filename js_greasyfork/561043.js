// ==UserScript==
// @name         NJUST快速教评
// @namespace    https://github.com/Embers-of-the-Fire
// @version      0.1.0
// @description  这是一个快速评教工具，用于南京理工大学综合教务管理系统。
// @author       Embers-of-the-Fire
// @match        http://bkjw.njust.edu.cn/njlgdx/xspj/xspj_edit.do*
// @match        https://bkjw.njust.edu.cn/njlgdx/xspj/xspj_edit.do*
// @icon         https://www.njust.edu.cn/_upload/tpl/07/7d/1917/template1917/favicon.ico
// @license      AGPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561043/NJUST%E5%BF%AB%E9%80%9F%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/561043/NJUST%E5%BF%AB%E9%80%9F%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==


(function editMain() {
    'use strict';

function fastUpload() {
    const pj06xhs = document.getElementsByName("pj06xh");

    let flag = true;
    for (let i = 0; i < pj06xhs.length; i++) {
        if (jQuery("input[name='pj0601id_"+ pj06xhs[i].value+"']:checked").length == 0) {
            flag = false;
            break;
        }
    }
    if (!flag) {
        alert("评价的每项指标都必须选择!");
            return false;
        }
        flag = false;
        let minZb = 0;//取到最小指标数
        for (let i = 0; i < pj06xhs.length; i++) {
            const pj0601s = document.getElementsByName("pj0601id_"+ pj06xhs[i].value);
            minZb = pj0601s.length;
            break;
        }

        for(let j = 0; j < minZb; j++) {
            let _ind = 0;
            for (let i = 0; i < pj06xhs.length; i++) {
                const pj0601s = document.getElementsByName("pj0601id_"+ pj06xhs[i].value);
                if (j < pj0601s.length && pj0601s[j].checked) {
                    _ind++;
                }
            }
        if (_ind == pj06xhs.length) {
            flag = true;
            break;
        }
    }

    if(flag){
        alert("请不要选相同一项！");
        return false;
    }

    document.getElementById("issubmit").value = "1";

    document.getElementById("Form1").submit();
}

    const panel = document.querySelector("div.Nsb_pw");
    const actionsPanelTableBase = panel.querySelector("table:nth-child(1) tbody");
    const actionsPanelTr = document.createElement("tr");
    actionsPanelTableBase.appendChild(actionsPanelTr);
    const actionsPanelTd = document.createElement("td");
    actionsPanelTr.appendChild(actionsPanelTd);
    const actionsPanelBase = document.createElement("div");
    actionsPanelTd.appendChild(actionsPanelBase);
    actionsPanelBase.style.border = "2px solid red";
    actionsPanelBase.style.padding = "4px";
    const actionsPanel = document.createElement("div");
    actionsPanel.style.gap = "10px";
    actionsPanel.style.display = "flex";
    actionsPanel.style["align-items"] = "center";
    actionsPanelBase.appendChild(actionsPanel);
    const actionsPanelTitle = document.createElement("span");
    actionsPanel.appendChild(actionsPanelTitle);

    const quickActionsPanel = document.createElement("div");
    quickActionsPanel.style["margin-top"] = "10px";
    quickActionsPanel.style.gap = "10px";
    quickActionsPanel.style.display = "flex";
    quickActionsPanel.style["align-items"] = "center";
    actionsPanelBase.appendChild(quickActionsPanel);
    const quickActionsPanelTitle = document.createElement("span");
    quickActionsPanel.appendChild(quickActionsPanelTitle);
    quickActionsPanelTitle.innerText = "快速访问";
    const quickSave = document.createElement("input");
    quickSave.type = "button";
    quickSave.name = "bc";
    quickSave.id = "bc";
    quickSave.value = "保  存";
    quickSave.className = "button";
    quickSave.onclick = () => saveData(quickSave, '0');
    quickActionsPanel.appendChild(quickSave);
    const quickUpload = document.createElement("input");
    quickUpload.type = "button";
    quickUpload.name = "tj";
    quickUpload.id = "tj";
    quickUpload.value = "提  交";
    quickUpload.className = "button";
    quickUpload.onclick = () => saveData(quickUpload, '1');
    quickActionsPanel.appendChild(quickUpload);
    const quickClose = document.createElement("input");
    quickClose.type = "button";
    quickClose.name = "qx";
    quickClose.id = "qx";
    quickClose.value = "关  闭";
    quickClose.className = "button";
    quickClose.onclick = () => window.close();
    quickActionsPanel.appendChild(quickClose);
    const quickNoCheckUpload = document.createElement("input");
    quickNoCheckUpload.type = "button";
    quickNoCheckUpload.name = "tju";
    quickNoCheckUpload.id = "tju";
    quickNoCheckUpload.value = "快速提交";
    quickNoCheckUpload.className = "button";
    quickNoCheckUpload.onclick = () => fastUpload();
    quickActionsPanel.appendChild(quickNoCheckUpload);

    const allScores = [];
    const table = document.querySelectorAll("table.Nsb_table tbody tr td");
    let uniqueId = 0;
    for (const row of table) {
        if (row.querySelector('input[type=radio]') === null) continue;
        const scores = [];
        for (const input of row.querySelectorAll('input[type=radio]')) {
            scores.push([uniqueId, input, Number.parseFloat(document.querySelector(`input[name="${input.name.replace("id", "fz")}_${input.value}"]`).value)]);
            uniqueId += 1;
        }
        scores.sort((a, b) => a - b);
        allScores.push(scores);
    }
    actionsPanelTitle.innerText = `工具栏 | 共${allScores.length}条`;

    function createSelectButton(name, lowest, normal) {
        const minMaxScore = allScores.toSorted((a, b) => a[0][2] - b[0][2])[0];
        const minMaxScoreToSelect = minMaxScore[lowest];
        const maxScore = allScores.toSorted((a, b) => a[0][2] - b[0][2]).map((item, idx) => idx == 0 ? item[lowest][2] : item[normal][2]).reduce((r, x) => r + x);
        const allMaxBtn = document.createElement("input");
        allMaxBtn.type = "button";
        allMaxBtn.name = "max";
        allMaxBtn.id = "max";
        allMaxBtn.value = `${name} | ${maxScore.toFixed(1)}`;
        allMaxBtn.className = "button";
        allMaxBtn.onclick = () => {
            for (const row of allScores) {
                let clicked = false;
                for (const [idx, btn, _] of row) {
                    if (idx == minMaxScoreToSelect[0]) {
                        btn.click();
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) row[normal][1].click();
            }
        };
        actionsPanel.appendChild(allMaxBtn);
    }

    for (let i = 0; i < 4; i++) {
        createSelectButton(`L${i}`, i + 1, i);
    }
})();
