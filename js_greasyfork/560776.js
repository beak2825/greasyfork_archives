// ==UserScript==
// @name Songsterr Free Premium
// @namespace https://github.com/arthur-adriansens
// @version 2.0.1
// @description Change Songsterr to unlock premium features.
// @license The Unlicense
// @supportURL https://github.com/arthur-adriansens/songsterrWarningRemover
// @match http*://*.songsterr.com/*
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/560776/Songsterr%20Free%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/560776/Songsterr%20Free%20Premium.meta.js
// ==/UserScript==

(function () {
    function notifyError(err) {
        alert(
            `Songsterr Free Premium encountered an error.
        \nFeel free to report this issue at https://github.com/arthur-adriansens/songsterrWarningRemover/issues
        \n${err}`
        );
    }

    try {
        const fetchParent = unsafeWindow || window; // unsafeWindow required to wrap the fetch function in the same context that the actual site uses.
        const innerFetch = fetchParent.fetch;

        function mockProfile(profile) {
            if (profile.plan == "plus") {
                console.log("Songsterr Free Premium: You already have Songsterr plus!");
                return profile;
            }

            profile.plan = "plus";
            profile.subscription = {
                plan: {
                    id: "plus"
                }
            };

            return profile;
        }

        // Wrap the fetch function in our own version that intercepts requests to the profile detail endpoint, mocking plus status.
        function interceptingFetch(resource, options) {
            var resource_url = JSON.stringify(resource);

            if (resource_url.includes("/auth/profile")) {
                console.log("Songsterr Free Premium: Intercepting /auth/profile request to " + resource_url + ".");

                return innerFetch(resource, options)
                    .then(response => response.json())
                    .then(responseProfile => mockProfile(responseProfile))
                    .then(mockedProfile => new Response(JSON.stringify(mockedProfile)))
                    .catch(err => notifyError(err));
            } else {
                return innerFetch(resource, options);
            }
        }

        Object.defineProperty(fetchParent, "fetch", {
            value: function () {
                return interceptingFetch(...arguments);
            },
            configurable: true,
            enumerable: false,
            writable: true,
        });

        window.addEventListener("DOMContentLoaded", () => {
            try {
                // Change user.hasPlus to true and user.profile.plan to "plus" in the state JSON:
                const stateElement = document.getElementById("state");
                const stateJson = JSON.parse(stateElement.innerHTML);

                stateJson.user.hasPlus = true;
                if (stateJson.user.profile != null) {
                    stateJson.user.profile.plan = "plus";
                } else {
                    // If user is NOT logged in: fake a whole profile:
                    stateJson.user.profile = {
                        id: 100000000,
                        uid: 100000000,
                        email: "fakeforplus@example.com",
                        name: "fakeforplus",
                        plan: "plus",
                        permissions: [],
                        subscription: null,
                        sra_license: "none",
                        bonus: {
                            activeStart: null,
                            activeEnd: null,
                            balance: 0,
                            balanceMinutes: 0
                        },
                        bonusPurchasedFeatures: [],
                        signature: "invalid_signature_with_no_purpose_other_than_to_exist",
                        created_at: "2025-00-00T00:00:00.000Z",
                        last_signin_date: "2025-00-00T00:00:00.000Z",
                        hadPlusBeforeSE: false,
                        password_change_required: false,
                        preferencesNotifications: {
                            notificationsEmails: false,
                            researchEmails: false
                        }
                    };
                }
                stateElement.innerHTML = JSON.stringify(stateJson);

                // This attempts to fix the issue by removing the parent apptab element, hopefully resulting in the site recreating it with the tablature.
                if (document.getElementById("tablature") == null) {
                    console.log("Songsterr Free Premium: tablature element doesn't exist, attempting to fix by removing entire apptab element and letting site recreate it.");
                    document.getElementById("apptab").remove();
                }
            } catch (err) {
                notifyError(err);
            }
        });
    } catch (err) {
        notifyError(err);
    }
})();