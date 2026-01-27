// ==UserScript==
// @name        multi insert nodes
// @namespace   Violentmonkey Scripts
// @match       https://www.cs.usfca.edu/~galles/visualization/RedBlack.html
// @grant       window
// @version     1.0
// @author      s4n7r0
// @description 5/31/2025, 8:50:16 AM
// @license     MIT
// @grant GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/564191/multi%20insert%20nodes.user.js
// @updateURL https://update.greasyfork.org/scripts/564191/multi%20insert%20nodes.meta.js
// ==/UserScript==

function insert_multiple() {
    values = currentAlg.insertField.value.split(",").filter((x) => x.length).map((x) => x.trim())
    currentAlg.animationManager.addListener("AnimationEnded", currentAlg, insert_single)
    currentAlg.insertField.value = values.shift()
    AlgorithmSpecificControls.children[1].children[0].click()
    return;
}

function insert_single(e) {

    currentAlg.insertField.value = values.shift()
    AlgorithmSpecificControls.children[1].children[0].click()
    if (values.length <= 0) {
        currentAlg.animationManager.removeListener("AnimationEnded", currentAlg, insert_single)
        //console.log("i have quit!")
    }
    return currentAlg.enableUi(e)
}

var values = []
let element1 = GM_addElement(AlgorithmSpecificControls.children[1], "input", {id: "insert-multiple", type: "button", value: "Multi Insert"});

element1.onclick = () => insert_multiple()


