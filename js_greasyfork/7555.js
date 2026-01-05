// ==UserScript==
// @name         GarbiellaYu Version Masculina
// @namespace    http://elrincondegabriellayu.blogspot.com/
// @version      0.3
// @description  Quita los fondos de imagenes backgrounde del blog de gabriela yu
// @author       ronal vasquez
// @match        http://*elrincondegabriellayu.blogspot.com/*
// @match        https://*elrincondegabriellayu.blogspot.com/*
// @grant        GM_addStyle
//@require		 https://code.jquery.com/jquery-1.9.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/7555/GarbiellaYu%20Version%20Masculina.user.js
// @updateURL https://update.greasyfork.org/scripts/7555/GarbiellaYu%20Version%20Masculina.meta.js
// ==/UserScript==
$(document).ready(function(){         
	GM_addStyle ( "			                                \
        body  {               								\
            background-image:       none !important;        \
            background:             none !important;        \
        }                                           	    \
        header  {          	 								\
            display:                none !important;        \
        }                                           		\
        .tabs-inner .widget li a {							\
            background : 			#525254;				\
            color:					#fff;					\
            border-right:			1px solid #080808;		\
		}													\
		.main-outer {										\
			box-shadow:				0 0 5px 5px #999999;	\
		}													\
		.post li {											\
			list-style-type:		circle;					\
			list-style-position:	inside;					\
			list-style-image:		none !important			\
		}													\
		.post-outer {										\
			border:					double 1px #B0B0B3;		\
		}													\
		h3.post-title {										\
			background-color:		#E4E2E2;				\
		}													\
		.sidebar h2 {										\
			background-color:		#E4E2E2;				\
		}													\
		body > img {										\
			display:				none;					\
		}													\
		footer {											\
			display:				none;					\
		}													\
		u {													\
			border-bottom:			2px dotted #2F0808;		\
			border-bottom-color:	rgb(45, 41, 43)			\
		}													\
		a {													\
			color:					#060C7B !important		\
		}													\
		a:visited {											\
			text-decoration:		none;					\
			color:					#312B8C;				\
		}													\
		img:hover {											\
			border:					1px solid #000 !important;\
		}													\
    ");
  
});