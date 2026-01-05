// ==UserScript==
// @name        Crafting-Guide Translator
// @description Переводчик Крафтинг-Гайда
// @include     http*://crafting-guide.com*
// @grant       none
// @icon        http://crafting-guide.com/images/favicon.png
// @run-at      document-end
// @version 0.0.1.20150429214416
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/9560/Crafting-Guide%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/9560/Crafting-Guide%20Translator.meta.js
// ==/UserScript==

var ps = document.getElementsByTagName("p");
var h2s = document.getElementsByTagName("h2");
var lis = document.getElementsByTagName("li");
var bts = document.getElementsByTagName("button");
var dvs = document.getElementsByTagName("div");

// Параграфы
for (var p = 0; p < ps.length; p++) {
//Заголовок и основные кнопки
 ps[p].innerHTML = ps[p].innerHTML.replace(/Crafting Guide for Minecraft/g,
                                           "Крафт-руководство для Minecraft");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^Home$/g,
                                           "Главная");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^Configure$/g,
                                           "Настройки");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^Browse$/g,
                                           "Осмотр");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^Craft$/g,
                                           "Крафт");
 ps[p].innerHTML = ps[p].innerHTML.replace(/find an item/g,
                                           "отыскать предмет");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^Feedback$/g,
                                           "Связаться");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^About$/g,
                                           "О нас");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Crafting Guide gives step-by-step tutorials for making anything in Minecraft or its many mods. Just say what\s*you'd like to make, what you already have, it will do the rest, giving you a list of raw materials you need\s*to collect and step-by-step instructions of how much to make of which items in the proper order. You can\s*even ask it to include the materials and instructions for all the tools you'll need along the way!/g,
                                           "Сайт предоставляет пошаговые пояснения, как сделать предметы в Minecraft или его модах. Укажи, что хочешь получить и что уже имеешь – а мы покажем список недостающих исходных материалов и операции по их обработке. В расчёты можно включить и оперативные инструменты!");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^Donate$/g,
                                           "Донат");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Crafting Guide is free for all, but if you find it helpful, donations in any amount are gratefully accepted/g,
                                           "Сайт бесплатен и свободен, и если он вам помог, мы будем благодарны за ответную поддержку");
 ps[p].innerHTML = ps[p].innerHTML.replace(/^Get Involved$/g,
                                           "Втягивайся");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Crafting Guide is completely open-source, and you can help!  Whether you want to write a recipe book \(all\s*simple JSON\), or implement new features, just head over to GitHub to get started/g,
                                           "Сайт полностью опенсорсный и ты можешь ему помочь! Неважно, чем – пополнением рецептов (в JSON) или добавлением возможностей – заходи на GitHub");
// Первая страница
 ps[p].innerHTML = ps[p].innerHTML.replace(/Crafting Guide is the ultimate resource for Minecraft. Whether you're punching trees or building\s*reactors, you'll find Crafting Guide indispensable/g,
                                           "Крафт-руководство – исключительный ресурс для Minecraft. Неважно, пинаете ли вы ещё деревья, или уже возводите реакторы – Крафт-руководство будет незаменимо");
 ps[p].innerHTML = ps[p].innerHTML.replace(/No problem. Crafting Guide can do it all/g,
                                           "Нет проблем. Крафт-руководство покажет всё это");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Configure<\/a><a> which mods you're using, and the entire\s*site will update itself to your mod pack.<\/a>/g,
                                           "Укажите</a>, какие моды вы используете, и весь сайт подстроится под ваш пакет модов");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Browse<\/a><a> through your own customized item catalog to\s*see full recipe lists, related items, recipes added by each tool, and even which items can be\s*made from the item you're looking at.<\/a>/g,
                                           "Просмотрите<\/a> настроенный каталог предметов, найдите полные списки рецептов, связанные предметы, рецепты от каждого инструмента, и даже какие предметы могут быть получены из рассматриваемого сейчас");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Craft<\/a><a> any number of items from your mod pack to see a\s*full list of raw ingredients, and recipe-by-recipe instructions on how to make everything on\s*your list. No item is too complex, and no build is too big.\s*<\/a>/g,
                                           "Создайте<\/a> любое количество предметов из вашего мод-пака, чтобы увидеть список ингредиентов и пошаговые инструкции Не бывает слишком сложных предметов и слишком больших строек");
