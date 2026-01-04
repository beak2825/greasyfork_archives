// ==UserScript==
 // @name         Perplexity Search with Mode
 // @namespace    http://tampermonkey.net/
 // @version      1.1
 // @description  Auto-fill and submit searches on Perplexity.ai using URL parameters
 // @author       Sergio Dias
 // @license      MIT
 // @match        https://www.perplexity.ai/*
 // @match        https://perplexity.ai/*
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559123/Perplexity%20Search%20with%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/559123/Perplexity%20Search%20with%20Mode.meta.js
 // ==/UserScript==

 /*
  * MIT License
  *
  * Copyright (c) 2025 Sergio Dias
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  */

 (function() {
     'use strict';

     // Prevent multiple executions
     if (window.__perplexityAutoSearchRan) {
         return;
     }
     window.__perplexityAutoSearchRan = true;

     // Parse URL parameters
     const urlParams = new URLSearchParams(window.location.search);
     const searchQuery = urlParams.get('s');
     const mode = urlParams.get('mode') || 'search'; // 'search' or 'research'

     // Exit if no search query provided
     if (!searchQuery) {
         return;
     }

     // Helper to wait
     const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

     // Wait for an element to appear
     function waitForElement(selector, timeout = 10000) {
         return new Promise((resolve, reject) => {
             const startTime = Date.now();

             const checkElement = () => {
                 const element = document.querySelector(selector);
                 if (element) {
                     resolve(element);
                     return;
                 }

                 if (Date.now() - startTime >= timeout) {
                     reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                     return;
                 }

                 requestAnimationFrame(checkElement);
             };

             checkElement();
         });
     }

     // Set text in the Lexical editor input
     function setInputText(input, text) {
         input.focus();
         document.execCommand('selectAll', false, null);
         document.execCommand('insertText', false, text);
     }

     // Set Search mode (regular mode)
     function setSearchMode() {
         const searchRadio = document.querySelector('[role="radio"][aria-label="Search"]');
         if (searchRadio && searchRadio.getAttribute('aria-checked') !== 'true') {
             searchRadio.click();
         }
     }

     // Try to enable Research mode
     // Returns true if Research mode is now active, false if login required
     async function tryEnableResearchMode() {
         const researchRadio = document.querySelector('[role="radio"][aria-label="Research"]');
         if (!researchRadio) {
             return false;
         }

         researchRadio.click();

         // Wait for potential modal to appear
         await wait(500);

         // Check if login modal appeared
         const closeModalBtn = document.querySelector('[data-testid="close-modal"]');
         const heading = document.querySelector('h1');
         const isLoginModal = closeModalBtn && heading?.textContent?.includes('Sign in');

         if (isLoginModal) {
             // Close the modal - Research requires Pro/login
             closeModalBtn.click();
             await wait(300);
             // Fall back to Search mode
             setSearchMode();
             return false;
         }

         // Check if Research mode is now active
         return researchRadio.getAttribute('aria-checked') === 'true';
     }

     // Click the Submit button
     function clickSubmit() {
         const submitBtn = document.querySelector('button[aria-label="Submit"]');
         if (submitBtn) {
             submitBtn.click();
             return true;
         }
         return false;
     }

     // Main execution
     async function main() {
         try {
             // Wait for the input to be available
             const input = await waitForElement('#ask-input');

             // Small delay to ensure the page is fully interactive
             await wait(500);

             // Set the search query text
             setInputText(input, searchQuery);

             await wait(300);

             // Set the search mode based on parameter
             if (mode === 'research') {
                 await tryEnableResearchMode();
             } else {
                 // Default to search mode
                 setSearchMode();
             }

             // Wait for submit button to appear
             await waitForElement('button[aria-label="Submit"]');

             // Small delay before submitting
             await wait(200);

             // Click submit
             clickSubmit();

         } catch (error) {
             alert('Perplexity Auto Search error: ' + error.message);
         }
     }

     // Run when DOM is ready
     if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', main);
     } else {
         main();
     }
 })();