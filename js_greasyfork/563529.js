// ==UserScript==
// @name         Monsters Wrath Battlefield Differences
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays user differences in gold and soldiers on page refresh
// @author       Noog
// @match        https://www.monsterswrath.com/delta2/battlefield.php*
// @match        https://monsterswrath.com/delta2/battlefield.php*
// @match        https://www.monsterswrath.com/delta2/battlefield2.php*
// @match        https://monsterswrath.com/delta2/battlefield2.php*
// @match        http://www.monsterswrath.com/delta2/*
// @match        http://monsterswrath.com/delta2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563529/Monsters%20Wrath%20Battlefield%20Differences.user.js
// @updateURL https://update.greasyfork.org/scripts/563529/Monsters%20Wrath%20Battlefield%20Differences.meta.js
// ==/UserScript==

//window.addEventListener("load",function(){
    console.log("______");
    battlefieldTFF();



function battlefieldTFF(){

    document.getElementsByClassName("tab-content")[0].style.width = "100%";

  var get_BF_Table = document.getElementsByClassName('tab-stats')[1];
  get_BF_Table.getElementsByTagName("tr")[0].getElementsByTagName("th")[0].colSpan = "10";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[5].colSpan = "3";

  var gold_column_update, size_column_update;
  var th = document.createElement("th");
  th.setAttribute("class","rs");
  th.innerHTML = "+";
  get_BF_Table.getElementsByTagName("tr")[1].appendChild(th);

  var min_gold = localStorage.getItem("min_gold");

    for (var i = 2, row; row = get_BF_Table.rows[i]; i++) {
    var name = row.cells[3].innerText.trim();
    var size = row.cells[5].innerText.trim().replace(/\D/g,'');
    var gold = row.cells[7].innerText.trim().replace(/\D/g,'');

    if (localStorage.getItem(name + " size") === null) {
      localStorage.setItem(name + " size", size);
      localStorage.setItem(name + " gold", gold);

          gold_column_update = row.insertCell();
          gold_column_update.setAttribute("class","c1 l ms");
          gold_column_update.innerHTML = "<span style='color:#7FFF00'>+0</span>";

          size_column_update = row.insertCell(6);
          size_column_update.setAttribute("class","c1 l ms");
          size_column_update.innerHTML = "<span style='color:#7FFF00'>+0</span>";
    }else{
      var size_diff = size - localStorage.getItem(name + " size");
      var gold_diff = gold - localStorage.getItem(name + " gold");

      localStorage.setItem(name + " size", size);
      localStorage.setItem(name + " gold", gold);

      if(size_diff >= 0){
        size_column_update = row.insertCell(6);
        size_column_update.setAttribute("class","c1 l ms");
        size_column_update.innerHTML = "<span style='color:#7FFF00'>+" + size_diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";
      }else{
        size_column_update = row.insertCell(6);
        size_column_update.setAttribute("class","c1 l ms");
        size_column_update.innerHTML += " <span style='color:#B22222'>" + size_diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";
      }

      if(gold_diff >= 0){
        if(parseInt(gold) > parseInt(min_gold)){
          gold_column_update = row.insertCell();
          gold_column_update.setAttribute("class","c1 l ms");
          gold_column_update.innerHTML = "<span style='color:#7FFF00'>+" + gold_diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";
          row.cells[0].setAttribute("style", "background-color: #003366;");
          row.cells[1].setAttribute("style", "background-color: #003366");
          row.cells[2].setAttribute("style", "background-color: #003366");
          row.cells[3].setAttribute("style", "background-color: #003366");
          row.cells[4].setAttribute("style", "background-color: #003366");
          row.cells[5].setAttribute("style", "background-color: #003366");
          row.cells[6].setAttribute("style", "background-color: #003366");
          row.cells[7].setAttribute("style", "background-color: #003366");
          row.cells[8].setAttribute("style", "background-color: #003366");
          row.cells[9].setAttribute("style", "background-color: #003366");
        }else{
          gold_column_update = row.insertCell();
          gold_column_update.setAttribute("class","c1 l ms");
          gold_column_update.innerHTML = "<span style='color:#7FFF00'>+" + gold_diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";
        }
      }else{
        gold_column_update = row.insertCell();
        gold_column_update.setAttribute("class","c1 l ms");
        gold_column_update.innerHTML += " <span style='color:#B22222'>" + gold_diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>"
      }

    }
  }




  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[0].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[1].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[2].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[3].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[4].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[5].style.width = "30%";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[6].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[1].getElementsByTagName("th")[7].style.width = "10%";

if (get_BF_Table.getElementsByTagName("tr")[2]){
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[0].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[1].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[2].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[3].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[4].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[5].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[6].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[7].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[8].style.width = "10%";
  get_BF_Table.getElementsByTagName("tr")[2].getElementsByTagName("td")[9].style.width = "10%";
}

}