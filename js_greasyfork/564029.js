// ==UserScript==
// @name        weblab improvements tudelft.nl
// @namespace   Violentmonkey Scripts
// @include     https://weblab.tudelft.nl/*
// @version     1.1
// @author      KraXen72
// @description make all monaco editor instances use the vs-dark theme
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/564029/weblab%20improvements%20tudelftnl.user.js
// @updateURL https://update.greasyfork.org/scripts/564029/weblab%20improvements%20tudelftnl.meta.js
// ==/UserScript==

// editorInfo_5238b0720c406f556b6a13c397f58715.editor._themeService.setTheme('vs-dark')
console.log("weblab improvements init")
let isObserving = false;
let timeout = null;

let editorInstances = []
// Function to re-check editor instances
function recheckEditorInstances() {
  console.log('Rechecking editor instances...');

  const matchingKeys = Object.keys(unsafeWindow).filter(key => key.startsWith('editorInfo'));
  const inst2 = []
  console.log("found matching keys:", matchingKeys)

  for (const key of matchingKeys) {
    inst2.push(unsafeWindow[key]);
    unsafeWindow[key].editor._themeService.setTheme('vs-dark')
  }
  editorInstances = inst2
  console.log("found editor instances:", editorInstances);
}

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && (node.classList.contains('monaco-editor') || node.id.startsWith("monacoEditor_"))) {
          // console.log('.monaco-editor added:', node);
          recheckEditorInstances();
        }
      });
    }
  }
});

function obs() {
  if (isObserving) {
    clearTimeout(timeout);
  } else {
    console.log("weblab improvements: started observing")
    observer.observe(document.body, {
      childList: true,  // Watch for added/removed child elements
      subtree: true     // Also watch for changes in descendants
    });
  }
  isObserving = true;

  timeout = setTimeout(() => {
    observer.disconnect();
    isObserving = false;
  }, 5000);
}


window.addEventListener('popstate', function(event) {
  clearTimeout(timeout);
  obs();
  recheckEditorInstances();
});

// Listen for hash changes in the URL
window.addEventListener('hashchange', function() {
  clearTimeout(timeout);
  obs();
  recheckEditorInstances();
});

obs();