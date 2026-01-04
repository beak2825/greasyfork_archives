// ==UserScript==
// @name         Desmos Keypress Detection
// @namespace    theonedesmosmacrothingyeah
// @version      1.2.3
// @description  kojijji
// @author       elepsie
// @match        https://www.desmos.com/calculator*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551702/Desmos%20Keypress%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/551702/Desmos%20Keypress%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let interval = setInterval(() => {
        let element = document.querySelector("#graph-container");
        console.log("a")
        if (element) {
            console.log("orange")
            clearInterval(interval);
            callback(element);
        }
    }, 100);
    console.log("yeah")

    let load = false
    let thingywingy = 0
    let thefolder = ''

    function macroexpression(lower,upper,latex,folder) {
        if (folder && folder != '') {
            console.log("ta")
            let expressions = Calc.getExpressions()
            thefolder = expressions.find(expr => expr.type === "folder" && expr.title === folder)
        }
        for (let i = 0; i < upper-lower+1; i++) {
            let latextxt = latex.replaceAll("`a`", (i+lower).toString())
            console.log(i+lower)
            let exid = "input"+thingywingy.toString()
            let colora = ''
            if (folder && folder != '' && thefolder !== '') {
                let state = Calc.getState()
                state.expressions.list.push({id: exid, latex: latextxt, color: colora, type: "expression", folderId: thefolder.id})
                console.log(thefolder.id)
                console.log(thefolder.title)
                Calc.setState(state)
            } else {
                Calc.setExpression({id: exid, latex: latextxt, color: colora})
            }
            thingywingy++
        }
    }

    function getIndicesOf(searchStr, str, caseSensitive) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }

    let container = document.querySelector("#graph-container")

    let rrsaveBtn = document.createElement('button')
    rrsaveBtn.id = 'rrsaveBtn'
    rrsaveBtn.innerHTML = "coolio julio"
    rrsaveBtn.style.padding = '8px'
    rrsaveBtn.style.borderRadius = '5px'
    rrsaveBtn.style.backgroundColor = '#2e2e2e'
    rrsaveBtn.style.color = '#ffffff'
    rrsaveBtn.style.border = '2px solid #070614'
    rrsaveBtn.style.cursor = 'pointer'
    rrsaveBtn.style.fontSize = '15.4px'
    rrsaveBtn.style.fontFamily = 'Fira Sans, sans-serif'
    rrsaveBtn.style.position = 'absolute'
    rrsaveBtn.style.bottom = '10px'
    rrsaveBtn.style.right = '10px'

    let macroshow = document.createElement('div')
    macroshow.id = 'macrowindow'
    macroshow.style.backgroundColor = '#2e2e2e'
    macroshow.style.width = '250px'
    macroshow.style.height = '250px'
    macroshow.style.position = 'absolute'
    macroshow.style.bottom = '50px'
    macroshow.style.right = '10px'
    macroshow.style.border = '2px solid #070614'
    macroshow.style.borderRadius = '5px'
    macroshow.style.padding = '8px'

    let macrotype = document.createElement('input')
    macrotype.type = 'text'
    macrotype.style.width = '230px'

    let macronumlow = document.createElement('input')
    macronumlow.type = 'number'
    macronumlow.style.position = 'absolute'
    macronumlow.style.bottom = '40px'
    macronumlow.style.left = '10px'
    macronumlow.style.width = '100px'

    let macrofolder = document.createElement('input')
    macrofolder.type = 'text'
    macrofolder.style.position = 'absolute'
    macrofolder.style.bottom = '100px'
    macrofolder.style.left = '10px'
    macrofolder.style.width = '100px'

    let macronumhigh = document.createElement('input')
    macronumhigh.type = 'number'
    macronumhigh.style.position = 'absolute'
    macronumhigh.style.bottom = '40px'
    macronumhigh.style.left = '130px'
    macronumhigh.style.width = '100px'

    let startbtn = document.createElement('button')
    startbtn.id = 'rsaveBtn'
    startbtn.innerHTML = "Start"
    startbtn.style.padding = '8px'
    startbtn.style.borderRadius = '5px'
    startbtn.style.backgroundColor = '#2e2e2e'
    startbtn.style.height = '27px'
    startbtn.style.lineHeight = '4px'
    startbtn.style.color = '#ffffff'
    startbtn.style.border = '2px solid #070614'
    startbtn.style.cursor = 'pointer'
    startbtn.style.fontSize = '15.4px'
    startbtn.style.fontFamily = 'Fira Sans, sans-serif'
    startbtn.style.position = 'absolute'
    startbtn.style.bottom = '10px'
    startbtn.style.left = '10px'

    startbtn.addEventListener('click', function() {
        macroexpression(parseInt(macronumlow.value),parseInt(macronumhigh.value),macrotype.value,macrofolder.value)
    })
    if (load == true) {
    container.appendChild(rrsaveBtn)
    container.appendChild(macroshow)
    macroshow.appendChild(macrotype)
    macroshow.appendChild(startbtn)
    macroshow.appendChild(macronumlow)
    macroshow.appendChild(macronumhigh)
    macroshow.appendChild(macrofolder)
    }
    console.log("oof")
    setTimeout(function(){
    Calc.setExpression({id: "inputskibeidi", latex: "k_{installed} = 1"});
    },1200)
    let on = 0
    document.addEventListener('keydown', function(keyt) {
        console.log("yeahhhhh")
        let expressions = Calc.getExpressions()
        Calc.setExpression({id: "inputskibidi", latex: "k_{eypress} = " + keyt.which})
        on = keyt.which
    })
    document.addEventListener('keyup', function(keyt) {
        console.log("yeahhhhh")
        if (keyt.which == on) {
            let expressions = Calc.getExpressions()
            Calc.setExpression({id: "inputskibidi", latex: "k_{eypress} = 0"})
        }
    })
})();