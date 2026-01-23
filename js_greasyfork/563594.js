// ==UserScript==
// @name         Ethereal Echoes - Fixed Car Names
// @namespace    etheralechoes.torn.racing
// @version      1.0.3
// @description  Sets car names back to the old car names
// @author       Ech0_2G [3275431]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/imarket.php*
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563594/Ethereal%20Echoes%20-%20Fixed%20Car%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/563594/Ethereal%20Echoes%20-%20Fixed%20Car%20Names.meta.js
// ==/UserScript==

const cars = {
  "Alpha Milano 156": "Alfa Romeo 156",
  "Bavaria M5": "BMW M5",
  "Bavaria X5": "BMW X5",
  "Bavaria Z8": "BMW Z8",
  "Bedford Nova": "Vauxhall Astra GSI",
  "Bedford Racer": "Vauxhall Corsa",
  "Chevalier CVR": "Chevrolet Cavalier",
  "Chevalier CZ06": "Chevrolet Corvette Z06",
  "Coche Basurero": "Seat Leon Cupra",
  "Colina Tanprice": "Sierra Cosworth",
  "Cosmos EX": "Lotus Exige",
  "Dart Rampager": "Dodge Charger",
  "Echo Quadrato": "Audi TT Quattro",
  "Echo R8": "Audi R8",
  "Echo S3": "Audi S3",
  "Echo S4": "Audi S4",
  "Edomondo ACD": "Honda Accord",
  "Edomondo IR": "Honda Integra R",
  "Edomondo Localé": "Honda Civic",
  "Edomondo NSX": "Honda NSX",
  "Edomondo S2": "Honda s2",
  "Invader H3": "Hummer H3",
  "Knight Firebrand": "Pontiac Firebird",
  "Lambrini Torobravo": "Lamborghini Gallardo",
  "Limoen Saxon": "Citroen Saxo",
  "Lolo 458": "Ferrari 458",
  "Mercia SLR": "Mercedes SLR",
  "Nano Cavalier": "Mini Cooper S",
  "Nano Pioneer": "Classic Mini",
  "Oceania SS": "Holden SS",
  "Papani Colé": "Renault Clio",
  "Stormatti Casteon": "Bugatti Veyron",
  "Sturmfahrt 111": "Porsche 911 GT3",
  "Stålhög 860": "Volvo 850",
  "Tabata RM2": "Toyota MR2",
  "Trident": "Reliant Robin",
  "Tsubasa Impressor": "Subaru Impreza STI",
  "Veloria LFA": "Lexus LFA",
  "Verpestung Insecta": "Volkswagen Beetle",
  "Verpestung Sport": "Volkswagen Golf GTI",
  "Vita Bravo": "Fiat Punto",
  "Volt GT": "Ford GT",
  "Volt MNG": "Ford Mustang",
  "Volt RS": "Ford Focus RS",
  "Weston Marlin 177": "Aston Martin One-77",
  "Wington GGU ": "TVR Sagaris",
  "Yotsuhada EVX": "Mitsubishi Evo X",
  "Zaibatsu GT-R": "Nissan GT-R",
  "Zaibatsu Macro": "Nissan Micra",
  "Çagoutte 10-6": "Peugeot 106",
};

// Pre-compile regex patterns for better performance
const carNameRegex = new RegExp(Object.keys(cars).map(name =>
  name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
).join('|'), 'g');

// Debounce function to limit how often updateNames runs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// More efficient element processing using native DOM methods
function processElement(element) {
  // Handle images with title attributes
  if (element.tagName === 'IMG' || element.tagName === 'SPAN') {
    const title = element.title || element.getAttribute('title');
    if (title && cars[title] && !element.classList.contains('replaced')) {
      element.title = cars[title];
      element.setAttribute('title', cars[title]);
      element.classList.add('replaced');
      return true;
    }
  }

  // Handle text content - only process text nodes to preserve HTML
  if (element.childNodes && element.childNodes.length > 0 && !element.classList.contains('replaced')) {
    let hasChanges = false;

    // Process only direct text nodes to preserve HTML structure
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];

      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const originalText = node.textContent;
        const newText = originalText.replace(carNameRegex, match => cars[match] || match);

        if (newText !== originalText) {
          node.textContent = newText;
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      element.classList.add('replaced');
      return true;
    }
  }

  return false;
}

