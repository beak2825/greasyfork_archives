// ==UserScript==
// @name        GGn forum color picker
// @namespace   Violentmonkey Scripts
// @match       https://gazellegames.net/forums.php?action=viewthread&threadid=*
// @grant       none
// @version     1.0
// @author      Rope100M
// @description 9/6/2025, 11:40:34 AM
// @downloadURL https://update.greasyfork.org/scripts/548572/GGn%20forum%20color%20picker.user.js
// @updateURL https://update.greasyfork.org/scripts/548572/GGn%20forum%20color%20picker.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var colorList = `Pink|#FFC0CB;
Lightpink|#FFB6C1;
Hotpink|#FF69B4;
Deeppink|#FF1493;
Palevioletred|#D87093;
Mediumvioletred|#C71585;
Lavender|#E6E6FA;
Thistle|#D8BFD8;
Plum|#DDA0DD;
Orchid|#DA70D6;
Violet|#EE82EE;
Fuchsia|#FF00FF;
Magenta|#FF00FF;
Mediumorchid|#BA55D3;
Darkorchid|#9932CC;
Darkviolet|#9400D3;
Blueviolet|#8A2BE2;
Darkmagenta|#8B008B;
Purple|#800080;
Mediumpurple|#9370D8;
Mediumslateblue|#7B68EE;
Slateblue|#6A5ACD;
Darkslateblue|#483D8B;
Rebeccapurple|#663399;
Indigo|#4B0082;
Lightsalmon|#FFA07A;
Salmon|#FA8072;
Darksalmon|#E9967A;
Lightcoral|#F08080;
Indianred|#CD5C5C;
Crimson|#DC143C;
Red|#FF0000;
Firebrick|#B22222;
Darkred|#8B0000;
Maroon|#800000;
Orange|#FFA500;
Darkorange|#FF8C00;
Coral|#FF7F50;
Tomato|#FF6347;
Orangered|#FF4500;
Gold|#FFD700;
Yellow|#FFFF00;
Lightyellow|#FFFFE0;
Lemonchiffon|#FFFACD;
Lightgoldenrodyellow|#FAFAD2;
Papayawhip|#FFEFD5;
Moccasin|#FFE4B5;
Peachpuff|#FFDAB9;
Palegoldenrod|#EEE8AA;
Khaki|#F0E68C;
Darkkhaki|#BDB76B;
Goldenrod|#DAA520;
Darkgoldenrod|#B8860B;
Greenyellow|#ADFF2F;
Chartreuse|#7FFF00;
Lawngreen|#7CFC00;
Lime|#00FF00;
Limegreen|#32CD32;
Palegreen|#98FB98;
Lightgreen|#90EE90;
Springgreeny|#00FA9A;
Springgreen|#00FF7F;
Mediumseagreen|#3CB371;
Seagreen|#2E8B57;
Forestgreen|#228B22;
Green|#008000;
Darkgreen|#006400;
Yellowgreen|#9ACD32;
Olivedrab|#688E23;
Olive|#808000;
Darkolivegreen|#556B2F;
Mediumaquamarine|#66CDAA;
Darkseagreen|#8FBC8F;
Lightseagreen|#20B2AA;
Darkcyan|#008B8B;
Teal|#008080;
Aqua|#00FFFF;
Cyan|#00FFFF;
Lightcyan|#E0FFFF;
Paleturquoise|#AFEEEE;
Aquamarine|#7FFFD4;
Turquoise|#40E0D0;
Mediumturquoise|#48D1CC;
Darkturquoise|#00CED1;
Cadetblue|#5F9EA0;
Steelblue|#4682B4;
Lightsteelblue|#B0C4DE;
Lightblue|#ADD8E6;
Powderblue|#B0E0E6;
Lightskyblue|#87CEFA;
Skyblue|#87CEEB;
Cornflowerblue|#6495ED;
Deepskyblue|#00BFFF;
Dodgerblue|#1E90FF;
Royalblue|#4169E1;
Blue|#0000FF;
Mediumblue|#0000CD;
Darkblue|#00008B;
Navy|#000080;
Midnightblue|#191970;
Cornsilk|#FFF8DC;
Blanchedalmond|#FFEBCD;
Bisque|#FFE4C4;
Navajowhite|#FFDEAD;
Wheat|#F5DEB3;
Burlywood|#DEB887;
Tan|#D2B48C;
Rosybrown|#BC8F8F;
Sandybrown|#F4A460;
Peru|#CD853F;
Chocolate|#D2691E;
Saddlebrown|#8B4513;
Sienna|#A0522D;
Brown|#A52A2A;
White|#FFFFFF;
Snow|#FFFAFA;
Honeydew|#F0FFF0;
Mintcream|#F5FFFA;
Azure|#F0FFFF;
Aliceblue|#F0F8FF;
Ghostwhite|#F8F8FF;
Whitesmoke|#F5F5F5;
Seashell|#FFF5EE;
Beige|#F5F5DC;
Oldlace|#FDF5E6;
Floralwhite|#FFFAF0;
Ivory|#FFFFF0;
Antiquewhite|#FAEBD7;
Linen|#FAF0E6;
Lavenderblush|#FFF0F5;
Mistyrose|#FFE4E1;
Gainsboro|#DCDCDC;
Lightgray|#D3D3D3;
Silver|#C0C0C0;
Darkgray|#A9A9A9;
Dimgray|#696969;
Gray|#808080;
Lightslategray|#778899;
Slategray|#708090;
Darkslategray|#2F4F4F;
Black|#000000;`

  function colorPickerShow() {
    console.log("test");
    document.getElementById('plugin-color-picker-div').style.visibility = "visible";
  }

  function colorPickerHide() {
    document.getElementById('plugin-color-picker-div').style.visibility = "hidden";
  }

  function addColorPicker() {
    const style = document.createElement('style');
    style.textContent = `#plugin-color-picker-div span:hover {
      font-weight: bold;
      text-decoration: underline overline #fff;
    }`;
    document.head.appendChild(style);

    let colorPickerDiv = document.createElement("div");

    colorList.split(";").filter(Boolean).forEach(c => {
      let [name, hexColor] = c.split("|");

      let colorSpan = document.createElement("span");
      colorSpan.style.fontSize = "1.2em";
      colorSpan.style.width = "140px";
      colorSpan.style.display = "inline-block";
      colorSpan.style.color = hexColor;
      colorSpan.style.cursor = "pointer";
      colorSpan.innerHTML = name;
      colorSpan.onclick = function() {
        colorPickerHide();
        wrapText('quickpost', hexColor + "]", '');
      };

      colorPickerDiv.appendChild(colorSpan);
    });

    colorPickerDiv.id = "plugin-color-picker-div";
    colorPickerDiv.style.visibility = "hidden";
    colorPickerDiv.style.position = "fixed";
    colorPickerDiv.style.bottom = "10px";
    colorPickerDiv.style.right = "10px";
    colorPickerDiv.style.zIndex = "999999";
    colorPickerDiv.style.width = "460px";
    colorPickerDiv.style.height = "400px";
    colorPickerDiv.style.overflow = "auto";
    colorPickerDiv.style.backgroundImage = "url('/static/styles/game_room/images/smokeybackground.jpg')";
    colorPickerDiv.style.backgroundSize = "cover";
    colorPickerDiv.style.backgroundPosition = "center";
    colorPickerDiv.style.border = "2px solid white";
    colorPickerDiv.style.padding = "10px";

    document.body.appendChild(colorPickerDiv);
  }

  function onPageLoaded() {
    addColorPicker();
    const btn = document.getElementById('bb_color');

    if (btn) {
      btn.setAttribute('onclick', "wrapText('quickpost', '[color=', '[/color]'); return false;")

      btn.addEventListener('click', colorPickerShow);
    }
  }

  if (document.readyState === 'complete') {
    onPageLoaded();
  } else {
    window.addEventListener('load', onPageLoaded, { once: true });
  }
})();