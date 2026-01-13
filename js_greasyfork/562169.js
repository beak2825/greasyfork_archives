// ==UserScript==
// @name        Search room names with tags | Bonk.io
// @license     MIT
// @match       https://*.bonk.io/gameframe-release.html
// @grant       none
// @version     1.1
// @author      ancient_player
// @description Filter the Bonk.io room list by tags. Multiple tags can be added separated by commas "," where the room will show if it matches at least one. The room name "winners picks" will show with the tag "winner" , "winners picks" or "w" but not "winners picks 123" so best keep multiple short tags. Results are show above the dashed line on the room list page.
// @namespace https://greasyfork.org/users/1558569
// @downloadURL https://update.greasyfork.org/scripts/562169/Search%20room%20names%20with%20tags%20%7C%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/562169/Search%20room%20names%20with%20tags%20%7C%20Bonkio.meta.js
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
    console.log("stopObserving")
    roomListObserver.disconnect()

    let roomsContainer = document.querySelector("#roomlisttable tbody")
    let rooms = roomsContainer.querySelectorAll("tr[data-myid]")
    let numbFiltered = 0
    let tags = searchInput.value.split(",").map(tag => tag.trim().toLowerCase()).filter(item => item !== "");

    if (tags.length == 0) { tags.push("") } // If there are no tags, just match all rooms.

    let matchedRooms = [];
    let miscRooms = [];


    rooms.forEach(room => {
        let roomName = room.children[0].textContent.trim().toLowerCase()

        let hasTags = tags.some(tag => roomName.includes(tag));

        if (hasTags) {
            room.style.textDecoration = "";
            room.style.borderTop = ""
            matchedRooms.push(room);
        } else {
            room.style.borderTop = ""
            miscRooms.push(room);
            numbFiltered += 1
        }
    })

    roomsContainer.innerHTML = ""

    // Sort rooms by distance
    matchedRooms.sort((a, b) => { return parseInt(a.dataset.myid) - parseInt(b.dataset.myid); });
    matchedRooms.sort((a, b) => { return parseInt(a.dataset.myid) - parseInt(b.dataset.myid); });

    // matched/misc room seperator
    if (miscRooms.length > 0 && matchedRooms.length > 0) {
        miscRooms[0].style.borderTop = "2px dashed gray"
    }

    // Add rooms back to the table
    matchedRooms.forEach(room => roomsContainer.appendChild(room));
    miscRooms.forEach(room => roomsContainer.appendChild(room));


    let roomnameTitle = document.getElementById("roomlisttableheader_roomname")

    if (numbFiltered > 0) {
        roomnameTitle.textContent = `ROOM NAME (${roomsContainer.children.length - numbFiltered}/${roomsContainer.children.length} rooms match)`
    } else {
        roomnameTitle.textContent = "ROOM NAME"
    }

    roomListObserver.observe(document.querySelector("#roomlisttable"), {
        childList: true,
        subtree: true,
    });
}

// Input & Events -----

searchInput.addEventListener("input", filterRooms);

const roomListObserver = new MutationObserver(filterRooms);
roomListObserver.observe(document.querySelector("#roomlisttable"), {
    childList: true,
    subtree: true,
});