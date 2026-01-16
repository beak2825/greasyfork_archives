// ==UserScript==
// @name         PP Replacer 🪮
// @namespace    http://tampermonkey.net/
// @version      2.4.3
// @description  Instant image replacement for Popmundo. Works on Tampermonkey and Violentmonkey (Mobile).
// @author       Gemini
// @match        https://*.popmundo.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560873/PP%20Replacer%20%F0%9F%AA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/560873/PP%20Replacer%20%F0%9F%AA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `

        /* --- KIA AND FRIENDS --- */

        /* kia */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283800/40_if8b000_wxlydb.jpg"] {
          background: url("https://i.imgur.com/fzC4pk5.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* rian */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767282681/1_mluirc.jpg"] {
          background: url("https://i.imgur.com/2SXS0Pa.png") no-repeat !important;
          background-size: cover !important;
        }

        /* lola */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283555/4_ekcfl3.jpg"] {
          background: url("https://i.imgur.com/H5WT6Sh.png") no-repeat !important;
          background-size: cover !important;
        }

        /* kitti */
        .avatar.pointer.idTrigger[style*="https://i.imgur.com/Hn5ojCP.png"] {
          background: url("http://i.imgur.com/cBIu8ZU.png") no-repeat !important;
          background-size: cover !important;
        }

        /* nova */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283497/3_vrvv93.jpg"] {
          background: url("https://i.imgur.com/8IH9qy4.png") no-repeat !important;
          background-size: cover !important;
        }

        /* kani */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/41/bf/Bc11KqOe_2.png"] {
          background: url("https://i.imgur.com/00tD5D1.png") no-repeat !important;
          background-size: cover !important;
        }

        /* summer */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/41/bf/Bc91KqOe_21.png"] {
          background: url("https://i.imgur.com/PPR3wxO.png") no-repeat !important;
          background-size: cover !important;
        }

        /* dean */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/ba/eb/11nidk0A_o.png"] {
          background: url("https://i.imgur.com/TFQc6n7.png") no-repeat !important;
          background-size: cover !important;
        }

        /* bud */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/ba/eb/0sdgs0_11.png"] {
          background: url("https://i.imgur.com/75Pn0Rd.png") no-repeat !important;
          background-size: cover !important;
        }





        /* --- CORTIS --- */

        /* vic */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283439/1_pkeqct.jpg"] {
          background: url("https://i.imgur.com/GtM34pd.png") no-repeat !important;
          background-size: cover !important;
        }

        /* dora */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767282872/2_ncouwd.jpg"] {
          background: url("https://i.imgur.com/lZbiSLO.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* sun */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283677/2s_fwcasj.jpg"] {
          background: url("https://i.imgur.com/5kXw9ij.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* jules */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283120/1_qmoksl.jpg"] {
          background: url("https://i.imgur.com/1Zi5NME.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* band */
        .entityLogo.gameimage.idTrigger[style*="https://images2.imgbox.com/45/bf/1k80AxAo_2.png"] {
          background: url("https://i.imgur.com/TfqOd6u.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* --- RIIZE --- */

        /* bela */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767282801/11_iupvmo.jpg"] {
          background: url("https://i.imgur.com/WIqqny0.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* rena */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283316/1_1_lhz4wu.jpg"] {
          background: url("https://i.imgur.com/4FOyX0v.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* niila */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283194/2_byo2lj.jpg"] {
          background: url("https://i.imgur.com/e4sPjls.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* hana */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283037/1_1_bbesod.jpg"] {
          background: url("https://i.imgur.com/POvrlIF.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* niki */
        .avatar.pointer.idTrigger[style*="https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283257/1_zfq3ox.jpg"] {
          background: url("https://i.imgur.com/0kESBRc.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* --- RANDOM --- */

        /* liXin */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/af/82/000wq5_o.jpg"] {
          background: url("https://images2.imgbox.com/db/69/g1LhQ9Jb_o.jpg") no-repeat !important;
          background-size: cover !important;
        }

        /* betty */
        .avatar.pointer.idTrigger[style*="https://i.imgur.com/NsY47IC.jpeg"] {
          background: url("https://i.imgur.com/JwXJnox.png") no-repeat !important;
          background-size: cover !important;
        }

        /* alina */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/61/54/1iSXWkEQ6_o.png"] {
          background: url("https://images2.imgbox.com/61/54/iSXWkEQ6_o.png") no-repeat !important;
          background-size: cover !important;
        }

        /* yuki */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/af/82/2wq5_o.jpg"] {
          background: url("https://i.imgur.com/NKU5xqv.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* baby 1 */
        .avatar.pointer.idTrigger[style*="https://i.imgur.com/9HLLpn3.png"] {
          background: url("https://i.imgur.com/D3xGwRB.png") no-repeat !important;
          background-size: cover !important;
        }

        /* baby 2 */
        .avatar.pointer.idTrigger[style*="https://i.imgur.com/SsehZcO.png"] {
          background: url("https://i.imgur.com/Eide5e5.png") no-repeat !important;
          background-size: cover !important;
        }

        /* sam */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/41/bf/Bc91KqOe_2.png"] {
          background: url("https://i.imgur.com/u7bNNDy.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* cass */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/10/bf/1KJ5SACqOA_1.png"] {
          background: url("https://images2.imgbox.com/2f/f1/liQ0gbfy_o.png") no-repeat !important;
          background-size: cover !important;
        }

        /* emma */
        .avatar.pointer.idTrigger[style*="https://images2.imgbox.com/41/bf/Ka91cCe01_X.png"] {
          background: url("https://i.imgur.com/mtDq1da.jpeg") no-repeat !important;
          background-size: cover !important;
        }

        /* sam's house */
        .localeLogo.gameimage.idTrigger[style*="https://i.pinimg.com/originals/59/d0/c1/59d0c1c7ae5ac4198046426a527ff4e61.gif"] {
          background: url("https://i.pinimg.com/originals/b6/f3/78/b6f3789d370fcdb60ef07295961f52c6.gif") no-repeat !important;
          background-size: cover !important;
        }

        /* sam's band */
        .entityLogo.gameimage.idTrigger[style*="https://i.pinimg.com/originals/b6/f3/78/b6f3789d370fcdb60ef07295961f52c16.gif"] {
          background: url("https://i.pinimg.com/originals/70/b5/21/70b521ac1f2307cb8b2451e5b0875731.gif") no-repeat center !important;
          background-size: auto !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
})();