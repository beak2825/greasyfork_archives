// ==UserScript==
// @name         LinkedIn | Invite to follow Company Page
// @namespace    https://github.com/gustavnyberg/tampermonkey
// @version      1.0.3
// @description  Adds select all invite connections to follow a LinkedIn company page
// @author       Gustav Nyberg
// @match        https://www.linkedin.com/company/*/admin/dashboard/
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/551296/LinkedIn%20%7C%20Invite%20to%20follow%20Company%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/551296/LinkedIn%20%7C%20Invite%20to%20follow%20Company%20Page.meta.js
// ==/UserScript==

/* ---------------------------------------------------
   CURSED CODES:
--------------------------------------------------- */

/* ---------------------------------------------------
   DAUNTING DESIGNS:
--------------------------------------------------- */

/* ---------------------------------------------------
   FEARED FEATURES:
--------------------------------------------------- */

/* ---------------------------------------------------
   TERRIFYING TODOS:
   // TODO: Add abort button
   // TODO: Add counter to select a given number of invites/credits
   // TODO: Add break condition for when given/max number of invites reached (also handle 'Show more results')
   // TODO: Add more user feedback (alerts, UI messages) instead of just console.log
   // TODO: Handle unexpected DOM changes or missing elements more gracefully
--------------------------------------------------- */

