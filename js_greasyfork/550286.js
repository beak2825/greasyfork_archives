// ==UserScript==
// @name         GC Pet Day Training Reminders
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.7
// @description  Adds a closeable banner reminding you to train your pets on each pet day.
// @author       sanjix
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550286/GC%20Pet%20Day%20Training%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/550286/GC%20Pet%20Day%20Training%20Reminders.meta.js
// ==/UserScript==

function reminderState(state, date) {
    this.state = state;
    this.date = date;
}

var petdays = [{species: "Aisha", month: 1, date: 4}, {species: "Gnorbu", month: 1, date: 6}, {species: "Buzz", month: 1, date: 11}, {species: "Elephante", month: 1, date: 16}, {species: "Kacheek", month: 1, date: 29}, {species: "Zafara", month: 2, date: 3}, {species: "Lenny", month: 2, date: 12}, {species: "Techo", month: 2, date: 18}, {species: "Tonu", month: 2, date: 21}, {species: "Mynci", month: 2, date: 22}, {species: "Uni", month: 3, date: 2}, {species: "Gelert", month: 3, date: 6}, {species: "Scorchio", month: 3, date: 14}, {species: "Chomby", month: 3, date: 22}, {species: "Shoyru", month: 4, date: 2}, {species: "Krawk", month: 4, date: 16}, {species: "Lutari", month: 4, date: 19}, {species: "Kougra", month: 4, date: 22}, {species: "Cybunny", month: 4, date: 27}, {species: "Lupe", month: 5, date: 2}, {species: "Hissi", month: 5, date: 8}, {species: "Moehog", month: 5, date: 14}, {species: "Koi", month: 5, date: 22}, {species: "Yurble", month: 5, date: 28}, {species: "JubJub", month: 6, date: 5}, {species: "Quiggle", month: 6, date: 13}, {species: "Nimmo", month: 6, date: 15}, {species: "Kau", month: 6, date: 21}, {species: "Acara", month: 6, date: 28}, {species: "Flotsam", month: 7, date: 3}, {species: "Ixi", month: 7, date: 11}, {species: "Tuskaninny", month: 7, date: 14}, {species: "Kiko", month: 7, date: 17}, {species: "Peophin", month: 7, date: 26}, {species: "Ruki", month: 7, date: 29}, {species: "Blumaroo", month: 8, date: 8}, {species: "Meerca", month: 8, date: 18}, {species: "Grundo", month: 8, date: 24}, {species: "Kyrii", month: 8, date: 29}, {species: "Draik", month: 9, date: 9}, {species: "Chia", month: 9, date: 13}, {species: "Poogle", month: 9, date: 19}, {species: "Skeith", month: 9, date: 25}, {species: "Grarrl", month: 10, date: 3}, {species: "Eyrie", month: 10, date: 7}, {species: "Bori", month: 10, date: 13}, {species: "Jetsam", month: 10, date: 17}, {species: "Korbat", month: 10, date: 26}, {species: "Pteri", month: 11, date: 2}, {species: "Usul", month: 11, date: 27}, {species: "Xweetok", month: 11, date: 29}, {species: "Bruce", month: 12, date: 5}, {species: "Wocky", month: 12, date: 12}, {species: "Ogrin", month: 12, date: 28}];
var today = new Date();
var nstDate = Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles" }).formatToParts(today);
var history = JSON.parse(localStorage.getItem('petdaytrainingreminder')) || new reminderState('grid', nstDate);
//console.log(nstDate);
petdays.forEach((pet) => {
    if (pet.month == parseInt(nstDate[0].value)) {
        if (pet.date == parseInt(nstDate[2].value)) {
            var banner = document.createElement('div');
            banner.id = "pet-day-notif";
            var bannerText = document.createElement('p');
            banner.appendChild(bannerText)
            var closeNotif = document.createElement('a');
            closeNotif.textContent = 'x';
            bannerText.after(closeNotif)
            var page = document.querySelector('#container');

            var bannerDisplay = 'grid';
            //console.log('it is a pet day. the reminder is set to ' + history.state);
            if (history.date[0].value == nstDate[0].value) {
                if (history.date[2].value == nstDate[2].value) {
                    if (history.state == 'none') {
                        bannerDisplay = 'none';
                        //console.log(history)
                    } else {
                        //console.log('not closed yet');
                        bannerDisplay = 'grid';
                    }
                }
                localStorage.setItem('petdaytrainingreminder', JSON.stringify(new reminderState(bannerDisplay, nstDate)));
                //bannerDisplay = history.state;
                document.querySelector('body').insertBefore(banner, page);
                Object.assign(banner.style, {width: "955px", overflowX: "none", padding: "1em 0", display: bannerDisplay, gridTemplateColumns: "1fr 4%", background: "linear-gradient(to right, rgba(255,0,0,.3), rgba(255,255,0,.3), rgba(0,255,255,.3), rgba(0,255,0,.3), rgba(0,0,255,.3), rgba(255,0,255,.3))"})
                bannerText.style.margin = '0';
                bannerText.style.textAlign = 'center';
                bannerText.innerHTML = "🎉 Today is " + pet.species + " day! Don't forget to visit the <a href='/pirates/academy/'>academy</a> for free training! 🎉";
                closeNotif.addEventListener('click', () => {
                    //console.log('closing the reminder');
                    banner.style.display = 'none';
                    localStorage.setItem('petdaytrainingreminder',JSON.stringify(new reminderState('none', nstDate)));
                });
            } else {
                bannerDisplay = 'grid';
                banner.style.display = 'grid';
                localStorage.setItem('petdaytrainingreminder', JSON.stringify(new reminderState(bannerDisplay, nstDate)));
            }
        }
    }});