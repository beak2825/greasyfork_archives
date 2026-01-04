// ==UserScript==
// @name        Bulk Select Image Category
// @namespace   https://github.com/Tetrax-10
// @description Adds a master dropdown to select image category for all images while uploading.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=moviestillsdb.com
// @license     MIT
// @version     1.0
// @match       *://*.moviestillsdb.com/add*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/556255/Bulk%20Select%20Image%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/556255/Bulk%20Select%20Image%20Category.meta.js
// ==/UserScript==

;(() => {
    async function waitForElement(selector, timeout = null, nthElement = 1) {
        // wait till document body loads
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 10))
        }

        nthElement -= 1

        return new Promise((resolve) => {
            if (document.querySelectorAll(selector)?.[nthElement]) {
                return resolve(document.querySelectorAll(selector)?.[nthElement])
            }

            const observer = new MutationObserver(async () => {
                if (document.querySelectorAll(selector)?.[nthElement]) {
                    resolve(document.querySelectorAll(selector)?.[nthElement])
                    observer.disconnect()
                } else {
                    if (timeout) {
                        async function timeOver() {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    observer.disconnect()
                                    resolve(false)
                                }, timeout)
                            })
                        }
                        resolve(await timeOver())
                    }
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        })
    }

    const dropDownSelector = "#file-container select.form-select.category"
    waitForElement(dropDownSelector).then((select) => {
        const uploadRow = document.querySelector(".file-upload")
        if (!uploadRow) return

        const imageCategoryRow = uploadRow.cloneNode(true)
        imageCategoryRow.className = "file-category"
        imageCategoryRow.querySelector("th").innerText = "Category"

        const masterDropDown = select.cloneNode(true)

        const uploadInput = imageCategoryRow.querySelector("input#file_upload")
        uploadInput.insertAdjacentElement("afterend", masterDropDown)
        uploadInput.remove()

        uploadRow.insertAdjacentElement("afterend", imageCategoryRow)

        masterDropDown.addEventListener("change", (e) => {
            document.querySelectorAll(dropDownSelector).forEach((_select) => {
                _select.value = e.target.value
                _select.dispatchEvent(new Event("change", { bubbles: true }))
            })
        })
    })
})()
