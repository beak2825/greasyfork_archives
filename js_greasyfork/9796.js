// ==UserScript==
// @name        Google Product Forum - Help Forum - Compact and Minimal
// @namespace   english
// @description Google Product Forum - Help Forum - Compact and Minimal - After Material Design Rewrite 2015/05/15  - http://pushka.com/coding-donation
// @include     http*://*productforums.google.com/forum*
// @include     http*://*groups.google.com/forum*
// @version     4.13
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9796/Google%20Product%20Forum%20-%20Help%20Forum%20-%20Compact%20and%20Minimal.user.js
// @updateURL https://update.greasyfork.org/scripts/9796/Google%20Product%20Forum%20-%20Help%20Forum%20-%20Compact%20and%20Minimal.meta.js
// ==/UserScript==


// Main - CSS hides some block elements and expands other main divs to 100% 
 

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '          /*g-css*//*\n*//*banners*//*\n*/ .A0FHG6C-T-O,.A0FHG6C-o-a{display: none   !important;} /*\n*//*\n*//*homepage*//*\n*//*\n*/.A0FHG6C-T-x {/*\n*/  margin: 10px 0 10px 22px  !important;/*\n*/}/*\n*//*\n*/.A0FHG6C-T-w {/*\n*/  margin: 10px 0 10px  !important; /*\n*/}/*\n*/.A0FHG6C-T-w .A0FHG6C-T-g { /*\n*/  padding: 0  !important;/*\n*/}/*\n*/.A0FHG6C-T-J { /*\n*/  min-height: 28px  !important;/*\n*/  padding: 10px 0 10px  !important; /*\n*/}/*\n*/.A0FHG6C-T-j .A0FHG6C-T-E { /*\n*/  padding-top: 5px  !important;/*\n*/  padding-bottom: 5px  !important;/*\n*/}/*\n*/.A0FHG6C-W-l { /*\n*/  padding: 5px 0  !important; /*\n*/}/*\n*/.A0FHG6C-T-y { /*\n*/  padding-top: 10px  !important; /*\n*/}/*\n*//*\n*//*\n*//*responses*//*\n*/.A0FHG6C-L-bb .A0FHG6C-L-ob { /*\n*/  margin: 0 0 5px !important;/*\n*/}/*\n*//*\n*/.A0FHG6C-L-qb>.A0FHG6C-L-e { /*\n*/  padding-bottom: 5px !important;/*\n*/}/*\n*//*\n*/.A0FHG6C-L-bb .A0FHG6C-L-eb { /*\n*/  margin: 15px 0 9px !important; /*\n*/}/*\n*/.A0FHG6C-L-bb { /*\n*/  position: relative !important;/*\n*/}/*\n*/.A0FHG6C-L-bb .A0FHG6C-L-a {/*\n*/  margin-right: 72px !important;  position: relative !important;  top: -20px !important;/*\n*/}/*\n*/.A0FHG6C-L-V{max-width: 60% !important;}.A0FHG6C-L-bb .A0FHG6C-L-V {/*\n*/  padding-bottom: 5px !important;/*\n*/  width: auto !important;/*\n*/  position: absolute !important;/*\n*/  top: 35px !important;/*\n*/  right: 25px !important;/*\n*/}/*\n*//*\n*//*under message box*//*\n*/.A0FHG6C-L-G {/*\n*/  margin: 10px 0 10px 120px !important;/*\n*/}/*\n*/.A0FHG6C-L-W .A0FHG6C-L-Q { /*\n*/  padding: 10px 24px !important;/*\n*/}/*\n*/.A0FHG6C-L-Q {/*\n*/  margin-bottom: 15px !important;/*\n*/}/*\n*/.A0FHG6C-L-xb .A0FHG6C-L-A {/*\n*/  margin: 0 auto !important;/*\n*/  margin-bottom: 15px !important; /*\n*/  padding: 0 !important;/*\n*/  width: 44px !important;/*\n*/}/*\n*/.A0FHG6C-L-Q .A0FHG6C-L-c { /*\n*/  padding-bottom: 10px !important;/*\n*/}/*\n*/.A0FHG6C-L-U .A0FHG6C-L-Q .A0FHG6C-L-d {/*\n*/  margin: 0 10px 10px 0 !important;/*\n*/}/*\n*//*\n*/.A0FHG6C-L-Q {/*\n*/  margin-bottom: 15px !important;/*\n*/  min-height: 30px !important;/*\n*/  padding: 10px 10px !important;/*\n*/}/*\n*//*\n*/.A0FHG6C-L-U .A0FHG6C-L-p { /*\n*/  right: 100px !important;/*\n*/  top: 15px !important;/*\n*/}/*\n*/.A0FHG6C-L-U .A0FHG6C-L-Cb { /*\n*/  top: 0px !important;/*\n*/}.A0FHG6C-L-bb .A0FHG6C-L-C {  padding-right: 24px !important;  position: relative !important;  top: -11px !important;}          ';



document.getElementsByTagName('head')[0].appendChild(style);

 