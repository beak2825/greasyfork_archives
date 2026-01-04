// ==UserScript==
// @name         Generar Apodos EducaMadrid
// @namespace    EB3
// @version      2.3
// @description  Genera apodos: 3 letras primer apellido + 2 letras nombre de pila
// @author       Eduardo Barra Balao (+Perplexity)
// @license      MIT
// @match        https://aulavirtual*.educa.madrid.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=educa.madrid.org
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558618/Generar%20Apodos%20EducaMadrid.user.js
// @updateURL https://update.greasyfork.org/scripts/558618/Generar%20Apodos%20EducaMadrid.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // Genera apodo: 3 letras del primer apellido + 2 letras del nombre
  function generateNickname(fullName) {
    const parts = fullName.trim().split(/\s+/);

    if (parts.length < 2) {
      return null;
    }

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    const nickname = (
      lastName.substring(0, 3) +
      firstName.substring(0, 2)
    ).toUpperCase();

    return nickname;
  }

  console.log('📋 [EducaMadrid Apodos] Iniciando...');

  // Selector un poco más amplio para pillar enlaces de usuario de Moodle
  const nameLinks = document.querySelectorAll('a[href*="/user/"]');

  if (nameLinks.length === 0) {
    console.warn('⚠️ No se encontraron enlaces de usuario.');
    return;
  }

  console.log(`✓ Se encontraron ${nameLinks.length} enlaces de usuario\n`);

  let updatedCount = 0;
  const processedNames = new Set();

  nameLinks.forEach((link) => {
    let fullName = link.textContent.replace(/\s+/g, ' ').trim();

    // Log de depuración
    // console.log('Texto link:', fullName);

    // Saltar si vacío, ya tiene apodo entre paréntesis o ya procesado
    if (!fullName ||
        fullName.includes('(') ||
        processedNames.has(fullName)) {
      return;
    }

    const nickname = generateNickname(fullName);

    if (nickname && nickname.length === 5) {
      const newText = `${fullName} (${nickname})`;
      link.textContent = newText;
      processedNames.add(fullName);
      updatedCount++;
      console.log(`✓ ${fullName} → ${nickname}`);
    }
  });

  console.log(`\n✅ Completado: ${updatedCount} apodos generados`);
  console.log(`📝 Fórmula: [3 letras primer apellido] + [2 letras nombre de pila]`);

})();
