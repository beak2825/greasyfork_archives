// ==UserScript==
// @name         Devast.io hack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Devast.io AimBot AutoLoot Zoom Hack
// @author       You
// @match        https://devast.io/*
// @icon         https://icons.duckduckgo.com/ip2/devast.io.ico
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559862/Devastio%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/559862/Devastio%20hack.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function htmlContent()
    {
        return `
<!DOCTYPE html>
<html>
	<head>
		<title>Devast.io - The Online Post-Apocalyptic Survival Game.</title>
        <base href="https://devast.io/">
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="description" content="In a post-apocalyptic world where nature takes back its rights. Build a bunker, weapons, warm up and produce your own food to protect yourself from this ruthless world and the many other survivors. Play completely free online with other players now!"/>
		<meta name="keywords" content="devast, devast.io, post-apocalyptic, post-apocalyptic survival game, survival game, online game, mmo, multiplayer, starve.io, starveio, survival, io games, .io, craft, browser game, html game, html5 game, flash game, wasteland, radioactivity, irradiated city, uranium, hunger, cold, weapons, crafting, cities, nuclear war, nuclear, cute, fun, hardcore, fight"/>
		<meta property="og:title" content="Devast.io - The post-apocalyptic survival game"/>
		<meta property="og:description" content="In a post-apocalyptic world where nature takes back its rights. Build a bunker, weapons, warm up and produce your own food to protect yourself from this ruthless world and the many other survivors. Play completely free online with other players now!"/>
		<meta property="og:url" content="https://devast.io"/>
		<meta property="og:site_name" content="devast.io"/>
		<meta property="og:image" content="https://devast.io/img/banner.png"/>
		<meta property="og:image:width" content="500"/>
		<meta property="og:image:height" content="250"/>
		<meta name="twitter:card" content="summary_large_image"/>
		<meta name="twitter:site" content="@devast.io"/>
		<meta name="twitter:creator" content="@lapamauve"/>
		<meta name="twitter:url" content="https://devast.io"/>
		<meta name="twitter:title" content="Devast.io - The post-apocalyptic survival game"/>
		<meta name="twitter:description" content="In a post-apocalyptic world where nature takes back its rights. Build a bunker, weapons, warm up and produce your own food to protect yourself from this ruthless world and the many other survivors. Play completely free online with other players now!"/>
		<meta name="twitter:image" content="https://devast.io/img/banner.png"/>
		<meta name="mobile-web-app-capable" content="yes"/>
		<meta name="apple-mobile-web-app-capable" content="yes"/>
		<meta name="robots" content="index, follow"/>
		<meta name="revisit-after" content="3 days"/>
		<meta name="googlebot" content="all"/>
		<link rel="icon" type="image/png" href="img/favicon.png"/>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Black+Han+Sans"/>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Viga"/>
		<link rel="stylesheet" type="text/css" href="css/style.css?1720849610736"/>
	</head>
 
	<body id="bod">
 
		<canvas id="can"></canvas>
 
		<script src="https://update.greasyfork.org/scripts/517122/1483086/client302104.js"></script>
 
		<div id="nickname">
 
			<input id="nicknameInput" type="text" placeholder="Nickname" maxLength="16">
 
		</div>
 
		<div id="terms">
 
			<a href="./authors/" target="blank">Authors</a> - <a href="./termsofuse/" target="blank">Terms of Use</a> - <a href="./privacy/" target="blank">Privacy</a>
 
		</div>
 
		<div id="serverList">
 
			<select id="servers">
			</select>
 
		</div>
 
		<div id="changelog">
 
			<div id="changelogTitle">CHANGELOG</div>
			<a href="./changelog/" target="blank"><img id="changelogImg" src="./img/changelog-29.png" alt="Devastio"></a>
 
			<div id="scrollChangelog">
			      <!--<div style="color:rgba(255, 255, 255, 0.6);">      This is the Alpha Version.</div>
			      <div style="color:rgba(255, 255, 255, 0.6);">     Many things will be added.</div>
			      <div style="color:rgba(255, 255, 255, 0);">/ </div>-->
			      <!--<div><a href="https://twitter.com/lapamauve/status/1077037478329155584" target="blank" style="color:white;"><img id="privateImg" src="./img/free-server.png" alt="Devastio"></a></div>-->
			      <div style="margin-top: 5px;"> - <a href="./changelog/" target="blank" style="color:white;">SEE MORE</a> - </div>
 
			      <div id="changelogText">
 
			            There you are, trying to survive with your tomatoes and oranges, but as you <span style="color:#bcb33e;">scroll with your mouse</span>, you see a <span style="color:#bcb33e;">feeder</span>! Say goodbye to fruits and vegetables, and <span style="color:#bcb33e;">feed on the energy around you</span>. Your mind is calmed and problems/<span style="color:#bcb33e;">bugs starts to disappear</span>.
 
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;"> - </div>
 
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.30.1719</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
 
			            Your predecessors did not survive. But they have left behind <span style="color:#bcb33e;">some vestiges!</span> Dare to venture into the  <span style="color:#bcb33e;">cave</span>, tunnel through the stone and maybe you will discover a  <span style="color:#bcb33e;">hidden bunker</span>.
			            Have you always dreamed of being green and radioactive? Do you look good with dynamite? Do you want to work with long, rotten brains? Maybe you're cut out to <span style="color:#bcb33e;">be a Ghoul</span>? That's good news! The <span style="color:#bcb33e;">new game mode </span>offers you the opportunity to transform yourself and create chaos around you!"</span>
 
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;"> - </div>
 
			            <div >  The <span style="color:#bcb33e;">"Lamps, that's pretty but that's better when that's useful!"</span> said the old uncle, cloistered in his devastated wooden cabin. Then came the survivors, armed with lamps and picks. "What are you doing in my house? Get out of here!" But the villagers stayed, and <span style="color:#bcb33e;">put their lamps in the old man's house</span>. "But how is that possible? <span style="color:#bcb33e;">No one can place objects in my house except myself!"</span> And the villagers left, without a word. Several minutes later, the ghouls landed in the old man's cabin. They destroyed the walls and doors. The man felt his time coming. The ghouls approached and, one by one, <span style="color:#bcb33e;">disappeared into the lights of the Christmas neon lights.</span> The lamps were finally useful, and the old uncle shouted, "Well, that's what I was saying! <span style="color:#bcb33e;">Lamps, that's pretty but that's better when that's useful!"
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.28.1494</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >  The <span style="color:#bcb33e;">Merry Christmas</span>, everyone! Your gifts are waiting for you under the <span style="color:#bcb33e;">tree in the gingerbread houses</span>. Enjoy new <span style="color:#bcb33e;">clothes</span>, new <span style="color:#bcb33e;">sweets</span> and a new <span style="color:#bcb33e;">weapon</span>. Now you can enjoy the fresh air of the day as <span style="color:#bcb33e;">ghouls die in the sunlight</span>! Have fun!
			            <span style="color:#bcb33e;">New lamps</span>  are now available. Perhaps you will dare to decorate your gardens to celebrate the <span style="color:#bcb33e;">apocalyptic Christmas</span>  coming up!
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.27.1492</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >  The <span style="color:#bcb33e;">Many new buildings</span>  have been added to the map. Want to play video games? Discover our new <span style="color:#bcb33e;">internet cafe</span> . Be careful, the <span style="color:#bcb33e;">owner could lock you in there!</span>  A little depressed? The <span style="color:#bcb33e;">doctor </span> welcomes you! Do you want to fight? The <span style="color:#bcb33e;">boxing rin</span> g is waiting for you. Find the <span style="color:#bcb33e;">different passwords</span> that will give you access to <span style="color:#bcb33e;">many safes</span> and much more!
			            <span style="color:#bcb33e;">New lamps</span>  are now available. Perhaps you will dare to decorate your gardens to celebrate the <span style="color:#bcb33e;">apocalyptic Christmas</span>  coming up!
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.26.1465</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >  The Lapabots now repair your base better than ever before but you are always looking for more <span style="color:#bcb33e;">automatic machines</span> that can do the job for you, and more efficiently. <span style="color:#bcb33e;">HAL is the one you missed</span>. While Lapabot is repairing, HAL doesn't like to feel attacked. But if HAL is not strong enough for you, the <span style="color:#bcb33e;">TESLA bot</span> will probably do the trick, with <span style="color:#bcb33e;">your new laser sniper!
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.25.1460</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >  The <span style="color:#bcb33e;">new map editor</span> is a way to diversify the community's servers so that each administrator can <span style="color:#bcb33e;">create his own mini-game</span>. But it can also be used to plan, alone or with your friends, the bases you will try to build during your next game. This map editor is an awakening for your creativity. <span style="color:#bcb33e;">Make good use of it!</span>
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.25.1337</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div > Remember the fundamental rule of good living in society: <span style="color:#bcb33e;">The richer you are, the richer you will become.</span> <span style="color:#bcb33e;">The extractors</span> are further proof of this. These machines will be difficult to design but once they are placed in your home, they will collect <span style="color:#bcb33e;">stone, iron, sulphide and uranium</span> without you having to leave your home! Of course, you'll have to keep them on with gasoline. For that, you would do better to fill with orange rotten. <span style="color:#bcb33e;">Compost could be useful.</span> For those with an<span style="color:#bcb33e;"> addiction problem</span> and a pale pink head, you will need to look for a <span style="color:#bcb33e;">flower to create an antidote</span>. Be careful, this flower is extremely rare (only one on the whole map), let's hope it doesn't spawn in town!
			            You have also found a way to collect these <span style="color:#bcb33e;">acorns</span> that have been taunting you for so long in the branches of trees. Well done! <span style="color:#bcb33e;">You can eat them... or plant your own forest</span>
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.24.1294</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >The weather cools down and <span style="color:#bcb33e;">mushrooms</span>  multiply in the forest. Three species in particular. One of them is <span style="color:#bcb33e;">poisoned</span>. It is better not to eat it or you will see it cloudy for some time. However, it is useful for making a <span style="color:#bcb33e;">drug that will make you faster</span>. But beware of the <span style="color:#bcb33e;">withdrawal effects</span>. This medicine is extremely addictive and you will need to take it again soon. The other two mushrooms are edible and one of them will be used to make a medicine that will <span style="color:#bcb33e;">protect you from Ghouls.</span>
			            If you are the lazy type, and cleaning your bases bothers you, the new <span style="color:#bcb33e;">"Repair Lapabot"</span> will satisfy you. With its multi-purpose arms and 360° view, you won't have to worry about those nasty holes in your walls anymore!
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.23.1282</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >You dreamed of it, well now it's possible. <span style="color:#bcb33e;">You can be a tree.</span> But beware of woodcutters' axes!
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.22.1280</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >The <span style="color:#bcb33e;">pumpkin ghoul</span> is very slow. In the middle of nature, she won't be a scary opponent. Once killed, you can either <span style="color:#bcb33e;">eat it</span> or <span style="color:#bcb33e;">recreate it</span> from its pumpkin seeds. Once replanted, <span style="color:#bcb33e;">it will attack your enemies!</span> Learn how to control the pumpkin ghoul! It will only move if enemies approach. Once placed close to your base, it will be a formidable ally to protect your walls!  And that's not all! Once killed, it will grow back from its roots
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.20.1260</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >They are <span style="color:#bcb33e;">more numerous</span>, but <span style="color:#bcb33e;">more balanced</span>.
			            The bad ghouls have been <span style="color:#bcb33e;">nerfed</span>, and will only attack from a certain number of days.
			            Their diversity will also make them fewer, giving you more time to build a base.
			            For those who think that the bases become useless, don't forget the importance of the <span style="color:#bcb33e;">low walls</span> that will allow you to attack the ghouls <span style="color:#bcb33e;">without being touched, and without leaving your base</span>, as well as the <span style="color:#bcb33e;">low doors</span>. It is also important to build several doors in opposite places. If a ghoul could destroy one of your walls, flee to the other side.
			            If a ghoul is chasing you, consider putting a building in a narrow path to block the road.
			            If a ghoul chases you around a fire, <span style="color:#bcb33e;">you can turn around it</span>, it will do the same. This will give you time to make a <span style="color:#bcb33e;">spear</span>, or <span style="color:#bcb33e;">bow</span>.
			            But don't forget that if you want to be quiet, don't go looking for trouble!
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.19.1246</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Take refuge in your homes and prepare your tools. Your walls won't last long, because <span style="color:#bcb33e;">the monsters have arrived</span> and they're hungry. Avoid going out in the evening in the dense forest without being prepared. <span style="color:#bcb33e;">Ghouls are faster than you</span>, and they are merciless. Once they see you, they won't let you go.
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.18.1175</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Some people eat grenades or make grenadines out of them. Here, it is better to avoid eating <span style="color:#bcb33e;">grenades</span>! Or you'll risk splashing into grenadine! Ahahaha!
			            And for private server owners, only you and you can make spawn <span style="color:#bcb33e;">super hammer</span> in your server to destroy immortal walls.
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.17.1162</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Gather a bunch of pieces of wood, make a hole, and throw them in. That's right. You hadn't thought of that? You will be impressed by the power of simple sharp sticks. Put your <span style="color:#bcb33e;">wooden spikes</span> on the ground, like a trap, and slow down your inattentive enemies!
			      Meanwhile, you can either shoot them down with a <span style="color:#bcb33e;">laser machine gun</span>, hoping he doesn't wear tesla armor,or run away like a little scoundrel.
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.16.1120</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div ><span style="color:#bcb33e;">Armor</span> is finally available, and there is something for everyone! Armor that protects and warms, armor against firearms and explosives.  <span style="color:#bcb33e;">Armor that gives you class.</span> Armor that is made for you.
			                  But because we know it's difficult for you all to carry with your little arms, be brave enough to  <span style="color:#bcb33e;">unlock 2 new inventory slots</span>!
			                  And because we like to have a nice tidy wardrobe, you can now  <span style="color:#bcb33e;">build your base 2x faster</span> with the  <span style="color:#bcb33e;">builder's skill</span>, to quickly tidy up your little things!
			                  And because your inventory is valuable, you'll enjoy the arrival of the  <span style="color:#bcb33e;">new compost</span> that will take the weight off your shoulders as you wait for 20 oranges to rot in your inventory.
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.15.1086</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Protect your base and surroundings by placing <span style="color:#bcb33e;">landmines</span> around you. <span style="color:#bcb33e;">Dynamite</span> the city's armoured gates so as not to expose yourself to radiation. Collect electronic parts from TVs, computers or even refrigerators to make a <span style="color:#bcb33e;">trigger</span> and blow up your <span style="color:#bcb33e;">C4</span> whenever you want. Activate the <span style="color:#bcb33e;">lightweight skill</span> and avoid the triggering of landmines.
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.14.1070</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >We added a  <span style="color:#bcb33e;">knock back effect</span> so you can no longer get stuck in a corner. Knock, defend yourself and you'll push your opponent away! This is a small update to <span style="color:#bcb33e;">rebalance recipes</span>, and the <span style="color:#bcb33e;">sulphur axe</span> is a gift!
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.13.1055</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >The discovery of the old abandoned <span style="color:#bcb33e;">power station</span> has taught you something useful this time: <span style="color:#bcb33e;">electricity</span>.
			      And remember that phrase from Mr. Nikola Tesla found on his <span style="color:#bcb33e;">smartphone</span>: "My only regret was that I didn't invent the <span style="color:#bcb33e;">laser gun</span>." That gives you an idea. That's right! Why don't you make a laser gun? What ingenuity! You who look so smart to me, what are you going to do with the <span style="color:#bcb33e;">electronic parts</span>, <span style="color:#bcb33e;">the electric wires</span>, and the <span style="color:#bcb33e;">junk</span> that you will find by searching the houses? <span style="color:#bcb33e;">Batteries.</span> Tesla couldn't have said it better.
			            </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.11.924</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Your parents know that. DIY stores are very dangerous. But you're not afraid of danger. <span style="color:#bcb33e;"> Saw off your shotgun</span> for a more powerful weapon, defend yourself and your base with  <span style="color:#bcb33e;"> nail guns</span>, lay stone floors or tile and become a survivor handyman.</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.10.900</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Did you like to compare every "Battle Royale Game" with Fortnite or PUBG? Here, useless to try... This new Battle Royale is based on real fictional events. For those who would have hibernated for a year, <span style="color:#bcb33e;"> the goal is simple, kill each other.</span> But maybe along the way you will find hot food leftovers, a fire still lit, or the night will seem too cold and your stomach too greedy and you will let yourself die in the worst half-day of your life.</div> <div>To cheer you up, <a style="color:#bcb33e;" href="https://www.youtube.com/watch?v=22sYrPTyVjg">watch our first LapaMovie<span style="color:white;"> on </span>https://www.youtube.com/watch?v=22sYrPTyVjg</a></div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.9.860</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >The soup revolution has come. It was a dream and it finally happened. <span style="color:#bcb33e;">Tomatoes</span>. That's right. We know that in the hearts of every one of you lies a tomato.
			                  Store your <span style="color:#bcb33e;">soups in cans</span> and discover the magic of this object: <span style="color:#bcb33e;">Slowing down the perishing of your food</span>. Come worship the canned food.</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.8.846</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Come discover our wonderful<span style="color:#bcb33e;">abandonned houses</span>. The habitants left away because of the radiation but maybe will you find some <span style="color:#bcb33e;">interesting loot?</span></div>
			                  If you're lucky, you could probably craft a radAway to move the radiation... away.
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.7.834</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >According to Rousseau, man is born good, and society makes him bad. It is therefore by following his word that we make you spawn with a <span style="color:#bcb33e;">125% experience bonus</span>, visible in the form of <span style="color:#bcb33e;">an angel</span>.</div>
			                  <div style="color:#bcb33e;"> Will you be able to stay that way?</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.6.832</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >To die is now less painful since an <span style="color:#bcb33e;">inventory will be returned to you according to your level</span>! Young arrivals and players of long hours will all find their benefit.
			      No more hours looking for your partner in the map. Once you join a team, <span style="color:#bcb33e;">your teammates are displayed</span> in the minimap! But that's not all! Were you tired of the damn rocks that kept you from opening your door? Come and discover... The <span style="color:#bcb33e;">new F button</span>.</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.5.745</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >You thought you were alone in this hostile forest? <span style="color:#bcb33e;">Create your own team or join one</span> to build strength and make new friends. Be surprised by this new power and brave the damn forest! Also, we offer you a <span style="color:#bcb33e;">hammer to repair</span> your walls against the bad guys who try to dislodge you. But we repair better when we have <span style="color:#bcb33e;">nails</span> on hand, so remember to keep some in your pocket.</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.4.700</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Many of you have asked us for a way not to lose your buildings after you die, because you are "too lazy to rebuild everything". What could be better than a <span style="color:#bcb33e;">sleeping bag</span> as a metaphor for your laziness? With this, you will lose neither your buildings nor your levels. But "a base that can no longer be destroyed" also means "a base blocker that does not stop". Destroy your own buildings with a <span style="color:#bcb33e;">hammer</span> and destroy others' buildings much faster!</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.3.660</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >Are your feet full of mud? You have rocks stuck between your toes and it hurts? This new <span style="color:#bcb33e;">waxed parquet</span> is made for you. In addition to ensuring smooth, obstacle-free movement, your feet will again be soft and silky.
			            You were tired of seeing new players spawn in your home and hearing them say "no please don't kill me please", this floor will give you total privacy. A uranium rock spawne in your house? Put on a <span style="color:#bcb33e;">floor</span>. Put on a <span style="color:#bcb33e;">floor</span>. Put on a <span style="color:#bcb33e;">floor</span>. Plus it's cheap.</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.2.644</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >No more socks on the floor and disappearing. Mom won't bother you once you make this <span style="color:#bcb33e;">new wooden chest</span>! Ideal to arrange and decorate your base with style. Your Mom will be so proud that, who knows, maybe you'll get a <span style="color:#bcb33e;">mini-fridge</span> in your brand new base!</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div style="color:#bcb33e;">V0.1.620</div>
			            <div style="color:rgba(255, 255, 255, 0);">/ </div>
			            <div >In a post-apocalyptic world where nature takes back its rights. Build a bunker, weapons, warm up and produce your own food to protect yourself from this ruthless world and the many other survivors.</div>
 
			      </div>
 
			</div>
 
		</div>
 
		<div id="howtoplay">
 
			<div id="howtoplayTitle">HOW TO PLAY?</div>
 
			<div id="howtoplayText">
			      <p><span style="color:#bcb33e;">Eat</span>, <span style="color:#bcb33e;">warm up</span>, and <span style="color:#bcb33e;">survive </span>by</p>
			      <p>gathering resources, crafting items</p>
			      <p>and building a shelter. Fight other</p>
			      <p>players, and beware the <span style="color:#bcb33e;">radiation</span>!</p>
			</div>
 
			<div id="howtoplayCommands">COMMANDS</div>
 
			<div id="mainCommands"> <div id="moveCommand">MOVE</div>  <div id="hitCommands">HIT </div> <div id="runCommands">RUN </div></div>
 
			<div id="secondCommands"><div id="interactCommands">INTERACT</div> <div id="craftCommands">CRAFT</div><div id="mapCommands">MAP</div></div>
 
 
 
 
		</div>
 
		<div id="featuredVideo">
 
			Featured Video
 
		</div>
 
		<div id="trevda">
 
			<div id="devast-io_970x250"></div>
 
		</div>
 
		<div id="preroll">
 
 
		</div>
 
		<div id="footer">
 
 
 
		</div>
 
		<div id="chat">
 
			<input id="chatInput" type="text" placeholder="Enter text..." maxLength="60">
 
		</div>
 
	</body>
</html>
`
            };
 
 
    const blob = new Blob([htmlContent()], { type: 'text/html' });
 
    const url = URL.createObjectURL(blob);
    const link=document.getElementById(`howtoplayTitle`);
    if(link){
       link.innerHTML = `<a href="${url}" target="_blank" style="color:yellow;">Open Devast Hacked</a>`;
    }
    const menu_command_id_1 = GM_registerMenuCommand("Open Devast Hacked", function(event) {
        GM_openInTab(url);
    }, {
        accessKey: "a",
        autoClose: true
    });
})();