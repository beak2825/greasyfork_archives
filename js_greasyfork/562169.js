// ==UserScript==
// @name        Search roomnames with tags
// @license     MIT
// @match       https://*.bonk.io/gameframe-release.html
// @grant       none
// @version     1.2
// @author      ancient_player
// @description Search for multiple rooms by seperating each roomname with commas ",". A room will match if it includes at least one of the listed terms.
// @namespace https://greasyfork.org/users/1558569
// @downloadURL https://update.greasyfork.org/scripts/562169/Search%20roomnames%20with%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/562169/Search%20roomnames%20with%20tags.meta.js
// ==/UserScript==

(function () {
    // Visuals -----

    let searchInput = document.createElement("input")
    searchInput.placeholder = "Filter roomnames by tags"
    searchInput.classList.add("roomlistbottombutton_dynamic", "roomlistbottombutton", "buttonShadow", "roomlistcreatewindowinput")
    searchInput.style = "right: 350; border-radius: 3px; cursor: text; background-color: rgb(210, 219, 222); color: rgb(0, 0, 0); font-size: 15px;width: 250px;"
    searchInput.title = "Match at least one tag. Separated by commas eg. winner, parkour, wdb"

    document.getElementById("roomlist").prepend(searchInput)
    document.getElementById("roomlistfilterbutton").style.width = "120px"

    // Logic -----

    function filterRooms(calledBy, mutations) {
        if (calledBy == "observer") { // prevent updating when other changes to roomlist happen
            if (mutations.length == 1) {
                const node = mutations[0].addedNodes[0]
                if (node.nodeType === Node.ELEMENT_NODE && (node.id == "friendsToolTip" || node.classList.contains("roomlisttablejoined"))) { // friend tooltip show OR joined room inicator
                    return;
                }
            }
        }

        roomListObserver.disconnect()

        let tags = searchInput.value.split(",").map(tag => tag.trim().toLowerCase()).filter(item => item !== "");

        let roomsContainer = document.querySelector("#roomlisttable tbody");

        let matchedRooms = [];
        let miscRooms = [];

        for (const room of roomsContainer.querySelectorAll("tr[data-myid]")) {
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

    const roomListObserver = new MutationObserver((mutations) => { filterRooms("observer", mutations) });
    roomListObserver.observe(document.querySelector("#roomlisttable"), { childList: true, subtree: true });
})();