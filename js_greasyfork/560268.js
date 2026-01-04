// ==UserScript==
// @name         ttk
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  toggle toolbar
// @author       clumsyman
// @copyright 2018, clumsyman (https://openuserjs.org//users/clumsyman)
// @license MIT
// @match        https://ttks.tw/novel/chapters/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560268/ttk.user.js
// @updateURL https://update.greasyfork.org/scripts/560268/ttk.meta.js
// ==/UserScript==

javascript:try {
    function afterLoading() {
        document.head
            .appendChild(document.createElement('style'))
            .append(document.createTextNode(`
                html:not([amp4ads]) {
                    height: 100% !important;
                }
                .txtcenter, .more_recommend {
                    display: none;
                }
                .frame_body.showTools>.breadcrumb_nav, 
                .frame_body.showTools>#color_box, 
                .frame_body.showTools>.page-separator+.content, 
                .frame_body.showTools>.footer_frame {
                    position: sticky;
                }
                .breadcrumb_nav {
                    top: 40px;
                }
                #color_box {
                    top: 80px;
                }
                .page-separator+.content {
                    bottom: 12px;
                }
                .footer_frame {
                    bottom: 0;
                    height: auto;
                }
                .footer_frame > div {
                    line-height: normal;
                }`));
        var frame_body = document.querySelector('.frame_body');
        if (frame_body) {
            frame_body.addEventListener("click", function(event) {
                console.log("frame_body was clicked or tapped!");
                frame_body.classList.toggle('showTools');
            });
        }
    }
    if (document.readyState !== 'loading') {
        afterLoading();
    } else {
        document.addEventListener('DOMContentLoaded', afterLoading);
    }
} catch(e) {
    alert(e + '\n' + e.stack);
}
