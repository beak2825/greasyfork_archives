// ==UserScript==
// @name         Market yandex - Darkmode  (no FOUC - no delay !!!)
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @license      MIT
// @description  Market yandex - Darkmode// @author       gullampis810 
// @match        https://market.yandex.ru/*
// @icon         https://cdn-icons-png.freepik.com/256/7664/7664374.png
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555710/Market%20yandex%20-%20Darkmode%20%20%28no%20FOUC%20-%20no%20delay%20%21%21%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555710/Market%20yandex%20-%20Darkmode%20%20%28no%20FOUC%20-%20no%20delay%20%21%21%21%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.documentElement.style.visibility = "hidden";

  const css = `

.ds-light, :root {
 
/*------- ds-light   -------*/ 
.ds-light, :root {
/*------ фон ------*/
--bg-primary: #181921  !important;
    --bg-tertiary: #2a3539  !important;
 /*---------- ЦВет фона кнопок -----------*/
      --text-invert-primary: #3bb869  !important;
 /*---------- ЦВет фона кнопок -----------*/

 /*------ основной цвет текста страницы ------*/
 --text-primary: #c6c6b8  !important;
 /*------ основной цвет текста страницы ------*/

    --bg-floating: #2c2e3c  !important;

    --bg-floating-invert: #191817  !important;
    --bg-invert: #191817  !important;
    --bg-invert-primary: #191817  !important;
    --bg-invert-tertiary-static: hsla(0, 0%, 100%, 0.459)  !important;

   /*--- ЦВет float фона Информация доставки кнопки купить ,в корзину  */
   --bg-secondary: #93a4c830  !important;
   /*--- ЦВет фона Информация доставки кнопки купить ,в корзину  */

 /*-------- ЦВет фона primary кнопок  -------- */ 
    --control-black: #3c4257  !important;
    --control-primary: #697196  !important;
 /*-------- ЦВет фона primary кнопок  -------- */ 
    
   /*--- ЦВет фона рамки для товара */
    --bg-secondary-static: #d57f2900 !important;
   /*--- ЦВет фона рамки для товара */

    --bg-plus: #34723e  !important;
    --bg-positive-muted: #7ea47c  !important;
    --bg-primary-fade-start: hsla(0,0%,100%,0)  !important;
    --bg-primary-transparent: hsl(0deg 0% 98.27% / 72%)  !important;
    --bg-progressBar: rgb(49 34 12 / 62%)  !important;
    --bg-promo-muted: #fbe9d9  !important;
    --bg-sale: #fa3e2c  !important;
    --bg-sale-muted: #fce8e3  !important;
    
 /*--------- Фон цвет для loading загрузка анимация ------------- */
     --bg-secondary-alt: #ffe1608f  !important;
 /*--------- Фон цвет для loading загрузка анимация ------------- */


    --bg-secondary-transparent: hsla(0,0%,100%,0.698)  !important;
     --bg-warning: rgba(212,102,38,0.102)  !important;
    --border-button-primary: #fff  !important;

    --border-primary: rgb(129 128 109 / 97%)  !important;

  

    --control-primary-ultima: #cc9d40  !important;
   /*---- какой то оверлэй для кнопок -----
   ------ control-secondary применяется также к картинкам товаров -----
    ----- сохраняем видимость НО с прозрачностью !!!  -------- */
    --control-secondary: rgb(67 99 118 / 26%)  !important;

    --control-secondary-inverted: hsla(0,0%,100%,0.149)  !important;
    --control-secondary-inverted-static: hsla(0,0%,100%,0.149)  !important;
    --divider-card: #f5f3f1  !important;
    --divider-primary: rgba(68,45,13,0.078)  !important;
    --iconFilled-secondary: rgba(31,25,17,0.439)  !important;
    --iconFilled-secondary-static: rgba(31,25,17,0.439)  !important;
    --link-primary: #d99e4d  !important;
    --price-sale: #ba2528  !important;
    --price-term: #006933  !important;
    --pullIndicator: #dedbd7  !important;

    --tab-inactive: #a1875c  !important;
    --text-error: #fc5230  !important;
    --text-favorite: #fa6a3c  !important;
     --text-invert-primary-static: #eafff0  !important;
    --text-invert-secondary: hsl(0deg 0% 0% / 75%)  !important;
    --text-invert-secondary-static: hsl(0deg 0% 100% / 69.8%)  !important;
    --text-invert-tertiary-static: hsl(0deg 0% 100% / 45.9%)  !important;

    --text-secondary: #7c9fb3  !important;
    --text-secondary-solid: #41b472  !important;
   
 /*--------- для кнопок ------------- */
    --text-secondary-static: rgb(250 255 96 / 29%)  !important;
  /*--------- для кнопок ------------- */

 /*-------- ЦВет фона primary Корзина,каталог, SVG BTTNS кнопок  -------- */  
    --text-primary-static: #171a2c  !important;
 /*-------- ЦВет фона primary Корзина,каталог, SVG BTTNS кнопок  -------- */  

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
    --text-primary-disabled: rgb(255 0 0 / 0%)  !important;

    --bg-primary-hover: rgba(80,52,11,0.039)  !important;
    --bg-primary-pressed: rgba(68,45,13,0.078)  !important;
    --border-primary-active: #e8e488  !important;
    --border-primary-hover: rgb(128 243 241 / 52%)  !important;
   
    --control-black-pressed: #191817  !important;
     --control-secondary-pressed: rgba(49,34,12,0.161)  !important;
    --control-primary-ultima-hover: #2a2927  !important;
    --control-primary-ultima-pressed: #191817  !important;
    --control-secondary-disabled: rgba(80,52,11,0.039)  !important;

/*------- Подсветка кнопок hover он же control-secondary -------*/
    --control-black-hover: #245654  !important;
    --control-secondary-hover: rgb(255 237 120 / 31%)  !important;
 /*------- Подсветка кнопок hover --------
    ------- он же control-secondary -------*/

    --control-secondary-inverted-hover: hsla(0,0%,100%,0.169)  !important;
    --control-secondary-inverted-pressed: hsla(0,0%,100%,0.2)  !important;

     --control-primary-disabled: #fdee70  !important;
 /*------- Подсветка кнопок primary hover --------*/
    --control-primary-hover: #9f9cffa6  !important;
  /*------- Подсветка кнопок primary hover --------*/

 
    --control-primary-pressed: #fcd006  !important;
 
/*------- Подсветка кнопок hover он же control-secondary -------*/ 
     --bg-secondary-hover: #52608391  !important;
 /*------- Подсветка кнопок hover он же control-secondary -------*/

    --bg-secondary-pressed:rgba(252, 207, 6, 0.45)  !important;
} 

  `;

  GM_addStyle(css);
  document.documentElement.classList.add('ds-light');

  requestAnimationFrame(() => {
    document.documentElement.style.visibility = "";
  });
})();
