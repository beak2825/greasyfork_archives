// ==UserScript==
// @name         Encyclofus fix
// @version      1.6
// @description  Fix missing mobile icon.
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @match        https://souchy.github.io/encyclofus/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/553891/Encyclofus%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/553891/Encyclofus%20fix.meta.js
// ==/UserScript==

// Inject missing stylesheet
const faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css';
document.head.appendChild(faLink);

let last_spell = null;
let visited = new Set();

function doChange(node) {
    let parent = node.closest('spell-new,.spellDescription');
    // console.log('CHANGE DETECTED', {parent: parent, title: parent?.querySelector('.spell_name,h6')?.innerText?.trim(), outerHTML: node.outerHTML});

    let container = node.closest('div');
    // if (container) console.log([...container.querySelectorAll('.spell_level_button')].map(x => x.innerText.trim()));

    let last_button = container ? [...container.querySelectorAll('.spell_level_button')].pop() : null;
    if (!last_button) return;

    // Ignore manual clicks on same page by checking the first spell title.
    // There can be multiple spells on a page so we keep a set and reset on 'page' change.
    // since the SPA page reuses old nodes we need to compare unique keys such as the spellDescription#id.

    let main_spell = document.querySelector('.spell_name')?.textContent; // note: id doesnt work.
    let spell_id = node.closest('.spellDescription')?.id;                // Id of this container.
    if (!main_spell || !spell_id) return;


    let changed = last_spell !== main_spell;
    // console.log({last_spell, main_spell, changed, spell_id})
    // console.log(document.querySelector('spell-new').outerHTML)

    if (changed) {
      // Page change, reset tracking to allow autocliking the last one for each id again.
      // console.log('===================== RESET =====================')
      last_spell = main_spell;
      visited.clear();
    }

    if (visited.has(spell_id)) return;
    visited.add(spell_id);

    if (!last_button.classList.contains('grade_selected')) {
      last_button.click();
      // console.log('CLICKED', last_button)
    }
}

// Detect spell button changes and press the last one if it isnt selected.
const observer = new MutationObserver(mutations =>
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains('spell_level_button') &&
          node.classList.contains('grade_selected')
        ) {
        // BUG: The button change happens before the spell name is updated!
        // We need to wait 2 frames min or the main_spell name will be outdated and reflect the previous spell.
        // If we have an outaded main_spell, manual clicks will trigger a reset.

        // setTimeout(() => doChange(node), 100);
        requestAnimationFrame(() => requestAnimationFrame(() => doChange(node)));
      }
    });
  })
);

observer.observe(document.body, { childList: true, subtree: true });
