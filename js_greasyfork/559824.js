// ==UserScript==
// @name         remove Top repositories
// @version      1.0.0
// @namespace    https://github.com/girl-dream
// @description  去除Top repositories中不属于自己的仓库
// @author       girl-dream
// @license      The Unlicense
// @match        https://github.com/
// @icon         https://github.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559824/remove%20Top%20repositories.user.js
// @updateURL https://update.greasyfork.org/scripts/559824/remove%20Top%20repositories.meta.js
// ==/UserScript==


(function () {
    'use strict'
    let RepositoriesDom = document.querySelector('.dashboard-sidebar')
    let userName = RepositoriesDom.querySelector('.Button-label').lastChild.textContent
    if (!userName) return

    function run(ul) {
        for (let i = ul.length - 1; i >= 0; i--) {
            if (!ul[i].getElementsByTagName("a")[1].textContent.includes(userName)) {
                ul[i].remove()
            }
        }
    }
    let timer = setInterval(() => {
        let ul = RepositoriesDom.querySelector('.list-style-none').children
        if (ul.length > 0) {
            clearInterval(timer)
            run(ul)

            let temp = ul.length
            let a = RepositoriesDom.querySelector('.js-repos-container').getElementsByTagName("button")[0]
            a.addEventListener("click", () => {
                let timer = setInterval(() => {
                    let ul = RepositoriesDom.querySelector('.list-style-none').children
                    if (ul.length > temp) {
                        clearInterval(timer)
                        run(ul)
                    }
                })
            })
        }
    }, 500)
})();
