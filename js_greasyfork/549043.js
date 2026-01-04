// ==UserScript==
// @name         Spanish Dictionary: List Copier
// @name:es         Diccionario inglés: Copiadora de listas
// @description  prints out the list in text
// @match        https://*.spanishdict.com/lists/*
// @match        https://*.ingles.com/listas/*
// @icon         https://neodarwin-prod.sdcdns.com/img/common/apple-touch-icons/favicon-production.png
// @grant GM_setClipboard
// @version 1
// @description:en  Adds the option to export your list to text, wait 5 seconds for it to all load in and copy
// @description:es Agrega la opción de exportar tu lista a texto, esperar 5 segundos para que se cargue y copiar.
// @license      MIT
// @namespace https://greasyfork.org/users/1513672
// @downloadURL https://update.greasyfork.org/scripts/549043/Spanish%20Dictionary%3A%20List%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/549043/Spanish%20Dictionary%3A%20List%20Copier.meta.js
// ==/UserScript==
async function copyTextToClipboard(textToCopy) {
  textToCopy = textToCopy.toString();
  try {
    await navigator.clipboard.writeText(textToCopy);
    alert('Text copied to clipboard successfully!');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

function showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.classList.add('clipboard-notification', type);
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 2000); // Remove after 2 seconds
    }

function scrollToBottom() {
    const initialHeight = document.body.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

    setTimeout(() => {
        if (document.body.scrollHeight > initialHeight) {
            scrollToBottom();
        }
    }, 500);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createJsonFromArrays(array1, array2) {
  if (array1.length !== array2.length) {
    throw new Error("Arrays must be of the same size.");
  }

  const result = {};
  for (let i = 0; i < array1.length; i++) {
    result[array1[i]] = array2[i];
  }
  return JSON.stringify(result);
}

function printy_arrrays(array1, array2){
    const prettyPrintedOutput = array1.map((item, index) => `${item}: ${array2[index]}`).join('\n');
    return prettyPrintedOutput;
}

function print_array(array1){
    return array1.join(', ');
}


function extractWords() {
    const noopenerElements = document.querySelectorAll('[rel="noopener"]');
    let language1_words = []
    let language2_words = []
    noopenerElements.forEach(element => {
        language1_words.push(element.children[0].textContent);
        language2_words.push(element.children[1].textContent);
    });

    return [language1_words, language2_words];
}

function copy_content(words="Pretty Copy"){
    const temp = extractWords();
    let list1 = temp[0];
    let list2 = temp[1];
    switch (words) {
        case "Copy JSON":
            return createJsonFromArrays(list1, list2);
        case "Copy Language 1":
            return print_array(list1);
            break;
        case "Copy Language 2":
            return print_array(list2);
            break;
        default:
            return printy_arrrays(list1, list2);
    }
}

function getFirstSpanContainingWord(word) {
  const spans = document.getElementsByTagName('span');
  for (let i = 0; i < spans.length; i++) {
    if (spans[i].textContent.includes(word)) {
      return spans[i];
    }
  }
  return null;
}

const searchWords = ['Share', 'Compartir'];

const share_button = Array.from(document.querySelectorAll('span'))
  .find(span => searchWords.some(word => span.textContent.includes(word)));

share_button.addEventListener('click', async () => {
    await sleep(100);
    let pop_up = document.querySelector('a[aria-label="Remind"]').parentNode.parentNode;
    append_all_types(pop_up,"Kk2y6UO0");
});

const parentDiv = document.querySelector('.TcyF9un7');

append_all_types(parentDiv, "Kk2y6UO0");

function append_all_types(parentDiv, button_class){
    append_to_div(parentDiv, button_class, "Pretty Copy");
    append_to_div(parentDiv, button_class, "Copy JSON");
    append_to_div(parentDiv, button_class, "Copy Language 1");
    append_to_div(parentDiv, button_class, "Copy Language 2");
}

function append_to_div(parentDiv, button_class, text_content){
        const newButton = document.createElement('button');
        newButton.classList.add(button_class);
        newButton.classList.add("RnG7jKTN");

        newButton.textContent = text_content;
        newButton.style.textAlign = 'center';
        newButton.style.justifyContent = 'center';

        newButton.addEventListener('click', async () => { 
            scrollToBottom();
            await sleep(5000);
            copyTextToClipboard(copy_content(text_content));
            scrollToTop();
        });
        parentDiv.appendChild(newButton);
}