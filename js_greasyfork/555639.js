// ==UserScript==
// @name         Buy All Bazaar
// @namespace    buy_all_bazaar.biscuitius
// @version      1.2
// @description  Adds a big one-click "Buy All" button to each item in a bazaar
// @author       Biscuitius [1936433]
// @match        https://www.torn.com/bazaar.php?userId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/555639/Buy%20All%20Bazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/555639/Buy%20All%20Bazaar.meta.js
// ==/UserScript==

async function mainLoop() {
  // Skip if on desktop view
  if ($(".desktop___lmVhy").length) {
    return;
  }

  // === Highlight the wanted item in the bazaar ===

  // Get the bazaar listings first
  let bazaarListings = $(".itemDescription___j4EfE");

  try {
    // Get the current URL
    let currentURL = window.location.href;

    // Extract the item ID from the URL
    // https://www.torn.com/bazaar.php?userId=4011984&itemId=1249#/
    if (currentURL.includes("itemId=")) {
      let itemId = currentURL.split("itemId=")[1].split("#")[0].split("&")[0];
      console.log("Looking for item ID:", itemId);

      // Loop through each bazaar listing to find the matching item by ID
      if (!$("#highlighted-item").length) {
        bazaarListings.each(function () {
          // Get the item ID from this listing's image src
          let listingElement = $(this);
          let itemImg = listingElement.find("img").attr("src");
          console.log("Checking listing item image src:", itemImg);
          if (itemImg && itemImg.includes("/images/items/")) {
            console.log("Found item image src:", itemImg);
            // Extract item ID from src like "/images/items/1269/large.png"
            let listingItemId = itemImg.split("/images/items/")[1].split("/")[0];
            
            // Compare with the item ID from the URL
            if (listingItemId === itemId) {
              // Highlight this listing if the ID matches
              listingElement.css("background-color", "rgba(255, 255, 0, 0.2)");
              // Add an ID to the listing to prevent searching for selected item again
              listingElement.attr("id", "highlighted-item");
            }
          } else {
            console.log("No valid item image src found for this listing.");
          }
        });
      }
    }
  } catch (e) {
    // Skip highlighting if there's an error parsing the URL
  }

  // === Add "Buy All" buttons to each bazaar listing ===
  bazaarListings.each(function () {
    // Check if the "Buy All" button already exists for this listing
    if ($(this).find("button.buy-all-btn").length) {
      return; // Skip if it already exists
    }

    // Create the "Buy All" button HTML
    let buyButtonHTML =
      "<button style='color:rgb(116, 192, 252);cursor:pointer;' class='buy-all-btn'>Buy All</button>";

    // Make the button text color turn #999 on hover
    $(this).append(buyButtonHTML);
    $(this)
      .find("button.buy-all-btn")
      .hover(
        function () {
          $(this).css("color", "#999");
        },
        function () {
          $(this).css("color", "rgb(116, 192, 252)");
        }
      );

    // Get the quantity input field for this listing
    let quantityInput = $(this).find(
      "input.numberInput____trXC.buyAmountInput___CSV2n"
    );

    // Get the buy button for this listing
    let buyButton = $(this).find("button.buy___Obyz6");

    // Add click event listener to the "Buy All" button
    $(this)
      .find("button.buy-all-btn")
      .on("click", function () {
        // Get the available quantity from the listing span.amountValue___cSVqO
        let availableQuantity = $(this)
          .closest(".itemDescription___j4EfE")
          .find("span.amountValue___cSVqO")
          .text();

        // Set the quantity input field to the available quantity
        // React requires special handling to update its internal state
        let inputElement = quantityInput[0]; // Get the raw DOM element

        // Clear the field first
        quantityInput.focus();
        quantityInput.select();

        // Use execCommand to simulate typing (works with React)
        document.execCommand("delete");
        document.execCommand("insertText", false, availableQuantity);

        // Trigger blur to ensure React processes the change
        quantityInput.blur();

        // Trigger a click on the original buy button
        buyButton.click();

        // Find the confirmation button, class .button___g7ktb and aria-label="Yes"
        setInterval(() => {
          const confirmButton = document.querySelector(
            '.button___g7ktb[aria-label="Yes"]'
          );
          if (confirmButton) {
            confirmButton.click();
            clearInterval(this);
          }
        }, 50);
      });
  });
}

setInterval(mainLoop, 200);
