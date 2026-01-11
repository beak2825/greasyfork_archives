// ==UserScript==
// @name        FIlter roomnames by tags
// @license     MIT
// @match       https://*.bonk.io/gameframe-release.html
// @grant       none
// @version     1.0
// @author      ancient_player
// @description Filter the Bonk.io roomlist by tags. Multiple tags can be added seperated by commas "," where the room will show if it matches at least one. The roomname "winners picks" will show with the tag "winner" , "winners picks" or "w" but not "winners picks 123" so best keep multiple short tags.
// @namespace https://greasyfork.org/users/1558569
// @downloadURL https://update.greasyfork.org/scripts/562169/FIlter%20roomnames%20by%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/562169/FIlter%20roomnames%20by%20tags.meta.js
// ==/UserScript==

// Visuals -----

let searchInput = document.createElement("input")
    searchInput.placeholder = "Filter roomnames by tags"
    searchInput.classList.add("roomlistbottombutton_dynamic", "roomlistbottombutton", "buttonShadow", "roomlistcreatewindowinput")
    searchInput.style = "right: 350; border-radius: 3px; cursor: text; background-color: rgb(210, 219, 222); color: rgb(0, 0, 0); font-size: 15px;width: 250px;"
    searchInput.title = "Match at least one tag. Separated by commas eg. winner, parkour, wdb"

document.getElementById("roomlist").prepend(searchInput)

document.getElementById("roomlistfilterbutton").style.width = "120px"

// Logic -----

function filterRooms() {
    let rooms = document.querySelector("#roomlisttable tbody").children
    let numbFiltered = 0
    let tags = searchInput.value.split(",").map(tag => tag.trim().toLowerCase()).filter(item => item !== "");

    if (tags.length == 0) { tags.push("") } // If there are no tags, just match all rooms.

    for (let room of rooms) {
        let roomName = room.children[0].textContent.trim().toLowerCase()

        let hasTags = tags.some(tag => roomName.includes(tag));

        if (hasTags) {
            room.style.display = ""
        } else {
            room.style.display = "none"
            numbFiltered += 1
        }
    }

    let roomnameTitle = document.getElementById("roomlisttableheader_roomname")

    if (numbFiltered > 0) {
        roomnameTitle.textContent = `ROOM NAME (${rooms.length - numbFiltered}/${rooms.length} rooms shown)`
    } else {
        roomnameTitle.textContent = "ROOM NAME"
    }
}

// Input & Events -----

searchInput.addEventListener("input", filterRooms);

const roomListObserver = new MutationObserver(filterRooms);

let rooms = document.querySelector("#roomlisttable")
roomListObserver.observe(rooms, {
    childList: true,
    subtree: true,
});