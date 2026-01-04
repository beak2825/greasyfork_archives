// ==UserScript==
// @name           create Grok better Css
// @version        3.11
// @license        MIT
// @description    better Css   Grok
// @match          https://grok.com/*
// @match          https://grok.com/c/*
// @match          https://grok.com/c/*
// @match          https://grok.com/history/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @grant          GM_addStyle
// @namespace https://greasyfork.org/users/594536
// @downloadURL https://update.greasyfork.org/scripts/554581/create%20Grok%20better%20Css.user.js
// @updateURL https://update.greasyfork.org/scripts/554581/create%20Grok%20better%20Css.meta.js
// ==/UserScript==


/*======================   grok =========================*/

 (function() {
    'use strict';

    // Ваш CSS-код: замените содержимое строки ниже на свой.
    // Удалите пример от /* Базовые стили */ до последней } и вставьте свои правила.
    // Для hover/фона: добавьте !important и селекторы вроде body .chat-message:hover.
    var customCSS = `   
    
* {
    scrollbar-color: auto !important;
    scrollbar-width: auto !important;   
}

 .overflow-hidden.relative {
     scrollbar-color: auto !important;
    scrollbar-width: auto !important;   
}



:root{
    scrollbar-width: none   !important;
}

.not-prose {
     scrollbar-color: auto  !important;
    scrollbar-width: auto !important; /* Переопределяем scrollbar-width: */
 }

 
 
/* Отключение scrollbar-gutter, если оно мешает */
.scrollbar-gutter-stable,
.scrollbar-gutter-stable-single {
    scrollbar-gutter: auto !important; /* Отключаем принудительный gutter */
    scrollbar-color: auto  !important;
} 

 code   {
    scrollbar-color: auto  !important;
    scrollbar-width: auto !important; /* Переопределяем scrollbar-width: thin */
    scrollbar-color: #c1a5ef #205151 !important; /* Цвета для Firefox */
} 
 ::-webkit-scrollbar {
    width: 27px !important; 
    background-color: #c1a5ef00 !important; 
}
 ::-webkit-scrollbar-thumb {
    user-select: none !important; 
    cursor: context-menu !important;
    background-color: #c1a5ef  !important; 
    border-radius: 15px !important;
    border: 3px solid #4f3e6a ;
    height: 125px !important;
}

 ::-webkit-scrollbar-thumb:hover { 
    background-color: #5f968c !important;
 }

 ::-webkit-scrollbar-track {
    background: #22c2c200  !important;
    border-radius: 18px !important;
     
}
 ::-webkit-scrollbar-corner {
    background: transparent !important;
}  

 .flex.h-full.w-full.flex-col.bg-sidebar.group-data-\[variant\=floating\]\:rounded-xl {
    background: linear-gradient(rgba(22, 63, 55, 0.36), rgba(19, 52, 67, 0.28), 65%, rgba(28, 16, 33, 0.35), 99%, rgba(39, 176, 164, 0.24)) !important;
    border-right: 5px solid rgb(67, 171, 180) !important;
    cursor: none !important;
}

.peer\/menu-button.flex.items-center.gap-2.overflow-hidden.rounded-xl.text-left.outline-none.ring-sidebar-ring.transition-\[width\,height\,padding\].focus-visible\:ring-1.group-has-\[\[data-sidebar\=menu-action\]\]\/menu-item\:pr-8.\[\&\>span\:last-child\]\:truncate.\[\&\>svg\]\:shrink-0.hover\:text-primary.text-sm.h-\[36px\].border-transparent.hover\:bg-button-ghost-hover.data-\[state\=open\]\:hover\:bg-button-ghost-hover.active\:bg-button-ghost-active.data-\[active\=true\]\:bg-button-ghost-active.aria-expanded\:bg-button-ghost-hover.w-full.flex.flex-row.justify-start.gap-1.bg-background.text-primary.text-sm.rounded-xl.group\/sidebar-item.transition-colors.p-\[0\.375rem\].border-transparent {
    background: #3c2c50 !important;
    border: 2px solid !important;
    color: #cdb4e2 !important;
}

button.peer\/menu-button.flex.items-center.gap-2.overflow-hidden.text-left.outline-none.ring-sidebar-ring.transition-\[width\,height\,padding\].focus-visible\:ring-1.group-has-\[\[data-sidebar\=menu-action\]\]\/menu-item\:pr-8.\[\&\>span\:last-child\]\:truncate.\[\&\>svg\]\:shrink-0.hover\:text-primary.text-sm.hover\:bg-button-ghost-hover.data-\[state\=open\]\:hover\:bg-button-ghost-hover.active\:bg-button-ghost-active.data-\[active\=true\]\:bg-button-ghost-active.aria-expanded\:bg-button-ghost-hover.flex-1.px-\[7px\].rounded-full.border.border-border-l1.bg-surface-l1.justify-start.text-primary.h-\[2\.5rem\].mx-\[\.125rem\] {
    background: #3c2c50 !important;
    border: 2px  solid !important;
    color: #cdb4e2 !important;
} 
/*-------- settings  slot="button ---------*/
button[data-slot="button"] {
    background: #3c2c50 !important;
    border: 2px solid !important;
    color: #cdb4e2 !important;
} 

/* Home Side bar:  содержащей историю чатов и закрепленные чаты */
/* ------------ история чатов и закрепленные чаты ---------------*/
.data-\[side\=right\]\:slide-in-from-left-2[data-side="right"] {
    background: linear-gradient(180deg, rgb(36, 23, 48),  #094e5c ) !important;
    border: 2px solid  rgb(99, 185, 167) !important; 
    border-radius: 35px !important;   
}
/* ------------ история чатов и закрепленные чаты ---------------*/ 
.flex.flex-row.px-4.py-2.h-10.items-center.rounded-t-xl.bg-surface-l1.border.border-border-l1 {
    background: #cfb252 !important;
    color: black !important;
 }
/* ------ новый селектор для markdown js --------*/
.flex.flex-row.px-4.py-2.h-10.items-center.rounded-t-xl.bg-surface-l2.border.border-border-l1 {
    background: #cfb252 !important;
    color: black !important;
 }
 
 pre.shiki.slack-dark {
            background: rgb(34 34 34) !important;
 } 

@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}
 

 .group\/sidebar-wrapper.flex.min-h-svh.w-full.has-\[\[data-variant\=inset\]\]\:bg-sidebar.isolate {
     background: linear-gradient(180deg, rgb(26 17 34), rgb(13 24 24)) !important;
} 
body {
    background: linear-gradient(180deg, rgb(26 17 34), rgb(13 24 24)) !important;
} 

.message-bubble.relative  {
    background: linear-gradient(360deg, rgb(38, 24, 52), rgb(24, 61, 79)) !important;
    border-radius: 22px !important; 
    border-radius: 22px !important;
    border: 2px solid #549e92 !important; 
}
 
.relative.group.flex.flex-col.justify-center.w-full.max-w-\[var\(--content-max-width\)\].pb-0\.5.items-start {
    background: linear-gradient(1deg, rgb(11 34 61),  rgb(68 44 63), rgb(14 41 37)) !important;
}  
 
.ps-11:not(:is(:lang(ae),:lang(ar),:lang(arc),:lang(bcc),:lang(bqi),:lang(ckb),:lang(dv),:lang(fa),:lang(glk),:lang(he),:lang(ku),:lang(mzn),:lang(nqo),:lang(pnb),:lang(ps),:lang(sd),:lang(ug),:lang(ur),:lang(yi))) {
    
    border:  2px solid rgb(72, 207, 163) !important; 
    background: linear-gradient(360deg, rgb(36, 23, 48), rgb(18, 51, 63)) !important;
     border-radius: 30px !important;
}
.rounded-t-\[var\(--border-t-radius\)\].rounded-b-\[var\(--border-b-radius\)\].query-bar.group.z-10.bg-surface-l1.ring-border-l1.hover\: ring-border-l1.focus-within\:ring-border-l1.hover\:focus-within\:ring-border-l1.relative.w-full.overflow-hidden.\@container\/input.shadow-sm.max-w-breakout.ring-1.ring-inset.focus-within\:ring-1.pb-0.shadow-black\/5 {
    border: 2px solid rgb(72, 207, 163) !important;
    background: linear-gradient(360deg, rgb(36, 23, 48), rgb(18, 51, 63)) !important; 
}
.rounded-t-\[var\(--border-t-radius\)\].rounded-b-\[var\(--border-b-radius\)\].query-bar.group.z-10.bg-surface-l1.ring-border-l1.hover\:ring-border-l1.focus-within\:ring-border-l1.hover\:focus-within\:ring-border-l1.relative.w-full.overflow-hidden.\@container\/input.shadow-sm.max-w-breakout.ring-1.ring-inset.focus-within\:ring-1.pb-0.shadow-black\/5.input-visible {
    border:  2px solid rgb(72, 207, 163) !important; 
    background: linear-gradient(360deg, rgb(36, 23, 48), rgb(18, 51, 63)) !important;
    border-radius: 30px !important;
} 
.ps-11:not(:is(:lang(ae),:lang(ar),:lang(arc),:lang(bcc),:lang(bqi),:lang(ckb),:lang(dv),:lang(fa),:lang(glk),:lang(he),:lang(ku),:lang(mzn),:lang(nqo),:lang(pnb),:lang(ps),:lang(sd),:lang(ug),:lang(ur),:lang(yi))) {
   border-radius: 30px !important;
}

/*----------- input chat grok textarea   -------------------*/
.query-bar.group.z-10.bg-surface-l2.ring-border-l1.hover\:ring-border-l2.focus-within\:ring-border-l2.hover\:focus-within\:ring-border-l2.relative.w-full.overflow-hidden.\@container\/input.shadow.shadow-black\/5.max-w-breakout.ring-1.ring-inset.focus-within\:ring-1.pb-12.px-2.\@\[480px\]\/input\:px-3.rounded-3xl {
    border: 2px solid #48cfa3 !important;
    background: linear-gradient(360deg, #241730, #12333f) !important;
} 
/*-------------- input chat grok textarea   -------------------*/ 

/*---------- какойто очередной говноселектор под инпут Inputchat text ----------*/
.chat-input-backdrop.w-full.h-full.bg-gradient-to-b.from-surface-base.via-surface-base\/94.to-surface-base\/80 {
    border: 2px solid #48cfa3 !important;
    background: linear-gradient(360deg, #241730, #12333f) !important;
    display: none  !important;
}
/*---------- какойто очередной говноселектор под инпут Inputchat text ----------*/


/*--------------- скрыть кнопку поделитьс ссылкой "скачать приложение грок" ----------*/

 /*-------------------------- "Войти в голосовой режим" ----------------------------*/
button.group.flex.flex-col.justify-center.rounded-full.focus\:outline-none.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring {
    z-index: 100000 !important;
    position: relative !important;
} /*-------------------------- "Войти в голосовой режим" ----------------------------*/
 
/*--- список чатов_история Hover Chat bttn ----- */
.flex.cursor-pointer.items-center.gap-2.px-3.col-start-1.col-end-2.row-start-1.row-end-2:hover {
    background: #61ebe638 !important;
    border-radius: 10px !important;
    border: 1px solid #87e5d6  !important;
}
 /*--- список чатов история граница левый border ----- */
.border-l.border-border-l1.h-full.ms-\[10px\].me-\[4px\] {
    border: #cdb4e2 1px solid  !important;
} /*--- список чатов история граница левый border ----- */ 
/*--------- выделение и ответ на сообщение респонс стили контейнера --------- */ 
.rounded-t-\[var\(--border-t-radius\)\].rounded-b-\[var\(--border-b-radius\)\].query-bar.group.z-10.bg-surface-l1.ring-border-l1.hover\:ring-border-l1.focus-within\:ring-border-l1.hover\:focus-within\:ring-border-l1.relative.w-full.overflow-hidden.\@container\/input.shadow-sm.max-w-breakout.ring-1.ring-inset.focus-within\:ring-1.pb-0.shadow-black\/5 {
    background: linear-gradient(360deg, #2e1e35,#201427, #3e2c4a) !important;
    border: 1px solid #af9abe !important;
    border-radius: 18px !important;
}
.flex.justify-between.items-start.pl-4.pr-2.py-2.w-full.bg-input.backdrop-blur-lg.ring-1.ring-input-border.ring-inset.focus-within\:ring-input-border-focus.focus-within\:bg-input-hover.hover\:ring-\[rgba\(0\,0\,0\,0\.1\)\].hover\:bg-input-hover.pointer-events-auto.rounded-t-\[16px\].rounded-b-\[6px\] {
    background-color: rgb(59 47 68)  !important; 
    border-radius: 22px !important;
    border: 2px solid rgb(205, 180, 226)   !important;
}
 
span.text-sm.line-clamp-3.whitespace-pre-wrap.text-fg-secondary\/80 { 
    color: rgb(180 226 184) !important; 
}


.mb-3.text-sm.text-secondary.whitespace-pre-wrap.flex.items-start.bg-surface-l2.dark\:bg-surface-l1.rounded-lg.px-3.py-2 {
     color: rgb(180 226 184) !important; 
    background-color: rgb(59 47 68)  !important;
    border-width: 2px  !important;
    border-style: solid;
    border-color: rgb(205, 180, 226)  !important; 
    
}
/*--------- выделение и ответ на сообщение респонс стили контейнера --------- */  

/* ==================== grok_send_it_button ==================== */
button.group.flex.flex-col.justify-center.rounded-full.focus\:outline-none.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring {
    z-index: 100000 !important;
}
/* ====================кнопка оптравить файЛ button#radix-button-trigger ==================== */
button[id*="radix"] {
    z-index: 100000 !important;
}
button#radix-_r_7h_ {
    z-index: 100000 !important;
    position: relative !important;
}
.flex.gap-1\.5.absolute.inset-x-0.bottom-0.border-2.border-transparent.p-2.\@\[480px\]\/input\:p-2.max-w-full {
    z-index: 100000 !important;
    position: relative !important;
}
/* ==================== grok_send_it_button ==================== */


 
/*------- глобальные стили для всех кнопок на странице  ---------*/
button.inline-flex,#sidebar-x7xnu9-home-Toggle-Btn :hover {
    background-color: #765a86 !important;
    opacity: 1;
}

/*---- ширина хоум СайдБар ----- */
.group.peer.md\:block.text-sidebar-foreground.z-\[40\].print\:hidden {
   --sidebar-width: 310px !important; 
} 
/*---- ширина хоум СайдБар ----- */

/*-----------   copy, edit, bttna ------------*/
button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.text-sm.font-medium.leading-\[normal\].cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.text-fg-secondary.hover\:text-fg-primary.hover\:bg-button-ghost-hover.disabled\:hover\:text-fg-secondary.disabled\:hover\:bg-transparent.\[\&_svg\]\:hover\:text-fg-primary.h-8.w-8.rounded-full.opacity-0.group-focus-within\:opacity-100.group-hover\:opacity-100.\[\.last-response_\&\]\:opacity-100.disabled\:opacity-0.group-focus-within\:disabled\:opacity-60.group-hover\:disabled\:opacity-60.\[\.last-response_\&\]\:disabled\:opacity-60 {
   
    z-index: 100000 !important;
}
/*-----------   copy, edit, bttna ------------*/


button.inline-flex,#sidebar-x7xnu9-home-Toggle-Btn { 
    background-color: rgb(60 44 80) !important; 
    border: 2px solid #cdb4e2 !important;
    color: #cdb4e2 !important;
    border-radius: 35px !important;
}
 
button.inline-flex[class*="items-center"][class*="justify-center"] { 
    background-color: rgb(60 44 80)  ; 
    border: 2px solid #cdb4e2  ;
    color: #cdb4e2 !important;
}  
.absolute.bg-surface-l2.p-1.rounded-full.shadow-lg.ring-border-l1.ring-1.ring-inset.z-50.flex.items-center.gap-1 {
    background-color: rgb(60 44 80)  ; 
    border: 2px solid #cdb4e2  ;
    color: #cdb4e2 !important;
}
  button:hover {
    background-color: rgb(80, 60, 100) !important;  
    color: #cdb4e2 !important;
    border-radius: 35px !important;
}
button.inline-flex.custom-x8548-pin-5r8je5j84-button:hover {
  background-color: #44efef86 !important;
  border: 2px solid transparent !important;
   color: #154652 !important;
}
button.inline-flex.custom-x8548-pin-5r8je5j84-button {
  background-color: #ef4444 !important;
  border: 2px solid transparent !important;
   color: #e2b4b4 !important;
}
button.inline-flex.custom-x8548-pin-5r8je5j84-button.pinned {
  background-color: #10b981 !important;
    color: #0c3d10 !important;
}

/*------- глобальные стили для всех кнопок на странице  ---------*/ 

/* =============  ПОДНИМАЕМ ПРИОРИТЕТ Z-INDEX_КОНТЕЙНЕРВ INPUT ВВОДА ЧАТА ОТПРАВИТЬ ============= */
/* ============= очердной БАГ С КОНТЕЙНЕРОМ ввода ЧАТА ОТПРАВИТЬ ============= */ 
 .absolute.inset-x-0.bottom-0.mx-auto.max-w-breakout.z-40.print\:hidden {
    z-index: 100000 !important; 
} 
 
/* =============  ПОДНИМАЕМ ПРИОРИТЕТ Z-INDEX_КОНТЕЙНЕРВ INPUT ВВОДА ЧАТА ОТПРАВИТЬ ============= */ 
/* ============= очердной БАГ С КОНТЕЙНЕРОМ ввода ЧАТА ОТПРАВИТЬ ============= */  
/*===== ПОТОМУ ЧТО КНОПКА ДОЧЕРНИЕ КОМПОНЕНТЫ ПРОСВАЧИВАЮТСЯ СКВОЗЬ  INPUT ВВОДА ЧАТА ОТПРАВИТЬ ======== */ 

button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.font-medium.cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:opacity-60.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.text-fg-secondary.hover\:text-fg-primary.disabled\:hover\:text-fg-secondary.bg-surface-l1.dark\:bg-surface-l2.dark\:hover\:bg-surface-l3.hover\:bg-surface-l4-hover.disabled\:hover\:bg-surface-l1.dark\:disabled\:hover\:bg-surface-l2.h-8.rounded-xl.px-3.text-xs {
    position: relative !important;
    top: 1px !important;
}
 
button.inline-flex.items-center.justify-center svg.lucide-play {
    display: none !important;
}
button.inline-flex.items-center.justify-center span:contains("Исполнить") {
    display: none !important;
}

/* ==================== collapse-all-grok-btn ==================== */
button.collapse-all-grok-btn {
    background: linear-gradient(90deg, #294643 0%, #143936 100%) !important; 
    transition: background-position 0.3s ease, background 0.3s ease, box-shadow 0.3s ease !important;
    background-position: 30% 50% !important;
    padding: 10px 20px !important;
    border: 3px solid #3b867d !important;
    color: white !important;
    cursor: pointer !important;
    filter: brightness(100%) !important;
    z-index: 100000 !important;
}


 button.collapse-grok-btn {
    left: 146px;
    top: 56px;
    position: absolute;
    padding: 2px 8px; 
    background-color: rgb(34 85 80);
    color: rgb(110, 227, 206);
    border: 2px solid;
    border-radius: 9px;
    font-size: 12px;
    font-family: 'Inter';
    height: 35px;
    display: inline-flex;
    align-items: center;
 } 
button.collapse-all-grok-btn:hover {
    background-position: 100% 50% !important;
    filter: brightness(150%) !important; /* Увеличивает яркость на 20% */
    box-shadow: 0 0 8px rgb(38 179 78 / 60%) !important; /* Легкое свечение */
}
 
   
.border-border-l2.border.bg-surface-l1.px-4.py-2.w-fit.truncate.rounded-full {
     white-space: normal !important;  
     word-wrap: break-word !important;  
     border: 2px solid #00807a  !important;  
     border-radius: 15px  !important;  
}
.border-border-l2.border.bg-surface-l1.px-4.py-2.rounded-3xl { 
    white-space: normal !important;  
     word-wrap: break-word !important;  
     border: 2px solid #00807a  !important;  
     border-radius: 15px  !important;  
    }
 .border-border-l2.border.bg-surface-l1.px-4.py-2.truncate.rounded-full { white-space: normal !important;  
     word-wrap: break-word !important;  
     border: 2px solid #00807a  !important;  
     border-radius: 15px  !important;                                                                   
}
/* ---------------- увеличение высоты   для   imagig image grok ------------------ */


 /* --------------- текст вверху tooltip подсветка текста кнопки ------------------ */
/* ---------- grok_buttn_paste_javascript_input symbol ------------------ */
 

span.tooltip-text.absolute.transform.-translate-x-1\/2.px-3.py-1.text-sm.text-black.bg-white.rounded-md.shadow-md.pointer-events-none.whitespace-nowrap {
    position: fixed  !important; 
    left: 350px !important; 
    top: 320px  !important; 
}

span.tooltip-text.absolute.transform.-translate-x-1\/2.px-3.py-1.text-sm.text-black.bg-white.rounded-md.shadow-md.pointer-events-none.whitespace-nowrap {
    
    font-weight: 500 !important;
    font-size: 17px !important;
    z-index: 100000 !important;
    pointer-events: none !important;
    border-width: 2px;
    border-style: solid; 
    border-image: initial;
    padding: 7px 8px !important;
    border-radius: 8px !important;
    white-space: nowrap !important;
     background-color: rgb(36, 75, 70) !important;
    color: rgb(112, 189, 170) !important;
     border-color: rgb(112, 189, 170)  !important;
}
/* --------------- текст вверху tooltip подсветка текста кнопки ------------------ */
/* ---------- grok_buttn_paste_javascript_input symbol ------------------ */



/* ========== grok прозрачный фон какого то backdropfilter которого там нет а просто серый уродливый блок ==================== */

/*------ КНОПКА SCROLLING ЧАТ В НИЗ сдвигаем кнопку прокрутки вправо ------*/
 /*------ КНОПКА SCROLLING ЧАТ В НИЗ сдвигаем кнопку прокрутки вправо ------*/

 button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.text-sm.font-medium.leading-\[normal\].cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:opacity-60.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.bg-surface-l2.text-fg-secondary.hover\:bg-surface-l4-hover.dark\:hover\:bg-surface-l3.border.border-border-l1.disabled\:hover\:bg-surface-l2.dark\:disabled\:hover\:bg-surface-l2.h-8.w-8.rounded-full.shadow-sm {
    color: #aafff2 !important;
    border-color: #aafff2  !important;
    border: 2px solid #aafff2  !important;
    position: relative !important;
    top: 50px !important;
    left: 170px  !important;
}
  /*------ КНОПКА SCROLLING ЧАТ В НИЗ сдвигаем кнопку прокрутки вправо ------*/


.query-bar.group.z-10.bg-surface-l2.ring-border-l1.hover\:ring-border-l2.focus-within\:ring-border-l2.hover\:focus-within\:ring-border-l2.relative.w-full.overflow-hidden.\@container\/input.shadow.shadow-black\/5.max-w-breakout.ring-1.ring-inset.focus-within\:ring-1.pb-12.px-2.\@\[480px\]\/input\:px-3.rounded-3xl {
    left: 30px !important;
} /*------ сдвигаем инпут   вправо ------*/


form.w-full.text-base.flex.flex-col.gap-2.items-center.justify-center.relative.z-10 {
    position: relative !important;
    bottom: 25px !important;
} /*------ поднимаем вверх форму ввода чата ------*/

  /* ==== grok прозрачный фон какого то backdropfilter которого там нет а просто серый уродливый блок ======= */
.chat-input-backdrop.absolute.bottom-0.h-10.w-full.bg-background {
    background: #892be200 !important;
    display: none !important;

} /*------ делаем прозрачный фон вместо фиолетового ------*/

/*------ убираем блок прозрачности который загораждает весь экран ------*/ 

.absolute.h-64.bottom-0.left-0.right-0.flex.flex-col {
    display: none !important;
}  
.w-full.flex.justify-start.px-gutter.sm\:justify-center.gap-2.pb-3.overflow-x-auto.max-w-breakout.no-scrollbar.absolute.inset-x-0.bottom-full.pointer-events-none {
    position: relative !important;
    top: 4px !important;
 }
button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:opacity-60.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.bg-surface-l2.text-fg-secondary.hover\:bg-surface-l4-hover.dark\:hover\:bg-surface-l3.border.border-border-l1.disabled\:hover\:bg-surface-l2.dark\:disabled\:hover\:bg-surface-l2.h-10.px-3\.5.py-1\.5.text-sm.rounded-full.font-semibold.pointer-events-auto.pe-7 {
    right: 45px !important;
    position: relative !important;
} /* /svg>Think Harder</button */
button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.text-sm.font-medium.leading-\[normal\].cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:opacity-60.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.text-secondary.bg-transparent.hover\:text-primary.disabled\:hover\:text-fg-secondary.h-8.w-8.absolute.translate-y-1.end-0.rounded-full.pointer-events-auto.opacity-50.hover\:opacity-100 {
     position: relative !important;
} 
.relative.group.flex.flex-col.justify-center.w-full.max-w-\[var\(--content-max-width\)\].pb-0\.5.items-start { 
    border: 2px solid #257f6b;
    border-radius: 18px;
    padding: 5px 5px;  
} 

.relative.group.flex.flex-col.justify-center.w-full.max-w-\[var\(--content-max-width\)\].pb-0\.5.items-start { 
    border: 2px solid #257f6b !important; 
    border-radius: 18px !important;
    padding: 5px 15px 15px  !important;
}

button.collapse-all-response-btn {
    z-index: 100000 !important;
}  


button.collapse-all-response-btn:hover {
    z-index: 100000 !important;
    background-position: 100% 50% !important;
    filter: brightness(130%) !important;  
    box-shadow: 0 0 8px rgb(38 157 179 / 60%) !important; 
}  

button.collapse-response-btn.collapse-response-btn:hover {
    background-position: 100% 50% !important;
    filter: brightness(130%) !important;  
    box-shadow: 0 0 8px rgb(38 157 179 / 60%) !important; 
}

button.collapse-grok-btn:hover {
    background-position: 100% 50% !important;
    filter: brightness(150%) !important;
    box-shadow: 0 0 8px rgb(38 157 179 / 60%) !important;
}
 
/* --------------- response кнопка свернуть ответы в чате AI grok ----------------- */ 

button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.font-medium.cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:opacity-60.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.border.border-border-l2.text-fg-primary.hover\:bg-button-ghost-hover.\[\&_svg\]\:hover\:text-fg-primary.disabled\:hover\:bg-transparent.h-10.px-3\.5.py-1\.5.text-sm.rounded-full {
    display: none !important;
} 
/*------- еще один Header родительский контейнер для кнопок перемещаем его что бы скрыть -------*/


.w-full.relative.\@container\/nav.z-\[25\].flex-shrink-0.print\:hidden {
    background: #28992254 !important;
    position: fixed  !important;
    top: -85px !important;
    right: -3px  !important;
}
/*------- еще один Header родительский контейнер для кнопок перемещаем его что бы скрыть -------*/

.h-16.top-0.\@\[80rem\]\/nav\:h-0.\@\[80rem\]\/nav\:top-8.absolute.z-10.flex.flex-row.items-center.justify-center.w-full.bg-gradient-to-b.from-background.via-background.via-80\%.to-transparent.\@\[80rem\]\/nav\:from-transparent.\@\[80rem\]\/nav\:via-transparent {
    background: #00ffff00  !important;
    position: relative  !important;
    top: 22px !important;
    right: -3px  !important; 
} 

/*----------- контейнер Кнопок  , кнопка новый чат, кнопка поделиться, кнопка задачи -----------*/
.absolute.flex.flex-row.items-center.gap-0\.5.ms-auto.end-3 {
    position: relative  !important;
    top: 95px !important;
    right: 12px  !important;
}
/*----------- контейнер Кнопок  , кнопка новый чат, кнопка поделиться, кнопка задачи -----------*/


/*------- цвет для кнопки "новый чат" что бы было видно -----------*/
a.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.text-sm.font-medium.leading-\[normal\].cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:opacity-60.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.text-fg-primary.hover\:bg-button-ghost-hover.disabled\:hover\:bg-transparent.border.border-transparent.h-10.w-10.rounded-full {
    background-color: #244b46 !important;
    color: #aafff2 !important;
     border-color: #aafff2  !important;
     border: 2px solid #aafff2  !important;  
     border-radius: 15px  !important;  
} 

/*------------ TOOLTIP ПОДСКАЗКИ ТЕКСТ СТИЛИ ФОН ЦВЕТ ------------*/
.overflow-hidden.rounded-md.bg-popover.shadow-sm.dark\:shadow-none.px-3.py-1\.5.text-xs.text-popover-foreground.pointer-events-none.max-w-80.text-wrap.animate-in.fade-in-0.zoom-in-95.data-\[state\=closed\]\:animate-out.data-\[state\=closed\]\:fade-out-0.data-\[state\=closed\]\:zoom-out-95.data-\[side\=bottom\]\:slide-in-from-top-2.data-\[side\=left\]\:slide-in-from-right-2.data-\[side\=right\]\:slide-in-from-left-2.data-\[side\=top\]\:slide-in-from-bottom-2 {
    border: 2px solid #aafff2  !important;
    border-radius: 15px  !important;
    background: #142f2d;
    color: #aafff2;
} 
 

.data-\[side\=top\]\:slide-in-from-bottom-2[data-side=top] {
     background-color: rgb(23 60 56) !important;
    color: rgb(206 243 239) !important;
    border: 2px rgb(99 185 167)  solid !important;
    border-radius: 12px !important;
}
 

.bg-surface-l3 {
   background-color: rgb(12 33 30) !important;
    color: rgb(47 132 123) !important;
    border: 2px solid !important;
    border-radius: 15px !important;
}
 

.data-\[side\=right\]\:slide-in-from-left-2[data-side=right]{
    background: linear-gradient(360deg, #241730, #12333f) !important; 
    border: 2px rgb(99 185 167)  solid !important;
    border-radius: 35px !important;
}

.dark\:border-border-l1:is(.dark *) {
   background: linear-gradient(360deg, #181021, #0c222a) !important; 
    color: #b0c4cc !important;
    border: 2px #55a9a0  solid !important;
    border-radius: 12px !important;
}

/*bug report chat response button*/
.data-\[side\=bottom\]\:slide-in-from-top-2[data-side=bottom] {
    color: #55a9a0  !important;
    border: 2px #55a9a0  solid !important;
    border-radius: 12px !important;
    background: #071b17  !important;
}

/*setting account*/
textarea#«rr0» {
    background: linear-gradient(360deg, #1b2a29, #091a1f) !important;
     color: #c5dce4 !important;
    border: 2px #55a9a0  solid !important;
    border-radius: 12px !important;
}

/*----------------- всплывающие popup menu с кнопками цвет фона ---------------------*/

/*----- закрепленые чаты кнопка название -------*/
/*----- закрепленые чаты кнопка название -------*/
.peer\/menu-button.flex.items-center.gap-2.overflow-hidden.rounded-xl.text-left.outline-none.ring-sidebar-ring.transition-\[width\,height\,padding\].focus-visible\:ring-1.group-has-\[\[data-sidebar\=menu-action\]\]\/menu-item\:pr-8.\[\&\>span\:last-child\]\:truncate.\[\&\>svg\]\:shrink-0.hover\:text-primary.text-sm.h-\[36px\].border-transparent.hover\:bg-button-ghost-hover.data-\[state\=open\]\:hover\:bg-button-ghost-hover.active\:bg-button-ghost-active.data-\[active\=true\]\:bg-button-ghost-active.aria-expanded\:bg-button-ghost-hover.w-full.flex.flex-row.justify-start.gap-1.bg-surface-base.text-primary.text-sm.rounded-xl.group\/sidebar-item.transition-colors.p-\[0\.375rem\].border-transparent {
    background-color: rgb(60 44 80) !important;
    border: 2px solid #cdb4e2 !important;
    color: #62d19c !important;
    border-radius: 35px !important;
}

/*----- закрепленые чаты кнопка название -------*/
/*----- закрепленые чаты кнопка название -------*/

/*---------- hover список чатов и закрепленные чаты ------------ */

.data-\[side\=bottom\]\:slide-in-from-top-2[data-side=bottom] {
    color: #55a9a0  !important;
    border: 2px #55a9a0  solid !important;
    border-radius: 12px !important;
    background: #071b17;
}

a.peer\/menu-button.flex.items-center.gap-2.overflow-hidden.rounded-xl.text-left.outline-none.ring-sidebar-ring.transition-\[width\,height\,padding\].focus-visible\:ring-1.group-has-\[\[data-sidebar\=menu-action\]\]\/menu-item\:pr-8.\[\&\>span\:last-child\]\:truncate.\[\&\>svg\]\:shrink-0.hover\:text-primary.text-sm.h-\[36px\].bg-button-ghost-hover.border-border-l1.hover\:bg-button-ghost-hover.data-\[state\=open\]\:hover\:bg-button-ghost-hover.active\:bg-button-ghost-active.data-\[active\=true\]\:bg-button-ghost-active.aria-expanded\:bg-button-ghost-hover.group\/sidebar-menu-item.pl-3.pr-1\.5.h-8.text-sm.w-full.flex.flex-row.items-center.gap-2.text-primary.focus\:outline-none.\!gap-1 {
    background: #19a19466;
    border: 2px solid #0a9a8d;
}

.hover\:text-primary:hover {
    background: #56edf43b !important;
    border: 2px solid #6dedfe80 !important;
}
  
a.peer\/menu-button.flex.items-center.gap-2.overflow-hidden.rounded-xl.text-left.outline-none.ring-sidebar-ring.transition-\[width\,height\,padding\].focus-visible\:ring-1.group-has-\[\[data-sidebar\=menu-action\]\]\/menu-item\:pr-8.\[\&\>span\:last-child\]\:truncate.\[\&\>svg\]\:shrink-0.hover\:text-primary.text-sm.h-\[36px\].border-transparent.hover\:bg-button-ghost-hover.data-\[state\=open\]\:hover\:bg-button-ghost-hover.active\:bg-button-ghost-active.data-\[active\=true\]\:bg-button-ghost-active.aria-expanded\:bg-button-ghost-hover.w-full.flex.flex-row.gap-1.group\/sidebar-item.transition-colors.p-\[0\.375rem\].text-sm.text-primary.bg-button-ghost-hover {
    background: #28484e;
} 
/*-----истори даиалогов ------------*/

.text-primary  {
      color: rgb(218 205 227) !important;
}

.font-semibold   {
      color: rgb(56 214 158) !important;
}

p.break-words {
    color: rgb(206 236 231) !important;
}
li.break-words {
    color: rgb(240 231 149) !important;
}

h3.text-xl {
    color: #46a13f !important;
}
 

strong.font-semibold {
    color: #efab47 !important;
}

h4 {
    color: #efab47 !important;
}

.dark\:text-orange-200:is(.dark *) {
    color: rgb(92 245 235) !important;
}

.dark\:bg-orange-300\/10:is(.dark *) {
    background-color: rgb(89 67 98) !important;
}
  
.dark\:text-orange-300:is(.dark *) {
    color: rgb(79, 211, 133) !important;
}
 

.think-box.relative.mb-2.\@md\/mainview\:-mx-4.prose-p\:\!my-0.prose-li\:\!m-0 {
      background: linear-gradient(360deg, #2e1e35,#201427, #3e2c4a) !important;
    border: 2px solid #b4c43c !important;
    border-radius: 18px !important;
}

.relative.isolate.w-full.h-full.bg-surface-l1.overflow-hidden.border.border-border-l1.rounded-3xl.max-h-\[50vh\].flex.flex-col.justify-end.leading-7.pb-2.px-5 {
    background: linear-gradient(360deg, #2e1e35,#201427, #3e2c4a) !important;
    border: 1px solid #af9abe !important;
    border-radius: 18px !important;
} 
.flex-1.overflow-hidden.text-secondary {
    background: #2c1c33   !important;
}
 

.rounded-xl.border.border-border-l1.w-full.overflow-hidden.bg-surface.dark\:bg-surface-l2 {
    background: #112a26  !important;
      border: 2px solid #aafff2 !important;
    color: #aafff2 !important;
    border-radius: 35px !important;
} /*------ think search results  -----*/


/*----------- .custom-x8548-pin- Button pinChat -------------*/ 
  .custom-x8548-pin-5r8je5j84-button {
      background-color: #dc2626 !important; /* Красный по умолчанию (не закреплено) */
      color: white !important;
      transition: background-color 0.3s ease, transform 0.1s ease !important;
      z-index: 100000 !important;
    } 

button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.text-sm.font-medium.leading-\[normal\].cursor-pointer.focus-visible\:outline-none.focus-visible\:ring-1.focus-visible\:ring-ring.disabled\:opacity-60.disabled\:cursor-not-allowed.transition-colors.duration-100.\[\&_svg\]\:shrink-0.select-none.rounded-xl.px-4.py-2.h-full {
    position: relative !important;
    top: -175px !important;
}  
    `;

    // Функция инжекта: использует GM_addStyle, с fallback на <style>
    function injectStyles(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css); // Основной метод: добавляет в head без DOM-конфликтов
            console.log('Стили инжектированы через GM_addStyle');
        } else {
            // Fallback: если GM не доступен
            var styleElement = document.createElement('style');
            styleElement.id = 'grok-better-css'; // Для удаления позже, если нужно
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
            console.log('Стили инжектированы через fallback <style>');
        }
    }

    // Функция для переинжекта при изменениях DOM (как в Stylebot)
    function setupObserver() {
        var observer = new MutationObserver(function(mutations) {
            var needsReinject = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    // Проверяем изменения в body или head (новые окна, модалки)
                    if (mutation.target === document.body || mutation.target === document.head) {
                        needsReinject = true;
                    }
                }
            });
            if (needsReinject) {
                // Небольшая задержка перед переинжектом (100 мс, чтобы избежать спама)
                setTimeout(function() {
                    injectStyles(customCSS);
                }, 100);
                console.log('Стили переинжектированы из-за изменений DOM');
            }
        });

        // Наблюдаем за body и head, включая поддерево
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        observer.observe(document.head, { childList: true, attributes: true });
    }

    // Основной запуск: с задержкой после загрузки
    function init() {
        // Задержка 500 мс: ждём полной загрузки Tailwind/DOM
        setTimeout(function() {
            injectStyles(customCSS);
            setupObserver(); // Запускаем observer для динамики
            console.log('Grok Better CSS: инициализация завершена');
        }, 500);
    }

    // Ждём готовности DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Дополнительно: обработка навигации в SPA (если grok.com использует History API)
    window.addEventListener('popstate', function() {
        setTimeout(injectStyles, 300, customCSS); // Переинжект при смене URL
    });

})();