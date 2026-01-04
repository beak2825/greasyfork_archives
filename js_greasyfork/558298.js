// ==UserScript==
// @name         mycomicshop
// @namespace    http://tampermonkey.net/
// @version      2025-12-08
// @description  Генератор подписки
// @author       You
// @match        https://www.mycomicshop.com/subscriptionservice/searchresults?nr=5000
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mycomicshop.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558298/mycomicshop.user.js
// @updateURL https://update.greasyfork.org/scripts/558298/mycomicshop.meta.js
// ==/UserScript==

const tableId = "results";

/** Готовая строка для файла CSV, в которой указаны названия заголовков столбцов по порядку отображения */
const CSVHeadersRowString =
    "\"Артикул\";" +
    "\"Корневая\";" +
    "\"Издательство\";" +
    "\"Название серии\";" +
    "\"Название товара или услуги\";" +
    "\"Цена продажи\";" +
    "\"Тип цен: Дон\";" +
    "\"Retail\";" +
    "\"Your Price\";" +
    "\"Размещение\";" +
    "\"Видимость\";" +
    "\"Штрих-код\"";

/**
 * Объект, ключ - названия столбцов, а значение - индекс колонок таблицы из tr элемента дерева html, где брать данные для столбцов
 * Если индекс не указан, данные берутся иначе
 */
const columnElementIndexesCollection = {
    seriesName: 3,
    comicBookName: 3,
    oldComicBookName: 3, // test column
    retail: 0,
    yourPrice: 1,
    description: 3,
    articleNumber: null,
    errorInRow: null
};

/**
 * Объект, ключ - аббревиатура должности, а значение - полное название долности
 */
const positionNamesCollection = {
    "W": "Writer",
    "A": "Artist",
    "CA": "Cover Artist",
    "C": "Colorist"
};

/**
 * Объект, ключ - неправильное слово в названии комикса, а значение - правильное слово
 */
const wordsCollectionToReplaceWrongWords = {
    "Facsmile Ed": "Facsimile Edition"
};

const abbreviatedPositions = [ "W/A/CA/C", "W/CA/C", "W/A/CA", "W/A/C", "A/CA/C", "CA/C", "A/CA", "A/C", "W/CA", "W/C", "W/A", "CA", "C", "A", "W" ];

/** Слова, до которых нужно обрезать названия серий */
const wordsByWhichToTrimSeriesName = [ "Hc", "Tp", "Paperback", "Cvr", "Annual", "Omnibus", "Oneshot", "One Shot", "Cover", "Variant", "Var", "Gn", "Sc" ];

/** Символы, до которых нужно обрезать названия серий */
const symbolsByWhichToTrimSeriesName = [ "#" ];

/** Слова, которые должны отсутствовать в пронумерованном комиксе */
const wordsMissingFromNumberedComicBook = [ "Hc", "Tp", "Paperback", "Cvr", "Vol", "Volume", "Omnibus", "#", "Cover", "Variant", "Var", "Sketchbook", "Gn" ];

/** Если есть эти слова в названии комикса, то у него не должно быть нумерации */
const wordsAfterWhichThereIsNoNumbering = [ "Hc", "Tp", "Paperback", "Omnibus", "Sketchbook" ];

/** Слова, перед которыми должна отсутствовать нумерация */
const wordsBeforeWhichThereIsNoNumbering = [ ...wordsAfterWhichThereIsNoNumbering, "Cvr", "Vol", "Volume", "Annual", "Oneshot", "#" ];

/** Слова перед которыми вставлять нумерацию */
const wordsAfterNumbering = [ "Facsimile Edition", "Cvr", "Cover", "Variant", "Var" ];

/** Если есть эти названия серий в названии комикса, то серия комикса должна называться также */
const customSeriesNames = [ "Facsimile Edition" ];

const wordsKeysToReplaceWrongWords = Object.keys( wordsCollectionToReplaceWrongWords );
const columnElementIndexesKeys = Object.keys( columnElementIndexesCollection );
const positionNamesKeys = Object.keys( positionNamesCollection );

