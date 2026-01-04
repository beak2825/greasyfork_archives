// ==UserScript==
// @name         MH - Fast RT Tool
// @description  Fast RT: Send treasure chests' tradeables in a click!
// @author       Snowbits
// @version      1.0.4
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @resource     https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace https://greasyfork.org/users/1140737
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561161/MH%20-%20Fast%20RT%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/561161/MH%20-%20Fast%20RT%20Tool.meta.js
// ==/UserScript==

// --- CONSTANT DATA ---
const CHESTS = {
  rare_ny: {
    name: "Rare New Year's Party Treasure Chest",
    items: {
      glazed_pecan_pecorino_cheese: 20,
      jingle_bell_stat_item: 10,
      festive_spirit_stat_item: 10,
      golem_magical_hat_stat_item: 1,
    },
  },
  rare_naughty: {
    name: "Rare Naughty Treasure Chest",
    items: {
      glazed_pecan_pecorino_cheese: 15,
      jingle_bell_stat_item: 5,
      festive_spirit_stat_item: 5,
    },
  },
};

const ITEMNAMES = {
    glazed_pecan_pecorino_cheese: "Glazed Pecan Pecorino Cheese",
    jingle_bell_stat_item: "Festive Jingle Bell",
    festive_spirit_stat_item: "Festive Spirit",
    golem_magical_hat_stat_item: "Magical Holiday Hat",
}

$(document).ready(function () {
  addTouchPoint();
});

function addTouchPoint() {
  if ($(".snipeHix").length == 0) {
    const invPages = $(".friends .tournament_scoreboards ");
    const snipeHix = document.createElement("li");
    snipeHix.classList.add("fast_rt_tool");
    const snipeHixBtn = document.createElement("a");
    snipeHixBtn.innerText = "Fast RT Tool";
    snipeHixBtn.onclick = function () {
      render();
    };

    const icon = document.createElement("div");
    icon.className = "icon";
    snipeHixBtn.appendChild(icon);
    snipeHix.appendChild(snipeHixBtn);
    $(snipeHix).insertAfter(invPages);
  }
}

function getFriends() {
  return new Promise((resolve, reject) => {
    postReq(
      "https://www.mousehuntgame.com/managers/ajax/users/userData.php",
      `sn=Hitgrab&hg_is_ajax=1&uh=${user.unique_hash}&get_friends=true`
    ).then((res) => {
      try {
        var data = JSON.parse(res.responseText);
        var friendNameList = [];
        if (data.user_data) {
          var friendSnuidList = Object.keys(data.user_data);
          for (var i = 0; i < friendSnuidList.length; i++) {
            friendNameList.push(data.user_data[friendSnuidList[i]].name);
          }
          resolve([friendSnuidList, friendNameList]);
        }
      } catch (error) {
        alert(`Error getting friends! I know it's hard to get friends nowadays`);
        console.log(error);
      }
    });
  });
}

