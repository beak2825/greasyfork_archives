// ==UserScript==
// @name         人人种子认领优化
// @icon      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cGF0aCBmaWxsPSIjYjU4MzYwIiBkPSJNNDQuNCA5LjNjLTMgMy43LTQuMyA3LjEtMTIuMiAxMS42Yy0yLjggMS42LTMuMiA1LTQuMyA0LjhDMjEuNiAyNC40IDcuNSAyMyA3LjUgMjNMNiAzMS4yYy0uOCAxMS4zIDE4LjUgNy40IDIyLjkgNS40YzIuNy0xLjIgNC41LTEuNCA1LjgtMy43YzEuMi0yLjIgMy4zLjUgMTUuMy0xOS45em0xLjggMjIuMmw5LjItNy42bDMgMTEuNmwtOS4zIDIuN3oiLz48cGF0aCBmaWxsPSIjZDZhNTdjIiBkPSJNNTAuNSA3LjFMMzUuNiAxNmMtLjkgNC4yLjkgNS44IDEuMiA3LjRjLjIuNy0uOCAyLjQtMS40IDMuM2MtMS4yIDIgMS44IDIuNCAyLjcgMS45YzEgMS40LjcgMi4yIDEuNSAxLjZjLjctLjUgMi4xIDIuMyAxLjkgMy4xbDEwLjgtMS41eiIvPjxwYXRoIGZpbGw9IiM1OTQ2NDAiIGQ9Ik00MyAyLjljMTItMy4zIDE2LjQgNy4zIDE2LjcgMTUuNGMuMiA0LjMtMi44IDguNC00LjggMTAuMWwtOS4zLTE2LjhjLTEuOS0uMy04LjQgNS40LTkuOSA0LjRjLTQtMi43LjItMTEuMSA3LjMtMTMuMSIvPjxwYXRoIGZpbGw9IiNlZDRjNWMiIGQ9Im00MS42IDMuOWw2LjEgMTJjLS4zIDEtLjggMi40LS41IDQuMmMyLjEgMTIuNCA0LjggNy45IDguNCAyLjZjMS0xLjUgMS41LTMuNyAxLjUtNC44bDIuOS0xLjFjMS0uNC4yLTMuNS0uOC0zTDU2IDE1Yy0uOC0uOS01LjMtMS45LTYuNC0xLjRMNDQgMi42Yy0uNi0xLjMtMy0uNC0yLjQgMS4zIi8+PHBhdGggZmlsbD0iI2Q2YTU3YyIgZD0ibTEyLjggNmwxNC43IDEwYy45IDQuMi0uOSA1LjgtMS4yIDcuNGMtLjIuNy44IDIuNCAxLjQgMy4zYzEuMiAyLTEuOCAyLjQtMi43IDEuOWMtMSAxLjQtLjcgMi4yLTEuNSAxLjZjLS43LS41LTIuMyAyLjQtMS45IDMuMWMuNC42LS40LjgtMS4yLjJjLS45IDMuNC0yLjggMi43LTYuOSAxLjJDNC45IDMxLjUgMTIuOCA2IDEyLjggNiIvPjxwYXRoIGZpbGw9IiM1OTQ2NDAiIGQ9Ik0yMC4xIDIuOUM4LjItLjQgMy44IDEwLjIgMy41IDE4LjNjLS4yIDQuMyAxLjEgNy40IDMuMiA5LjJsMS40LS41bDkuNS0xNS4zYzEuOS0uMyA4LjUgNS40IDkuOSA0LjRjMy45LTIuOC0uMi0xMS4yLTcuNC0xMy4yIi8+PHBhdGggZmlsbD0iIzQyYWRlMiIgZD0ibTE5LjEgMi42bC01LjYgMTFjLTEuMS0uNS01LjUuNS02LjQgMS40TDQgMTMuOGMtLjktLjQtMS44IDIuNi0uOCAzbDIuOSAxLjFjLjEgMS4xLjUgMy4zIDEuNSA0LjhjMy42IDUuMyA2LjMgOS45IDguNC0yLjZjLjMtMS44LS4yLTMuMi0uNS00LjJsNi0xMi4xYy43LTEuMy0xLjYtMi40LTIuNC0xLjIiLz48cGF0aCBmaWxsPSIjZThlOGU4IiBkPSJtMTUuNiAzNC44bC0xLjgtMTAuNmMtLjItMS40LTIuOS0uOS0yLjYuNUwxMyAzNS4zeiIvPjxwYXRoIGZpbGw9IiM0MmFkZTIiIGQ9Ik0xNy40IDYyUzIxIDU0IDIxIDQ4LjRjMC04LjMtNi4xLTEwLjktMTAuNC0xMi4zYy00LjEtMS4zLTQuNi01LTQuNi01Yy0xIDAtNi4yIDYuOC0zIDE2LjhjMi41IDcuOS0uNCAxNC0uNCAxNGgxNC44eiIvPjxwYXRoIGZpbGw9IiNiNTgzNjAiIGQ9Ik00LjggNjJoNi41czQuOS00LjggNC45LTEzLjNjMC0xMi4yLTguMi0xMi45LTEwLjctMTAuNGMtMy4xIDMuNC0xLjQgNi43LjMgMTMuNWMxIDQtMSAxMC4yLTEgMTAuMiIvPjxwYXRoIGZpbGw9IiNlZDRjNWMiIGQ9Ik00Ni41IDYycy0zLjYtOC0zLjYtMTMuNmMwLTguMyA2LjEtMTAuOSAxMC40LTEyLjNjNC4xLTEuMyA0LjYtNSA0LjYtNWMxIDAgNi4yIDYuOCAzIDE2LjhjLTIuNSA3LjkuNCAxNCAuNCAxNEg0Ni41eiIvPjxwYXRoIGZpbGw9IiNiNTgzNjAiIGQ9Ik01OS4xIDYyaC02LjVzLTQuOS00LjgtNC45LTEzLjNjMC0xMi4yIDguMi0xMi45IDEwLjctMTAuNGMzLjIgMy40IDEuNSA2LjctLjIgMTMuNWMtMSA0IC45IDEwLjIuOSAxMC4yIi8+PHBhdGggZmlsbD0iIzNlNDM0NyIgZD0iTTQxLjcgMzIuOXMzLjctMS45IDcuMy00LjhjLjUtLjQuNi0zLjggNC4yLTYuMWMyLjEtMS4zIDMuMi4zIDQtLjFjLjktLjQgMi4zIDAgMi4zIDBsLTYuMyAxMC43eiIgb3BhY2l0eT0iMC4zIi8+PHBhdGggZmlsbD0iI2Q2YTU3YyIgZD0iTTYwLjcgMjMuMWMtMS41LTMtNC45LjEtNC45LjFzLS44LTIuMi0zLjEtLjNjLTIuNyAyLjItMi4xIDQuNy0zLjMgNS45Yy0yLjcgMi01LjYgMy45LTEyLjMgNS4zYy0zLjIuNi00LjUgMy43LTUuNSAzLjJjLTUuNi0zLjMtMTAuNiAxLjYtMTUuNCAwYy0xMC4xLTMuNS0xMi45IDEuNi0xMi43IDYuOWMuMiAzLjggNC44IDUuOCA4LjMgNi42YzguMyAyLjEgMTQuMS0yLjYgMTguOS0zLjFjMi45LS4zIDMuNS40IDUuNC0xLjRjMS43LTEuNyAyLjkgMS4yIDE3LjgtMTEuOGMwIDAgMi4xLjIgNi41LTMuNWMyLTEuNyAyLjItNC4zLjMtNy45Ii8+PHBhdGggZmlsbD0iI2I1ODM2MCIgZD0iTTI1LjEgNDNzNC45LjcgNy42LTZjLTQuNiA1LjYtNy42IDYtNy42IDYiLz48cGF0aCBmaWxsPSIjM2U0MzQ3IiBkPSJNMzIuMyA0Ny42cy02LjUtMi0xMi43LTguN2MtMS4xLTEuMi0uNy0zLjQtMy42LTUuNGwtMy4xLjNjLS42LS42LTIuNy0zLjItNC42LTEuMmMtMS44IDEuOC0yLjYgNi42LTEuMiA4LjRjLjggMSA3IDUgNy40IDUuNWM0LjcgNS43IDUuMyA5LjQgNS4zIDkuNHMuOC0yLjIgMS4yLTUuMXoiIG9wYWNpdHk9IjAuMyIvPjxwYXRoIGZpbGw9IiNkNmE1N2MiIGQ9Ik02MC45IDQxLjljLTIuMy01LjgtNy45LTcuMy0xMy4yLS4zYy0zLjEgNC4xLTkuNyAyLjQtMTMuMiA3LjdjLTIuMi0zLjQtNy4zLTItMTUuNC05LjZjMCAwLS4yLTQuMS0zLjEtNi4yYy0yLTEuNS0zLjEuMy0zLjEuM3MtMy40LTMuMS00LjktLjFjLTEuOCAzLjYtMS45IDYuNS41IDcuOWM0LjEgMi41IDYuNSAyLjggNi41IDIuOGMxMi44IDE0LjUgMTMuOCAxMi4xIDE1LjUgMTMuNGMyLjkgMi41IDMuOCAyLjEgOS42LjRjNC42LTEuMyAxMS42LTEuMSAxNy45LTcuMmMyLjQtMi42IDQuMy01LjYgMi45LTkuMSIvPjxwYXRoIGZpbGw9IiNiNTgzNjAiIGQ9Ik00Ni45IDQyLjdzNi4zIDUuMyAxMC4zIDQuMmMtMy43IDItOC4zLS42LTEwLjMtNC4yTTQ0IDUwLjFzLTMuNSAzLjYtOS41LS4xYzYuOSAxLjcgOS41LjEgOS41LjEiLz48cGF0aCBmaWxsPSIjNjY0ZTI3IiBkPSJNNDAuOSAyMi4zYy4zIDEuMS0uMSAyLjItLjkgMi40cy0xLjItLjYtMS42LTEuN2MtLjMtMS4yIDIuMi0xLjggMi41LS43bS0xOC4yIDBjLS4zIDEuMS4xIDIuMi45IDIuNHMxLjItLjYgMS42LTEuN2MuMi0xLjItMi4yLTEuOC0yLjUtLjdtLS40IDcuNXMtMS41IDEuNy0xLjQgMi45YzAgMC0xLjgtMS40LTEuMi0yLjRjLjUtMSAyLjYtLjUgMi42LS41bTE4LjUgMHMxLjUgMS43IDEuNCAyLjljMCAwIDEuOC0xLjQgMS4yLTIuNGMtLjQtMS0yLjYtLjUtMi42LS41Ii8+PC9zdmc+
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  计算奖励积分，优化认领流程
// @author       leo_lin
// @license MIT
// @match        https://audiences.me/claim.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550594/%E4%BA%BA%E4%BA%BA%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/550594/%E4%BA%BA%E4%BA%BA%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 关键词倍数定义
    const MULTIPLIERS = [
        { keyword: 'adweb', multiplier: 50 },
        { keyword: 'remux', multiplier: 40 },
        { keyword: 'x264', multiplier: 30 },
        { keyword: '', multiplier: 20 } // 默认倍数
    ];

    let threshold = localStorage.getItem('threshold') || 3000; // 默认阈值 3000
    let totalHighPoints = 0;
    let totalHigh = 0;

    function calculatePoints(sizeGB, name) {
        let multiplier = MULTIPLIERS.find(m => name.toLowerCase().includes(m.keyword))?.multiplier || 20;
        return parseFloat((sizeGB * multiplier).toFixed(1));
    }

    function updateTable() {
        document.querySelectorAll('table.main tr').forEach(row => {
            let cells = row.children;
            if (cells.length < 14) return;

            let torrentId = cells[1].textContent.trim();

            let name = cells[3].textContent.trim();
            let sizeText = cells[4].textContent.trim();
            let sizeGB = 0;
            if(sizeText.indexOf('MB') != -1){
                sizeGB = parseFloat(sizeText.replace('MB', '').trim())/1024;
            }
            else if(sizeText.indexOf('GB') != -1){
                sizeGB = parseFloat(sizeText.replace('GB', '').trim());
            }
            else if(sizeText.indexOf('TB') != -1){
                sizeGB = parseFloat(sizeText.replace('TB', '').trim())*1024;
            }
            let points = calculatePoints(sizeGB, name);

            let monGetText = cells[11].textContent.trim();
            let monGet = parseFloat(monGetText);
            let numb = 4-Math.round((monGet-points)/points*100/5);

            let rewardCell = document.createElement('td');
            let numbCell = document.createElement('td');
            let claimCell = document.createElement('td');
            rewardCell.align="center";
            numbCell.align="center";
            claimCell.align="center";

            if(row.rowIndex==0){
                rewardCell.className="colhead";
                numbCell.className="colhead";
                claimCell.className="colhead";
                rewardCell.textContent = "基础爆米花";
                numbCell.textContent = "上月认领数";
                claimCell.textContent = "认领操作";
            }
            else{
                rewardCell.textContent = points;
                if (points > 6000) {
                    rewardCell.innerHTML += '👑🔥';
                }
                else if (points > 5500) {
                    rewardCell.innerHTML += '👑';
                }
                else if (points > 5000) {
                    rewardCell.innerHTML += '🔥';
                }
                numbCell.textContent = numb>10 ? "" : numb;
                if (points < threshold) {
                    claimCell.innerHTML = `<span id="claim_block_${torrentId}"><a href="javascript:claim('del','${torrentId}','claim_block_${torrentId}');">取消认领</a></span>`;
                }
            }

            row.appendChild(rewardCell);
            row.appendChild(numbCell);
            row.appendChild(claimCell);

            // 统计高于阈值的积分总和
            if (points > threshold) {
                totalHighPoints += points;
                totalHigh++;
                let extra = Math.floor((points - threshold) / 500);
                let color = `hsl(${Math.max(0, 120 - extra * 15)}, 100%, 85%)`;
                row.style.backgroundColor = color;
            }
        });
        document.getElementById('totalHighPoints').textContent = `高于阈值的种子数: ${totalHigh}，积分总和: ${totalHighPoints}`;
    }

    function addFloatingWindow() {

        let div = document.createElement('div');
        div.innerHTML = `
            <div id="setThreshold" style="position:fixed; bottom:10px; right:10px; background:white; padding:10px; border:1px solid #ccc;">
                <label>积分阈值: <input type="number" id="thresholdInput" value="${threshold}" style="width: 80px;"></label>
                <button id="saveThreshold">保存</button>
                <p id="totalHighPoints"></p>
            </div>
        `;
        document.body.appendChild(div);

        document.getElementById('saveThreshold').addEventListener('click', () => {
            threshold = document.getElementById('thresholdInput').value;
            localStorage.setItem('threshold', threshold);
            location.reload();
        });
    }

    function modifyClaimFunction() {
        unsafeWindow.claim = function(action, torrentid, blockid) {
            let url = `claim.php?act=${action}&tid=${torrentid}`;
            fetch(url).then(res => res.json()).then(obj => {
                let status = action === 'add' ? 'del' : 'add';
                let inner = status === 'del' ? `<a href="javascript:claim('del','${torrentid}','claim_block_${torrentid}');">取消认领</a>` : '';
                document.getElementById(`claim_block_${torrentid}`).innerHTML = inner;
            });
        };
    }
     // 初始化
    window.addEventListener('load', function() {
        // 添加自动按钮
        addFloatingWindow();
        updateTable();
        modifyClaimFunction();

    });
})();
