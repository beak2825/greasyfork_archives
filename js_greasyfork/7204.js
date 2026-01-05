// ==UserScript==
// @name           Best
// @namespace      eRRFF
// @author         blackca
// @version        3.0
// @description    AscheN private RW
// @match          http://www.erepublik.com/en
// @include        http://www.erepublik.com/en
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/7204/Best.user.js
// @updateURL https://update.greasyfork.org/scripts/7204/Best.meta.js
// ==/UserScript==
var running = !1,
    scaning = !1,
    timeing = !1,
    battlefieldId = 0,
    nextmission = 100,
    cNum = 0,
    sNum = 0,
    tError = 0,
    echo = 0,
    echoRec = 0,
    echoTime = "nn:nn",
    token, senddata, gSound = "data:video/ogg;base64,T2dnUwACAAAAAAAAAAD0dwAAAAAAAPqhLK4BHgF2b3JiaXMAAAAAARErAAAAAAAAAH0AAAAAAACZAU9nZ1MAAAAAAAAAAAAA9HcAAAEAAABR78oBCy3///////////+1A3ZvcmJpcx0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDAzMDkwOQAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElmUJKYymVUlIpJRljEEpooXPUOSedg9RBiMUY44MxLtZia2kRUlYhJRlTDFtolVJUKQUZY1JKaKFz1jlGnXMUQifFCGOMLr62YltJHWPWMSYdU4pKKJ1j1DEGnWNQSggldBZCRyV00DkGxRhjjDHC1yJbiq3FnkrprYWMW0q11tpSKraVVGSKxRghfA5G9+JbSsUYY4wxxghjZMuB0JBVAAABAABABAFCQ1YBAAoAAMIwFEVRgNCQVQBABgCAABRFcRTHcSRHkizHAkJDVgEAQAAAAgAAGI7iKI4jOZJkSZrlaaIniqar67qu67pu27Zt27YNhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MAAAApAAAAAAAA9HcAAAIAAABWDEliKmVfY19eZGtoVFpjaWVgZm1jZmlvZ2lhY2NjaV5HUmNmZF9lZGRiYGFfW2qge4zVntUeFGKMddEdPm2++GRN1PrO/xsP2crzV5NTEs6s/xxJhP0p6t7FWUZvMdoHIVKo0CP1HvXBea/I6O//zms2w+glg4Hxu/hkAMg9OjR6vL2lBtQsDzzzaGeY2aln1CAAbiUaqjMMvroByrj09Pqxd2kn08l3/mHq3+2sd69M3BuF/BhX6+1P/zpxrMMnooG9FFRXMRQnehpvmJJ5hZUoMxz6SlZYP37FsU4EOpwOAq0vkQdeL4rkHTSenB37RAR2qRvmIgMAMUY4+M/su29zuF97vvWuYE35Zb9H2rNEOJ1Up+wwp8+WRTgwZypxrX0Q7kWoBcgPhvHSoVZNsNAazYUBaeUP7iqJl9xfnuKowpxi4uEem4snHskD1KjtLHiZtAN2KQZU106i9gPy+38/3J7xZJu/9v7RSK59DS6vjZ5JU49JyqOFX+6tt9sNqx8oBAc7FgYQW9QthrGNq1x8vFBR844itShr3DnR7/Pm/uERrSNIYGw+Ojo6ouVZfXU8JnosJoy2qqADgujDjAMby+3Lzw49Gf3ba2OGrye6rcV1U5bNlTUxuGdkHiVT7spEvUfHRnZ2Xe/r5mtQ2OrrAXuqGhTpYKvqx8Y5te66CtfQMlkgQlmngGF+KRQ6QgR+qVajDwv6Y9USfKJaBSgAIuykDme8JKLCV3Ky1UiOVSL5zP47xwhkibf6zux2KldJXlY5WR3g4LhVXOcd+O27LHWOcykY3E16X0rGJQuwVFhQB11wQRkXfoaUuC5ECREK5/oecu2BaXTKAQDAeW6AAhgoRgCzZz1YgGCL2d/Dtz0AxO2kzYOKEtr66Ind9i+PAl6Ci1xxxrMp+yjyQ/OlOJP7ZWzNoY/AbLa7cht8sVnTkVhnDS5XUM9WO15+uubhHJ48HRcNuSr1WGJyGgB+7eNdbTkAAMrpDAge2NMM6IACoIEE0N8fBMBn1Z9HDQIYTDtBANSly+1+uQSCefRoMgJwNq1ZAMKnnLMAdZa6Vt2J5DwL4rs2267tTQMQRXNifusQCmSgwH2JynQ1Uno8qxw7z/NMDYbn8FIvBzAAHwDo5YEdAzQo6ANjmACgf1s9IJS9bgMAn/cSAOrjC4QACJ4BgPopAPNtKADxap9J3ClqdKjXKZT8ZwMA0BmTPdpQAJf/P4CdEz4nAHrk80WxHACALgEk4wMCEJLAB5j8oQLAnBo6AGC1UxIA3v6vTlBp+3dO+6QCEgijZx1AGML7I1G9xF2iAkAMn7gu/7VRYH85un/uGGRmlF84Ce08fULYiqv1a2bjGwlYBgBwVWAAABYf0KUHgIut9bACQRL3UwFocvdo7AQZ1m493H1y+vrlV/cPzrf0hFDrJAtioi5MfxVsEBtiy8fbe3R0m6MOB6UaPHansKUbOO6ZZ0kOtCU9bN30UPmmBnLnMLspAwCoAA5MWAOYHKACFACA+dkCuGwKALfXMkC9vDYdFa2fabprGRjZGrtVXSvyfvzbb5GcXa+oAKuIAPXXfJk4rDkkLpwsQLSFYb+9P74qKyIoqLGgDOh3wihW2cXT9NM1v0tJAX6tpQ1EVwYAMCRgBwCjVSg+YH9yANDv/qEEwJN7ogDPfj3fbAAfn/dCMXz5OD40lRC3PTzj1WOJAKDRZV/pCgOA3v76iCKnI7IxjAkMnn15ZHsThOFtoGYdh9BRdEW63DUiu3UEeu1juVAOAKCzOACgVnyA/Y3RwdBw8fQmBdiCy6X77QaAZOnxX1fvDIBTjef/b+MPKanZ7LCF06rxw/y6d2fVVRJEuIbcB2MDVufX9x7n4UnEuK+9CVWe/ojlWuUwMpMEcnF/da4cAACGcQCoAwEFgA/gxNTZEkTmwYgxBwDHeZp6UBzwGO9e7CYCv97WLndbQeXQQjWAiGLd+4QblgIA3ORv/unMSOd3FnpgvBP9/skHunmcPqSX2cwb3Go9ZuKXdlK0ieoGau0wAw+wtyr+s+rAqLCrwoFxjVEDwNiwbvABsJJIhGF//tE474ByZL5/7+65AzDXX19fNwAomV+27wiAypMfNl9bCpcaj83jdpMKgPrqypAEAJ/u/D2mqGNuzO/8endNinJaj366HhSQJHppB1rhMAESGgBgCgAwAIAAoH9iIBj/+U6NoxBzQFKT6mhJzpE263zmJcZx+dFjAMU4IjESG4yHgij6x/BJnEAL06ZONmHfADJAt4O8F/2mBGC5QezCoeMjFRRIlGJWOMm+JG9yG25xG0YZAAB8nQp1FAABgGR+4QAKTkn30M2tzW7DoWJn886PT70AMDn1/P+tCkDz0oCzClrPSPX59Glji3v+jOmEw+dFZsTEwuH0FSOCskpgu0270Vo8W8XxNt4jWHF0fX/y4+QgA47vaLooBwAAYEcwmMCQcCiABcBOvxwFANsBJgDQHzmACwkAYd9jBQAAFS5QAAA/eG3SAQCoF3tPegEAKBxs9cYSAGRjrPfw9EOEIyGye5NlH8empADX+Sv7KQ8JANBIlfl6Q+mBL6ecCZKw9RqXAwAAoE8YGAEMiXEblWCJAW9f9R4JAAAAzE8TAADYbr+MAQCoZ33/6QUAIH7+s+dBwHEYX607//QqAFDPvnz989SEAEhdHHYPep0/KRCALVj/m/nVkYQA4OPJlRc6LzbW77HYJxmxvOqUbIqz9f5SBgAAbJ0DCrCtlo0BQE8a6wYA0PdxyAAAoL6Y+nezCwCA0vf8atcBgPjR6JMmP2g0AFzzkH4GCgAw/rJv31eGiQlpirjOE6+9PziSCEEAAG+pYTZhd+9bpR9h3E+vVx7HkQmKrZ2+H3sA4PhKAFufAqwTAOx0VQDwQ9UqAMCU/asld8G0muFKnhIHABhW96yzszQUAPzu0X4bSQkAhEZX8En8WhAAwGNMHjxxBYA4/+e/Lx78d+OpQRa01oa7h6frWbyUGEi4ORdpYAB2qmmM21IbP7EOAFz0XR7++crRB+9/+nhgMXV7v42nLwIaQ9P9ieq6ODSH0rbS8LTvj8kKc70N7Kj/He0bSGdmzYClOFYDnsX3kGeP6ViFW6HTVWRDfFoewvkzVZiBaJgDdqxpAmPT4AYAEkD0PVrSfnrwvt2MPh2/97T7Il7v8SBBpGmYzL3zjCZbVJgbifFp+vHZdhIULsck7bF8agpE24Kvo4WpMGt9rHOxD59MErbGDgJ82gX4g6oSqEW/yBD/6OEAeismPNTecoGaAxXAjywu42S8sTzxqi2b9UbAOD3d+zPV2lnqaU92yzBquoRSfIo3jNYMQ2uvEKOA78KQUhQ4zHVikXI4/8MUZe/3K7uu/e1h4RoFrOY07DaESew4Icx4rH4Bfqmc45Ek4J2AWQCoI/Wj10M/Y2rdx7WXUEYOp2shSiSLDmbF/n8kiycl5nleJqaOfDgih+tGT9nPjOLsB86vHmh2+t9o2oQu1zSEsxpwI865MOSjYHgGXRa5rAHbkw/bsMAFgq5l8coDBPpX/j+Ac2D7uTXQk0cATACrGgAIfpb6nZsvKV3p+rkFAAAXtn3+PZ4EAGr225FPd77ckiMIVldadCYLMhLAaj2Wl4wVYPf19JuHLvatGx4VVq+agp+pngEAmnBZdPlhUTIBjq1l/KUMAADs0oEDkH8+AWyA9dHBA0sMAOi/TgAAcPr60y4AAJwmXpoAABSmNOPrMQDgyakEAED8uDlpPFMAgOHLN2sAAMb30z7897gAgCbaEOK+VR6shvnj88cEAJrs6F57APDvCQFfcUAVQE8TMLMGOjABABxpw51ZqwAAgFojAADw8l8FAABno6tCAsA7u6smAAA8//cyAADInXt9gJcE8D4Bmu0YXikHAADAjoIDXwD0hAB8l+ADSAAwn04TAIBwdzUtAABg958ZAgCA3XmVWk0AcPLqzpSsGhTAu6PLelcBAN53HABiLNgxPT1x5pELvBGnAYaxpaEVFxCASQDAfDpArQ6wrxi2JWsBACBi+7r2GGtZGL9tQQIA1vU+WmUKAJDXzh++99VgFAA2Th62cf/i41ZgefHffzZ3u53xfGw0TbLp1VSdG0FSJ3ndN/hLunTizgtBD4qnRX57YDPA/gX0AQBGJsAPOACAjRIvh6q3dS73sj79QUMrBgBgd+N7t1SKAGhu7cdrLVHgrOeSUff/fnHuUlCouoR68enOupIsM0q9jca/7j+1c+9CiENQz5P55EchYhQTFK1UBH5q/2xZBgAAFAnAkgEACDC7XO/bEZwggfBy/tp8TmlQnINX0p6O0n4ZCMboYlgzvq4gHel1gI4FsYDRZc7/wTEr/M6kDRjpzHsTJofbzx4rHr0pLJFg124npoMvb5n68Kjf/ABy6fCOfACcf+UpwOA2ChoAxSe0a03roVM4rr/Xa6uqNrK2lrySvh3ZDhWiwHK+kWbIxvjq+zGdfLfg+tdzyUOOqH8dyYNnYqABvp7+uQrV1G/XssfbozBbP60AhW8COnaoxRyUAwCANfmuA6AB8H0A9j7RyJo5W93v0f9yv7AymAKlzTturn/shkashzn6l3pSjXxmqxdKrvG8udwCl3d77bF3lyAcA0jGiEKDFbj8K9QXb37fDEKewEteKVoW2dEm6nJwaufYGOABnP/kFNi0Glj7AAUA9qxpt4/Z5+HRdBIcTerymnG030SrZTl5tcd49aCv1TGhVCOIjMY/htEribLIKPU0XOXGiyzWD6V5BoF4LVJPt01z/BnSgHgYo1+LfF80SbjrQ25lNxgPi49VT2C6gkaA72NP8qBjd//68rDeWhTO9mfo2iu/r8wum9vRmmUghuXfnScn2YjSlofuo1dEuoq5PC+O3eEvDQ5JgTQ0aCoxPIWVop5kWJCdI3lPyWZNXp7i9Eg0rNNy4RABj0XfBgAGIPoRCodvaZXr0lmxIwRRV5+YiNN3n1svJk/n2STd6p08L3vmxExlEJK0hZwGKnKnkyhbTlc+cqGSujSmBc1KhkTtOt3x8RS/oEp7iBp8N9GKkFL7YTQxK2bfEFFGaztg8zjwfZ+QeufrR7Zc3EqESsSeuDc2k5N/b/33T//zhGqXaNP6FncN1ygBrcrxb019K049u32aHw6SbUNqqopRKCtz/CmA/9lsYYA/jyahu/beq5uoriMIaGKcBvZ8mR1g4jdAAUCo++uPkxvXLh/s+bom3xYLWF6uj9bCDHMsOe6lPxi1WoiTDCpx/mL3s5mazEybCS1vUWmL92FgENdCFsiyM6ie+b7jYTuEja2POPlYjg6x0syYyx1qmQnBYyY6jAo/+qw2P6dMrG15/eO7IeZ52rmfdizJ0zQp6aZbR4lc1LbfRqYMECV3CnTenZwC6Wuc/VNjJVEbaKDUkaawLe05fJnvy08fc5qqBDVazY1x6SHyU04+GmZWTRgawAhY/AKA+bNd//rW6m3j+YfeqIckr0bx4t2fG7vOvinj6u3sxY9miTrLEJ05LvGwpepMq1uIobOnxQcdJ7rQLWxEziEtdcS1h0Mtf+B4y7hhR0ESbABPZ2dTAATEKgAAAAAAAPR3AAADAAAAhNmi6AJcWmYTqzHWiQRQqxW8hoN+dre705uXki3NSsxsnLzWzn9e2ZhvDGuGOBqu/x3TEbkKw9oyzzKXVEO0ZIr8wW2EP5KjwElVBg9nfoZZyrtQ8U9srA5qNTSG3kG7Tg4Bag3vJfq+GoBy2vTj3XfufB94/vduuVwuaeLaQnLO+S63+3dBdY63ZVjb0rtc4DHKrU+S62nus04Lfm7LZZG6xvgfzegxSmZmOvO2J2n46aBq+e4ohHPOOQcG";
