// ==UserScript==
// @name        T3.chat - Markdown code un-indenter
// @namespace   Violentmonkey Scripts
// @match       https://beta.t3.chat/*
// @match       https://t3.chat/*
// @grant       none
// @version     1.0
// @author      koza.dev
// @description Automatically un-indents code blocks in the message input.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560941/T3chat%20-%20Markdown%20code%20un-indenter.user.js
// @updateURL https://update.greasyfork.org/scripts/560941/T3chat%20-%20Markdown%20code%20un-indenter.meta.js
// ==/UserScript==

(function() {
    let debounceTimer

    const unindent = (text) => {
        return text.replace(/```([\s\S]*?)```/g, (match, code) => {
            const lines = code.split('\n')

            // Filter out empty lines to find the actual minimum indentation
            const contentLines = lines.filter((line) => line.trim().length > 0)
            if (contentLines.length === 0) return match

            const minIndent = Math.min(
                ...contentLines.map((line) => line.match(/^\s*/)[0].length)
            )

            const processedCode = lines
                .map((line) => (line.length >= minIndent ? line.slice(minIndent) : line.trimStart()))
                .join('\n')

            return '```' + processedCode + '```'
        })
    }

    const processInput = (target) => {
        const originalValue = target.value
        const newValue = unindent(originalValue)

        if (originalValue !== newValue) {
            const start = target.selectionStart
            const end = target.selectionEnd

            target.value = newValue

            // Restore cursor position
            target.selectionStart = start
            target.selectionEnd = end

            // Trigger Svelte 5 reactivity
            target.dispatchEvent(
                new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText'
                })
            )
            target.dispatchEvent(new Event('change', { bubbles: true }))
        }
    }

    window.addEventListener('input', (e) => {
        if (e.target.id !== 'chat-input') return

        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            processInput(e.target)
        }, 500)
    })
})()