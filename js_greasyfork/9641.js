// ==UserScript==
// @name        Church Micro Stats
// @namespace   inge.org.uk/userscripts
// @description Adds your church micro stats badge onto your profile and the cache listing page for Church Micro caches.
// @oujs:author JRI
// @license     MIT License; http://www.opensource.org/licenses/mit-license.php
// @copyright   2014-2018, James Inge (http://geo.inge.org.uk/)
// @copyright   2019-2020, Cryo99
// @attribution Church Micro stats provided by BaSHful (http://www.15ddv.me.uk/geo/cm/cm.html)
// @attribution Image by Lorna Mulligan
// @icon        https://raw.githubusercontent.com/JRInge/userscripts/master/ChurchMicroStats/churchIcon48.png
// @icon64      https://raw.githubusercontent.com/JRInge/userscripts/master/ChurchMicroStats/churchIcon64.png
// @include     /^https?://www\.geocaching\.com/(account/dashboard|my|default|geocache|profile|seek/cache_details|p)/
// @exclude     /^https?://www\.geocaching\.com/(login|about|articles|myfriends)/
// @supportURL	https://github.com/Cryo99/userscripts/tree/master/ChurchMicroStats
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @version     0.4.0
// @downloadURL https://update.greasyfork.org/scripts/9641/Church%20Micro%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/9641/Church%20Micro%20Stats.meta.js
// ==/UserScript==

/* global GM_xmlhttpRequest */

