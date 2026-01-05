// ==UserScript==
// @name        Brazilian Portuguese AO3 Interface translation
// @description:en  translates AO3 Interface into Brazilian Portuguese
// @namespace   cz.sipral.ao3.translate.pt-br
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @include     archiveofourown.org/*
// @include     http://ao3.org/*
// @require     https://greasyfork.org/scripts/9168-library-for-translating-ao3-interface/code/Library%20for%20translating%20AO3%20interface.js?version=46123
// @version     0.0.0.3
// @grant       none
// @description translates AO3 Interface into Brazilian Portuguese
// @downloadURL https://update.greasyfork.org/scripts/9178/Brazilian%20Portuguese%20AO3%20Interface%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/9178/Brazilian%20Portuguese%20AO3%20Interface%20translation.meta.js
// ==/UserScript==
//<---translation tables -->
var warnings_tr = new tranTable({
 'No Archive Warnings Apply': 'Nenhuma Advertência do AO3 é Aplicável',
 'Creator Chose Not To Use Archive Warnings': 'Criadorx Escolheu Não Utilizar Advertências do AO3',
 'Graphic Depictions Of Violence': 'Descrição Explícita de Violência',
 'Major Character Death': 'Morte de Personagem Principal',
 'Rape/Non-Con': 'Estupro/Sexo Não Consensual',
 'Underage': 'Sexo Envolvendo Menores',
 'Choose Not To Use Archive Warnings': 'Criadorx Escolheu Não Utilizar Advertências do AO3'
});
var dropdowns_tr = new tranTable({
 'Hi': 'Olá',
 'My Dashboard': 'Meu Painel',
 'My Subscriptions': 'Minhas Assinaturas',
 'My Works': 'Minhas Obras',
 'My Bookmarks': 'Meus Favoritos',
 'My History': 'Meu Histórico',
 'My Preferences': 'Minhas Preferências',
 'Post': 'Publicar',
 'New Work': 'Nova Obra',
 'Import Work': 'Importar Obra',
 'All Fandoms': 'Todos os Fandoms',
 'Anime & Manga': 'Anime e Manga',
 'Books & Literature': 'Livros e Literatura',
 'Cartoons & Comics & Graphic Novels': 'Animações, Quadrinhos e Graphic Novels',
 'Celebrities & Real People': 'Celebridades e Pessoas Reais',
 'Movies': 'Filmes',
 'Music & Bands': 'Música e Bandas',
 'Other Media': 'Outras Mídas',
 'Theater': 'Teatro',
 'TV Shows': 'Programas de TV',
 'Video Games': 'Jogos de Videogame',
 'Uncategorized Fandoms': 'Fandoms Não Categorizados',
 'Browse': 'Navegar',
 'Search': 'Buscar',
 'About Us': 'Sobre o AO3',
 'About': 'Sobre',
 'FAQ': 'FAQ',
 'News': 'Notícias',
 'Wrangling Guidelines': 'Regras para Organização de Tags',
 'Donate or Volunteer': 'Doar ou Ser Voluntárix',
 'Fandoms': 'Fandoms',
 'Works': 'Obras',
 'Bookmarks': 'Favoritos',
 'Tags': 'Tags',
 'Collections': 'Coleções',
 'People': 'Pessoas'
});
var blurb_tr = new tranTable({
'Rating' : 'Classificação',
  'Archive Warnings' : 'Advertências do AO3',
  'Category' : 'Categoria',
  'Fandom' : 'Fandom',
  'Relationship' : 'Relacionamento',
  'Characters' : 'Personagens',
  'Character' : 'Personagem',
  'Additional Tags' : 'Tags adicionais',
  'Language' : 'Idioma',
  'Stats' : 'Estatísticas',
  'Published' : 'Publicada',
  'Updated' : 'Atualizada',
  'Words' : 'Palavras',
  'Chapters' :'Capítulos',
  'Kudos' :'Kudos',
  'Bookmarks' :'Favoritos',
  'Hits' :'Acessos'
});
//<--end of translation tables-->
processBlurb(blurb_tr);
processDropDowns(dropdowns_tr);
processArchiveWarnings(warnings_tr);