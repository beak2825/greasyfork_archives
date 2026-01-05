// ==UserScript==
// @name         Pimp My QuickLunch
// @name:ro      Pesteste-mi QuickLunch-ul
// @namespace    www.github.com/boogie666/pimp-my-quick-lunch
// @version      0.1
// @description  Adds total price for a quick-lunch order
// @description:ro Adauga pretul total la de la o comada quick-lunch
// @author       Boogie
// @match        http://quick-lunch.ro/meniu_curent2.php
// @match        http://quick-lunch.ro/meniu_viitor2.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9124/Pimp%20My%20QuickLunch.user.js
// @updateURL https://update.greasyfork.org/scripts/9124/Pimp%20My%20QuickLunch.meta.js
// ==/UserScript==


(function(){
  function Orders(){
    var orders = {};
    var listeners = [];
    this.order = function(name, value){
      orders[name] = value;
      listeners.forEach(function(l){
        l(orders);
      });
    };

    this.addListener = function(l){
      listeners.push(l);
    }
  }  
  
  var orders = new Orders();
  
  
  function getCurrentPrice(element){
    var quantity = Number(element.value),
        price = Number(element.parentNode.querySelector('b').innerText);
    return quantity * price; 
  }

  function getParent(element, type){
    if(element.parentNode.tagName === type.toUpperCase()){
      return element.parentNode;
    }
    return getParent(element.parentNode, type);
  }

  function getCurrentOrderName(element){
    var parentTable = getParent(element, "table"),
        row = getParent(parentTable, 'tr'),
        rowText = row.querySelector('td:not([rowspan])').innerText,
        elementText = parentTable.querySelector('span.negru_mic_meniu').innerText;

    return rowText +" "+ elementText;
  }

  function isPriceInput(element){
    return element.className.indexOf('pret_textbox') > -1;
  }

  function priceHanlder(e){
    var element = e.target;
    if(!isPriceInput(element)){
      return;
    }

    var inputPrice = getCurrentPrice(element);
    var orderName = getCurrentOrderName(element);
    
    orders.order(orderName, inputPrice); 

  }
    
  document.addEventListener('keyup', priceHanlder, false);
  document.addEventListener('change', priceHanlder, false);
  

  function TotalPriceCounter(orders){
    var element = document.createElement('span');
    element.style.position = "fixed";
    element.style.top = 0;
    element.style.left = 0;
    element.style.border = "solid 1px #FCB027";
    element.style.background = "#FFFDE9";
    element.style.color = "#8BB903";
    element.style.fontSize = "16px";
    element.style.padding = "6px";
    element.style.margin = "3px";
    element.style.borderRadius = "6px";
    element.className = "gri_mic_meniu";
    element.innerText = "Total : 0.00 lei";
    
    
    orders.addListener(function(orders){
      var total = 0;
      for(var order in orders){
        if(orders.hasOwnProperty(order)){
          total += orders[order]; 
        }
      } 
      element.innerText = "Total : " + total.toFixed(2) + " lei";
    }); 
    
    document.body.appendChild(element);
  }
   
  new TotalPriceCounter(orders);

}());