// More efficient tree walking that preserves HTML structure
function processNode(node) {
  if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('replaced')) {
    // First try to process this element
    processElement(node);

    // Then recursively process children, but only if they haven't been processed
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (!child.classList.contains('replaced')) {
        processNode(child);
      }
    }
  }
}

// Optimized update function
function updateNames(targetNode = document) {
  // Use more specific selectors to reduce the search space
  const selectors = [
    'span.img[title]:not(.replaced)',
    'img[title]:not(.replaced)',
    'span.model > p:not(.replaced)',
    'span.model > span.bold:not(.replaced)',
    '.msg:not(.replaced)',
    '.m-items-list .searchname:not(.replaced)',
    '.items .item-t:not(.replaced)',
    '.editor-content p[class^="name"]:not(.replaced)',
    '.cars-item span[class^="name"]:not(.replaced)',
    '.cars-item div[class^="description_"]:not(.replaced)',
    'div[class*="name___"]:not(.replaced)' // Added for Item Market
  ];

  // Process each selector type efficiently
  selectors.forEach(selector => {
    const elements = targetNode.querySelectorAll ?
      targetNode.querySelectorAll(selector) :
      document.querySelectorAll(selector);

    elements.forEach(element => {
      processElement(element);
    });
  });
}

// Optimized mutation observer callback
const debouncedUpdate = debounce(updateNames, 100); // Only run every 100ms max

function createOptimizedObserver(targetElement) {
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;

    // Check if any mutations actually added relevant content
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Only update if new nodes were added
        if (mutation.addedNodes.length > 0) {
          // Check if any added nodes contain car-related content
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if this node or its children contain car names
              const hasCarContent =
                (node.title && cars[node.title]) ||
                (node.querySelector && (
                  node.querySelector('img[title], span[title]') ||
                  node.querySelector('.msg, .searchname, .item-t, span.model') ||
                  node.querySelector('div[class*="name___"]') // Added for Item Market
                )) ||
                // Check text content without breaking HTML
                (node.textContent && carNameRegex.test(node.textContent));

              if (hasCarContent) {
                shouldUpdate = true;
                // Process just this new node instead of the entire page
                processNode(node);
              }
            }
          }
        }
      }
    }

    // Only run full update if we detected relevant changes
    if (shouldUpdate) {
      debouncedUpdate();
    }
  });

  // Use more restrictive observer options
  observer.observe(targetElement, {
    subtree: true,
    childList: true,
    // Don't observe attributes or character data changes
    attributes: false,
    characterData: false
  });

  return observer;
}

// Initialize observers more efficiently
function initializeObservers() {
  // Initial update
  updateNames();

  // Set up observers for dynamic content
  const containers = [
    { selector: '#racingMainContainer', name: 'racing' },
    { selector: '#item-market-main-wrap', name: 'market' },
    { selector: '#bazaarRoot', name: 'bazaar' },
    { selector: '#mainContainer', name: 'main' } // Added for Item Market and other pages
  ];

  containers.forEach(({ selector, name }) => {
    const container = document.querySelector(selector);
    if (container) {
      console.log(`Car names script: Initialized ${name} observer`);
      createOptimizedObserver(container);
    }
  });

  // If no specific containers found, observe the body for Item Market hash routing
  if (!document.querySelector('#racingMainContainer') &&
      !document.querySelector('#item-market-main-wrap') &&
      !document.querySelector('#bazaarRoot') &&
      !document.querySelector('#mainContainer')) {
    console.log('Car names script: Initialized fallback body observer');
    createOptimizedObserver(document.body);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeObservers);
} else {
  initializeObservers();
}

// Additional initialization for hash-based navigation (Item Market)
// Run updates when hash changes (for single-page app navigation)
window.addEventListener('hashchange', () => {
  console.log('Car names script: Hash changed, updating names');
  setTimeout(() => updateNames(), 500);
  setTimeout(() => updateNames(), 1000);
  setTimeout(() => updateNames(), 2000);
});

// Also run delayed updates on initial load for Item Market
setTimeout(() => updateNames(), 1000);
setTimeout(() => updateNames(), 2000);
setTimeout(() => updateNames(), 3000);