// Вторая и третья страницы
 ps[p].innerHTML = ps[p].innerHTML.replace(/Mod Pack/g,
                                           "Мод-паки");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Active Mods/g,
                                           "Включенные моды");
// NB не работает
 ps[p].innerHTML = ps[p].innerHTML.replace(/The basic game by itself/g,
                                           "Основная игра");
 ps[p].innerHTML = ps[p].innerHTML.replace(/A technical mod which adds an advanced, computer-based storage system/g,
                                           "Технический мод, добавляющий продвинутую компьютерную систему хранения");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Massive multi-block generators based on Redstone Flux/g,
                                           "Большие многоблочные генераторы, основанные на Redstone Flux");
 ps[p].innerHTML = ps[p].innerHTML.replace(/A technical mod which adds power generation, mining, building and item\/fluid\/power transport systems/g,
                                           "Технический мод, добавляющий энергетику, шахтные, строительные и предметно-жидкостно-энергетические транспортные системы");
 ps[p].innerHTML = ps[p].innerHTML.replace(/This mod offers means to store your items in The END, causing them to be everywhere and nowhere at the same time/g,
                                           "Этот мод позволяет хранить предметы в Эндер-мире - они будут нигде и везде одновременно");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Compact fluid, item, power and redstone conduits, power generation, machinery, remote area access (EnderIO), Dimensional Transceivers, and new armor & tools/g,
                                           "Компактные жидкости, предметы, энергия и редстоун-каналы, энергетика, машиностроение, удаленный доступ к областям (EnderIO), пространственные передатчики, новая броня и инструменты");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Just a bunch of fairly useful things/g,
                                           "Просто куча довольно полезных вещей");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Forestry deals with farming, renewable energy production as well as the breeding of trees, bees and butterflies in Minecraft/g,
                                           "Занимается сельским хозяйством, производством возобновляемых источников энергии, а также разведением деревьев, пчел и бабочек");
 ps[p].innerHTML = ps[p].innerHTML.replace(/This is an older version of Industrial Craft 2 (before the "experimental" rewrite) ported for modern Minecraft versions/g,
                                           "Старая версия ИК2 \(до \"эксперимента\"\), обновлённая до поддержки новых версий Minecraft");
 ps[p].innerHTML = ps[p].innerHTML.replace(/A technical mod adding multi-tiered power systems, mining and ore processing, and powered armor/g,
                                           "Технический мод, добавляющий многоярусные энергосистемы, добычу и переработку руд, а также энергоброню");
 ps[p].innerHTML = ps[p].innerHTML.replace(/A storage mod which adds a number high-capacity chests in various sizes/g,
                                           "Мод для ёмких сундуков различных размеров");
 ps[p].innerHTML = ps[p].innerHTML.replace(/A storage mod aiming at making a better barrel than what is already out there/g,
                                           "Мод для наилучших бочек, чем те, которые уже есть");
 ps[p].innerHTML = ps[p].innerHTML.replace(/A tech mod adding multiple tiers of ore processing and power, a breadth of tools and armor, and robots!/g,
                                           "Технический мод, добавляющий многоярусную переработку руд и энергетику, широкий набор инструментов, брони и роботов!");
 ps[p].innerHTML = ps[p].innerHTML.replace(/An expandable suit of powered armor while nearly infinite expansions, options, and customizations/g,
                                           "Расширяемый набор энергоброни с почти бесконечными дополнениями, опциями и настройкой");
 ps[p].innerHTML = ps[p].innerHTML.replace(/An expansive take on railroading in Minecraft including new rails, carts, machines and tools/g,
                                           "Обширный мод для железнодорожных развлечений - рельс, тележек, машин и инструментов");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Adds multiple tiers of RF-powered Jetpacks and accessories/g,
                                           "Множество Redstone Flux-совместимых джетпаков и аксессуаров");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Adds RF-compatible solar panels in five different tiers/g,
                                           "Пять различных ярусов Redstone Flux-совместимых солнечных панелей");
 ps[p].innerHTML = ps[p].innerHTML.replace(/Adds various kinds of pipes for moving items, fluids and Redstone Flux. Formerly part of/g,
                                           "Различные виды труб для переноса вещей, жидкостей и Redstone Flux. Бывшая часть");
 ps[p].innerHTML = ps[p].innerHTML.replace(/A technical mod which adds ore processing, item transportion, fluid handling, and many new ores/g,
                                           "Технический мод, добавляющий переработку руд и жидкостей, транспортировку вещей и множество новых руд");
