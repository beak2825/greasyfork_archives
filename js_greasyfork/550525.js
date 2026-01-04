// ==UserScript==
// @name         College Retro Bowl++
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  College Retro Bowl Cracked Access.
// @license      Ashy Birds
// @match        https://game316009.konggames.com/gamez/0031/6009/live/index.html
// @match        https://retrobowl.org/
// @match        https://retro-bowl.net/
// @match        https://retrobowl.school/games/retro-bowl/
// @icon         https://tse2.mm.bing.net/th/id/OIP.kmS6sQBtOtl-fGJJsQkVUwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550525/College%20Retro%20Bowl%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/550525/College%20Retro%20Bowl%2B%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const darkThemeCSS = `
        body {
            background-color: #121212;
            color: #f0f0f0;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .section {
            background-color: #1e1e1e;
            border: 1px solid #444;
            border-radius: 10px;
            padding: 15px;
            margin: 20px auto;
            max-width: 700px;
        }
        .editTitle {
            font-size: 20px;
            margin-bottom: 10px;
            text-decoration: underline;
        }
        .buttonContainer {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }
        button {
            background-color: #333;
            color: #f0f0f0;
            border: 1px solid #555;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
        }
        input, select {
            background-color: #222;
            color: #f0f0f0;
            border: 1px solid #555;
            border-radius: 3px;
            padding: 5px;
            width: 80px;
            margin-right: 10px;
        }
        label {
            cursor: pointer;
        }
        #inspectSaveDiv {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #121212;
            color: #f0f0f0;
            padding: 10px;
            box-sizing: border-box;
            z-index: 100000;
            display: flex;
            flex-direction: column;
        }
        #inspectSaveTextArea {
            flex-grow: 1;
            background-color: #222;
            color: #f0f0f0;
            border: 1px solid #555;
            border-radius: 5px;
            font-family: monospace;
            font-size: 14px;
            resize: none;
            padding: 10px;
            width: 100%;
            box-sizing: border-box;
            overflow: auto;
        }
        #inspectSaveControls {
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #warningText {
            color: #f44336;
            font-weight: bold;
            flex-grow: 1;
            user-select: none;
        }
    `;

    function openCollegeRetroBowlPopup() {
        const popupWindow = window.open('', 'CollegeRetroBowlPopup', 'width=900,height=900');
        if (!popupWindow) {
            alert("Failed to open popup window. Please check your browser's popup settings.");
            return;
        }

        popupWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <title>College Retro Bowl++</title>
                <style>${darkThemeCSS}</style>
            </head>
            <body>
                <div>
                    <div class="title">College Retro Bowl++</div>

                    <div class="section">
                        <div class="editTitle">Team Score Editor</div>
                        <label><input type="checkbox" id="scoreNotify" checked> Enable Notifications</label><br><br>
                        <div>
                            <strong>Away Team:</strong>
                            <input type="number" id="awayInput" placeholder="Amount" />
                            <button onclick="changeScore(0, 1)">Add</button>
                            <button onclick="changeScore(0, -1)">Subtract</button>
                        </div>
                        <div style="margin-top:10px;">
                            <strong>Home Team:</strong>
                            <input type="number" id="homeInput" placeholder="Amount" />
                            <button onclick="changeScore(1, 1)">Add</button>
                            <button onclick="changeScore(1, -1)">Subtract</button>
                        </div>
                    </div>

                    <div class="section">
                        <div class="editTitle">Game Data Modifiers</div>
                        <div class="buttonContainer">
                            <button onclick="editCredits()">Set Credits</button>
                            <button onclick="editSalary()">Set Salary Cap</button>
                            <button onclick="editDraft()">Set Draft Picks</button>
                            <button onclick="editStadium()">Set Stadium Level</button>
                            <button onclick="editTraining()">Set Training Level</button>
                            <button onclick="editRehab()">Set Rehab Level</button>
                            <button onclick="showInfo()">Client Info</button>
                        </div>
                    </div>

                    <div class="section">
                        <div class="editTitle">Save File Manager</div>
                        <div class="buttonContainer">
                            <button id="exportBtn">Export Save</button>
                            <button id="importBtn">Import Save</button>
                            <input type="file" id="fileInput" style="display:none" accept=".txt,.ini,.sav"/>
                            <button onclick="inspectSave()">Inspect Save</button>
                        </div>
                    </div>
                </div>

                <script>
                    function getSaveData() {
                        return window.opener.localStorage.getItem('RetroBowl.0.savedata.ini');
                    }

                    function setSaveData(newData) {
                        window.opener.localStorage.setItem('RetroBowl.0.savedata.ini', newData);
                    }

                    function changeScore(teamIndex, operation) {
                        const inputId = teamIndex === 0 ? 'awayInput' : 'homeInput';
                        const notify = document.getElementById('scoreNotify').checked;
                        const input = document.getElementById(inputId).value;
                        const amount = parseInt(input);
                        if (isNaN(amount)) {
                            alert("Enter a valid number.");
                            return;
                        }

                        try {
                            const we = window.opener?._xn?._WE?.[100263];
                            if (we?.gmlteam_score) {
                                let scores = we.gmlteam_score;
                                scores[teamIndex] = Math.max(0, (scores[teamIndex] || 0) + (amount * operation));
                                if (notify) alert("New score: " + scores[teamIndex]);
                            } else {
                                alert("Score variable not found.");
                            }
                        } catch (e) {
                            alert("Error updating score: " + e.message);
                        }
                    }

                    function editData(fieldRegex, replacementValue) {
                        let save = getSaveData();
                        if (!save) return alert("Save data not found!");
                        let newSave = save.replace(fieldRegex, replacementValue);
                        setSaveData(newSave);
                        alert("Modified. Reloading...");
                        window.opener.location.reload();
                    }

                    function editCredits() {
                        let val = prompt("Credits:");
                        if (!isNaN(val) && val !== null) editData(/coach_credit="\\d+"/g, 'coach_credit="' + val + '"');
                    }

                    function editSalary() {
                        let val = prompt("Salary cap:");
                        if (!isNaN(val) && val !== null) editData(/salary_cap="\\d+"/, 'salary_cap="' + val + '"');
                    }

                    function editDraft() {
                        let val = prompt("1st round draft picks:");
                        if (!isNaN(val) && val !== null) editData(/draft_picks_0="\\d+"/, 'draft_picks_0="' + val + '"');
                    }

                    function editStadium() {
                        let val = prompt("Stadium level (0-10):");
                        if (!isNaN(val) && val !== null) {
                            editData(/facility_upgraded_stadium="\\d+"/, 'facility_upgraded_stadium="' + val + '"');
                            editData(/facility_stadium="\\d+"/, 'facility_stadium="' + val + '"');
                        }
                    }

                    function editTraining() {
                        let val = prompt("Training level (0-10):");
                        if (!isNaN(val) && val !== null) {
                            editData(/facility_upgraded_training="\\d+"/, 'facility_upgraded_training="' + val + '"');
                            editData(/facility_training="\\d+"/, 'facility_training="' + val + '"');
                        }
                    }

                    function editRehab() {
                        let val = prompt("Rehab level (0-10):");
                        if (!isNaN(val) && val !== null) {
                            editData(/facility_upgraded_rehab="\\d+"/, 'facility_upgraded_rehab="' + val + '"');
                            editData(/facility_rehab="\\d+"/, 'facility_rehab="' + val + '"');
                        }
                    }

                    function exportSave() {
                        const save = getSaveData();
                        if (!save) {
                            alert("No save data found.");
                            return;
                        }
                        const blob = new Blob([save], {type: "text/plain"});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = "retroBowlSave.txt";
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }, 100);
                    }

                    function importSave() {
                        const fileInput = document.getElementById('fileInput');
                        fileInput.click();
                    }

                    document.getElementById('fileInput').addEventListener('change', function(event) {
                        const file = event.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const content = e.target.result;
                            setSaveData(content);
                            alert("Save imported. Reloading...");
                            window.opener.location.reload();
                        };
                        reader.readAsText(file);
                    });

                    function inspectSave() {
                        const existingDiv = document.getElementById('inspectSaveDiv');
                        if (existingDiv) return;

                        const save = getSaveData();
                        if (!save) {
                            alert("No save data found.");
                            return;
                        }

                        const inspectDiv = document.createElement('div');
                        inspectDiv.id = 'inspectSaveDiv';

                        const textArea = document.createElement('textarea');
                        textArea.id = 'inspectSaveTextArea';
                        textArea.value = save;
                        textArea.spellcheck = false;

                        const controls = document.createElement('div');
                        controls.id = 'inspectSaveControls';

                        const closeBtn = document.createElement('button');
                        closeBtn.textContent = 'Close';
                        closeBtn.onclick = () => {
                            inspectDiv.remove();
                        };

                        const saveBtn = document.createElement('button');
                        saveBtn.textContent = 'Save';
                        saveBtn.onclick = () => {
                            const newSave = textArea.value;
                            setSaveData(newSave);
                            alert('Save data updated. Reloading...');
                            window.opener.location.reload();
                            inspectDiv.remove();
                        };

                        const warningText = document.createElement('div');
                        warningText.id = 'warningText';
                        warningText.textContent = "DO NOT USE UNLESS YOU HAVE A SAVE FILE/KNOW WHAT YOU'RE DOING";

                        controls.appendChild(closeBtn);
                        controls.appendChild(saveBtn);
                        controls.appendChild(warningText);

                        inspectDiv.appendChild(textArea);
                        inspectDiv.appendChild(controls);

                        document.body.appendChild(inspectDiv);
                    }

                    function showInfo() {
                        alert("College Retro Bowl++ v1.2\\nTampermonkey script by Ashy Birds");
                    }

                    document.getElementById('exportBtn').addEventListener('click', exportSave);
                    document.getElementById('importBtn').addEventListener('click', importSave);
                </script>
            </body>
            </html>
        `);

        popupWindow.document.close();
    }

    function addCollegeRetroBowlButton() {
        const btn = document.createElement('button');
        btn.textContent = 'College Retro Bowl++';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '10000';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#222';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'grab';
        btn.style.userSelect = 'none';

        let isDragging = false;
        let offsetX, offsetY;

        btn.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - btn.getBoundingClientRect().left;
            offsetY = e.clientY - btn.getBoundingClientRect().top;
            btn.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                btn.style.cursor = 'grab';
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;

                const btnRect = btn.getBoundingClientRect();
                const minX = 0;
                const minY = 0;
                const maxX = window.innerWidth - btnRect.width;
                const maxY = window.innerHeight - btnRect.height;

                if (x < minX) x = minX;
                if (y < minY) y = minY;
                if (x > maxX) x = maxX;
                if (y > maxY) y = maxY;

                btn.style.left = x + 'px';
                btn.style.top = y + 'px';
                btn.style.right = 'auto';
                btn.style.bottom = 'auto';
                btn.style.position = 'fixed';
            }
        });

        btn.addEventListener('click', () => {
            if (!isDragging) openCollegeRetroBowlPopup();
        });

        document.body.appendChild(btn);
    }

    addCollegeRetroBowlButton();
})();
