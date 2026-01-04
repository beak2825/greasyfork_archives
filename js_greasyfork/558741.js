// ==UserScript==
// @name         Common Utilities
// @description  Some common utilities
// @namespace    https://github.com/dzist
// @version      0.0.1
// @author       Dylan Zhang
// @grant        GM_info
// ==/UserScript==

const utils = {
    log(...args) {
        console.log(
            `%c${GM_info.script.name}`,
            'padding: 0 4px; background: cyan; color: #000;',
            ...args
        )
    },
    ensureCondition(condition, maxAttempts = 600 /* 10s */, failureMessage) {
        const raf = window.requestAnimationFrame

        return new Promise((resolve, reject) => {
            let attempts = 0
            const detect = () => {
                const result = condition()
                if (result) {
                    resolve(result)
                } else if (attempts < maxAttempts) {
                    attempts++
                    raf(detect)
                } else {
                    reject(new Error(failureMessage))
                }
            }
            raf(detect)
        })
    },
    ensureElement(selector, maxAttempts = 600) {
        return utils.ensureCondition(
            () => document.querySelector(selector),
            maxAttempts,
            `Could not detect ${selector} after ${maxAttempts} attempts`
        )
    },
    getProperty(obj, ...props) {
        const stack = [obj]
        let current = obj

        for(let i = 0, len = props.length; i < len; i++) {
            const key = props[i]
            // check for undefined or null
            if (current == null) {
                return [, stack]
            }

            const isArraySearch = Array.isArray(current) && isNaN(Number(key))
            if (isArraySearch) {
                // if the `current` value is an array and the key is not a number,
                // find the first item with the key inside it.
                const foundItem = current.find(item => item && item[key])
                if (foundItem) {
                    stack.push(foundItem)
                    current = foundItem[key]
                } else {
                    return [, stack]
                }
            } else {
                current = current[key]
                if (i < len - 1 && current) {
                    stack.push(current)
                }
            }
        }

        return [current, stack]
    }
}