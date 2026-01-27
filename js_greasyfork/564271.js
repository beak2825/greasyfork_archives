// ==UserScript==
// @name         YT Music swap like and dislike
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  YT Music has the like/dislike swapped around. While all other YT Products have the like on the left YT Music has it on the right. This puts it back on the left. Generated with ChatGPT.
// @author       Generated with ChatGPT
// @match        https://music.youtube.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABJCAMAAABGrfvuAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAThQTFRFISEhZxYWuQoK1wYG5wQE9wEB/wAA8gIC4QQE0gcHpA4OTRoaThoayggI9QEBtAsLNR4eOx0dng4O8QIC2QYGgRMTKCAgLB8fvgoKQxwcrgwM7gMDiRISKyAgUhoa+AEBhxIS/AAAVxkZKSAguAsL+gEBchUV0AcHpA0NghMTbBYWXhgYcxUVvwoKmA8PVhkZqQ0NxAkJKiAgdxQU6AMDwAkJeRQUYxcXkxAQQRwcuAoKLx8fUBoa5AQEuwoKtwsLMR8f3gUFWBkZzQcHNB4efhMTkBAQpw0NxQkJPh0dTBsb8wICIiEhShsbaRYWexQUog4OrwwMIyEhdRUVqw0NRxsb9gEBtgsLyAgIbhYWOzs7iYmJ8fHx19fXvLy8VVVVcHBwoqKiLR8fkBERSRsbwgkJhBISbxUVQs+9zAAAA0JJREFUeJztl+lPFDEUwPtmF/yAGDCuQlBQScQjESJGNKByaKJiDF4fhBV2/cMED/CDRo0RjyiHisELAyYemOCFBHUNEJEY3d2pbWdmZ9rpsB3jF82+D23fe+0vfX1vZjqA/pZAhpQh/YsksGXOsi2k2owvUj7ArK0tAvhC+2UzGKHFn3yQCuGrYAkBjCNUTCGF79VJK2HCbdQXzKHVH+nolyqpFD5I7SXw2iep7K05COWy880ftTxr4aUfUsULo9+gj5iWTQDPjFH5iA/SlmHW6ZUPHcbS0FOHpkbaNsS6zXCft9eATVYj7XjAeHdcjlqbrUSqH6Dt9h7eugvIVOjzRdrTS9uG65xxH9zidBXSfpL12OPGy7z1YDevK+buUF99j/CIHrnCqXpCjURYFwXDUeA2WfFIleSWmiJ7an/dOfcEy90MbASQDJ5SZDcHk51uUrPmMAU6lEjROMIOlElq1bPaKRBlJYy96Z2StbwcxwjOuEhhdDa16WxdR9wcuURo+vQugRSNa6e5aQ6yl5DgkHMWmAsD/DkrkEhwiB2JQBIWpiex4IIdAolkzhGwGokF59pTNO40qZHCDgYkulIk5zaNIk1DYltKCc0XI7UAaPaJt+ppqpNO4IXWjHFOAWwY6PpIQqgIl4RdFlrrRu7Mp46x+VDVSHqX8C5g5xwW8+hrT4ZEEiSFrPFLokucpGicsNMHpxAdg6QPzk1ij5qT1AJZ7QrBCbUkI7UlQQ/oaYOjYrx6LGFVzOWuRaG4bRgEEKOZVc1/Edq0pEa2dKyvNmXCEwNqZNm3xbyqmNKEzwv+EydVSUGNUw9c4N15h+HmuBopm1cbL/F6U3cEYOrHVd+k3fgap+9ll5j6G772VEdeERjf5r0N92hb0+uLVI37Xc6dg7TdetflmD+6KiyUQDV+wvrKQZ8kcueNjTm0qiEjrZKrijep3Lw/b8TYuvOWa8+NwfphySpP0jr8ytLLpvMwkdmYqa8alSzyJi1/swa7f3OoFOMxmXkeEsr5qbmdRfidlC8llUySpoD8Aq3AOCb4luBJOUhKKpgi9rzPdLgU42+2IxfjaQ+OnMTO97ul5WBbPDEepD+TDClD+t9JvwEPIgxZumavpwAAAABJRU5ErkJggg==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564271/YT%20Music%20swap%20like%20and%20dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/564271/YT%20Music%20swap%20like%20and%20dislike.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function reorder() {
        const likeBtn = document.getElementById('button-shape-like');
        const dislikeBtn = document.getElementById('button-shape-dislike');

        if (!likeBtn || !dislikeBtn) return false;
        if (likeBtn.parentElement !== dislikeBtn.parentElement) return false;

        if (likeBtn.nextElementSibling !== dislikeBtn) {
            likeBtn.parentElement.insertBefore(likeBtn, dislikeBtn);
        }

        return true;
    }

    const interval = setInterval(() => {
        if (reorder()) {
            clearInterval(interval);
        }
    }, 100);
})();
