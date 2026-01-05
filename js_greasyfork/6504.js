// ==UserScript==
// @name        Make WoTLabs tanker stats sexier
// @namespace   BocajSretep
// @description Gives back a little of the visual style lost when sigs were removed from tanker stats
// @include     http://forum.wotlabs.net/index.php?/topic/*
// @version     0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6504/Make%20WoTLabs%20tanker%20stats%20sexier.user.js
// @updateURL https://update.greasyfork.org/scripts/6504/Make%20WoTLabs%20tanker%20stats%20sexier.meta.js
// ==/UserScript==
(function sexifyWoTLabs() {
    var poasts = document.querySelectorAll('.post_block'),
        fragment = makeSigFragment(),
        wn = fragment.querySelector('.wn'),
        rwn = fragment.querySelector('.recent-wn'),
        wr = fragment.querySelector('.wr'),
        rwr = fragment.querySelector('.recent-wr'),
        cssRules = document.createElement('style'),
        playerStats, statlabels;

    cssRules.innerHTML = '.user_details > div > br{display: none;}.right-float{float: right;}.sig {display: inline-flex;flex-wrap: wrap;width: 110px;height: 76px; margin-top: 10px;font-size: 8px;color: white;font-weight: bold;pointer-events:none; -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;border: 1px solid #ccc;box-shadow: 0px 0px 2px 0px rgba(10, 10, 10, 0.35);}.sig .stat{font-size: 18px;}.sig-right {width: 55%;}.sig-left {width: 45%;}';
    document.head.appendChild(cssRules);


    for(var i = 0; i < poasts.length; ++i) {
        playerStats = poasts[i].querySelectorAll('.user_details > div > strong');
        statLabels = poasts[i].querySelectorAll('.user_details > div > label');

        playerStats[0].classList.add('right-float');
        playerStats[1].classList.add('right-float');

        wn.style.backgroundColor = playerStats[2].style.color;
        wn.querySelector('.stat').innerHTML = playerStats[2].innerHTML;
        playerStats[2].style.display = 'none';
        statLabels[2].style.display = 'none';

        wr.style.backgroundColor = playerStats[3].style.color;
        wr.querySelector('.stat').innerHTML = Math.round(parseFloat(playerStats[3].innerHTML.slice(0, -1))).toString() + '%';
        playerStats[3].style.display = 'none';
        statLabels[3].style.display = 'none';

        rwn.style.backgroundColor = playerStats[4].style.color;
        rwn.querySelector('.stat').innerHTML = playerStats[4].innerHTML; 
        playerStats[4].style.display = 'none';
        statLabels[4].style.display = 'none';

        rwr.style.backgroundColor = playerStats[5].style.color;
        rwr.querySelector('.stat').innerHTML = Math.round(parseFloat(playerStats[5].innerHTML.slice(0, -1))).toString() + '%';
        playerStats[5].style.display = 'none';
        statLabels[5].style.display = 'none';


        poasts[i].querySelector('.user_details').appendChild(fragment.cloneNode(true));
    }

    function makeSigFragment() {
        var frag = document.createDocumentFragment(),
            sig = document.createElement('div'),
            statBlock = document.createElement('div'),
            statType = document.createElement('div'),
            statValue = document.createElement('div'),
            wr, rwr, wn, rwn;    

        sig.classList.add('sig');
        statType.classList.add('text');
        statValue.classList.add('stat');  

        statBlock.appendChild(statType);
        statBlock.appendChild(statValue);

        wr = statBlock.cloneNode(true);
        rwr = statBlock.cloneNode(true);
        wn = statBlock.cloneNode(true);
        rwn = statBlock.cloneNode(true);


        wr.classList.add('wr');
        wr.classList.add('sig-left');
        wr.querySelector('.text').innerHTML = 'OVERALL';
        rwr.classList.add('recent-wr');
        rwr.classList.add('sig-right');
        rwr.querySelector('.text').innerHTML = 'RECENT WR';
        wn.classList.add('wn');
        wn.classList.add('sig-left');
        wn.querySelector('.text').innerHTML = 'OVERALL';
        rwn.classList.add('recent-wn');
        rwn.classList.add('sig-right');
        rwn.querySelector('.text').innerHTML = 'RECENT WN8';

        sig.appendChild(rwr);
        sig.appendChild(wr);
        sig.appendChild(rwn);
        sig.appendChild(wn);

        frag.appendChild(sig);
        return frag;
    }

})();