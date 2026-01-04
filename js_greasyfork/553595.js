// ==UserScript==
// @name         mob.co.uk → Broccoli Archive Exporter
// @namespace    https://yourdomain.example/
// @version      2.0
// @description  Export recipes from mob.co.uk into Broccoli archive format
// @author       You
// @match        https://www.mob.co.uk/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/553595/mobcouk%20%E2%86%92%20Broccoli%20Archive%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/553595/mobcouk%20%E2%86%92%20Broccoli%20Archive%20Exporter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const main = async () => {
    const ingredients = [
      ...document.querySelectorAll("div.Ingredients__ingredient > div"),
    ];

    const recipes = [
      ...document.querySelectorAll(`script[type="application/ld+json"]`),
    ]
      .map((e) => JSON.parse(e.innerText))
      .map((s) => {
        if ("@type" in s) return s;
        if ("@graph" in s) return s["@graph"];
      })
      .flat()
      .filter((s) => s["@type"] == "Recipe")
      .map((r) => {
        const updatedIngredients = r["recipeIngredient"].map(
          (ingredient, index) => {
            const amount = ingredients[index]?.firstChild?.textContent || "";
            return [amount, ingredient].join(" ").trim();
          }
        );
        r["recipeIngredient"] = updatedIngredients;
        return r;
      });

    if (recipes.length === 0) {
      alert("No recipes found!");
      return;
    }

    const zipArchive = new JSZip();
    const categoryNames = [];

    // Prepare each recipe for the archive
    for (const recipe of recipes) {
      const broccoliJSON = convertRecipeToBroccoli(recipe);
      const recipeFileName = sanitizeFilename(recipe.name) || "recipe";
      const broccoliZip = new JSZip();

      // Add Broccoli JSON metadata file
      broccoliZip.file("recipe.json", JSON.stringify(broccoliJSON, null, 2));

      // Add image if available
      if (recipe.image) {
        try {
          const imageUrl = Array.isArray(recipe.image) ? recipe.image[0] : recipe.image;
          const imageBlob = await fetch(imageUrl).then((r) => r.blob());
          const imageName = getImageName(imageUrl);
          broccoliZip.file(imageName, imageBlob);
          broccoliJSON.imageName = imageName;
        } catch (e) {
          console.warn("Could not fetch image:", e);
        }
      }

      const broccoliBlob = await broccoliZip.generateAsync({ type: "blob" });
      zipArchive.file(`${recipeFileName}.broccoli`, broccoliBlob);

      // Collect categories
      if (recipe.recipeCategory) {
        const categories = Array.isArray(recipe.recipeCategory)
          ? recipe.recipeCategory
          : recipe.recipeCategory.split(",");

        categories.forEach((c) => {
          const trimmed = c.trim();
          if (trimmed && !categoryNames.includes(trimmed)) {
            categoryNames.push(trimmed);
          }
        });
      }
    }

    // Create categories.json for Broccoli
    const categoriesJSON = categoryNames.map((name) => ({
      name,
      color: "#7cc576",
    }));
    zipArchive.file("categories.json", JSON.stringify(categoriesJSON, null, 2));

    // Generate the final archive
    const blob = await zipArchive.generateAsync({ type: "blob" });

    // Use the first recipe name for the archive file name
    const archiveName = `${sanitizeFilename(recipes[0].name)}.broccoli-archive`;

    download(archiveName, blob);
    alert("✅ Broccoli archive ready for import!");
  };

  // Convert schema.org recipe to Broccoli format with JSON-LD metadata
  function convertRecipeToBroccoli(recipe) {
    const {
      name,
      description,
      recipeIngredient,
      recipeInstructions,
      recipeYield,
      prepTime,
      cookTime,
      totalTime,
      recipeCategory,
      image,
    } = recipe;

    // Ensure categories is an array
    let categories = [];
    if (recipeCategory) {
      categories = Array.isArray(recipeCategory)
        ? recipeCategory
        : recipeCategory.split(",").map(c => c.trim());
    }

    // Format instructions as a single string (joined with newlines)
    const directionsArray = (recipeInstructions || []).map((step) => step.text || step).filter(Boolean);
    const directions = directionsArray.join("\n");

    // Format ingredients as a single string (joined with newlines)
    const ingredients = (recipeIngredient || []).join("\n");

    // Format preparation time
    const times = [];
    if (prepTime) times.push(formatTimeToHuman(prepTime));
    if (cookTime) times.push(formatTimeToHuman(cookTime));
    if (totalTime) times.push(formatTimeToHuman(totalTime));
    const preparationTime = times.length > 0 ? times.join(", ") : "";

    // Parse recipeYield to a string
    let servings = "";
    if (recipeYield) {
      servings = typeof recipeYield === "number" ? recipeYield.toString() : recipeYield;
    }

    // Ensure image is an array for JSON-LD
    let imageArray = [];
    if (image) {
      imageArray = Array.isArray(image) ? image : [image];
    }

    // Format instructions for JSON-LD
    const instructionsJsonLd = directionsArray.map((text) => ({
      "@type": "HowToStep",
      text: text,
    }));

    const broccoli = {
      title: name || "",
      source: window.location.href,
      categories: categories,
      description: description || "",
      ingredients: ingredients,
      directions: directions,
      notes: "",
      nutritionalValues: "",
      preparationTime: preparationTime,
      servings: servings,
      favorite: false,
      imageName: null,
      // Additional JSON-LD fields
      name: name || "",
      image: imageArray,
      recipeCategory: categories,
      recipeYield: servings,
      prepTime: formatTimeToHuman(prepTime),
      cookTime: formatTimeToHuman(cookTime),
      totalTime: formatTimeToHuman(totalTime),
      recipeIngredient: recipeIngredient || [],
      recipeInstructions: instructionsJsonLd,
      sourceOrganization: {
        "@type": "Organization",
        name: "MOB Kitchen",
        url: "https://www.mob.co.uk/",
      },
      url: window.location.href,
      dateModified: new Date().toISOString(),
    };

    return broccoli;
  }

  // Convert ISO 8601 duration to human-readable format
  const formatTimeToHuman = (time) => {
    if (!time) return "";

    // If already human-readable, return as-is
    if (!time.startsWith("PT")) return time;

    const match = time.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = match[1];
      const minutes = match[2];
      const parts = [];
      if (hours) parts.push(`${hours}h`);
      if (minutes) parts.push(`${minutes}m`);
      return parts.join(" ");
    }
    return time;
  };

  const sanitizeFilename = (name) =>
    name.replace(/[<>:"/\\|?*]+/g, "").trim() || "recipe";

  const getImageName = (url) => url.split("/").pop().split("?")[0];

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

  // Auto-run on recipe pages
  window.addEventListener("load", () => {
    if (document.querySelector("script[type='application/ld+json']")) {
      main();
    }
  });
})();