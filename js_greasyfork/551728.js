// ==UserScript==
// @name         Slack AI Translate
// @namespace    http://tampermonkey.net/
// @version      2025-05-29
// @description  Add English/Japanese translation button to Slack
// @author       KakkoiDev
// @match        https://app.slack.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTItMDhUMTU6Mjg6MzItMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTEyLTA4VDE1OjMxOjA2LTA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEyLTA4VDE1OjMxOjA2LTA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmE0YTc2OTg1LTE3NmMtNGFiYi05ZTYyLTFhYTQ2NjU1N2FkYSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDphNGE3Njk4NS0xNzZjLTRhYmItOWU2Mi0xYWE0NjY1NTdhZGEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphNGE3Njk4NS0xNzZjLTRhYmItOWU2Mi0xYWE0NjY1NTdhZGEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE0YTc2OTg1LTE3NmMtNGFiYi05ZTYyLTFhYTQ2NjU1N2FkYSIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0wOFQxNToyODozMi0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2E4AlAAACOJJREFUeJztm01sG8cdxX8z/HJdWFwacl0jtL0EDMRIakWGoQD5cCMdEyOJdBCQjwZmL0EvgSSgAdyiqak6bYI2RSX0lostoI6D+EA5LuzezB5cJHYE0LIjBKgB05aKFK0cL5UgoUju/nsgqVAkRXHFlWIXfsBCu/+ZfTPztDs782ao8BjdF+6YoZAeEpFewBBFRhw5Uywwme6LZFrh2Hv+iBkkeBjH6UcpQy9+uT89MGaVkxWgAV/5CLy1adPWw7ncTzrgiRD8yA9RgDx8WoDZ23BuN5zcunVr8YsvvigARcABHOVl4x+9mD0KklghOaOUjH/8eGSsGUfX3349hCNVeZyR6Wd+W32PBvzbt28P5HK54KVs9tk98GcNHc14bZj9F/xhN/wFyAOFwcFB2zMBVmn8t9A6fumxjolGSV3nf3UUUdUcmelnjsUqF4lEQicSCd/27duDuVwueDObfTsMr7qp5zy8sw3eAhaBvCcCdF+4YwaD6kaL2a18XmLpvohVHdx7/ogZlMAyDhF+evXQsROlc1FKKR2NRoNfffVV6J+W9ctOeH0t9b0D78bC4SPZbDan10JQi1BQH3WR3QgFiNcGAwRqOayaxqs9e/b45+bm/Fcs65W1Nh4gAq9+lM0+BwQ8EUBEul3lV/TWxpSjlnEoxWRtluvXr2sg8EAbja/gQRhPhEKdngiAottNdlEqXM+xXETH4e9LSUpBqcf334SXfbBzLdVcVhyEf7a4+KI3AkDGI54l+LDTlfPBwUENaMMwfJ3wtFdlbIEnPRFAQdoLnmXIf52p0J8+fVqi0aiyLEv5YZdXRYTgYU8EsB0Z94KnGlUDHwA1NzenABWEh70qwwc7PRHgk4ORlKyDCGVIzV9P4VUfwOWDkWEvRehODhvlU5VIJASQcDgsDsx6VUYePvV7RQYlEXou3jmhhGFQj6AwGuVTYK1KFtxsAmkRqXwFJJvNSg6ubfbgKwBQhFlPBQC4/EQkDfUDHbewoRtIK6UEUAcOHHCmpqbsL+HiZo++BPNwzrNXwGto7Xuq6lK2bNkiO3bssI9v2nTSgYV2+W2Y3dfRcfKuFUCE/qp+QFKplBOJRIq/yOVuX4fX2uX/HH6/sLBQvGsFAAwn9P141bXMzMzYQPFBOJOFd9dKPA/v7ISTQGFZH9B94Y4Z3KQPI9KNuBvergBLFBYiE4U8qVYNkW+hh4Cx8oWUjwKAAUf+q/VCp+P83A1jFt7dEw7/jmx2ESgsTYd7/pEdUlJtRHiODLaMXPpxZLJRYte5N1b6zo9MP3NsrHKRSCT02bNnfVNTUwHDMIJXLOuVB+D11eYHDixch9cehA8pGyJAyRBp2czwAisYIk0EsPKLhf2fDbydKV+r8qGj0Wggl8v5C4WC/1o2+3IEDgVgZ2W0WIS5PFz9Ei4eh5N/7Oy8PT8/Xzxw4EBxamrKBkS5NDO8QENDpIkAAJn8YqGvIkLFH6AkhK/m0OU44XBYstmsA9iA/dBDD9kzMzOOiNjlzyvapZnhBRoaIqvADAb9yb3JIyZAufJO+SgODg7mKVlcOdM0vzFN8+toNPpNJBL5BsgBi4ODg/mZmZkisNR4AO0g/e23yR0aGSKrQqnuYChwoSJChQqQ06dP25Sc3kI8Hs/39PQU5ubm8j09PQXK7/oHH3xQEWzZk6YevWityySjGUSRuvy40VcdW+UVqIYFjFZ3jHX8pVcEmkygSu6zE/cLWIrGY/YNRgYwW8hnAH/qOv9G7/TTx/obZah+xKthJoeNjtCWODCEI6agUn4tpNf0SLYB7ciZ+qj8HZTZMokjmdrQ3mTCzGFZmbKXYCaHjc3BzaYPutG+p5TQT9U/W4lc8dsio1qpXlctaBPKV2d44tic0D4Ot8qh8/6x2lgwZF8IssXsOvdG/Q0Nngmd94/pTw5GUiLScKFifSCjHz1WPyK89uybKaRFP0HUaHogUcfhrholDg1w+clIfB0dnSUokZFLT0QSK6VPH3pzeFURRI1OH/rNihwtoYpjaTJ0+WBk2HGkD5jEW5c3o5BxQfZ//GTzdUEoieDY0gcygUi6woHIuBbf/jYan0Fk3LGlr20B7+M+7uP/BsuWx28Y/Ybu2DxUXuw0Gt6gdHr3rZMjKxE24hDUBAUnFfv3+5lWKnUjaRod/o6m9VgLHJiw7UJqx8BnS/VYEuDmrpeGBJUAaV6gSMqcPdXXKGkVjoyIjMRmT002o799tmsIISHrNDxXkLGR0R88d/UElD+DN3e9dFRgbNXGN0ELHKZSKnlj54v9K3HcPtt1VISx9Wo8gICpUcfn/9p1GEDd+OELpgrq1g2RBk+ASw5LFr6OxaxJqzr4eXKvGfAFN9SY8dk6pnWgfUPEJYdBx/fitcGAr26HyHrDKGpnWIuiv10mUct3d7RwR29tRLnm8ATdGk/eN3dbZJTU7xARb2x4V9CKRzStLFRuAJR4v8tkNQiS0SiVdnWTooGZ0T5svt0TtGEQdUWLbY+6uknL5HrURTnOifXgbYaCo8d0bO79lg0RgdFYprXRnFtsG7iWQlh3T6ICEUZ3DKRLhkhs9lRcaF64ICOxW+8l1rNSnc9PD2+ECCKMbnt+OgFVhkjs1nvDIjJAaYOiVQ5nBBkXzf7YrVNj610xKIkgttMHMtnSTpIWUepk5YTYTl+l8VAzGVorMrtecre20GQ+sdG4m/cHbAjuC/BdV+C7hue7xNaK+Q/3XWiSbDlwptbM8AJ3jQCgepulauj3+YKZ+eS+kc6Bq5NelXpPvQICJj6VnE/u6/eK854SYAk+dfxOstvwgureFACMos+Je0F0rwoA4s2S/j0rgIbdHvF4AqtdAreGiChpu0zwSgAh5Sq7cKUuppdWglskUXUca4FHP5tz3E1h/fU7UqXobn9CwdF1HGuBJwJ4Yaq4MUQqZoa7WjaGZ51ga6YKo81MlVYMkWozwwt4+utxgBs7X4gr7SvtOC9Z7hkFKcdxJmJz76da4fhPcl9c+3heoXoFDAWWIJNiy8S2gWstcbSK/wG3hscVESXROgAAAABJRU5ErkJggg==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551728/Slack%20AI%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/551728/Slack%20AI%20Translate.meta.js
// ==/UserScript==

