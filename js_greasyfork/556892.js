// ==UserScript==
// @name        Check all Shopify app permissions
// @namespace   Violentmonkey Scripts
// @match       https://admin.shopify.com/store*
// @grant       none
// @version     1.0.1
// @author      Filip Minic
// @description 11/25/2025, 1:56:25 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556892/Check%20all%20Shopify%20app%20permissions.user.js
// @updateURL https://update.greasyfork.org/scripts/556892/Check%20all%20Shopify%20app%20permissions.meta.js
// ==/UserScript==
(function() {
    // 1. CLEAR EXISTING INTERVALS (Prevents multiple loops if you paste script twice)
    if (window.myPermissionButtonLoop) {
        clearInterval(window.myPermissionButtonLoop);
    }

    // 2. DEFINE THE MAIN LOGIC
    function handleButtonVisibility() {
        const isTargetPage = window.location.href.includes("configuration/storefront_api_integration") ||
                             window.location.href.includes("configuration/admin_api_integration");

        const existingBtn = document.querySelector('.checkPermissionsButton');

        if (isTargetPage) {
            // We are on the right page. Does the button exist?
            if (!existingBtn) {
                createButton();
            }
        } else {
            // We are on the wrong page. Remove button if it exists.
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    }

    // 3. FUNCTION TO CREATE THE BUTTON (With your styling)
    function createButton() {
        const btn = document.createElement("button");
        btn.textContent = "Check All App Permissions";
        btn.className = "checkPermissionsButton";

        // --- STYLING ---
        Object.assign(btn.style, {
            position: "fixed",
            top: "120px",
            right: "20px",
            zIndex: "99999",
            padding: "12px 24px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            color: "white",
            background: "linear-gradient(135deg, rgba(63, 94, 251, 0.85), rgba(252, 70, 107, 0.85))",
            backdropFilter: "blur(8px)",
            webkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            transition: "all 0.3s ease"
        });

        // Hover Effects
        btn.onmouseenter = () => {
            btn.style.transform = "translateY(-2px)";
            btn.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
        };
        btn.onmouseleave = () => {
            btn.style.transform = "translateY(0)";
            btn.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        };

        // Click Logic
        btn.addEventListener("click", () => {
            btn.textContent = "Checking...";
            checkAllPermissions().then(() => {
                btn.textContent = "Done!";
                setTimeout(() => btn.textContent = "Check All Permissions", 2000);
            });
        });

        document.body.appendChild(btn);
    }

    // 4. THE PERMISSION CHECKER LOGIC
    async function checkAllPermissions() {
        const numberOfTries = 3;
        for (let x = 1; x <= numberOfTries; x++) {
            for (const box of document.querySelectorAll('.Polaris-Checkbox__Input')) {
                if (!box.checked) {
                    box.click();
                    await new Promise(resolve => setTimeout(resolve, 5)); // Slight delay to be safe
                }
            }
        }
    }

    // 5. START THE LOOP (Checks every 1 second)
    // We save the ID to window so we can clear it later if needed
    window.myPermissionButtonLoop = setInterval(handleButtonVisibility, 1000);

    // Run once immediately so you don't have to wait 1 second
    handleButtonVisibility();

    console.log("Script started: Button will appear on API pages automatically.");

})();
