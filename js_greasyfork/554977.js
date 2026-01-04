// ==UserScript==
// @name         Discourse Callout 建议 (Callout Suggestions)
// @namespace    https://github.com/stevessr/bug-v3
// @version      1.2.1
// @description  为 Discourse 论坛添加 Markdown Callout 自动建议功能 (Add Markdown callout autocomplete to Discourse forums)
// @author       stevessr
// @match        https://linux.do/*
// @match        https://meta.discourse.org/*
// @match        https://*.discourse.org/*
// @match        http://localhost:5173/*
// @exclude      https://linux.do/a/*
// @match        https://idcflare.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/stevessr/bug-v3
// @supportURL   https://github.com/stevessr/bug-v3/issues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554977/Discourse%20Callout%20%E5%BB%BA%E8%AE%AE%20%28Callout%20Suggestions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554977/Discourse%20Callout%20%E5%BB%BA%E8%AE%AE%20%28Callout%20Suggestions%29.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // ===== Settings Management =====
  const SETTINGS_KEY = 'emoji_extension_userscript_settings'

  function loadSettings() {
    try {
      const settingsData = localStorage.getItem(SETTINGS_KEY)
      if (settingsData) {
        const settings = JSON.parse(settingsData)
        return settings
      }
    } catch (e) {
      console.warn('[Callout Suggestions] Failed to load settings:', e)
    }
    return {}
  }

  // Check forceMobileMode setting - if enabled, script respects it
  function shouldRespectForceMobileMode() {
    const settings = loadSettings()
    return settings.forceMobileMode === true
  }

  // ===== Callout Keywords =====
  const da = document.addEventListener
  const calloutKeywords = [
    'note',
    'abstract',
    'summary',
    'tldr',
    'info',
    'todo',
    'tip',
    'hint',
    'success',
    'check',
    'done',
    'question',
    'help',
    'faq',
    'warning',
    'caution',
    'attention',
    'failure',
    'fail',
    'missing',
    'danger',
    'error',
    'bug',
    'example',
    'quote',
    'cite'
  ].sort()

  // ===== Icon Definitions =====
  const ICONS = {
    info: {
      icon: 'ℹ️',
      color: 'rgba(2, 122, 255, 0.1)',
      svg: '<svg class="fa d-icon d-icon-far-lightbulb svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-lightbulb"></use></svg>'
    },
    tip: {
      icon: '💡',
      color: 'rgba(0, 191, 188, 0.1)',
      svg: '<svg class="fa d-icon d-icon-fire-flame-curved svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#fire-flame-curved"></use></svg>'
    },
    faq: {
      icon: '❓',
      color: 'rgba(236, 117, 0, 0.1)',
      svg: '<svg class="fa d-icon d-icon-far-circle-question svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-circle-question"></use></svg>'
    },
    question: {
      icon: '🤔',
      color: 'rgba(236, 117, 0, 0.1)',
      svg: '<svg class="fa d-icon d-icon-far-circle-question svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-circle-question"></use></svg>'
    },
    note: {
      icon: '📝',
      color: 'rgba(8, 109, 221, 0.1)',
      svg: '<svg class="fa d-icon d-icon-far-pen-to-square svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-pen-to-square"></use></svg>'
    },
    abstract: {
      icon: '📋',
      color: 'rgba(0, 191, 188, 0.1)',
      svg: '<svg class="fa d-icon d-icon-far-clipboard svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-clipboard"></use></svg>'
    },
    todo: {
      icon: '☑️',
      color: 'rgba(2, 122, 255, 0.1)',
      svg: '<svg class="fa d-icon d-icon-far-circle-check svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-circle-check"></use></svg>'
    },
    success: {
      icon: '🎉',
      color: 'rgba(68, 207, 110, 0.1)',
      svg: '<svg class="fa d-icon d-icon-check svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#check"></use></svg>'
    },
    warning: {
      icon: '⚠️',
      color: 'rgba(236, 117, 0, 0.1)',
      svg: '<svg class="fa d-icon d-icon-triangle-exclamation svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#triangle-exclamation"></use></svg>'
    },
    failure: {
      icon: '❌',
      color: 'rgba(233, 49, 71, 0.1)',
      svg: '<svg class="fa d-icon d-icon-xmark svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>'
    },
    danger: {
      icon: '☠️',
      color: 'rgba(233, 49, 71, 0.1)',
      svg: '<svg class="fa d-icon d-icon-bolt svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#bolt"></use></svg>'
    },
    bug: {
      icon: '🐛',
      color: 'rgba(233, 49, 71, 0.1)',
      svg: '<svg class="fa d-icon d-icon-bug svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#bug"></use></svg>'
    },
    example: {
      icon: '🔎',
      color: 'rgba(120, 82, 238, 0.1)',
      svg: '<svg class="fa d-icon d-icon-list svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#list"></use></svg>'
    },
    quote: {
      icon: '💬',
      color: 'rgba(158, 158, 158, 0.1)',
      svg: '<svg class="fa d-icon d-icon-quote-left svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#quote-left"></use></svg>'
    }
  }

  const ALIASES = {
    summary: 'abstract',
    tldr: 'abstract',
    hint: 'tip',
    check: 'success',
    done: 'success',
    help: 'faq',
    caution: 'warning',
    attention: 'warning',
    fail: 'failure',
    missing: 'failure',
    error: 'danger',
    cite: 'quote'
  }

  const DEFAULT_ICON = {
    icon: '📝',
    color: 'var(--secondary-low)',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7 362.3 51.72 392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34 437.7 172.3 270.3 339.6C264.2 345.8 256.7 350.4 248.4 352.1L159.6 372.9C152.1 374.7 144.3 373.1 138.6 367.4C132.9 361.7 131.3 353.9 133.1 346.4L153.9 257.6C155.6 249.3 160.2 241.8 166.4 235.7L172.4 241.7zM96 64C42.98 64 0 106.1 0 160V416C0 469 42.98 512 96 512H352C405 512 448 469 448 416V320H400V416C400 442.5 378.5 464 352 464H96C69.54 464 48 442.5 48 416V160C48 133.5 69.54 112 96 112H192V64H96z"/></svg>'
  }

  function getIcon(key) {
    const alias = ALIASES[key]
    const iconKey = alias || key
    return ICONS[iconKey] || DEFAULT_ICON
  }

  // ===== Suggestion Box =====
  let suggestionBox = null
  let activeSuggestionIndex = 0

  function createSuggestionBox() {
    if (suggestionBox) return
    suggestionBox = document.createElement('div')
    suggestionBox.id = 'callout-suggestion-box'
    document.body.appendChild(suggestionBox)
    injectStyles()
  }

  function injectStyles() {
    const id = 'callout-suggestion-styles'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
  #callout-suggestion-box {
    position: absolute;
    background-color: var(--secondary);
    border: 1px solid #444;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 999999;
    padding: 5px;
    display: none;
    font-size: 14px;
    max-height: 200px;
    overflow-y: auto;
  }
  .callout-suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    color: var(--primary-high);
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  .callout-suggestion-item:hover, .callout-suggestion-item.active {
    background-color: var(--primary-low) !important;
  }
  `
    document.documentElement.appendChild(style)
  }

  function hideSuggestionBox() {
    if (suggestionBox) suggestionBox.style.display = 'none'
  }

  function updateActiveSuggestion() {
    if (!suggestionBox) return
    const items = suggestionBox.querySelectorAll('.callout-suggestion-item')
    items.forEach((it, idx) => {
      it.classList.toggle('active', idx === activeSuggestionIndex)
      if (idx === activeSuggestionIndex) it.scrollIntoView({ block: 'nearest' })
    })
  }

  function applyCompletion(element, selectedKeyword) {
    if (element instanceof HTMLTextAreaElement) {
      // Handle textarea
      const text = element.value
      const selectionStart = element.selectionStart || 0
      const textBeforeCursor = text.substring(0, selectionStart)
      let triggerIndex = textBeforeCursor.lastIndexOf('[')
      if (triggerIndex === -1) triggerIndex = textBeforeCursor.lastIndexOf('［')
      if (triggerIndex === -1) triggerIndex = textBeforeCursor.lastIndexOf('【')
      if (triggerIndex === -1) return
      const newText = `[!${selectedKeyword}]`
      const textAfter = text.substring(selectionStart)
      element.value = textBeforeCursor.substring(0, triggerIndex) + newText + textAfter
      const newCursorPos = triggerIndex + newText.length
      element.selectionStart = element.selectionEnd = newCursorPos
      element.dispatchEvent(new Event('input', { bubbles: true }))
    } else if (element.classList && element.classList.contains('ProseMirror')) {
      // Handle ProseMirror
      const newText = `[!${selectedKeyword}]`
      try {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return

        const range = selection.getRangeAt(0)
        const textBeforeCursor =
          range.startContainer.textContent && range.startContainer.textContent.substring(0, range.startOffset) || ''

        let triggerIndex = textBeforeCursor.lastIndexOf('[')
        if (triggerIndex === -1) triggerIndex = textBeforeCursor.lastIndexOf('［')
        if (triggerIndex === -1) triggerIndex = textBeforeCursor.lastIndexOf('【')

        if (triggerIndex === -1) return

        const deleteRange = document.createRange()
        deleteRange.setStart(range.startContainer, triggerIndex)
        deleteRange.setEnd(range.startContainer, range.startOffset)
        deleteRange.deleteContents()

        const textNode = document.createTextNode(newText)
        deleteRange.insertNode(textNode)

        const newRange = document.createRange()
        newRange.setStartAfter(textNode)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)

        element.dispatchEvent(new Event('input', { bubbles: true }))
      } catch (e) {
        console.error('[Callout Suggestions] ProseMirror completion failed', e)
      }
    }
  }

  function getCursorXY(element, position) {
    if (element instanceof HTMLTextAreaElement) {
      const mirrorId = 'callout-textarea-mirror-div'
      let mirror = document.getElementById(mirrorId)
      const rect = element.getBoundingClientRect()
      if (!mirror) {
        mirror = document.createElement('div')
        mirror.id = mirrorId
        document.body.appendChild(mirror)
      }

      const style = window.getComputedStyle(element)
      const props = [
        'boxSizing',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'lineHeight',
        'textTransform',
        'textAlign',
        'direction',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth'
      ]
      const ms = mirror.style
      props.forEach(p => {
        ms[p] = style.getPropertyValue(p)
      })
      ms.position = 'absolute'
      ms.left = `${rect.left + window.scrollX}px`
      ms.top = `${rect.top + window.scrollY}px`
      ms.width = `${rect.width}px`
      ms.height = `${rect.height}px`
      ms.overflow = 'hidden'
      ms.visibility = 'hidden'
      ms.whiteSpace = 'pre-wrap'
      ms.wordWrap = 'break-word'
      ms.boxSizing = style.getPropertyValue('box-sizing') || 'border-box'

      const cursorPosition = position !== undefined ? position : element.selectionEnd
      const textUpToCursor = element.value.substring(0, cursorPosition)
      mirror.textContent = textUpToCursor
      const span = document.createElement('span')
      span.textContent = '\u200b'
      mirror.appendChild(span)

      const spanRect = span.getBoundingClientRect()
      const offsetX = span.offsetLeft - element.scrollLeft
      const offsetY = span.offsetTop - element.scrollTop

      return {
        x: spanRect.left + window.scrollX,
        y: spanRect.top + window.scrollY,
        bottom: spanRect.bottom + window.scrollY,
        offsetX,
        offsetY
      }
    } else {
      // Handle ProseMirror
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        const rect = element.getBoundingClientRect()
        return {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          offsetX: 0,
          offsetY: 0
        }
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        offsetX: 0,
        offsetY: 0
      }
    }
  }

  function updateSuggestionBox(element, matches, triggerIndex) {
    if (!suggestionBox || matches.length === 0) {
      hideSuggestionBox()
      return
    }
    suggestionBox.innerHTML = matches
      .map((keyword, index) => {
        const iconData = getIcon(keyword)
        const backgroundColor = iconData.color || 'transparent'
        const iconColor = iconData.color
          ? iconData.color.replace('rgba', 'rgb').replace(/, [0-9.]+\)/, ')')
          : 'var(--primary-medium)'
        const coloredSvg = (iconData.svg || DEFAULT_ICON.svg).replace(
          '<svg',
          `<svg style="color: ${iconColor};"`
        )
        return `<div class="callout-suggestion-item" data-index="${index}" data-key="${keyword}" style="background-color:${backgroundColor}">${coloredSvg}<span style="margin-left:8px">${keyword}</span></div>`
      })
      .join('')

    suggestionBox.querySelectorAll('.callout-suggestion-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault()
        const idx = item.dataset.key
        if (!idx) return
        applyCompletion(element, idx)
        hideSuggestionBox()
      })
    })

    const cursorPos = getCursorXY(element, triggerIndex)
    const margin = 6
    const prevVisibility = suggestionBox.style.visibility
    suggestionBox.style.display = 'block'
    suggestionBox.style.visibility = 'hidden'
    const boxRect = suggestionBox.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - (cursorPos.bottom - window.scrollY)

    const left = cursorPos.x
    let top = cursorPos.y + margin
    if (spaceBelow < boxRect.height + margin) {
      top = cursorPos.y - boxRect.height - margin
    }

    const cursorViewportX = cursorPos.x - window.scrollX
    const viewportWidth = window.innerWidth
    const spaceRight = viewportWidth - cursorViewportX
    const spaceLeft = cursorViewportX
    let finalLeft = left
    if (spaceRight < boxRect.width + margin && spaceLeft >= boxRect.width + margin) {
      finalLeft = cursorPos.x - boxRect.width
    }

    const minLeft = window.scrollX + 0
    const maxLeft = window.scrollX + viewportWidth - boxRect.width - margin
    if (finalLeft < minLeft) finalLeft = minLeft
    if (finalLeft > maxLeft) finalLeft = maxLeft

    suggestionBox.style.left = `${finalLeft}px`
    suggestionBox.style.top = `${top}px`
    suggestionBox.style.visibility = prevVisibility || ''
    suggestionBox.style.display = 'block'
    activeSuggestionIndex = 0
    updateActiveSuggestion()
  }

  function handleInput(event) {
    const target = event.target
    if (!target) return

    if (target instanceof HTMLTextAreaElement) {
      const textarea = target
      const text = textarea.value
      const selectionStart = textarea.selectionStart || 0
      const textBeforeCursor = text.substring(0, selectionStart)
      const match = textBeforeCursor.match(/(?:\[|［|【])(?:!|！)?([a-z]*)$/i)
      if (match) {
        const keyword = match[1].toLowerCase()
        const filtered = calloutKeywords.filter(k => k.startsWith(keyword))
        const triggerIndex = selectionStart - match[0].length
        if (filtered.length > 0) updateSuggestionBox(textarea, filtered, triggerIndex)
        else hideSuggestionBox()
      } else {
        hideSuggestionBox()
      }
    } else if (target.classList && target.classList.contains('ProseMirror')) {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        hideSuggestionBox()
        return
      }

      const range = selection.getRangeAt(0)
      const textBeforeCursor =
        range.startContainer.textContent && range.startContainer.textContent.substring(0, range.startOffset) || ''
      const match = textBeforeCursor.match(/(?:\[|［|【])(?:!|！)?([a-z]*)$/i)
      if (match) {
        const keyword = match[1].toLowerCase()
        const filtered = calloutKeywords.filter(k => k.startsWith(keyword))
        const triggerIndex = range.startOffset - match[0].length
        if (filtered.length > 0) updateSuggestionBox(target, filtered, triggerIndex)
        else hideSuggestionBox()
      } else {
        hideSuggestionBox()
      }
    }
  }

  function handleKeydown(event) {
    if (!suggestionBox || suggestionBox.style.display === 'none') return
    const items = suggestionBox.querySelectorAll('.callout-suggestion-item')
    if (items.length === 0) return
    if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter', 'Escape'].includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
    }
    switch (event.key) {
      case 'ArrowDown':
        activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length
        updateActiveSuggestion()
        break
      case 'ArrowUp':
        activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length
        updateActiveSuggestion()
        break
      case 'Tab':
      case 'Enter': {
        const selectedKey = items[activeSuggestionIndex] && items[activeSuggestionIndex].dataset.key
        if (selectedKey) {
          const focused = document.activeElement
          if (focused) {
            if (focused instanceof HTMLTextAreaElement) {
              applyCompletion(focused, selectedKey)
            } else if (focused.classList && focused.classList.contains('ProseMirror')) {
              applyCompletion(focused, selectedKey)
            }
          }
        }
        hideSuggestionBox()
        break
      }
      case 'Escape':
        hideSuggestionBox()
        break
    }
  }

  function initCalloutSuggestions() {
    try {
      createSuggestionBox()
      da('input', handleInput, true)
      da('keydown', handleKeydown, true)
      da('click', e => {
        if (
          e.target && e.target.tagName !== 'TEXTAREA' &&
          !suggestionBox.contains(e.target)
        ) {
          hideSuggestionBox()
        }
      })
      console.log('[Callout Suggestions] Initialized successfully')
    } catch (e) {
      console.error('[Callout Suggestions] Initialization failed', e)
    }
  }

  // ===== Quick Insert Button =====
  // Quick insert callout types (subset of calloutKeywords for quick access)
  const QUICK_INSERTS = [
    'info',
    'tip',
    'faq',
    'question',
    'note',
    'abstract',
    'todo',
    'success',
    'warning',
    'failure',
    'danger',
    'bug',
    'example',
    'quote'
  ]

  function insertIntoEditor(text) {
    // Try several selectors as fallback targets to support different editor types
    const selectors = [
      'textarea.d-editor-input',
      'textarea.ember-text-area',
      '#channel-composer',
      '.chat-composer__input',
      'textarea.chat-composer__input'
    ]

    const proseMirror = document.querySelector('.ProseMirror.d-editor-input')
    let textarea = null
    for (const s of selectors) {
      const el = document.querySelector(s)
      if (el) {
        textarea = el
        break
      }
    }

    const contentEditable = document.querySelector('[contenteditable="true"]')

    if (textarea) {
      const selectionStart = textarea.selectionStart || 0
      const selectionEnd = textarea.selectionEnd || 0
      textarea.value =
        textarea.value.substring(0, selectionStart) +
        text +
        textarea.value.substring(selectionEnd, textarea.value.length)
      textarea.selectionStart = textarea.selectionEnd = selectionStart + text.length
      textarea.focus()
      const inputEvent = new Event('input', { bubbles: true, cancelable: true })
      textarea.dispatchEvent(inputEvent)
    } else if (proseMirror) {
      try {
        const dataTransfer = new DataTransfer()
        dataTransfer.setData('text/plain', text)
        const pasteEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer, bubbles: true })
        proseMirror.dispatchEvent(pasteEvent)
      } catch (error) {
        try {
          document.execCommand('insertText', false, text)
        } catch (fallbackError) {
          console.error('[Callout Suggestions] Failed to insert text into ProseMirror', fallbackError)
        }
      }
    } else if (contentEditable) {
      try {
        const textNode = document.createTextNode(text)
        const sel = window.getSelection()
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0)
          range.deleteContents()
          range.insertNode(textNode)
          range.setStartAfter(textNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        } else {
          contentEditable.appendChild(textNode)
        }
        const inputEvent = new Event('input', { bubbles: true, cancelable: true })
        contentEditable.dispatchEvent(inputEvent)
      } catch (e) {
        console.error('[Callout Suggestions] Failed to insert into contenteditable', e)
      }
    }
  }

  function createQuickInsertMenu() {
    const menu = document.createElement('div')
    menu.className = 'fk-d-menu toolbar-menu__options-content toolbar-popup-menu-options -animated -expanded'
    menu.id = 'quick-insert-menu'
    const inner = document.createElement('div')
    inner.className = 'fk-d-menu__inner-content'
    const list = document.createElement('ul')
    list.className = 'dropdown-menu'

    QUICK_INSERTS.forEach(key => {
      const li = document.createElement('li')
      li.className = 'dropdown-menu__item'
      const btn = document.createElement('button')
      btn.className = 'btn btn-icon-text'
      btn.type = 'button'
      btn.title = key.charAt(0).toUpperCase() + key.slice(1)
      const iconData = getIcon(key)
      btn.style.background = iconData.color || 'auto'

      btn.addEventListener('click', () => {
        if (menu.parentElement) menu.parentElement.removeChild(menu)
        insertIntoEditor(`>[!${key}]+\n`)
      })

      const emojiSpan = document.createElement('span')
      emojiSpan.className = 'd-button-emoji'
      emojiSpan.textContent = iconData.icon || '✳️'
      emojiSpan.style.marginRight = '6px'

      const labelWrap = document.createElement('span')
      labelWrap.className = 'd-button-label'
      const labelText = document.createElement('span')
      labelText.className = 'd-button-label__text'
      labelText.textContent = key.charAt(0).toUpperCase() + key.slice(1)

      labelWrap.appendChild(labelText)
      if (iconData.svg) {
        const svgSpan = document.createElement('span')
        svgSpan.className = 'd-button-label__svg'
        svgSpan.innerHTML = iconData.svg
        svgSpan.style.marginLeft = '6px'
        svgSpan.style.display = 'inline-flex'
        svgSpan.style.alignItems = 'center'
        labelWrap.appendChild(svgSpan)
      }
      btn.appendChild(emojiSpan)
      btn.appendChild(labelWrap)
      li.appendChild(btn)
      list.appendChild(li)
    })

    inner.appendChild(list)
    menu.appendChild(inner)
    return menu
  }

  function calculateMenuLeftPosition(rect, windowWidth) {
    // Calculate horizontal position: center menu under button, but keep within viewport bounds
    // Note: We use MENU_MAX_WIDTH / 2 to properly center the menu
    const centerX = rect.left + rect.width / 2 - MENU_MAX_WIDTH / 2
    const maxLeft = windowWidth - MENU_MAX_WIDTH
    return Math.max(MENU_MIN_MARGIN, Math.min(centerX, maxLeft))
  }

  function injectQuickInsertButton(toolbar) {
    if (toolbar.querySelector('.quick-insert-button')) {
      return // Already injected
    }

    const isChatComposer = toolbar.classList.contains('chat-composer__inner-container')

    const quickInsertButton = document.createElement('button')
    quickInsertButton.className = 'btn no-text btn-icon toolbar__button quick-insert-button'
    quickInsertButton.title = '快捷输入'
    quickInsertButton.type = 'button'
    quickInsertButton.innerHTML = '⎘'

    if (isChatComposer) {
      quickInsertButton.classList.add('fk-d-menu__trigger', 'chat-composer-button', 'btn-transparent')
      quickInsertButton.setAttribute('aria-expanded', 'false')
      quickInsertButton.setAttribute('data-trigger', '')
    }

    quickInsertButton.addEventListener('click', e => {
      e.stopPropagation()
      const menu = createQuickInsertMenu()
      const portal = document.querySelector('#d-menu-portals') || document.body
      portal.appendChild(menu)
      const rect = quickInsertButton.getBoundingClientRect()
      menu.style.position = 'fixed'
      menu.style.zIndex = '10000'
      menu.style.top = rect.bottom + MENU_HORIZONTAL_OFFSET + 'px'
      menu.style.left = calculateMenuLeftPosition(rect, window.innerWidth) + 'px'

      const removeMenu = ev => {
        if (!menu.contains(ev.target)) {
          if (menu.parentElement) menu.parentElement.removeChild(menu)
          document.removeEventListener('click', removeMenu)
        }
      }
      setTimeout(() => document.addEventListener('click', removeMenu), 100)
    })

    try {
      toolbar.appendChild(quickInsertButton)
      console.log('[Callout Suggestions] Quick insert button injected into toolbar')
    } catch (error) {
      console.error('[Callout Suggestions] Failed to inject quick insert button:', error)
    }
  }

  // Settings caching to avoid repeated localStorage access
  let cachedSettings = null
  let settingsCacheTime = 0
  let cachedHasPortals = null
  let portalsCacheTime = 0
  const SETTINGS_CACHE_DURATION = 10000 // Cache for 10 seconds
  const PORTALS_CACHE_DURATION = 5000 // Cache portal check for 5 seconds
  const DEBOUNCE_DELAY = 500 // Debounce delay for MutationObserver

  // Menu positioning constants
  const MENU_HORIZONTAL_OFFSET = 5 // Space between button and menu (vertical)
  const MENU_MIN_MARGIN = 8 // Minimum margin from viewport edge
  const MENU_BASE_WIDTH = 150 // Base width for menu positioning calculation
  const MENU_MAX_WIDTH = 300 // Maximum width for menu positioning

  function getCachedSettings() {
    const now = Date.now()
    if (!cachedSettings || now - settingsCacheTime > SETTINGS_CACHE_DURATION) {
      cachedSettings = loadSettings()
      settingsCacheTime = now
    }
    return cachedSettings
  }

  function getCachedHasPortals() {
    const now = Date.now()
    if (cachedHasPortals === null || now - portalsCacheTime > PORTALS_CACHE_DURATION) {
      cachedHasPortals = !!document.querySelector('#d-menu-portals')
      portalsCacheTime = now
    }
    return cachedHasPortals
  }

  function shouldSkipToolbarInjection() {
    // Skip toolbar injection when force mobile mode is active AND #d-menu-portals exists
    // because in this mode, the mobile UI uses the portal container for menu rendering
    const settings = getCachedSettings()
    const forceMobileMode = settings.forceMobileMode === true
    const hasPortals = getCachedHasPortals()
    return forceMobileMode && hasPortals
  }

  function findAllToolbars() {
    if (shouldSkipToolbarInjection()) {
      console.log('[Callout Suggestions] Force mobile mode with #d-menu-portals detected, skipping toolbar injection')
      return []
    }

    const toolbars = []
    const selectors = [
      '.d-editor-button-bar',
      '.chat-composer__inner-container',
      '.d-editor-toolbar'
    ]

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector)
      toolbars.push(...Array.from(elements))
    }
    return toolbars
  }

  function attemptQuickInsertInjection() {
    const toolbars = findAllToolbars()
    let injectedCount = 0

    toolbars.forEach(toolbar => {
      if (!toolbar.querySelector('.quick-insert-button')) {
        injectQuickInsertButton(toolbar)
        injectedCount++
      }
    })

    return { injectedCount, totalToolbars: toolbars.length }
  }

  function initQuickInsertButton() {
    try {
      console.log('[Callout Suggestions] Initializing quick insert button...')
      
      // Initial injection
      attemptQuickInsertInjection()
      
      // Use MutationObserver with debouncing to detect new toolbars
      let debounceTimer = null
      const observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          attemptQuickInsertInjection()
        }, DEBOUNCE_DELAY)
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
      
      console.log('[Callout Suggestions] Quick insert button initialized with MutationObserver')
    } catch (e) {
      console.error('[Callout Suggestions] Quick insert button initialization failed', e)
    }
  }

  // ===== Discourse Detection =====
  function isDiscoursePage() {
    const discourseMetaTags = document.querySelectorAll(
      'meta[name*="discourse"], meta[content*="discourse"], meta[property*="discourse"]'
    )
    if (discourseMetaTags.length > 0) {
      console.log('[Callout Suggestions] Discourse detected via meta tags')
      return true
    }

    const generatorMeta = document.querySelector('meta[name="generator"]')
    if (generatorMeta) {
      const content = generatorMeta.getAttribute('content')
      if (content && content.toLowerCase().includes('discourse')) {
        console.log('[Callout Suggestions] Discourse detected via generator meta')
        return true
      }
    }

    const discourseElements = document.querySelectorAll(
      '#main-outlet, .ember-application, textarea.d-editor-input, .ProseMirror.d-editor-input'
    )
    if (discourseElements.length > 0) {
      console.log('[Callout Suggestions] Discourse elements detected')
      return true
    }

    console.log('[Callout Suggestions] Not a Discourse site')
    return false
  }

  // ===== Entry Point =====
  if (isDiscoursePage()) {
    console.log('[Callout Suggestions] Discourse detected, initializing callout suggestions and quick insert button')
    // Check forceMobileMode setting (respects global setting)
    if (shouldRespectForceMobileMode()) {
      console.log('[Callout Suggestions] Force mobile mode is enabled - respecting global setting')
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initCalloutSuggestions()
        initQuickInsertButton()
      })
    } else {
      initCalloutSuggestions()
      initQuickInsertButton()
    }
  } else {
    console.log('[Callout Suggestions] Not a Discourse site, skipping initialization')
  }
})()
