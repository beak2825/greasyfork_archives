// ==UserScript==
// @name         Minimal Toot Translator
// @description  Translates toots using Ollama and appends translation
// @match        https://mastodon.social/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at      document-end  // Ensures script runs after initial DOM is ready
// @version 0.0.1.20251108162521
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/555142/Minimal%20Toot%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/555142/Minimal%20Toot%20Translator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ollamaUrl = 'http://localhost:11434/api/generate';

    let translatedTextArray = [];

    //select all article elements
    //for each
    document.querySelectorAll('article').forEach(article => {

        console.log('test')


        //if the article has a .status__content__translate-button child
        if (article.querySelector('.status__content__translate-button')) {

            //then
            //send the toot text to ollama
            console.log(article.querySelector('.status__content__text').textContent);
            console.log('test')
        }
    })

    //observe additions to descendants of html
    const targetNode = document.querySelector('body');

    const config = { attributes: false, childList: true, subtree: true };

    function callback(mutationRecordObjectArray, mutationObserver) {

        //so we're getting a record of mutations here
        for (const mutation of mutationRecordObjectArray) {

            //console.log(mutation.addedNodes);
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'ARTICLE') {
                    if (node.querySelector('.status__content__translate-button')) {

                        //note the data-id of the article element
                        //by pushing the translation and data-id as key/value pair in global
                        //translatedTextArray

                        //get the data-id

                        //console.log('Article element on first appearance complete html structure: ');
                        //console.dir(node);
                        console.log(node.querySelector('.status__content__text').innerText);
                        //console.log('lol');

                        //send the text to ollama
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: ollamaUrl,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                model: 'gpt-oss:20b',
                                prompt: `Translate the following text into English.

Do not comment or provide explanations.

I'm looking for a word-for-word pure translation.

It should prioritize fidelity to the original language.

But heres the thing.

I want the output to be the original passage interlaced with the English translated words.

That's because I want to learn languages by association; and this breaks down the units of meaning from passage by passage, which is very difficult for a beginner; to word by word.

So, your job is to translate the passage, internally. Then, output the original passage and after every word output the translated literal word.

The format of your output will not include parentheses or any other special punctuation. Follow the exact, literal passage word-by-word.

The passage:

${node.querySelector('.status__content__text').innerText}`,
                                stream: false,
                                think: 'low',
                                keep_alive: '24h',
                                system: ''
                            }),
                            onload: function (response) {
                                const parsedResponse = JSON.parse(response.responseText);
                                console.log(parsedResponse);

                                translatedTextArray.push({
                                    dataId: node.getAttribute('data-id'),
                                    translation: parsedResponse.response
                                });

                                console.log('translatedTextArray: ', translatedTextArray);

                                //when the response finishes, we should add the translated text to already visible
                                //toots

                                //check the visible toots by looping over them

                                //loop over article elements
                                document.querySelectorAll('article').forEach(function (article) {

                                    //for each article check if it has a translate button
                                    //if article.querySelector('.status__content__translate-button')

                                    //actually nevermind

                                    //we dont need to check if the article has a translate button
                                    //as we already done that

                                    //we just need to append the translated text to all article elements which have
                                    //the post text visible

                                    //for each article

                                    //if the article has a .status__content__translate-button
                                    if (article.querySelector('.status__content__translate-button')) {

                                        //then see if that article element's data id matches with
                                        //any item in the translatedTextArray

                                        //loop over the translatedTextArray

                                        //and see

                                        translatedTextArray.forEach(function (item) {

                                            if (item.dataId === article.getAttribute('data-id')) {

                                                //only append the translation if the article element doesn't already have
                                                //a .translatedText class descendant

                                                if (!article.querySelector('.translatedText')) {
                                                    //append the translation
                                                    article.querySelector('.status__content__text')
                                                        .appendChild(Object.assign(document.createElement('p'), { className: 'translatedText', textContent: item.translation }));
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    }
                };

                //if the mutated node has children

                if (node.querySelectorAll) {

                    //if one of the mutated node children is the translate button

                    node.querySelectorAll('.status__content__translate-button').forEach(function (descendant) {

                        console.log('actual mutated node : ', node);
                        //console.log('found button element');

                        let dataId;

                        //if the translate button has article ancestor which it should

                        if (descendant.closest('article')) {

                            //get the data id of the ancestor article element
                            dataId = descendant.closest('article').getAttribute('data-id');
                            console.log('dataId: ', dataId);
                        }

                        //loop over the translatedTextArray until you find an object with this dataId value
                        translatedTextArray.forEach(function (item) {
                            //console.log('test2');

                            if (item.dataId === dataId) {
                                console.log('translatedTextArray ', translatedTextArray)
                                //console.log('found it');
                                console.log('translated text: ', item.translation);

                                //then append the translation as the last child of .status__content__text in a p element
                                //first get the .status__content__text element of the first article ancestor of


                                //since we found the translation of the post in the array

                                //lets get the translation text

                                //append the new passage
                                descendant
                                    .closest('article')
                                    .querySelector('.status__content__text')
                                    .appendChild(Object.assign(document.createElement('p'), { className: 'translatedText', textContent: item.translation }))
                            }
                        })
                    })
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);


})();