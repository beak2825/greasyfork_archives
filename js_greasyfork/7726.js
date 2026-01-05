// ==UserScript==
// @name        Memrise Hello 日常 Audio
// @author      looki
// @namespace   looki
// @description Automatically plays available audio from JapanesePod101 for Memrise's Hello 日常 course
// @include     http*://*memrise.com/course/287112/*/garden/*
// @include     http*://*memrise.com/course/528125/*/garden/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7726/Memrise%20Hello%20%E6%97%A5%E5%B8%B8%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/7726/Memrise%20Hello%20%E6%97%A5%E5%B8%B8%20Audio.meta.js
// ==/UserScript==

// Dynamically created - contains the lessons, reviews, etc.
var boxes = null;

// Used to govern lessons/reviews
var gardenObserver = null;

// Cache audio files for reuse
var audioMap = {};

// Main function - waits for the main DIV to be created and then observes lessons/reviews
var boxesFinder = new MutationObserver(function(mutations) {
    boxes = document.getElementById('boxes');
    if (boxes) {
        boxesFinder.disconnect();
        gardenObserver = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; ++i) {
                // A correct answer was given (hence the sparkles)
                if (mutations[i].target.tagName == 'IMG'
                 && mutations[i].target.classList.contains('sparkles')
                 && mutations[i].attributeName == 'style'
                 && (mutations[i].oldValue == '' || mutations[i].oldValue == null)) {
                    // Note: For some reason, oldValue is null in Chrome and empty in FireFox...
                    playAudio(getReviewKanji(), getReviewKana());
                }

                // A lesson page was opened
                else
                if (mutations[i].target.tagName == 'DIV'
                 && mutations[i].target.classList.contains('garden-box')
                 && mutations[i].target.classList.contains('presentation')
                 && mutations[i].oldValue == 'garden-box presentation show-more choosing-mem') {
                    playAudio(getLessonKanji(), getLessonKana());
                }

                // The answer was correctly re-entered after a failed review
                else
                if (mutations[i].target.tagName == 'INPUT'
                 && mutations[i].attributeName == 'class'
                 && boxes.firstChild.classList.contains('copytyping')
                 && mutations[i].target.classList.contains('correct')
                 && mutations[i].target.value.trim() == getLessonKanji()
                 ){
                    // Copytyping page layout == lesson layout
                    playAudio(getLessonKanji(), getLessonKana());
                }
            }
        });
        gardenObserver.observe(boxes, {'attributes' : true, 'attributeOldValue' : true, 'childList' : true, 'subtree' : true});
    }
});

// Run the whole thing...
boxesFinder.observe(document.getElementById('central-area'), {'attributes' : true});

/**
 * Helpers
 */
function getLessonKanji() {
    var kanji = boxes.querySelector('.row[data-column-index="1"] > .row-value');
    return kanji ? kanji.innerHTML.trim() : '';
    return '';
}
function getLessonKana() {
    var kana = boxes.querySelector('.row[data-column-index="3"] > .row-value');
    return kana ? kana.innerHTML.trim() : '';
}
function getReviewKanji() {
    var correctNode = boxes.querySelector('.correct');
    if (!correctNode)
        return '';

    var kanji;
    // TODO: Check support for other memrise quiz types that were not encountered during development (?)
    if (correctNode.tagName == 'INPUT')
        kanji = correctNode.value;
    else {
        // Find out whether this is a JP->EN quiz or the other way around
        var question = boxes.querySelector('.qquestion').innerHTML;
        question = question.substring(0, question.indexOf('<div'));
        // JP->EN
        if (question.match(/[\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FF]/))
            kanji = question;
        // EN->JP
        else
            kanji = correctNode.querySelector('.val').innerHTML;

    }
    return kanji.trim();
}
function getReviewKana() {
    var kana = boxes.querySelector('.extra-info');
    return kana ? kana.innerHTML.trim() : '';
}

/**
 * Search for, cache and play an audio file using the given spelling and reading
 */
function playAudio(kanji, kana) {
    if (kanji == '' || kana == '')
        return;
    var hash = kanji + '|' + kana;
    // Not cached yet - download and check if audio is actually available
    if (!audioMap[hash]) {
        audioMap[hash] = new Audio('http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=' + kanji + '&kana=' + kana);
        audioMap[hash].playOnLoad = true;
        audioMap[hash].addEventListener('loadedmetadata', function() {
            // The 'Audio missing' clip is just over 5 seconds long
            if (audioMap[hash].duration < 5.0) {
                audioMap[hash].play();
                audioMap[hash].playOnLoad = false;
            }
            else {
                audioMap[hash] = new Audio();
            }
        });
    }
    // Already cached - however, don't try to play the sound if we're still downloading it (necessary for 'missing audio' check) 
    else if (!audioMap[hash].playOnLoad) {
        audioMap[hash].play();
    }
}