// ==UserScript==
// @name         Google interface cleanup fixed
// @namespace    mwsmws22
// @version      1.0.1
// @author       mwsmws22
// @license      MIT
// @description  Remove junk from Google search results like "People also ask", etc.
// @match        https://*.google.com/search*
// @match        https://*.google.ca/search*
// @match        https://*.google.fr/search*
// @match        https://*.google.co.uk/search*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550855/Google%20interface%20cleanup%20fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/550855/Google%20interface%20cleanup%20fixed.meta.js
// ==/UserScript==

const annoyances = [
  "People also ask",
  "People also search for",
  "People also search",
  "Videos",
  "Short videos",
  "Refine this search",
  "Search a song",
  "Related searches",
  "Hum to search",
  "Trending videos",
  "Related videos",
  "For context",
  "Also searched for",
  "Often searched together",
  "Others searched",
  "Local news",
  "Popular on X",
  "People also watch",
  "Events",
  "Profiles",
  "Perspectives",
  "What to watch",
  "Posts on X",
  "Nearby stores",
  "People also buy from",
  "Trending movies",
  "Ticket prices",
  "Mentioned in the news",
  "Visual stories",
  "Latest posts from",
  "Twitter Results",
  "Images",
  "Related topics",
  "Context",
  "For reference",
  "Helpful context",
  "Recipes",
  "Things to know",
];

function waitForKeyElements(
  selectorOrFunction,
  callback,
  waitOnce = true,
  interval = 300,
  maxIntervals = -1
) {
  let targetNodes;
  try {
    targetNodes =
      typeof selectorOrFunction === "function"
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);
  } catch (error) {
    console.error(`Error querying selector: ${selectorOrFunction}`, error);
    return;
  }

  let targetsFound = targetNodes && targetNodes.length > 0;

  if (targetsFound) {
    targetNodes.forEach((targetNode) => {
      const attrAlreadyFound = "data-userscript-alreadyFound";
      const alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
      if (!alreadyFound) {
        const cancelFound = callback(targetNode);
        if (cancelFound) {
          targetsFound = false;
        } else {
          targetNode.setAttribute(attrAlreadyFound, true);
        }
      }
    });
  }

  if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
    maxIntervals -= 1;
    setTimeout(() => {
      waitForKeyElements(
        selectorOrFunction,
        callback,
        waitOnce,
        interval,
        maxIntervals
      );
    }, interval);
  }
}

function isHidden(el) {
  return el === null || el.offsetParent === null;
}

function getbyXpath(xpath, contextNode) {
  const results = [];
  const query = document.evaluate(
    xpath,
    contextNode || document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}

function removeJunk(jNode) {
  const div = jNode;
  const matchingAnnoyances = annoyances
    .filter((a) => div.innerHTML.includes(a))
    .flatMap((a) =>
      getbyXpath(
        `.//div[starts-with(text(), '${a}')]|//span[starts-with(text(), '${a}')]|//h2[starts-with(text(), '${a}')]`,
        div
      )
    )
    .filter((node) => !isHidden(node));

  matchingAnnoyances.forEach((matchingAnnoyance) => {
    if (matchingAnnoyance && !isHidden(matchingAnnoyance)) {
      traverseAncestors(matchingAnnoyance);
    }
  });
}

function undesiredElement(jNode) {
  jNode.style.display = "none";
}

function destroyElement(jNode) {
  jNode.remove();
}

function undesiredElementParent(jNode) {
  const parent = jNode.parentElement;
  if (parent !== null) {
    parent.style.display = "none";
  }
}

function traverseAncestors(node) {
  if (node) {
    if (node.tagName === "DIV") {
      const parentElement = node.parentElement;
      const childDivs = [...parentElement.children].filter(
        (c) => c.tagName === "DIV"
      );
      const hasInfoSection = node.querySelector(".kp-wholepage");

      if (
        node.hasAttribute("jsdata") ||
        node.hasAttribute("jsname") ||
        node.className === "MjjYud" ||
        (childDivs.length === 1 && parentElement.id === "bres")
      ) {
        if (hasInfoSection === null) {
          node.style.display = "none";
        }
      } else {
        traverseAncestors(node.parentNode);
      }
    } else {
      traverseAncestors(node.parentNode);
    }
  }
}

function removeSearchSuggestions(jNode) {
  jNode.removeAttribute("jscontroller");
}

function visualDigest(jNode) {
  jNode.closest("div.ycw3p").style.display = "none";
}

function appendAsTopChild(targetNode) {
  const predefinedDiv = document.querySelector("#center_col");
  if (predefinedDiv) {
    predefinedDiv.insertBefore(targetNode, predefinedDiv.firstChild);
  } else {
    console.error("#center_col element not found");
  }
}

waitForKeyElements("#rso div.MjjYud", removeJunk);
waitForKeyElements("#botstuff div.MjjYud", removeJunk, false);
waitForKeyElements("#botstuff #bres div[id*=dub_]", undesiredElement);
waitForKeyElements('g-card:has(> div[class="mnr-c"])', undesiredElement, false);
waitForKeyElements(
  'div[data-attrid="VisualDigestFullBleedVideoResult"]',
  undesiredElement
);
waitForKeyElements("inline-video", undesiredElement);
waitForKeyElements("product-viewer-group", undesiredElement, false);
waitForKeyElements("block-component", undesiredElement, false);
waitForKeyElements(
  'form[action="/search"] > div > div[jscontroller]',
  removeSearchSuggestions
);
waitForKeyElements(
  'div[data-attrid="VisualDigestNewsArticleResult"]',
  visualDigest
);
waitForKeyElements(
  'div[data-attrid="VisualDigestSocialMediaResult"]',
  visualDigest
);
waitForKeyElements('div[data-attrid="VisualDigestWebResult"]', visualDigest);
waitForKeyElements(() => {
  const elements = getbyXpath(
    `//*[starts-with(text(), 'uBlacklist has blocked')]`
  );
  // Multiple banners can be present, but we only want the one under the id="appbar" div
  const targetElement = elements.find((el) => el.closest("#appbar"));
  return targetElement ? [targetElement.closest("#appbar")] : null;
}, appendAsTopChild);
