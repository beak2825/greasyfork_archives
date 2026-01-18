// ==UserScript==
// @name     Pirateship Pick list/Packing list
// @description A basic script that generates pick lists and pack lists based on the current filtered view.
// @author kurapixel
// @version  1
// @license MIT
// @grant       GM_registerMenuCommand
// @grant       GM_addElement
// @include *.pirateship.com/import
// @namespace https://greasyfork.org/users/1561611
// @downloadURL https://update.greasyfork.org/scripts/563064/Pirateship%20Pick%20listPacking%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/563064/Pirateship%20Pick%20listPacking%20list.meta.js
// ==/UserScript==

var column = localStorage.getItem("column") || 0;
var name = localStorage.getItem("name") || 0;
var detailedItems = 0; 

var buttonNode = document.createElement("div");

buttonNode.setAttribute(
  "style",
  "position: absolute;right: 0;z-index: 1100;margin: 5px;",
);

buttonNode.innerHTML =
  '<button id="picklistButton" type="button">' +
  "Pick list</button>" +
  '<button id="packinglistButton" type="button">' +
  "Packing list</button>";
buttonNode.setAttribute("id", "myContainer");

var columnSelector = document.createElement("select");
columnSelector.setAttribute("id", "myColumnSelector");

var nameSelector = document.createElement("select");
columnSelector.setAttribute("id", "myNameSelector");

document.body.prepend(buttonNode);

//--- Activate the newly added button.
document
  .getElementById("picklistButton")
  .addEventListener("click", PicklistClickAction, false);
document
  .getElementById("packinglistButton")
  .addEventListener("click", PackinglistClickAction, false);


function PicklistClickAction(e) {
  var orderTable = document.body.getElementsByTagName("table")[0].childNodes[2];
  var orderItemCells = Array.from(orderTable.childNodes).map(
    (obj) => obj.childNodes[column],
  );
  var orderItems = {};
  for (let i = 0; i < orderItemCells.length; i++) {
    var childNodes = orderItemCells[i].childNodes;
    for (let j = 0; j < childNodes.length; j = j + 2) {
      var val = childNodes[j].data;
      var name = val.substring(3);
      orderItems[name] =
        orderItems[name] + parseInt(val.substring(0, 1)) ||
        parseInt(val.substring(0, 1));
    }
  }
  let str = "";
  Object.keys(orderItems)
    .sort()
    .forEach((k) => {
      str += k + ":";
      str += orderItems[k] + "\n";
    });

  var url = urlBlobifiedText(str.replaceAll("\n", "<br>"));
  window.open(url, "_blank");
}

function PersonalizationClickAction(e) {
  var orderTable = document.body.getElementsByTagName("table")[0].childNodes[2];
  var orderItemCells = Array.from(orderTable.childNodes).map(
    (obj) => obj.childNodes[detailedItems],
  );
  var orderItems = {};
  for (let i = 0; i < orderItemCells.length; i++) {
    var childNodes = orderItemCells[i].childNodes;
    for (let j = 0; j < childNodes.length; j = j + 2) {
      var val = childNodes[j].data;
      var name = val.substring(3);
      if(name.includes("Personalization:") && !name.includes("Not requested")){
        orderItems[name] =
        orderItems[name] + parseInt(val.substring(0, 1)) ||
        parseInt(val.substring(0, 1));
      }
    }
  }
  let str = "";
  Object.keys(orderItems)
    .sort()
    .forEach((k) => {
      str += k + ":";
      str += orderItems[k] + "\n";
    });

  var url = urlBlobifiedText(str.replaceAll("\n", "<br>"));
  window.open(url, "_blank");
}

function PackinglistClickAction(e) {
  var orderTable = document.body.getElementsByTagName("table")[0].childNodes[2];
  var orderItemCells = Array.from(orderTable.childNodes).map((obj) => [
    obj.childNodes[5].innerText,
    obj.childNodes[column].innerText.replace(
      " / Personalization: Not requested on this item.",
      "",
    ),
  ]);
  let str = "";
  for (let i = 0; i < orderItemCells.length; i++) {
    str += orderItemCells[i][0] + ":\n";
    str += orderItemCells[i][1] + "\n\n";
  }

  var url = urlBlobifiedText(str.replaceAll("\n", "<br>"));
  window.open(url, "_blank");
}

function urlBlobifiedText(str) {
  const blob = new Blob([str], { type: "text/html" });
  var url = URL.createObjectURL(blob);
  return url;
}

function waitForElement(selector, callback) {
  const observer = new MutationObserver((mutations, observer) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect();
      callback(element);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Usage
waitForElement("td", (element) => {
  var columnOptions = columnSelector.options;
  var nameOptions = nameSelector.options;
  var tableHeaders =
    document.body.getElementsByTagName("table")[0].childNodes[1].childNodes[0]
      .childNodes;

  columnOptions.add(new Option("item column", 0));
  nameOptions.add(new Option("name column", 0));
  for (let i = 1; i < tableHeaders.length; i++) {
    let header = tableHeaders[i].innerText;
    if (header.includes("Order Items")) {
      if(header.includes("Detailed")) {
      	detailedItems = i;
      }
      columnOptions.add(new Option(tableHeaders[i].innerText, i));
      if (i == column) {
        columnSelector.value = i;
      }
    }
    if (header.includes("Name")) {
      nameOptions.add(new Option(tableHeaders[i].innerText, i));

      if (i == name) {
        nameSelector.value = i;
      }
    }
  }

  buttonNode.prepend(columnSelector);
  buttonNode.prepend(nameSelector);
});

columnSelector.onchange = function () {
  column = columnSelector.value;
  localStorage.setItem("column", column);
};
nameSelector.onchange = function () {
  name = nameSelector.value;
  localStorage.setItem("name", name);
};
