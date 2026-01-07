// ==UserScript==
// @name         CS Adopted From Viewer (v4)
// @namespace    https://greasyfork.org/users/straybec
// @version      1.4.0
// @description  Show/hide "Adopted from" for pets on the pet list page. Works for all pets.
// @match        https://www.chickensmoothie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561680/CS%20Adopted%20From%20Viewer%20%28v4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561680/CS%20Adopted%20From%20Viewer%20%28v4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------
    // Configuration
    // ----------------------------
    var STORAGE_KEY = 'cs_show_adopted_from';
    var CACHE_KEY   = 'cs_adopted_from_cache';
    var CONCURRENCY = 6;      // Number of parallel fetches
    var REQUEST_DELAY = 100;  // ms between batches

    // ----------------------------
    // State
    // ----------------------------
    var enabled = localStorage.getItem(STORAGE_KEY) === 'true';
    var cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');

    // ----------------------------
    // Utilities
    // ----------------------------
    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    function saveCache() {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }

    function createAdoptionElement(text) {
        var div = document.createElement('div');
        div.className = 'pet-adopted-from';
        div.textContent = 'Adopted from: ' + text;
        return div;
    }

    function extractAdoptedFrom(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var labels = doc.querySelectorAll('td.l');
        for (var i = 0; i < labels.length; i++) {
            var label = labels[i];
            var labelText = label.textContent.replace(/\s+/g, '').trim();
            if (labelText === 'Adoptedfrom') {
                var valueCell = label.nextElementSibling;
                if (!valueCell) {
                    return 'Unknown';
                }
                var link = valueCell.querySelector('a');
                if (link && link.textContent.trim() !== '') {
                    return link.textContent.trim();
                }
                return valueCell.textContent.trim() || 'Unknown';
            }
        }
        return 'Unknown';
    }

    // ----------------------------
    // Core Logic
    // ----------------------------
    function fetchPet(pet, petId, info, callback) {
        if (cache.hasOwnProperty(petId)) {
            info.textContent = 'Adopted from: ' + cache[petId];
            callback();
            return;
        }

        fetch('/viewpet.php?id=' + petId).then(function(res) {
            return res.text();
        }).then(function(html) {
            var adoptedFrom = extractAdoptedFrom(html);
            cache[petId] = adoptedFrom;
            saveCache();
            info.textContent = 'Adopted from: ' + adoptedFrom;
            callback();
        }).catch(function() {
            info.textContent = 'Adopted from: Error';
            callback();
        });
    }

    function processPets() {
        var pets = document.querySelectorAll('dl.pet');
        var index = 0;

        function nextBatch() {
            var batch = [];
            for (var i = 0; i < CONCURRENCY && index < pets.length; i++, index++) {
                (function(pet) {
                    var petId = pet.getAttribute('data-id');
                    if (!petId) return;
                    var info = pet.querySelector('.pet-adopted-from');
                    if (!enabled) {
                        if (info) info.style.display = 'none';
                        return;
                    }
                    if (!info) {
                        info = createAdoptionElement('Loading...');
                        pet.appendChild(info);
                    } else {
                        info.style.display = 'block';
                    }
                    batch.push(function(cb) {
                        fetchPet(pet, petId, info, cb);
                    });
                })(pets[index]);
            }

            if (batch.length === 0) return;

            var completed = 0;
            for (var j = 0; j < batch.length; j++) {
                batch[j](function() {
                    completed++;
                    if (completed === batch.length) {
                        setTimeout(nextBatch, REQUEST_DELAY);
                    }
                });
            }
        }

        nextBatch();
    }

    // ----------------------------
    // UI Injection
    // ----------------------------
    function insertToggleButton() {
        var renameBtn = document.querySelector('.btn-rename-pets');
        if (!renameBtn) return;

        var toggleBtn = document.createElement('button');
        toggleBtn.textContent = enabled ? 'Hide Adopted From' : 'Show Adopted From';
        toggleBtn.style.marginLeft = '6px';

        toggleBtn.onclick = function() {
            enabled = !enabled;
            localStorage.setItem(STORAGE_KEY, enabled);
            toggleBtn.textContent = enabled ? 'Hide Adopted From' : 'Show Adopted From';
            processPets();
        };

        renameBtn.parentNode.insertBefore(toggleBtn, renameBtn.nextSibling);
    }

    // ----------------------------
    // Styles
    // ----------------------------
    function injectStyles() {
        var style = document.createElement('style');
        style.textContent = '.pet-adopted-from { font-size:11px; color:#666; margin-top:4px; text-align:center; }';
        document.head.appendChild(style);
    }

    // ----------------------------
    // Init
    // ----------------------------
    if (document.querySelector('dl.pet')) {
        injectStyles();
        insertToggleButton();
        if (enabled) processPets();
    }

})();
