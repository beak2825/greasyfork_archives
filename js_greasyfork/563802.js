// ==UserScript==
// @name         Menéame dark
// @namespace    http://meneame.net/
// @version      0.184
// @description  Meneame dark mode
// @author       I my me
// @match        *://*.meneame.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563802/Men%C3%A9ame%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/563802/Men%C3%A9ame%20dark.meta.js
// ==/UserScript==


    (function() {
        'use strict';
        // Es CSS un poco (bastante) marrano, pero ahora mismo me vale.
        // Función para insertar estilos que anulan los elementos no deseados
        function insertOverrideStyles() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
               body {
               color: white !important;
               background: #1A1A1A;
               }
               
               .news-content {
               color: #FFF2E8 !important;
               }
               
               a {
               color: #FFF2E8 !important;
               }
               
               .header-menu01, .header-menu-wrapper, .header-top-wrapper, .news-summary .warn, .story-blog .warn {
               background: #1A1A1A;
               }
               
               .menu01-itemsl a.submit_new_post{
               background: none;
               border: none;
               box-shadow: none;
               }
               
               .menu01-itemsl a.submit_new_article{
               background: none;
               border: none;
               box-shadow: none;
               }
               
               .comment-body {
               background: #1A1A1A;
               color: #FFF2E8;
               }
               
               .comment.author .comment-body, .threader.collapsed > .comment .comment-body {
               background: #BF5500;
               color: #FFF2E8;
               }
               
               .comment.phantom .comment-body, .comment.high .comment-body {
               background: #693000;
               }
               
               .topbox {
               display: none;
               }
               
               .news-details a.comments {
               background: #1A1A1A;
               }
               
               .news-shakeit .votes a {
               color: #e35614 !important;
               }
               
               select, fieldset {
               background: #1A1A1A;
               }
               
               ul#userinfo a.notifications span {
               border-color: #1A1A1A;
               }
               
               #sidebar, .news-body .box {
               display: none;
               }
               
               #newswrap {
               margin: 10px 10%;
               }
               
               .news-shakeit .clics, .news-shakeit .votes, .news-shakeit.mnm-queued .votes, .news-shakeit.mnm-queued .clics {
               background: #1A1A1A;
               }
               
               .news-shakeit .votes a {
               color: white !important;}
               div.dropdown.menu-more.open ul.dropdown-menu.menu-subheader {
               background: darkgrey;
               }

               `;
            document.head.appendChild(style);
        }

        // Observa cambios en el DOM
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes) return;

                // Verifica si el estilo ya fue añadido, para no duplicarlo
                if (!document.querySelector('style#customOverrideStyles')) {
                    insertOverrideStyles();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Insertamos los estilos inmediatamente en caso de que los nodos relevantes ya estén en el DOM
        insertOverrideStyles();
    })();