/** Регулярка для экранирования всех спецсимволов */
const escapeAllSpecialCharactersRegex = /[\[\]\\\^\$\.\|\?\*\+\(\)[\]]/g;

/** Регулярка для создания строки аббревиатур должностей с экранированными спецсимволами */
const abbreviatedPositionsRegexString = abbreviatedPositions.map( abbreviatedPosition => abbreviatedPosition.replace( escapeAllSpecialCharactersRegex, "\\$&") ).join("|");

/** Регулярка для создания строки названия серий с экранированными спецсимволами */
const customSeriesNamesRegexString = customSeriesNames.map( customSeriesName => customSeriesName.replace( escapeAllSpecialCharactersRegex, "\\$&") ).join("|");

/** Регулярка для создания строки неправильных слов в названии комикса с экранированными спецсимволами */
const wrongWordsRegexStringToReplace = wordsKeysToReplaceWrongWords.map( wrongWord => wrongWord.replace( escapeAllSpecialCharactersRegex, "\\$&") ).join("|");

/** Найти слова из wordsByWhichToTrimSeriesName и symbolsByWhichToTrimSeriesName */
const wordsByWhichToTrimSeriesNameRegex = new RegExp( `\\s(?:(?:${ wordsByWhichToTrimSeriesName.join("|") })(?:\\s|$)|(?:${ symbolsByWhichToTrimSeriesName.join("|") })).*`, "" );

/** Найти пробел,
 * перед которым нет слов из wordsMissingFromNumberedComicBook,
 * сразу после пробела 4-ех значное число,
 * нет после числа слов из wordsBeforeWhichThereIsNoNumbering,
 * и после нет чисел или идет конец строки
 */
const replaceSpaceBeforeComicBookNumberRegex = new RegExp( `(?<!(?:${ wordsMissingFromNumberedComicBook.join("|") }).*?|Vol|Volume|\\d+?.*?)\\s(?=(?:\\d{1,3}(?:$|\\s)|\\d{1,4}\\s)(?!\\d{4}$)(?!.*?(?:(?:${ wordsBeforeWhichThereIsNoNumbering.join("|") })|\\d+?)))`, "" );

/** Удаление цифр в конце строки, если в названии есть слово из wordsAfterWhichThereIsNoNumbering */
const removeNumbersAtEndOfComicBookNameRegex = new RegExp( `(?<=(?:${ wordsAfterWhichThereIsNoNumbering.join("|") }).*?)\\s\\d+?$`, "" );

/** Перенос номера комикса внутрь строки, если в названии есть "Annual" и это число меньше 3-х значного | нет "Annual" и есть слово из wordsAfterNumbering */
const moveNumberingInsideComicBookNameRegex = new RegExp( `(?<=Annual.+?\\s)\\d{1,2}$|(?:(?<!(Annual|\\s\\d+?).+?)(?<=(?:${ wordsAfterNumbering.join("|") }).*?\\s#{0,1}))\\d{1,4}$`, "" );

/** Заменить пробел до аббревиатуры должности из abbreviatedPositions */
const replaceSpaceBeforePositionRegex = new RegExp( `\\s(?=\\((?:${ abbreviatedPositionsRegexString })+?\\))`, "g" );

/** Добавить символ после аббревиатуры должности из abbreviatedPositions */
const addCharacterAfterPositionRegex = new RegExp( `(?:(?<=\\((?:${ abbreviatedPositionsRegexString })+?\\)))`, "g" );

/** Получить артикул, удалив все, кроме чисел в конце */
const getArticleNumberRegex = /\d+?$/;

/** Поиск слов из customSeriesNames */
const existsCustomSeriesNameRegex = new RegExp( `(?<=^|\\s)${ customSeriesNamesRegexString }(?=$|\\s)`, "" );

