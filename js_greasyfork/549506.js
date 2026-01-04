// ==UserScript==
// @name Segoe→Verdana + Consolas→Cascadia
// @namespace github.com/openstyles/stylus
// @version 1.3.2
// @description Makes all Segoe-like fonts render as the true and only Verdana instead, with digits from Cascadia, that also replaces some Consolas-like fonts.
// @author myf
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @include https://*/*
// @include http://*/*
// @downloadURL https://update.greasyfork.org/scripts/549506/Segoe%E2%86%92Verdana%20%2B%20Consolas%E2%86%92Cascadia.user.js
// @updateURL https://update.greasyfork.org/scripts/549506/Segoe%E2%86%92Verdana%20%2B%20Consolas%E2%86%92Cascadia.meta.js
// ==/UserScript==

(function() {
let css = `
/*
https://userstyles.world/style/23838
https://greasyfork.org/en/scripts/549506
Changelog
1.3.2 (2025-10-08) Verdanised: Google Sans-
1.3.1 (2025-10-03) Code polish.
1.3.0 (2025-10-03) Un-ligaturise "Cascadia Code".
1.2.4 (2025-10-03) More Cascadised (Cascadified?) monofonts. Shifted bold threshold for Inter.
1.2.3 (2025-09-24) Code polish.
1.2.2 (2025-09-23) Cleanup and fixes; plus Verdanising Roboto, Cascdadising more monospaces.
1.2.1 (2025-09-14) Published to Greasy Fork.
1.2.0 (2025-09-13) Forced digits to use Cascadia. Don't judge me.
1.0.1 (2025-08-21) Removed the Consolas -> Consolas fallback for when Cascadia is not on the system, since it was picked even when Cascadia was available. Gotta investigate later.
1.0.0 (2025-08-20) Init.
*/

/*
§ Known and worn-out sans-serifs to trusty (and even more worn-out) chunky Verdana.
… And digits in Cascadia.
*/

/*
¶ "Segoe UI" -> Verdana. 
*/
@font-face { font-family: "Segoe UI"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 400.999; font-style: normal; src: local("Verdana"); }
@font-face { font-family: "Segoe UI"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 400.999; font-style: italic; src: local("Verdana Italic"); }
@font-face { font-family: "Segoe UI"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  401 1000; font-style: normal; src: local("Verdana Bold"); }
@font-face { font-family: "Segoe UI"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  401 1000; font-style: italic; src: local("Verdana Bold Italic"); }
@font-face { font-family: "Segoe UI"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Segoe UI"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/*
¶ "Roboto" -> Verdana. 
*/
@font-face { font-family: "Roboto"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 400.999; font-style: normal; src: local("Verdana"); }
@font-face { font-family: "Roboto"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 400.999; font-style: italic; src: local("Verdana Italic"); }
@font-face { font-family: "Roboto"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  401 1000; font-style: normal; src: local("Verdana Bold"); }
@font-face { font-family: "Roboto"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  401 1000; font-style: italic; src: local("Verdana Bold Italic"); }
@font-face { font-family: "Roboto"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Roboto"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/*
¶ "Google Sans" -> Verdana.
Google Sans (in GMail) looks **terribly** on normal dispalays with just a tiny zoom.
*/
@font-face { font-family: "Google Sans"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 400.999; font-style: normal; src: local("Verdana"); }
@font-face { font-family: "Google Sans"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 400.999; font-style: italic; src: local("Verdana Italic"); }
@font-face { font-family: "Google Sans"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  401 1000; font-style: normal; src: local("Verdana Bold"); }
@font-face { font-family: "Google Sans"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  401 1000; font-style: italic; src: local("Verdana Bold Italic"); }
@font-face { font-family: "Google Sans"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Google Sans"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/*
¶ "Inter" -> Verdana. 
Just for occasional tests on USO; surprisingly, I usually don't hate Inter that much.
Note: Shifted the bold threshold by 100 points.
*/
@font-face { font-family: "Inter"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 500.999; font-style: normal; src: local("Verdana"); }
@font-face { font-family: "Inter"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight: 1 500.999; font-style: italic; src: local("Verdana Italic"); }
@font-face { font-family: "Inter"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  501 1000; font-style: normal; src: local("Verdana Bold"); }
@font-face { font-family: "Inter"; unicode-range: U+0-2F, U+3A-10FFFF; font-weight:  501 1000; font-style: italic; src: local("Verdana Bold Italic"); }
@font-face { font-family: "Inter"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Inter"; unicode-range:     U+30-39        ; font-weight: 1    1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/*
§ Known and "inferior monospaces" to Cascadia

Cascadia can possibly be NOT installed, but seems hard to make a reliable fallback here.
Currently it is either brought to Windows along with https://github.com/microsoft/terminal
or installed manually, e.g. from https://github.com/microsoft/cascadia-code/releases .
Interestingly, putting \`src: …, local("Consolas")\` fallback makes Firefox pick the Consolas OVER Cascadia.
Should investigate.
Cascadia is variable and does not need to jugle weights.
*/

/*
¶ Consolas -> Cascadia Mono
*/
@font-face { font-family: "Consolas"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Consolas"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/*
¶ "Courier" (sic) -> Cascadia Mono
Git uses this "Courier" that is automagically remapped to "Courier new" by browser/system, let's tap to that for now.
https://git-scm.com/docs/gitfaq
*/
@font-face { font-family: "Courier"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Courier"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/*
¶ Courier New -> Cascadia Mono
(I love Courier New, but sadly it is usually too thin on modern displays.)
* OFF for now /
@font-face { font-family: "Courier New"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Courier New"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }
/* */

/*
¶ (Roboto|Geist|Moderat|JetBrains) Mono -> Cascadia Mono
*/
@font-face { font-family: "Roboto Mono"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Roboto Mono"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }
@font-face { font-family: "Geist Mono"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Geist Mono"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }
@font-face { font-family: "Moderat Mono"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Moderat Mono"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }
@font-face { font-family: "JetBrains Mono"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "JetBrains Mono"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/*
¶ Un-ligaturize "Cascadia Code" when used directly
("Cascadia Mono" is the same, just without "coding" ligatures. I don't like "conding" ligatures.)
*/
@font-face { font-family: "Cascadia Code"; font-weight: 1 1000; font-style: normal; src: local("Cascadia Mono Regular"); }
@font-face { font-family: "Cascadia Code"; font-weight: 1 1000; font-style: italic; src: local("Cascadia Mono Italic"); }

/* E.O.: @-moz-document */ `;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
