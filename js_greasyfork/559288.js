// ==UserScript==
// @name         Name Changer
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Universal name/text replacement with separate rules for general pages vs. specific character/artist/locale pages + item replacements
// @author       You
// @match        https://*.popmundo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559288/Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/559288/Name%20Changer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ===========================================================================
  // PART 1: GLOBAL REPLACEMENTS (applies to ALL pages)
  // ===========================================================================

  const globalReplacements = [
    { find: /Samantha Macindoe/g, replace: 'Kitty Buttercup 么' },
    { find: /Emma Jeffrey/g, replace: 'Chuu Xxnana' },
    { find: /Cassy Hunt/g, replace: 'Yuqi Kawai 㡺' },
    { find: /LiXin Hang/g, replace: 'Kookie XXIN ア' },
    { find: /Rian Xie/g, replace: 'Rei Xie' },
    { find: /Bèla Rivera/g, replace: 'Park Wonbin' },
    { find: /harvest heartbreak/g, replace: 'RIIZE' },
    { find: /\bVIC\b/g, replace: 'CORTIS' },
    { find: /Rena Rivera/g, replace: 'Lee Sohee' },
    { find: /Niila Rivera/g, replace: 'Osaki Shotaro' },
    { find: /Hana Rivera/g, replace: 'Jung Sungchan' },
    { find: /Niki Rivera/g, replace: 'Song Eunseok' },
    { find: /Vic Rivera/g, replace: 'Martin Edwards' },
    { find: /Dora Rivera/g, replace: 'Keonho Ahn' },
    { find: /Sun Rivera/g, replace: 'James Yufan' },
    { find: /Jules Rivera/g, replace: 'Juhoon Kim' },
    { find: /Lola Lemon/g, replace: 'Tomie Ito 富江' },
    { find: /Kitti Gillis/g, replace: 'Koko Koharu' },
    { find: /JiaYan Xie/g, replace: 'Ryuzen 月影' },
    { find: /Baby Sjoukema/g, replace: 'Mimi Tsuki 月' },
    { find: /Baby Waite/g, replace: 'Nana Tsuki 月' },
    { find: /Jann Barfield/g, replace: 'Yuzu Bunny 月' },
  ];

  // ===========================================================================
  // PART 2: ID-SPECIFIC TEXT REPLACEMENTS
  // ===========================================================================

  const idSpecificReplacements = {
    'global': [],
        '3620400': [ // Chuu's page
            { find: /Relaxed/g, replace: 'Chill' },
            { find: /Emma Jeffrey/g, replace: 'Chuu Xxnana' },
            { find: /Emma/g, replace: 'Chuu' },
            { find: /g.o.a.t./g, replace: '박우주' },
            { find: /midnights/g, replace: 'INFP' },
            { find: /keep stealthy/g, replace: 'relaxing' },
            { find: /I am feeling kinda moody today.../g, replace: 'I am feeling real horny today...' },

        ],
        '3620479': [ // Yuqi's page
            { find: /Cassy Hunt/g, replace: 'Yuqi Kawai 㡺' },
            { find: /Cassy/g, replace: 'Yuqi' },
            { find: /Flirty/g, replace: 'Kawaii' },
            { find: /keep stealthy/g, replace: 'relaxing' },
        ],
        '2887796': [ // Kitty's page
            { find: /Samantha Macindoe/g, replace: 'Kitty Buttercup 么' },
            { find: /\d+\s*years\s*old/gi, replace: '18 years old' },
            { find: /Samantha/g, replace: 'Kitty' },
            { find: /keep stealthy/g, replace: 'relaxing' },
            { find: /vsyo ischezáyet/g, replace: 'all fades away — viae.' },
            { find: /Reserved/g, replace: 'Kawaii' },
        ],
        '3065847': [ // Rian's page
            { find: /Rian Xie/g, replace: "Rei Xie" },
            { find: /Rian/g, replace: "Rei" },
            { find: /once or twice i've seen your soul./g, replace: '小舍。trust that you know better.' },
            { find: /\bHe\b/g, replace: 'She' },
            { find: /His/g, replace: 'Her' },
            { find: /Male/g, replace: 'Female' },

        ],
        '3613832': [ // Kookie's page
            { find: /LiXin Hang/g, replace: 'Kookie XXIN ア' },
            { find: /LiXin/g, replace: 'Kookie' },
            { find: /sistar mountain/g, replace: '么' },
        ],
        '3579423': [ // Tomie's page
            { find: /Lola Lemon/g, replace: 'Tomie Ito 富江' },
            { find: /Lola/g, replace: 'Tomie' },
        ],
        '3571876': [ // Martin's page
            { find: /Vic Rivera/g, replace: 'Martin Edwards' },
            { find: /Vic/g, replace: 'Martin' },
            { find: /lost in the sauce./g, replace: 'you know what i like? — cuties!' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
        '3572154': [ // Keonho's page
            { find: /Dora Rivera/g, replace: 'Keonho Ahn' },
            { find: /Dora/g, replace: 'Keonho' },
            { find: /i keep it classy.../g, replace: 'wdym trainee days paying off!' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
        '3572316': [ // James's page
            { find: /Sun Rivera/g, replace: 'James Yufan' },
            { find: /\bSun\b/g, replace: 'James' },
            { find: /walking in my own flesh./g, replace: 'i will shine on stage — fr!' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
        '3572401': [ // Juhoon's page
            { find: /Jules Rivera/g, replace: 'Juhoon Kim' },
            { find: /Jules/g, replace: 'Juhoon' },
            { find: /just winging it./g, replace: "don't mind me being stoopid, uh huh" },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
        '3498957': [ // Wonbin's page
            { find: /Bèla Rivera/g, replace: 'Park Wonbin' },
            { find: /Bèla/g, replace: 'Wonbin' },
            { find: /jinx/g, replace: '𝘥𝘢𝘳𝘬𝘣𝘪𝘯' },
            { find: /\d+\s*years\s*old/gi, replace: '23 years old' },
            { find: /unbound tachysensia./g, replace: 'beep, beep, beeeep that siren — ahh' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
        '3568978': [ // Sohee's page
            { find: /Rena Rivera/g, replace: 'Lee Sohee' },
            { find: /Rena/g, replace: 'Sohee' },
            { find: /spunk/g, replace: '𝘥𝘥𝘰𝘳𝘪' },
            { find: /forever a work in progress./g, replace: 'seodulreo, hurry, hurry!' },
            { find: /I am feeling kinda moody today.../g, replace: 'I am feeling real horny today...' },
            { find: /\bShe\b/g, replace: 'He' },
            { find: /\bHer\b/g, replace: 'His' },
            { find: /\bFemale\b/g, replace: 'Male' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
       ],
       '3570664': [ // Shotaro's page
           { find: /Niila Rivera/g, replace: 'Osaki Shotaro' },
           { find: /Niila/g, replace: 'Shotaro' },
           { find: /dazzle/g, replace: '𝘵𝘢𝘳𝘰-𝘤𝘩𝘢𝘯' },
           { find: /who says i'll be a mess, hm?/g, replace: 'am i cute or — nah' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
         '3570722': [ // Eunseok's page
             { find: /Hana Rivera/g, replace: 'Jung Sungchan' },
             { find: /Hana/g, replace: 'Sungchan' },
             { find: /wisp/g, replace: '𝘫𝘫𝘢𝘯𝘨𝘶' },
             { find: /oh so damn cute/g, replace: '宝贝 splash, yeah.' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
         ],
     '3571113': [ // Anton's page
            { find: /Niki Rivera/g, replace: 'Song Eunseok' },
            { find: /Niki/g, replace: 'Eunseok' },
            { find: /zephyr/g, replace: '𝘣𝘭𝘢𝘤𝘬 𝘴𝘩𝘢𝘥𝘰𝘸' },
            { find: /could you settle for a smile？/g, replace: 'infierno - 09.18.2025' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
//     '3571113': [ // Anton's page
//            { find: /Niki Rivera/g, replace: 'Anton Lee' },
//           { find: /Niki/g, replace: 'Anton' },
//            { find: /zephyr/g, replace: '𝘣𝘳𝘢𝘤𝘩𝘪𝘰' },
//            { find: /could you settle for a smile？/g, replace: '宝贝 shine, woo.' },
//        ],
        '3373672': [ // Locale's page (Main Street 35)
            { find: /Main Street 35/g, replace: '327-1948 山谷' },
        ],
        '2786989': [ // us ephemeral's page
            { find: /dreadful/g, replace: 'GOD SMACKINGLY GLORIOUS' },
            { find: /great/g, replace: 'GOD SMACKINGLY GLORIOUS' },
            { find: /terrible/g, replace: 'GOD SMACKINGLY GLORIOUS' },
        ],
        '2745653': [ // RIIZE's page
            { find: /zephyr/g, replace: '𝘣𝘭𝘢𝘤𝘬 𝘴𝘩𝘢𝘥𝘰𝘸' },
            { find: /wisp/g, replace: '𝘫𝘫𝘢𝘯𝘨𝘶' },
            { find: /dazzle/g, replace: '𝘵𝘢𝘳𝘰-𝘤𝘩𝘢𝘯' },
            { find: /spunk/g, replace: '𝘥𝘥𝘰𝘳𝘪' },
            { find: /jinx/g, replace: '𝘥𝘢𝘳𝘬𝘣𝘪𝘯' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
                ],
        '2767386': [ // CORTIS's page
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
            { find: /Public Access/g, replace: 'Music Bank' },
            { find: /Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Late Show/g, replace: 'Show! Music Core' },
            { find: /Morning Show/g, replace: 'SBS Inkigayo' },
        ],
        '3247354': [ // Kitti Gillis
            { find: /Kitti Gillis/g, replace: 'Koko Koharu' },
            { find: /Kitti/g, replace: 'Koko' },
            { find: /\/off/g, replace: "og edition — your ai can't copy." },
            { find: /Bookworm's Spectacles/g, replace: 'CHANEL (Nude Glasses)' },
            { find: /\d+\s*years\s*old/gi, replace: '18 years old' },
            { find: /add subtract divide/g, replace: 'XG' },
            { find: /Silky Satin Dress/g, replace: 'XG — Cotton Jeans' },
            { find: /Koko is located/g, replace: 'Koko is also known as "ここ KO". Koko is located' },
            { find: /The Morning Show/g, replace: 'SBS Inkigayo' },
            { find: /Music Television/g, replace: 'M Countdown' },
            { find: /The Late Show/g, replace: 'Show! Music Core' },
            { find: /The Bromance Show/g, replace: 'Knowing Bros' },
            { find: /Riot Grrrl TV/g, replace: 'Show Champion' },
            { find: /Public Access TV/g, replace: 'Music Bank' },
        ],
        '3613365': [ // Ryuzen 月影
            { find: /JiaYan Xie/g, replace: 'Ryuzen 月影' },
            { find: /JiaYan/g, replace: 'Ryuzen' },
            { find: /Popmundo T-Shirt/g, replace: '与 Miu Miu Boots 2025' },
            { find: /Wedding ring/g, replace: 'CHANEL (Nude Glasses)' },
            { find: /Jeans/g, replace: 'Black Pants (Ripped)' },
            { find: /bxcrr/g, replace: 'kirishima' },
        ],
        '3581055': [ // baby
            { find: /Baby Sjoukema/g, replace: 'Mimi Tsuki 月' },
            { find: /Baby/g, replace: 'Mimi' },
            { find: /The whereabouts/g, replace: 'Mimi is also known as "mimiki". The whereabouts' },
            { find: /easier/g, replace: '月' },
        ],
        '3580776': [ // baby
            { find: /Baby Waite/g, replace: 'Nana Tsuki 月' },
            { find: /Baby/g, replace: 'Nana' },
            { find: /The whereabouts/g, replace: 'Nana is also known as "nanaki". The whereabouts' },
            { find: /levitate/g, replace: '月' },
        ],
        '3602175': [ // Ruby
            { find: /🌸 25.01/g, replace: 'tu sens la pluie ? 🌧️' },
            { find: /Reserved/g, replace: 'Fabulous' },
        ],
        '3570776': [ // jann
            { find: /Jann Barfield/g, replace: 'Yuzu Bunny 月' },
            { find: /Jann/g, replace: 'Yuzu' },
            { find: /\d+\s*years\s*old/gi, replace: '18 years old' },
        ]
  };

  // ===========================================================================
  // PART 3: ITEM REPLACEMENTS (Character pages only)
  // ===========================================================================

  const itemReplacements = {
    // Generic item replacements (applies to all character pages)
    'generic': [
      { find: /Jeansxx/g, replace: 'Balenciaga Shorts © 1917' },
    ],
    // ID-specific item replacements
    '2887796': [
      { find: /Jeans/g, replace: 'Balenciaga Shorts © 1917' },
      { find: /T-Shirt \(BarbapapaZ\)/g, replace: 'T-Shirt (RIIZE & Realise)' },
      { find: /Popmundo T-Shirt/g, replace: 'T-Shirt ─ 河井瑠花' },
      { find: /Maldición de McCracken/g, replace: 'Signed by Park Wonbin' },
      { find: /Snake Ring/g, replace: 'Bra' },
      { find: /Bookworm's Spectacles/g, replace: 'ToNyangdeok ─ Riizko © 2025' }
    ],
    '3620400': [
      { find: /Popmundo T-Shirt/g, replace: 'T-Shirt ─ 河井瑠花' },
      { find: /000s/g, replace: 'LABUBU ラブブ' },
      { find: /Jeans/g, replace: 'Balenciaga Shorts © 1917' },
      { find: /ttt/g, replace: 'CHANEL ─ CH3392' }
    ],
    '3620479': [
      { find: /Jeans/g, replace: 'Balenciaga Shorts © 1917' },
      { find: /Popmundo T-Shirt/g, replace: 'T-Shirt ─ 河井瑠花' }
    ],
    '3616694': [
      { find: /Jeans/g, replace: 'Balenciaga Shorts © 1917' },
      { find: /Popmundo T-Shirt/g, replace: 'T-Shirt ─ IVE' }
    ],
    '3617745': [
      { find: /Jeans/g, replace: 'CELINE © 1945' },
      { find: /(Gray Cotton)/g, replace: 'RIIZE' },
      { find: /Ear plugs/g, replace: 'Star Necklace' },
      { find: /Hooded Jacket/g, replace: 'RIIZE Jersey 2024' },
      { find: /Black Cotton/g, replace: 'Wonbin' }
    ],
    '3498957': [
      { find: /High Elven Ears/g, replace: 'CELINE © 1945' },
      { find: /Dress/g, replace: 'RIIZE Jersey 2024' },
      { find: /Red Cotton/g, replace: 'Wonbin ᝰ.ᐟ' },
      { find: /Bunny ears/g, replace: 'Star Necklace' },
      { find: /Bookworm's Spectacles/g, replace: 'Gloves (Acne Studios © 2011)' }
    ],
    '3613832': [
      { find: /Jeans/g, replace: 'Balenciaga Shorts © 1917' },
      { find: /Popmundo T-Shirt/g, replace: 'T-Shirt ─ 河井瑠花' },
      { find: /Tabi Boots/g, replace: 'LABUBU ラブブ' },
      { find: /Ma Baker/g, replace: 'Dada' }
    ],
    '3568978': [
      { find: /Bookworm's Spectacles/g, replace: 'Prada Bag © 2003' },
      { find: /Rock Style Chain Corset/g, replace: 'Black Balenciaga Cap ™ ' }
    ],
    '3570664': [
      { find: /Bookworm's Spectacles/g, replace: 'Vetements Hoodie' },
      { find: /Zombies Ate My Brain/g, replace: 'Comme des Garçons' },
      { find: /Large gold earrings/g, replace: 'Miu Miu Boots ® 葵空' }
    ],
    '3570722': [
      { find: /Bookworm's Spectacles/g, replace: 'Acne Studios Gloves © 2011' },
      { find: /Snake Ring/g, replace: 'Pokemon ポケモン Luvdisc' },
      { find: /Jeans/g, replace: 'Gucci Slides © 1994' },
      { find: /Bunny ears/g, replace: 'Off-White Belt ™' },
      { find: /Popmundo T-shirt/g, replace: 'Keychain' },
      { find: /20th Anniversary/g, replace: 'Doraemon Nostalgia ®' }
    ],
    '3571113': [
      { find: /Bookworm's Spectacles/g, replace: 'Givenchy Coat ®' },
      { find: /Jeans/g, replace: 'Sanrio サンリオ Ghost Club ™' }
    ]
    // add more character item replacements here
  };

  // ===========================================================================
  // HELPER FUNCTIONS
  // ===========================================================================

  function applyReplacements(container, replacements) {
    if (!container || !replacements.length) return;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // Avoid replacing inside script, style, or button elements
        if (node.parentNode.tagName === 'SCRIPT' ||
            node.parentNode.tagName === 'STYLE' ||
            node.parentNode.closest('button')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      let text = node.nodeValue;
      for (const r of replacements) {
        text = text.replace(r.find, r.replace);
      }
      if (text !== node.nodeValue) {
        node.nodeValue = text;
      }
    }
  }

  function getCharacterId() {
    // Try to get character ID from URL
    const urlMatch = window.location.href.match(/Character\/(?:[^\/]+\/)?(\d+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Check for "General Information" link on Character pages
    const menuLink = Array.from(document.querySelectorAll('.menu a'))
      .find(a => a.textContent.trim() === "General Information");
    if (menuLink) {
      const m = menuLink.getAttribute('href').match(/Character\/(\d+)/);
      if (m) return m[1];
    }

    return null;
  }

  function getPageIds() {
    const ids = [];
    const urlMatch = window.location.href.match(/(Character|Artist|Locale)\/(\d+)/);
    if (urlMatch) {
      ids.push(urlMatch[2]);
    }

    // Check for "General Information" link to get ID on Character/Artist pages
    const menuLink = Array.from(document.querySelectorAll('.menu a'))
      .find(a => a.textContent.trim() === "General Information");
    if (menuLink) {
      const m = menuLink.getAttribute('href').match(/(Character|Artist)\/(\d+)/);
      if (m && !ids.includes(m[2])) ids.push(m[2]);
    }

    // Add logic for the Interact page
    if (window.location.href.includes('/Interact')) {
      const interactLinks = document.querySelectorAll('.box h2 a');
      interactLinks.forEach(link => {
        const m = link.getAttribute('href').match(/(Character|Artist)\/(\d+)/);
        if (m && !ids.includes(m[2])) {
          ids.push(m[2]);
        }
      });
    }

    // Check for locale links on any page
    const localeLinks = document.querySelectorAll('a[href*="/Locale/"]');
    localeLinks.forEach(link => {
      const m = link.getAttribute('href').match(/\/Locale\/(\d+)/);
      if (m && !ids.includes(m[1])) {
        ids.push(m[1]);
      }
    });

    return ids;
  }

  // ===========================================================================
  // MAIN EXECUTION LOGIC
  // ===========================================================================

  function main() {
    // ALWAYS apply global replacements on every page
    applyReplacements(document.body, globalReplacements);

    // Check if we're on a Character/Artist/Locale/Interact page
    const isSpecificPage = window.location.href.match(
      /\/Popmundo\.aspx\/(Character|Artist|Interact|Locale)/
    );

    if (isSpecificPage) {
      // For specific pages, also apply ID-specific text replacements
      const pageIds = getPageIds();
      let allSpecificReplacements = [...idSpecificReplacements.global];

      // Combine global rules with specific rules for all detected IDs
      pageIds.forEach(id => {
        if (idSpecificReplacements[id]) {
          allSpecificReplacements = allSpecificReplacements.concat(idSpecificReplacements[id]);
        }
      });

      // Apply ID-specific text replacements (in addition to global ones)
      if (allSpecificReplacements.length > 0) {
        applyReplacements(document.body, allSpecificReplacements);
      }
    }

    // Check if we're on a Character page for item replacements
    if (window.location.href.includes('/Popmundo.aspx/Character')) {
      const charId = getCharacterId();
      let itemReplacementList = [...itemReplacements.generic];

      if (charId && itemReplacements[charId]) {
        itemReplacementList = itemReplacementList.concat(itemReplacements[charId]);
      }

      // Apply item replacements
      if (itemReplacementList.length > 0) {
        applyReplacements(document.body, itemReplacementList);
      }
    }

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Always apply global replacements
            applyReplacements(node, globalReplacements);

            // Apply ID-specific text replacements if on specific pages
            if (isSpecificPage) {
              const pageIds = getPageIds();
              let allSpecificReplacements = [...idSpecificReplacements.global];
              pageIds.forEach(id => {
                if (idSpecificReplacements[id]) {
                  allSpecificReplacements = allSpecificReplacements.concat(idSpecificReplacements[id]);
                }
              });
              if (allSpecificReplacements.length > 0) {
                applyReplacements(node, allSpecificReplacements);
              }
            }

            // Apply item replacements if on Character page
            if (window.location.href.includes('/Popmundo.aspx/Character')) {
              const charId = getCharacterId();
              let itemReplacementList = [...itemReplacements.generic];

              if (charId && itemReplacements[charId]) {
                itemReplacementList = itemReplacementList.concat(itemReplacements[charId]);
              }

              if (itemReplacementList.length > 0) {
                applyReplacements(node, itemReplacementList);
              }
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Run the main function
  main();
})();