// ==UserScript==
// @name         DyPlayer Insite Loading
// @namespace    Beginner.2023.VideoPlayerInsideLoader
// @version      1.2.2.1
// @description  "Directly play anime videos on the same page with Next and Previous episode buttons for anime-seven.com"
// @author       Beginner(2023)
// @match        *://*.anime-seven.com/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anime-seven.com
// @grant        GM_addStyle
// @license       MIT

// @downloadURL https://update.greasyfork.org/scripts/562778/DyPlayer%20Insite%20Loading.user.js
// @updateURL https://update.greasyfork.org/scripts/562778/DyPlayer%20Insite%20Loading.meta.js
// ==/UserScript==

(function() {

    var b123 = document.querySelector("div.b123")
    var epCont = b123.querySelector("center > div");
    var epItems = Array.from(epCont.querySelectorAll("p")).filter(ep_el => ep_el.querySelector("a"))

    function templateBtn() {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.style.width = "100px";
        btn.style.height = "30px";
        btn.style.color = "#ffffff";
        btn.style.backgroundColor = "#e64a45";
        btn.style.borderRadius = "4px";
        btn.style.borderColor = "transparent";
        btn.style.cursor = "pointer"
        return btn;
    }

    function initial() {
        // Remove the <br> inside the b123
        if (b123.querySelectorAll("br")) {
            b123.querySelectorAll("br").forEach((el) => {
                el.remove();
            });
        };

        // Create a container for the video player if not already exist
        if (!document.querySelector("#player-video")) {
            let c = b123.parentElement
            let nel = document.createElement("div");
            nel.id = "player-video"
            c.insertBefore(nel, b123);
        }

        // overwrite the onclick to loading Vplayer in site
        b123.querySelectorAll("center > div > p").forEach((ep) => {
            ep.querySelectorAll("a").forEach((el) => {
                rewriteClick(el)
            });
        });
    }

    function manageSelectBackgroundColor(method, el) {
        if (!method) {
            console.error("`method` is not defined");
            return;
        }

        if (method === "add" && el) {
            el.style.backgroundColor = "#e64a45";
        } 
        else if (["remove", "rm"].includes(method) && el) {
            el.style.backgroundColor = "";
        } 
        else if (method === "clear") {
            if (epItems.length > 0) {
                epItems.forEach((ep) => {
                    ep.style.backgroundColor = ""
                });
            }
        }
    }

    function rewriteClick(element) {
        element.onclick = (e) => {
            console.group("[DyPlayer Insite Loading]")
            const targetLink = e.target.closest('a');
            if (!targetLink) return;

            e.preventDefault();
            e.stopPropagation();
            const url = targetLink.href;
            const displayArea = document.querySelector('#player-video');

            // create buttons using the template
            var prevBtn = templateBtn();
            var nextBtn = templateBtn();
            const endSymtol = "❌";
            const noMoreEpBtn = (button) => {
                if (button) {
                    button.textContent = endSymtol;
                    button.style.cursor = "no-drop";
                    button.style.opacity = "0.7";
                }
            }
            // set button text
            prevBtn.textContent = "⬅️";
            nextBtn.textContent = "➡️";

            // Manage the background of the ep
            const ep = element.closest("p");
            if (ep && ep.parentElement == epCont) {
                // Remove the background from all ep
                manageSelectBackgroundColor("clear");

                // Add the background to new select
                manageSelectBackgroundColor("add", ep);
            }

            function choosePlayer(ep_ele, num=0) {
                console.group("choosePlayer:");
                if (!ep_ele) {
                    console.error("'ep_ele' is missing or undefined.");
                    console.groupEnd();
                    return;
                };
                
                const playerItems = Array.from(ep_ele.querySelectorAll("a")).filter(el => el.hasAttribute("href"));
                console.log('playerItems: ', playerItems)
                if (playerItems.length > 0 && playerItems[num]) {
                    playerItems[num].click();
                    console.log(`The player ${num+1}(${num}) has been clicked.`)
                } else {
                    console.warn(`Index ${num} is out of bounds for the links found.`);
                }
                console.groupEnd();
            }

            function watchPreviousVideo(current_ep) {
                console.group("watchPreviousVideo:");
                console.log("Current EP of element: ", current_ep);
                if (current_ep) {
                    let currentEpInd = epItems.indexOf(current_ep)
                    let PreviousInd = currentEpInd-1

                    console.log(`Current EP/Index: ${currentEpInd+1}/${currentEpInd}`)
                    console.log(`Previous EP/Index: ${PreviousInd+1}/${PreviousInd}`)

                    if (epItems.length > 0 && epItems.at(PreviousInd)) {
                        let PreviousEp = epItems.at(PreviousInd)
                        choosePlayer(PreviousEp)
                    }
                }
                console.groupEnd();
            }

            function watchNextVideo(current_ep) {
                console.group("watchNextVideo:");
                console.log("Current EP of element: ", current_ep);
                if (current_ep) {
                    let currentEpInd = epItems.indexOf(current_ep)
                    let nextInd = currentEpInd+1

                    console.log(`Current EP/Index: ${currentEpInd+1}/${currentEpInd}`)
                    console.log(`Next EP/Index: ${nextInd+1}/${nextInd}`)

                    if (epItems.length > 0 && epItems.at(nextInd)) {                        
                        let nextEp = epItems.at(nextInd)
                        choosePlayer(nextEp)
                    }
                }
                console.groupEnd();
            }

            fetch(url)
                .then(response => response.text())
                .then(html => {
                // Regex searching text of var PLAYER_URL = " ... ";
                const regex = /var\s+PLAYER_URL\s*=\s*["']([^"']+)["']/;
                const match = html.match(regex);

                if (match && match[1]) {
                    const videoUrl = match[1];
                    console.log("Found Video URL:", videoUrl);

                    // inject ifram video player
                    displayArea.innerHTML = `
                        <div class="video">
                            <iframe
                                src="${videoUrl}"
                                style="width:100%; height:460px;"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowfullscreen="true"
                                frameborder="0">
                            </iframe>
                        </div>`

                    if (displayArea.querySelector("div.pre-next-ep")) {
                        let resl = displayArea.querySelector("div.pre-next-ep").remove();
                        if (resl) {
                            console.log(`*The navigation container element has been removed`)
                        } else {
                            console.log(`*The navigation container element could not be removed`)
                        }
                        console.log('The navigation container element has been removed')
                    }

                    // create nav container
                    const navContainer = document.createElement("div");
                    navContainer.className = "pre-next-ep";
                    navContainer.style.display = "flex";
                    navContainer.style.justifyContent = "space-between";
                    navContainer.style.paddingTop = "4px";
                    navContainer.style.marginBottom = "14px";

                    // previous button logic
                    let curEpInd = epItems.indexOf(ep)
                    if (epItems.at(curEpInd-1) && curEpInd-1 != -1) {
                        prevBtn.onclick = ()=>{
                            console.log({
                                "Current": ep,
                                "Previous Index": curEpInd-1
                            });
                            watchPreviousVideo(ep);
                        };
                    } else {
                        noMoreEpBtn(prevBtn)
                    };

                    // next button logic
                    if (epItems.at(curEpInd+1)) {
                        nextBtn.onclick = () => {
                            console.log({
                                "Current": ep,
                                "Next Index": curEpInd+1
                            })
                            watchNextVideo(ep);
                        };
                    } else {
                        noMoreEpBtn(nextBtn)
                    };

                    // injeck the button container
                    navContainer.append(prevBtn, nextBtn);
                    displayArea.appendChild(navContainer);
                } else {
                    displayArea.innerHTML = "<p style='color:red;'>หาตัวเล่นวิดีโอไม่เจอ</p>";
                }
            })
                .catch(err => console.error('Fetch error:', err));
            console.groupEnd();
        };
    };

    window.addEventListener("load", (event) => {
        initial()
    });

})();