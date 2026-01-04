// ==UserScript==
// @name                [ALL SERVERS] Новогодний стиль | Скрипт для кураторов форума
// @namespace           https://forum.blackrussia.online
// @version             1.0.0
// @author              Dany_Forbs
// @connection          https://vk.com/kwaazzi
// @updateversion       Создан 05.12.2025
// @match               https://forum.blackrussia.online/threads/*
// @include             https://forum.blackrussia.online/threads/
// @license             MIT
// @icon                https://i.postimg.cc/tRx0hF8P/01fdde7ae0d9dd957948e83fc946ff29.jpg
// @description         Скрипт с новогодним стилем, подходящий для всех серверов, предназначен для быстрой реакции кураторов форума в различных разделах.
// @downloadURL https://update.greasyfork.org/scripts/558009/%5BALL%20SERVERS%5D%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D1%81%D1%82%D0%B8%D0%BB%D1%8C%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558009/%5BALL%20SERVERS%5D%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D1%81%D1%82%D0%B8%D0%BB%D1%8C%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==
 
(function () {
'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const TECH_PREFIX = 13; // Префикс "Тех. специалисту"
    const WAIT_PREFIX = 14; // Префикс "Ожидание"
    const PINBIO_PREFIX = 15; // Префикс "На рассмотрении" для биографий (закреплено + открыто)
    const buttons = [
    {
    title: '------> Раздел Жалоб на игроков <------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Приветствие + свой текст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ (Свой текст) ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]'
},
{
    title: 'ГКФ | ЗГКФ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба передана на рассмотрение Главному/Заместителю Главного Куратора Форума ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Убедительная просьба не создавать копий данной темы ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#4169E1]🎯 ГКФ/ЗГКФ 🎯[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Главному Администратору',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба передана на рассмотрение Главному Администратору ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Убедительная просьба не создавать копий данной темы ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]🎯 Главному Администратору 🎯[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: GA_PREFIX,
    status: true,
},
{
    title: 'Тех. специалисту',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба передана на рассмотрение Техническому специалисту ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Убедительная просьба не создавать копий данной темы ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#4169E1]🎯 Техническому специалисту 🎯[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: TECH_PREFIX,
    status: true,
},
{
    title: 'На рассмотрении',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба взята на рассмотрение ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Убедительная просьба не создавать копий данной темы ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FFD700]🎯 На рассмотрении 🎯[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Запрос док-в на лид-во семьи + ПТ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Предоставьте доказательства того, что Вы являетесь лидером данной семьи ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Только лидер семьи может создавать подобные жалобы ⭐[/COLOR]<br><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Предоставьте доказательства того, что в описании семьи запрещено брать такое количество патронов ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Если Вы не являетесь лидером семьи, отпишите об этом ниже, чтобы закрыть тему ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FFD700]🎯 На рассмотрении 🎯[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: 'Запрос док-в на лид-во семьи без ПТ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Предоставьте доказательства того, что Вы являетесь лидером данной семьи ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Только лидер семьи может создавать подобные жалобы ⭐[/COLOR]<br><br>' +
          '[COLOR=#FFD700]⭐ Если Вы не являетесь лидером семьи, отпишите об этом ниже, чтобы закрыть тему ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FFD700]🎯 На рассмотрении 🎯[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: PINBIO_PREFIX,
    status: true,
},
{
    title: '----> Направить в другие разделы <----',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'В ЖБ на АДМ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба получает статус [COLOR=#FF0000]Отказано[/COLOR] ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Внимательно ознакомившись с Вашей жалобой, было решено, что Вам нужно обратиться ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ в «Раздел жалоб на Администрацию» ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на Тех спец',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба получает статус [COLOR=#FF0000]Отказано[/COLOR] ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Внимательно ознакомившись с Вашей жалобой, было решено, что Вам нужно обратиться ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ в «Раздел жалоб на Технических Специалистов» ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на ЛД',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба получает статус [COLOR=#FF0000]Отказано[/COLOR] ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Внимательно ознакомившись с Вашей жалобой, было решено, что Вам нужно обратиться ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ в «Раздел жалоб на Лидеров» ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'В ЖБ на сотрудников',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Обратитесь в раздел жалоб на сотрудников той или иной организации ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Ваша жалоба направлена не в тот раздел форума ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Пожалуйста, создайте тему в соответствующем разделе ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-------------> Отказ жалоб <-------------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana]' +
          '[img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба составлена не по форме ❄️[/B][/COLOR][/SIZE]<br>' +
          '[COLOR=#FFD700]⭐ Заполните данную форму и подайте новую заявку ⭐[/COLOR]<br><br>' +
          '[INDENT][FONT=Courier New][SIZE=3][B]' +
          '[COLOR=#FF0000]🎁 1.[/COLOR] [COLOR=#FFFFFF]Ваш Nick_Name[/COLOR]<br>' +
          '[COLOR=#FF0000]🎁 2.[/COLOR] [COLOR=#FFFFFF]Nick_Name игрока[/COLOR]<br>' +
          '[COLOR=#FF0000]🎁 3.[/COLOR] [COLOR=#FFFFFF]Суть жалобы[/COLOR]<br>' +
          '[COLOR=#FF0000]🎁 4.[/COLOR] [COLOR=#FFFFFF]Доказательство[/COLOR]' +
          '[/B][/SIZE][/FONT][/INDENT]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нарушения не найдены',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana]' +
          '[img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушения игрока не были обнаружены ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img]' +
          '[/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет в логах',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Проверив систему логирования, нарушение не было обнаружено ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет нарушений',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ На Ваших доказательствах отсутствуют нарушения игрока ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная ЖБ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба составлена неадекватно ❄️[/B][/COLOR][/SIZE]<br>' +
          '[COLOR=#FFD700]⭐ Составьте жалобу адекватно и создайте новую тему ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Условия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Отсутствуют условия сделки или они расписаны не корректно ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не тот сервер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ При составлении жалобы, Вы ошиблись сервером ❄️[/B][/COLOR][/SIZE]<br>' +
          '[COLOR=#FFD700]⭐ Подайте жалобу в раздел Вашего сервера ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Свой сервер Вы можете найти на главной странице форума ⭐[/COLOR]<br><br>' +
          '[URL=https://forum.blackrussia.online/][COLOR=#FFFFFF][U]🎯 Главная страница форума 🎯[/U][/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=#FF0000]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет тайма',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ На Ваших доказательствах отсутствует /time ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет таймкодов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FF0000]🎁 Пример оформления тайм-кодов:[/COLOR]<br>' +
          '[QUOTE][COLOR=#FFFFFF]' +
          '0:25 - Начало нарушения<br>' +
          '1:10 - Демонстрация оружия<br>' +
          '2:30 - Угрозы в сторону игрока<br>' +
          '3:45 - Попытка ограбления<br>' +
          '4:20 - Конец ситуации' +
          '[/COLOR][/QUOTE]<br>' +
          '[COLOR=#FFD700]⭐ Указывайте точное время каждого нарушения для быстрого просмотра ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '3+ дня',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Вашим доказательствам более трёх дней ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша жалоба составлена от третьего лица ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Дубликат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша тема является дубликатом предыдущей ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Дублирование',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ответ на Вашу жалобу был дан в предыдущей теме ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обмен ИВ на BC',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Обменивать Игровую Валюту на Донат Валюту запрещено ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ В последующих случаях это будет приравниваться к пункту правил: ⭐[/COLOR]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.28.[/COLOR] [COLOR=#FFFFFF]Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде [/COLOR][COLOR=#FF0000]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFD700]📌 Примечания:[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• [U]Обмен донат-услуг на игровую валюту запрещен.[/U][/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Нельзя обменивать донат валюту на игровые ценности и наоборот.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Покупка игровой валюты через официальный сайт разрешена.[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Долг отказ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Исходя из общих правил проекта, нарушений от игрока нет ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Подобные долги никак не наказуемые со стороны администрации ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Долги, которые были выданы через трейд, полностью Ваша ответственность ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ По правилам, выдача долга должна быть начислена через банковский счет ⭐[/COLOR]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.57.[/COLOR] [COLOR=#FFFFFF]Запрещается брать в долг игровые ценности и не возвращать их. | [/COLOR][COLOR=#FF0000]Ban 30 дней / permban[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание:[/COLOR] [COLOR=#FFFFFF]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней;[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание:[/COLOR] [COLOR=#FFFFFF]жалоба на должника подается в течение 10 дней после истечения срока займа.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Игрок наказан',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель уже наказан ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Закрыто ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: '--------> Проблемы с док-вами <--------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Нужен фрапс',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В данном случае требуется Видеодоказательство на нарушение от игрока ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Создайте новую тему и прикрепите доказательства в виде видео ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Загрузите видео на хостинги (Rutube, Youtube, Imgur) ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не те док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ NickName в доказательствах не соответствует указанному в жалобе ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Составьте жалобу корректно и создайте новую тему ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва в соц сетях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Загрузка доказательств в соц. сети (ВКонтакте, Instagram) запрещается ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Доказательства должны быть загружены на фото/видео хостинги ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Используйте Rutube, Япикс, Imgur для загрузки доказательств ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва удалены',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Доказательства удалены или недоступны для просмотра ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Недостаточно доказательств',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В Вашей жалобе недостаточно доказательств на нарушение игрока ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ссылка не работает',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ссылка с доказательствами нерабочая ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Проверьте работоспособность ссылки или загрузите на фото/видео хостинги ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Используйте Rutube, Япикс, Imgur для загрузки доказательств ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Напишите новую жалобу с рабочими доказательствами ⭐[COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва отредактированы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Доказательства, которые были отредактированы, могут быть не рассмотрены ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Доказательства с посторонней музыкой не принимаются ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Доказательства с неадекватной речью не принимаются ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Доказательства с нецензурными словами не принимаются ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутвуют док-ва',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В Вашей жалобе не загружены доказательства на нарушение игрока ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Создайте новую жалобу, загрузив доказательства с нарушениями игрока ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Док-ва приватны',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В Вашей жалобе доказательства приватны ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFD700]⭐ Создайте новую жалобу, загрузив доказательства на любой другой хостинг ⭐[/COLOR]<br>' +
          '[COLOR=#FFD700]⭐ Убедитесь, что доказательства общедоступны ⭐[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-----------> Правила форума <-----------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Неадекватное поведение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.02.[/COLOR] [COLOR=#FFFFFF]Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Травля пользователя',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.03.[/COLOR] [COLOR=#FFFFFF]Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Провокация/розжиг конфликта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.04.[/COLOR] [COLOR=#FFFFFF]Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.05.[/COLOR] [COLOR=#FFFFFF]Запрещена совершенно любая реклама любого направления.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '18+',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.06.[/COLOR] [COLOR=#FFFFFF]Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Флуд/оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.07.[/COLOR] [COLOR=#FFFFFF]Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Религия/политика',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.09.[/COLOR] [COLOR=#FFFFFF]Запрещены споры на тему религии/политики.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Помеха развитию проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.14.[/COLOR] [COLOR=#FFFFFF]Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп капсом/транслитом',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.17.[/COLOR] [COLOR=#FFFFFF]Запрещено злоупотребление Caps Lock`ом или транслитом.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Бессмысленный/оск ник ФА',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Пользователь форума будет наказан по пункту правил пользования форумом ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.02.[/COLOR] [COLOR=#FFFFFF]Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '------> Правила Текстового Чата <------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'CapsLock',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.02.[/COLOR] [COLOR=#FFFFFF]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оск/Расизм в OOC',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.03.[/COLOR] [COLOR=#FFFFFF]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Упом/Оск Родни',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.04.[/COLOR] [COLOR=#FFFFFF]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [/COLOR][COLOR=#FF0000]Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'FLOOD',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.05.[/COLOR] [COLOR=#FFFFFF]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп Символами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.06.[/COLOR] [COLOR=#FFFFFF]Запрещено злоупотребление знаков препинания и прочих символов | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Слив Глоб Чатов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.08.[/COLOR] [COLOR=#FFFFFF]Запрещены любые формы «слива» посредством использования глобальных чатов | [/COLOR][COLOR=#FF0000]PermBan.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Выдача себя за адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.10.[/COLOR] [COLOR=#FFFFFF]Запрещена выдача себя за администратора, если таковым не являетесь | [/COLOR][COLOR=#FF0000]Ban 7 - 15 дней[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ввод в заблуждение командами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.11.[/COLOR] [COLOR=#FFFFFF]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [/COLOR][COLOR=#FF0000]Ban 15 - 30 дней / PermBan.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Музыка в Voice чат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.14.[/COLOR] [COLOR=#FFFFFF]Запрещено включать музыку в Voice Chat | [/COLOR][COLOR=#FF0000]Mute 60 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шумы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.16.[/COLOR] [COLOR=#FFFFFF]Запрещено создавать посторонние шумы или звуки | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Политика/Религия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.18.[/COLOR] [COLOR=#FFFFFF]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [/COLOR][COLOR=#FF0000]Mute 120 минут / Ban 10 дней.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Софт для голоса',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.19.[/COLOR] [COLOR=#FFFFFF]Запрещено использование любого софта для изменения голоса | [/COLOR][COLOR=#FF0000]Mute 60 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Транслит',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.20.[/COLOR] [COLOR=#FFFFFF]Запрещено использование транслита в любом из чатов | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама Промо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.21.[/COLOR] [COLOR=#FFFFFF]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [/COLOR][COLOR=#FF0000]Ban 30 дней.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFD700]📌 Примечания:[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Исключение: промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Пример: если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обьявления на тт ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.22.[/COLOR] [COLOR=#FFFFFF]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Мат в VIP чат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.23.[/COLOR] [COLOR=#FFFFFF]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '-----> Правила RolePlay Процесса <-----',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Постороннее ПО',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.22.[/COLOR] [COLOR=#FFFFFF]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [/COLOR][COLOR=#FF0000]Ban 15 - 30 дней / PermBan.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP поведение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.01.[/COLOR] [COLOR=#FFFFFF]Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [/COLOR][COLOR=#FF0000]Jail 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP /edit',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]4.01.[/COLOR] [COLOR=#FFFFFF]Запрещено редактирование объявлений, не соответствующих ПРО | [/COLOR][COLOR=#FF0000]Mute 30 минут[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Эфир',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]4.02.[/COLOR] [COLOR=#FFFFFF]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [/COLOR][COLOR=#FF0000]Mute 30 минут[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Замена текста',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]4.04.[/COLOR] [COLOR=#FFFFFF]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | [/COLOR][COLOR=#FF0000]Ban 7 дней + ЧС организации[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP адвокат',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]3.01.[/COLOR] [COLOR=#FFFFFF]Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий | [/COLOR][COLOR=#FF0000]Warn[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Поимка/арест на тт ОПГ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.16.[/COLOR] [COLOR=#FFFFFF]Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы | [/COLOR][COLOR=#FF0000]Warn[/COLOR]<br>' +
          '[COLOR=#FF0000]Примечание:[/COLOR] [COLOR=#FFFFFF]территория ОПГ — это место, где находятся автопарк криминальной организации и её штаб со складом.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ввод в забл. (ЦБ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]5.02.[/COLOR] [COLOR=#FFFFFF]Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами | [/COLOR][COLOR=#FF0000]Ban 3-5 дней + ЧС организации[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Розыск без причины (УМВД)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]6.02.[/COLOR] [COLOR=#FFFFFF]Запрещено выдавать розыск без IC причины | [/COLOR][COLOR=#FF0000]Warn[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Розыск/штраф без причины (ГИБДД)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]7.02.[/COLOR] [COLOR=#FFFFFF]Запрещено выдавать розыск, штраф без IC причины | [/COLOR][COLOR=#FF0000]Warn[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP поведение (УМВД/ГИБДД/ФСБ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]6.03.[/COLOR] [COLOR=#FFFFFF]Запрещено nRP поведение | [/COLOR][COLOR=#FF0000]Warn[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP ФСИН',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан, исходя из основных правил государственных организаций по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]9.01.[/COLOR] [COLOR=#FFFFFF]Запрещено освобождать заключённых, нарушая игровую логику организации | [/COLOR][COLOR=#FF0000]Warn[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Уход от RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.02.[/COLOR] [COLOR=#FFFFFF]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [/COLOR][COLOR=#FF0000]Jail 30 минут / Warn.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Помеха RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.04.[/COLOR] [COLOR=#FFFFFF]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [/COLOR][COLOR=#FF0000]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP обман(Попытка)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.05.[/COLOR] [COLOR=#FFFFFF]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [/COLOR][COLOR=#FF0000]PermBan.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Аморальные действия',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.08.[/COLOR] [COLOR=#FFFFFF]Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [/COLOR][COLOR=#FF0000]Jail 30 минут / Warn.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обман в /do',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.10.[/COLOR] [COLOR=#FFFFFF]Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [/COLOR][COLOR=#FF0000]Jail 30 минут / Warn[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Фракционный тс в личных целях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.11.[/COLOR] [COLOR=#FFFFFF]Запрещено использование рабочего или фракционного транспорта в личных целях | [/COLOR][COLOR=#FF0000]Jail 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[img]https://i.ibb.co/grLRvQS/image.png[/img]<br><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'DB',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.13.[/COLOR] [COLOR=#FFFFFF]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [/COLOR][COLOR=#FF0000]Jail 60 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'TK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.15.[/COLOR] [COLOR=#FFFFFF]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [/COLOR][COLOR=#FF0000]Jail 60 минут / Warn (за два и более убийства).[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'SK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.16.[/COLOR] [COLOR=#FFFFFF]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [/COLOR][COLOR=#FF0000]Jail 60 минут / Warn (за два и более убийства).[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'MetaGaming',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.18.[/COLOR] [COLOR=#FFFFFF]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [/COLOR][COLOR=#FF0000]Mute 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.19.[/COLOR] [COLOR=#FFFFFF]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [/COLOR][COLOR=#FF0000]Jail 60 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Mass DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.20.[/COLOR] [COLOR=#FFFFFF]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [/COLOR][COLOR=#FF0000]Warn / Ban 3 - 7 дней.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Скрытие багов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.23.[/COLOR] [COLOR=#FFFFFF]Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [/COLOR][COLOR=#FF0000]Ban 15 - 30 дней / PermBan.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Скрытие от адм нарушителей',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.24.[/COLOR] [COLOR=#FFFFFF]Запрещено скрывать от администрации нарушителей или злоумышленников | [/COLOR][COLOR=#FF0000]Ban 15 - 30 дней / PermBan + ЧС проекта.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Вред репутиции проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.25.[/COLOR] [COLOR=#FFFFFF]Запрещены попытки или действия, которые могут навредить репутации проекта | [/COLOR][COLOR=#FF0000]PermBan + ЧС проекта.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Вред ресурсам проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.26.[/COLOR] [COLOR=#FFFFFF]Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [/COLOR][COLOR=#FF0000]PermBan + ЧС проекта.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Реклама соц сетей',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.31.[/COLOR] [COLOR=#FFFFFF]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [/COLOR][COLOR=#FF0000]Ban 7 дней / PermBan.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обман администрации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.32.[/COLOR] [COLOR=#FFFFFF]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [/COLOR][COLOR=#FF0000]Ban 7 - 15 дней.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Уязвимость правил',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.33.[/COLOR] [COLOR=#FFFFFF]Запрещено пользоваться уязвимостью правил | [/COLOR][COLOR=#FF0000]Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Конфликты о национальности',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.35.[/COLOR] [COLOR=#FFFFFF]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [/COLOR][COLOR=#FF0000]Mute 120 минут / Ban 7 дней.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'OOC угрозы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.37.[/COLOR] [COLOR=#FFFFFF]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | [/COLOR][COLOR=#FF0000]Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Расп. личной информации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.38.[/COLOR] [COLOR=#FFFFFF]Запрещено распространять личную информацию игроков и их родственников | [/COLOR][COLOR=#FF0000]Ban 15 - 30 дней / PermBan + ЧС проекта.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Злоуп. нарушениями',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.39.[/COLOR] [COLOR=#FFFFFF]Злоупотребление нарушениями правил сервера | [/COLOR][COLOR=#FF0000]Ban 7 - 15 дней.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFD700]📌 Примечания:[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Исключение: пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.[/COLOR]<br>' +
          '[COLOR=#FFFFFF]• Пример: было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Критика проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.40.[/COLOR] [COLOR=#FFFFFF]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [/COLOR][COLOR=#FF0000]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Drive (30 мин)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.03.[/COLOR] [COLOR=#FFFFFF]Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [/COLOR][COLOR=#FF0000]Jail 30 минут.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FF0000][B]Примечание:[/B][/COLOR] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP Drive (60 мин) [фура/инко]',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.47.[/COLOR] [COLOR=#FFFFFF]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [/COLOR][COLOR=#FF0000]Jail 60 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Аресты в интерьере',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.50.[/COLOR] [COLOR=#FFFFFF]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [/COLOR][COLOR=#FF0000]Ban 7 - 15 дней + увольнение из организации.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'nRP аксессуар',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.52.[/COLOR] [COLOR=#FFFFFF]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [/COLOR][COLOR=#FF0000]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оск адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.54.[/COLOR] [COLOR=#FFFFFF]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [/COLOR][COLOR=#FF0000]Mute 180 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Багаюз с аним',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.55.[/COLOR] [COLOR=#FFFFFF]Запрещается багоюз связанный с анимацией в любых проявлениях. | [/COLOR][COLOR=#FF0000]Jail 120 минут.[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'NRP В/Ч',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.[/COLOR] [COLOR=#FFFFFF]За нарушение правил нападения на Военную Часть выдаётся предупреждение | [/COLOR][COLOR=#FF0000]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ).[/COLOR][/QUOTE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Исп. маскировки в лич. целях (NRP В/Ч)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]16.[/COLOR] [COLOR=#FFFFFF]Участникам криминальных организаций запрещено использовать форму военного и путевой лист в личных целях | [/COLOR][COLOR=#FF0000]Warn NonRP В/Ч[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FF0000][B]Примечание:[/B][/COLOR] участник криминальной организации купил форму военного и путевой лист, скрытно проник на территорию воинской части, но вместо угона камаза для материалов, пошел к складу и добывает материалы для себя.<br>' +
          '[COLOR=#FF0000][B]Примечание:[/B][/COLOR] форма военного и путевой лист предназначены исключительно для угона камаза для материалов.<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Долг одобрен',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]2.57.[/COLOR] [COLOR=#FFFFFF]Запрещается брать в долг игровые ценности и не возвращать их. | [/COLOR][COLOR=#FF0000]Ban 30 дней / permban[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FF0000][B]Примечание:[/B][/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>' +
          '[COLOR=#FF0000][B]Примечание:[/B][/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>' +
          '[COLOR=#FF0000][B]Примечание:[/B][/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Фейк никнейм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нарушитель будет наказан по пункту правил ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]4.10.[/COLOR] [COLOR=#FFFFFF]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [/COLOR][COLOR=#FF0000]Устное замечание + смена игрового никнейма / PermBan.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FF0000][B]Пример:[/B][/COLOR] подменять букву i на L и так далее, по аналогии.<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: '---------> RolePlay Биографии <---------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Биография одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша RolePlay биография получает статус [COLOR=#00AA00]Одобрено[/COLOR] ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша Role Play Биография составлена не по форме ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Создайте новую Биографию по форме.[/COLOR]<br><br>' +
          '[COLOR=#FF0000][B]Форма подачи RP биографии:[/B][/COLOR]<br>'+
          '[QUOTE][COLOR=#FFFFFF]Имя и фамилия персонажа:<br>' +
          'Пол:<br>' +
          'Возраст:<br>' +
          'Национальность:<br>' +
          'Образование:<br>' +
          'Описание внешности:<br>' +
          'Характер:<br>' +
          'Детство:<br>' +    
          'Настоящее время:<br>' +
          'Итог:[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Заголовок Вашей Role Play Биографии не соответствует правилам подачи ❄️[/B][/COLOR][/SIZE]<br><br>'+
          '[QUOTE][COLOR=#FF0000]1.1.[/COLOR] [COLOR=#FFFFFF]Заголовок RP биографии должен быть составлен по следующей форме: Биография | Nick_Name[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша Role Play Биография не соответствует требованиям подачи ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.6.[/COLOR] [COLOR=#FFFFFF]Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В Вашей Role Play Биографии отсутствуют фото и иные материалы ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.7.[/COLOR] [COLOR=#FFFFFF]В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории Вашего персонажа.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Объем инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша RolePlay биография имеет не соответствующий объем информации ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.9.[/COLOR] [COLOR=#FFFFFF]Минимальный объём RP биографии — 200 слов, максимальный — 600.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Логика',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Содержание биографии имеет логические противоречия ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.10.[/COLOR] [COLOR=#FFFFFF]В биографии не должно быть логических противоречий.[/COLOR]<br>' +
          '[COLOR=#FF0000][B]Пример:[/B][/COLOR] [COLOR=#FFFFFF]в пункте «Возраст» Вы указываете, что Вам 16 лет, а дальше описываете, что окончили университет, открыли свой бизнес и зарабатываете миллионы рублей.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Супер способности',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Вы присвоили своему персонажу супер-способности ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В биографии содержится много грамматических ошибок ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Биография скопирована ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Тема не относится к данному разделу ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Биография',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В биографии присутствует нецензурная брань или оскорбления ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP биографий можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/][COLOR=#FFD700]«Правила составления RP биографии»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ответ был дан в предыдущей теме ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '----------> RolePlay Ситуации <----------',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Ситуация одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша RolePlay ситуация получает статус [COLOR=#00AA00]Одобрено[/COLOR] ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Не внутриигр. инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша RolePlay ситуация отражает не внутриигровую информацию ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.1.[/COLOR] [COLOR=#FFFFFF]В RP ситуации должна быть отражена только внутриигровая информация.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В ситуации содержится много грамматических ошибок ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша RolePlay ситуация составлена не по форме ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Создайте новую RP ситуацию по форме.[/COLOR]<br><br>' +
          '[COLOR=#FF0000][B]Форма подачи RP ситуации:[/B][/COLOR]<br>' +
          '[QUOTE][COLOR=#FFFFFF]1. Название:<br>' +
          '2. Пролог: (введение / предыстория)<br>' +
          '3. Сюжет: (основная часть RP ситуации)<br>' +
          '4. Эпилог: (заключение / итоги)<br>' +
          '5. Ссылка на исходные материалы с отыгровками:[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Заголовок Вашей RolePlay ситуации не соответствует правилам подачи ❄️[/B][/COLOR][/SIZE]<br><br>'+
          '[QUOTE][COLOR=#FF0000]1.5.[/COLOR] [COLOR=#FFFFFF]Название темы с RP ситуацией оформляется по форме: [Краткое название события] Событие[/COLOR]<br><br>' +
          '[COLOR=#FF0000][B]Пример:[/B][/COLOR] [COLOR=#FFFFFF][Катастрофа] Взрыв на химическом заводе[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'На фото ООС инфо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ На фото присутствует ООС информация ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.7.[/COLOR] [COLOR=#FFFFFF]Скриншоты не должны содержать OOC-информацию и интерфейс, кроме того, который нельзя убрать системно.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Нет ссылок на RP отыгр',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Нет ссылок на материалы с RP отыгровками ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.8.[/COLOR] [COLOR=#FFFFFF]В конце RP ситуации игрок должен предоставить ссылку на исходные материалы, где видны RP отыгровки.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Шрифт/размер',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ситуация не соответствует требованиям подачи ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.9.[/COLOR] [COLOR=#FFFFFF]RP ситуация должна быть читабельной. Минимальный размер шрифта — 15. Разрешенные шрифты: Verdana, Times New Roman.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ситуация скопирована ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Тема не относится к данному разделу ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная Ситуация',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В ситуации присутствует нецензурная брань или оскорбления ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей RP ситуаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-составления-rp-ситуации.13425780/][COLOR=#FFD700]«Правила составления RP ситуации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ответ был дан в предыдущей теме ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: '-----> Неоф. RolePlay организация <-----',
    dpstyle: 'padding: 8px 20px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 900; color: #FFD700; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, #FF0000 0%, #B22222 30%, #8B0000 70%, #5A0000 100%); border: 3px solid #FFD700; border-radius: 12px; box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -1px 3px rgba(0, 0, 0, 0.3), 0 6px 0 #5A0000, 0 8px 15px rgba(0, 0, 0, 0.6); cursor: pointer; transition: all 0.1s ease; line-height: 1.2; position: relative;'
},
{
    title: 'Орг-ция одобрена',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ваша Неофициальная RolePlay организация получает статус [COLOR=#00AA00]Одобрено[/COLOR] ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[SIZE=5][B][COLOR=#00FF00]✓ Одобрено ✓[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: true,
},
{
    title: 'Меньше 3-х человек',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ У Вас меньше 3-х участников ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FFFFFF]Минимальный состав участников для создания неофициальной RP организации — 3 человека.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Род деят-ти/история',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Не описан род деятельности и(или) история ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FFFFFF]Организация должна иметь чёткий род деятельности и свою историю.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Ошибки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В организации содержится много грамматических ошибок ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Составлена не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Организация составлена не по форме ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Создайте новую организацию по форме.[/COLOR]<br><br>' +
          '[COLOR=#FF0000][B]Форма подачи заявки:[/B][/COLOR]<br>'+
          '[QUOTE][COLOR=#FFFFFF]1. Название Вашей организации:<br>' +
          '2. История создания:<br>' +
          '3. Состав участников:<br>' +
          '4. Устав:<br>' +
          '5. Описание деятельности:<br>' +
          '6. Отличительная визуальная особенность:<br>' +
          '7. Как и где можно попасть в Вашу организацию:<br>' +
          '8. Ссылка на одобренную RP биографию:[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Заголовок организации не соответствует правилам подачи ❄️[/B][/COLOR][/SIZE]<br><br>'+
          '[QUOTE][COLOR=#FF0000]1.8.[/COLOR] [COLOR=#FFFFFF]Название темы должно быть оформлено по шаблону: Неофициальная RP организация [Название][/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Коппипаст',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Организация скопирована ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.5.[/COLOR] [COLOR=#FFFFFF]Запрещено копировать чужие неофициальные RP организации, а также воссоздавать собственные ранее созданные неофициальные RP организации, которые были распущены.[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Орг-я в форме ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Организация создана в форме государственной фракции ❄️[/B][/COLOR][/SIZE]<br><br>'+
          '[QUOTE][COLOR=#FF0000]1.6.[/COLOR] [COLOR=#FFFFFF]Запрещено создавать организации в форме государственных фракций.[/COLOR]<br><br>' +
          '[COLOR=#FF0000][B]Пример:[/B][/COLOR] [COLOR=#FFFFFF]неофициальная RP организация «Росгвардия».[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Осутствуют фото',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В организации отсутствуют фото и иные материалы ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[QUOTE][COLOR=#FF0000]1.10.[/COLOR] [COLOR=#FFFFFF]Заявка на организацию должна сопровождаться фото- или видеоматериалами.[/COLOR]<br><br>' +
          '[COLOR=#FF0000][B]Примечание:[/B][/COLOR] [COLOR=#FFFFFF]скриншоты не должны содержать OOC-информацию и интерфейс (кроме тех элементов, которые невозможно убрать системно).[/COLOR][/QUOTE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Неадекватная неоф. орг-я',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ В организации присутствует нецензурная брань или оскорбления ❄️[/B][/COLOR][/SIZE]<br><br>' +
          '[COLOR=#FFFFFF]Подробнее с правильной подачей неофициальных организаций можете ознакомиться в теме[/COLOR] [URL=https://forum.blackrussia.online/threads/Правила-создания-неофициальной-rp-организации.13425777/][COLOR=#FFD700]«Правила создания неофициальной RP организации»[/COLOR][/URL]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Оффтоп',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Тема не относится к данному разделу ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Повтор',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; background: linear-gradient(to bottom, #228B22, #006400); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(50, 205, 50, 0.6), 0 2px 4px rgba(0, 100, 0, 0.4), inset 0 1px 1px rgba(255, 215, 0, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);',
    content:
          '[CENTER][FONT=Verdana][img]https://i.postimg.cc/hPGk842w/07122021-razdelitnovog-(24).webp[/img]<br><br>' +
          '[SIZE=4][COLOR=#FF0000][B]🎅✨ ДОБРОГО ВРЕМЕНИ СУТОК ✨🎅[/B][/COLOR]<br>' +
          '[COLOR=#FFD700][B]🎄 Уважаемый(-ая) {{ user.mention }} 🎄[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=4][COLOR=#FFFFFF][B]❄️ Ответ был дан в предыдущей теме ❄️[/B][/COLOR][/SIZE]<br><br><hr><br>' +
          '[SIZE=5][B][COLOR=#FF0000]✖ Отказано, закрыто ✖[/COLOR][/B][/SIZE]<br><br>' +
          '[COLOR=#FFD700][B]🌟 Приятной игры на [COLOR=RED]BLACK RUSSIA[/COLOR] 🌟[/B][/COLOR]<br>' +
          '[COLOR=#FFFFFF][I]☃️ С новогодним настроением, администрация сервера! ☃️[/I][/COLOR]<br><br>' +
          '[img]https://i.postimg.cc/Hs4tLb0X/07122021-razdelitnovog-(23).webp[/img][/FONT][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
];
 
$(document).ready(() => {
	$('body').append('<script src=https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js></script>');

	addAnswers();
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
 $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});
 
    function addButton(name, id, style) {
     $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}
 
function buttonsMarkup(buttons) {
	return `
		<div class="select_answer" style="
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			width: 100%;
		">
			${buttons.map((btn, i) => {
				const isHeader = btn.title.includes('---->') || btn.title.includes('———>') || btn.title.includes('------>');
				
				if (isHeader) {
					// Для золотых заголовков - растягиваем на всю ширину с золотыми пунктирными линиями
					return `
					<div style="width: 100%; display: flex; align-items: center; gap: 15px; margin: 8px 0;">
						<div style="flex: 1; border-bottom: 2px dashed #FFD700; opacity: 0.7;"></div>
						<button id="answers-${i}" class="button--primary button rippleButton" 
							style="flex-shrink: 0; margin: 0; ${btn.dpstyle}">
							<span class="button-text">${btn.title}</span>
						</button>
						<div style="flex: 1; border-bottom: 2px dashed #FFD700; opacity: 0.7;"></div>
					</div>`;
				} else {
					// Для обычных золотых кнопок - компактный размер
					return `<button id="answers-${i}" class="button--primary button rippleButton" 
						style="width: auto; margin: 0; ${btn.dpstyle}">
						<span class="button-text">${btn.title}</span>
					</button>`;
				}
			}).join('')}
		</div>
	`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if (send == true) {
		editThreadData(buttons[id].prefix, buttons[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
}
 
	function getThreadData() {
	const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
	const authorName = $('a.username').html();
	const hours = new Date().getHours();
	return {
	user: {
	id: authorID,
	name: authorName,
	mention: `[USER=${authorID}]${authorName}[/USER]`,
	},
  greeting: () =>
	6 < hours && hours <= 12
	  ? 'Доброе утро'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
};
}
 
function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
    // Для PINBIO_PREFIX - тема закреплена, открыта и с префиксом "На рассмотрении"
    if (prefix === PINBIO_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: PIN_PREFIX, // Используем PIN_PREFIX для префикса "На рассмотрении"
                title: threadTitle,
                sticky: 1,           // Закрепление
                discussion_open: 1,  // Тема ОТКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для PIN_PREFIX - тема закреплена, закрыта и с префиксом "На рассмотрении"
    else if (prefix === PIN_PREFIX) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,           // Закрепление
                // discussion_open не передаем - тема ЗАКРЫТА
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для остальных случаев с pin = true
    else if (pin == true) {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                sticky: 1,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
    // Для случаев с pin = false
    else {
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
}
    // Функция для открытой темы (без закрытия)
function editThreadDataOpen(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            discussion_open: 1, // 1 = тема открыта
            sticky: pin ? 1 : 0,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        }),
    }).then(() => location.reload());
}
    
 function getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
            }

// Добавляем кнопку "Префиксы" и выпадающий блок
// Сделать немного более заметными
addButton('Префиксы', 'prefixesToggle', 'border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700; font-family: UtromPressKachat; padding: 8px 16px; background: linear-gradient(to bottom, #B22222, #8B0000); color: #FFD700; font-weight: bold; box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);');

// Создаем блок с кнопками статусов
$('button#prefixesToggle').after(`
    <div id="prefixesBox" style="
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        z-index: 1000;
        margin-top: 5px;
        min-width: 220px;
        display: none;
    ">
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="на рассмотрении" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff7700, #e56a00); color: white;">
                📌 На рассмотрении
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="главному администратору" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff0000, #cc0000); color: white;">
                🔻 Главному Администратору
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="тех специалисту" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #0066ff, #0055dd); color: white;">
                👨‍💻 Тех. специалисту
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="ожидание" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #6c757d, #5a6268); color: white;">
             ⏳ Ожидание
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="одобрено" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #28a745, #218838); color: white;">
                Одобрено ✓
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="отказано" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #dc3545, #c82333); color: white;">
                Отказано ✗
            </button>
            <button type="button" class="button--primary button rippleButton status-btn" 
                data-status="закрыто" 
                style="padding: 10px 15px; font-weight: bold; border: none; border-radius: 5px; cursor: pointer; background: linear-gradient(to bottom, #ff4444, #cc3333); color: white;">
                Закрыто 🔒
            </button>
        </div>
    </div>
`);

// Обработчики для префиксов
$('button#prefixesToggle').click(function(e) {
    e.stopPropagation();
    $('#prefixesBox').toggle();
});

// Обработка кликов по кнопкам статусов
$('.status-btn').click(function() {
    const status = $(this).data('status');
    const PREFIXES = {
        'на рассмотрении': PIN_PREFIX,
        'одобрено': ACCEPT_PREFIX,  
        'отказано': UNACCEPT_PREFIX,
        'ожидание': WAIT_PREFIX,
        'главному администратору': GA_PREFIX,
        'тех специалисту': TECH_PREFIX,
        'закрыто': CLOSE_PREFIX
    };
    
    const prefixId = PREFIXES[status];
    
    // Определяем какие кнопки закрепляют тему (pin = true)
    const PIN_BUTTONS = [
        'на рассмотрении',
        'главному администратору', 
        'тех специалисту',
        'ожидание'
    ];
    
    // Особый случай для кнопки "Ожидание" - открывает тему
    if (status === 'ожидание') {
        editThreadDataOpen(prefixId, true); // pin = true, тема ОТКРЫТА
    } 
    // Остальные кнопки
    else if (PIN_BUTTONS.includes(status)) {
        editThreadData(prefixId, true); // pin = true, тема ЗАКРЫТА
    } else {
        editThreadData(prefixId, false); // pin = false, тема ЗАКРЫТА
    }
    
    $('#prefixesBox').hide();
});

// Закрытие блока при клике вне области
$(document).click(function(e) {
    if (!$(e.target).closest('#prefixesToggle, #prefixesBox').length) {
        $('#prefixesBox').hide();
    }
});

// Предотвращаем закрытие при клике внутри блока
$('#prefixesBox').click(function(e) {
    e.stopPropagation();
});
          })();