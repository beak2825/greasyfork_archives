// ==UserScript==
// @name         LinkedIn Skills Automation – CTI Governance (MIL5)
// @namespace    https://greasyfork.org/users/kauasilbershlachparodes
// @match        https://www.linkedin.com/in/*/details/skills/*
// @grant        none
// @author       https://github.com/kauasilbershlachparodes
// @version      5.0
// @license      MIT
// @description  MIL5-grade automation to continuously delete all LinkedIn skills. SPA-safe, mutation-resilient, always-on execution.
// @downloadURL https://update.greasyfork.org/scripts/560811/LinkedIn%20Skills%20Automation%20%E2%80%93%20CTI%20Governance%20%28MIL5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560811/LinkedIn%20Skills%20Automation%20%E2%80%93%20CTI%20Governance%20%28MIL5%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let state = {
        editing: false,
        deleteIntent: false,
        confirmDelete: false,
        dismiss: false
    };

    function resetState() {
        state.editing = false;
        state.deleteIntent = false;
        state.confirmDelete = false;
        state.dismiss = false;
    }

    function clickEdit() {
        if (state.editing) return false;

        const anchor = document
            .querySelector('use[href="#edit-medium"]')
            ?.closest('a');

        if (!anchor) return false;

        state.editing = true;
        anchor.click();
        return true;
    }

    function clickDeleteIntent() {
        if (!state.editing || state.deleteIntent) return false;

        const button = [...document.querySelectorAll('span.artdeco-button__text')]
            .find(s => s.textContent.trim() === 'Exclua a competência')
            ?.closest('button');

        if (!button) return false;

        state.deleteIntent = true;
        button.click();
        return true;
    }

    function clickConfirmDelete() {
        if (!state.deleteIntent || state.confirmDelete) return false;

        const button = [...document.querySelectorAll('span.artdeco-button__text')]
            .find(s => s.textContent.trim() === 'Excluir')
            ?.closest('button');

        if (!button) return false;

        state.confirmDelete = true;
        button.click();
        return true;
    }

    function clickDismissToast() {
        if (!state.confirmDelete || state.dismiss) return false;

        const button =
            document.querySelector('button[aria-label^="Fechar notificação"]') ||
            document.querySelector('use[href="#close-small"]')?.closest('button');

        if (!button) return false;

        state.dismiss = true;
        button.click();

        // ciclo completo → reset e continua
        resetState();
        return true;
    }

    const observer = new MutationObserver(() => {
        // ordem importa
        clickEdit();
        clickDeleteIntent();
        clickConfirmDelete();
        clickDismissToast();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // disparo inicial
    clickEdit();

})();