async function render() {
  document.querySelectorAll("#map-tool-box").forEach((el) => el.remove());

  const div = document.createElement("div");
  div.id = "map-tool-box";
  div.style.backgroundColor = "#F5F5F5";
  div.style.position = "fixed";
  div.style.zIndex = "9999";
  div.style.left = "35vw";
  div.style.top = "28vh";
  div.style.border = "solid 3px #696969";
  div.style.borderRadius = "20px";
  div.style.padding = "10px";
  div.style.textAlign = "center";
  div.style.fontSize = "12px";

  const closeButton = document.createElement("button", {
    id: "close-button",
  });
  closeButton.textContent = "x";
  closeButton.style.marginLeft = "5px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = function () {
    document.body.removeChild(div);
  };

  const minButton = document.createElement("button", {
    id: "minimise-button",
  });
  minButton.textContent = "-";
  minButton.style.marginLeft = "57px";
  minButton.style.cursor = "pointer";
  minButton.onclick = function () {
    if (minButton.textContent == "-") {
      $("#maptain-tool-content")[0].style.display = "none";
      $(".maptain-tool-info")[0].style.marginLeft = "0px";
      minButton.textContent = "+";
      minButton.style.marginLeft = "5px";
    } else if (minButton.textContent == "+") {
      $("#maptain-tool-content")[0].style.display = "";
      $(".maptain-tool-info")[0].style.marginLeft = "17px";
      minButton.textContent = "-";
      minButton.style.marginLeft = "57px";
    }
  };

  const toolInfo = document.createElement("div");
  toolInfo.className = "maptain-tool-info";
  toolInfo.textContent = "Fast RT Tool";
  toolInfo.style.height = "21px";
  toolInfo.style.textAlign = "Left";
  toolInfo.style.marginLeft = "17px";
  toolInfo.style.fontWeight = "bold";
  toolInfo.style.cursor = "context-menu";

  const contentDiv = document.createElement("div");
  contentDiv.id = "maptain-tool-content";

  const table = document.createElement("table");
  table.id = "maptain-tool-table";
  table.style.textAlign = "left";
  table.style.borderSpacing = "1em 0";

  //hid-------------------------------------------
  const hid_row = document.createElement("tr");
  const hid_td1 = document.createElement("td");
  const hid_td2 = document.createElement("td");

  const hid_radio = document.createElement("input");
  hid_radio.type = "radio";
  hid_radio.name = "chro-hunter-friend";
  hid_radio.id = "chro-hunter-radio";
  hid_radio.style.verticalAlign = "middle";
  hid_radio.style.marginTop = "-2px";
  hid_radio.checked = true;
  hid_radio.onchange = function () {
    processRadio();
  };
  hid_td1.appendChild(hid_radio);

  const hid_label = document.createElement("label");
  hid_label.innerText = "Hunter ID: ";
  hid_label.htmlFor = "chro-radio-hid";
  hid_td1.appendChild(hid_label);

  const hid_input = document.createElement("input");
  hid_input.type = "text";
  hid_input.id = "hunter-input-id";
  hid_input.size = "10";
  hid_input.style.placeHolder = "1";
  hid_td2.appendChild(hid_input);

  //friends---------------------------------------
  const friend_row = document.createElement("tr");
  const friend_td1 = document.createElement("td");
  friend_td1.style.textAlign = "right";
  const friend_td2 = document.createElement("td");

  const friend_radio = document.createElement("input");
  friend_radio.type = "radio";
  friend_radio.name = "chro-hunter-friend";
  friend_radio.id = "chro-friend-radio";
  friend_radio.style.verticalAlign = "middle";
  friend_radio.style.marginTop = "-2px";
  friend_radio.style.position = "relative";
  friend_radio.style.right = "17.5px";
  friend_radio.onchange = function () {
    processRadio();
  };
  friend_td1.appendChild(friend_radio);

  const friend_label = document.createElement("label");
  friend_label.innerHTML = "Friend:";
  friend_label.htmlFor = "chro-radio-friend";
  friend_td1.appendChild(friend_label);

  const friend_input = document.createElement("input");
  friend_input.type = "text";
  friend_input.id = "hunter-input-id";
  friend_input.disabled = true;
  friend_input.size = "10";

  friend_td2.appendChild(friend_input);

  //Either friend or hunter-------------------------------------
  var friendList;
  var friendSnuid;
  var snuid;
  var name;
  async function processRadio() {
    if (hid_radio.checked) {
      hid_input.disabled = false;
      friend_input.disabled = true;
      friend_input.value = "";
    } else if (friend_radio.checked) {
      hid_input.disabled = true;
      friend_input.disabled = false;
      hid_input.value = "";
      var list = await getFriends();
      friendSnuid = list[0];
      friendList = list[1];
      $("#hunter-input-id").autocomplete({
        source: list[1],
        open: function () {
          setTimeout(function () {
            $(".ui-autocomplete").css("z-index", 99999999999999);
          }, 0);
        },
      });
    }
  }

  //map--------------------------------------
  const map_row = document.createElement("tr");
  const map_td1 = document.createElement("td");
  map_td1.style.textAlign = "right";
  const map_td2 = document.createElement("td");

  const map_label = document.createElement("label");
  map_label.innerText = "Map: ";
  map_td1.appendChild(map_label);

  const map_select = document.createElement("select", {
    id: "map_select",
  });
  map_select.style.width = "103px";
  const entries = Object.entries(CHESTS);
  if (entries.length === 0) {
    const option = document.createElement("option");
    option.textContent = "None";
    option.disabled = true;
    option.selected = true;
    map_select.appendChild(option);
  } else {
    for (const [id, chest] of entries) {
      const option = document.createElement("option");
      option.value = id; // IMPORTANT
      option.textContent = chest.name;
      map_select.appendChild(option);
    }
  }

  map_td2.appendChild(map_select);

  //append-------------------------------------------
  hid_row.appendChild(hid_td1);
  hid_row.appendChild(hid_td2);
  friend_row.appendChild(friend_td1);
  friend_row.appendChild(friend_td2);
  map_row.appendChild(map_td1);
  map_row.appendChild(map_td2);
  table.appendChild(map_row);
  table.appendChild(friend_row);
  table.appendChild(hid_row);

  //Buttons---------------------------------------------
  const actionDiv = document.createElement("div");
  actionDiv.className = "action-div";

  const sendBtn = document.createElement("button", {
    id: "send-button",
  });
  sendBtn.textContent = "Send Tradeables";
  sendBtn.style.cursor = "pointer";
  sendBtn.onclick = async function () {
    var snuidAndName = await getSnuidAndName(
        hid_input.value,
        friend_input.value,
        friendList,
        friendSnuid
    );
    const snuid = snuidAndName[0];
    const name = snuidAndName[1];
    const selectedChest = CHESTS[map_select.value];
    await getConfirmation("sendItems", snuid, name, selectedChest.name);
      const sentItems = [];
    for (const [itemType, quantity] of Object.entries(selectedChest.items)) {
        const success = await sendItems(snuid, itemType, quantity);
        if (success) {
           sentItems.push(`${quantity} ${ITEMNAMES[itemType] ?? itemType}`);
        }
    }
    if (sentItems.length > 0) {
    alert("Successfully sent:\n" + sentItems.join("\n"));
    }
};
  actionDiv.appendChild(sendBtn);

  toolInfo.appendChild(minButton);
  toolInfo.appendChild(closeButton);
  div.appendChild(toolInfo);
  contentDiv.appendChild(document.createElement("br"));
  contentDiv.appendChild(table);
  contentDiv.appendChild(document.createElement("br"));
  contentDiv.appendChild(actionDiv);
  div.appendChild(contentDiv);
  document.body.appendChild(div);
  dragElement(div);
}

