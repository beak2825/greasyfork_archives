// ==UserScript==
// @name         GGn Gold Goal Estimator
// @namespace    https://gazellegames.net/
// @version      0.3.1
// @description  Show time to a goal amount of gold on GGN
// @author       monkeys
// @license      MIT
// @match        https://gazellegames.net/user.php*
// @icon         https://gazellegames.net/favicon.ico
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/558784/GGn%20Gold%20Goal%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/558784/GGn%20Gold%20Goal%20Estimator.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // Load goal from GM or Valueult
  var goal_amt = await GM.getValue('gold_goal', 1000000);

  // Update page
  function updateDisplay() {
    var daily_gold_amt = parseFloat(document.getElementsByClassName('total')[0].childNodes[5].innerText.replace(/,/g, ''));
    //var current_gold_amt = parseFloat(document.getElementById('stats_gold').children[1].innerText.replace(/,/g, '')); // stats menu
    var current_gold_amt = parseFloat(document.getElementById('gold').children[1].innerText.replace(/,/g, '')); // user info box
    var gold_goal_elm = document.getElementById('gold_goal_display');

    if (current_gold_amt > goal_amt) {
      gold_goal_elm.innerText = `Gold goal achieved!`;
    } else if (daily_gold_amt == 0) {
      gold_goal_elm.innerText = `No gold income :(`;
    } else {
      var days_to_goal = (goal_amt - current_gold_amt) / daily_gold_amt;
      var goal_date = new Date();
      goal_date = new Date(goal_date.getTime() + (days_to_goal * 24 * 60 * 60 * 1000));
      var date_options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      var time_options = {hour: '2-digit', minute: '2-digit', hour12: true}
      var date_string = `${goal_date.toLocaleDateString("en-US", date_options)}`;
      if (days_to_goal < 3) date_string += ` ${goal_date.toLocaleTimeString("en-US", time_options)}`;
      var duration_string = days_to_goal < 1 ? `Hours: ${(days_to_goal * 24).toLocaleString()}` : `Days: ${days_to_goal.toLocaleString()}`
      gold_goal_elm.innerText = `Goal: ${goal_amt.toLocaleString()}, ${duration_string},  Date: ${date_string}`;
    }
  }

  // Create display element
  var display_elm = document.createElement('p');
  display_elm.id = 'gold_goal_display';
  display_elm.style.cursor = 'pointer';
  display_elm.title = 'Click to edit gold goal';

  // Add double-click editing
  display_elm.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'text';
    input.value = goal_amt.toLocaleString();
    input.style.width = '10em';
    input.style.font = 'inherit';

    display_elm.innerHTML = 'Enter New Goal:  ';
    display_elm.appendChild(input);
    input.focus();

    function saveGoal() {
      var raw_value = input.value.replace(/,/g, '');
      if (raw_value !== '' && !isNaN(raw_value)) {
        goal_amt = parseFloat(raw_value);
        GM.setValue('gold_goal', goal_amt);
      }
      updateDisplay();
    }

    input.addEventListener('blur', saveGoal);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') saveGoal();
    });
  });

  // Insert into page
  var gold_box = document.getElementById('box_gold_scrollbar');
  if (gold_box) {
    gold_box.parentNode.insertBefore(display_elm, gold_box.nextSibling);
    updateDisplay();
  }
})();

