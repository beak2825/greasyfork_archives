// ==UserScript==
// @name         скрипт 
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Скрипт
// @author       Vania
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/561228/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/561228/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
	title: 'Приветсвие',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'текст <br><br>' +
    'Закрыто. [/FONT][/SIZE]',
 },
{

    	title: 'Ссылку на вк',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Приложите в следующей теме ссылку на вашу VK Страницу. <br><br>' +
    'Закрыто. [/FONT][/SIZE]',
    	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Свяжитесь со мной',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Свяжитесь со мной вконтакте: https://vk.com/slavacadov<br><br>" +
	'На рассмотрении.[/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'ᅠ ᅠ ᅠ ᅠ  ᅠ ᅠ ᅠ ᅠ     ᅠ ᅠ ᅠᅠ|-(--(-(-> Жалобы на администрацию <-)-)--)-|ᅠ ᅠ ᅠ    ᅠ ᅠᅠ ᅠ ᅠ ᅠ   ᅠ ᅠ ᅠᅠ',
},
{
	title: 'На рассмотрении',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша жалоба принята на рассмотрение. Ожидайте ответа. Просим не создавать дубликаты темы.<br><br>' +
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Ссылку на тему',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Приложите, пожалуйста, ссылку на тему в следующем обращении.<br><br>' +
	'Отказано. Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жалоба составлена не по форме',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалобы: [URL=\'https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/\']*Клик*[/URL]<br><br>' +
	'Название темы: Nick_Name администратора | Суть жалобы<br><br>' +
	'Форма:<br>[ICODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата:<br>4. Суть жалобы:<br>5. Доказательства:[/ICODE]<br><br>' +
	'Отказано. Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Запрос доказательств',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'У администратора были запрошены доказательства. Ожидайте, пожалуйста, ответа.<br><br>' +
	'На рассмотрении.[/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Наказание выдано верно',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Доказательства предоставлены. Наказание выдано верно.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Отсутствуют доказательства',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Приложите доказательства в следующей теме.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    	title: 'Нерабочие доказательства',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Вы приложили нерабочие доказательства.<br>В следующей теме приложите рабочие доказательства в виде ссылки на фотохостинг.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Ошибка администратора',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Администратор допустил ошибку. Приносим извинения. Наказание снято.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Беседа с администратором',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'С администратором будет проведена профилактическая беседа.<br><br>' +
	'Решено.[/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Передача Главному Администратору',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша жалоба передана Главному Администратору.<br><br>' +
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: MAINADM_PREFIX,
	status: true,
},
{
	title: 'Передача Спец. Администрации',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша жалоба передана Специальной Администрации.<br><br>' +
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: SPECADM_PREFIX,
	status: true,
},
{
	title: 'В тех раздел',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша тема не относится к жалобам на администрацию. Пожалуйста, обратитесь в технический раздел форума.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жалоба от третьего лица',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Жалоба подана от третьего лица и не подлежит рассмотрению.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Отсутствует /time',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'В представленном доказательстве отсутствует /time.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Срок подачи жалобы истёк',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'С момента выдачи наказания прошло более 48 часов. Жалоба не подлежит рассмотрению.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Обжалование наказаний',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша жалоба относится к обжалованию наказания. Обратитесь, пожалуйста, в соответствующий раздел.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Недостаточно доказательств',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Недостаточно доказательств нарушения со стороны администратора.<br><br>' +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
  },
  {
    title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ   ᅠ ᅠ ᅠᅠ|-(--(-(-> Обжалование наказаний <-)-)--)-| ᅠ ᅠ ᅠ  ᅠ   ᅠ   ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠᅠᅠ',
  },
  {
    title: 'Обжалование на рассмотрении',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ваше обжалование взято на рассмотрение. Не нужно создавать копии этой темы.<br><br>' +
      'Ожидайте ответа.[/FONT]',
    prefix: PIN_PREFIX,
    status: true,
  },
  {
    title: 'Передача ГА',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ваше обжалование передано Главному Администратору.<br><br>' +
      'Ожидайте ответа.[/FONT][/SIZE]',
    prefix: MAINADM_PREFIX,
    status: true,
  },
  {
    title: 'Передача СА',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ваше обжалование передано Специальной Администрации.<br><br>' +
      'Ожидайте ответа.[/FONT][/SIZE]',
    prefix: SPECADM_PREFIX,
    status: true,
  },
  {
    title: 'В жалобы на админов',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Переношу вашу тему в раздел жалоб на администрацию.[/FONT][/SIZE]',
  },
  {
    title: 'Взлом',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Приложите скриншоты привязок аккаунта в следующей теме.<br><br>' +
      'Отказано.[/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В жалобы на тех',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Вам было выдано наказание от технического специалиста, обратитесь в раздел "Жалобы на технических специалистов" нашего сервера.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Жалобы от 3-его лица',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Обжалование составлено от 3-го лица.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Присутвуют редактирования',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Доказательства должны быть в первоначальном виде, без присутствия редактирования с помощью сторонних программ.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Нет окна блокировки',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Без окна блокировки тема не подлежит рассмотрению. Пожалуйста, создайте новую тему и приложите окно блокировки с фотохостинга.<br>' +
      '[URL="https://yapx.ru/"]yapx.ru[/URL],<br>' +
      '[URL="https://imgur.com/"]imgur.com[/URL],<br>' +
      '[URL="https://www.youtube.com/"]youtube.com[/URL],<br>' +
      '[URL="https://imgbb.com"]ImgBB.com[/URL]<br>(все кликабельно).<br><br>' +
      'Закрыто.[/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Обжалование не по форме',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ваше обжалование составлено не по форме. Пожалуйста создайте новую тему, соблюдая форму подачи:<br>Ваш никнейм и причина блокировки, пример:<br>Bruce_Banner | Массовый DM.<br>и форму обжалований:<br>[ICODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/ICODE]<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Доква с соц сетей',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Доказательства с соц.сетей, не принимаются.<br>Загрузите их на фото-хостинг [URL="https://yapx.ru/"]yapx.ru[/URL], [URL="https://imgur.com/"]imgur.com[/URL], [URL="https://www.youtube.com/"]youtube.com[/URL],[URL="https://imgbb.com"]ImgBB.com[/URL](все кликабетильно).<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'В другой раздел',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Созданная тема никоим образом не относится к данному разделу.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Бан айпи',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Для решения проблемы, пожалуйста, воспользуйтесь VPN или смените сеть Wi-Fi.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: CLOSE_PREFIX,
    status: false,
  },
  {
    title: 'Дубликат',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ранее вам уже был дан ответ в подобной теме.<br>Если вы продолжите создавать дубликаты, ваш форумный аккаунт будет заблокирован.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'НонРП Обман (свяжитесь)',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Если вы готовы возместить ущерб игроку, свяжитесь с игроком для возврата имущества, затем он должен оформить обжалование.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
                title: 'НонРП Обман (срок вышел)',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'У вас было 24 часа на проведение сделки и возмещение ущерба, а также предоставление записи (Fraps).<br>Срок истёк, однако фрапс так и не был предоставлен.<br>В связи с этим аккаунт будет заблокирован.<br><br>' +
      'Закрыто.[/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
          title: 'НонРП Обман (даю 24 часа)',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Аккаунт разблокирован.<br>У вас есть 24 часа для проведения сделки и возмещения ущерба.<br>После этого обязательно предоставьте запись (Fraps) в эту тему.<br><br>' +
      'Закрыто.[/FONT]',
	prefix: PIN_PREFIX,
  },
  {
    title: 'Наказание снято',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Рассмотрев ваше обжалование, было принято решение о снятии вашего наказания.<br><br>' +
      'Одобрено, закрыто.[/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'ЧС Сервера',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Вы были вынесены из Чёрного Списка Сервера.<br><br>' +
      'Одобрено.[/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'ОЧСА',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Общий Чёрный Список Администрации снят.<br><br>' +
      'Одобрено.[/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'ОЧСП',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Общий Чёрный Список Проекта снят.<br><br>' +
      'Одобрено.[/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'ЧСДП',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Глобальная блокировка снята.<br><br>' +
      'Одобрено.[/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Блокировка аккаунта',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Блокировка аккаунта снята.<br><br>' +
      'Одобрено.[/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'ранее был обжалован',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Вам уже было одобрено обжалование.<br><br>' +
      'Закрыто.[/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Обжалованию не подлежит',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ваше обжалование не будет рассматриваться и будет закрыто, так как ваше наказание соответствует причинам, которые обжалованию не подлежат: различные формы слива, продажа игровой валюты, махинации, целенаправленный багоюз, продажа, передача аккаунта, сокрытие ошибок, багов системы, использование стороннего программного обеспечения, распространение конфиденциальной информации, обман администрации.<br><br>' +
      'Отказано.[/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Отказано',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'В обжаловании отказано.<br><br>' +
      'Закрыто.[/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Наказание сокращено',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания.<br><br>' +
      'Одобрено.[/FONT][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Server',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Спасибо за обращение, блокировка снята.<br><br>' +
      'Закрыто.[/FONT][/SIZE]',
    prefix: RASSMOTRENO_PREFIX,
    status: false,
  },
  {
    title: 'Слив админки (бан)',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Спасибо за обращение, администратор был снят с поста и занесён в Общий чёрный список проекта. Блокировка снята. <br><br>' +
      'Закрыто.[/FONT][/SIZE]',
    prefix: RASSMOTRENO_PREFIX,
    status: false,
  },
  {
    title: 'Слив админки (мут)',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Спасибо за обращение, администратор был снят с поста и занесён в Общий чёрный список проекта. Блокировка чата снята. <br><br>' +
      'Закрыто.[/FONT][/SIZE]',
    prefix: RASSMOTRENO_PREFIX,
    status: false,
  },
  {
    title: 'Слив админки (варн)',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Спасибо за обращение, администратор был снят с поста и занесён в Общий чёрный список проекта. Предупреждение снято. <br><br>' +
      'Закрыто.[/FONT][/SIZE]',
    prefix: RASSMOTRENO_PREFIX,
    status: false,
  },
  {
    title: 'Смена ника',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Аккаунт разблокирован. У вас есть 24 часа на смену игрового никнейма. После смены, пожалуйста, предоставьте скриншот в этой теме. Тема остаётся открытой.<br><br>' +
      'На рассмотрении.[/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
  },
  {
          title: 'Не сменил ник',
    content:
      '[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
      'Ваш аккаунт был заблокирован. У вас было 24 часа на смену игрового никнейма, а также необходимо было приложить скриншот, подтверждающий смену никнейма, в данную тему.<br><br>' +
      'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
    },
{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ   ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ|-(--(-(-> ДОП <-)-)--)-| ᅠ ᅠ ᅠ  ᅠ      ᅠ ᅠ ᅠ  ᅠ ᅠᅠ   ᅠᅠ ᅠ ᅠᅠᅠ',
},
{
    	title: 'Главному модеру',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Передано на рассмотрение Руководителю Модерации.<br><br>" +
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
    },
{
        	title: 'Сменить WIFI/VPN',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Воспользуйтесь VPN или смените сеть WIFI.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
    },
{
    	title: 'Бан снятие',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Блокировка будет снята в течении 24х часов.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
    },
{
    	title: 'Нет нарушений у адм',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Нарушений со стороны администратора не найдены.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false
        },
{
    title: 'НонРп обман (с фа который подал жб)',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Обжалование должно быть написано с форумного аккаунта, с которого была написана жалоба на данного игрока.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
        },
{
    	title: 'Доступ закрыт',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Доступ к доказательствам закрыт.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
        },
{
},
];
 
 
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Специальному Администратору💥', 'specadm');
    addButton('Теху', 'Texy');
	addButton('Главному Администратору💥', 'mainadm');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
	addButton('Ответы💥', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
 
 
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
	buttons.forEach((btn, id) => {
	if (id > 0) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});
 
	function addButton(name, id) {
	$('.button--icon--reply').before(
	`<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
	);
	}
 
	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
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
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}
 
	function editThreadData(prefix, pin = false) {
	// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
	if (pin == false) {
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
	if (pin == true) {
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
	}
 
	function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
	}
	})();
 
 
 