$(document).ready(function () {
    $("body").append('<audio id="gAudio"><source src="' + gSound + '"></audio>');
    $("#battle_listing").before('<table width="100%" border="1"><tr><td>Resistance Force Funder</td><td width="150px"><input id="rCmd" type="text" size="12"><input id="rBtn" type="button" value="RUN"></td></tr><tr><td colspan="2" height="20px">battle: <a id="battleLink" href="javascript:;" target="_blank"><font id="battleId"></font></a> - round: <font id="battleCrown"></font> - point: <font id="battlePoint"></font></td></tr><tr><td colspan="2" height="16px"><font id="rMsg"></font></td></tr></table>');
    $("input#rCmd").keypress(function (a) {
        runCmd(a)
    });
    $("input#rBtn").click(function () {
        btnFunc(this.value)
    });
    alveolus()
});
function nowtime() {
    var a = new Date,
        b = a.getHours(),
        a = a.getMinutes();
    10 > b && (b = "0" + b);
    10 > a && (a = "0" + a);
    return b + ":" + a
}
function btnFunc(a) {
    "RUN" == a ? ($("input#rBtn").val("STOP"), scaning = !1, running = !0, initiate() && checkHomepage()) : "STOP" == a && (running = scaning = !1)
}
function checkRound(a) {
    if (scaning) GM_xmlhttpRequest({
        method: "Get",
        url: "http://www.erepublik.com/en/military/battlefield/" + a,
        onload: function (b) {
            if (0 != $("#pvp", b.responseText).length) {
                var c = parseInt($("#popup_left_crowns", b.responseText).attr("crowns")) + 1,
                    b = parseInt($("#popup_right_crowns", b.responseText).attr("crowns")) + 1,
                    e = c > b ? c : b;
                9 > e && $("font#battleCrown").text(e);
                setTimeout(function () {
                    checkPoint(a, e)
                }, nextmission)
            } else 0 != $(".listing.resistance a.join", b.responseText).length ? (c = $(".listing.resistance a.join", b.responseText).attr("href"), jQuery.get(c, function () {
                setTimeout(function () {
                    checkRound(a)
                }, 3E3)
            })) : (10 > tError ? tError++ : scaning = !1, c = nowtime(), $("font#rMsg").append(c + "- unknown error: checkRound data failed.</br>"), setTimeout(function () {
                checkRound(a)
            }, 3E3))
        },
        onerror: function () {
            10 > tError ? tError++ : scaning = !1;
            var b = nowtime();
            $("font#rMsg").append(b + "- unknown error: checkRound request failed.</br>");
            setTimeout(function () {
                checkRound(a)
            }, 3E3)
        }
    });
    else {
        echo = echoRec = 0;
        var b = nowtime();
        10 < tError && $("font#rMsg").append(b + "- unknown error: force process suspend!</br>");
        $("font#rMsg").append(b + "- stop scaning Battlefield.</br>")
    }
    echo++
}
function checkPoint(a, b) {
    scaning ? GM_xmlhttpRequest({
        method: "Get",
        url: "http://www.erepublik.com/en/military/battle-log/" + a,
        onload: function (d) {
            if (getJSON(d.responseText)) {
                var c = jQuery.parseJSON(d.responseText),
                    d = parseFloat(c.domination).toFixed(2),
                    e = parseInt(c.points.attacker_points),
                    c = parseInt(c.points.defender_points),
                    f = e > c ? e : c;
                null == d ? $("font#battlePoint").text("finished!") : 1800 > f && 8 > b ? ($("font#battlePoint").text(e + " | " + c), setTimeout(function () {
                    checkPoint(a, b)
                }, 3E3)) : 1799 < f && 8 > b ? ($("font#battlePoint").text("preparing!"), setTimeout(function () {
                    checkRound(a)
                }, 3E3)) : 1720 > f && 8 == b ? ($("font#battlePoint").text(e + " | " + c), setTimeout(function () {
                    checkPoint(a, b)
                }, 3E3)) : 1720 < f && 1800 > f && 8 == b ? ($("font#battlePoint").text(e + " | " + c), setTimeout(function () {
                    btnFunc("RUN")
                }, nextmission)) : 1799 < f && 8 == b ? ($("font#battlePoint").text("preparing!"), setTimeout(function () {
                    checkRound(a)
                }, 3E3)) : 9 == b ? ($("font#battlePoint").text("finished!"), scaning = !1, setTimeout(function () {
                    checkRound(a)
                }, nextmission)) : (10 > tError ? tError++ : scaning = !1, d = nowtime(), $("font#rMsg").append(d + "- unknown error: checkPoint data failed.</br>"), setTimeout(function () {
                    checkPoint(a, b)
                }, 3E3))
            } else 10 > tError ? tError++ : scaning = !1, d = nowtime(), $("font#rMsg").append(d + "- unknown error: checkPoint json failed.</br>"), setTimeout(function () {
                checkPoint(a, b)
            }, 3E3)
        },
        onerror: function () {
            10 > tError ? tError++ : scaning = !1;
            var d = nowtime();
            $("font#rMsg").append(d + "- unknown error: checkPoint request failed.</br>");
            setTimeout(function () {
                checkPoint(a, b)
            }, 3E3)
        }
    }) : setTimeout(function () {
        checkRound()
    }, nextmission);
    echo++
}
function initiate() {
    var a = unsafeWindow.flc.getVariable("citizen_id");
    "4760571" != a && "6717999" != a && (running = !1, a = nowtime(), $("font#rMsg").append(a + "- sorry, invaild user</br>"));
    null != senddata && (senddata = "");
    0 != cNum && (cNum = 0, $("font#cNum").remove());
    0 != sNum && (sNum = 0, $("font#sNum").remove());
    0 != tError && (tError = 0);
    token = unsafeWindow.flc.getVariable("token");
    senddata = ["_token=" + token, "type=fund"];
    a = nowtime();
    $("font#rMsg").append(a + '- searching Resistance. <font id="cNum">(0)</font></br>');
    return !0
}
function checkHomepage() {
    if (running) GM_xmlhttpRequest({
        method: "Get",
        url: "http://www.erepublik.com/en",
        onload: function (a) {
            0 != $("ul.resistance_war", a.responseText).length ? (a = nowtime(), $("font#rMsg").append(a + '- supporting Resistance. <font id="sNum">(0)</font></br>'), checkResistance()) : (cNum++, $("font#cNum").text("(" + cNum + ")"), 99999 < sNum && (running = !1), setTimeout(function () {
                checkHomepage()
            }, nextmission))
        },
        onerror: function () {
            10 > tError ? tError++ : running = !1;
            var a = nowtime();
            $("font#rMsg").append(a + "- unknown error: checkHomepage request failed.</br>");
            setTimeout(function () {
                checkHomepage()
            }, nextmission)
        }
    });
    else {
        echo = echoRec = 0;
        var a = nowtime();
        10 < tError && $("font#rMsg").append(a + "- unknown error: force process suspend!</br>");
        $("font#rMsg").append(a + "- process finished!</br>");
        $("input#rBtn").val("RUN")
    }
    echo++
}
function checkResistance() {
    running ? GM_xmlhttpRequest({
        method: "post",
        url: "http://www.erepublik.com/en/military/rw-support",
        data: senddata.join("&"),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function (a) {
            getJSON(a.responseText) ? (a = jQuery.parseJSON(a.responseText), a.error ? (sNum++, $("font#sNum").text("(" + sNum + ")"), "INVALID_CONDITION" == a.message && tError++, 10 > tError ? tError++ : running = !1, 50 < sNum && (running = !1)) : (a = nowtime(), $("font#rMsg").append(a + "- Congratulation, Fight to liberate it!</br>"), running = !1)) : (10 > tError ? tError++ : running = !1, a = nowtime(), $("font#rMsg").append(a + "- unknown error: checkResistance json failed.</br>"));
            setTimeout(function () {
                checkResistance()
            }, nextmission)
        },
        onerror: function () {
            10 > tError ? tError++ : running = !1;
            var a = nowtime();
            $("font#rMsg").append(a + "- unknown error: checkResistance request failed.</br>");
            setTimeout(function () {
                checkResistance()
            }, nextmission)
        }
    }) : setTimeout(function () {
        checkHomepage()
    }, nextmission);
    echo++
}
function getJSON(a) {
    a = a.replace(/\\["\\\/bfnrtu]/g, "@");
    a = a.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
    a = a.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
    return /^[\],:{}\s]*$/.test(a)
}
function getSound() {
    var a = $("audio#gAudio")[0];
    0 != a.length && a.play();
    return !0
}
function alveolus() {
    var a = new Date,
        b = a.getHours(),
        a = a.getMinutes();
    10 > b && (b = "0" + b);
    10 > a && (a = "0" + a);
    var d = b + ":" + a;
    running || scaning ? echo > echoRec ? (echoRec = echo, 1E3 < echo && (echoRec = echo = 0), 10 > tError && (tError = 0)) : echo <= echoRec && 0 != echoRec && (echoRec = echo = 0, $("font#isMsg").append(b + ":" + a + "- unknown error: running process failed.</br>"), scaning && checkRound(battlefieldId), running && initiate() && checkHomepage()) : d == echoTime && (timeing && !running) && setTimeout(function () {
        btnFunc("RUN")
    }, nextmission);
    setTimeout(function () {
        alveolus()
    }, 6E4)
}
function runCmd(a) {
    if (13 == a.which) {
        var b = /^id\d{5}$/g,
            d = /^time\d{2}:\d{2}$/g,
            a = $("input#rCmd")[0].value;
        $("input#rCmd")[0].value = "";
        "help" == a ? alert("id00000 / time23:59 / stop") : "stop" == a ? (scaning && (scaning = !1), timeing && (timeing = !1, b = nowtime(), $("font#rMsg").append(b + "- now, cancel auto start at " + echoTime + ".</br>"))) : "i" == a[0] && b.test(a) ? scaning ? alert("please stop other threads first!") : (b = nowtime(), $("font#rMsg").append(b + "- scaning Battlefield.</br>"), a = a.replace("id", ""), $("font#battleId").text(a), $("a#battleLink").attr("href", "http://www.erepublik.com/en/military/battlefield/" + a), battlefieldId = a, scaning = !0, timeing = !1, checkRound(a)) : "t" == a[0] && d.test(a) ? timeing ? alert("please stop other threads first!") : (echoTime = a.replace("time", ""), timeing = !0, scaning = !1, b = nowtime(), $("font#rMsg").append(b + "- ok, it will auto start at " + echoTime + ".</br>")) : alert("invaild command!")
    }
};