// ==UserScript==
// @name Translate It to Me!
// @namespace -
// @version 1.0.1
// @description [CTRL] + [Left Mouse Button] to translate the element you clicked on (configurable)
// @author NotYou
// @match *://*/*
// @grant GM.xmlHttpRequest
// @grant GM.registerMenuCommand
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.deleteValue
// @grant GM.addStyle
// @run-at document-end
// @license MIT
// @icon https://www.svgrepo.com/download/470003/translate.svg
// @connect ftapi.pythonanywhere.com
// @connect abhi-api.vercel.app
// @downloadURL https://update.greasyfork.org/scripts/551385/Translate%20It%20to%20Me%21.user.js
// @updateURL https://update.greasyfork.org/scripts/551385/Translate%20It%20to%20Me%21.meta.js
// ==/UserScript==

!function() {
    'use strict';

    class UserData {
        static key = 'user_data'

        static async getData() {
            return await GM.getValue(this.key, {
                language: 'en',
                shiftKey: false,
                ctrlKey: true,
                altKey: false,
                ignore: {
                    site: {},
                    page: {}
                }
            })
        }

        static async getItem(key) {
            const data = await this.getData()

            return data[key]
        }

        static async setItem(key, value) {
            const data = await this.getData()

            data[key] = value

            await GM.setValue(this.key, data)
        }

        static async resetData() {
            await GM.deleteValue(this.key)
        }
    }

    class UIComponent {
        constructor(tagName, styles) {
            this.element = document.createElement(tagName)
            Object.assign(this.element.style, {
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                margin: '0',
                padding: '0',
                width: 'initial',
                height: 'initial',
                backgroundColor: 'initial',
                boxShadow: 'initial'
            }, styles)
        }

        setParent(parent) {
            if (parent instanceof UIComponent) {
                parent.element.appendChild(this.element)
            } else if (parent instanceof HTMLElement) {
                parent.appendChild(this.element)
            } else {
                throw new Error('"parent" is not a UIComponent, nor a HTMLElement')
            }

            return this
        }
    }

    class Select extends UIComponent {
        constructor(options) {
            super('select', {
                padding: '8px',
                borderRadius: '12px',
                backgroundColor: 'rgb(240, 240, 240)',
                color: 'rgb(10, 10, 10)',
                width: '150px',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            })

            this._onChange = () => {}

            this.element.addEventListener('change', ev => this._onChange(ev))

            for (const value in options) {
                const text = options[value]
                const option = new Option(text, value)

                this.element.appendChild(option)
            }
        }

        select(value) {
            for (const option of this.element.options) {
                if (option.value === value) {
                    this.element.selectedIndex = option.index
                    return this
                }
            }

            return this
        }

        onChange(fn) {
            this._onChange = fn

            return this
        }
    }

    class Checkbox extends UIComponent {
        constructor(checked = false) {
            super('div', {
                width: 'var(--width)',
                borderRadius: '100px',
                margin: '4px 0',
                padding: '4px',
                transition: '0.3s background-color',
                cursor: 'pointer',
                boxSizing: 'content-box'
            })

            this.element.style.setProperty('--width', '60px')

            this.circle = document.createElement('div')
            this.circle.style.setProperty('--size', '25px')
            this.circle.style.width = 'var(--size)'
            this.circle.style.height = 'var(--size)'
            this.circle.style.borderRadius = '50%'
            this.circle.style.backgroundColor = 'rgb(240, 240, 240)'
            this.circle.style.transition = '0.3s transform'
            this.circle.style.margin = '0'
            this.circle.style.padding = '0'

            this.element.appendChild(this.circle)
            this.checked = checked

            if (this.checked) {
                this.check()
            } else {
                this.uncheck()
            }

            this._onChange = () => {}

            this.element.addEventListener('click', () => {
                this.checked ? this.uncheck() : this.check()

                this._onChange(this.checked)
            })
        }

        check() {
            this.element.style.backgroundColor = 'rgb(50, 200, 255)'
            this.circle.style.transform = 'translate(calc(var(--width) - var(--size)))'
            this.checked = true

            return this
        }

        uncheck() {
            this.element.style.backgroundColor = 'rgb(50, 50, 50)'
            this.circle.style.transform = 'translate(0px)'
            this.checked = false

            return this
        }

        onChange(fn) {
            this._onChange = fn

            return this
        }
    }

    class Headline extends UIComponent {
        constructor(text) {
            super('h1', {
                fontSize: '32px',
                fontWeight: '800',
                marginBottom: '8px'
            })

            this.element.textContent = text
        }
    }

    class Title extends UIComponent {
        constructor(text) {
            super('h2', {
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '4px'
            })

            this.element.textContent = text
        }
    }

    class Paragraph extends UIComponent {
        constructor(text) {
            super('p', {
                fontSize: '16px',
            })

            this.element.textContent = text
        }
    }

    class Button extends UIComponent {
        constructor(text, isOutlined = false) {
            super('button', Object.assign(isOutlined ? {
                color: 'rgb(50, 200, 255)',
                border: '1px solid currentColor',
                backgroundColor: 'transparent'
            } : {
                backgroundColor: 'rgb(50, 200, 255)',
                border: '0'
            }, {
                fontSize: '16px',
                margin: '8px 0',
                padding: '8px',
                borderRadius: '12px',
                display: 'block',
                width: '100%',
                cursor: 'pointer',
                fontWeight: 'bold'
            }))

            this._onClick = () => {}

            this.element.addEventListener('click', ev => this._onClick(ev))
            this.element.textContent = text
        }

        onClick(fn) {
            this._onClick = fn

            return this
        }
    }

    class Grid extends UIComponent {
        constructor(columns) {
            super('div', {
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, auto)`,
                gap: '8px'
            })
        }
    }

    class Group extends UIComponent {
        constructor(columns) {
            super('div', {})
        }
    }

    class Menu extends UIComponent {
        constructor() {
            super('div', {
                display: 'none',
                position: 'fixed',
                left: '0',
                top: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.333)',
                zIndex: '2147483646',
                fontFamily: '"DM Sans", Arial',
                boxSizing: 'border-box'
            })

            this.element.addEventListener('click', ev => {
                if (ev.target === ev.currentTarget) {
                    this.close()
                }
            })

            this.inner = new class extends UIComponent {
                constructor() {
                    super('div', {
                        padding: '32px',
                        backgroundColor: 'rgb(5, 23, 30)',
                        color: 'rgb(240, 240, 240)',
                        borderRadius: '16px',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                    })
                }
            }

            this.setParent(document.body)
        }

        async setupSettings() {
            new Headline('Settings').setParent(this.inner)

            const grid = new Grid(2).setParent(this.inner)
            const translationGroup = new Group().setParent(grid)

            new Title('Translation').setParent(translationGroup)
            new Paragraph('Target language').setParent(translationGroup)

            const language = await UserData.getItem('language')
            const languageSelect = new Select(Translate.languageCodes).onChange(ev => {
                const option = ev.target.options[ev.target.selectedIndex]

                UserData.setItem('language', option.value)
            })
            .select(language)
            .setParent(translationGroup)

            new Paragraph('Ignore this page').setParent(translationGroup)

            const ignore = await UserData.getItem('ignore')
            const ignorePageCheckbox = new Checkbox(ignore.page[location.host + location.pathname] === 1).onChange(state => {
                if (state) {
                    ignore.page[location.host + location.pathname] = 1
                } else {
                    delete ignore.page[location.host + location.pathname]
                }

                UserData.setItem('ignore', ignore)
            }).setParent(translationGroup)

            new Paragraph('Ignore this site').setParent(translationGroup)
            const ignoreSiteCheckbox = new Checkbox(ignore.site[location.host] === 1).onChange(state => {
                if (state) {
                    ignore.site[location.host] = 1
                } else {
                    delete ignore.site[location.host]
                }

                UserData.setItem('ignore', ignore)
            }).setParent(translationGroup)

            const clickConfigGroup = new Group().setParent(grid)
            new Title('Click Config').setParent(clickConfigGroup)

            const data = await UserData.getData()

            const resetIfNoneChecked = async () => {
                if (!shiftCheckbox.checked && !ctrlCheckbox.checked && !altCheckbox.checked) {
                    await UserData.setItem('ctrlKey', true)
                    ctrlCheckbox.check()
                }
            }

            new Paragraph('Shift must be pressed').setParent(clickConfigGroup)
            const shiftCheckbox = new Checkbox(data.shiftKey).onChange(state => {
                UserData.setItem('shiftKey', state)

                resetIfNoneChecked()
            }).setParent(clickConfigGroup)

            new Paragraph('Ctrl must be pressed').setParent(clickConfigGroup)
            const ctrlCheckbox = new Checkbox(data.ctrlKey).onChange(state => {
                UserData.setItem('ctrlKey', state)

                resetIfNoneChecked()
            }).setParent(clickConfigGroup)

            new Paragraph('Alt must be pressed').setParent(clickConfigGroup)
            const altCheckbox = new Checkbox(data.altKey).onChange(state => {
                UserData.setItem('altKey', state)

                resetIfNoneChecked()
            }).setParent(clickConfigGroup)

            new Button('Reset', true).onClick(async () => {
                await UserData.resetData()

                const { language, shiftKey, ctrlKey, altKey } = await UserData.getData()

                languageSelect.select(language)
                ignorePageCheckbox.uncheck()
                ignoreSiteCheckbox.uncheck()

                shiftCheckbox[shiftKey ? 'check' : 'uncheck']()
                ctrlCheckbox[ctrlKey ? 'check' : 'uncheck']()
                altCheckbox[altKey ? 'check' : 'uncheck']()
            }).setParent(this.inner)

            new Button('OK').onClick(() => {
                this.close()
            }).setParent(this.inner)
        }

        close() {
            if (this.element.style.display !== 'none') {
                this.element.style.display = 'none'
                this.element.removeChild(this.inner.element)
                this.inner.element.innerHTML = ''
            }
        }

        open() {
            if (this.element.style.display !== 'block') {
                this.element.style.display = 'block'
                this.setupSettings()
                this.inner.setParent(this)
            }
        }
    }

    class API {
        static baseUrl = 'https://example.com'

        static stringifySearchParams(params) {
            return [...params.entries()]
                .filter(item => item[0] && item[1])
                .map(([key, value]) => `${key}=${value}`)
                .join('&')
        }

        static getUrl(path, searchParams = '') {
            if (searchParams) {
                return this.baseUrl + path + '?' + searchParams
            }

            return this.baseUrl + path
        }

        static fetch(params) {
            return new Promise((resolve, reject) => {
                return GM.xmlHttpRequest({
                    ...params,
                    onload: data => resolve(data.response),
                    onerror: reject
                })
            })
        }
    }

    class FreeTranslateAPI extends API {
        static baseUrl = 'https://ftapi.pythonanywhere.com'

        static translate(text, desinationLang) {
            const url = this.getUrl(
                '/translate',
                this.stringifySearchParams(
                    new URLSearchParams({
                        dl: desinationLang,
                        text
                    })
                )
            )

            return this.fetch({
                url,
                responseType: 'json'
            })
        }
    }

    class AbhiAPI extends API {
        static baseUrl = 'https://abhi-api.vercel.app'

        static translate(text, lang) {
            const url = this.getUrl(
                '/api/tool/translate',
                this.stringifySearchParams(
                    new URLSearchParams({
                        text,
                        lang
                    })
                )
            )

            return this.fetch({
                url,
                responseType: 'json'
            })
        }
    }

    class Translate {
        static languageCodes = {
            'en': 'English',
            'sq': 'Albanian',
            'ar': 'Arabic',
            'az': 'Azerbaijani',
            'eu': 'Basque',
            'bn': 'Bengali',
            'bg': 'Bulgarian',
            'ca': 'Catalan',
            'cs': 'Czech',
            'da': 'Danish',
            'nl': 'Dutch',
            'eo': 'Esperanto',
            'et': 'Estonian',
            'fi': 'Finnish',
            'fr': 'French',
            'gl': 'Galician',
            'de': 'German',
            'el': 'Greek',
            'hi': 'Hindi',
            'hu': 'Hungarian',
            'id': 'Indonesian',
            'ga': 'Irish',
            'it': 'Italian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'ky': 'Kyrgyz',
            'lv': 'Latvian',
            'lt': 'Lithuanian',
            'ms': 'Malay',
            'fa': 'Persian',
            'pl': 'Polish',
            'pt-BR': 'Portuguese (Brazil)',
            'ro': 'Romanian',
            'ru': 'Russian',
            'sr': 'Serbian',
            'sk': 'Slovak',
            'sl': 'Slovenian',
            'es': 'Spanish',
            'sv': 'Swedish',
            'tl': 'Filipino',
            'th': 'Thai',
            'tr': 'Turkish',
            'uk': 'Ukrainian',
            'ur': 'Urdu',
            'vi': 'Vietnamese',
            'zh-CN': 'Chinese (Simplified)',
            'zh-TW': 'Chinese (Traditional)',
        }

        static async translate(text, targetLang) {
            const failureResponse = {
                sourceText: '',
                targetText: '',
                success: false
            };

            try {
                const response = await FreeTranslateAPI.translate(text, targetLang)

                if (response && response['destination-text']) {
                    return {
                        sourceText: response['source-text'],
                        targetText: response['destination-text'],
                        success: true
                    }
                }
            } catch (_) {}

            try {
                const response = await AbhiAPI.translate(text, targetLang)

                if (response && response.result && response.result.translatedText) {
                    return {
                        sourceText: text,
                        targetText: response.result.translatedText,
                        success: true
                    }
                }
            } catch (_) {}

            return failureResponse;
        }
    }

    class Main {
        static async init() {
            const menu = new Menu()

            GM.registerMenuCommand('🔧 Open Settings', () => {
                menu.open()
            })

            GM.addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

            .translate-flashing-element {
              background-image: linear-gradient(to right, transparent 0%, rgba(50, 200, 255, 0.5) 25%, transparent 50%);
              background-size: 200%;
              background-position: 100%;
              animation: 1.5s translate-flashing-anim 0.5s linear infinite;
            }

            .translate-error-element {
              animation: 1.5s translate-error-anim ease-out;
            }

            .translate-success-element {
              animation: 1.5s translate-success-anim ease-out;
            }

            @keyframes translate-flashing-anim {
              0% {
                background-position: 100%;
              }

              60%, 100% {
                background-position: -100%;
              }
            }

            @keyframes translate-error-anim {
              0% {
                background-color: rgb(255, 50, 50);
              }
            }

            @keyframes translate-success-anim {
              0% {
                background-color: rgb(50, 200, 255);
              }
            }
            `)

            window.addEventListener('click', async ev => {
                const userData = await UserData.getData()
                const { shiftKey, ctrlKey, altKey, ignore } = userData

                if (
                    ev.button === 0 &&
                    ev.shiftKey === shiftKey &&
                    ev.ctrlKey === ctrlKey &&
                    ev.altKey === altKey &&
                    ev.target !== document.body &&
                    ev.target !== document.documentElement &&
                    ignore.page[location.host + location.pathname] !== 1 &&
                    ignore.site[location.host] !== 1
                ) {
                    ev.preventDefault()
                    ev.stopImmediatePropagation()
                    ev.target.classList.add('translate-flashing-element')

                    const language = await UserData.getItem('language')
                    const toTranslate = []
                    const handleOnlyTextNodes = elem => {
                        for (const childNode of elem.childNodes) {
                            if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent.trim() !== '') {
                                toTranslate.push([Translate.translate(childNode.textContent, language), childNode])
                            }
                        }
                    }

                    // Handly text nodes from 1st and 2nd depth level of childNodes

                    handleOnlyTextNodes(ev.target)

                    for (const childNode of ev.target.childNodes) {
                        if (childNode.nodeType === Node.ELEMENT_NODE) {
                            handleOnlyTextNodes(childNode)
                        }
                    }

                    // Stop if no text nodes where found

                    if (toTranslate.length === 0) {
                        ev.target.classList.remove('translate-flashing-element')
                        return
                    }

                    // Wait for all translation promises, apply them to text and display success (fading away)

                    Promise.all(toTranslate.map(item => item[0])).then(translations => {
                        for (let i = 0; i < translations.length; i++) {
                            const translation = translations[i]
                            const childNode = toTranslate[i][1]

                            if (translation.success) {
                                childNode.textContent = translation.targetText

                                ev.target.classList.remove('translate-flashing-element')
                                ev.target.classList.add('translate-success-element')

                                ev.target.addEventListener('animationend', () => ev.target.classList.remove('translate-success-element'))
                            } else {
                                ev.target.classList.remove('translate-flashing-element')
                                ev.target.classList.add('translate-error-element')

                                ev.target.addEventListener('animationend', () => ev.target.classList.remove('translate-error-element'))
                            }
                        }
                    })
                }
            })
        }
    }

    Main.init()
}();