// ==UserScript==
// @name                        JVC Color Respawn
// @namespace                   Krapoutchniek (Tanil) (repris du code de Matt' & Naptu)
// @description                 Change l'icone dans la liste des topics selon le nombre de pages
// @include                     http://www.jeuxvideo.com/forums/*
// @include                     http://*.forumjv.com/*
// @include                     http://www.jeuxvideo.com/forums/0-*-0-1-0-1-2-*.htm
// @version                     1.3
// @downloadURL https://update.greasyfork.org/scripts/6938/JVC%20Color%20Respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/6938/JVC%20Color%20Respawn.meta.js
// ==/UserScript==

function color() {
    var num_topic = 1, ligne_topic, image_topic, posts_topic,				// num_topic = ligne du topic concerné, commence à 1 pour passer la ligne SUJET AUTEUR NB etc.
		topic_epingle = "/img/forums/topic-marque-on.png",					// Topic épinglé
        topic_epingle_verrouille = "/img/forums/topic-marque-off.png",		// Topic épinglé et verrouillé
        topic_verrouille = "/img/forums/topic-lock.png";					// Topic verrouillé
		
    while(num_topic <= 25) {
		ligne_topic = document.getElementById('table-liste-topic-forum').getElementsByTagName('tr')[num_topic];					// Ordre des topic de 1 à 25
		
		image_topic = ligne_topic.getElementsByTagName('td')[0].getElementsByTagName('div')[0].getElementsByTagName('img')[0];	// td[0] = icone du topic
		posts_topic = parseInt(ligne_topic.getElementsByTagName('td')[2].textContent);											// td[2] = nombre de posts du topic
		
		// Modification de l'icone selon le nombre de messages - aucune modification des topics épinglés et/ou verrouillés
		if(image_topic.getAttribute('src') != "/img/forums/topic-marque-on.png" && image_topic.getAttribute('src') != topic_epingle_verrouille && image_topic.getAttribute('src') != topic_verrouille)
		{
			// Plus de 5 pages
			if(posts_topic >= 100)
			{
				image_topic.src = "http://image.noelshack.com/fichiers/2014/50/1418342681-topic-5.png";
			}
			
			// Plus de 20 pages
			if(posts_topic >= 400)
			{
				image_topic.src = "http://image.noelshack.com/fichiers/2014/50/1418342681-topic-20.png";
			}
			
			// Plus de 100 pages
			if(posts_topic >= 2000)
			{
				image_topic.src = "http://image.noelshack.com/fichiers/2014/50/1418342681-topic-100.png";
			}
			
			// Plus de 1000 pages
			if(posts_topic >= 20000)
			{
				image_topic.src = "http://image.noelshack.com/fichiers/2014/50/1418342681-topic-1000.png";
			}
		}
		
        num_topic++;
    }
}

color();