const wrongWordsRegexToRegex = new RegExp( `(?<=\\s)${ wrongWordsRegexStringToReplace }(?=$|\\s)`, "" );

/** Найти не редактируемое корректное название комикса
 * Которое без чисел
 * с числом в конце, нумерацией в конце или с числом в конце и буквой после (до искомого отсутсвует число )
 * с числом перед которым идет "Volume"
 */
const correctComicBookNameRegex = new RegExp( `^\\D+?$|(?<!\\s\\d+?\\s.*?)\\s(?:#{0,1}\\d{1,4}[A-Za-z]*?)$|(?<=Volume)\\s\\d{1,4}(?:\\s|:)`, "" );

/** Заменить пробел на номер комикса
 * после числа с "Vol"|"Vol."|"Volume" если есть
 * перед словом из wordsAfterNumbering
 */
const replaceSpaceWithComicBookNumberRegex = new RegExp( `(?<=(Vol.{0,1}|Volume)\\s\\d+?)\\s|\\s(?=${ wordsAfterNumbering.join("|") })`, "" );

/** Добавляем кнопку после загрузки страницы */
( function() {
    'use strict';
    setTimeout(() => {
        addDownloadCSVButton();
    }, 0)
} )();




// ---- маппинг цен для подписки ----
const priceMapRows = [
    { cover: '1',     don: 412,  all: 516 },
    { cover: '1,99',  don: 556,  all: 696 },
    { cover: '2,99',  don: 700,  all: 876 },
    { cover: '3,99',  don: 848,  all: 1060 },
    { cover: '4,69',  don: 948,  all: 1188 },
    { cover: '4,99',  don: 992,  all: 1240 },
    { cover: '5,99',  don: 1136, all: 1420 },
    { cover: '6,99',  don: 1332, all: 1668 },
    { cover: '7,99',  don: 1592, all: 1992 },
    { cover: '8,99',  don: 1736, all: 2172 },
    { cover: '9,99',  don: 1968, all: 2460 },
    { cover: '10,99', don: 2136, all: 2672 },
    { cover: '11,99', don: 2392, all: 2992 },
    { cover: '12,99', don: 2648, all: 3312 },
    { cover: '13,99', don: 2904, all: 3632 },
    { cover: '14,99', don: 3048, all: 3812 }
];

const priceMap = {};
priceMapRows.forEach(row => {
    // "1,99" -> 1.99 -> "1.99"
    const num = parseFloat(String(row.cover).replace(',', '.'));
    if (!isNaN(num)) {
        priceMap[num.toFixed(2)] = { don: row.don, all: row.all };
    }
});

// нормализуем строку цены "1.99" / "1,99" / "$1.99" -> "1.99"
function normalizePriceKey(value) {
    if (value == null) return null;
    let s = String(value).trim().replace(/\$/g, '').replace(',', '.');
    const num = parseFloat(s);
    if (isNaN(num)) return null;
    return num.toFixed(2);
}

// базовый артикул: текущий месяц + 2, как SUB_FEB_26
function getArticleBase() {
    const now = new Date();
    const m = now.getMonth();          // 0..11
    const y = now.getFullYear();
    const targetIndex = (m + 2) % 12;
    const targetYear  = y + Math.floor((m + 2) / 12);
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const monStr = months[targetIndex];
    const year2 = String(targetYear).slice(-2);
    return `SUB_${monStr}_${year2}`;
}
















/** Добавляем кнопку скачивания файла на страницу */
function addDownloadCSVButton() {
    const button = document.createElement( "button" );
    button.innerHTML = "Скачать прайс комиксов";
    button.addEventListener("click", () => {
        downloadTableAsCSV();
    });
    document.body.children[0].appendChild( button );
}