(function () {
  "use strict";
  var cacheName = document.getElementById("ctl00_ContentBody_CacheName"),
    churchImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMMAAAB7CAYAAADJ5jSyAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAAB3RJTUUH3gYNFTEev3WhyAAAIABJREFUeNrsvXdgY%2Bd1p%2F2gkAQIArj3gr2hkhxyZtg5RdJUDiWNZFmjYhVLthVp5bhsiu0vazvZdeomsZ1kky9OXOU4iRJbZWzJkmVpukYaTeGwzrCjspMo916wgQXA%2FgFF3ny73yaxFMuR8fxH3AvwAvf87nvO%2B55zXk06nU6TJUsWtNmfIEuWrBiyZMmKIUuWrBiyZMmKIUuWrBiyZMmKIUuWrBiyZMmKIUuWrBiy%2FAfhU1%2F6YlYMWbIAlPycW1tWDFl%2BZvgCsawYsmQBEAVtVgxZsqTSKbrHfEwF5%2FD6fKTSKRbCYbw%2BX1YMWd67fO5zn%2BBr3%2FoGC%2BEwf%2FDffh9FWSKurqBbhmHf9YzhabSUFBXhcbt%2Fbq5bk61nyPKz4mMf%2F2W%2B9tWvZ92kLFl%2B3smKIcvPhIVwmAPtB7JiyJLlzA9PElKWfq6vUZ%2B9TVl%2BFrhddtw%2F59eYHRmy%2FEw4ceYMJ8YuZkeGLFluvvMWZFXNjgxZslRWSwQCgawYsmR57fVeevp8WTFkyXL8qWdIVml45fTJrBiy%2FGJjcnrwd%2Ffxg2efRV2PZwPoLL%2BY%2FPGffJHARC%2BujhYcepGlHAvW7MiQ5ReRsYiCs6YVxa9wZTzAH3zsgayblOUXj%2F%2FyW5%2BnrsiBEg1QXtfKrlonCz%2BnqaFZMWT5d0VWUlzfiNPidpKTlHnlUg9qMMKRW%2B%2FLiiHLLw5Xzl5gy6zF7XIRsUpUOETSaRVHZztrsVlS6VRWDFl%2BMThx5gw7dx%2FGZbNi0wtcOHmGbcUOXEIhxU2VPPiBrqwYsvxijAq9CzMsRYIEAwEiWxr2dW1j3SphdjiQYzKbUk1WDFne%2B3z76b%2Fj%2FQ88zkREwWydob2lhRTluB0w0H%2BVuz74UXbVtfCxjz6QFUOW9y5en4%2BkVkCsEKhqbmM1ts4zf%2FsMq%2F4ASZ2LQ4c7OffyM2xsBmnb1vJzEztka6CzvOMc7jrCr37pawQWZZJqHxW5DhYNcQS9QH9vDwtxPbtbHPgW%2FSyFYjzQdZhbOt%2F9%2BCE7MmR5R5ld9GJv62Dg6lmGf%2FgsOTobGwVaBMFJf28PTe1H8DgdRBWY6u1BkAT6%2BnqzblKW9x6%2F%2Fbvf5OY9h7jrQ49T1rqLe%2B66h2AgwNr1Hg503UMk0kNLs53IVpp9tz3GREAm6PPzzT979%2FuwZnOTsrxjpNIpqqq0zKU1jPzDcebGTvPit6PY3W1QkMlGytHZeOp0kEJdDIqtdN3Zjjeg0DPYzePZkSHLe4UHHriffJcTySohSBbu%2F8TvUtLSiryZwuH24A8GiCpQL8pIgo2URqD%2FXA8AlU0173o2a1YMWd4xJEnC7W4l4c8Y%2BLKsIuurObi7g56BESbCGsTKahxOJ0tRL%2B37Oti0SmiQ6e318t9%2F74%2FeGmGyYsjyH5bDXUeobKohMCmzanMCoMgqvafOozOAb2KI%2B%2B85gpwqJLqUprrpMH1Xu7FITmx6gdZWDzU2Aa%2FPh1bz7phldmo1yzvCffd%2FgMZDu9GvmMl1udDkC5SuyW8dN9pdKJsQmwkwfuJZylrbOXuqn5a2aq6d6cFcpcW6ms%2B2ljo%2B9%2F98NiuGLP9x%2Be5zJzhz8jQ28xIB79hbr5eyyAvdCgC76uu4MpI5VmdLUmTeILyUS8eRGxnuG2FOFXjptZew5lmyYsjyH5dUOsXn%2Futv8eyTT3KTY43wUu5bxl5k3kAsKsNZIlC9mYt2Vxunz%2FRxh8PFsHmT2GQIzWaUvz8ZxR%2BaygbQWf5jo9Vo6Tx8GIC7P%2FQoAI6GJu5xuziy7xBt27bhcq2grytHjk7Q2lTA0pnjWLUZV2pX7a3c%2B%2FDD7%2Bp3yK4zZHnH%2BNr3nuDRD3%2BUsy8%2Fzf0fvB1BENm9vMV1S5SgPwhsx7cwjeioxeUUyJ1NMRlV0GzKbFllClLSuyvo7C3M8k6xu66Fmx7eS8vhG1A2k0gVNl6M9LC6aWBFThEz5nOo61bSS4uwFONHw6%2FRsmsXlaVWersvMxuKZcWQ5b0RMzhdTkZf86NMR7EX16Kdkek4cBsAO%2B78FX7viy%2FxtWf6UFMimD3ccv9HWVoYYkVOoSjJd9%2FVy97GLO9UzBDwB%2FAHAgiVNmzlGlIVIpOD15FTVk6dOQfAhbEg5wO5qGoMq81AZDmHwILCTo2VysLKrBiyvHcIer0IuZk8JFX1YrGXs39PG0%2F3J7j34YdZCc5QjEJBnsAzJ16jsGCT993Wiq69CK8%2FkBVDlvcGSjDC4a5MXUIykaIgz0UwnCa%2BAQeaS5hYDEB9F%2BOBCAOjEzgdFnwzBl58qZdAMI6mqiQrhizvETEk4xQKoDFLhHx%2BNEkFm6jh7AtnAUj0nIdwiFqPm8OHdgPQ3Orm0K1H6TjQzuqgNyuGLO8NclQ%2Fr1w5w5ln%2FgG724Ve0RCV0xRUObl68SzG9vdDZJyxsExKI6AxFwPgtuUzf%2F0SLYfbs2LI8t5gURHYVdqCw1XIoaOdFNhFWlvc%2BK8FsBVa0atRKKxlY3KW%2Ft4eHMUCAd84Pb4ZCp1H3%2F1JgOwtzPJOMR2Z4%2FFfPYboqOXVs72oW1ZCwas89cKP0MaTXPX%2BZB1BLd6NoqQJBOOQr0W7FaC3%2B2pWDFneG1Q4y%2FBf60cZGiYw1ENjXQmG1Q2e%2Bc6XCY6PQWQcIuPMLYTYJljQJFWOHHLhKszUL3TtfnfdpGw6RpZ3jNaOdobGejGJWhwOicXQADmWUrRp5a1zykrs5FkNFGqj9E6N0uvNpdXj4szJN5jTxXgsnXrX6hmyI0OWd4ytAh2VxU6m13PRmiRmlTzSOoFzLz%2FFFz73IO179nD00WN86rE2ZhdOozdLOAoLiCmLPPKJTxKJye%2BaELJiyPKOEo0niW5JHNrdSjKRQix3IVhFBJuATdTw%2BV%2FupEK9wNVTrxCNaQlOBFCiCltLMSbDCkXWd7eaICuGLO8Yz%2F%2FVV5j2niYYjLG8rvD973yDYEDhYOctRELjTIYVRFsNzm0dsJqJEwSbwEqqCHnKx84jR9%2FV7nrZmCHLO0b7nj1UlTczNRfAN%2BhDEkWkcoHr3gDuxj2Y86zELQLKRh%2BiDtI1mVppd6PIur6DQoV31U3KiuHfSOr%2FEuD9n46l3uGA8N%2FyeV6fD5fLSVxd4cfnLnJT80401WUUxJdYtphJBDLHAfz%2BAGaLhaJCGwAnz5ym63AnWo2WVDpFXF1BEMwshMMAFBXaiKsrBIJBXPV2wtNhFrfi%2FP0z3Xzi1%2B%2FnZVVHtTXJk2fPcWOxmZRG5Lwc4tTJXvaWObk85uUTv3wfcsjLt09PcstuePqppxElAYCJvjHMzQ3EtuD24lJevvwiUzGVx48%2BxK5DN%2F673Nts2ee%2FkkceepQb2%2Bo4efkq%2BXoz09FlbNo0m5U24pMxzFValqZSHOzYSe%2FCDK0lFfz4lVeoPbyPoNeHbhnWYrPkWQ0EY2mIjPPwF%2F6c01%2F%2FH1Q4y7jqjVHt2UYxiwDMBOaYS%2Baxf5ud4JYRyZpkV10LLzz198wl89hz9DZM8iKnL2Xm5st068wl83AV2fCHowC4imxYqiXsHifnriXJMSTYTBhQz3%2BVPZ%2F4AiPXw9zYXMv1K2eRam%2Bgv%2Fs0hEM07OpgOLBItdWIttSDYClmen6MyNQ0t3XdRuTNbOuxa%2BM4HXYA4t3Ps2UtYlJdo76xCs3SOomAn6pmN2pMRo7FqGjrIEeN4XC7CPr8NHe0I1itPPfUt9jUO8hNKhiKa2htNAOQiMVZSAsktQLKVAitKYVRDvD1L37l32UEyYrhX8Ef%2F8kXUYIRCnaUUNV8iFfPPcP9HZ0Ut3UxePUU9pYjPHX8FHsaRQoq2vjxK30cvaWFvpOv07h3BwA1ZQJqEl76s8%2Bz%2B2N%2FhC0f3uiPEJVVjPE5Gvfu4Okf9XLf7a3oCgTeuOxjNRZAswz3feQIvedPcuhQF4OjPbzy4jms1U1o0go1DjupnAIujg7z4B33MPH019lSFgnFlnG7XAzKy7ibGgFo8zjp7R3g8LF7sOpA%2FV9KCKw6%2BItPPsqnn%2Fg2ALEVkEw%2FOZ5MZM636sBJZmQ5feYUwUAAVxXYaw7R1z%2BAVGUhuSwRU2NojFoUVWGy7yrroosah4TP76fZbWUpbcPn95Ojxtje6mQmKLMcijFrMtDe1shUoJsGl4t%2Bn0pqRYskmpEEGzElTX6shz%2F%2Bg%2F%2F%2BjgsiK4Z%2FgdlFL7%2F%2BK58nX2%2FGtbOE5SWwVMFC2o1%2BKYoSU3C4XQiSxMipE5mc%2FAojvb0%2FSTrbVddC3cE2ev0yoh6OHO1CyoWvHz%2BJqAfB1UR7XSZPp%2FeNHhxNbUgm6Hv9FBZRoKOlndgGnPrxSY4c7eKbf%2FMtjNM%2BViUnHU0u0loRgAvHnya6qfLfvvS1n8zwKGGWZRW708PgaKa51ysvnqO9rRElFkesrGb9ei96dys6I4iiiDo1QNPBe4iuQnBiBEdNPQMnjpPSlNBxYxn%2BYGYlORZXaN7ThRpbpCA3l4C6QMnqMgAL%2BQVMXbhG0HsVh8fFSjiAqcjJSjiTpr1plUitaFE34lhzLWhNKd54dYQGZzFl2jSioKXADMtLsGkVCCe1iILIcsiHw%2B3ixDf%2FlgtXXs%2BK4WcZHxy5%2BWa2Hf0cR2%2BTSK5Z8E88SZHjRgSLjZNnT9NW04LWkiY2FccqOvBFY3iqJNJaK1ZdZrHph88c5%2F0fuIf4pgZBFJgYOM3jdz5AKG2hr7%2BHluY2kgk4e%2FYktjKJxm1tnLvcTeeBDqRc6BvvRdClKShqY2DcS2WxFZtQBGTe07q%2Fi6DPS1Oth7NnTwKwFAkS2dIg5oq4nA7m%2B65i3G6jOJFpw7Lt4M1MLvioLnEDcO5yN5JOpbH9yD%2F7DQZ6e4iSj6OmnkBPNzpDHDQWDu7uYHC0B6PVzfRoNxqjlpaOTs6eOk5YSWNv2kmuMo0%2FEKC9pQXfUJDIVpq6Qg2RVOYalgO9TARkDt%2FcydXxICa7k5XrA8zrTWwv0RONp996rWang7FQGk9hKcGFi6wGfHxg934efOyD71hclhXD%2F0UIX%2Fqzb%2BK67X5mJieQdCoWUWAyHCS5ZqXYFOf4M89QKErYXS5C1zKBZWWzB0WOocR%2Bsuoa6unmI5%2F9HE6ng0BYxS7K9AU0dB7sZHE%2BzFpiiomRKJJVoqm1jYHeHqzWNB0t7YxOhukoy%2BM7Z08g6AWsNgeueg%2BxlYzL8k9P%2FgLRit5cRO%2F5k9jbu9BFvNidHk6f66bzYAfnLneTXlVQYnHabmqmusTNxJxCTZnA4GgPjdva3rref%2Fr77NmTuBxOYloLrspigj4vQg646j0kE5nzvFMx7u7qQk1C7%2FmTb402fv8AQqEd8c0pGu%2Biii6V%2BU2WQz6WqttZCw5yR20FsxobMSVK0Osnbc5jV00lYzEY9V5FmdrkhgP15GqiGMRMuoaiyBjSPoKnr1LrcfPXf%2F3Vd0QMut%2F5nd%2F5nazp%2F%2B9C%2BMyXv0zUup2J6XW2STK6lMr8osrlEZmmRgFNYp29R99HSIH79x4gb%2Fs2Utp1Dh0%2BxMqWkYZ6F4cPtbGhWeOXPv0rRCIaRMGAsjjP%2FKCfRY3A9jo3C1NziPl5FJY7CC3KFBXl4ajx0NszRH6OwmQgSIWnniOebYTiaRRZJZFao8QsMbngo6ywklA4RmhqnG3VLrYMNrS5BnovDFNRW83C4ijqaoo9TTsJLQTZtWsXufo8zIKJQtFAcMJLYmmdCmc5Zy9046isoKSwHDUJZXY3IxM%2B5mZDuJzujCs44UOJr7EQChDdzCc%2FR8vpV37E%2BqaCZBLRmmQOH%2BxCr4uSWgF1I05CXadK0jCbW4pmA8qdFdSWVyMrs5RUVvD6wCDuSidl5RUY9HrC0wHWiiWMkTVMJS4qqu2srq2Tn6fBlmMktrDAdKoYzE5k7wRzCwFu2HsDGo3mbd337KLb%2F4Ff%2Fs%2Bf56YHMy0Ob29J4gupWKudpEwCtxxoJdQ7gC8UY2zwKnZbikljPspMkMbWFtTNOEuRIPXWJP6QTE1TJ2E5TqWrmkBY5di%2BXZTt66TN4yQU7MVV78EfUum%2F8gMAwtNBpFzQ5As43T95Wj%2Ff%2B%2BaGHgVWlKmM311d4kZngNZGD6KUmdXJTUTov3QSz47SzBRlSKap1sPkgg%2FtisK10UGKSzMuln%2FEi6vegyBmyjQP7u5g9NyJtwJq%2FVYEMUeLqIe%2B7tOcPpNxwUSrBkG0opeHkXQqkmAjPuVHEK0k1zKfFZ7JfAdJD95IjNgWlOrS2CQrYSWNZNVikZyMRdK01WUCfIutGmVDpaz9XhryRAqc7SiroyiKTEorMLSwhX%2FRz7zexLayQhqqTey7p4uFFHzpT7%2F8tu97Vgz%2FH%2B6%2F7QPUdd3Ld184S6GYpq8%2FhKYAel%2FrQVEVXj33DJuiE6FKJBGLs5S20X%2F%2BDFKVhclgCKOhClcVLJiL0G4FMOVZqEzkMDT6KixnGmYthfpx1XvInYly%2FPnjeLZnDFnM0aI3aTl36jidBzoI%2BHqw2hycvtKDtkAknVKIzQTwhVS%2Bf%2FIkOgOceLmbQMhHU62Hc5e7sTs93N3VRU%2FPOYI%2BL4V6DTrDmzNC2p%2B0bZRyQV1XM1Ow9Z63Xl%2B32Ch687QdeXmIFQLqRpzOg5247U4kqxZTniXjKmkt%2BKMq7u0OLFUu%2BsYH8C6qnD53GptZg8sh4Vv0IwgiPr%2BfaExF1EPId42rfX14iq1ol2OkLRbECoHeq%2BdJWEWWwn3YBFiKXKNMLOXS2YtcOnuRnMQAMz3dGFfniMcCzBttXJmYJrRUSXC8L%2BsmvZP8l9%2F6PP26EnYcfoD8TQUta0zMJnCKMYwlLXzojiOEI2nWk%2BsYkxr23HgQdXEBXe4qK4pCKr2Gb3iMxmYn4cl5UtZ6XnvpOFZHNeqqQnl1OSfOn8CYX0YinSZl1lJstjI6OICtqoGmnW0ER4eIJo0UGMzUOD2Ul0oExoaZjam07bqJy9MhDr%2F%2FdnTracpKJPyLcZyuWtbTsL2mguM%2FPslCJIbFUEpD8040ObmsxWKk1xVEqxFtrhEdOYQW58lNriGHZ%2BkbmaG9toJ1DRQXlWPKA1MebOTlYTBLGNK5BGcCsLIOm%2BB0etDqwV7lxqjLxWgxos4EKROt3Hbz%2B1he9ZHalNhMz1JRXkp5WT2xmTk8tduQ1xIouWmq80SMthIC02OsBIaJa0QS6TQ5CQXvpVG0JQ4EqQSvf4Hihm0EVAG7oCdHLMKaa2Ftq4xqTZCN%2FG2sLo2QrjzEi3%2F9Jxy7505S6dRP5TJlxfAmj3%2Fys4wM%2Bckpq8FmNaBEA%2BzbWc9w%2F2UqKreh0W%2Fwo1PHqakrpbqwlEBERV1cQKqykG9xs5leR7eVT2lpKUukCbxxgZaOveSXGJkKjECqFF3eGgUpFbPNiXFxjnWdgb7%2BEAk9aJAJTM9RYhMIzi1QXKhFPxPh0tA10lqRUimPvuERNuMKwZ4RnJWlKKsyQf81RH0u88EAZVXllFW6mfHNom4qqNEYG5FxNKkE4voaOYkE18dGMC6tIVQ6iI8HaLGXY3eW8vrlERKpNaRCCbc%2BxRIZY1pLglgksRqdZXtbO3NTcyyqc5SVlhOJhJkYvoK1oARNvpG18WG8SylW1zbINxtILyWIRGBtSeFHF0%2FTVO9heVOkzpJHYm2d6ZhChVlCyyr6dZm11DrDfi8Li%2BtI5TWER6%2FiEFM8d2KJu3YbUVaN3H5jLTMrKUoKt7im5JJSfYTlNHJsgXCOBbxXaL9hX9ZN%2Bmn52re%2BQcAXIFW3lyPv%2FxDa%2BBo2yUpMawGzhbS1kkIphZDrIhZT8fl68TgtSFUWrvSEYFlG0AtgSmOvgoVgAOfhw2hSKg4xs4FHe6OTKqsGjVai3xsir1JDXFao2WmhRgSHs4X4lJ%2BVaAiX3UFsOsayaQMAVQ6i0QpvXe9d99yDGg1SXeIm9abrE4mn6B30YtWBzhBHsgh0HuhAicWw2hxcCMaZHOhlm83KRqmNcH8f%2BfVuIgVpZDmEJiWTXk3jH%2FFywdvHaz88QWwj407F1Qh6k5bF%2BTCtN7SROx9FygWDUYNQ4UCNBjPhTLWNNo9IMu7DkpNGqpRQN%2BKoG3FcLR1c8AeIh3pQYnFiShRdSkHekNky21BTMhbJSYPLg2PPLgAWt3JZqnZz6LYq5pe0pOa9nDzVTY1DYmh0iWRuBe1tjW%2F9LpsJA98cWeGRhx7Nukk%2FDd994h%2F56mU%2FFe2HiecXMzY0itW6Rr7RwI%2BeP03LzlKGr18mJq9TXl3GVnyWouo2AoMjBEb9WM0VJFOzLKxqMSY1bK2ts5rwYUqlGAvNUlBcQXA2wETvJRbjq5hKS%2Bls20Pg6jDjyxsI1jK6hwMkE1Yq3OWYC6yMDfQhiCLe6TXKyp1o8o2s5haTv7GBvKiQb8wlsa7hfHAW7UaCRFwhrTEwF5vn9at96DTrpAua8cWmyDeI%2BOfmWZ4dwilWMZzIwVllZ%2Fr0E8iWClYjCil9KSPTIeajC8yFFhCrHOiMGnp7hpiPK8iKynQgxvjkOOuJNba0%2BZBexVpUiTG5ikGVsVbXsRXoxVzTwno6nzwd%2BGcV8pMJBgeCHD10K8GrA2zfvo3E2jozc4tsr61jq9CGZTlGMlcLK2lW00YKcrSsL2tJWfOotrpIKpvMzUVYjC0SVlYod9awEp8kqa4S2CjCkbeCUF5Hypym2FTOwtirDI2N0NV5JCuGfwu%2F9tlPoWu5m0cfugv%2F6AyP3befYsnC1b5%2BDhw%2BTJ6piI2VcVzOBpJxH1GzB%2B16AqNeg8PpJJmapUhyoS7Msbk8hNVqoMDoILZspMicwPf6ECvrGrTpdTymPNyCldN9l8i3mCAvzaunBqh35rISW8A7O48t38BayE9Vx40YIjHe6D5DTq5AmXmD0ekQmlwYGhjGZNhgPayiX5uj3O1iWtFQaMlDuxzHlg%2BazTQr0QnyUmlcujQz0XkKjDqKdzQwF12gYGmaLVMhBoMBQ75AfoERdcqPUFlGT18ftuIy1pbXMOqMkGclH5V0rpG5hXliiRTxhUn8s3PMzsiszAa4Fl1neVJmIbnJqrxKTkGCvKTI0GSAfIsBo0GDUSymwKSSl2NlPj5HviUf3XqCSHgVcvKpqZAYnphg395mJry97HG56Ls%2BgYYZHv%2BlvVyOxLmx3MAb0RhOqYDqSisTfQFs1W60aZlqo4apRYVFz4fZLSwQXF6g0d2QFcO%2FhNfn497774OG20kXSCyPTzE1Ocj0rJeAvx8xJw9boQ1l0su0nGZ9TaFmWyva9QSSIHDtmo%2B1PIEqKdM5WhBFJMFGQeE2NlYC5BuM9A7MYNvZjlGvQWtIIWhgIa2nwJDP8mQUJbZAlcNCUXUb1ZWl2PINKKrKShoSKYXCinrSBSZclQ4mA2PMRGRuaNqDVOmktLCUVYONvYdugZVVpjcS3NTRgbK8gryqMtQ%2FgLISo7yqHHVLAHTobKWsLa%2FhrnUSX1AJ5%2BRjryjNfPaUgtNVTyKZoK21hddOX0CqcDKryAgldpSlBP7AKGtrCYxbWgyF1cSW1phfDLGll4iuJJifGaG%2BuZXe517AVO0hbi7EhobCfC3pXAPT8wqSIOIsF8i3OjDkaRgaGSbmHUaXv8pUdJ3ljWm0aSNCnplydznF%2BXnkCsV8%2Bclx9rtyeGHYxE2eIi6e6yO8Ok99RQkLyS1eG1imsEAikZ9ifNjPalrP1Gs%2FZiu%2Bxc7WnVkx%2FP%2FxqS99kf%2F6O3%2BOpWIbYvk2CkwSFXaBjWQKp7sBSbJS5tpJWpfLen4V64Y0QqlEz%2BlLJJZWCKSM7PG4kNfW6Lnej7y6zkZcxtnYgLIKi4uzXH5jmJrGG%2FDOKhQWQWp9jflonI1cO%2BHpUWyuepKWMtzVLYz4xxgaVDAWGtFsJjAYjaRyRQLjIablNeIrC0zG0mhWVkEDQwN9VNZ3sCzPs762xlAggKWkmIXpMPZtTUzPrhFf8uMqdmG0FqMuTCJWCASmg%2BgTCqtpKytTc1ikfORNDb6ZOcrtdSRSaXxDwyiLcbbXNzA02IvJrEMJTmI0a5jTCHjs25kLjnLhqo98cwnydIiYopCvS5FrEhn2jdLSvoPoei6mVZXAfAjfzBxlQgl9g1eBFIGZeYQ8A%2F5xhdU06KVyVi02tLENJEuSlYQGM2t0D3kxa5aQV1WKDEtMza1TWd%2FI6rqK2bWLJZZwN%2B9iNDSMp0Ji9MrrKNMz3HPAzYmRdepqKwn2XWbXvu2YTf9yu%2FtfuHQMr8%2FHxz75eTxOkbijHZtFQzSeRptSSK1osVVYcTmdiJKd3p4fEFNAyLViq7Rh1kSZCco43B68izL6pUyqdNKs5fbaZp7qPs0dXfcy1H3urf83v2KhxpGpEVBiMQRJwmaG62dOIxRm1hf6T50kgoS5SoujpoW%2By2fYVuzA4XbhWwwh5li5eqWb9l0d9Pb4qD7oQvYF8Y4H%2BU%2B%2F%2Bhs8992nECWJ1lYPp84G2AwMkGc14G6pJaqk8BSJPPvkkwA4auuwOgrJiSeRJIkTL71E%2B549WO1FnH7qBR798Ef59kvnIDLOzbfdxoXhASxreuYWQrjq9%2BIfuUh1ewP6FStbJpXNqRWMUjkAWyaVyeAWpoIVVoIz2Dv2sjE5S07VT9JfN6dWKGneQf8rP6J9zx6uXroEQOf9d7A5kyBuyiWdVsiJJ9869s%2Bo74KRzOIfhbWZjhv%2F9Nqbf%2F9T04F1NcHOtu1c6xniK9%2F4Ki3NO7Ni%2BF9x2au4744HuDQ3iH7FSrvHjj8cRJIkLgwPUFhUjSBqkWMyGo2VUPdFTI4KVpZNdHbWEZFjeMeDeGodeMeDFOUWkLZKaNRMJmfKomMyuIVD0hDeWKYotwCAWo%2Bb0cUgm1MrAMSNW1jW9ORZDdQ6CznxyoW3jDUYS9PUWoQck4lGVIpyCzKtVshUk6Vimf3PKpxlLE1cYM2ZucmTV4eBzN5pU7EEcwshOjpqSaoL9I6rdHTUElY1FFnTbG%2Ffxaw%2FQExN4nIW8dqZQWpqalnUYqAFAAAgAElEQVRbDzE9uU5xUyUajYBlZYPJxcnM97o6%2FJaY1GCEImuapLpAoXMHYq5AJF9hwiezMy%2FFZoGNpCARkWPkymFEqYic5Sje0SEsrnpEqYhr%2FdNUSQZqG0Ve75Mp1oG6OIzJJqGzlpBUF9BZS4j7R1hz7sQYuMa0uZqVZRPtHonFrTiF8RkilgomVyowrQ3TvvcQi6lcHr7hRkLePmwaicc%2F86%2Fbbv0XPlHvO1e8XPqbL7OtepNXnnmZsaiOOluSW%2Fa66b0%2BAsBqbia1YSUaw2T734fb%2FI15WnfU88pFHyabRFlRGeSn0SoLyOE5wku5mGwSK9GMYMaiOn71fQ58sgF1po%2FV3FLK7KXMhebxtO1%2Fa4PA4lwtixspPCUCvRcvUuvKjDDj%2Fii3797Hpk3k0ujEW8ZeZ0syFtVxk2ON14NGbnKssZpbis5aQrGgwds7TFzvosyqoNeVoi4OMxbV0VprfcvoTDaJOVV465yt5Dwr0RhjUd1b37esxE5OlQlj4Bomm0TvuEpZSWaUm1sIUWdLYnHVk1QXaGipR5NWGA2kKM7NzOSHY2nmTTqOtVfwzA%2FGOdhRwtj4GA0t9Qz3jVBh1TCjZszypsO7eOWZl%2FG0NqBVFphR0zS01NN96sI%2F2yCx%2B9QFxjT1vHr8SaocZdmp1Z%2BG5gqJ3utvMNtzDtHp5N733czItUF80zIacxHFkpmmxm1s5uhxVxdS17ydZGyWxuab2NJvcL57hmMP3IYvvIJueYZClwfvtWEcDg%2FHz%2Fk49sBtSOYc6txV%2BLyZzfse%2BsgtvH7Vh7mogLKaeuoaXFSVullVl7n9loPUlhsZ6OnHXmvGJonYCgqxFkpUVBSypbex78YKStwu1M0lqsxaJmcjPPLQ3VQXrLC7o47ScjN79rWx54Y7aN7TSIlVpEC7hru2hQZ3MfbyfKaW1qhyFnN0r4fNzRy25vvZvn8%2FtxzYxfXLr3LoUBdh3xk2dQW03OCi0S7x8Mc%2BQW56gffdtoukPIvD4WGbp56iEi033eCizLTM4ESUG3ZIFLCCxaDBoNfS%2FdowdjFN2myibU8rSzP9PHj0JtKJGbQrc2zfswu9QY%2BkT2MssJFbYMOwFaOqoR6jMQ%2BNIRdv7zB7atvZTEZYS%2BuQrMUU2%2BvYUv1oNtZp393C9YUon%2FvUp7LpGG%2BHl7%2F3LJV1pXSfvkhBiZlZ%2FxQdu%2BvZfaCZ86f76epsRixzosnLJSYvUbOtg434IBqDjsYdHmZnFzJPdV2cclcxnto6burqokXcpPPOh5kMhvEH5ui6eReVFUXEFubZW1ONoaCS7Q4jbGlwucupqHFx8cobbKt1sbo4QlfzfjRLMiOjfdx27BbWdUaKNlX8cwrriQRNTTt4441RPvLInSzF5tBJNeTmi4xOLSDlaFC3lpFW5ilzVbOeSDA9F2V9dZaGbZXsdEtottI0dbSxozaN4NqO4h9EvxVhZCKGx23DYNji1q69jPSMcOONTYTG51GnRyhz1ZCIzOLZuZ31yV7UaBTB6mQuLqNVF7n%2F8XvZf%2FBm1BQ0tOyirakGf2SJtm1O5JnrzIpO%2FD6VG%2FZ2MjI5SXzTTHttPRrNGrU7K5iLKpQX2VhTZfa211DlKMfV0Miuo50o88N03NhBemWKvqFJCl0e0oYCDu%2FbztX%2BKB%2F58Id%2FajvI1jMAD9x6hIceacM36GNz5gSFDZ0EI8u0lZYSyy9DDnTTsmsXglUiPDWMXtzGkn%2BYBXmS6XmVtFSDSAR5SYtmM8qhW2%2BhfyLMvj0309vbS3GBCoKTq9%2F6Em33%2Fyf6xvpwulpQrl9EzjeQ1gio%2FlEOf%2BAhBItAYKiHvjeDR0HQIbpbSa%2Fk4nA6sNisTHl7UWIyvqBK5%2BEWzr78Y5y1dThcLuwuF9OLAVKqgrOpFYDAQC9Wm4CipNGYJbSR14lqKmh3Gjh5dhCP3URV7T7CU8PMxHJJJyOokxHk9SUqS63UNO9Ba5Kw6OHc2W6aW91MhNJMeXuQqu2kV3LRmDYw5RYyPd9HWiPQ5pbwT2kQKyzIM3HKWw%2FzvR9%2Fn8JcO1tmLWE1TYOkIej1ElM1SNY0H33sA0z7MjXdfad%2FTHOHBzUlkpYD%2BGM62lrd2NIzmEu284PvvUTn3mZS1jKkChuqGuPJZ6%2Fy1LOnf2o7yHbHAITqQuZn0viCKhaxi9a6I2zpAywAyzNxOu9%2BgMW4SHQlytCCjvtucHFiLojHdStFURlNUmXnrnsJhGIIVpHpxSD33dXK9FImhUKdimHWOzny6T%2Bk90I%2FLXUtBMa7aez6IKuJIFXOVr7%2FnW9kZpwm%2BxCr3Fh9fn7vf%2FwRP%2Fyrv0RTUUR0OobeJJMXUdAqmSKZzsMt7LqpDastU%2FYZ8vnRhBW0wOLUKFabgNYk0djWwqtX%2BnAUC2hNMsncG5nveZmY8zYO3XMDzU1OXj3by%2BqmAUGwoiggOAs52OQhFEsjVYr4r%2FvYqG5n5y4LfVcHaG6zs%2B4txKSVcTbXojE5kWf81FvbuBpeRF5K8anf%2F0N2HrwjMwHw4wk6O%2BuorMlkyDZLEn%2Fx6V8H4M5P%2FmfUlMxfP3uG73%2F99zn9%2FLP0CCUcufNW%2Bvv9FGyrwbWhobpI4AfPePm9x%2B4hGIyRsoqYtAv4h2SUzSROT93bsoOsmwT83ZNP4a4Q2d6wnfrt%2B7nW%2FQJH33eEI4f3YHdJ%2FMVX%2Fp7phSViCSPuQhsGi4Zb7niQ9MY6BqMRRV2jYEPlUvdlXDu38%2FLZQa4FFbyBIJI5TWNHG4JooMzuZDM1h1hko25bG%2BNDvXR03Mjl7h7khTmMOigtFymvLmebu4J5BSy2IqwGLbv33c4f%2Fvl3iSybaL5pL3tuaCexkaCgQGTVF6SqoQFVltm1q4GUqZ6X3ggzENlkqD%2FAjhoHJnM%2BcngVo0WDvayMqfkNdtevMBKI8nfffIEn%2FuEixZ1HefThx5AXA9x17JcY8s5x9NhtLMVSLM4GKSks5f994kmmZIitbFFemYNGm4%2BirHHsoYdIJLUYio1YDPmEfH4%2B85tPEFs3Ihg13PmRByhwbkedn6Goqp7CyjysxVU4ux7Eam7AXlnF9TMX%2BPaL3ehzEtQX59F3aYh0rohmPcHLr4%2FRcz3IidEwdUXFWCp3kK%2BZ4%2FzZCxToV1icCnLuksxjjz%2F6U9tBNlEP0CxBe4sLnTLE6VPf48CRIwTe3IZ1fVmmyNPBomDh5YtnuBZWsbc8CFsqrnonLTe0cuyRx0iXlXHwUAcv9k1R2NpMgSuPi0%2F%2FLaOhZayiiCapYnc7uOPeR9nfdYzolsSm2cOTr%2FQTsXkYC0k88pk%2FpH8iTFVxMc37DlGQZ0FRZcTqZt5332%2FyWK0H104nz7z0KqJYhhLTMHKyj%2B1HbkOVZY49fC8LszIvnz7Hhl0kIsdAZyW%2BDhDD7nIhiC6ee66fRz5%2BF5cG83ny7%2FyIB27hjTvcdH%2FnJH%2F%2BWx%2FHIjjxTgXpfN9hnj%2F%2BA4YuP4dY4eKb330OzbKG%2FZKWSxM%2BGg7cy862Tg4cbMt0357qRZEVUhoBg%2Btm5pJ5UGQn39POWCiOWRMlnNSyFAmSSklY7B7mp9eJbc6TtlZy%2B6d%2Bg0nvKMtLoGwmufPuI4haFY1ZwlHbwg5dmvfvqMDvj%2BMoNiNVuui850FyhFrEYg95VsPbsoOsGIDwpoyiyihygv%2FyhV9DMMnYTHECY%2Bdw1lcTJI1lTwOvNpfiam3n6e98lZ6LfkgkOXU%2BSEpXQ3I1TfORRynUWxj2%2Byly3Ih99x34A2Gm54PozPDcd54A4PnjP6DYIvNHf%2FgVIlaJfzzZw5Ej7cyGVezFtfhD65BIYhNMxDc02Gszvv%2BmIPL9r%2F8FiZV8vvOtf6TBInL7p3%2BJqLJCy%2F5DTF8YJKURmA3FKLDamNntIRaLEV7Rsn%2F%2FAZbWVayiA1dVmsDIJFKFjenIHP94socdpzLTuc6mduJKgKHLz3HqzAB2SYO9%2BTAAjz7%2BS3zocDt7XA721LgZ6O0nrgRw1lcTCvo5eOxRorNpOm9t40u%2F%2F%2FuZdZO6nXS0ulE34qz6A9QUCoTjaXr6ziBZ0xjS8xQJGjTqNL7rfXzyy19hWlPID89MosoqzqZWFqdjbKkb7C%2Bz0Lap4FsMoUvbSC0pQAzRrEUv6whvLGfF8HYJjo8hFmixOJw8%2F5d%2FyVTIT%2FMNO3E2dXLt2jUcD3bhVTMF%2F9FUGqfTiShoePXiABbRSqjnGyy9WTV26ewlHA9mNvlbTGq44zMfxWSwY8pzcOyRxzI%2B8pE7adx9N2UldrT1Jeh3FzG3oTAd8uFwCui2QgS8A4iVJeysdUIyxr7DjdhmRnhkz42Uibk0tjexVp2JSTxVDthS0VaY0W2FqCys5MDHHwDAas%2BsD%2FS%2FcQ2L5KDvtdOZYDoOFj3kWQ3sf%2BhGrh%2BpI22G5uYWAOwuFznJGM0d%2B0mvyBw41MqZV%2FupFa1U5GziD4SJLkFdvYvr519heV1h7LXvokQu0%2FdGL%2B179rDn6G1s32YmqZVY9Y8QJI250AGA2%2BlkMx5DqLIj6eHqeBBNvpa%2Byy8yO%2BGn1uMGiwOr6KC4UiJlWmU1usimXsJdbOcbT3wb3fIazU47VpvAHb%2F%2BKEW5BW%2BrV2tWDMD%2Bm7po7tiPVGGjutnF2OD4m9MLVmQZYoEZfqRVoLkaScrU%2BC6vK8gzfna1tzIZhqoiKyRjGCw5AFzpCZFOKxQvwXJCwVXv5NWTmY3%2B%2FJODAOxsrkRyVpDX4qTPF2Dg%2FGkcrgaCoShOTxPoJFz1mfaPwf5x3Dlgz9lA3lDQ52lQYzLf%2FIsnMp%2B3YiaiKDTvO0TKtEpoLUpxkYjd1c6wN8Dk4HXSKzJWm0haJ9DS2kRxVcYwq3dnagI0yRj9%2FX0oMQ3FVQ5qnCIUSCytq5x78ThKJATAzGYOXbvb6bt0gsWpYOYhMR1jIbGGo3YXA2N%2BIjEZd1MjyyEfaYsFh8eNSyhEskpcvzLA01%2F4cyajKjbJindRpsYhkdQKuIpdAIg6Ddq0wg%2B%2B%2FxTVRQLalXzybcVcnzjN3IZC0ioiG4wMvj6J4bVR%2FMO9b9sOsmIAJhcnIUem97Vu4qFZbv7Qb%2FL8i4OwpWaa5V4apmMhze0pgZ7VOU6dOYcspzl2712QjBFXAzh3tHL2he8z7vWx3V7L5ZwgOfEk535wnFRChkSSA4damfX2YzDClau9jEZlYoEZ2pZyWLWJHOo8hFhq4NjD90KBBMlM3NJ%2F9jmKJA1bsxnDE3MFxidVqkpFHv%2B1x5ie7%2BXs%2Bedo3NYIK2b6fAE%2Bc%2Bo4P9Iq%2FFCvsLwE%2B%2B66O%2FPeAi2tN9zI4Ogg49d7cbfUMnl5kAP980xPriPHYjicAhFFodzTzKsnz7K5bkFjcqJZTiGMXWJrepTBq6fYeeQoWrNAjkGkfXs%2B%2FoBCIes83ztJdXE18qSKqcjJcqAXU5ETvxLhb%2F%2F6i0x6R5lbCHHtdDcXn%2FgmHqdASmtBUWRsAkyqawS8XhRZ4f233sLAmJ%2Fr3a%2FSWGLhw%2Ff9BuHBq0iigDzpx%2BH0sNBQytCJfop1b69xcVYMgFYncf78NVr3ddD0vofxD%2FdyqMnC9bP%2FwMCYn8OtHXSXaFgMy0wPb3D3PXdyoOtQxmC3VO44dg%2BzwQBigRbBmZk6LC4SWf3gHpJWkeaWG3nh5eeYDQZYVGEiIFNXbUSURLxqmDe845wwrRLb%2FMnt6DufGUXk2RmaO%2FYzFE6jL888yY2VIk6nk%2BmJU%2FSdP4uYMOIohxde%2Fja82bjsT4%2Fcw03lDkRvlHgsxkDvpbeC8fnhMzS2H2RpYYgqyUqPeZNoRCXPaqCqzInGJBKb9vM3f%2Fo5XE4NnQeb2dRJ%2BMJRfJvgzoEfXRglPhV9028H32QCW3qGZIGRFreT4JaRmBwisDBDdWM7MXmJ7h%2Bfw1OSGeke%2FfyvUbZtNwanC29AQbIICIKYaWJQVUnDwQ4EUci4X0NxOm%2FuYu7VU6zN%2BdkssBH0%2BRGrBTYLwtz5kceoaG%2FB6fFkR4a3y5ZJZf%2Fe%2FciTfgb7znDo5iYsnk4iKwb8gQCVdit%2FM73OreNjfL6%2BgO8ff%2F7NN6qQ5yQevEq5p5nmfYf44M2thJ5%2Bgs7uCe6c3%2BLW9lZkeY4qm5RxYzwZl6T3jQuU6K14rJm2LY%2BslLM8HafvjV6ee%2FJZliI9vHryLGJ1A2fPnuOO3R62ZoNcn40yfK6bFdmPRfSgMYnsPHobzrqD3HFLAxRIFIoSk5cHuaXbS35URrDqEKxSJi7KWaWsrJj%2Bs89hLtnOqqJinVbo%2FN1PsK4mkCwa%2Bnt7sDucFNprqaqq4uzZcziKzbiLbKTnZwD4zV12FoML2KoycUtMWcTpcqOoMW5obUEbG2N%2BSYuzpAJFVTAUhHnojrsosEvYnTZ6e700VKZZLXEg5mbWSWIqVDcdpiBf5Pw5H2ZNjNSSwn13N9Mz4Qdg4qUfUFcsUG6XsOglrl%2B9wMl%2F%2FCvOXDzF5TFvVgxvlz01biiQ6DhwGLM%2BE2yypWJ3OHE5nRycW6B8SqU6MEf6ah9upz0jBH0mfrBUOWA5hjw7w6kTZ9jRP0dOVGbw1VO8sRDCVe%2BkuWM%2FjTurOHv%2BOaySSPmWRCwW47P9%2Ffx2bItV7xVeH%2BtFUWWO3XsX%2B9%2F%2FOAduvYf%2Bs8%2BhxDRcvuolVORgR7kNobqQHW2dWEUrjbs%2BAIkk1y9%2Bj4WpNdhSKVxN8dn%2BfkpPv0blShSh0E5zx37iWyBKpURVFUWNoShpgv3jfC4cJv2VL9NwsBGNKWOY1709mPWw4OtHZ1CwCSZ84Sh7P%2F4pvFMZQew5tIeC3GLGF2aoLLJgKqrHXiWwNJUx3G0NVcS2NFhzLexs7mKrQGE8skpaV0Q6rVDVfCgTqxSA73ofoiAQn%2BxHjq2xFptFWRHRmeFqnz%2FTw%2FZN%2FH4fDR4nyyEZq2s7q5sGDu89QqEkMhWcy4rh7TA%2FlYDlGFde7%2BHg0QMoagySEZyeJpQpPydlO9%2FR1nKm7i6GWroQbSKD%2FX2ge9Ovz3ODQYdY3UBSkNj9219m2XOYosZ2loN%2BXj3by7XR85mpxiqR5rZmLkZ85OvNXLffzWuTSUSpiNt3N2F3uJBj85BIwnqA5o79OHc4mTfpKHnkt3DnQFtdJ263AyUOg1eeITB2DpNUypXX3oBEEqvDyYh9L6aHvsCmNROQ9o9Nsn%2F%2FzoxrBxw8eoBjD9%2BL0%2BOhxlbDb3z814jIMSy5IEoSZr1EtbuVhVUb%2B%2Fceo7d%2FCIBv%2FdVXGUoZCCnD9Iz3Mz0wwK4GJ0VVDUz5ezh37grVLgfBWJqLr2cmIiJJCXlGYXi6ELt7J5OXfogajPDquWcoNerQxmOsV7goFNNYqlw4HXYqq%2FMyG6fLszz%2B6d%2F4n%2B2daXBb2ZXffwBILFzwsHMnFlKiFlJc1VJro1hq9SJ3u9Xt9qTLqYw9djyJa6ZSqVRSUzOpVDw15RlX7JmqTOw4cS%2FjjD0d965epFZro0Q1LYr7Jq7YSYIgQeDhASSxEEs%2BQKNUKuNMjVWpfAh%2Bn4BX7z1c3MLBuf9zzj2PHXENnjhHpquPqqYzLExtcOqVFxH9UTyRPbweL2Ullb9xxWrRGB6SSPmgVESRmsMzO8VeLMjA5Q%2BhVOTLX%2F0q04IRobGdpKyaalmeSr2dI20NsDsCGYmB628%2BuldTVTsX%2Ft1lqk%2BfY2Ulh3dyid6%2BLtra2pi5Noy9ow%2F3zCTf%2BOf%2FhuoGNVezNcjPvkpWZ2DEFXtYVrEEagU%2Bn8gnVy%2Fh83p44kAXb0yk%2BetX3%2Be%2FX32biakgsqxER3cH6d0UAK3HnufG8ArjI6P8i4l67rrl1LfvY%2FLGdSwCsKeH7YfPYlaYIDHIVpmcfxvu4p2YlRajAUWZjhef6cXrjeCwN3LkwBE8i7eR56MIVjO%2FjNdy5cB3KH%2FmD1BEI4wuTXH%2F%2Bnts%2B0QarA72GVsYn%2FBRo0hRqk4iz0VR5CPoDNpHnSzKbXUAVAhGdKV2wpkoc%2BMhols%2BolKUqCKO3tzM6qaX1idfJbB4i3UxzY%2B1L%2FP9eCeuvV1KBCWoFbz49W9x%2BvjTHOlpR12%2BWyzHeFx%2B8trPyac2MWiUGCwmkrEFTn%2F5t0FhYuDKB0S1rXzlmdM455eo0iQoL03isNeCvKwQk2%2B0QFoF8jTvDy2wtisQdo7iW93g1OkusjsiNkcTyvIyNOVK9DU2PnrvLcaC4Gi0se6Nklqc4GxvK9GtCCeeeY7JiQUOWC20dJwgsRXku3%2FyY8xnvs7dgQFW58Y5Vp%2FFpEhS1dSIqWEfq0EfLfuP4WgysDi3zUpKTm35HhsBFxpLBYeqBNQq0JgbiW4GmXmwQG53j0BYz6B%2Fj7GRB1RIm3zjm8%2Fz0SdXqTLrkbb8LPkniCWSnD3%2FJT74xRDG2jrW92Ts5GWYy1R89UI3VbZujBoT1iefpbHVQdxi5N6dJdZiSV589jwaOawsj%2BN3zqMqVaO1NJO1VGEuKSGcTZFLrlF1sA1ThYBeq8Gga8IY3%2BDoYSOz9y7hlCzENzb5ONXJKbuF1z%2Fx8crJalanv0AlTzJ8b5DJhXl29vQ8%2F%2FwLRc%2FwWBno9DY2i44jPS0kQiPUNp%2BC9CIkBvFE9oj5J3njjZ%2BSrdThcXtw%2BqNM%2FGqcGwNeyG4V%2FmXVCibv9lMqRTnSbCantXLm6ULmtvd8H2Iwib62joC30CdVr5WRX9nAtSkxFQw9GkssXEjexSJexOgeAJ1n%2Bnj6wgXU0ghW4zZnDljJCgbann6C%2Fs9usnjvCqIYYXJkAFR2bo%2FMFJZ%2FGhlmBcSnl%2Bjs%2BwryciMoDNhbuzhzpg1798ukBAOS2oY3qWJ5eYkbt6bQaXUo1HI6TrTRYLZz5kwvlAgc7zvO8tY2lroGVJktvE4nM3cGcU7fw50O45nsZ%2BDj1xC%2FGCVbAYK5mU9vzzI6No3W2kxjZ6GLdmDZjbWpjWylnJxMT1vHeQLjdx95hoWpBZxuD7EUlGqr0Wl1rItpjOotfMG79NqjCLIKDFqRndA8zTojnS3dRD2uooB%2BXA5WNzC5HOL%2B9fdw%2BdLY96tB2QLKFmxmE9amLnIVBqadIa59fp2udiudZ%2Fp46okGAivxgkGUCIRW5lA7ehCjUZpN1ShyhTICMhLkwojBJFmi9H%2FyAdlkjt1MnMUHM9RYqqjoOo58R4bNrmPg%2BiWa7Tb09VUFXQJEIhGC%2BWaCgULJwfkXXmV24HNaDjpY2khgIPlQ60QwUVgKVScK1fn25mYGrr6JIKjpv%2FT6o2XSJ%2B%2F9kDvvvI2Q9FJ38AQxTQaAXFKkwSwwcPlDVkISAwN3GLh%2BiWvD49Tuc7C5tkLH0R6O7D%2BC7lAtZaotGswC9tYucnIDG3kDvu0KDlpVVFfmCJaUoxN0yGMRPBtrlFtNKHJRjCU67G02PJ5xartOMzg%2Bghhx4%2FH6kDVUoVXxSJDvZuKsDHyISrUfv5RgOTSDrrGHG5%2BOc33oKuO%2F%2FA8cOnu0aAyPy55WgRhZwbUhkE8GeO3PLzE78DmkF7E6HEyN3sBoEOg70IBX0YgYezhtpSK1Njs%2F%2B28fQUaiqfMCZdEtht%2F%2BCc6tIO%2F94g0O20pxz3tIpNOsBOdpaD5L3wsv0%2FfCy8wHVyhLbxBZmSLldhHJinS296LT66i12UFh4NIbPyCn2MeoM%2FJovKvhbQRlivX1KBsBkReevUjrmWc4%2B1wvty%2B9SevFZ%2BmsKmXOv4LBYKO8tZn6ahs%2Bn0hf31koEXDPe3jh4rdJSUlqbNU8uPop2kQJpdlCGbqqQg%2BVzZzp66OlTkBrsNGihKSsGkNDO7evvosvtQ7xCPMDC9gPNnL70%2FfZiwXparfiYJuh0QeoK0JodgsRnq2MDIe9AUGpJb%2BbI6c18PGtT9mWwiy%2F%2BwM6mvQ0WRzoDRpUUoTOM32UafK89M1vsRUR8URqMFgP0dGo5FCzvbBPo9HEv%2FreX3Lxj%2F4zDwYeL7Ra1AzA9%2F78h7zz5g%2BZHbyG1W5kf3Mlh8%2F%2BFoOfvM2ng6vUqOIMuiR2KKdUqeYbT%2B%2FHUJFkcvA%2B1U0ddLRaQFnDnc8us7QeQ9t1Gn%2B4hGpBQ2lpiosvPcutD99Cq62mxtGNZ%2BIKK6s%2B%2FDt6tvJV9N%2Fboqsuh73JQWvXYXY35th0TWDSGzjwxEnGB24yNuFD7eghEdtgn3aH9SUvPd1GDrYdZ3JkAGndx%2By0k7PP9fLWz3%2FFPX8Wu0VBaSJAaT6BLJdgN7LOdspPlaWG2C6Iq%2FPcnwsxNr2ArbGaiswK%2F%2FL3XkEMhSgp0dDR1cDkzAarHi9Bf4DR%2BTjx7A7T4%2FfYcAXYZ9bTe0RDpUVObFNkamSU5kMCE2M5bs3ep%2B70l2ivMqISBMRolKxch0mvIWWxsuKc5VTbfpzzEm1HDjGzHmbl%2Fn2C8gS5jBG7kEOZEamttaHSdxIMJcns%2BlAropSUG9FYVDRr1pBvyxGlIA8W1snqTP%2FgLnpFz%2FB34Jkdp%2BekFb2gYm2zksXhYU5%2B5d%2FzVF8P2%2FpDCEotizNLHGos57XX%2F6qQHd7O0f%2FJB4%2FyEvo6B9oGI07nCp1VpWxmlIhyHT6XF62lkD0m5UHK6omKbrzOwhq3o6Wc8J6EUnQzcPWH2Dv62EhqQK0AhYHuJx002%2FWsb26QCzpxekSyWj068wEmRwaIZcDv8aATDA8L8gzUVcQIxuWIexInujoflWK09VyEEgHr%2Fi7KlBH2tAoO2S3oDRoABGPVw5Jv8K0q0CoLr9s7HCTEOEpTG7aWNs6da2Fm7AEj037mBxZwz92luqaS0UEfG2UKjNXdeIeGH83vjuREaLQRiYiIEakQWarQE91dKMxBk56nvvQSF44%2BhU5rYXR4hLoaK6KUJp7e5sb1m%2BxqjQyNPmDeVxhge%2B8%2FIV9Rhse1RMshI9qHAY2iMTwGJw%2B1sxOaZ9VdWIq0tVayFRhh8P0%2FxjU9xEZeh3OjIGwjYpw%2F%2FbMfEfB6sDXokWWjyCt1uOc95JIiuWiYsliY2eF%2B9pJqVBEfy0dRBkcAAA0eSURBVD6Jvov%2FlDJZkIH%2B94lFvNRXd2FVVWCpa6CuIoaxVKCtux0wEHBOElkLc6d%2FvLDGLxHYzMpQpYJUGCqpN1bQ1W7l0rt%2FjcefR%2FS7WQ3FiGUiaE02YpEISlMbOq2FBoNAeBs2VwsVqAPX36T%2Fkw%2F46J03qGr7NqWxLNuRON7FGUwGPf2ffEAuKSKJIj73JANDY3hcS0yPTZCuUzA5cpNcsLAceebl0%2FzO73%2BbEy%2B0s7kk4ZqTKKk0cMCkxe9cwNRQTzgTZdv3t8I2Rs8%2BG5HNEJWyMG6fl5Su5lGY9cblD7l2f5rqehXeSJ7tVAy%2Fa5yxK5%2BTiAQYmcrC%2FHVK1Ulschjo%2Fzme6Tkk%2FxbZZI5tMVY0hsdlZqyQUMonA4hSivVwjIiilnTZKTIl%2B7g%2F7qe5SuCgVYXDcQyPa4yl2XG8K4WHj9h0WVaDXnwuN7MTTuTVD7c21sUZWnbhMOe5c%2FV9UpoaamvO4poeIlZosM3m2gpJj5v1nIzInhzR7%2BbapzewOhwIBj0KtZybn94i6nGiSywWKkkBv89H05HjGGp16Bt12Jv2YyCJGM2TrVQweeVNqhqq%2BNlPCs3Dejod3Lk3hST9T%2B0RWLwFwB2PDltLG%2FHlQaZGxtDXOohvjREO5PnG77xC79OvEolu0mI0QMiHpKxj2eXi9s0RZq4N41z00n3xJOV6OaaKPbw5OHPAytb4IOlpJ6kSE7MuJaUBEXdYwmAx0z%2B6hkHIY%2FaHsJttRKJw9LmzzE%2BvEI2KtHeZmbx7A3kuQkW9FpWgptceBdN%2Buko2MJfnqCwx0NV7AFvnk0hhkSaHqWgMj0udvYYIajbEykfHDNkAfWfV7KS3qK9uwbkhMTT6gMv9A3hnR8krdOgEPd5QHvdKnMhaGIMsiWBy4L30F7zwz36f0Xv9HLDYWAkW9gMArK37kCQFK55x1NpS5Iv3SEQCbGaUfDbpR4zn0Dc0MTU%2BRkd3B3spLcYaAxYFRCQFE2N%2BYuVKGq1WKlUC7unPIR7BWG%2FA5U8yM3YTRTzLha99h88%2FeAvb%2FhZiXg87bi9HDh4iLOrpe%2BFldFodyx6RjGDEblhnIpBjMazgbN9Rbn%2F0Llp9Mza7jtd%2B%2FB4DQ2N0HH2G4bElTF0n8SZVhSz2uaOMLk3xxOkT7EbCtBzZT3A9Tqcyy1xZPQfPnWL%2F069grBP4x8%2B24950c3c%2BBLt6LPI096dEdrVGXOEIObmOqDvK8b4nSW6XUVUiYD%2FcjZQzsBh%2B2MTMuYBHcZwlpwuNyU40mqd%2B31OEJPC63WS1%2BqKAflxGJieIu%2B7TduYY0fUQZm2WwEaOljYHl27G2JEraW4wk3UvUH34GPssGcrkCdRqDeWVcramRDTlQTa242zLzNQ0trI4fQeDUU1vyyH8a9NsLE2RzyRgL0ptczNJt4vBkJKAsgWLrYp8NMq3vnkBfUkUtUpHdDcJyAm57hENRYhp6lEKKgK5ChqMSk4e0CFtzGO37yO2FaQiU0H94SeIZWQMj7u5c%2Bcutq7ThNYmaHTUkC3NsekeodqkwbcSpa7GytraJLdvPSAqFzic9tB24CCHWk0YlBLZcjMbYpIakxpZKglymHNFSafkaAU5qg0%2FStL0dusJR7MYK9ME3PNU6k0k9qrodypQhGaprTWiNNhYdn5BljLqLHVoS9cpVTpoPXIAdZmaCfcaFcltDh7vZnh0iUSphQNZHx1HDiCUa5i7M4EYzVFisNIsXyGfT7C%2FuR7%2F3CiLc3PsJUS6Th9leSXJqROnip7hcfBNOHFHFNx8%2F3PUGiNrmwUPMTd4l2r5JgZ9JTOpGiw9x6jVqVBIEaZGxtBpIZvMsWfIsZOrovfpVxkdHuHm0CiTY8uUxrIsh6PYHfsRcwKT4y6WJ4dYHLxCQ%2BdJjDo5dpuVuSt%2Fg9%2B5wOU33kBrsCHNDaIrBb1OhxjPIas04HU6SekdbF37K%2FIrG4x8MYYo6fH486gqlGyhwjVxBTHsYSsiYjv1PLrEIj1P9rEdB8PuOhVVHQgGOx6vG0XGR2ZHT05b2AmXEcwsLy8hxvKc%2F%2B0%2FIrcTweNeQl8hx1BnRCfo2dMq2NUaaa4SqD72HAthEZdnC5dnC4Ollpv39jh61IZvcwm7zUrN0fPc%2Fvw6Qt6DWt9DTq5jYW6lEFatALd7iogEpw%2BamfelCIwV2rxUqXLcX3Sy4honnpJoO1NIXvqdBbFt7T7KwlaMc0dbaT%2FazeHmcsYnF1mYWCx6hsfl5hc3OX%2Bsm9qachrrK8jtrZKXmUhrO%2FnDP%2FuQ9n2NxDb8lCzMcMJRx%2Bb6PJ2dNUjRKJKYoDQiR2aGUHidwFopVpMOWS5GmUbD0Q4HG8teaowq2ru7SdPA5qabrOEIP%2F2L15AFl7nw5TPUmfRYK6C5MklWX4O6TIMUTzI%2BNMg1Z5zgQoCF2QXYDdNysAaZYECxt8vm%2BgZV9XZ0gp5IOsP68hqfzybYl9rCpE1z69JlXnz%2BDFUNzditBlLJJEqlDkmK8vblZWKRKNHFYaTVRUx11TgcTTz4%2BBfk1ToMGYl9PU%2Bwl8gjK9fzl99%2FA4siwWz%2FZVanh%2FjK158hvymiMZspV%2B2QSaSJxRK0dr7Ef3rnBue6G0iVmikvq2V8doXtEgXeqQmM1ga84g7R8ASl5qP45%2B9Taz9ETgVPn3uGVL4Ee0WKbCZEmUbOwsgCl670w24YcWsVc0UZvUcP4fMsYM7LcXpm6f%2FCSeOBJp566ku%2F8e%2Bg2EQM%2BK1%2F9FW%2B9bu%2FS3rhPxJcj3PyeKGn6eBQmJJKA01HjiPG8ggKEVHS09bdjmf8l1QdOkF2N8%2BdGzc43FzOQetptnJhpIzAe%2B%2B%2FxytfeQUZEtlkDoU6yuLgENWtx8lJUeRCYR%2BAIECVWsPC0jpiTiAfW8ZYUsFYMMgf%2F8n3mLzbz%2B3RRUKrEvtam1iedaEol%2BOw29GVQszr4fTFc3x0fRiHco%2BcUIOiQkZOpkevlVGpEphamMCQ2KXScQjv0jCSpCCfCaO3NLPsiZCtrOLJzkbsVj23Pr5O05GmQoRHpUN62BfKYalhdGmKTDzysKkYuD1RPB43Pd026oUUu5Ew73zoJ6er4kfTxzhnWCZs7kBIr1G7z8HQZ1e48LXvMDi5hBRycqL3IIFUJdUaRUEnNFQRisk53lxJcuwq7Ye3qVDpcLpF9NZmnF6RL1wi3WeP0rG9jCwfIRoViUZEbA4HV8ck%2FstP%2FmvRMzyuZpi79S6ulSzl5XlGZ9MEtspYWlxFU9NEwBUnurOJqqQerVHgBz96HZVWT34nxdTSMl3H6pHiDdxbmiQaiuINrNJQ3YQ8LXLl3Q8IbodgV0VpUsHdaTe68gw%2F%2B%2BkV7PUaDFVGpsfnuHd3ihq7BWNOhtvtpXVfOb%2B6%2Byvu3ZtDI%2BioM5aTT65iEPI01ZpISCskExGM%2B5sJijLYjpKghGQyyYOJB6yHo%2BiUKrzOYTK5WtL5DFJKQkoqMWTSqBvqie5mKJel2fAF8M7cw7PuJ%2BjykdfoEFeC7AWDqHR6kKtZCu6hKC8hFo6QTO4gSyko1%2BtQ7sUxKEsYHl1Bo1bS0ymwtpYhYbFywAb6RiOxYJR4RITqdvqe6kIjmNgtrSYh7XLq7PNMzG3ytZee4ONPPmZdeRDd7hRhyYlJrUSuLGNheY7AkhNFQzkzV77gTKOcUGyF7YUQO%2FIyxMgaQf8sguMIvaeeKhrD4%2FDdP%2FwukWwJF7%2F8TVxiAltjN6vBNJLFhrrMiLSZ5MaSH%2Fm2DK3tMLtpBbKMhRsji5RqBEYmgkRCSShpZCa2Sy4isCfTMr7kxP7Cq%2BQjJgLbu1i7TjIyECCnMFNRXsL4rA9XUEVyO48%2FZCa8m8bafZZArJobI046z1zkztg6MVUWS90ptjfj6OouMBeOMzmTpb6ugY8%2BGOdATw9uXwkas5mh1TiBtTCdPadxRdIsuOPU2hyI1U3c%2FuwBQk0jMcs%2BAj6JKq0OMd0IlUpKDVZikTDlug6286XkhFqiSgOeQJyprSDBNYnVYArXUhLb%2Fl6cOzIqS4%2BQ3NNisTcTT5RRVt2CN2YjWWVk8PIQGrODpJQgF1xDntol6HtAfnac1blxZMkwvslfMT0zxfZsP3cuf8r%2BzvPIli5zvq6GukoVpioNY2NjGErynDp%2FnrsTkxx%2Fopf1rRCz993UNNdxf9TJVsxACCPtVgfdT%2F7mApp8kfwf%2FN6%2Fzvs9gXw2l83n8%2Fm8KMbyohjLR5NSPri5%2Beg8UYzl33r9b%2FKiGHt0LJqUHr3%2F2%2Buv3rj2f%2Fw8UYwVzs1t5ieufT%2Bfz23mb33wp%2FlsLpt3Lg%2Fng5ub%2BWwu%2B%2Bh%2Bfxf3h6%2Fm3eP389c%2Ff%2Ft%2FGc%2F9kfu%2F9rp%2F6PHHwe8J%2FNr7fzi%2B%2FOj423Pir%2F2%2B2Vz2f5vbXzf2%2B7e%2B%2BHvn%2Fe%2BjqBmK%2FD8ll889VkeLx72%2BKKD%2FP%2FzRFCnmGYoUKXqGIkWKnqFIkaIxFClSNIYiRYrGUKRI0RiKFCkaQ5Ei%2F%2Ff4HzBti582fyHbAAAAGXRFWHRDb21tZW50AEJ5IExvcm5hIE11bGxpZ2Fu8ANzlwAAAABJRU5ErkJggg%3D%3D",
    cmsCSS = document.createElement("style"),
    // Changed height from 116 to 130. Removed unnecessary styles.
    css = 'div.cms-container { border: 1px solid #b0b0b0; margin-top: 1.5em; padding: 0; text-align: center; overflow: hidden;} .WidgetBody div.cms-container { border: none; } #ctl00_ContentBody_ProfilePanel1_pnlProfile div.cms-container { border: none; text-align: inherit;} div.cms-container { background-color: white; min-width: 236px;} #ctl00_ContentBody_ProfilePanel1_pnlProfile div.cms-container {float: left}',
    currentPage,
    handler = document.createElement("script"),
    jsonp = document.createElement("script"),
    profileNameOld = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblMemberName"),
    profileName = document.getElementById("ctl00_ProfileHead_ProfileHeader_lblMemberName"),
    statsUri = "https://www.15ddv.me.uk/geo/cm/awards/cm_data.php?name=",
    userField = document.getElementsByClassName("user-name"),
    userName = "",
    userNames = [];

  function displayStats(stats, page, brand) {
    function getAward(num) {
      var levels_cofe = ["Novice", "Reader", "Deacon", "Curate", "Vicar", "Archdeacon", "Bishop", "Archbishop", "Primate", "Saint", "Angel",
						 "Archangel", "Principality", "Power", "Virtue", "Dominion", "Throne", "Cherub", "Seraph", "God"],
          levels_secular = ["Workman", "Apprentice - Beginner", "Apprentice - Intermediate", "Apprentice - Advanced", "Journeyman - Beginner",
							"Journeyman - Intermediate", "Journeyman - Advanced", "Master", "Grandmaster", "Grandmaster 2nd Dan",
							"Grandmaster 3rd Dan", "Grandmaster 4th Dan", "Grandmaster 5th Dan", "Grandmaster 6th Dan", "Grandmaster 7th Dan",
							"Grandmaster 8th Dan", "Grandmaster 9th Dan", "Grandmaster 10th Dan", "Grandmaster 11th Dan", "Grandmaster 12th Dan"],
		  levels;

	  switch(brand){
  	    case 'cofe':
		  levels = levels_cofe;
		  break;
	    case 'secular':
		  levels = levels_secular;
		  break;
	    case 'none':
		  levels = [];
		  break;
	  }
      if (num >= 0 && num < levels.length) {
        return levels[num];
      }
      return "Infidel";
    }

    function getHtml(uname, level, award, finds, brand) {
      switch (level) {
        case -1:
          return "<a class='cms-msg' href='https://www.15ddv.me.uk/geo/cm/cm.html' title='Church Micro statistics by BaSHful'><strong>Church Micros:</strong> " + uname + " hasn't got any Church Micro finds in the database yet.</a>";
        case 0:
          return "<a class='cms-msg' href='https://www.15ddv.me.uk/geo/cm/cm.html' title='Church Micro statistics by BaSHful'><strong>Church Micros:</strong> " + uname + " hasn't qualified for a Church Micros award yet (only " + finds + " finds in the database).</a>";
        default:
          // Get the stats banner.
          return "<a class='cms-badge' href='https://www.15ddv.me.uk/geo/cm/cm.html' title='Church Micro statistics by BaSHful.\n" + uname + " is a Level " + level + " " + award + ", having\nfound " + finds + " Church Micro caches.'><img src='https://www.15ddv.me.uk/geo/cm/awards/cm_award.php?name=" + uname + "&brand=" + brand + "' /></a>";
      }
    }

    function getLevel(num) {
      var n = parseInt(num, 10);
      if (isNaN(n) || n < 1) {
        return -1;
      }
      if (n < 10) {
        return 0;
      }
      if (n < 25) {
        return 1;
      }
      if (n < 50) {
        return 2;
      }
      if (n < 100) {
        return 3;
      }
      if (n < 250) {
        return 4;
      }
      if (n < 500) {
        return 5;
      }
      if (n < 1000) {
        return 6;
      }
      if (n < 2500) {
        return 7;
      }
      if (n < 5000) {
        return 8;
      }
      if (n < 10000) {
      return 9;
    }
      if (n < 20000) {
        return 10;
      }
      if (n < 30000) {
        return 11;
      }
      if (n < 40000) {
        return 12;
      }
      if (n < 50000) {
        return 13;
      }
      if (n < 60000) {
        return 14;
      }
      if (n < 70000) {
        return 15;
      }
      if (n < 80000) {
        return 16;
      }
      if (n < 90000) {
        return 17;
      }
      if (n < 100000) {
        return 18;
      }
      return 19;
    }

    function insertFriends(statslist) {
      var i, j, list, headers;
      headers = document.getElementsByTagName("H4");
      for (i = 0; i < headers.length; i++) {
        for (j = 0; j < statslist.length; j++) {
          if (headers[i].parentElement.className === "FriendText" && (headers[i].textContent.indexOf(statslist[j].name) !== -1)) {
            list = headers[i].parentElement.getElementsByClassName("FriendList");
            if (list.length > 0) {
              list[0].innerHTML += "<dt><acronym title='Church Micro cache'>CM</acronym> finds:</dt><dd>" + statslist[j].finds + "</dd>";
            }
          }
        }
      }
    }
    var award,
      cmsWidget = document.createElement("div"),
      finds,
      html = "",
      i,
      images,
      level,
      loop,
      name,
      target,
      target2;

    for (i = 0; i < stats.length; i++) {
      name = (stats[i].name + "")
        .replace(/;/g, ",")
        .replace(/'/g, "&apos;")
        .replace(/"/g, "&quot;");
      finds = stats[i].finds;
      level = getLevel(finds);
      award = getAward(level);
      if (i === 0 || stats[i].name !== stats[0].name) {
        html += getHtml(name, level, award, finds, brand);
      }
    }

    switch (page) {
      case "my":
        target = document.getElementById("ctl00_ContentBody_lnkProfile");
        break;
      case "account":
        // New account dashboard.
        target = document.querySelector(".sidebar-right");
        break;
      case "cache":
        target = document.getElementsByClassName('sidebar')[0];
        break;
      case "profile":
        target2 = document.getElementsByClassName("player-stats");
        if (target2.length > 0) {
          target2[0].innerHTML += '<div id="cms_summary_stats" class="stat"><img width="25" height="16" src="' + churchImage + '" /> ' + finds + ' <acronym title="Church Micro cache">CM</acronym> finds</div>';
        }
        // Abort if award badge already on profile page
        images = document.getElementsByTagName("IMG");
        for (loop = 0; loop < images.length; loop++) {
          if (/15ddv.me.uk\/geo\/cm\/awards\/cm_award.php/.test(images[loop].src)) {
            console.info("Church micro badge not inserted: already on profile of " + userName);
            return;
          }
        }
        if (profileName) {
          target = document.getElementById("ctl00_ContentBody_ProfilePanel1_lblProfile");
          if (target) {
            target = target.parentNode;
          }
        } else if (profileNameOld) {
          target = document.getElementById("HiddenProfileContent");
        }


        break;
      case "friends":
        insertFriends(stats);
        return;
    }

    if (!target && !target2) {
      console.warn("Church Micro Stats: Aborted - couldn't find where to insert widget. Might not be logged in.");
      return;
    }

    if (html) {
      cmsWidget.className = "cms-container";
      cmsWidget.innerHTML = html;
      switch (page) {
        case "my":
        case "profile":
          target.parentNode.insertBefore(cmsWidget, target.nextSibling);
          break;
          case "account":
            // If the StatsWidget isn't present, create it.
            var el = document.getElementById("StatsWidget");
            if(!el){
              console.log('Creating widget.', 'StatsWidget');
              var divStats = document.createElement('div');
              divStats.id = "StatsWidget";
              divStats.classList.add("panel", "collapsible");
              divStats.innerHTML = '<div class="panel-header isActive" aria-expanded="true">\
        <h1 id="stats-widget-label" class="h5 no-margin">Statistics</h1>\
        <button aria-controls="StatsWidget" aria-labelledby="stats-widget-label">\
          <svg height="22" width="22" class="opener" role="img">\
            <use xlink:href="/account/app/ui-icons/sprites/global.svg#icon-expand-svg-fill"></use>\
          </svg>\
        </button>\
      </div>\
      <div id="StatsComponents" class="panel-body">\
        <div id="StatsPanel" class="widget-panel"></div>\
      </div>';
      
              target.append(divStats);
      
              if (!GM_getValue('statsWidget_visible', false)) {
              document.querySelector('#StatsWidget .panel-body').style.display = "none";
              document.querySelector('#StatsWidget .panel-header').classList.remove('isActive');
              fadeOut(document.querySelector('#StatsWidget .panel-body'));
              }
      
              // Add the click handler.
              document.querySelector('#StatsWidget .panel-header').addEventListener('click', function() {
              if (GM_getValue('statsWidget_visible', true)) {
              document.querySelector('#StatsWidget .panel-header').classList.remove('isActive');
              fadeOut(document.querySelector('#StatsWidget .panel-body'));
              GM_setValue('statsWidget_visible', false);
              }else{
              document.querySelector('#StatsWidget .panel-header').classList.add('isActive');
              fadeIn(document.querySelector('#StatsWidget .panel-body'));
              GM_setValue('statsWidget_visible', true);
              }
            });
            }
            // Finally, append the banner.
            document.querySelector('#StatsPanel').appendChild(cmsWidget);
          break;
              default:
          target.insertBefore(cmsWidget, target.firstChild.nextSibling.nextSibling);
          break;
      }
    } else {
      console.warn("Church Micro Stats: didn't generate any award badge.");
    }
  }

  function getFriendNames() {
    var i, names = [],
      headers = document.getElementsByTagName("H4");
    for (i = 0; i < headers.length; i++) {
      if (headers[i].parentElement.className === "FriendText") {
        names.push(headers[i].textContent.trim());
      }
    }
    return names;
  }

  function getHiderName() {
    var i,
      links = document.getElementsByTagName("a"),
      pos;
    if (links) {
      for (i = 0; i < links.length; i++) {
        pos = links[i].href.indexOf("/seek/nearest.aspx?u=");
        if (pos !== -1) {
          return decodeURIComponent(links[i].href.substr(pos + 21).replace(/\+/g, '%20'));
        }
      }
    }
  }

  function parseNames(names) {
    // Filter out null or undefined entries, convert commas to semicolons, then convert to a comma-separated string.
    return encodeURIComponent(names
      .filter(function (n) {
        return n != undefined;
      })
      .map(function (n) {
        return (n + "").replace(/,/g, ";");
      })
      .join());
  }


	//// EXECUTION STARTS HERE
  // Don't run on frames or iframes
  if (window.top !== window.self) {
    return false;
  }

  if (/\/my\/myfriends\.aspx/.test(location.pathname)) {
    // Your Friends
    currentPage = "friends";
  } else {
    if (/\/my\//.test(location.pathname)) {
      // On a My Profile page
      currentPage = "my";
    } else if (/\/account\//.test(location.pathname)) {
      // On an Account page
      currentPage = "account";
    } else {
      if (cacheName) {
        // On a Geocache page...
        if (!/church micro/i.test(cacheName.innerHTML)) {
          // ...but not a Church Micro cache
          return;
        }
        currentPage = "cache";
      } else {
        currentPage = "profile";
      }
    }
  }

	// We're going to display so we can announce ourselves and prepare the dialogue.
	console.info("Church Micro Stats V" + GM_info.script.version);

    //******* Configuration dialogue *******
	// Register the menu item.
	GM_registerMenuCommand("Options", function(){
		GM_config.open();
	}, 'S');

	GM_config.init({
		'id': 'cm_config', // The id used for this instance of GM_config
		'title': 'Church Micro Stats', // Panel Title
		'fields': { // Fields object
			'cm_branding': { // This is the id of the field
				'label': 'Branding', // Appears next to field
				'type': 'select', // Makes this setting a dropdown
				'options': ['CofE', 'Secular', 'None'], // Possible choices
				'default': 'Levels' // Default value if user doesn't change it
			}
		},
		// Dialogue internal styles.
		'css': '#cm_config {position: static !important; width: 75% !important; margin: 1.5em auto !important; border: 10 !important;} #cm_config_cm_branding_var {padding-top: 30px;}',
		'events': {
			'open': function(document, window, frame){
				// iframe styles.
				frame.style.width = '300px';
				frame.style.height = '250px';
				frame.style.left = parent.document.body.clientWidth / 2 - 150 + 'px';
				frame.style.borderWidth = '5px';
				frame.style.borderStyle = 'ridge';
				frame.style.borderColor = '#999999';
			},
			'save': function(){
				location.reload();                              // reload the page when configuration was changed
			}
		}
	});

	var brand = GM_getValue('cm_branding', 'CofE');
	console.info("Church Micro Stats branding: " + brand);
	brand = brand.toLowerCase()
    //**************************************

  switch (currentPage) {
    case "friends":
      userNames = getFriendNames();
      break;
    case "profile":
      if (profileName) {
        userNames = [profileName.textContent.trim()];
      } else if (profileNameOld) {
        userNames = [profileNameOld.textContent.trim()];
      }
      break;
    default:
      if (userField.length > 0) {
        userNames.push(userField[0].innerHTML.trim());
      }
      userNames.push(getHiderName());
      break;
  }

  userName = parseNames(userNames);
  if (!userName) {
    console.error("Church Micro Stats: Aborted - couldn't work out user name");
    return;
  }
  statsUri += userName;

  // Inject widget styling
  cmsCSS.type = 'text/css';
  if (cmsCSS.styleSheet) {
    cmsCSS.styleSheet.cssText = css;
  } else {
    cmsCSS.appendChild(document.createTextNode(css));
  }
  document.head.appendChild(cmsCSS);

  if (typeof GM_xmlhttpRequest === "function") { // jshint ignore:line
    // Use cross-site XHR to get raw stats
    GM_xmlhttpRequest({ // jshint ignore:line
      method: "GET",
      url: statsUri,
      onerror: function (response) {
        console.error("Church Micro Stats: couldn't retrieve statistics: " + response.statusText);
      },
      onload: function (response) {
        var jsontext, t;
        if (response.responseText) {
          try {
            t = response.responseText;
            jsontext = JSON.parse(t.slice(t.indexOf("(") + 1, t.lastIndexOf(")")));
          } catch (e) {
            console.error("Could not process Church Micro stats data. " + e);
          }
          if (jsontext && jsontext.cmstats && jsontext.cmstats.length > 0) {
            displayStats(jsontext.cmstats, currentPage, brand);
          } else {
            if (jsontext.error) {
              console.error("Received error message from Church Micro stats server: " + jsontext.error);
            } else {
              console.warn("Received empty packet of Church Micro stats.");
            }
          }
        } else {
          console.warn("No response received for Church Micro stats.");
        }
      },
      ontimeout: function () {
        console.error("Church Micro Stats: timed out retrieving statistics.");
      },
      timeOut: 60000
    });
  } else {
    // Fall back to JSONP
    jsonp.src = statsUri;
    jsonp.type = "text/javascript";
    jsonp.id = "cms-jsonp";
    document.documentElement.firstChild.appendChild(jsonp);
    handler.text = "function handleCMstats(jsonp) { " +
      'var churchImage = "' + churchImage + '", userName = "' + userName + '";\n' +
      displayStats.toString() +
      "if (jsonp.cmstats && jsonp.cmstats.length > 0) { displayStats(jsonp.cmstats, '" + currentPage + "', '" + brand + "'); } else { console.error('Could not process Church Micro stats data.');}}";
    handler.type = "text/javascript";
    document.documentElement.firstChild.appendChild(handler);
    document.documentElement.firstChild.removeChild(handler);
  }
}());