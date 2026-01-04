// ==UserScript==
// @name         FlatMMO+ Notepad
// @namespace    com.dounford.flatmmo.notepad
// @version      1.1.0
// @description  Ingame notepad
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/550565/FlatMMO%2B%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/550565/FlatMMO%2B%20Notepad.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class NotepadPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("notepad", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.notes = {}

            //this.notes = [];
            this.userNotes = {};

            this.currentTab = '82f91393-49a7-4cda-b080-18763ed21fd3';
            this.currentUser = "";
        }
        
        onLogin() {
            this.notes = JSON.parse(localStorage.getItem("flatNotes")) || {'82f91393-49a7-4cda-b080-18763ed21fd3':{name:"New Tab", content:""}};
            this.userNotes = JSON.parse(localStorage.getItem("flatUserNotes")) || {};
            this.addStyle();
            this.addUI();

            this.switchTab(Object.keys(this.notes)[0]);
        }
        
        onMessageReceived(data) {
            if(data.startsWith("PLAYER_LOOKUP")) {
                const space = data.indexOf("~");
                const username = data.substring(14, space);
                this.currentUser = username;
                if(username in this.userNotes) {
                    document.getElementById("flatNotes-playerNotes").value = this.userNotes[username];
                } else {
                    document.getElementById("flatNotes-playerNotes").value = "";
                }
            }
        }

        addStyle() {
            const style = document.createElement("style");
            style.innerHTML = `
                #flatNotes-tabs{
                    div {
                        border: black 3px solid;
                        padding: 3px;
                        display: inline-flex;
                        align-items: center;
                        margin-right: 5px;
                        gap: 8px;
                        justify-content: flex-end;
                        align-items: center;

                        &:hover {
                            filter: brightness(75%);
                        }

                        span {
                            outline: none;
                        }
                    }
                }
                .flatNotes-close {
                    align-self: flex-start;
                    font-size: 1.3rem;
                }
                .flatNotes-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;

                    h1 {
                        margin-top: 0;
                    }
                }
                .flatNotes-currentTab {
                    background-color: var(--fmp-ui-element-active-bg, darkgray);
                }
            `
            document.head.appendChild(style);
        }

        addUI() {
            //Button to open global notes bellow inventory
            const openBtn = `<div id="openFlatNotes" onclick="open_modal('flatNotes')" class="bank-btn hover">Open Notepad</div>`;
            document.getElementById("bank-all-btn").insertAdjacentHTML("afterend", openBtn);

            //Player's notes
            const playerTextArea = `<br><textarea id="flatNotes-playerNotes" style="height: 50vh;width: -webkit-fill-available;"></textarea><br>`
            document.querySelector("#player-lookup-modal br").insertAdjacentHTML("afterend", playerTextArea)
            document.getElementById("flatNotes-playerNotes").onchange = function() {
                FlatMMOPlus.plugins.notepad.userNotes[FlatMMOPlus.plugins.notepad.currentUser] = this.value;
                FlatMMOPlus.plugins.notepad.saveUserNotes();
            }

            //Notes
            const flatNotes = `<div id="flatNotes" class="modal">
                <div class="modal-content modal-content-lg">
                    <div class="flatNotes-header"">
                        <h1>Notepad</h1>
                        <span onclick="FlatMMOPlus.plugins.notepad.closeNotes()" class="close">×</span>
                    </div>
                    <div id="flatNotes-tabs" style="display: flex;gap: 5px;">
                        <button id="flatNotes-newTab" class="hover" onclick="FlatMMOPlus.plugins.notepad.newTab()">+</button>
                    </div>
                    <textarea id="flatNotes-textArea" style="width: -webkit-fill-available;height: 500px;"></textarea>
                </div>
            </div>`
            document.getElementById("player-lookup-modal").insertAdjacentHTML("afterend", flatNotes);
            document.getElementById("flatNotes-textArea").onchange = function() {
                FlatMMOPlus.plugins.notepad.notes[FlatMMOPlus.plugins.notepad.currentTab].content = this.value;
                FlatMMOPlus.plugins.notepad.saveNotes();
            }


            //Create tabs
            Object.keys(this.notes).forEach(id=>this.newTab(this.notes[id].name, id));
        }

        closeNotes() {
            document.getElementById("flatNotes").style.display = "none";
        }

        newTab(name, id) {
            id = id || crypto.randomUUID();
            if (name === undefined) {
                name = "New Tab";
                this.notes[id] = {
                    name,
                    content: ""
                };
            }
            const tab = document.createElement("div");
            const nameSpan = document.createElement("span");
            const closeBtn = document.createElement("span");

            tab.setAttribute("data-noteid", id);
            nameSpan.innerText = name;
            nameSpan.contentEditable = "false";
            tab.addEventListener("click", function(e) {
                if(e.target.className === "close") return;
                FlatMMOPlus.plugins.notepad.switchTab(id)
            });
            tab.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                const span = this.querySelector("span");
                span.contentEditable = true;
                span.focus();
            });
            nameSpan.addEventListener("focusout", function(e) {
                this.contentEditable = "false";
                FlatMMOPlus.plugins.notepad.renameTab(id)
            });

            closeBtn.innerText = "×"
            closeBtn.className = "flatNotes-close hover";
            closeBtn.addEventListener("click", function(e) {
                FlatMMOPlus.plugins.notepad.closeTab(id)
            });

            tab.appendChild(nameSpan);
            tab.appendChild(closeBtn);

            document.getElementById("flatNotes-newTab").insertAdjacentElement("beforebegin", tab);
            this.switchTab(id);
        }

        closeTab(id) {
            const tab = document.querySelector(`[data-noteid="${id}"]`)
            tab.remove();
            delete this.notes[id];
            //At least one tab should always exist
            if(Object.keys(this.notes).length === 0) {
                this.newTab();
            }
            if(this.currentTab === id) {
                this.switchTab(Object.keys(this.notes)[0]);
            }
            this.saveNotes();
        }

        switchTab(id) {
            document.querySelector(".flatNotes-currentTab")?.classList.remove("flatNotes-currentTab");

            this.currentTab = id;
            document.querySelector(`[data-noteid="${id}"]`)?.classList.add("flatNotes-currentTab");
            document.getElementById("flatNotes-textArea").value = this.notes[id]?.content || "";
            this.saveNotes();
        }

        renameTab(id) {
            const tab = document.querySelector(`[data-noteid="${id}"] span`);
            this.notes[id].name = tab?.innerText || "New Tab";
            this.saveNotes();
        }

        saveNotes() {
            localStorage.setItem("flatNotes", JSON.stringify(this.notes));
        }
        
        saveUserNotes() {
            localStorage.setItem("flatUserNotes", JSON.stringify(this.userNotes));
        }
    }
    
    const plugin = new NotepadPlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();