/** Находим таблицу и экспортируем ее в файле формата CSV */
function downloadTableAsCSV() {
    /**
     * Находим элементы таблицы по id таблицы и селекторам tr
     * Получаем CSV строку на основе данных из элементов таблицы
     * Создаем файл формата CSV и скачиваем его
     */

    //const selectorsPathOfBodyRows = `table#${ tableId } tbody tr`;
    //const bodyRowsElements = document.querySelectorAll( selectorsPathOfBodyRows );
    //const CSVString = getCSVString( bodyRowsElements );
    //const fileName = `comics_price_list_${ new Date().toLocaleDateString() }.csv`;
    //downloadFile( CSVString, fileName );
    const selectorsPathOfBodyRows = `table#${ tableId } tbody tr`;
    const bodyRowsElements = document.querySelectorAll(selectorsPathOfBodyRows);

    // уже готовый файл подписки
    const CSVString = getSubscriptionCSVString(bodyRowsElements);
    const fileName = `edge_subscription_${ new Date().toLocaleDateString() }.csv`;

    downloadFile(CSVString, fileName);

}

/** Получить CSV строки из tr элементов таблицы */
function getCSVString( rowsElements ) {
    /**
     * Пройтись циклом по tr элементам таблицы
     * Найти название издательства
     * Найти данные комикса, если предыдущая строка была названием издательства, то объединить с ней, иначе скопировать из предыдущего комикса
     * Преобразовать все строки в CSV строку
     */

    const CSVRowsStrings = [];
    CSVRowsStrings.push( CSVHeadersRowString );
    rowsElements.forEach(( rowElement, rowElementIndex ) => {
        const rowColumnsStrings = [];
        const rowColumnsElements = rowElement.querySelectorAll( "td" );
        const previousRowElement = rowsElements[ rowElementIndex - 1 ];
        const previousRowColumnsElements = rowElementIndex !== 0 ? previousRowElement.querySelectorAll( "td" ) : [];
        const isPublishingNameCurrentRow = rowColumnsElements.length === 1;
        const isPublishingNamePreviousRow = rowElementIndex !== 0 && previousRowColumnsElements.length === 1;

        if ( isPublishingNameCurrentRow ) {
            const publishingNameCol = rowColumnsElements[ 0 ];
            const publishingName = getTableColumnText( publishingNameCol );
            CSVRowsStrings.push( getCSVText( publishingName ) );
            return;
        }
        if ( !isPublishingNamePreviousRow ) {
            const previousCSVString = CSVRowsStrings[ CSVRowsStrings.length - 1 ];
            const previousStringCSVPublishingName = previousCSVString
                .replace( /;.+/g, "" )
                .replace( /"+/g, "" );
            rowColumnsStrings.push( previousStringCSVPublishingName );
        }
        const comicBookRowStrings = getComicBookRowStrings( rowElement );
        rowColumnsStrings.push( ...comicBookRowStrings );
        const CSVRowColumnsString = rowColumnsStrings.map( text => getCSVText( text ) ).join( ";" );

        if ( CSVRowsStrings.length === 1 || !isPublishingNamePreviousRow ) {
            CSVRowsStrings.push( CSVRowColumnsString );
        } else {
            CSVRowsStrings[ CSVRowsStrings.length - 1 ] += ( `;${ CSVRowColumnsString }` );
        }
    });

    return CSVRowsStrings.join( "\n" );
}




function getSubscriptionCSVString(rowsElements) {
    const CSVRowsStrings = [];
    CSVRowsStrings.push(CSVHeadersRowString);

    let currentPublishingName = "";
    let index = 0; // для _1, _2, ...

    rowsElements.forEach((rowElement) => {
        const rowColumnsElements = rowElement.querySelectorAll("td");
        const isPublishingNameRow = rowColumnsElements.length === 1;

        if (isPublishingNameRow) {
            // строка с издательством
            currentPublishingName = getTableColumnText(rowColumnsElements[0]);
            return;
        }

        if (!currentPublishingName) {
            // комиксы без строки издательства — пропускаем
            return;
        }

        // получаем строки, как раньше
        const rowStrings = getComicBookRowStrings(rowElement);
        // порядок из columnElementIndexesCollection:
        // 0: seriesName
        // 1: comicBookName
        // 2: oldComicBookName
        // 3: retail
        // 4: yourPrice
        const seriesName   = rowStrings[0];
        const comicBookName   = rowStrings[1];
        const retailRaw    = rowStrings[3] || "";
        const yourPriceRaw = rowStrings[4] || "";

        // очищаем $ и пробелы
        const retailClean    = retailRaw.replace(/\$/g, "").trim();
        const yourPriceClean = yourPriceRaw.replace(/\$/g, "").trim();
        const retailCleanSafe    = retailClean.replace(".", ",").trim();
        const yourPriceCleanSafe = yourPriceClean.replace(".", ",").trim();

        // правило: tp / sc / gn / hc — без рублёвых цен
        const seriesLower = (comicBookName || "").toLowerCase();
        const isSpecialFormat =
            seriesLower.includes("tp") ||
            seriesLower.includes("sc ") ||
            seriesLower.includes("gn") ||
            seriesLower.includes("hc");

        let donPrice = "";
        let allPrice = "";

        if (!isSpecialFormat) {
            const key = normalizePriceKey(retailClean);
            if (key && priceMap[key]) {
                donPrice = String(priceMap[key].don);
                allPrice = String(priceMap[key].all);
            }
        }

        index++;
        const articleBase = getArticleBase();
        const article = `${articleBase}_${index}`;

        const row = [
            article,                      // Артикул
            "Подписка",                   // Корневая
            currentPublishingName,        // Издательство
            seriesName,                   // Название серии
            comicBookName,                   // Наименование товара или услуги
            allPrice,                     // Цена продажи
            donPrice,                     // Тип цен: Дон
            retailCleanSafe,                  // Retail (доллары без $)
            yourPriceCleanSafe,               // Your Price (доллары без $)
            "Каталог/Подписка",           // Размещение
            "Скрыт",                      // Видимость
            "Подписка"                    // Штрих-код
        ];

        const CSVRowColumnsString = row.map(text => getCSVText(text)).join(";");
        CSVRowsStrings.push(CSVRowColumnsString);
    });

    return CSVRowsStrings.join("\n");
}














/** Создаем скрытую ссылку для скачивания файла и скачиваем файл */
function downloadFile(fileDataString, fileName) {
    const csvWithBom = "\uFEFF" + fileDataString; // BOM в начале

    const link = document.createElement("a");
    link.style.display = "none";
    link.setAttribute("target", "_blank");
    link.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvWithBom)
    );
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


