// ==UserScript==
// @name         CCO Pattern Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.91
// @description  Pattern Icons
// @author       2klex
// @match        *://case-clicker.com/*
// @match        *://*.case-clicker.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554995/CCO%20Pattern%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/554995/CCO%20Pattern%20Highlighter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ICONS = {
    "doppler": {
        "sapphire": { "url": "https://i.imgur.com/by6BOg9.png", "glow": "0 0 12px rgba(0,153,255,0.8)" },
        "ruby":     { "url": "https://i.imgur.com/BbUJ9hD.png", "glow": "0 0 12px rgba(255,0,64,0.8)" },
        "emerald":  { "url": "https://i.imgur.com/qBsxDft.png", "glow": "0 0 12px rgba(0,255,153,0.8)" },
        "blackpearl":{ "url": "https://i.imgur.com/atZUPhw.png", "glow": "0 0 12px rgba(102,0,204,0.8)" }
    },
    "fade": {
        "80":  { "url": "https://i.imgur.com/ZxY4lMl.png", "glow": "0 0 12px rgba(255,102,204,0.8)" },
        "100": { "url": "https://i.imgur.com/SwqnfNP.png", "glow": "0 0 12px rgba(255,255,102,0.8)" }
    },
    "fireice": {
        "max": { "url": "https://i.imgur.com/VkKwObR.png", "glow": "0 0 12px rgba(255,85,0,0.8), 0 0 12px rgba(0,128,255,0.8)" }
    },
    "casehardened": {
        "bg":    { "url": "https://i.imgur.com/6pDs0BO.png", "glow": "0 0 12px rgba(102,178,255,0.8)" },
        "gg":    { "url": "https://i.imgur.com/9U0L9ka.png", "glow": "0 0 12px rgba(255,204,0,0.8)" },
        "tier2": { "url": "https://i.imgur.com/wufyb2f.png", "glow": "0 0 12px rgba(255,102,204,0.8)" },
        "tier3": { "url": "https://i.imgur.com/gP7aiE2.png", "glow": "0 0 12px rgba(255,140,0,0.8)" },
        "tier4": { "url": "https://i.imgur.com/2WXhwNe.png", "glow": "0 0 12px rgba(192,192,192,0.8)" }
    },
    "gammadoppler": {
        "t1_diamond": { "url": "https://i.imgur.com/Yu0lI1H.png", "glow": "0 0 12px rgba(0,225,255,0.8)" },
        "t2_diamond": { "url": "https://i.imgur.com/Uq0nBTm.png", "glow": "0 0 12px rgba(0,200,255,0.8)" },
        "t3_diamond": { "url": "https://i.imgur.com/tRoELM3.png", "glow": "0 0 12px rgba(0,157,255,0.8)" }
    },
    "slaughter": {
        "diamond_and_heart": { "url": "https://i.imgur.com/AvhbFou.png", "glow": "0 0 12px rgba(253,93,93,0.8)" },
        "diamond":           { "url": "https://i.imgur.com/xDi4Xqp.png", "glow": "0 0 12px rgba(254,57,57,0.8)" }
    },
    "slaugther": {
        "heart":     { "url": "https://i.imgur.com/uWLnSkS.png", "glow": "0 0 12px rgba(255,0,0,0.8)" },
        "angel":     { "url": "https://i.imgur.com/dDZg7Zi.png", "glow": "0 0 12px rgba(251,55,55,0.8)" },
        "phoenix":   { "url": "https://i.imgur.com/S9tXZKe.png", "glow": "0 0 12px rgba(255,71,71,0.8)" },
        "kitty":     { "url": "https://i.imgur.com/G0SMbFY.png", "glow": "0 0 12px rgba(254,67,67,0.8)" },
        "zebra":     { "url": "https://i.imgur.com/sE4tsXM.png", "glow": "0 0 12px rgba(255,82,82,0.8)" },
        "clean_red": { "url": "https://i.imgur.com/QsAdVbt.png", "glow": "0 0 12px rgba(254,67,67,0.8)" }
    },

    /** PAW ICONS */
    "PAW": {
        "golden_cat": {
            "url": "https://i.imgur.com/sDiOo4c.png",
            "glow": "0 0 12px rgba(254,184,32,0.8)"
        },
        "stoner_cat": {
            "url": "https://i.imgur.com/zrkBaON.png",
            "glow": "0 0 12px rgba(255,199,153,0.8)"
        }
    },

    /** NEW ELECTRIC HIVE PATTERNS */
    "electric_hive": {
        "max_orange": {
            "url": "https://i.imgur.com/9M0JAx6.png",
            "glow": "0 0 12px rgba(255,102,0,0.8)"
        },
        "max_blue": {
            "url": "https://i.imgur.com/IYwI8W3.png",
            "glow": "0 0 12px rgba(0,102,255,0.8)"
        }
    }
  };


  function getVariantFromFilename(src) {
    const lowered = src.toLowerCase();
    const baseName = lowered.split('/').pop();

    // doppler
    if (lowered.includes('doppler')) {
      if (lowered.includes('sapphire')) return { type:'doppler', key:'sapphire' };
      if (lowered.includes('ruby'))     return { type:'doppler', key:'ruby' };
      if (lowered.includes('emerald'))  return { type:'doppler', key:'emerald' };
      if (lowered.includes('blackpearl') || lowered.includes('black_pearl'))
          return { type:'doppler', key:'blackpearl' };
    }

    // doppler knives
    const dopplerKnives = ['survival','paracord','nomad','skeleton'];
    if (dopplerKnives.some(k => baseName.startsWith(k+"_"))) {
      if (baseName.includes('_bp'))       return { type:'doppler', key:'blackpearl' };
      if (baseName.includes('_ruby'))     return { type:'doppler', key:'ruby' };
      if (baseName.includes('_sapphire')) return { type:'doppler', key:'sapphire' };
    }

    // fade
    if (baseName.includes('_100.png')) return { type:'fade', key:'100' };
    if (baseName.includes('_80.png'))  return { type:'fade', key:'80' };

    // fi_max
    if (baseName.includes('_fi_max')) return { type:'fireice', key:'max' };

    // case hardened
    if (baseName.includes('_ch_bg'))    return { type:'casehardened', key:'bg' };
    if (baseName.includes('_ch_gg'))    return { type:'casehardened', key:'gg' };
    if (baseName.includes('_ch_tier2')) return { type:'casehardened', key:'tier2' };
    if (baseName.includes('_ch_tier3')) return { type:'casehardened', key:'tier3' };
    if (baseName.includes('_ch_tier4')) return { type:'casehardened', key:'tier4' };

    // gamma doppler
    if (baseName.includes('t1_diamond')) return { type:'gammadoppler', key:'t1_diamond' };
    if (baseName.includes('t2_diamond')) return { type:'gammadoppler', key:'t2_diamond' };
    if (baseName.includes('t3_diamond')) return { type:'gammadoppler', key:'t3_diamond' };

    // slaughter
    if (lowered.includes('slaughter') || lowered.includes('slaugther')) {
      if (lowered.includes('diamond_and_heart')) return { type:'slaughter', key:'diamond_and_heart' };
      if (lowered.includes('diamond') && !lowered.includes('and'))
          return { type:'slaughter', key:'diamond' };
    }

    // slaugther
    if (lowered.includes('slaugther')) {
      if (lowered.includes('clean_red')) return { type:'slaugther', key:'clean_red' };
      if (lowered.includes('phoenix'))   return { type:'slaugther', key:'phoenix' };
      if (lowered.includes('heart'))     return { type:'slaugther', key:'heart' };
      if (lowered.includes('angel'))     return { type:'slaugther', key:'angel' };
      if (lowered.includes('kitty'))     return { type:'slaugther', key:'kitty' };
      if (lowered.includes('zebra'))     return { type:'slaugther', key:'zebra' };
    }

    /** PAW */
    if (lowered.includes('golden_cat'))
        return { type:'PAW', key:'golden_cat' };

    if (lowered.includes('stoner_cat'))
        return { type:'PAW', key:'stoner_cat' };

    /** NEW ELECTRIC HIVE */
    if (lowered.includes('awp_max_orange'))
        return { type:'electric_hive', key:'max_orange' };

    if (lowered.includes('awp_max_blue'))
        return { type:'electric_hive', key:'max_blue' };

    return null;
  }


  function flagSkinImage(img) {
    if (img.dataset.dopplerFlagged) return;
    if (img.closest('.mantine-Modal-root')) return;

    const src = img.src || img.dataset.src || '';
    const variant = getVariantFromFilename(src);
    if (!variant) return;

    const wrapper = img.closest('.mantine-Card-root') || img.parentElement;
    if (!wrapper) return;

    const iconData = ICONS[variant.type][variant.key];
    if (!iconData) return;

    const icon = document.createElement('img');
    icon.src = iconData.url;
    icon.alt = variant.key;
    icon.dataset.highlighterIcon = 'true';
    icon.style.position = 'absolute';
    icon.style.top = '8px';
    icon.style.right = '8px';
    icon.style.width = '32px';
    icon.style.height = '32px';
    icon.style.zIndex = '10';
    icon.style.pointerEvents = 'none';
    icon.style.filter = `drop-shadow(${iconData.glow})`;

    wrapper.style.position = 'relative';
    wrapper.appendChild(icon);
    adjustIconPositionForCard(wrapper);

    img.dataset.dopplerFlagged = 'true';
  }


  function findStickerImagesInCard(wrapper) {
    const stacks = wrapper.querySelectorAll('.mantine-Stack-root');
    for (const stack of stacks) {
      const imgs = stack.querySelectorAll('img[alt^="Sticker"]');
      if (imgs.length > 0) return [...imgs];
    }
    return [];
  }


  function adjustIconPositionForCard(wrapper) {
    const icon = wrapper.querySelector('img[data-highlighter-icon="true"]');
    if (!icon) return;

    const stickers = findStickerImagesInCard(wrapper);
    let offset = 8;

    if (stickers.length > 0) {
      const rect = stickers[0].getBoundingClientRect();
      const width = rect?.width || 40;
      offset += Math.ceil(width) + 8;
    }

    icon.style.right = offset + 'px';
  }


  function adjustAllIconPositions() {
    document.querySelectorAll('.mantine-Card-root')
      .forEach(adjustIconPositionForCard);
  }


  function scanAllImages() {
    document.querySelectorAll('img:not([data-dopplerFlagged])')
      .forEach(flagSkinImage);

    adjustAllIconPositions();
  }


  scanAllImages();

  new MutationObserver(() => {
    scanAllImages();
    adjustAllIconPositions();
  }).observe(document.body, { childList:true, subtree:true });


  window.addEventListener('load', () => {
    setTimeout(() => {
      scanAllImages();
      adjustAllIconPositions();
    }, 1000);
  });

})();