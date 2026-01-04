// ==UserScript==
// @name         Rapidgator Auto Converter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 Rapidgator 页面自动显示链接转换工具
// @match        https://rapidgator.net/file/*
// @match        https://*.rapidgator.net/file/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/556961/Rapidgator%20Auto%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/556961/Rapidgator%20Auto%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        SERVER_URL: 'http://blimjoe.top:8000', 
        DEFAULT_KEY: '', // 默认 key，用户可以修改
        POSITION: 'top-right', // 面板位置: top-left, top-right, bottom-left, bottom-right
        CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
        XIANYU_URL: 'https://m.tb.cn/h.7gn2JIf?tk=wXq2fzuR1MH', // 闲鱼购买链接
        XIANYU_LOGO: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAQABJREFUeAHt3Qe8HFW9wPH/7t5e0xMktBA6AipKE4IxlCcIIpjQHh1BRBR9oIA8BJSi9AcoXZDei/Qa6UUggUBCSSgB0svtdfeds/GS5Wbv3t3ZmbNn5vzm87m5N7s7c875/s/O/KediaU+b0wJEwIIIIAAAgg4JRB3qrU0FgEEEEAAAQTSAiQAdAQEEEAAAQQcFCABcDDoNBkBBBBAAAESAPoAAggggAACDgqQADgYdJqMAAIIIIAACQB9AAEEEEAAAQcFSAAcDDpNRgABBBBAgASAPoAAAggggICDAiQADgadJiOAAAIIIEACQB9AAAEEEEDAQQESAAeDTpMRQAABBBAgAaAPIIAAAggg4KAACYCDQafJCCCAAAIIkADQBxBAAAEEEHBQgATAwaDTZAQQQAABBEgA6AMIIIAAAgg4KEAC4GDQaTICCCCAAAIkAPQBBBBAAAEEHBQgAXAw6DQZAQQQQAABEgD6AAIIIIAAAg4KkAA4GHSajAACCCCAAAkAfQABBBBAAAEHBUgAHAw6TUYAAQQQQIAEgD6AAAIIIICAgwIkAA4GnSYjgAACCCBAAkAfQAABBBBAwEEBEgAHg06TEUAAAQQQIAGgDyCAAAIIIOCgAAmAg0GnyQgggAACCJAA0AcQQAABBBBwUIAEwMGg02QEEEAAAQRIAOgDCCCAAAIIOChAAuBg0GkyAggggAACJAD0AQQQQAABBBwUIAFwMOg0GQEEEEAAARIA+gACCCCAAAIOCpAAOBh0mowAAggggAAJAH0AAQQQQAABBwVIABwMOk1GAAEEEECABIA+gAACCCCAgIMCJAAOBp0mI4AAAgggQAJAH0AAAQQQQMBBARIAB4NOkxFAAAEEECABoA8ggAACCCDgoAAJgINBp8kIIIAAAgiQANAHEEAAAQQQcFCABMDBoNNkBBBAAAEESADoAwgggAACCDgoQALgYNBpMgIIIIAAAiQA9AEEEEAAAQQcFCABcDDoNBkBBBBAAAESAPoAAggggAACDgqQADgYdJqMAAIIIIAACQB9AAEEEEAAAQcFSAAcDDpNRgABBBBAgASAPoAAAggggICDAiQADgadJiOAAAIIIEACQB9AAAEEEEDAQQESAAeDTpMRQAABBBAgAaAPIIAAAggg4KAACYCDQafJCCCAAAIIkADQBxBAAAEEEHBQgATAwaDTZAQQQAABBEgA6AMIIIAAAgg4KEAC4GDQaTICCCCAAAIkAPQBBBBAAAEEHBQgAXAw6DQZAQQQQAABEgD6AAIIIIAAAg4KkAA4GHSajAACCCCAAAkAfQABBBBAAAEHBUgAHAw6TUYAAQQQQIAEgD6AAAIIIICAgwIkAA4GnSYjgAACCCBAAkAfQAABBBBAwEEBEgAHg06TEUAAAQQQIAGgDyCAAAIIIOCgAAmAg0GnyQgggAACCJAA0AcQQAABBBBwUIAEwMGg02QEEEAAAQRIAOgDCCCAAAIIOChAAuBg0GkyAggggAACJAD0AQQQQAABBBwUIAFwMOg0GQEEEEAAARIA+gACCCCAAAIOCpAAOBh0mowAAggggAAJAH0AAQQQQAABBwVIABwMOk1GAAEEEECABIA+gAACCCCAgIMCJAAOBp0mI4AAAgggQAJAH0AAAQQQQMBBARIAB4NOkxFAAAEEECABoA8ggAACCCDgoAAJgINBp8kIIIAAAgiQANAHEEAAAQQQcFCABMDBoNNkBBBAAAEESADoAwgggAACCDgoQALgYNBpMgIIIIAAAiQA9AEEEEAAAQQcFCABcDDoNBkBBBBAAAESAPoAAggggAACDgqQADgYdJqMAAIIIIAACQB9AAEEEEAAAQcFSAAcDDpNRgABBBBAgASAPoAAAggggICDAiQADgadJiOAAAIIIEACQB9AAAEEEEDAQQESAAeDTpMRQAABBBAgAaAPIIAAAggg4KAACYCDQafJCCCAAAIIkADQBxBAAAEEEHBQgATAwaDTZAQQQAABBEgA6AMIIIAAAgg4KEAC4GDQaTICCCCAAAIkAPQBBBBAAAEEHBQgAXAw6DQZAQQQQAABEgD6AAIIIIAAAg4KkAA4GHSajAACCCCAAAkAfQABBBBAAAEHBUgAHAw6TUYAAQQQQIAEgD6AAAIIIICAgwIkAA4GnSYjgAACCCBAAkAfQAABBBBAwEEBEgAHg06TEUAAAQQQIAGgDyCAAAIIIOCgAAmAg0GnyQgggAACCJAA0AcQQAABBBBwUIAEwMGg02QEEEAAAQRIAOgDCCCAAAIIOChAAuBg0GkyAggggAACJAD0AQQQQAABBBwUIAFwMOg0GQEEEEAAARIA+gACCCCAAAIOCpAAOBh0mowAAggggAAJAH0AAQQQQAABBwVIABwMOk1GAAEEEECABIA+gAACCCCAgIMCJAAOBp0mI4AAAgggQAJAH0AAAQQQQMBBARIAB4NOkxFAAAEEECABoA8ggAACCCDgoAAJgINBp8kIIIAAAgiQANAHEEAAAQQQcFCABMDBoNNkBBBAAAEESADoAwgggAACCDgoQALgYNBpMgIIIIAAAiQA9AEEEEAAAQQcFCABcDDoNBkBBBBAAAESAPoAAggggAACDgqQADgYdJqMAAIIIIAACQB9AAEEEEAAAQcFSAAcDDpNRgABBBBAgASAPoAAAggggICDAiQADgadJiOAAAIIIFAGQWkFmlvi8vQLZfL0i5Uy+5O4LFwcl6XL4zKkISljRqZk7TV6ZeK2nbLjNt1SX5cqbWUpHQEEEEAgMgKx1OeNTm1VljfF1Ma2Qp58rkI+/FhtcJckpLUtJiOH9cqYUSnZcrMe2XmHTtl8455Ag7xgUVwuvrZa7nqoSrrzKKpcpWp7/6BDfnV4u4wcngy0btrj2Vcq5Knny5VRQhYsjskylZQkB+kpqUHeH7zSscE/kuMTxZbv5/xJFaLampQMVV+voY1JGTYkpX6S8vUNe2TbLbtl3bV6c7QkWm/N+jAhcz4tk0VLYiq5jUkqVVyco6VTWGsqK4r+khVWYIQ+HVPdTn8PR43olXFrJmXsau58BwcKozMJgN7wX3Z9tdx4T7V0dg3EsfL19dfpld8e05re8175qj9/XX1LtVx4dbV0dBa+IqyuSqWTgCP2a/enMhlL0Ucj/nZjlVx/Z5W0dxRet4xF8ecgAiOHJWWbb3XLbhO7ZNL2eXTIQZZn29sffZqQq2+tTieR81Wyy4SAbQIbjOuVXSZ0yUF7t8tQlRi4ODmRADzzYrkcf3qdNKkNXKHTpO92yQX/25Lemyt03v6f7+qKyW/PrpX7H6/s/1bB/99z504553etUuHTHsHUl8rl12fUyzKVKDGZFdhk/R457tD2SCQCTc1xOfPiGrnvsUrpDfZAldkgUVpkBeprU3LUAe3yU/WTSES2mVkbFvkE4Lrbq+Ws/6sZ9PB1Vp3/vKgzxav/3CRfG+N9jaYPCR9+QoP86+XyXEUV9N4OW3XLNX9pknjhec1XytFHJM69vDijryyQ/3gS0InAuSe1ykbr5XFOyFMJwc701syEHPv7epk7z7G1aLCsLN2QwDbf7JZLz2yWIQ6dFS9y02EoMh6LuffRSvnjJcVv2GbNTqQ33m3t3veOz7q01teNvybRycTZl9Z41Fkx250PVsnZlxVvVFQlmDktMOO9MplyTEP6+pSwkcyYVSYH/KKRjX/YAkd9vxR48fVy2fuoIbJ0mff1/JcLC8kfkU0A9Arp5HPrfAvDe3MScsIfvS1PH16/7vYq3+qSuaBr1REOvXwv05szyuT3f6n1MivzBCTQqpLMo0+ql2vU+fOwTF/Mj6sEuV503ZkQCLPAR3Pjcswp9dITzoNwBdNHNgE4Q52HzOdiv0LEHplaIc8WeAhfX1l+7uXBbmT14XsvV7CffmFtXncgFGLEZ4sX0HdbnKWO7OhTM2GY9FG2hUsiuyoJQwioo48Cr0wrl0v/XtyRVR+rE+iiIvmtfer5Cnlture94sG0/3JFYR3jgccrRJ9CCHKaNbtMdDmFTA8+WSHTZzIMRCFmpj97nupr+ry6zdNramX5yNTiL2q1uY3UzT2Ba26tSo/JEvWWRzIBuP2fwa2Q9HnaQlbK/3wyuLpkds5Cy7lTjT/AZLeAHh/iV39oSI9TYWtNb7rXTP+2tf3UK5oCbeo2aJ0ERH2KXALQoQL37CvB7P33dYYnn8tvpafvpX/u1WDr0len518rF932fKbmlpi8pC54YbJfQJ+T1IfYbZy6u0WNYlnYkScb20GdEMgm8Mgz0e/bkUsA9GFtLwPsZOsAA7324uv5HTp/W12I2Knu/Tcx6Tbne0j/rZnl0qVW3kzhELj74SqZt8C+r+o775dJc6uZ/h2OSFHLKAl8+kVC3lcXf0d5sm+tUqT2vAXBr5AWLMqvU5ioSybX/IX5tf0LA0aZ9eLv4gR61IilN91r3+HIeQvz+x4U13rmRqB0ArM/iXYfj1wCMD/PjXMxXUqPjZ/PZKIumfXQzzXIZ1qYZ/3zWRafMSNw6/1VokeStGnKN+G0qc7UBYFCBPTD2aI8Ra51HZ3Bh6szzzH8ix2hr9CW5HsrYK2dp5QLba5Tn1+iBie5v8A7PYIG6uq2KyEJur0s3z0B/fCqKE+RSwBsCpZ+wqDJabR6ylU+06gRbj74Ih8bmz/z9At2XbiZb8Jpsyl1Q8BlARKAAKM/eqTZDe2YPMtbZw1HhrkKMLalWPSb75AAlMKdMt0V0I8QjvJEAhBgdDdTz36vqjSTBOhyNt0gvw37+urhRmPH5He0IEAeFl2gwLyFcSvvBiiwGXwcAQQsESABCDAQVVUp2W5LM/fbfffb3aLLy3faeYfoPYM+37aH+XM2HQXgFECYexJ1z0eAIwD5KPGZAQV+OMnAVYmq9N2/X1g5R+zXYezoxIA4vFGwwBtv53enR8EL9jBDigzAgxqzhEmABCBM0bKwrrtP6pINxuV3aN5r9fXydTmFTKNHJuXQyR2FzMJnLRCY+4VNB+0ifoLUgnhThdIKRL2H27Q2KW2kAypdZ5C/PaYtoKWvWOzvft4mXjLV4w5tk29sEmxyEmjDHVx4c6s9X1kOADjYAR1rspf1apiI7FmbhEmtwLpO2LpbDpvcXuBc+X1cL3eHrbxdZ1Chhrr+29nNsvpoLgjMT7v0n2pq4Stb+ihQA3cE8r+uKowmrE0MRe2kY9s8b6gHquIEteHXyy1mGjEsKfdc3STf3JQjAcU4mpq3qdmeg5LRXjWaiijlIFA6ARIAQ/Z6VMAr1N72HjsVdrHeQNXbc+fO9N67H6MNDh+alJsuWS4/P6hdqgu4k2CguvF6cAJN6kmOtkycArAlEtQjKIFYxM8BkAAE1XOyLLeiIiUXntYiv1PXBHjd0Or5TlZ7/Rf8b4vo5fk16dMBv/5pmzx16zI5Yt92WWM1Tgv4ZevnclosevoeCYCfkWVZNgpEfPsv+T3X1sbIhLhOR+7fLnoP/qJrqkU/6rU7j6Pv5SpS++zWKfrCvVEjkoG1Xi9bn1bQP/pRmLM/KRP90Jely1fmiqt+KVYmIpnvZf6tK9z3/77fmY3I3K/96vsrl933+WxZed88fb/7Pqt/5/ta5jzZ/u5RcZqrHhH6wUfx9KOXg37sdLY69FqUlyWD64arNH2dNXpl62/2yJCGFYV+NflY2Xsyb03M/Eyhf2d2msHmHex93ZjMz6ge+WX7Ml/P7Ol97fjK+xkfyHy9b3mZrxX8939qlDlf33Iz69/3ft/vr763soIr31/R1pXvrLTo+8xgv3U99Gf0j36M+cwPy9T6aKXhl5gB/JFt3RFAMSVbJAlAiej1hvas37bKSeoKfj3G+1MvVMpHcxPpje2yprgMbUyqDX1K9LC9E7ftkh236ZH6OoNrXOWy3jq96Z8SEVld7Hw1Kt8FV9XIXQ9VSubKzepKh7Ryk77bJZf/qVkS9gyBEFLJaFRbP4ztoOPr5bXpwQ+NTQIQjT5jbSvq61Kyx85d6R9rK0nFVhHQ4yice3KLbDS+R868pHaV9114wdTK8dhD2tn4u9Ch8mxjpRr2/Gf/3S6HnxB8ApBnlUL7sZXHdUPbBCqOQOkEDlGDKf33j90cUGlIg5ljH2uPtei8R+m6GiVnCKzxNTNHQ2uqzZST0TSjf5IAGOWmsCgK/PrIdmmsN7MxtMnPxGOl9UWv+igZEwKZAqOGm+kT+T5hNbNuYfqbBCBM0aKuVgo01Cdlvz39ub3TygYOUCkTj5XWF/8xIdBfQF8PVV8bfBKw+hiOAPS35/8IINBPYLeJ7iUA+rHSQd8uOum73ka57Bce/htBge2/E2zfGDU8KRusm8ctWiG25QhAiINH1e0R2Hj9HidPA+wyobCHUBUasV13DHb5hdaHz9sjsNP2wSbdO20f/b5HAmBPf6YmIRfQdwS4NunHSnsd1Gowq+9vp56kGfE9sMEMeH9gAZ0cjh0TzCmiMnXL6cE/if7FvSQAA/cv3kGgIIHVRkX7fGE2jJHqMOnhU/xfUeoVcNBP0czWHl4Lj4AevfSEo4t7FspArd1vzw5Zd61gkouByizF6wwEVAr1kJe5vCkm094tkwWL4rJoSUxdpS2iz5fpL8w4B740A4WvvDz4i5IGKruUrx97SJu89EaZrwOz/P64VidWwKWMWxTK3n1SlzzxXJc88ITKBnyaxqt12G/UsOguTCQALkTZhzbqYV/veqhK7nmkIr2i7x1gZ3ftsUnZZUKnHKruj9d7h0zRFyhX47H89axm2eeoIfLxZ8UfVDxobzW2gvphQiAfgT+rAbk+m9cgr79d/OZsxNCUXHNeszO3nhb/bc0nQnwm1ALPvFguuxw4RH53Tq28/Ga5DLTx1438aG5crripWr43ZYhccGWNdHWZGbM71MARqPywISm564pl8p3NvV+ZHVdd5YSj2uS041sjIEITTAnoh6LdcFGT7DaxuIv29DU8d16xXMY69CA0EgBTvTSk5VxybbUccUKDeihQYQOxt3fE5LIbqmXKMQ3q+QZudDNTQ+Pa2pWGqiTgHxc3yfFHtEldTWGnQzZQtxRef2GzHK2GeGVCoFABfSHqJWc0yxm/aRW9F1/IVKnOHugjlnf+rUnW+Fr0z/tn2hR/zCRzafwdKYFT/lwrt95fVVSbps8sk72ObJQ71Jdr9YCu2C2qgszsq0CZWqPosfv1RVR/v6NaHp1aIR9+nD15rFCnDr6zRbf8+L86ZY+dOjMfwOdrnViYOwIH7NUhe+3aKTfeXSUPPV0pb89MDPiwLn0Hwc4TuuWwye2y2mg3T1eSALjz3SiopdfeVl30xr+vwPnqYsEjT6xXScByqS1wz7BvGfwOl8BwtRemL6TSPx+r00L6CNKCRQlpbY+pPbRk+vqQr2/YI3UGRnMLlxy1LVagpjolPz2gPf2jL1Se8V5CFi5OyJJl+oLllIwYlpTxa/dykamCJgEotrdFcP5ZHybknMtqfG3ZrNkJOfPiWjnnpBZfl2vTwlw/BTBQLNZSF4bqHxHv1wcMtGxeRyCXgH7suv6h72VXcuPkbPa28+oAAudeXpvzQr8BZhv05bseqpSZH5BzDgrFBxBAAAEDAiQABpDDVMRb6pzZ1JeDec52Ul2bc8l11WHiKKiuMQ4BFOTFhxFAoLQCJACl9beu9EeeqQy0TvqWwjZ1HpgJAQQQQKC0AiQApfW3rvQnn/NvRK1sjetU4wI8+0qwZWQrl9cQQAABBL4qQALwVQ/n//fR3Oy3bPkJ8/6caHY7jmv42UtYFgIIBC0QzTVx0GoRXf7ipXHpNvBAO307GBMCCCCAQGkFSABK629V6UuXm9mHXbLMqmZTGQQQQMBJAe7JcjLspW10KmUm0TDdSm4CyC7++fyE6NM+fYOxJPXtIEyeBLq69Xcnmt8fTyAFzBSLpUQ/s4Inl65EIwFYacFfCCDgk0BTc1yuv7NSHnmmQmZ+yGrGJ1YW46PAOmuseHLpYVPaRY9c6eLEN9PFqNPmgATcXIlkYqYUwTW3Vsvl6kFQy5vZU8204W+7BOZ8Gpe/3Vgt/7irKj1s8NEHtot+loVLE9cAuBTtQdrKIexBgHg7p0BzSyz95Miz1TDSbPxzUvGmRQL6+RQXXl0jBx/fIMsMXQdlS/NJAGyJBPVAIMQCLa0x9ejnRnnmpWBGkQwxDVUPicBLb5TLPkcPcSoJIAEISec0UU0O2Ban7OoRlKR61sovT6sX/cAnJgTCLKBPC/z89/XS2xvmVuRfdxKA/K34JAIIZBHQj45mzz8LDC+FUkAfCdDXsLgwkQC4EOU82+jqHmyePHwsi4C+2t+VlWWW5vNSRAWuurlaFi+N/jFREoCIdmCaZV7AxQTq73dUcsGf+a5GiQEL6AsD9ZGtqE8kAFGPcAHtc3EDVgAPH80ioO/zZ0IgigKPTg32yag2mJEA2BAF6hAJAdcSqLlfJNSFf47dOB2Jnkoj8hHQFwTO+STaF7by7c2nJxj6THe3yHz1oBz9Ww+o0n/KZwOT+zNZFqoK6Zvns3lm8sG2jph8PNdMWf0N9f8TiZiMHtEr5dyxlo0n79c++Kh0Mcy7knwQgSIE3p+TkHXWjO4tASQARXSOYmdtbYvJk8+Vy6NTK+S16eXqopO4ZN9EF1uSXfP/6+Vymbjv0JJWKq6u7xk9MilbbNwtu0/qlu9t0yWVlS7o+8c+f2G09478k2JJYRVYuCTaSS4JQAl6Zo965O7N91bJJdfViKkn8JWgmVYXqZ9H88WCuPqplIefqZQRaizw449skyk/7PjyiEihDeg7klLofGH9/JJl0b9KOqyxod7+CES9j0c7vfGnD/i6lC/mx2WvIxvl9Itq2fj7KlvcwhapW35O+XOt7HNUoyyKeNZfnNTKuXmo30oL/oqmQLZTsVFqKQmAwWjOmFWW3vi/8z4HXgyyF1TUm+/oGDXIBx9xeLsgOD6MAAKhEyABMBSyhYvjcsSJ9RL1c0qGOAMtRj+//rDf1Bc8JnjU9xb6o7vW3v7t5/8IhF2ABMBABPWK8phT6mWBSgKYwiHwmUoCjlPj2xcyubZBdK29hfQFPotAGATYIhmI0n2PVcrrb3PY3wC1r0U8/5q+QyP/wUDYIPrKz8IQQCBgARKAgIH1Ff8XXR39ISUDZizZ4s+/sjrrmAzZKkQCkE2F1xBAwFYBEoCAI/PqtHL5VI2YxhROgQ8/Tsi/p3P0JpzRo9YIIJBLgAQgl44P7z31AmOl+8BY0kXkH0Puiy9poCgcAQQKEiABKIir8A+/No29x8LV7JpDH8XJZ+IUQD5KfAYBBGwRIAEIOBKL1PC+TOEWmL8wvz17BhIOd5ypPQKuCbB7GnDE9fj+TOEWyDeJS3EIINBAb75Rjxw2pV023aBHhpf2URJFt7O5RWT7fYJvxOqje+XB65uKrm+pF7Bkmcj0d8vk2tuqZfpMNlt+xQNJvyQHWE5tTUo6u/LbgxxgEbxcYoGaPG/iYPsfXKAO3qdDfn9cq8Qjkk/HDD04QnvV1yWDC4yhJdfXiaw1tkt+MLFLzry4Vv5xd5WhkqNdTES+TvYGabVR0X2UpL3q/tZs1HBi6K9oYUvbZP0eOfnY6Gz8C2s9n84USKgbqnQiuOG66v5qpqIFSACKJsy9gHXXCn/2nbuF0X93nTXySwA4AhBMX9hvzw4p41hlMLghXKruC/v/qCOENbevyiQAAcdk0nc7Ay6BxQctMGn77ryKIAHIi6ngD319w/wSsIIXzAyhFdh0A/qEH8EjAfBDMccydtymW6oquT48B5HVb1WoOwAnbtuVZx251iNPqII+1ljP96cgMAc+3FBHn/AjzCQAfijmWIa+CPCwKRyuykFk9VsH7NUhjQ35rWw4AhBMKA1dLxdM5VlqIAJ81/xhJQHwxzHnUo46oF1GDM1vI5JzQbxpVKBBXT197MFtRsuksFUFSABWNcn3FTaU+Uq5+TkSAANxr6tNyUV/aJYyHglgQNufIuLqaP75p7bKkMb8EzdWtv7Y918KCUB/Ef6f/7cSq1wCJAC5dHx8b5tvdcsZv2kVzhL7iBrgok7+RZtM3C7fc/8rKkICEFBAgA0INryLNdUlop58kgAY/A5M2aNDLv9Ts9RWk78aZC+oqMqKlFzwvy1y6OT2gubTHza1Uiq4YiGfIeor4ZCHpyTV57vmDzsJgD+OeS9l5wldcvdVy2WHrfK7tSzvBfPBogW22qJb7rqiSfbc2dutm6yUig5B1gWQAGRlcfpFvmv+hJ/hNfxxLGgp49fulevOb5KXXi+X2x6okmdeLJOmFnKxghB9+nC9uj5j++90y+TdO2R7kjKfVFkMAsEKkAD440sC4I+jp6Vs/c1u0T89alTLdz9IyLwFCVmwOC4dnaW5UmDh4phcdUueA997avGKmTYa3yP77tG5yiHz/l/qzP9n/q2X0v//6SX321Xs/5m+/+txGUYMS8qYkUnZeL0eKc/vab8rKp/jX07s5MAp4q1+YS1iScyKAAKZAiQAmRol+lsPbalHOyv1iGfvzU4YSQDWWj0pB/44emMj9CUYJepGkS2WBMB7aKPbJ0uzk+Q9EnbOyXFnO+NCrUIpwEopiLCRAAShGu5lRjexMRsXEgCz3pQWYQFWSsEElwQgGNcwL5Xvmj/R4xSAP44sBYHs1yXgUrTAv14ul6iN/d5u6AxYR2dcnni2ougY2LaAT79gVDU/YkIC4Iciy0AAgcAETvhTXWDLjvqCFy+LyVEn1Ue9mbTPowCnADzCMRsC/QU4LNlfhP8jgIDNAiQANkeHuoVKgAQgVOGisgg4L0AC4HwXAMAvgRQZgF+ULAcBBAwIkAAYQKYINwTY/rsRZ1qJQFQESACiEknagQACCCCAQAECJAAFYPFRBHILMBBQbh/eRQABmwRIAGyKBnUJtQDPAgh1+Kg8As4JkAA4F3IaHJQA1wAEJctyEUAgCAESgCBUWaaTAiQAToadRiMQWgESgNCGjoojgAACCCDgXYAEwLsdcyLwFQGOAHyFg/8ggIDlAiQAlgeI6oVHgAQgPLGipgggIMLDgCzrBR9+nEg/vev518rl8/kJWbAoJvpxqKNHJmXsmKRM2LpLdt6hS1YbnbSs5qWvzrvvl8njz5bLi/8ul3kLld3imFSUp2TMyJSsNbZXJm7bLZO275RhQ4K5Xp8EoPR9gBoggED+AiQA+VsF+sm3ZpbJn/9aIy+ojVe2qUUlBjo5mKoejXrmxbWy+6QuOeHoNll9TG+2jzv12itvlsu5l9fIm++s2p07OmPS1CLy3pyESg4q5NTzamXKDzvll4e3yfCh/iZRriUArrXXqS8VjXVCgFMAJQ5zT4/IaefXyo+OaBxw49+/inr/9YEnKmSn/YfIzfdW9n/bmf93dcXkf86sk/2Obci68c8G0aPypZuU2cQpQ+Thp/22YyCgbOa8hgACdgqQAJQwLsubYnLgLxvkxnuqPNWis0vUHm2dnPV/NZ7mD/NMi5fGZcoxDXLPo9424i1tMfnFqXXy1xuqfWNgj9g3ShaEAAIGBEgADCBnK6K7W+Sok+rl1WnZD/lnm2eg1665rVquuNG/DdlA5djyut7zP/LEepmuTpsUM+kjKeddWSO33u8tASumbOZFAAEESi1AAlCiCJx2Qa0vG/++6p93RU364re+/0f590nn1Mq0d4vb+Gf6nH5hrbw5w7/lZS6bvxFAAAFbBUgAShCZN94uk9se8HevM6l2Z/XFgVE/DK2PmNz7mLfD/gOFuksdjdFJQLGTvluDCQEEEAiLAAlACSJ11qXFb2yyVXvW7IT8U10cGOUpqOsd9OmER6dG2y7K/YK2IYBA4QIkAIWbFTXHe2oj/bo6AhDUdMeD/h5ZCKqeXpY784Oyos/75yr3dp+PyuQqi/cQQACBUguQABiOQNB7mfoQeVt7NI9FP/avYPfQX3y9TNo7omlnuJtTHAIIhEAguF3REDS+FFXUo9QFOenz2W/OKJdtt1T3CEZsekltoIOcOtXdBfr6jG23VIhM1ghc85cmSeTYVRns2ovB3x8s6cs9cuTgy89OecBxDdnf8PHVEWqwq0vOUCNhRWyari4CPkcN/sVUnECwa9Ti6hbJufUQtUFP8xYOtkILugbBLP+LBcHbzV+UY0sTTLNY6iACE7buTg+HPcjHeDuLQGVFSrb6RvQSWn0bNVPxAqztijcsaAkmNs6LlkQzrPPVcxGCnhYuLsYu955i0HWP6vIH28OOartp18ACUb/baeCW+/tOMWs7f2viyNL0Yeagp47OoEsozfKxK407pfovwAasOFNS7eL8+uYmAeiT4DcCCCBgSIAEoDhoU35RP/pEAlBcP2RuBBBAoGABUxuwgisWkhnw8ydQJAD+OLIUBBAIQCD4E2YBVDqPRbIBywMpx0fwy4FTwFskAAVg8VEEcglE/XBhrrYH9R6mQcmGfblRTQ3NxoUEwKy3kdJYaXpnxs67XRBzRjUe7MEW11vwK86vb24SgD4JfiOAgHUCJADWhYQKRUiABCBCwaQpCERNIKoJgAiHsIvpqxwBKEZv5bwkACst+AsBBCwTiGoCwAasuI6GX3F+fXOTAPRJ8BuBIgWiurEqkoXZswiwAcuCUsBL+BWAleOjJAA5cHgLAQRKK6DHfI/iExoZya64frW8mVMoxQmumJsEwA9FloEAAoEI6A3ljFnBPwQqkMrnWCh7sDlw8njrrZk8xy4PpkE/QgIwKBEfQACBUgrccFd1KYsPpGwSAO+si5fG5OGnK70vgDm/FCAB+JLCzB8mDlxxLtpMLCnFjMCDT1XIjXdXmSmMUqwWaGuPyYl/qpfFy0ysSa2m8KVyHEfxhZGFIIBAkAKnXVArz71aLvv8oFM2Wb9H6mqDLC34ZTe3BF+GLiGlbjdsbgn/ft7n82My7Z1yuez6Kpk7L3qnhMz0hlVLIQFY1YRXEPAkwJEXT2x5z/T4sxWif5jyF/h8fly22HVo/jPwSacEwp8aOhUuGosAAggggIA/AiQA/jiyFAQQQAABBEIlQAIQqnBRWQQQQAABBPwRIAHwx5GlIIAAAgggECoBEoBQhYvK2izARYA2R4e6IYBAfwESgP4iEfg/GyLvQcTOux1zIoBAuARIAMIVL2qLAAIIIICALwIkAL4wshAEEEAAAQTCJUACEK54UVsEEEAAAQR8ESAB8IWRhSAgwvUD9AIEEAiTAAlAmKJFXRFAAAEEEPBJgATAJ0gWg4BrAgmeyeJayJ1rbyLiW8iIN8+5/kqDETAmMHxoylhZFIRAKQRGDIt2HycBMNyrTJwnNlGGYTaKs1Bg9IikhbWiSgj4JzBmZK9/C7NwSSQAFgaFKiEQBoHNNuqReCwMNaWOCBQuoA//b7JBT+EzhmgOEoAQBYuq2i3g2pGX4UOT8p0tuu0OCrVDwKPAtlt2y7AhnALwyMdsCCAQdYGD9umIehNpn6MCB+0d/b7NEQBHOzfNRsAPgV0mdMnEbbv8WBTLQMAagV11v94u+v2aBMCaLkdFEAinwDkntch6a0f7YqlwRoZaexHYYFyP/PGEFi+zhm4eEoDQhYwKI2CXgL4d8Kb/a5JNI37BlF3q1CYIgS027pGbVV8eGvFz/312JAB9EvxGoEgBly+I1xcE3n3lcvmfn7ZJVWW0L5wqspswu4UCNVUpOfnYNrnjb8tlSKM7/bfMwlhQpSIFXN4QFUnHeP5FAOqRAX92ULvs/6MOufuRKrnnkQp59/0ySbqzPi1Cj1lNC5Srrd8m6/fIXrt2yp47d0p9nXsdlQTAdK+jPAQiLtDYkJJDJ7enf1rbYjL93TKZtzAuy5ri0pw+tUqK6q0LpKSi3L2NlDerVeeKqft062qT0lifktVGJdUpq16pdPxoFQnAqv2EVxBAwCeB2pqUbPMtxgrwiZPFIOCrANcA+MrJwhBAAAEEEAiHAAlAOOJELUMhwOHZUISJSiKAQFqABICOgAACCCCAgIMCJAAOBp0mI4AAAgggQAJAH0AAAQQQQMBBARIAw0E38cQ4E2UYZqM4BBBAAAGfBUgAfAZlcQgggAACCIRBgAQgDFGijqEQ4MhLKMJEJRFA4D8CJAB0BQQQQAABBBwUIAFwMOg0GQEEEEAAAYYCpg8ggEAkBLrViMPzFyVk3oKY+h1P//3F/JgsXhaXltaYeg5BTFrUswn079b2uHR3pySZjElvUiSVUr97VzDo8fYrK0UqK1LqyYZ9v1MyRD3joLEhmf6t/x6i/h6qnhw3akRSxozsVT/q8+qpckz2CXw+Ly7PvVohr7xZJh9+nJCOzph094isPiYp49bslW3VcNU7btMl5eX21T3IGpEABKnLshFAwHeBHrXinvVhmbw3JyEffJRIr9D1708+S6Q35vkXmP2hRD29MWnr0EvJ/n6u5TfU6WQgJWPUw2bGqo3Lmqv3ylr6Z+yKv6tJEHLx+f7eO++VyZU3V8tDT1Vk7RtzPk2oxKBcbrirKv2QoH336JCfH9wu+hkWLkwkAC5EmTYaEdBPG2PyX2CB2pv/91vl8sbbCZn2brm8NTMhnV12Wje1xKVJPfFQJyfZplHDkyoZ6JXxaydl/XV6ZL11emX9cb0yfKg6DMHkm4B+DPVF11TLE89V5L3M5c0xueKmarn74Uo5839aZacduvKeN6wfJAEIa+Ry1tuN7DUngcc32YZ7hPNxti61cX91WplMfak8fdh21uzsG1MfizS2qAWL46J/Xp2mi1TnF/4z6VMJ663dk04GNlm/N/2c+vXH9Th3SLrPw+vv91RfuVht+B+dWile14ILl8TlmFPq5ZRftMohk9OHgrxWx/r5SACsDxEVRCD6Am3tMXnyuXJ58KlKefaV8vQ52ui3emULly6PySvTytM/fa+Wq7WzTgI2Wb8n/ex6/Xuj8TzDvs8n8/dsdV7/4mtr5MEnKzxv+DOXl1TZw5mX1IreITj4J9FNAkgAMqPO3wggYExAn8t/8vkK+ecTlfLUC+5t9AeD1hepzVDnsPXP7f9c8emEum9rvDpSsNlGvSop0IlBj2y8Xq9UqAsWXZu61BH6p1+skHsfrZQnnq0QvdH2ezr7slr5xqbaWwUjghMJQASDSpMQsFng8/kJueW+Srn9gUpZtJQ7kQuJlb5jYdbssvTPHQ+uOIVQps6QrKeuJ/j6hit/Nly3N7KnD15+o1zue6xCHn66Ql1vEWz/0UnYb86sk8duWpY+GlBIrMLwWRKAMESJOoZCgOsHcofpeXW19d/vqJJn1F5bEHtruUuP7rs96vbFdz8oS//0HSnQpw/GrdkjG6pTBjoZ2HC8+lv91rcshm3SR4r0UZBHp1bI/Y9XyhcLgt3o9/eZ/UkifU3Brjt29n8r9P8nAQh9CGkAAnYLPP6vCrn8hmqZPpPVjalI6T3XviMF92UUqscvGL92r6yzRo9KEJKy7lq96fvg1/har5RZEh5918cbM1bc9aF/23DXx1U3VwkJQEZH4k8EEEAgl8ADj+sNf82At8Tlmpf3ghFY1hST16aXpX8yS4iri9302AWrj+lNj1+gB8gZu1pSRg7vlRHDUjJyWDJ9q6JfScLipWqwpoWJ/wzYpAZtWhhPj+fwxoyE6FNEtk3T3imTpua4NNSH7whKLktLcr5cVeQ9BBAIk8BLr5fL2ZfVyNuzWL2EJW76lMzn8+PpnxW3KK5acz3yQqMeDbE+JXW1SalTg+XU1a740e+tOK0TU6Mrqr/TP/qqPPV/9UuPsrisKZ4epXHhkoR0qVEbwzTplryuxqHYcRsSgDDFzbq6mjhPzIA01oXdiQrp0fjOvbxGXdGf/+ArTsBEpJF6I6iPIOgfEbPn4W0gnPNpmUoAQpa5DAJHij4IEG8jgMDgAlffUi1/+VuN6AvSmBCIokBnp06BojWRAEQrnrSmhAImju6UsHlZi9YP2TnxrLr0FdpZP8CLCEREQD8wKmoTCUDUIkp7EDAkoM/zHn1SvbyozvkzIRB1AX3HRNQm907kRC2CtAeBEgmcoy70Y+NfInyKNS6w6YYkAMbRKRABBOwTeOG1Crnmtmr7KkaNEAhAYMzIpHxtNAlAALQsEgEEwibw139Uha3K1BcBzwIH7R3NBwJxCsBzl2BGBL4q4MpFgDPU/f0v/Jvz/l+NPv+LqoAe72D/H5EARDW+kWuXKxuiIAIXvet8/Vd6SD2EhQkBVwR+dXib1NdF7xZAHT+OALjSi2knAj4J6AezMCHggsAeO3XJoVOiufev40cC4EIvpo0I+CjwDgmAj5osylaBLTfrkbN/22Jr9XypV+QSABOHv4spI25A3Gv9TNRtRa/1djjNxOF5r3a6XbGYt3YV8k0upn6FlJPrsyuGgs31Cd5DINwCh/ykQ266ZLlUVQX/nS6lVOSO5Q1tDD5gw4Z4fyDE0MZk+glYQQZdl+FlMmGn6zV8qJfaiQwbkpLFy4JNA4ox0PULeho+1Fts/axXRUVK2juCjYOf9WVZCOQrsJp6IuKpv2yTXSZ05jtLqD8XuQRAP7Yy6Ek/NtPrNHJ48AnA6BHe6qcTm4Q6QtHrbfa8ScaM8nY/7YhhvSoBCLbLjh7prW668SNV/YKexowMPskYrA0N6oIoEoDBlHg/TAL6Sv+jD2yXw9T5/srK0n/HTNkFuzY11YqMcsavHfxKeNya3reQejjJoB+TOm4tb/XTh5fXWaNXPvg42Odxex1Sc13VrlmzM4IdwJ+6DK/T+LW9z5tvmePW7Mn3o4F97hub9MgjU+2+E6BGHbodrQZv0QO46IR4zCj1/xG96rUVvytV9fUpL33aRvd7/Xdc/V75/5h0dok0t8REP++gpS2e/r14qciipQlZtCSufmKycLF6xK16ln1LG0dEAutwAS64XG0Bp/ywQ36prvQ3cQQvwKZ4WnTkEoBxagO79tikfDQ3uJPt39/O++Ghidt2yX2PVXoKVj4zbTCuR1Yf4z0Jmrhdl0oAghvhrVqtmCds5e2RmrpuQd6Cpu3W+Jp3u+9+u1uq1N5DR2dwG4NJ23uzy6fv5PuZLTe3KwHQz6fXSck3Nu1O//66GrK1oT74ZCzTa7l6RO7cLxIyd15cPpuXkE8+i8vsTxIy59OEfDE/Lu7sU2aq2Pu3/p5O+WGnHLlfu6w22mxfsUklcgmAxtXnb664KZiNWKU6/1nMM6EnbB3sRmLXHdVuSxHTzjt0yZU3B2Onq/U99TxtrxfW7Lh1l1So8We6AtoG/mBicXa6XTq+jwa0d6yTpx22Kq6ORXSNL2f94aTO9KN/9R5yKaa1Vk/Ktlvqjf2KDb5O+ks9NTakpLGhRzbZYNWadKjrJXQi8OHHcXl/TpnM/DAhMz9IpBMFEoNVvYJ8pb42JQfs1akO9bepa5HQj2QCcPi+HfKPu6qkLYALlfTVoXWqE3md9IASeljJIDay9bXJ9LK91k3P941Ne2Q7tXJ9/jX/R3rT1xccd1ib5+oNVRfZ7bdnh1x/p//D0A5RK/CD9vZ+ZKevUT8/qF0eUwmA9x7St6RVfx86uUNq1bnKUk8j1HU2P/6vTrnlvuCOZPVv4wi1st7t+52y586dsvnGpT8N0r9+uf6vE8ON1utRP/pTK7MmfWphlk4G1M8775fJWzPL5L3ZZdIdrublaro17200vic9mt+PdumSmurSf4dsgYmlPjdw2XwJWnvxNTVyyXX+7snqjcQzty9To0IVd8hIHy783pShsrzZ30PFJx7dJkepC1mKnfSKaK8jGn3fiB24V4ec/pvWoqq3eGlcvjd5iLS2+2t36nGtcojawPoxHX96ndz/uL8bx+Eq+XnqtqVFJZ9+tK1vGZ+rQ927HdIoTS3BnWrT5/F3Ukek9EZfn15JBHtpSl/TSvq7S+UHMz9ckQzo7+FbMxPywUdl0lP6gxwldfFSuO4/+oioHsZX79gwrSoQ2QSgR8X7wF82yKvT/NmT1RcIXf2XpvQh3lUZC3/l6RfK5ae/bZCkT8mo3mu/7vwm31aSl99QLedfWVN4wwaYYzN1XvaWS/25r/bhpyvl2FPrBiip8Je/r64tuOKc5vTFYIXPveoczWqjuNeRjeqwrz8bxzK14bvu/GZ12Hvl3uOqpZp/RR/p+Nkp9b4XvLp66trPD+6QPdSGX5/2cH3qVNeUvKtOGeiEQF9A/PYskoKB+oQ+RatPM+qjRRO39X66caDlR+31yCYAOlCLl8Zkn6OGyCefF78i/v1xbXLo5OL3rjM70FXqXPs5lxe/kR23Zq/cdUWT7xc+/eoP9fLAE8Vf7b3Gar1yp6qfPnTs13ThVTVy6fXFH+HZZP0eufWyJt8PC85Wd1JMPqZRli4v/kjFGeqoyQHq6ImN019VonieT4mivgf7mIPa5Ce7dUq5P3m7jWS+1KmrS50+mJ1IJwMz3isX/YAm/f9SXZfhS6M8LmSEGhtj++90q52zLpm4XbcVp8k8NsX4bJFOALTmEjVwzM9ObpDXpnu73EFfdPbHE1pk7x8Uf344W3Tv+GeVnHperefzftt8s1suPbNZhgRwJieldr7OvrSmqOe+6/pdckZzILfYXHdblZx1aa3noyg7bd8l55/aEtgKQ18JfuSJDZ5vq9RXKp97UovsPsmuPf/+/fjOB6vklD/Xej5MPUqNjfGz/26XfffokIri883+1XPm//qop77Y8P05ifS1BOnf6u+P5yYCH9vDJHKDOgW7+ca9otctO6g7ivT1FUzeBCKfAGiWbnXV+GXX18jVt1YVNIDJ5hv1yB9+3Sqbqd9BTm/OKJPTL6yT6ep8X75TrbqQ5cj929UeU7tvh/0HKvuhpyrknMtq5LP5+ddPX5B49IEd6ToGee72RfVY2jMuqpX31Iou30mP9nfswW2+nfPPVa6+0EufSrnlvqqCkrxvb94tp/2qLTQrt1nqvPXpF9bIy2/mv+uu788/cv8O2V9d2OnS4Cu5+ksQ7+nrCuZ8Wpa+LfFjdXv0xyox1UnBJ58nZN4Cu29R1AP06COc+tbOzTe2566PIOJUimU6kQD0wS5YFJdr1V7jI89UyKfqnt1sk97j15nlZHWP6K47BrPXn61c/dqDT1bInQ9Vid6oDXQlsB7jQN/mePi+7UZvY9ErEb0R0xe3TXunbMALBDcY15u+8EbfLWHqXuykOrNw98NV6qdCHekpH3BvR9/nr2/1O3ifDuOP99Qr3mtvq5bHn60YcChovcevr+XYb89O+Z4aLyKM03OvlMs9j1Sm25ntQk39/fr6hj0yeXd9RX8Hh/pLHGR9KkGfItWJwLyFKiFYGJP5//mtBzjSAx4tb44HdmpB3xmkTw2uGKxpxcBNejAyPViY/ilm1NUS04aieKcSgMyIvKfOl+nDZTopaFNXlOshenUn3EINKFLqW6306GPT3y1LjzC2cHFMXfmthplV9dOjHHodRS+z7cX+rc3eeT+RXlHoc9yNDUkZNTwlG47vLWoQomLrpefXp3z0hVJ6JaavAdFJSF/dxqprEWyY9NP0Vux9xdSYBjEZpfqd7nt6MBuvYyTY0K7MOvQq6k/VHqYeDKdV3flZre7cHKL6id6TY28/Uyocf+uxDPRDoHQyoH/rdVSH2j/qVAmEvu5AX6iof/cmY+kRFfXIivrI34oRFlPp+Nepo4L6Nmi9V69/6wGc9MZff4apNALOJgCl4aZUBBBAAAEE7BAg97IjDtQCAQQQQAABowIkAEa5KQwBBBBAAAE7BEgA7IgDtUAAAQQQQMCoAAmAUW4KQwABBBBAwA4BEgA74kAtEEAAAQQQMCpAAmCUm8IQQAABBBCwQ4AEwI44UAsEEEAAAQSMCpAAGOWmMAQQQAABBOwQIAGwIw7UAgEEEEAAAaMCJABGuSkMAQQQQAABOwRIAOyIA7VAAAEEEEDAqAAJgFFuCkMAAQQQQMAOARIAO+JALRBAAAEEEDAqQAJglJvCEEAAAQQQsEOABMCOOFALBBBAAAEEjAqQABjlpjAEEEAAAQTsECABsCMO1AIBBBBAAAGjAiQARrkpDAEEEEAAATsESADsiAO1QAABBBBAwKgACYBRbgpDAAEEEEDADgESADviQC0QQAABBBAwKkACYJSbwhBAAAEEELBDgATAjjhQCwQQQAABBIwKkAAY5aYwBBBAAAEE7BAgAbAjDtQCAQQQQAABowIkAEa5KQwBBBBAAAE7BEgA7IgDtUAAAQQQQMCoAAmAUW4KQwABBBBAwA4BEgA74kAtEEAAAQQQMCpAAmCUm8IQQAABBBCwQ4AEwI44UAsEEEAAAQSMCpAAGOWmMAQQQAABBOwQIAGwIw7UAgEEEEAAAaMCJABGuSkMAQQQQAABOwRIAOyIA7VAAAEEEEDAqAAJgFFuCkMAAQQQQMAOARIAO+JALRBAAAEEEDAqQAJglJvCEEAAAQQQsEOABMCOOFALBBBAAAEEjAqQABjlpjAEEEAAAQTsECABsCMO1AIBBBBAAAGjAiQARrkpDAEEEEAAATsESADsiAO1QAABBBBAwKgACYBRbgpDAAEEEEDADgESADviQC0QQAABBBAwKkACYJSbwhBAAAEEELBDgATAjjhQCwQQQAABBIwKkAAY5aYwBBBAAAEE7BAgAbAjDtQCAQQQQAABowIkAEa5KQwBBBBAAAE7BEgA7IgDtUAAAQQQQMCoAAmAUW4KQwABBBBAwA4BEgA74kAtEEAAAQQQMCpAAmCUm8IQQAABBBCwQ4AEwI44UAsEEEAAAQSMCpAAGOWmMAQQQAABBOwQIAGwIw7UAgEEEEAAAaMCJABGuSkMAQQQQAABOwRIAOyIA7VAAAEEEEDAqAAJgFFuCkMAAQQQQMAOARIAO+JALRBAAAEEEDAqQAJglJvCEEAAAQQQsEOABMCOOFALBBBAAAEEjAqQABjlpjAEEEAAAQTsECABsCMO1AIBBBBAAAGjAiQARrkpDAEEEEAAATsESADsiAO1QAABBBBAwKgACYBRbgpDAAEEEEDADgESADviQC0QQAABBBAwKkACYJSbwhBAAAEEELBDgATAjjhQCwQQQAABBIwKkAAY5aYwBBBAAAEE7BAgAbAjDtQCAQQQQAABowIkAEa5KQwBBBBAAAE7BEgA7IgDtUAAAQQQQMCoAAmAUW4KQwABBBBAwA4BEgA74kAtEEAAAQQQMCpAAmCUm8IQQAABBBCwQ4AEwI44UAsEEEAAAQSMCpAAGOWmMAQQQAABBOwQIAGwIw7UAgEEEEAAAaMCJABGuSkMAQQQQAABOwRIAOyIA7VAAAEEEEDAqAAJgFFuCkMAAQQQQMAOARIAO+JALRBAAAEEEDAqQAJglJvCEEAAAQQQsEOABMCOOFALBBBAAAEEjAqQABjlpjAEEEAAAQTsECABsCMO1AIBBBBAAAGjAiQARrkpDAEEEEAAATsESADsiAO1QAABBBBAwKgACYBRbgpDAAEEEEDADgESADviQC0QQAABBBAwKkACYJSbwhBAAAEEELBDgATAjjhQCwQQQAABBIwKkAAY5aYwBBBAAAEE7BAgAbAjDtQCAQQQQAABowIkAEa5KQwBBBBAAAE7BEgA7IgDtUAAAQQQQMCoAAmAUW4KQwABBBBAwA4BEgA74kAtEEAAAQQQMCpAAmCUm8IQQAABBBCwQ4AEwI44UAsEEEAAAQSMCpAAGOWmMAQQQAABBOwQIAGwIw7UAgEEEEAAAaMCJABGuSkMAQQQQAABOwRIAOyIA7VAAAEEEEDAqAAJgFFuCkMAAQQQQMAOARIAO+JALRBAAAEEEDAqQAJglJvCEEAAAQQQsEOABMCOOFALBBBAAAEEjAqQABjlpjAEEEAAAQTsECABsCMO1AIBBBBAAAGjAiQARrkpDAEEEEAAATVjUu8AAAI5SURBVDsESADsiAO1QAABBBBAwKgACYBRbgpDAAEEEEDADgESADviQC0QQAABBBAwKkACYJSbwhBAAAEEELBDgATAjjhQCwQQQAABBIwKkAAY5aYwBBBAAAEE7BAgAbAjDtQCAQQQQAABowIkAEa5KQwBBBBAAAE7BEgA7IgDtUAAAQQQQMCoAAmAUW4KQwABBBBAwA4BEgA74kAtEEAAAQQQMCpAAmCUm8IQQAABBBCwQ4AEwI44UAsEEEAAAQSMCpAAGOWmMAQQQAABBOwQIAGwIw7UAgEEEEAAAaMCJABGuSkMAQQQQAABOwRIAOyIA7VAAAEEEEDAqAAJgFFuCkMAAQQQQMAOARIAO+JALRBAAAEEEDAqQAJglJvCEEAAAQQQsEOABMCOOFALBBBAAAEEjAqQABjlpjAEEEAAAQTsECABsCMO1AIBBBBAAAGjAiQARrkpDAEEEEAAATsESADsiAO1QAABBBBAwKgACYBRbgpDAAEEEEDADgESADviQC0QQAABBBAwKkACYJSbwhBAAAEEELBDgATAjjhQCwQQQAABBIwKkAAY5aYwBBBAAAEE7BAgAbAjDtQCAQQQQAABowIkAEa5KQwBBBBAAAE7BEgA7IgDtUAAAQQQQMCoAAmAUW4KQwABBBBAwA4BEgA74kAtEEAAAQQQMCpAAmCUm8IQQAABBBCwQ4AEwI44UAsEEEAAAQSMCpAAGOWmMAQQQAABBOwQIAGwIw7UAgEEEEAAAaMC/w+aFxr4FdDs/AAAAABJRU5ErkJggg==' // 闲鱼logo (base64编码)
    };    // 密钥管理功能
    const KeyManager = {
        STORAGE_KEY: 'rapidgator_user_key',
        
        // 保存用户输入的密钥
        saveKey: function(key) {
            if (key && key.trim()) {
                GM_setValue(this.STORAGE_KEY, key.trim());
                console.log('密钥已保存:', key.trim());
            }
        },
        
        // 获取保存的密钥
        getSavedKey: function() {
            const savedKey = GM_getValue(this.STORAGE_KEY, '');
            return savedKey || CONFIG.DEFAULT_KEY;
        },
        
        // 清除保存的密钥
        clearKey: function() {
            GM_setValue(this.STORAGE_KEY, '');
            console.log('已清除保存的密钥');
        }
    };

    // 创建转换面板
    function createConverterPanel() {
        const panel = document.createElement('div');
        panel.id = 'rapidgator-converter';
        panel.innerHTML = `
            <div style="
                position: fixed;
                ${CONFIG.POSITION.includes('top') ? 'top: 20px;' : 'bottom: 20px;'}
                ${CONFIG.POSITION.includes('right') ? 'right: 20px;' : 'left: 20px;'}
                width: 320px;
                background: #fff;
                border: 2px solid #007bff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
            ">
                <div style="
                    background: #007bff;
                    color: white;
                    padding: 12px;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span style="font-weight: bold;">🚀 链接转换器</span>
                    <button id="close-converter" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0;
                        width: 20px;
                        height: 20px;
                    ">×</button>
                </div>
                <div style="padding: 15px;">
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Key:</label>
                        <div style="display: flex; gap: 6px;">
                            <input type="text" id="converter-key" value="${KeyManager.getSavedKey()}" style="
                                flex: 1;
                                padding: 8px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                box-sizing: border-box;
                            ">
                            <button id="clear-key-btn" title="清除保存的密钥" style="
                                padding: 8px 10px;
                                background: #6c757d;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: bold;
                            ">🗑️</button>
                            <button id="verify-key-btn" style="
                                padding: 8px 12px;
                                background: #ffc107;
                                color: #212529;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: bold;
                                white-space: nowrap;
                            ">验证</button>
                        </div>
                        <div id="key-info" style="
                            margin-top: 3px;
                            font-size: 11px;
                            color: #666;
                            display: none;
                        "></div>
                        <div id="key-status" style="
                            margin-top: 5px;
                            font-size: 12px;
                            padding: 4px 8px;
                            border-radius: 3px;
                            display: none;
                        "></div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">链接:</label>
                        <input type="text" id="converter-url" readonly style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            box-sizing: border-box;
                            background: #f8f9fa;
                        ">
                    </div>
                    <button id="convert-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: #28a745;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-bottom: 10px;
                    ">转换链接</button>
                    <div id="result-area" style="
                        min-height: 60px;
                        padding: 10px;
                        background: #f8f9fa;
                        border-radius: 4px;
                        border: 1px solid #e9ecef;
                        display: none;
                    ">
                        <div id="result-content"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 填充当前页面URL
        const urlInput = document.getElementById('converter-url');
        urlInput.value = window.location.href;

        // 绑定事件
        bindEvents();
        
        // 显示密钥信息
        updateKeyInfo();
        
        // 如果有保存的密钥且不是默认密钥，自动验证
        const savedKey = KeyManager.getSavedKey();
        if (savedKey && savedKey !== 'demo' && savedKey !== CONFIG.DEFAULT_KEY) {
            setTimeout(() => {
                verifyKey();
            }, 1000); // 延迟1秒自动验证
        }
    }

    // 绑定事件
    function bindEvents() {
        // 关闭按钮
        document.getElementById('close-converter').addEventListener('click', function() {
            document.getElementById('rapidgator-converter').style.display = 'none';
        });

        // 转换按钮
        document.getElementById('convert-btn').addEventListener('click', convertLink);

        // 验证密钥按钮
        document.getElementById('verify-key-btn').addEventListener('click', verifyKey);

        // 清除密钥按钮
        document.getElementById('clear-key-btn').addEventListener('click', function() {
            if (confirm('确定要清除保存的密钥吗？')) {
                KeyManager.clearKey();
                document.getElementById('converter-key').value = CONFIG.DEFAULT_KEY;
                clearKeyStatus();
                updateKeyInfo();
                showKeyStatus('已清除保存的密钥', 'info');
                setTimeout(() => {
                    clearKeyStatus();
                }, 2000);
            }
        });

        // 回车键转换
        document.getElementById('converter-key').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                convertLink();
            }
        });

        // Key输入框变化时清除状态
        document.getElementById('converter-key').addEventListener('input', function() {
            clearKeyStatus();
            updateKeyInfo();
        });
    }

    // 验证密钥
    function verifyKey() {
        const keyInput = document.getElementById('converter-key');
        const verifyBtn = document.getElementById('verify-key-btn');
        const keyStatus = document.getElementById('key-status');

        const key = keyInput.value.trim();

        if (!key) {
            showKeyStatus('请输入Key', 'error');
            return;
        }

        // 显示验证中状态
        verifyBtn.textContent = '验证中...';
        verifyBtn.disabled = true;
        showKeyStatus('正在验证密钥...', 'loading');

        // 密钥验证
        const formData = new FormData();
        const verifyUrl = `${CONFIG.SERVER_URL}/validate?key=${encodeURIComponent(key)}`;
        
        // 尝试直接请求验证
        fetch(verifyUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).catch(() => {
            // 如果fetch失败，使用GM_xmlhttpRequest
            return new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: verifyUrl,
                        data: new URLSearchParams(formData).toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve({ 
                                    ok: true,
                                    json: () => Promise.resolve(data) 
                                });
                            } catch (e) {
                                resolve({
                                    ok: false,
                                    status: response.status,
                                    statusText: response.statusText
                                });
                            }
                        },
                        onerror: function() {
                            reject(new Error('请求失败'));
                        }
                    });
                } else {
                    reject(new Error('Tampermonkey API 不可用'));
                }
            });
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`请求失败: ${response.status} ${response.statusText}`);
            }
        })
        .then(data => {
            // 分析API响应来判断密钥状态
            if (data.error) {
                if (data.error.includes('无效的密钥') || data.error.includes('invalid') || data.error.includes('key')) {
                    showKeyStatus('❌ 密钥无效或不存在', 'error');
                    // 显示购买提示
                    showPurchaseHint();
                    return;
                } else if (data.error.includes('无可用解析次数') || data.error.includes('次数')) {
                    // 密钥有效但无剩余次数
                    showKeyStatus(`⚠️ 密钥有效但无剩余次数`, 'warning');
                    // 显示购买提示
                    showPurchaseHint();
                    // 密钥有效，保存它
                    KeyManager.saveKey(key);
                    return;
                } else {
                    // 密钥有效，但可能是其他错误（如链接问题）
                    showKeyStatus('✅ 密钥有效 - 链接解析可能需要有效的Rapidgator链接', 'success');
                    // 密钥有效，保存它
                    KeyManager.saveKey(key);
                    return;
                }
            }
            if (data.key_type !== "rapidgator") {
                showKeyStatus(`❌ 密钥类型不匹配`, 'error');
                return;
            }
            
            // 如果有返回结果，说明密钥有效
            if (data.key && (data.total !== undefined || data.remaining !== undefined)) {
                const total = data.total || '未知';
                const used = data.used || '未知';
                const remaining = data.remaining !== undefined ? data.remaining : '未知';
                showKeyStatus(`✅ 密钥有效 - 总次数:${total} 已用:${used} 剩余:${remaining}`, 'success');
                // 验证成功后保存密钥
                KeyManager.saveKey(key);
            } else {
                showKeyStatus('✅ 密钥有效 - 服务器响应正常', 'success');
                // 验证成功后保存密钥
                KeyManager.saveKey(key);
            }
        })
        .catch(error => {
            console.error('验证失败:', error);
            showKeyStatus(`❌ ${error.message}`, 'error');
            // 网络错误或其他错误也显示购买提示，引导用户购买新密钥
            showPurchaseHint();
        })
        .finally(() => {
            verifyBtn.textContent = '验证';
            verifyBtn.disabled = false;
        });
    }

    // 从HTML中提取配额信息
    function extractQuotaFromHTML(html) {
        try {
            // 尝试匹配页面中可能包含的配额信息
            // 这可能需要根据实际页面结构调整
            const remainingMatch = html.match(/剩余[：:]?\s*(\d+)/);
            const totalMatch = html.match(/总[配限额次数][：:]?\s*(\d+)/);
            const usedMatch = html.match(/已用[：:]?\s*(\d+)/);
            
            if (remainingMatch) {
                const remaining = parseInt(remainingMatch[1]);
                return {
                    remaining: remaining,
                    total: totalMatch ? parseInt(totalMatch[1]) : '未知',
                    used: usedMatch ? parseInt(usedMatch[1]) : '未知'
                };
            }
        } catch (e) {
            console.warn('解析配额信息失败:', e);
        }
        return null;
    }

    // 显示密钥状态
    function showKeyStatus(message, type) {
        const keyStatus = document.getElementById('key-status');
        keyStatus.textContent = message;
        keyStatus.style.display = 'block';

        // 根据类型设置样式
        switch (type) {
            case 'success':
                keyStatus.style.background = '#d4edda';
                keyStatus.style.color = '#155724';
                keyStatus.style.border = '1px solid #c3e6cb';
                break;
            case 'warning':
                keyStatus.style.background = '#fff3cd';
                keyStatus.style.color = '#856404';
                keyStatus.style.border = '1px solid #ffeaa7';
                break;
            case 'error':
                keyStatus.style.background = '#f8d7da';
                keyStatus.style.color = '#721c24';
                keyStatus.style.border = '1px solid #f5c6cb';
                break;
            case 'loading':
                keyStatus.style.background = '#d1ecf1';
                keyStatus.style.color = '#0c5460';
                keyStatus.style.border = '1px solid #bee5eb';
                break;
            case 'info':
                keyStatus.style.background = '#d4f6ff';
                keyStatus.style.color = '#004085';
                keyStatus.style.border = '1px solid #9fcdff';
                break;
            default:
                keyStatus.style.background = '#f8f9fa';
                keyStatus.style.color = '#495057';
                keyStatus.style.border = '1px solid #e9ecef';
        }
    }

    // 清除密钥状态
    function clearKeyStatus() {
        const keyStatus = document.getElementById('key-status');
        keyStatus.style.display = 'none';
    }

    // 更新密钥信息显示
    function updateKeyInfo() {
        const keyInfo = document.getElementById('key-info');
        const keyInput = document.getElementById('converter-key');
        const savedKey = GM_getValue(KeyManager.STORAGE_KEY, '');
        
        if (savedKey && keyInput && keyInput.value === savedKey) {
            keyInfo.textContent = '💾 使用已保存的密钥';
            keyInfo.style.display = 'block';
        } else if (savedKey) {
            keyInfo.textContent = '💾 有保存的密钥，当前使用其他密钥';
            keyInfo.style.display = 'block';
        } else {
            keyInfo.style.display = 'none';
        }
    }

    // 转换链接
    function convertLink() {
        const keyInput = document.getElementById('converter-key');
        const urlInput = document.getElementById('converter-url');
        const convertBtn = document.getElementById('convert-btn');
        const resultArea = document.getElementById('result-area');
        const resultContent = document.getElementById('result-content');

        const key = keyInput.value.trim();
        const url = urlInput.value.trim();

        if (!key) {
            showResult('错误：请输入 Key', 'error');
            return;
        }

        if (!url) {
            showResult('错误：链接为空', 'error');
            return;
        }

        // 显示加载状态
        convertBtn.textContent = '转换中...';
        convertBtn.disabled = true;
        showResult('正在转换链接，请稍候...', 'loading');

        // 发送转换请求
        const formData = new FormData();
        formData.append('url', url);

        // 尝试直接请求，如果失败则使用CORS代理
        const requestUrl = `${CONFIG.SERVER_URL}/convert?key=${encodeURIComponent(key)}`;
        
        fetch(requestUrl, {
            method: 'POST',
            body: formData,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            // 处理HTTP错误状态码
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`HTTP ${response.status}: ${errorData.error || '请求失败'}`);
                }).catch(() => {
                    throw new Error(`HTTP ${response.status}: 请求失败`);
                });
            }
            return response.json();
        }).catch(() => {
            // 如果fetch失败，使用GM_xmlhttpRequest
            showResult('使用Tampermonkey内置请求...', 'loading');
            return new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: requestUrl,
                        data: new URLSearchParams(formData).toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                // 检查HTTP状态码
                                if (response.status >= 400) {
                                    reject(new Error(`HTTP ${response.status}: ${data.error || '请求失败'}`));
                                    return;
                                }
                                resolve(data);
                            } catch (e) {
                                if (response.status >= 400) {
                                    reject(new Error(`HTTP ${response.status}: 请求失败`));
                                } else {
                                    reject(new Error('解析响应失败'));
                                }
                            }
                        },
                        onerror: function() {
                            reject(new Error('请求失败'));
                        }
                    });
                } else {
                    reject(new Error('Tampermonkey API 不可用'));
                }
            });
        })
        .then(data => {
            handleConvertResponse(data);
        })
        .catch(error => {
            console.error('转换失败:', error);
            showResult(`网络错误: ${error.message}`, 'error');
        })
        .finally(() => {
            convertBtn.textContent = '转换链接';
            convertBtn.disabled = false;
        });
    }

    // 处理转换响应
    function handleConvertResponse(data) {
        if (data.error) {
            // 检查是否是次数耗尽错误或无效密钥错误
            if (data.error.includes('无可用解析次数') || data.error.includes('次数') || 
                data.error.includes('无效的密钥') || data.error.includes('invalid') || data.error.includes('key')) {
                showResult(`错误: ${data.error}`, 'error');
                showPurchaseHint();
            } else {
                showResult(`错误: ${data.error}`, 'error');
            }
            return;
        }

        if (!data.results || data.results.length === 0) {
            showResult('没有找到转换结果', 'error');
            return;
        }

        const result = data.results[0];
        if (result.direct_link) {
            // 转换成功，保存密钥
            const keyInput = document.getElementById('converter-key');
            if (keyInput && keyInput.value.trim()) {
                KeyManager.saveKey(keyInput.value.trim());
            }
            
            const resultHtml = `
                <div style="margin-bottom: 10px;">
                    <strong style="color: #28a745;">✅ 转换成功!</strong>
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>直链:</strong><br>
                    <a href="${result.direct_link}" target="_blank" style="
                        color: #007bff;
                        text-decoration: underline;
                        word-break: break-all;
                        display: inline-block;
                        margin-top: 5px;
                        padding: 8px;
                        background: #e7f3ff;
                        border-radius: 5px;
                        width: 100%;
                        box-sizing: border-box;
                        border: 2px solid #007bff;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#cce7ff'; this.style.transform='scale(1.02)'" 
                       onmouseout="this.style.background='#e7f3ff'; this.style.transform='scale(1)'">${result.direct_link}</a>
                </div>
                <div style="
                    margin: 10px 0;
                    padding: 8px;
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 4px;
                    color: #856404;
                    font-size: 12px;
                    text-align: center;
                ">
                    � <strong>提示:</strong> 点击上方蓝色直链即可下载文件
                </div>
                ${result.filename ? `<div><strong>文件名:</strong> ${result.filename}</div>` : ''}
                ${result.size ? `<div><strong>大小:</strong> ${result.size}</div>` : ''}
                ${data.remaining !== undefined ? `<div style="margin-top: 10px; color: #666;"><strong>剩余次数:</strong> ${data.remaining}</div>` : ''}
            `;
            showResult(resultHtml, 'success');
        } else if (result.error) {
            showResult(`转换失败: ${result.error}`, 'error');
        } else {
            showResult('转换失败: 未知错误', 'error');
        }
    }

    // 显示结果
    function showResult(content, type) {
        const resultArea = document.getElementById('result-area');
        const resultContent = document.getElementById('result-content');
        
        resultContent.innerHTML = content;
        resultArea.style.display = 'block';

        // 根据类型设置样式
        switch (type) {
            case 'success':
                resultArea.style.background = '#d4edda';
                resultArea.style.borderColor = '#c3e6cb';
                break;
            case 'error':
                resultArea.style.background = '#f8d7da';
                resultArea.style.borderColor = '#f5c6cb';
                break;
            case 'loading':
                resultArea.style.background = '#d1ecf1';
                resultArea.style.borderColor = '#bee5eb';
                break;
            default:
                resultArea.style.background = '#f8f9fa';
                resultArea.style.borderColor = '#e9ecef';
        }
    }



    // 检测页面是否加载完成
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createConverterPanel);
        } else {
            createConverterPanel();
        }
    }

    // 初始化
    init();

    // 添加样式优化
    const style = document.createElement('style');
    style.textContent = `
        #rapidgator-converter button:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        #rapidgator-converter button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        #rapidgator-converter input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        #verify-key-btn:hover:not(:disabled) {
            background: #e0a800 !important;
        }
        #clear-key-btn:hover:not(:disabled) {
            background: #5a6268 !important;
        }
        #key-status {
            transition: all 0.3s ease;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 显示购买提示
    function showPurchaseHint() {
        // 获取转换面板的位置信息
        const converterPanel = document.getElementById('rapidgator-converter');
        const panelRect = converterPanel.getBoundingClientRect();
        
        // 计算提示框的位置
        let topPosition, leftPosition;
        if (CONFIG.POSITION.includes('top')) {
            topPosition = panelRect.bottom + 10; // 面板下方10px
        } else {
            topPosition = panelRect.top - 280; // 面板上方（估计提示框高度280px）
        }
        
        if (CONFIG.POSITION.includes('right')) {
            leftPosition = panelRect.right - 320; // 与面板右对齐
        } else {
            leftPosition = panelRect.left; // 与面板左对齐
        }
        
        // 确保不超出屏幕边界
        const maxTop = window.innerHeight - 300;
        const maxLeft = window.innerWidth - 340;
        topPosition = Math.min(Math.max(10, topPosition), maxTop);
        leftPosition = Math.min(Math.max(10, leftPosition), maxLeft);
        
        // 创建购买提示弹窗
        const hintDiv = document.createElement('div');
        hintDiv.id = 'purchase-hint';
        hintDiv.innerHTML = `
            <div style="
                position: fixed;
                top: ${topPosition}px;
                left: ${leftPosition}px;
                background: #fff;
                border: 3px solid #ff6b35;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                z-index: 20000;
                font-family: Arial, sans-serif;
                width: 320px;
            ">
                <div style="
                    background: linear-gradient(135deg, #ff6b35, #f7931e);
                    color: white;
                    padding: 15px;
                    border-radius: 9px 9px 0 0;
                    text-align: center;
                    font-weight: bold;
                    font-size: 16px;
                ">
                    🛒 密钥次数已用完
                </div>
                <div style="padding: 20px; text-align: center;">
                    <div style="margin-bottom: 15px; font-size: 14px; color: #333;">
                        您的密钥使用次数已耗尽，请前往闲鱼购买新的卡密
                    </div>
                    <div style="margin: 15px 0;">
                        <a href="${CONFIG.XIANYU_URL}" target="_blank" style="
                            display: inline-block;
                            text-decoration: none;
                            transition: transform 0.2s ease;
                        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                            <div style="
                                width: 60px;
                                height: 60px;
                                border-radius: 12px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                                border: 2px solid #ff6b35;
                                background: white;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                overflow: hidden;
                            ">
                                <img src="${CONFIG.XIANYU_LOGO}" alt="闲鱼" style="
                                    width: 50px;
                                    height: 50px;
                                    object-fit: contain;
                                ">
                            </div>
                        </a>
                    </div>
                    <div style="margin-bottom: 15px; font-size: 12px; color: #666;">
                        点击上方logo前往闲鱼店铺购买
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button onclick="window.open('${CONFIG.XIANYU_URL}', '_blank')" style="
                            padding: 8px 15px;
                            background: #ff6b35;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                        ">前往闲鱼</button>
                        <button onclick="document.getElementById('purchase-hint').remove()" style="
                            padding: 8px 15px;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 12px;
                        ">关闭</button>
                    </div>
                </div>
            </div>
        `;
        
        // 移除已存在的提示
        const existing = document.getElementById('purchase-hint');
        if (existing) {
            existing.remove();
        }
        
        document.body.appendChild(hintDiv);
        
        // 10秒后自动关闭
        setTimeout(() => {
            if (document.getElementById('purchase-hint')) {
                document.getElementById('purchase-hint').remove();
            }
        }, 10000);
    }

})();