async function getSnuidAndName(
  hid_input,
  friend_input,
  friendList,
  friendSnuid
) {
  return new Promise(async (resolve, reject) => {
    if (hid_input) {
      var snuidAndName = await getSnuidId(hid_input);
      var snuid = snuidAndName[0];
      var name = snuidAndName[1];
    } else if (friend_input) {
      var friend_index = friendList.indexOf(friend_input);
      snuid = friendSnuid[friend_index];
      name = friend_input;
    }
    resolve([snuid, name]);
  });
}

function getSnuidId(hid) {
  return new Promise((resolve, reject) => {
    if (hid != user.user_id && hid.length > 0) {
      postReq(
        "https://www.mousehuntgame.com/managers/ajax/pages/friends.php",
        `sn=Hitgrab&hg_is_ajax=1&action=community_search_by_id&user_id=${hid}&uh=${user.unique_hash}`
      ).then((res) => {
        try {
          var data = JSON.parse(res.responseText);
          if (data) {
            var hunter_name = data.friend.name;
            var hunter_snuid = data.friend.sn_user_id;
            resolve([hunter_snuid, hunter_name]);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  });
}

function getConfirmation(action, snuid, name, input_value) {
  return new Promise((resolve, reject) => {
    document
      .querySelectorAll("#confirm-action-box")
      .forEach((el) => el.remove());

    const actdiv = document.createElement("div");
    actdiv.id = "confirm-action-box";
    actdiv.style.backgroundColor = "#F5F5F5";
    actdiv.style.position = "fixed";
    actdiv.style.zIndex = "9999";
    actdiv.style.left = "28vw";
    actdiv.style.top = "28vh";
    actdiv.style.border = "solid 3px #696969";
    actdiv.style.borderRadius = "20px";
    actdiv.style.padding = "10px";
    actdiv.style.textAlign = "center";

    const cfmdiv = document.createElement("div");
    cfmdiv.id = "map-confirm-header";
    cfmdiv.style.fontSize = "12px";

    if (action == "sendItems") {
      cfmdiv.innerText = "Send ".concat(
        input_value,
        "'s tradeables to ",
        name,
        "?"
      );
    }
    //Buttons -----------
    const doBtnDiv = document.createElement("div");

    const cfmBtn = document.createElement("button", {
      id: "cfm-button",
    });
    cfmBtn.style.cursor = "pointer";
    cfmBtn.innerText = "Confirm";
    cfmBtn.onclick = function () {
      document.body.removeChild(actdiv);
      resolve();
    };

    const noBtn = document.createElement("button", {
      id: "no-button",
    });
    noBtn.innerText = "Cancel";
    noBtn.style.marginLeft = "5px";
    noBtn.style.cursor = "pointer";
    noBtn.onclick = function () {
      document.body.removeChild(actdiv);
      reject(this);
    };
    doBtnDiv.appendChild(cfmBtn);
    doBtnDiv.appendChild(noBtn);
    actdiv.appendChild(cfmdiv);
    actdiv.appendChild(document.createElement("br"));
    actdiv.appendChild(doBtnDiv);
    document.body.appendChild(actdiv);
    dragElement(actdiv);
  });
}

async function sendItems(snuid, itemType, quantity) {
    try {
        const res = await postReq(
            "https://www.mousehuntgame.com/managers/ajax/users/supplytransfer.php",
            `sn=Hitgrab&hg_is_ajax=1&receiver=${snuid}&uh=${user.unique_hash}&item=${itemType}&item_quantity=${quantity}`
        );
        const data = JSON.parse(res.responseText);
        if (data.success == "1") {
            return true;
        } else {
            alert(`Failed to send ${quantity} ${ITEMNAMES[itemType] ?? itemType}`);
            return false;
        }
    } catch (error) {
        alert("Ajax Request Failed!");
        console.log(error);
        return false;
    }
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (elmnt.firstElementChild) {
    // if present, the header is where you move the DIV from:
    elmnt.firstElementChild.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function postReq(url, form) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        resolve(this);
      }
    };
    xhr.onerror = function () {
      reject(this);
    };
    xhr.send(form);
  });
}
