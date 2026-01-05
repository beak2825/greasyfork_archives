// ==UserScript==
// @name        MyShows: add KickAss.to
// @namespace   none
// @description Add icon for KickAss.to torrent tracker for each TV series
// @include     http://myshows.me/profile/
// @include     https://myshows.me/profile/
// @match       http://myshows.me/profile/
// @match       https://myshows.me/profile/
// @version     0.6.18
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9537/MyShows%3A%20add%20KickAssto.user.js
// @updateURL https://update.greasyfork.org/scripts/9537/MyShows%3A%20add%20KickAssto.meta.js
// ==/UserScript==


$(function(){
    $('div.plateHint').remove();
    $("h2.showHeader").each(function(){
            var tv_urls = {
                "Doctor Who": "https://zooqle.com/tv/doctor-who-1863/",
                "My Little Pony: Friendship is Magic": "https://zooqle.com/tv/my-little-pony-friendship-is-magic-q1x/",
                "Guardians of the Galaxy": "https://zooqle.com/tv/marvel-s-guardians-of-the-galaxy-1cr1/",
                "Ash vs Evil Dead": "https://zooqle.com/tv/ash-vs-evil-dead-1c1k/",
                "Jekyll & Hyde": "https://zooqle.com/tv/jekyll-and-hyde-10fs/",
                "Jekyll and Hyde": "https://zooqle.com/tv/jekyll-and-hyde-10fs/",
                "Bishōjo Senshi Sailor Moon Crystal": "http://horriblesubs.info/shows/sailor-moon-crystal/",
                "The Simpsons": "https://zooqle.com/tv/the-simpsons-co/",
                "Family Guy": "https://zooqle.com/tv/family-guy-13u/",
                "Robot Chicken": "https://zooqle.com/tv/robot-chicken-jp/",
                "Gotham": "https://zooqle.com/tv/gotham-1auc/",
                "Gravity Falls": "https://zooqle.com/tv/gravity-falls-ux7/",
                "Minority Report": "https://zooqle.com/tv/minority-report-1cqv/",
                "Supergirl": "https://zooqle.com/tv/supergirl-1cdc/",
                "Limitless": "https://zooqle.com/tv/limitless-1cdb/",
                "Moonbeam City": "https://rarbg.to/tv/tt3906560/",
                "Star Wars Rebels": "https://zooqle.com/tv/star-wars-rebels-1aq2/",
                "South Park": "https://zooqle.com/tv/south-park-1ou/",
                "Elementary": "https://zooqle.com/tv/elementary-13b/",
                "Regular Show": "https://zooqle.com/tv/regular-show-o0s/",
                "The Flash": "https://zooqle.com/tv/the-flash-1av3/",
                "Marvel's Agents of S.H.I.E.L.D.": "https://zooqle.com/tv/marvel-s-agents-of-s-h-i-e-l-d-12z/",
                "Arrow": "https://zooqle.com/tv/arrow-138/",
                "Adventure Time with Finn and Jake": "https://zooqle.com/tv/adventure-time-brw/",
                "The Expanse": "https://zooqle.com/tv/the-expanse-1d3r/",
                "The Big Bang Theory": "https://zooqle.com/tv/the-big-bang-theory-13e/",
                "Steven Universe": "https://zooqle.com/tv/steven-universe-1b7b/",
                "Galavant": "https://zooqle.com/tv/galavant-1blu/",
                "Heroes Reborn": "https://zooqle.com/tv/heroes-reborn-1ayi/",
                "Teenage Mutant Ninja Turtles": "https://zooqle.com/tv/teenage-mutant-ninja-turtles-13zd/",
                "American Dad!": "https://zooqle.com/tv/american-dad-13t/",
                "Wander Over Yonder": "https://zooqle.com/tv/wander-over-yonder-yqd/",
                "Marvel's Agent Carter": "https://zooqle.com/tv/marvel-s-agent-carter-1bhq/",
                "DC's Legends of Tomorrow": "https://zooqle.com/tv/dc-s-legends-of-tomorrow-1cc3/",
                "Colony": "https://zooqle.com/tv/colony-1ci2/",
                "Archer": "https://zooqle.com/tv/archer-7xn/",
                "12 Monkeys": "https://zooqle.com/tv/12-monkeys-1b10/",
                "We Bare Bears": "https://rarbg.to/torrents.php?imdb=tt4839610",
                "The Powerpuff Girls": "https://zooqle.com/tv/the-powerpuff-girls-1f1h/",
                "Mighty Magiswords": "https://rarbg.to/torrents.php?imdb=tt4847134",
                "Flip Flappers": "http://horriblesubs.info/lib/search.php?value=Flip+Flappers",
                "Long Riders!": "http://horriblesubs.info/lib/search.php?value=Long+Riders",
                "Long Riders": "http://horriblesubs.info/lib/search.php?value=Long+Riders",
                "Teen Titans Go!": "https://zooqle.com/tv/teen-titans-go-ytw/",
                "Black Mirror": "https://zooqle.com/tv/black-mirror-wex/",
                "Vixen": "http://kisscartoon.me/Cartoon/Vixen-Season-2/",
                "Drifters": "http://horriblesubs.info/lib/search.php?value=Drifters",
                "ClassicaLoid": "http://horriblesubs.info/lib/search.php?value=ClassicaLoid",
                "Izetta: The Last Witch": "http://horriblesubs.info/lib/search.php?value=Shuumatsu+no+Izetta",
                "Westworld": "https://zooqle.com/tv/westworld-1csv/",
                "Red Dwarf": "https://zooqle.com/tv/red-dwarf-92/",
                "Humans": "https://zooqle.com/tv/humans-1ch2/",
                "Kono Subarashii Sekai ni Shukufuku o!": "http://horriblesubs.info/lib/search.php?value=Kono+Subarashii+Sekai+ni+Shukufuku+wo!",
                "Miss Kobayashi's Dragon Maid": "http://horriblesubs.info/lib/search.php?value=Chi+no+Maid+Dragon",
                "Minami Kamakura High School Girls Cycling Club": "http://horriblesubs.info/lib/search.php?value=Minami+Kamakura",
                "Youjo Senki: Saga of Tanya the Evil": "http://horriblesubs.info/lib/search.php?value=Youjo+Senki",
                "Sherlock": "https://zooqle.com/tv/sherlock-fcd/",
                "Voltron: Legendary Defender": "https://zooqle.com/tv/voltron-legendary-defender-1fcu/"
            };
            var headerName = $(this).find('span.showHeaderName > a');
            var subHeader = $(this).find('span.subHeader');
            var name = subHeader.text();
            if (name === '') name = headerName.text();
            var tv_series=encodeURIComponent(name.replace(/[^a-z0-9\s]/gi, ''));
            var url = 'https://zooqle.com/search?q='+ tv_series;
            if (name in tv_urls) url = tv_urls[name];
            $(this).append('<a target="_blank" title="zooqle.com" href="'+ url + '"><img src="https://zooqle.com/img/zq-favicon16.png"></a>');
     }); 

});
