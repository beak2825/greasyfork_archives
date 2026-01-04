// ==UserScript==
// @name         Neopets: Move BD Pets to Top
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Moves training pets, as well as favorited pets, to the top of the page in the Academy and Training Schools.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/pirates/academy.phtml?type=status
// @match        *://*.neopets.com/island/training.phtml?type=status
// @match        *://*.neopets.com/island/fight_training.phtml?type=status
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/557852/Neopets%3A%20Move%20BD%20Pets%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/557852/Neopets%3A%20Move%20BD%20Pets%20to%20Top.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    The script "Move Training Pets To Top" works perfectly well but I needed favorites.

    This script does the following in the training schools/academy's status pages:
    - Orders pets by these statuses: Completed training > Awaiting payment > Not training > Currently training
    - Allows you to favorite a pet
        - Favorite pets are not synchronized; you can favorite one pet in the Academy but not in the School.
    - Moves favorite pets to the top of each status
        - If you'd like favorite pets to be the first status instead, change favoritePetsOnAbsoluteTop to true
    - Scrolls your page to a pet's new location once you favorite/unfavorite them
        - Change scrollWithPet to false if you don't want that to happen

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

// Move favorites to the topas if it were its own status
const favoritePetsOnAbsoluteTop = true;
// Scroll the page to the new location of a pet whenever its status (and consequently position in page) changes
const scrollWithPet = true;

const fav = '☆ Favorite';
const unfav = '★ Unfavorite';

const statusChecks = [
    // Training complete
    // TODO
    // () => true,
    // Awaiting payment
    pet => pet.children[1].querySelector('input[value="pay"]'),
    // Not currently training
    pet => pet.children[1].children.length === 0,
    // Currently training
    pet => pet.children[1].querySelector('td:last-child > br + b')
];

const getFavorites = () => GM.getValue(`favorites-${window.location.href.match(/(\w+)\.phtml/)[1]}`, {});

const compare = (a, b) => {
    const favoriteComparison = a.isFavorite - b.isFavorite;
    const statusComparison = b.status - a.status;
    return favoritePetsOnAbsoluteTop ? favoriteComparison || statusComparison : statusComparison || favoriteComparison;
}

const addButton = (title, petname, isFavorite) => {
    const sibling = title.querySelector('td');
    title.insertAdjacentHTML('beforeEnd', `<td bgcolor="${sibling.bgColor}" style="text-align:right"><a data-petname="${petname}" role="button" href="javascript:void(0)" class="saah-favorite-pet">${isFavorite ? unfav : fav}</a></td>`);
    sibling.removeAttribute('colspan');
    title.getElementsByClassName('saah-favorite-pet')[0].addEventListener('click', toggleFavorite);
}

const walkRows = (favorites, isFirstSort) => {
    const rows = document.querySelectorAll('table[width="500"] > tbody > tr');
    const orderedRows = [];
    for (let i = 0; i < rows.length; i += 2) {
        const [title, info] = [rows[i], rows[i + 1]];
        const petName = title.textContent.match(/\w+/)[0];
        const isFavorite = favorites[petName] ?? 0;
        const status = statusChecks.findIndex(check => check(info));
        if(isFirstSort) addButton(title, petName, isFavorite);
        orderedRows.push({isFavorite, status, title, info});
    }
    return orderedRows;
}

const sortRows = (favorites, isFirstSort) => {
    const orderedRows = walkRows(favorites, isFirstSort);
    orderedRows.sort(compare);
    const parent = document.querySelector('table[width="500"] > tbody');
    orderedRows.forEach(row => {
        parent.prepend(row.info);
        parent.prepend(row.title);
    });
}

const toggleFavorite = async event => {
    event.target.textContent = (event.target.textContent === fav ? unfav : fav);
    const favorites = await getFavorites();
    if(favorites[event.target.dataset.petname]) delete favorites[event.target.dataset.petname];
    else favorites[event.target.dataset.petname] = true;
    GM.setValue(`favorites-${window.location.href.match(/(\w+)\.phtml/)[1]}`, favorites);
    sortRows(favorites, false);
    if(scrollWithPet) event.target.scrollIntoView({behavior: 'smooth', block: 'start'});
}

(async function() {
    'use strict';
    const favorites = await getFavorites();
    sortRows(favorites, true);
})();
