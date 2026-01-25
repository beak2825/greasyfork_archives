// ==UserScript==
// @author      daniel.z.tg
// @description Tweaks for faster Wiktionary browsing in Kiwix
// @grant       GM_addStyle
// @license     Unlicense
// @match       https://browser-extension.kiwix.org/*
// @name        Kiwix Wiktionary power user tweaks
// @namespace   https://github.com/danielzgtg
// @run-at      document-start
// @version     202601251155580001
// @downloadURL https://update.greasyfork.org/scripts/564044/Kiwix%20Wiktionary%20power%20user%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/564044/Kiwix%20Wiktionary%20power%20user%20tweaks.meta.js
// ==/UserScript==

/*
 * Features:
 * - Right click to go back
 * - Loosens screen width restrictions
 * - Flows some lists/tables into multiple columns
 * - Collapses massive Greek/Chinese tables
 * - Uncollapses translations from English and examples in many languages
 * - Hides languages spoken by less people
 * - Makes the Tab key go to important words, not useless section/explanatory labels/buttons
 *
 * Anti-features:
 * - Only works reliably with "wiktionary_en_all_maxi_2024-05.zim"
 */

(function() {
    'use strict';
    if (!document.location.toString().includes('/A/')) return;
    document.oncontextmenu = (e) => {
        // Bind right click to Back button
        e.preventDefault();
        document.defaultView.history.back();
    };
    function unredirect() {
        // No longer needed with https://github.com/kiwix/kiwix-js/issues/972 closed
        // const iframe = document.querySelector('iframe');
        // iframe && (iframe.sandbox = 'allow-same-origin allow-scripts');
        document.removeEventListener('DOMContentLoaded', unredirect);
        // Skip useless links
        document.querySelectorAll('summary, a.external, span.ib-content>a, table.inflection-table a, table.audiotable')
            .forEach(x => { x.tabIndex = -1; });
        // Collapse the MULTIPLE tables for each Ancient Greek lemma
        document.querySelectorAll('details:has(>summary>h2#Ancient_Greek) details:has(> summary.section-heading > h4:is(#Inflection, #Conjugation))')
            .forEach(x => { x.open = false; });
    }
    document.addEventListener('DOMContentLoaded', unredirect);
GM_addStyle(`
/* Unhide translations */
.NavContent {
  display: block !important;
}

/* Unhide usage examples */
ol > li > ul {
  display: revert !important;
  /* But hide Ancient Greek citations lacking quotes */
  & > li:not(:has(dl)) {
    display: none !important;
  }
}

/* Widescreen */
#bodyContent {
  max-width: 80em;
}

/* Wider translation table */
table.translations.translations {
  width: 100% !important;
  & > tbody > tr > td > ul {
    column-width: 15em;
  }
}

/* Hide some languages */
details:has(>summary>h2:not(:is(
#French, #English, #Latin, #Tocharian_B, #Gothic, #Hittite,
#Ancient_Greek, #Greek, #Pontic_Greek, #Modern_Greek,
#Tibetan, #Sanskrit, #Chinese, #Japanese, #Korean, #Persian,
#Translingual, #Old_French, #Arabic, [id^=Old], #Hindi, #Venetian,
#Proto-Celtic, #Middle_French, #Italian, #Ukrainian, #Portuguese,
#Occitan, #Middle_English, #Spanish, #Hebrew, #Russian,
#German, #Akkadian, #Mandarin, #Cantonese, [id^=Proto-]
))) {
  height: 50px;
  overflow: hidden;
}

/* Compact Chinese pronounciation */
summary.section-heading ~ div.toccolours.zhpron {
  width: auto !important;
  max-width: none !important;
  columns: 300px;
  & li {
    break-inside: initial;
  }
  & > hr + div.vsSwitcher > div.vsHide {
    overflow-x: auto;
  }
}

/* Compact Chinese dialectual synonyms */
div.NavFrame:has(div.NavHead>span[class^=Han]) {
  max-width: unset !important;
  width: 100% !important;
  overflow: initial;
  & > div.NavContent {
    width: 100%;
    & > table.wikitable:not(#a#b) {
      width:100% !important;
      & > tbody {
        display: block;
        margin: 0px !important;
        width: 100%;
        columns: 150px;
        &:has(tr>td[style*=background]) {
          columns:200px;
        }
        & > tr {
          display:flex;
          width:100%;
          overflow:auto;
          & > td, & > th {
            text-align: left;
            word-break: keep-all;
            &:last-child {
              text-align:right;
              flex-grow:1;
            }
          }
        }
      }
    }
  }
}
`);
    // Unneeded now that service worker mode works
    // document.querySelector(":target")?.scrollIntoView();
})();