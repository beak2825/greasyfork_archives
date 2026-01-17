// ==UserScript==
// @name        Search rooms with tags | Bonk.io
// @license     MIT
// @match       https://*.bonk.io/gameframe-release.html
// @grant       none
// @version     1.3
// @author      ancient_player
// @description Search for multiple rooms by seperating each roomname with commas ",". A room will match if it includes at least one of the listed terms.
// @namespace https://greasyfork.org/users/1558569
// @downloadURL https://update.greasyfork.org/scripts/562169/Search%20rooms%20with%20tags%20%7C%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/562169/Search%20rooms%20with%20tags%20%7C%20Bonkio.meta.js
// ==/UserScript==

(function () {
    // Visuals -----
    // Search input box
    let searchInput = document.createElement("input")
    searchInput.placeholder = "Filter roomnames by tags"
    searchInput.classList.add("roomlistbottombutton_dynamic", "roomlistbottombutton", "buttonShadow", "roomlistcreatewindowinput")
    searchInput.style = "right: 350; border-radius: 3px; cursor: text; background-color: rgb(210, 219, 222); color: rgb(0, 0, 0); font-size: 15px;width: 250px;"
    searchInput.title = "Match at least one tag. Separated by commas eg. winner, parkour, wdb"

    document.getElementById("roomlist").prepend(searchInput)
    document.getElementById("roomlistfilterbutton").style.width = "120px"

    // Hide rooms by lvl checkbox
    let lvlCheckbox = document.createElement("input")
    let lvlCheckboxContainer = document.createElement("div")
    lvlCheckboxContainer.style = "position: absolute;left: 180px;font-family: futurept_b1;color: #e8e8e8;font-size: 17px;"
    lvlCheckboxContainer.title = "Only show rooms joinable with your level"
    lvlCheckboxContainer.textContent = "Hide rooms outside of lvl"
    lvlCheckboxContainer.id = "lvlCheckboxFilterContainer"
    lvlCheckbox.type = "checkbox"
    lvlCheckbox.style = "margin-right: 7px;"
    lvlCheckbox.id = "lvlCheckboxFilter"

    lvlCheckboxContainer.prepend(lvlCheckbox)
    document.getElementById("roomlist").append(lvlCheckboxContainer)


    // Logic -----

    function filterRooms(calledBy, mutations) {
        if (calledBy == "observer") { // prevent updating when other changes to roomlist happen
            if (mutations.length == 1 || mutations.length == 4) {
                const node = mutations[mutations.length - 1].addedNodes[0]
                if (node.nodeType === Node.ELEMENT_NODE && (node.id == "friendsToolTip" || node.id == "friendsToolTip_list" || node.classList.contains("roomlisttablejoined"))) { // friend tooltip show OR joined room inicator
                    return;
                }
            }
        }

        roomListObserver.disconnect()

        let tags = searchInput.value.split(",").map(tag => tag.trim().toLowerCase()).filter(item => item !== "");

        let roomsContainer = document.querySelector("#roomlisttable tbody");

        let matchedRooms = [];
        let miscRooms = [];

        const playerLvl = document.getElementById("pretty_top_level").textContent == "Guest" ? -1 : parseInt(document.getElementById("pretty_top_level").textContent.split("Lv ")[1])
        const filterLVL = document.getElementById("lvlCheckboxFilter").checked

        for (const room of roomsContainer.querySelectorAll("tr[data-myid]")) {


            if(filterLVL){
              const roomLVL = room.children[4].textContent.trim()
              let maxLVL = 999;
              let minLVL = 0;
              if(roomLVL != "Any level"){
                if(roomLVL.includes("-")){
                  maxLVL = parseInt(roomLVL.split("-")[1])
                  minLVL = parseInt(roomLVL.split("-")[0])
                } else if (roomLVL.includes("<")){
                  maxLVL = parseInt(roomLVL.split("<")[1])
                } else if (roomLVL.includes(">")){
                  maxLVL = parseInt(roomLVL.split(">")[1])
                }

                if(playerLvl > maxLVL || playerLvl < minLVL){
                  continue;
                }
              }
            }


            const roomName = room.children[0].textContent.trim().toLowerCase()

            if (tags.some(tag => roomName.includes(tag))) {
                matchedRooms.push(room);
            } else {
                miscRooms.push(room)
            }

            room.style.opacity = 0;
            room.style.transition = "opacity 0.15s"
            room.style.borderTop = ""

            if (calledBy == "input") {
                room.style.opacity = 1;
            } else {
                setTimeout(() => {
                    room.style.opacity = 1;
                }, 100)
            }
        }

        // Sort rooms by distance
        matchedRooms.sort((a, b) => { return parseInt(a.dataset.myid) - parseInt(b.dataset.myid); });
        miscRooms.sort((a, b) => { return parseInt(a.dataset.myid) - parseInt(b.dataset.myid); });

        // matched/misc room divider
        if (miscRooms.length > 0 && matchedRooms.length > 0) {
            let divider = document.createElement("tr")
            divider.style = "opacity: 0; transition: opacity 0.15s; box-sizing: border-box;height: 3px;background-color: grey;"
            if (calledBy == "observer") { setTimeout(() => { divider.style.opacity = 1; }, 100) } else { divider.style.opacity = 1; }
            let dividerTr = document.createElement("td")
            dividerTr.colSpan = 7
            dividerTr.style = "height: inherit; width: 100%;"
            divider.appendChild(dividerTr)

            miscRooms.unshift(divider)
        }

        roomsContainer.innerHTML = ""
        matchedRooms.forEach(room => roomsContainer.appendChild(room));
        miscRooms.forEach(room => roomsContainer.appendChild(room));


        let roomnameTitle = document.getElementById("roomlisttableheader_roomname")
        roomnameTitle.textContent = tags.length > 0 ? `ROOM NAME (${matchedRooms.length}/${matchedRooms.length + miscRooms.length} rooms match)` : `ROOM NAME (${miscRooms.length} rooms)`

        if (tags.length > 0 && matchedRooms.length == 0 && miscRooms.length > 0) {
            searchInput.style.backgroundColor = "rgb(211, 181, 181)" // None matched (red)
        } else {
            searchInput.style.backgroundColor = "rgb(210, 219, 222)" // Matches (grey)
        }

        roomListObserver.observe(document.querySelector("#roomlisttable"), { childList: true, subtree: true });
    }

    // Input & Events -----

    searchInput.addEventListener("input", () => { filterRooms("input") });
    lvlCheckbox.addEventListener("input", () => {
      document.getElementById("roomlistrefreshbutton").click()
      filterRooms("input")
    });

    const roomListObserver = new MutationObserver((mutations) => { filterRooms("observer", mutations) });
    roomListObserver.observe(document.querySelector("#roomlisttable "), { childList: true, subtree: true });
})();