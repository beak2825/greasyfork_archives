// ==UserScript==
// @name         BrainRacing - Custom Car Skins
// @namespace    brainslug.torn.racing
// @version      0.1.2
// @description  Allows you to set custom car skins as decoration, sets the old skins by default
// @author       Brainslug [2323221]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551692/BrainRacing%20-%20Custom%20Car%20Skins.user.js
// @updateURL https://update.greasyfork.org/scripts/551692/BrainRacing%20-%20Custom%20Car%20Skins.meta.js
// ==/UserScript==

// only class A cars for now (and the Cosworth ofc) 
const cars = {
    "Citroen Saxo": "https://race-skins.brainslug.nl/assets/4af4abb4-e42a-4879-a516-7cb65c420506",
    "Classic Mini": "https://race-skins.brainslug.nl/assets/256e3053-28e9-4fbc-8929-c18ae6b3f5eb",
    "Sierra Cosworth": "https://race-skins.brainslug.nl/assets/02b4975d-2160-4201-afee-6765e2b18178",
    "Aston Martin One-77": "https://race-skins.brainslug.nl/assets/aeabf607-b50d-48d1-891d-50f590c1fb16",
    "Audi R8": "https://race-skins.brainslug.nl/assets/6988640b-ba4c-4a53-9870-54860859e1df",
    "Bugatti Veyron": "https://race-skins.brainslug.nl/assets/7484c915-a396-4d10-a36b-536ff180b85c",
    "Ferrari 458": "https://race-skins.brainslug.nl/assets/605e096d-7afb-4e76-958a-c812e229ec8c",
    "Lamborghini Gallardo": "https://race-skins.brainslug.nl/assets/f86a3ccd-3e7d-4348-8bb9-2f0d73c8ba21",
    "Lexus LFA": "https://race-skins.brainslug.nl/assets/39d18d23-7e7a-492f-b4f2-9c45b1268c74",
    "Mercedes SLR": "https://race-skins.brainslug.nl/assets/ac6caae6-de17-4467-96cf-61d7a1148328",
    "Nissan GT-R": "https://race-skins.brainslug.nl/assets/f0a4c154-b5cb-45d8-8312-6261c20659bf",
    "Honda NSX": "https://race-skins.brainslug.nl/assets/ae1c1063-8484-4994-b594-73d75cef8dbb",
    "Ford GT40": "https://race-skins.brainslug.nl/assets/f855cb1c-c351-4a26-80aa-1ad850c89dff"
}

const matchCar = (name) => $([
    `span.img[title="${name}"] > img:not(.replaced)`, // active race big image
    `img[title="${name}"]:not(.replaced)`, // active race small image
    `img[title="\'${name}\'"]:not(.replaced)`, // your cars page
    `.car > img[title^="${name}"]:not(.replaced)`, // records page and past races
].join(','));

function updateImages() {
    for (const [name, img] of Object.entries(cars)) {
        const images = matchCar(name);
        if (images.length > 0) {
            images.each((i, image) => {
                image.removeAttribute('srcset');
                image.setAttribute('src', img);
                image.classList.add('replaced');
            });
        }
    }
}

const mainWindow = $('#racingMainContainer');
if (mainWindow.length > 0) {
    const observer = new MutationObserver(() => {
        updateImages();
    });

    observer.observe(mainWindow[0], { subtree: true, childList: true });
    updateImages();
}