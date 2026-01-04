// ==UserScript==
// @name         NextDNS Russian Translation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Перевод личного кабинета пользователя NextDNS на русский язык.
// @homepageURL  https://gist.github.com/smi-falcon/9888b8c876e6ec3d54618c6d1128224c
// @supportURL   https://github.com/smi-falcon
// @author       Falcon
// @match        https://my.nextdns.io/*
// @exclude      https://nextdns.io/*
// @icon         https://nextdns.io/favicon.ico
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/553095/NextDNS%20Russian%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/553095/NextDNS%20Russian%20Translation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Словарь переводов
    const translations = {
        // Общие элементы
        'Account': 'Учетная запись',
        'Active': 'Активно',
        'Add': 'Добавить',
        'Allowlist': 'Белый список',
        'Analytics': 'Аналитика',
        'Apps': 'Приложения',
        'Beta': 'Бета',
        'Cancel': 'Отмена',
        'Delete': 'Удалить',
        'Denylist': 'Черный список',
        'Disable': 'Выключить',
        'Edit': 'Редактировать',
        'Enable': 'Включить',
        'Entries': 'Записи',
        'Help': 'Помощь',
        'ID': 'ID',
        'Inactive': 'Неактивно',
        'Log out': 'Выход',
        'Logs': 'Логи',
        'Name': 'Имя',
        'New': 'Новый',
        'Or': 'Или',
        'Parental Control': 'Родительский контроль',
        'Popularity': 'Популярные',
        'Privacy': 'Конфиденциальность',
        'Recent': 'Недавние',
        'Recommended': 'Рекомендуемое',
        'Remove': 'Удалить',
        'Save': 'Сохранить',
        'Security': 'Безопасность',
        'Settings': 'Настройки',
        'Setup': 'Настройка',
        'Status': 'Статус',
        'Theme': 'Тема',

        // Страница настройки (/setup)
        'Append the name to the provided URL (the name should be URL encoded).': 'Добавьте имя к предоставленному URL-адресу (имя должно быть закодировано в формате URL).',
        'Automatic setup': 'Автоматическая настройка',
        'Configuration ID': 'ID конфигурации',
        'Configure DDNS': 'Настройка DDNS',
        'Configure your device': 'Настройте ваше устройство',
        'DDNS hostname': 'Имя хоста DDNS',
        'Device name': 'Имя устройства',
        'Download configuration': 'Скачать конфигурацию',
        'Enable "Send Device Name" in the app settings.': 'Включите функцию «Отправить название устройства» в настройках приложения.',
        'Endpoints': 'Конечные точки',
        'Follow the instructions below to identify your devices in Analytics and Logs.': 'Следуйте инструкциям ниже, чтобы определить свои устройства в Analytics и Logs.',
        'Follow the instructions below to set up NextDNS on your device, browser or router.': 'Следуйте инструкциям ниже, чтобы настроить NextDNS на вашем устройстве, в браузере или на маршрутизаторе.',
        'Identify your devices': 'Определите свои устройства',
        'If you are unable to set up NextDNS using our apps, DNS-over-TLS, DNS-over-HTTPS or IPv6, then use the DNS servers below and link your IP. This is mostly for use on home networks and not recommended on mobile.': 'Если вы не можете настроить NextDNS с помощью наших приложений, DNS-over-TLS, DNS-over-HTTPS или IPv6, используйте DNS-серверы, указанные ниже, и свяжите свой IP-адрес. Это в основном предназначено для использования в домашних сетях и не рекомендуется для мобильных устройств.',
        'Linked IP': 'Связанный IP',
        'Manual setup': 'Ручная настройка',
        'Not sure how to use those? Follow the': 'Не знаете, как их использовать? Следуйте  ',
        'Prepend the name to the provided domain (the name should only contain a-z, A-Z, 0-9 and -). Use -- for spaces.': 'Добавьте имя к указанному домену (имя должно содержать только символы a-z, A-Z, 0-9 и -). Для пробелов используйте --.',
        'Set up NextDNS with this profile using one of the endpoints below.': 'Настройте NextDNS с этим профилем, используя одну из конечных точек ниже.',
        'Setup Guide': 'Руководство по настройке',
        'Show advanced options': 'Показать дополнительные параметры',
        'This device is currently using ”Cloudflare” as DNS resolver.': 'Это устройство в настоящее время использует «Cloudflare» в качестве DNS-резолвера.',
        'This device is not using NextDNS.': 'Это устройство не использует NextDNS.',
        'Use our Apple Configuration Profile Generator available at apple.nextdns.io.': 'Воспользуйтесь нашим генератором профилей конфигурации Apple, доступным по адресу apple.nextdns.io.',
        'You can also programmatically update your linked IP by calling:': 'Вы также можете программно обновить связанный IP-адрес, вызвав:',
        'You can use Dynamic DNS (DDNS) to have your linked IP updated automatically.': 'Вы можете использовать динамический DNS (DDNS), чтобы ваш связанный IP-адрес обновлялся автоматически.',

        // Страница безопасности (/security)
        'AI-Driven Threat Detection': 'Обнаружение угроз на основе искусственного интеллекта',
        'AI-Powered Threat Detection': 'AI-обнаружение угроз',
        'Add a TLD': 'Добавить TLD',
        'Block Child Sexual Abuse Material': 'Блокировка материалов, содержащих сексуальное насилие над детьми',
        'Block domains known to distribute malware, launch phishing attacks and host command-and-control servers using a blend of the most reputable threat intelligence feeds — all updated in real-time.': 'Блокируйте домены, известные распространением вредоносных программ, запуском фишинговых атак и размещением командных серверов, используя сочетание самых авторитетных источников информации об угрозах, которые обновляются в режиме реального времени.',
        'Block domains that impersonate other domains by abusing the large character set made available with the arrival of Internationalized Domain Names (IDNs) — e.g. replacing the Latin letter "e" with the Cyrillic letter "е".': 'Блокируйте домены, которые выдают себя за другие домены, злоупотребляя большим набором символов, доступным с появлением интернационализированных доменных имен (IDN) — например, заменяя латинскую букву «e» кириллической буквой «е».',
        'Block domains generated by Domain Generation Algorithms (DGAs) seen in various families of malware that can be used as rendezvous points with their command and control servers.': 'Блокируйте домены, сгенерированные алгоритмами генерации доменов (DGA), которые встречаются в различных семействах вредоносных программ и могут использоваться в качестве точек встречи с их командными и контрольными серверами.',
        'Block domains registered by malicious actors that target users who incorrectly type a website address into their browser — e.g. gooogle.com instead of google.com.': 'Блокируйте домены, зарегистрированные злоумышленниками, которые нацелены на пользователей, которые неправильно вводят адрес веб-сайта в браузере — например, gooogle.com вместо google.com.',
        'Block domains registered less than 30 days ago. Those domains are known to be favored by threat actors to launch malicious campaigns.': 'Блокируйте домены, зарегистрированные менее 30 дней назад. Эти домены, как известно, предпочитают использовать злоумышленники для запуска вредоносных кампаний.',
        'Block Dynamic DNS Hostnames': 'Блокировать динамические DNS-имена хостов',
        'Block Malware': 'Блокировать вредоносное ПО',
        'Block millions of threats detected by our AI technology — a proprietary AI engine designed from the ground up for DNS with hundreds of signals, terabytes of training data and real-time decision making.': 'Блокируйте миллионы угроз, обнаруженных нашей технологией искусственного интеллекта — запатентованным механизмом искусственного интеллекта, разработанным с нуля для DNS с сотнями сигналов, терабайтами обучающих данных и принятием решений в режиме реального времени.',
        'Block malware and phishing domains using Google Safe Browsing — a technology that examines billions of URLs per day looking for unsafe websites. Unlike the version embedded in some browsers, this does not associate your public IP address to threats and does not allow bypassing the block.': 'Блокируйте вредоносные и фишинговые домены с помощью Google Safe Browsing — технологии, которая ежедневно проверяет миллиарды URL-адресов в поисках небезопасных веб-сайтов. В отличие от версии, встроенной в некоторые браузеры, эта технология не связывает ваш публичный IP-адрес с угрозами и не позволяет обойти блокировку.',
        'Block New Domains': 'Блокировать новые домены',
        'Block Newly Registered Domains (NRDs)': 'Блокировать вновь зарегистрированные домены (NRD)',
        'Block Parked Domains': 'Блокировать припаркованные домены',
        'Block Phishing': 'Блокировать фишинг',
        'Block Top-Level Domains (TLDs)': 'Блокировка доменов верхнего уровня (TLD)',
        'Block all domains and subdomains belonging to specific TLDs.': 'Блокировать все домены и субдомены, принадлежащие определенным TLD.',
        'Cryptojacking Protection': 'Защита от криптоджекинга',
        'DNS Rebinding Protection': 'Защита от переподключения DNS',
        'Domain Generation Algorithms (DGAs) Protection': 'Защита от алгоритмов генерации доменов (DGA)',
        'Enable AI-Driven Threat Detection': 'Включить обнаружение угроз на основе искусственного интеллекта',
        'Enable Cryptojacking Protection': 'Включить защиту от криптоджекинга',
        'Enable DGA Protection': 'Включить защиту DGA',
        'Enable DNS Rebinding Protection': 'Включить защиту от переподключения DNS',
        'Enable Google Safe Browsing': 'Включить безопасный просмотр Google',
        'Enable Homograph Attacks Protection': 'Включить защиту от гомографических атак',
        'Enable Typosquatting Protection': 'Включить защиту от тайпосквоттинга',
        'Google Safe Browsing': 'Безопасный просмотр Google',
        'IDN Homograph Attacks Protection': 'Защита от атак с использованием омографов IDN',
        'Prevent attackers from taking control of your local devices through the Internet by automatically blocking DNS responses containing private IP addresses.': 'Предотвратите попытки злоумышленников получить контроль над вашими локальными устройствами через Интернет, автоматически блокируя DNS-ответы, содержащие частные IP-адреса.',
        'Prevent the unauthorized use of your devices to mine cryptocurrency.': 'Предотвратите несанкционированное использование ваших устройств для майнинга криптовалюты.',
        'Parked domains are single-page websites often laden with ads and devoid of any value. Parked domain monetization can sometimes get mixed up with suspicious practices and malicious content.': 'Паркованные домены — это одностраничные веб-сайты, часто переполненные рекламой и не имеющие никакой ценности. Монетизация паркованных доменов иногда может быть связана с подозрительными практиками и вредоносным контентом.',
        'Block domains hosting child sexual abuse material with the help of Project Arachnid, operated by the Canadian Centre for Child Protection. No information is transmitted back to Project Arachnid when a domain is blocked.': 'Блокируйте домены, на которых размещены материалы с изображением сексуального насилия над детьми, с помощью проекта Arachnid, осуществляемого Канадским центром защиты детей. При блокировке домена никакая информация не передается обратно в проект Arachnid.',
        'Dynamic DNS (or DDNS) services let malicious actors quickly set up hostnames for free and without any validation or identity verification. While legit DDNS hostnames are rarely accessed in every-day use, their malicious counterparts are heavily used in phishing campaigns — e.g. paypal‑login.duckdns.org.': 'Службы динамического DNS (или DDNS) позволяют злоумышленникам быстро настраивать имена хостов бесплатно и без какой-либо проверки или подтверждения личности. В то время как законные имена хостов DDNS редко используются в повседневной жизни, их вредоносные аналоги широко используются в фишинговых кампаниях, например paypal‑login.duckdns.org.',
        'Threat Intelligence Feeds': 'Базы угроз',
        'Typosquatting Protection': 'Защита от типосквоттинга',
        'Use Threat Intelligence Feeds': 'Использование каналов информации об угрозах',

        // Страница конфиденциальности (/privacy)
        'Add a blocklist': 'Добавить список блокировки',
        'Allow Affiliate & Tracking Links': 'Разрешить партнерские и отслеживающие ссылки',
        'Allow affiliate & tracking domains common on deals websites, in emails or in search results. Those usually only get called after manually clicking on a link.': 'Разрешить партнерские и отслеживающие домены, которые часто встречаются на сайтах по продаже товаров, в электронных письмах или в результатах поиска. Обычно они вызываются только после ручного нажатия на ссылку.',
        'Block Ads': 'Блокировать рекламу',
        'Block Disguised Third-Party Trackers': 'Блокировка замаскированных сторонних трекеров',
        'Block Gambling': 'Блокировать азартные игры',
        'Block Social Networks': 'Блокировать социальные сети',
        'Block Trackers': 'Блокировать трекеры',
        'Block ads & trackers using the most popular blocklists available — all updated in real-time.': 'Блокируйте рекламу и трекеры с помощью самых популярных списков блокировки, которые обновляются в режиме реального времени.',
        'Block wide spectrum trackers — often operating at the operating system level — that track your activity on a device. This could include all the websites you visit, everything you type or your location at all times.': 'Блокируйте трекеры широкого спектра, которые часто работают на уровне операционной системы и отслеживают вашу активность на устройстве. Это может включать все посещаемые вами веб-сайты, все, что вы печатаете, или ваше местоположение в любое время.',
        'Blocklists': 'Списки заблокированных',
        'Native Tracking Protection': 'Встроенная защита от слежения',
        'Your IP address will automatically be hidden from those websites to preserve your privacy.': 'Ваш IP-адрес будет автоматически скрыт от этих веб-сайтов для сохранения вашей конфиденциальности.',

        // Список фильтров блокирующий рекламу и трекеры
        "2o7 Network tracking.": "2o7 Отслеживание сети.",
        "280blocker adblock domain lists.": "280blocker списки доменов для блокировки рекламы.",
        "A comprehensive blocklist to block ads & trackers in all countries. This is the recommended starter blocklist.": "Всеобъемлющий список блокировок для фильтрации рекламы и трекеров во всех странах. Рекомендуется в качестве базового списка блокировок.",
        "A filter composed of several other filters (AdGuard Base filter, Social media filter, Tracking Protection filter, Mobile Ads filter, EasyList and EasyPrivacy) and simplified specifically to be better compatible with DNS-level ad blocking.": "Фильтр, состоящий из нескольких других фильтров (базовый фильтр AdGuard, фильтр социальных сетей, фильтр защиты от отслеживания, фильтр мобильной рекламы, EasyList и EasyPrivacy) и упрощенный специально для лучшей совместимости с блокировкой рекламы на уровне DNS.",
        "A programmatically expanded list of hosts used for advertisements and tracking. This is my primary list and I recommend using it.": "Программно расширенный список хостов, используемых для рекламы и отслеживания. Это мой основной список, и я рекомендую его использовать.",
        "A very aggressive block list for tracking, geo-targeting, & ads. This list will likely break functionality, so do not use it unless you are willing to maintain your own whitelist.": "Очень агрессивный список блокировки для отслеживания, географического таргетинга и рекламы. Этот список, скорее всего, нарушит функциональность, поэтому не используйте его, если не готовы вести собственный белый список.",
        "ABPindo is an affiliated filter list written by hermawan that specifically removes adverts on Indonesian language websites.": "ABPindo — это аффилированный список фильтров, созданный Hermawan, который специально удаляет рекламу на индонезийских веб-сайтах.",
        "Ad servers list to block ads on Turkish websites.": "Список рекламных серверов для блокировки рекламы на турецких веб-сайтах.",
        "AdAwayで使用可能な、日本環境用 広告除去用hostsを公開します。日本環境用に特化しています。": "Мы выпускаем файл хостов для блокировки рекламы для японской среды, доступный для использования с AdAway. Этот файл специально разработан для японской среды.",
        "All about advertising: This includes sites offering banners and banner creation as well as sites delivering banners to be shown in webpages. Advertising companies are listed, too.": "Все о рекламе: сюда входят сайты, предлагающие баннеры и их создание, а также сайты, предоставляющие баннеры для показа на веб-страницах. Также приведен список рекламных компаний.",
        "anti-AD是目前中文区命中率最高的广告过滤列表，实现了精确的广告屏蔽和隐私保护。": "Anti-AD в настоящее время является самым эффективным списком блокировки рекламы в китайскоязычном регионе, обеспечивая точную блокировку рекламы и надежную защиту конфиденциальности.",
        "Automatically detect and block third-party trackers disguising themselves as first-party to circumvent recent browser's privacy protections like ITP.": "Автоматически обнаруживать и блокировать сторонние трекеры, выдающие себя за сторонние, чтобы обойти последние меры защиты конфиденциальности браузера, такие как ITP.",
        "Automatically updated, moderated and optimized list for blocking ads, trackers and other online garbage.": "Автоматически обновляемый, модерируемый и оптимизированный список для блокировки рекламы, трекеров и другого онлайн-мусора.",
        "Balanced, extended protection.": "Сбалансированная, расширенная защита.",
        "Big broom - Cleans the Internet and protects your privacy! Blocks Ads, Affiliate, Tracking, Metrics, Telemetry, Phishing, Malware, Scam, Fake, Coins and other Crap.": "Большая метла — очищает Интернет и защищает вашу конфиденциальность! Блокирует рекламу, партнерские программы, отслеживание, метрики, телеметрию, фишинг, вредоносное ПО, мошенничество, подделки, монеты и прочую ерунду.",
        "Block all known NSA / GCHQ / C.I.A. / F.B.I. spying servers. Originally based on 2007 published Wikileaks documents and includes my own modifications from 2008, 2012, 2014 and 2015.": "Блокирует все известные серверы слежки NSA / GCHQ / ЦРУ / ФБР. Изначально основан на опубликованных в 2007 году документах Wikileaks и включает мои собственные правки 2008, 2012, 2014 и 2015 годов.",
        "Block filter for advertisements, mainly on Korean sites.": "Блокирующий фильтр для рекламы, в основном на корейских сайтах.",
        "Block hungarian ads.": "Блокирует венгерские объявления.",
        "Block mobile ad providers and some analytics providers.": "Блокировка поставщиков мобильной рекламы и некоторых поставщиков аналитики.",
        "Block sites which have used DMCA takedowns to force removal from other content blocking lists. Such takedowns are categorically invalid, but they can be effective at intimidating small open-source projects into compliance.": "Блокируйте сайты, которые использовали DMCA-заявки на удаление контента, чтобы добиться удаления из других списков блокировки контента. Такие заявки категорически недействительны, но они могут быть эффективны для запугивания небольших проектов с открытым исходным кодом, чтобы заставить их подчиниться.",
        "Block smart-TVs sending metadata back home, sometimes with the added benefit of blocking interface ads for apps and movie services.": "Блокируйте смарт-телевизоры, отправляющие метаданные обратно домой, что иногда дает дополнительную выгоду в виде блокировки рекламы в интерфейсе приложений и сервисов для просмотра фильмов.",
        "Block spying and tracking on Windows systems.": "Блокирует слежку и отслеживание в системах Windows.",
        "Blocking mobile ad providers and some analytics providers." : "Блокировка поставщиков мобильной рекламы и некоторых поставщиков аналитических услуг.",
        "Blocklist for use with hosts files to block ads.": "Список блокировки для использования с файлами хостов для блокировки рекламы.",
        "Blocks all Spotify Ads, easy peasy lemon squeezy!": "Блокирует всю рекламу Spotify, проще простого!",
        "Broom - Cleans the Internet and protects your privacy! Blocks Ads, Affiliate, Tracking, Metrics, Telemetry, Phishing, Malware, Scam, Fake, Coins and other Crap.": "Broom — очищает Интернет и защищает вашу конфиденциальность! Блокирует рекламу, партнерские программы, отслеживание, метрики, телеметрию, фишинг, вредоносное ПО, мошенничество, подделки, монеты и прочую ерунду.",
        "Bulgarian list is an affiliated filter list written by Alex that specifically removes adverts on Bulgarian language websites.": "Болгарский список — это аффилированный список фильтров, созданный Алексом, который специально удаляет рекламу на веб-сайтах на болгарском языке.",
        "CAMELEON is a free system that helps Internet users or administrators to blocks web-adverts.": "CAMELEON — это бесплатная система, которая помогает интернет-пользователям или администраторам блокировать веб-рекламу.",
        "Completely block Facebook and the services it owns (WhatsApp, Instagram).": "Полностью блокирует Facebook и принадлежащие ему сервисы (WhatsApp, Instagram).",
        "Completely block Google and its services.": "Полностью блокирует Google и его сервисы.",
        "Comprehensive, full protection.": "Комплексная, полная защита.",
        "Contains one of the largest compilation of sites associated with tracking your online activities and invading your privacy.": "Содержит одну из самых больших подборок сайтов, связанных с отслеживанием ваших действий в сети и нарушением вашей конфиденциальности.",
        "Content added to this list has been manually verified, and is updated irregularly.": "Добавленный в этот список контент был проверен вручную и обновляется нерегулярно.",
        "Curated and well-maintained hostfile to block ads, tracking, cryptomining, and more! Updated regularly.": "Тщательно подобранный и хорошо поддерживаемый файл hostfile для блокировки рекламы, отслеживания, криптомайнинга и многого другого! Регулярно обновляется.",
        "EasyList China is an affiliated filter list written by John and Li that specifically removes adverts on Chinese language websites.": "EasyList China — это аффилированный список фильтров, созданный Джоном и Ли, который специально удаляет рекламу на китайскоязычных веб-сайтах.",
        "EasyList Czech and Slovak is an affiliated filter list written by tomasko126 that specifically removes adverts on Czech and Slovak language websites.": "EasyList Czech and Slovak — это аффилированный список фильтров, созданный tomasko126, который специально удаляет рекламу на чешских и словацких веб-сайтах.",
        "EasyList Germany is a filter list written by the EasyList authors MonztA, Famlam and Khrin that specifically removes adverts on German language websites.": "EasyList Germany — это список фильтров, созданный авторами EasyList MonztA, Famlam и Khrin, который специально удаляет рекламу на немецкоязычных веб-сайтах.",
        "EasyList Hebrew is an affiliated filter list written by BsT that specifically removes adverts on Hebrew language websites.": "EasyList Hebrew — это аффилированный список фильтров, созданный BsT, который специально удаляет рекламу на веб-сайтах на иврите.",
        "EasyList is the primary filter list that removes most adverts from international webpages, including unwanted frames, images and objects. It is the most popular list used by many ad blockers and forms the basis of over a dozen combination and supplementary filter lists.": "EasyList — основной список фильтров, удаляющий большую часть рекламы с международных веб‑страниц, включая нежелательные фреймы, изображения и объекты. Это самый популярный список, используемый многими блокировщиками рекламы; он лежит в основе более десятка комбинированных и дополнительных списков фильтров.",
        "EasyList Italy is a filter list written by the EasyList author Khrin that specifically removes adverts on Italian language websites.": "EasyList Italy — это список фильтров, созданный автором EasyList Khrin, который специально удаляет рекламу на итальянских веб-сайтах.",
        "EasyList Lithuania is an affiliated filter list written by gymka that specifically removes adverts on Lithuanian language websites.": "EasyList Lithuania — это аффилированный список фильтров, созданный gymka, который специально удаляет рекламу на литовскоязычных веб-сайтах.",
        "EasyList Dutch is an affiliated filter list written by the EasyList author Famlam that specifically removes adverts on Dutch language websites.": "EasyList Dutch — это аффилированный список фильтров, созданный автором EasyList Famlam, который специально удаляет рекламу на веб-сайтах на голландском языке.",
        "EasyPrivacy is an optional supplementary filter list that completely removes all forms of tracking from the internet, including web bugs, tracking scripts and information collectors, thereby protecting your personal data.": "EasyPrivacy — дополнительный необязательный список фильтров, полностью удаляющий все формы отслеживания в интернете, включая веб‑жучки, скрипты отслеживания и сборщики информации, тем самым защищая ваши персональные данные.",
        "Enhanced privacy with aggressive filtering.": "Повышенная конфиденциальность благодаря агрессивной фильтрации.",
        "Especially Designed for Mobile Ad Protection.": "Специально разработан для защиты от мобильной рекламы.",
        "Extending and consolidating hosts files from several well-curated sources like adaway.org, mvps.org, malwaredomainlist.com, someonewhocares.org, and potentially others.": "Расширение и консолидация файлов hosts из нескольких тщательно отобранных источников, таких как adaway.org, mvps.org, malwaredomainlist.com, someonewhocares.org и, возможно, других.",
        "Fanboy's Annoyance List blocks Social Media content, in-page pop-ups and other annoyances; thereby substantially decreasing web page loading times and uncluttering them.": "Список Fanboy's Annoyance блокирует контент соцсетей, всплывающие окна внутри страниц и другие раздражающие элементы, существенно сокращая время загрузки веб‑страниц и делая их чище.",
        "Fanboy's Enhanced Tracking List blocks common tracking scripts such as Omniture, Webtrends, Foresee, Coremetrics, Google-Analytics, Touchclarity, ChannelIntelligence.": "Расширенный список отслеживания Fanboy блокирует распространенные скрипты отслеживания, такие как Omniture, Webtrends, Foresee, Coremetrics, Google-Analytics, Touchclarity, ChannelIntelligence.",
        "Filter that blocks ads on mobile devices. Contains all known mobile ad networks.": "Фильтр, блокирующий рекламу на мобильных устройствах. Содержит все известные мобильные рекламные сети.",
        "Filter that enables removing of the ads from websites in Russian.": "Фильтр, позволяющий удалять рекламу с русскоязычных сайтов.",
        "Filter that enables removing of the ads from websites with English content.": "Фильтр, позволяющий удалять рекламу с сайтов с англоязычным контентом.",
        "Finnish adblock list.": "Финский список блокировки рекламы.",
        "Free yourself from unwanted tracking. Enjoy a faster, safer internet.": "Освободитесь от нежелательного отслеживания. Наслаждайтесь более быстрым и безопасным интернетом.",
        "Hand brush - Cleans the Internet and protects your privacy! Blocks Ads, Tracking, Metrics, some Malware and Fake.": "Ручная щетка - очищает Интернет и защищает вашу конфиденциальность! Блокирует рекламу, отслеживание, метрики, некоторые вредоносные программы и подделки.",
        "Hosts block ads of Vietnamese - Hosts chặn quảng cáo của người Việt.": "Хосты блокирующие вьетнамскую рекламу.",
        "If you do not like numerous «Like» and «Tweet» buttons on all the popular websites on the Internet, subscribe to this filter, and you will not see them anymore.": "Если вам не нравятся многочисленные кнопки «Нравится» и «Твитнуть» на популярных сайтах, подпишитесь на этот фильтр — и вы их больше не увидите.",
        "Improve your security and privacy by blocking ads, tracking and malware domains.": "Повысьте безопасность и конфиденциальность, блокируя рекламу, трекеры и домены, связанные с вредоносным ПО.",
        "Includes entries for most major parasites, hijackers and unwanted Adware/Spyware programs!": "Включает записи о большинстве основных паразитов, угонщиков и нежелательных рекламных/шпионских программ!",
        "Internet's #1 domain blocklist. Blocks Ads, Mobile Ads, Phishing, Malvertising, Malware, Tracking, Telemetry, CryptoJacking, Analytics, Spyware, Ransomware, Exploit, Fraud, Abuse, Scam, Spam, Hijack, Misleading Marketing.": "Лучший в интернете список блокировки доменов. Блокирует рекламу, мобильную рекламу, фишинг, вредоносную рекламу, вредоносное ПО, трекинг, телеметрию, криптоджекинг, аналитику, шпионское ПО, программы‑вымогатели, эксплойты, мошенничество, злоупотребления, обман, спам, перехват, недобросовестный маркетинг.",
        "Just ad-wars helper document": "Просто справочная документация по ad-wars",
        "Latvian List is an affiliated filter list written by anonymous74100 that specifically removes adverts on Latvian language websites.": "Latvian List — аффилированный список фильтров, созданный anonymous74100, специально удаляющий рекламу с латышскоязычных сайтов.",
        "Lightweight, essential protection.": "Легкая, необходимая защита.",
        "List of popads.net domains.": "Список доменов popads.net.",
        "Liste AR is an affiliated filter list written by smed79 and Crits that specifically removes adverts on Arabic language websites.": "Liste AR — это аффилированный список фильтров, созданный smed79 и Crits, который специально удаляет рекламу на арабскоязычных веб-сайтах.",
        "Liste FR is an affiliated filter list written by Lian, Crits and smed79 that specifically removes adverts on French language websites.": "Liste FR — это аффилированный список фильтров, созданный Lian, Crits и smed79, который специально удаляет рекламу на французских веб-сайтах.",
        "Polish ads filter.": "Фильтр польских объявлений.",
        "Protects you from many types of spyware, reduces bandwidth use, blocks certain pop-up traps, prevents user tracking by way of \"web bugs\" embedded in spam, provides partial protection to IE from certain web-based exploits and blocks most advertising you would otherwise be subjected to on the internet.": "Защищает вас от многих видов шпионского ПО, снижает использование полосы пропускания, блокирует определенные всплывающие окна, предотвращает отслеживание пользователей с помощью «веб-жучков», встроенных в спам, обеспечивает частичную защиту IE от определенных веб-уязвимостей и блокирует большую часть рекламы, которой вы в противном случае подвергались бы в Интернете.",
        "Reduce your exposure to ads, tracking, scams & badware, and occasionally some annoyances on (mostly) Swedish websites.": "Сократите количество рекламы, отслеживания, мошенничества и вредоносных программ, а также некоторые раздражающие моменты на (в основном) шведских веб-сайтах.",
        "Regional filtering.": "Региональная фильтрация.",
        "Russian supplement for EasyList.": "Русское дополнение к EasyList.",
        "Safeguard your device(s) against pesky ads, trackers, and malware.": "Защитите свои устройства от назойливой рекламы, трекеров и вредоносных программ.",
        "Site keeping an eye on where you surf and what you do in a passive. Covers web bugs, counters and other tracking mechanism in web pages that do not interfere with the local computer yet collecting information about the surfing person for later analyis. Sites actively spying out the surfer by installing software or calling home sites are not covered with tracker but with -> spyware.": "Сайт, который пассивно следит за тем, где вы серфите и что делаете. Охватывает веб-жучки, счетчики и другие механизмы отслеживания на веб-страницах, которые не вмешиваются в работу локального компьютера, но собирают информацию о пользователе для последующего анализа. Сайты, которые активно шпионят за пользователем, устанавливая программное обеспечение или вызывая домашние сайты, не относятся к трекерам, а к -> шпионскому ПО.",
        "Specially Designed for Mobile Ad Protection.": "Специально разработано для защиты мобильной рекламы.",
        "Strictly blocks advertisements, malwares, spams, statistics & trackers on both web browsing and applications. A Lightweight Mid Ranger Protection Pack.": "Строго блокирует рекламу, вредоносное ПО, спам, статистику и трекеры как при просмотре веб-страниц, так и в приложениях. Легкий пакет защиты среднего уровня.",
        "Strictly blocks advertisements, malwares, spams, statistics & trackers on both web browsing and applications. An All-Rounder Balanced Protection Pack.": "Строго блокирует рекламу, вредоносное ПО, спам, статистику и трекеры как при просмотре веб-страниц, так и в приложениях. Универсальный пакет сбалансированной защиты.",
        "Sweeper - Aggressive cleans the Internet and protects your privacy! Blocks Ads, Affiliate, Tracking, Metrics, Telemetry, Phishing, Malware, Scam, Fake, Coins and other Crap.": "Sweeper — агрессивно очищает интернет и защищает вашу конфиденциальность! Блокирует рекламу, партнёрские ссылки, трекеры, метрики, телеметрию, фишинг, вредоносное ПО, мошенничество, поддельные ресурсы, криптовалютные скрипты и прочий мусор.",
        "The ABP advertising filter is built with the mission of improving the browsing experience for users and for the Vietnamese.": "Рекламный фильтр ABP создан с целью улучшения качества просмотра веб-страниц для пользователей и жителей Вьетнама.",
        "The most comprehensive list of various online counters and web analytics tools. If you do not want your actions on the Internet be tracked, use this filter.": "Самый полный список различных онлайн‑счётчиков и инструментов веб‑аналитики. Если вы не хотите, чтобы ваши действия в интернете отслеживались, используйте этот фильтр.",
        "Ultimate Sweeper - Strictly cleans the Internet and protects your privacy! Blocks Ads, Affiliate, Tracking (+Referral), Metrics, Telemetry, Phishing, Malware, Scam, Free Hoster, Fake, Coins and other Crap.": "Ultimate Sweeper — тщательно очищает Интернет и защищает вашу конфиденциальность! Блокирует рекламу, партнерские ссылки, отслеживание (+рефералы), метрики, телеметрию, фишинг, вредоносное ПО, мошенничество, бесплатные хостинги, подделки, монеты и прочий мусор.",
        "Windows installers ads sources.": "Источники рекламы установщиков Windows.",
        "只是 ad-wars 的帮助文档": "Просто справочная документация по ad-wars",

        // Родительский контроль (/parentalcontrol)
        'Add a category': 'Добавить категорию',
        'Add a website, app or game': 'Добавить сайт, приложение или игру',
        'Block Adult Content': 'Блокировать контент для взрослых',
        'Block Bypass Methods': 'Методы обхода блокировки',
        'Block Violence': 'Блокировать насилие',
        'Categories': 'Категории',
        'Enforce SafeSearch': 'Применить безопасный поиск',
        'Enforce YouTube Restricted Mode': 'Применить ограниченный режим YouTube',
        'Filter explicit results on all major search engines, including images and videos. This will also block access to search engines not supporting this feature.': 'Фильтруйте явные результаты во всех основных поисковых системах, включая изображения и видео. Это также заблокирует доступ к поисковым системам, не поддерживающим эту функцию.',
        'Filter out mature videos on YouTube and block embedded mature videos from being watched on other websites. This will also hide all comments.': 'Отфильтруйте видео для взрослых на YouTube и заблокируйте просмотр встроенных видео для взрослых на других веб-сайтах. Это также скроет все комментарии.',
        'Prevent or hinder the use of methods that can help bypass NextDNS filtering on the network. This includes VPNs, proxies, Tor-related software and encrypted DNS providers.': 'Предотвращайте или затрудняйте использование методов, которые могут помочь обойти фильтрацию NextDNS в сети. К ним относятся VPN, прокси, программное обеспечение, связанное с Tor, и провайдеры зашифрованного DNS.',
        'Recreation Time': 'Время отдыха',
        'Restrict access to specific categories of websites and apps.': 'Ограничьте доступ к определенным категориям веб-сайтов и приложений.',
        'Restrict access to specific websites, apps and games.': 'Ограничьте доступ к определенным веб-сайтам, приложениям и играм.',
        'Safe Search': 'Безопасный поиск',
        'SafeSearch': 'Безопасный поиск',
        'Set a period for each day of the week during which some of the websites, apps, games or categories above will not be blocked — e.g. allow Facebook on Mondays and Tuesdays between 6pm and 8pm.': 'Установите период для каждого дня недели, в течение которого некоторые из вышеперечисленных веб-сайтов, приложений, игр или категорий не будут блокироваться — например, разрешите доступ к Facebook по понедельникам и вторникам с 18:00 до 20:00.',
        'Set recreation time': 'Установить время отдыха',
        'Time Restrictions': 'Ограничения по времени',
        'Websites, Apps & Games': 'Веб-сайты, приложения и игры',
        'YouTube Restricted Mode': 'Ограниченный режим YouTube',

        // Список категорий
        'Porn': 'Порно',
        'Blocks adult and pornographic content. It includes escort sites, pornhub.com and similar domains.': 'Блокирует контент для взрослых и порнографический контент. Включает сайты эскорт-услуг, pornhub.com и подобные домены.',
        'Gambling': 'Азартные игры',
        'Blocks gambling content.': 'Блокирует контент, связанный с азартными играми.',
        'Dating': 'Знакомства',
        'Blocks all dating websites & apps.': 'Блокирует все сайты и приложения для знакомств.',
        'Piracy': 'Пиратство',
        'Blocks P2P websites, protocols, copyright-infringing streaming websites and generic video hosting websites used mainly for illegally distributing copyrighted content.': 'Блокирует P2P-сайты, протоколы, сайты потокового вещания, нарушающие авторские права, и общие видеохостинги, используемые в основном для незаконного распространения контента, защищенного авторским правом.',
        'Social Networks': 'Социальные сети',
        'Blocks all social networks sites and apps (Facebook, Instagram, TikTok, Reddit, etc.). Does not block messaging apps.': 'Блокирует все сайты и приложения социальных сетей (Facebook, Instagram, TikTok, Reddit и т. д.). Не блокирует приложения для обмена сообщениями.',
        'Online Gaming': 'Онлайн-игры',
        'Blocks online gaming websites, online gaming apps and online gaming networks (Xbox Live, PlayStation Network, etc.).': 'Блокирует сайты онлайн-игр, приложения для онлайн-игр и сети онлайн-игр (Xbox Live, PlayStation Network и т. д.).',
        'Video Streaming': 'Потоковое видео',
        'Blocks video streaming services (YouTube, Netflix, Disney+, illegal streaming websites, video porn websites, etc.) and video-based social networks (TikTok, etc.). This can also help in reducing bandwidth usage on any network.': 'Блокирует сервисы потокового видео (YouTube, Netflix, Disney+, незаконные сайты потокового видео, сайты с порнографическим видео и т. д.) и социальные сети, основанные на видео (TikTok и т. д.). Это также может помочь сократить использование пропускной способности в любой сети.',

        // Черный список (/denylist)
        'Add a domain...': 'Добавить домен...',
        'Add domain to block': 'Добавить домен для блокировки',
        'Blocked Domains': 'Заблокированные домены',
        'Date added': 'Дата добавления',
        'Denying a domain will automatically deny all its subdomains.': 'Запрет домена автоматически приведет к запрету всех его поддоменов.',
        'Domain': 'Домен',
        'No domains yet.': 'Доменов пока нет',

        // Белый список (/allowlist)
        'Add domain to allow': 'Добавить домен в белый список',
        'Allowed Domains': 'Разрешенные домены',
        'Allowing a domain will automatically allow all its subdomains. Allowing takes precedence over everything else, including security features.': 'Разрешение домена автоматически разрешает все его поддомены. Разрешение имеет приоритет над всем остальным, включая функции безопасности.',
        'Bypass denylist': 'Обходить черный список',

        // Аналитика (/analytics)
        'Aggregate of all queries made for root domains and all their subdomains.': 'Совокупность всех запросов, сделанных для корневых доменов и всех их поддоменов.',
        'Allowed': 'Разрешено',
        'Blocked': 'Заблокировано',
        'Blocked Reasons': 'Причины блокировки',
        'Devices': 'Устройства',
        'Devices making the queries.': 'Устройства, выполняющие запросы.',
        'Domains blocked by a Security, Privacy and/or Parental Control setting or because they were manually denied.': 'Домены, заблокированные настройками безопасности, конфиденциальности и/или родительского контроля или вручную.',
        'Domains that resolved without being blocked by any setting or because they were manually allowed.': 'Домены, которые были разрешены без блокировки какими-либо настройками или потому, что они были разрешены вручную.',
        'Encrypted DNS': 'Зашифрованный DNS',
        'Evolution of queries over time.': 'Эволюция запросов с течением времени.',
        'GAFAM Dominance': 'Доминирование GAFAM',
        'IP addresses making the queries.': 'IP-адреса, с которых поступают запросы.',
        'Last 24 hours': 'Последние 24 часа',
        'Last 30 days': 'Последние 30 дней',
        'Last 30 minutes': 'Последние 30 минут',
        'Last 3 months': 'Последние 3 месяца',
        'Last 6 hours': 'Последние 6 часов',
        'Last 7 days': 'Последние 7 дней',
        'No devices yet.': 'Пока нет устройств.',
        'No domains were blocked yet.': 'Ни один домен пока не был заблокирован.',
        'No IPs yet.': 'Пока нет IP-адресов.',
        'No queries yet.': 'Пока нет запросов.',
        'Percentage of queries made using a encrypted transport (DNS-over-HTTPS, DNS-over-TLS or the official NextDNS apps).': 'Процент запросов, выполненных с использованием зашифрованного транспорта (DNS-over-HTTPS, DNS-over-TLS или официальные приложения NextDNS).',
        'Percentage of queries validated with DNSSEC.': 'Процент запросов, проверенных с помощью DNSSEC.',
        'Queries': 'Запросы',
        'Requests': 'Запросы',
        'Resolved Domains': 'Решенные домены',
        'Root Domains': 'Корневые домены',
        'Security, Privacy and/or Parental Control settings that blocked the most queries.': 'Настройки безопасности, конфиденциальности и/или родительского контроля, которые заблокировали большинство запросов.',
        'The "GAFAM" (Google, Amazon, Facebook, Apple and Microsoft) are the 5 dominant Internet companies that own many popular services, often operating under a different name, e.g., WhatsApp and Instagram for Facebook.': '«GAFAM» (Google, Amazon, Facebook, Apple и Microsoft) — это 5 доминирующих интернет-компаний, владеющих многими популярными сервисами, которые часто работают под другим названием, например WhatsApp и Instagram для Facebook.',
        'Top Blocked': 'Топ заблокированных',
        'Top Domains': 'Топ доменов',
        'Traffic Destination': 'Место назначения трафика',
        'Today': 'Сегодня',
        'All devices': 'Все устройства',
        'Countries where your Internet traffic goes.': 'Страны, в которые направляется ваш интернет-трафик.',
        'blocked queries': 'заблокированные запросы',
        'of blocked queries': 'заблокированных запросов',
        'queries': 'запросы',

        // Логи (/logs)
        'Action': 'Действие',
        'Blocked Queries Only': 'Только заблокированные запросы',
        'Client': 'Клиент',
        'No logs yet.': 'Пока нет журналов.',
        'Query Log': 'Лог запросов',
        'Raw DNS logs': 'Необработанные журналы DNS',
        'Reason': 'Причина',
        'Recent Queries': 'Последние запросы',
        'Time': 'Время',
        'Type': 'Тип',

        // Настройки (/settings)
        'General': 'Основные',
        'DNS Servers': 'DNS серверы',
        'Configuration': 'Конфигурация',
        'Linked IPs': 'Привязанные IP',
        'Access Control': 'Контроль доступа',
        'Block Page': 'Страница блокировки',
        'Name': 'Имя',
        'Pick a name for this profile.': 'Выберите имя для этого профиля.',
        'Fine tune your Logs settings.': 'Настройте параметры журналов.',
        'Enable Logs': 'Включить журналы',
        'Download logs': 'Загрузить журналы',
        'Clear logs': 'Очистить журналы',
        'Display a block page when a domain is being blocked. This may slightly increase page load time and an HTTPS warning may appear in some cases. When disabled, blocked queries will be answered with the unspecified address (0.0.0.0 or ::).': 'Отображать страницу блокировки при блокировке домена. Это может немного увеличить время загрузки страницы, а в некоторых случаях может появиться предупреждение HTTPS. При отключении на заблокированные запросы будет отвечать адрес, не указанный в настройках (0.0.0.0 или ::).',
        'Enable Block Page': 'Включить блокировку страницы',
        'Performance': 'Производительность',
        'Speed up your browsing.': 'Ускорьте просмотр страниц.',
        'Anonymized EDNS Client Subnet': 'Анонимизированная подсеть клиента EDNS',
        'Speed up the delivery of data from content delivery networks without exposing your IP address.': 'Ускорьте доставку данных из сетей доставки контента, не раскрывая свой IP-адрес.',
        'Enable Anonymized EDNS Client Subnet': 'Включить анонимизированную подсеть клиента EDNS',
        'Cache Boost': 'Ускорение кэша',
        'Minimize DNS queries by enforcing a minimum TTL (Time to live).': 'Минимизируйте количество DNS-запросов, установив минимальное значение TTL (время жизни).',
        'Enable Cache Boost': 'Включить ускорение кэша',
        'CNAME Flattening': 'Сглаживание CNAME',
        'Prevent CNAME-chasing resolvers from making unnecessary queries and pollute the logs with intermediate domains.': 'Предотвратите ненужные запросы резолверов, отслеживающих CNAME, и загрязнение журналов промежуточными доменами.',
        'Enable CNAME Flattening': 'Включить сглаживание CNAME',
        'Bypass Age Verification': 'Обход проверки возраста',
        'Automatically bypass age verification checks used by certain websites, such as adult content sites, to verify a visitor’s age before allowing access.': 'Автоматически обходить проверки возраста, используемые некоторыми веб-сайтами, такими как сайты с контентом для взрослых, для подтверждения возраста посетителя перед предоставлением доступа.',
        'By enabling this feature, you acknowledge that you are legally old enough to access the content.': 'Включая эту функцию, вы подтверждаете, что достигли установленного законом возраста для доступа к данному контенту.',
        'Bypass Age Verification': 'Обход проверки возраста',
        'Web3 refers to a decentralized and censorship-resistant online ecosystem comprised of innovative technologies such as blockchain-based domain registries (e.g. Ethereum Name Service) and distributed content storage and delivery networks (e.g. IPFS). When enabled, NextDNS will act as an unfiltered gateway to this new Web, letting you experience it firsthand without the need to install anything.': 'Web3 — это децентрализованная и устойчивая к цензуре онлайн-экосистема, состоящая из инновационных технологий, таких как реестры доменов на основе блокчейна (например, Ethereum Name Service) и распределенные сети хранения и доставки контента (например, IPFS). При включении NextDNS будет действовать как нефильтрованный шлюз к этой новой сети, позволяя вам испытать ее на себе без необходимости установки каких-либо программ.',
        'As most browsers only support classic top-level domains at the moment, you should add a trailing slash ("/") when trying to access a Web3 domain directly (e.g. "vitalik.eth/" instead of "vitalik.eth").': 'Поскольку в настоящее время большинство браузеров поддерживают только классические домены верхнего уровня, при попытке прямого доступа к домену Web3 необходимо добавлять косую черту («/») в конце адреса (например, «vitalik.eth/» вместо «vitalik.eth»).',
        'Enable Web3': 'Включить Web3',
        'Rewrites': 'Перезаписи',
        'Set or override the DNS response for any domain. Rewrites apply to subdomains as well, and local IP addresses are supported as answers.': 'Установите или переопределите ответ DNS для любого домена. Перезаписи применяются также к субдоменам, а в качестве ответов поддерживаются локальные IP-адреса.',
        'Access': 'Доступ',
        'Provide editing or viewing-only access to this profile to others.': 'Предоставьте другим пользователям доступ к этому профилю для редактирования или просмотра.',
        'Invite': 'Пригласить',
        'Copy all settings of this profile to a new one.': 'Скопируйте все настройки этого профиля в новый.',
        'This will delete this profile and all the logs associated with it forever.': 'Это приведет к окончательному удалению данного профиля и всех связанных с ним журналов.',
        'Duplicate': 'Дубликат',

        // Учётная запись (/account)
        'Affiliation': 'Принадлежность',
        'Available balance': 'Доступный баланс',
        'Balance': 'Баланс',
        'Balance becomes available to pay out after a month in order to cover potential refunds.': 'Баланс становится доступным для выплаты через месяц, чтобы покрыть возможные возвратные платежи.',
        'Change email': 'Изменить адрес электронной почты',
        'Change password': 'Изменить пароль',
        'Change the email address used to log into your account and receive critical notifications.': 'Измените адрес электронной почты, используемый для входа в вашу учетную запись и получения важных уведомлений.',
        'Change the password used to log into your account and asked when performing sensitive actions.': 'Измените пароль, используемый для входа в вашу учетную запись и запрашиваемый при выполнении конфиденциальных действий.',
        'Create and manage your profiles programmatically. Read the documentation at': 'Создавайте и управляйте своими профилями программным способом. Ознакомьтесь с документацией по адресу  ',
        'Delete account': 'Удалить учетную запись',
        'Email': 'Электронная почта',
        'Enable 2FA': 'Включить двухфакторную аутентификацию',
        'Free usage': 'Бесплатное использование',
        'Generate API key': 'Сгенерировать ключ API',
        'NextDNS can be used for free up to 300,000 queries each month, after which all features will be disabled temporarily until next month.': 'NextDNS можно использовать бесплатно до 300 000 запросов в месяц, после чего все функции будут временно отключены до следующего месяца.',
        'Password': 'Пароль',
        'Pay out': 'Выплата',
        'Subscribe': 'Подписаться',
        'This will delete your account and all your profiles forever.': 'Это приведет к окончательному удалению вашей учетной записи и всех ваших профилей.',
        'Two-Factor Authentication (2FA)': 'Двухфакторная аутентификация (2FA)',
        'Two-factor authentication (2FA) is an extra layer of security that requires an additional time-based 6-digit code when logging into your account.': 'Двухфакторная аутентификация (2FA) — это дополнительный уровень безопасности, который требует ввода дополнительного 6-значного кода, действительного в течение определенного времени, при входе в вашу учетную запись.',

        // Дни недели
        "Monday": "Понедельник",
        "Tuesday": "Вторник",
        "Wednesday": "Среда",
        "Thursday": "Четверг",
        "Friday": "Пятница",
        "Saturday": "Суббота",
        "Sunday": "Воскресенье",

        // Авторство и информация о переводе
        'Help us translate or improve NextDNS in your language.': 'Основной перевод осуществлён с помощью DeepL❤️ от',
        'Learn more': 'Falcon',
    };

    let googleCache = GM_getValue('googleTranslationCache', {});

    function saveCache() {
        GM_setValue('googleTranslationCache', googleCache);
    }

    function isSetupPage() {
        return window.location.pathname.includes('/setup') &&
               window.location.pathname.split('/').length >= 3;
    }

    function isPureConfigBlock(node) {
        let parent = node;
        while (parent) {
            if (parent.nodeType === Node.ELEMENT_NODE) {
                const tagName = parent.tagName.toLowerCase();
                const textContent = parent.textContent || '';
                const className = parent.className || '';
                const id = parent.id || '';

                const isConfigContainer =
                    tagName === 'code' ||
                    tagName === 'pre' ||
                    className.includes('code') ||
                    className.includes('config') ||
                    className.includes('dns') ||
                    className.includes('server') ||
                    className.includes('yaml') ||
                    className.includes('conf') ||
                    className.includes('toml') ||
                    id.includes('code') ||
                    id.includes('config') ||
                    id.includes('dns') ||
                    id.includes('server');

                const hasConfigContent =
                    textContent.includes('dnsmasq.conf') ||
                    textContent.includes('stubby.yml') ||
                    textContent.includes('dnscrypt-proxy.toml') ||
                    textContent.includes('server=') ||
                    textContent.includes('server_names') ||
                    textContent.includes('address:') ||
                    textContent.includes('tls_auth_name:') ||
                    textContent.includes('stamp =') ||
                    textContent.includes('sdns://') ||
                    /[0-9a-f]{6,}\.dns\.nextdns\.io/.test(textContent) ||
                    /NextDNS-[0-9a-f]{6,}/.test(textContent);

                if (isConfigContainer && hasConfigContent) {
                    return true;
                }
            }
            parent = parent.parentNode;
        }
        return false;
    }

    async function translateWithGoogle(text, node) {
        if (translations[text]) return translations[text];
        if (text === 'Falcon') return text;
        if (!isSetupPage()) return text;
        if (googleCache[text]) return googleCache[text];
        if (text.length < 2) return text;
        if (/^\d+$/.test(text)) return text;
        if (/^[^a-zA-Zа-яА-Я]+$/.test(text)) return text;

        if (node && isPureConfigBlock(node)) {
            return text;
        }

        const isInDictionary = Object.keys(translations).some(key => translations[key] === text);
        if (isInDictionary) return text;

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            const translatedText = data[0][0][0];
            googleCache[text] = translatedText;
            saveCache();
            return translatedText;
        } catch (error) {
            return text;
        }
    }

    async function hybridTranslate(text, node) {
        if (translations[text]) return translations[text];
        return await translateWithGoogle(text, node);
    }

    async function translateNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.textContent.trim();
            if (originalText) {
                const translated = await hybridTranslate(originalText, node);
                if (translated !== originalText) {
                    node.textContent = translated;
                    if (originalText === 'Learn more' && translated === 'Falcon') {
                        const parent = node.parentNode;
                        if (parent && parent.nodeType === Node.ELEMENT_NODE) {
                            parent.setAttribute('data-translated-from', 'Learn more');
                        }
                    }
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                for (const attr of ['placeholder', 'title', 'alt']) {
                    if (node.hasAttribute(attr)) {
                        const value = node.getAttribute(attr);
                        const translated = await hybridTranslate(value, node);
                        if (translated !== value) {
                            node.setAttribute(attr, translated);
                            if (value === 'Learn more' && translated === 'Falcon') {
                                node.setAttribute('data-attr-translated', 'Learn more');
                            }
                        }
                    }
                }
                for (const child of node.childNodes) {
                    await translateNode(child);
                }
            }
        }
    }

    function interceptFalconLinks() {
        const elements = document.querySelectorAll('[data-translated-from="Learn more"], [data-attr-translated="Learn more"]');
        elements.forEach(element => {
            if (element.tagName === 'A') {
                element.href = 'https://github.com/smi-falcon';
                element.target = '_blank';
                element.removeAttribute('data-translated-from');
                element.removeAttribute('data-attr-translated');
            } else {
                element.style.cursor = 'pointer';
                element.style.color = '#007bff';
                element.style.textDecoration = 'underline';
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open('https://github.com/smi-falcon', '_blank');
                });
                element.removeAttribute('data-translated-from');
                element.removeAttribute('data-attr-translated');
            }
        });
    }

    async function translatePage() {
        try {
            await translateNode(document.body);
            interceptFalconLinks();
        } catch (error) {}
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    setTimeout(() => {
                        translateNode(node);
                        interceptFalconLinks();
                    }, 100);
                }
            });
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await translatePage();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    } else {
        translatePage();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    setTimeout(translatePage, 1000);
    setTimeout(translatePage, 3000);
})();