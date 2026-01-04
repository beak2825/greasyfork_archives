// ==UserScript==
// @name         Mob → Crouton Exporter
// @namespace    https://sndwxh.co/
// @version      1.3
// @description  Export recipes from mob.co.uk into Crouton's .crumb format
// @author       sndwxh
// @match        https://www.mob.co.uk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553709/Mob%20%E2%86%92%20Crouton%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/553709/Mob%20%E2%86%92%20Crouton%20Exporter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const main = async () => {
    // Extract recipe from JSON-LD structured data
    const recipes = [
      ...document.querySelectorAll(`script[type="application/ld+json"]`),
    ]
      .map((e) => JSON.parse(e.innerText))
      .map((s) => {
        if ("@type" in s) return s;
        if ("@graph" in s) return s["@graph"];
      })
      .flat()
      .filter((s) => s["@type"] == "Recipe");

    if (recipes.length === 0) {
      alert("No recipes found on this page!");
      return;
    }

    const recipe = recipes[0]; // Take the first recipe

    // Extract ingredient amounts from DOM
    const ingredientElements = [
      ...document.querySelectorAll("div.Ingredients__ingredient > div"),
    ];

    // Extract ingredient section headers from DOM
    const sectionHeaders = [
      ...document.querySelectorAll("div.pt-4.text-base.capitalize"),
    ].map((el) => el.textContent.trim());

    // Extract nutritional information
    const nutritionalInfo = extractNutritionalInfo();

    // Convert to Crouton format
    const croutonRecipe = await convertToCrouton(
      recipe,
      ingredientElements,
      sectionHeaders,
      nutritionalInfo,
    );

    // Download as .crumb file
    const filename = `${sanitizeFilename(recipe.name)}.crumb`;
    const blob = new Blob([JSON.stringify(croutonRecipe, null, 2)], {
      type: "application/json",
    });
    download(filename, blob);
  };

  // Convert mob.co.uk recipe to Crouton format
  async function convertToCrouton(
    recipe,
    ingredientElements,
    sectionHeaders,
    nutritionalInfo,
  ) {
    const {
      name,
      recipeIngredient,
      recipeInstructions,
      recipeYield,
      prepTime,
      cookTime,
      totalTime,
      image,
    } = recipe;

    // Process ingredients with sections
    const ingredients = [];
    let orderCounter = 0;

    // Build a map of section positions by examining the DOM
    const sectionPositions = getSectionPositions(sectionHeaders);

    let currentSectionIndex = 0;
    for (let i = 0; i < (recipeIngredient || []).length; i++) {
      // Check if we need to insert a section header before this ingredient
      if (
        currentSectionIndex < sectionPositions.length &&
        i === sectionPositions[currentSectionIndex].ingredientIndex
      ) {
        ingredients.push({
          quantity: {
            quantityType: "SECTION",
          },
          ingredient: {
            name: sectionPositions[currentSectionIndex].title,
            uuid: generateUUID(),
          },
          order: orderCounter++,
          uuid: generateUUID(),
        });
        currentSectionIndex++;
      }

      // Add the ingredient
      const ingredient = recipeIngredient[i];
      const amount = ingredientElements[i]?.firstChild?.textContent || "";
      const parsed = parseIngredient(amount, ingredient);

      ingredients.push({
        quantity: {
          quantityType: parsed.quantityType,
          ...(parsed.amount !== null && { amount: parsed.amount }),
        },
        ingredient: {
          name: parsed.ingredientName,
          uuid: generateUUID(),
        },
        order: orderCounter++,
        uuid: generateUUID(),
      });
    }

    // Process steps
    const steps = (recipeInstructions || []).map((step, index) => ({
      step: step.text || step,
      order: index,
      uuid: generateUUID(),
      isSection: false,
    }));

    // Calculate durations
    const prepMinutes = parseIsoDuration(prepTime);
    const cookMinutes = parseIsoDuration(cookTime);
    const totalMinutes = parseIsoDuration(totalTime);

    // Process servings
    const serves =
      typeof recipeYield === "number"
        ? recipeYield
        : parseInt(recipeYield) || 4;

    // Fetch and encode recipe images
    const images = [];

    if (image) {
      const imageUrl = Array.isArray(image) ? image[0] : image;
      try {
        const base64Image = await fetchImageAsBase64(imageUrl);
        images.push(base64Image);
      } catch (e) {
        console.warn("Could not fetch recipe image:", e);
      }
    }

    // Fetch and encode favicon for sourceImage
    let sourceImage = "";
    try {
      const faviconUrl = getFaviconUrl();
      sourceImage = await fetchImageAsBase64(faviconUrl);
    } catch (e) {
      console.warn("Could not fetch favicon:", e);
    }

    return {
      name: name || "Untitled Recipe",
      uuid: generateUUID(),
      serves: serves,
      duration: prepMinutes || 0,
      cookingDuration: cookMinutes || 0,
      webLink: window.location.href,
      senderName: "",
      sourceName: "mob.co.uk",
      ingredients: ingredients,
      steps: steps,
      notes: recipe.description || "",
      neutritionalInfo: nutritionalInfo || "",
      folderIDs: [],
      images: images,
      sourceImage: sourceImage,
      tags: [],
      isPublicRecipe: false,
      defaultScale: 1.0,
    };
  }

  // Parse ingredient string to extract quantity and type
  function parseIngredient(amountStr, ingredientName) {
    const amount = amountStr.trim();

    // Common quantity patterns
    const patterns = [
      { regex: /^(\d+(?:\.\d+)?)\s*tbsp/i, type: "TABLESPOON" },
      { regex: /^(\d+(?:\.\d+)?)\s*tablespoons?/i, type: "TABLESPOON" },
      { regex: /^(\d+(?:\.\d+)?)\s*tsp/i, type: "TEASPOON" },
      { regex: /^(\d+(?:\.\d+)?)\s*teaspoons?/i, type: "TEASPOON" },
      { regex: /^(\d+(?:\.\d+)?)\s*cups?/i, type: "CUP" },
      { regex: /^(\d+(?:\.\d+)?)\s*ml/i, type: "MILLS" },
      { regex: /^(\d+(?:\.\d+)?)\s*g\b/i, type: "GRAMS" },
      { regex: /^(\d+(?:\.\d+)?)\s*grams?/i, type: "GRAMS" },
      { regex: /^(\d+(?:\.\d+)?)\s*kg/i, type: "KGS" },
      { regex: /^(\d+(?:\.\d+)?)\s*lbs?/i, type: "POUND" },
      { regex: /^(\d+(?:\.\d+)?)\s*pounds?/i, type: "POUND" },
      { regex: /^(\d+(?:\.\d+)?)\s*oz/i, type: "OUNCE" },
      { regex: /^(\d+(?:\.\d+)?)\s*ounces?/i, type: "OUNCE" },
      { regex: /^(\d+(?:\.\d+)?)\s*l\b/i, type: "LITRES" },
      { regex: /^(\d+(?:\.\d+)?)\s*lit(?:re|er)s?/i, type: "LITRES" },
      { regex: /^(\d+(?:\.\d+)?)\s*dl/i, type: "DECILITER" },
      { regex: /^(\d+(?:\.\d+)?)\s*bottles?/i, type: "BOTTLE" },
      { regex: /^(\d+(?:\.\d+)?)\s*cans?/i, type: "CAN" },
      { regex: /^(\d+(?:\.\d+)?)\s*bunch(?:es)?/i, type: "BUNCH" },
      { regex: /^(\d+(?:\.\d+)?)\s*packets?/i, type: "PACKET" },
      { regex: /^pinch/i, type: "PINCH" },
      { regex: /^(\d+(?:\.\d+)?)\s*x\s*/i, type: "ITEM" },
      { regex: /^(\d+(?:\.\d+)?)\b/i, type: "ITEM" },
    ];

    for (const pattern of patterns) {
      const match = amount.match(pattern.regex);
      if (match) {
        const numericAmount = parseFloat(match[1]);
        return {
          quantityType: pattern.type,
          amount: numericAmount,
          ingredientName: ingredientName,
        };
      }
    }

    // Check for "pinch" without a number
    if (/^pinch/i.test(amount)) {
      return {
        quantityType: "PINCH",
        amount: null,
        ingredientName: ingredientName,
      };
    }

    // Default to ITEM with no amount if no pattern matches
    return {
      quantityType: "ITEM",
      amount: null,
      ingredientName: [amount, ingredientName].join(" ").trim(),
    };
  }

  // Parse ISO 8601 duration to minutes
  function parseIsoDuration(duration) {
    if (!duration || !duration.startsWith("PT")) return 0;

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 0;
  }

  // Determine where section headers should be inserted in the ingredient list
  function getSectionPositions(sectionHeaders) {
    if (!sectionHeaders || sectionHeaders.length === 0) {
      return [];
    }

    const positions = [];
    const sectionElements = document.querySelectorAll(
      "div.pt-4.text-base.capitalize",
    );
    const ingredientElements = document.querySelectorAll(
      "div.Ingredients__ingredient",
    );

    sectionElements.forEach((sectionEl, sectionIndex) => {
      // Count how many ingredient elements come before this section
      let ingredientIndex = 0;
      for (const ingredientEl of ingredientElements) {
        // Check if this ingredient comes before the section in DOM order
        if (
          ingredientEl.compareDocumentPosition(sectionEl) &
          Node.DOCUMENT_POSITION_FOLLOWING
        ) {
          ingredientIndex++;
        }
      }

      positions.push({
        title: sectionHeaders[sectionIndex],
        ingredientIndex: ingredientIndex,
      });
    });

    return positions;
  }

  // Extract nutritional information from the page
  function extractNutritionalInfo() {
    try {
      // Find script tags that might contain the recipe data
      const scripts = document.querySelectorAll("script");
      for (const script of scripts) {
        const content = script.textContent;

        // Look for the pattern with overrideNutritionalInformation
        const match = content.match(
          /"overrideNutritionalInformation":true,"calories":(\d+(?:\.\d+)?),"fat":(\d+(?:\.\d+)?),"saturatedFat":(\d+(?:\.\d+)?),"carbohydrates":(\d+(?:\.\d+)?),"dietaryFibre":(\d+(?:\.\d+)?),"sugars":(\d+(?:\.\d+)?),"protein":(\d+(?:\.\d+)?),"sodium":(\d+(?:\.\d+)?)/,
        );

        if (match) {
          const [
            _,
            calories,
            fat,
            saturatedFat,
            carbohydrates,
            dietaryFibre,
            sugars,
            protein,
            sodium,
          ] = match;

          // Format to match Crouton's format
          const nutritionParts = [
            `Dietary Fibre: ${dietaryFibre} g`,
            `Protein: ${protein} g`,
            `Sodium: ${sodium} mg`,
            `Saturated Fat: ${saturatedFat} g`,
            `Carbohydrates: ${carbohydrates} g`,
            `Fat: ${fat} g`,
            `Sugar: ${sugars} g`,
            `Calories: ${calories} kcal`,
          ];

          return nutritionParts.join(",\n");
        }
      }
    } catch (e) {
      console.warn("Could not extract nutritional information:", e);
    }

    return "";
  }

  // Fetch image and convert to base64
  async function fetchImageAsBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Get favicon URL for the current site
  function getFaviconUrl() {
    // Try to find favicon link in the document
    const faviconLink = document.querySelector("link[rel~='icon']");
    if (faviconLink && faviconLink.href) {
      return faviconLink.href;
    }

    // Fallback to standard /favicon.ico location
    return `${window.location.origin}/favicon.ico`;
  }

  // Generate UUID v4
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16).toUpperCase();
      },
    );
  }

  // Sanitize filename
  const sanitizeFilename = (name) =>
    name.replace(/[<>:"/\\|?*]+/g, "").trim() || "recipe";

  // Download file
  const download = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Create and inject export button on recipe pages
  function createExportButton() {
    const button = document.createElement("button");
    button.textContent = "📥 Export to Crouton";
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      padding: 12px 20px;
      background-color: #7cc576;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    `;

    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#6bb565";
      button.style.transform = "translateY(-2px)";
      button.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
    });

    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#7cc576";
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    });

    button.addEventListener("click", async () => {
      button.textContent = "⏳ Exporting...";
      button.disabled = true;
      button.style.opacity = "0.7";
      button.style.cursor = "not-allowed";

      try {
        await main();
      } catch (error) {
        console.error("Export failed:", error);
        alert("❌ Failed to export recipe. Check console for details.");
      } finally {
        button.textContent = "📥 Export to Crouton";
        button.disabled = false;
        button.style.opacity = "1";
        button.style.cursor = "pointer";
      }
    });

    document.body.appendChild(button);
  }

  // Initialize on recipe pages
  window.addEventListener("load", () => {
    if (document.querySelector("script[type='application/ld+json']")) {
      createExportButton();
    }
  });
})();
