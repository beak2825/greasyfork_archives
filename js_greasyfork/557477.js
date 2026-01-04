// ==UserScript==
// @name         SPOG Shyftoff Alert Adder
// @namespace    http://tampermonkey.net/
// @version      2025-11-30
// @description  Adds alerts for Shyftoff specific changes
// @author       Stamos/Stamatis
// @match        https://spog.neonova.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neonova.net
// @run-at document-end
// @require https://unpkg.com/dompurify/dist/purify.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557477/SPOG%20Shyftoff%20Alert%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/557477/SPOG%20Shyftoff%20Alert%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ALL_AFFILIATES = [{
        affiliateId: "ImOn Communications",
        displayName: "ImOn",
        campaignName: "ImOn Communications Residential (IA)"
    }, {
        affiliateId: "Home Telephone ILEC",
        displayName: "Home Telecom",
        campaignName: "Home Telecom (SC)"
    }, {
        affiliateId: "TruVista Communications",
        displayName: "TruVista",
        campaignName: "TruVista (SC&GA)"
    }, {
        affiliateId: "Great Plains Communications",
        displayName: "Great Plains",
        campaignName: "Great Plains"
    }, {
        // Note: includes gonetspeed
        affiliateId: "Otelco Telecommunications, LLC",
        displayName: "Otelco + GoNetSpeed",
        campaignName: "OTelco"
    }, {
        // doubled because they have two different campaign names
        affiliateId: "Otelco Telecommunications, LLC",
        displayName: "Otelco + GoNetSpeed",
        campaignName: "GoNetSpeed (NY)"
    }, {
        affiliateId: "Bulloch Net Incorporated",
        displayName: "Bulloch",
        campaignName: "Bulloch Broadband (GA)"
    }, {
        affiliateId: "Carolina Connect",
        displayName: "Carolina Connect",
        campaignName: "Carolina Connect (SC)"
    }, {
        affiliateId: "Co-Mo Connect",
        displayName: "Co-Mo Connect",
        campaignName: "Co-Mo Connect (MO)"
    }, {
        // Note: includes coastal fiber
        affiliateId: "Darien Tel",
        displayName: "Darien + Coastal Fiber",
        campaignName: "Darien Telephone (GA)"
    }, {
        // Note: includes coastal fiber
        affiliateId: "Darien Tel",
        displayName: "Darien + Coastal Fiber",
        campaignName: "Coastal Fiber (GA)"
    }, {
        affiliateId: "Foothills",
        displayName: "Foothills",
        campaignName: "Foothills Communications (KY)"
    }, {
        affiliateId: "Paul Bunyan Communications",
        displayName: "Paul Bunyan",
        campaignName: "Paul Bunyan (MN)"
    }, {
        affiliateId: "Palmetto Rural Telephone Cooperative Inc.",
        displayName: "PRTC",
        campaignName: "PRTC - Palmetto Rural (SC)"
    }, {
        affiliateId: "Peoples Telephone Cooperative",
        displayName: "Peoples",
        campaignName: "Peoples Communications (TX)"
    },
    {
        affiliateId: "Oklahoma Fiber LLC",
        displayName: "OEC Fiber",
        campaignName: "OEC Fiber (OK)"
    }, {
        affiliateId: "Wilkes.net",
        displayName: "Riverstreet (All Orgs)",
        campaignName: "RiverStreet" // all campaigns have riverstreet in it
    }, {
        affiliateId: "TEC",
        displayName: "TEC",
        campaignName: "TEC (MS)"
    }, {
        affiliateId: "United Services, Inc.",
        displayName: "United Fiber",
        campaignName: "United Fiber (MO)"
    }, {
        affiliateId: "United Electric Cooperative Services",
        displayName: "UCS",
        campaignName: "UCS Broadband (TX)"
    }, {
        affiliateId: "West Carolina Communications",
        displayName: "West Carolina (WCTel)",
        campaignName: "WCTEL"
    }, {
        affiliateId: "West Kentucky Rural Telephone",
        displayName: "West Kentucky (WK&T)",
        campaignName: "WK&T - West Kentucky Rural (KY)"
    }];

    const ALERT_CHECK_INTERVAL = 10 * 1000; // first number is amt of seconds

    var addedAlerts = []
    var timeoutId = 0

    async function getAlertsForCampaign(affiliateId) {
        try {
            const response = await fetch(`http://207.211.190.191:8060/alerts/${affiliateId}`)

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
                console.log("No errors, stopping")
                return
            }

            const result = await response.json();
            //console.log(result)
            return result
        } catch (error) {
            //console.error(error.message)
            throw error
        }

    }

    function getColorForAlertType(type) {
        if (type === "Maintenance")
            return "#ffcc80"
        if (type === "Notice")
            return "#ce93d8"
        if (type === "Outage")
            return "#ef9a9a"
        return "#448aff"
    }

    function getEndTime(eta) {
        if (eta === null) {
            return "No ETA"
        }
        return eta
    }

    function getHighestAlertLevelOfAlertArray(array) {
        if (array.length == 0) console.error("BUGGED! array is 0");
        // Outage, Notice, Maintenance
        var highestLevel = "Notice"
        array.forEach((alert) => {
            if (alert.type === "Maintenance" && highestLevel === "Notice")
                highestLevel = "Maintenance"
            else if (alert.type === "Outage" && (highestLevel === "Maintenance" || highestLevel === "Notice"))
                highestLevel = "Outage"
        })
        if (array.length == 1 && array[0].affiliate == null)
            return "null"
        return highestLevel
    }

    function getClassColorForAlertType(type) {
        if (type === "Maintenance")
            return "bg-purple-3"
        if (type === "Notice")
            return "bg-orange-3"
        if (type === "Outage")
            return "bg-red-3"
        return "bg-blue-3"
    }

    function getIconForAlertType(type) {
        if (type === "Maintenance")
            return "build"
        if (type === "Notice")
            return "notification_important"
        if (type === "Outage")
            return "warning"
        return "notification_important"
    }

    function getBannerAvatarTextForAlertType(type) {
        if (type === "Maintenance")
            return "Maint."
        if (type === "Notice")
            return "Notice"
        if (type === "Outage")
            return "Outage"
        return "Special"
    }

    function prettifyTime(time, timezone) {
        if (time === null)
            return time
        const dateOptions = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "short",
            timeZone: timezone,
        })
        const date = new Date(time)
        return dateOptions.format(date)
    }

    function removeAllCustomBanners() {
        const elementsToRemove = document.querySelectorAll("[custom-alert]")
        elementsToRemove.forEach(element => {
            element.remove()
        })
    }

    function createAlertBanner(alertObject) {
        const bannerHTML = `
            <div custom-alert class="q-banner row items-center q-banner--dense q-banner--dark q-dark ${getClassColorForAlertType(alertObject.type)} text-black" role="alert">
              <div class="q-banner__avatar col-auto row items-center self-start">
                <i class="q-icon text-white notranslate material-icons" aria-hidden="true" role="presentation">${getIconForAlertType(alertObject.type)}</i>
                <div class="q-chip row inline no-wrap items-center bg-white text-uppercase text-bold">
                  <div style="font-family: monospace;" class="q-chip__content col row no-wrap items-center q-anchor--skip">${getBannerAvatarTextForAlertType(alertObject.type)}</div>
                </div>
              </div>
              <div class="q-banner__content col text-body2">
                <div>${alertObject.content}</div>
              </div>
              <div class="q-banner__actions row items-center justify-end col-auto">
                <div class="col text-right q-mr-xs">
                  <div>Started:</div>
                  ${alertObject.endTime === null ? "" : `<div>Ended:</div>`}
                  <!---->
                </div>
                <div class="col-auto">
                  <div>${prettifyTime(alertObject.startTime)}</div>
                  ${alertObject.endTime === null ? "" : prettifyTime(alertObject.endTime)}
                  <!---->
                </div>
              </div>
            </div>
        `

        if (typeof trustedTypes === "undefined")
            trustedTypes = {
                createPolicy: (n, rules) => rules
            }

        const policy = trustedTypes.createPolicy("some-content-policy", {
          createHTML(input) {
            return DOMPurify.sanitize(input, {ADD_ATTR: ['custom-alert']})
          },
        })

        const trustedHTML = policy.createHTML(bannerHTML)
        return trustedHTML
    }

    //ALERT ARRAY FORM
    //affiliate = company
    //content = message
    //creator = NRTC manager who made the alert
    //endTime = expected end time
    //isArchived = no idea
    //startTime = start time
    //timeZone = timezone, usually just "America/New_York"
    //type = severity level of the alert; maintenance, notice, outage
    //_id = guessing some sort of internal alert id

    function handleAlerts(alertArray) {
        if (alertArray === null || alertArray.length == 0) {
            console.log("no custom alerts")
            return
        }

        var bannerBar = document.querySelector(".q-gutter-xs")
        if (!bannerBar) {
            //create new banner bar
            var gutterParent = document.querySelector("#q-app > div > div > main")
            if (!gutterParent) {
                console.log("main is empty?")
                return
            }

            var newGutter = document.createElement("div")
            newGutter.classList.add("q-gutter-xs")

            gutterParent.appendChild(newGutter)
            gutterParent.insertBefore(newGutter, gutterParent.children[0])
            bannerBar = newGutter
        }
        removeAllCustomBanners()

        for (const alert of alertArray) {
            const html = createAlertBanner(alert)
            bannerBar.insertAdjacentHTML("beforeend", html)
        }

        /*alertArray.forEach(alert => {
            const html = createAlertBanner(alert)
            bannerBar.insertAdjacentHTML("beforeend", html)
        })*/
    }

    function checkAllAlertsAndHandleUI() {
        var campaignDropdownInput = document.querySelector(".q-field__input")
        var currentAffiliate = campaignDropdownInput.value.toLowerCase()
        // if no affiliate matches
        if (!ALL_AFFILIATES.some(affiliate => currentAffiliate.includes(affiliate.campaignName.toLowerCase()))) {
            console.log(`affiliate not found: ${currentAffiliate}`)
            return
        }

        const currentAffiliateId = ALL_AFFILIATES.find(
            (affiliate) => currentAffiliate.includes(affiliate.campaignName.toLowerCase())
        ).affiliateId
        getAlertsForCampaign(currentAffiliateId)
            .then((result) => {
                handleAlerts(result)
            })
            .catch((error) => {
                console.error(error)
            })

        timeoutId = setTimeout(checkAllAlertsAndHandleUI, ALERT_CHECK_INTERVAL)
    }

    function setup() {
        ALL_AFFILIATES.sort((a, b) => a.displayName.localeCompare(b.displayName))

        window.navigation.addEventListener("navigate", (event) => {
            addedAlerts = []
            removeAllCustomBanners()
            clearTimeout(timeoutId)
            timeoutId = setTimeout(checkAllAlertsAndHandleUI, 500)
        })
        timeoutId = setTimeout(checkAllAlertsAndHandleUI, 2000)
    }

    setup()
})();