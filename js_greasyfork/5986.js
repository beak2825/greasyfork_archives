// ==UserScript==
// @name        NOMarmelos
// @namespace   SemMarmelos
// @description Sem Filtros para chans
// @include     http://55ch.org/b/*
// @include     http://77chan.org/b/*
// @include     http://1500chan.org/b/*
// @version     2.1.16
// @homepage    https://greasyfork.org/scripts/5986-nomarmelos/code/NOMarmelos.user.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js


// @downloadURL https://update.greasyfork.org/scripts/5986/NOMarmelos.user.js
// @updateURL https://update.greasyfork.org/scripts/5986/NOMarmelos.meta.js
// ==/UserScript==
     
    var words = ['>mcq', '4chan', 'anime', 'ateu', 'ateia', 'ateísmo', 'ateísta', 'BRchan', 'cristã', 'cristão', 'cristianismo', 'ENEM', 'filtro', 'filtros', 'fio', 'foda', 'foda-se', 'fode', 'hétero', 'holocausto', 'Lula', 'mara', 'melhor horário', 'minha namorada', 'minha pitanga', 'mulher', 'mulheres', 'namorada', 'negra', 'negro', 'negros', 'Olavo', 'Olavo de Carvalho', 'Orkut', 'perguntem qualquer coisa', 'preto', 'punk', 'rateiem', 'Sakura', 'sentimento', 'Serra', 'sexo', 'sexo anal', 'sexo oral', 'skinhead', 'suicidio', 'trap', 'travesti', 'underage', 'VT', 'Hello from Russia', 'T0OOY', 'menes', 'https://www.facebook.com', 'https://www.facebook.com/', 'http://www.facebook.com/', 'http://www.facebook.com', 'www.facebook.com', 'www.facebook.com/', 'facebook.com', 'facebook.com/', 'https://twitter.com/', 'https://twitter.com', 'http://twitter.com/', 'http://twitter.com', 'www.twitter.com/', 'www.twitter.com', 'twitter.com', 'twitter.com/', 'akela', 'dogola', 'd-o-g-o-l-a', 'dogol-a', 'dogo-la', 'dog-ola', 'do-gola', 'd-ogola', 'd-ogol-a', 'd-ogo-la', 'd-og-ola', 'd-o-gola', 'd0gola', 'dog0la', 'd0g0la', 'imperador cão', 'fakul', 'comidademacaco+', 'basinga', 'bazinga', 'bazim', 'basin', 'zimbabwe', 'bozzano', 'bisnaga', 'birulei', 'basimgan', 'basengan', 'basengam', 'bosneta', 'homemdebem', 'homensdebem', 'rainha do b', 'rainha do /b', 'rainha do chan', 'rei do b', 'rei do /b', 'rei do chan', 'duplos decidem', 'triplos decidem', 'chequem meus duplos', 'chequem meus triplos', 'flarechan', 'wtchan', 'ajudandoanoespordinheiro', 'epic-rewards', '55chan.net', 'd\'us', 'virjões', 'virjão', 'existe algo mais retardado que viajar?', 'vai chora', 'vai chora?', 'Vai chora', 'Vai chora?', 'sfchan.org', 'vem brincar comigo, onii-chan', 'hussyfan', '2ch.hk', 'miltin', 'miltim', 'mene', 'dilma', 'aécio', 'pt', 'psdb', 'capitalismo', 'capitalista', 'captalista', 'socialismo', 'socialista', 'comunista', 'comuna', 'esquerdista'];
     
    $(document).ready(function() {
        hook_form();
        display_enabled();
    });
     
    // Exibe mensagem informando que filtro está habilitado abaixo do nome da board
    function display_enabled()
    {
        var css = {
            'display': 'block',
            'font-size': '12px',
        }
        var msg = $('<span>Burlador de filtros habilitado.<br/>Desenvolvido por: anão.</span>')
        $('.logo').append(msg);
        msg.css(css);
    }
     
    // Hook no submit do form
    function hook_form()
    {
        var form = $('#postform');
     
        form.submit(function(e) {
            replace_words();
        });
    }
     
    // Substituir palavras
    function replace_words()
    {
        var new_word,
            length,
            re,
            textarea = $('textarea[name="message"]'),
            text = textarea.val();
     
        $.each(words, function(index, value) {
            re = new RegExp(value, 'gi');
            matches = text.match(re, new_word);
            if (matches)
            {
                $.each(matches, function(index, v) {
                    length = v.length;
                    new_word = v.substring(0, length-1) + '\u200b' + v.substring(length-1, length);
                    text = text.replace(v, new_word);
                });
            }
        });
        textarea.val(text);
    }

