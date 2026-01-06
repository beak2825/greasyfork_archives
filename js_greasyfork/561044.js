// ==UserScript==
// @name         bbsspeak
// @namespace    http://tampermonkey.net/
// @version      2026-01-05
// @description  speak post
// @author       fthvgb1
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/561044/bbsspeak.user.js
// @updateURL https://update.greasyfork.org/scripts/561044/bbsspeak.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let voice;
    const rules = deepAssign({
        bbs: {
            list: '#postlist > div[id^=post_]',
            items: {
                content: {
                    selector: '.t_f,.t_fsz',
                    removes: '.pstatus,.quote, a',
                },
                author: '.xw1',
                //'date': '.authi em span, .authi em',
            },

            stick: '.pi > strong a',
            format: '{author}说道：{content}' //default format
        },
        'v2ex.com': {
            list: '#Main > .box:nth-child(2),.box > div[id^=r_]',
            items: {
                content: {
                    selector: '.topic_content:not(:has(.markdown_body)),.markdown_body,.reply_content',
                    replaces: {
                        '&nbsp;': ' ',
                        '@(.+?) ': '对$1说：',
                        '^(?!对.*?说)(.*)': '说道：$1'
                    },
                    attribute: 'textContent', // default innerText
                    removes: 'a:not([href^="/member"])',
                    items: {
                        attachments: {
                            selector: '.subtle',
                            multiple: true,
                            replaces: {
                                '(\n?.*)[=]': '又在$1中说到'
                            },
                            removes: '.fade span[title]'
                        }
                    },
                    //format: '{content} {attachments}'
                },
                no: {
                    selector: '.no',
                    replaces: {
                        "(\\d+)": '$1楼的'
                    },
                    defaultValue: '楼主',
                },
                author: '.gray > a,.dark',
                //date: '.ago',
            },
            stick: '.gray > span,.no',
            format: '{no} {author} {content} {content.attachments}',
        },
        "tieba.baidu.com": { // todo post in post
            list: '.p_postlist > .l_post',
            items: {
                content: '.p_content',
                author: '.d_author .d_name',
                postNumber: '.post-tail-wrap span.tail-info:nth-child(6)',
            },
            stick: '.post-tail-wrap > span|beforebegin',
            format: '{postNumber}的{author}说道：{content}',
            stickElement: '<span style="cursor: pointer; margin-left: 1rem">📣</span>',
        }
    }, GM_getValue('rules', {})), utterance = new SpeechSynthesisUtterance();
    // todo recur stick and items when items are unlimited nest rely

    console.log('speak bbs');

    const rule = rules[location.host] ?? rules['bbs'];

    function speak(text) {
        utterance.text = text;
        speechSynthesis.speak(utterance);
    }

    function replaceVars(vars, str) {
        return Object.keys(vars).reduce((str, key) => str.replaceAll(`{${key}}`, vars[key]), str);
    }

    function deepAssign(target, ...sources) {
        for (const source of sources) {
            for (let k in source) {
                let vs = source[k], vt = target[k]
                if (Object(vs) === vs && Object(vt) === vt) {
                    target[k] = deepAssign(vt, vs)
                    continue
                }
                target[k] = source[k]
            }
        }
        return target
    }

    function extractValue(varEle, item) {
        if (!varEle) {
            return item?.defaultValue ?? '';
        }
        if (item?.removes) {
            varEle = varEle.cloneNode(true);
            varEle.querySelectorAll(item.removes)?.forEach(el => el.remove());
        }

        let value = varEle?.[item?.attribute] ?? varEle.innerText;
        if (item?.replaces) {
            value = Object.keys(item.replaces).reduce((val, key) => {
                try {
                    const reg = key.split('[=]');
                    val = val.replace(new RegExp(reg[0], reg?.[1] ?? 'g'), item.replaces[key])
                } catch (e) {
                    val = val.replaceAll(key, item.replaces[key]);
                }
                return val;
            }, value)
        }
        return value ? value : item?.defaultValue;
    }

    function getVars(div, rule) {
        const vars = {}, fields = Object.keys(rule.items);
        const values = fields.map(k => {
            const item = rule.items[k];
            if (!item) {
                return '';
            }
            if (typeof item === 'string') {
                return div.querySelector(item)?.innerText ?? '';
            }
            if (typeof item !== 'object') {
                return '';
            }
            let vals = item?.defaultValue ?? '';
            if (item?.selector) {
                if (!item?.multiple) {
                    vals = extractValue(div.querySelector(item.selector), item);
                } else {
                    vals = [...div.querySelectorAll(item.selector)].map(el => extractValue(el, item)).join('\n');
                }
            }

            if (item?.items) {
                const v = getVars(div, {items: item.items});
                if (item?.format) {
                    vals = replaceVars(v, item.format)
                } else {
                    Object.keys(v).forEach(key => vars[`${k}.${key}`] = v[key]);
                }
            }
            return vals
        });
        fields.forEach((key, i) => vars[key] = values[i]);
        return vars;
    }

    function getText(div, rule) {
        const vars = getVars(div, rule);
        const fields = Object.keys(vars);
        return replaceVars(vars, rule?.format ?? `{${fields.join('} {')}`);
    }

    function initiation() {
        const langVoiceFn = () => GM_getValue(`langVoice_${location.host}`, (() => {
            let lang = document.documentElement.lang ? document.documentElement.lang : navigator.language;
            lang = lang.toLowerCase();
            for (const i in voices) {
                if (voices[i].lang.toLowerCase() === lang) {
                    return i;
                }
            }
            return 0;
        })());
        let voices = speechSynthesis.getVoices(), langVoice = [];
        if (!voices) {
            speechSynthesis.addEventListener('voiceschanged', () => {
                voices = speechSynthesis.getVoices();
                langVoice = langVoiceFn();
                voice = voices[langVoice] ?? null;
                utterance.voice = voice;
            });
        } else {
            langVoice = langVoiceFn();
            voice = voices[langVoice] ?? null;
            utterance.voice = voice;
        }
        const posts = [...document.querySelectorAll(rule.list)];
        posts.forEach((div, i) => {
            let a = document.createElement('a'), count = 0;
            if (rule?.stickElement) {
                if (typeof rule.stickElement === 'string') {
                    a.innerHTML = rule.stickElement;
                    a = a.children[0];
                } else if (rule.stickElement instanceof HTMLElement) {
                    a = rule.stickElement;
                }
            } else {
                a.innerText = '📢';
                a.title = '左键单击朗读此楼，双击键朗读此楼及后面的回复，右键选择语音';
                a.href = 'javascript:void(0)';
                a.style.marginLeft = '1rem';
            }
            a.addEventListener('mousedown', ev => {
                if (ev.button !== 0) {
                    return;
                }
                if (count > 0) {
                    count++;
                    return
                }
                count++;
                const t = setTimeout(() => {
                    clearTimeout(t);
                    if (count > 1) {
                        count = 0;
                        if (rule?.callback) {
                            rule.callback(posts.slice(i), rule);
                        } else {
                            speak(posts.slice(i).map(item => getText(item, rule)).join('\n'));
                        }
                        return
                    }
                    count = 0;
                    rule?.callback ? rule.callback(div, rule) : speak(getText(div, rule));
                }, 500)
            });

            const select = document.createElement('select');
            select.addEventListener('change', ev => {
                const v = parseInt(select.value);
                utterance.voice = voices[v];
                GM_setValue(`langVoice_${location.host}`, v);
                select.replaceWith(a);
            })
            const arr = voices.map((v, i) => [`${v.lang} - ${v.localService ? 'local' : ''}-${v.name}`, i]);
            select.innerHTML = buildOption(arr, langVoice, 1, 0);

            a.addEventListener('contextmenu', ev => {
                ev.preventDefault();
                a.replaceWith(select);
            });

            const stick = rule.stick.split('|');
            div.querySelector(stick[0])?.insertAdjacentElement(stick?.[1] ?? 'afterend', a);
        });
    }

    function buildOption(arr, select = '', key = 'k', val = 'v', attr = null) {
        const sels = new Set();
        if (Array.isArray(select)) {
            select.forEach(sels.add);
        } else if (select) {
            sels.add(select);
        }
        return arr.map(v => {
            let att = '', sel = '';
            if (attr !== null && v[attr] && typeof v[attr] === 'object') {
                att = Object.keys(v[attr]).map(k => `${k}="${v[attr][k]}"`).join(' ');
            }
            if (typeof v === 'string' || typeof v === 'number') {
                sel = sels.has(v) ? 'selected' : '';
                return `<option ${att} ${sel} value="${v}">${v}</option>`
            } else if (typeof v === 'object' || v instanceof Array) {
                sel = sels.has(v[key]) ? 'selected' : '';
                return `<option ${att} ${sel} value="${v[key]}">${v[val]}</option>`
            }
            return ''
        }).join('\n');
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initiation)
        return
    }
    initiation();
})();