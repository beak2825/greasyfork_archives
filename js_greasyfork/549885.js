// ==UserScript==
// @name         Flight Rising: AH Additional Dragon Info
// @namespace    https://github.com/dragonjpg
// @author       dragon.jpg
// @description  add labels for dragon colors, g1 status (optional), double color patterns (optional), & consecutive colors (optional). Data is sourced from the dragon tooltips that are rendered on the page. Edit script to change settings. Based on zombae's script: https://greasyfork.org/en/scripts/412508 & fully compatible with my dark mode and compact auction house userstyles
// @match        https://*.flightrising.com/auction-house/buy/*/dragons*
// @grant        none
// @version      1.0.0
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @downloadURL https://update.greasyfork.org/scripts/549885/Flight%20Rising%3A%20AH%20Additional%20Dragon%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/549885/Flight%20Rising%3A%20AH%20Additional%20Dragon%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // -- CHANGE THESE VALUES TO CUSTOMIZE ---
    let settings = {
      timeout : 500,
      show_color_names : true,
      label_color_patterns : true,
      label_gen_ones : true,
      mark_xyz_123_achievement : false
    };
  // ---------------------------------------

  // append necessary styles
  const head = document.head || document.getElementsByTagName('head')[0],
  style = document.createElement('style'),
  css = getStyles();
  head.appendChild(style);
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  // get dragons & loop over them
  const dragonRow = document.querySelectorAll('.ah-listing-row');
  dragonRow.forEach(dragon => {
    let wrapper = dragon.querySelector('.ah-coli-level'),
      dragon_id = dragon.getAttribute('data-listing-dragonid'),
      dragon_tip = `dragontip-${dragon_id}`,
      colorblocks_wrapper = document.createElement('div');

    colorblocks_wrapper.classList = "colorblocks";

    setTimeout( function() {
        getDragonTipInfo(dragon_tip, colorblocks_wrapper, wrapper);
        wrapper.after(colorblocks_wrapper);
    }, settings.timeout );
  });

  // gets information from the invisible dragon tooltips on page load
  // original function by zombae: https://greasyfork.org/en/scripts/412508
  function getDragonTipInfo(dragon_tip, colorblocks_wrapper, parent_wrapper ) {
    let dragon_info = document.getElementById(dragon_tip),
        colors = [dragon_info.querySelector('div:nth-child(2) > div:nth-child(4)').innerText.split('Primary Gene:')[1].split(' ')[1],
                      dragon_info.querySelector('div:nth-child(2) > div:nth-child(5)').innerText.split('Secondary Gene:')[1].split(' ')[1],
                      dragon_info.querySelector('div:nth-child(2) > div:nth-child(6)').innerText.split('Tertiary Gene:')[1].split(' ')[1]];

    // check if its a g1
    if (settings.label_gen_ones && dragon_info.querySelector('div:nth-child(2) > div:nth-child(3) span[style*="color"]')) {
      var g1 = document.createElement("strong");
      g1.innerText = "G1 ";
      parent_wrapper.prepend(g1);
    }

    // label as XXX, XXY, XYY, or XYX
    if (settings.label_color_patterns) {
      if (colors[0] == colors[1] && colors[0] == colors[2]) {
        var xxx = document.createElement("em");
        xxx.innerHTML = `<span class="double">XXX</span> `;
        parent_wrapper.prepend(xxx);
      } else if (colors[0] == colors[1]) {
        var xxy = document.createElement("em");
        xxy.innerHTML = `<span class="double">XX</span>Y `;
        parent_wrapper.prepend(xxy);
      } else if (colors[1] == colors[2]) {
        var xyy = document.createElement("em");
        xyy.innerHTML = `X<span class="double">YY</span> `;
        parent_wrapper.prepend(xyy);
      } else if (colors[0] == colors[2]) {
        var xyx = document.createElement("em");
        xyx.innerHTML = `<span class="double">X</span>Y<span class="double">X</span> `;
        parent_wrapper.prepend(xyx);
      }
    }
    // add color info to listing
    colors.forEach( color => {
      renderColorblock(color, colorblocks_wrapper);
    })

    // mark xyz achievement dragons
    if (settings.mark_xyz_123_achievement) {
      let color_ids = [
          frColors.find(index => index.name === colors[0]).id,
          frColors.find(index => index.name === colors[1]).id,
          frColors.find(index => index.name === colors[2]).id
      ]
      if (checkAchieveXYZ(color_ids)) {
        let achiev_badge = document.createElement("img");
        achiev_badge.src = `/static/layout/icon_achievement_points.png`;
        achiev_badge.title = `Consecutive Color Parent for "When XYZ Meets 123"`;
        colorblocks_wrapper.prepend(achiev_badge);
      }
    }
  }

  function renderColorblock( colour, colorblocks_wrapper ) {
    // original function by zombae: https://greasyfork.org/en/scripts/412508
      let colorBlock = document.createElement('div'),
          getHex = frColors.find(index => index.name === colour).hex,
          getID = frColors.find(index => index.name === colour).id,
          colorText = contrastingColor(getHex);

      colorBlock.classList = 'colorblock';
      colorBlock.style = `--bg: ${getHex}; --text: ${colorText};`;
      colorBlock.innerHTML = ((settings.show_color_names)) ? colour : ``;

      colorblocks_wrapper.appendChild(colorBlock);
  }

  function checkAchieveXYZ(colors) {
    let min = 1, max = 177;

    let primary_forward_one = ( colors[0] + 1 > max ) ? (colors[0] + 1) % max : colors[0] + 1,
        primary_forward_two = ( colors[0] + 2 > max ) ? (colors[0] + 2) % max : colors[0] + 2,
        reversed_colors = [...colors].reverse(),
        primary_backward_one = ( reversed_colors[0] + 1 > max ) ? (reversed_colors[0] + 1) % max : reversed_colors[0] + 1,
        primary_backward_two = ( reversed_colors[0] + 2 > max ) ? (reversed_colors[0] + 2) % max : reversed_colors[0] + 2,
        forwards = (primary_forward_one == colors[1] && primary_forward_two == colors[2]),
        backwards = (primary_backward_one == reversed_colors[1] && primary_backward_two == reversed_colors[2]);

    return forwards || backwards;
  }

  function getStyles() {
    let css = `
    .ah-listing-center {
      width: 180px;
      top: 8px;
    }
    div.ah-coli-level:has(strong, em) {
      width: 100%;
      text-align: left;
    }
    .colorblocks {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 0.5em;
      grid-gap: 0.2em;
      min-height: 12px;
    }
    .colorblocks img {
      width: 15px;
      height: 15px;
      padding-bottom: 0;
    }
    .colorblock {
      background: var(--bg);
      color: var(--text);
      padding: 0.2em 0.5em;
      font-size: 0.9em;
      display: inline-block;
      width: 33%;
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }
    span.double {
      font-weight: bold;
      color: rgba(var(--success, 	53, 94, 59))
    }
    em:has(.double) {
      font-style: normal;
    }
    `;
    return css;
  }

  function contrastingColor(backgroundColor) {
    // https://dev.to/louis7/how-to-choose-the-font-color-based-on-the-background-color-402a
    // for determining text color for each color block
    backgroundColor = backgroundColor.substring(1);
    const r = parseInt(backgroundColor.substring(0,2), 16); // 0 ~ 255
    const g = parseInt(backgroundColor.substring(2,4), 16);
    const b = parseInt(backgroundColor.substring(4,6), 16);

    const srgb = [r / 255, g / 255, b / 255];
    const x = srgb.map((i) => {
      if (i <= 0.04045) {
        return i / 12.92;
      } else {
        return Math.pow((i + 0.055) / 1.055, 2.4);
      }
    });

    const L = 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2];
    return L > 0.179 ? "#000" : "#fff";
  }

  // list of all colors
    const frColors = [
        {
            "id": 1,
            "name": "Maize",
            "hex": "#FFFDEA"
        },
        {
            "id": 2,
            "name": "Cream",
            "hex": "#FFEFDC"
        },
        {
            "id": 3,
            "name": "Antique",
            "hex": "#D8D6CD"
        },
        {
            "id": 4,
            "name": "White",
            "hex": "#FFFFFF"
        },
        {
            "id": 5,
            "name": "Moon",
            "hex": "#D8D7D8"
        },
        {
            "id": 6,
            "name": "Ice",
            "hex": "#F1F3FF"
        },
        {
            "id": 7,
            "name": "Orca",
            "hex": "#E1DFFF"
        },
        {
            "id": 8,
            "name": "Platinum",
            "hex": "#C8BECE"
        },
        {
            "id": 9,
            "name": "Silver",
            "hex": "#BBBABF"
        },
        {
            "id": 10,
            "name": "Dust",
            "hex": "#9D9D9F"
        },
        {
            "id": 11,
            "name": "Grey",
            "hex": "#808080"
        },
        {
            "id": 12,
            "name": "Smoke",
            "hex": "#9494A9"
        },
        {
            "id": 13,
            "name": "Gloom",
            "hex": "#545365"
        },
        {
            "id": 14,
            "name": "Lead",
            "hex": "#413C40"
        },
        {
            "id": 15,
            "name": "Shale",
            "hex": "#4D484F"
        },
        {
            "id": 16,
            "name": "Flint",
            "hex": "#636268"
        },
        {
            "id": 17,
            "name": "Charcoal",
            "hex": "#555555"
        },
        {
            "id": 18,
            "name": "Coal",
            "hex": "#4B4946"
        },
        {
            "id": 19,
            "name": "Oilslick",
            "hex": "#352C27"
        },
        {
            "id": 20,
            "name": "Black",
            "hex": "#333333"
        },
        {
            "id": 21,
            "name": "Obsidian",
            "hex": "#1D2224"
        },
        {
            "id": 22,
            "name": "Eldritch",
            "hex": "#252A24"
        },
        {
            "id": 23,
            "name": "Midnight",
            "hex": "#392D43"
        },
        {
            "id": 24,
            "name": "Shadow",
            "hex": "#292B38"
        },
        {
            "id": 25,
            "name": "Blackberry",
            "hex": "#4C2A4F"
        },
        {
            "id": 26,
            "name": "Mulberry",
            "hex": "#6E235D"
        },
        {
            "id": 27,
            "name": "Plum",
            "hex": "#863290"
        },
        {
            "id": 28,
            "name": "Wisteria",
            "hex": "#724D79"
        },
        {
            "id": 29,
            "name": "Thistle",
            "hex": "#8F7C8B"
        },
        {
            "id": 30,
            "name": "Fog",
            "hex": "#A794B2"
        },
        {
            "id": 31,
            "name": "Mist",
            "hex": "#E1CDFE"
        },
        {
            "id": 32,
            "name": "Lavender",
            "hex": "#CCA4E0"
        },
        {
            "id": 33,
            "name": "Heather",
            "hex": "#9778BE"
        },
        {
            "id": 34,
            "name": "Purple",
            "hex": "#A261CF"
        },
        {
            "id": 35,
            "name": "Orchid",
            "hex": "#DA4FFF"
        },
        {
            "id": 36,
            "name": "Amethyst",
            "hex": "#993BD1"
        },
        {
            "id": 37,
            "name": "Nightshade",
            "hex": "#7930B5"
        },
        {
            "id": 38,
            "name": "Violet",
            "hex": "#643F9C"
        },
        {
            "id": 39,
            "name": "Grape",
            "hex": "#580FC0"
        },
        {
            "id": 40,
            "name": "Royal",
            "hex": "#4D2C89"
        },
        {
            "id": 41,
            "name": "Eggplant",
            "hex": "#3F2B66"
        },
        {
            "id": 42,
            "name": "Iris",
            "hex": "#525195"
        },
        {
            "id": 43,
            "name": "Storm",
            "hex": "#757ADB"
        },
        {
            "id": 44,
            "name": "Twilight",
            "hex": "#484AA1"
        },
        {
            "id": 45,
            "name": "Indigo",
            "hex": "#2D237A"
        },
        {
            "id": 46,
            "name": "Sapphire",
            "hex": "#0D0A5B"
        },
        {
            "id": 47,
            "name": "Navy",
            "hex": "#212B5F"
        },
        {
            "id": 48,
            "name": "Cobalt",
            "hex": "#013485"
        },
        {
            "id": 49,
            "name": "Ultramarine",
            "hex": "#1C51E7"
        },
        {
            "id": 50,
            "name": "Blue",
            "hex": "#324BA9"
        },
        {
            "id": 51,
            "name": "Periwinkle",
            "hex": "#4866D5"
        },
        {
            "id": 52,
            "name": "Lapis",
            "hex": "#2F83FF"
        },
        {
            "id": 53,
            "name": "Splash",
            "hex": "#6394DD"
        },
        {
            "id": 54,
            "name": "Cornflower",
            "hex": "#76A8FF"
        },
        {
            "id": 55,
            "name": "Sky",
            "hex": "#AEC8FF"
        },
        {
            "id": 56,
            "name": "Stonewash",
            "hex": "#7895C1"
        },
        {
            "id": 57,
            "name": "Overcast",
            "hex": "#444F69"
        },
        {
            "id": 58,
            "name": "Steel",
            "hex": "#556979"
        },
        {
            "id": 59,
            "name": "Denim",
            "hex": "#2F4557"
        },
        {
            "id": 60,
            "name": "Abyss",
            "hex": "#0D1E25"
        },
        {
            "id": 61,
            "name": "Phthalo",
            "hex": "#0B2D46"
        },
        {
            "id": 62,
            "name": "Azure",
            "hex": "#0A3D67"
        },
        {
            "id": 63,
            "name": "Caribbean",
            "hex": "#0086CE"
        },
        {
            "id": 64,
            "name": "Teal",
            "hex": "#2B768F"
        },
        {
            "id": 65,
            "name": "Cerulean",
            "hex": "#00B4D5"
        },
        {
            "id": 66,
            "name": "Cyan",
            "hex": "#00FFF1"
        },
        {
            "id": 67,
            "name": "Robin",
            "hex": "#9AEAEF"
        },
        {
            "id": 68,
            "name": "Aqua",
            "hex": "#72C4C4"
        },
        {
            "id": 69,
            "name": "Turquoise",
            "hex": "#3CA2A4"
        },
        {
            "id": 70,
            "name": "Spruce",
            "hex": "#8DBCB4"
        },
        {
            "id": 71,
            "name": "Pistachio",
            "hex": "#E2FFE6"
        },
        {
            "id": 72,
            "name": "Seafoam",
            "hex": "#B2E2BD"
        },
        {
            "id": 73,
            "name": "Mint",
            "hex": "#9AFFC7"
        },
        {
            "id": 74,
            "name": "Jade",
            "hex": "#61AB89"
        },
        {
            "id": 75,
            "name": "Spearmint",
            "hex": "#148E67"
        },
        {
            "id": 76,
            "name": "Thicket",
            "hex": "#005D48"
        },
        {
            "id": 77,
            "name": "Peacock",
            "hex": "#1F483A"
        },
        {
            "id": 78,
            "name": "Emerald",
            "hex": "#20603F"
        },
        {
            "id": 79,
            "name": "Shamrock",
            "hex": "#236825"
        },
        {
            "id": 80,
            "name": "Jungle",
            "hex": "#1E361A"
        },
        {
            "id": 81,
            "name": "Hunter",
            "hex": "#1E2716"
        },
        {
            "id": 82,
            "name": "Forest",
            "hex": "#425035"
        },
        {
            "id": 83,
            "name": "Camo",
            "hex": "#51684C"
        },
        {
            "id": 84,
            "name": "Algae",
            "hex": "#97AF8B"
        },
        {
            "id": 85,
            "name": "Swamp",
            "hex": "#687F67"
        },
        {
            "id": 86,
            "name": "Avocado",
            "hex": "#567C34"
        },
        {
            "id": 87,
            "name": "Green",
            "hex": "#629C3F"
        },
        {
            "id": 88,
            "name": "Fern",
            "hex": "#7ECE73"
        },
        {
            "id": 89,
            "name": "Mantis",
            "hex": "#9BFF9D"
        },
        {
            "id": 90,
            "name": "Pear",
            "hex": "#8ECE56"
        },
        {
            "id": 91,
            "name": "Leaf",
            "hex": "#A5E32D"
        },
        {
            "id": 92,
            "name": "Radioactive",
            "hex": "#C6FF00"
        },
        {
            "id": 93,
            "name": "Honeydew",
            "hex": "#D1E572"
        },
        {
            "id": 94,
            "name": "Peridot",
            "hex": "#E8FCB4"
        },
        {
            "id": 95,
            "name": "Chartreuse",
            "hex": "#B4CD3D"
        },
        {
            "id": 96,
            "name": "Spring",
            "hex": "#A9A032"
        },
        {
            "id": 97,
            "name": "Crocodile",
            "hex": "#828335"
        },
        {
            "id": 98,
            "name": "Olive",
            "hex": "#697135"
        },
        {
            "id": 99,
            "name": "Murk",
            "hex": "#4B4420"
        },
        {
            "id": 100,
            "name": "Moss",
            "hex": "#7E7645"
        },
        {
            "id": 101,
            "name": "Goldenrod",
            "hex": "#BEA55D"
        },
        {
            "id": 102,
            "name": "Amber",
            "hex": "#C18E1B"
        },
        {
            "id": 103,
            "name": "Honey",
            "hex": "#D1B300"
        },
        {
            "id": 104,
            "name": "Lemon",
            "hex": "#FFE63B"
        },
        {
            "id": 105,
            "name": "Yellow",
            "hex": "#F9E255"
        },
        {
            "id": 106,
            "name": "Grapefruit",
            "hex": "#F7FF6F"
        },
        {
            "id": 107,
            "name": "Banana",
            "hex": "#FFEC80"
        },
        {
            "id": 108,
            "name": "Sanddollar",
            "hex": "#EDE8B0"
        },
        {
            "id": 109,
            "name": "Flaxen",
            "hex": "#FDE9AC"
        },
        {
            "id": 110,
            "name": "Ivory",
            "hex": "#FFD297"
        },
        {
            "id": 111,
            "name": "Buttercup",
            "hex": "#F6BF6C"
        },
        {
            "id": 112,
            "name": "Gold",
            "hex": "#E8AF49"
        },
        {
            "id": 113,
            "name": "Metals",
            "hex": "#D1B045"
        },
        {
            "id": 114,
            "name": "Marigold",
            "hex": "#FFB53C"
        },
        {
            "id": 115,
            "name": "Sunshine",
            "hex": "#FA912B"
        },
        {
            "id": 116,
            "name": "Saffron",
            "hex": "#FF8500"
        },
        {
            "id": 117,
            "name": "Sunset",
            "hex": "#FFA147"
        },
        {
            "id": 118,
            "name": "Peach",
            "hex": "#FFB576"
        },
        {
            "id": 119,
            "name": "Cantaloupe",
            "hex": "#FF984F"
        },
        {
            "id": 120,
            "name": "Orange",
            "hex": "#D5602B"
        },
        {
            "id": 121,
            "name": "Bronze",
            "hex": "#B2560D"
        },
        {
            "id": 122,
            "name": "Terracotta",
            "hex": "#B24407"
        },
        {
            "id": 123,
            "name": "Carrot",
            "hex": "#FF5500"
        },
        {
            "id": 124,
            "name": "Fire",
            "hex": "#EF5C23"
        },
        {
            "id": 125,
            "name": "Pumpkin",
            "hex": "#FF6841"
        },
        {
            "id": 126,
            "name": "Tangerine",
            "hex": "#FF7360"
        },
        {
            "id": 127,
            "name": "Cinnamon",
            "hex": "#C15A39"
        },
        {
            "id": 128,
            "name": "Caramel",
            "hex": "#C47149"
        },
        {
            "id": 129,
            "name": "Sand",
            "hex": "#B27749"
        },
        {
            "id": 130,
            "name": "Tan",
            "hex": "#C3996F"
        },
        {
            "id": 131,
            "name": "Beige",
            "hex": "#CABBA2"
        },
        {
            "id": 132,
            "name": "Stone",
            "hex": "#827A64"
        },
        {
            "id": 133,
            "name": "Taupe",
            "hex": "#6D675B"
        },
        {
            "id": 134,
            "name": "Slate",
            "hex": "#564D48"
        },
        {
            "id": 135,
            "name": "Driftwood",
            "hex": "#766259"
        },
        {
            "id": 136,
            "name": "Latte",
            "hex": "#977B6C"
        },
        {
            "id": 137,
            "name": "Dirt",
            "hex": "#774840"
        },
        {
            "id": 138,
            "name": "Clay",
            "hex": "#603E3D"
        },
        {
            "id": 139,
            "name": "Sable",
            "hex": "#57372C"
        },
        {
            "id": 140,
            "name": "Umber",
            "hex": "#301E1A"
        },
        {
            "id": 141,
            "name": "Soil",
            "hex": "#5A4534"
        },
        {
            "id": 142,
            "name": "Hickory",
            "hex": "#72573A"
        },
        {
            "id": 143,
            "name": "Tarnish",
            "hex": "#855B33"
        },
        {
            "id": 144,
            "name": "Ginger",
            "hex": "#91532A"
        },
        {
            "id": 145,
            "name": "Brown",
            "hex": "#8E5B3F"
        },
        {
            "id": 146,
            "name": "Chocolate",
            "hex": "#563012"
        },
        {
            "id": 147,
            "name": "Auburn",
            "hex": "#7B3C1D"
        },
        {
            "id": 148,
            "name": "Copper",
            "hex": "#A44B28"
        },
        {
            "id": 149,
            "name": "Rust",
            "hex": "#8B3220"
        },
        {
            "id": 150,
            "name": "Tomato",
            "hex": "#BA311C"
        },
        {
            "id": 151,
            "name": "Vermilion",
            "hex": "#E22D18"
        },
        {
            "id": 152,
            "name": "Ruby",
            "hex": "#CE000D"
        },
        {
            "id": 153,
            "name": "Cherry",
            "hex": "#AA0024"
        },
        {
            "id": 154,
            "name": "Crimson",
            "hex": "#850012"
        },
        {
            "id": 155,
            "name": "Garnet",
            "hex": "#581014"
        },
        {
            "id": 156,
            "name": "Sanguine",
            "hex": "#2D0102"
        },
        {
            "id": 157,
            "name": "Blood",
            "hex": "#451717"
        },
        {
            "id": 158,
            "name": "Maroon",
            "hex": "#652127"
        },
        {
            "id": 159,
            "name": "Berry",
            "hex": "#8C272D"
        },
        {
            "id": 160,
            "name": "Red",
            "hex": "#C1272D"
        },
        {
            "id": 161,
            "name": "Strawberry",
            "hex": "#DF3236"
        },
        {
            "id": 162,
            "name": "Cerise",
            "hex": "#A12928"
        },
        {
            "id": 163,
            "name": "Carmine",
            "hex": "#B13A3A"
        },
        {
            "id": 164,
            "name": "Brick",
            "hex": "#9A534D"
        },
        {
            "id": 165,
            "name": "Coral",
            "hex": "#CC6F6F"
        },
        {
            "id": 166,
            "name": "Blush",
            "hex": "#FEA0A0"
        },
        {
            "id": 167,
            "name": "Cottoncandy",
            "hex": "#EB799A"
        },
        {
            "id": 168,
            "name": "Watermelon",
            "hex": "#DB518D"
        },
        {
            "id": 169,
            "name": "Magenta",
            "hex": "#E934AA"
        },
        {
            "id": 170,
            "name": "Fuchsia",
            "hex": "#E7008B"
        },
        {
            "id": 171,
            "name": "Raspberry",
            "hex": "#8A024A"
        },
        {
            "id": 172,
            "name": "Wine",
            "hex": "#4D0F28"
        },
        {
            "id": 173,
            "name": "Mauve",
            "hex": "#9C4975"
        },
        {
            "id": 174,
            "name": "Pink",
            "hex": "#E77FBF"
        },
        {
            "id": 175,
            "name": "Bubblegum",
            "hex": "#E5A9FF"
        },
        {
            "id": 176,
            "name": "Rose",
            "hex": "#FFD6F6"
        },
        {
            "id": 177,
            "name": "Pearl",
            "hex": "#FBEDFA"
        }
    ];


})();