(function () {
    'use strict';

    // Timing constants
    const waitContainer = 500;
    const waitInvite = 1200;
    const waitScroll = 600;
    const maxIdleChecks = 5;

    class InviteToFollowCompanyPageInviter {
        constructor() {
            this.isRunning = false;
            this.version = this.extractVersion();
        }

        async runSelectAll() {
            if (this.isRunning) {
                this.log("Already running. Ignoring duplicate start.");
                return;
            }
            this.isRunning = true;

            // Show startup alert with version info
            this.showStartupAlert();

            try {
                const creditsAvailable = this.getAvailableCredits();
                if (!creditsAvailable) {
                    this.log("No credits available. Stopping.");
                    return;
                }

                let creditsUsed = 0;
                let creditsRemaining = creditsAvailable;

                let invitesPlanned = creditsAvailable;
                let invitesSelected = 0;
                let invitesRemaining = invitesPlanned;

                let idleChecks = 0;

                while (creditsRemaining > 0 && invitesRemaining > 0) {
                    const container = this.getResultsContainer();
                    if (!container) {
                        this.log("Results container not found yet. Waiting...");
                        await this.wait(waitContainer);
                        continue;
                    }

                    const checkboxes = this.findInviteCheckboxes(container);
                    let invitesThisRound = 0;

                    if (checkboxes.length > 0) {
                        invitesThisRound = Math.min(creditsRemaining, invitesRemaining, checkboxes.length);

                        for (const cb of checkboxes.slice(0, invitesThisRound)) cb.click();

                        // Update invites
                        invitesSelected += invitesThisRound;
                        invitesRemaining -= invitesThisRound;

                        // Update credits
                        creditsUsed += invitesThisRound;
                        creditsRemaining -= invitesThisRound;

                        // Integrity check
                        if (creditsRemaining !== invitesRemaining) {
                            throw new Error(`Mismatch detected: creditsRemaining=${creditsRemaining}, invitesRemaining=${invitesRemaining}`);
                        }

                        this.log(
                            `Invites selected: ${invitesSelected}/${invitesPlanned} | Credits used: ${creditsUsed}/${creditsAvailable}`
                        );

                        await this.wait(waitInvite);
                    } else {
                        await this.scrollToBottom(container);

                        const showMore = this.findShowMoreButton(container);
                        if (showMore) {
                            this.log("Clicking 'Show more results'...");
                            showMore.click();
                            await this.wait(waitInvite);
                        } else {
                            this.log(
                                `No more results. Invites selected: ${invitesSelected}/${invitesPlanned}, Credits used: ${creditsUsed}/${creditsAvailable}`
                            );
                            break;
                        }
                    }

                    if (invitesThisRound === 0) {
                        idleChecks++;
                        if (idleChecks >= maxIdleChecks) {
                            this.log(
                                `Stopping due to repeated idle cycles. Invites selected: ${invitesSelected}/${invitesPlanned}, Credits used: ${creditsUsed}/${creditsAvailable}`
                            );
                            break;
                        }
                    } else {
                        idleChecks = 0;
                    }
                }

                if (creditsRemaining === 0 && invitesRemaining === 0) {
                    this.log(`Done. Credit limit reached: ${creditsUsed}/${creditsAvailable}`);
                }
            } catch (err) {
                console.error("[InviteToFollowCompanyPageInviter] Error:", err);
            } finally {
                this.isRunning = false;
            }
        }

        addButtons() {
            if (document.getElementById('SelectAllBtn')) return;

            const creditsSpan = this.findCreditsElement();
            if (!creditsSpan) return;

            const parent = creditsSpan.closest('div');
            if (!parent) return;

            parent.appendChild(this.createButton("Select All", () => this.runSelectAll()));
            this.log("Button added.");
        }

        /* --- DOM helpers --- */

        getResultsContainer() {
            return document.getElementById('invitee-picker-results-container');
        }

        findInviteCheckboxes(scope) {
            return [...scope.querySelectorAll('input[type="checkbox"]')]
                .filter(cb => !cb.checked && !cb.disabled && cb.offsetParent !== null);
        }

        findCreditsElement() {
            return [...document.querySelectorAll('span')]
                .find(el => /credit/i.test(el.textContent));
        }

        getAvailableCredits() {
            const el = this.findCreditsElement();
            if (!el) return null;
            const text = el.textContent.replace(/\s|,/g, '');
            const match = text.match(/(\d+)\s*\/\s*(\d+)/);
            return match ? parseInt(match[1], 10) : null;
        }

        findShowMoreButton(container) {
            const host = container?.parentElement ?? document;
            return [...host.querySelectorAll('button span.artdeco-button__text')]
                .find(el => el.textContent.trim().toLowerCase() === 'show more results')
                ?.closest('button') || null;
        }

        async scrollToBottom(container) {
            container.scrollTop = container.scrollHeight;
            await this.wait(waitScroll);
        }

        /* --- Utilities --- */

        extractVersion() {
            // // Extract version from the script metadata
            // const scriptTag = document.querySelector('script[src*="invite-to-follow-company-page"]');
            // if (scriptTag) {
            //     // For Tampermonkey scripts, we can get the version from the script content
            //     const scriptContent = document.querySelector('script').textContent;
            //     const versionMatch = scriptContent.match(/@version\s+([\d.]+)/);
            //     return versionMatch ? versionMatch[1] : 'Unknown';
            // }
            
            // // Fallback: try to get from the current script
            // const scripts = document.querySelectorAll('script');
            // for (const script of scripts) {
            //     if (script.textContent.includes('Invite to follow Company Page')) {
            //         const versionMatch = script.textContent.match(/@version\s+([\d.]+)/);
            //         if (versionMatch) return versionMatch[1];
            //     }
            // }
            
            return '1.0.3'; // Default fallback
        }

        showStartupAlert() {
            alert(`InviteToFollowCompanyPageInviter is running in version: ${this.version}`);
        }

        createButton(label, onClick) {
            const btn = document.createElement('button');
            btn.id = label.replace(/\s+/g, '') + "Btn";
            btn.innerText = label;
            Object.assign(btn.style, {
                padding: '6px 12px',
                fontWeight: 'bold',
                backgroundColor: '#0073b1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            });
            btn.addEventListener('click', onClick);
            return btn;
        }

        wait(ms) { return new Promise(r => setTimeout(r, ms)); }
        log(msg) { console.log(`[InviteToFollowCompanyPageInviter] ${msg}`); }
    }

    /* --- Bootstrap --- */

    const inviter = new InviteToFollowCompanyPageInviter();

    // Observe page changes and inject button when credits element appears
    const observer = new MutationObserver(() => inviter.addButtons());
    observer.observe(document.body, { childList: true, subtree: true });

})();