/** Получить строки из ряда таблицы с данными о комиксе */
function getComicBookRowStrings( rowElement ) {
    /**
     * Получить строки столбцов по ключу столбов из columnElementIndexesCollection
     */

    const rowColumnsElements = rowElement.querySelectorAll( "td" );
    const descriptionColumnElement = rowColumnsElements[ columnElementIndexesCollection.description ];
    const rowsStrings = [];
    let existsErrorInRow = false;

    columnElementIndexesKeys.forEach( columnElementIndexesKey => {

        if ( columnElementIndexesKey === "seriesName" ) {
            const strongElement = descriptionColumnElement.querySelector( "strong" );
            const comicBookName = strongElement ? getTableColumnText( strongElement ) : "";
            const comicBookNameObj = getComicBookNameObj( comicBookName );
            const seriesNameObj = getSeriesNameObj( comicBookNameObj.text );
            rowsStrings.push( seriesNameObj.text );
            if ( comicBookNameObj.isError || seriesNameObj.isError ) {
                existsErrorInRow = true;
            }
            return;
        }
        if ( columnElementIndexesKey === "comicBookName" ) {
            const strongElement = descriptionColumnElement.querySelector( "strong" );
            const comicBookName = strongElement ? getTableColumnText( strongElement ) : "";
            const comicBookNameObj = getComicBookNameObj( comicBookName );
            rowsStrings.push( comicBookNameObj.text );
            if ( comicBookNameObj.isError ) {
                existsErrorInRow = true;
            }
            return;
        }
        if ( columnElementIndexesKey === "oldComicBookName" ) {
            /** Тестовый столбец */

            const strongElement = descriptionColumnElement.querySelector( 'strong' );
            const comicBookName = strongElement ? getTableColumnText( strongElement ) : "";
            rowsStrings.push( comicBookName );
            return;
        }
        if ( columnElementIndexesKey === "description" ) {
            const divElement = Array.from( descriptionColumnElement.childNodes )
                .find( item => item.localName && item.localName === "div" );
            const description = getTableColumnText( divElement );
            const comicBookDescription = getComicBookDescription( description );
            rowsStrings.push( comicBookDescription );
            return;
        }
        if ( columnElementIndexesKey === "articleNumber" ) {
            /** Получить id комикса из tr таблицы */

            const currentRowId = rowElement.getAttribute("id");
            const articleNumber = currentRowId ? currentRowId.match( getArticleNumberRegex)[0] : "";
            rowsStrings.push( articleNumber );
            if ( !articleNumber ) {
                existsErrorInRow = true;
            }
            return;
        }
        if ( columnElementIndexesKey === "errorInRow" ) {
            /** Добавить текст "Fix", если в тексте любого из столбцов есть ошибка */

            const fixInRowColumnText = existsErrorInRow ? "Fix" : "";
            rowsStrings.push( fixInRowColumnText );
            return;
        }
        const columnIndex = columnElementIndexesCollection[ columnElementIndexesKey ];
        const columnElement = rowColumnsElements[ columnIndex ];
        const columnText = getTableColumnText( columnElement );
        rowsStrings.push( columnText );
    });

    return rowsStrings;
}

