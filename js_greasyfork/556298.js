// ==UserScript==
// @name        SpoolanDB: Filament Unger
// @namespace   owenvoke
// @match       https://filament-unger.de/pages/farbtabelle
// @match       https://filament-unger.de/en/pages/farbtabelle
// @grant       none
// @version     1.0.2
// @author      Owen Voke (@owenvoke)
// @description Generate a SpoolmanDB filaments entry for Filament Unger.
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/556298/SpoolanDB%3A%20Filament%20Unger.user.js
// @updateURL https://update.greasyfork.org/scripts/556298/SpoolanDB%3A%20Filament%20Unger.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const materials = {
    PLA_Plus: 'PLA+', PETG: 'PETG', ABS_Plus: 'ABS+',
  }

  let map = {
    manufacturer: 'Filament Unger', filaments: [
      {
        name: '{color_name}', material: materials.PLA_Plus, density: 1.28, weights: [
          {
            weight: 1000.0,
          }], diameters: [
          1.75], extruder_temp: 220, bed_temp: 60, colors: [],
      }, {
        name: '{color_name}', material: materials.PETG, density: 1.29, weights: [
          {
            weight: 1000.0,
          }], diameters: [
          1.75], extruder_temp: 230, bed_temp: 80, colors: [],
      }, {
        name: '{color_name}', material: materials.ABS_Plus, density: 1.02, weights: [
          {
            weight: 800.0,
          }], diameters: [
          1.75], extruder_temp: 260, bed_temp: 100, colors: [],
      }],
  }

  const elements = document.querySelectorAll(
    '.shopify-section > section > gp-row > div > gp-row')

  if (!elements) {
    return
  }

  elements.forEach((element) => {
    let name = element.childNodes[2]?.innerText
    let color = element.childNodes[4]?.innerText

    if (name === undefined || color === undefined) {
      return
    }

    const nameMatches = (new RegExp(/^(PLA\+|PETG|ABS\+) (.*?)$/i)).exec(name)
    const colorMatches = (new RegExp(/#([a-f0-9]{6})$/i)).exec(color)

    if (nameMatches === null || colorMatches === null) {
      return
    }

    let type = nameMatches[1]
    name = nameMatches[2]
    color = colorMatches[1]

    let filament = {
      name, hex: color.toUpperCase(),
    }

    if (type === materials.PLA_Plus) {
      map.filaments[0].colors.push(filament)
    }
    else if (type === materials.PETG) {
      map.filaments[1].colors.push(filament)
    }
    else if (type === materials.ABS_Plus) {
      map.filaments[2].colors.push(filament)
    }
  })

  console.debug(JSON.stringify(map, null, 2))
})()