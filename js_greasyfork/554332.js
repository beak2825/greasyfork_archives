// ==UserScript==
// @name         Поиск похожих биографий
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Автоматический поиск похожих биографий для проверки на плагиат
// @license      MIT
// @author       You
// @match        https://forum.blackrussia.online/threads/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/554332/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D0%BE%D1%85%D0%BE%D0%B6%D0%B8%D1%85%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/554332/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D0%BE%D1%85%D0%BE%D0%B6%D0%B8%D1%85%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const CONFIG = {
        MIN_SIMILARITY: 0.7, // Минимальная схожесть для показа (70%)
        MAX_RESULTS: 10,     // Максимальное количество результатов
        SEARCH_TIMEOUT: 30000, // Таймаут поиска (30 секунд)
        CACHE_DURATION: 24 * 60 * 60 * 1000 // Кэш на 24 часа
    };

    // Функция для проверки, что это раздел биографий
    function isBiographySection() {
        const breadcrumb = document.querySelector('.p-breadcrumbs');
        if (breadcrumb) {
            const breadcrumbText = breadcrumb.textContent.toLowerCase();
            if (breadcrumbText.includes('рп-биографии') || 
                breadcrumbText.includes('биографи') ||
                document.URL.includes('/forums/РП-биографии')) {
                return true;
            }
        }
        
        const title = document.querySelector('.p-title-value');
        if (title && title.textContent.toLowerCase().includes('биографи')) {
            return true;
        }
        
        if (document.URL.includes('биографи')) {
            return true;
        }
        
        return false;
    }

    // Функция для проверки, что это первое сообщение темы
    function isFirstPost(post) {
        const allPosts = document.querySelectorAll('.message--post');
        if (allPosts.length === 0) return false;
        return post === allPosts[0];
    }

    // Функция для получения текста биографии
    function getBiographyText(post) {
        const content = post.querySelector('.bbWrapper');
        if (!content) return '';

        let text = content.innerHTML;
        // Удаляем цитаты, подписи и BB-коды
        text = text.replace(/<blockquote.*?<\/blockquote>/gs, '');
        text = text.replace(/\[quote.*?\[\/quote\]/gs, '');
        text = text.replace(/\[.*?\]/g, ' ');
        
        const signature = content.querySelector('.message-signature');
        if (signature) {
            text = text.replace(signature.outerHTML, '');
        }
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        let cleanText = tempDiv.textContent || tempDiv.innerText || '';
        
        // Очищаем текст
        cleanText = cleanText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        cleanText = cleanText.replace(/[^\w\sа-яА-ЯёЁ]/g, ' ');
        cleanText = cleanText.replace(/\s+/g, ' ').trim();
        
        return cleanText;
    }

    // Функция для создания сигнатуры текста (для сравнения)
    function createTextSignature(text) {
        // Приводим к нижнему регистру и удаляем лишние пробелы
        text = text.toLowerCase().replace(/\s+/g, ' ').trim();
        
        // Разбиваем на слова и сортируем
        const words = text.split(' ').filter(word => word.length > 3);
        
        // Создаем n-граммы (последовательности из 3 слов)
        const ngrams = [];
        for (let i = 0; i <= words.length - 3; i++) {
            ngrams.push(words.slice(i, i + 3).join(' '));
        }
        
        return {
            words: words,
            ngrams: ngrams,
            length: text.length,
            wordCount: words.length
        };
    }

    // Функция для вычисления схожести текстов
    function calculateSimilarity(sig1, sig2) {
        if (sig1.wordCount < 10 || sig2.wordCount < 10) return 0;
        
        // Вычисляем схожесть по n-граммам
        const commonNgrams = sig1.ngrams.filter(ngram => 
            sig2.ngrams.includes(ngram)
        ).length;
        
        const totalNgrams = Math.max(sig1.ngrams.length, sig2.ngrams.length);
        const ngramSimilarity = commonNgrams / totalNgrams;
        
        // Вычисляем схожесть по уникальным словам
        const commonWords = sig1.words.filter(word => 
            sig2.words.includes(word)
        ).length;
        
        const totalWords = Math.max(sig1.words.length, sig2.words.length);
        const wordSimilarity = commonWords / totalWords;
        
        // Комбинируем метрики
        return (ngramSimilarity * 0.7 + wordSimilarity * 0.3);
    }

    // Функция для поиска похожих биографий на форуме
    async function searchSimilarBiographies(text, currentUrl) {
        return new Promise((resolve) => {
            const results = [];
            let processed = 0;
            let completed = false;

            const timeout = setTimeout(() => {
                completed = true;
                resolve(results);
            }, CONFIG.SEARCH_TIMEOUT);

            // Получаем список страниц раздела биографий
            const biographyPages = [
                'https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.254/',
                'https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.254/page-2',
                'https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.254/page-3'
            ];

            const currentSignature = createTextSignature(text);

            biographyPages.forEach((pageUrl, pageIndex) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: pageUrl,
                    onload: function(response) {
                        if (completed) return;
                        
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            
                            // Ищем ссылки на темы
                            const threadLinks = doc.querySelectorAll('a[href*="/threads/"]');
                            
                            threadLinks.forEach(link => {
                                if (completed) return;
                                
                                const threadUrl = link.href;
                                // Пропускаем текущую тему и не-биографии
                                if (threadUrl === currentUrl || !threadUrl.includes('биографи')) {
                                    return;
                                }
                                
                                // Загружаем тему
                                setTimeout(() => {
                                    GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: threadUrl,
                                        onload: function(threadResponse) {
                                            if (completed) return;
                                            
                                            try {
                                                const threadDoc = parser.parseFromString(threadResponse.responseText, 'text/html');
                                                const firstPost = threadDoc.querySelector('.message--post');
                                                
                                                if (firstPost && isFirstPost(firstPost)) {
                                                    const biographyText = getBiographyText(firstPost);
                                                    if (biographyText.length > 100) {
                                                        const signature = createTextSignature(biographyText);
                                                        const similarity = calculateSimilarity(currentSignature, signature);
                                                        
                                                        if (similarity >= CONFIG.MIN_SIMILARITY) {
                                                            const title = threadDoc.querySelector('.p-title-value');
                                                            const author = threadDoc.querySelector('.username');
                                                            
                                                            results.push({
                                                                url: threadUrl,
                                                                title: title ? title.textContent.trim() : 'Без названия',
                                                                author: author ? author.textContent.trim() : 'Неизвестно',
                                                                similarity: Math.round(similarity * 100),
                                                                text: biographyText.substring(0, 200) + '...'
                                                            });
                                                            
                                                            // Сортируем по схожести
                                                            results.sort((a, b) => b.similarity - a.similarity);
                                                            
                                                            // Ограничиваем количество результатов
                                                            if (results.length > CONFIG.MAX_RESULTS) {
                                                                results.length = CONFIG.MAX_RESULTS;
                                                            }
                                                        }
                                                    }
                                                }
                                            } catch (e) {
                                                console.error('Ошибка при анализе темы:', e);
                                            }
                                            
                                            processed++;
                                            if (processed >= threadLinks.length * biographyPages.length) {
                                                completed = true;
                                                clearTimeout(timeout);
                                                resolve(results);
                                            }
                                        },
                                        onerror: function() {
                                            processed++;
                                            if (processed >= threadLinks.length * biographyPages.length) {
                                                completed = true;
                                                clearTimeout(timeout);
                                                resolve(results);
                                            }
                                        }
                                    });
                                }, pageIndex * 1000); // Задержка между запросами
                            });
                            
                        } catch (e) {
                            console.error('Ошибка при парсинге страницы:', e);
                        }
                    },
                    onerror: function() {
                        processed++;
                        if (processed >= biographyPages.length) {
                            completed = true;
                            clearTimeout(timeout);
                            resolve(results);
                        }
                    }
                });
            });
        });
    }

    // Функция для создания визуализации результатов
    function createPlagiarismChecker(results, originalText) {
        const checker = document.createElement('div');
        checker.className = 'plagiarism-checker';
        checker.style.cssText = `
            margin: 20px 0;
            padding: 0;
            border-radius: 8px;
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            font-family: Arial, sans-serif;
        `;

        let html = `
            <div style="padding: 15px; border-bottom: 1px solid #dee2e6;">
                <h3 style="margin: 0 0 10px 0; color: #333;">🔍 Проверка на плагиат</h3>
                <div style="font-size: 14px; color: #666;">
                    Проверено похожих биографий: ${results.length}
                </div>
            </div>
        `;

        if (results.length === 0) {
            html += `
                <div style="padding: 20px; text-align: center;">
                    <div style="color: #28a745; font-size: 16px; margin-bottom: 10px;">
                        ✅ Похожих биографий не найдено
                    </div>
                    <div style="color: #666; font-size: 12px;">
                        Вероятно, биография уникальна
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="padding: 15px;">
                    <div style="color: #dc3545; font-weight: bold; margin-bottom: 15px;">
                        ⚠️ Найдены похожие биографии:
                    </div>
            `;

            results.forEach((result, index) => {
                const similarityColor = result.similarity > 80 ? '#dc3545' : 
                                      result.similarity > 60 ? '#ffc107' : '#17a2b8';
                
                html += `
                    <div style="margin-bottom: 15px; padding: 12px; background: white; border-radius: 5px; border-left: 4px solid ${similarityColor};">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 8px;">
                            <div style="font-weight: bold; color: ${similarityColor};">
                                ${index + 1}. Схожесть: ${result.similarity}%
                            </div>
                            <a href="${result.url}" target="_blank" style="font-size: 12px; color: #007bff; text-decoration: none;">
                                ↗ Открыть тему
                            </a>
                        </div>
                        <div style="font-size: 14px; margin-bottom: 5px;">
                            <strong>Название:</strong> ${result.title}
                        </div>
                        <div style="font-size: 14px; margin-bottom: 8px;">
                            <strong>Автор:</strong> ${result.author}
                        </div>
                        <div style="font-size: 12px; color: #666; background: #f8f9fa; padding: 8px; border-radius: 3px;">
                            <strong>Фрагмент:</strong> ${result.text}
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Статистика
        const maxSimilarity = results.length > 0 ? Math.max(...results.map(r => r.similarity)) : 0;
        const statusColor = maxSimilarity > 80 ? '#dc3545' : 
                          maxSimilarity > 60 ? '#ffc107' : '#28a745';
        const statusText = maxSimilarity > 80 ? 'ВЫСОКАЯ СХОЖЕСТЬ' :
                          maxSimilarity > 60 ? 'СРЕДНЯЯ СХОЖЕСТЬ' : 'НИЗКАЯ СХОЖЕСТЬ';

        html += `
            <div style="padding: 12px; background: white; border-top: 1px solid #dee2e6; border-radius: 0 0 6px 6px;">
                <div style="text-align: center; color: ${statusColor}; font-weight: bold;">
                    Статус: ${statusText}
                </div>
                <div style="text-align: center; font-size: 11px; color: #666; margin-top: 5px;">
                    Максимальная схожесть: ${maxSimilarity}% | Проверка выполнена: ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;

        checker.innerHTML = html;
        return checker;
    }

    // Основная функция проверки
    async function checkForPlagiarism(post) {
        if (!isBiographySection()) return;
        if (!isFirstPost(post)) return;

        const biographyText = getBiographyText(post);
        if (biographyText.length < 100) {
            console.log('Текст биографии слишком короткий для проверки');
            return;
        }

        // Удаляем предыдущую проверку если есть
        const existingChecker = post.querySelector('.plagiarism-checker');
        if (existingChecker) existingChecker.remove();

        const content = post.querySelector('.bbWrapper');
        if (!content) return;

        // Показываем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 15px 0; border: 2px solid #dee2e6;">
                <div style="color: #6c757d; font-size: 14px;">
                    🔍 Ищем похожие биографии на форуме...
                    <br><small>Это может занять до 30 секунд</small>
                    <br><div style="margin-top: 10px; font-size: 12px;">⏳ Проверяем раздел биографий...</div>
                </div>
            </div>
        `;
        content.parentNode.insertBefore(loadingIndicator, content.nextSibling);

        try {
            // Ищем похожие биографии
            const similarBiographies = await searchSimilarBiographies(biographyText, window.location.href);
            
            // Удаляем индикатор загрузки
            loadingIndicator.remove();
            
            // Показываем результаты
            const plagiarismChecker = createPlagiarismChecker(similarBiographies, biographyText);
            content.parentNode.insertBefore(plagiarismChecker, content.nextSibling);
            
            console.log('Проверка на плагиат завершена. Найдено похожих:', similarBiographies.length);
            
        } catch (error) {
            loadingIndicator.remove();
            console.error('Ошибка при проверке на плагиат:', error);
            
            // Показываем сообщение об ошибке
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 15px 0; border: 2px solid #dc3545;">
                    <div style="color: #dc3545; font-size: 14px;">
                        ❌ Ошибка при проверке на плагиат
                        <br><small>Попробуйте обновить страницу</small>
                    </div>
                </div>
            `;
            content.parentNode.insertBefore(errorDiv, content.nextSibling);
        }
    }

    // Основная функция
    function processBiography() {
        if (!isBiographySection()) return;
        
        const posts = document.querySelectorAll('.message--post');
        if (posts.length > 0 && isFirstPost(posts[0])) {
            // Добавляем кнопку для запуска проверки
            const content = posts[0].querySelector('.bbWrapper');
            if (content && !content.querySelector('.plagiarism-check-btn')) {
                const checkButton = document.createElement('button');
                checkButton.className = 'plagiarism-check-btn';
                checkButton.innerHTML = '🔍 Проверить на плагиат';
                checkButton.style.cssText = `
                    display: block;
                    margin: 15px 0;
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
                checkButton.onmouseover = function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                };
                checkButton.onmouseout = function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                };
                checkButton.onclick = function() {
                    this.disabled = true;
                    this.innerHTML = '⏳ Проверяем...';
                    checkForPlagiarism(posts[0]);
                };
                
                content.parentNode.insertBefore(checkButton, content.nextSibling);
            }
        }
    }

    // Запускаем
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processBiography);
    } else {
        processBiography();
    }

})();