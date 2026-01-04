// ==UserScript==
// @name         yandex.ru scroll Bar 2.1.1
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  yandex.ru scroll Bar and dark theme
// @author       gullampis810
// @match        https://yandex.ru/*
// @match        https://market.yandex.ru/*
// @icon         https://cdn-icons-png.freepik.com/256/7664/7664374.png?semt=ais_white_label 
// @downloadURL https://update.greasyfork.org/scripts/555437/yandexru%20scroll%20Bar%20211.user.js
// @updateURL https://update.greasyfork.org/scripts/555437/yandexru%20scroll%20Bar%20211.meta.js
// ==/UserScript==




(function() {
    'use strict';

 // Функция для добавления стилей
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `

 :hover::-webkit-scrollbar {
     width: 5px !important;

 }
 ::-webkit-scrollbar {
     background-color: #18181a !important;
     width:  35px !important;
 }
 ::-webkit-scrollbar-thumb {
     background-color: #52355a !important;
     border: 2px solid #5aa79d ;
    border-radius: 22px !important;
 }
 ::-webkit-scrollbar-thumb:hover {
     background-color: #93719c !important;
     border: 2px solid #5aa79d ;

 }

        `;
        document.head.appendChild(style);
    }

    // Выполняем добавление стилей после полной загрузки страницы
    window.addEventListener('load', addCustomStyles);

})();


(function() {
    const css = `

/*------- ds-light   -------*/

.ds-light, :root {
/*------ фон ------*/
--bg-primary: #3d3d3d  !important;
    --bg-tertiary: #595950  !important;
    /*------ фон ------*/
      --text-invert-primary: #dad6a5  !important;

    --bg-floating: #717042  !important;
    --bg-floating-invert: #191817  !important;
    --bg-invert: #191817  !important;
    --bg-invert-primary: #191817  !important;
    --bg-invert-tertiary-static: hsla(0, 0%, 100%, 0.459)  !important;

   /*--- задний фон рамки для товара */
    --bg-secondary-static: #d57f2900 !important;
   /*--- задний фон рамки для товара */

    --bg-plus: #34723e  !important;
    --bg-positive-muted: #7ea47c  !important;
    --bg-primary-fade-start: hsla(0,0%,100%,0)  !important;
    --bg-primary-transparent: hsl(0deg 0% 98.27% / 69%)  !important;
    --bg-progressBar: rgba(49,34,12,0.161)  !important;
    --bg-promo-muted: #fbe9d9  !important;
    --bg-sale: #fa3e2c  !important;
    --bg-sale-muted: #fce8e3  !important;
    --bg-secondary: #dad6a52e  !important;
    --bg-secondary-alt: #21a92e  !important;

    --bg-secondary-transparent: hsla(0,0%,100%,0.698)  !important;
     --bg-warning: rgba(212,102,38,0.102)  !important;
    --border-button-primary: #fff  !important;
    --border-primary: rgba(49,34,12,0.161)  !important;
    --control-black: #d0b156  !important;
    --control-primary: #fd0  !important;
    --control-primary-ultima: #3d3c3a  !important;

    --control-secondary: rgba(68,45,13,0.078)  !important;
    --control-secondary-inverted: hsla(0,0%,100%,0.149)  !important;
    --control-secondary-inverted-static: hsla(0,0%,100%,0.149)  !important;
    --divider-card: #f5f3f1  !important;
    --divider-primary: rgba(68,45,13,0.078)  !important;
    --iconFilled-secondary: rgba(31,25,17,0.439)  !important;
    --iconFilled-secondary-static: rgba(31,25,17,0.439)  !important;
    --link-primary: #6c84cb  !important;
    --price-sale: #ba2528  !important;
    --price-term: #006933  !important;
    --pullIndicator: #dedbd7  !important;

    --tab-inactive: #a1875c  !important;
    --text-error: #fc5230  !important;
    --text-favorite: #fa6a3c  !important;
     --text-invert-primary-static: #eafff0  !important;
    --text-invert-secondary: hsl(59.68deg 60.5% 72.09% / 75%)  !important;
    --text-invert-secondary-static: hsl(0deg 0% 100% / 69.8%)  !important;
    --text-invert-tertiary-static: hsl(0deg 0% 100% / 45.9%)  !important;

     --text-secondary: rgb(218 214 165)  !important;
    --text-secondary-solid: #7497bb  !important;

    --text-secondary-static: rgb(56 224 33 / 51%)  !important;
    --text-primary: #dad6a5  !important;
    --text-primary-static: #000000  !important;
      --tab-active: #3d3c3a  !important;
    --text-rating: #b0824a  !important;
    --text-success: #12993b  !important;
    --text-ultima: #b0824a  !important;
    --text-warning: #f76916  !important;
}



/*------- ds-light hover -------*/
.ds-light, :root {
   --text-secondary-hover-pressed: #47d964  !important;
    --text-primary-hover-pressed: #ff5226  !important;
    --text-invert-primary-disabled: hsla(0,0%,100%,0.4)  !important;
    --text-invert-primary-hover-pressed: hsl(60deg 19.12% 43.5%)  !important;
    --text-invert-secondary-hover-pressed: hsl(53.88deg 79.95% 63.87% / 45%)  !important;
    --text-primary-disabled: rgba(48, 23, 23, 0.555)  !important;

    --bg-primary-hover: rgba(80,52,11,0.039)  !important;
    --bg-primary-pressed: rgba(68,45,13,0.078)  !important;
    --border-primary-active: #e8e488  !important;
    --border-primary-hover: rgb(128 243 241 / 52%)  !important;
    --control-black-hover: #d8aae3  !important;
    --control-black-pressed: #191817  !important;
     --control-secondary-pressed: rgba(49,34,12,0.161)  !important;
    --control-primary-ultima-hover: #2a2927  !important;
    --control-primary-ultima-pressed: #191817  !important;
    --control-secondary-disabled: rgba(80,52,11,0.039)  !important;
    --control-secondary-hover: rgba(59,40,12,0.122)  !important;
    --control-secondary-inverted-hover: hsla(0,0%,100%,0.169)  !important;
    --control-secondary-inverted-pressed: hsla(0,0%,100%,0.2)  !important;

     --control-primary-disabled: #fdee70  !important;
    --control-primary-hover: #fcd604  !important;
    --control-primary-pressed: #fcd006  !important;
     --bg-secondary-hover: #7e7e6a  !important;
    --bg-secondary-pressed:rgba(252, 207, 6, 0.45)  !important;
}


    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);


})();






