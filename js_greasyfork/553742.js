// ==UserScript==
// @name        [Torn]: Halloween Spooky User Scanner
// @namespace   PixelGhost310
// @match       https://www.torn.com/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description A simple script to navigate through user profiles with persistent storage of the last visited profile ID.
// @downloadURL https://update.greasyfork.org/scripts/553742/%5BTorn%5D%3A%20Halloween%20Spooky%20User%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/553742/%5BTorn%5D%3A%20Halloween%20Spooky%20User%20Scanner.meta.js
// ==/UserScript==

// Profile Navigation Script with Persistent Storage
(function () {
  "use strict";

  // Initialize counter from localStorage, URL, or default to 1
  let counter = 1;

  // Try to get counter from localStorage first
  const storedCounter = localStorage.getItem("profileNavCounter");
  if (storedCounter) {
    counter = parseInt(storedCounter);
  }

  // Override with URL parameter if present
  const urlMatch = window.location.href.match(/XID=(\d+)/);
  if (urlMatch) {
    counter = parseInt(urlMatch[1]);
    localStorage.setItem("profileNavCounter", counter);
  }

  // Function to update counter
  function updateCounter(newValue) {
    counter = newValue;
    localStorage.setItem("profileNavCounter", counter);
  }

  // Create container for buttons
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    z-index: 1000000;
    background: rgba(0, 0, 0, 0.8);
    padding: 8px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  `;

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.classList.add("torn-btn")
  prevBtn.classList.add("btn-big")
  prevBtn.innerHTML = "&lt;";
  prevBtn.onclick = () => {
    updateCounter(counter - 1);
    window.location.href = `https://www.torn.com/profiles.php?XID=${counter}`;
  };

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.classList.add("torn-btn")
  resetBtn.classList.add("btn-big")
  resetBtn.textContent = "Reset";
  resetBtn.onclick = () => {
    if (inputContainer.style.display === "none") {
      inputContainer.style.display = "flex";
      resetInput.focus();
    } else {
      inputContainer.style.display = "none";
    }
  };

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.classList.add("torn-btn")
  nextBtn.classList.add("btn-big")
  nextBtn.innerHTML = "&gt;";
  nextBtn.onclick = () => {
    updateCounter(counter + 1);
    window.location.href = `https://www.torn.com/profiles.php?XID=${counter}`;
  };

  // Input container for reset
  const inputContainer = document.createElement("div");
  inputContainer.style.cssText = `
    display: none;
    gap: 5px;
    align-items: center;
  `;

  // Reset input field
  const resetInput = document.createElement("input");
  resetInput.classList.add("input")
  resetInput.type = "number";
  resetInput.placeholder = "ID";
  resetInput.style.cssText = `
    width: 80px;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
  `;

  // GO button
  const goBtn = document.createElement("button");
  goBtn.classList.add("torn-btn")
  goBtn.classList.add("btn-big")
  goBtn.textContent = "GO";
  goBtn.onclick = () => {
    const newCounter = parseInt(resetInput.value);
    if (!isNaN(newCounter) && newCounter > 0) {
      updateCounter(newCounter);
      window.location.href = `https://www.torn.com/profiles.php?XID=${counter}`;
    } else {
      alert("Please enter a valid positive number");
    }
  };

  // Allow Enter key to submit
  resetInput.onkeypress = (e) => {
    if (e.key === "Enter") {
      goBtn.click();
    }
  };

  // Assemble the UI
  inputContainer.appendChild(resetInput);
  inputContainer.appendChild(goBtn);

  container.appendChild(prevBtn);
  container.appendChild(resetBtn);
  container.appendChild(nextBtn);
  container.appendChild(inputContainer);

  document.body.appendChild(container);
})();
