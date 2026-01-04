// ==UserScript==
// @name         AI 宝石导航 (V14.21 豆包显色修复版)
// @namespace    https://github.com/sakura11111111111111/ChatGLM-Sidebar-Jump-Axis
// @version      3.1.0
// @description  [V14.21] 基于 V14.20 严格修正。仅修改连线颜色逻辑，完美解决豆包连线不可见问题，绝不影响其他站点。
// @author       zdm@Gai.cn
// @match        https://chatglm.cn/*
// @match        https://chat.deepseek.com/*
// @match        https://chatgpt.com/*
// @match        https://grok.com/*
// @match        https://x.com/*
// @match        https://www.doubao.com/*
// @icon         https://chatglm.cn/img/icons/favicon.svg
// @license      MIT
// @homepageURL  https://space.bilibili.com/497930349
// @supportURL   https://github.com/sakura11111111111111/ChatGLM-Sidebar-Jump-Axis/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556555/AI%20%E5%AE%9D%E7%9F%B3%E5%AF%BC%E8%88%AA%20%28V1421%20%E8%B1%86%E5%8C%85%E6%98%BE%E8%89%B2%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556555/AI%20%E5%AE%9D%E7%9F%B3%E5%AF%BC%E8%88%AA%20%28V1421%20%E8%B1%86%E5%8C%85%E6%98%BE%E8%89%B2%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. 默认素材库 ===
  const DEFAULT_GEM_STAR ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAIABJREFUeF7tXQt0VsW13nnxUCAIiAEkBaW1IkFri70VqqH1gehat7cvaaxVeh8Wrl26rhWxcmvttRWx7fWuWqy3vYrVprRL21pRfLQSMVjFtiIoaosSg8pTIIRHJJBc9vn/+XP+889jz5yZc+ZP/lkrK4EzZ87M3vub/Zg9M2VQKiUKlCggpEBZiTYlCpQoIKZACSAl6ShRQEKBEkBK4lGiQAkgJRkoUcCMAkWjQRbVw+VsiN0A49jfXQBNANByfRO0mJGg9JZNCtxSH/CG8afo+eI9QBAY3QA3hojO5WdZBij3HgZoKoHFpsjL20L+dAGcfYT+9SIeIW+6AZ4uxsnMS4DgLFQBcE93hujaBRlyGGB2CSjapCO/sLAe7imDHq1OfhGgpQzgpmKZyLwDyC31UF8OsEKD4MKqR0yxJd0AN5WAYoOamTZurYdvQ0ajxy0BUOY1wZK4Dbl83yuAWCR+Hs3KAGYXy4zlktlx2o6r1UXf9l3bewOQRfWwwtSkojDed0ZQxpBWHZtaXTCGli6A6T5qei8AQrFnUcBHjBjxyMkTJ43oP2BAzbEjR+zevm3H0LdaWsa9+eaGkw4dOlRDESDUJr6rdco4kqqjo9XH1tZC9ZDqoGtDqqth06ZW2L1r16H29vZKSn+7AMb7BpLUAZKNUt0jImBVVdVzX7j44ufHjD7+VJA47S0bN25ZseIp2LFjuxIoJd+EIq4AlIkLQTH1zGmAv0VlU2srtO1pg+ZnVirB4htIUgWISnXX1NTce+lXLr+Mxs5MLWTG7x/67d79Bw4MUrznrVrXGa+ruhST94KZF8KkSXVaXVi1qhnWrX1JBhSv+JIaQNDpKwfYKKLuuefNuPe0007TAke4rTUvvrjjmZUrKzvePzBUxkHfZiwtaXNUWQUOitaQdQ0nseXLH4G2tjZRNW9AkhpAZLbtR07/aMs555ybWy03lQNkwLJlv+949513BsjaKPklGepQIlUIjlmzGkxZkvfe/951pwwkN13XFISUUy2pAESmPcZ9YPyGL1x88QSbVHm6acXutS+tBYU28YIhNset0xYFHGdOnQZTp07TaVZaFyewXy1tFILEB+2eCkBEKnxA/4G7v37VVVKTyJQ7qNaXPfxQx959+2TapE+ChAIOE3+DwisFSFI3tRIHiMwxR9Uti4ZQCC6rg8z4ZeP9qkhKnwIJBRyu+YKO+7OrmkWsS5UfiQPk1vrAMS/wL0aPGdNxySWXSn2FuABh7//kzh+XQEL0OVyDg/FEBpI0Ta1EASLzPf7tijlQXZ1ZZEqiPPzw7/e+9up6YSi4LzjuqmhVUuBg/JY47alpkUQBIopc2Xb+qABD53316ueFPk+aMxd1DKb1fAMHjsNHLZIYQHzSHmGh6osg8REcvmqRxAAi0h5oVqF5lWZRmFupR1Js0kaVPpK0WRUdm0SLpMKHJAHCdc5dhQ91hUrmuPeWTGBV4mHa4FBpkWzGL+4cTawkAhCReTV48OBDX5vz76RMzyQooohupeYo2hi7KinUF3DIfBFMMp3fBLNt0IPaRiIA8c05FxFHtU5SrE67KinUFy0e5osoopU0DxIBiMgp9GnWYsxBkNz/8yWibOBU7GDqbMerp0oKTSuCqBrT8kcfgZdfXldQLenwu3OAiBjkg3MuYpIs3JiGmlcJk+y5LGKFqeqoPXwsCA4ESbSgPzivCaYn1WfnAHFlXpWdMA1gaC3AMbUAHW0Am9dB95vCdAVteirCv0Xhj8jAYTMrV5u4xBd8MLNSA4ixeTWgGsomXpgBRrTsaoXu9Y9kAGOhyJz2pG1h3eHIIlbOtTfyaHRdZgLb3Qrdu1oB8EeziMysJKNZSQCkm0eXa+fN1yQXACDhpyrWTDraMppkc6H9qvvBYvVHZE45guPiWQ3O0noCzT4+khJvqOFFZhYAJKbBnQLEtv9RdnoDX3NEJd+QITwA+ZxpauKUG2tu1eyCk9dHG4JJTFhw8lp1p6qlvOe3LVqYqh/iFCCi2LtJ5CQwq0bp7X+Gjc1W/JJf/OI+4a5E30wtmd/hKpzL1RoiGGjyJG0/xClARHaw9ixGMa1EDMFZ6y+NsfwShamVmLpXTb2yNBJXESuyVg91vvuvjWSfJO1wr1OAiGYzXf/DhAl5wmQBJD5mmobHKFspdxKxophUskmLaGrhTtClSxsLWkoq3O4MIDb9j7JPGzj0HL8kiHAZRFNYU6KoVtq5WrLFQCcRq2NqIZi0YhQdLZKmH5I4QHT9DyPfQzZzxYhwiWaz7OdSM7Vkfoe2OasQei1/Q9aWhsMu8kOuawJn8su67uwDthYIg7CuLDKiO4vFjHDJUuNFDnv2UplwT6NbjnOX/+gevSlb79CdjFSktDpZHTkinqpFJOshzo8qTRwgWjPaqLrMoqDtEgMkMocdTa0ugJZygHGhW7BMzvcKAHPk/o3gd+jyGfxn7tYmmWll2++I7QfyeEiMaIn8vyTyspwBxIaDbnvGijrupukpirUR23DmtYd3a7RkQVgAQNvbCJyAA0dFNLMkeVnODyJ3BpBb63Hiyy+6DqN188qi4044GSUJoHC/YdO0cgaObM8pZhZqbfRDoiWJSJYTgIhUv67atxK9UokpzmIG0S0PtAh3ZLo0lpHHNTiCbxPNLIGj3nJdE4xXsTjO80QBojWzufI/eNQyXCcx0SKTzsuER2vrMvlKQ47rSbrcs7UV2ra1wqaXmqEN/96ql+Cnq6FTBwd2ABNMceFQUXAtBKOI0eI6kuUEIDZSTJz6HyKQEBev2OuysC8KK14iwy6UOX7KBTB51jdVcpD3/PWmBw433f2dCipQtCYgSU8S0Rzs+0Q/JK1IlhOA2Egxce5/8ASEqO7Dr6IDiUBB02bs2Iw2KDgAL06qzMZmaG3KzLCtm1qFtzbZ0h7W1jk0poIggVGxRUFk0rpOffcXIDZWzzWYFFQ19EdUn4kldAIThN3ahADd09ZmJ4Xdwgq5iha85xRHPa1IlhOAxA7xxplxTTgUfsdAi6g+Gddkocywqj5QnsftJ+UbXIBgkESxf0dkzrpeC3ECEN4B1VomQJIOepRjuHUXGWaxxI3GJQKQlLRHQGbCpJRW0qIrgMRbA0kRIAE4LOxGzOHLgja03ice+C3003hOIUay0khatA4QG2sgiUewGGeJjNISBBszswOtxhtDWiYWdUWdtxbi+pSTxACis2EnFYAQw41a4MB8Kt4ebd1GXADXJy1CpH0aWb0uAFJfDrAiSn+dGH3iIV5H0Sukga1ZORE/BDtsQ+PpTgCYkPnHwr3n0WbSWCwsAYQ4exnwPHglroPOvksJhZr2seC9FHxAygSQxmKhdYCIVtF1DgywJVRKgXFtuth0fAmRHuV4dSokDBLKBNArABJ7Fd2mUMkEwjU4bJsrSfQ3Sq8EzS0KQCSr6c42TlnXICKAkO8gTIIpCc3GVhz0kNBS7HQdJUGqm9CEFRMg069vAif3hlgHiOjoGV8AQmEESXAIlawDhJCzROiWfpU4J5gQv0ZZ6xGlm7jMx0oMIOSjflxpEIeRKpEM2Ipg5Rx124uYROENqjkGSRyAuEw3sQ6Q2HlYLpzDNOx3ixGsnBwntGAoxA07lDp69q4O0AR1+zRAUs3DSsjfKOC7C9vdcUiaKue2TUf8LgUgkv03zo5csq5BvElUTMGkyhMwR6YiZb2AKuhx6tkGSQkg1KuebZhYKZlUYYGzLUBe+CFRRFn0SygASePwhkQ0iNZBAnEBkradnhUiZ/lknowvhxVLIOlLAClIddcCSAzTJMkQrso8sR3Byn3PA+3I9bfwRqkYznsJILOIhx2bACRtf4ODFpfpMr74IdFhxzErKZNbbzGxktUgvs6oqqviVCpI8pwy28ZoPtarpiChgL4EELYgRRWutEK4KhGK60ep2vfND7HgvPdpgOhsliJd1KlxMrhK1lw8N51FyX3xUWvGBAklz6zXahAtgKhWoD30Nwpsceplo2REFFakzLgxmrfzquzK7sgXSgCZSb/GQBgB8mQlWSU9Lh10L9dDZAShpKcQNWJJg7A1BN4MTCSiSnidP3eRYsLrtO9+SLjPKpAQx1ICCANI9KCDYgEH9t8kTG2IWopZYti0k9dEvhk1KlcCCGNLeBYmzi5OOGrQqHMHPdSnovBDIjTk0Yc6jhJAQsQMCDmg2vophwYyr/VKogBJc3+IFlXyK0dpRNWEJYDEILovrzpLMeENsJhMT5Em0VjL6rUA0crF8kXSDfuRRAQr3DWqeWI4HLevjarTOua1BBC37HDfelIRrLAfUqRmlgkzRAA5snRW3Bum+owGcZ1iUuzhXhNUhN7ptTsK+wpAknTQc3JTxH6ILl56LUC09qTrUs2j+ok66EUe7jVhWwkgJlTz6J2kHfTc0DUiQR6RS7sraVzDlsiW2z6hQVJw0PuamdUrABL7XCztecWTF9Jw0PuYmVUCiCeybtKNVBz0PhbuTeMqaOsmVuyzeU2k04N30nLQc0Mvspw1E5aVAGJCNU/eSc1B70NmVq8ASOz7QTwReK1upOmg9yEzSwSQojm8WnTDLfJw1qwGwAXD3ljS9j/6ipklumEKAFqyVyC02JYvqz6IKIKFnSbfD2J7hAm05w1A8DCLtO4QSYDOIg2S/bSTfCxrABHdTYid17nhNgE6W/9E6g56ycxiFLAOEisAkZlWvX6R0BP/oy8tGoruS0cadAFYva/QCkBEjnlvN60CoUxwDzpV9fVmMwtpgGnvv1raGPyOljKApnlNMJ1KK1W92ACRaY/eblohcX3yPxizqYcgqITD5+cyf8RmVCs2QESOebGZVtt3tsGrb7TmycRZU+qUMuKT/xHXzEIaHDusWjlmXyosXdoImOHLKdaiWrEAUuxhXRSIlS+sg9880czlOQrLySfWwmfPm8YXHN/8j7CzrohmsbE/8+d1gH+zwsaM46ZMEGmCRWZq2dplGAsgIu1RDBukEBh3LX2ExF8UGgRJVGB8NK9yA5KkwKOmvHlxo3LsOO4b5jR4rVVkppYNh90YIDLt4fuax4OPNwu1hkhqUFg++bE6+Nz503JVvAaIYE2ECo6wRuFNDkp0JVhBEtWKHfY1BohIe/jumOtojiiPESS33zCnByCfnp+gGBh8KqJF0JS6+rt3ajeE475i1oWBueljkWiR2L6IEUCKWXuggIRtbl2Go6AEppbH/kduTJHDvtGkxAnCpOCYcey+FpEWiRvRMgKIaN2jN2iPs/7pcvjc3Bth/eomuOuG2QXywLSIiXnVdfgwdB7shK7DXYB/Hz58OPgbC/6blfKKitDf5VBRUQGV/aoA/7+iojz4TS3hkO8l1yzMe0011nDlYtUicddFtAFSzNqDMoP+z5Mb4dgx4wLZuPny6QFQooKCZhYlvR2F/v0D70PnwYNw6GAnVaaV9RAgVf2qoN/AAcFvacmeesIzrxrX99yWxxtrtN2c9lT2MJ0KIi0Sx1nXBohIexTDugcFIAuWrICJZ9QHHL7q3PGw/Z38BFG0w//z+4ulN7oyYBzYu8+5pCBY+g8cAAMHHSX8FmqR7a80F/gf4bE2TFSLgu8AkWT7GjvraqpEyH5rPWwEgMwUGyoXzLwQ8CYpnwsFIKg9Tj6jHlb+dgl3KGiLf+1HywIfhFcO7N0PKmAwE6m8ohyq+vXjthM2uTJmWY8JxntBCpSONtj2xI/h6m8tyteGirEWmwYRHQsUx8zSAojIvCoG7YHMjhPBYsKy4Op/hYmX3yacB3Zv31kgzEx48SXZTC+bXBhAECzvH+gQmmxHVw8ONEpB2dgM//WNuQXZAjoTGpqW5JX2zgqAzvJM8/g3lqrDAEfZMzV5fbdtZmkBxDvnnDGhKuPo5pgg4LppmJM1F5hXP1sWJCiKSliDDBx0NPQf2F/LqaYKLHP48Xth7SIECACsX3It3Hz7T6mfyKuHY18wV3HXfWcFlLUNAHjvaPE3ECRYjuqE7oEHAao7jPojesn2rkNdgHDNq8QWBvdXQdn+fgAH+gHsFzin2Vmqe8gB7mwVR4ssWLAAJn7+G0qGosDqRJqUDUoqMKCwIAACRFg62uAnV38WVj73F+1PIjiE6yAIjE1DezSFTutVh6G7Zo81zWLbzCIDJFXzCoGxZYg+AxAsQzqge0S+s6y7kh6EOP9lNkxs+LYO672su/35B+HpB+/RyiSQggN5s+mY+GOt7sgAxUKxaWaRAZKKeYUzEwJDpC2oxBy+zxgkCI4Ft/wQjv3456hfI9XbubkVVj+ayYfasKYZ8N/4g2XYqIwJN+Ej03I/7P9IjasqbWyGB3763/CbR/8oralc+7AFDtYLSyARRbOy+9bz4/YKWsUGiLPDGBAcbw5XsZr+fMRggCmjgvrduzKCuP3tFnh1/SuB875jV/7mmyDv6vI5mf0egogV/eM9NREEj929MAcOahsIkBlfnQ9nzFT4AdQGd7XCthceglf/+hx3/AX5V+h3YfYA87/w9+PPAryzmfpFWj3OZEZ7saeWzRMYdQDSs6qU7YvL6FWgtuNqjihl//ECgDEZkOSVjiw4DrQBDMyGby2Cgn3rsf9bGIAjTkGgXPmjZTktE6et3Ls4YTAasP/E8SMtRHRo3wtw36+tfD7aSPeJnQCVu4zbFvkh3QBL5jdBYXqE5EskgIj8D1dp7YFZhdEQ2+XDHwT41Cdtt0pq746vXwQb/tqz7+To6uEw8gMnwca1z5LeD1dyAhLdXqDmeGi57lu0+pNOgO6KVwtBS3s7qCXwQ1qua4LxGs0AFSD15QArog27yr0KTCsWO9cZjaouag/UIgmXMDjGTz4Tplx0Wa4Hv/7eFUa9QZB864G1Ru9aecmhBgm0/FmnZG44jmo2YudFuw11005IAEn6tMSy10cSyaBZLQUNsuHFZrjjyotyHZ1+yTXB39ta/wavPPOw5gDyqzfcsNieT2LSE9Qgtn0Q7AfjE+aRGYLElqNOAojoQOpr59nfD1E29HSA5982YZf6HTSvkPgJlsbvztV2yKndS12LvPZ3gKeeoXaXXi/sKxpeDmTLUScBhLc5yoWDnkshdzEzDR4E8JmZAPg7wRL1PWx+OnWA4GBeeDHzY6twzGCTY4wkC4az5zUBP9GOMwYSQG6tB/cRrPAFNC5mJlEEyxZjBe241CD4ydtX7XY8AkLztkCCkxdq+Wik0eCiUluRLCVARBEszNzFDF4rJbo7Dx1AJDoCxUZJCRzYdVwMRJC4KLgmgn6IFwV5huaWqU+iCKCYaJHbFhWG1HVDvcYAsRnBKps6pzDejgRHgMRR30h0nJESNqvCAosLg9/5/GQnMnzlHcuClXavCvLs9Q00oCBfmE845SPyYRj4IjyA6Ka+UwDiNMSr3LqqQ3BGYpGqTkmSXGgRr7SHiK44yaFGeXdLpkZ4ogqDg8IXAzOLtxZSXADROfiAERtnJ1b2tPf8jTPR6Br+SjmFAY7r2FhFZ130wjl3TC9e87pmViIAEV1rYGMHoVJ7pMAEV59kyYlxU00mnD4tSDXpk0XTzLKxmq40sZwCxPdzpRxIYRxNgsmKM/7Z/tqTg2G6aVLTzCpugOiYV27InVqrutqEZfFaTXlPbfTxPtz9R3qyZ1EDpC+ZVyKRCPaAbGkNkhjxd/CzuTXI1J1w2rTgt7X09nhy6c3bOn4IL4qF9xnqJCymZmJRzpVKkyvMFLK+DyPNQUW+zfamYL4Yhou9WVOR0Ejn7pNEwrxOfBDPzatogqEX6eUOgBVNgykKH2fzukwCI6EkslDoBCAeXlsWpncUIPisKNYdCELDqvAWMItijESA4N0h6INEi4uVdOsLhb77H6LV79TTyzUAoKrKS6IsivERI1kigOherKP0QVzkYnl5bVlEonjh2MBpvqDBSqiVHdCA2or9jV1ARx0LSyEJHHbL6SSiBEovEh9VyI6cWC+qLkp3tw4Q7AAvmzfOdlvfHfRAUDe3QuP35uZtk2XMMLHVWWgXTzAJb71VyQM+ZyBBoMQBjO0xUfruog4l1Cs6QE73ZBOlBskCpODAOGOAeO6ghxkqSzREex1/RLN7HECohEoHMCyUjPlg7JihaPvFtjpPCfVKdhRq3aNuDBAkstGOQs8d9KjwqLJxUViDn5rMWVZsXUMl5DafswVE1g+2nhI23UTfK8a8LgpARHvSr2uincPA6EUCiGjLrdGRo+GNUTalxGFbvKiWw88l1nSxaQ5GGApAbCwS4vdIABEd2mCSsOh7BEsknTgbY+SHMisnJuGGH7IZbDDsQqzXVACxFeIlA+SWerAW6i1WgDDH3dXmp1gSo/FysWqN8BBVAJFc6ql9kQ5Jg9g8OK5s4oUAo/y+aEemRYodIEWxGKgAvAogkjOxpl/fBM7O5rVy9UExrIGUAKKhklKoqgKILf+DbGJhRZGjruuHlACSgkSFPtkrNIgk5V3kf+hutdWKYmFlUU6W7ukmxQyQ3hDNKnqAKFbSbfofWhoEK4su8NQJ95Z8kJ7pfNjRw+CME6cE/4F/Z34fAzv3ZU4237lvJ+zcuzP494atob34MZSQSRZAjM/Zf1UBEIF5Bbpn8mprEJmZpXMEkCuAtG1thZefaIRN63pOUK8+rhZOObcBaifbOxrn6qlDjZnOADFh5Ikw4bgJWu0wsGzY9gY8tvZxrXfDlV0lJDL679nWCvg3FqT/2LppMPbUacHfVookm1eSoKi1SSrcT1IUi70gMrPwGNKLZzUA/lYVGUCQsIy42I5KsBlTVt0v34aJzJl12zIrTDI5SnTG5PPhjBOm5LSEikaq5wiWDVszQMG/dYoLgKy6byHIeID0r66phUnnNMCk8+QXACllQHJwg23zStvEkplZVGc9ug6CBHn2/oWw7onMdWTRwmae2lMzWmDIyFrAWar1peY8MKmExBZIdACCoGj4xJdUXTN+juBY/eYLWhoFr0ywubd96byLAl5QC/IhyssAFFvyJ8dwe/jOpHMbYOql8wEEAJFoD9BNLzHWIFmA4E2WNxYIMlWLZFNNkCjLfzBXi7hUJojqIaEv+MZipWaSfYdyKgmaUg2fmKVtRpmOD4Fyx5OLSdrEZkq7LjhMx8feC0zmSXUw9aOF62gS7WFsXhlpEJkWIfkix9TCpspaWHptz50ZcQkXnW1QnYtmtbzZyODDqkgW+hZXnuPmLF5ZdykgsRXBUk1uzKTS0Sw6rOBFTkXOue7+j2g/tHwQ9rIoN4vii4hO3dYhEM8MQxWM9i0zyVT+ydQvz8+obM0iTYF3bFKpuqoCiY0IVuvaZuHkhqbTrEU9h9ohDza91Awv/6HRuqUQBokr7WGsQbKpJ3gl27go01RaRJQGwGZ2bI8JOYtIIaHDsxF7jqDACInMmcfI1qM/4M/ozB7WjXTx/BDX/oYKHOy5DCRx/A90xF9+slHo90XBEe1vGCxRf4NpHPyNPiYW5CuCC2VApInYDcuie9Hjag9jgMh8EXwmWhcRIX3mNYuV0Q2qgPDqIXPu+or8hHVkMCXKgu1Hzay0zCoRTRAk3/ndzQWPdf0PlRZmH1CBIw7v8F3sB5rk4QhnMJFWVwc+ybOruEGCWL4H67ORiRUytbj5WSJTi2cnYvhVFc6NS2AZkXnmGppfsnBk1MzyDSA4psfWPZ4X3dLxP6jAwO+Ymqq6PFX5PZz2tDN3eX2KBRDRugh+KGpq8bRH3XkNcME1yV0Ao8N4lTMfPvgAo1bf+swCXZ47rY/h38Y//TL3DYp5pQq5hztsIyKoSwCZ/xNpy4r2iGVihbQIN+wbBokoRn3Fz9daWbzTJbQuUHiLjFEtgusd6If4Uu74w+JcegplD4hqsY+NC4Gh0rAuaUAMLVvRHlYAgo2IcrTwWf30T8Ebb2wAjF6FS9Lag8c0apRFtMgYdtZ90iKYt4UAYUW1eq4SOqZNw1FClyCQtU3wJ61pD2sAkUW1RIOd97gHl0+GOofqG1f0ZesnUU0SddYxpWRG3flpyU7uu2Htgf8pc85lmkNlZqY1UFxgFmVe6B7roxpDLB8k3LhobYTXgaQc8+DbeDOVxh2FMjucF62JapEkV9B5tI1qD9nah8imNwKGJp1VgqnSIryoVvadFgC497omQNM/drEGEOzJonq4vRvgKlmvkop6BHfj4a2rjHFDBmtd6CmaWaMh6agvkrapFdYeqiN9MPQdDZ1qh2zDV0CzewdVF3LGFttM6FcRurcCFGsAkUW0GD2MwcHuJ0QGRO/Q5hEb69/368In+P6lXySzhwcSnF0xuBAu0aM801o0jIZ2ZbfgUscmJZboPnu8LxJvF1YVxlesx267Vb0Tei5aH4k00ZI1uxAw2sUKQBbVw4pugHrR12OFBB9ann+lMAr5Z2bKzSbUHKI71jXvTOc5sFETkXckUNL+SNS0UkWueNpD2/TFSQiFPFooPAprHnwf30HNowkUYkTSGCSxASIDh5EtGyZ2FBzsmeLSeRC9h+8jEzRMAJ4q55khvBytpEASBYfKtOKl3xhFFRffLZ6RZRMRmr/IIxNgCb5IWMMxAkksgMgcc2NzKkwAUwbIAIKqX3OWimoRnpmF3ebdh+4aJFFwYD9kphU+50WBtLUHNiTjD5qyouCITMNrTmBRvCD4cfNW1LfK1tMOARsDRHSYXCxzKjxakR/B6sgYYMkHYZ/i2esigeLtF8FUFIxusX3n2oaw4IWoz0EBB9bhmVdGYfeomWRDw1P9FwkRZWaX9Qt0RP3gmVaimdVYIGSaQAYQ/CDPxkXtQXHyIx3mmVkyDcm9WyR7QIONdRLUGo1/WlqwQUqlOdiwFp2fv6/eyLzCxnAiQl8PaU0FB9aTaRADDS+SL0EmN5pas6kHyBlrEN6dIUZqWoYeUZSEqoaZA7mn3QgYrGu6AMH3RBur2MENukBh22tXv/ECd+cgFRy8scTOpkY669BYpOFVvqVMqUoCAAAJi0lEQVTBTMsLsuhoESOA8EK61sHBiIEO3Z/XZCJZCcbZo7yImiWU9QLZgdcIlAnHZU43waN+hg3KHPuDBY/6CUC27Y3gtwgU+AyjVQ3fXEzeZ86bVWMDxEBwA+2DmsQxX3FCaPyPGYfad7xbGeom2RcxAgjvlEWpDcvMHRRwzQU7E9q7eIfqqEe/zS7Seexu+ckrun02PaGdB5C0kkZ1x5xXH2WKhfIVMsXzIakpKUYAiZpXUhuW50dQ4uSxqGf/5ShAKBok3AsGlNXLG2NdoWAKDNYXHkCcaX/7bMi0KJIpgY8pSKkhZfxqA4RnXglVtMiHwEHasDfDK7HhXCDqirsGA01MLF7zCBT0T4LLO7e0ku4rZKBAcyruhZ48YbEOEMYX5gOycC+zIDRy4wpoKItuCmSK53dRz+rVBggvvCsksCxaoZn2ERCKRU3e3ZK/ui4SdOazYOgwDlM4oVHjyE+kr+xCHnZtGj4On1sVFxBR0jgDCPoSr28QZzCEO8ImsNE12mtSgVmFcsUrEpn6+ZX1u7f8fU0ufOcHQERxchycTryb2Zu8tAaKFrDg3FsLjVL667AODyCxFnWRJ797lJ9yQhkHA8tJE2iRRtEqPH5LApA7L5mY56hTI1luNYhMHVJyomQAoxA/WsdEawEEZ/5GT0ZJJfJjMubIO9TUGdKnZMJKaiBSCSdNDOHLtH04+hX9hiT8v/hLH+7Yu3PLAPZKogCRCks47Zz1TrWOISOCCeHD7+horux7vSbykx2PaUQuj/S2wcEap2h7ntZS8PWOL07Yu79tx6AkADKuHABPM8kVpYoOO9PoSKlmCF6qelxghN+naK9QfV7uklFqhs0xxGhLJ3VG+BlZlkOMvuVepUyiuDiJsqWSKdyrFMkecKlBCgAyaFhNx9xfvpZTX8b0UeVfGTcceVFF/Ej13uJ/sGHx/BBtk1GWqJgSn0Sf5VkAZQCz5zXBElVXtX0QbJC3UGglVOh6VmLU0DCzeMRVakwV1VN+zvNDtPLoXJlXPLpYyM3ipZtQT3w3Aggv1KtFYB4hbDvkMiHUAAgv87UoV54j9KBsBBOSMClNjx0wDKywvvMmOKp5hW2YAmRcBcA90V2E2mo6zIEkVDb7HnFWsraxKGWNwft8bC2SJL80TeLweHkTHDXNxBgg+CJPiwweMfrQnF+sDyeF0URDtvhDa0Gv1tyvkurHmmVJX0i3Em985ElOtghse1iGWRe8YAR1gZANwUiDsJd5e0KMVpiTNK+IsxFPeIzGZltYLLbHc9bJN3F5bmaJjjTS0R6xNEhWixREtPD/tZ3YpDQIcSYSEddKIMKigNtoijcRkP3JpPim6YeIjgTS8T2saBBshLcvHcO+F13/swHkU9uTmI2IRBYRd+SJdTDzqh/C0cPHQEVlBQwYepwN+UyljV3rV0Jn+w7YsvE1WPPU72DLW38r6Ad5kktC+2sEVXAggqNUyXtAwsSIZWIxLcJz2NEfafjhY5XsshulJLgM8RI1h84R+wz8eNHLB6d8OhjekONqoby8HPoNOVY5XNcVDm1/E9q3vx18ZtPaZmhZsxL2trfD2xteIX+aDBLXmkRjYVd0zrCuaWVNg4RMrYIbp7QOcHChRShpC1lKEE7qIwtWcGNS9l7wITW1UPuhOjhq+GjoV1UFA4eNgsqKTByjsrIS+g8dmddu5aDhBd85tPe94P+6urqgc88OOLhne/Dvg50HYc/WTXBg52bY/vYbsHXja9De3q51+69qUGSQuEoPIvqMEs0BpuDANmNrEEbg7AHWeSko+EzrbKy4maFhbmsQVuPeCZU89crnZJDg6NkhDqaZ14Y8FGkO3ahVlIHWAIINi44fRXNr8oyvVJIuzeSdlEEVOw2NwZqU3WFI/WxfqEd23BkxECi4b0d0wqWMaMhH4gk0MrM4LjisahA2XisgwcZYgiMSmZ2aEZ6VWMIjOwROc1OUyt/YfwgeeO09eBy7MnYwfOzoKvh4VQXUVJVDTW8DxLb98FRFORzcsQ9eenEbrPnCSfCDinIYHR2nljXAXqbyEfeVsw1UxM1tsrN5bYDDCUCwUZG5xUwu3o1NSQkd5SzXddvg6fvXQxOvT2eMztzs+6GhMG70YPgA/n1UFQwdWAn5h00lNSCN7xw4BLu37oPgEOfWPfDWuu3Q0roHCi5qqR0CQ786GS4TjUnLt9Ton05V2b0mtsDhDCAUkOAVziSTS4dqirqUa8Ye/Bvcu/rdjBDpFBSqmkEw9NiBMPSY/hmwIIAQPPh3EgBCAOzvhN3tBzNC3/4+tO16H3aLgCAbH47nwhPh7HHVcJqoHh5cgXdMkiOVOgQV1EV/cfn35woDESZrHbJuWfVBoh9S3TxlpLI1iUzRGNgkCtejb8JDJuDQ6RIDEnsHAYV/M1CJ2kJBDz/bfiDz7y17M795mkCnX7y62NezjofT6kbC2aK22B3n1Cu0TfukMomz7ZJOKtHpg02AIKPDP9iP6g8NgwlnjoFzTh4OM2RExtnolHMbrFwJTQUF64/MpNIhZm+tqzK52Lhtg4Xx8eUnG6Wh69Dkxs5AxUkDf9qyv9nkom0Z6AAEbW8GAKRJYH8fue5qPEUwvjwR6mUzUZjICJaxddMgWEOYPE3aPDvFG6NRWPBkb2p57wC0LH0VHnIx+1L7UCz1KNokPBZmdunykl2sumlds/C+yPB3kIeLnod7Nei4K1s3CiIGnjxNrQMQ1oewMxoGDD5nz6qzlfPqnjAUhp05Gs6mAIVH7Oqa2tx/t21pNV4QKwFDQ5wiVXWBwuNjYFrE5CVHa2CzTLjZb9QgrESfRf/NJYoJQMypm30TfZNDXfDdfuXQELsxYgNI0A074aWVb8OaksYgEk1SDYFSdyyMO2UEnDp8YCayl0Tp7obWsjK4x9Ylnao+pwIQ1qmsE385ANyo6qjp884ueG5/Jzz/vT/l7T8Oazam7XgaMqwV2fNjTPvi0XvMzAh3KWxaREO/4Zk4PFMHf884AY4//Tj4/FG4VlQO/+BonC1lADdR9pHb/H6qAAkPhIGlDOBs2X2HhMEHt5t2ATRR74AgtKmqIlsDSWJ9RHTpfOKX0SMfKzL3VV4Wl49lAC3dAE8npS14TPYGIFGwAASEHtcFmRBjOWTU+JE49zgkHP7dBYCzylvZv5MEhAowpedZCoQAg/w6m/GxWHjpJUBK0lWigC8UKAHEF06U+uElBUoA8ZItpU75QoESQHzhRKkfXlKgBBAv2VLqlC8U+H/VtCwx5gmQoAAAAABJRU5ErkJggg=="
