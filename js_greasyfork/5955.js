// ==UserScript==
// @name        OTRS_Timer
// @author      Pedro VAZ PEREIRA
// @description Timer for OTRS with auto-complete of Time Units
// @include     */otrs/index.pl?Action=AgentTicketNote*
// @include     */otrs/index.pl?Action=AgentTicketPhone*
// @include     */otrs/index.pl?Action=AgentTicketClose*
// @include     */otrs/index.pl?Action=AgentTicketPending*
// @version     1.4
// @license     Licence Creative Commons Attribution - Partage dans les Mêmes Conditions 3.0 France (CC BY-SA 3.0 FR)
// @grant       none
// @namespace https://greasyfork.org/users/6245
// @downloadURL https://update.greasyfork.org/scripts/5955/OTRS_Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/5955/OTRS_Timer.meta.js
// ==/UserScript==
function addTimer() {
  var ban = document.getElementsByClassName('Header') [0];
  var banClose = ban.getElementsByTagName('p') [1];
  var newTimer = createTimer();
  ban.insertBefore(newTimer, banClose)
}
function createTimer() {
  var newDiv = document.createElement('div');
  var buttonStart = document.createElement('button');
  var buttonStop = document.createElement('button');
  var buttonReset = document.createElement('button');
  newDiv.id = 'Timer';
  buttonStart.id = 'Start';
  buttonStop.id = 'Stop';
  buttonReset.id = 'Reset';
  newDiv.innerHTML = '<H3><time>00:00<sec style=\'font-size: 0.8em;\'>:00</sec></time></H3>';
  buttonStart.innerHTML = 'START';
  buttonStop.innerHTML = 'STOP';
  buttonReset.innerHTML = 'RESET';
  newDiv.appendChild(buttonStart);
  newDiv.appendChild(buttonStop);
  newDiv.appendChild(buttonReset);
  return newDiv;
}
addTimer();
timer();

var h3 = document.getElementsByTagName('h3') [0],
start = document.getElementById('Start'),
stop = document.getElementById('Stop'),
clear = document.getElementById('Reset'),
seconds = 0,
minutes = 0,
hours = 0,
t;

function add() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }
  updateWorkUnits(hours, minutes);
  h3.innerHTML = (hours ? (hours > 9 ? hours : '0' + hours)  : '00') + ':' + (minutes ? (minutes > 9 ? minutes : '0' + minutes)  : '00') + '<sec style=\'font-size: 0.8em;\'>:' + (seconds > 9 ? seconds : '0' + seconds) + '</sec>';
  timer();
}
function updateWorkUnits(hour, min) {
  hour = parseInt(hour);
  min = parseInt(min);
  var timeUnitsInput = document.getElementById('TimeUnits');
  var totalMinutes = hour * 60 + min;
  var timeUnit = Math.floor(totalMinutes / 3) * 0.05
  timeUnitsInput.value = timeUnit;
}
function timer() {
  t = setTimeout(add, 1000);
}
/* Start button */

start.onclick = timer;
/* Stop button */
stop.onclick = function () {
  clearTimeout(t);
}
/* Clear button */

clear.onclick = function () {
  h3.innerHTML = '00:00<sec style=\'font-size: 0.8em;\'>:00</sec>';
  seconds = 0;
  minutes = 0;
  hours = 0;
  var timeUnitsInput = document.getElementById('TimeUnits');
  timeUnitsInput.value = 0;
}
