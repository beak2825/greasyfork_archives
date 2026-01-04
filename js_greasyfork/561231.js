// ==UserScript==
// @name         DaringInventoryV1
// @namespace    http://tampermonkey.net/
// @version      2026-01-02
// @description  Prices for loot
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       MOTRIMG
// @match        https://motr-online.com/*
// @match        http://motr-online.com/*
// @license      WTFPL
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/561231/DaringInventoryV1.user.js
// @updateURL https://update.greasyfork.org/scripts/561231/DaringInventoryV1.meta.js
// ==/UserScript==

/*globals $*/

function getElementByXPath(xpathExpression, contextNode = document) {
    // document.evaluate(expression, contextNode, namespaceResolver, resultType, result)
    const result = document.evaluate(
        xpathExpression,
        contextNode,
        null, // namespaceResolver (null for HTML documents)
        XPathResult.FIRST_ORDERED_NODE_TYPE, // resultType for a single node
        null // result (existing XPathResult to use, null to create a new one)
    );
    return result.singleNodeValue;
}

const htmlString = '<th style="cursor: pointer" onclick="tblSort2.initSort(4, this);">Цена гильдии</th>';
const htmlStringNPCprice = '<th style="cursor: pointer" onclick="tblSort2.initSort(5, this);">Продажа в NPC</th>';
const htmlStringQuest = '<th style="cursor: pointer" onclick="tblSort2.initSort(6, this);">Квестовый</th>';

function addColumn(string_to_make) {
  const table = getElementByXPath('//*[@id="idTbl2"]');
  const newHeaderText = 'Цена гильдии';
  const newCellContent = '';

  for (let i = 0; i < table.rows.length; i++) {
    if (i === 0) {
      var newHeaderCell = document.createElement('template');
      newHeaderCell.innerHTML = string_to_make;
      table.rows[i].appendChild(newHeaderCell.content.firstChild);
    } else {
      const newCell = document.createElement('td');
      newCell.textContent = newCellContent; // Or more complex content like input fields
      table.rows[i].appendChild(newCell);
    }
  }
}

const url = "https://docs.google.com/spreadsheets/d/1-h_UMxI9rBu31KNZ84bBxP-8nkcQkpKC6aALlACjfDY/gviz/tq?sheet=%D0%AD%D0%BA%D0%B2%D0%B8%D0%B2%D0%B0%D0%BB%D0%B5%D0%BD%D1%82%20%D1%81%D0%B1%D0%BE%D1%80%D0%B0%20%D0%B2%20%D0%BB%D1%83%D1%82%D0%B5";
fetch(url)
    .then(res => res.text())
    .then(text => {
    // Remove the prefix "/*O_o*/\n" and suffix ";"
    const jsonText = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonText);
    console.log(data.table.rows);
    console.log(data.table.rows.length);
    addColumn(htmlString);
    addColumn(htmlStringNPCprice);
    //addColumn(htmlStringQuest);
    try {
        //const firstRowValue = data.table.rows[0].c[1].v; // Value of B1 (assuming header row not counted in 'rows')
        //console.log("Value:", firstRowValue);

        var table = getElementByXPath('//*[@id="idTbl2"]');
        for (let i = 0; i < table.rows.length; i++) { //для каждой строчки таблицы из кафры
            for(let j = 0; j < data.table.rows.length; j++) { //сверяем со строчкой из google-sheets
                if (table.rows[i].cells[1].innerText == data.table.rows[j].c[0].v){
                    table.rows[i].cells[4].innerText = data.table.rows[j].c[1].v
                }
            }
        }
    } catch (error) {
        console.log("Could not find cell value. Check data structure.");
    }

})
    .catch(err => console.error('Error fetching data:', err));


const urlQuest = "https://docs.google.com/spreadsheets/d/1-h_UMxI9rBu31KNZ84bBxP-8nkcQkpKC6aALlACjfDY/gviz/tq?sheet=%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8FID";
fetch(urlQuest)
    .then(res => res.text())
    .then(text => {
    // Remove the prefix "/*O_o*/\n" and suffix ";"
    const jsonText = text.substring(47).slice(0, -2);
    const data = JSON.parse(jsonText);
    console.log(data.table.rows);
    console.log(data.table.rows.length);
    addColumn(htmlStringQuest);
    try {
        const firstRowValue = data.table.rows[0].c[1].v; // Value of B1 (assuming header row not counted in 'rows')
        console.log("Value:", firstRowValue);

        var table = getElementByXPath('//*[@id="idTbl2"]');
        for (let i = 0; i < table.rows.length; i++) { //для каждой строчки таблицы из кафры
            for(let j = 0; j < data.table.rows.length; j++) { //сверяем со строчкой из google-sheets
                if (table.rows[i].cells[1].innerText == data.table.rows[j].c[1].v){
                    if (data.table.rows[j].c[5].v === 1){
                        table.rows[i].cells[6].innerText = "+"
                    }
                }
            }
        }
    } catch (error) {
        console.log("Could not find cell value. Check data structure.");
    }

})
    .catch(err => console.error('Error fetching data:', err));



$(document).ready(function(){

});