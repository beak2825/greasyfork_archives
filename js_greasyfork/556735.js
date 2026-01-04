// ==UserScript==
// @name         Catbox Anime Girl Database
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  view catbox  (
// @author       You
// @match        https://catbox.moe/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/556735/Catbox%20Anime%20Girl%20Database.user.js
// @updateURL https://update.greasyfork.org/scripts/556735/Catbox%20Anime%20Girl%20Database.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageNames = [
        "1363382418078.png", "141000167429.png", "1410001686910.png", "1410306398205.png",
        "1416301704148.png", "1422254058570.png", "1422254999827.png", "1424092566613.png",
        "1428177826695.png", "1428177904344.png", "1428178080167.png", "1428178155255.png",
        "1428178187507.png", "1428254016467.png", "1428423289437.png", "1428707759205.png",
        "1429510703681.png", "14350958102351.png", "1435095810963.png", "1435212506997.png",
        "1436240851027.png", "1444797684947.png", "1444797896875.png", "1444912076567.png",
        "1444925656945.png", "1444932063639.png", "1445288849940.png", "1445289056206.png",
        "1445902711571.png", "1446055508030.png", "1446382234634.png", "1446463082730.png",
        "1446543984763.png", "1446567791227.png", "1446781681255.png", "1447699627084.png",
        "1448061734635.png", "1448184200057.png", "1448242472700.png", "1448242666775.png",
        "1448491901093.png", "1450726187259.png", "1448856052869.png", "1449726465401.png",
        "1450354879735.png", "1450722871010.png", "1450724583409.png", "1450726187259.png",
        "1453766877670.png", "1456435736475.png", "1456626037119.png", "1456795820199.png",
        "1457227943457.png", "1457343592535.png", "1457740113058.png", "1457765150963.png",
        "1457903809526.png", "1458107401807.png", "1458114655716.png", "1458179149667.png",
        "1458181302393.png", "1458378445396.png", "1458438424722.png", "1458593213144.png",
        "1458602218407.png", "1458689827974.png", "1458695854180.png", "1458701216283.png",
        "1458879883654.png", "1459005360759.png", "1459039594461.png", "1466924283295.png",
        "1468421480662.png", "1471262460053.png", "1471285748918.png", "1472894659994.png",
        "1480486527028.png", "1484879057343.png", "1486346829409.png", "1489034771085.png",
        "1489257402500.png", "1489281927118.png", "1489297097940.png", "1490418851494.png",
        "1492281060221.png", "1494909700688.png", "1506616576326.png", "1512072270390.png",
        "1512276789957.png", "7ckzd1.png", "e1c25e2f18430875d15fdcfbb14257e8.png",
        "megumin_1.png", "megumin_2.png", "nz5vnb.png", "patreon-1.png", "patreon-2.png",
        "patreon-3.png", "patreon-4.png", "patreon-5.png", "e9b96c420ce18817342e49c48a6474c589e681ba.png",
        "e5fb6b20a0c08e4c1e8b8240311b086649ee22e5.png", "d4eab1c1e9ed18b875bf126ca2695a3f6eb19572.png",
        "c2289fbdd0c68b41ab577b5aea13ce57244ae761.png", "c7a2402a46d629ecbc4ede1013725579ed5bfad8.png",
        "b938a56e8a244d36ad95d03747c885e113f85c2a.png", "b3bbb9663ede2787c679ed87bb275989b87a92d7.png",
        "ae317675248165f9eb0e5d1e8acb4133313c5338.png", "ac0d60cadc20650dc2b1909d986d6c2c0b851957.png",
        "a33ae892991a84c1b5bc21e0a94a2cd112983d8a.png", "a5f8a60024d2e767c4f914c7959f3bf3af6c310e.png",
        "05231e2b5d3b8a349e05a8faeeb811238c936a87.png", "0708bf53626f99a3d48af309bd68726e6cf3069b.png",
        "0405c517061c231de1b82ae64cdc705d84309bec.png", "300c90359065eff5d5bd8b7f7960b97c6b038698.png",
        "85bc49d77b4d6c6b8de30ba8dcb09fd8953c998f.png", "73a31b9f354dcf44d613ad260ad3fb3b050c4e1b.png",
        "041b992b2d1d471f4c9141ce6d7693feba846661.png", "027f2e9193b1421b57f8c346864b5e76a4dcf06e.png",
        "9f02075ced49095a4b0af001204b86b59a37fc64.png", "9b2c84b3e011ab903073ce52c0b6ba0bdf620aea.png",
        "8c3320676e921e900f0ff432afb3774179250c50.png", "7fd5965f41dcc6d73b13a9338ff9d90f76f712fe.png",
        "5db1e4e942be929fd139d895f6ada111941a0806.png", "5c48162e4446d4c0597813804f8a8f65e60791b5.png",
        "5a1998883c5f117fd913cbc2bfa9ea86d2f47e37.png", "4babdfe8cc20226b619089b55e613eacdcadf77b.png",
        "3d31d92b4fdfa126bca3aa0c3d9210350f3b8943.png", "3c15b632c4d1cf2406585f335f69c201011e033b.png",
        "2c003b12e53212fc13595e092d96b6282f86d456.png"
    ];

    var s = document.createElement('style');
    s.innerHTML = `
        .gallery-btn {
            position: fixed;
            bottom: 15px;
            left: 15px;
            z-index: 999;
            padding: 10px 18px;
            background: #444;
            color: white;
            border: 1px solid #666;
            cursor: pointer;
            font-size: 13px;
        }
        .gallery-btn:hover {
            background: #555;
        }
        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            overflow: auto;
            padding: 20px;
        }
        .overlay.show {
            display: block;
        }
        .gallery-box {
            background: #333;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .gallery-box h2 {
            color: #ddd;
            margin-top: 0;
        }
        .close-btn {
            background: #333333;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            float: right;
        }
        .imgs {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 20px;
        }
        .img-item {
            width: 200px;
            background: #222;
            border: 1px solid #444;
            padding: 8px;
        }
        .img-item img {
            width: 100%;
            height: auto;
            cursor: pointer;
        }
        .img-name {
            font-size: 11px;
            color: #999;
            margin: 5px 0;
            word-break: break-all;
        }
        .dl-btn {
            background: #555;
            color: #ddd;
            border: 1px solid #666;
            padding: 5px 8px;
            cursor: pointer;
            font-size: 11px;
            width: 100%;
        }
        .dl-btn:hover {
            background: #666;
        }
        .lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 1001;
        }
        .lightbox.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lightbox img {
            max-width: 90%;
            max-height: 90%;
        }
    `;
    document.head.appendChild(s);

    var btn = document.createElement('button');
    btn.className = 'gallery-btn';
    btn.textContent = 'View database';
    btn.style.display = 'none';
    document.body.appendChild(btn);

    setTimeout(function() {
        btn.style.display = 'block';
    }, 3000);

    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    btn.onclick = function() {
        overlay.classList.add('show');
        showGallery();
    };

    lightbox.onclick = function() {
        lightbox.classList.remove('show');
        lightbox.innerHTML = '';
    };

    overlay.onclick = function(e) {
        if (e.target == overlay) {
            overlay.classList.remove('show');
        }
    };

    function showGallery() {
        var html = '<div class="gallery-box"><button class="close-btn">X</button><h2>Images</h2><div class="imgs">';

        for (var i = 0; i < imageNames.length; i++) {
            var name = imageNames[i];
            var path = 'pictures/qts/' + name;
            html += '<div class="img-item">';
            html += '<img src="' + path + '" onclick="showBig(\'' + path + '\')">';
            html += '<div class="img-name">' + name + '</div>';
            html += '<button class="dl-btn" onclick="download(\'' + path + '\', \'' + name + '\')">Download</button>';
            html += '</div>';
        }

        html += '</div></div>';
        overlay.innerHTML = html;

        overlay.querySelector('.close-btn').onclick = function() {
            overlay.classList.remove('show');
        };
    }

    window.showBig = function(path) {
        lightbox.innerHTML = '<img src="' + path + '">';
        lightbox.classList.add('show');
    };

    window.download = function(path, name) {
        fetch(path).then(function(response) {
            return response.blob();
        }).then(function(blob) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }).catch(function(err) {
            var a = document.createElement('a');
            a.href = path;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };

})();