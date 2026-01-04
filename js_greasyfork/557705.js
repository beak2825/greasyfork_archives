// ==UserScript==
// @name        jtb corp web label items custom
// @namespace   english
// @description    jtb corp web label items custom.
// @include     http*://*jtbcorporate.com.au*
// @version     1.9
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557705/jtb%20corp%20web%20label%20items%20custom.user.js
// @updateURL https://update.greasyfork.org/scripts/557705/jtb%20corp%20web%20label%20items%20custom.meta.js
// ==/UserScript==

// Main - CSS added to header 
/*
Add CSS
*/

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '         html .w3eden .mr-3 {/*\n*/  height: 20px;/*\n*/  border: solid 5px #933305;/*\n*/  height: 35px;/*\n*/  width: 35px;/*\n*/  text-align: center;/*\n*/  font-weight: bold;/*\n*/}  .jtbhide{display:inline-block !important ;position: relative;  top: -25px;}          ';
document.getElementsByTagName('head')[0].appendChild(style);





function jcorplabelcustom(){
 const elements = document.querySelectorAll(".mr-3");

    elements.forEach((el, index) => {
        el.innerHTML = index + 1; // numbers 1, 2, 3, ...
    });


}



document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".mr-3");

    elements.forEach((el, index) => {
        el.innerHTML = index + 1; // numbers 1, 2, 3, ...
    });
});




 setTimeout(() => { jcorplabelcustom(); }, 888);

