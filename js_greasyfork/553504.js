// ==UserScript==
// @name        geu-4: показывать расход
// @namespace   Violentmonkey Scripts
// @match       https://cabinet.geu-4.ru/mycabinet/meters/*
// @grant       none
// @version     1.0
// @author      yohanson
// @description Показывать расход воды сразу во время ввода показаний
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/553504/geu-4%3A%20%D0%BF%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/553504/geu-4%3A%20%D0%BF%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4.meta.js
// ==/UserScript==

function update_diff(id) {
  var input = document.getElementById('meter_' + id)
  var diff = document.getElementById('diff_' + id)
  var prev = document.getElementById('sayind_' + id)
  var diff_value = Math.round((input.value - prev.value) * 1000) / 1000
  if (input.value) {
    diff.innerText = '(' + diff_value + 'м³)'
  } else {
    diff.innerText = ''
  }
}

function recalculate(e) {
  var input = e.target
  var id = input.name.split('_')[1]
  update_diff(id)
}

document.getElementById('meterslist').onchange = function() {
  var inputs = document.querySelectorAll('input[type=text][name^=meter_]')
  inputs.forEach(function(input){
    var id = input.name.split('_')[1]
    var diff = document.createElement('div')
    diff.style = "width:100%; text-align:center"
    diff.id = 'diff_' + id
    input.parentElement.appendChild(diff)
    input.onkeyup = recalculate
    input.disabled = false
    input.setAttribute('autocomplete', 'off')
    update_diff(id)
  })
}

var style = document.createElement('style');
style.innerHTML = `
#meterslist table td {
  vertical-align: top;
}
`;
document.head.appendChild(style);