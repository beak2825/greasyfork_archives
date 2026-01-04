// ==UserScript==
// @name         OT
// @namespace    http://tampermonkey.net/
// @version      2025-12-20
// @description  Modify Splose Table
// @author       Ryan Davie
// @license MIT
// @match        https://meaningfulactivities.splose.com/patients
// @icon         https://www.google.com/s2/favicons?sz=64&domain=splose.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559764/OT.user.js
// @updateURL https://update.greasyfork.org/scripts/559764/OT.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Global variable to store checked items
window.globalCheckedItems = [];

// ============================================================================
// HTTP INTERCEPTOR - Intercept calls to https://au.splose.com/api/patients/search?
// ============================================================================

(function() {
  console.log('HTTP Interceptor initialized for au.splose.com/api/patients/search');

  // Intercept XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    this._method = method;
    return originalXHROpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function() {
    if (this._url && this._url.includes('au.splose.com/api/patients/search')) {
    // Extract patientTagIds from URL
          const url = new URL(this._url);
          const patientTagIds = [];
          url.searchParams.forEach((value, key) => {
            if (key.startsWith('filter[patientTagIds]')) {
              patientTagIds.push(value);
            }
          });
          window.globalCheckedItems = patientTagIds;

      this.addEventListener('load', function() {
        try {
          const parsedResponse = JSON.parse(this.responseText);

          console.log('Before: ', parsedResponse.patients);

          console.log('Tags: ', window.globalCheckedItems);

          // Filter patients to only include those that have ALL the tags in globalCheckedItems
          parsedResponse.patients = parsedResponse.patients.filter(patient => {
            // Get all tag IDs for this patient
            const patientTagIds = patient.patientTags.map(tag => tag.id.toString());

            // Check if patient has all the required tags
            return window.globalCheckedItems.every(requiredTagId =>
              patientTagIds.includes(requiredTagId)
            );
          });

          console.log('Filtered: ', parsedResponse.patients);

          var filteredIds = parsedResponse.patients.map(x => x.id);

          // Hide table rows that are not in filteredIds
          setTimeout(() => {
            const tableRows = document.querySelectorAll('.ant-table-content .ant-table-row');
            tableRows.forEach(row => {
              const rowKey = row.getAttribute('data-row-key');
              if (rowKey) {
                // Hide rows whose data-row-key is not in filteredIds
                if (!filteredIds.includes(parseInt(rowKey))) {
                  row.style.display = 'none';
                } else {
                  row.style.display = '';
                }
              }
            });
            console.log('Table rows filtered');
          }, 100);

        } catch (e) {
          console.log('Oops: ' + e);
        }
      });

      this.addEventListener('error', function() {
      });
    }
    return originalXHRSend.apply(this, arguments);
  };

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = function() {
    const url = arguments[0];
    const options = arguments[1] || {};

    if (url && url.toString().includes('au.splose.com/api/patients/search')) {

      return originalFetch.apply(this, arguments).then(function(response) {
        // Clone the response so we can read it
        const clonedResponse = response.clone();

        clonedResponse.text().then(function(text) {
          try {
            const parsedResponse = JSON.parse(text);

            console.log('Parsed Patients:', parsedResponse.patients);

          } catch (e) {
            console.log('Could not parse response as JSON');
          }
        }).catch(function(err) {
          console.log('Error reading response:', err);
        });

        return response;
      }).catch(function(error) {
        console.log('=== Fetch Error ===');
        console.log('Request failed:', error);
        throw error;
      });
    }

    return originalFetch.apply(this, arguments);
  };

  console.log('HTTP Interceptor ready - watching for requests to au.splose.com/api/patients/search');
})();
})();
