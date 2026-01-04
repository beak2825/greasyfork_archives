// ==UserScript==
// @name         GC Avatar Game Scores Helper
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.1
// @description  Notes how many points are needed to earn game avatars on Grundos Cafe.
// @author       sanjix
// @match        https://www.grundos.cafe/games/html5/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555436/GC%20Avatar%20Game%20Scores%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/555436/GC%20Avatar%20Game%20Scores%20Helper.meta.js
// ==/UserScript==

var games = [{name: "Dubloon Disaster", avatar: 'Smuggler', score: "2500"}, {name: "Volcano Run", avatar: 'Volcano Run',  score: "3000"}, {name: "Destruct-O-Match II", avatar: 'Destruct-O-Match',  score: "2500"}, {name: "Meepit Juice Break", avatar: 'A Meepit! Run!',  score: "3500"}, {name: "Exreme Herder", avatar: 'Kacheek - Herder',  score: "250"}, {name: "Meerca Chase", avatar: 'Meerca Chase',  score: "1250"}, {name: "Ice Cream Machine", avatar: 'Ice Cream Machine',  score: "14500"}, {name: "Ultimate Bullseye", avatar: 'Turtum',  score: "100"}, {name: "Carnival of Terror",  avatar: 'Carnival of Terror', score: "725"}, {name: "Advert Attack", avatar: 'Ace Zafara',  score: "800"}, {name: "Sutek's Tomb", avatar: "Sutek\'s Tomb",  score: "2000"}, {name: "Faerie Bubbles", avatar: 'Faerie Bubbles',  score: "2000"}, {name: "Faerie Cloud Racers", avatar: 'Too Fast, Too Furtious',  score: "3150"}, {name: "Korbat's Lab", avatar: 'Creepy Korbat',  score: "7500"}, {name: "Attack of the Revenge", avatar: 'Jacques - Cannoneer!',  score: "1500"}, {name: "Attack of the Revenge", avatar: 'Captain Scarblade',  score: "1550"}, {name: "Zurroball", avatar: 'Zurroball',  score: "9000"}, {name: "Revel Roundup", avatar: 'Revel Roundup',  score: "200"}, {name: "Splat-A-Sloth", avatar: 'Splat-A-Sloth',  score: "2750"}, {name: "Igloo Garage Sale", avatar: 'Igloo Garage Sale - The Game',  score: "1500"}, {name: "Buzzer Game", avatar: 'Techo - The Buzzer Game',  score: "300"}, {name: "Usuki Frenzy", avatar: 'Frenzy!',  score: "620"}, {name: "Web of Vernax", avatar: 'Web Of Vernax',  score: "2250"}, {name: "Hasee Bounce",  avatar: 'Hasee Bounce', score: "300"}, {name: "Hannah and the Pirate Caves", avatar: 'Hannah and the Pirate Caves',  score: "150000"}, {name: "Kass Basher", avatar: 'Kass Basher',  score: "1000"}, {name: "Turmac Roll", avatar: "Turmac Rollin\'",  score: "3000"}, {name: "Kass Basher", avatar: 'Smass Kasher',  score: "8"}, {name: "Magma Blaster",  avatar: 'So anyway, I started blasting...',  score: "900"}, {name: "Jubble Bubble", avatar: 'Jubble Trouble',  score: "2500"}];
var gameInfo = document.querySelector('.games-info .align-right');
var gameTitle = document.querySelector('h1#game-header').textContent;
var thisGame = games.filter((game) => game.name == gameTitle);

for (let i = 0; i < thisGame.length; i++) {
	var avatarScoreInfo = document.createElement('div');
	avatarScoreInfo.classList.add('avatar-info');
	avatarScoreInfo.innerHTML = "<span>Points to earn " + thisGame[i].avatar + "</span> : <strong>" + thisGame[i].score + "</strong>";	
	gameInfo.appendChild(avatarScoreInfo);
}