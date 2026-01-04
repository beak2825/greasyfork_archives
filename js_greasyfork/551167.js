// ==UserScript==
// @name 随机网页背景，适用手机
// @namespace wwdboy
// @version 1.1.9.91
// @description 使用Chrome以及stylus插件获得完整体验
// @author wwdboy
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @include /^(?:.*)$/
// @downloadURL https://update.greasyfork.org/scripts/551167/%E9%9A%8F%E6%9C%BA%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%EF%BC%8C%E9%80%82%E7%94%A8%E6%89%8B%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551167/%E9%9A%8F%E6%9C%BA%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%EF%BC%8C%E9%80%82%E7%94%A8%E6%89%8B%E6%9C%BA.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
        const images = [
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1728214854620%7E01.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1746510956071%7E01.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1747367736823%7E01.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1751516048193.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1752589593451.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1752589606047.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1752753096328.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1752753112713.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1752753818603.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1753095029965.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1753095045009.jpg",
        "https://raw.githubusercontent.com/wwdboy197957/mypictures/refs/heads/mobile-pictures-small/1753095129687.jpg"        
    ];
 
    const img = images[Math.floor(Math.random() * images.length)];
 
    GM_addStyle(`
        body::before {
            content: "";
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -100;
            background-image: url(${img});
            background-position: center;
            background-size: cover;
            background-attachment: fixed;
            background-repeat: no-repeat;
            opacity: 1;
        }
    `);
})();