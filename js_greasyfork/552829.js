// ==UserScript==
// @name         1click trade bank - Life Down Ding
// @namespace    http://tampermonkey.net/
// @version      2025-03-09
// @description  Adds a 1-click "Bank" button to Torn.com trades to instantly deposit all your on-hand cash. Also plays a soft ding sound when your life bar decreases, alerting you if attacked mid-trade.
// @author       mitza
// @match        https://www.torn.com/trade.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552829/1click%20trade%20bank%20-%20Life%20Down%20Ding.user.js
// @updateURL https://update.greasyfork.org/scripts/552829/1click%20trade%20bank%20-%20Life%20Down%20Ding.meta.js
// ==/UserScript==

GM_addStyle(`
.quick-btn-restyled {
    color: #ffffff; /* White text */
    height: 100%; /* Same height */
    box-sizing: border-box; /* Same box-sizing */
    border-radius: 0px; /* Not rounded */
    line-height: 16px; /* Same line-height */
    padding: 4px 8px; /* Same padding */
    text-decoration: none; /* Same text-decoration */
    text-transform: uppercase; /* Same text-transform */
    background-color: #000000; /* Black background */
    min-width: 30px; /* Same min-width */
    position: relative; /* Same position */
    margin: auto; /* Same margin */
    border: none; /* Remove borders for clean look */
    text-shadow: none; /* Remove text shadow - optional, but looks cleaner on solid background */
}
.quick-btn-restyled:hover {
    background-color: #333; /* Slightly lighter black on hover */
    cursor: pointer; /* Indicate it's clickable */
}
`);


async function waitForElement(querySelector, timeout) {
    return await new Promise((resolve, reject) => {
        let timer = null;
        if (timeout) {
            timer = setTimeout(() => {
                observer.disconnect();
                reject();
            }, timeout);
        }
        if (document.querySelectorAll(querySelector).length) {
            return resolve();
        }
        const observer = new MutationObserver(() => {
            if (document.querySelectorAll(querySelector).length) {
                observer.disconnect();
                if (timer !== null) {
                    clearTimeout(timer);
                }
                return resolve();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}



let audioContext = null;
function playDing() {
    // Create audio context on first use
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create oscillator for ding sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configure sound
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime); // G5 note
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    // 2-second envelope with fade-out
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start and stop oscillator
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
}


async function lifeWatcher() {
    await waitForElement(`[class="bar___Bv5Ho life___PlnzK bar-desktop___p5Cas"]`, 5000);
    let elem = document.querySelector(`[class="bar___Bv5Ho life___PlnzK bar-desktop___p5Cas"]`).children[1].children[1];

    console.log("Watching:", elem);

    let previousWidth = parseFloat(elem.style.width) || 0; // Store initial width

    const callback = (mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
                let newWidth = parseFloat(elem.style.width) || 0;

                console.log(`Previous width: ${previousWidth}%`);
                console.log(`New width: ${newWidth}%`);

                if (newWidth < previousWidth) {
                    playDing(); // Trigger only when width decreases
                }

                previousWidth = newWidth; // Update stored width
            }
        }
    };

    const config = { attributes: true, attributeFilter: ["style"] };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for style changes
    observer.observe(elem, config);
}

(async function() {

    console.log(window.location.href.indexOf(`step=view`));
    if(window.location.href.indexOf(`step=view`) === -1)
        return;

    await waitForElement('[class*="point-block"]', 10000)

    lifeWatcher();

    let container = document.querySelector('[class*="point-block"]');
    if(!container) container = document.querySelector(`[class="points-mobile___gpalH"]`).children[0];
    let bankAllButton = document.createElement("button");
    bankAllButton.className = "quick-btn-restyled";
    bankAllButton.innerHTML = "<strong>&emsp;Bank&emsp;</strong>";
    bankAllButton.style = "top: 3px";
    bankAllButton.style = "display:block";
    bankAllButton.id="customTradeBtn";

    container.before(bankAllButton);

    bankAllButton.addEventListener("click", () => {

            const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const tradeId = hashParams.get('ID');
        if(tradeId == null) {
            bankAllButton.style.display = "none";
            return;
        }

        let dollars = parseInt(document.querySelector("#user-money").getAttribute('data-money'));
        if(dollars === 0) return;

        let leftUser = document.querySelector(`[class="user left"]`);
        if(leftUser == null) { // user has torntools which modifies the page.
            leftUser = document.querySelector(`[class="user left tt-modified"]`);
        }
        let tradeElem = leftUser.querySelector(`[class="name left"]`);
        console.log(tradeElem);

        let moneyInTrade;
        if(tradeElem == null) moneyInTrade = 0;
        else moneyInTrade = parseInt(tradeElem.innerText.split(" ")[0].split("$")[1].replaceAll(",", ""));
        console.log(dollars, moneyInTrade);

        window.location.href = `https://www.torn.com/trade.php#step=view&sub_step=addmoney2&ID=${tradeId}&amount=${dollars + moneyInTrade}`

            });




})();