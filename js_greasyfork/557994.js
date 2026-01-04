// ==UserScript==
// @name         Google Classroom - Download Post Attachments
// @namespace    https://example.com/userscripts
// @version      1.0
// @description  Adds a download button to each Google Classroom post that fetches and downloads all attachments using the Classroom API
// @author       @krispy-snacc (https://github.com/krispy-snacc)
// @match        https://classroom.google.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557994/Google%20Classroom%20-%20Download%20Post%20Attachments.user.js
// @updateURL https://update.greasyfork.org/scripts/557994/Google%20Classroom%20-%20Download%20Post%20Attachments.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const BTN_CLASS = "gc-download-btn-v4";

    const styles = "." + BTN_CLASS + "{}";

    function injectStyles() {
        if (document.getElementById("gc-download-styles")) return;
        const s = document.createElement("style");
        s.id = "gc-download-styles";
        s.textContent = styles;
        document.head.appendChild(s);
    }

    function getClassId() {
        const url = window.location.href;
        const match = url.match(/\/c\/([^\/]+)/);
        return match ? match[1] : null;
    }

    function getUserId() {
        const url = window.location.href;
        const match = url.match(/\/u\/(\d+)\//);
        return match ? match[1] : "0";
    }

    async function fetchPostAttachments(postId, classId, userId) {
        const postIdDecoded = atob(postId);
        const classIdDecoded = atob(classId);

        const body =
            "f.req=%5B%5B%5B%22tQShAc%22%2C%22%5B%5B%5B%5C%22" +
            encodeURIComponent(postIdDecoded) +
            "%5C%22%2C%5B%5C%22" +
            encodeURIComponent(classIdDecoded) +
            "%5C%22%5D%5D%5D%2C%5B%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%2C%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%2C%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%2Cnull%2Cnull%2C%5B%5Bnull%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%5D%5D%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=" +
            encodeURIComponent(window.IJ_values[42]);

        try {
            const res = await fetch(
                "https://classroom.google.com/u/" +
                    userId +
                    "/_/ClassroomUi/data/batchexecute?rpcids=tQShAc&source-path=%2Fu%2F" +
                    userId +
                    "%2Fc%2F" +
                    classId +
                    "%2Fm%2F" +
                    postId +
                    "%2Fdetails&soc-app=1&soc-platform=1&soc-device=1&rt=c",
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type":
                            "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                    referrer: "https://classroom.google.com/",
                    body: body,
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                }
            );

            const text = await res.text();
            const lines = text.split("\n");
            if (lines.length < 4) {
                throw new Error("Invalid API response format");
            }

            const cleaned = lines[3];
            const parsed = JSON.parse(JSON.parse(cleaned)[0][2]);
            const data = parsed[1][0][2];
            const attachments = data[data.length - 1][0][7] || [];

            return attachments.map(function (a) {
                return {
                    name: a[0],
                    fileId: a[2],
                    viewUrl: a[6],
                    downloadUrl:
                        "https://drive.google.com/uc?export=download&id=" +
                        a[2] +
                        "&authuser=" +
                        userId,
                };
            });
        } catch (error) {
            console.error("[GC Download] Error fetching attachments:", error);
            throw error;
        }
    }

    async function downloadFile(url, filename) {
        try {
            // Fetch the file as a blob
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a temporary download link
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename;
            a.style.display = "none";

            document.body.appendChild(a);
            a.click();

            // Cleanup
            setTimeout(function () {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }, 100);
        } catch (error) {
            console.warn(
                "[GC Download] Blob download failed, falling back to new tab:",
                error
            );
            // Fallback to opening in new tab if fetch fails
            window.open(url, "_blank");
        }

        // Small delay between downloads
        await new Promise(function (resolve) {
            setTimeout(resolve, 500);
        });
    }

    async function downloadPostAttachments(postElement) {
        const postId = postElement.getAttribute("data-stream-item-id");
        if (!postId) {
            throw new Error("Post ID not found");
        }

        const classId = getClassId();
        const userId = getUserId();

        if (!classId) {
            throw new Error("Class ID not found in URL");
        }

        const encodedPostId = btoa(postId);
        // classId from URL is already base64 encoded, use it directly
        const encodedClassId = classId;

        console.log("[GC Download] Fetching attachments for post:", postId);

        const attachments = await fetchPostAttachments(
            encodedPostId,
            encodedClassId,
            userId
        );

        if (!attachments || attachments.length === 0) {
            alert("No attachments found in this post.");
            return 0;
        }

        console.log(
            "[GC Download] Found " + attachments.length + " attachments"
        );

        for (let i = 0; i < attachments.length; i++) {
            const attachment = attachments[i];
            console.log(
                "[GC Download] Downloading: " +
                    attachment.name +
                    " (" +
                    (i + 1) +
                    "/" +
                    attachments.length +
                    ")"
            );
            await downloadFile(attachment.downloadUrl, attachment.name);
        }

        return attachments.length;
    }

    function insertButtonForPost(postElement) {
        const postId = postElement.getAttribute("data-stream-item-id");
        if (postElement._gcDownloadInitialized) return;
        postElement._gcDownloadInitialized = true;

        // Find the three-dot menu button (the one with more_vert icon)
        const menuButton = postElement.querySelector(
            'button.pYTkkf-Bz112c-LgbsSe[aria-haspopup="menu"]'
        );
        if (!menuButton) {
            console.warn("[GC Download] Menu button not found for post");
            return;
        }

        const clickHandler = async function (e) {
            e.stopPropagation();
            e.preventDefault();

            const originalText =
                e.target.textContent || "Download all attachments";
            e.target.textContent = "Downloading...";

            try {
                const count = await downloadPostAttachments(postElement);
                if (count > 0) {
                    e.target.textContent = "Downloaded " + count + " file(s)";
                } else {
                    e.target.textContent = "No attachments found";
                }
                setTimeout(function () {
                    e.target.textContent = originalText;
                }, 3000);
            } catch (error) {
                console.error("[GC Download] Error:", error);
                e.target.textContent = "Error downloading";
                alert(
                    "Failed to download attachments: " +
                        (error.message || "Unknown error")
                );
                setTimeout(function () {
                    e.target.textContent = originalText;
                }, 3000);
            }
        };

        // Add click listener to the menu button to inject our option when clicked
        menuButton.addEventListener("click", function () {
            console.log("[GC Download] Menu button clicked for post:", postId);

            // Wait for the menu to appear in DOM
            setTimeout(function () {
                // Find the menu popup container and then the ul inside it
                const menuContainer = document.querySelector(
                    'div[id^="ucc"][class^="tB5Jxf-xl07Ob"]'
                );
                if (!menuContainer) {
                    console.log("[GC Download] Menu container not found");
                    return;
                }

                const menu = menuContainer.querySelector(
                    'ul[role="menu"].aqdrmf-rymPhb'
                );
                if (!menu) {
                    console.log(
                        "[GC Download] Menu ul not found inside container"
                    );
                    return;
                }

                if (menu.querySelector("." + BTN_CLASS)) {
                    console.log("[GC Download] Button already exists in menu");
                    return;
                }

                console.log(
                    "[GC Download] Menu found, inserting download option"
                );

                // Create menu item matching the exact structure of "Copy link"
                const menuItem = document.createElement("li");
                menuItem.className =
                    "aqdrmf-rymPhb-ibnC6b aqdrmf-rymPhb-ibnC6b-OWXEXe-hXIJHe aqdrmf-rymPhb-ibnC6b-OWXEXe-SfQLQb-Woal0c-RWgCYc O68mGe-OQAXze-OWXEXe-SfQLQb-Woal0c-RWgCYc O68mGe-xl07Ob-ibnC6b-OWXEXe-r08add O68mGe-xl07Ob-ibnC6b-OWXEXe-E6eRQd " +
                    BTN_CLASS;
                menuItem.setAttribute("role", "menuitem");
                menuItem.setAttribute("tabindex", "-1");
                menuItem.setAttribute("jsname", "SbVnGf");

                // Create the inner structure
                const span1 = document.createElement("span");
                span1.className = "UTNHae";

                const span2 = document.createElement("span");
                span2.className = "dNKuRb aqdrmf-rymPhb-sNKcce";

                const span3 = document.createElement("span");
                span3.className = "aqdrmf-rymPhb-KkROqb";

                const span4 = document.createElement("span");
                span4.className = "aqdrmf-rymPhb-Gtdoyb";

                const textSpan = document.createElement("span");
                textSpan.className = "aqdrmf-rymPhb-fpDzbe-fmcmS";
                textSpan.setAttribute("jsname", "K4r5Ff");
                textSpan.textContent = "Download all attachments";

                span4.appendChild(textSpan);

                const span5 = document.createElement("span");
                span5.setAttribute("jsname", "orbTae");
                span5.className = "aqdrmf-rymPhb-JMEf7e";

                const span6 = document.createElement("span");
                span6.className = "O68mGe-xl07Ob-mQXhdd";

                menuItem.appendChild(span1);
                menuItem.appendChild(span2);
                menuItem.appendChild(span3);
                menuItem.appendChild(span4);
                menuItem.appendChild(span5);
                menuItem.appendChild(span6);

                // Add click handler
                menuItem.onclick = clickHandler;

                // Find the first real menu item (skip the focus trap divs)
                const firstMenuItem = menu.querySelector('li[role="menuitem"]');
                if (firstMenuItem) {
                    menu.insertBefore(menuItem, firstMenuItem);
                    console.log(
                        "[GC Download] Button inserted before first menu item"
                    );
                } else {
                    // If no menu items exist, insert after the focus trap divs
                    const focusTraps = menu.querySelectorAll("div.pw1uU");
                    if (focusTraps.length >= 2) {
                        focusTraps[1].after(menuItem);
                        console.log(
                            "[GC Download] Button inserted after focus traps"
                        );
                    } else {
                        menu.appendChild(menuItem);
                        console.log("[GC Download] Button appended to menu");
                    }
                }

                console.log(
                    "[GC Download] Button inserted successfully, menu now has",
                    menu.querySelectorAll('li[role="menuitem"]').length,
                    "items"
                );
            }, 10);
        });
    }

    function scanAndAddButtons() {
        const posts = document.querySelectorAll(
            "div[data-include-stream-item-materials][data-stream-item-id]"
        );

        console.log("[GC Download] Found " + posts.length + " posts");

        posts.forEach(function (post) {
            insertButtonForPost(post);
        });
    }

    console.log("[GC Download] Script initializing...");
    injectStyles();

    const observer = new MutationObserver(function () {
        try {
            scanAndAddButtons();
        } catch (e) {
            console.error("[GC Download] Error in observer:", e);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(scanAndAddButtons, 1500);
    setTimeout(scanAndAddButtons, 3000);
    setTimeout(scanAndAddButtons, 5000);

    console.log("[GC Download] Initialized successfully!");
})();
