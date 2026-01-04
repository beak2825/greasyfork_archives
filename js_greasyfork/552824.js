// ==UserScript==
// @name         Custom CSS Injector
// @namespace    CustomCSS.Injector
// @version      2.1
// @description  Injects CSS (from link or raw string) for specific domains
// @author       RestrictedWord
// @match        *://*/*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/552824/Custom%20CSS%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/552824/Custom%20CSS%20Injector.meta.js
// ==/UserScript==

(function () {
   'use strict';

   // Configure styles
   const customStyles = [{
         domain: "toongod.org",
         css: `
.next_page,
.prev_page{
    width: 100px !important;
}
.prev_page{
    text-indent: 10px !important;
    margin-right: 10px;
}
.next_page{
    text-indent: -10px !important;
}
.next_page:before{
    left: unset !important;
}
            `
      },
      {
       domain: "novelbin.com",
       css:`
       p{font-size: 24px; padding: 0 1rem;}
`,
      },
      {
         domain: "royalroad.com",
         css: `
         .chapter-page{padding: 0 !important;}
.chapter-inner+div+hr~*:not(hr+.row),
.comments-container,
.fic-buttons>*~*,
.chapter+div+div,
.page-prefooter{
    display: none !important;
}
.chapter-inner p{font-size: 24px;}
         `,
      },
                         {
domain: "mvlempyr.com",
css: `
*{font-family:Roboto, sans-serif !important;}
.ChapterName+div,.ChapterContent+div{display: none !important;}
`,
},
      {
         domain: "example.com",
         css: "https://cdn.example.com/custom-theme.css"
      },
   ];

   const currentDomain = window.location.hostname;

   for (const entry of customStyles) {
      if (currentDomain.includes(entry.domain)) {
         if (entry.css.startsWith("http")) {
            // Load external CSS file
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = entry.css;
            document.head.appendChild(link);
            console.log(`[CustomCSS] Loaded external CSS for ${entry.domain}: ${entry.css}`);
         } else {
            // Inject raw CSS
            const style = document.createElement("style");
            style.textContent = entry.css;
            document.head.appendChild(style);
            console.log(`[CustomCSS] Injected inline CSS for ${entry.domain}`);
         }
      }
   }
})();