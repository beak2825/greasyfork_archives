// ==UserScript==
// @name         GGn Uploady
// @version      9
// @description  Uploady library
// @author       ingts
// @match        https://gazellegames.net/
// ==/UserScript==
/**
 * @template T
 * @typedef {{
 * getAliases?(result: T): string,
 * getCover?(result: T): Promise<string> | string,
 * getDescription?(result: T): string,
 * getScreenshots?(result: T): string[],
 * getAgeRating?(result: T): number
 * getYear?(result: T): string
 * getTrailer?(result: T): string
 * getTitle?(result: T): string
 * }} ValueGetters
 */

/**
 * @template T
 * @param {string} linkInputId
 * @param {RegExp} paramRegexp
 * @param {(param: string) => Promise<T>} fetchFn
 * @param {ValueGetters<T>} valueGetters
 */
function createFiller(linkInputId, paramRegexp, fetchFn, valueGetters) {
    const linkInput = document.getElementById(linkInputId)
    if (!linkInput) return
    const param = paramRegexp.exec(linkInput.value)?.[0]
    if (!param) return

    const showButton = document.createElement('button')
    linkInput.insertAdjacentElement('afterend', showButton)
    showButton.textContent = 'Fill'
    showButton.type = 'button'
    showButton.onclick = async e => {
        const mainId = `${linkInputId}_filler`
        let mainContainer = document.getElementById(mainId)
        if (mainContainer) {
            mainContainer.style.display = 'block'
            return
        }

        const style = document.createElement('style')
        style.textContent =
            // language=CSS
            `
                [id*=filler] label {
                    display: flex;
                    align-items: center;
                    word-wrap: anywhere;

                    input[type=checkbox], input[type=radio] {
                        margin: 0 3px 0 0;
                    }
                }
            `
        document.body.after(style)

        /** @type {{[name: string]: {selector?: string, value?: string|string[]}}} */
        let inputMap = JSON.parse(sessionStorage.getItem(param))

        if (!inputMap) {
            inputMap = {
                aliases: {
                    selector: 'aliases',
                },
                cover: {
                    selector: 'image',
                },
                description: {
                    selector: 'body',
                },
                screenshots: {},
                ageRating: {
                    selector: 'rating',
                },
                year: {
                    selector: 'year'
                },
                trailer: {
                    selector: 'trailer',
                },
                title: {
                    selector: 'name',
                },
            }

            showButton.textContent = 'Loading'
            showButton.disabled = true

            const result = await fetchFn(param)

            for (const [name, fn] of Object.entries(valueGetters)) {
                const value = await fn(result)
                const inputName = name
                    .replace('get', '')
                    .replace(/\w/, s => s.toLowerCase())
                if (inputName === 'ageRating') {
                    const ratingMap = new Map([
                        [1, '3+'],
                        [3, '7+'],
                        [5, '12+'],
                        [7, '16+'],
                        [9, '18+'],
                    ])
                    inputMap[inputName].value = ratingMap.get(value) ?? 'N/A'
                } else inputMap[inputName].value = value
            }

            sessionStorage.setItem(param, JSON.stringify(inputMap))

            showButton.textContent = 'Fill'
            showButton.disabled = false
        }

        mainContainer = document.createElement('div')
        document.body.append(mainContainer)
        mainContainer.style.cssText = `
        position: absolute;
        padding: 10px;
        background-color: rgb(40 43 76);
        border-radius: 2px;
        border: 2px solid #997979;
        z-index: 9;
        max-width: 71%;
        height: 840px;
         `
        mainContainer.id = mainId

        const tdRect = document.getElementById('non_wiki_editing').nextElementSibling.querySelector('td').getBoundingClientRect()
        mainContainer.style.top = tdRect.top + window.scrollY + 'px'
        mainContainer.style.left = tdRect.right + window.scrollX - tdRect.width + 'px'

        const innerContainer = document.createElement('div')
        mainContainer.appendChild(innerContainer)
        innerContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: auto;
            height: 810px;
        `

        const bottom = document.createElement('div')
        mainContainer.appendChild(bottom)

        bottom.style.margin = '10px 0 10px 0'
        bottom.style.display = 'flex'
        bottom.style.gap = '3px'

        bottom.insertAdjacentHTML('beforeend',
            `<button type="button">Close</button>
<button type="button">Check all</button>
<button type="button" style="margin-left: 10px;">Fill</button>
<label style="margin-left: 15px;">
    <input type="checkbox" checked>
    Auto PTPimg all
</label>`)
        mainContainer.appendChild(bottom)

        const closeButton = bottom.children[0]
        closeButton.onclick = () => mainContainer.style.display = 'none'

        const checkallButton = bottom.children[1]
        checkallButton.onclick = () => {
            for (const checkbox of mainContainer.querySelectorAll('input[type=checkbox]')) {
                checkbox.checked = true
            }
        }

        let newSr = ''
        const srRegex = /\[quote]\[align=center]\[b]\[u]System Requirements\[\/u]\[\/b]\[\/align].*\[\/quote]/si
        const imgEls = []

        for (const [name, obj] of Object.entries(inputMap)) {
            const value = obj.value
            if (!value) continue
            const formattedName = name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\w/, s => s.toUpperCase())

            if (name === 'screenshots') {
                innerContainer.insertAdjacentHTML('beforeend',
                    // language=HTML
                    `
                        <strong>Screenshots</strong>
                        <div style="border:1px solid #c0a5a5;padding: 3px;margin-bottom: 20px;">
                            <div style="display:flex;gap: 15px;margin-bottom: 10px;align-items:center;">
                                <label>
                                    <input type="checkbox" class="ss-remove-existing" checked>
                                    Remove existing
                                </label>
                                <div style="display:none;flex-direction:column;">
                                    <div>
                                        <button type="button">Check</button>
                                        <span>resolutions</span>
                                    </div>
                                    <div style="display:flex;gap: 8px;">
                                        <label>
                                            <input type="radio" name="resCheck" value="highest" checked>
                                            Highest
                                        </label>
                                        <label>
                                            <input type="radio" name="resCheck" value="majority">
                                            Majority
                                        </label>
                                    </div>
                                </div>
                                <button type="button">Check all</button>
                                <span style="color: #8eddc0;">0/${value.length} selected</span>
                            </div>
                            <div style="${e.shiftKey
                                    ? 'display:grid;grid-template-columns: repeat(2, 1fr);column-gap: 5px;' 
                                    : 'display:flex;gap: 5px;flex-wrap:wrap;'}max-height: 280px;overflow-y: auto"></div> <!-- imgDiv -->
                        </div>
                    `
                )
                const imgDiv = innerContainer.lastElementChild.lastElementChild
                for (const url of value) {
                    if (e.shiftKey) {
                        const label = createLabelWithCheckbox(url, undefined, imgDiv)
                        imgEls.push(label.firstElementChild)
                        continue
                    }
                    const label = createLabelWithCheckbox('', undefined, imgDiv)
                    label.style.display = 'flex'
                    label.style.flexDirection = 'column'
                    label.style.alignItems = 'flex-start'
                    label.style.gap = '5px'
                    label.style.display = 'none'
                    const img = document.createElement('img')
                    label.append(img)
                    img.src = url
                    img.style.maxWidth = '200px'
                    const checkbox = label.querySelector('input')
                    const wrapper = document.createElement('div')
                    wrapper.style.display = 'flex'
                    wrapper.style.alignItems = 'center'
                    label.insertBefore(wrapper, checkbox)
                    wrapper.append(checkbox)

                    img.addEventListener('load', () => {
                        checkbox.insertAdjacentText('afterend', ` ${img.naturalWidth}x${img.naturalHeight}`)
                        label.style.display = 'flex'
                        label.style.fontSize = '0.9em'
                    })
                    imgEls.push(img)
                }

                const ssTopDiv = innerContainer.lastElementChild.children[0]
                const countSpan = ssTopDiv.querySelectorAll('span')[1]
                imgDiv.addEventListener('change', e => {
                    if (e.target?.type === 'checkbox') {
                        const checkedCount = Array.from(imgDiv.querySelectorAll('input[type=checkbox]:checked')).length
                        countSpan.textContent = countSpan.textContent.replace(/\d+/, checkedCount.toString())
                    }
                })

                const [resCheckBtn,
                    checkAllBtn] = ssTopDiv.querySelectorAll('button')

                checkAllBtn.onclick = () => {
                    for (const imgEl of imgEls) {
                        checkImg(imgEl)
                    }
                }

                function checkImg(imgEl) {
                    const checkbox = e.shiftKey ? imgEl : imgEl.parentElement.querySelector('input')
                    checkbox.checked = true
                    checkbox.dispatchEvent(new Event('change', {bubbles: true}))
                }

                if (e.shiftKey) continue
                Promise.all(imgEls.map(img => new Promise(resolve => img.addEventListener('load', resolve))))
                    .then(() => {
                        const resolutions = Array.from(imgEls).map(img => `${img.naturalWidth}x${img.naturalHeight}`)

                        if (!resolutions.every(r => r === resolutions[0])) {
                            const resOptions = ssTopDiv.querySelector('div')
                            resOptions.style.display = 'flex'

                            resCheckBtn.onclick = () => {
                                if (resOptions.querySelector('[name=resCheck]:checked').value === 'highest') {
                                    const highestRes = resolutions.reduce((highest, current) => {
                                        const [width, height] = current.split('x').map(Number)
                                        const [highestWidth, highestHeight] = highest.split('x').map(Number)
                                        const highestPixels = highestWidth * highestHeight

                                        return width * height > highestPixels ? current : highest
                                    })
                                    resCheck(highestRes)
                                    return
                                }

                                const freqMap = resolutions.reduce((acc, val) => {
                                    acc[val] = (acc[val] || 0) + 1
                                    return acc
                                }, {})
                                const majorityRes = Object.keys(freqMap)
                                    .reduce((max, cur) => freqMap[max] > freqMap[cur] ? max : cur)

                                resCheck(majorityRes)
                            }
                        }

                        function resCheck(target) {
                            for (let index = 0; index < imgEls.length; index++) {
                                const imgEl = imgEls[index]
                                if (resolutions[index] !== target) continue
                                checkImg(imgEl)
                            }
                        }
                    })
                continue
            }

            if (name === 'cover') {
                const label = createLabelWithCheckbox(`<strong>${formattedName}</strong>`, `data-name=${name}`)
                if (e.shiftKey) {
                    label.querySelector('strong').insertAdjacentText('afterend', `: ${value}`)
                    continue
                }

                const img = document.createElement('img')
                label.after(img)
                img.src = value
                img.style.maxHeight = '180px'
                img.style.maxWidth = '120px'
                img.style.marginBottom = '10px'
                img.onload = () =>
                    label.querySelector('strong').insertAdjacentText('afterend', `: ${img.naturalWidth}x${img.naturalHeight}`)
                continue
            } else if (name === 'description') {
                const appendTo = document.createElement('div')
                appendTo.style.display = 'flex'
                appendTo.style.gap = '10px'
                innerContainer.appendChild(appendTo)

                createLabelWithCheckbox('Description', `data-name=${name}`, appendTo)

                newSr = srRegex.exec(value)?.[0]
                if (newSr) createLabelWithCheckbox('Only system requirements', `class=newsr`, appendTo)

                innerContainer.insertAdjacentHTML('beforeend',
                    `<textarea readonly cols="150" style="margin: 5px 0 10px 0;height: 100%">${value}</textarea>`)
                continue
            }

            createLabelWithCheckbox(`<strong>${formattedName}</strong><span>: ${value}</span>`, `data-name=${name}`,)
        }

        const fillButton = bottom.children[2]
        fillButton.onclick = () => {
            const autoPtpimg = bottom.querySelector('input').checked
            const namedCheckboxes = innerContainer.querySelectorAll('input[type=checkbox][data-name]')

            for (const namedCheckbox of namedCheckboxes) {
                if (!namedCheckbox.checked) continue
                const name = namedCheckbox.dataset.name
                const value = inputMap[name].value
                if (!value) continue

                const element = document.querySelector(`[name=${inputMap[name].selector}]`)
                element.value = value
                if (name === 'cover' && autoPtpimg) {
                    imageUpload(value, element)
                }
            }

            if (innerContainer.querySelector('.newsr')?.checked) {
                const descInput = document.querySelector('textarea[name=body]')
                const existingSr = srRegex.exec(descInput.value)?.[0]
                descInput.value = existingSr
                    ? descInput.value.replace(existingSr, newSr)
                    : descInput.value + '\n\n' + newSr
            }

            if (imgEls.length > 0) {
                const checkedUrls = e.shiftKey
                    ? imgEls.filter(el => el.checked).map(el => el.nextSibling.nodeValue)
                    : imgEls.filter(el => el.parentElement.querySelector('input:checked')).map(el => el.src)

                if (checkedUrls.length > 0) {
                    insertScreenshots(checkedUrls,
                        innerContainer.querySelector(".ss-remove-existing").checked,
                        autoPtpimg)
                }
            }

            mainContainer.style.display = 'none'
        }

        function createLabelWithCheckbox(after, checkboxAttrs, appendTo) {
            const label = document.createElement('label');
            (appendTo || innerContainer).appendChild(label)
            label.innerHTML = `<input type="checkbox" ${checkboxAttrs ? checkboxAttrs : ''}>${after}`
            return label
        }
    }
}

/**
 * @param {string[]} urls
 * @param {boolean=true} removeExisting
 * @param {boolean=false} autoPtpimg
 */
function insertScreenshots(urls, removeExisting = true, autoPtpimg = false) {
    const screenInputs = document.getElementsByName("screens[]")
    if (!removeExisting) urls = [...urls, ...Array.from(screenInputs).map(i => i.value)]

    for (let i = 0; i < urls.length; i++) {
        if (i === 20) break

        if (removeExisting) {
            if (!screenInputs[i]) AddScreenField(true)
            screenInputs[i].value = urls[i]
        } else {
            if (screenInputs[screenInputs.length - 1].value) AddScreenField(true)
            screenInputs[i].value = urls[i]
        }

        if (autoPtpimg) imageUpload(screenInputs[i].value, screenInputs[i])
    }

    // remove extra inputs
    if (removeExisting) {
        for (let i = 0; i < screenInputs.length - urls.length; i++) {
            RemoveScreenField()
        }
    } else {
        for (let i = screenInputs.length - 1; i >= 0; i--) {
            if (screenInputs[i].value) break
            RemoveScreenField()
        }
    }
}

function createDescription(about, sysReqs) {
    return `[align=center][b][u]About the game[/u][/b][/align]\n${about.trim()}${typeof sysReqs === 'string' ? 
        '\n\n' + '[quote][align=center][b][u]System Requirements[/u][/b][/align]\n' + sysReqs + '[/quote]' : ''}`.trim()
}

function joinAliases(aliases) {
    return aliases.join(aliases.some(a => a.includes(',')) ? '||' : ', ')
}