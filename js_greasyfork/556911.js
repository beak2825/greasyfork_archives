// ==UserScript==
// @name         UTST Translation Library
// @description  Central translation library for UTST
// @namespace    https://github.com/DREwX-code
// @author       Dℝ∃wX
// @version      1.0.2
// @license      Apache-2.0

// @grant        none

// ==/UserScript==

/*
Copyright 2025 Dℝ∃wX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


(function (global) {
    'use strict';

    const supportedUiLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh-CN', 'ja', 'ar', 'hi', 'ko', 'tr', 'nl', 'pl', 'id', 'vi', 'uk', 'he'];

    const languageNames = {
        'en': {
            'auto': 'Detect',
            'en': 'English',
            'fr': 'French',
            'es': 'Spanish',
            'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'zh-CN': 'Chinese (Simplified)',
        'ja': 'Japanese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'ko': 'Korean',
        'tr': 'Turkish',
        'nl': 'Dutch',
        'pl': 'Polish',
        'id': 'Indonesian',
        'vi': 'Vietnamese',
        'uk': 'Ukrainian',
        'he': 'Hebrew',
        'errors': {
            'noText': 'No text selected',
            'translation': 'Translation error',
            'connection': 'Connection error'
        },
            'tooltips': {
                'listenTranslated': 'Listen to translated text',
                'listenOriginal': 'Listen to original text'
            },
            'overlay': {
                'title': 'Fullscreen Translator',
                'source': 'Source text',
                'target': 'Translated text',
                'translate': 'Translate',
                'open': 'Fullscreen',
                'sourceLangLabel': 'Source language',
                'targetLangLabel': 'Target language'
            },
            'dragHandleLabel': 'Move',
            'settingsTitle': 'Settings',
        'settingsDefaultLabel': 'Default translation language:',
        'settingsToolLabel': 'Tool language:',
        'navigator': 'Browser language',
        },
        'ar': {
            'auto': 'اكتشاف',
            'en': 'الإنجليزية',
            'fr': 'الفرنسية',
            'es': 'الإسبانية',
            'de': 'الألمانية',
            'it': 'الإيطالية',
            'pt': 'البرتغالية',
            'ru': 'الروسية',
            'zh-CN': 'الصينية (المبسطة)',
            'ja': 'اليابانية',
            'errors': {
                'noText': 'لم يتم تحديد أي نص',
                'translation': 'خطأ في الترجمة',
                'connection': 'خطأ في الاتصال'
            },
            'tooltips': {
                'listenTranslated': 'الاستماع إلى النص المترجم',
                'listenOriginal': 'الاستماع إلى النص الأصلي'
            },
            'overlay': {
                'title': 'مترجم ملء الشاشة',
                'source': 'النص المصدر',
                'target': 'النص المترجم',
                'translate': 'ترجمة',
                'open': 'ملء الشاشة',
                'sourceLangLabel': 'لغة المصدر',
                'targetLangLabel': 'اللغة المستهدفة'
            },
            'dragHandleLabel': 'نقل',
            'settingsTitle': 'إعدادات',
            'settingsDefaultLabel': 'لغة الترجمة الافتراضية:',
            'settingsToolLabel': 'لغة الأداة:',
            'navigator': 'لغة المتصفح',

        },
        'hi': {
            'auto': 'पता लगाएं',
            'en': 'अंग्रेजी',
            'fr': 'फ़्रेंच',
            'es': 'स्पैनिश',
            'de': 'जर्मन',
            'it': 'इतालवी',
            'pt': 'पुर्तगाली',
            'ru': 'रूसी',
            'zh-CN': 'सरलीकृत चीनी',
            'ja': 'जापानी',
            'errors': {
                'noText': 'कोई पाठ चयनित नहीं',
                'translation': 'अनुवाद त्रुटि',
                'connection': 'कनेक्शन त्रुटि'
            },
            'tooltips': {
                'listenTranslated': 'अनुवादित पाठ सुनें',
                'listenOriginal': 'मूल पाठ सुनें'
            },
            'overlay': {
                'title': 'पूर्ण स्क्रीन अनुवादक',
                'source': 'स्रोत पाठ',
                'target': 'अनुवादित पाठ',
                'translate': 'अनुवाद',
                'open': 'पूर्ण स्क्रीन',
                'sourceLangLabel': 'स्रोत भाषा',
                'targetLangLabel': 'लक्ष्य भाषा'
            },
            'dragHandleLabel': 'स्थानांतरित करें',
            'settingsTitle': 'सेटिंग्स',
            'settingsDefaultLabel': 'डिफ़ॉल्ट अनुवाद भाषा:',
            'settingsToolLabel': 'उपकरण भाषा:',
            'navigator': 'ब्राउज़र भाषा',

        },
        'ko': {
            'auto': '감지',
            'en': '영어',
            'fr': '프랑스어',
            'es': '스페인어',
            'de': '독일어',
            'it': '이탈리아어',
            'pt': '포르투갈어',
            'ru': '러시아어',
            'zh-CN': '중국어(간체)',
            'ja': '일본어',
            'errors': {
                'noText': '선택한 텍스트가 없습니다',
                'translation': '번역 오류',
                'connection': '연결 오류'
            },
            'tooltips': {
                'listenTranslated': '번역된 텍스트 듣기',
                'listenOriginal': '원본 텍스트 듣기'
            },
            'overlay': {
                'title': '전체 화면 번역기',
                'source': '원본 텍스트',
                'target': '번역된 텍스트',
                'translate': '번역',
                'open': '전체 화면',
                'sourceLangLabel': '소스 언어',
                'targetLangLabel': '대상 언어'
            },
            'dragHandleLabel': '이동',
            'settingsTitle': '설정',
            'settingsDefaultLabel': '기본 번역 언어:',
            'settingsToolLabel': '도구 언어:',
            'navigator': '브라우저 언어',

        },
        'tr': {
            'auto': 'Algıla',
            'en': 'İngilizce',
            'fr': 'Fransızca',
            'es': 'İspanyolca',
            'de': 'Almanca',
            'it': 'İtalyanca',
            'pt': 'Portekizce',
            'ru': 'Rusça',
            'zh-CN': 'Çince (Basitleştirilmiş)',
            'ja': 'Japonca',
            'errors': {
                'noText': 'Metin seçilmedi',
                'translation': 'Çeviri hatası',
                'connection': 'Bağlantı hatası'
            },
            'tooltips': {
                'listenTranslated': 'Çevrilmiş metni dinle',
                'listenOriginal': 'Orijinal metni dinle'
            },
            'overlay': {
                'title': 'Tam ekran çevirmen',
                'source': 'Kaynak metin',
                'target': 'Çevrilmiş metin',
                'translate': 'Çevir',
                'open': 'Tam ekran',
                'sourceLangLabel': 'Kaynak dil',
                'targetLangLabel': 'Hedef dil'
            },
            'dragHandleLabel': 'Taşı',
            'settingsTitle': 'Ayarlar',
            'settingsDefaultLabel': 'Varsayılan çeviri dili:',
            'settingsToolLabel': 'Araç dili:',
            'navigator': 'Tarayıcı dili',

        },
        'nl': {
            'auto': 'Detecteer',
            'en': 'Engels',
            'fr': 'Frans',
            'es': 'Spaans',
            'de': 'Duits',
            'it': 'Italiaans',
            'pt': 'Portugees',
            'ru': 'Russisch',
            'zh-CN': 'Chinees (vereenvoudigd)',
            'ja': 'Japans',
            'errors': {
                'noText': 'Geen tekst geselecteerd',
                'translation': 'Vertaalfout',
                'connection': 'Verbindingsfout'
            },
            'tooltips': {
                'listenTranslated': 'Luister naar vertaalde tekst',
                'listenOriginal': 'Luister naar de originele tekst'
            },
            'overlay': {
                'title': 'Vertaler op volledig scherm',
                'source': 'Brontekst',
                'target': 'Vertaald tekst',
                'translate': 'Vertalen',
                'open': 'Volledig scherm',
                'sourceLangLabel': 'Brontaal',
                'targetLangLabel': 'Doeltaal'
            },
            'dragHandleLabel': 'Verplaats',
            'settingsTitle': 'Instellingen',
            'settingsDefaultLabel': 'Standaard vertalingstaal:',
            'settingsToolLabel': 'Gereedschapstaal:',
            'navigator': 'Browsertaal',

        },
        'pl': {
            'auto': 'Wykryj',
            'en': 'Angielski',
            'fr': 'Francuski',
            'es': 'Hiszpański',
            'de': 'Niemiecki',
            'it': 'Włoski',
            'pt': 'Portugalski',
            'ru': 'Rosyjski',
            'zh-CN': 'Chiński (uproszczony)',
            'ja': 'Japoński',
            'errors': {
                'noText': 'Nie wybrano tekstu',
                'translation': 'Błąd tłumaczenia',
                'connection': 'Błąd połączenia'
            },
            'tooltips': {
                'listenTranslated': 'Odtwórz przetłumaczony tekst',
                'listenOriginal': 'Odtwórz tekst źródłowy'
            },
            'overlay': {
                'title': 'Tłumacz pełnoekranowy',
                'source': 'Tekst źródłowy',
                'target': 'Tekst tłumaczenia',
                'translate': 'Tłumacz',
                'open': 'Pełny ekran',
                'sourceLangLabel': 'Język źródłowy',
                'targetLangLabel': 'Język docelowy'
            },
            'dragHandleLabel': 'Przenieś',
            'settingsTitle': 'Ustawienia',
            'settingsDefaultLabel': 'Domyślny język tłumaczenia:',
            'settingsToolLabel': 'Język narzędzia:',
            'navigator': 'Język przeglądarki',

        },
        'id': {
            'auto': 'Deteksi',
            'en': 'Inggris',
            'fr': 'Prancis',
            'es': 'Spanyol',
            'de': 'Jerman',
            'it': 'Italia',
            'pt': 'Portugis',
            'ru': 'Rusia',
            'zh-CN': 'China (Sederhana)',
            'ja': 'Jepang',
            'errors': {
                'noText': 'Tidak ada teks yang dipilih',
                'translation': 'Kesalahan terjemahan',
                'connection': 'Kesalahan koneksi'
            },
            'tooltips': {
                'listenTranslated': 'Dengarkan teks terjemahan',
                'listenOriginal': 'Dengarkan teks asli'
            },
            'overlay': {
                'title': 'Penerjemah Layar Penuh',
                'source': 'Teks sumber',
                'target': 'Teks terjemahan',
                'translate': 'Terjemahkan',
                'open': 'Layar penuh',
                'sourceLangLabel': 'Bahasa sumber',
                'targetLangLabel': 'Bahasa target'
            },
            'dragHandleLabel': 'Pindahkan',
            'settingsTitle': 'Pengaturan',
            'settingsDefaultLabel': 'Bahasa terjemahan bawaan:',
            'settingsToolLabel': 'Bahasa alat:',
            'navigator': 'Bahasa browser',

        },
        'vi': {
            'auto': 'Phát hiện',
            'en': 'Tiếng Anh',
            'fr': 'Tiếng Pháp',
            'es': 'Tiếng Tây Ban Nha',
            'de': 'Tiếng Đức',
            'it': 'Tiếng Ý',
            'pt': 'Tiếng Bồ Đào Nha',
            'ru': 'Tiếng Nga',
            'zh-CN': 'Tiếng Trung (Giản thể)',
            'ja': 'Tiếng Nhật',
            'errors': {
                'noText': 'Không có văn bản được chọn',
                'translation': 'Lỗi dịch',
                'connection': 'Lỗi kết nối'
            },
            'tooltips': {
                'listenTranslated': 'Nghe văn bản đã dịch',
                'listenOriginal': 'Nghe văn bản gốc'
            },
            'overlay': {
                'title': 'Trình dịch toàn màn hình',
                'source': 'Văn bản nguồn',
                'target': 'Văn bản dịch',
                'translate': 'Dịch',
                'open': 'Toàn màn hình',
                'sourceLangLabel': 'Ngôn ngữ nguồn',
                'targetLangLabel': 'Ngôn ngữ đích'
            },
            'dragHandleLabel': 'Di chuyển',
            'settingsTitle': 'Cài đặt',
            'settingsDefaultLabel': 'Ngôn ngữ dịch mặc định:',
            'settingsToolLabel': 'Ngôn ngữ công cụ:',
            'navigator': 'Ngôn ngữ trình duyệt',

        },
        'uk': {
            'auto': 'Визначити',
            'en': 'Англійська',
            'fr': 'Французька',
            'es': 'Іспанська',
            'de': 'Німецька',
            'it': 'Італійська',
            'pt': 'Португальська',
            'ru': 'Російська',
            'zh-CN': 'Китайська (спрощена)',
            'ja': 'Японська',
            'errors': {
                'noText': 'Текст не вибрано',
                'translation': 'Помилка перекладу',
                'connection': 'Помилка з’єднання'
            },
            'tooltips': {
                'listenTranslated': 'Прослухати перекладений текст',
                'listenOriginal': 'Прослухати оригінальний текст'
            },
            'overlay': {
                'title': 'Перекладач на весь екран',
                'source': 'Вихідний текст',
                'target': 'Перекладений текст',
                'translate': 'Перекласти',
                'open': 'Повний екран',
                'sourceLangLabel': 'Мова джерела',
                'targetLangLabel': 'Мова перекладу'
            },
            'dragHandleLabel': 'Перемістити',
            'settingsTitle': 'Налаштування',
            'settingsDefaultLabel': 'Мова перекладу за замовчуванням:',
            'settingsToolLabel': 'Мова інструмента:',
            'navigator': 'Мова браузера',

        },
        'he': {
            'auto': 'זיהוי',
            'en': 'אנגלית',
            'fr': 'צרפתית',
            'es': 'ספרדית',
            'de': 'גרמנית',
            'it': 'איטלקית',
            'pt': 'פורטוגזית',
            'ru': 'רוסית',
            'zh-CN': 'סינית (מפושטת)',
            'ja': 'יפנית',
            'errors': {
                'noText': 'לא נבחר טקסט',
                'translation': 'שגיאת תרגום',
                'connection': 'שגיאת חיבור'
            },
            'tooltips': {
                'listenTranslated': 'האזן לטקסט המתורגם',
                'listenOriginal': 'האזן לטקסט המקורי'
            },
            'overlay': {
                'title': 'מתרגם במסך מלא',
                'source': 'טקסט מקור',
                'target': 'טקסט מתורגם',
                'translate': 'תרגם',
                'open': 'מסך מלא',
                'sourceLangLabel': 'שפת מקור',
                'targetLangLabel': 'שפת יעד'
            },
            'dragHandleLabel': 'הזז',
            'settingsTitle': 'הגדרות',
            'settingsDefaultLabel': 'שפת תרגום ברירת מחדל:',
            'settingsToolLabel': 'שפת הכלי:',
            'navigator': 'שפת הדפדפן',

        },
        'fr': {
            'auto': 'Détecter',
            'en': 'Anglais',
            'fr': 'Français',
            'es': 'Espagnol',
            'de': 'Allemand',
            'it': 'Italien',
            'pt': 'Portugais',
            'ru': 'Russe',
            'zh-CN': 'Chinois (Simplifié)',
            'ja': 'Japonais',
            'errors': {
                'noText': 'Aucun texte sélectionné',
                'translation': 'Erreur de traduction',
                'connection': 'Erreur de connexion'
            },
            'tooltips': {
                'listenTranslated': 'Écoute le texte traduit',
                'listenOriginal': 'Écoute le texte original'
            },
            'overlay': {
                'title': 'Traduction plein écran',
                'source': 'Texte source',
                'target': 'Texte traduit',
                'translate': 'Traduire',
                'open': 'Plein écran',
                'sourceLangLabel': 'Langue source',
                'targetLangLabel': 'Langue cible'
            },
            'dragHandleLabel': 'Déplacer',
            'settingsTitle': 'Paramètres',
            'settingsDefaultLabel': 'Langue de traduction par défaut :',
            'settingsToolLabel': "Langue de l'outil :",
            'navigator': 'Langue du navigateur',

        },
        'es': {
            'auto': 'Detectar',
            'en': 'Inglés',
            'fr': 'Francés',
            'es': 'Español',
            'de': 'Alemán',
            'it': 'Italiano',
            'pt': 'Portugués',
            'ru': 'Ruso',
            'zh-CN': 'Chino (Simplificado)',
            'ja': 'Japonés',
            'errors': {
                'noText': 'No hay texto seleccionado',
                'translation': 'Error de traducción',
                'connection': 'Error de conexión'
            },
            'tooltips': {
                'listenTranslated': 'Escuchar el texto traducido',
                'listenOriginal': 'Escuchar el texto original'
            },
            'dragHandleLabel': 'Mover',
            'settingsTitle': 'Configuración',
            'settingsDefaultLabel': 'Idioma de traducción predeterminado:',
            'settingsToolLabel': 'Idioma de la interfaz:',
            'navigator': 'Idioma del navegador',
        },
        'de': {
            'auto': 'Erkennen',
            'en': 'Englisch',
            'fr': 'Französisch',
            'es': 'Spanisch',
            'de': 'Deutsch',
            'it': 'Italienisch',
            'pt': 'Portugiesisch',
            'ru': 'Russisch',
            'zh-CN': 'Chinesisch (Vereinfacht)',
            'ja': 'Japanisch',
            'errors': {
                'noText': 'Kein Text ausgewählt',
                'translation': 'Übersetzungsfehler',
                'connection': 'Verbindungsfehler'
            },
            'tooltips': {
                'listenTranslated': 'Übersetzten Text anhören',
                'listenOriginal': 'Originaltext anhören'
            },
            'dragHandleLabel': 'Verschieben',
            'settingsTitle': 'Einstellungen',
            'settingsDefaultLabel': 'Standardübersetzungssprache:',
            'settingsToolLabel': 'Werkzeugsprache:',
            'navigator': 'Browser-Sprache',
        },
        'it': {
            'auto': 'Rileva',
            'en': 'Inglese',
            'fr': 'Francese',
            'es': 'Spagnolo',
            'de': 'Tedesco',
            'it': 'Italiano',
            'pt': 'Portoghese',
            'ru': 'Russo',
            'zh-CN': 'Cinese (Semplificato)',
            'ja': 'Giapponese',
            'errors': {
                'noText': 'Nessun testo selezionato',
                'translation': 'Errore di traduzione',
                'connection': 'Errore di connessione'
            },
            'tooltips': {
                'listenTranslated': 'Ascolta il testo tradotto',
                'listenOriginal': 'Ascolta il testo originale'
            },
            'dragHandleLabel': 'Spostare',
            'settingsTitle': 'Impostazioni',
            'settingsDefaultLabel': 'Lingua di traduzione predefinita:',
            'settingsToolLabel': "Lingua dell'interfaccia:",
            'navigator': 'Lingua del browser',
        },
        'pt': {
            'auto': 'Detectar',
            'en': 'Inglês',
            'fr': 'Francês',
            'es': 'Espanhol',
            'de': 'Alemão',
            'it': 'Italiano',
            'pt': 'Português',
            'ru': 'Russo',
            'zh-CN': 'Chinês (Simplificado)',
            'ja': 'Japonês',
            'errors': {
                'noText': 'Nenhum texto selecionado',
                'translation': 'Erro de tradução',
                'connection': 'Erro de conexão'
            },
            'tooltips': {
                'listenTranslated': 'Ouvir o texto traduzido',
                'listenOriginal': 'Ouvir o texto original'
            },
            'dragHandleLabel': 'Mover',
            'settingsTitle': 'Configurações',
            'settingsDefaultLabel': 'Idioma de tradução padrão:',
            'settingsToolLabel': 'Idioma da interface:',
            'navigator': 'Idioma do navegador',
        },
        'ru': {
            'auto': 'Определить',
            'en': 'Английский',
            'fr': 'Французский',
            'es': 'Испанский',
            'de': 'Немецкий',
            'it': 'Итальянский',
            'pt': 'Португальский',
            'ru': 'Русский',
            'zh-CN': 'Китайский (упрощённый)',
            'ja': 'Японский',
            'errors': {
                'noText': 'Текст не выделен',
                'translation': 'Ошибка перевода',
                'connection': 'Ошибка соединения'
            },
            'tooltips': {
                'listenTranslated': 'Прослушать переведённый текст',
                'listenOriginal': 'Прослушать оригинальный текст'
            },
            'dragHandleLabel': 'Переместить',
            'settingsTitle': 'Настройки',
            'settingsDefaultLabel': 'Язык перевода по умолчанию:',
            'settingsToolLabel': 'Язык интерфейса:',
            'navigator': 'Язык браузера',
        },
        'zh-CN': {
            'auto': '检测',
            'en': '英语',
            'fr': '法语',
            'es': '西班牙语',
            'de': '德语',
            'it': '意大利语',
            'pt': '葡萄牙语',
            'ru': '俄语',
            'zh-CN': '中文（简体）',
            'ja': '日语',
            'errors': {
                'noText': '未选择文本',
                'translation': '翻译错误',
                'connection': '连接错误'
            },
            'tooltips': {
                'listenTranslated': '聆听翻译文本',
                'listenOriginal': '聆听原文'
            },
            'dragHandleLabel': '移动',
            'settingsTitle': '设置',
            'settingsDefaultLabel': '默认翻译语言：',
            'settingsToolLabel': '界面语言：',
            'navigator': '浏览器语言',
        },
        'ja': {
            'auto': '検出',
            'en': '英語',
            'fr': 'フランス語',
            'es': 'スペイン語',
            'de': 'ドイツ語',
            'it': 'イタリア語',
            'pt': 'ポルトガル語',
            'ru': 'ロシア語',
            'zh-CN': '中国語（簡体）',
            'ja': '日本語',
            'errors': {
                'noText': 'テキストが選択されていません',
                'translation': '翻訳エラー',
                'connection': '接続エラー'
            },
            'tooltips': {
                'listenTranslated': '翻訳されたテキストを聞く',
                'listenOriginal': '元のテキストを聞く'
            },
            'dragHandleLabel': '移動',
            'settingsTitle': '設定',
            'settingsDefaultLabel': '既定の翻訳言語：',
            'settingsToolLabel': 'ツールの言語：',
            'navigator': 'ブラウザの言語',
        }
    };

    

    const library = {
        supportedUiLanguages,
        languageNames
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = library;
    }

    if (global) {
        global.TraductionOutilTranslator = library;
    }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
