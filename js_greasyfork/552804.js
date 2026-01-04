// ==UserScript==
// @name         Richup.io Name & Flag Replacer (German Cities)
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Replaces default city/country names and flags with German city names and coats of arms on richup.io game pages.
// @author       thisisks
// @match        https://richup.io/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552804/Richupio%20Name%20%20Flag%20Replacer%20%28German%20Cities%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552804/Richupio%20Name%20%20Flag%20Replacer%20%28German%20Cities%29.meta.js
// ==/UserScript==
 
(() => {
  "use strict";
 
  const targetSelector =
    '[class*="richup-block-top"], [class*="richup-block-left"], [class*="richup-block-right"], [class*="richup-block-bottom"]';
 
  const waitForElements = () => {
    const interval = setInterval(() => {
      const target = document.querySelector(targetSelector);
      if (target) {
        clearInterval(interval);
        console.log(
          "Richup.io Replacer: Target elements found. Initializing script...",
        );
        initializeScript();
      } else {
        console.log(
          "Richup.io Replacer: Target elements not found. Waiting...",
        );
      }
    }, 500);
  };
 
  requestAnimationFrame(waitForElements);
 
  const initializeScript = () => {
    // --- Configuration: Text Replacements (Old Name -> New Name) ---
    const textReplacements = {
      // Schleswig-Holstein
      Brazil: "Schleswig-Holstein",
      Salvador: "Lübeck",
      Rio: "Kiel",
      // Brandenburg
      Israel: "Brandenburg",
      "Tel Aviv": "Frankfur‎t (Oder)",
      Haifa: "Cottbus",
      Jerusalem: "Potsdam",
      // Lower Saxony
      Italy: "Lower Saxony",
      Venice: "Oldenburg",
      Milan: "Braunschweig",
      Rome: "Hanover",
      // Baden-Württemberg
      Germany: "Baden-Württemberg",
      Frankfurt: "Karlsruhe",
      Munich: "Mannheim",
      Berlin: "Stuttgart",
      // Saxony
      China: "Saxony",
      Shenzhen: "Chemnitz",
      Beijing: "Dresden",
      Shanghai: "Leipzig",
      // Hesse
      France: "Hesse",
      Lyon: "Kassel",
      Toulouse: "Wiesbaden",
      Paris: "Frankfur‎t (Main)",
      // NRW
      "United Kingdom": "NRW",
      Liverpool: "Dortmund",
      Manchester: "Düsseldorf",
      London: "Cologne",
      // Bavaria
      USA: "Bavaria",
      "San Francisco": "Nuremberg",
      "New York": "Mun‌ich",
      // Airports
      "TLV Airport": "CBU Airport",
      "MUC Airport": "BER Airport",
      "CDG Airport": "DRS Airport",
      "JFK Airport": "MU‌C Airport",
      // Companies
      "Electric Company": "RWE",
      "Water Company": "Mainova AG",
      // Prison related phrases
      "out of prison": "out of Stadelheim Prison",
      "in prison": "in Stadelheim Prison",
      "In Prison": "In Stadelheim Prison",
      "got into prison": "got into Stadelheim Prison",
    };
 
    // Helper to normalize SVG strings for consistent matching
    const normalizeSvgString = (svgString) => {
      if (!svgString) return "";
      return svgString.replace(/>\s+</g, "><").replace(/\s\s+/g, " ").trim();
    };
 
    // --- Configuration: SVG Replacements (Normalized Original SVG HTML -> Replacement Image URL) ---
    const svgReplacements = {
      // Brazil / Schleswig-Holstein
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M0 0h512v512H0z" style="fill: rgb(109, 165, 68);"></path><path d="M256 114.527 448 256 256 397.473 64 256z" style="fill: rgb(255, 218, 68);"></path><circle cx="256" cy="256" r="80.84" style="fill: rgb(240, 240, 240);"></circle><path d="M215.579 250.948c-14.058 0-27.625 2.138-40.395 6.105.565 44.161 36.521 79.79 80.816 79.79 27.39 0 51.58-13.634 66.203-34.471-25.018-31.32-63.515-51.424-106.624-51.424zM335.343 271.488A81.137 81.137 0 0 0 336.842 256c0-44.648-36.194-80.843-80.843-80.843-33.314 0-61.913 20.156-74.29 48.935a166.852 166.852 0 0 1 33.869-3.46c46.957 0 89.433 19.517 119.765 50.856z" style="fill: rgb(0, 82, 180);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/0/02/DEU_Schleswig-Holstein_COA.svg",
      // Israel / Brandenburg
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M0 0h512v512H0z" style="fill: rgb(240, 240, 240);"></path><path d="M352 200.575h-64.001L256 145.15l-31.998 55.425H160L192.002 256 160 311.425h64.002L256 366.85l31.999-55.425H352L319.998 256 352 200.575zM295.314 256l-19.656 34.048h-39.314L216.686 256l19.657-34.048h39.314L295.314 256zM256 187.903l7.316 12.672h-14.63L256 187.903zm-58.972 34.049h14.632l-7.316 12.672-7.316-12.672zm0 68.096 7.317-12.672 7.316 12.672h-14.633zM256 324.097l-7.315-12.672h14.63L256 324.097zm58.972-34.049H300.34l7.317-12.672 7.315 12.672zm-14.632-68.096h14.632l-7.316 12.672-7.316-12.672zM0 32h512v64H0zM0 416h512v64H0z" style="fill: rgb(0, 82, 180);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/a/a2/DEU_Brandenburg_COA.svg",
      // Italy / Lower Saxony
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M341.334 0H0v512h512V0z" style="fill: rgb(240, 240, 240);"></path><path d="M0 0h170.663v512H0z" style="fill: rgb(109, 165, 68);"></path><path d="M341.337 0H512v512H341.337z" style="fill: rgb(216, 0, 39);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/0/01/Wappen_von_Niedersachsen.svg",
      // Germany / Baden-Württemberg
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M0 0h512v512H0z" style="fill: rgb(216, 0, 39);"></path><path d="M0 0h512v170.663H0z"></path><path d="M0 341.337h512V512H0z" style="fill: rgb(255, 218, 68);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/a/a5/Greater_coat_of_arms_of_Baden-W%C3%BCrttemberg.svg",
      // China / Saxony
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M0 0h512v512H0z" style="fill: rgb(216, 0, 39);"></path><path d="m167.619 167.43 19.541 60.143h63.239l-51.161 37.171 19.542 60.143-51.161-37.17-51.162 37.17 19.542-60.143-51.162-37.171h63.239zM290.787 367.465l-19.187-13.94-19.184 13.939 7.327-22.553-19.185-13.94h23.716l7.326-22.553 7.331 22.553h23.713l-19.185 13.939zM340.837 298.576h-23.714l-7.329 22.554-7.327-22.553-23.716-.001 19.187-13.94-7.329-22.552 19.187 13.937 19.185-13.938-7.329 22.553zM340.837 213.426l-19.185 13.94 7.328 22.551-19.184-13.936-19.187 13.938 7.329-22.555-19.186-13.938 23.715-.001 7.329-22.555 7.327 22.555zM290.787 144.536l-7.327 22.555 19.184 13.938-23.712.001-7.33 22.556-7.328-22.557-23.714.002 19.185-13.941-7.329-22.555 19.184 13.941z" style="fill: rgb(255, 218, 68);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/5/5f/Coat_of_arms_of_Saxony.svg",
      // France / Hesse
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M0 0h512v512H0z" style="fill: rgb(240, 240, 240);"></path><path d="M0 0h170.663v512H0z" style="fill: rgb(0, 82, 180);"></path><path d="M341.337 0H512v512H341.337z" style="fill: rgb(216, 0, 39);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/c/cd/Coat_of_arms_of_Hesse.svg",
      // United Kingdom / NRW
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M0 0h512v512H0z" style="fill: rgb(240, 240, 240);"></path><path d="M0 304h208v208h96V304h208v-96H304V0h-96v208H0z" style="fill: rgb(216, 0, 39);"></path><path d="M406.92 333.913 512 438.993v-105.08zM333.913 333.913 512 512v-50.36L384.273 333.913zM464.564 512 333.913 381.336V512z" style="fill: rgb(0, 82, 180);"></path><path d="M333.913 333.913 512 512v-50.36L384.273 333.913z" style="fill: rgb(240, 240, 240);"></path><path d="M333.913 333.913 512 512v-50.36L384.273 333.913z" style="fill: rgb(216, 0, 39);"></path><path d="M80.302 333.913 0 414.215v-80.302zM178.084 356.559v155.438H22.658z" style="fill: rgb(0, 82, 180);"></path><path d="M127.724 333.916 0 461.641V512l178.084-178.084z" style="fill: rgb(216, 0, 39);"></path><path d="M105.08 178.087 0 73.007v105.08zM178.087 178.087 0 0v50.36l127.727 127.727zM47.436 0l130.651 130.663V0z" style="fill: rgb(0, 82, 180);"></path><path d="M178.087 178.087 0 0v50.36l127.727 127.727z" style="fill: rgb(240, 240, 240);"></path><path d="M178.087 178.087 0 0v50.36l127.727 127.727z" style="fill: rgb(216, 0, 39);"></path><path d="M431.698 178.087 512 97.785v80.302zM333.916 155.441V.003h155.426z" style="fill: rgb(0, 82, 180);"></path><path d="M384.276 178.084 512 50.359V0L333.916 178.084z" style="fill: rgb(216, 0, 39);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/1/1b/Coat_of_arms_of_North_Rhine-Westphalia.svg",
      // USA / Bavaria
      [normalizeSvgString(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve"><path d="M0 0h512v512H0z" style="fill: rgb(240, 240, 240);"></path><path d="M0 64h512v64H0zM0 192h512v64H0zM0 320h512v64H0zM0 448h512v64H0z" style="fill: rgb(216, 0, 39);"></path><path d="M0 0h256v275.69H0z" style="fill: rgb(46, 82, 178);"></path><path d="m51.518 115.318-5.594 17.211H27.826l14.643 10.634-5.594 17.212 14.643-10.634 14.637 10.634-5.595-17.212 14.643-10.634H57.106zM57.106 194.645l-5.588-17.211-5.594 17.211H27.826l14.643 10.634-5.594 17.211 14.643-10.633 14.637 10.633-5.595-17.211 14.643-10.634zM51.518 53.202l-5.594 17.212H27.826l14.643 10.633-5.594 17.212 14.643-10.634 14.637 10.634-5.595-17.212 14.643-10.633H57.106zM128.003 115.318l-5.594 17.211h-18.098l14.643 10.634-5.594 17.212 14.643-10.634 14.637 10.634-5.595-17.212 14.644-10.634h-18.098zM133.591 194.645l-5.588-17.211-5.594 17.211h-18.098l14.643 10.634-5.594 17.211 14.643-10.633 14.637 10.633-5.595-17.211 14.644-10.634zM210.076 194.645l-5.587-17.211-5.595 17.211h-18.097l14.643 10.634-5.595 17.211 14.644-10.633 14.636 10.633-5.594-17.211 14.643-10.634zM204.489 115.318l-5.595 17.211h-18.097l14.643 10.634-5.595 17.212 14.644-10.634 14.636 10.634-5.594-17.212 14.643-10.634h-18.098zM128.003 53.202l-5.594 17.212h-18.098l14.643 10.633-5.594 17.212 14.643-10.634 14.637 10.634-5.595-17.212 14.644-10.633h-18.098zM204.489 53.202l-5.595 17.212h-18.097l14.643 10.633-5.595 17.212 14.644-10.634 14.636 10.634-5.594-17.212 14.643-10.633h-18.098z" style="fill: rgb(240, 240, 240);"></path></svg>',
      )]:
        "https://upload.wikimedia.org/wikipedia/commons/d/d5/Coat_of_arms_of_Bavaria.svg",
    };
 
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };
 
    const textRegexMap = Object.entries(textReplacements).map(
      ([oldName, newName]) => ({
        regex: new RegExp("\\b" + escapeRegExp(oldName) + "\\b", "gi"),
        newName: newName,
      }),
    );
 
    const processTextNode = (node) => {
      let text = node.nodeValue;
      let originalText = text;
      textRegexMap.forEach((item) => {
        text = text.replace(item.regex, item.newName);
      });
      if (text !== originalText) {
        node.nodeValue = text;
      }
    };
 
    const replaceMatchingSvg = (svgElement) => {
      if (
        !svgElement ||
        typeof svgElement.outerHTML !== "string" ||
        !svgElement.parentNode
      ) {
        return false;
      }
 
      const normalizedOuterHTML = normalizeSvgString(svgElement.outerHTML);
      const replacementUrl = svgReplacements[normalizedOuterHTML];
 
      if (replacementUrl) {
        const img = document.createElement("img");
        img.src = replacementUrl;
 
        if (svgElement.hasAttribute("class")) {
          img.setAttribute("class", svgElement.getAttribute("class"));
        }
        img.style.display =
          window.getComputedStyle(svgElement).display || "inline-block";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
 
        img.removeAttribute("width");
        img.removeAttribute("height");
 
        let title = "German COA"; // Default title
        try {
          const urlParts = replacementUrl.split("/");
          const filename = decodeURIComponent(urlParts[urlParts.length - 1])
            .replace(/\.(svg|png|jpg|jpeg|gif)$/i, "")
            .replace(/[_\-]/g, " ")
            .replace(/Coat of arms of /i, "")
            .replace(/COA/i, "")
            .trim();
          title =
            filename
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
              )
              .join(" ")
              .trim() || title;
        } catch (e) {
          console.warn(
            "Richup.io Replacer: Could not derive title from URL:",
            replacementUrl,
            e,
          );
        }
        img.setAttribute("title", title);
        img.setAttribute("alt", title);
 
        svgElement.parentNode.replaceChild(img, svgElement);
        return true;
      }
      return false;
    };
 
    const walkDOM = (node, processTextFunc, processSvgFunc) => {
      const tagName = node.tagName ? node.tagName.toUpperCase() : null;
 
      // Skip processing certain tags
      if (
        tagName === "SCRIPT" ||
        tagName === "STYLE" ||
        tagName === "TEXTAREA" ||
        tagName === "INPUT" ||
        tagName === "IMG" // Don't re-process replaced images
      ) {
        return;
      }
 
      let nodeReplaced = false;
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (tagName === "SVG") {
          nodeReplaced = processSvgFunc(node);
        }
        if (!nodeReplaced && node.childNodes) {
          // Iterate backwards for live NodeList safety
          for (let i = node.childNodes.length - 1; i >= 0; i--) {
            walkDOM(node.childNodes[i], processTextFunc, processSvgFunc);
          }
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue && node.nodeValue.trim() !== "") {
          processTextFunc(node);
        }
      }
    };
 
    const resizeImageContainers = () => {
      const targets = document.querySelectorAll(targetSelector);
      const resizeAttribute = "data-replacer-resized";
 
      targets.forEach((el) => {
        const fifthDiv = el.querySelectorAll("div")[4];
        if (fifthDiv && !fifthDiv.hasAttribute(resizeAttribute)) {
          const children = Array.from(fifthDiv.childNodes).filter(
            (node) =>
              !(
                node.nodeType === Node.TEXT_NODE &&
                node.textContent.trim() === ""
              ),
          );
 
          if (
            children.length === 1 &&
            children[0].nodeType === Node.ELEMENT_NODE &&
            children[0].tagName === "IMG"
          ) {
            fifthDiv.style.width = "2.5rem";
            fifthDiv.style.height = "2.5rem";
            fifthDiv.style.overflow = "visible";
            fifthDiv.setAttribute(resizeAttribute, "true");
          }
        }
      });
 
      console.log(
        "Richup.io Replacer: One-time resize applied to relevant containers.",
      );
    };
 
    const observerCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((addedNode) => {
            if (
              addedNode.nodeType === Node.ELEMENT_NODE ||
              addedNode.nodeType === Node.TEXT_NODE
            ) {
              // Only walk the DOM for replacements, resizing is handled separately ONCE.
              walkDOM(addedNode, processTextNode, replaceMatchingSvg);
            }
          });
        } else if (mutation.type === "characterData") {
          if (mutation.target.nodeType === Node.TEXT_NODE) {
            processTextNode(mutation.target);
          }
        }
        // No resizing logic needed in the observer anymore
      }
      // Check if any *newly added* elements need the one-time resize.
      // This covers cases where parts of the UI are added later.
      // It still respects the 'data-replacer-resized' attribute.
      requestAnimationFrame(resizeImageContainers);
    };
 
    const observer = new MutationObserver(observerCallback);
 
    const observerConfig = {
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: ["src", "class"], // Still useful to trigger checks if needed, though resizing is marker-based
      characterDataOldValue: false,
      attributesOldValue: false,
    };
 
    try {
      observer.observe(document.body, observerConfig);
    } catch (e) {
      console.error("Richup.io Replacer: Failed to start MutationObserver.", e);
    }
 
    setTimeout(() => {
      console.log(
        "Richup.io Replacer: Performing initial content scan and ONE-TIME resize...",
      );
      try {
        walkDOM(document.body, processTextNode, replaceMatchingSvg);
        resizeImageContainers(); // Apply the resize only once after the initial scan
        console.log(
          "Richup.io Replacer: Initial scan and resize complete. Observer active.",
        );
      } catch (e) {
        console.error(
          "Richup.io Replacer: Error during initial scan/resize.",
          e,
        );
      }
    }, 500);
  };
})();