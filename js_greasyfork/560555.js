// ==UserScript==
// @name        Squiddly Inverted
// @namespace   http://tampermonkey.net/
// @match       https://github.com/*
// @grant       GM.getValues
// @grant       GM.setValues
// @grant       GM.listValues
// @version     1.1.3
// @author      kenshoen
// @license     MIT
// @description Prevents merging PRs unless it has a label
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/560555/Squiddly%20Inverted.user.js
// @updateURL https://update.greasyfork.org/scripts/560555/Squiddly%20Inverted.meta.js
// ==/UserScript==

// Original from https://github.com/joshcartme/squiddly/blob/v1.3.0/content/scripts.ts
// MIT License
// Copyright (c) 2025 Josh Cartmell
// Copyright (c) 2025 kenshoen

"use strict";

const defaultConfig = {
    blockIfFailingChecks: false,
    blockUnlessHasLabel: "マージ可",
};

// warning to show when finding and checking checks isn't working
const FAILING_CHECKS_WARNING = "cannot determine if checks are failing";
const ALL_CHECKS_PASSED_TEXT = "All checks have passed";

const PR_PAGE_REGEX = /\/pull\/\d+$/;

const styles = `button.squiddly-inverted[disabled][aria-label]:hover::after {
    content: attr(aria-label);
    position: absolute;
    left: 100%;
    background: black;
    color: white;
    border-radius: 0.5rem;
    padding: 0.5rem;
    z-index: 100;
    width: 200%;
}`;

class ConfigLoader {
  async prepare() {
    if ((await GM.listValues()).length === 0) {
      await GM.setValues(defaultConfig);
    }
    return GM.getValues(Object.keys(defaultConfig));
  }
}

class SquiddlyInvertedCS {
    observer;
    onPrPage;
    config;
    configLoader;

    constructor(configLoader) {
        this.configLoader = configLoader;
    }

     async listenTo(document) {
        this.config = await this.configLoader.prepare();

        const body = document.body;
        this.observer = new MutationObserver((mutations) => {
            this.onPrPage = PR_PAGE_REGEX.test(document.location.pathname);
            this.blockIfAppropriate();
        });
        if (body) {
            this.observer.observe(body, { childList: true, subtree: true });
        }
        const styleElement = document.createElement("style");
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    getChecksDescriptionElement() {
        const checksSection = document.querySelector('[aria-label="Checks"]');
        if (!checksSection) {
            console.warn(`Checks section not found, ${FAILING_CHECKS_WARNING}`);
            return;
        }
        const ariaDescribedBy = checksSection.getAttribute("aria-describedby");
        if (!ariaDescribedBy) {
            console.warn(
                `aria-describedby not found on checks section, ${FAILING_CHECKS_WARNING}`
            );
            return;
        }
        const checksDescription = document.getElementById(ariaDescribedBy);
        if (!checksDescription) {
            console.warn(
                `Element with id ${ariaDescribedBy} not found, ${FAILING_CHECKS_WARNING}`
            );
            return;
        }
        return checksDescription;
    }

    reasonsToBlockMerge() {
        const reasons = [];
        if (this.config.blockIfFailingChecks) {
            const descriptionElement = this.getChecksDescriptionElement();
            if (descriptionElement) {
                if (
                    !descriptionElement.textContent?.includes(
                        ALL_CHECKS_PASSED_TEXT
                    )
                ) {
                    reasons.push(
                        descriptionElement.nextElementSibling?.textContent ||
                            "checks are running or failing"
                    );
                }
            } else {
                reasons.push("unable to determine checks status");
            }
        }
        if (this.config.blockUnlessHasLabel && !this.hasTargetLabel()) {
            reasons.push(`PR has no label "${this.config.blockUnlessHasLabel}"`);
        }
        return reasons;
    }

    blockIfAppropriate() {
        if (this.onPrPage) {
            const mergeButton = this.getMergeButton();
            // don't interfere with the confirm merge button
            if (
                !mergeButton ||
                mergeButton.textContent?.toLowerCase().includes("confirm") ||
                mergeButton.dataset.inactive === "true"
            ) {
                return;
            }
            mergeButton.classList.add("squiddly-inverted");
            const reasons = this.reasonsToBlockMerge();

            if (reasons.length > 0) {
                mergeButton.disabled = true;
                mergeButton.ariaDisabled = "true";
                mergeButton.ariaLabel = `Merge button disabled by Squiddly Inverted: ${reasons.join(
                    ", "
                )}`;
            } else {
                mergeButton.removeAttribute("disabled");
                mergeButton.ariaDisabled = "false";
                mergeButton.removeAttribute("ariaLabel");
            }
        }
    }

    getMergeButton() {
        return Array.from(
            document.querySelectorAll("button")
        ).reduce((mergeButton, button) => {
            if (button?.textContent?.toLowerCase().includes("merge")) {
                mergeButton = button;
            }
            return mergeButton;
        }, null);
    }

    hasTargetLabel() {
        return !!document.querySelector(
            `.discussion-sidebar-item [data-name="${this.config.blockUnlessHasLabel}"]`
        );
    }
}

new SquiddlyInvertedCS(new ConfigLoader()).listenTo(document);