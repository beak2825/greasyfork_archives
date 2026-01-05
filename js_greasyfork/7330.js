// ==UserScript==
// @name            napisy24.pl helper
// @version         1.6.3
// @author          KO
// @description     Dodaje kilka ciekawych funkcji na stronie napisy24.pl
// @namespace       KO/napisy24_helper
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3wEDDSUqO/kIZgAAB3RJREFUeNrtm1tsHFcZx39nbnubXe/6trabxDElJHGaVoSoXAoNClGJeAgRPDYICQkkkBAKqlBJH0IJjRCtKEgVUkCqFCEhxEtFpCJaBG2VthQqW7JFFGhMSOI0sRN7veu9zs6NB6/Xu95Ze5w6SVvPefFeZo7O9zv/73Z2LFzXZSMPiQ0+AgABgABAACAAEAAIAAQAAgAbdSiLL06ePPlH13V3bQSjhRDnjh079uUmAKZpHtqzZw/hcPhDbXylUmF0dPTeFgUApNNpYrHYhxpAsVi8MzFAiOot36vK14mF/o4kSi3fWZZFoVBY85ymaa4cA9ZjRLQxumKniYX+gSzlsJ0Uper9zBS+Rbn6gK85ktEXGEgeBxyypa9wLfvjpu/Pnj3L7Ows+/fvp7Oz09ecExMTjI+Pc+DAAWRZvh0KcOmOn2Ko+2skIi8jSzkAZGmOePg1hrofJRX7w+oA1XP0J38EODUlXG25Zm5uzlPK7YbjOIyNjeE4DoZhrL8ChDDZlDpKPPwqAFV7E/nyAcrm/cS0t+iIvogkivR3/ISKuZNydXebeQwGUj9EYLfH7Lo4zgIcRfG39Hw+z+Kpl67r9fvXDUA8/Ne68bOFr3Nj/vu4LMhsvvwIBeMhNnd+D3DQQ6+1BdAb/yUh5SKOG6FU/Th66E1P/68v3CeASqVSfy3L8voDKFU/QaZ4hELlYQrGZ1p3oPIFTDuNKk+jSHOec8RCb9Ol/xaAm/nvoin/87zuVgA0Grzc+LYx4E//muZ3/7xK43FptmTyxn8zTM6Vmz637B6mco97Gg+gyDdR5WkADGtr6wJEkYHkE4BL2byP2cKRtsbYtt20m2sF4CsLlKo2vz57CdeFvYNJNndGePrlCUavZFk8QP7irl6+s2/I1wLS8Wfrr8vVPS3f93X8FFW+hovM9eyTK8bl9wpA0zTK5fLKCpAEdUMvzpQ4fubfjFxeMh7gpXM3GL2SXSU4WvR3nKAjeqYeD8rmrmXx41WS0Rdq8eMbVMztq5Wwa3bRRQCSJCFJ0uoKUOWli55/4zKG5aCHFL75uUGGuqOcePEdbuYN3r6UZc+WpLespAybOo8S1UYWMoM1yNT8403XyNIc/cnjNdf4KDfz3169c2swYLm0TdMkl8uRz+fJ5/MUi0UMw6inS03T/LmA5SxttWE5RDWZpw7vZGtXFID7BuK88h+D6XnDc8KoNsqm1GMo8o2FfG18infnfobldDbVDQPJ4yjSLC4y1+aewnW1NQGYmppicnKSbDZLLpdbtS5QVdUfgIrZnIcffXBT3XiAzujCQucrVstkXfppehM/R2DjuhrT80fJFI8AzdLtiZ8iHv5bDdCnkaQCUW0EFwVcBVnK1tzRQJay2E6yxQXGxsbaGhqPx4lGo2iaRiaTIZvNrgWA07DQEF/anV7miLWA1CBBgc09nY+RCP+lppwh3p17xtOnFSlDt/6b+ns99Dp66PW2pfX2vs9iOd1cmjlNwe5qVls0SiqVIplM1v8u72ZHRkbWCmBJAfu3dyMtCzym7dR8eEmOqdjv68ZnS4eZyj2B40a8g5KrkTceRg+9WWt2Vv9tUlAF3KY6YN++ffT09KxepNeid7us4ZkGF8eDW1MeOyhqu2zX83hP/LnavXu5lj3RIvlmADpXM8/WY4EkDIQwEZj1v72JX5CI/JmKOcy17JNYdg+W041lzSypIxLxlQUWDffdDZYaFNCtax5BbuGW2eJCuxtW30GW8guBKfeDFY332lvHDYPbLFvbjdfcTKdi7vSsBNtF9RYDaxWjbwCNMSCqtcpGD8m14GVTMR2S0Ys1qSkY1sfqZwGSqCBEBUkY2E4C2+l4zz3nohFCiLY+3Q5AI7wVAWjy0g5WbQdNkZY1LaGl1rRU5Z5Urv7+3p7DKPIMkmg9sKham5nM/ArDGvKhC3NFAKqq+i6KFkG1AyC1dndqQyPTelM60QjAxDC3AxJCWGjKJU/jATRlknTiaV+LtpzF4CZ7AvAr/0YAjWX0igr4SE+U3ngIRRZNu71Uu4eJhxXyFYt4WKFgPMSlmeeJhd7CcRNYdhe2k8Rxw7huCMcNocgZwup58pXP+1p0rnSIkHKBXPmQp5x1XfcNoLe3F13X6evr8+sCEqeOPIBA4KUyRRI889VdlEybzalIPfqXqnvbLsKwoGh80veiDWuIycxzLZ8PDg4iSRLpdNr/MV0kwsGDB/13gwupbWX/6uu4O0fniqIwNDS0vnPe6o2WZXH9+vX3xVF3f3+/7wOSdQNw/vx5Lly44Nli3snhOA7btm1j9+7ddxaA4zi4rts2vdypIYRY9dRnxQ6TDT5uWQGLufhuu4DrumuqC9YNwI4dOxgYGOBuP2kqhCCRSNx5AEIIOjq86/vLly9z5cqVdTV0y5YtDA4Ovn9cYKUxMTFR/wlrvUa1Wr0tAIJHZIIscJsqs8bf5NZrzg8MgOHhYYaHhwMX+MC5wPT09IZ4SMoTgKqqZ8bHxzfEY3Kqqp6r1zPB/wwFdUAAIAAQAAgABAACAAGAAEAAYEOO/wNzY+aLYxIEkAAAAABJRU5ErkJggg==
// @match           https://napisy24.pl/*
// @homepage        https://github.com/olodev/n24h
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/7330/napisy24pl%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/7330/napisy24pl%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var icons = {
        staroff:  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3gwUDR0hRbYVJwAAAjtJREFUOMudlM+rElEUx8+8lOGqE6PjzLyXGzczbhSVAqOyRYt2QYu3q7eqhehCJmwXiW8hSgvxByK0qFX/QIKLlsILIRI0uXlHQmgR+QZFEEZUnFaGr17O6x24i3vuuZ/DOed7L2UYBphZtVp9AAAQj8ffm8Va4ALGcVzKMAwKAEyBYBjGzlUulx9jjOcY43mlUjkyi98zyUeJopjgeZ7meZ4WBCEBANSuCzuBtVotFg6Hb2z2oVDoeq1Wi10KmMvlnKIoPnE6nb/77HK5LIIgPM1kMuw/S8rn8zcZhrlltVp9NpvNbbVa3TRNc3a73enz+fYRQmeS6rq+JoT8mM1m4+Vyqc3n85Gu6yNd1/F4PP5oYRjGL8vy81AotH+RiSOE9oLBoAcAPNv+drutEUIyV+r1+udGozFYr9cRURSdcAnrdDrfMcZKIpF4Q22EXSwW70qS9DoSicj/A2u1Wt9UVY0lk8kPAADU9kspFAoBr9f7LhqN+imKMtVvs9n8OhwOjxRF+XTulBVF6fZ6vcNut/vzAmWOCCGH27BzZWMYho1l2atmQJZlHYvFwmKqQ5fLdZ/neWQGFATBxnHcPVMgQiiA0Flev9/XVFXV/ogDhFDA9LdxOBwHm6YTQk4JISfT6fQlAAAh5FiW5duSJLm3Y3cCaZq+hjE+HQwGJ5qmvUilUl+2jh8WCoWAqqrHkiTdoWna89fT25ZNNps9YBjm7Wq1eqYoSm9XD0ulkh8AXk0mk0fpdHq88f8CflYIlVvjW0cAAAAASUVORK5CYII='
        ,staron:  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3gwUDR8nnuPSkAAAAsZJREFUOMulk0tvG1UUx//n3Jm5M2NnUjueOnYCoptmQYNUSKEqFYss2CGqloeQ6AoWkbJtdhVS8wX4ALBAoq14NGXBAqFu2oqmFSgEUKqySRcNIbUzcRw7bTyx554unGeBuApHOrpX5179dF5/EhF0sj8mgrcA4KUzte87/bXwDOYGqXMiIAAdgdzpw68T6Q97+sPXcs+Fr05fTZ/9n0AiP3BHPV9pz1faTbujANG+gdMT/khYzA6ZJIZJYoR9mVemJ/yRfQF/ukwZL3A+sl2xEhMjMQ042lhe2v74+hd04D9runPRPu767glWPGA5Vo6YckpJj+Vwpjvn9bISFkk2OwDTIrMSNRZaTVORhCKTSLnVMuXWeuveWn31tqU990i2WBjL9x/sNSZGksQwZh3GbJ5NiCSACEAMVjZnC34fs+5jdqCUBrNG+UE5qii+QCKC374L3s4Wcp+GxeyhLWgSb0HFNCEQECkwO21XGopdsNKI5qtz0cNo7OXT9a9pc7Gnv/HeCPKZz/LPZw+bpIHtbBswSQwRsw1SLpg1WGmU5qr3q+XqyNC7jWu7hnL0vbWb1b+W3pmfXZjZvRkEgEBE7esO+3u2/Gc9qr+/CQMAelp6ty7SQPGF8EYm7+VNst4uWZqAtEsmdsDKwfLDuLw0Xxs+9kF8d0/psYHvem7AZAFsAAhEeGPIDCILTBZcX9Jxsm511LLb5b3pBymPWNr9IAYkgQAg8EaWFvxA+77nDQP4fU+gpfSg7XgQacKAwKKwUqpFYKA77MoRGMQWLGXD1s5gxwwdTxeYHYghVKOVxUqpOtlcjT8BgOrS4/FMeOD1bL4nR2zDcXShI1DZdrFSWl5cLi1OrlUenR86G8/seD41dUkP1qLV8Uw+PGk7uu8f2hORLb/5JQpTV1I//nzFeXFn/N/8l6/SR6a+Tf0w+TmyO+NPAC36SwTUSJYTAAAAAElFTkSuQmCC'
        ,starign: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3wgOBzkLYwp6HwAAAvZJREFUOMuNlEtIG1EUhv+ZPEYnajSJxQQsSgjNqjZGW2uhoCioRdHSrgpCsZvErkKlpIRiKQhBJUFFI7RSxZ0GDHGjG9sKpRTJxkElPhc11mQmpfiIGZXbhQ/U+MiBu7jnnvNx/nvOvUAS1t3dXdfV1fU0mVg6mSC1Wv1GrVbbAFBn/QSgCfCWAEokay6X6wXHcTsLCwt7Ho+n8QJsgACEAO5kK6R0Ot3rnJwcVqPRMJmZmdbW1laaABIAAwBeAvgOwHGSIL2O1tPTYzWZTIUne7PZXLjF8xYA9wE0AvgG4AkF7Nwotb29XTEyMjLD8zw5XZub5HdxsXAsc4IAqQmS2traHiiVyhK5XG5kWVbNMIxGKpVqWJbNMhqNWpZlJQCAw0OkNTeDGR1F1GTa+2G3B+M0HYnFYkIsFuNFUeSi0ehPqUqlMuXn578zm823riz38BBpVisYrxf7FRXA4GDKQ4a5e9ogQhAIBITV1dWPkvHx8ZnS0tIlURQfabXaxPbv7yO9qQmMzwexogLbQ0MgDHMuhOO49WAwaLNYLJ9OnW63+7Hf7w+eu7NQiMRraggBSLyykgihEDl3zvNkcnJypbe3t/pSZZ2dnQVer5eLRCJHsOrqI1htLeE3Ns6BIpEIGRsbm3O73cXXdrejo8P4dWIiHK+qOoLV1SXAeJ4nU1NTf5xO552L+QlzKA+FMgt9PpV8ehpifT22PB5AmjiuGRkZ6fF4XH4tkACp/4aHh9LDYYnY0ICtvr5LYQCQnZ3NZmVllQOYvRRIABaATxkOG+INDdg+hhFCsLS0JFAURen1ehVFHf0PLMtCoVAUXFrhMcwPoHy9qCiU0t+vIxSF1ZUVfm5ubkYQhA80Te8tLi469Hp9mcFgUFEUBYVCob1KsgdAOYDPAYejJGdtTTY/Px8QBOG9zWb7dSb+mcvlure8vOzIy8srk8lkuoSnd1zhbQCv2ltaelNyc78cHBy02Gy22RumwSyTyZy7u7vP7Xb73xP/f4cxclaSnWDmAAAAAElFTkSuQmCC'
        ,search:  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABJdEVYdENvcHlyaWdodABQdWJsaWMgRG9tYWluIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL3B1YmxpY2RvbWFpbi9Zw/7KAAABTklEQVQokY2PP0hCYRTFf/eZFThULhG0F0UQ4djgZsaHS0FBUK7NTkFNRVNbGER/oEVoCnyfgptbNAdRYwQ5BqJS6Ou2fMoriTrbvef+uOeIqgJQLpfngyDYFpElYAh4E5GTWCx2lkwm3wlJVBXf97MicgoM0q/7SCSymE6n692FZ61dEJELB+RFJNHpdMZUdQ2oA3NBEFx9++T7fglYBm6MMSuAds1isTjled4j8BmNRidTqVQNwANm3U0+DABkMpknoAl47XY70YvnSiMiEz/LVKvVAaDh/NcwZAFUNVupVOJhqNFoHAPjQK3Vaj2EO00Dt8Ao8AIcAXEXe9Xd7RljDnqQqmKtTQIFoC+iUwfYMsYUepDLP9xsNjdVdUZERlT1DvgALh0YABvGmOse9JustTvAYfejqq7/CTlwF9h34/O/IIBSqZRT1Rxw/gU4l4oisfSMMQAAAABJRU5ErkJggg=='
        ,gear:    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3gwZCB0WCaqqHgAAA3FJREFUOMulVN1LI1cUP2fuHchmQ12jMRKNRIwFG1jb3ARhxIbp0vSh6EP70AUpeWj/o1LYV5XtUx8Ka0ultKDJiB9MaAyCYASt+dB80padWZmZe/vQzDYyrvvQ83Tvub/7Ox+/cy8KIeA+SyaTHyLiAgAAIUQ7ODjYvQ9P4S0my/LPc3NzFADg5OTkFQC8cx9eGtyoqupTFOUZY2wZAIAx9phSKhRFkRVFkSVJkpPJ5Hv9s88URXmmqqpvkAPdkhVFeSCE+CUcDrNOp8Mdx6lxzkOZTGZoZmYGAQBOT095Pp//S5KkNiEkEgwGpWazqSPix7u7u+atkoUQ30YiEZbNZn2O40C3250lhMDIyMjr6LOzs9Lw8PAjzvmjYDAIhBDY2tpiV1dX3wDA17cIbdv+qdVqfeE4DlBKYWxs7M4ejY6OwsAd6HQ69s3NzQ+eHh4eHn5v23a92+16SGq1GtRqNY+/2WyCZVl/6Lq+6VGZMfZYluWQJP2n08XFhSgUCoZlWfW+4pGlpSX/1NQUAgBQSoFzPskYY7qu6wAAmEwmP6KU/kgp5YuLiw/i8Tj2ewobGxuGaZpPdV1/0Q+6HAgEvltdXQ24QSuVitA0zbRtW7Jt+1MJEdOJRILmcjm/SwYAcHl5CY7jVF0yAABd119YltUYLD8ej2Mul/MnEgmKiGkJAAAR7xQAEfkdPvEG7L+iIGKxXC6L9fV1o1KpvAZHo1EghERTqVTW9aVSqSwhJDIxMQGDJa+trRnlclkgYhGFEICIyBj7gFL628rKypA7Gufn57xQKJiO49T6bzmSyWT80WhUclXe3Nz807KsJ8VisSiEELQvgACAoqIoTc75kBs9FotJsVjsYbVafRcRYTAzdw4JIdW9vT3dM4fpdHqFEDIRDAY9/ZmcnPSQuUOOiNOMsU88hLIsfx4OhwkhBGzbhlarBb1ez0PS6/Wg1WqBbdsgyzKEQiHq8/meej6H+fn5h36//9fx8fH32+22wzlvOI4zpqpqYHp6GgEAzs7OxPb29t+EkDYhZDwUCpF6vf67YRhPSqXSy1sZlkqll4ioXl9fPzcM40tN0+KWZak7Ozumi8nn868sy1rSNG3GNM2vGo3Gc0RUXbJbGb7JFhYWzEQiQQEAjo+Pb/b39wP/68cWQiwfHR2x/vrwbfh/AK2fjH9FpXiPAAAAAElFTkSuQmCC'
    };

    var options_db = 'n24h_options';
    var shows_db = 'n24h_shows';
    var au_ignore_db = 'n24h_authors_ignore';
    var tr_ignore_db = 'n24h_translations_ignore';

    var utils = {
        /**
             Dodaj dodatkowego CSS'a do strony
        */
        insertcss: function(css) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            document.head.appendChild(style);
        },
        getSkin: function() {
            if (document.querySelector('ul.menu.avatar-main-menu.avatar-menu-icons.white')) {
                return 1;
            }
            if (document.querySelector('div.rt-social-buttons')) {
                return 2;
            }
            return 0;
        }
    };

    /**
    */
    var ls = {
        setItem: function(name, value) {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(name, value);
            } else {
                localStorage.setItem(name, value);
            }
        },
        getItem: function(name, defaultValue) {
            let value;
            if (typeof GM_getValue !== 'undefined') {
                value=GM_getValue(name, defaultValue);
            } else {
                value=localStorage.getItem(name);
                if (!value) {
                    value=defaultValue;
                }
            }
            return value;
        },
        removeItem: function(name) {
            if (typeof GM_deleteValue !== 'undefined') {
                GM_deleteValue(name);
            } else {
                localStorage.removeItem(name);
            }
        }
    };

    /**
        Obsługa opcji
    */
    var options = {
        /**
            Zapisz wartość
        */
        setValue: function(name, value) {
            let optdb=ls.getItem(options_db, '{}');
            let o=JSON.parse(optdb);
            o[name]=value;
            ls.setItem(options_db, JSON.stringify(o));
        },
        /**
            Pobierz wartość
        */
        getValue: function(name, def) {
            let optdb=ls.getItem(options_db, '{}');
            let o=JSON.parse(optdb);
            let value=o[name];
            if (value==null) {
                value=def;
            }
            return value;
        },
        /**
            Usuń klucz z opcji
        */
        remove: function(name) {
            let optdb=ls.getItem(options_db,'{}');
            let o=JSON.parse(optdb);
            delete o[name];
            ls.setItem(options_db, JSON.stringify(o));
        },
        /**
            Pokaż/ukryj checkboxy w zależności od innych opcji
        */
        showHideCheckboxs: function() {
            let n24info=document.querySelector('input[data-n24h-checkbox="shown24info"]');
            let useimdb=document.querySelector('input[data-n24h-checkbox="useimdbinfo"]');
            if (n24info.checked) {
                useimdb.parentNode.setAttribute('style', 'display:block');
            } else {
                useimdb.parentNode.setAttribute('style', 'display:none');
            }
            let altskins=document.querySelectorAll('input[data-n24h-radio="altskinid"]');
            let usealtskin=document.querySelector('input[data-n24h-checkbox="usealtskin"]');
            for (let i=0;i<altskins.length;i++) {
                altskins[i].parentNode.setAttribute('style', usealtskin.checked?'display:block':'display:none');
            }
        },
        /**
            Wypełnij panele aktualnymi ustawieniami, serialami, itp.
        */
        fillPanels: function() {
            //checkboxy
            let checkboxs=document.querySelectorAll('input[data-n24h-checkbox]');
            for (let i=0;i<checkboxs.length;i++) {
                checkboxs[i].checked=options.getValue(checkboxs[i].getAttribute('data-n24h-checkbox'), false);
            }
            //seriale
            let keywords=db.getAll(shows_db);
            let areashows=document.getElementById('n24h_opt_areashows');
            let showtext='';
            for (let i=0;i<keywords.length;i++) {
                if (showtext!='') {
                    showtext+='\n';
                }
                showtext+=keywords[i];
            }
            areashows.value=showtext;
            //pomijani autorzy
            let authors=db.getAll(au_ignore_db);
            let areaauthors=document.getElementById('n24h_opt_areaignore');
            let authorstext='';
            for (let i=0;i<authors.length;i++) {
                if (authorstext!='') {
                    authorstext+='\n';
                }
                authorstext+=authors[i];
            }
            areaauthors.value=authorstext;
            //debug
            let areadebug=document.getElementById('n24h_opt_areadebug');
            let debugtext='/**opcje**/\n';
            debugtext+=ls.getItem(options_db, null);
            debugtext+='\n\n/**seriale**/\n';
            debugtext+=ls.getItem(shows_db, null);
            debugtext+='\n\n/**pomijani autorzy**/\n';
            debugtext+=ls.getItem(au_ignore_db, null);
            debugtext+='\n\n/**pomijane tłumaczenia**/\n';
            debugtext+=ls.getItem(tr_ignore_db, null);
            areadebug.value=debugtext;
            let radios=document.querySelectorAll('input[data-n24h-radio]');
            for (let i=0;i<radios.length;i++) {
                radios[i].checked=radios[i].getAttribute('data-n24h-radio_id')===options.getValue(radios[i].getAttribute('data-n24h-radio'), '1');
            }
            options.showHideCheckboxs();
        },
        /**
            Pokaż panel opcji
        */
        show: function() {
            options.fillPanels();
            let body=document.querySelector('body');
            let bstyle=body.getAttribute('style');
            if ((bstyle!=null)&&(bstyle!="")) {
                bstyle='overflow-y: hidden;'+bstyle
            } else {
                bstyle='overflow-y: hidden;';
            }
            body.setAttribute('style', bstyle);
            let panel=document.querySelector('div.n24h_options_background');
            panel.setAttribute('style', 'display:block');
        },
        /**
            Ukryj panel opcji
        */
        hide: function() {
            let body=document.querySelector('body');
            let bstyle=body.getAttribute('style');
            bstyle=bstyle.replace(/overflow-y: hidden;/g, '');
            body.setAttribute('style', bstyle);
            let panel=document.querySelector('div.n24h_options_background');
            panel.setAttribute('style', 'display:none');
        },
        /**
            Obsługa kliknięcia checkboxa
        */
        checkboxClick: function(e) {
            e = e || window.event;
            let target = e.target || e.srcElement;
            options.setValue(target.getAttribute('data-n24h-checkbox'), target.checked);
            options.showHideCheckboxs();
            options.showSaveInfo();
        },
        /**
            Obsługa kliknięcia radiobuttona
        */
        radioClick: function(e) {
            e = e || window.event;
            let target = e.target || e.srcElement;
            options.setValue(target.getAttribute('data-n24h-radio'), target.getAttribute('data-n24h-radio_id'));
            options.showSaveInfo();
        },
        /**
            Obsługa kliknięcia przycisku sekcji
        */
        typeButtonClick: function(e) {
            e = e || window.event;
            let target = e.target || e.srcElement;
            let panel = target.getAttribute('data-n24h-optiontype');
            let opt_panels=document.querySelectorAll('div[data-n24h-optionpanel]');
            for (let i=0;i<opt_panels.length;i++) {
                opt_panels[i].setAttribute('style', panel==opt_panels[i].getAttribute('data-n24h-optionpanel')?'display:block':'display:none');
            }
            let opt_buttons=document.querySelectorAll('div[data-n24h-optiontype]');
            for (let i=0;i<opt_buttons.length;i++) {
                opt_buttons[i].setAttribute('class', panel==opt_buttons[i].getAttribute('data-n24h-optiontype')?'n24h_options_panel_button n24h_options_panel_button_selected':'n24h_options_panel_button');
            }
            options.fillPanels();
        },
        /**
            Obsługa przycisku zapisz
        */
        btnSaveClick: function() {
            let areashows=document.getElementById('n24h_opt_areashows');
            let shows = areashows.value.split('\n');
            let title;
            ls.removeItem(shows_db);
            for (let i=0;i<shows.length;i++)
            {
                title=shows[i];
                if (options.getValue('titleremoveyear', false)) {
                    title=title.trim().replace(/\(\d{4}\)/g, '');
                }
                if (options.getValue('titleremoveapostrophe', false)) {
                    title=title.trim().replace(/'|’|`/g, '');
                }
                title=title.trim();
                console.log(title);
                if (title != null && title != '' && !db.exists(shows_db, title)) {
                    db.add(shows_db, title);
                }
            }
            options.fillPanels();
            options.showSaveInfo();
        },
        btnAuthorsSaveClick: function() {
            let areaauthors=document.getElementById('n24h_opt_areaignore');
            let authors = areaauthors.value.split('\n');
            let author;
            ls.removeItem(au_ignore_db);
            for (let i=0;i<authors.length;i++)
            {
                author=authors[i].trim();
                if (author != null && author != '' && !db.exists(au_ignore_db, author)) {
                    db.add(au_ignore_db, author);
                }
            }
            options.fillPanels();
            options.showSaveInfo();
        },
        /**
            Obsługa przycisku usuwania opcji
        */
        btnKillOptClick: function() {
            if (confirm('Czy na pewno chcesz usunąć wszystkie ustawienia?\nNie będzie można tego cofnąć.')) {
                ls.removeItem(options_db);
                options.showSaveInfo();
            }
            options.fillPanels();
        },
        /**
            Obsługa przycisku usuwania seriali
        */
        btnKillShowsClick: function() {
            if (confirm('Czy na pewno chcesz usunąć wszystkie ulubione filmy/seriale?\nNie będzie można tego cofnąć.')) {
                ls.removeItem(shows_db);
                options.showSaveInfo();
            }
            options.fillPanels();
        },
        btnKillIgnAu: function() {
            if (confirm('Czy na pewno chcesz usunąć wszystkich pomijanych autorów?\nNie będzie można tego cofnąć.')) {
                ls.removeItem(au_ignore_db);
                options.showSaveInfo();
            }
            options.fillPanels();
        },
        btnKillIgnTr: function() {
            if (confirm('Czy na pewno chcesz usunąć wszystkie pomijane tłumaczenia?\nNie będzie można tego cofnąć.')) {
                ls.removeItem(tr_ignore_db);
                options.showSaveInfo();
            }
            options.fillPanels();
        },
        savetimeout: null,
        showSaveInfo: function() {
            let saveinfo=document.querySelector('#n24h_options_saved');
            if (saveinfo) {
                clearTimeout(options.savetimeout);
                saveinfo.style.display='block';
                options.savetimeout=setTimeout(options.hideSaveInfo,1000);
            }
        },
        hideSaveInfo: function() {
            let saveinfo=document.querySelector('#n24h_options_saved');
            if (saveinfo) {
                saveinfo.style.display='none';
            }
        },
        init: function() {
            let css='#n24h_options_gear{'+
                'cursor:pointer;'+
                '}'+
                '.n24h_options_background{'+
                'position:fixed;'+
                'top:0;'+
                'left:0;'+
                'width:100%;'+
                'height:100%;'+
                'background:rgba(0,0,0,0.6);'+
                'text-align:center;'+
                'z-index:9999;'+
                '}'+
                '.n24h_options_dialog{'+
                'margin: 0px auto;'+
                'padding: 50px 0px;'+
                'width: 900px;'+
                'height: 100%;'+
                'transition: none 0s ease 0s;'+
                'transform: none;'+
                'position: relative;'+
                'box-sizing: border-box;'+
                '}'+
                '.n24h_options_content{'+
                'max-height: 100%;'+
                'overflow-y: auto;'+
                'border: 4px solid rgba(85, 85, 85, 0.5);'+
                'background-clip: padding-box;'+
                'box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.3);'+
                'border-radius: 13px;'+
                'position: relative;'+
                'outline: 0px none;'+
                'background-color: #FFF;'+
                'box-sizing: border-box;'+
                'color: #303030;'+
                'font-family: Arial,Helvetica,sans-serif;'+
                'text-align:left;'+
                'display: block;'+
                '}'+
                '.n24h_options_header{'+
                'margin: 0px;'+
                'border-bottom: 1px solid #A0A0A0;'+
                'padding: 10px 10px 0px 10px;'+
                '}'+
                '.n24h_options_body{'+
                'display: table;'+
                'min-height: 150px;'+
                '}'+
                '.n24h_options_body>input{'+
                'margin: 0px;'+
                '}'+
                '.n24h_options_close{'+
                'float:right;'+
                'padding: 0px;'+
                'border: 1px solid;'+
                'cursor:pointer;'+
                'margin-top: -25px;'+
                'padding: 1px 3px 1px 3px;'+
                'border-radius: 5px;'+
                'background: linear-gradient(#EDEEEE, #E2E3E3);'+
                '}'+
                '.n24h_options_close:hover{'+
                'background-color: #D0D0D0;'+
                'border-color: #646F7C;'+
                '}'+
                '.n24h_options_panel_l{'+
                'padding: 10px;'+
                'border-right: 1px solid #A0A0A0;'+
                'display: table-cell;'+
                'position: relative;'+
                '}'+
                '.n24h_options_panel_r{'+
                'padding: 10px;'+
                'width: 750px;'+
                '}'+
                '.n24h_options_panel_button{'+
                'cursor: pointer;'+
                'background-color: #D5D5D5;'+
                'border: 1px solid #000000;'+
                'border-bottom: 3px solid #000000;'+
                'padding: 5px 10px 5px 10px;'+
                'margin-bottom: 2px;'+
                '}'+
                '.n24h_options_panel_button:hover{'+
                'background-color: #E0E0E0;'+
                'border-radius: 0px 0px 3px 3px;'+
                'border-bottom: 3px solid #D26911;'+
                '}'+
                '.n24h_options_panel_button_selected{'+
                'border-radius: 0px 0px 3px 3px;'+
                'border-bottom: 3px solid #F21911;'+
                '}'+
                '.n24h_opt_button{'+
                'background-color: #D5D5D5;'+
                'border: 1px solid #000000;'+
                'border-bottom: 3px solid #000000;'+
                'padding: 3px 5px 3px 5px;'+
                'margin-top: 5px;'+
                'margin-right: 5px;'+
                '}'+
                '.n24h_opt_button:hover{'+
                'background-color: #E0E0E0;'+
                'border-radius: 0px 0px 3px 3px;'+
                'border-bottom: 3px solid #D26911;'+
                '}'+
                '.n24h_opt_area{'+
                'width: 100% !important;'+
                'height: auto !important;'+
                'cursor: auto !important;'+
                'margin-bottom: 0px;'+
                'background-color: #EEEEEE;'+
                'color: #555555;'+
                'border: 1px solid #CCCCCC;'+
                'margin-left: 0px;'+
                'padding: 5px;'+
                '}'+
                '.n24h_opt_area:focus{'+
                'color: #555555;'+
                '}'+
                '.n24h_options_panel_r > label{'+
                'margin-bottom: 0px;'+
                'cursor:pointer;'+
                '}'+
                '.n24h_options_panel_r > label > input{'+
                'margin: 0px;'+
                'margin-top: -4px;'+
                'display: inline !important;'+
                '}'+
                '.n24_option_level2{'+
                'margin-left:30px;'+
                '}';
            let css1='#n24h_options_gear{'+
                'width:20px;'+
                'line-height: 26px;'+
                '}';
            let css2='.n24h-gear-social {'+
                'transition-delay: 0s;'+
                'transition-duration: 0.2s;'+
                'transition-property: all;'+
                'transition-timing-function: ease-out;'+
                '}'+
                '.n24h-gear-social:hover {'+
                'background: #007E00;'+
                '}'+
                '.n24h-icon-gear {'+
                'display: inline;'+
                'min-width: 18px;'+
                'min-height: 18px;'+
                'background-image: url('+icons.gear+');'+
                'background-repeat: no-repeat;'+
                'background-position: center;'+
                'padding-left: 18px;'+
                '}'+
                '#n24h_options_gear .social-button-text {'+
                'margin-left: 5px;'+
                '}';
            utils.insertcss(css);
            let skin_id=utils.getSkin();
            let li, ul, img, div, span1, span2, clear;
            switch (skin_id) {
                case 1:
                    ul=document.querySelector('ul.menu.avatar-main-menu.avatar-menu-icons.white');
                    if (!ul) {
                        return;
                    }
                    utils.insertcss(css1);
                    li=document.createElement('li'); //panel z opcjami
                    li.setAttribute('id', 'n24h_options_gear');
                    li.setAttribute('title', 'napisy24.pl helper opcje');
                    li.addEventListener('click', options.show, false);
                    img=document.createElement('img');
                    img.setAttribute('src', icons.gear);
                    img.setAttribute('style', 'margin-top: -5px;');
                    li.appendChild(img);
                    ul.appendChild(li);
                    break;
                case 2:
                    div=document.querySelector('div.rt-social-buttons');
                    if (!div) {
                        return;
                    }
                    utils.insertcss(css2);
                    li=document.createElement('div'); //panel z opcjami
                    li.setAttribute('id', 'n24h_options_gear');
                    li.setAttribute('class', 'social-button n24h-gear-social');
                    li.addEventListener('click', options.show, false);
                    span1=document.createElement('span');
                    span1.setAttribute('class', 'n24h-icon-gear');
                    li.appendChild(span1);
                    span2=document.createElement('span');
                    span2.setAttribute('class', 'social-button-text');
                    span2.appendChild(document.createTextNode('n24h opcje'));
                    li.appendChild(span2);
                    clear=div.querySelector('div.clear');
                    div.insertBefore(li, clear);
                    break;
                default:
                    console.log('Błędny skin "utils.getSkin()": '+skin_id);
            }
            let panel = document.createElement('div');
            panel.innerHTML='<div class="n24h_options_background" style="display:none">'+
                '<div class="n24h_options_dialog">'+
                '<div class="n24h_options_content">'+
                '<div class="n24h_options_header">'+
                '<img src="'+icons.gear+'" style="margin-top: -5px;padding-right: 5px;">Opcje:<br/>'+
                '<span style="color:red;font-size:small;">Zmiana opcji wymaga przeładowania strony.</span>'+
                '<div class="n24h_options_close">X</div>'+
                '<span id="n24h_options_saved" style="color:green;font-size:small;float:right;display:none;">Zapisane</span>'+
                '</div>'+
                '<div class="n24h_options_body">'+
                '<div class="n24h_options_panel_l">'+
                '<div class="n24h_options_panel_button n24h_options_panel_button_selected" data-n24h-optiontype="general">Ogólne</div>'+
                '<div class="n24h_options_panel_button" data-n24h-optiontype="shows">Seriale</div>'+
                '<div class="n24h_options_panel_button" data-n24h-optiontype="ignore">Pomijane</div>'+
                '<div class="n24h_options_panel_button" data-n24h-optiontype="debug">Debug</div>'+
                '</div>'+
                '<div class="n24h_options_panel_r" data-n24h-optionpanel="general">'+
                '<label><input type="checkbox" data-n24h-checkbox="fixsearch"> Zapamiętaj tekst w wyszukiwarce</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="killcover"> Usuń okładki filmów/seriali</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="killimdbinfo"> Usuń info o serialu/ocenę IMDB</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="hideemotspanel"> Ukrywaj panel z emotikonami i dodawaniem komentarza</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="fixcomments"> W komentarzach propozycję poprawek wyświetlaj czcionką o stałej szerokości</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="shown24info"> Na stronie z tłumaczeniami pokaż info N24/IMDB</label>'+
                '<label class="n24_option_level2" style="display:none"><input type="checkbox" data-n24h-checkbox="useimdbinfo"> Zastąp info N24 linkiem do IMDB</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="usealtskin"> Używaj alternatywnej skórki <div style="color:blue;font-size:small;display: inline;">najlepiej działa z domyślnym <i>(ciemnym)</i> stylem strony</div></label>'+
                '<label class="n24_option_level2" style="display:none"><input type="radio" name="n24h_altskinid" data-n24h-radio="altskinid" data-n24h-radio_id="1"> szara</label>'+
                '<label class="n24_option_level2" style="display:none"><input type="radio" name="n24h_altskinid" data-n24h-radio="altskinid" data-n24h-radio_id="2"> n24 classic</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="usesmallmenubuttons"> Zmniejsz rozmiar przycisków menu</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="removetargetblank"> Usuń target="_blank" ze wszystkich odnośników (nie otwieraj w nowej karcie)</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="addemptyrow"> Dodaj pusty wiersz po ostatnim ulubionym filmie/serialu</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="turnofffavpanel"> Wyłącz panel ulubionych</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="turnoffallfav"> Wyłącz wszystkie opcje ulubionych filmów/seriali</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="removeconnectbuttons"> Usuń przyciski "Dołącz..."</label>'+
                '</div>'+
                '<div style="display:none" class="n24h_options_panel_r" data-n24h-optionpanel="shows">'+
                '<span>Ulubione filmy/seriale (jeden film/serial na linię)</span>'+
                '<textarea id="n24h_opt_areashows" class="n24h_opt_area" rows="15" ></textarea>'+
                '<label><input type="checkbox" data-n24h-checkbox="titleremoveyear"> Usuń rok (RRRR) z nazwy filmu/serialu</label>'+
                '<label><input type="checkbox" data-n24h-checkbox="titleremoveapostrophe"> Usuń apostrofy ( \' ’ ` ) z nazwy filmu/serialu</label>'+
                '<button id="n24h_opt_btn_save" class="n24h_opt_button">Zapisz</button>'+
                '</div>'+
                '<div style="display:none" class="n24h_options_panel_r" data-n24h-optionpanel="ignore">'+
                '<span>Tłumaczenia tych autorów są pomijane na liście ulubionych (jeden autor/autor(tytuł) na linię)</span>'+
                '<textarea id="n24h_opt_areaignore" class="n24h_opt_area" rows="15" ></textarea>'+
                '<label><input type="checkbox" data-n24h-checkbox="autokillignoretranslations"> Automatycznie usuwaj pomijane tłumaczenia jeżeli nie ma ich w tabelce z tłumaczeniami</label>'+
                '<button id="n24h_opt_btn_ignoresave" class="n24h_opt_button">Zapisz</button>'+
                '</div>'+
                '<div style="display:none" class="n24h_options_panel_r" data-n24h-optionpanel="debug">'+
                '<span>Informacje do debugowania</span>'+
                '<textarea id="n24h_opt_areadebug" rows="10" class="n24h_opt_area" readOnly></textarea>'+
                '<button id="n24h_opt_btn_killshows" class="n24h_opt_button">Usuń wszystkie ulubione filmy/seriale</button>'+
                '<button id="n24h_opt_btn_ignoreaukill" class="n24h_opt_button">Usuń wszystkich pomijanych autorów</button>'+
                '<button id="n24h_opt_btn_ignorekill" class="n24h_opt_button">Usuń wszystkie pomijane tłumaczenia (bez autorów)</button>'+
                '<button id="n24h_opt_btn_killopt" class="n24h_opt_button">Usuń wszystkie ustawienia (bez filmów/seriali i opcji pomijania)</button>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>';
            document.body.appendChild(panel);
            //przycisk zapisz
            let close=document.querySelector('div.n24h_options_close');
            close.addEventListener('click', options.hide, false);
            //checkboxy
            let opt_checkboxs=document.querySelectorAll('input[data-n24h-checkbox]');
            for (let i=0;i<opt_checkboxs.length;i++) {
                opt_checkboxs[i].addEventListener('change', options.checkboxClick, false);
            }
            //radio
            let opt_radios=document.querySelectorAll('input[data-n24h-radio]');
            for (let i=0;i<opt_radios.length;i++) {
                opt_radios[i].addEventListener('change', options.radioClick, false);
            }
            //sekcje
            let opt_types=document.querySelectorAll('div[data-n24h-optiontype]');
            for (let i=0;i<opt_types.length;i++) {
                opt_types[i].addEventListener('click', options.typeButtonClick, false);
            }
            //przycisk zapisz
            let opt_btn_save=document.getElementById('n24h_opt_btn_save');
            opt_btn_save.addEventListener('click', options.btnSaveClick, false);
            let opt_btn_authorsave=document.getElementById('n24h_opt_btn_ignoresave');
            opt_btn_authorsave.addEventListener('click', options.btnAuthorsSaveClick, false);
            //usuń opcje
            let opt_btn_killopt=document.getElementById('n24h_opt_btn_killopt');
            opt_btn_killopt.addEventListener('click', options.btnKillOptClick, false);
            //usuń seriale
            let opt_btn_killshows=document.getElementById('n24h_opt_btn_killshows');
            opt_btn_killshows.addEventListener('click', options.btnKillShowsClick, false);
            //usuń pomijanych autorów
            let opt_btn_killignau=document.getElementById('n24h_opt_btn_ignoreaukill');
            opt_btn_killignau.addEventListener('click', options.btnKillIgnAu, false);
            //usuń pomijane tłumaczenia
            let opt_btn_killigntr=document.getElementById('n24h_opt_btn_ignorekill');
            opt_btn_killigntr.addEventListener('click', options.btnKillIgnTr, false);

            if (typeof GM_registerMenuCommand !== "undefined") {
                GM_registerMenuCommand("napisy24.pl helper opcje", options.show);
            }
        }
    };

    var db = {
        all: null,
        upper: null,
        /**
            Pobiera tablicę fraz-kluczy.
        */
        getAll: function(db_name) {
            let keywords = ls.getItem(db_name, null);
            this.all = (keywords != null && keywords != '') ? JSON.parse(keywords) : [];
            return this.all;
        },
        /**
            Pobiera tablicę fraz-kluczy.
        */
        exists: function(db_name, keyword) {
            let keywords = ls.getItem(db_name, null);
            this.upper = (keywords != null && keywords != '') ? JSON.parse(keywords.toUpperCase()) : [];
            return this.upper.indexOf(keyword.toUpperCase()) < 0 ? false : true;
        },
        /**
            Dodaje keyword do tablicy fraz-kluczy.
        */
        add: function(db_name, keyword) {
            if (!this.exists(db_name, keyword)) {
                this.getAll(db_name);
                this.all = this.all.concat([keyword]);
                ls.setItem(db_name, JSON.stringify(this.all));
                return 1;
            }
            return 0;
        },
        /**
            Usuwa keyword z tablicy fraz-kluczy.
        */
        remove: function(db_name, keyword) {
            if (this.exists(db_name, keyword)) {
                this.getAll(db_name);
                this.all.splice(this.upper.indexOf(keyword.toUpperCase()), 1);
                ls.setItem(db_name, JSON.stringify(this.all));
                return 1;
            }
            return 0;
        }
    };

    /**
        Strona z tłumaczeniami
    */
    var tlumaczenia = {
        /**
            Pobierz nazwę filmu/serialu bez numeru sezonu i odcinka/odcinków
        */
        getTitle: function(row) {
            let title=row.getAttribute('data-head');
            //oczyść tytuł ze wszystkich śmieci i numeru serii oraz odcinka/odcinków
            title=title.trim().replace(/\d+x\d+.*/, '');
            //usuń rok
            if (options.getValue('titleremoveyear', false)) {
                title=title.trim().replace(/\(\d{4}\)/g, '');
            }
            //usuń apostrofy
            if (options.getValue('titleremoveapostrophe', false)) {
                title=title.trim().replace(/'|’|`/g, '');
            }
            //usuń spacje na końcu która pozostała po wywaleniu numeru serii i odcina
            title=title.trim();
            return title;
        },
        /**
            Pobierz autora napisów
        */
        getAuthor: function(row) {
            return row.querySelector('a[href*="profile/userprofile/"]').textContent.trim();
        },
        /**
            Pobierz ID tłumaczenia
        */
        getTID: function(row) {
            return row.querySelector('input[data-tid]').getAttribute('data-tid').trim();
        },
        /**
            Zrób zebrę od nowa
        */
        restyleRows: function() {
            let rows=document.querySelectorAll('table#translationsTable > tbody > tr:not([style*="none"])');
            for (let i=0;i<rows.length;i++) {
                let trcl=rows[i].getAttribute('class');
                trcl=trcl.replace(/(odd|even)/, '');
                if (i%2) {
                    rows[i].setAttribute('class', trcl+' odd');
                } else {
                    rows[i].setAttribute('class', trcl+' even');
                }
            }
        },
        /**
            Przenieś wiersz na szczyt listy
        */
        moveTop: function(row) {
            //znajdź tabelkę z tłumaczeniami
            let table=document.querySelector('table#translationsTable > tbody');
            //znajdź pierwszy wiersz tabelki
            let first_line=table.querySelector('tr');
            //wstaw przed pierwszy wiersz nasz wiersz
            table.insertBefore(row,first_line);
            let td=row.querySelector('td[data-n24h-star]');
            td.setAttribute('data-n24h-star', 'on');
        },
        /**
            Umieść ulubione filmy/seriale na szczycie listy
        */
        FavoriteOnTop: function() {
            /**
                Dla każdego wiersza w tabeli...
                Od końca do początku, żeby zachować kolejność sortowania
            */
            tlumaczenia.RemoveEmptyRow();
            let rows=document.querySelectorAll('table#translationsTable > tbody > tr');
            for (let i=rows.length-1;i>=0;i--) {
                let row=rows[i];
                /**
                    Wyciąga tytuł i oczyszcza go ze zbędnych znaków.
                */
                let title=tlumaczenia.getTitle(row);
                let star=row.querySelector('td[data-n24h-star]');
                if (db.exists(shows_db, title)) {
                    //Znaleziono dopasowanie.
                    if (db.exists(au_ignore_db, tlumaczenia.getAuthor(row))) {
                        //autor jest na liście pomijanych nie przenosimy na górę
                        star.setAttribute('data-n24h-star', 'auign');
                    } else if (db.exists(au_ignore_db, tlumaczenia.getAuthor(row)+'('+tlumaczenia.getTitle(row)+')')) {
                        //tłumaczenie jest na liście pomijanych nie przenosimy na górę
                        star.setAttribute('data-n24h-star', 'autit');
                    } else if (db.exists(tr_ignore_db, tlumaczenia.getTID(row))) {
                        //tłumaczenie jest na liście pomijanych nie przenosimy na górę
                        star.setAttribute('data-n24h-star', 'trign');
                    } else {
                        tlumaczenia.moveTop(row);
                    }
                } else {
                    //Nie ma dopasowania
                    //Wyczyść na wszelki wypadek gwiazdkę
                    star.setAttribute('data-n24h-star', 'off');
                }
            }
            if (options.getValue('addemptyrow', false)) {
                let stars=document.querySelectorAll('table#translationsTable>tbody>tr>td[data-n24h-star="on"]');
                if (stars.length > 0) {
                    let table=document.querySelector('table#translationsTable > tbody');
                    let star=stars[stars.length-1];
                    if (star) {
                        let staroff=star.parentNode.nextSibling;
                        let emptyrow=document.createElement('tr');
                        emptyrow.setAttribute('id', 'n24h_emptyrow');
                        emptyrow.setAttribute('class', 'hoverable');
                        emptyrow.innerHTML='<td colspan="7"><div>&nbsp;</div></td>';
                        table.insertBefore(emptyrow,staroff);
                    }
                }
            }
            tlumaczenia.restyleRows();
        },
        /**
            Ustaw informację o kierunku sortowania w nagłówku tabelki
        */
        SetColumnHeader: function(col, reverse) {
            let header=document.querySelectorAll('table#translationsTable>thead>tr>th.header');
            for (let i=0;i<header.length;i++) {
                if ((i==col)&&(reverse==1)) {
                    header[i].setAttribute('class', 'header n24h_sort_asc')
                } else if ((i==col)&&(reverse==-1)) {
                    header[i].setAttribute('class', 'header n24h_sort_desc')
                } else {
                    let thcl=header[i].getAttribute('class');
                    thcl=thcl.replace(/(n24h_sort_asc|n24h_sort_desc)/, '');
                    header[i].setAttribute('class', thcl);
                }
            }
        },
        /**
            Sortowanie tabelki z tłumaczeniami
        */
        sortTable: function(col, reverse) {
            tlumaczenia.RemoveEmptyRow();
            let table=document.querySelector('table#translationsTable');
            col = typeof col !== 'undefined' ? col : options.getValue('column', 4);
            reverse = typeof reverse !== 'undefined' ? reverse : options.getValue('reverse', 1);
            let tb = table.tBodies[0];
            let tr = Array.prototype.slice.call(tb.rows, 0);
            reverse = -((+reverse) || -1);
            tr = tr.sort(function (a, b) { // sort rows
                let atext=a.cells[col].textContent.trim();
                let btext=b.cells[col].textContent.trim();
                if ((col==3)||(col==4)) {
                    //Kolumna 3: "Postęp"
                    //Kolumna 4: "Oczekujący"
                    //trzeba usunąć znaki: procentu, plus i minus oraz zamienić na numerek
                    let avalue=Number(atext.replace(/[\+\-\%]/g, ''));
                    let bvalue=Number(btext.replace(/[\+\-\%]/g, ''));
                    return reverse==1?avalue-bvalue:bvalue-avalue;
                } else {
                    return reverse * (atext.localeCompare(btext));
                }
            });
            for(let i = 0; i < tr.length; ++i) {
                tb.appendChild(tr[i]);
            }

            //zapisz ustawienia sortowania
            options.setValue('column', col);
            options.setValue('reverse', -((+reverse) || -1));
            //ustaw nagłówek
            tlumaczenia.SetColumnHeader(col, reverse);
            //przesuń ulubione na samą górę
            if (!options.getValue('turnoffallfav', false)) {
                tlumaczenia.FavoriteOnTop();
            } else {
                tlumaczenia.restyleRows();
            }
        },
        /**
            Obsługa kliknięcia w gwiazdkę
        */
        StarClickHandler: function(e) {
            e = e || window.event;
            let target = e.target || e.srcElement;
            let row=target.parentNode;
            let title=tlumaczenia.getTitle(row);
            if (this.getAttribute('data-n24h-star')==='on') {
                //Przestań śledzić...
                tlumaczenia.RemoveTitle(title);
            } else if (this.getAttribute('data-n24h-star')==='off') {
                //Zacznij śledzić...
                let keyword = prompt('Podaj tytuł filmu lub serialu\nbez numeracji sezonu/odcinka:', tlumaczenia.getTitle(row));
                tlumaczenia.AddTitle(keyword);
            }
        },
        /**
            Menu pomijania
        */
        IgnoreMenuHandler: function(e) {
            if (this.getAttribute('data-n24h-star')!='off') {
                e.preventDefault();
                e.stopPropagation();
                e = e || window.event;
                let target = e.target || e.srcElement;
                let row=target.parentNode;
                let rmenubg=document.querySelector('div.n24h_menu_background');
                rmenubg.setAttribute('style', 'display:block');
                let rmenu=document.querySelector('div#n24h_rmenu');
                rmenu.setAttribute('data-n24h-ign-tid', tlumaczenia.getTID(row));
                rmenu.setAttribute('data-n24h-ign-aut', tlumaczenia.getAuthor(row));
                rmenu.setAttribute('data-n24h-ign-ati', tlumaczenia.getAuthor(row)+'('+tlumaczenia.getTitle(row)+')');
                if (this.getAttribute('data-n24h-star')=='on') {
                    document.getElementById("n24h_start_auign").style.display = 'block';
                    document.getElementById("n24h_start_atign").style.display = 'block';
                    document.getElementById("n24h_start_trign").style.display = 'block';
                    document.getElementById("n24h_stop_auign").style.display = 'none';
                    document.getElementById("n24h_stop_atign").style.display = 'none';
                    document.getElementById("n24h_stop_trign").style.display = 'none';
                } else if(this.getAttribute('data-n24h-star')=='auign') {
                    document.getElementById("n24h_start_auign").style.display = 'none';
                    document.getElementById("n24h_start_atign").style.display = 'none';
                    document.getElementById("n24h_start_trign").style.display = 'none';
                    document.getElementById("n24h_stop_auign").style.display = 'block';
                    document.getElementById("n24h_stop_atign").style.display = 'none';
                    document.getElementById("n24h_stop_trign").style.display = 'none';
                } else if(this.getAttribute('data-n24h-star')=='autit') {
                    document.getElementById("n24h_start_auign").style.display = 'none';
                    document.getElementById("n24h_start_atign").style.display = 'none';
                    document.getElementById("n24h_start_trign").style.display = 'none';
                    document.getElementById("n24h_stop_auign").style.display = 'none';
                    document.getElementById("n24h_stop_atign").style.display = 'block';
                    document.getElementById("n24h_stop_trign").style.display = 'none';
                } else if(this.getAttribute('data-n24h-star')=='trign') {
                    document.getElementById("n24h_start_auign").style.display = 'none';
                    document.getElementById("n24h_start_atign").style.display = 'none';
                    document.getElementById("n24h_start_trign").style.display = 'none';
                    document.getElementById("n24h_stop_auign").style.display = 'none';
                    document.getElementById("n24h_stop_atign").style.display = 'none';
                    document.getElementById("n24h_stop_trign").style.display = 'block';
                }
                rmenu.style.top = e.clientY + 'px';
                //sprawdź czy zmieścimy się po prawej stronie
                if (window.innerWidth>e.clientX+rmenu.offsetWidth+20) {
                    rmenu.style.left = (e.clientX + 20) + 'px';
                } else {
                    //niestety nie, narysuj menu w lewo
                    rmenu.style.left = (e.clientX - rmenu.offsetWidth) + 'px';
                }
            }
        },
        IgnoreMenuClick: function(e) {
            e = e || window.event;
            let target = e.target || e.srcElement;
            let author=target.parentNode.parentNode.getAttribute('data-n24h-ign-aut');
            let tid=target.parentNode.parentNode.getAttribute('data-n24h-ign-tid');
            let autitle=target.parentNode.parentNode.getAttribute('data-n24h-ign-ati');
            let event=target.getAttribute('id');
            if (event=='n24h_start_auign') {
                db.add(au_ignore_db, author);
            }
            if (event=='n24h_start_atign') {
                db.add(au_ignore_db, autitle);
            }
            if (event=='n24h_start_trign') {
                db.add(tr_ignore_db, tid);
            }
            if (event=='n24h_stop_auign') {
                db.remove(au_ignore_db, author);
            }
            if (event=='n24h_stop_atign') {
                db.remove(au_ignore_db, autitle);
            }
            if (event=='n24h_stop_trign') {
                db.remove(tr_ignore_db, tid);
            }
            tlumaczenia.HideRMenu();
            tlumaczenia.sortTable();
        },
        /**
            Szukanie filmu/serialu na liście tłumaczonych
        */
        DoSearch: function() {
            let keyword = document.querySelector('input#n24h_tr_input_search').value.toUpperCase();
            let rows=document.querySelectorAll('table#translationsTable > tbody > tr:not(#n24h_emptyrow)');
            for (let i=0;i<rows.length;i++) {
                let row=rows[i];
                let title=tlumaczenia.getTitle(row).toUpperCase();
                if (keyword == null || keyword == '') {
                    //pokazujemy wszystkie rekordy
                    row.style.display='table-row';
                } else if (title.indexOf(keyword)!=-1) {
                    row.style.display='table-row';
                } else {
                    row.style.display='none';
                }
            }
            tlumaczenia.restyleRows();
        },
        /**
            Przycisk wyczyść / ESC
        */
        ClearHandler: function(e) {
            e = e || window.event;
            let isEscape = false;
            if (e.type == "keydown") {
                if ("key" in e) {
                    isEscape = (e.key == "Escape" || e.key == "Esc");
                } else {
                    isEscape = (e.keyCode == 27);
                }
            }
            if (isEscape || e.type == "click") {
                document.getElementById('n24h_tr_input_search').value='';
                tlumaczenia.DoSearch();
            }
        },
        /**
            Dodaj film/serial do listy ulubionych
        */
        AddTitle: function(title) {
            if (title != null && title != '' && !db.exists(shows_db, title)) {
                if (db.add(shows_db, title)) {
                    if (!options.getValue('turnofffavpanel', false)) {
                        document.querySelector('input#n24h_tr_input_new').value='';
                        let select=document.querySelector('select#n24h_tr_shows_list');
                        let option=document.createElement('option');
                        option.text=title;
                        option.setAttribute('class', 'n24h_tr_option');
                        select.add(option);
                    }
                    tlumaczenia.sortTable();
                }
            }
        },
        /**
            Przycisk dodaj
        */
        AddNewHandler: function() {
            let keyword = document.querySelector('input#n24h_tr_input_new').value.trim();
            tlumaczenia.AddTitle(keyword);
        },
        /**
            Usuń film/serial z listy ulubionych
        */
        RemoveTitle: function(title) {
            if (db.exists(shows_db, title)) {
                if (db.remove(shows_db, title)) {
                    if (!options.getValue('turnofffavpanel', false)) {
                        let select=document.querySelector('select#n24h_tr_shows_list');
                        for (let i=0;i<select.length;i++) {
                            if (select[i].value.toUpperCase()==title.toUpperCase()) {
                                select.remove(i);
                                break;
                            }
                        }
                    }
                }
                tlumaczenia.sortTable();
            }
        },
        /**
            Przycisk usuń
        */
        RemoveHandler: function() {
            let keyword = document.querySelector('select#n24h_tr_shows_list').value;
            tlumaczenia.RemoveTitle(keyword);
        },
        /**
            Dodaj panel na górze tabelki z tłumaczeniami
        */
        AddPanel: function() {
            let css='#tlumaczenia #n24h_tr_input_search{'+ //wyszukiwanie
                'margin-right: 5px;'+
                'padding: 0px 0px 0px 22px;'+
                'border-radius: 4px;'+
                'height: 25px;'+
                'margin-bottom: 0px;'+
                'width: 150px;'+
                'background-repeat: no-repeat;'+
                'background-position: 5px center;'+
                'background-image: url('+icons.search+');'+
                '}'+
                '#tlumaczenia #n24h_tr_input_new{'+
                'margin-right: 5px;'+
                'padding: 0px 0px 0px 27px;'+
                'border-radius: 4px;'+
                'height: 25px;'+
                'margin-bottom: 0px;'+
                'width: 150px;'+
                'background-repeat: no-repeat;'+
                'background-position: 5px center;'+
                'background-image: url('+icons.staroff+');'+
                '}'+
                '#tlumaczenia #n24h_tr_input_clear,#tlumaczenia #n24h_tr_input_add,#tlumaczenia #n24h_tr_input_remove{'+
                'border: 1px solid #32383E;'+
                'border-radius: 4px;'+
                'cursor: pointer;'+
                'width: 80px;'+
                'height: 25px;'+
                '}'+
                '#tlumaczenia #n24h_tr_input_clear:hover,#tlumaczenia #n24h_tr_input_add:hover,#tlumaczenia #n24h_tr_input_remove:hover{'+
                'border-color:rgba(82, 168, 236, 0.8);outline:0;outline:thin dotted 9;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(82,168,236,.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(82,168,236,.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(82,168,236,.6);'+
                '}'+
                '#tlumaczenia #n24h_tr_shows_list{'+
                'width: auto;'+
                'margin-right: 5px;'+
                'height: 25px;'+
                'margin-bottom: 0px;'+
                'margin-left: 30px;'+
                'border: 1px solid #32383E'+
                'background-color: #1B1F23;'+
                'color: #7A878C;'+
                'max-width: 200px;'+
                '}'
            let css1='#tlumaczenia #n24h_tr_input_clear,#tlumaczenia #n24h_tr_input_add,#tlumaczenia #n24h_tr_input_remove{'+
                'background-color: #1B1F23;'+
                'color: #7A878C;'+
                '}'+
                '#tlumaczenia .n24h_tr_option{'+
                'background-color: #1B1F23;'+
                'color: #7A878C;'+
                '}';
            let css2='#tlumaczenia #n24h_tr_input_clear,#tlumaczenia #n24h_tr_input_add,#tlumaczenia #n24h_tr_input_remove{'+
                'background-color: #F8F8F8;'+
                'color: #2e2e2e;'+
                '}'+
                '#tlumaczenia .n24h_tr_option{'+
                'background-color: #efefef;'+
                'color: #585858;'+
                '}';

            let trtable=document.querySelector('table#translationsTable');
            if (!trtable) {
                return;
            }
            utils.insertcss(css);
            let skin_id=utils.getSkin();
            switch (skin_id) {
                case 1:
                    utils.insertcss(css1);
                    break;
                case 2:
                    utils.insertcss(css2);
                    break;
                default:
                    console.log('Błędny skin "utils.getSkin()": '+skin_id);
            }

            let panel=document.createElement('div'); //panel z opcjami
            panel.setAttribute('id', 'n24h_tr_panel');
            panel.setAttribute('class', 'tbl_top');
            panel.setAttribute('style', 'margin: 0px;');

            let div=document.createElement('div'); //ogólny div ze wszystkim
            div.setAttribute('style', 'float:none;padding: 10px; margin-top: -15px; margin-bottom: 15px;');

            let left_div=document.createElement('div'); //lewa część opcji
            left_div.setAttribute('style', 'float:left')

            let input_search=document.createElement('input'); //okienko do szukania
            input_search.setAttribute('id', 'n24h_tr_input_search');
            input_search.setAttribute('type', 'text');
            input_search.setAttribute('placeholder', 'Szukaj...');
            input_search.addEventListener('keyup', tlumaczenia.DoSearch, false);
            input_search.addEventListener('keydown', tlumaczenia.ClearHandler, false);

            let input_clear=document.createElement('input'); //przycisk wyczyść
            input_clear.setAttribute('id', 'n24h_tr_input_clear');
            input_clear.setAttribute('type', 'button');
            input_clear.setAttribute('value', 'Wyczyść');
            input_clear.addEventListener('click', tlumaczenia.ClearHandler, false);

            //dodaj do lewego diva
            left_div.appendChild(input_search); //okienko szukania
            left_div.appendChild(input_clear); //i przycisk wyczyść

            let right_div=document.createElement('div'); //prawa część opcji
            right_div.setAttribute('style', 'float:right')

            let input_new=document.createElement('input'); //okienko do dodawania nowego serialu/filmu
            input_new.setAttribute('id', 'n24h_tr_input_new');
            input_new.setAttribute('type', 'text');

            let input_add=document.createElement('input'); //przycisk dodaj
            input_add.setAttribute('id', 'n24h_tr_input_add');
            input_add.setAttribute('type', 'button');
            input_add.setAttribute('value', 'Dodaj');
            input_add.addEventListener('click', tlumaczenia.AddNewHandler, false);

            let select=document.createElement('select'); //selekt z listą seriali/filmów
            select.setAttribute('id', 'n24h_tr_shows_list');
            select.setAttribute('size', '1');

            //wypełnij selekta listą seriali/filmów
            let keywords = db.getAll(shows_db);
            for (let i=0;i<keywords.length;i++) {
                let option=document.createElement('option');
                option.text=keywords[i];
                option.setAttribute('class', 'n24h_tr_option');
                select.add(option);
            }

            let input_remove=document.createElement('input'); //przycisk usuń
            input_remove.setAttribute('id', 'n24h_tr_input_remove');
            input_remove.setAttribute('type', 'button');
            input_remove.setAttribute('value', 'Usuń');
            input_remove.addEventListener('click', tlumaczenia.RemoveHandler, false);

            //dodaj do prawego diva
            right_div.appendChild(input_new); //okienko do dodawania nowego serialu/filmu
            right_div.appendChild(input_add); //przycisk dodaj
            right_div.appendChild(select); //lista seriali/filmów
            right_div.appendChild(input_remove); //i przycisk usuń

            //dodaj do ogólnego diva
            div.appendChild(left_div); //lewego diva
            div.appendChild(right_div); //i prawego diva

            //dodaj ogólnego diva do panelu
            panel.appendChild(div);
            trtable.parentNode.insertBefore(panel,trtable);
        },
        /**
            Dodaj dodatkową kolumnę z gwiazdkami
        */
        AddStars: function() {
            let css='td[data-n24h-star]{'+
                'background-image: url('+icons.staroff+');'+
                'background-repeat: no-repeat;'+
                'background-position: center;'+
                'background-color: transparent !important;'+
                'cursor:pointer !important;'+
                '}'+
                'td[data-n24h-star="on"]{'+
                'background-image: url('+icons.staron+');'+
                '}'+
                'td[data-n24h-star="auign"], td[data-n24h-star="trign"], td[data-n24h-star="autit"]{'+
                'background-image: url('+icons.starign+');'+
                '}';
            let trtable=document.querySelector('table#translationsTable');
            if (!trtable) {
                return;
            }
            utils.insertcss(css);
            let trhead=trtable.querySelector('thead > tr');
            let th=document.createElement('th');
            th.setAttribute('id', 'n24h_tr_favhead');
            th.setAttribute('class', 'nosort header');
            th.setAttribute('style', 'background-image: url('+icons.staron+');background-repeat: no-repeat;background-position: center;width:10px;');
            th.setAttribute('title', 'Ulubione filmy/seriale');
            trhead.appendChild(th);
            let trs=trtable.querySelectorAll('tbody>tr');
            for (let i = 0; i < trs.length; i++) {
                let td=document.createElement('td');
                td.setAttribute('data-n24h-star', '');
                td.addEventListener('click', tlumaczenia.StarClickHandler, false);
                td.addEventListener('contextmenu', tlumaczenia.IgnoreMenuHandler, false);
                trs[i].appendChild(td);
            }

        },
        HideRMenu: function() {
            let rmenubg=document.querySelector('div.n24h_menu_background');
            rmenubg.setAttribute('style', 'display:none');
            let rmenu=document.querySelector('div#n24h_rmenu');
            rmenubg.setAttribute('data-n24h-ign-tid', '');
            rmenubg.setAttribute('data-n24h-ign-aut', '');
            rmenubg.setAttribute('data-n24h-ign-ati', '');
        },
        /**
            Dodaj menu pomijania tłumaczeń
        */
        AddRMenu: function() {
            let css='.n24h_menu_background{'+
                'position:fixed;'+
                'top:0;'+
                'left:0;'+
                'width:100%;'+
                'height:100%;'+
                'z-index:99999;'+
                '}'+
                '.n24h_rmenu{'+
                'z-index:999999;'+
                'position: absolute;'+
                'background-color:#FFFFFF;'+
                'color:#222222;'+
                'box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);'+
                'border: 1px solid rgba(61, 70, 77, 0.1);'+
                'padding: 2px;'+
                'border-radius: 5px;'+
                'margin: 0;'+
                'list-style-type: none;'+
                'list-style: none;'+
                '}'+
                '.n24h_rmenu ul{'+
                'margin: 0;'+
                '}'+
                '.n24h_rmenu li{'+
                'cursor: pointer;'+
                'list-style: none;'+
                'text-decoration: none;'+
                'padding-top: 5px;'+
                'padding-bottom: 5px;'+
                '}'+
                '.n24h_rmenu li:hover{'+
                'background-color:#F0F0F0;'+
                '}';
            utils.insertcss(css);
            let rmenu = document.createElement('div');
            rmenu.setAttribute('class', 'n24h_menu_background');
            rmenu.setAttribute('style', 'display:none');
            rmenu.innerHTML='<div id="n24h_rmenu" class="n24h_rmenu"><ul>'+
                '<li id="n24h_start_auign">Pomijaj&nbsp;tłumaczenia&nbsp;tego&nbsp;autora&nbsp;(wszystkie&nbsp;tytuły)</li>'+
                '<li id="n24h_start_atign">Pomijaj&nbsp;tłumaczenia&nbsp;tego&nbsp;autora&nbsp;(tylko&nbsp;ten&nbsp;tytuł)</li>'+
                '<li id="n24h_start_trign">Pomijaj&nbsp;to&nbsp;tłumaczenie</li>'+
                '<li id="n24h_stop_auign">Przestań&nbsp;pomijać&nbsp;tłumaczenia&nbsp;tego&nbsp;autora&nbsp;(wszystkie&nbsp;tytuły)</li>'+
                '<li id="n24h_stop_atign">Przestań&nbsp;pomijać&nbsp;tłumaczenia&nbsp;tego&nbsp;autora&nbsp;(tylko&nbsp;ten&nbsp;tytuł)</li>'+
                '<li id="n24h_stop_trign">Przestań&nbsp;pomijać&nbsp;to&nbsp;tłumaczenie</li>'+
                '</ul></div>';
            rmenu.addEventListener('click', tlumaczenia.HideRMenu, false);
            document.body.appendChild(rmenu);
            let rmenus=rmenu.querySelectorAll('li');
            for (let i = 0; i < rmenus.length; i++) {
                rmenus[i].addEventListener('click', tlumaczenia.IgnoreMenuClick, false);
            }
        },
        /**
            Ustaw nagłówki tabelki tak żeby dało się ją sortować
        */
        makeSortable: function() {
            let trtable=document.querySelector('table#translationsTable');
            if (!trtable) {
                return;
            }
            let th = trtable.tHead, i;
            th && (th = th.rows[0]) && (th = th.cells);
            if (th) {
                i = th.length;
            } else {
                return;
            }
            while (--i >= 0) {
                if (i<6) { //pomiń kolumnę ulubione
                    (function (i) {
                        let dir = 1;
                        th[i].addEventListener('click', function () {tlumaczenia.sortTable(i, (dir = 1 - dir))});
                    }(i));
                }
            }
        },
        /**
            Skopiuj nagłówki tabelki, żeby wywalić oryginalną obsługę sortowania i dodać naszą
        */
        AddNewHeader: function() {
            let css='#translationsTable th {cursor: pointer !important;}'+
                '#translationsTable th.nosort {cursor: default !important;}'+
                '.n24h_sort_asc{background-image: url(run/images/arrsh.png);background-repeat: no-repeat;background-position: right;}'+
                '.n24h_sort_desc{background-image: url(run/images/arrs.png);background-repeat: no-repeat;background-position: right;}';
            let trtable=document.querySelector('table#translationsTable');
            if (!trtable) {
                return;
            }
            utils.insertcss(css);
            let header=trtable.querySelector('thead');
            let new_header=document.createElement('thead');
            new_header.innerHTML=header.innerHTML;
            trtable.insertBefore(new_header, header);
            trtable.removeChild(header);
            tlumaczenia.makeSortable();
        },
        /**
            Wywal kolumnę info i ewentualnie dodaj linki do tytułów seriali
        */
        FixInfo: function() {
            let trtable=document.querySelector('table#translationsTable');
            if (!trtable) {
                return;
            }
            /**INFO START*/
            if (options.getValue('shown24info', false)) {
                let trs=trtable.querySelectorAll('tbody > tr');
                for (let i = 0; i < trs.length; i++) {
                    let title=trs[i].querySelector('td:nth-child(1)>div');
                    let info=trs[i].querySelector('td:nth-child(2)>div>a[href*="serial/"], a[href*="title/tt"]');
                    if (info) {
                        if (options.getValue('useimdbinfo', false)) {
                            let imdbid=trs[i].getAttribute('data-oczekuja').replace(/(.*imdbid=)(\d+)(.*)/g, '$2');
                            title.innerHTML='<a href="http://www.imdb.com/title/tt'+imdbid+'/" target="_blank">'+title.textContent+'</a>';
                        } else {
                            let target=info.href.indexOf('imdb.com')!=-1?' target="_blank"':'';
                            title.innerHTML='<a href="'+info.href+'"'+target+'>'+title.textContent+'</a>';
                        }
                    }
                }
            }
            /**INFO STOP*/
            //usuń kolumnę Info
            let th=document.querySelector('th:nth-child(2)');
            th.parentNode.removeChild(th);
            let tds=document.querySelectorAll('table#translationsTable>tbody>tr>td:nth-child(2)');
            for (let i = 0; i < tds.length; i++) {
                tds[i].parentNode.removeChild(tds[i]);
            }
        },
        RemoveEmptyRow: function() {
            //usuń pustą belkę jeżeli istnieje
            let emptyrow=document.querySelector('#n24h_emptyrow');
            if (emptyrow) {
                let table=emptyrow.parentNode;
                table.removeChild(emptyrow);
            }
        },
        KillIgnoreTranslations: function() {
            let tmp=[];
            let ignoredb=db.getAll(tr_ignore_db);
            if (ignoredb.length>0) {
                let tid;
                let selector;
                for (let i=0;i<ignoredb.length;i++) {
                    selector='table#translationsTable input[data-tid="'+ignoredb[i]+'"]';
                    tid=document.querySelector(selector);
                    if (tid) {
                        tmp.push(ignoredb[i]);
                    }
                }
                ls.setItem(tr_ignore_db, JSON.stringify(tmp));
            }
        },
        init: function() {
            if (!(options.getValue('turnofffavpanel', false)||options.getValue('turnoffallfav', false))) {
                tlumaczenia.AddPanel();
            }
            tlumaczenia.FixInfo();
            if (!options.getValue('turnoffallfav', false)) {
                tlumaczenia.AddStars();
            }
            tlumaczenia.AddNewHeader();
            if (!options.getValue('turnoffallfav', false)) {
                tlumaczenia.AddRMenu();
            }
            tlumaczenia.sortTable();
            if (options.getValue('autokillignoretranslations', false)) {
                tlumaczenia.KillIgnoreTranslations();
            }
        }
    };

    /**
        Strona z komentarzami
    */
    var komentarze = {
        /**
            Zapisz poprawki za pomocą czcionki o stałej szerokości
        */
        fix_comments: function() {
            let css='div.n24h_comment{'+
                'font-family: Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,serif;'+
                'font-size: 13px;'+
                'text-align: left;'+
                '}';
            utils.insertcss(css);

            let comments=document.querySelectorAll('div.tresc2');
            for (let i=0;i<comments.length;i++)
            {
                let text=comments[i].innerHTML;
                let lines=text.split('<br>');
                let line='';
                text='';
                for (let j=0;j<lines.length;j++)
                {
                    line=lines[j].replace(/((\+|\-)?(.)?(\[|\{)\d+(\]|\})(\[|\{)\d+(\]|\}).*)/g, '<div class="n24h_comment">$1</div>');
                    text=text+line;
                    if (line.search('n24h_comment')==-1) {
                        text=text+'<br>';
                    }
                }
                comments[i].innerHTML=text;
            }
        },
        /**
            Pokaż/ukryj panel z emotkami i dodawaniem komentarza
        */
        ShowHideEmots: function() {
            let emots=document.querySelector('.page > div:nth-child(2)');
            let form=document.querySelector('form#userForm');
            let opener=document.querySelector('div#n24h_comm_opener');
            if ((!emots) || (!form)) {
                return;
            }
            if (emots.style.display==='none')
            {
                emots.style.display='block';
                form.style.display='block';
                opener.setAttribute('class', 'n24h_comm_opener n24h_comm_opener_open');
            } else {
                emots.style.display='none';
                form.style.display='none';
                opener.setAttribute('class', 'n24h_comm_opener');
            }
        },
        /**
            Dodaj strzałkę otwierającą/zamykającą panel emotek i komentarza
        */
        addOpener: function() {
            let css='div.n24h_comm_opener{'+
                'background-image: url(run/images/arrs.png);'+
                'background-repeat: no-repeat;'+
                'height: 20px;'+
                'width: 20px;'+
                'background-position: center;'+
                'cursor:pointer;'+
                'border: 1px solid;'+
                'border-color:#32383E;'+
                'padding: 3px;'+
                'margin-left: 10px;'+
                'float: left;'+
                '}'+
                'div.n24h_comm_opener:hover{'+
                'background-color: #202428;'+
                '}'+
                'div.n24h_comm_opener_open{'+
                'background-image: url(run/images/arrsh.png);'+
                '}';
            let footer=document.querySelector('div.moreInfo>div.infofooter');
            if (!footer) {
                return;
            }
            let footermain=footer.querySelector('#footerMain');
            if (!footermain) {
                return;
            }
            utils.insertcss(css);
            let opener=document.createElement('div');
            opener.setAttribute('id', 'n24h_comm_opener');
            opener.setAttribute('class', options.getValue('hideemotspanel', false)?'n24h_comm_opener':'n24h_comm_opener n24h_comm_opener_open');
            opener.setAttribute('title', 'Pokaż/ukryj dodawanie komentarza');
            opener.addEventListener('click', komentarze.ShowHideEmots, false);
            footer.insertBefore(opener,footermain);
            footer.setAttribute('style', 'padding-bottom: 5px; padding-top: 5px;');
            if (options.getValue('hideemotspanel', false)) {
                komentarze.ShowHideEmots();
            }
        },
        init: function() {
            komentarze.addOpener();
            if (options.getValue('fixcomments', false)) {
                komentarze.fix_comments();
            }
        }
    };

    /**
        Strona o serialu
    */
    var serial = {
        /**
            Dodaj linka do IMDB
        */
        addIMDBlink: function() {
            let info=document.querySelector('.infoColumn2>div:last-child');
            if (!info) {
                return;
            }
            let link=document.createElement('a');
            let imdbid=document.querySelector('#notify_napisy').getAttribute('data-imdb');
            let href='http://www.imdb.com/title/'+imdbid+'/';
            link.setAttribute('href', href);
            link.setAttribute('target', '_blank');
            link.innerHTML='IMDB';
            info.appendChild(document.createTextNode(' / ')); //dodaj spację
            info.appendChild(link);
        },
        setObserver: function() {
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    misc.killTargetBlank();
                });
            });

            observer.observe(document, { childList: true, subtree: true });
        },
        init: function() {
            serial.addIMDBlink();
            if (options.getValue('removetargetblank', false)) {
                serial.setObserver();
            }
        }
    };

    /**
        Różności
    */
    var misc = {
        /**
            Obsługa zapamiętywania wyszukiwanych filmów/seriali między stronami
        */
        SearchHandler: function() {
            let input=document.querySelector('input#phrase');
            if (!input) {
                return;
            }
            sessionStorage.setItem('n24h_search', input.value);
        },
        /**
            Dodaj zapamiętywanie wyszukiwanych filmów/seriali
        */
        fixSearch: function() {
            let input=document.querySelector('input#phrase');
            if (!input) {
                return;
            }
            let searchtext=sessionStorage.getItem('n24h_search');
            if ((searchtext!==null)&&(searchtext!=='')) {
                input.value=searchtext;
            }
            input.addEventListener('keyup', misc.SearchHandler, false);
        },
        /**
            Usuń okładkę filmu/serialu
        */
        killCover: function() {
            let css='div.subtitle{width: 675px !important;}';
            utils.insertcss(css);
            let divs=document.querySelectorAll('div.tbl');
            for (let i=0;i<divs.length;i++) {
                let poster=divs[i].querySelector('div.poster');
                divs[i].removeChild(poster);
            }
        },
        /**
            Usuń ocenę z IMDB
        */
        killIMDBInfo: function() {
            let divs=document.querySelectorAll('div[id^="toggleMe"]');
            for (let i=0;i<divs.length;i++) {
                let infocolumn=divs[i].querySelector('div.infoColumn0');
                divs[i].removeChild(infocolumn);
            }
        },
        /**
            Alternatywne skórki
        */
        altSkin: function() {
            /** Szara start*/
            let altcss1='.avatar-menu-icons[class*="avatar-main-menu-szare"] > li {background-color: #2B68AB;border-right: 1px solid #5592D5;border-bottom: 4px solid #1B4A7E;}'+//menu: forum, irc, rss
                '[class*="avatar-main-menu"] > li:hover {border-bottom: 4px solid #1B4A7E;line-height: 18px;height: 18px;}'+
                '[class*="avatar-main-menu"] > li:hover > a {top:0px;}'+
                '#oczekiwane .main_menu li a, #profile .main_menu li a, #szukaj .main_menu li a, #tlumaczenia .main_menu li a {color: #FFFFFF;}'+
                '#oczekiwane .main_menu li a:hover, #profile .main_menu li a:hover, #szukaj .main_menu li a:hover, #tlumaczenia .main_menu li a:hover {color: #cccccc;}'+
                'nav{background-color: #2B68AB !important;}'+//pusta przestrzeń między menu a dodaj napisy
                'nav ul li.menu_add_napisy a{background-color: #2B68AB;border-bottom: 4px solid #1B4A7E;}'+//przycisk dodaj napisy
                'nav ul li.menu_add_napisy a:hover{background-color: #1B4A7E;color: #CCC;background-position: 21px 12px;}'+
                'nav ul li.menu_add_napisy a:active{color: #CCC;text-shadow: 0px -1px 1px rgba(0, 0, 0, 0.2);filter: dropshadow(color=#33000000, offx=0, offy=-1);border-top: 4px solid #2B68AB;border-bottom: 4px solid #1B4A7E;background-color: #1B4A7E;background-position: 21px 8px;}'+
                'body{background-color:#D5D5D5 !important;color: #272727;}'+//body
                '#avatar-body-middle-block{background-color:#D5D5D5;}'+//środek
                '#avatar-header-inside-block{background-color:#D5D5D5;}'+//górna belka body
                '.logo .screen{border: 4px solid #5592D5 !important;}'+//logo
                '.logo .screen .subline1{background-color: #5592D5 !important;}'+
                '.logo .screen .subline2{background-color: #5592D5 !important;}'+
                '.logo h1{color: #5592D5 !important;}'+
                '.logo h2{color: #5592D5 !important;}'+
                'textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input {background-color: #D5D5D5 !important;color: #000000 !important;}'+//pola tekstowe
                '#search #phrase{color: #000000 !important;}'+//wyszukiwarka
                'section#content .tbl_top{background-color:#D5D5D5 !important;border-top: 1px solid #A0A0A0 !important;}'+ //tabelka nagłówek
                '.tbl_top1, .tbl_top2{background-color:#D5D5D5 !important;border-top: 1px solid #A0A0A0 !important;}'+ //tabelka nagłówek
                'section#content .tbl_top .head_r label{color:#000000 !important;}'+
                'section#content .tbl_top .head_l{color:#000000 !important;}'+
                'section#content .tbl{background-color:#D5D5D5 !important;border-top: 1px solid #A0A0A0 !important;}'+
                'section#content .page{border-color:#A0A0A0 !important;}'+
                'section#content .tbl_out{border-bottom:1px solid #A0A0A0 !important;}'+
                'section#content .tbl .poster{border-right:1px solid #A0A0A0 !important;}'+
                'section#content .pagination{border: 1px solid #A0A0A0;background-color: #E0E0E0;}'+
                'section#content .pagination .page-start, section#content .pagination .page-prev, section#content .pagination .page-next{ color: #272829;background-color: #D5D5D5;}'+//start, poprzednia, następna
                'section#content .pagination .page-start:hover, section#content .pagination .page-prev:hover, section#content .pagination .page-next:hover{color: #272829;background-color: #E0E0E0;border-radius: 0px 0px 3px 3px;border-bottom: 3px solid #D26911;border-top:none;padding-bottom: 0px;line-height: 30px;}'+
                'section#content .pagination .page-prev:hover{background-position: 15px center;}'+
                'section#content .pagination .page-next:hover{background-position: 90px center;}'+
                'section#content .pagination .page-num{color: #272829 !important;background-color: #D5D5D5;}'+//numery stron
                'section#content .pagination .page-num:hover{background-color: #E0E0E0;border-top-width: 1px;margin-top: 0px;border-radius: 0px 0px 3px 3px;border-bottom: 3px solid #D26911;}'+
                'section#content .tbl.opened .subtitle .opener, section#content .tbl .subtitle:hover .opener, .page .closerSmall, .page .closerSmall:hover, .page .openerSmall, .page .openerSmall:hover, .page .closerSmall2, .page .openerSmall2:hover {background-color: #E0E0E0 !important;border-radius: 0px 0px 3px 3px;border-bottom: 3px solid #D26911;}'+
                '.module_frame{border: 1px solid #A0A0A0;}'+
                '.category-modulemodule_frame li a{color: #000000;}'+
                '.category-modulemodule_frame li a:hover{color: #2F2F2F;background-color: #E0E0E0;}'+
                'aside .list li a{color: #000000 !important;}'+
                'aside .list li a:hover{color: #2F2F2F !important;background-color: #E0E0E0 !important;text-decoration: none !important;}'+
                'aside{width: inherit !important;}'+
                '.avatar-module .st-module-heading{background-color: #A0A0A0;color: #2F2F2F;}'+
                '.login-greeting{color: #272829;}'+
                '.moreInfo{background-color:#D5D5D5 !important;color:#000000 !important; border-top: 1px solid #A0A0A0;}'+
                '.page span{color: #272829 !important;}'+
                '.infofooter{border-top: 1px solid #A0A0A0 !important;background-color: #D5D5D5 !important;}'+
                '.infoColumn0{background-color: #D5D5D5 !important;border-right: 1px solid #A0A0A0 !important;border-bottom: 1px solid #A0A0A0 !important;border-top: 1px solid #A0A0A0 !important}'+
                'section#content .page{color: #272829 !important;}'+
                'section#content .tbl .subtitle .sub h2{color: #272829 !important;}'+
                'select {background-color: #C5C5C5 !important;}'+
                'a, a:link, a:visited {color: #1E519D;}'+
                '.infoheader, .infoheader1{color: #000000 !important;}'+
                '.row-fluid {border-bottom: none !important;}'+
                /**tłumaczenia*/
                '#tlumaczenia [class*="avatar-main-menu"] li a {color: #FFF;}'+
                'table.table-layout thead tr th{background-color: #D5D5D5 !important;color: #272829 !important;border-bottom: 1px solid #A0A0A0 !important;border-right: 1px solid #A0A0A0 !important;}'+
                'table.table-layout tbody tr.odd td:not([style*="background-color:#255180"]):not([style*="background-color:#DD7665"]):not([style*="background-color:#41d64b"]):not([style*="background-color:#3399ff"]){background-color: #C5C5C5 !important;}'+
                'table.table-layout tbody tr.even td:not([style*="background-color:#255180"]):not([style*="background-color:#DD7665"]):not([style*="background-color:#41d64b"]):not([style*="background-color:#3399ff"]){background-color: #B5B5B5 !important;}'+
                'table.table-layout tbody tr td{border-bottom: 1px solid #A0A0A0 !important;border-right: 1px solid #A0A0A0 !important;color: #000000 !important;}'+
                'table.table-layout {border: 1px solid #A0A0A0 !important;}'+
                '.progress div{background-color: #A0A0A0 !important; background-image: none !important;}'+
                '#tlumaczenia .progress {background-color: #676767 !important; background-image:none;}'+
                '.progress2 {background-image: none !important;background-color: #676767 !important;bottom: 8px !important;top: 10px !important;height: 20px;overflow: hidden;border-radius: 4px;box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);position: absolute;left: 8px;right: 8px;text-align: center;background-repeat: no-repeat;margin-bottom: 20px;}'+
                '#profile .progress2 div, #szukaj .progress2 div, #tlumaczenia .progress2 div, #serial .progress2 div {background-color: #A0A0A0 !important; background-image: none !important;top: 0px !important;left: 0px !important;right: 0px !important;}'+
                '#oczekiwane .progress2 > span, #profile .progress2 > span, #szukaj .progress2 > span, #tlumaczenia .progress2 > span{position: absolute;bottom: 0px;left: 0px;right: 0px;text-align: center;z-index: 3;font-size: 10px;letter-spacing: 1px;}'+
                '#oczekiwane .progress2 > span > span, #profile .progress2 > span > span, #szukaj .progress2 > span > span, #tlumaczenia .progress2 > span > span {display: inline-block;text-align: center;font-weight: 700;font-size: 9px;width: 36px;letter-spacing: 1px;color: #FFFFFF !important;text-shadow: 0 0 3px #000, 0 0 3px #000;}'+
                '.progress2 span{opacity: 1 !important;}'+
                '#tlumaczenia nav ul li.menu_add_tlum a{background-color: #2B68AB;border-bottom: 4px solid #2B68AB;background-position: 21px 12px; color: #FFFFFF;}'+
                'nav ul li.menu_add_tlum a:hover{border-bottom: 4px solid #1B4A7E;color: #CCCCCC;background-color: #2B68AB;line-height: 44px;height: 42px;background-position: 21px 12px;}'+
                'nav ul li.menu_add_tlum a:active{border-bottom: 4px solid #1B4A7E;color: #CCCCCC;background-color: #2B68AB;line-height: 48px;height: 42px;background-position: 21px 12px;text-shadow:none;filter:none;border-top:none;}'+
                'table.table-layout tbody tr td[style*="background-color:#255180"], td[style*="background-color:#41d64b"], td[style*="background-color:#3399ff"]{background-color:#DFDFDF !important;}'+ //ostatnio zaktualizowane
                'table.table-layout tbody tr td div span[style*="color: white"], span[style*="color: #feee39"]{color: black !important;}'+ //ilość oczekujących
                'table.table-layout tbody tr td div a[style*="color: rgb(0,200,0)"]{color: rgb(0,150,0) !important;}'+ //moderator
                '.translation {cursor: pointer !important;}'+
                '.headerSortUp{background-image: url(run/images/arrs.png);background-repeat: no-repeat;background-position: right;}'+
                '.headerSortDown{background-image: url(run/images/arrsh.png);background-repeat: no-repeat;background-position: right;}'+
                '.progress > span > span {color: #FFFFFF !important;}'+ //procenty ukończenia
                '#tlumaczenia table.table-layout tbody tr a {color: #1E519D;}'+
                /**komentarze*/
                '.moreInfo2{background-color:#D5D5D5 !important;color:#000000 !important;}'+
                'section#content .tbl .avatar{border-right: 1px solid #A0A0A0 !important;}'+
                '#komentarze section#content .tbl .subtitle .sub h3{color: #000000;}'+
                '#komentarze section#content .tbl .mark{color: #000000;}'+
                'textarea{background-color: #B5B5B5 !important;color: #272829 !important;}'+
                '#komentowane-header{background-color: #ADADAD !important;}'+ //górna belka z datą i oceną
                '.tresc2 div[style*="background-color: #292f35"]{background-color: #E9E9E9 !important;}'+ //cytat
                '#komentarze .sortComments{color: #000000;}'+
                /**artykuły*/
                '#jc{background: none repeat scroll 0px 0px #B5B5B5;}'+
                '#jc h4{color: #272829;background-color: #C5C5C5;}'+
                '#jc .rbox{background-color: #B5B5B5;}'+
                '#comments .comment-author, #comments .author-homepage, #comments .author-email{color: #4B3F37;}'+
                '#comments .comment-date{color: #4B3F37;}'+
                '#comments .comment-body{color: #4B3F37;}'+
                '#comments .quote{color: #4B3F37;}'+
                '#comments blockquote, #comments .hidden, #comments code, #comments pre{color: #1B6A6A;}'+
                '#comments a{color: #174B54;}'+
                '#comments-form input{color: #2D3335;}'+
                /**profil*/
                '#uddeim-overview .sectiontableentry1 {background-color: #C5C5C5 !important;}'+
                '#uddeim-overview .sectiontableentry2 {background-color: #B5B5B5 !important;}'+
                '#uddeim-overview>table {border-collapse: initial !important;}'+
                '#uddeim-writeform input {background-color: #D5D5D5 !important;}'+
                /**seriale*/
                '#seriale span.yellowfont {color: #000000 !important;}'+
                /**serial*/
                'section#content .tbl_top_powiadomienia {background-color:#D5D5D5 !important;border-top: 1px solid #A0A0A0 !important;}'+
                'section#content .tbl_top_powiadomienia .head_l {color: #414141 !important;}'+
                'section#content .tbl_top_powiadomienia .head_r  label {color: #414141 !important;}'+
                '.serialNapisy .infofootertab {color: #000000 !important; background-color: #DEE0E2 !important; border-top: 1px solid #BBBBBB !important;}'+
                '#serial section#content span[style*="color:#5d93d3"] {color: transparent !important;}'+
                /**n24 helper*/
                '#n24h_tr_input_search, #n24h_tr_input_new{color: #000000 !important;}'+
                '#n24h_tr_input_clear, #n24h_tr_input_add, #n24h_tr_input_remove {background-color: #C5C5C5 !important;color: #000000 !important;}'+
                '#n24h_tr_shows_list {background-color: #C5C5C5 !important;color: #000000 !important;}'+
                '.n24h_tr_option {background-color: #C5C5C5 !important;color: #000000 !important;}'+
                'div.n24h_comm_opener:hover {background-color: #C5C5C5 !important;}';
            /** Szara stop*/
            /** n24 classic start*/
            let altcss2='body{background-color:#DEE0E2 !important;color: #272727;}'+//body
                '#avatar-body-middle-block{background-color:#DEE0E2;}'+//środek
                '#avatar-header-inside-block{background-color:#DEE0E2;}'+//górna belka body
                '#avatar-tool-block{background-color:#DEE0E2;}'+
                '#oczekiwane .main_menu li a, #profile .main_menu li a, #szukaj .main_menu li a, #tlumaczenia .main_menu li a {color: #FFFFFF;}'+
                '#oczekiwane .main_menu li a:hover, #profile .main_menu li a:hover, #szukaj .main_menu li a:hover, #tlumaczenia .main_menu li a:hover {color: #cccccc;}'+
                '.logo .screen{border: 4px solid #5592D5 !important;}'+//logo
                '.logo .screen .subline1{background-color: #5592D5 !important;}'+
                '.logo .screen .subline2{background-color: #5592D5 !important;}'+
                '.logo h1{color: #5592D5 !important;}'+
                '.logo h2{color: #5592D5 !important;}'+
                '.avatar-menu-icons[class*="avatar-main-menu-szare"] > li {background-color: #2B68AB;border-right: 1px solid #5592D5;border-bottom: 4px solid #1B4A7E;}'+//menu: forum, irc, rss
                '[class*="avatar-main-menu"] > li:hover {border-bottom: 4px solid #1B4A7E;line-height: 18px;height: 18px;}'+
                '[class*="avatar-main-menu"] > li:hover > a {top:0px;}'+
                'nav{background-color: #2B68AB !important;}'+//pusta przestrzeń między menu a dodaj napisy
                'nav ul li.menu_add_napisy a{background-color: #2B68AB;border-bottom: 4px solid #1B4A7E;}'+//przycisk dodaj napisy
                'nav ul li.menu_add_napisy a:hover{background-color: #1B4A7E;color: #CCC;background-position: 21px 12px;}'+
                'nav ul li.menu_add_napisy a:active{color: #CCC;text-shadow: 0px -1px 1px rgba(0, 0, 0, 0.2);filter: dropshadow(color=#33000000, offx=0, offy=-1);border-top: 4px solid #2B68AB;border-bottom: 4px solid #1B4A7E;background-color: #1B4A7E;background-position: 21px 8px;}'+
                'textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input {background-color: #FFFFFF !important;color: #000000 !important;}'+//pola tekstowe
                '#search #phrase{color: #000000 !important;}'+//wyszukiwarka
                'section#content .tbl_top, section#content .tbl_top1, section#content .tbl_top2{background: linear-gradient(#EDEEEE, #E2E3E3) !important;border-top: none !important;border-radius:5px;border-bottom:1px solid #B6B7B7 !important;}'+ //tabelka nagłówek
                'section#content .tbl {width: inherit !important;}'+
                'section#content .tbl_top .head_l{color:#000000 !important;}'+
                'section#content .tbl{background-color:#F7F8F8 !important;border-top:none !important;border-bottom: 1px solid #DBDCDC;border-right: 1px solid #DBDCDC;}'+
                'section#content .page{border:none !important;}'+
                'section#content .tbl_out{border-bottom:none !important;}'+
                'section#content .pagination{background: linear-gradient(#EDEEEE, #E2E3E3);border:none;border-radius:5px;}'+
                'section#content .tbl .subtitle .sub h2{color:#004896 !important;}'+
                'section#content .tbl .subtitle .sub h3{color:#5D5D5D !important;}'+
                'section#content .pagination .page-start, section#content .pagination .page-prev, section#content .pagination .page-next{ color: #2C2C2C;background-color: #F9F9F9;border: 1px solid #CECFCF;border-radius: 4px;margin: 4px 2px 0px;line-height: 20px;background-image:none;}'+//start, poprzednia, następna
                'section#content .pagination .page-start:hover, section#content .pagination .page-prev:hover, section#content .pagination .page-next:hover{color: #2C2C2C;background-color: #F9F9F9;border: 1px solid #CECFCF;border-radius: 4px;padding-bottom: 0px;line-height: 30px;text-decoration:underline;line-height: 20px;background-image:none;}'+
                'section#content .pagination .page-start, section#content .pagination .page-prev {padding-left:15px;}'+
                'section#content .pagination .page-next {padding-right:15px;}'+
                'section#content .pagination a.page-num{color: #2C2C2C;background-color: #F9F9F9;border: 1px solid #CECFCF;border-radius: 4px;}'+//numery stron
                'section#content .pagination a.page-num:hover{background-color: #F9F9F9;border: 1px solid #CECFCF;margin-top: 0px; border-radius: 4px;text-decoration:underline;}'+
                'section#content .pagination span.page-num{color: #FFFFFF !important;background-color: #2A5EA1;border: 1px solid #CECFCF;border-radius: 4px;}'+//numery stron
                'section#content .pagination span.page-num:hover{background-color: #2A5EA1;border: 1px solid #CECFCF;margin-top: 0px; border-radius: 4px;text-decoration:underline;}'+
                'section#content .tbl.opened .subtitle .opener, section#content .tbl .subtitle:hover .opener {background-color: #F7F8F8 !important;}'+
                '.page .closerSmall, .page .closerSmall:hover, .page .openerSmall, .page .openerSmall:hover, .page .closerSmall2, .page .openerSmall2:hover {background-color: #DEE0E2 !important;}'+
                '.module_frame{border: none;}'+
                '.avatar-module .st-module-heading{background: linear-gradient(#266CB3, #0E418E);border-bottom: 1px solid #0B3372;border-radius:5px;box-shadow: -5px 5px 1px #FFFFFF;margin-bottom:10px;}'+
                '.category-modulemodule_frame li a,aside .list li a{background-color: #1758A5 !important;border-bottom:1px solid #0D3A6F;margin-bottom:1px;font-weight: bold;}'+
                '.category-modulemodule_frame li a:hover,aside .list li a:hover{color: #E8EEF0 !important;background-color: #1758A5 !important;text-decoration:underline;}'+
                'aside{width: inherit !important;}'+
                'aside .list{border: none !important;}'+
                '.moreInfo{background-color:#F7F8F8 !important;color:#252525 !important;}'+
                '.page span{color: #252525 !important;}'+
                '.infofooter{border-top: 1px solid #DBDCDC !important;background-color: #F7F8F8 !important;color:#252525 !important;}'+
                '.infoColumn0{background-color: #F7F8F8 !important;border-right: 1px solid #DBDCDC !important;border-bottom: 1px solid #DBDCDC !important;border-top: 1px solid #DBDCDC !important}'+
                'section#content .tbl .poster{border-right: 1px solid #DBDCDC !important}'+
                'section#content .page{color: #252525 !important;}'+
                '.head_r input[type="radio"]:checked + label{background-image: none !important;color: #FFFFFF !important;background-color: #2A5EA1;border: 1px solid #CECFCF;border-radius: 4px;}'+
                '.head_r input[type="radio"] + label{background-image: none !important;color: #2C2C2C !important;background-color: #F9F9F9;border: 1px solid #CECFCF;border-radius: 4px;padding: 0px 10px 0px 10px !important;}'+
                '.head_r input[type="radio"] + label:hover{text-decoration:underline;}'+
                '.head_r > label{color: #2C2C2C !important;}'+
                'select {background-color: #FFFFFF !important;}'+
                '.infoheader, .infoheader1{color: #20487F !important;}'+
                'section#content .tbl div.mark:nth-child(3) {color: #545D62 !important;}'+
                '.row-fluid {border-bottom: none !important;}'+
                /**tłumaczenia*/
                '#tlumaczenia [class*="avatar-main-menu"] li a {color: #FFF;}'+
                '.checkbox_outer input[type="checkbox"] + span, .checkbox_series input[type="checkbox"] + span, input[type="checkbox"]:not([id="comments-form-subscribe"]) + label{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wEMETc09F0PlAAAAGRJREFUOMtj/Pnz538GKoCr164xMDFQEQxZw+4wTJzDzsDensGwY0h7kxFb0rhz2IpB+8hZ7Do0NzL8DPCgfdJgxJ9o7zBMnKPNUPY6kWFj5QwGjyGbaBlH8ybJgOXqtWtUMwwAJg4sDO+yKkcAAAAASUVORK5CYII=) !important;}'+
                '.checkbox_outer input[type="checkbox"] + span,.checkbox_series input[type="checkbox"] + span{width:19px;height:17px;}'+
                '.checkbox_outer input[type="checkbox"]:checked + span, .checkbox_series input[type="checkbox"]:checked + span, input[type="checkbox"]:checked:not([id="comments-form-subscribe"]) + label{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wEMETcCO+eaDQAAADxJREFUOMtj/Pnz538GKoCr164xMDFQEYwaNjIMuzORgZWdnYENhq0mMjDS02WMozlgGBnGcvXaNaoZBgBLTBH0qX8ljgAAAABJRU5ErkJggg==) !important;}'+
                '.checkbox_outer input[type="checkbox"]:hover + span, .checkbox_series input[type="checkbox"]:hover + span{border-bottom: 1px solid #FCB622;border-right: 1px solid #FCB622;border-radius: 5px;}'+
                '.checkbox_outer{margin-top: 0px !important;top: 4px !important;}'+
                'table.table-layout {border: none !important;}'+
                'table.table-layout thead tr th{background: linear-gradient(#2369B0, #104694, #2167AF) !important;color: #DDDDDD !important;border: solid 1px white !important;line-height: inherit !important;}'+ //nagłówek tabelki
                'table.table-layout tbody tr.odd td:not([style*="background-color:#255180"]):not([style*="background-color:#DD7665"]):not([style*="background-color:#41d64b"]):not([style*="background-color:#3399ff"]):not([data-n24h-star]){background: linear-gradient(#FFFFFF, #DEE0E2) !important;}'+//nie nadpisuj aktualizacji
                'table.table-layout tbody tr.even td:not([style*="background-color:#255180"]):not([style*="background-color:#DD7665"]):not([style*="background-color:#41d64b"]):not([style*="background-color:#3399ff"]):not([data-n24h-star]){background: linear-gradient(#E1E1E1, #ECECEC) !important;}'+
                '.progress div {background-color: #E7BA63 !important; background-image: none !important;}'+
                '#profile .progress, #szukaj .progress, #tlumaczenia .progress, #serial .progress, #oczekiwane .progress {background-image: linear-gradient(#FFFFFF, #DEE0E2) !important;background-color: #DEE0E2 !important; border-right: 1px solid #D3D6D7 !important;border-bottom: 1px solid #D3D6D7 !important;bottom: 0px !important;top: 0px !important;margin: auto;}'+
                '.progress2 {background-image: linear-gradient(#FFFFFF, #DEE0E2) !important;background-color: #DEE0E2 !important; border-right: 1px solid #D3D6D7 !important;border-bottom: 1px solid #D3D6D7 !important;bottom: 0px !important;top: 0px !important;margin: auto;height: 20px;overflow: hidden;border-radius: 4px;box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);position: absolute;left: 8px;right: 8px;text-align: center;background-repeat: no-repeat;}'+
                '#profile .progress2 div, #szukaj .progress2 div, #tlumaczenia .progress2 div, #serial .progress2 div {background-color: #E7BA63 !important; background-image: none !important;top: 0px !important;left: 0px !important;right: 0px !important;}'+
                '#oczekiwane .progress2 > span, #profile .progress2 > span, #szukaj .progress2 > span, #tlumaczenia .progress2 > span{position: absolute;bottom: 0px;left: 0px;right: 0px;text-align: center;z-index: 3;text-shadow: rgb(0, 0, 0) 0px 0px 3px, rgb(0, 0, 0) 0px 0px 3px;font-size: 10px;letter-spacing: 1px;color: #fff !important;}'+
                '#oczekiwane .progress2 > span > span, #profile .progress2 > span > span, #szukaj .progress2 > span > span, #tlumaczenia .progress2 > span > span {display: inline-block;text-align: center;font-weight: 700;font-size: 9px;width: 36px;letter-spacing: 1px;}'+
                '.progress2 span{opacity: 1 !important;}'+
                'table.table-layout tbody tr td{color: #252525 !important;}'+
                'table.table-layout tbody tr td[style*="background-color:#255180"],td[style*="background-color:#41d64b"],td[style*="background-color:#3399ff"] {background-color: #E7BA63 !important;}'+ //ostatnio zaktualizowane
                'table.table-layout tbody tr td div span[style*="color: white"], span[style*="color: #feee39"]{color: #252525 !important;}'+ //ilość oczekujących
                '.progress > span > span, .progress2 > span > span {color: #252525 !important; text-shadow: none !important;}'+ //procenty ukończenia
                '.progress > span, .progress2 > span {top: -3px !important;}'+
                'table.table-layout tbody tr td{border-top: 1px solid #ffffff !important;border-left: 1px solid #ffffff !important;border-right: 1px solid #ffffff !important;border-bottom: 1px solid #bbbbbb !important;padding-top: 2px !important;padding-bottom: 2px !important;}'+
                'table.table-layout tbody tr:not(.serialNapisy):not(#n24h_emptyrow):hover td{border-top: solid 2px #E7BA63 !important;border-bottom: solid 2px #E7BA63 !important;border-left: solid 1px #E7BA63 !important;border-right: solid 1px #E7BA63 !important;padding-top: 1px !important;padding-bottom: 1px !important;}'+
                'table.table-layout {border-collapse: initial !important;}'+
                '.translation {cursor: pointer !important;}'+
                '#tlumaczenia nav ul li.menu_add_tlum a{background-color: #2B68AB;border-bottom: 4px solid #2B68AB;background-position: 21px 12px; color: #FFFFFF;}'+
                'nav ul li.menu_add_tlum a:hover{border-bottom: 4px solid #1B4A7E;color: #CCCCCC;background-color: #2B68AB;line-height: 44px;height: 42px;background-position: 21px 12px;}'+
                'nav ul li.menu_add_tlum a:active{border-bottom: 4px solid #1B4A7E;color: #CCCCCC;background-color: #2B68AB;line-height: 48px;height: 42px;background-position: 21px 12px;text-shadow:none;filter:none;border-top:none;}'+
                'table.table-layout thead tr th.headerSortUp{background-image: url(run/images/arrs.png) ,linear-gradient(#2369B0, #104694, #2167AF) !important; !important;background-repeat: no-repeat !important;background-position: right !important;}'+
                'table.table-layout thead tr th.headerSortDown{background-image: url(run/images/arrsh.png) ,linear-gradient(#2369B0, #104694, #2167AF) !important; !important;background-repeat: no-repeat !important;background-position: right !important;}'+
                '#tlumaczenia table.table-layout tbody tr a {color: #2B68AB;}'+
                /**komentarze*/
                '.moreInfo2{background-color:#DFE2E5 !important;color:#000000 !important;}'+
                'section#content .clear ~ .tbl{background-color:#DFE2E5 !important;border-bottom: 1px solid #BBBBBB !important;margin-bottom:2px !important;}'+
                'section#content .clear ~ .tbl .infoColumn0{background-color:#DFE2E5 !important;}'+
                'section#content .clear ~ .tbl .infofooter{background-color:#ECEEEF !important;color:#000000 !important;border-top: 1px solid #BBBBBB !important;}'+
                'section#content .tbl .avatar{border-right: 1px solid #BBBBBB !important;}'+
                '#komentarze section#content .tbl .subtitle .sub h3{color: #FFFFFF !important;}'+
                '#komentarze section#content .tbl .mark{color: #FFFFFF;}'+
                'textarea{background-color: #FFFFFF !important;color: #000000 !important;}'+
                '#komentowane-header{background: linear-gradient(#2369B0, #104694, #2167AF) !important;color: #DDDDDD !important;line-height: inherit !important;}'+ //górna belka z datą i oceną
                'section#content>.page>div[style*="margin-left:"]{border-left:1px solid #000000; border-top:1px solid #000000; border-right:1px solid #000000; background-color: #FFFFFF;margin-left:0px !important;padding-left: 15px;}'+
                'form#userForm{border-left:1px solid #000000; border-bottom:1px solid #000000; border-right:1px solid #000000; background-color: #FFFFFF;}'+
                '.tresc2 div[style*="background-color: #292f35"]{background-color: #FFFFFF !important;}'+ //cytat
                '#komentarze section#content .tbl_out .mark, #komentarze section#content .tbl_out .subtitle .sub h3 {color: #545d62 !important;}'+ //ocena całości, releasy
                /**artykuły*/
                '#jc{background: none repeat scroll 0px 0px #DFE2E5; border: 1px solid #000000;}'+
                '#jc .rbox{background-color: #DFE2E5;}'+
                '#comments .comment-date{color: #252525;}'+
                '#comments .comment-body{color: #252525;}'+
                '#comments blockquote, #comments .hidden, #comments code, #comments pre{color: #252525;}'+
                '#comments a{color: #174B54;}'+
                /**profil*/
                'section#content .page > h2 {background: linear-gradient(#EDEEEE, #E2E3E3) !important;border-top: none !important;border-radius:5px;border-bottom:1px solid #B6B7B7 !important; color:#252525 !important;}'+
                '#uddeim-overview .sectiontableentry1 {background-color: #ECECEC !important;}'+
                '#uddeim-overview .sectiontableentry2 {background-color: #DEE0E2 !important;}'+
                '#uddeim-overview>table {border-collapse: initial !important;}'+
                '#uddeim-writeform input {background-color: #FFFFFF !important;}'+
                /**seriale*/
                '#seriale span.yellowfont {color: #000000 !important;}'+
                /**serial*/
                'section#content .tbl_top_powiadomienia {background: linear-gradient(#EDEEEE, #E2E3E3) !important;border-top: none !important;border-radius:5px;}'+
                'section#content .tbl_top_powiadomienia .head_l {color: #414141 !important;}'+
                'section#content .tbl_top_powiadomienia .head_r  label {color: #414141 !important;}'+
                '.serialNapisy .moreInfo {background-color: #DEE0E2 !important;}'+
                '.serialNapisy .infofootertab {color: #000000 !important; background-color: #DEE0E2 !important; border-top: 1px solid #BBBBBB !important;}'+
                '#serial section#content .tbl_top_powiadomienia .head_r label[style*="background-image:none"] {background-image:none !important;}'+
                '#serial section#content span[style*="color:#5d93d3"] {color: transparent !important;}'+
                /**n24 helper*/
                'table.table-layout tbody tr.odd td[data-n24h-star]{background-image: url('+icons.staroff+'), linear-gradient(#FFFFFF, #DEE0E2) !important;background-repeat: no-repeat !important;background-position: center !important;}'+
                'table.table-layout tbody tr.even td[data-n24h-star]{background-image: url('+icons.staroff+'), linear-gradient(#E1E1E1, #ECECEC) !important;background-repeat: no-repeat !important;background-position: center !important;}'+
                'table.table-layout tbody tr.odd td[data-n24h-star="on"]{background-image: url('+icons.staron+'), linear-gradient(#FFFFFF, #DEE0E2) !important;}'+
                'table.table-layout tbody tr.even td[data-n24h-star="on"]{background-image: url('+icons.staron+'), linear-gradient(#E1E1E1, #ECECEC) !important;}'+
                'table.table-layout tbody tr.odd td[data-n24h-star="auign"], table.table-layout tbody tr.odd td[data-n24h-star="trign"], table.table-layout tbody tr.odd td[data-n24h-star="autit"]{background-image: url('+icons.starign+'), linear-gradient(#FFFFFF, #DEE0E2) !important;}'+
                'table.table-layout tbody tr.even td[data-n24h-star="auign"], table.table-layout tbody tr.even td[data-n24h-star="trign"], table.table-layout tbody tr.even td[data-n24h-star="autit"]{background-image: url('+icons.starign+'), linear-gradient(#E1E1E1, #ECECEC) !important;}'+
                'th#n24h_tr_favhead{background-image: url('+icons.staron+'), linear-gradient(#2369B0, #104694, #2167AF) !important;background-repeat: no-repeat !important;background-position: center !important;}'+
                '#n24h_tr_input_search, #n24h_tr_input_new{color: #000000 !important; border: 1px solid #CECFCF !important;}'+
                '#n24h_tr_input_clear, #n24h_tr_input_add, #n24h_tr_input_remove {background-color: #F9F9F9 !important;color: #000000 !important; border: 1px solid #CECFCF !important;}'+
                '#n24h_tr_shows_list {background-color: #FFFFFF !important;color: #000000 !important;border: 1px solid #CECFCF !important;}'+
                '.n24h_tr_option {background-color: #FFFFFF !important;color: #000000 !important;}'+
                'div.n24h_comm_opener:hover {background-color: #F0F0F0 !important;}'+
                'table.table-layout thead tr th.n24h_sort_asc{background-image: url(run/images/arrsh.png) ,linear-gradient(#2369B0, #104694, #2167AF) !important; !important;background-repeat: no-repeat !important;background-position: right !important;}'+
                'table.table-layout thead tr th.n24h_sort_desc{background-image: url(run/images/arrs.png) ,linear-gradient(#2369B0, #104694, #2167AF) !important; !important;background-repeat: no-repeat !important;background-position: right !important;}';
            /** n24 classic stop*/
            switch (options.getValue('altskinid', '1')) {
                case '1':
                    utils.insertcss(altcss1);
                    break;
                case '2':
                    utils.insertcss(altcss2);
                    break;
                default:
                    console.log('Błędny parametr "altskinid": '+options.getValue('altskinid', 'Err'));
            }
        },
        shrinkButtons: function() {
            let css='.avatar-menu-icons[class*="avatar-main-menu"] > li {padding-left: 5px; padding-right: 5px;}';
            utils.insertcss(css);
        },
        /**
            Usuń target="_blank" ze wszystkich odnośników
        */
        killTargetBlank: function() {
            let targets=document.querySelectorAll('a[target="_blank"]');
            for (let i=0;i<targets.length;i++) {
                targets[i].removeAttribute('target');
            }
        },
        /**
            Usuń przyciski "Dołącz..."
        */
        killConnectButtons: function() {
            let divs=document.querySelectorAll('div.cbConnectButtons');
            for (let i=0;i<divs.length;i++) {
                divs[i].parentNode.removeChild(divs[i]);
            }
        },
        fixThings: function() {
            if(location.pathname.toLowerCase() === '/napisy-podglad') {
                let li=document.querySelector('div.list li>a[href*="/napisy-podglad?"]');
                if (li) {
                    li.setAttribute('href', li.getAttribute('href').replace(/napisy-podglad/, 'komentarze'));
                    li.textContent='Skomentuj';
                }
            }
        },
        init: function() {
            if (options.getValue('fixsearch', false)) {
                misc.fixSearch();
            }
            if (options.getValue('killcover', false)) {
                misc.killCover();
            }
            if (options.getValue('killimdbinfo', false)) {
                misc.killIMDBInfo();
            }
            if (options.getValue('usesmallmenubuttons', false)) {
                misc.shrinkButtons();
            }
            if (options.getValue('removeconnectbuttons', false)) {
                misc.killConnectButtons();
            }
            misc.fixThings();
        }
    };

    var n24h = {
        /**
        */
        onLoad: function() {
            options.init();
            misc.init();
            if(location.pathname.toLowerCase() === '/tlumaczenia') {
                tlumaczenia.init();
            }
            if(location.pathname.toLowerCase() === '/komentarze') {
                komentarze.init();
            }
            if((location.pathname.toLowerCase() === '/serial')||(location.pathname.toLowerCase().indexOf('/serial/')>-1)) {
                serial.init();
            }
            if (options.getValue('removetargetblank', false)) {
                misc.killTargetBlank();
            }
        },
        setAltSkin: function() {
            if (options.getValue('usealtskin', false))
            {
                let head=document.querySelector('head');
                let body=document.querySelector('body');
                if ((!head)||(!body))
                {
                    //upewnij się że mamy załadowane head i body
                    setTimeout(n24h.setAltSkin,1);
                } else {
                    misc.altSkin();
                }
            }
        },
        /**
        */
        init: function()
        {
            if ( document.readyState === 'interactive' || document.readyState === 'complete' ) {
                n24h.onLoad();
            } else {
                addEventListener('DOMContentLoaded', n24h.onLoad);
            }
            n24h.setAltSkin();
        }
    };

    n24h.init();

})();