// TODO:
// [x] The input translation doesn't work in the thread feed & in normal thread
// [x] The message translate button doesn't work at all
// [ ] Use prettier loading icon than 🔄
// [ ] Improve dialog styling
// [ ] Remove the translate button from images' toolbars
// [ ] Add a | separator in the input toolbar to separate the translation icon from the other ones
// [ ] Add an AI prompt button. When clicking it, the content of the input becomes the prompt and is replaced by the answer
// [>] Add an option to connect to a local Ollama model
// [x] Add right click open settings dialog
// [x] Add hover tooltip: "Translate\n[right click to open settings]"
// [ ] Improve tooltip styling
// [x] fix styling of the translate icon: too large. Probably due to update in Slack's styling.

(function() {
    'use strict';

    const CONSTANTS = {
        SELECTORS: {
            MESSAGE: '.c-virtual_list__item',
            INPUT: '.ql-editor',
            INPUT_TOOLBAR: '.c-texty_buttons',
            INPUT_WRAPPER: '.p-message_pane_input_inner_main',
            INPUT_CONTAINER: '[data-qa="message_input_container"]',
            MESSAGE_TOOLBAR: '.c-message_actions__container',
            MESSAGE_DISPLAY: '.p-rich_text_block'
        },
        CLASSES: {
            TRANSLATE_MESSAGE_BUTTON: 'translate-message-button',
            TRANSLATE_INPUT_BUTTON: 'translate-input-button',
            MODEL_SELECT: 'model-select',
            DIALOG_BODY: 'dialog-body'
        },
        TYPES: {
            MESSAGE: 'message',
            INPUT: 'input',
            MODEL_SELECT_REMOTE: 'gemini',
            MODEL_SELECT_LOCAL: 'local'
        },
        STORAGE: {
            API_KEY: 'slack-ai-translator-api-key',
            REMOTE_OR_LOCAL_MODEL_SELECT: 'slack-ai-translator-remote-or-local-model-select',
            LOCAL_MODEL_HOST: 'slack-ai-translator-local-model-host',
            LOCAL_MODEL_NAME: 'slack-ai-translator-local-model-name'
        },
        STATE: {
            DEFAULT_LOCAL_MODEL_NAME: 'gemma3:1b'
        },
        API: {
            BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent',
            LOCAL_MODEL_HOST: 'http://localhost:11434/api/generate'
        }
    };

    // Helpers
    const HELPERS = {
        storage: {
            get apiKey() {
                return localStorage.getItem(CONSTANTS.STORAGE.API_KEY);
            },
            set apiKey(value) {
                localStorage.setItem(CONSTANTS.STORAGE.API_KEY, value);
            },

            get model() {
                return localStorage.getItem(CONSTANTS.STORAGE.REMOTE_OR_LOCAL_MODEL_SELECT);
            },
            set model(value) {
                localStorage.setItem(CONSTANTS.STORAGE.REMOTE_OR_LOCAL_MODEL_SELECT, value);
            }
        }
    };

    // UI Components
    const UI = {
        translateSVG: '<svg data-xxz="true" data-qa="globe" aria-hidden="true" viewBox="0 0 20 20" class="" width="18" height="18"><path fill="currentColor" fill-rule="evenodd" d="M2.537 9.25a7.51 7.51 0 0 1 5.784-6.561c-.91 1.577-1.891 3.86-2.049 6.561zM10 2.815c-.905 1.41-2.044 3.691-2.225 6.435h4.45c-.181-2.744-1.32-5.025-2.225-6.435m2.225 7.935h-4.45c.181 2.744 1.32 5.025 2.225 6.435.905-1.41 2.044-3.691 2.225-6.435m-.546 6.561c.91-1.577 1.891-3.86 2.05-6.561h3.734a7.51 7.51 0 0 1-5.784 6.561m2.05-8.061c-.159-2.7-1.14-4.984-2.05-6.561a7.51 7.51 0 0 1 5.784 6.561zm-11.192 1.5h3.735c.158 2.7 1.138 4.984 2.05 6.561a7.505 7.505 0 0 1-5.785-6.561M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18" clip-rule="evenodd"></path></svg>',

        //spinnerElement: '<div data-qa="infinite_spinner" class="c-infinite_spinner c-infinite_spinner--jumbo c-infinite_spinner--blue"><svg role="img" aria-hidden="true" viewBox="0 0 100 100" class="c-infinite_spinner__spinner c-infinite_spinner__spinner"><circle class="c-infinite_spinner__bg" cx="50%" cy="50%" r="35"></circle><circle class="c-infinite_spinner__path" cx="50%" cy="50%" r="35"></circle></svg><svg role="img" aria-hidden="true" viewBox="0 0 100 100" class="c-infinite_spinner__spinner c-infinite_spinner__spinner c-infinite_spinner__tail"><circle class="c-infinite_spinner__path" cx="50%" cy="50%" r="35"></circle></svg></div>',
        spinnerElement: '🔄',

        createTranslateButton(type) {
            const buttonClass = type === CONSTANTS.TYPES.MESSAGE
                ? CONSTANTS.CLASSES.TRANSLATE_MESSAGE_BUTTON
                : CONSTANTS.CLASSES.TRANSLATE_INPUT_BUTTON;
            const buttonHTML = `
                <button
                    class="${buttonClass} c-button-unstyled c-icon_button c-icon_button--size_small ${type === CONSTANTS.TYPES.MESSAGE ? 'c-message_actions__button' : 'p-video_composer_button c-wysiwyg_container__button c-wysiwyg_container__button--story_meeting'} c-icon_button--default"
                    data-qa="${type === CONSTANTS.TYPES.MESSAGE ? 'add_to_list' : 'video_composer_button'}"
                    ${type === CONSTANTS.TYPES.MESSAGE ? 'data-focus-key="message_actions"' : 'tabindex="-1"'}
                    aria-label="Translate"
                    ${type === CONSTANTS.TYPES.INPUT ? 'aria-expanded="false" delay="500"' : ''}
                    data-sk="tooltip_parent"
                    type="button"
                    title="${type === CONSTANTS.TYPES.MESSAGE ? 'Translate' : 'Translate\n[right click to open settings]'}"
                >
                    ${this.translateSVG}
                </button>`;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = buttonHTML;
            return wrapper.firstElementChild;
        },

        createApiKeyDialog() {
            const dialog = document.createElement('dialog');
            dialog.setAttribute('closedby', 'any');
            dialog.innerHTML = `
                <label>
                    Choose your model:
                    <select class="${CONSTANTS.CLASSES.REMOTE_OR_LOCAL_MODEL_SELECT}" name="model">
                        <option value="${CONSTANTS.TYPES.MODEL_SELECT_REMOTE}">${CONSTANTS.TYPES.MODEL_SELECT_REMOTE}</option>
                        <option value="${CONSTANTS.TYPES.MODEL_SELECT_LOCAL}">${CONSTANTS.TYPES.MODEL_SELECT_LOCAL}</option>
                    </select>
                </label>
                <div class="${CONSTANTS.CLASSES.DIALOG_BODY}"></div>
                <form method="dialog">
                    <div>
                        <button value="cancel">Cancel</button>
                        <button value="ok">OK</button>
                    </div>
                </form>`;
            return dialog;
        }
    };

    // Translation Service
    const TranslationService = {
        async translate(text, apiKey) {
            const data = {
                contents: [{
                    parts: [{
                        text: `
You are a translation engine. Translate the following text between Japanese and English.
Respond with ONLY the translated text, with NO extra words, explanations, or greetings.
Do NOT include the original text, do NOT say "here is the translation", do NOT add any comments.
If the text is already in English, translate to Japanese. If it's in Japanese, translate to English.
Keep emojis. Do NOT show alternative translations.
If the text is not in Japanese or English, respond with "N/A".
Do not modify the HTML tags. Preserve them.
Do not modify anything inside the ts-mention tags.
Ignore ts-mention tags when determining if the language of the text.
                        `
                    }, {
                        text: text
                    }]
                }]
            };

            try {
                const response = await fetch(`${CONSTANTS.API.BASE_URL}?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error.message);
                }

                return result?.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch (error) {
                console.error('Translation error:', error);
                throw error;
            }
        }
    };

    // UI Manager
    const UIManager = {
        addTranslateButtonToMessages(toolbars) {
            for (const toolbar of toolbars) {
                const toolbarInner = toolbar.children[0];
                const lastElement = toolbarInner.children[toolbarInner.children.length - 1];
                const button = UI.createTranslateButton(CONSTANTS.TYPES.MESSAGE);
                toolbarInner.insertBefore(button, lastElement);
            }
        },

        addTranslateButtonToInput(inputToolbars) {
            for (const inputToolbar of inputToolbars) {
                if (inputToolbar.querySelector(`.${CONSTANTS.CLASSES.TRANSLATE_INPUT_BUTTON}`)) continue;
                const button = UI.createTranslateButton(CONSTANTS.TYPES.INPUT);
                inputToolbar.appendChild(button);
            }
        },

        async handleTranslation(targetElement, mode) {
            const apiKey = HELPERS.storage.apiKey;
            if (!apiKey) {
                dialog.showModal();
                return;
            }

            let original, setLoading, setResult;

            if (mode === CONSTANTS.TYPES.MESSAGE) {
                const messageDisplayContainer = targetElement
                    .closest(CONSTANTS.SELECTORS.MESSAGE)
                    .querySelector(CONSTANTS.SELECTORS.MESSAGE_DISPLAY);
                original = messageDisplayContainer.innerHTML;
                setLoading = () => { messageDisplayContainer.innerHTML = UI.spinnerElement };
                setResult = (text) => { messageDisplayContainer.innerHTML = text };
            } else if (mode === CONSTANTS.TYPES.INPUT) {
                const input = targetElement
                    .closest(CONSTANTS.SELECTORS.INPUT_CONTAINER)
                    ?.querySelector(CONSTANTS.SELECTORS.INPUT) ??
                    targetElement
                    .closest(CONSTANTS.SELECTORS.MESSAGE)
                    ?.querySelector(CONSTANTS.SELECTORS.INPUT);
                original = input.innerHTML;
                setLoading = () => { input.innerHTML = UI.spinnerElement };
                setResult = (text) => {
                    const sanitizedText = text
                        .replace(/(?:<p>(?:<br\s*\/?>|[\s\\n\r]*)<\/p>[\s\r\n]*)+$/gmi, '')
                        .replace(/[\r\n]+$/g, '');
                    input.innerHTML = sanitizedText;
                };
            }

            try {
                setLoading();
                const translatedText = await TranslationService.translate(original, apiKey);
                setResult(translatedText ?? original);
            } catch (error) {
                if (error.message.includes('400')) {
                    dialog.showModal();
                } else {
                    alert(error.message);
                }
                setResult(original);
            }
        },

        swapDialogBody(dialog, model) {
            const dialogBody = dialog.querySelector(`.${CONSTANTS.CLASSES.DIALOG_BODY}`);

            switch(model) {
                case CONSTANTS.TYPES.MODEL_SELECT_REMOTE: {
                        const apiKey = HELPERS.storage.apiKey ?? '';
                        dialogBody.innerHTML = `
                        <label>
                            Enter your API key:
                            <input value="${apiKey}">
                        </label>
                        <p>You can get your free Gemini AI API key <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank">here</a>.</p>
                        <p>⚠️ The API key will be stored unencrypted in you browser's local storage!</p>
                        <p>⚠️ Google will own what ever data you pass to it 😔<br>More information <a href="https://support.google.com/gemini/answer/13594961?hl=en#your_data" target="_blank">here</a>.</p>
                        `;
                    break;
                }
                case CONSTANTS.TYPES.MODEL_SELECT_LOCAL:
                    dialogBody.innerHTML = `
                    <div>
                        <label>
                            Host:
                            <input value="${CONSTANTS.API.LOCAL_MODEL_HOST}">
                        </label>
                        <br>
                        <label>
                            Model name:
                            <input value="${CONSTANTS.STATE.DEFAULT_LOCAL_MODEL_NAME}">
                        </label>
                    </div>
                    `;
                break;
                default:
                    dialogBody.innerHTML = `
                    Error!
                    `;
            }
        }
    };

    // Initialize
    const dialog = UI.createApiKeyDialog();
    dialog.addEventListener('close', () => {
        if (dialog.returnValue === 'ok') {
            const value = dialog.querySelector('input').value;
            HELPERS.storage.apiKey = value;
        }
    });
    dialog.querySelector(`.${CONSTANTS.CLASSES.REMOTE_OR_LOCAL_MODEL_SELECT}`).addEventListener('change', (event) => {
        const value = event.target.value;
        HELPERS.storage.model = value;
        UIManager.swapDialogBody(dialog, value);
    });
    UIManager.swapDialogBody(dialog, CONSTANTS.TYPES.MODEL_SELECT_REMOTE);
    document.body.appendChild(dialog);

    // Event Listeners
    document.body.addEventListener('click', async (event) => {
        const targetMessageButton = event.target.closest(`.${CONSTANTS.CLASSES.TRANSLATE_MESSAGE_BUTTON}`);
        const targetInputButton = event.target.closest(`.${CONSTANTS.CLASSES.TRANSLATE_INPUT_BUTTON}`);

        if (targetMessageButton) {
            await UIManager.handleTranslation(targetMessageButton, CONSTANTS.TYPES.MESSAGE);
        } else if (targetInputButton) {
            await UIManager.handleTranslation(targetInputButton, CONSTANTS.TYPES.INPUT);
        }
    });

    document.body.addEventListener('contextmenu', async (event) => {
        const targetInputButton = event.target.closest(`.${CONSTANTS.CLASSES.TRANSLATE_INPUT_BUTTON}`);

        if (targetInputButton) {
            event.preventDefault();
            // Wait for next mouseup
            // Needed because the dialog's closeby=any gets triggered on mouseup
            const handler = () => {
                dialog.showModal();
                document.removeEventListener('mouseup', handler);
            };
            document.addEventListener('mouseup', handler, {once: true});
        }
    });

    // Mutation Observer
    const observer = new MutationObserver((mutations) => {
        console.log("");
        const allMutatedElementNodes = mutations
            .filter(mutation => mutation.type === 'childList')
            .flatMap(mutation => [...mutation.addedNodes])
            .filter(node => node.nodeType === Node.ELEMENT_NODE);

        const addedMessages = allMutatedElementNodes.filter(
            node => node.matches && node.matches(CONSTANTS.SELECTORS.MESSAGE_TOOLBAR)
        );
        UIManager.addTranslateButtonToMessages(addedMessages);

        const addedInputToolbarWrappers = allMutatedElementNodes
            .filter(node => node.querySelector(CONSTANTS.SELECTORS.INPUT_TOOLBAR));
        const addedInputToolbars = addedInputToolbarWrappers
            .flatMap(wrapper => [...wrapper.querySelectorAll(CONSTANTS.SELECTORS.INPUT_TOOLBAR)]);
        UIManager.addTranslateButtonToInput(addedInputToolbars);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();