/** Получить отредактированное название серии */
function getSeriesNameObj( text ) {
    /**
     * Получить отредактированное название комикса
     * Отредактировать название серии
     */

    const comicBookNameObj = getComicBookNameObj( text );
    let seriesName = comicBookNameObj.text;
    let errorInString = false;

    if ( existsCustomSeriesNameRegex.test( seriesName ) ) {
        /** Если есть слово из customSeriesNames, заменить название серии на это слово */

        const filteredWord = customSeriesNames.find( word => {
            const firstIndexOfWordInString = seriesName.lastIndexOf( word );
            return firstIndexOfWordInString >= 0;
        });

        if ( filteredWord ) {
            seriesName = filteredWord;
        }
    } else if ( wordsByWhichToTrimSeriesNameRegex.test( seriesName ) ) {
        /** Если найдено слово из регулярки wordsByWhichToTrimSeriesNameRegex, обрезать название серии до этого слова */

        seriesName = seriesName.replace( wordsByWhichToTrimSeriesNameRegex, "");
    } else {
        /**
         * Если ни одно условие не совпало, скорее всего в названии серии ошибка
         * Отметить названия с неизвестной проблемой, которую нужно решить руками
         */

        /** TODO - Проверить правильность работы */
        errorInString = true;
    }

    return {
        text: seriesName,
        isError: comicBookNameObj.error | errorInString
    };
}

