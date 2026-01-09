// ==UserScript==
// @name Kitty Buttercup FAM Tree 🧬
// @namespace http://tampermonkey.net/
// @version 3.9.3
// @description Inject all custom groups (RIIZE to Kawate) into Kitty Buttercup's family tree, with ID on hover
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/FamilyTree/2887796
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/FamilyTree/3065847
// @match https://*.popmundo.com/World/Popmundo.aspx/Character/FamilyTree/3617774
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/559289/Kitty%20Buttercup%20FAM%20Tree%20%F0%9F%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559289/Kitty%20Buttercup%20FAM%20Tree%20%F0%9F%A7%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to create the portrait HTML string with hover ID logic
    // MODIFIED: The name link now points to /Character/ID instead of /Character/FamilyTree/ID
    const makePortrait = (id, name, age, imgURL) => {
        return `
            <div class="familyTreePortrait">
                <div
                    class="avatar pointer idTrigger"
                    style="background: url('${imgURL}') no-repeat;"
                    onclick="window.location.href='/World/Popmundo.aspx/Character/${id}';"
                    onmouseover="this.querySelector('.idHolder').style.display = 'block';"
                    onmouseout="this.querySelector('.idHolder').style.display = 'none';">

                    <div class="idHolder" style="display: none;">${id}</div>

                    <a title="Report this character avatar as offensive" class="abusereport rightcornerabuse" href="/World/Popmundo.aspx/Help/PreviewReport/1/${id}">
                        <img title="Report this character avatar as offensive" src="/Static/Icons/TinyIcon_Report.png">
                    </a>
                </div>
                <p><a href="/World/Popmundo.aspx/Character/${id}">${name}</a><br>Age: ${age}</p>
            </div>`;
    };

    // --- Data Definitions ---
    const riize = [
        [3568978, "Lee Sohee", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283316/1_1_lhz4wu.jpg"],
        [3570664, "Osaki Shotaro", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283194/2_byo2lj.jpg"],
        [3570722, "Jung Sungchan", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283037/1_1_bbesod.jpg"],
        [3571113, "Song Eunseok", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283257/1_zfq3ox.jpg"],
        [3498957, "Park Wonbin", 19, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767282801/11_iupvmo.jpg"],
    ];

    const cortis = [
        [3571876, "Martin Edwards", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283439/1_pkeqct.jpg"],
        [3572154, "Keonho Ahn", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767282872/2_ncouwd.jpg"],
        [3572316, "James Yufan", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283677/2s_fwcasj.jpg"],
        [3572401, "Juhoon Kim", 16, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283120/1_qmoksl.jpg"]
    ];

    const ouchi = [
        [3558887, "Moona Ouchi", 27, "https://images2.imgbox.com/80/2e/XRZASLNl_o.png"],
        [3501813, "Olesya Ouchi", 26, "https://images2.imgbox.com/0b/9b/yc6AfO1Y_o.png"],
        [3554762, "Oko Ouchi", 26, "https://images2.imgbox.com/03/bc/rh8YHwRX_o.png"],
        [3555337, "June Ouchi", 26, "https://images2.imgbox.com/48/6b/V9luUDrf_o.png"],
        [3555692, "Yuki Ouchi", 26, "https://images2.imgbox.com/6a/20/2q3ErXWv_o.png"],
        [3556299, "Hira Ouchi", 26, "https://images2.imgbox.com/ab/1c/U9XEFX1m_o.png"],
        [3558102, "Riku Ouchi", 26, "https://images2.imgbox.com/11/73/RyDQ6eag_o.png"],
        [3558420, "Nada Ouchi", 26, "https://images2.imgbox.com/de/a9/LcOTtGaT_o.png"],
        [3558449, "Rain Ouchi", 26, "https://images2.imgbox.com/ea/7e/Lyo4abWz_o.png"],
        [3561128, "Yuji Ouchi", 25, "https://images2.imgbox.com/86/01/GBR7A4Ja_o.png"],
        [3561510, "Ryuichi Ouchi", 25, "https://images2.imgbox.com/d4/69/PqC5A5RD_o.png"],
        [3569924, "Bae Ouchi", 22, "https://images2.imgbox.com/30/55/hPDWM0Vq_o.png"],
        [3570271, "Nia Ouchi", 22, "https://images2.imgbox.com/7e/4d/mBxASjKF_o.png"],
        [3552393, "Kiyo Ouchi", 16, "https://images2.imgbox.com/36/24/iJGgPsB6_o.png"],
        [2664429, "Loli Ouchi", 22, "https://images2.imgbox.com/8b/f2/QMv7uqjh_o.png"],
        [3552255, "Miyu Ouchi", 22, "https://images2.imgbox.com/30/00/RWxQCEjj_o.png"]
    ];

    const kuno = [
        [3603887, "Keiji クーナ", 19, "https://images2.imgbox.com/dd/e2/oHeriBu1_o.jpg"],
        [3585513, "Toi Kuno", 19, "https://images2.imgbox.com/39/4a/y0EpUYgn_o.jpg"],
        [3579984, "Kai Kuno", 19, "https://images2.imgbox.com/54/bb/0e84quuB_o.png"],
        [3616422, "Juan Guanare", 19, "https://images2.imgbox.com/04/bb/Fl4jbzCT_o.png"],
        [3609922, "Ion Grecescu", 17, "https://i.ibb.co/xK3BCPrX/0550fe-2.jpg"],
        [3609935, "Ryu Iwakura", 17, "https://i.ibb.co/YFhwpSNm/ryu.jpg"],
        [3611645, "Yuji Iwakura", 17, "https://images2.imgbox.com/9b/8d/FV8LfxEy_o.png"],
        [3602138, "Yuta Kuno", 17, "https://images2.imgbox.com/54/80/fVxnjB3f_o.png"],
        [3602146, "XiAn Kuno", 17, "https://images2.imgbox.com/82/03/R9qohxD6_o.png"],
        [3579934, "Ren Kuno", 17, "https://images2.imgbox.com/58/74/VBY116KE_o.png"],
        [3579788, "Jun Kuno", 17, "https://images2.imgbox.com/4a/64/LDCFjU9b_o.png"],
        [3617774, "Ken'ichi Yasui", 17, "https://images2.imgbox.com/64/c3/SfrSzn1T_o.png"],
    ];


//    const faveCouple = [
//        [3580776, "Nana Tsuki 月", 19, "https://i.imgur.com/Eide5e5.png"],
//        [3581055, "Mimi Tsuki 月", 19, "https://i.imgur.com/D3xGwRB.png"],
//    ];

    // --- Data Definitions (split Wanderers into Heist + Wanderers) ---
    const heist = [
        [3577905, "Kia Rivera", 27, "https://i.imgur.com/fzC4pk5.jpeg"],
        [3579423, "Lola Lemon", 19, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283555/4_ekcfl3.jpg"],
        [3065847, "Rei Xie", 22, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767282681/1_mluirc.jpg"],
    ];

    const wanderers = [
        [3247354, "Kitti Gillis", 21, "https://i.imgur.com/Hn5ojCP.png"],
        [3602175, "Ruby Ross", 14, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283608/6_upaeug.jpg"],
        [3616694, "Betty Doty", 22, "https://i.imgur.com/JwXJnox.png"],
        [3350835, "Yuu Izumi 左", 18, "https://i.imgur.com/EtkRmfU.jpeg"],
        [3602139, "Nova Xie", 19, "https://res.cloudinary.com/dlgjqlsb3/image/upload/v1767283497/3_vrvv93.jpg"],
        [3616012, "Tomie Xie", 19, "https://images2.imgbox.com/69/93/4tnIOc3m_o.png"],
    ];

    const oddyssey = [
         [3580776, "Nana Tsuki 月", 19, "https://i.imgur.com/Eide5e5.png"],
         [3581055, "Mimi Tsuki 月", 19, "https://i.imgur.com/D3xGwRB.png"],
//       [3613832, "Kookie XXIN ア", 19, "https://images2.imgbox.com/af/82/000wq5_o.jpg"],
//       [3620479, "Yuqi Kawai 昼", 16, "https://images2.imgbox.com/10/bf/1KJ5SACqOA_1.png"],
//       [3620400, "Martin Edwards", 19, "https://images2.imgbox.com/41/bf/Ka91cCe01_X.png"],
    ];

    // Data for the Kawate section
  const kawate = [
          [3620400, "Chuu Xxnana", 18, "https://i.imgur.com/lI6k2NS.png"],
          [3620479, "Yuqi Kawai 㡺", 19, "https://images2.imgbox.com/2f/f1/liQ0gbfy_o.png"],
          [3613365, "Ryuzen 月影", 19, "https://images2.imgbox.com/ba/eb/ENnidk0A_o.png"],
          [3609829, "Alina Burrell", 19, "https://i.imgur.com/2Rph8il.png"],
          [3614576, "Ruth Kemp", 19, "https://i.imgur.com/uxoFftH.jpeg"],
          [3580037, "Ruby Hamm", 19, "https://i.imgur.com/pIjqdSr.jpeg"],
          [3613832, "Kookie XXIN ア", 19, "https://images2.imgbox.com/db/69/g1LhQ9Jb_o.jpg"],
          [3613871, "Yuki Makino", 19, "https://i.imgur.com/NKU5xqv.jpeg"],
   ];
    // --- End Data Definitions ---


    const rows = document.querySelectorAll('.familyTreeRow');
    let childrenRow = null;

    rows.forEach(row => {
        const title = row.querySelector('h3');
        const items = row.querySelector('.familyTreeItems');
        const fallback = row.querySelector('p');

        if (!title || !items) return;

        const section = title.textContent.trim();

        if (section === 'Parents') {
            title.textContent = 'Members';
            items.innerHTML = riize.map(c => makePortrait(...c)).join('');
            if (fallback) fallback.remove();
        }

        if (section === 'Siblings') {
            title.textContent = 'CORTIS';
            items.innerHTML = cortis.map(c => makePortrait(...c)).join('');
            if (fallback) fallback.remove();
        }

        if (section === 'Spouses') {
            title.textContent = 'Ouchi';
            items.innerHTML = ouchi.map(c => makePortrait(...c)).join('');
            if (fallback) fallback.remove();
        }

        if (section === 'Children') {
            title.textContent = 'Kuno';
            items.innerHTML = kuno.map(c => makePortrait(...c)).join('');
            if (fallback) fallback.remove();

            // Store a reference to the modified Children row (now 'Kuno')
            childrenRow = row;
        }
    });

// --- Injection of Custom Sections ---
if (childrenRow) {
    // Kawate
    const kawateHTML = `
        <div class="familyTreeRow" id="kawateRow">
            <h3>Kawai</h3>
            <div class="familyTreeItems">
                ${kawate.map(c => makePortrait(...c)).join('')}
            </div>
        </div>`;
    childrenRow.insertAdjacentHTML('afterend', kawateHTML);

    // Oddyssey
    const oddysseyHTML = `
        <div class="familyTreeRow" id="oddysseyRow">
            <h3>Oddyssey</h3>
            <div class="familyTreeItems">
                ${oddyssey.map(c => makePortrait(...c)).join('')}
            </div>
        </div>`;
    childrenRow.insertAdjacentHTML('afterend', oddysseyHTML);

    // Heist
    const heistHTML = `
        <div class="familyTreeRow" id="heistRow">
            <h3>Heist</h3>
            <div class="familyTreeItems">
                ${heist.map(c => makePortrait(...c)).join('')}
            </div>
        </div>`;
    childrenRow.insertAdjacentHTML('afterend', heistHTML);

    // Wanderers
    const wanderersHTML = `
        <div class="familyTreeRow" id="wanderersRow">
            <h3>Wanderers</h3>
            <div class="familyTreeItems">
                ${wanderers.map(c => makePortrait(...c)).join('')}
            </div>
        </div>`;
    childrenRow.insertAdjacentHTML('afterend', wanderersHTML);

    // Couples
    const couplesHTML = `
        <div class="familyTreeRow" id="couplesRow">
            <h3>Couples</h3>
            <div class="familyTreeItems">
                ${faveCouple.map(c => makePortrait(...c)).join('')}
            </div>
        </div>`;
    childrenRow.insertAdjacentHTML('afterend', couplesHTML);
}

})();