// Четвёртая страница
 ps[p].innerHTML = ps[p].innerHTML.replace(/add an item/g,
                                           "добавьте предмет");
};

// Заголовки
for (var h = 0; h < h2s.length; h++) {
// Первая страница
 h2s[h].innerHTML = h2s[h].innerHTML.replace(/^Welcome!$/g,
                                           "Приветствуем!");
 h2s[h].innerHTML = h2s[h].innerHTML.replace(/<a>What's new\?<\/a>/g,
                                           "Что нового?");
// NB новости пока не переводятся
// Четвёртая страница
 h2s[h].innerHTML = h2s[h].innerHTML.replace(/Items to Make/g,
                                           "Предметы-цели");
 h2s[h].innerHTML = h2s[h].innerHTML.replace(/Instructions/g,
                                           "Инструкции");
};

// Списки
for (var l = 0; l < lis.length; l++) {
// Первая страница
 lis[l].innerHTML = lis[l].innerHTML.replace(/Can't remember the recipe for a <a href="\/browse\/buildcraft\/quarry">BuildCraft Quarry<\/a>/g,
                                           "Не помните рецепт для <a href=\"/browse/buildcraft/quarry\">Карьера Билдкрафта</a>");
 lis[l].innerHTML = lis[l].innerHTML.replace(/Curious to see all the blocks added by <a href="\/browse\/railcraft">Railcraft<\/a>/g,
                                           "Интересно увидеть все блоки из <a href=\"/browse/railcraft\">Рэйлкрафта</a>");
 lis[l].innerHTML = lis[l].innerHTML.replace(/Want step-by-step directions for making a full <a href="\/craft\/quantumsuit_bodyarmor:quantumsuit_boots:quantumsuit_helmet:quantumsuit_leggings">IC2 QuantumSuit<\/a>/g,
                                           "Нужна пошаговая инструкция для создания набора <a href=\"/craft/quantumsuit_bodyarmor:quantumsuit_boots:quantumsuit_helmet:quantumsuit_leggings\">Квантовой Брони в ИК2</a>");
};

// Кнопки
for (var b = 0; b < bts.length; b++) {
// Вторая страница
 bts[b].innerHTML = bts[b].innerHTML.replace(/suggest a mod/g,
                                           "запросить мод");
};

// Блоки
for (var d = 0; d < dvs.length; d++) {
// Четвёртая страница
// NB переводит прекрасно, но отламывается скрипт окна поиска блоков
/* dvs[d].innerHTML = dvs[d].innerHTML.replace(/nothing/g,
                                           "ничего");
 if ((dvs[d].className.match("hiding"))&&(dvs[d].innerHTML.match("nothing"))) {
  dvs[d].className = dvs[d].className.replace(/ hiding/g,
                                           "");
 }; */
};