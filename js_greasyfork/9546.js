/*!
 * Copyright (c) 2006 js-markdown-extra developers
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Converts Markdown formatted text to HTML.
 * @param text Markdown text
 * @return HTML
 */
String.prototype.Pandoc = function(options = {}){
	return Pandoc( this, options);
}

Array.prototype.sum = function() {
	for (var i = 0, L = this.length, sum = 0; i < L; sum += this[i++]);
	return sum;
}
String.prototype.regexIndexOf = function (regex, startpos) {
	var indexOf = this.substring(startpos || 0).search(regex);
	return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}
Array.prototype.regexIndexOf = function (regex, startpos = 0) {
	for(var x = startpos, len = this.length; x < len; x++){
		if(typeof this[x] != 'undefined' && (''+this[x]).match(regex)){
			return x;
		}
	}
	return -1;
}
 
default_options = {
	pandoc : true,
	strict : false,
	html5: true,   
	pan_xtables: true,         
	md_extra: true,   
	mdx_xtables : true,   
	addcoordinates: true,   
	debug: true,          
};
 
function Pandoc(text, options = {}) {
	console.clear();

	console.group('options');
	console.warn(options);
	for(opt in default_options){
		console.log(opt, default_options[opt]);
		window[opt] = (typeof options[opt] == typeof default_options[opt] ? options[opt] : default_options[opt]);
		if(window[opt]==options[opt]){console.info(opt, options[opt]);}else{console.warn(opt, options[opt], 'wrong type');}
	}
	console.groupEnd();

	if (!debug) {
		window.console = {
			assert: function() {},
			clear: function() {},
			count: function() {},
			debug: function() {},
			dir: function() {},
			dirxml: function() {},
			error: function() {},
			exception: function() {},
			group: function() {},
			groupCollapsed: function() {},
			groupEnd: function() {},
			info: function() {},
			log: function() {},
			profile: function() {},
			profileEnd: function() {},
			table: function() {},
			time: function() {},
			timeEnd: function() {},
			timeStamp: function() {},
			trace: function() {},
			warn: function() {},
		};
	}
	
	var headers_in_use = [];  // For automatic header ids
	var html_to_text = false; // This will be a DOM element to put in html and get out raw text
	
    /* Utilities */
    function Array_pad(target, size, value) {
        while(target.length < size) {
            target.push(value);
        }
    }
    function String_r(target, num) {
        var buf = "";
        for(var i = 0; i < num; i++) {
            buf += target;
        }
        return buf;
    }
    function String_trim(target, charlist) {
        var chars = charlist || " \t\n\r";
        return target.replace(
            new RegExp("^[" + chars + "]*|[" + chars + "]*$", "g"), ""
        );
    }
    function String_rtrim(target, charlist) {
        var chars = charlist || " \t\n\r";
        return target.replace(
            new RegExp( "[" + chars + "]*$", "g" ), ""
        );
    }
    
    var md_urls = new Object;
    var md_titles = new Object;
    var md_html_blocks = new Object;
    var md_html_hashes = new Object;
    var md_list_level = 0;

    var md_footnotes = new Object;
    var md_footnotes_ordered = [];
    var md_footnote_counter = 1;

    var md_in_anchor = false;
    
    var md_empty_element_suffix = " />";
    var md_tab_width = 4;
    var md_less_than_tab = md_tab_width - 1;
    
    var md_block_tags = 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|form|fieldset|iframe|hr|legend';
    var md_context_block_tags = "script|noscript|math|ins|del";
    var md_contain_span_tags = "p|h[1-6]|li|dd|dt|td|th|legend";
    var md_clean_tags = "script|math";
    var md_auto_close_tags = 'hr|img';
    
    /*
    var md_nested_brackets_depth = 6;
    var md_nested_brackets =
          String_r(String_r(
              '(?:[^\\[\\]]+|\\[',
              md_nested_brackets_depth
          ) + '\\])+', md_nested_brackets_depth );
    */
    var md_nested_brackets = '.*?(?:\\[.*?\\])?.*?';
    
    var md_flag_StripLinkDefinitions_Z = "9082c5d1b2ef05415b0a1d3e43c2d7a6";
    var md_reg_StripLinkDefinitions = new RegExp(
      '^[ ]{0,' + md_less_than_tab + '}\\[(.+)\\]:'
    + 	'[ \\t]*'
    + 	'\\n?'
    + 	'[ \\t]*'
    + '<?(\\S+?)>?'
    + 	'[ \\t]*'
    + 	'\\n?'
    + 	'[ \\t]*'
    + '(?:'
    + 	'(?=\\s)[\\s\\S]'
    + 	'["(]'
    + 	'(.*?)'
    + 	'[")]'
    + 	'[ \\t]*'
    + ')?'
    + '(?:\\n+|' + md_flag_StripLinkDefinitions_Z + ')'
    , "gm" );
    function _StripLinkDefinitions( text ) {
        text += md_flag_StripLinkDefinitions_Z;
        var reg = md_reg_StripLinkDefinitions;
    
        text = text.replace( reg, function( $0, $1, $2, $3 ) {
            var link_id = $1.toLowerCase( );
            md_urls[link_id] = _EncodeAmpsAndAngles( $2 );
            if( $3 != "" && $3 != undefined )
                md_titles[link_id] = $3.replace( /\"/, "&quot;" );
            return "";
        } );
        
        return text.replace( md_flag_StripLinkDefinitions_Z, "" );
    }
    
    var md_reg_VerticalGlue = new RegExp(
      '[ ]{0,' + md_less_than_tab + '}[.]{3,}\\n'
    + 	'((?:.*\\n)+)'
    + '[ ]{0,' + md_less_than_tab + '}[.]{3,}\\n'
    , "gm" );
    function _VerticalGlue( text ){
    	var reg = md_reg_VerticalGlue;
    	text = text.replace( reg, function( $0, $1 ) {
    		var output = [];
    		var columns = $1.split(/\n[.]{3,}\n/);
    		var width = columns.length;
    		for(var x = 0; x < width; x++){    			
    			columns[x] = columns[x].split(/\n/);
    			var height = columns[x].length;
	    		for(var y = 0; y < height; y++){
	    			 output[y] = output[y] || '';
	    			 output[y] += columns[x][y];
	    		}  			
    		}
    		return output.join('\n');
        } );
        return text;
    }
    
    // Footnotes

    function _StripFootnotes(text) {
      //
      // Strips link definitions from text, stores the URLs and titles in
      // hash references.
      less_than_tab = md_tab_width - 1;

      // Link defs are in the form: [^id]: url "optional title"
      text = text.replace(new RegExp('^[ ]{0,'+less_than_tab+'}\\[\\^(.+?)\\][ ]?:[ ]*\\n?((?:.+|\\n(?!\\[\\^.+?\\]:\\s)(?!\\n+[ ]{0,3}\\S))*)', 'mg'),
                          function($0, $1, $2) {
                            md_footnotes[$1] = _Outdent($2);
                            return '';
                          });

                          return text;
    }

    function _DoFootnotes(text) {
      //
      // Replace footnote references in $text [^id] with a special text-token 
      // which will be replaced by the actual footnote marker in appendFootnotes.
      if (!md_in_anchor) {
        text = text.replace(/\[\^(.+?)\]/g, function($0, $1) { return "F\x1Afn:" + $1 + "\x1A:" });
      }
      return text;
    }

    function _AppendFootnotes(text) {
      //
      // Append footnote list to text.
      //
      text = text.replace(/F\x1Afn:(.*?)\x1A:/g, _appendFootnotes_callback);

      if (md_footnotes_ordered.length != 0) {
        text += "\n\n";
        text += "<div class=\"footnotes\">\n";
        text += "<hr" + md_empty_element_suffix + "\n";
        text += "<ol>\n\n";

        attr = " rev=\"footnote\"";
        num = 0;

        while (md_footnotes_ordered.length != 0) {
          var thing = md_footnotes_ordered.shift();
          var note_id = thing[0];
          var footnote = thing[1];

          footnote += "\n"; // Need to append newline before parsing.
          footnote = _RunBlockGamut(footnote + "\n");				
          footnote = footnote.replace(/F\x1Afn:(.*?)\x1A:/g, _appendFootnotes_callback);

          num += 1;
          attr = attr.replace("%%", num);
          note_id = _EncodeAttribute(note_id);

          // Add backlink to last paragraph; create new paragraph if needed.
          backlink = "<a href=\"#fnref:" + note_id + "\"" + attr + ">&#8617;</a>";
          if (footnote.match(/<\/p>$/)) {
            footnote = footnote.replace(/<\/p>$/, "") + "&#160;" + backlink + "</p>";
          } else {
            footnote += "\n\n<p>" + backlink + "</p>";
          }

          text += "<li id=\"fn:" + note_id + "\">\n";
          text += footnote + "\n";
          text += "</li>\n\n";
        }

        text += "</ol>\n";
        text += "</div>";
      }
      return text;
    }

    function _appendFootnotes_callback($0, $1) {
      var node_id = $1;

      // Create footnote marker only if it has a corresponding footnote *and*
      // the footnote hasn't been used by another marker.
      if (md_footnotes[node_id]) {
        // Transfer footnote content to the ordered list.
        md_footnotes_ordered.push([node_id, md_footnotes[node_id]]);
        delete md_footnotes[node_id];

        var num = md_footnote_counter++;
        var attr = " rel=\"footnote\"";

        attr = attr.replace("%%", num);
        node_id = _EncodeAttribute(node_id);

        return "<sup id=\"fnref:" + node_id + "\">" +
          "<a href=\"#fn:" + node_id + "\"" + attr + ">" + num + "</a>" +
          "</sup>";
      }

      return "[^" + $1 + "]";
    }

    
    function _HashHTMLBlocks( text ) {
        text = _HashHTMLBlocks_InMarkdown( text )[0];
        return text;
    }
    
    function _HashHTMLBlocks_InMarkdown( text, indent, enclosing_tag, md_span ) {
        indent			= indent || 0;
        enclosing_tag	= enclosing_tag || "";
        md_span			= md_span || false;
        
        if( text === "" ) return new Array( "", "" );
        
        var newline_match_before = /(?:^\n?|\n\n)*$/g;
        var newline_match_after = /^(?:[ ]*<!--.*?-->)?[ ]*\n/g;
        
        var block_tag_match = new RegExp(
          '('
        + 	'</?'
        + 	'(?:'
        + 		md_block_tags + '|'
        + 		md_context_block_tags + '|'
        + 		md_clean_tags + '|'
        + 		'(?!\\s)' + enclosing_tag
        + 	')'
        + 	'\\s*'
        + 	'(?:'
        + 		'".*?"|'
        + 		'\'.*?\'|'
        + 		'.+?'
        + 	')*?'
        + 	'>'
        + '|'
        + 	'<!--.*?-->'
        + '|'
        + 	'<\\?.*?\\?>'
        + '|'
        + 	'<!\\[CDATA\\[.*?\\]\\]>'
        + ')'
        );
        
        var depth = 0;
        var parsed = "";
        var block_text = "";
        
        do {
            var r = text.match( block_tag_match );
            
            if( r == null ) {
                if( md_span )
                    parsed += text.replace( /\n\n/g, "\n" );
                else
                    parsed += text;
                text = "";
                break;
            }
            
            var parts = new Array( RegExp.leftContext, RegExp.lastMatch || RegExp.$1, RegExp.rightContext );
            
            if( md_span )
                parts[0] = parts[0].replace( /\n\n/g, "\n" );
            
            parsed += parts[0];
            
            var tag = parts[1];
            text = parts[2];
            
            var matches = parsed.match( /(^\n|\n\n)((.\n?)+?)$/ );
            if(
                matches != null &&
                (
                matches[1].match( new RegExp(
                    '^[ ]{' + ( indent + 4 ) + '}.*(\\n[ ]{' + ( indent + 4 ) + '}.*)*' + '(?!\\n)$/'
                    ), "gm" ) ||
                matches[1].match( /^(?:[^`]+|(`+)(?:[^`]+|(?!\1[^`])`)*?\1(?!`))*$/ ) == null
                )
            )
            {
                parsed += tag.charAt( 0 );
                text = tag.substr( 1 ) + text;
            }
            else if(
                tag.match( new RegExp( '^<(?:' + md_block_tags + ')\\b' )
                    || (
                       tag.match( new RegExp( '^<(?:' + md_context_block_tags + ')\\b' ) )
                    && parsed.match( newline_match_before )
                    && text.match( newline_match_after )
                        )
                    )
                )
            {
                var parsed_array = _HashHTMLBlocks_InHTML( tag + text, _HashHTMLBlocks_HashBlock, true );
                block_text = parsed_array[0];
                text = parsed_array[1];
                
                parsed += "\n\n" + block_text + "\n\n";
            }
            else if ( tag.match( new RegExp( '^<(?:' + md_clean_tags + ')\\b' ) )
                || tag.charAt( 1 ) == '!' || tag.charAt( 1 ) == '?' )
            {
                var parsed_array = _HashHTMLBlocks_InHTML( tag + text, _HashHTMLBlocks_HashClean, false );
                block_text = parsed_array[0];
                text = parsed_array[1];
                parsed += block_text;
            }
            else if ( enclosing_tag !== '' &&
                tag.match( new RegExp( '^</?(?:' + enclosing_tag + ')\\b' ) ) )
            {
                if ( tag.charAt( 1 ) == '/' ) depth--;
                else if ( tag.charAt( tag.length - 2 ) != '/' ) depth++;
                
                if( depth < 0 ) {
                    text = tag + text;
                    break;
                }
                
                parsed += tag;
            }
            else {
                parsed += tag;
            }
        } while ( depth >= 0 );
        
        return new Array( parsed, text );
    }
    
    
    var md_reg_HashHTMLBlocks = new RegExp(
      '('
    + 	'</?'
    + 		'[\\w:$]+'
    + 		'\\s*'
    + 		'(?:'
    + 			'"[\\s\\S]*?"|'
    + 			'\'[\\s\\S]*?\'|'
    + 			'[\\s\\S]+?'
    + 		')*?'
    + 	'>'
    + '|'
    + 	'<!--[\\s\\S]*?-->'
    + '|'
    + 	'<\\?[\\s\\S]*?\\?>'
    + '|'
    + 	'<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'
    + ')'
    );
    function _HashHTMLBlocks_InHTML( text, hash_function, md_attr ) {

        if( text === '' ) return new Array( '', '' );
        
        var markdown_attr_match = new RegExp(
          '\\s*'
        + 'markdown'
        + '\\s*=\\s*'
        + '(["\'])'
        + '(.*?)'
        + '\\1'
        );

        var options_attr_match = new RegExp(
          '\\s*'
        + 'options'
        + '\\s*=\\s*'
        + '(["\'])'
        + '(.*?)'
        + '\\1'
        );
        
        var original_text = text;
        
        var depth = 0;
        var block_text = "";
        var parsed = "";
        
        var base_tag_name = "";
        var matches = text.match( /^<([\w:$]*)\b/ );
        if( matches != null ) base_tag_name = matches[1];
        do {
            var r = text.match( md_reg_HashHTMLBlocks );
            
            if( r == null ) {
                return new Array( original_text.substr( 0, 1 ), original_text.substr( 1 ) );
            }
            
            var parts = new Array( RegExp.leftContext, RegExp.lastMatch || RegExp.$1, RegExp.rightContext );
            
            block_text += parts[0];
            var tag = parts[1];
            text = parts[2];
            
            if( tag.match( new RegExp( '^</?(?:' + md_auto_close_tags + ')\\b' ) ) ||
                tag.charAt( 1 ) == '!' || tag.charAt( 1 ) == '?' )
            {
                block_text += tag;
            }
            else {
                if( tag.match( new RegExp( '^</?' + base_tag_name + '\\b' ) ) ) {
                    if( tag.charAt( 1 ) == '/' ) depth--;
                    else if( tag.charAt( tag.length - 2 ) != '/' ) depth++;
                }
                
				var options_matches = tag.match( options_attr_match );
                if(options_matches){


					var all_options = options_matches[2].split(',');
					var all_options_length = all_options.length;
					var local_options = {};
					var global_options = {};
					for(var o = 0; o < all_options_length; o++){
						[label, value] = all_options[o].split(':');
						if(default_options[label]){
							local_options[label] = (value=='true' ? true : value);
							global_options[label] = window[label];
							// This should set the options for the containing block
							// e.g. gridtables `true`, whereas it is set to `false` outside of the block
							window[label] = value;
						}
						else{
							console.error('no such option label:', label);
						}
					}
					console.info('local_options:', local_options);
				}
                
                var attr_matches = tag.match( markdown_attr_match );
                if ( md_attr && attr_matches != null
                    && attr_matches[2].match( /^(?:1|block|span)$/ ) )
                {
                    tag = tag.replace( markdown_attr_match, '' );
                    
                    var md_mode = attr_matches[2];
                    var span_mode = ( md_mode == 'span' ||
                                md_mode != 'block' &&
                                tag.match( '^<(?:' + md_contain_span_tags + ')\\b' ) != null );
                    
                    var matches = block_text.match( /(?:^|\n)([ ]*?)(?![ ]).*?$/ );
                    var indent = matches[1].length;
                    
                    block_text += tag;
                    parsed += hash_function( block_text, span_mode );
                    
                    matches = tag.match( /^<([\w:$]*)\b/ );
                    var tag_name = matches[1];
                    
                    var parsed_array = _HashHTMLBlocks_InMarkdown( text, indent, tag_name, span_mode );
                    block_text = parsed_array[0];
                    text = parsed_array[1];
                    
                    if ( indent > 0 ) {
                        block_text = block_text.replace( new RegExp( '^[ ]{1,' + indent + '}', "gm" ), "" );
                    }
                    
                    if( !span_mode ) parsed += "\n\n" + block_text + "\n\n";
                    else parsed += block_text;
                    
                    block_text = "";
                }
                else {
                    block_text += tag;
                }
            }
            
        }
        while( depth > 0 );
        
        parsed += hash_function( block_text );
        
        // resetting for global
        for(opt in global_options){
        	window[opt] = global_options[opt];
        }
        console.info('global_options:', global_options);
        console.log(parsed, '_', text);
        
        return new Array( parsed, text );
    }
    
    function _HashHTMLBlocks_HashBlock( text ) {
        var key = _md5( text );
        md_html_hashes[key] = text;
        md_html_blocks[key] = text;
        return key;
    }
    function _HashHTMLBlocks_HashClean( text ) {
        var key = _md5( text );
        md_html_hashes[key] = text;
        return key;
    }
    
    function _HashBlock( text ) {
        text = _UnhashTags( text );
        
        return _HashHTMLBlocks_HashBlock( text );
    }
    
    function _RunBlockGamut( text, hash_html_blocks ) {
        hash_html_blocks = ( hash_html_blocks == undefined );
        if(pandoc){
        	text = _DoSimpleTables( text );
        }
        if ( hash_html_blocks ) {
            text = _HashHTMLBlocks( text );
        }
        text = _DoHeaders( text );
        text = _DoTables( text );
        if(pandoc){
        	text = _DoGrids( text );
        }
        
        text = text
            .replace( /^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, _HashBlock( "\n<hr" + md_empty_element_suffix + "\n" ) )
            .replace( /^[ ]{0,2}([ ]?-[ ]?){3,}[ \t]*$/gm, _HashBlock( "\n<hr" + md_empty_element_suffix + "\n" ) )
            .replace( /^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, _HashBlock( "\n<hr" + md_empty_element_suffix + "\n" ) )
        ;
        
        text = _DoLists( text );
        text = _DoDefLists( text );
        text = _DoCodeBlocks( text );
        text = _DoBlockQuotes( text );
        text = _FormParagraphs( text );
        
        return text;
    }
    
    function _RunSpanGamut( text ) {
        text = _DoCodeSpans( text );
        text = _EscapeSpecialChars( text );
        text = _DoFootnotes( text );
        text = _DoImages( text );
        text = _DoAnchors( text );
        text = _DoAutoLinks( text );
        text = _EncodeAmpsAndAngles( text );
        text = _DoItalicsAndBold( text );
		text = text.replace( /[ ]{2,}\n/g, "<br" + md_empty_element_suffix + "\n" );
        if(pandoc){
        	text = text.replace( /\\\n/g, "<br" + md_empty_element_suffix + "\n" );
        }
        return text;
    }
    
    function _EscapeSpecialChars( text ) {
        var tokens = _TokenizeHTML( text );
        
        var text = "";
        
        for( var i = 0, len = tokens.length; i < len; i++ ) {
            var cur_token = tokens[i];
            if( cur_token[0] == 'tag' ) {
                cur_token[1] = _EscapeItalicsAndBold( cur_token[1] );
                text += cur_token[1];
            } else {
                var t = cur_token[1];
                t = _EncodeBackslashEscapes( t );
                text += t;
            }
        }
        return text;
    }
    
    
    var md_reg_DoAnchors1 = new RegExp(
      '('
    + 	'\\['
    + 		'(' + md_nested_brackets + ')'
    + 	'\\]'
    + 	'[ ]?'
    + 	'(?:\\n[ ]*)?'
    + (pandoc ?
		'(?:\\['
		+ 		'([\\s\\S]*?)'
		+ 	'\\])?'
		:
		'\\['
		+ 		'([\\s\\S]*?)'
		+ 	'\\]'
    )
    + ')'
    , "g" );
    var md_reg_DoAnchors2 = new RegExp(
      '('
    + 	'\\['
    + 		'(' + md_nested_brackets + ')'
    + 	'\\]'
    + 	'\\('
    + 		'[ \\t]*'
    + 		'<?(.*?)>?'
    + 		'[ \\t]*'
    + 		'('
    + 			'([\'"])'
    + 			'(.*?)'
    + 			'\\5'
    + 		')?'
    + 	'\\)'
    + ')'
    , "g" );
    
    function _DoAnchors( text ) {
        if (md_in_anchor) return text;
        md_in_anchor = true;

        var reg = md_reg_DoAnchors1;
        text = text.replace( reg, _DoAnchors_reference_callback );
    
        var reg = md_reg_DoAnchors2;
        text = text.replace( reg, _DoAnchors_inline_callback );
    
        md_in_anchor = false;
        return text;
    }
    function _DoAnchors_reference_callback( $0, $1, $2, $3 ) {
        var whole_match = $1;
        var link_text = $2;
        var link_id = $3.toLowerCase( );
        var result = "";
        
        if( link_id == "" ) {
            link_id = link_text.toLowerCase( );
        }
        
        if( md_urls[link_id] ) {
            var url = md_urls[link_id];
            url = _EscapeItalicsAndBold( url );
            
            result = '<a href="' + url + '"';
            if ( md_titles[link_id] ) {
                var title = md_titles[link_id];
                title = _EscapeItalicsAndBold( title );
                result +=  ' title="' + title + '"';
            }
            result += ">" + link_text + "</a>";
        }
        else {
            result = whole_match;
        }
        
        return result;
    }
    function _DoAnchors_inline_callback( $0, $1, $2, $3, $4, $5, $6 ) {
        var whole_match = $1;
        var link_text = $2;
        var url = $3;
        var title = $6;
    
        var url = _EscapeItalicsAndBold( url );
        var result = '<a href="' + url + '"';
        
        if( title ) {
            title = title.replace( '"', '&quot;' );
            title = _EscapeItalicsAndBold( title );
            result +=  ' title="' + title + '"';
        }
        
        result += ">" + link_text + "</a>";
    
        return result;
    }
    
     
    
     
    
     
    
    var md_reg_DoImages1 = new RegExp(
      '('
    + 	'!\\['
    + 		'(' + md_nested_brackets + ')'
    + 	'\\]'
    + 	'[ ]?'
    + 	'(?:\\n[ ]*)?'
    + 	'\\['
    + 		'(.*?)'
    + 	'\\]'
    + ')'
    , "g" );
    
    var md_reg_DoImages2 = new RegExp(
      '('
    + 	'!\\['
    + 		'(' + md_nested_brackets + ')'
    + 	'\\]'
    + 	'\\('
    + 		'[ \\t]*'
    + 		'<?(\\S+?)>?'
    + 		'[ \\t]*'
    + 		'('
    + 			'([\'"])'
    + 			'(.*?)'
    + 			'\\5'
    + 			'[ \\t]*'
    + 		')?'
    + 	'\\)'
    + ')'
    , "g" );
    function _DoImages( text ) {
        var reg = md_reg_DoImages1;
        text = text.replace( reg, _DoImages_reference_callback );
        
        var reg = md_reg_DoImages2;
        text = text.replace( reg, _DoImages_inline_callback );
        
        return text;
    }
    function _DoImages_reference_callback( $0, $1, $2, $3 ) {
        var whole_match = $1;
        var alt_text = $2;
        var link_id = $3.toLowerCase( );
        var result = "";
        
        if ( link_id == "" ) {
            link_id = alt_text.toLowerCase( );
        }
        
        alt_text = alt_text.replace( /\"/, '&quot;' );
        if( md_urls[link_id] ) {
            var url = md_urls[link_id];
            url = _EscapeItalicsAndBold( url );
            result = '<img src="' + url + '" alt="' + alt_text + '"';
            if( md_titles[link_id] ) {
                var title = md_titles[link_id];
                title = _EscapeItalicsAndBold( title );
                result +=  ' title="' + title + '"';
            }
            result += md_empty_element_suffix;
        }
        else {
            result = whole_match;
        }
        
        return result;
    }
    function _DoImages_inline_callback( $0, $1, $2, $3, $4, $5, $6 ) {
        var whole_match = $1;
        var alt_text = $2;
        var url = $3;
        var title = '';
        if( $6 ) title = $6;
        
        var alt_text = alt_text.replace( '"', '&quot;' );
        title = title.replace( '"', '&quot;' );
        var url = _EscapeItalicsAndBold( url );
        var result = '<img src="' + url + '" alt="' + alt_text + '"';
        if( title ) {
            title = _EscapeItalicsAndBold( title );
            result += ' title="' + title + '"';
        }
        result += md_empty_element_suffix;
        
        return result;
    }
    
     
    
    var md_reg_DoSetextHeaders = /(^.+?)(?:[ ]+\{#([-_:a-zA-Z0-9]+)\})?[ \t]*\n([-]+|[=]+)[ \t]*\n+/gm;
    var md_reg_DoAtxHeaders = new RegExp(
      (Pandoc && !strict ? '^\\n' : '^') // Pandoc requires a blank line before a header
    + (pandoc ? ( strict ? '(#{1,6})(?![.])' : '(#+(?![.])[=+-]*)'): (strict ? '(#{1,6})' : '(#+[=+-]*)') ) // do not include pandoc "#." 
    + '[ \\t]*'
    + '(.+?)'
    + '[ \\t]*'
    + '#*'
    + '(?:[ ]+\\{#([-_:a-zA-Z0-9]+)\\}[ ]*)?'
    + (Pandoc && !strict ? '\\n' : '\\n+')
    , (Pandoc && !strict ? 'gm' : 'gm') );
    function _DoHeaders( text ) {
        var reg = md_reg_DoSetextHeaders;
        text = (Pandoc && !strict ? '\n' : '')+text.replace( reg, function( $0, $1, $2, $3 ) {
        			var hx = ($3.charAt(0)=='=' ? "h1" : "h2");
                    var str = '<'+hx;
					var header_text = _RunSpanGamut( _UnslashQuotes( $1 ) );
					var header_id = ( $2 ? $2 : (pandoc ? _RunHeaderId( header_text ) : false) );
					headers_in_use.push(header_id);
                    str += ( header_id ) ? ' id=\"' + header_id + '\"' : "";
                    str += ">" + header_text + "</"+hx+">";
                    return _HashBlock( str ) + "\n\n";
                } );
        
        var reg = md_reg_DoAtxHeaders;
        text = text.replace( reg, function( $0, $1, $2, $3 ) {
        			[, dashes, plusminus] = $1.match(/(#+)([=+-]*)/);
        			level = (plusminus.length==0 ? dashes.length : (window.previouslevel || 1));
        			for(var c=0, len = plusminus.length; c<len; c++){
        				switch(plusminus[c]){
        					case "+": level++;break;
        					case "-": level--;break;
        				}	
        			}
        			level = (level<1 ? 1 : level);
        			window.previouslevel = level;
        			var hx = (level <=6 ? "h" + level : 'span');
        			var cssclass = (level <=6 ? '' : ' class="h'+level+'"');
                    var str = "<" + hx + cssclass;
					var header_text = _RunSpanGamut( _UnslashQuotes( $2 ) );
					var header_id = ( $3 ? $3 : (pandoc ? _RunHeaderId( header_text ) : false) );
					headers_in_use.push(header_id);
                    str += ( header_id ) ? ' id=\"' + header_id + '\"' : "";
                    str += ">" +header_text;
                    str += "</" + hx + ">";
                    return _HashBlock( str ) + "\n\n";
                } );
        
        return text;
    }
    function _RunHeaderId( header_id = '', already_used_array = false){
    	console.group(header_id);
    	// * Remove all formatting, links, etc.
    	html_to_text = html_to_text || document.createElement('span');
    	html_to_text.innerHTML = header_id;
    	header_id = html_to_text.textContent;
    	html_to_text.innerHTML = '';
		// alternative removal of html; doesn't decode html html_to_text like &amp;
		//header_id = header_id.replace(/\<[^>]*\>?/g, '');
		
		// remove leading and trailing spaces and newlines
		header_id = header_id.replace(/^[\s\n]*|[\s\n]$/g, '');
		
		// replace en and em dashes with -- and ---
		header_id = header_id.replace(/–/g, '--').replace(/—/g, '---');
		
		// * Replace all spaces and newlines with hyphens.
		header_id = header_id.replace(/[\s\n\‐\‐]/g, '-'); // I included special hyphens
		
		// * Remove all punctuation, except underscores, hyphens, and periods.
		header_id = header_id.replace(/[^\w-._]/g, '');
		
		// * Convert all alphabetic characters to lowercase.
		header_id = header_id.toLowerCase();
		
		// * Remove everything up to the first letter (identifiers may not begin with a number or punctuation mark).
		header_id = header_id.replace(/^[\W\d]*/, '');
		
		// * If nothing is left after this, use the identifier "section".
		header_id = ( header_id == '' ? 'section' : header_id );
		
		// when several headers have the same text; in this case, the first will get an identifier as described above; the second will get the same identifier with -1 appended; the third with -2; and so on.
		if(!already_used_array){
			if(typeof headers_in_use=='undefined'){
				headers_in_use = [];
			}
			already_used_array = headers_in_use;
		}

		var new_header = header_id;
		var new_counter = 1;
		while( already_used_array.indexOf(new_header)>=0 ){
			new_header = header_id + '-' + new_counter;
			new_counter++;
		}
		if(new_header != header_id){
			header_id = new_header;
			console.warn('renamed to:' + header_id);
		}

		console.info('#'+header_id);
		console.groupEnd();
    	return header_id;
    }
    
    
    var md_flag_DoTables = "9882b282ede0f5af55034471410cfc46";
    var md_reg_DoTables1 = new RegExp(
      '^'
    + '('
    + '[ ]{0,' + md_less_than_tab + '}'
    + 	'(?:Table[:]|[:])[\\S\\s]*?[^\\n]\\n'	// captionabove
    + 	'\\n'
    + ')?'
    + '[ ]{0,' + md_less_than_tab + '}'
    + '('								
    + 	'(?:'
    + 		'(?:(?:[|^].*|.*[|^].*)\\n)'		// |header |header |
    +       '(?:(?:[\'].*|.*[\'].*)\\n)*'		// !more   !more   !
    + 	')*?'
    + 	'(?:[ ]*[-=|: ]*[|][-=|: ]*)\\n'		// | ----- |=======| or ------|======
	+ ')'
    + '('								
    + 	'(?:'
    + 		'(?:(?:[|^].*|.*[|^].*)\\n)'		// |content|content|
    +       '(?:(?:[\'].*|.*[\'].*)\\n)*?'		// !more   !more   !
    + 	')+?'
    + ')'
    + '(?:('
    + 	'(?:[ ]*[-=|:]*[|][-=|:]*)\\n'			// |-------|=======| or ------|======							
    + 	'(?:'
    + 		'(?:(?:[|^].*|.*[|^].*)\\n)'		// |footer |footer |
    +       '(?:(?:[\'].*|.*[\'].*)\\n)*'		// !more   !more   !
    + 	')*'
    + '))?'
    + '('
    + '[ ]{0,' + md_less_than_tab + '}'
    + 	'\\n'
    + 	'(?:Table[:]|[:])[\\S\\s]*?[^\\n]\\n'				// captionbelow
    + ')?'
    + '(?=\\n|' + md_flag_DoTables + ')'//Stop at final double newline.
    , "gm" );
    function _DoTables( text ) {
        
        text += md_flag_DoTables;
        var reg = md_reg_DoTables1;
        
        text = text.replace( reg, function( $0, $1, $2, $3, $4, $5 ) {
        	console.clear();
        	//console.log('0:\n'+$0, '\n\n1:\n'+$1, '\n\n2:\n'+$2, '\n\n3:\n'+$3 );
            return _DoTable_callback( $0, $1, $2, $3, $4, $5 );
        } );
        
        text = text.replace( md_flag_DoTables, "" );
        
        return text;
    }
    
    function _DoTable_callback( $0, captionabove = '', head = '', body = '', foot = '', captionbelow = '' ) {

		var head_rows = head.split( /\n/ );
		var body_rows = body.split( /\n/ );
		var foot_rows = foot.split( /\n/ );
		
		head_rows.pop();
		body_rows.pop();
		foot_rows.pop();
		console.log('captionabove',captionabove);
		console.log(head_rows.join('\n'));
		console.log(body_rows.join('\n'));
		console.log(foot_rows.join('\n'));
		console.log('captionbelow',captionbelow);
		
//         var underline = head_rows[head_rows.length-1].replace(/^[ ]*(?![|^'])/gm, '|').replace(/[|^'\n]*$/, '');
//         var overline  = foot_rows[0].replace(/^[ ]*(?![|^'])/gm, '|').replace(/[|^'\n]*$/, '').split(/\n/);

var underline = head_rows.length;
var und = underline;
var overline = underline + body_rows.length +1;
console.log('underline:', underline, 'overline:', overline);
        
        //underline	= underline.replace( /[|][ ]*$/gm, '' ).replace( /[ ]*/gm, '' ).replace( /[=]/g, '-' );
        //content		= content.replace( /[|][ ]*$/gm, '' );
        
		var h_align_all = [];
		var v_align_all = [];
		colgroup = [];
		
		var v_header = [];
		var colname = [];
		var rowname = [];

		var table = [];
        if(head_rows.length > 0){var table = table.concat(head_rows);}
        if(body_rows.length > 0){var table = table.concat(body_rows);}
		if(foot_rows.length > 0){var table = table.concat(foot_rows);}
        //var thead = [];
        //var tbody = [];
        
        var two_dim_arr = [];
        //var area = 'thead';
        
        theadsize = 0;
        tbodysize = 0;
        tfootsize = 0;
        
        rownum = 1;
        two_dim_arr[0] = []; //this enables you to even start your table with `'` or `^` cells (in case you get loonatic)
        
        function fillrowuntil(rownum, colnum){
        	tn = {};
        	beforelength = two_dim_arr[rownum].length;
        	console.info( typeof two_dim_arr[rownum][beforelength-1] == 'object' ? two_dim_arr[rownum][beforelength-1].colnum + two_dim_arr[rownum][beforelength-1].colspan : 0+1);
        	
        	var pointer = ( typeof two_dim_arr[rownum][beforelength-1] == 'object' ? two_dim_arr[rownum][beforelength-1].colnum + two_dim_arr[rownum][beforelength-1].colspan : 0+1);
        	for(pointer; pointer <= colnum; pointer ++){
        		tn.raw = '|';
				tn.text = ' ' + '\n';
				tn.l = ' ';
				tn.r = ' ';
				tn.colnum = pointer;
				tn.rownum = rownum;
				tn.colspan = 1;
				tn.rowspan = 1;
				tn.height = 1;
				tn.h_align = 'default';
				tn.v_align = 'default';
				
				two_dim_arr[rownum].push(tn);
				console.warn('this row was extended to be able to put the content somewhere');
				console.log(two_dim_arr[rownum]);
			}
        }
        
        for(y=0, rows_len = table.length; y < rows_len; y++ ){
			console.group('y:', y);
			two_dim_arr[rownum] = [];
        
        	table[y] = table[y]
        	//remove trailing spaces and the last bar
        	.replace( /[|^'][ \n]*$/gm, '' )
        	//remove leading spaces and add first bar if needed
        	.replace(/^[ ]*(?![|^'])/gm, '|')
        	// split before the seperator that is not followed by another seperator (which is needed for colspan!)
			.split(/(?=[|^'][^|^'])/);
        	console.log(table[y]);
        	colnum = 0;
        	advance = false;
        	for(x=0, cols_len = table[y].length; x < cols_len; x++ ){
        			console.group('x:', x, 'colnum:'+colnum);
					td = {};
	        		raw = table[y][x];
	        		//[, s, l, text, r, z] = raw.match(/^([|^'])([:;]?)(.*?)([:;]?)(\d+|[|^']*)$/);
					[, s, l, text, r, z] = raw.match(/^([|^'])([:;]?)(.*?)([:;]?)([|^']*)$/);
	        		l = (l=='' ? ' ' : l);
	        		r = (r=='' ? ' ' : r);
	        		console.log([s,l,text,r,z]);
	        		var pointer = rownum;
					switch(s){
	        			case "|":
							h_align_srt = (l == ':' && r == ':' ? 'center' : l == ':' ? 'left' : r == ':' ? 'right' : 'default');
							h_align_end = (l == ';' && r == ';' ? 'center' : l == ';' ? 'left' : r == ';' ? 'right' : 'default');
							
							if (h_align_srt != 'default') {
								h_align = h_align_srt;
								h_align_all[colnum] = h_align_srt;
								console.log('start', h_align);
										
								td.v_align_to_right = true;
								console.warn('the next one will take my v_align');
										
								
							} else if (h_align_end != 'default') {
								h_align = h_align_end;
								h_align_all[colnum] = 'default';
								console.log('end/singlecell', h_align);
							} else {
								console.log('else');
								h_align = h_align_all[colnum] || 'default';
							}
							h_align_all[colnum] = h_align_all[colnum] || 'default';
							
							
	        				if(!(y+1==underline || y+1==overline)){
	        					//fillrowuntil(rownum, colnum-1);
	        				
	        					advance = true;
								td.raw = raw;
								td.l = l;
								td.r = r;
								td.text = text + '\n';
								td.colnum = colnum;
								td.rownum = rownum;
								td.height = 1;
								td.colspan = z.length+1;
								//td.colspan = ( z.match(/\d+/) ? z*1 : z.length+1 );
								td.rowspan = 1;
								td.h_align = h_align;
								td.v_align = 'default';
								if(v_header[colnum]==true){
									td.th = true;
									rowname[rownum] = _RunHeaderId(String_trim(text));
								}
								if(y<underline || y>overline){
									td.th = true;
									colname[colnum] = _RunHeaderId(String_trim(text));
								}
								if(colname[colnum]){
									td.colname = colname[colnum];
								}
								if(rowname[rownum]){
									td.rowname = rowname[rownum];
								}

								
								console.log(s,l,text,r,td.colspan, h_align);
								
								two_dim_arr[rownum][colnum] = td;
								
								colnum += td.colspan;		
	        				}
	        				else {
	        					if(text.match(/[=]/)){
	        						v_header[colnum] = true;
	        						console.log(v_header);
	        					}
	        					
	        					if(y+1==underline){
	        						colgroup[colnum] = raw.length;
	        						console.log('colgroup:',colgroup);
	        					}
	        					
	        					colnum += ( z.match(/\d+/) ? z*1 : z.length+1 );
	        				}
	        			break;
	        			case "^":
	        				if(!(y+1==underline || y+1==overline)){
	        					console.log(two_dim_arr[pointer].length-1,colnum);
	        					fillrowuntil(pointer, colnum);
	        					
	        					while(pointer > 0 && typeof two_dim_arr[pointer][colnum]=='undefined'){
	        						pointer--;	
	        						console.warn(two_dim_arr[pointer][colnum]);
	        						tu = two_dim_arr[pointer][colnum];
	        					}
								tu.rowspan ++;	
	        					if(colnum>=two_dim_arr[rownum-1].length){
	        						console.error('cannot extend rowspan of nonexisting cell');
								}
							}
	        			case "'":
	        				if(!(y+1==underline || y+1==overline)){
	        					fillrowuntil(rownum-1, colnum);
	        				
								while(pointer > 0 && typeof two_dim_arr[pointer][colnum]=='undefined'){
	        						pointer--;	
	        						console.warn(two_dim_arr[pointer][colnum]);
	        						tu = two_dim_arr[pointer][colnum];
	        					}
	        				
	        					if(colnum<two_dim_arr[pointer].length){
	        						tu = two_dim_arr[pointer][colnum];
	        						tu.raw += raw + '\n';
									tu.text += text+ '\n';
									tu.l += l;
									tu.r += r;
									
									h_align_srt = (l == ':' && r == ':' ? 'center' : l == ':' ? 'left' : r == ':' ? 'right' : 'default');
									h_align_end = (l == ';' && r == ';' ? 'center' : l == ';' ? 'left' : r == ';' ? 'right' : 'default');
																		
									// |             ||top    |bottom|middle|justify|default
									// |=====|========|-------|------|------|-------|-------
									// |next | l \| r |justify|bottom|bottom|bottom |bottom
									// ^row  |-l \| r |top    |middle|middle|top    |default
									
								
									tu.v_align = tu.l.match(/^[:;]/) ? (tu.l.match(/[:;]$/) ? 'middle' : 'top') : (tu.l.match(/[:;]$/) ? 'bottom' : (tu.l.match(/.[:;]/) ? 'middle':'default') );
									
									if(l==':'||r==':'){
										tu.v_align_to_right = true;
										console.warn('the next one will take my v_align');
									}

									if(typeof two_dim_arr[pointer][colnum-1] != 'undefined' ){
										tl = two_dim_arr[pointer][colnum-1];
										if(tl.v_align_to_right){
											tu.v_align = tl.v_align;
											console.warn('i took the v_align from my left neighbour');
										}
										else{
											
										}
									}
									console.info('tu.v_align:', tu.v_align);

									console.log('_'+tu.l+'_', tu.l.length, '_'+tu.r+'_', tu.r.length);									
	        					}
								else{
									console.error('cannot put content into nonexisting cell');
									
								}	
								console.log('( z.match(/\d+/) ? z*1 : z.length+1 ):'+( z.match(/\d+/) ? z*1 : z.length+1 ));				
								colnum += ( z.match(/\d+/) ? z*1 : z.length+1 );
							}
	        			break;
	        		}
	        		
					//console.log(h_align_all, x);
	        		
	        		
					console.groupEnd();
					//row += _RunBlockGamut( text );
        	}
        	
			/*if(y!=und){
        	output+= '<tr class="'+(rownum % 2 == 0 ? 'odd' : 'even')+'">'+row+'</tr>\n';
        	}*/
        	if(advance){
        		rownum++;
        	}
        	
        	console.info('y:', y);
			if(y+1==underline-1){
        		theadsize = rownum;
        		console.log('theadsize:',theadsize);
        	}
        	else if(y+1==overline-1){
        		tbodysize = rownum - theadsize;
				console.log('tbodysize:',tbodysize);
        	}
        	else if(y==rows_len-1){
        		tfootsize = rownum - theadsize - tbodysize;
				console.log('tfootsize:',tfootsize);     		
        	}

        	
        	
           	/*if(y==und){
        		output += '</thead>\n';
        	}
        	else if(y==rows_len-1){
        		output += '</tbody>\n';
        	}*/
        	console.groupEnd();
        }

        output = '';
        if(two_dim_arr[0].length == 0){two_dim_arr.shift();theadsize--;}
        if(two_dim_arr[two_dim_arr.length-1].length == 0){two_dim_arr.pop();}
        console.log(two_dim_arr);
        output += _printTable( two_dim_arr, [theadsize, tbodysize, tfootsize], [captionabove, captionbelow] );

		
        return _HashBlock( output ) + "\n";
        
    }
    
    function _printTable( two_dim_arr, [theadsize, tbodysize, tfootsize], [captionabove, captionbelow], cols = false){
    
	    spitoutabove = captionabove;
        spitoutbelow = captionbelow;
		
		captionabove = String_trim(captionabove).replace(/^(Table)?[:]/, '');
		captionbelow = String_trim(captionbelow).replace(/^(Table)?[:]/, '');
		 
		captionabove = (captionabove=='' ? false : captionabove );
		captionbelow = (captionbelow=='' ? false : captionbelow );
        
        caption = (captionabove || captionbelow );
        
        console.log(captionabove);
        console.log(captionbelow);
    
    	var output = (captionabove ? '' : spitoutabove + '\n' ); //spit out the first table header if it doesnt contain anything
		
    	output += '<table>\n';
        output += ( caption ? '<caption>' + _RunSpanGamut( caption ) + '</caption>\n' : '');
		if(cols){
			// <col width="8%" />
			columns = 80;
			total = cols.sum();
			divisor = ( total > columns ? total : columns );
			var cols_length = cols.length;
			for (var x = 0; x < cols_length; x++) {
				var percent = Math.round( cols[x]*100/divisor );
				if(html5){
					//output += '<col class="col_'+x+' col_'+(x%2==0?'odd':'even')+'" style="width:'+ percent +'%" />\n';
					output += '<col style="width:'+ percent +'%" />\n';
				}
				else{
					//output += '<col class="col_'+x+' col_'+(x%2==0?'odd':'even')+'" width="'+ percent +'%" />\n';
					output += '<col width="'+ percent +'%" />\n';
				}
			}
		}
        theadbodyfootsize = two_dim_arr.length;
        for(var rownum=0; rownum < theadbodyfootsize; rownum++){
        	//output += '<'+(rownum<theadsize ? 'thead' : rownum<theadbodysize ?  'tbody': 'tfoot')+'>\n';
			output += (theadsize && rownum==0 ? '<thead>\n' : rownum==theadsize ? '<tbody>\n': rownum==theadsize+tbodysize ? '<tfoot>\n': '');
			if(typeof two_dim_arr[rownum] != 'undefined'){
				output += '<tr>\n';
				two_dim_arr_rownum_length = (two_dim_arr[rownum] || []).length;
				for(var colnum = 0; colnum < two_dim_arr_rownum_length; colnum++){
					var td = two_dim_arr[rownum][colnum];
					console.log(td);
					if( typeof td != 'undefined'){
						console.log(rownum, colnum, td.text);
						block = _RunBlockGamut( (td.text||'').replace(/[ ]*$/gm, '') );
						// if the block only consists of the first paragraph
						if( (block.match(/^<p>[\s\S]*?<\/p>/) || [''])[0].length == block.length){
							// strip away the <p>
							block = block.replace(/^<p>|<\/p>$/g, '');
						}
						//tc = (rownum<theadsize || td.th || rownum>=theadsize+tbodysize ? 'th' : 'td');
						tc = (td.th ? 'th' : 'td');
						var colspan = (td.colspan>1 ? ' colspan="'+td.colspan+'"': '');
						var rowspan = (td.rowspan>1 ? ' rowspan="'+td.rowspan+'"': '');
						var coord = (addcoordinates ? ' class="r'+td.rownum+' c'+td.colnum+' r'+(td.rownum % 2 == 0 ? 'o' : 'e')+' c'+(td.colnum % 2 == 0 ? 'o' : 'e')+(td.colname ? ' c_'+td.colname : '')+(td.rowname ? ' r_'+td.rowname : '')+'"' : '');
						td.v_align = (td.v_align=='justify' ? 'middle' : td.v_align);
						var style = '';
						if( td.h_align!='default' || td.v_align!='default' ){			
							if(html5){
								style = ' style="';
								style += (td.h_align!='default' ? 'text-align:'+td.h_align+';' : '');
								style += (td.v_align!='default' ? 'vertical-align:'+td.v_align+';' : '');
								style += '"';
							}
							else {
								style += (td.h_align!='default' ? ' align="'+td.h_align+'"' : '');
								style += (td.v_align!='default' ? ' valign="'+td.v_align+'"' : '');					
							}
						}
						output += '<'+tc+colspan+rowspan+coord+style+'>'+block+'</'+tc+'>\n';
					}
				}
				output += '</tr>\n';
			}
			
			console.log((rownum==theadsize-1 ? '</thead>\n' : rownum==theadsize+tbodysize-1 ? '</tbody>\n' : rownum==theadsize+tbodysize+tfootsize-1 ? '</tfoot>\n' : ''));
			output += (rownum==theadsize-1 ? '</thead>\n' : rownum==theadsize+tbodysize-1 ? '</tbody>\n' : rownum==theadsize+tbodysize+tfootsize-1 ? '</tfoot>\n' : '');
		
        }
        output += '</table>';
                output += ( captionbelow ? captionabove ? '\n' + spitoutbelow : '' : '\n' + spitoutbelow ); // spit out the superfluous second table caption
        console.log(output);
        return output;
    }
    
    var md_flag_DoSimpleTables = "d0dd78840fdffb4bf1f8d9e65a42d778";
    /*var md_reg_DoSimpleTables = new RegExp(
      '^'
    + '('
    + 	'[ ]{0,' + md_less_than_tab + '}'
    + 	'(?:Table[:]|[:])[\\S\\s]*?[^\\n]\\n'		// captionabove
    + 	'\\n'
    + ')?'
    + '([ ]{0,' + md_less_than_tab + '}'
    + 	'[-]+[ ]*\\n)?'								// ----------------
    + '((?:[^\\n]+\\n(?:\\n(?!\\n))?)*)'						// header  header  header
    + '([ ]*[-=]*[ ]+[-= ]*)\\n'					// ------- ------- -------
    + '((?:[^\\n]+\\n(?:\\n(?!\\n))?)+?)'						// content content content
    + '([-= ]*[-=][-= ]*\\n)?'							// ------ ------ ----
    + '('
    + 	'[ ]{0,' + md_less_than_tab + '}'
    + 	'\\n'
    + 	'(?:Table[:]|[:])[\\S\\s]*?[^\\n]\\n'		// captionbelow
    + ')?'
    + '(?=\\n|' + md_flag_DoTables + ')'			//Stop at final double newline.
    , "gm" );*/
    var md_reg_DoSimpleTables = new RegExp(
      '^'
    + '('
    + 	'[ ]{0,' + md_less_than_tab + '}'
    + 	'(?:Table[:]|[:])[\\S\\s]*?[^\\n]\\n'		// captionabove
    + 	'\\n'
    + ')?'
    + '([ ]{0,' + md_less_than_tab + '}'
    + 	'[-]+[ ]*\\n)?'								// ----------------
    + '((?:[^\\n]+\\n\\n?)*)'						// header  header  header
    + '([ ]*[-=]*[ ]+[-= ]*)\\n'					// ------- ------- -------
    + '((?:[^\\n]+\\n\\n?)+?)'						// content content content
    + '([-= ]*[-=][-= ]*\\n)?'						// ------ ------ ----

    + '('
    + 	'[ ]{0,' + md_less_than_tab + '}'
    + 	'\\n'
    + 	'(?:Table[:]|[:])[\\S\\s]*?[^\\n]\\n'		// captionbelow
    + ')?'
    + '(?=\\n|' + md_flag_DoTables + ')'			//Stop at final double newline.
    , "gm" );
	function _DoSimpleTables( text ) {
        
        text += md_flag_DoSimpleTables;
        var reg = md_reg_DoSimpleTables;
        
        text = text.replace( reg, function( $0, captionabove, lineabove, header, dashes, content, linebelow, captionbelow ) {
			console.clear();
			console.log('captionabove:', captionabove);
			console.log('   lineabove:', lineabove);
			console.log('      header:', header);
			console.log('      dashes:', dashes);
			console.log('     content:', content);
			console.log('   linebelow:', linebelow);
			console.log('captionbelow:', captionbelow);
			
			var position = 0;
			columns = dashes.split(/[ ](?=[-=])/);
			rows =   content.split( /^\n/m );
			headers = header.split( /^\n/m );
			
			if( header == '' && linebelow == '' ){
				return $0;
			}
			else if( lineabove == '' ){
				console.info('simple table');
				rows = content.split( /^/m );
				if(linebelow == ''){ rows.pop(); }
				headers = header.split( /^/m );
				
				var first_is_header = (header=='' ? 0 : headers.length);
				
				rows = [].concat(headers, rows);
				
				var two_dim_arr = [];
				var cols = [];
				var v_header = [];
				var wholerow_align = [];
				var ignore = [];
				for(var c = 0, len = columns.length; c < len; c ++){
					console.group(c, len, c+1==len);
					srt = position;
					end = (c+1==len ? undefined : position += columns[c].length+1);
					cols.push(columns[c].replace(/\s/g, '').length);
					console.log(srt, columns[c], end, columns[c].match(/[=]/));
					if(columns[c].match(/[=]/)){
						v_header[c] = true;
					}
					
					var height = rows.length;
					var killer = [0,0];
					for(var r = 0;  r < height; r++){
						two_dim_arr[r] = two_dim_arr[r] || [];
						ignore[r] = ignore[r] || -1;
						console.group('r=', r, '; c=', c, '; ignore[',r,']=', ignore[r]);
						
						var cell = '';
						var whiteborder = '';
						multirows = rows[r].split(/^/m);
						for(var m = 0, m_height = multirows.length; m < m_height; m++){
							cell += multirows[m].substring(srt, end) + '\n';
							whiteborder += multirows[m].substring(srt-1, srt);
						}
						console.log(c+1, r+1);
						console.log(cell);
						
						if(killer[1] > 0){
							console.error('killer', killer);
							for(var i = killer[0]; i > 0; i-- ){
								delete two_dim_arr[r][c-i];
							}
							killer[1]--;
						}
						else{
							arrow = cell.match(/^\s*(\<{1,2}|\^{1,2})\s*$/);
							automatic_colspan = whiteborder.match(/\S/);
							//(arrow)
							var rowpointer = r;
							var colpointer = c;
							if(automatic_colspan || ( arrow && (arrow[1] == "<" || arrow[1] == "<<") && c > 0 ) ){
								console.warn('<< or <');
								while( (typeof two_dim_arr[r][colpointer] == "undefined" || ( !automatic_colspan && arrow[1]=="<<" && String_trim(two_dim_arr[r][colpointer].text)=='' ) ) && colpointer > 0){
									delete two_dim_arr[r][colpointer];
									console.warn(r, colpointer, ' cell deleted');
									colpointer--;
								}
								if(automatic_colspan){
									console.warn('automatic_colspan');
									//console.log(cell.split(/^/m), two_dim_arr[r][colpointer].raw.substr(0,two_dim_arr[r][colpointer].raw.length-1).split(/\n/g));
									addto = two_dim_arr[r][colpointer].raw.substr(0,two_dim_arr[r][colpointer].raw.length-1).split(/\n/g);
									add = cell.split(/^/m);
									var resultcell = '';
									for(var m = 0, m_height = add.length; m < m_height; m++){
										resultcell += (addto[m]||'') + (add[m]||'\n');
									}
									two_dim_arr[r][colpointer].raw = resultcell;
									two_dim_arr[r][colpointer].text = resultcell;
								}
								console.info(c-colpointer);
								killer[0] = two_dim_arr[r][colpointer].colspan = c-colpointer+1;
								killer[1] = two_dim_arr[r][colpointer].rowspan-1;
							}
							else if(arrow && (arrow[1] == "^" || arrow[1] == "^^") && r > 0){
								console.warn('^^ or ^');
								while( (typeof two_dim_arr[rowpointer][c] == "undefined" || ( arrow[1]=="^^" && String_trim(two_dim_arr[rowpointer][c].text)=='' ) ) && rowpointer > 0){
									delete two_dim_arr[rowpointer][c];
									console.warn(r, colpointer, ' cell deleted');
									rowpointer--;
								}
								console.info(r-rowpointer);
								if(typeof two_dim_arr[rowpointer][c] != "undefined" ){
									two_dim_arr[rowpointer][c].rowspan = r-rowpointer+1;
								}
							}
							else{
								two_dim_arr[r][c] = {raw:cell, text:cell, h_align:'left', v_align:'default', colnum:c+1, rownum:r+1};
							}
							if( typeof two_dim_arr[r][c] !="undefined" && (v_header[c]==true || r < first_is_header)){
								two_dim_arr[r][c].th = true;
							}
							if( r == 0 || r < first_is_header ){
								var left_white = ( two_dim_arr[r][colpointer].text.match(/^(\s*)/)[1] != '' );
								var right_white = two_dim_arr[r][colpointer].text.replace(/\s*$/, '').length < columns.slice().splice(colpointer, c-colpointer+1).join(' ').replace(/\s*$/, '').length;
								console.error(left_white, right_white);
								wholerow_align[colpointer] = (two_dim_arr[r][colpointer].text.match(/\S/) ? (left_white && right_white ? 'center' :  ( right_white ? 'left' : ( left_white ? 'right' : 'default' ) ) ) : 'left' );
							}
							if( typeof wholerow_align[colpointer] != 'undefined' && typeof two_dim_arr[r][colpointer] != 'undefined' ){
								two_dim_arr[r][colpointer].h_align = wholerow_align[colpointer];
							}
	
							ignore[r] = -1;
						}
						console.groupEnd();
	
					}
					console.groupEnd();
				}
				// Pandoc doesn't pay attention to width in simple tables
				cols = [];
			}
			else{
				console.warn('multiline table');
				
				rows = content.replace(/\n$/, '').split( /\n/m );
				headers = header.replace(/\n$/, '').split( /\n/m );
				var headers_length = headers.length;
				console.log('headers_length:', headers_length);
				
				rows = [].concat(headers, '', rows);
				console.log(rows);				
				var two_dim_arr = [];
				var delete_array = [];
				var cols = [];
				var v_header = [];				
				var height = rows.length;
				console.groupCollapsed('fetching raw table cells');
				for(var r = 0;  r < height; r++){
					console.group('r:', r);
					var position = 0;
					var row_empty = true;
					two_dim_arr[r] = [];

					if(r == 0 ||r == headers_length ){
						console.warn('first row in body or header');
					}
					
					for(var c = 0, len = columns.length; c < len; c ++){
						console.group('c:', c);
						srt = position;
						end = (c+1==len ? undefined : position += columns[c].length+1);
						cell = rows[r].substring(srt, end);
						while (cell.length < end-srt) {
							cell += ' ';
						}
						
						if(r == 0 && columns[c].match(/[=]/)){
							v_header[c] = true;
						}
						if(r == 0){
							cols[c] = columns[c].replace(/\s/g, '').length;
						}
						
						console.info(cell);
						two_dim_arr[r][c] = {text:cell};
						//whiteborder = rows[r].substring(srt-1, srt);
						console.groupEnd();
					}
					
					console.groupEnd();
				}
				console.groupEnd();
				
				console.group('merging spaning cells');
				var height = two_dim_arr.length;
				var rownum = 0;
				var rowspan_array = [];
				for(var r = 0;  r < height; r++){
					console.group(r, r <= headers_length);
					rownum++;
					var width = two_dim_arr[r].length;
					var colnum = 0;
					var anycell = false;
					
					
					if(rows[r].match(/^\s*$/)){
						console.warn('this line is empty; deleting ...');
						two_dim_arr[r] = undefined;
						console.groupEnd();
					}
					else{
						for(var c = 0; c < width; c ++){
							if(typeof two_dim_arr[r][c] == 'object' && typeof two_dim_arr[r][c].text == 'string' && two_dim_arr[r][c].text.match(/\S/)){
								anycell = true;
								colnum++;
								two_dim_arr[r][c].colnum = colnum;
								two_dim_arr[r][c].rownum = rownum;
								two_dim_arr[r][c].h_align = 'default';
								two_dim_arr[r][c].v_align = 'default';
								console.group(c);
								var rowspan = 1;
								var colspan = 1;
								var leftspan = 0;
								var upspan = 0;
								var limit = 20;
								var counter = 0;
								var end = false;
								rowspan_array[c] = 0;
								while(!end){
									console.info(two_dim_arr[r-upspan][c-leftspan].text);
									counter++;
										
									var rightborder = (two_dim_arr[r-upspan][c-leftspan].text ? two_dim_arr[r-upspan][c-leftspan].text.replace(/.(?!$)/gm, '') : '');
									console.log(rightborder);
									if(c+colspan < len && rightborder.match(/\S/)){
										colspan++;
										colnum++;
										two_dim_arr[r-upspan][c-leftspan].colspan = colspan;
										console.warn('merging cells horizontally', two_dim_arr[r-upspan][c-leftspan].colspan);
										var addto = two_dim_arr[r-upspan][c-leftspan].text.split(/\n/g);
										console.log('addto:', addto);
										var addto_length = addto.length;
										two_dim_arr[r-upspan][c-leftspan].text = '';
										for(var a = 0; a < rowspan; a++){
											console.log(r-upspan, a, c-leftspan, colspan, two_dim_arr[r-upspan+a][c-leftspan+colspan-1]);
											two_dim_arr[r-upspan][c-leftspan].text += (a!=0 ? '\n' : '') + (addto[a] || '') + (two_dim_arr[r-upspan+a][c-leftspan+colspan-1] ? two_dim_arr[r-upspan+a][c-leftspan+colspan-1].text : '');
											two_dim_arr[r-upspan+a][c-leftspan+colspan-1] = undefined;
										}
									}
									else {

										console.log(r-upspan, rowspan, c-leftspan);
										var belowborder = '';
										
										if(two_dim_arr[r-upspan+rowspan]){
											for(var w = 0; w < colspan; w++){
												belowborder += (two_dim_arr[r-upspan+rowspan][c-leftspan+w] ? two_dim_arr[r-upspan+rowspan][c-leftspan+w].text : '');
											}
											console.log('belowborder:', belowborder);
											console.log(belowborder.match(/\S/));
										}
										if(belowborder.match(/\S/)){
											for(var w = 0; w < colspan; w++){
												two_dim_arr[r-upspan+rowspan][c-leftspan+w] = undefined;
											}	
											rowspan++;
											rowspan_array[c] = r;
											two_dim_arr[r-upspan][c-leftspan].height = rowspan;
											two_dim_arr[r-upspan][c-leftspan].text += '\n' + belowborder;
										
										}									
										else{
											var leftborder = '';
											var add = [];
											for(var a = 0; a < rowspan; a++){
												add.push(two_dim_arr[r-upspan+a][c-leftspan-1] ? two_dim_arr[r-upspan+a][c-leftspan-1].text : '');
											}
											leftborder = add.join('').replace(/.(?!$)/gm, '');
											console.log('leftborder:', leftborder);
																			
											if( c-leftspan > 0 && leftborder.match(/\S/) ){
												console.error(two_dim_arr[r-upspan][c-leftspan]);
												var addto = two_dim_arr[r-upspan][c-leftspan].text.split(/\n/g);
												two_dim_arr[r-upspan][c-leftspan] = undefined;
												leftspan++;
												colspan++;
												two_dim_arr[r-upspan][c-leftspan] = {text:'', v_align:'default', h_align:'default', rownum:rownum, colnum:colnum, rowspan:rowspan, colspan:colspan};
												console.log('addto:', addto);
												for(var a = 0; a < rowspan; a++){
													two_dim_arr[r-upspan][c-leftspan].text += (a!=0 ? '\n' : '') + (add[a] || '') + (addto[a] || '');
													if(a!=0){console.error(two_dim_arr[r-upspan+a][c-leftspan].text);two_dim_arr[r-upspan+a][c-leftspan] = undefined;}
												}
											}
											else {
												var upborder = '';
												if(r-upspan-1 > 0 && two_dim_arr[r-upspan-1]){
													console.log(r-upspan, rowspan, c-leftspan);
													for(var w = 0; w < colspan; w++){
														upborder += (two_dim_arr[r-upspan-1][c-leftspan+w] ? two_dim_arr[r-upspan-1][c-leftspan+w].text : '');
													}
													console.log('upborder:', upborder);
													console.log(upborder.match(/\S/));
												}
												if(upborder.match(/\S/)){
													for(var w = 0; w < colspan; w++){
														if(w!=0){two_dim_arr[r-upspan-1][c-leftspan+w] = undefined;}
													}
													upspan++;	
													rowspan++;
													two_dim_arr[r-upspan][c-leftspan] = two_dim_arr[r-upspan+1][c-leftspan];
													//two_dim_arr[r-upspan][c-leftspan].rowspan = rowspan;
													two_dim_arr[r-upspan][c-leftspan].rownum--;
													two_dim_arr[r-upspan][c-leftspan].text = upborder + '\n' + two_dim_arr[r-upspan][c-leftspan].text;
													two_dim_arr[r-upspan+1][c-leftspan] = undefined;
												}
												else{
													two_dim_arr[r-upspan][c-leftspan].text += '\n';
													end = true;
												}
											}							
										}
									}
									
									if(counter>limit){
										console.error('get me out of that while loop! I don´t want to overflow.');
										end = true;
									}
								}
								
								if(r <= headers_length || v_header[c-leftspan]){
									two_dim_arr[r-upspan][c-leftspan].th = true;
								}
								console.groupEnd();
								console.log({arr:two_dim_arr});
							}
							else if(two_dim_arr[r][c] != undefined){
								console.group(c);
								two_dim_arr[r][c] = {text:'', h_align:'default', v_align:'default', colnum:colnum, rownum:rownum};
								if(r <= headers_length || v_header[c-leftspan]){
									two_dim_arr[r][c].th = true;
								}
								console.log('empty');
								console.groupEnd();							
							}
							else{
								two_dim_arr[r][c] = undefined;
							}
							
						}
						
						console.groupEnd();
						
						console.group('check if any cell, add rowspans');
						if(anycell){
							console.log(two_dim_arr[r], rowspan_array);
							var anycell = false;
							var two_dim_arr_r_length = two_dim_arr[r].length;
							for (i=0; i<two_dim_arr_r_length; i++) {
/*								if(typeof two_dim_arr[r][i] != 'undefined' && typeof two_dim_arr[r][i][0] == 'number' && typeof two_dim_arr[r][i][1] == 'number'){
									console.log('rowspan coordinates:', two_dim_arr[r][i][0], two_dim_arr[r][i][1]);
									addrowspan.push();
									two_dim_arr[two_dim_arr[r][i][0]][two_dim_arr[r][i][1]].rowspan = two_dim_arr[two_dim_arr[r][i][0]][two_dim_arr[r][i][1]].rowspan+1 || 2;
									two_dim_arr[r][i] = undefined;
								}
								else*/
								//console.log(r, rowspan_array[i], r-rowspan_array[i], two_dim_arr[r][i]);
								if(rowspan_array[i] && rowspan_array[i]>0 && typeof two_dim_arr[r][i] == 'undefined' && typeof two_dim_arr[rowspan_array[i]][i] != 'undefined' && rowspan_array[i]+two_dim_arr[rowspan_array[i]][i].height >= r){
									two_dim_arr[rowspan_array[i]][i].rowspan = two_dim_arr[rowspan_array[i]][i].rowspan+1 || 2;
									console.log(two_dim_arr[rowspan_array[i]][i].rowspan, rowspan_array);
								}
								if(typeof two_dim_arr[r][i] != 'undefined' && two_dim_arr[r][i].text != ''){
									anycell = true;
									console.log('real cell found');
									//break;
								}
							}
							
						}
						if(!anycell){rownum--;two_dim_arr[r] = undefined;}
						console.groupEnd();
					}
				}
				console.groupEnd();
			}

			console.log(two_dim_arr, [headers_length, height-headers_length, 0], [captionabove, captionbelow], cols);
			return _printTable( two_dim_arr, [headers_length, height-headers_length, 0], [captionabove, captionbelow], cols);
			
        } );
        
        text = text.replace( md_flag_DoSimpleTables, "" );
        
        return text;
    }
     
    var md_flag_DoGrids = "3ee63c2476f49cd6c03c72e14687b4f7";
    var md_reg_DoGrids1 = new RegExp(
    (pan_xtables ?
      '^'
    + '(?:'
    + 	'[ ]{0,' + md_less_than_tab + '}'
    + 	'(?:[Tt]able[:]|[Tt]abelle[:]|[:])([\\S\\s]*?[^\\n])\\n' // Multilingual, ignore case // for exactly one blank line before the table use ([\\S\\s]*?[^\\n])
    + 	'\\n'
    + ')?'
    + '('
    + 	'([ ]{0,' + md_less_than_tab + '})'
    + 		'[+](?:[-=:; ]+[+])+[ ]*\\n'			// +---------+---------+
    + 	'\\3'
    + 		'(?:(?:[^\\n]+)[ ]*\\n)+'				// | content | content | 
    + 	'\\3'
    + 		'[+](?:[-=:; ]+[+])+[ ]*\\n'			// +---------+---------+
    + ')'
    + '('
    + 	'\\n'										// exactly one blank line after the tables
    + 	'(?:[Tt]able[:]|[Tt]abelle[:]|[:])([\\S\\s]*?)\\n' // Multilingual
    + ')?'
    + '(?=\\n|' + md_flag_DoGrids + ')'//Stop at final double newline.
    :
      // original pandoc tables:
      '^'
    + '(?:'
    + 	'[ ]{0,' + md_less_than_tab + '}'
    + 	'(?:Table[:]|[:])([\\S\\s]*?)\\n'
    + 	'\\n'
    + ')?'
    + '(()'
    + 		'[+](?:[-]+[+])+[ ]*\\n(?!\\n)'		// +---------+---------+
    + 		'(?:'
    +           '(?:[|][^\\n]+[ ]*\\n)+'		// | header | header  | 
    + 			'[+](?:[=]+[+])+[ ]*\\n'   		// +=========+=========+
    +		')?'
    + 		'(?:'
    +           '(?:[|][^\\n]+[ ]*\\n)+'		// | content | content  | 
    + 			'[+](?:[-]+[+])+[ ]*\\n'  	 	// +---------+---------+
    +		')*'  	
    + ')'
    + '('
    + 	'\\n+'
    + 	'(?:Table[:]|[:])([\\S\\s]*?)\\n'
    + ')?'
    + '(?=\\n|' + md_flag_DoGrids + ')'//Stop at final double newline.

    )
    , "gm");

    function _DoGrids( text ) {
        text += md_flag_DoGrids;
        var reg = md_reg_DoGrids1;
        
        text = text.replace( reg, function( $0,  $1, $2, indent, $3, $4 ) {
        	console.log( $0, 'h1', $1, 'table',$2, 'indent', indent, 'h2',$3,  $4 );
            //$0 = $0.replace( /^[ ]*/gm, '' );
            return _DoGrid_callback( $0, $1, $2,indent, $3, $4 );
        } );
        
        text = text.replace( md_flag_DoGrids, "" );
        return text;
    }
    
	function _DoGrid_callback( $0, captionabove, table, indent,spitoutbelow, captionbelow ) {
		
    	if(pan_xtables){
			
			endoflinebug = false;
			//console.clear();
			if(debug){console.log(new Date());}
			default_h_align = 'left';
			default_v_align = 'default';
			markdown = false;
			arr = table.split('\n');
			longest = 0;
			arr[arr.length] = ''; // this is for lookahead, see d = arr[y2+1].charAt(x2);
			table = [];
			rows = [];
			var h_align_all = [];
			var v_align_all = [];
			var indices = [];
			for (i = 0; i < arr.length; i++) {
				arr[i] = arr[i].substr(indent.length);
				while (arr[i].length < longest) {
					arr[i] += ' ';
				}
				longest = arr[i].length;
				r = 0;
				x2 = -1;
				
				if(debug){console.warn(i);}
				while (arr[i].indexOf('+', r) >= 0) {
					ind = arr[i].indexOf('+', r);
	
					if (i > 1) {
						if(debug){console.log(indices.join(''));}
						x1 = ind * 1 || 0;
						x2 = indices.regexIndexOf(/\d/, ind + 1) * 1 || 0;
						y1 = indices[ind] * 1 || 0;
						y2 = i * 1 || 0;
	
						if (x2 < 0) {
							if(debug){console.warn('end of columns');}
							rows[rows.length] = i;
							break;
						} else {
							if(debug){console.info([x1, y1], [x2, y2]);}
						}
	
						//  a    | 
						// bzc  -+-
						//  d    |
	
						a = arr[y2 - 1].charAt(x2);
						b = arr[y2].charAt(x2 - 1);
						c = arr[y2].charAt(x2 + 1);
						d = arr[y2 + 1].charAt(x2);
						z = arr[y2].charAt(x2);
						
						border = {};
						border['top'] = arr[y1].substring(x1 + 1, x2);
						border['bottom'] = arr[y2].substring(x1 + 1, x2);
						//console.log('{'+border['bottom']+'}',  !border['bottom'].match(/^[-+=:; ]+$/) );
					
						border['left'] = border['right'] = '';
						for (y = y1 + 1; y < y2; y++) {
							text += arr[y].substring(x1 + 1, x2) + '\n';
							border['left'] += arr[y].substr(x1, 1);
							border['right'] += arr[y].substr(x2, 1);
						}
						
						colspan = 1;
						
						// horizontal traverse
						while (z.match(/[ -]/) || (
						//  a    _ 
						// bzc  -+-
						//  d    # 
						a == ' '
						&& b.match(/[-=:;]/) && c.match(/[-=:;]/)
						&& d.match(/[|=:; ]|$/)
						)
						|| !border['right'].match(/^[|+=:; ]+$/) // see "J" in the example
						) {
							if (a == ' ' && b.match(/[-=:;]/) && c.match(/[-=:;]/) && d.match(/[|=:; ]|$/)
							|| !border['right'].match(/^[|+=:; ]+$/)
							) {
								indices[x2] = i;
								console.warn(a + '\n' + b + z + c + '\n' + d);
							}
							colspan++;
							
							x2 = indices.regexIndexOf(/\d/, x2 + 1) * 1;
							
							if (x2 < 0 || arr[y2].charAt(x2 + 1) == '') {
								if(debug){console.error('end of columns in hor traverse!');}
								rows[rows.length] = i;
								endoflinebug = true;
								break;
							}
												
							a = arr[y2 - 1].charAt(x2);
							b = arr[y2].charAt(x2 - 1);
							c = arr[y2].charAt(x2 + 1);
							d = arr[y2 + 1].charAt(x2);
							z = arr[y2].charAt(x2);
							
							border['top'] = arr[y1].substring(x1 + 1, x2);
							border['bottom'] = arr[y2].substring(x1 + 1, x2);
							//console.log('{'+border['bottom']+'}',  !border['bottom'].match(/^[-+=:; ]+$/) );
						
							border['left'] = border['right'] = '';
							for (y = y1 + 1; y < y2; y++) {
								text += arr[y].substring(x1 + 1, x2) + '\n';
								border['left'] += arr[y].substr(x1, 1);
								border['right'] += arr[y].substr(x2, 1);
							}
							
							if(z.match(/[ -]/)){
								console.log('z: ', z);
							}
							
							if(debug){console.log([x1, y1], [x2, y2], colspan);}
							
							
						}
	
	
						// Use this syntax to combine A and E with rowspan:
						// "#" is a placeholder for either one of the characters [-=: X] (including space(" ") and edges ("X")).
						// "_" is a placeholder for a space (" ").
						// The first table is standard grid style. The second table is "lazy" grid style.
						// If any character other than one of the characters [-=:; X] (as above) gets
						// anywhere in the way of the supposed line (In this case "J"), A and E get automatically
						// combined (see examples three and four).
						//
						// +---+---+---+  |  +   +   +   +  |  +---+---+---+  |  +   +   +   +
						// | A | B | C |  |    A   B | C    |  | A | B | C |  |    A   B   C  
						// +---+  _+#--+  |  +   +  _+#  +  |  +---+ J +---+  |  +   + J +   +
						// | D | E | F |  |    D   E | F    |  | D | E | F |  |    D   E   F  
						// +---+---+---+  |  +   +   +   +  |  +---+---+---+  |  +   +   +   +
						// | G | H | I |  |    G   H   I    |  | G | H | I |  |    G   H   I  
						// +---+---+---+  |  +   +   +   +  |  +---+---+---+  |  +   +   +   +
						//
						// The same applies for combining the cells D and E horizontally, with rowspan:
						// Of course "#" now stands for [|=:; X], with "|" instead of "-". 
						//
						// +---+---+---+  |  +   +   +   +  |  +---+---+---+  |  +   +   +   +
						// | A | B | C |  |    A   B | C    |  | A | B | C |  |    A   B   C  
						// +---+---+---+  |  +   +   +   +  |  +---+---+---+  |  +   +   +   +
						// | D _ E | F |  |    D _ E | F    |  | D J E | F |  |    D J E   F  
						// +---+---+---+  |  +  -+-  +   +  |  +---+---+---+  |  +   +   +   +
						// | G # H | I |  |    G # H   I    |  | G | H | I |  |    G   H   I  
						// +---+---+---+  |  +   +   +   +  |  +---+---+---+  |  +   +   +   +
						//
	
						
	
						if (
						z == '+'
						&& a.match(/[ |=:;+]/)
						&& b.match(/[ -=:;+]/)
						&& !(
							//  a    | 
							// b+c  _+#
							//  d    | 
							a.match(/[|=:;]/)
							&& b == ' ' && c.match(/[-=:; ]|$/)
							&& d.match(/[|=:;]/)
						)
						&&
						border['bottom'].match(/^[-+=:; ]+$/) // see "J" in the example
						|| endoflinebug
						) {
							text = '';
	
							// text-align
							// ==========
							// The borders of the gridtable must consist of the
							// following characters: `-` for horizontal lines, `|` (for
							// vertical lines), `=` (for headers), `:` (for sticky alignment),
							// `;` (for single alignment) or space (for automatic lines).
							// 
							// horizontal alignment
							// --------------------
							// `;----` will align the cell below it *left*.
							// `----;` will align the cell below it *right*.
							// `;---;` will align the cell below it *justified*.
							// `--;--` will align the cell below it *centered*; the ';'
							// can be anywhere in the middle.
							// (`;--"."--`, `--"."--;`, `;--"."--;`, `--;"."--` or
							//  `.;----`, `-----;.`, `.;----;.`, `--;.;--` are planned
							// to align the cell below it *to the char* between the `"`s.)
							//
							// If you use `:` instead of `;`, all of the following cells in
							// the same *column* will be aligned until another single cell
							// alignment stops it again.
							// 
							// vertical alignment
							// --------------------
							// `;||||` will align the cell below it *left*.
							// `||||;` will align the cell below it *right*.
							// `;|||;` will align the cell below it *justified*.
							// `||;||` will align the cell below it *centered*; the ';'
							// can be anywhere in the middle.
							//
							// If you use `:` instead of `;`, all of the following cells in
							// the same *row* will be aligned until another single cell
							// alignment stops it again.
							//
	
							border['left'] = border['right'] = '';
							for (y = y1 + 1; y < y2; y++) {
								text += arr[y].substring(x1 + 1, x2) + '\n';
								border['left'] += arr[y].substr(x1, 1);
								border['right'] += arr[y].substr(x2, 1);
							}
							//console.log(text);
							//console.log(border);
							l = border['top'].charAt(0);
							r = border['top'].charAt(border['top'].length - 1);
							t = border['left'].charAt(0);
							b = border['left'].charAt(border['left'].length - 1);
	
							h_align_srt = (l == ':' && r == ':' ? 'justify' : l == ':' ? 'left' : r == ':' ? 'right' : border['top'].match(/^[-=+ ]+[:]+[-=+ ]+$/) ? 'center' : 'default');
							h_align_end = (l == ';' && r == ';' ? 'justify' : l == ';' ? 'left' : r == ';' ? 'right' : border['top'].match(/^[-=+ ]+[;]+[-=+ ]+$/) ? 'center' : 'default');
	
	
							if (h_align_srt != 'default') {
								h_align = h_align_srt;
								h_align_all[ind] = h_align_srt;
							} else if (h_align_end != 'default') {
								h_align = h_align_end;
								h_align_all[ind] = 'default';
							} else {
								h_align = h_align_all[ind] || 'default';
							}
							
							if(h_align == 'default' && default_h_align){
								h_align = default_h_align;
							}
	
							v_align_srt = (t == ':' && b == ':' ? 'middle' : t == ':' ? 'top' : b == ':' ? 'bottom' : border['left'].match(/^[|=+ ]+[:]+[|=+ ]+$/) ? 'middle' : 'default');
							v_align_end = (t == ';' && b == ';' ? 'middle' : t == ';' ? 'top' : b == ';' ? 'bottom' : border['left'].match(/^[|=+ ]+[;]+[|=+ ]+$/) ? 'middle' : 'default');
	
							if (v_align_srt != 'default') {
								v_align = v_align_srt;
								v_align_all[i] = v_align_srt;
							} else if (v_align_end != 'default') {
								v_align = v_align_end;
								v_align_all[i] = 'default';
							} else {
								v_align = v_align_all[i] || 'default';
							}
							
							if(v_align == 'default' && default_v_align){
								v_align = default_v_align;
							}
	
							header = border['bottom'].indexOf('=') > -1 || border['right'].indexOf('=') > -1;
							
							//console.log(rows, rows.length-rows.indexOf(y1));
							rowspan = rows.length - rows.indexOf(y1);
	
							html = (header ? '<th' : '<td');
							html += (markdown == "1" ? ' markdown="1"' : '');
							if (html5) {
								if (h_align != 'default' | v_align != 'default') {
									html += ' style="'
									html += (h_align == 'default' ? '' : 'text-align:' + h_align + ';');
									html += (v_align == 'default' ? '' : 'vertical-align:' + v_align + ';');
									html += '"';
								}
							} else {
								html += (h_align == 'default' ? '' : ' align="' + h_align + '"');
								html += (v_align == 'default' ? '' : ' valign="' + v_align + '"');
							}
							html += (colspan > 1 ? ' colspan="' + colspan + '"' : '');
							html += (rowspan > 1 ? ' rowspan="' + rowspan + '"' : '');
							html += '>';
							text = text.replace(/[ ]*$/gm, ''); // otherwise "  " would trigger <br/>
							block = _RunBlockGamut( text );
							// if the block only consists of the first paragraph
							if( (block.match(/^<p>[\s\S]*?<\/p>/) || [''])[0].length == block.length){
								// strip away the <p>
								block = block.replace(/^<p>|<\/p>$/g, '');
							}
							html += block;
							html += (header ? '</th>' : '</td>');
							if(debug){console.log(html);}
	
							table[y1] = table[y1] || [];
							table[y1][x1] = html;
							
							while (indices.length < ind) {
								indices.push('_');
							}
							indices[ind] = i;
							//indices_change = true;
						} else if(debug){
							console.error('');
							if (!border['bottom'].match(/^[-+=:; ]+$/)) {
								blanks = '';
								while (blanks.length < border['bottom'].length) {
									blanks += ' ';
								}
								console.log(blanks + a + ' \n' + border['bottom'] + z + c + '\n' + blanks + d + ' ');
							} else {
								console.log(' ' + a + ' \n' + b + z + c + '\n ' + d + ' ');
							}
						}
					}
	
					if (/*i > 1 || */typeof indices[ind] == 'undefined') {
						if(debug){console.log('initializing');}
						while (indices.length < ind) {
							indices.push('_');
						}
						indices[ind] = i;
						//indices_change = true;
						if(debug){console.log(indices);}
					}
	
					r = (x2 < 0 ? ind + 1 : x2);
					if(debug){console.log('ind:' + ind, 'x2:' + (x2 < 0 ? ind + 1 : x2));}
				}
			}
	
			output = '<table>\n';
			output += ( (captionabove || captionbelow) ? '<caption>' + _RunSpanGamut(captionabove || captionbelow) + '</caption>\n' : '');
			
			rownum = 0;
			colnum = 0;
			thead = 1;
			// <col width="8%" />
			columns = 80;
			prevind = 0;
			total = indices.length;
			divisor = ( total > columns ? total : columns );
			for (x = 0; x < total; x++) {
				if (indices[x] != '_' && x > 0) {
					output += '<col width="'+ Math.round( (x-prevind)*100/divisor ) +'%" />\n';
					
					prevind = x;
				}
			}
			for (y = 0; y < table.length; y++) {
				if (typeof table[y] != 'undefined') {
					row = '';
	
					
					for (x = 0; x < table[y].length; x++) {
						if (typeof table[y][x] != 'undefined') {
							row += table[y][x] + '\n';
							if (thead == 1 && table[y][x].substr(0, 3) != '<th') {
								thead = 4;
							} else if (thead == 2 && table[y][x].substr(0, 3) != '<th') {
								thead = 3;
							}
							colnum++;
						}
					}
					rownum++;
					
					if(thead>=3){
						row = '<tr class="' + (rownum % 2 == 0 ? 'odd' : 'even') + '">\n' + row;
					}
					else{
						row = '<tr>\n' + row;
					}
					
					
					if (thead == 1) {
						row = '<thead>\n' + row;
						thead = 2;
					} else if (thead == 3) {
						row = '</thead>\n<tbody>\n' + row;
						thead = 5;
						rownum = 0; // reset the rownumbering for the tbody
					} else if (thead == 4) {
						row = '<tbody>\n' + row;
						thead = 5;
					}
					row += '</tr>\n';
					output += row;
				}
			}
			
			if (thead==2){
				output += '</thead>\n<tbody>\n</tbody>\n';
			} else if(thead==5){
				output += '</tbody>\n';
			}
			output += '</table>';
			output += (captionabove ? '\n' + spitoutbelow : ''); // spit out the superfluous second table caption
			console.log(output);
			
			return _HashBlock( output ) + "\n";
		}
		else {
			var two_dim_arr = [];
			var arr = table.split(/[+](?:[-=]+[+])+[ ]*\n/);
			var first_row = table.substring(1,table.indexOf('\n')-1).split('+');
			var first_row_length = first_row.length;
			var first_is_header = table.match(/\n[+]([-=])/)[1] == '=' ? 1 : 0;
			console.log(first_is_header);
			arr.shift();
			arr.pop();
			var cols = [];
			console.log(arr.length);
			var arr_length = arr.length;
			for(var row = 0; row<arr_length;row++){
				two_dim_arr[row] = [];
				var lines = arr[row].split(/^/m);
				var lines_length = lines.length;
				console.log(lines);
				var position = 1;
				var last = first_row.length-1;
				for(var slice = 0; slice < first_row_length; slice++){
					if(cols.length<=slice){cols[slice] = first_row[slice].length+1;}
					var srt = position;
					var end = (slice==last ? undefined : position += first_row[slice].length+1);
					var cell = '';
					
					for(var num = 0; num < lines_length; num++){
						console.log(num, lines[num]);
						cell += lines[num].substring(srt, end).replace(/[|]?[ \n]*$/, '')+'\n';
					}
					console.info('',row, slice)
					console.log(cell);
					two_dim_arr[row][slice] = {text:cell, h_align:'left', v_align:'default'};
				}
			}
			console.log(two_dim_arr, [first_is_header, arr.length-first_is_header, 0], [captionabove, captionbelow], cols);
			return _printTable( two_dim_arr, [first_is_header, arr.length-first_is_header, 0], [captionabove, captionbelow], cols);
		}
	}   
     
    
    var md_flag_DoLists_z = "8ac2ec5b90470262b84a9786e56ff2bf";

function linum2int(inp) {
	var inp = inp.replace(/\W/, '');
	var out = 0;
	for (var i = 0; i < inp.length; i++) {
		out = out * 26 + parseInt(inp.substr(i, 1), 26 + 10) - 9;
	}
	console.log(inp, 'linum', out);
	return out;
}

function int2linum(input) { //jakob
	// There's a quicker function that does the same on stackoverflow, but i wrote this one myself and im not sure about the license of the other one
	// http://stackoverflow.com/questions/8603480/how-to-create-a-function-that-converts-a-number-to-a-bijective-hexavigesimal/11506042#11506042
	var zeros = 0;
	var next = input;
	var generation = 0;
	while (next >= 27) {
		next = (next - 1) / 26 - (next - 1) % 26 / 26;
		zeros += next * Math.pow(27, generation);
		generation++;
	}
	return (input + zeros).toString(27).replace(/./g, function ($0) {
		return '_abcdefghijklmnopqrstuvwxyz'.charAt(parseInt($0, 27));
	});
}

function roman2int(input) {

	romans = {
		'm': 1000,
		'd': 500,
		'c': 100,
		'l': 50,
		'x': 10,
		'v': 5,
		'i': 1
	};
	input = input.replace(/[^A-z]/, '').toLowerCase();
	output = 0;
	highest = false;
	for (i = input.length - 1; i >= 0; i--) {
		num = romans[input.substr(i, 1)] || 0;
		highest = (num > highest ? num : highest);
		output = (num < highest ? (output - num) : (output + num));
	}
	return output;
}

function int2roman(number) {
	// http://www.blackwasp.co.uk/NumberToRoman_2.aspx
	result = "";
	values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
	numerals = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i"];

	for (i = 0; i < 13; i++) {
		while (number >= values[i]) {
			number -= values[i];
			result += numerals[i];
		}
	}
	return result;
}

    function _DoLists( text ) {
        var md_marker_ul = '[*+-]';
        var md_marker_ol =
        (pandoc ?
        	(strict ? '#[.]|\\d+[.]|[(]?\\d+[)]|[(]?\\d+[.][)]|'
				+ '[(]?[A-z][)]|[(]?[A-z][.][)]|[A-Z][.][ ]|[a-z][.]|'
				+ '[(]?[IVXLCDMivxlcdm]+[)]|[(]?[IVXLCDMivxlcdm]+[.][)]|[IVXLCDM]+[.][ ]|[ivxlcdm]+[.]'
        	: '#[.]|\\d+[.]|[(]?\\d+[)]|[(]?\\d+[.][)]|'
				+ '[(]?[A-z]+[)][ ]*|[(]?[A-z]+[.:][)][ ]*|[A-Z]{1,2}[.:][ ][ ]*|[a-z]{1,2}[.:][ ]*|'
				+ '[(]?[IVXLCDMivxlcdm]+[)][ ]*|[(]?[IVXLCDMivxlcdm]+[.:][)][ ]*|[IVXLCDM]+[.:][ ][ ]*|[ivxlcdm]+[.:][ ]*')
        : (strict ? '\\d+[.]'
        	: '\\d+[.]')
        );
        var md_markers = new Array( md_marker_ul, md_marker_ol );

        for( var i = 0, len = md_markers.length; i < len; i++ ) {
            var marker = md_markers[i];
            
            if ( md_list_level )
                var prefix = (pandoc ? '(\\n)':'(^)');
            else
                var prefix = '(?:(\\n\\n)|^\\n?)';
            
            text = text + md_flag_DoLists_z;
            var reg = new RegExp( prefix +
              '('
            + 	'('
            + 		'[ ]{0,' + md_less_than_tab + '}'
            + 		'(' + marker + ')'
            + 		'[ \\t]+'
            + 	')'
            + 	'(?:[\\s\\S]+?)'
            + 	'('
            + 			md_flag_DoLists_z
            + 		'|'
            + 			'\\n{2,}'
            + 			'(?=\\S)'
            + 			'(?!'
            + 				'[ \\t]*'
            + 				marker + '[ \\t]+'
            + 			')'
            + 	')'
            + ')'
            , (pandoc ? 'g':'gm') );
            
            text = text.replace( reg, function( $0, $1, $2, $3, $4 ) {
                $2 = $2.replace( md_flag_DoLists_z, "" );
                var list = $2;
                var list_type = $4.match( new RegExp( md_marker_ul ) ) != null ? "ul" : "ol";
				if(list_type=="ol"){
					var letter = $4.replace(/\W/g, '');
					// not i v x : [A-HJ-UWY-Za-hj-uwy-z]
					
					// i. v. x. l: c: d: m: mm. ivxlcdm.					
					if($4.match( /^[ivx][^:](?![ ]{2})|^[lcdm](?:[:]|[^:][ ]{2})|^[ivxlcdm]{2,}[^:](?![ ]{2})/i) ){var params = ' type="'+(letter.toLowerCase()==letter ? 'i':'I')+'" start="'+roman2int(letter)+'"';}
					// // test for matching:
					// var abc = "abcdefghijklmnopqrstuvwxyz";
					// for(i=0;i<26;i++){
					// console.log((abc[i]+'.'), (abc[i]+'.').match( /^[ivx][^:](?![ ]{3})|^[lcdm](?:[:]|[^:][ ]{3})|^[ivxlcdm]{2,}[^:](?![ ]{3})/i));
					// console.log((abc[i]+'.   '), (abc[i]+'.   ').match( /^[ivx][^:](?![ ]{3})|^[lcdm](?:[:]|[^:][ ]{3})|^[ivxlcdm]{2,}[^:](?![ ]{3})/i));
					// console.log((abc[i]+':'), (abc[i]+':').match( /^[ivx][^:](?![ ]{3})|^[lcdm](?:[:]|[^:][ ]{3})|^[ivxlcdm]{2,}[^:](?![ ]{3})/i));
					// }
					// for(i=1;i<26;i++){
					// console.log(('c'+abc[i]+'.'), ('c'+abc[i]+'.').match( /^[ivx][^:](?![ ]{3})|^[lcdm](?:[:]|[^:][ ]{3})|^[ivxlcdm]{2,}[^:](?![ ]{3})/i));
					// console.log(('c'+abc[i]+'.   '), ('c'+abc[i]+'.   ').match( /^[ivx][^:](?![ ]{3})|^[lcdm](?:[:]|[^:][ ]{3})|^[ivxlcdm]{2,}[^:](?![ ]{3})/i));
					// console.log(('c'+abc[i]+':'), ('c'+abc[i]+':').match( /^[ivx][^:](?![ ]{3})|^[lcdm](?:[:]|[^:][ ]{3})|^[ivxlcdm]{2,}[^:](?![ ]{3})/i));
					// }

					// a. i: v: x: aa. mm:
					else if($4.match( /^[a-z]+/i) ){var params = ' type="'+(letter.toLowerCase()==letter ? 'a':'A')+'" start="'+linum2int(letter)+'"';}

					else {var params = ' start="'+$4.replace(/\W/g, '')+'"';}
				} else {var params = '';}
                var marker = ( list_type == "ul" ? md_marker_ul : md_marker_ol );
                
                list = list.replace( /\n{2,}/g, "\n\n\n" );
                var result = _ProcessListItems( list, marker );
                
                result = "<" + list_type + params +">\n" + result + "</" + list_type + ">";
                $1 = ( $1 ) ? $1 : "";
                return $1 + "\n" + _HashBlock( result ) + "\n\n";
            } );
            
            text = text.replace( md_flag_DoLists_z, "" )
        }
        
        return text;
    }
    
     
    
    var md_flag_ProcessListItems_z = "ae279c3e92b456b96f62b8cf03bbad88";
    function _ProcessListItems( list_str, marker_any ) {
        md_list_level++;
        
        list_str = list_str.replace( /\n{2,}$/g, "\n" );
        list_str += md_flag_ProcessListItems_z;
        
        var reg = new RegExp(
          '(\\n)?'
        + '(^[ \\t]*)'
        + '(' + marker_any + ')[ \\t]+'
        + '(([\\s\\S]+?)'
        + '(\\n{1,2}))'
        + '(?=\\n*(' + md_flag_ProcessListItems_z + '|\\2(' + marker_any + ')[ \\t]+))'
        , "gm" );
        list_str = list_str.replace( reg, function ( $0, $1, $2, $3, $4 ) {
            var item = $4;
            
            if( $1 || item.match( /\n{2,}/ ) ) {
                item = _RunBlockGamut( _Outdent( item ) );
            }
            else {
                item = _DoLists( _Outdent( item ) );
                item = item.replace( /\n+$/, "" );
                item = _RunSpanGamut( item );
            }
            
            return "<li>" + item + "</li>\n";
        } );
        
        md_list_level--;
        return list_str.replace( md_flag_ProcessListItems_z, "" );
    }
    
     
    
    
    var md_reg_DoDefLists = new RegExp(
      '(?:(\\n\\n)|^\\n?)'
    + '('
    + 	'('
    + 		'[ ]{0,' + md_less_than_tab + '}'
    + 		'((\\S.*\\n)+)'
    + 		'\\n?'
    + 		'[ ]{0,' + md_less_than_tab + '}:[ ]+'
    + 	')'
    + 	'(?:[\\s\\S]+?)'
    + 	'('
    + 		'$'
    + 		'|'
    + 		'\\n{2,}'
    + 		'(?=\\S)'
    + 		'(?!'
    + 			'[ ]{0,' + md_less_than_tab + '}'
    + 			'(?:\\S.*\\n)+?'
    + 			'\\n?'
    + 			'[ ]{0,' + md_less_than_tab + '}:[ ]+'
    + 		')'
    + 		'(?!'
    + 			'[ ]{0,' + md_less_than_tab + '}:[ ]+'
    + 		')'
    + 	')'
    + ')'
    , "g" );
    function _DoDefLists( text ) {
        
        var reg = md_reg_DoDefLists;
        
        text = text.replace( reg, function( $0, $1, $2, $3, $4, $5 ) {
            var result = String_trim(_ProcessDefListItems($2));
            result = "<dl>\n" + result + "\n</dl>";
            if( !$1 ) $1 = "";
            return $1 + _HashBlock( result ) + "\n\n";
        } );
        
        return text;
    }
    
    var md_reg_ProcessDefListItems1 = new RegExp(
              '(?:\\n\\n+|^\\n?)'
            + '('
            +	'[ ]{0,' + md_less_than_tab + '}'
            +	'(?![:][ ]|[ ])'
            +	'(?:\\S.*\\n)+?'
            + ')'
            + '(?=\\n?[ ]{0,3}:[ ])'
        , "g" );
    var md_reg_ProcessDefListItems2 = new RegExp(
              '\\n(\\n+)?'
            + '[ ]{0,' + md_less_than_tab + '}'
            + '[:][ ]+'
            + '([\\s\\S]+?)'
            + '(?=\\n+'
            + 	'(?:'
            + 		'[ ]{0,' + md_less_than_tab + '}[:][ ]|<dt>|$'
            + 	')'
            + ')'
        , "g" );
    function _ProcessDefListItems( list_str ) {
        
        list_str = list_str.replace( /\n{2,}$/, "\n" );
        
        var reg = md_reg_ProcessDefListItems1;
        list_str = list_str.replace( reg, function( $0, $1 ) {
            var terms = String_trim($1).split( /\n/ );
            var text = '';
            for( var i = 0, len = terms.length; i < len; i++ ) {
                var term = terms[i];
                term = _RunSpanGamut( String_trim(term) );
                text += "\n<dt>" + term + "</dt>";
            }
            return text + "\n";
        } );
        
        var reg = md_reg_ProcessDefListItems2;
        list_str = list_str.replace( reg, function( $0, $1, $2 ) {
            var leading_line = $1;
            var def = $2;
            
            if ( leading_line || def.match( /\n{2,}/ ) ) {
                def = _RunBlockGamut( _Outdent( def + "\n\n" ) );
                def = "\n" + def + "\n";
            }
            else {
                def = String_rtrim(def);
                def = _RunSpanGamut( _Outdent( def ) );
            }
            
            return "\n<dd>" + def + "</dd>\n";
        } );
        
        return list_str;
    }
    
     
    
    
    var md_flag_DoCodeBlocks_A = "36efa4d78857300a";
    var md_flag_DoCodeBlocks_Z = "8eae6c6133167566";
    
    var md_reg_DoCodeBlocks = new RegExp(
      '(?:\\n\\n|' + md_flag_DoCodeBlocks_A + ')'
    + '('
        + '(?:'
            + '(?:[ ]{' + md_tab_width + '}|\\t)'
            + (pandoc ? '.*\\n+':'.*\\n+')
        + ')+'
    + ')'
    + '((?=^[ ]{0,' + md_tab_width + '}\\S)|' + md_flag_DoCodeBlocks_Z + ')'
    , "gm" );
    function _DoCodeBlocks( text ) {
        text = md_flag_DoCodeBlocks_A + text + md_flag_DoCodeBlocks_Z;
        var reg = md_reg_DoCodeBlocks;
        text = text.replace( reg, _DoCodeBlocks_callback );
        text = text
            .replace( md_flag_DoCodeBlocks_A, "" )
            .replace( md_flag_DoCodeBlocks_Z, "" )
            ;
        return text;
    }
    function _DoCodeBlocks_callback( $0, $1 ) {
        var codeblock = $1;
        codeblock = _EncodeCode( _Outdent( codeblock ) );
        codeblock = codeblock.replace( /^\n+|\s+$/g, '' );
        
        var result = "<pre><code>" + codeblock + "\n</code></pre>";
        
        return "\n\n" + _HashBlock( result ) + "\n\n";
    }
    
     
    
     
    
    
    var md_reg_DoCodeSpans = new RegExp(
      '(?:(?!\\\\)(^|[\\s\\S])?)'
    + '(`+)'
    + '([\\s\\S]+?(?!`)[\\s\\S])'
    + '\\2'
    + '(?!`)'
    , "g" );
    function _DoCodeSpans( text ) {
        var reg = md_reg_DoCodeSpans;
        
        text = text.replace( reg, _DoCodeSpans_callback );
        
        return text;
    }
    
     
    
    
    var md_reg_DoCodeSpans_callback = /^[ \t]*|[ \t]*$/g;
    function _DoCodeSpans_callback( $0, $1, $2, $3 ) {
        var c = $3;
        c = c.replace( md_reg_DoCodeSpans_callback, '' );
        c = _EncodeCode( c );
        
        return ($1 ? $1 : '') + "<code>" + c + "</code>";
    }
    
    
    function _EncodeCode( str ) {
        str = str
            .replace( /&/g, '&amp;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;' );
        
        return _EscapeRegExpChars( str );
    }
    
     
    
     
    
    var md_reg_DoItalicsAndBold_1 = new RegExp(
    	(
    	pandoc || strict ?
          '(((?!__)([\\s\\S]{2}))?__)'
        + '(?=\\S)'
        + '(?!__)'
        + '('
        + 	'('
        +		'[^_]+?'
        +		'|'
        +		'_(?=\\S)(?!_)([\\s\\S]+?)(?=\\S)[\\s\\S]_'
        +	')+?'
        + '(?=\\S)\\S)'
        + '__'
        : // Markdown Extra
          '(((?!\\w)([\\s\\S]))?__)'
        + '(?=\\S)'
        + '(?!__)'
        + '('
        + 	'[\\s\\S]+?'
        + ')'
        + '__'
        + '(?!\\w)'
        )
        , "g" );
    var md_reg_DoItalicsAndBold_2 = new RegExp(
          '(((?!\\*\\*)([\\s\\S]{2}))?\\*\\*)'
        + '(?=\\S)'
        + '(?!\\*\\*)'
        + '('
        + 	'('
        +		'[^\\*]+?'
        +		'|'
        +		'\\*(?=\\S)(?!\\*)([\\s\\S]+?)(?=\\S)[\\s\\S]\\*'
        +	')+?'
        + '(?=\\S)\\S)'
        + '\\*\\*'
        , "g" );
    var md_reg_DoItalicsAndBold_3 = new RegExp(
          '(((?!\\w)[\\s\\S]|^)_)'
        + '(?=\\S)'
        + '(?!_)'
        + '('
        + 	'[\\s\\S]+?'
        + ')'
        + '_'
        + '(?!\\w)'
        , "g" );
    var md_reg_DoItalicsAndBold_4 = new RegExp(
          '(((?!\\*)[\\s\\S]|^)\\*)'
        + '(?=\\S)'
        + '(?!\\*)'
        + '('
        + 	'[\\s\\S]+?'
        + ')'
        + '\\*'
        , "g" );
    var md_reg_DoSuperscript = new RegExp(
          '(((?!\\^)[\\s\\S]|^)\\^)'
        + '(?=\\S)'
        + '(?!\\^)'
        + '('
        + 	'([^\\\\](?![ ])|[\\\\][ ])+?'
        + ')'
        + '\\^'
        , "g" );
    var md_reg_DoSubscript = new RegExp(
          '(((?!~)[\\s\\S]|^)~)'
        + '(?=\\S)'
        + '(?!~)'
        + '('
        + 	'([^\\\\](?![ ])|[\\\\][ ])+?'
        + ')'
        + '~'
        , "g" );
    
    var md_reg_DoItalicsAndBold_5 = /(?:___|\*\*\*)([\s\S]+?)(?:___|\*\*\*)/g;
    var md_reg_DoStrikethrough = /~~([\s\S]+?)~~/g;
    
    function _DoItalicsAndBold( text ) {
        var reg = md_reg_DoItalicsAndBold_5;
        text = text.replace( reg, (debug ? "<strong><em>$1<!-- 5 --></em></strong>" : "<strong><em>$1</em></strong>") );
        
        var reg = md_reg_DoItalicsAndBold_1;
        text = text.replace( reg, (debug ? "$3<strong>$4<!-- 1 --></strong>" : "$3<strong>$4</strong>") );
        
        var reg = md_reg_DoItalicsAndBold_2;
        text = text.replace( reg, (debug ? "$3<strong>$4<!-- 2 --></strong>" : "$3<strong>$4</strong>") );

        var reg = md_reg_DoItalicsAndBold_3;
        text = text.replace( reg, (debug ? "$2<em>$3<!-- 3 --></em>" : "$2<em>$3</em>") );
        
        var reg = md_reg_DoItalicsAndBold_4;
        text = text.replace( reg, (debug ? "$2<em>$3<!-- 4 --></em>" : "$2<em>$3</em>") );

        var reg = md_reg_DoSuperscript;        
        text = text.replace( reg, "$2<sup>$3</sup>" );
        
        var reg = md_reg_DoSubscript;
        text = text.replace( reg, "$2<sub>$3</sub>" );
                
		if(pandoc){
			var reg = md_reg_DoStrikethrough;
			text = text.replace( reg, "<del>$1</del>" );
        }
        
        return text;
    }
    
    
    var md_reg_DoBlockQuotes = new RegExp(
      '('
    +   (pandoc ? '.*\\n' : '') // match the line before the blockquote, a quasi "lookbehind"
    +	'('
    +       '[ \\t]*>[ \\t]?'
	+		'.+\\n'
	+		'(.+\\n)*'
	+		(pandoc && !strict ? '' : '\\n*')
    +	')'
    + (pandoc && !strict ? '' : '+')
    + ')'
    , "gm" );
    
    function _DoBlockQuotes( text ) {
        var reg = md_reg_DoBlockQuotes;
		text = text.replace( reg, _DoBlockQuotes_callback );
        return text;
    }
    
    var md_reg_DoBlockQuotes_callback_1 = /^[ \t]*>[ \t]?/gm;
    var md_reg_DoBlockQuotes_callback_2 = /^[ \t]+$/gm;
    var md_reg_DoBlockQuotes_callback_3 = /^/gm;
    var md_reg_DoBlockQuotes_callback_4 = /(\s*<pre>.+?<\/pre>)/;
    function _DoBlockQuotes_callback( $0, $1 ) {
    	if(pandoc && !strict && !$0.match(/^\n*[>]/)){
    		console.error('Pandoc doesn´t like blockquote inside a paragraph:');
    		console.log($0);
    		return $0;
    	}
        var bq = $1;
        bq = bq.replace( md_reg_DoBlockQuotes_callback_1, '' );
        bq = bq.replace( md_reg_DoBlockQuotes_callback_2, '' );
        bq = _RunBlockGamut( bq );
    
        bq = bq.replace( md_reg_DoBlockQuotes_callback_3, "  " );
        bq = bq.replace( md_reg_DoBlockQuotes_callback_4, _DoBlockQuotes_callback2 );
    
        return _HashBlock( "<blockquote>\n" + bq + "\n</blockquote>" ) + "\n\n";
    }
    function _DoBlockQuotes_callback2( $0, $1 ) {
        var pre = $1;
        pre = pre.replace( /^[ ][ ]/gm, '' );
        return pre;
    }
    
    
    function _FormParagraphs( text ) {
        text = text.replace( /^\n+|\n+$/g, "" );
        
        var grafs = text.split( /\n{2,}/ );
        
        for( var i = 0, len = grafs.length; i < len; i++ ) {
            var value = String_trim(_RunSpanGamut(grafs[i]));
            
            var clean_key = value;
            var block_key = value.substr( 0, 32 );
            
            var is_p = ( md_html_blocks[block_key] == undefined
                        && md_html_hashes[clean_key] == undefined );
            
            if( is_p ) value = "<p>" + value + "</p>";
            
            grafs[i] = value;
        }
        
        text = grafs.join( "\n\n" );
        text = _UnhashTags( text );
        
        return text;
    }

    
    function _EncodeAmpsAndAngles( text ) {
    
        return text
            .replace( /&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;' )
            .replace( /<(?![a-z\/?\$!])/gi, "&lt;" )
        ;
    }
    
    function _EncodeAttribute(text) {
      //
      // Encode text for a double-quoted HTML attribute. This function
      // is *not* suitable for attributes enclosed in single quotes.
      text = _EncodeAmpsAndAngles(text);
      text = text.replace('"', '&quot;');
      return text;
    }
    
     
    
    var md_reg_esc_backslash = /\\\\/g;
    var md_reg_esc_backquote = /\\\`/g;
    var md_reg_esc_asterisk  = /\\\*/g;
    var md_reg_esc_underscore= /\\\_/g;
    var md_reg_esc_lbrace    = /\\\{/g;
    var md_reg_esc_rbrace    = /\\\}/g;
    var md_reg_esc_lbracket  = /\\\[/g;
    var md_reg_esc_rbracket  = /\\\]/g;
    var md_reg_esc_lparen    = /\\\(/g;
    var md_reg_esc_rparen    = /\\\)/g;
    var md_reg_esc_hash      = /\\\#/g;
    var md_reg_esc_period    = /\\\./g;
    var md_reg_esc_exclamation = /\\\!/g;
    var md_reg_esc_colon     = /\\\:/g;
    var md_reg_esc_bar       = /\\\|/g;
    function _EncodeBackslashEscapes( text ) {
        return text
        .replace( md_reg_esc_backslash,		"7f8137798425a7fed2b8c5703b70d078" )
        .replace( md_reg_esc_backquote,		"833344d5e1432da82ef02e1301477ce8" )
        .replace( md_reg_esc_asterisk,		"3389dae361af79b04c9c8e7057f60cc6" )
        .replace( md_reg_esc_underscore,	"b14a7b8059d9c055954c92674ce60032" )
        .replace( md_reg_esc_lbrace,		"f95b70fdc3088560732a5ac135644506" )
        .replace( md_reg_esc_rbrace,		"cbb184dd8e05c9709e5dcaedaa0495cf" )
        .replace( md_reg_esc_lbracket,		"815417267f76f6f460a4a61f9db75fdb" )
        .replace( md_reg_esc_rbracket,		"0fbd1776e1ad22c59a7080d35c7fd4db" )
        .replace( md_reg_esc_lparen,		"84c40473414caf2ed4a7b1283e48bbf4" )
        .replace( md_reg_esc_rparen,		"9371d7a2e3ae86a00aab4771e39d255d" )
        .replace( md_reg_esc_hash,			"01abfc750a0c942167651c40d088531d" )
        .replace( md_reg_esc_period,		"5058f1af8388633f609cadb75a75dc9d" )
        .replace( md_reg_esc_exclamation,	"9033e0e305f247c0c3c80d0c7848c8b3" )
        .replace( md_reg_esc_colon,			"853ae90f0351324bd73ea615e6487517" )
        //.replace( md_reg_esc_bar,			"eb486741c1df3f489d857e41773b1e87" )
        ;
    }
    
    var md_reg_DoAutoLinks_1 = /<((https?|ftp):[^'">\s]+)>/gi;
    var md_reg_DoAutoLinks_2 = new RegExp(
        '<'
        + '(?:mailto:)?'
        + '('
        + 	'[-.\\w]+'
        + 	'@'
        + 	'[-a-z0-9]+(\\.[-a-z0-9]+)*\\.[a-z]+'
        + ')'
        + '>'
        , "gi" );
    
    function _DoAutoLinks( text ) {
        text = text.replace( md_reg_DoAutoLinks_1, '<a href="$1">$1</a>' );
        
        var reg = md_reg_DoAutoLinks_2;
        text = text.replace( reg, function( $0, $1 ) {
            return _EncodeEmailAddress(
                _UnescapeSpecialChars( _UnslashQuotes( $1 ) )
            );
        } );
    
        return text;
    }
    
    function _EncodeEmailAddress( addr ) {
        addr = "mailto:" + addr;
        var length = addr.length;
        
        addr = addr.replace( /([^:])/g, _EncodeEmailAddress_callback );
        
        addr = '<a href="' + addr + '">' + addr + "</a>";
        addr = addr.replace( /\">.+?:/g, '">' );
        
        return addr;
    }
    function _EncodeEmailAddress_callback( $0, $1 ) {
    
        var str = $1;
        var r = Math.round( Math.random( ) * 100 );
        if( r > 90 && str != '@' ) return str;
        else if( r < 45 ) return '&#x' + str.charCodeAt( 0 ).toString( 16 ) + ';';
        else return '&#' + str.charCodeAt( 0 ) + ';';
    }
    
    var md_reg_md5_backslash   = /7f8137798425a7fed2b8c5703b70d078/g;
    var md_reg_md5_backquote   = /833344d5e1432da82ef02e1301477ce8/g;
    var md_reg_md5_asterisk    = /3389dae361af79b04c9c8e7057f60cc6/g;
    var md_reg_md5_underscore  = /b14a7b8059d9c055954c92674ce60032/g;
    var md_reg_md5_lbrace      = /f95b70fdc3088560732a5ac135644506/g;
    var md_reg_md5_rbrace      = /cbb184dd8e05c9709e5dcaedaa0495cf/g;
    var md_reg_md5_lbracket    = /815417267f76f6f460a4a61f9db75fdb/g;
    var md_reg_md5_rbracket    = /0fbd1776e1ad22c59a7080d35c7fd4db/g;
    var md_reg_md5_lparen      = /84c40473414caf2ed4a7b1283e48bbf4/g;
    var md_reg_md5_rparen      = /9371d7a2e3ae86a00aab4771e39d255d/g;
    var md_reg_md5_hash        = /01abfc750a0c942167651c40d088531d/g;
    var md_reg_md5_period      = /5058f1af8388633f609cadb75a75dc9d/g;
    var md_reg_md5_exclamation = /9033e0e305f247c0c3c80d0c7848c8b3/g;
    var md_reg_md5_colon       = /853ae90f0351324bd73ea615e6487517/g;
    var md_reg_md5_bar         = /eb486741c1df3f489d857e41773b1e87/g;
    
    function _UnescapeSpecialChars( text ) {
        return text
        .replace( md_reg_md5_backslash,   "\\" )
        .replace( md_reg_md5_backquote,   "`" )
        .replace( md_reg_md5_asterisk,    "*" )
        .replace( md_reg_md5_underscore,  "_" )
        .replace( md_reg_md5_lbrace,      "{" )
        .replace( md_reg_md5_rbrace,      "}" )
        .replace( md_reg_md5_lbracket,    "[" )
        .replace( md_reg_md5_rbracket,    "]" )
        .replace( md_reg_md5_lparen,      "(" )
        .replace( md_reg_md5_rparen,      ")" )
        .replace( md_reg_md5_hash,        "#" )
        .replace( md_reg_md5_period,      "." )
        .replace( md_reg_md5_exclamation, "!" )
        .replace( md_reg_md5_colon,       ":" )
        //.replace( md_reg_md5_bar,       "|" )
        ;
    }
    
    function _UnhashTags( text ) {
        for( var key in md_html_hashes ) {
            text = text.replace( new RegExp( key, "g" ), md_html_hashes[key] );
        }
        return text;
    }
    function _TokenizeHTML( str ) {
        var index = 0;
        var tokens = new Array( );
        
        var reg = new RegExp(
          '(?:<!(?:--[\\s\\S]*?--\\s*)+>)|'
        + '(?:<\\?[\\s\\S]*?\\?>)|'
        + '(?:<[/!$]?[-a-zA-Z0-9:]+\\b([^"\'>]+|"[^"]*"|\'[^\']*\')*>)'
        , "g" );
        
        while( reg.test( str ) ) {
            var txt = RegExp.leftContext;
            var tag = RegExp.lastMatch;
            
            tokens.push( [ "text", txt ] );
            tokens.push( [ "tag", tag ] );
            
            str = str.replace( txt, "" );
            str = str.replace( tag, "" );
        }
        
        if( str != "" ) {
            tokens.push( [ "text", str ] );
        }
        
        return tokens;
    }
    
    var md_reg_Outdent = new RegExp( '^(\\t|[ ]{1,' + md_tab_width + '})', "gm" );
    function _Outdent( text ) {
        return text.replace( md_reg_Outdent, "" );
    }
    
    function _Detab( text ) {
        text = text.replace( /(.*?)\t/g,
            function( match, substr ) {
                return substr += String_r(" ", (md_tab_width - substr.length % md_tab_width));
            });
        return text;
    }
    
    function _UnslashQuotes( text ) {
        return text.replace( '\"', '"' );
    }
    
    var md_reg_backslash = /\\/g;
    var md_reg_backquote = /\`/g;
    var md_reg_asterisk  = /\*/g;
    var md_reg_underscore= /\_/g;
    var md_reg_lbrace    = /\{/g;
    var md_reg_rbrace    = /\}/g;
    var md_reg_lbracket  = /\[/g;
    var md_reg_rbracket  = /\]/g;
    var md_reg_lparen    = /\(/g;
    var md_reg_rparen    = /\)/g;
    var md_reg_hash      = /\#/g;
    var md_reg_period    = /\./g;
    var md_reg_exclamation = /\!/g;
    var md_reg_colon     = /\:/g;
    function _EscapeRegExpChars( text ) {
        return text
        .replace( md_reg_backslash,   "7f8137798425a7fed2b8c5703b70d078" )
        .replace( md_reg_backquote,   "833344d5e1432da82ef02e1301477ce8" )
        .replace( md_reg_asterisk,    "3389dae361af79b04c9c8e7057f60cc6" )
        .replace( md_reg_underscore,  "b14a7b8059d9c055954c92674ce60032" )
        .replace( md_reg_lbrace,      "f95b70fdc3088560732a5ac135644506" )
        .replace( md_reg_rbrace,      "cbb184dd8e05c9709e5dcaedaa0495cf" )
        .replace( md_reg_lbracket,    "815417267f76f6f460a4a61f9db75fdb" )
        .replace( md_reg_rbracket,    "0fbd1776e1ad22c59a7080d35c7fd4db" )
        .replace( md_reg_lparen,      "84c40473414caf2ed4a7b1283e48bbf4" )
        .replace( md_reg_rparen,      "9371d7a2e3ae86a00aab4771e39d255d" )
        .replace( md_reg_hash,        "01abfc750a0c942167651c40d088531d" )
        .replace( md_reg_period,      "5058f1af8388633f609cadb75a75dc9d" )
        .replace( md_reg_exclamation, "9033e0e305f247c0c3c80d0c7848c8b3" )
        .replace( md_reg_colon,       "853ae90f0351324bd73ea615e6487517" )
        ;
    }
    
    function _EscapeItalicsAndBold( text ) {
        return text
        .replace( md_reg_asterisk,    "3389dae361af79b04c9c8e7057f60cc6" )
        .replace( md_reg_underscore,  "b14a7b8059d9c055954c92674ce60032" )
        ;
    }
    
    var md_md5cnt = 0;
    function _md5( ) {
        var key = "a3e597688f51d1fc" + ( md_md5cnt++ ) + "ce22217bb70243be";
        return key;
    }
    
    /* Converter main flow */
    return (function(text) {
        md_urls = new Object;
        md_titles = new Object;
        md_html_blocks = new Object;
        md_html_hashes = new Object;

        md_footnotes = new Object;
        md_footnotes_ordered = [];
        md_footnote_counter = 1;

        md_in_anchor = false;

        
        text = text.replace( /\r\n|\r/g, "\n" );
        text += "\n\n";
        text = _Detab( text );
        text = _HashHTMLBlocks( text );
        text = text.replace( /^[ \t]+$/gm, "" );
        text = _StripFootnotes( text );
        text = _StripLinkDefinitions( text );
        text = _VerticalGlue( text );
        text = _RunBlockGamut( text, false );
        text = _AppendFootnotes( text );
        text = _UnescapeSpecialChars( text );
        
        return text + "\n";
    }).call(this, text);
}
