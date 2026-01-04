// ==UserScript==
// @name        * Common: IndexedDB (Fork by Shihu)
// @namespace   Shihu
// @version     1.0.1
// @license     BSD-3-Clause
// @author      BOS-Ernie (Original), Shihu (Fork/Maintainer)
// @description Funktionen zum Speichern und Abrufen von Daten in der IndexedDB
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// ==/UserScript==

const databaseName = "BosErnie";
const objectStoreName = "GebäudeUndFahrzeugVerwalter";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1);

    request.onerror = () => {
      reject("Failed to open the database");
    };

    request.onsuccess = event => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = event => {
      const db = event.target.result;
      const objectStore = db.createObjectStore(objectStoreName);
      objectStore.createIndex("IndexName", "propertyName", { unique: false });
    };
  });
}

async function storeData(data, key) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.put(data, key);

    request.onsuccess = () => {
      resolve("Data stored successfully");
    };

    request.onerror = () => {
      reject("Failed to store data");
    };
  });
}

async function retrieveData(key) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], "readonly");
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.get(key);

    request.onsuccess = event => {
      const data = event.target.result;
      resolve(data);
    };

    request.onerror = () => {
      reject("Failed to retrieve data");
    };
  });
}

/**
 * @license
 * BSD 3-Clause License
 * 
 * Original work Copyright (c) [Jahr], BOS-Ernie
 * Modified and maintained by [Dein Name], 2025
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of BOS-Ernie nor the names of its contributors may be used
 *    to endorse or promote products derived from this software without specific
 *    prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * ...
 */