const DEFAULT_GEM_NORMAL ="data:image/png;base64,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"


    // ==========================================================================
    // [MODULE 1] 适配器：配置层 (保持 V14.20 原样)
    // ==========================================================================
    const ADAPTERS = [
        {
            name: "ChatGLM",
            match: "chatglm.cn",
            getQuestions: () => {
                const all = document.querySelectorAll('[id^="row-question-"]');
                return Array.from(all).filter(q => /^row-question-\d+$/.test(q.id) && q.offsetHeight > 0);
            },
            getText: (el) => (el.querySelector('.question-txt') || el).innerText,
            getChatId: (firstQText) => {
                const match = window.location.href.match(/\/(detail|share)\/([a-zA-Z0-9]+)/);
                return match ? match[2] : "session_" + document.title;
            }
        },
        {
            name: "DeepSeek",
            match: "chat.deepseek.com",
            getQuestions: () => {
                const allMsgs = document.querySelectorAll('.ds-message');
                const valid = Array.from(allMsgs).filter(el => {
                    let parent = el.parentElement;
                    for(let i=0; i<3; i++) {
                        if(!parent) break;
                        const style = window.getComputedStyle(parent);
                        if ((style.display === 'flex' && (style.alignItems === 'flex-end' || style.justifyContent === 'flex-end')) ||
                            style.flexDirection === 'row-reverse') {
                            return true;
                        }
                        parent = parent.parentElement;
                    }
                    return false;
                });
                valid.forEach((el, index) => {
                    if (!el.id) el.id = `gem_deepseek_id_${index}`;
                });
                return valid;
            },
            getText: (el) => el.textContent.trim(),
            getChatId: (firstQText) => {
                const match = window.location.href.match(/chat\/([a-zA-Z0-9\-]+)/);
                return match ? match[1] : "ds_session_" + firstQText.slice(0, 10);
            }
        },
        {
            name: "ChatGPT",
            match: "chatgpt.com",
            getQuestions: () => {
                const all = document.querySelectorAll('div[data-message-author-role="user"]');
                const valid = Array.from(all);
                valid.forEach((el, index) => {
                    if (!el.id) el.id = `gem_chatgpt_id_${index}`;
                });
                return valid;
            },
            getText: (el) => {
                const textNode = el.querySelector('.whitespace-pre-wrap');
                return textNode ? textNode.innerText : el.innerText;
            },
            getChatId: (firstQText) => {
                const match = window.location.href.match(/\/c\/([a-zA-Z0-9\-]+)/);
                return match ? match[1] : "gpt_nav_" + (firstQText ? firstQText.slice(0, 10) : "new");
            },
            quarantineClass: "site-chatgpt"
        },
        {
            name: "Grok",
            match: ["grok.com", "x.com"],
            getQuestions: () => {
                const allBubbles = document.querySelectorAll('.message-bubble');
                const valid = [];
                allBubbles.forEach(el => {
                    const parent = el.parentElement;
                    if (!parent) return;
                    if (parent.className.includes('items-end') ||
                        window.getComputedStyle(parent).alignItems === 'flex-end') {
                        valid.push(el);
                    }
                });
                valid.forEach((el, index) => {
                    if (!el.id || !el.id.startsWith('gem_grok_id_')) el.id = `gem_grok_id_${index}`;
                });
                return valid;
            },
            getText: (el) => {
                const content = el.querySelector('.response-content-markdown');
                return content ? content.innerText : el.innerText;
            },
            getChatId: (firstQText) => {
                const match = window.location.href.match(/(grok|chat)\/([a-zA-Z0-9\-]+)/);
                if (match) return match[2];
                return "grok_sess_" + (firstQText ? firstQText.slice(0, 10).replace(/\s/g, '') : "new");
            },
            quarantineClass: "site-grok"
        },
        {
            // 豆包适配器 (保持 V14.20 逻辑)
            name: "Doubao",
            match: ["doubao.com"],
            getQuestions: () => {
                const all = document.querySelectorAll('div[data-testid="message_content"]');
                const valid = Array.from(all).filter(el => el.offsetHeight > 0 && el.classList.contains('justify-end'));
                valid.forEach((el, index) => {
                    if (!el.id) el.id = `gem_doubao_${index}`;
                });
                return valid;
            },
            getText: (el) => {
                const textNode = el.querySelector('[data-testid="message_text_content"]');
                return textNode ? textNode.innerText : "Message";
            },
            getChatId: (firstQText) => {
                const match = window.location.href.match(/chat\/([a-zA-Z0-9\-]+)/);
                return match ? match[1] : "doubao_" + (firstQText ? firstQText.slice(0, 10) : "default");
            },
            quarantineClass: "site-doubao",
            forceScrollMode: "auto",
            forceScrollBlock: "start"
        }
    ];

    // ==========================================================================
    // [MODULE 2] 核心引擎 (保持 V14.20 原样)
    // ==========================================================================

    const currentAdapter = ADAPTERS.find(a => {
        if (Array.isArray(a.match)) {
            return a.match.some(m => window.location.href.includes(m));
        }
        return window.location.href.includes(a.match);
    });

    if (!currentAdapter) return;

    if (currentAdapter.quarantineClass) {
        document.body.classList.add(currentAdapter.quarantineClass);
    }

    function getStarredList(cid) {
        const raw = localStorage.getItem(`gem_nav_stars_${cid}`);
        return raw ? JSON.parse(raw) : [];
    }
    function saveStarredList(cid, list) {
        localStorage.setItem(`gem_nav_stars_${cid}`, JSON.stringify(list));
    }
    function toggleStar(qid, cid) {
        let list = getStarredList(cid);
        const idx = list.indexOf(qid);
        if (idx === -1) list.push(qid); else list.splice(idx, 1);
        saveStarredList(cid, list);
        return idx === -1;
    }
    function getUserSettings() {
        const raw = localStorage.getItem('gem_nav_settings');
        return raw ? JSON.parse(raw) : { normalIcon: null, starIcon: null };
    }
    function saveUserSettings(settings) {
        localStorage.setItem('gem_nav_settings', JSON.stringify(settings));
    }
    function compressAndSaveImage(file, type, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 100; canvas.height = 100;
                ctx.drawImage(img, 0, 0, 100, 100);
                const base64 = canvas.toDataURL('image/png');
                const settings = getUserSettings();
                settings[type] = base64;
                saveUserSettings(settings);
                callback(base64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 样式定义
    const STYLES = `
        @keyframes glm-highlight-pulse {
            0% { box-shadow: 0 0 0 transparent; background-color: transparent; outline-color: transparent; }
            30% {
                box-shadow: 0 0 25px rgba(64, 158, 255, 0.6);
                background-color: rgba(64, 158, 255, 0.1);
                outline-color: rgba(64, 158, 255, 0.8);
            }
            100% { box-shadow: 0 0 0 transparent; background-color: transparent; outline-color: transparent; }
        }
        .glm-flash-target {
            animation: glm-highlight-pulse 1.8s ease-out forwards !important;
            border: 1px solid transparent;
            outline: 2px solid transparent;
            border-radius: 8px;
        }
        #glm-nav-wrapper {
            position: fixed; right: 30px; top: 50%; transform: translateY(-50%);
            max-height: 80vh; height: auto; display: flex; flex-direction: column; align-items: center;
            z-index: 2147483647; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            width: 50px; padding: 0; background: transparent; border: none;
        }
        #glm-nav-wrapper.collapsed { transform: translateY(-50%) translateX(80px); right: 20px; pointer-events: none; }
        #glm-nav-main-content { display: flex; flex-direction: column; align-items: center; width: 100%; flex: 1; min-height: 0; transition: opacity 0.3s; }
        #glm-nav-wrapper.collapsed #glm-nav-main-content { opacity: 0; pointer-events: none; }
        #glm-scroll-area {
            flex: 1; min-height: 0; width: 100%; overflow-y: auto; overflow-x: visible;
            padding: 5px 15px; scrollbar-width: none; -ms-overflow-style: none;
            display: flex; flex-direction: column; position: relative;
        }
        #glm-scroll-area::-webkit-scrollbar { display: none; }
        .glm-nav-dot {
            width: 24px; height: 24px;
            background-size: contain; background-repeat: no-repeat; background-position: center;
            background-color: transparent; box-shadow: none;
            border: 1px solid rgba(255,255,255,0.1); border-radius: 50%;
            opacity: 0.6; filter: grayscale(40%); transform: scale(0.85); cursor: pointer;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative; flex-shrink: 0; margin: 18px auto; overflow: visible; z-index: 2;
        }
        .glm-nav-dot::after {
            content: ''; position: absolute; left: 50%; transform: translateX(-50%); top: 100%;
            height: 38px; width: 1.5px; background: rgba(255, 255, 255, 0.15);
            pointer-events: none; z-index: -1; transition: all 0.4s;
        }
        .glm-nav-dot:last-child::after { display: none; }
        .glm-nav-dot:hover { opacity: 1; filter: grayscale(0%); transform: scale(1.1); border-color: rgba(255,255,255,0.3); }
        .glm-nav-dot.active { opacity: 1; filter: grayscale(0%) drop-shadow(0 0 8px rgba(64, 158, 255, 0.6)); transform: scale(1.3); z-index: 10; border: none; }
        .glm-nav-dot.is-starred { opacity: 1 !important; filter: grayscale(0%) brightness(1.1) !important; transform: scale(1.1); border: none; }
        .glm-nav-dot.is-starred.active { transform: scale(1.4); filter: drop-shadow(0 0 10px rgba(255, 60, 60, 0.8)) !important; }
        .glm-elevator-btn {
            width: 28px; height: 28px; flex-shrink: 0;
            background: rgba(30, 30, 35, 0.85); backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px;
            color: rgba(255, 255, 255, 0.7); display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 12px; transition: all 0.2s; user-select: none; margin: 2px 0; z-index: 99999;
        }
        .glm-elevator-btn:hover { background: rgba(64, 158, 255, 0.2); border-color: rgba(64, 158, 255, 0.6); color: #fff; transform: scale(1.1); }
        #glm-toggle-btn {
            position: absolute; bottom: -45px; width: 24px; height: 24px;
            background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50%;
            color: rgba(255, 255, 255, 0.6); display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 12px; transition: all 0.3s; z-index: 100000; pointer-events: auto;
        }
        #glm-toggle-btn:hover { background: rgba(64, 158, 255, 0.8); color: #fff; transform: scale(1.2); }
        #glm-nav-wrapper.collapsed #glm-toggle-btn {
            transform: translateX(-70px) translateY(-50%); bottom: 50%; width: 30px; height: 60px;
            border-radius: 15px 0 0 15px; background: rgba(64, 158, 255, 0.3); box-shadow: -2px 0 10px rgba(0,0,0,0.2);
        }
        #glm-nav-wrapper.collapsed #glm-toggle-btn:hover { background: rgba(64, 158, 255, 0.9); width: 35px; }
        #glm-global-tooltip {
            position: fixed; background: rgba(15, 15, 20, 0.95); backdrop-filter: blur(10px);
            color: rgba(255, 255, 255, 0.95); padding: 10px 16px; font-size: 13px; font-weight: 500;
            border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 2147483647; pointer-events: none;
            opacity: 0; visibility: hidden; transition: opacity 0.2s, transform 0.2s;
            transform: translateY(-50%) translateX(15px); font-family: -apple-system, sans-serif; max-width: 400px;
        }
        #glm-global-tooltip.visible { opacity: 1; visibility: visible; transform: translateY(-50%) translateX(0); }
        #glm-global-tooltip::before {
            content: ''; position: absolute; left: -5px; top: 50%; transform: translateY(-50%) rotate(45deg);
            width: 10px; height: 10px; background: inherit;
            border-left: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); z-index: -1;
        }
        #glm-btn-view { font-size: 14px; margin-bottom: 6px; }
        #glm-nav-wrapper.list-mode {
            width: 260px; padding: 15px 10px; align-items: stretch;
            background: rgba(18, 18, 24, 0.92); backdrop-filter: blur(12px);
            border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        #glm-nav-wrapper.list-mode #glm-scroll-area { overflow-x: hidden; padding: 5px 0; }
        #glm-nav-wrapper.list-mode .glm-nav-dot {
            background-image: none !important; width: auto; height: auto; border-radius: 6px;
            margin: 4px 5px; padding: 8px 10px 8px 20px; border: none; transform: none !important;
            opacity: 0.7; filter: none; background-color: transparent; display: flex; align-items: center;
        }
        #glm-nav-wrapper.list-mode .glm-nav-dot:hover { opacity: 1; background-color: rgba(255, 255, 255, 0.08); }
        #glm-nav-wrapper.list-mode .glm-nav-dot.active { opacity: 1; background-color: rgba(64, 158, 255, 0.15); color: #fff; }
        #glm-nav-wrapper.list-mode .glm-nav-dot::after { display: none; }
        .glm-nav-label { display: none; }
        #glm-nav-wrapper.list-mode .glm-nav-label {
            display: block; color: rgba(255, 255, 255, 0.85); font-size: 13px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: left;
        }
        #glm-nav-wrapper.list-mode .glm-nav-dot.active .glm-nav-label { color: #fff; font-weight: 500; }
        #glm-nav-wrapper.list-mode .glm-nav-dot.is-starred .glm-nav-label { color: #FFD700; }
        #glm-nav-wrapper.list-mode .glm-nav-dot::before {
            content: ''; position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
            width: 4px; height: 4px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.4);
        }
        #glm-nav-wrapper.list-mode .glm-nav-dot.active::before { background-color: #409EFF; width: 6px; height: 6px; left: 7px; }
        #glm-nav-wrapper.list-mode .glm-nav-dot.is-starred::before { background-color: #FFD700; }
        #glm-settings-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);
            z-index: 200000; display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; transition: all 0.3s;
        }
        #glm-settings-modal-overlay.open { opacity: 1; visibility: visible; }
        #glm-settings-panel {
            width: 320px; background: rgba(25, 25, 30, 0.95); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            transform: scale(0.9); transition: transform 0.3s;
        }
        #glm-settings-modal-overlay.open #glm-settings-panel { transform: scale(1); }
        .glm-st-header { font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 20px; text-align: center; }
        .glm-st-row { margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
        .glm-st-label { color: rgba(255,255,255,0.7); font-size: 13px; }
        .glm-st-preview {
            width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2);
            background-size: contain; background-repeat: no-repeat; background-position: center;
            margin: 0 10px;
        }
        .glm-st-actions { display: flex; gap: 8px; }
        .glm-btn-upload {
            position: relative; overflow: hidden; display: inline-block; cursor: pointer;
            background: rgba(64, 158, 255, 0.2); color: #409EFF; padding: 4px 10px;
            border-radius: 4px; font-size: 12px; border: 1px solid rgba(64, 158, 255, 0.4);
        }
        .glm-btn-upload input[type=file] { position: absolute; top: 0; right: 0; opacity: 0; cursor: pointer; height: 100%; width: 100%; }
        .glm-btn-reset {
            cursor: pointer; background: rgba(255, 255, 255, 0.1); color: rgba(255,255,255,0.6);
            padding: 4px 10px; border-radius: 4px; font-size: 12px; border: 1px solid rgba(255,255,255,0.1);
        }
        .glm-btn-reset:hover { background: rgba(255, 80, 80, 0.2); color: #ff5050; border-color: rgba(255, 80, 80, 0.4); }
        #glm-btn-close-st {
            width: 100%; padding: 8px; background: #409EFF; color: white; border: none;
            border-radius: 8px; font-size: 14px; cursor: pointer; margin-top: 10px;
        }
        #glm-btn-close-st:hover { background: #66b1ff; }

        /* --- [V14.16] Grok 增强补丁：强制隔离，保护ChatGLM --- */
        .site-chatgpt:not(.list-mode) .glm-nav-dot,
        .site-grok:not(.list-mode) .glm-nav-dot,
        .site-doubao:not(.list-mode) .glm-nav-dot {
            box-sizing: content-box !important;
            width: 24px !important;
            height: 24px !important;
            min-width: 24px !important;
            min-height: 24px !important;
            flex-shrink: 0 !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 50% !important;
            transform-origin: center center !important;
        }

        .site-chatgpt:not(.list-mode) .glm-nav-dot.active,
        .site-grok:not(.list-mode) .glm-nav-dot.active,
        .site-doubao:not(.list-mode) .glm-nav-dot.active {
            border: none !important;
            box-shadow: none !important;
            filter: drop-shadow(0 0 6px rgba(64, 158, 255, 0.9)) !important;
            transform: scale(1.3) !important;
            background-color: transparent !important;
        }

        .site-chatgpt:not(.list-mode) .glm-nav-dot.is-starred.active,
        .site-grok:not(.list-mode) .glm-nav-dot.is-starred.active,
        .site-doubao:not(.list-mode) .glm-nav-dot.is-starred.active {
            filter: drop-shadow(0 0 6px rgba(255, 60, 60, 0.9)) !important;
        }

        .site-chatgpt.list-mode, .site-grok.list-mode, .site-doubao.list-mode {
            width: 260px !important;
            align-items: stretch !important;
        }
        .site-chatgpt.list-mode .glm-nav-dot, .site-grok.list-mode .glm-nav-dot, .site-doubao.list-mode .glm-nav-dot {
            width: auto !important;
            height: auto !important;
            min-width: auto !important;
            min-height: auto !important;
            border-radius: 6px !important;
            padding: 8px 10px 8px 20px !important;
            justify-content: flex-start !important;
            display: flex !important;
            flex-direction: row !important;
            flex-shrink: 1 !important;
        }
        .site-chatgpt.list-mode .glm-nav-label, .site-grok.list-mode .glm-nav-label, .site-doubao.list-mode .glm-nav-label {
            display: block !important;
            text-align: left !important;
            width: 100% !important;
            position: static !important;
        }

        .site-chatgpt .glm-elevator-btn, .site-chatgpt #glm-toggle-btn,
        .site-grok .glm-elevator-btn, .site-grok #glm-toggle-btn,
        .site-doubao .glm-elevator-btn, .site-doubao #glm-toggle-btn {
            box-sizing: border-box !important;
            flex-shrink: 0 !important;
            min-height: 28px !important;
            min-width: 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* [V14.20 豆包可见性修复] 在白底上强制显示深色边框和背景 */
        .site-doubao:not(.list-mode) .glm-nav-dot {
            border: 2px solid rgba(0, 0, 0, 0.3) !important;
            background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .site-doubao:not(.list-mode) .glm-nav-dot.active {
            border: 2px solid #0057ff !important;
            background-color: rgba(0, 87, 255, 0.15) !important;
        }
        .site-doubao .glm-elevator-btn, .site-doubao #glm-toggle-btn {
            background: rgba(0,0,0,0.7) !important;
            color: white !important;
        }

        /* [V14.21] 修复豆包列表视图文字不清 */
        .site-doubao.list-mode {
            background: rgba(240, 240, 240, 0.98) !important; /* 浅色背景 */
            border: 1px solid #ccc !important;
        }
        .site-doubao.list-mode .glm-nav-label {
            color: #333 !important; /* 深色文字 */
        }
        .site-doubao.list-mode .glm-nav-dot.active .glm-nav-label {
            color: #0057ff !important;
            font-weight: bold !important;
        }

        /* 气泡高亮适配 */
        .site-chatgpt .glm-flash-target, .site-grok .glm-flash-target, .site-doubao .glm-flash-target {
            box-shadow: inset 0 0 20px rgba(64, 158, 255, 0.4), 0 0 25px rgba(64, 158, 255, 0.6) !important;
            position: relative !important;
            z-index: 10 !important;
            border-radius: var(--glm-flash-radius, 16px) !important;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);

    // DOM 结构
    const wrapper = document.createElement('div');
    wrapper.id = 'glm-nav-wrapper';

    // 身份标记
    const href = window.location.href;
    if (href.includes('chatgpt.com')) {
        wrapper.classList.add('site-chatgpt');
    } else if (href.includes('grok.com') || href.includes('x.com')) {
        wrapper.classList.add('site-grok');
    } else if (href.includes('doubao.com')) {
        wrapper.classList.add('site-doubao'); // [V14.20] 注入豆包类名
    }

    document.body.appendChild(wrapper);

    const mainContent = document.createElement('div');
    mainContent.id = 'glm-nav-main-content';
    wrapper.appendChild(mainContent);

    const btnSettings = document.createElement('div');
    btnSettings.className = 'glm-elevator-btn';
    btnSettings.innerHTML = '⚙️';
    btnSettings.title = "外观设置";
    btnSettings.style.marginBottom = '6px';
    mainContent.appendChild(btnSettings);

    const btnView = document.createElement('div');
    btnView.id = 'glm-btn-view';
    btnView.className = 'glm-elevator-btn';
    btnView.innerHTML = '≡';
    btnView.title = "切换列表视图";
    btnView.style.display = 'none';
    mainContent.appendChild(btnView);

    const btnTop = document.createElement('div');
    btnTop.className = 'glm-elevator-btn';
    btnTop.innerHTML = '▲';
    btnTop.title = "回到顶部";
    btnTop.style.display = 'none';
    mainContent.appendChild(btnTop);

    const scrollArea = document.createElement('div');
    scrollArea.id = 'glm-scroll-area';
    mainContent.appendChild(scrollArea);

    const btnBottom = document.createElement('div');
    btnBottom.className = 'glm-elevator-btn';
    btnBottom.innerHTML = '▼';
    btnBottom.title = "直达最新";
    btnBottom.style.display = 'none';
    mainContent.appendChild(btnBottom);

    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'glm-toggle-btn';
    toggleBtn.innerHTML = '»';
    toggleBtn.title = "折叠/展开";
    wrapper.appendChild(toggleBtn);

    const tooltip = document.createElement('div');
    tooltip.id = 'glm-global-tooltip';
    document.body.appendChild(tooltip);

    const settingsOverlay = document.createElement('div');
    settingsOverlay.id = 'glm-settings-modal-overlay';
    settingsOverlay.innerHTML = `
        <div id="glm-settings-panel">
            <div class="glm-st-header">💎 侧边栏外观设置</div>
            <div class="glm-st-row">
                <div class="glm-st-label">普通状态</div>
                <div id="glm-preview-normal" class="glm-st-preview" style="background-image: url('${DEFAULT_GEM_NORMAL}')"></div>
                <div class="glm-st-actions">
                    <label class="glm-btn-upload">更换图标<input type="file" id="glm-upload-normal" accept="image/*"></label>
                    <div id="glm-reset-normal" class="glm-btn-reset">默认</div>
                </div>
            </div>
            <div class="glm-st-row">
                <div class="glm-st-label">星标状态</div>
                <div id="glm-preview-star" class="glm-st-preview" style="background-image: url('${DEFAULT_GEM_STAR}')"></div>
                <div class="glm-st-actions">
                    <label class="glm-btn-upload">更换图标<input type="file" id="glm-upload-star" accept="image/*"></label>
                    <div id="glm-reset-star" class="glm-btn-reset">默认</div>
                </div>
            </div>
            <button id="glm-btn-close-st">完成</button>
        </div>
    `;
    document.body.appendChild(settingsOverlay);

    // 逻辑控制
    let lastRenderedSignature = "";
    let isClickScrolling = false;
    let scrollDebounceTimer = null; // [V14.15] 滚动防抖计时器
    let currentQuestions = [];
    let isCollapsed = false;
    let isListMode = false;

    function getCurrentIcons() {
        const settings = getUserSettings();
        // 如果没有设置，且默认常量也为空，为了防止透明，这里不返回 url(...)，在CSS里处理，或者前端逻辑保证
        return { normal: settings.normalIcon || DEFAULT_GEM_NORMAL, star: settings.starIcon || DEFAULT_GEM_STAR };
    }

    const previewNormal = settingsOverlay.querySelector('#glm-preview-normal');
    const previewStar = settingsOverlay.querySelector('#glm-preview-star');
    btnSettings.onclick = (e) => {
        e.stopPropagation();
        const icons = getCurrentIcons();
        previewNormal.style.backgroundImage = `url('${icons.normal}')`;
        previewStar.style.backgroundImage = `url('${icons.star}')`;
        settingsOverlay.classList.add('open');
    };
    settingsOverlay.querySelector('#glm-btn-close-st').onclick = () => settingsOverlay.classList.remove('open');
    settingsOverlay.onclick = (e) => { if(e.target === settingsOverlay) settingsOverlay.classList.remove('open'); };
    settingsOverlay.querySelector('#glm-upload-normal').onchange = function() {
        if (this.files && this.files[0]) compressAndSaveImage(this.files[0], 'normalIcon', (base64) => {
            previewNormal.style.backgroundImage = `url('${base64}')`; lastRenderedSignature = ""; generateNavNodes();
        });
    };
    settingsOverlay.querySelector('#glm-reset-normal').onclick = () => {
        const s = getUserSettings(); s.normalIcon = null; saveUserSettings(s);
        previewNormal.style.backgroundImage = `url('${DEFAULT_GEM_NORMAL}')`; lastRenderedSignature = ""; generateNavNodes();
    };
    settingsOverlay.querySelector('#glm-upload-star').onchange = function() {
        if (this.files && this.files[0]) compressAndSaveImage(this.files[0], 'starIcon', (base64) => {
            previewStar.style.backgroundImage = `url('${base64}')`; lastRenderedSignature = ""; generateNavNodes();
        });
    };
    settingsOverlay.querySelector('#glm-reset-star').onclick = () => {
        const s = getUserSettings(); s.starIcon = null; saveUserSettings(s);
        previewStar.style.backgroundImage = `url('${DEFAULT_GEM_STAR}')`; lastRenderedSignature = ""; generateNavNodes();
    };

    function toggleListMode() {
        isListMode = !isListMode;
        if (isListMode) {
            wrapper.classList.add('list-mode'); btnView.innerHTML = '×'; btnView.title = "关闭列表";
        } else {
            wrapper.classList.remove('list-mode'); btnView.innerHTML = '≡'; btnView.title = "切换列表视图";
        }
        setTimeout(() => {
            const activeDot = scrollArea.querySelector('.glm-nav-dot.active');
            if (activeDot) activeDot.scrollIntoView({ block: 'center', behavior: 'auto' });
        }, 50);
    }
    btnView.onclick = (e) => { e.stopPropagation(); toggleListMode(); };
    function toggleSidebar(forceState = null) {
        isCollapsed = forceState !== null ? forceState : !isCollapsed;
        if (isCollapsed) { wrapper.classList.add('collapsed'); toggleBtn.innerHTML = '💎'; tooltip.classList.remove('visible'); }
        else { wrapper.classList.remove('collapsed'); toggleBtn.innerHTML = '»'; }
    }
    toggleBtn.onclick = (e) => { e.stopPropagation(); toggleSidebar(); };
    function checkResponsive() { if (window.innerWidth < 1400) toggleSidebar(true); }
    checkResponsive();
    window.addEventListener('resize', () => setTimeout(checkResponsive, 200));

    btnTop.onclick = () => { if (currentQuestions.length > 0) scrollToQ(currentQuestions[0], true); };
    btnBottom.onclick = () => { if (currentQuestions.length > 0) scrollToQ(currentQuestions[currentQuestions.length - 1], true); };

    // [V14.15] 升级版点击逻辑
    function scrollToQ(target, isManual) {
        if (isManual) {
            isClickScrolling = true;
            if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
            // 看门狗：防止滚死了不解锁，2秒后强制解锁
            setTimeout(() => { isClickScrolling = false; }, 2000);
        }
        // [V14.20 修复] 豆包强制使用 auto 跳转
        const behavior = currentAdapter.name === 'Doubao' ? 'auto' : 'smooth';
        target.scrollIntoView({ behavior: behavior, block: 'center' });
    }

    // --- 渲染主函数 ---
    function generateNavNodes() {
        const validQuestions = currentAdapter.getQuestions();
        currentQuestions = validQuestions;

        const hasContent = validQuestions.length > 0;
        const showElevator = validQuestions.length > 3;

        wrapper.style.display = hasContent ? 'flex' : 'none';
        btnView.style.display = hasContent ? 'flex' : 'none';
        btnTop.style.display = showElevator ? 'flex' : 'none';
        btnBottom.style.display = showElevator ? 'flex' : 'none';

        if (!hasContent) return;

        const firstQText = currentAdapter.getText(validQuestions[0]);
        const lastQText = currentAdapter.getText(validQuestions[validQuestions.length-1]);
        const currentSignature = validQuestions.map(q => q.id).join('|') + `_${firstQText.slice(0,5)}_${lastQText.slice(0,5)}`;

        if (currentSignature === lastRenderedSignature) return;
        lastRenderedSignature = currentSignature;

        scrollArea.innerHTML = '';

        const currentChatId = currentAdapter.getChatId(firstQText);
        const starredList = getStarredList(currentChatId);
        const currentIcons = getCurrentIcons();

        validQuestions.forEach((q, index) => {
            const dot = document.createElement('div');
            dot.className = 'glm-nav-dot';
            // 确保 ID 存在
            if (!q.id) q.id = `gem_auto_id_${index}`;
            dot.dataset.targetId = q.id;

            const isStarred = starredList.includes(q.id);
            if (currentIcons.star && currentIcons.star !== "null") dot.style.backgroundImage = isStarred ? `url(${currentIcons.star})` : `url(${currentIcons.normal})`;
            if(isStarred) dot.classList.add('is-starred');

            let textRaw = currentAdapter.getText(q);
            const cleanText = textRaw.replace(/\s+/g, ' ').trim();
            const tooltipText = `Q${index + 1}: ${cleanText.slice(0, 80)}${cleanText.length > 80 ? '...' : ''}`;
            const labelText = cleanText.slice(0, 60);

            dot.dataset.rawText = tooltipText;

            const labelSpan = document.createElement('span');
            labelSpan.className = 'glm-nav-label';
            labelSpan.innerText = labelText;
            dot.appendChild(labelSpan);

            dot.onmouseenter = () => {
                if (isCollapsed || isListMode) return;
                const rect = dot.getBoundingClientRect();
                tooltip.innerText = (dot.classList.contains('is-starred') ? "⭐ " : "") + dot.dataset.rawText;
                tooltip.style.right = (window.innerWidth - rect.left + 25) + 'px';
                tooltip.style.top = (rect.top + rect.height / 2) + 'px';
                tooltip.classList.add('visible');
            };
            dot.onmouseleave = () => tooltip.classList.remove('visible');

            // [点击逻辑]
            dot.onclick = (e) => {
                e.stopPropagation();

                // 1. 立即锁定雷达
                isClickScrolling = true;
                if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);

                // 2. 手动更新宝石状态
                const allDots = scrollArea.querySelectorAll('.glm-nav-dot');
                allDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');

                // 3. 滚动
                const targetQ = document.getElementById(q.id);
                if (targetQ) {
                    // [V14.20 修复] 豆包强制瞬间跳转 (auto) + 顶部对齐 (start)，解决 React 容器滚动失效
                    if (currentAdapter.name === 'Doubao') {
                        targetQ.scrollIntoView({ behavior: 'auto', block: 'start' });
                    } else {
                        targetQ.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // --- 智能判断高亮目标 ---
                    let flashNode = targetQ;
                    // ChatGPT/Grok/Doubao 高亮气泡
                    if (wrapper.classList.contains('site-chatgpt') || wrapper.classList.contains('site-grok') || wrapper.classList.contains('site-doubao')) {
                        const bubble = targetQ.querySelector('.user-message-bubble-color') ||
                                       targetQ.querySelector('[class*="bg-"]') ||
                                       (wrapper.classList.contains('site-grok') ? targetQ : null) ||
                                       (wrapper.classList.contains('site-doubao') ? targetQ : null); // 豆包容器本身即气泡
                        if (bubble) {
                            flashNode = bubble;
                            const r = window.getComputedStyle(bubble).borderRadius;
                            if(r && r!=='0px') flashNode.style.setProperty('--glm-flash-radius', r);
                        }
                    }

                    // 4. 触发高亮
                    document.querySelectorAll('.glm-flash-target').forEach(el => el.classList.remove('glm-flash-target'));
                    flashNode.classList.remove('glm-flash-target');
                    void flashNode.offsetWidth; // 强制重绘
                    flashNode.classList.add('glm-flash-target');
                }

                setTimeout(() => { isClickScrolling = false; }, 2000);
            };

            dot.ondblclick = (e) => {
                e.stopPropagation();
                const nowStarred = toggleStar(q.id, currentChatId);
                const freshIcons = getCurrentIcons();
                if (freshIcons.star && freshIcons.star !== "null") dot.style.backgroundImage = nowStarred ? `url(${freshIcons.star})` : `url(${freshIcons.normal})`;
                nowStarred ? dot.classList.add('is-starred') : dot.classList.remove('is-starred');
                if (!isListMode) {
                    tooltip.innerText = (nowStarred ? "⭐ " : "") + dot.dataset.rawText;
                    dot.style.transform = "scale(1.6)";
                    setTimeout(() => dot.style.transform = "", 200);
                }
            };

            scrollArea.appendChild(dot);
        });

        // ============================================================
        // [核心] 主动雷达扫描引擎 (V14.15 智能休眠版)
        // ============================================================
        if (document._gem_radar) {
            document.removeEventListener('scroll', document._gem_radar, true);
        }

        let radarTicking = false;
        document._gem_radar = () => {
            // [V14.15] 滚动防抖检测：只要在滚，就重置定时器
            if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
            scrollDebounceTimer = setTimeout(() => {
                // 100ms 没有滚动事件，视为滚动结束，解锁雷达
                isClickScrolling = false;
            }, 100);

            // 如果正在点击跳转（被锁），或者正在计算中，直接退出
            if (isClickScrolling) return;
            if (radarTicking) return;

            radarTicking = true;
            requestAnimationFrame(() => {
                if (!currentQuestions || currentQuestions.length === 0) {
                    radarTicking = false;
                    return;
                }

                const readingLine = window.innerHeight / 4;
                let closestQId = null;
                let minDistance = Infinity;

                for (const qData of currentQuestions) {
                    const qNode = document.getElementById(qData.id);
                    if (!qNode) continue;

                    const rect = qNode.getBoundingClientRect();
                    const distance = Math.abs(rect.top - readingLine);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestQId = qData.id;
                    }
                }

                if (closestQId) {
                    const activeDot = scrollArea.querySelector('.glm-nav-dot.active');
                    if (!activeDot || activeDot.dataset.targetId !== closestQId) {
                        if (activeDot) activeDot.classList.remove('active');
                        const newActive = scrollArea.querySelector(`.glm-nav-dot[data-target-id="${closestQId}"]`);
                        if (newActive) {
                            newActive.classList.add('active');
                            const containerH = scrollArea.clientHeight;
                            // 侧边栏跟随滚动
                            scrollArea.scrollTo({
                                top: newActive.offsetTop - (containerH / 2) + 12,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
                radarTicking = false;

                // [V14.20] 绘制连线 (仅当有2个以上时)
                const navList = document.getElementById('gem-nav-list');
                const canvas = document.getElementById('gem-canvas');
                if (!navList || !canvas) return;

                const ctx = canvas.getContext('2d');
                canvas.width = 100;
                canvas.height = navList.scrollHeight || window.innerHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (currentQuestions.length >= 2) {
                    ctx.beginPath();
                    // [V14.21 修复] 豆包连线颜色逻辑：若是豆包(white bg)，用深色线；其他用浅色线
                    const isDoubao = document.body.classList.contains('site-doubao');
                    ctx.strokeStyle = isDoubao ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
                    ctx.lineWidth = 2;

                    let first = true;
                    Array.from(navList.children).forEach(item => {
                        const y = item.offsetTop + (item.offsetHeight / 2);
                        const x = 50; // 居中
                        if (first) { ctx.moveTo(x, y); first = false; }
                        else { ctx.lineTo(x, y); }
                    });
                    ctx.stroke();
                }
            });
        };

        // [V14.20] 开启 Capture 模式，适配豆包内部滚动
        document.addEventListener('scroll', document._gem_radar, { capture: true, passive: true });
    }

    let timeout = null;
    const observer = new MutationObserver(() => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(generateNavNodes, 800);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(generateNavNodes, 1000);

})();