/** Получить отредактированное название комикса */
function getComicBookNameObj( text ) {
    /**
     * Отредактировать название комикса
     * Добавить "#" к числам
     */

    let errorInString = false;
    let comicBookName = text.replace( replaceSpaceBeforeComicBookNumberRegex, " #");

    if ( correctComicBookNameRegex.test(comicBookName) ) {
        /** Найти неправильные слова из wordsCollectionToReplaceWrongWords в названии комикса и переименовать в правильные */

        wordsKeysToReplaceWrongWords.forEach( wrongWord => {
            const wordWithShieldedSpecialCharacters = wrongWord.replace( escapeAllSpecialCharactersRegex, "\\$&");
            const rightWord = wordsCollectionToReplaceWrongWords[ wrongWord ];
            const replaceWrongWordRegex = new RegExp( `(?<=\\s)${ wordWithShieldedSpecialCharacters }(?=$|\\s)`, "" );
            comicBookName = comicBookName.replace( replaceWrongWordRegex, rightWord );
        });
    }
    if ( removeNumbersAtEndOfComicBookNameRegex.test(comicBookName) ) {
        /** Удалить число
         * если есть число без "#" в конце строки и если в названии есть слово из wordsAfterWhichThereIsNoNumbering
         */

        comicBookName = comicBookName.replace( removeNumbersAtEndOfComicBookNameRegex, "" );
    } else if ( moveNumberingInsideComicBookNameRegex.test(comicBookName) ) {
        /**
         * Вырезать номер комикса в конце строки с "#" или без
         * если в названии есть "Annual" и число меньше 3-х значного
         * если в названии нет "Annual" и есть слово из wordsAfterNumbering
         *
         * Перенести номер комикса
         * после числа с "Vol"|"Vol."|"Volume" если есть
         * перед словом из wordsAfterNumbering
         */

        const [ comicBookNameWithoutComicBookNumber, comicBookNumber ] = comicBookName.split(/\s(?=#{0,1}\d+?$)/g);
        const comicBookNumberWithHashtag = comicBookNumber.includes("#") ? comicBookNumber : `#${ comicBookNumber }`;
        comicBookName = comicBookNameWithoutComicBookNumber.replace( replaceSpaceWithComicBookNumberRegex, ` ${ comicBookNumberWithHashtag } ` );
    } else if ( correctComicBookNameRegex.test( comicBookName ) ) {
        /** Условия для не редактируемых корректных данных
         * Названия без чисел
         * Названия с нумерацией в конце
         * Названия с числом в конце и буквой после
         */

        /** TODO - Попадают названия
         * с "Cvr" но без числа - Three Stooges Play Ball Special Cvr C Ltd Ed Board Game
         *
         * Не попадают названия
         * без числа - Complete Comet Jet Ace Logan Stories
         */
    } else {
        /**
         * Если ни одно условие не совпало, скорее всего в названии серии ошибка
         * Отметить названия с неизвестной проблемой, которую нужно решить руками
         */

        errorInString = true;
    }

    return {
        text: comicBookName,
        isError: errorInString
    };
}

/** Получить отредактированное описание комикса */
function getComicBookDescription( text ) {
    /**
     * Отредактировать описание комикса
     * Если есть авторы, должность у автора и должность не первая, то добавить "|"
     * Если есть авторы и должность у автора, то после должности добавить ":"
     * Заменить аббревиатуры должностей на должности из списка
     */

    let descriptionValueWithArtists = text
        .replace( replaceSpaceBeforePositionRegex, " | ")
        .replace( addCharacterAfterPositionRegex, ":");
    positionNamesKeys.forEach( positionKey => {
        const positionName = positionNamesCollection[ positionKey ];
        const replaceAbbreviatedPositionWithPositionRegex = new RegExp( `(?:(?<=\\/)|(?:\\())${ positionKey }+?(?:(?=\\/[A-Z])|(?:\\)))`, "" );
        descriptionValueWithArtists = descriptionValueWithArtists.replace( replaceAbbreviatedPositionWithPositionRegex, positionName );
    });
    return descriptionValueWithArtists;
}

/** Получить текст из элемента дерева */
function getTableColumnText( tableColumn ) {
    /**
     * Удалить несколько пробелов и разделительную линию
     */

    const text = tableColumn.innerText || tableColumn.textContent;

    return text
        .replace( /\r\n|\n|\r/gm, "" )
        .replace( /\s+?/gm, " " )
        .trim();
}

/** Получить форматированный текст для формата CSV */
function getCSVText( text ) {
    /**
     * Экранировать двойную кавычку с помощью удвоенной двойной кавычки
     */

    return '"' + text.replace( /"+/g, "" ) + '"';
}
