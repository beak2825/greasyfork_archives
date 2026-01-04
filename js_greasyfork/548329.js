// ==UserScript==
// @license MIT 
// @name         Ozon.ru Force Full Titles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Показывать названия товаров на Озоне без сокращений
// @author       You
// @match        https://www.ozon.ru/product*
// @match        https://www.ozon.ru/search*
// @match        https://www.ozon.ru/category*
// @match        https://www.ozon.ru/seller*
// @match        https://www.ozon.ru/my/favorites*
// @match        https://www.ozon.ru/product*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548329/Ozonru%20Force%20Full%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/548329/Ozonru%20Force%20Full%20Titles.meta.js
// ==/UserScript==


// набор хранит названия ксс классов, 
// которые мы модифицировали в OzonFixLinks
var  classNames = new Set();

 
function OzonFixLinks(node) {

  	console.log("OzonFullTitles fired", node);
  
    // находим все ссылки на товары и берем нижележащий див
    let elements = node.querySelectorAll('a[href*="/product"]>div');
      
		// пройти по всем элементам, а не только первому,
    // т.к бывают элементы с разными классами
    for (var element of elements) {
        // если у дива есть атрибут, который обрезает длину слов
        // -webkit-box for chrome and flow-root for firefox
        var displayStyle = window.getComputedStyle(element).display;
      
        if (displayStyle == '-webkit-box' || displayStyle == 'flow-root') {
            
            // получаем название последнего класса у этого элемента
            let className = element.className.split(' ').slice(-1);  
         		// пропускаем, если обработали ранее
          	if(classNames.has(className)) {
          		continue;
            }
          
          	// добавляем ксс для этого класса, отключая обрезание
          	classNames.add(className);  
          	let cssString = "." + className + "{ display:flex; }";
	      		document.head.appendChild(document.createElement("style")).innerHTML = cssString;
        }   
     }

}

function OzonFixHeader() {
	var node = document.querySelector("h1");
  if (node) {
    node.removeAttribute("style");
	}
  console.log("h1 fixed");
}


var nodeH1 = document.querySelector("h1");
var observerH1 = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.attributeName === "style") {
      console.log("Style change blocked!");
      mutation.target.removeAttribute("style"); // or reset to desired style
    }
  });
});

observerH1.observe(nodeH1, { attributes: true, attributeFilter: ["style"] });


// при загрузке документа обрабатываем весь документ
window.addEventListener('load', function() {
 		OzonFixLinks(document); 
		if (window.location.href.includes("/product/")) {
//    	OzonFixHeader();
    }
}, false);


// при динамическом обновлении DOM
const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // если был добавлен именно див
      if (node.nodeType === 1 && node.tagName === "DIV") {
        // и внутри дива есть нужная ссылка
        const link = node.querySelector('a[href^="/product/"]');
        if (link == false) {
          continue;
        }

        OzonFixLinks(node);
//      console.log("✅ New div contains product link:", node, link);
      }
    }
  }
});

// Start observing the body
observer.observe(document.body, {
  childList: true,   // watch direct children
  subtree: true      // watch all descendants
});