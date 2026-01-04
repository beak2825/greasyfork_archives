// ==UserScript==
// @name         Pikabu - Другое удаление спонсорских постов
// @license MIT
// @description  Похоже оригинальный перестал работать.Добавлять другие бэйджи или пользователей здесь  var matches = ["ads", "реклама",...];
// @namespace    http://tampermonkey.net/
// @version      2025-12-10
// @author       FirstTry
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557562/Pikabu%20-%20%D0%94%D1%80%D1%83%D0%B3%D0%BE%D0%B5%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BF%D0%BE%D0%BD%D1%81%D0%BE%D1%80%D1%81%D0%BA%D0%B8%D1%85%20%D0%BF%D0%BE%D1%81%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/557562/Pikabu%20-%20%D0%94%D1%80%D1%83%D0%B3%D0%BE%D0%B5%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%BF%D0%BE%D0%BD%D1%81%D0%BE%D1%80%D1%81%D0%BA%D0%B8%D1%85%20%D0%BF%D0%BE%D1%81%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var matches = ["ads", "реклама", "PikabuStudy", "Eduson", "vacancies.pikabu", "Вопрос из ленты «Эксперты»", "Промо", "pikabu.promokody", "Finder", "Synergy.ru", "МойСклад", "ncpo.ru", "Oplatym.ru", "practicum.yandex", "Yandex.Arenda", "pikabu.education", "GPT4Telegrambot"];
    var DelPosts = [];
    //перебираем все посты
    var Posts = document.getElementsByClassName("story");
    for(var i=0, l=Posts.length;i<l;i++){
        //бейджи у поста
        console.log(Posts[i]);
        var PostLabels = Posts[i].getElementsByClassName("story__labels");//
        if (PostLabels[0] && matches.includes(PostLabels[0].textContent.trim())) {
            DelPosts.push(Posts[i]);
            continue;
        }
         //бейджи эксперт
        console.log(Posts[i]);
        PostLabels = Posts[i].getElementsByClassName("story__experts-badge");
        if (PostLabels[0] && matches.includes(PostLabels[0].textContent.trim())) {
            DelPosts.push(Posts[i]);
            continue;
        }
        //автор поста
        var PosttUser = Posts[i].getElementsByClassName("story__user-link user__nick");
        if (PosttUser[0] && matches.includes(PosttUser[0].textContent.trim())) {
            DelPosts.push(Posts[i]);
            continue;
        }
    }
    //удаляем найденные посты
    DelPosts.forEach(Post => {
        //console.log(Post);
        Post.remove();
    });
})();