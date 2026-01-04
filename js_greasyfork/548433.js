// ==UserScript==
// @name         Enable Password Manager on MyTax Hasil
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enables Password Manager autofill on mytax.hasil.gov.my
// @author       kazcfz
// @match        https://*.hasil.gov.my/*
// @grant        none
// @run-at       document-start
// @icon         https://upload.wikimedia.org/wikipedia/commons/4/4e/LHDN_logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548433/Enable%20Password%20Manager%20on%20MyTax%20Hasil.user.js
// @updateURL https://update.greasyfork.org/scripts/548433/Enable%20Password%20Manager%20on%20MyTax%20Hasil.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */

(function () {
  'use strict';

  // --- Constants ---
  const FORM_SELECTOR = "form[data-parsley-validate]";       // Main login form
  const PWD_ID = "gpm-password";                             // Temporary hidden password input ID
  const PERSISTENT_ID = "gpm-persistent-password";           // Hidden password field that persists across form reloads
  const ID_SELECT_SELECTOR = "select[ng-model='idType']";    // Dropdown for ID type
  const ID_SELECT_VALUE = "1";                               // 1 (Identification Card No.) || 2 (Passport No.) || 3 (Army No.) || 4 (Police No.)

  /**
   * Utility: Create a hidden <input> element that can be used
   * for tricking Google Password Manager into storing credentials.
   */
  function createHiddenInput({ type, id, name, autocomplete }) {
    const el = document.createElement("input");
    el.type = type;
    el.id = id;
    if (name) el.name = name;
    if (autocomplete) el.autocomplete = autocomplete;
    el.setAttribute(
      "style",
      "position:absolute;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;border:0;margin:0;padding:0;"
    );
    return el;
  }

  /**
   * Ensure that a persistent hidden password field exists in <body>.
   * This field survives between form reloads and holds the last known password.
   */
  function ensurePersistentPasswordField() {
    const existing = document.getElementById(PERSISTENT_ID);
    if (existing) return existing;

    const create = () => {
      const el = createHiddenInput({ type: "password", id: PERSISTENT_ID });
      document.body.appendChild(el);
      return el;
    };

    if (document.body) {
      return create();
    } else {
      // Wait for <body> to appear if it doesn’t exist yet
      const observer = new MutationObserver(() => {
        if (document.body) {
          create();
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      return null;
    }
  }

  /**
   * Add hidden password fields to the form so Google Password Manager can recognize it.
   * Syncs input into the persistent password field whenever it changes.
   */
  function addCredentialFields() {
    const form = document.querySelector(FORM_SELECTOR);
    if (!form) return false;

    // Prevent duplicate fields
    if (form.querySelector(`#${PWD_ID}`)) return true;

    const password = createHiddenInput({
      type: "password",
      id: PWD_ID,
      name: "password",
      autocomplete: "current-password"
    });

    // Sync hidden field with persistent field
    password.addEventListener("input", () => {
      const persistent = ensurePersistentPasswordField();
      if (persistent) persistent.value = password.value;
    });

    form.appendChild(password);
    return true;
  }

  /**
   * Auto-select "Identification Card No." as the ID type if not already selected.
   */
  function autoSelectIdType() {
    const select = document.querySelector(ID_SELECT_SELECTOR);
    if (!select) return false;

    if (select.value !== ID_SELECT_VALUE) {
      select.value = ID_SELECT_VALUE;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      select.dispatchEvent(new Event("input", { bubbles: true }));
    }
    return true;
  }

  /**
   * Restore the password from the persistent hidden field back into the actual
   * password input field (Angular-bound) if it exists and is empty.
   */
  function restorePassword() {
    const realPwd = document.querySelector("input[type='password'][ng-model='idPP']");
    if (!realPwd) return false;

    const persistent = document.getElementById(PERSISTENT_ID);
    if (persistent && persistent.value && !realPwd.value) {
      realPwd.focus();
      realPwd.value = persistent.value;

      // Trigger Angular change detection
      realPwd.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
      realPwd.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));

      realPwd.blur();

      return true;
    }
    return false;
  }

  /**
   * Clear the persistent password field when the form is submitted,
   * ensuring credentials aren’t kept in memory unnecessarily.
   */
  function clearPersistentOnSubmit() {
    const form = document.querySelector(FORM_SELECTOR);
    if (!form) return;

    form.addEventListener("submit", () => {
      const persistent = document.getElementById(PERSISTENT_ID);
      if (persistent) persistent.remove();
    }, { once: true });
  }

  /**
   * Safe wrapper for creating a MutationObserver on a node.
   * Returns the observer instance or null if creation failed.
   */
  function safeObserve(targetNode, callback) {
    try {
      const mo = new MutationObserver(callback);
      mo.observe(targetNode, { childList: true, subtree: true });
      return mo;
    } catch {
      return null;
    }
  }

  /**
   * Initialization routine:
   * - Ensures hidden fields exist
   * - Sets default ID type
   * - Restores password if possible
   * - Watches DOM changes to reapply these steps as needed
   */
  function init() {
    ensurePersistentPasswordField();
    addCredentialFields();
    autoSelectIdType();
    restorePassword();
    clearPersistentOnSubmit();

    // Observe DOM mutations for dynamic content
    let mo = safeObserve(document.documentElement, () => {
      addCredentialFields();
      autoSelectIdType();
      restorePassword();
      clearPersistentOnSubmit();
    });

    // Fallback if observer creation fails
    if (!mo) {
      const retryInterval = setInterval(() => {
        addCredentialFields();
        autoSelectIdType();
        restorePassword();
        clearPersistentOnSubmit();
        if (document.body) {
          mo = safeObserve(document.body, () => {
            addCredentialFields();
            autoSelectIdType();
            restorePassword();
            clearPersistentOnSubmit();
          });
          if (mo) clearInterval(retryInterval);
        }
      }, 300);
      setTimeout(() => clearInterval(retryInterval), 15000);
    }

    // Ensure everything runs again once DOM is fully loaded
    window.addEventListener("DOMContentLoaded", () => {
      ensurePersistentPasswordField();
      addCredentialFields();
      autoSelectIdType();
      restorePassword();
      clearPersistentOnSubmit();
    }, { once: true });
  }

  // --- Entry point ---
  init();
})();