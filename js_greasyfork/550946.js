// ==UserScript==
// @name         Google Zen Color, Font & Logo
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Replace Google logo with custom logo, apply grayscale to service logos, supports dark mode
// @author       djshigel
// @license      MIT
// @match        https://www.google.com/*
// @match        https://www.google.com/webhp*
// @match        https://www.google.com/search*
// @match        https://google.com/*
// @match        https://myaccount.google.com/*
// @match        https://maps.google.com/*
// @match        https://news.google.com/*
// @match        https://mail.google.com/*
// @match        https://meet.google.com/*
// @match        https://chat.google.com/*
// @match        https://contacts.google.com/*
// @match        https://drive.google.com/*
// @match        https://calendar.google.com/*
// @match        https://play.google.com/*
// @match        https://translate.google.com/*
// @match        https://photos.google.com/*
// @match        https://www.google.com/shopping*
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550946/Google%20Zen%20Color%2C%20Font%20%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/550946/Google%20Zen%20Color%2C%20Font%20%20Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== Configuration =====================
    const CONFIG = {
        // Control replacement when Doodle is displayed
        REPLACE_ON_DOODLE: false, // true: always replace, false: keep Doodle
        
        // Logo Base64 data (500x150px) - paste actual data here
        LOGO_BASE64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAACWCAYAAAAonXpvAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAHgJJREFUeNrtnXu0n1V55z8nOeHEhIuEbFFrg4I9EQYSIcHgUlHEsRQGnGkn2AlFSKpLw4BFobS6tLOsli5FBkVMLO2ERCqOZtquwqCtXRW8wBDNAcEAJXIVxIQnCZckh5zczvzx7oPHNDnnd9nPfi/n+1nrLBJyfvu33+d99v7uZ1+eDUIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCH2pUcmEEIIMR4hhDnAh4CzgN8cpR/TzWxQFiqf3oY53DRgAXA+cDLwauBg4KBxProT2AZsAX4B3AZ8HXjUzHbLTYQQE0i4e6Jgnw9cCLx2HK04DbhVllOE3q14vwP4KDAXmOn4dU8DdwNfBf7VzLY4PE8fsCj+9SYzG5J7CiES9jG9sZ88Nor0CNOBU4HjgH5gSptFX2xmX5aFJejtOONkYCnwQeD4ClRpF/BPwDXA7WY23OFzDY0xg7DTzPrkpkKINoKC6cA04LeANwKzgUMcv/puM5unNyBBb8VJzwQ+BcyveFWfAr4EXNWquMeprb1j/Y6ZaZ+DEKLToCAHPzWzOXoT5TOpqtF4COH6EMIwxdrM/BrY8jXAZ4G9IYRvxw0krQwCWhl1CyHEgThIJhCVE/QQwrQQws3AbuADNbbrGcC9IYStIYTF+4vMQwgPU2zaG49FclMhRIUH/JpFrAi9FXLKO4CmrcMcDKwIIawAlgM/Bn4H+F1gstxPCNEl51SgDppFlKC/JObX1zwab5Wl8UcIIVJxcwXqoCn/iS7ocSp6hV6BEEJ0hpkNhRAUoYtyBL3k6fWngQeBO4HH9lc9ig1484GjqOimQSGEGMXOkqPkXr2CCSjoIYR+4KGMX3kH8EXgHzrJ+BaPlR0OvJ8ia9KxaO1bCFGtKL1vVLC0CHg78HsUe3gUoU8gsu1ODCEsI88a8i+A883sNqfnmAFcCnwyk+mWmNkNclUhRJt91YIY1HgHIS+a2TRZfAIIehw1bso0Wnynl5Af4NmuAK50bjASdCFEp31UD0VWS88+asjMpsra5TPJ2Zn6gR0ZxHy1mfXkFHMAM/ucmfUCfyJXEkJUjZi18iRZQoKeQsxzrJfPNbNzS240n6PIn7xNLiWEqJio3wc8I0tI0Kss5tuAqdFZq9BoBs3sEIo1KyGEqBJ/KhNI0DsR875MYj6zileMmtlbgavlWkKICvENx7L3yLzNjdA3TVQxHyXql0vUhRAV6pMGZQUJervR+Ur8N8BVWswl6kKIirJdJpCgtyrm/cAFzvWdXQcx30fUl8vNhBAVYL1MIEFvRcyn4b9uvtzMaueQZnYRMCBXE0KUzINO5e6WaZsVobvv7I7CWEvMbL5cTQhRMo/KBBL08aLzxcAbnes5uwG2ni13E0KUiM6iS9DHxfsK1IE6TrXvJ0pfj6behRDlocRXEvQxo/OVGep4aoPsvUguJ4QQolKCHjfCee9qX9ek85MxStcoWQghRKUi9DUZ6ndeA23+YbmdEEKISgh6jM6PzxDR3tdAm6+U2wkhGsQumaDeEfo9Ger26SYaPF5neItcTwghRKmCHqPz/gx1W9Zgu1/Yxu/+ndxUCCHEePRWVGj3mtmGphrdzLaEEP4a+EALv/uC3FSI9IQQeoCDgOn86g6KbRQ5z3fG2TQhGi3oF2So1/cmgO0vakXQa9xZ9gLHAX8AvBuYARwGTBvD7/ZSrMdtA14ANgD/F/hb4BdmNuGuaQwhTAZ+g+LI4znAkdGOBwN9Y3x0NzAY7bgZuBP4CvBQne5DSGTDVwLvAj4EvDL+TG/hcwBDwEbgaeAH0RcfMLPdieo2DbgKOHPUO90N7KBY2rzKzG6XVCVvU8cA5wK/E/umw4GXjeqbeoFhfnU17I7YnjYDPwKuq2Jb6mnTEP3452wHONfMVk8gB5sFXAocFRv1zcCTwL+Y2Ys1inbeAXwEOAufq3l3Av9IcYvdj5oaQYUQ5gCfAN4TI0gPHgGuB/7GzLY0zH79sT2dj+/tj7cA1wC3t+uLIYRDgefa6IO77hNjVk+PRGCbzWzmBO6bOvaDsgV9GbA0Q72m6/7e2ox0LwMuBn6zhCqsB75kZtc1wJaLgSuAN5RUhdXAh+oq7lEgryXPDOL+uBf4opnd4Cism8wsSNBbft6L48DumIxfex9wflkntNoV9K3433eOmfUgqtx5LohR8lsqVK2bgf9Wp4FgnG69KUbiVWETxTXFW2piw0OBdSUNKA/EkgMJewhhLTCvi7KfMbMjKyboXQ00EvtDH3AjsLAC1ZmbW9jbFfQc0wkbzeyVks3KCvmd+Eynp+Ih4KQqC3sU8rXAsRW240bguKoKexTy+4HXVNiGA8CX459PJt3s5ilmtqYDm3kJeul9dhTy/wecWDEfGATenEvYJ7VpsFxTFqJaneecOJi7q+JiDsWtdtsz3TPQtpDHCG17xcUcis13m0MIP43iWSU7rgSer7iYEyPxFfEn5VLlXeqVfs0fllFsWjuxgtWbBtwb61gdQafYsJUDOWt1GkpfFKB7a1j9C0IIwzEqqUqns53uplvL4Hjg+Vwd0jg27I8DywvUNkOvbPCSPyytQXWXxv5oVlUEPdd6qQS9Io0ljnrn1fxRVoQQblank6xD6i/JjovJc8KmLkxTVF5Lf3gihHBmFQT9dZkeeJ3aaumNJVfnuTf+eHN2FKPehtoxJw/lnvWInfcKtUwRZw231nyAfGsI4fNlC3qu4zSb5Lalj3w9O8/VwBFm1mNmk+NPD0WylCXAs47fvct7yiujHTdSJMY4LNqyZ5Qdz43/7sWKXFPwzkdlV1MsJU6JP68CLnG2XRImYgbJuI9rB/4nrdYBq+LPgNN3XOYRqfe0YcyfkuGGNWCSUi6WKuZenefPgf5WMivF3fSeSy9HmdnPa2pHaHGXcwY7Ljezi5xnOFaU4YshhCuAz1a0qV5jZh+tkD3dd7mPEnNPxjpu2E9xxDT1EmTSvqgdQd/B2KkmU408dQa9eWLedscfG/AvKVIyejAlVfrOTJ0mFClxZ7abbjKE8EP89sAsaSWZSgd29MpKOWBm80uuw0t1oTjW9g2KtLInefaRdRX0DGK+zsxOKMuGKTWvnSn3HMfWdiDKEPPFjmI+0EkUF0XrVRS5tD3YFVNCphahSol5tOVbgTuc6rXCaaOci5C2Kubxd9dTLAN58Z/M7AYzGzSzeRS5w8fjsAnYRd3hWPaqVsU8+sQNFEdjU/YbK7MKekyEkYOtktfsYu4pQm11oAcQ9RmOj/8vdRChyJHdXAQRRd2LhxL7pNemu1M6sNsN+K2j7vtdk8YQi+G4T6KKa+duS6TRF7xO2mwzsws7eE+pB3oXxPsbskXoufL0Kn97fjxFaG6CTm4Q+BOn+p2eSjxCCN90jiJStI3ZXhVM/Pwu6+adZFeLLHIy2+X7E4s4BTs1vq/ZUcirnNBpp2PZnhtLO86t4jDQuzOnoL+q7iM9sd9O2HOn8rpU6Q7N7HP4HW9bkcCOc3DMHd1JFDFGZOEVbS5MEWU4RucXdmk3j6t7l47xnUNR3Nerf3LhlgRpjVMO9KanaD9VG/Xtksxmayx9+O7EPi9xeR+rcMex1tGOqa8RXuRY1xR2+COnun2/y89/waFO0zIuZ6p/SjTA22egl5KuM3K2Kui57uSeIlfOhudGExwuI7jKsbpLO72rII6qPf32/Ynfi1e0CTAlQZQx16FevzSzbp/5WiebLVBXlL1/2p3w0qFbEg9kumo/rQr6U5le4nT5cbbRr2dK19RRJTE3wT2Odb6xrFH1GAw5bYK60rHO93bhl17R6kAC//PKW/CH6pGy908p2+yNievW1RJgq6kwn830LqeV7Egz4iDnPeRJSZqKm9rcAX2jc31WOpX7Jfw2ySzswF/mONvRayr/C8AnHdvRnA5naLxuT/tBonK2kP7URd3vSnDpz5zLT5lefE1qfwgh9HSaXK0lQTez4XjBhHfSl9Ii9BDCHqp/NegBR3UhBICdZtbK1PFC5/p8x6ncbzgKOiGEi83sulyj6RZwuVTGzLZEf/Hia8AJHXzOK/nNY4nK+Rnpp8ibsIaeejPz79bo2T2WTN7U6UChHQFreo71SQ14hoNaEC1vMccjA1ss1/tYY7vpNL2jq686lv2kY9nHhxAmV6hdbE9Uzt1ltNkakGwzc47+ieLcd6qLmv7KoX6X5RCxBzJFyn25vbFJO01bsN9nnKvwnHP5nss/r2tViOLyjPvYyLHsnzjX/dQGDvo9Zih1sidv/zTCU92KeghhLT6pqTse1LTzQA8Ab89g6MOBDZmd6KwGNYhFwFi5tb3vs77fufwH8JuaHRGi21r4vUvd1bz7ndlj8UPgbMfyP96iHXOQainPIzHPzxE5+6cRjqRI//xV4PYWB3M9o/qI8wC3WagQQl8nmSHbEfTHMxn6qBIE/d6J0FIyzX7c51z+Xc6C/pEWhegC5+d8xrn8dc7lv6tCrn9konI8rpC+BZGzf9qX98WfqnE68K12P9TOlLtlepDjcluuYdmYxtoh+sYM3++9NOM9sDyjxd/zvlf9QefyN1ewg/Y6e5xq+t8jY+bXJeW/FsyJgo928qF2BH0g04O8qSQDbmyCF4wzTZNjaeFR5/K3O5c/bpKYTBu+vAdGOZJFtTuAfMKpHl3P6IQQvK4HfRIxwlyZoDsdbEfQH870IG8ryYBnNMAJxrskIUdWqhfrbsQQwqHj/UqGajzuXP5zGZ6hranMbm6TG4dXJ7gq9yKHej3S6XnjipHqGY5EjHCIq6BnODI0wjElRbY/ibca9cSR4iUUGc/ur/iL3wZ8INZ9vCnO38pQn80NaEzHjvPvJ+VwyZIHfyk4rYPPLHeqyzu6/PzHHer0F9KtX+PlMkF3tLttfxD/RAhTyzZKzHJ1H3DdqKhtDvD3ZQ049uEOYFEH6SgPz1C3HQ1oF8cxdmKHoxvwjDkEvZNp6o/gcynHSjpcow0h9OOwozlewSl+RZ9M8GuBml+EHrk1x5M4rld1JfJm9nr87uZuhWeBI8zsrR3mls4xWNoxARrbwQ14ht0ZvmN6B+1syClKnxVC6HTJySMV6SXSrK71qMkM5jDg1Zke5n1VtXK8m/uUEr56lZnN6PKWoBwNZucEaGw9iFaY0mEbu8ipPnd1EFwsxiEjYJsphicKe2SCl/jzTj7U26YTrnHOAT3C7wOfq7CorwkhrMY/J/oIQ2Z2YYJydtGMVJMTIbqd6AOf2cBDqSsUQlhrZvNb/N1+fPL1z5ZrVKJd3QL8Q4We/wEz6+qyl05S390DnOj8YCfWwPnem1HQUx3lewH/C3AmwoDhRYT3oHl9CGGJg6DOa0XUY2TuIeZLGpb3IiXPZfyuoxyvxC2NTqZgP5GjYlVcR9+nwxkGHskUnafKvpZjB/pUms+jiFbY2WUbuwGf9fR5IYThKNr/LiqPObo9xHy5NsKNSa4rq+c2Ucw7EnQz+1amul1UA/vdneE7Ul6h+WCG+jZB0B8f59/XNeAZezN8R9czGXE9fYlT/VZEYd8af4Yppvk9btFb4rg3oClsz/AdGxIGSI2I0AGuz1C3T9bAft+v2XeszVDfIxrQLsYb+DydoQ7em1Vy7NRPEgXFqHa2sy087TG3IpF51Tdz5sjW+XyTR0SdCnqWkWbclDLRR5Qpv+PHGer7sga0CxtHYHJs3nmtc/k5ZlKSHfeK686TKJI91YV/BSY1OSJMPFDIMfM1o8kvYlKHjWtPdNbadAgCyJOPv/ZJV1q8ttR7P8LxzuUfXrf2a2bDZnYu5RwbbYe9wClm9q6GpHbNRY6Zr0OabMBuziWfk6F+80II0+TnyTrEFzJ8jfdted5T0Zta/L1/c66H99GmHO3qSSc/XoPfunq3nGJmk7s9fjRB+6ccM1+N3rQ7qQvjD1IcYfPm+3L1pHgfDfGOLF/rXH6ru6qvdK7HK2puxx0TKDodoFgn75GQd427poQQeptqvG4zh705U5SuHL/5BatT3uBcvrfPLWvx927P0PF4XtP6Oufqf9O5/JNLaDu7gZ9RrOO/E5geRXx+TdbJ65Dh8C8zfMerm9q5dzVSMbOhEMJyfC5TGM0dwHxECq4FPuapQ871f71n4Wa2ocXfG8yQNfEwYItT2e90rrvLTWLxGtRPJepzhiguwXiOYv32GWAD8FT8/4/GPz+eabmqrkxJWNbNGepb6UykpQl67NguCiF4C/q8EEK/MiylESxvIQohTG5xY1kneB4vancH9QA+Z5ZHmAvc5lT2sc5+tt7Br64APtvhx9dRXKx0e8aroKuGV5bInoR+MxRC+Dd8Z/rOKVPQQwgnUGxKfS71YDHVZR05Nqg8hChLuNrlVKeGcKhzvd/f5u9/2bk+FziW7Xl8Z3ni994fk750KuZXm9kJZvatCSzm4LcRMvVRVW+xfUtJQn5o9OP7gO8B9wLPx+RGa0MIsyoh6DFpwkAGg6ytWAM5uaYN+zM1FSLPW/h+2e5IOUOykLc6taNZzvX+SMK6Lk4wmP9jjeEBv42QSQcKOZLwdHGVbqffN4exk9rMA54IIXQ1s5nyOs0co555IYRlFWogb6pjq86wgecMp3LPc6xzp1N8nrNTx8Q149R82LHOA/FO81RiniKnuu7ZLvDaUOoxlb/K2RZfyyjm/TEab8lXQwibS3f02IiPymCfpRUS9Xk1btyeQnSk08kEr4Qij3W6jpUhmvAYNHreEphkYB/zT6S6IOVL0nIA+mtU1w86l39MjkyksR9sd4bpmUqMXOMNNudmEvVSp9/3d1NTzaJ0byG6JrG9PafI3ljhwdFNie04DfCacl+eKjqn2GWesr94OISwwGnGo/JEYZnqWH5ScYx+5H3ENsdRw00dfOasSgh6fBGrgatzRMchhC1lnFGP37miAe3cU4hSn3z4ulM9V3W7y9R5D8nRiQczbrNbqW4Ti5sfUwvvMcBdwN4QwrMhhG+GEE6bQDkurnEuf1lV/WkM+kIIKx11Yi0dnMoxs46vZ57k1LAvzyTqhwM7ckbLsQPY1IQW7r2ZMdXSSNxQ8jonG1yYqCjPPSR3JYzOvTYspkxV+0Vn1385xbLDd2P/MRxC2BxC+EEIYUUIYXEIYU5T0k7HTZDeR4tPd9ps6X2C6gIPUY9i3smSbFcz3D3OjvR54LJMfrsNOMfMbnN8ngWpOtd2HNpzejwOUHY41n9qN9OwzvWbnfK8dMJNXPtjwMzmd1m/rfic40/qoyGEZ6PoVoXtFLn7fwQ8QHFr4YPA1qqntw0hzMD/IqFk7T2xOLbDRuA13eaT71Ij7jGzk7r5ftfdnzFSPzeTIx0MfDeEsCGEcGbKtJlx7e3hEsQ8R5Q+hO9FIJs6ndZ0ng05N3XyE+cZj65OeMQoxEPMlzsMOKt2gcb0KChLKTbY3UVxBGlvCGFPPEN8RRTPqgj55BDCn2cWc/CZMc1xgupIYFcIYWUnMzOJNKLrUwg9mZyrn3ISw/wUuB64ycy2tFHfXuBtsQEvLLltLsl0LtMzutwGzGxn5O7sM8u91ucyzHi0Hak7Rjgudgwh7ADqvLb9FEUSnBU5E9mEEF4BvIsivfMRFbDDz4BLgSfM7P6aacjPgcuBf97fHpvYzk8HLkykEUlmC3syOlsfRU72Mo967QKepcjXPLRPRHAIMBPf1KKVFfT4jpbhu9Y27rPEhnuTo58s995sk0HUW7Wl5yDNc1C0nTzXu+bgaeAT3m04JiSp8nn7vWY2uctnXIj/pT8HrD+wEzjIwc7J+vjsRzicO5kmkk3QM76fAYr1yB/Hv59Mcd56XlNsmUnUy7Kl66AohPAj6puFcSxWAR9MvcYcbVb5q2rNrCfBc3oHHbXu30s7kxlCWA38V+n1uEz16ABaiJKbljt/du7LfSoyK1W7QVEI4Uzg1ga36aQDorjmu70Gzz09xRJEyZF6pfuk0qZozGwhxW1Su6TZY9ppqITvXE+xDDHQABP+JHYk68t4d3G9e0lD3HF2jhkOM/tWw5v10nhULtXmsbNq8tzvTeQfq/HdyOvNPTFQS94nVSJrUgjhYpSe8UDO21Pyu6nzEknW5YoWbLkS3xvUvFiV8Lx+q7b6ISXdipWZAeAtFT7aWbkIfZ/nrtsMmGufVKk0iF3ed1xXtgO/AB6j2B37S+B/Upxx3V2hd1MnYc8uQG3YcRqwFuf7yBPxIDC/jCtHazSNnIpu8zVMiDX0Azz7HFq//KQslmfIfEcl8xpH8fgz/K77y8W22CmupUhIcX8U7w3AdjPbU7cHirMp/4PiREDVuAVYWMYyRYeCtRo4s4LVWwO8u9uUuIl8bSLN3HUs6iGEIYod2FWl613uLdhgAXAn1drtfwvw+7kGxZW+qCDmdP4QRba5V1Q8yn4E+D7w98CaMqKazO9mFkV63ypsbLyS4mjQcA3t2AN8CriC8s9e/y2wuGIzQ1U/jlWpKDZOQy/aTz/fQ3EkdxJFopzJo/48Yt/h+HsH+u/LRmnGpH3+3rOPnuwFXgS+Amw2s8cz+swCivwjc0p8lZ8HrsjdJ9Xm5qFRjvrHlDdduQO4G/hH4J+Ah+oQDWZ4Nwtj1P4fMn7tXcDHPVP9lmDHfuDTwH8BpmT62nuBv4gbjapql6YdVRqLLFOzE6Rf6qWY6b2UIs9Ijj7p02Vu6uyp+ct6NUW2ngXACRT3/bY7FbwdeJIiM9AjwOPAIEVu303x/22UcLcVuf8pcA7wG4mK3Upx1eH/Av6u7KngTHacRrEr+GKK611TRKl7o39/DfhCO9kTK2CPOqyTpmKq+pvk/jMZ+G3go8CpiQbMT1PcAnltvDq8dHoa/PIOA15DkQJxROQ3UaxhbwKer+Madk3fRaCYVXntqH/qiyK1C9h3incjsA54ukrTvyXbsSdGGccCx436p8lAL8W06M79fPQBanKRSBvC/u04mFeULrrxpUNjn7TvLvlefrXUMLr/eTy2JauqdvTotQohatgRXwucBsxq4jOWfVxV1JPJMoEQok5Mnz59D8VM20yK28SGKWZ6eiimUnsa8IxXDQ4OKumWaItJMoEQombMBN4e/7we+DDFuugsiqNbUyiyUK6Kwl9HFug1i3bplQmEEFUmhPBK4H3AH1BsfJ0Sg5EXKDb4fWc/ey3uo7jacqSMyRSbNM8B/jNwIjCjwo+9ELhNb1+0g9ZphBBVFPFe4Ebg9xh/R/KwmU3q4nuOBs4A3g28IQr/1JJN8F0zO12eICToQog6i/nnKZJJtcN7zeybievRR3EJyBkUR57eRJGcJQePmdnR8gYhQRdC1FHIu8nfPtPMNmes53uBPwTejM9epC1mdoS8QkjQhRATScyhxGQsIYQZwErg7ITFPm9mL5dniHbQLnchRBXo6ma1MjOrmdkWMzuHIpnVtkTFKumVkKALIWoXnV/eZRFPV+E5zOwFMzskkahvlWcICboQom5c1eXnByr2PPMSlLFRbiEk6EKIOkXn0xIU85MqPZOZrQee7bKYr8g7hARdCFEnXp+gjG0VfK4VXX7+23INIUEXQtSJtycoY37TjGJmG+QaQoIuhKgT32uooJ/SxWcvkVuITtA5dCFEaSQ4fz4S0fZU7LmGm/IsQhG6EEK0Il6DiQT04gqJ+WJF50IRuhBiIkbp/x24rglResz/vqPDjz9qZsfII4QEXQhRZ1EfTlDMOjM7oWQx30TnF7hMTzVjISYmmnIXQlSBJQnKOD6E8MOSxLw/RuadivlciblQhC6EaEqUvpY0WdZGBPK+DHWeAXyny3pfYmbXyQOEBF0I0RRB72b9eX88ApxnZmsS17OH4m70rwHdrnkvMbMb9PaFBF0I0TRRnwU84VD0OuCfgVuj0D8HDAJ7zGz4AHWZDPQBhwLHAguBtwHH12kWQUjQhRCiaaJeFdYDJ2rNXEjQhRAS9fqiKXYhQRdCTEhhXwYsbcCjrDKzC/VGhQRdCDGRRb0PWA2cXcPqrwbON7MhvUkhQRdCCF7aXf4Z4OMVr+pe4GPAVQfacCeEBF0IIQpxPy2K5n+sWDR+depjckJI0IUQE0XcFwCXAe8BDsr41duB/wNcaWbr9SaEBF0IIdIK/Mi58bOBo4HZwCzgcGByG0XtoTiv/kj8eRz438DDOnImJOhCCFG+4I8kjJm6n3/eAew0s92ylBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghSuX/A4Sx5S45IWohAAAAAElFTkSuQmCC',
        
        // Check interval for logo replacement (milliseconds)
        CHECK_INTERVAL: 2000, // Increased from 500ms to reduce CPU usage
        
        // Throttle for MutationObserver callbacks  
        MUTATION_THROTTLE: 300, // Increased from 100ms to reduce frequency
        
        // Service-specific settings
        SERVICES: {
            search: { enabled: true, fastCheck: true },
            drive: { enabled: true, fastCheck: false },
            maps: { enabled: true, fastCheck: false },
            mail: { enabled: true, fastCheck: false },
            photos: { enabled: true, fastCheck: false },
            calendar: { enabled: true, fastCheck: false },
            meet: { enabled: true, fastCheck: false },
            default: { enabled: true, fastCheck: false }
        }
    };

    // ===================== State Management =====================
    const state = {
        lastMutationTime: 0,
        intervalId: null,
        fastIntervalId: null,
        forceReplaceCount: 0,
        maxForceReplace: 5, 
        pageLoadTime: Date.now(),
        stylesInjected: false,
        currentService: null,
        progressiveInterval: 500, // Starting interval
        progressiveStep: 200, // Increment by 200ms each time
        maxProgressiveInterval: 1000, // Maximum interval
        darkModeCache: null, // Cache dark mode result
        lastDarkModeCheck: 0 // Timestamp of last check
    };

    // ===================== Utility Functions =====================
    
    // Get current Google service
    function getCurrentService() {
        const hostname = window.location.hostname;
        if (hostname.includes('drive.google.com')) return 'drive';
        if (hostname.includes('maps.google.com')) return 'maps';
        if (hostname.includes('mail.google.com')) return 'mail';
        if (hostname.includes('photos.google.com')) return 'photos';
        if (hostname.includes('calendar.google.com')) return 'calendar';
        if (hostname.includes('meet.google.com')) return 'meet';
        if (hostname.includes('google.com') && window.location.pathname.includes('/search')) return 'search';
        return 'default';
    }
    
    // Check if dark mode is enabled by analyzing actual page colors
    function isDarkMode() {
        // console.log('[Google Zen] isDarkMode() called, readyState:', document.readyState);
        
        // Use cache if available and body exists, but only if we have a reliable result
        const now = Date.now();
        if (state.darkModeCache !== null && document.body && (now - state.lastDarkModeCheck < 5000)) {
            // console.log('[Google Zen] Using cached dark mode result:', state.darkModeCache);
            return state.darkModeCache;
        }
        
        // Clear cache if document became ready but we only have media query result
        if (document.readyState !== 'loading' && document.body && state.darkModeCache !== null) {
            // console.log('[Google Zen] Document ready, clearing cache to re-check with body');
            state.darkModeCache = null;
        }
        
        // First check body background color
        const body = document.body;
        if (!body) {
            // console.log('[Google Zen] Body not found, waiting for DOM... readyState:', document.readyState);
            
            // Fallback to media query when body is not available
            const mediaQueryResult = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            // console.log('[Google Zen] Using media query result:', mediaQueryResult);
            return mediaQueryResult;
        }
        
        // Get computed style of body
        const bodyStyle = window.getComputedStyle(body);
        const bgColor = bodyStyle.backgroundColor;
        
        // Debug: log the background color
        // console.log('[Google Zen] Body background color:', bgColor);
        
        // Parse RGB values (handle both rgb() and rgba() formats)
        const match = bgColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            
            // Calculate brightness (0-255)
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
            // Debug: log brightness calculation
            // console.log('[Google Zen] RGB:', r, g, b, 'Brightness:', brightness, 'Dark mode:', brightness < 128);
            
            // Consider it dark mode if brightness is below 128
            const result = brightness < 128;
            
            // Cache the result
            state.darkModeCache = result;
            state.lastDarkModeCheck = Date.now();
            
            return result;
        }
        
        // If background is transparent or not set, check parent elements
        let currentElement = body.parentElement;
        while (currentElement && currentElement !== document.documentElement) {
            const elementStyle = window.getComputedStyle(currentElement);
            const elementBgColor = elementStyle.backgroundColor;
            
            if (elementBgColor && elementBgColor !== 'rgba(0, 0, 0, 0)' && elementBgColor !== 'transparent') {
                const parentMatch = elementBgColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                if (parentMatch) {
                    const r = parseInt(parentMatch[1]);
                    const g = parseInt(parentMatch[2]);
                    const b = parseInt(parentMatch[3]);
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    const result = brightness < 128;
                    
                    // Cache the result
                    state.darkModeCache = result;
                    state.lastDarkModeCheck = Date.now();
                    
                    return result;
                }
            }
            currentElement = currentElement.parentElement;
        }
        
        // Check for specific dark theme classes or attributes
        const htmlElement = document.documentElement;
        if (htmlElement.classList.contains('dark') || 
            htmlElement.getAttribute('data-theme') === 'dark' ||
            body.classList.contains('dark-theme') ||
            body.classList.contains('night-mode')) {
            return true;
        }
        
        // Fallback to media query
        const mediaResult = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // console.log('[Google Zen] Final fallback to media query:', mediaResult);
        
        // Cache the result
        state.darkModeCache = mediaResult;
        state.lastDarkModeCheck = Date.now();
        
        return mediaResult;
    }

    // Get filter for dark mode (invert brightness)
    function getDarkModeFilter() {
        // console.log('[Google Zen] getDarkModeFilter() called');
        const darkMode = isDarkMode();
        // console.log('[Google Zen] Dark mode result:', darkMode);
        return darkMode ? 'invert(.9)' : 'none';
    }

    // Force update all existing logo filters
    function updateExistingLogoFilters() {
        // console.log('[Google Zen] Updating existing logo filters');
        const filter = getDarkModeFilter();
        
        // Update all custom logo images
        document.querySelectorAll('img[src^="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAACWCAYAAAAonXpv"]').forEach(img => {
            img.style.setProperty('filter', filter, 'important');
        });
        
        // Update logo containers
        document.querySelectorAll('.custom-logo-cropped img').forEach(img => {
            img.style.setProperty('filter', filter, 'important');
        });
        
        // Update any other logos that might have the filter applied
        document.querySelectorAll('img[style*="filter"]').forEach(img => {
            if (img.src.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAACWCAYAAAAonXpv')) {
                img.style.setProperty('filter', filter, 'important');
            }
        });
    }

    // Check if Doodle is present
    function hasDoodle() {
        const pictureElement = document.querySelector('picture');
        if (pictureElement) {
            const img = pictureElement.querySelector('img#hplogo');
            if (img && img.src && !img.src.startsWith('data:')) return true;
        }
        
        const logoLink = document.querySelector('a#logo > img');
        if (logoLink && logoLink.src && !logoLink.src.includes('googlelogo') && !logoLink.src.startsWith('data:')) {
            return true;
        }
        
        return false;
    }
    
    // Normalize tagName for comparison (always uppercase)
    function normalizeTagName(element) {
        return element.tagName ? element.tagName.toUpperCase() : '';
    }

    // Create cropped logo container for icon use
    function createCroppedLogoContainer(size) {
        const container = document.createElement('div');
        container.className = 'custom-logo-cropped';
        container.style.width = size + 'px';
        container.style.height = size + 'px';
        // container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        container.style.verticalAlign = 'middle';
        
        const img = document.createElement('img');
        img.src = CONFIG.LOGO_BASE64;
        img.style.position = 'absolute';
        img.style.left = '0';
        img.style.top = '0';
        img.style.width = Math.round(500 * (size / 141)) + 'px';
        img.style.height = Math.round(150 * (size / 141)) + 'px';
        img.style.filter = getDarkModeFilter();
        img.style.imageRendering = 'auto';
        
        container.appendChild(img);
        return container;
    }

    // ===================== Style Injection =====================
    
    // Inject CSS styles for service logos
    function injectServiceStyles() {
        if (state.stylesInjected) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'google-zen-styles';
        styleElement.textContent = `
            /* Prefer Roman Font */
            span:not(.google-symbols):not(.material-icons-extended):not(:has(.google-symbols)),
            div:not(.google-symbols):not(.material-icons-extended):not(:has(.google-symbols)) {
                font-family: 'Noto Serif JP', serif !important;
            }
            
            [data-viewfamily="EVENT_EDIT"] [role="toolbar"] [role="button"] span > span > span,
            [data-viewfamily="EVENT_EDIT"] [role="tabpanel"] [jsshadow] > div > [aria-hidden="true"] .google-material-icons span {
                font-family: "Material Icons Extended" !important;
            }

            a:link:not(.google-symbols) > h3:not(.google-symbols) {
                font-family: 'Noto Serif JP', serif !important;
                color: ${isDarkMode() ? '#94a6bf' : '#3e5778' };
            }
            
            a:visited:not(.google-symbols) > h3:not(.google-symbols) {
                font-family: 'Noto Serif JP', serif !important;
                color: ${isDarkMode() ? '#c4b1d6' : '#6e5983'};
            }
            
            /* Google logo when scrolling */
            div.minidiv #hplogo {
                width: 120px !important;
                margin-top: -6px;
            }
            
            div.minidiv #logo {
                top: -6px;
                right: 7px;
            }
            
            div.minidiv > div:not(:has(div)) {
                background: ${isDarkMode() ? 'rgb(31, 31, 31) !important' : ''};
            }
            
            div.minidiv >[role="navigation"] {
                background: ${isDarkMode() ? '#202124 !important' : ''};
            }
            
            /* AI mode logo replacement*/
            [data-xid="aim-zero-state"] div:has(div > [role="heading"]) > div > div:not(:has([role="heading"])) {
                display: none;
            }
            
            [data-xid="aim-zero-state"] div:has(div > [role="heading"]) > div > div:has([role="heading"])::before {
                content: url(${CONFIG.LOGO_BASE64}) !important;
                zoom: .544;
                background-size: contain;
                filter: ${getDarkModeFilter()} !important;
                margin-top: 47px;
                margin-bottom: 47px;
                transition: opacity .7s ease-in-out !important;
            }
            
            div:has(div > [data-xid="aim-zero-state"]):not(:has([data-xid="aim-mars-turn-root"])) {
                margin-left: -38px;
            }
            
            body > header > header > div > a > div > img {
                visibility: hidden;
                opacity: 0;
                transition: opacity .7s ease-in-out !important;
            }
            
            body:has([data-xid="aim-mars-turn-root"] [data-processed="true"]) header > header > div > a > div > img {
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            div:has(div > div[style="display: none;"] > #aim-lhs-panel-threads-view-container) > div:has(button),
            div:has(div > div[style="display: none; overflow: auto;"] > #aim-lhs-panel-threads-view-container) > div:has(button) {
                background: transparent;
            }
            
            @media(max-width:1419px) {
                body:has([data-xid="aim-mars-turn-root"] [data-processed="true"]) header > header > div > a > div > img {
                    zoom: 0.65;
                    margin-top: 10px;
                }
            }
            
            /* Mobile */
            
            #gb-main img#hplogo {
                width: 163px !important;
            }
            
            header > div > a[aria-label="Google"] > svg {
                display: none;
            }
            
            header > div > a[aria-label="Google"]::before {
                content: url(${CONFIG.LOGO_BASE64}) !important;
                filter: ${getDarkModeFilter()} !important;
                zoom: .21;
                margin-left: -30px;
            }
            
            /* Common Bento menu iframe grayscale */
            iframe[src*="ogs.google.com"] {
                filter: grayscale(100%)contrast(170%) !important;
            }
            
            /* Hide Chrome recommendations */
            body > c-wiz:has(a[href^="https://www.google.com/url?q=https://www.google.com/chrome/"]) {
                display: none !important;
            }
            
            /* Footer opacity control on homepage */
            div[role="contentinfo"], #fbar {
                opacity: 0 !important;
                transition: opacity .2s ease-in-out !important;
            }
            
            div[role="contentinfo"]:hover, #fbar:hover {
                opacity: 1 !important;
            }
            
            /* Pattern 1 - Services with span[role="presentation"] */
            #gb > div > div > div > div > a:has(span[role="presentation"]) > span:not([role="presentation"]) {
                font-family: serif !important;
                font-weight: bold !important;
            }
            
            #gb > div > div > div > div > a > span[role="presentation"] {
                background-image: url(${CONFIG.LOGO_BASE64}) !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                filter: ${getDarkModeFilter()} !important;
            }
            
            #gb > div > div > div > div > a > span[role="presentation"]::before {
                content: "" !important;
                background-image: none !important;
            }
            
            /* Pattern 2 - Services with img[role="presentation"] */
            #gb > div > div > div > div > a:has(img[role="presentation"]) > span:not([role="presentation"]), 
            #gb > div > div > div > div > span:has(img[role="presentation"]) > span:not([role="presentation"]) {
                font-family: serif !important;
                font-weight: bold !important;
            }
            
            #gb > div > div > div > div > a > img[role="presentation"], 
            #gb > div > div > div > div > span > img[role="presentation"] {
                filter: grayscale(100%)contrast(170%) !important;
                width: 40px !important;
                object-fit: cover;
                object-position: left;
            }
            
            /* Google Image Search specific */
            body > div > div > div > img[data-defe="1"] {
                visibility: hidden;
            }
            
            body:not(:has([data-doodle="1"])) > div:not(#main) > div:has(div > img[data-defe="1"]) > div {
                background-image: url(${CONFIG.LOGO_BASE64}) !important;
                filter: ${getDarkModeFilter()} !important;
                background-size: contain;
                width: 300px;
            }
            
            body:not(:has([data-doodle="1"])) > div:not(#main) > div:has(div > img[data-defe="1"]) > div > span {
                filter: ${getDarkModeFilter()} !important;
            }
            
            /* Google Maps specific */
            #settings > div > div > ul > div > div > img {
                content: url(${CONFIG.LOGO_BASE64}) !important;
                filter: ${getDarkModeFilter()} !important;
            }
            
            /* Google Play specific */
            body > c-wiz > header > nav > a {
                filter: grayscale(100%)contrast(170%) !important;
            }
            
            body > c-wiz > header > nav > a > span:not([role="presentation"]) {
                font-family: serif !important;
                font-weight: bold !important;
            }
            
            /* Google Photos specific */
            body > div > div > c-wiz > c-wiz > div > div > div > div > div > div > a > span:not([title="Google"]) {
                font-family: serif !important;
                font-weight: bold !important;
            }
            
            body > div > div > c-wiz > c-wiz > div > div > div > div > div > div > a > span[title="Google"] {
                background-image: url(${CONFIG.LOGO_BASE64}) !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                filter: ${getDarkModeFilter()} !important;
            }
            
            body > div > div > c-wiz > c-wiz > div > div > div > div > div > div > a > span[title="Google"]::before {
                content: "" !important;
                background-image: none !important;
            }
            
            /* Google Shopping specific */
            body > div > div > div > img {
                filter: grayscale(100%)contrast(170%) !important;
            }
        `;
        
        if (document.head) {
            document.head.appendChild(styleElement);
            state.stylesInjected = true;
            console.log('[Google Zen] Styles injected');
        } else {
            // Wait for head element
            setTimeout(injectServiceStyles, 100);
        }
    }

    // ===================== Logo Replacement Functions =====================
    
    // Replace main page logo
    function replaceMainPageLogo() {
        // Multiple selectors for main page logo - svg[aria-label="Google"]を優先
        const selectors = [
            'svg[aria-label="Google"]',
            'img#hplogo',
            'picture > img#hplogo', 
            'picture > svg#hplogo',
            'div[data-hveid] img[alt="Google"]',
            'img[alt="Google"][height="92"]'
        ];
        
        let hplogo = null;
        for (const selector of selectors) {
            hplogo = document.querySelector(selector);
            if (hplogo) break;
        }
        
        if (!hplogo) return false;
        
        const tagName = normalizeTagName(hplogo);
        
        // Check if already replaced
        if (tagName === 'IMG' && hplogo.src === CONFIG.LOGO_BASE64) {
            // Ensure parent styles
            const pictureElement = hplogo.closest('picture');
            if (pictureElement) {
                const parentDiv = pictureElement.parentElement?.parentElement;
                if (parentDiv && normalizeTagName(parentDiv) === 'DIV') {
                    parentDiv.style.height = 'auto';
                }
            }
            return false;
        }
        
        if (!CONFIG.REPLACE_ON_DOODLE && hasDoodle()) {
            console.log('[Google Zen] Doodle detected, skipping main logo');
            return false;
        }
        
        if (tagName === 'SVG' || tagName === 'IMG') {
            const img = document.createElement('img');
            img.id = 'hplogo';
            img.src = CONFIG.LOGO_BASE64;
            img.style.width = '272px';
            img.style.height = 'auto';
            img.style.setProperty('filter', getDarkModeFilter(), 'important');
            img.dataset.customLogo = 'true';
            img.alt = 'Google';
            
            hplogo.parentElement.replaceChild(img, hplogo);
            
            // Set parent styles
            const pictureElement = img.closest('picture');
            if (pictureElement) {
                const parentDiv = pictureElement.parentElement?.parentElement;
                if (parentDiv && normalizeTagName(parentDiv) === 'DIV') {
                    parentDiv.style.height = 'auto';
                }
            }
            
            console.log('[Google Zen] Main page logo replaced');
            return true;
        }
        
        return false;
    }

    // Replace search results page header logo
    function replaceSearchPageLogo() {
        const selectors = [
            'a#logo',
        ];
        
        let logoLink = null;
        for (const selector of selectors) {
            logoLink = document.querySelector(selector);
            if (logoLink && logoLink.id === 'logo') break;
            if (logoLink) {
                const hasLogoContent = logoLink.querySelector('svg, img') || 
                                      logoLink.children.length > 0;
                if (hasLogoContent) break;
            }
        }
        
        if (!logoLink) return false;
        
        const existingCustom = logoLink.querySelector('img[data-custom-logo="true"]');
        const needsReplacement = !existingCustom || 
                                existingCustom.src !== CONFIG.LOGO_BASE64 ||
                                existingCustom.style.width !== '120px' ||
                                state.forceReplaceCount > 0;
        
        if (needsReplacement) {
            const targetElement = logoLink.querySelector('svg, img:not([data-custom-logo])') ||
                                logoLink.children[0];
            
            if (!CONFIG.REPLACE_ON_DOODLE && targetElement && normalizeTagName(targetElement) === 'IMG' && hasDoodle()) {
                console.log('[Google Zen] Doodle detected in search page');
                return false;
            }
            
            const img = document.createElement('img');
            img.src = CONFIG.LOGO_BASE64;
            img.style.width = '120px';  
            img.style.height = '36px';   
            img.style.objectFit = 'contain';
            img.style.filter = getDarkModeFilter();
            img.style.display = 'block';
            img.dataset.customLogo = 'true';  
            
            logoLink.innerHTML = '';
            logoLink.appendChild(img);
            
            console.log('[Google Zen] Search page logo replaced');
            return true;
        }
        
        return false;
    }

    // Replace AI mode (udm=50) single character logo - 簡易化されたセレクタ
    function replaceAIModeLogo() {
        if (!window.location.search.includes('udm=50')) {
            return false;
        }
        
        const selectors = [
            'body > header > header > div > a:not([role="button"])',
            'body > header > header > a:has(svg[focusable="false"])'
        ];
        
        let aiLogoLink = null;
        for (const selector of selectors) {
            const elem = document.querySelector(selector);
            if (elem) {
                // 簡易化された条件：子要素があるか確認するだけ
                if (elem.querySelector('svg, img, div > img') || elem.children.length > 0) {
                    aiLogoLink = elem;
                    break;
                }
            }
        }
        
        if (!aiLogoLink) return false;
        
        // Apply styles to parent div
        const parentDiv = aiLogoLink.parentElement?.parentElement;
        if (parentDiv && normalizeTagName(parentDiv) === 'DIV') {
            parentDiv.style.left = '21px';
            parentDiv.style.top = '33px';
            //parentDiv.style.position = 'absolute';
        }
        
        // Apply styles to link
        aiLogoLink.style.display = 'inline-block';
        aiLogoLink.style.width = '34px';
        aiLogoLink.style.height = '34px';
        aiLogoLink.style.verticalAlign = 'middle';
        aiLogoLink.style.position = 'relative';
        
        const existingCustom = aiLogoLink.querySelector('.custom-logo-cropped');
        const existingImg = existingCustom?.querySelector('img');
        const needsReplacement = !existingCustom || 
                                !existingImg ||
                                existingImg.src !== CONFIG.LOGO_BASE64 ||
                                aiLogoLink.style.width !== '34px' ||
                                state.forceReplaceCount > 0;
        
        if (needsReplacement) {
            const targetElement = aiLogoLink.querySelector('svg, img:not(.custom-logo-cropped img), div > img') ||
                                aiLogoLink.children[0];
            
            if (!CONFIG.REPLACE_ON_DOODLE && targetElement && normalizeTagName(targetElement) === 'IMG' && targetElement.width > 34) {
                console.log('[Google Zen] Doodle detected in AI mode');
                return false;
            }
            
            const croppedLogo = createCroppedLogoContainer(34);
            croppedLogo.style.position = 'relative';
            croppedLogo.style.verticalAlign = 'middle';
            
            aiLogoLink.innerHTML = '';
            aiLogoLink.appendChild(croppedLogo);
            
            aiLogoLink.style.display = 'inline-block';
            aiLogoLink.style.width = '34px';
            aiLogoLink.style.height = '34px';
            aiLogoLink.style.verticalAlign = 'middle';
            aiLogoLink.style.position = 'relative';
            
            // console.log('[Google Zen] AI mode logo replaced with cropped image');
            return true;
        } else if (existingCustom) {
            aiLogoLink.style.display = 'inline-block';
            aiLogoLink.style.width = '34px';
            aiLogoLink.style.height = '34px';
            aiLogoLink.style.verticalAlign = 'middle';
            aiLogoLink.style.position = 'relative';
        }
        
        return false;
    }

    // Replace Google Maps logo
    function replaceGoogleMapsLogo() {
        if (!window.location.hostname.includes('maps.google.com')) return false;
        
        const logoImg = document.querySelector('#settings > div > div > ul > div > div > img');
        if (logoImg && logoImg.src !== CONFIG.LOGO_BASE64) {
            logoImg.src = CONFIG.LOGO_BASE64;
            logoImg.style.filter = getDarkModeFilter();
            // console.log('[Google Zen] Google Maps logo replaced');
            return true;
        }
        return false;
    }

    // Replace all logos
    function replaceAllLogos() {
        const shouldLog = state.forceReplaceCount > 0 || state.progressiveInterval <= 200;
        
        if (state.forceReplaceCount > 0) {
            state.forceReplaceCount--;
            if (shouldLog) {
                console.log(`[Google Zen] Force replace mode: ${state.forceReplaceCount} remaining (interval: ${state.progressiveInterval}ms)`);
            }
        }
        
        const mainResult = replaceMainPageLogo();
        const searchResult = replaceSearchPageLogo();
        const aiResult = replaceAIModeLogo();
        const mapsResult = replaceGoogleMapsLogo();
        
        if (shouldLog && (state.forceReplaceCount > 0 || (searchResult || aiResult || mapsResult))) {
            console.log(`[Google Zen] Status - Main: ${mainResult}, Search: ${searchResult}, AI: ${aiResult}, Maps: ${mapsResult}`);
        }
        
        if (!searchResult && document.querySelector('a#logo, div.logo')) {
            setTimeout(() => {
                replaceSearchPageLogo();
            }, 100);
        }
        
        if (!aiResult && window.location.search.includes('udm=50')) {
            setTimeout(() => {
                replaceAIModeLogo();
            }, 100);
        }
    }
    
    // Set up Google Fonts
    function loadGoogleFonts() {
       const head = document.head || document.getElementsByTagName('head')[0];
    
       const preconnect1 = document.createElement('link');
       preconnect1.rel = 'preconnect';
       preconnect1.href = 'https://fonts.googleapis.com';
       head.appendChild(preconnect1);
    
       const preconnect2 = document.createElement('link');
       preconnect2.rel = 'preconnect';
       preconnect2.href = 'https://fonts.gstatic.com';
       preconnect2.setAttribute('crossorigin', '');
       head.appendChild(preconnect2);
    
       const stylesheet = document.createElement('link');
       stylesheet.rel = 'stylesheet';
       stylesheet.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap';
       head.appendChild(stylesheet);
   }


    
    // ===================== Execution Control =====================
    
    // Initialize logo replacer with DOM monitoring
    function initLogoReplacer() {
        // Inject styles
        injectServiceStyles();
        
        // Determine current service
        state.currentService = getCurrentService();
        const serviceConfig = CONFIG.SERVICES[state.currentService] || CONFIG.SERVICES.default;
        
        // Reset counters
        state.forceReplaceCount = state.maxForceReplace;
        state.progressiveInterval = 500; // Reset to initial interval
        
        // Initial execution
        replaceAllLogos();
        
        // Set up Google Fonts
        loadGoogleFonts();
        
        // Progressive interval implementation
        function runProgressiveCheck() {
            replaceAllLogos();
            
            // Increase interval progressively
            if (state.progressiveInterval < state.maxProgressiveInterval && state.forceReplaceCount > 0) {
                state.progressiveInterval = Math.min(state.progressiveInterval + state.progressiveStep, state.maxProgressiveInterval);
                
                // Schedule next check with new interval
                if (state.fastIntervalId) {
                    clearTimeout(state.fastIntervalId);
                }
                state.fastIntervalId = setTimeout(runProgressiveCheck, state.progressiveInterval);
            } else if (state.forceReplaceCount <= 0) {
                // Stop progressive checks when force replace count reaches 0
                if (state.fastIntervalId) {
                    clearTimeout(state.fastIntervalId);
                    state.fastIntervalId = null;
                    console.log('[Google Zen] Progressive checking completed');
                }
            }
        }
        
        // Start progressive checking only for services that need it
        if (serviceConfig.fastCheck) {
            state.fastIntervalId = setTimeout(runProgressiveCheck, state.progressiveInterval);
        }
        
        // Set up regular periodic checking
        if (state.intervalId) {
            clearInterval(state.intervalId);
        }
        state.intervalId = setInterval(replaceAllLogos, CONFIG.CHECK_INTERVAL);
        
        // Monitor DOM changes with MutationObserver
        const observer = new MutationObserver((mutations) => {
            const now = Date.now();
            if (now - state.lastMutationTime < CONFIG.MUTATION_THROTTLE) {
                return;
            }
            state.lastMutationTime = now;
            
            let shouldReplace = false;
            let navigationDetected = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    for (const node of addedNodes) {
                        if (node.nodeType === 1) {
                            const hasLogoElements = 
                                (node.id === 'hplogo' || node.id === 'logo') ||
                                (node.querySelector && (
                                    node.querySelector('#hplogo') ||
                                    node.querySelector('#logo') ||
                                    node.querySelector('a#logo') ||
                                    node.querySelector('picture') ||
                                    node.querySelector('svg[aria-label="Google"]')
                                ));
                            
                            const nodeTag = normalizeTagName(node);
                            if (nodeTag === 'HEADER' || nodeTag === 'MAIN' || 
                                node.classList?.contains('logo')) {
                                navigationDetected = true;
                            }
                            
                            if (hasLogoElements) {
                                shouldReplace = true;
                                break;
                            }
                        }
                    }
                }
                
                if (shouldReplace) break;
            }
            
            if (navigationDetected) {
                state.forceReplaceCount = state.maxForceReplace;
                state.progressiveInterval = 500; // Reset to initial interval
                console.log('[Google Zen] Navigation detected, resetting progressive check');
                
                // Clear any existing interval
                if (state.fastIntervalId) {
                    clearTimeout(state.fastIntervalId);
                    state.fastIntervalId = null;
                }
                
                // Restart progressive checking for services that need it
                const serviceConfig = CONFIG.SERVICES[state.currentService] || CONFIG.SERVICES.default;
                if (serviceConfig.fastCheck) {
                    function runProgressiveCheck() {
                        replaceAllLogos();
                        
                        if (state.progressiveInterval < state.maxProgressiveInterval && state.forceReplaceCount > 0) {
                            state.progressiveInterval = Math.min(state.progressiveInterval + state.progressiveStep, state.maxProgressiveInterval);
                            state.fastIntervalId = setTimeout(runProgressiveCheck, state.progressiveInterval);
                        }
                    }
                    state.fastIntervalId = setTimeout(runProgressiveCheck, state.progressiveInterval);
                }
            }
            
            if (shouldReplace || navigationDetected) {
                setTimeout(replaceAllLogos, 50);
            }
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            const bodyObserver = new MutationObserver(() => {
                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    bodyObserver.disconnect();
                    replaceAllLogos();
                }
            });
            bodyObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    // Monitor dark mode changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            console.log('[Google Zen] Dark mode changed:', e.matches);
            state.forceReplaceCount = state.maxForceReplace;
            
            if (state.fastIntervalId) {
                clearInterval(state.fastIntervalId);
            }
            state.fastIntervalId = setInterval(() => {
                replaceAllLogos();
            }, 200);
            setTimeout(() => {
                if (state.fastIntervalId) {
                    clearInterval(state.fastIntervalId);
                    state.fastIntervalId = null;
                }
            }, 3000);
            
            replaceAllLogos();
        });
    }

    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            state.forceReplaceCount = state.maxForceReplace;
            replaceAllLogos();
        });
    } else {
        state.forceReplaceCount = state.maxForceReplace;
        replaceAllLogos();
    }
    
    // Also monitor readyState changes
    document.addEventListener('readystatechange', () => {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            console.log(`[Google Zen] Document ready state: ${document.readyState}`);
            setTimeout(replaceAllLogos, 100);
        }
    });

    // Clean up on page unload
    window.addEventListener('unload', () => {
        if (state.intervalId) {
            clearInterval(state.intervalId);
        }
        if (state.fastIntervalId) {
            clearInterval(state.fastIntervalId);
        }
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        console.log('[Google Zen] Browser navigation detected');
        state.forceReplaceCount = state.maxForceReplace;
        
        if (state.fastIntervalId) {
            clearInterval(state.fastIntervalId);
        }
        state.fastIntervalId = setInterval(() => {
            replaceAllLogos();
        }, 200);
        setTimeout(() => {
            if (state.fastIntervalId) {
                clearInterval(state.fastIntervalId);
                state.fastIntervalId = null;
            }
        }, 3000);
        
        setTimeout(replaceAllLogos, 100);
    });

    // Initialize
    initLogoReplacer();
    
    // Force dark mode recheck when document becomes ready
    function recheckDarkMode() {
        if (document.readyState !== 'loading' && document.body) {
            // console.log('[Google Zen] Document ready, forcing dark mode recheck');
            const oldCache = state.darkModeCache;
            state.darkModeCache = null;
            state.lastDarkModeCheck = 0;
            
            // Get new dark mode result
            const newDarkMode = isDarkMode();
            // console.log('[Google Zen] Dark mode changed from cached to actual:', oldCache, '->', newDarkMode);
            
            // Force re-injection of styles if dark mode changed
            if (oldCache !== newDarkMode) {
                console.log('[Google Zen] Dark mode changed, re-injecting styles');
                state.stylesInjected = false;
                injectServiceStyles();
                
                // Force update all existing logos and filters
                updateExistingLogoFilters();
                replaceAllLogos();
            }
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', recheckDarkMode);
        document.addEventListener('readystatechange', recheckDarkMode);
    } else {
        recheckDarkMode();
    }
    
    // Monitor URL changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('[Google Zen] URL changed, resetting force replace');
            state.forceReplaceCount = state.maxForceReplace;
            
            if (state.fastIntervalId) {
                clearInterval(state.fastIntervalId);
            }
            state.fastIntervalId = setInterval(() => {
                replaceAllLogos();
            }, 200);
            setTimeout(() => {
                if (state.fastIntervalId) {
                    clearInterval(state.fastIntervalId);
                    state.fastIntervalId = null;
                }
            }, 3000);
            
            setTimeout(replaceAllLogos, 100);
        }
    }).observe(document, {subtree: true, childList: true});
    
    console.log('[Google Zen] Script initialized');

})();
