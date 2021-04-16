"use strict";
let g=html_canvas.getContext('2d');

//-----------------------------------------------------------------------------
function getpos( adr )
//-----------------------------------------------------------------------------
{
	let x = adr % g_W;
	let y = Math.floor(adr / g_W);
	return [x,y];
}
//-----------------------------------------------------------------------------
function getadr( x, y )
//-----------------------------------------------------------------------------
{
	return g_W*y+x;
}
//-----------------------------------------------------------------------------
function cmd_cls()
//-----------------------------------------------------------------------------
{
	// テキスト画面クリア
	for ( let i = 0 ; i < g_screen.length ; i++ )
	{
		g_screen[i] = " ";
	}
	cur_move( 0 );
		
	return 0;
}
//-----------------------------------------------------------------------------
function cmd_fs( val )
//-----------------------------------------------------------------------------
{

	if( document.fullscreenEnabled )
	{
		if ( val == true )
		{
			if( document.fullscreen == false )
			{
				document.body.requestFullscreen.call(html_canvas);
			}
		}
		else
		{
			if( document.fullscreen == true )
			{
				document.exitFullscreen();	
			}
		}
	}
}
//-----------------------------------------------------------------------------
function cmd_tab( val )
//-----------------------------------------------------------------------------
{
	g_cur_tab = val;
	return 0;
}
//-----------------------------------------------------------------------------
function cmd_var( tblVarobj )
//-----------------------------------------------------------------------------
{
	for ( let key of Object.keys(tblVarobj) )
	{
		let v = tblVarobj[key];
		
		if ( v.atr !="T:" && v.atr !="I:" )
		{
			do_delAfter();
			if ( v.arg != undefined )
			{
				cmd_print( v.atr+" "+key+" : "+v.val +":" );

				let arg = v.arg;
				cmd_print( "(" );
				for ( let a of arg )
				{
					cmd_print( a.atr );
					cmd_print( a.name +"=" );
					cmd_print( a.val );
				}
				cmd_print( ")\n" );
					
			}
			else
			{
				cmd_print( v.atr+" "+key+" : ", v.val,"\n" );
			}
		}
	}
}
//-----------------------------------------------------------------------------
function cmd_print( ...tblWord )
//-----------------------------------------------------------------------------
{
	//-----------------------------------------------------------------------------
	function prt( str )
	//-----------------------------------------------------------------------------
	{
		for ( let s of str )
		{
			if( s == '\n' )
			{
				// 改行
				let [x,y] = getpos( g_cur_adr );
				cur_move( g_W*(y+1) );
			}
			else
			{
				g_screen[ g_cur_adr ] = s;
				cur_move( g_cur_adr+1 );
			}
		}
	}

	//-----------------------------------------------------------------------------
	function foo( objs, flgArray )
	//-----------------------------------------------------------------------------
	{
		for ( let i = 0 ; i < objs.length ; i++ )
		{
			let o = objs[i];
			
			if ( flgArray )
			{
				if ( i>0 ) prt(",");
			}
			
			switch( typeof(o) )
			{
				case "number":	prt( o.toString() );	break;
				case "string":	prt( o );	break;
				case "object":	prt( "{" ); foo( o, true );	prt( "}" );	break;
			}
		}
	}

	// main

	foo( tblWord, false );
	
	return 0;
}

//-----------------------------------------------------------------------------
function do_insert( str )
//-----------------------------------------------------------------------------
{
	for ( let s of str )
	{
		if( s == '\n' )
		{
			// 改行
			let [x,y] = getpos( g_cur_adr );
			cur_move( g_W*(y+1) );
		}
		else
		{
			let st = g_cur_adr;
			let [x,y] = getpos( g_cur_adr );
			let en = getadr(g_W-1,y);
			for ( let i = en ; i > st ; i-- )
			{
				g_screen[ i ] = g_screen[ i-1 ];
				
			}
			g_screen[ g_cur_adr ] = s;
			cur_move( g_cur_adr+1 );
		}
	}
}
//-----------------------------------------------------------------------------
function do_insert_nomove( str ) // カーソル移動無
//-----------------------------------------------------------------------------
{
	for ( let s of str )
	{
		if( s == '\n' )
		{
			// 改行
			let [x,y] = getpos( g_cur_adr );
			cur_move( g_W*(y+1) );
		}
		else
		{
			let st = g_cur_adr;
			let [x,y] = getpos( g_cur_adr );
			let en = getadr(g_W-1,y);
			for ( let i = en ; i > st ; i-- )
			{
				g_screen[ i ] = g_screen[ i-1 ];
				
			}
			g_screen[ g_cur_adr ] = s;
		}
	}
}

//-----------------------------------------------------------------------------
function do_scroll()
//-----------------------------------------------------------------------------
{
	for ( let i = 0 ; i < g_screen.length-g_W ; i++ )
	{
		g_screen[i] = g_screen[g_W+i];
	}
	for ( let i = g_screen.length-g_W ; i < g_screen.length ; i++ )
	{
		g_screen[ i ] =" ";
	}
}

//-----------------------------------------------------------------------------
function cur_move( adr )
//-----------------------------------------------------------------------------
{
	if ( adr < 0 ) adr = 0;
	if ( adr >= g_screen.length ) 
	{
		// スクロール
		do_scroll();
		let [x,y] = getpos( adr );
		adr = g_W*(g_H-1);
	}
	
	g_cur_adr = adr;

}
//-----------------------------------------------------------------------------
function do_right()
//-----------------------------------------------------------------------------
{
	cur_move( g_cur_adr+1 );
}
//-----------------------------------------------------------------------------
function do_left()
//-----------------------------------------------------------------------------
{
	cur_move( g_cur_adr-1 );
}
//-----------------------------------------------------------------------------
function do_up()
//-----------------------------------------------------------------------------
{
	cur_move( g_cur_adr-g_W );
}
//-----------------------------------------------------------------------------
function do_down()
//-----------------------------------------------------------------------------
{
	cur_move( g_cur_adr+g_W );
}
//-----------------------------------------------------------------------------
function do_tab()
//-----------------------------------------------------------------------------
{
	let n = g_cur_tab;
	let [x,y] = getpos( g_cur_adr );
	x=Math.floor((x+n)/n)*n;
	cur_move( getadr(x,y) );
}
//-----------------------------------------------------------------------------
function do_bs()
//-----------------------------------------------------------------------------
{
	let [x,y] = getpos( g_cur_adr );
	if ( x > 0 ) x--;
	cur_move( getadr(x,y) );
	do_del();
}
//-----------------------------------------------------------------------------
function do_del()
//-----------------------------------------------------------------------------
{
	let [x,y] = getpos( g_cur_adr );
	let st = g_cur_adr;
	let en = getadr(g_W-1,y);

	for ( let i = st ; i < en ; i++ )
	{
		g_screen[i] = g_screen[i+1];
	}
	g_screen[ en ] =" ";

}

//-----------------------------------------------------------------------------
function do_delAfter()
//-----------------------------------------------------------------------------
{
	let [x,y] = getpos( g_cur_adr );
	let st = g_cur_adr;
	let en = getadr(g_W-1,y);

	for ( let i = st ; i < en ; i++ )
	{
		g_screen[i] = " ";
	}
}

//-----------------------------------------------------------------------------
function sys_message( ...tblStr )	// 主にエラー表示などに使う
//-----------------------------------------------------------------------------
{
	for ( let str of tblStr )
	{
		str += " line in "+get_line(3);
		console.log( str );
		cmd_print( str );
		// 行末までクリア
		{
			let [x,y] = getpos( g_cur_adr );
			let st = getadr( x, y );
			let en = getadr( g_W-1, y );
			for ( let i = st ; i <= en ; i++ )
			{
				cmd_print(" ");
			}
		}
	}
}

//-----------------------------------------------------------------------------
function sys_message2( str )	// 主にエラー表示などに使う
//-----------------------------------------------------------------------------
{
//	for ( let str of tblStr )
	{
//		str += " line in "+get_line(3);
		console.log( str );
		cmd_print( str );
		// 行末までクリア
		{
			let [x,y] = getpos( g_cur_adr );
			let st = getadr( x, y );
			let en = getadr( g_W-1, y );
			for ( let i = st ; i <= en ; i++ )
			{
				cmd_print(" ");
			}
		}
	}
}

//-----------------------------------------------------------------------------
function get_line( n )	// 呼び出し元の行番号をスタックから取り出す
//-----------------------------------------------------------------------------
{
	// ...http:...:nnn:mm	とあるエラースタックを分解
	//
	// n:0	2	 0つ前
	// n:1	5	 1つ前
	// n:2	8	 2つ前
	// n:3	1	 3つ前
	let v = n*3+2;

	return (((new Error().stack).toString()).split(":"))[v];
}

//-----------------------------------------------------------------------------
function do_exec( str )
//-----------------------------------------------------------------------------
{

	let cmd = str.split(/ +/);
	{
		g_token = new Token( str );
		{
			let tkn = g_token.getToken();
			switch( tkn.val )
			{
				case "print"	:cmd_print( g_token.getOC().val )							;break;
				case "cls"		:cmd_cls();													;break;
				case "tab"		:cmd_tab( g_token.getOC().val )								;break;
				case "fs"		:cmd_fs( g_token.getOC().val )								;break;
				default:
					sys_message( "Syntax error " + '"'+tkn.val+'"' );
			}
		}

		{ // ユーザー入力の前に文字が残ってたら自動改行
			let [x,y] = getpos( g_cur_adr );
			if ( x > 0 )
			{
				cur_move( getadr(0,y+1) );
			}
		}
		
	}

}
//-----------------------------------------------------------------------------
function do_enter()
//-----------------------------------------------------------------------------
{
	let [x,y] = getpos( g_cur_adr );

	{
		let st = getadr( 0, y );		// 行頭
		let en = getadr( g_W-1, y );	// 行末
		let str="";
		for ( let i = st ; i <= en ; i++ )
		{
			str+=g_screen[i];
		}
		str = str.trim();

		cur_move( getadr(0,y+1) );

		if ( str.length > 0 ) 
		{
			//			do_exec( str ); // Enterが押された行の文字をコマンドとして実行する
			{
//				g_token = new Token( str, g_tblVarobj );
				g_token = new Token( str );
				g_token.execScript_obj();

			}
//			[x,y] = getpos( g_cur_adr );cur_move( getadr(0,y+1) );
			cmd_print("Ok\n");		console.log("-ok-");
		}
	}

}

//-----------------------------------------------------------------------------
function update_scene( time )
//-----------------------------------------------------------------------------
{
	// テキスト画面の描画
	{
		const ctx = html_canvasT.getContext("2d");
		ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = 0; // スムージングOFF
		ctx.clearRect(0, 0, html_canvasT.width, html_canvasT.height);

		ctx.font = ""+FONT+"px monospace";
		ctx.fillStyle = "#FFF";
		for ( let i = 0 ; i < g_screen.length ; i++ )
		{
			let [x,y] = getpos(i);
			let c = g_screen[ i ];

			if ( c != " " )
			{
				ctx.fillText( c, x*8+1, y*FONTh+FONTs );
			}

			if( i == g_cur_adr )
			{
				if( (g_cur_cnt & 0x20 ) == 0  )
				{
					if(0)
					{
						// よこバー
						ctx.fillText( "_", x*8+1, y*FONTh+FONTs );
						ctx.fillText( "_", x*8+1, y*FONTh+FONTs-1 );
						ctx.fill;
					}
					else
					{
						// 縦バー
						ctx.beginPath();
						ctx.strokeStyle = "#FFF";
						ctx.lineWidth = 2.0;
						ctx.moveTo( x*8+2-0, y*FONTh 		-(FONTh-FONTs)/2);
						ctx.lineTo( x*8+2-0, y*FONTh+FONTh	-(FONTh-FONTs)/2);
						ctx.closePath();
						ctx.stroke();
					}
				}
			}
		}
		g_cur_cnt++;
	}

	// テキスト画面とグラフィック画面の合成
	{
		const ctx = html_canvas.getContext("2d");
		ctx.clearRect(0, 0, html_canvas.width, html_canvas.height);
		ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = 0; // スムージングOFF
		ctx.drawImage(html_canvasG, 0, 0, html_canvasG.width, html_canvasG.height);
		ctx.drawImage(html_canvasT, 0, 0, html_canvasT.width, html_canvasT.height);
	}

	requestAnimationFrame( update_scene );
}


//-----------------------------------------------------------------------------
function cmd_init( w, h )
//-----------------------------------------------------------------------------
{
	w=Math.max(w,320);
	h=Math.max(h,200);
	w=Math.min(w,window.screen.width);
	h=Math.min(h,window.screen.height);

	html_canvas.width = w;
	html_canvas.height = h;
	html_canvasG.width = w;
	html_canvasG.height = h;
	html_canvasT.width = w;
	html_canvasT.height = h;

	g_W = Math.floor(html_canvasT.width / FONTw);
	g_H = Math.floor(html_canvasT.height / FONTh);
	g_screen = new Array(g_H*g_W).fill(" ");


	g_cur_adr=0;

	cmd_print( " --------------------------------------\n" );
	cmd_print( "                                       \n" );
	cmd_print( "          yukizo BASIC Ver0.1          \n" );
	cmd_print( "                                       \n" );
	cmd_print( "      created by nishiokzo 2021/03     \n" );
	cmd_print( "                                       \n" );
	cmd_print( " --------------------------------------\n" );
	cmd_print( "too much bytes free\n" );
	cmd_print( "graphic:"+html_canvas.width+"x"+html_canvas.height+"\n" );
	cmd_print( "text   :"+g_W+"x"+g_H+"\n" );

}
class Token
{

	adr;
	str;

	constructor( strProg )
	{
		this.adr = 0;
		this.prev_adr = 0;
		this.str = strProg;

	}

	//-----------------------------------------------------------------------------
	getTokenNone()
	//-----------------------------------------------------------------------------
	{
		return {word:0, atr:"tNON"};
	}

	//-----------------------------------------------------------------------------
	isActive()
	//-----------------------------------------------------------------------------
	{
		return ( this.adr < this.str.length );
	}
	//-----------------------------------------------------------------------------
	set_prev_adr()
	//-----------------------------------------------------------------------------
	{
		this.adr = this.prev_adr;
	}
	//-----------------------------------------------------------------------------
	getToken()
	//-----------------------------------------------------------------------------
	{

		let word = "";
		let type1 = "tNON";

		this.prev_adr = this.adr;

		while( this.adr < this.str.length )
		{
			let c = this.str[ this.adr++ ];
			
			function func( c )
			{
				let	atr = "tNON"; 
			

				let cd = c.charCodeAt();
				
				     if ( cd <=  8  )	atr = "tNON";	// (TT)
				else if ( cd ==  9  )	atr = "t_sp";	// tab
				else if ( cd <= 31  )	atr = "tNON";	// (TT)
				else if ( c  == " " )	atr = "t_sp";	// (space)
				else if ( c  == "!" )	atr = "C:";	// !
				else if ( c  == '"' )	atr = "tSTR";	// '"'
				else if ( c  == "." )	atr = "N:";	// '.'
				else if ( c  == "#" )	atr = "tNON";	// 
				else if ( c  == "$" )	atr = "tNON";	// 
				else if ( c  == "%" )	atr = "tNON";	// 
				else if ( c  == "&" )	atr = "C:";	// 
				else if ( c  == "'" )	atr = "tNON";	// 
				else if ( c  == "(" )	atr = "^:";	// 
				else if ( c  == ")" )	atr = "^:";	// 
				else if ( c  == "*" )	atr = "C:";	// 
				else if ( c  == "+" )	atr = "C:";	// 
				else if ( c  == "," )	atr = "tCtr";	// 
				else if ( c  == "-" )	atr = "C:";	// 
				else if ( c  == "/" )	atr = "C:";	// 
				else if ( cd <= 57  )	atr = "N:";	// 0123456789
				else if ( c  == ":" ) 	atr = "L:";
				else if ( c  == ";" ) 	atr = "S:";
				else if ( c  == "<" ) 	atr = "C:";
				else if ( c  == "=" ) 	atr = "C:";
				else if ( c  == ">" ) 	atr = "C:";
				else if ( c  == "?" ) 	atr = "C:";
				else if ( c  == "@" ) 	atr = "tNON";
				else if ( cd <= 90  )	atr = "W:";	// ABCDEFGHIJKLMNOPQRSTUVWXYZ
				else if ( c  == "[" ) 	atr = "tCtr";
				else if ( c  == "\\") 	atr = "C:";
				else if ( c  == "]" ) 	atr = "tCtr";
				else if ( c  == "^" ) 	atr = "C:";
				else if ( c  == "_" ) 	atr = "W:";
				else if ( c  == "`" ) 	atr = "tNON";
				else if ( cd <=122  )	atr = "W:";	// abcdefghijklmnopqrstuvwxyz
				else if ( c  == "{" ) 	atr = "^:";
				else if ( c  == "|" ) 	atr = "C:";
				else if ( c  == "}" ) 	atr = "^:";
				else 					atr = "W:";	// あいう...unicode

				return atr;
			};
			// <string> 	"123"
			// <word> 		ABC	 _123  .ABC
			// <numeric>	123  1.23  .123  -123  0x123 
			// <calculator>	+ - / * ^ & | ( ) ,

			if ( type1 == "W:" )	//単語
			{
				let type2 = func(c);

				if ( type2 == "W:" || type2 == "N:" )
				{
					// トークン継続
					word += c;
				}
				else
				{
					// トークン完成
					this.adr--;
					break;
				}
			}
			else
			if ( type1 == "C:" )	//演算子
			{
				let type2 = func(c);

			     if ( type2 != "C:" )
			     {
					// トークン完成
					this.adr--;
					break;
			     }
			     else
			     {
					word += c;
			     }
			}
			else						//
			if ( type1 == "tSTR" )	//文字列
			{
			     if ( c == '"' )
			     {
					// トークン完成
					break;
			     }
			     else
			     {
					word += c;
			     }
			}
			else						//
			if ( word.length == 0 ) 		// 最初の一文字目
			{
				type1 = func(c);
				if ( type1 == "tSTR" ) continue;
				else 
				if ( type1 == "tNON" ) continue;
				else 
				if ( type1 == "t_sp" ) continue;

				word = c;

				if ( c=="{" || c=="[" || c=="(" || c=="}" || c=="]" || c==")" || c=="," || c==";" )	// 一文字のみの集合構文
				{
					break;
				}
				continue;
			}
			else							// ２文字目以降
			{
				let type2 = func(c);

				let bAbandon = false;	// c 放棄フラグ
				let bComp = false;		// トークン完成フラグ

				if(0){}
		
				else if ( type2 == "tSTR" || type2 == "C:" )		
				{
					// トークン完成
					this.adr--;
					break;
				}	
				else if ( type2 == "tNON" )		{bComp = true;bAbandon = true;}
				else if ( type2 == "t_sp" )		{bComp = true;bAbandon = true;}
				else if ( type2 != type1 )			bComp = true;

				if ( bComp  )
				{
					// トークン完成


					if ( bAbandon ) 
					{
						// 放棄
					}
					else
					{
						this.adr--;
					}
					break;
				}
				else
				{
					// トークン継続
					word += c;
				}
			}
		}
		//	console.log((++g_cntToken)+":token ["+word+"]",type1);
		return {atr:type1,val:word};
	}
	//-----------------------------------------------------------------------------
	getTokenX()
	//-----------------------------------------------------------------------------
	{

		let word = "";
		let type1 = "tNON";

		while( this.adr < this.str.length )
		{
			let c = this.str[ this.adr++ ];
			
			function func( c )
			{
				let	atr = "tNON"; 
				// tNON	処理対象外
				// t_sp	スペース
				// W:	単語
				// C:	演算子
				// tSTR	文字列
				// t_2n	保留（続く二文字目で判断される）
				// tCtr	1文字制御 [] {} () , ;
				

				let cd = c.charCodeAt();
				
				     if ( cd <=  8  )	atr = "tNON";	// (TT)
				else if ( cd ==  9  )	atr = "t_sp";	// tab
				else if ( cd <= 31  )	atr = "tNON";	// (TT)
				else if ( c  == " " )	atr = "t_sp";	// (space)
				else if ( c  == "!" )	atr = "C:";	// !
				else if ( c  == '"' )	atr = "tSTR";	// '"'
				else if ( c  == "." )	atr = "N:";	// '.'
//				else if ( cd <= 47  )	atr = "C:";	// #$%&'()*+,-/
				else if ( c  == "#" )	atr = "tNON";	// 
				else if ( c  == "$" )	atr = "tNON";	// 
				else if ( c  == "%" )	atr = "tNON";	// 
				else if ( c  == "&" )	atr = "C:";	// 
				else if ( c  == "'" )	atr = "tNON";	// 
				else if ( c  == "(" )	atr = "tCtr";	// 
				else if ( c  == ")" )	atr = "tCtr";	// 
				else if ( c  == "*" )	atr = "C:";	// 
				else if ( c  == "+" )	atr = "C:";	// 
				else if ( c  == "," )	atr = "tCtr";	// 
				else if ( c  == "-" )	atr = "C:";	// 
				else if ( c  == "/" )	atr = "C:";	// 
				else if ( cd <= 57  )	atr = "N:";	// 0123456789
				else if ( c  == ":" ) 	atr = "C:";
				else if ( c  == ";" ) 	atr = "S:";
				else if ( c  == "<" ) 	atr = "C:";
				else if ( c  == "=" ) 	atr = "C:";
				else if ( c  == ">" ) 	atr = "C:";
				else if ( c  == "?" ) 	atr = "C:";
				else if ( c  == "@" ) 	atr = "tNON";
				else if ( cd <= 90  )	atr = "W:";	// ABCDEFGHIJKLMNOPQRSTUVWXYZ
				else if ( c  == "[" ) 	atr = "tCtr";
				else if ( c  == "\\") 	atr = "C:";
				else if ( c  == "]" ) 	atr = "tCtr";
				else if ( c  == "^" ) 	atr = "C:";
				else if ( c  == "_" ) 	atr = "W:";
				else if ( c  == "`" ) 	atr = "tNON";
				else if ( cd <=122  )	atr = "W:";	// abcdefghijklmnopqrstuvwxyz
//				else if ( cd <=126  )	atr = "C:";	// {|}~
				else if ( c  == "{" ) 	atr = "tCtr";
				else if ( c  == "|" ) 	atr = "C:";
				else if ( c  == "}" ) 	atr = "tCtr";
				else 					atr = "W:";	// あいう...unicode

				return atr;
			};
			// <string> 	"123"
			// <word> 		ABC	 _123  .ABC
			// <numeric>	123  1.23  .123  -123  0x123 
			// <calculator>	+ - / * ^ & | ( ) ,

			if ( type1 == "W:" )	//単語
			{
				let type2 = func(c);

				if ( type2 == "W:" || type2 == "N:" )
				{
					// トークン継続
					word += c;
				}
				else
				{
					// トークン完成
					this.adr--;
					break;
				}
			}
			else
			if ( type1 == "C:" )	//演算子
			{
				let type2 = func(c);

			     if ( type2 != "C:" )
			     {
					// トークン完成
					this.adr--;
					break;
			     }
			     else
			     {
					word += c;
			     }
			}
			else						//
			if ( type1 == "tSTR" )	//文字列
			{
			     if ( c == '"' )
			     {
					// トークン完成
					break;
			     }
			     else
			     {
					word += c;
			     }
			}
			else						//
			if ( word.length == 0 ) 		// 最初の一文字目
			{
				type1 = func(c);
				if ( type1 == "tSTR" ) continue;
				else 
				if ( type1 == "tNON" ) continue;
				else 
				if ( type1 == "t_sp" ) continue;

				word = c;

				if ( c=="{" || c=="[" || c=="(" || c=="}" || c=="]" || c==")" || c=="," || c==";" )	// 一文字のみの集合構文
				{
					break;
				}
				continue;
			}
			else							// ２文字目以降
			{
				let type2 = func(c);

				let bAbandon = false;	// c 放棄フラグ
				let bComp = false;		// トークン完成フラグ

				if(0){}
		
				else if ( type2 == "tSTR" || type2 == "C:" )		
				{
					// トークン完成
					this.adr--;
					break;
				}	
				else if ( type2 == "tNON" )		{bComp = true;bAbandon = true;}
				else if ( type2 == "t_sp" )		{bComp = true;bAbandon = true;}
				else if ( type2 != type1 )			bComp = true;

				if ( bComp  )
				{
					// トークン完成


					if ( bAbandon ) 
					{
						// 放棄
					}
					else
					{
						this.adr--;
					}
					break;
				}
				else
				{
					// トークン継続
					word += c;
				}
			}
		}
		//	console.log((++g_cntToken)+":token ["+word+"]",type1);
		return {val:word, atr:type1};
	}



	//-----------------------------------------------------------------------------
	execScript_sub( name, nest )
	//-----------------------------------------------------------------------------
	{

		let st = 0;
		let oc = [];
		let arr = [];

// abc			オブジェクト
// 123			数列オブジェクト
// "123"		文字列オブジェクト
//
// ()				()優先演算子
// {,,,}			配列オブジェクト
// (obj)			変数オブジェクト
// (obj) + {,,,}	関数オブジェクト
// (obj) + []		配列変数
// (obj) + (obj)	(obj);(obj)	

// atr:
//	float		1.0
//	float[n]	{1.0,1.0}
//	string		"abc"
//	string[n]	{"abc","abc"}
/*
	(
		string			name,
		(
			string		str,
			float		val,
		)[4]			param
	) atr

	(float,float) func(string a, float b)
	{
		return 
	}
*/
//	(atr) function array[n]

	//	I	Integer Object
	//	F	Float Object
	//	S	String Object
	//	P	Program Object
	//	V	Variable Object
	//	R	Reserve Object
	//	N	New Object
	//	T	Type Object
	//	B	Block Object (){}[],;
	//	A:	Array Object
	//	C:	Calcurator
	//	I:	IF Object
	//	E:	ELSE Object
	//	N:	Number Object
	//	S:	Seperator Object
	//	L:	labelblock Object
	//	W:	Word Object
	
	
		function oc_dump()
		{
			//if( nest==0) 
			{
				let str = name +"."+nest+","+oc.length+") ";
				for ( let o of oc )
				{
					if ( o.atr == "A:" )
					{
						str += o.atr+"["+o.val.length+"]"+" ";
					}
					else
					{
						str += o.atr+o.val+" ";
					}
				}
				console.log( str );
			}
		}

		//-----------------------------------------------------------------------------
		function exVar( THIS, name )
		//-----------------------------------------------------------------------------
		{
		
			if ( undefined != THIS.tblVarobj[ name ] )
			{
				name = THIS.tblVarobj[ name ].val;		// 変数取り出し
			}
			if ( Array.isArray(name) )
			{
			}
			else
			if ( isFinite(name) )	//Number.isFinite(name)では"123"はfalse
			{
				name = Number( name );
			}
			else
			{
				sys_message2( "Undefined error " + '"'+name+'"' + " line in " + get_line(1) + " in " + get_line(2) );
			}
		
			return name;
		}
		//-----------------------------------------------------------------------------
		function setVal( THIS, v1, v2 )
		//-----------------------------------------------------------------------------
		{
			let val = v2.val;						
			let atr = v2.atr;						
			if ( undefined != THIS.tblVarobj[ val ] )		// 変数取り出し
			{
				atr = THIS.tblVarobj[ val ].atr;
				val = THIS.tblVarobj[ val ].val;
			}

			if ( undefined != THIS.tblVarobj[ v1.val ] )	// 変数代入
			{
				if ( THIS.tblVarobj[ v1.val ].atr == atr )
				{
					THIS.tblVarobj[ v1.val ] = {val:val,atr:atr};	
				}
				else
				{
					sys_message2( "Invalid type error " + '"'+v1.val+'"' + " line in " + get_line(1) );
				}
			}
			else										// 変数宣言＆代入
			{
				THIS.tblVarobj[ v1.val ] = {val:val, atr:atr};	
			}
	
			//val = Number(val);
			return {val:val, atr:"N:"};
			 
		}

		//-----------------------------------------------------------------------------
		function getObj( THIS )
		//-----------------------------------------------------------------------------
		{
			let tkn = THIS.getToken();

			if ( tkn.atr == "W:" )	// void float など規定ワード処理
			{
				let obj = g_tblVarobj[ tkn.val ];
				if ( obj != undefined )
				{
					tkn.obj = obj.val;
					tkn.atr = obj.atr;
				};
			}
			return tkn;
		}
	
		while(1)
		{
			let tkn = getObj( this );
			 

			if ( tkn.val == "var" )	{cmd_var(g_tblVarobj);continue;}

/*
			if ( tkn.val == "{" )	// プログラムオブジジェクト
			{
				let str="";
				tkn = this.getToken();
				while ( tkn.val != "}" && tkn.val !="" )
				{
					str += tkn.val
					tkn = this.getToken();

				}
				tkn.val = str;
				tkn.atr = "P:";
			}
			if ( tkn.val == "(" )	// 型
			{
				let str="";
				tkn = this.getToken();
				while ( tkn.val != ")" && tkn.val !="" )
				{
					str += tkn.val
					tkn = tknhis.getToken();

				}
				tkn.val = str;
				tkn.atr = "T:";
			}
*/
			if ( tkn.val == "(" )
			{
				tkn  = this.execScript_sub( name, nest+1 );
			}
			if ( tkn.val == "{" )
			{
				tkn  = this.execScript_sub( name, nest+1 );
			}
			if ( tkn.val == "[" )
			{
				tkn  = this.execScript_sub( name, nest+1 );
			}


			{// progブロック取得
				let flg = false;
				
				if ( oc.length == 2 && oc[0].val == "if" && oc[1].atr == "N:" )	flg = true;
				if ( oc.length == 4 && oc[3].val == "else" )	flg = true;

				if ( flg ) 
				{
					let str="";
					while ( tkn.val != ";" && tkn.val !="" )
					{
						str += tkn.val
						tkn = this.getToken();
					}
					tkn.val = str;
					tkn.atr = "P:";
				}
			}


			oc.push( tkn );
			oc_dump();


			//--数式解析
			if ( oc.length >= 4 && oc[oc.length-3].atr == "C:"  )
			{
				let pri = { "*":3, "+":2, "==":1, "=":0 };
				let p1 = pri[oc[oc.length-1].val];
				if ( p1==undefined ) p1 = 0;

				console.log("-C--:演算",pri[oc[oc.length-3].val],p1);
				while ( oc.length >= 4 && pri[oc[oc.length-3].val] >= p1 )
				{
//			oc_dump();
					let c2 = oc.pop();
					let v2 = oc.pop();
					let c1 = oc.pop();
					let v1 = oc.pop();

					console.log("calc",v1.val,c1.val,v2.val,c2.val);
					switch( c1.val )
					{
						case "=":	v1 = setVal( this, v1, v2 );	break;
						case "==":	v1.val = exVar(this,v1.val) == exVar(this,v2.val)?1:0;	break;
						case "+":	v1.val = exVar(this,v1.val) +  exVar(this,v2.val);	break;
						case "*":	v1.val = exVar(this,v1.val) *  exVar(this,v2.val);	break;
						default:	console.log("err`"+c1.val+"`");
					}
					oc.push(v1);
					oc.push(c2);
				}
			}
			//--

			// 文法解析

			if ( oc.length == 4 && oc[0].val == "if" && oc[1].atr == "N:" && oc[2].atr == "P:" && oc[3].val != "else" )
			{
				console.log("INP^I:if実行");
				let o1		= oc.pop();	//	^else
				let prog	= oc.pop();	//	prog
				let cond	= oc.pop();	//	cond
				let	_if		= oc.pop();	//	if

				if ( cond )
				{
					let token = new Token( prog.val );
					token.execScript( _if.val.val );	//
				}		
			}
			if ( oc.length == 5 && oc[0].val == "if" && oc[1].atr == "N:" && oc[2].atr == "P:" && oc[3].val == "else" && oc[4].atr == "P:" )
			{
				console.log("INPI:if~else実行");
				let prog2	= oc.pop();	//	prog
				let _else	= oc.pop();	//	else
				let prog1	= oc.pop();	//	prog
				let cond	= oc.pop();	//	cond
				let	_if		= oc.pop();	//	if
				cond.val=Number( cond.val);
				if ( cond.val )
				{
					let token = new Token( prog1.val );
					token.execScript( _if.val.val );	//
				}
				else
				{
					let token = new Token( prog2.val );
					token.execScript( _else.val );	//
				}
			}

			if ( oc.length == 3 && oc[0].atr == "T:" && oc[1].atr == "W:" && oc[2].atr != "T:"  )
			{
				console.log("TW~T:変数定義");
				let	o1		= oc.pop();	//	~A:
				let	name	= oc.pop();	//	a
				let type	= oc.pop();	//	float

				g_blVarobj[ name.val ] = {val:0, atr:type.val};

			}
			if ( oc.length == 4 && oc[0].atr == "T:" && oc[1].atr == "W:" && oc[2].atr == "T:" && oc[3].atr == "P:" )
			{
				console.log("TWTP:関数定義");
				let prog	= oc.pop();	//	{}
				let form	= oc.pop();	//	()	
				let	name	= oc.pop();	//	foo
				let type	= oc.pop();	//	func

				let arg=[];
				arg.push( { name:form.val, val:0,atr:"F:"} );

				g_blVarobj[ name.val ] = {val:prog.val, atr:type.val, arg:arg} ;

			}

			if ( oc.length == 2 && oc[0].atr == "W:" && oc[1].atr == "A:" )
			{
				console.log("WA:関数実行");
				let param	= oc.pop();	//	[]
				let	name	= oc.pop();	//	foo
				let prog	= g_blVarobj[ name.val ].val;
				let arg		= g_blVarobj[ name.val ].arg;


				console.log( param );
				for ( let i = 0 ; i < param.val.length && i < arg.length ; i++ )
				{
					let p = param.val[i];
					let a = arg[i];
//					p.val

					g_blVarobj[ a.name ] = {val:p.val, atr:"F:"};

				}


				{
					let token = new Token( prog );
					token.execScript( name.val );	//
				}
			}


			if (tkn.val == "," )	
			{
				oc.pop();
				arr.push( oc[oc.length-1] );
			}
			if (tkn.val == "]" )	
			{
				oc.pop();
				if ( oc.length > 0 ) arr.push( oc[oc.length-1] );
				return {val:arr,atr:"A:"};
			}
			if (tkn.val == "}" )	
			{
				oc.pop();
				if ( oc.length > 0 ) arr.push( oc[oc.length-1] );
				return {val:arr,atr:"P:"};
			}
			if (tkn.val == ")" )	
			{
/*
				oc.pop();
				if ( oc.length > 0 ) arr.push( oc[oc.length-1] );
				return {val:arr,atr:"T:"};
*/
				return oc[0];
			}
			if (tkn.val == ";" )	return oc[0];
			if (tkn.val === ""  )	
			{
			oc_dump();
				return oc[0];
			}
//console.log("tkn.val>",tkn.val);


		}
	}
	
	//-----------------------------------------------------------------------------
	execScript( name ) // ト
	//-----------------------------------------------------------------------------
	{
		while( this.isActive() )
		{
			let val = this.execScript_sub( name, 0);
//console.log( name+"--");
		}

	}



	//-----------------------------------------------------------------------------
	execScript_obj()
	//-----------------------------------------------------------------------------
	{
		function dump_obj( oc , name, nest )
		{
			let str = name +"."+nest+","+oc.length+") ";
			for ( let o of oc )
			{
//console.log(o)
//if ( o == undefined ) break;
				if ( o.atr == "A:" )
				{
					str += o.atr+"["+o.val.length+"]"+" ";
				}
				else
				{
					str += o.atr+o.val+" ";
				}
			}
			console.log( str );
		}

		//-----------------------------------------------------------------------------
		function analisys( THIS, name, nest, tblVarObj )
		//-----------------------------------------------------------------------------
		{
			let oc = [];

			while( THIS.isActive() )
			{
				let obj = THIS.getToken();
				
				if ( obj.val == "var" )	{cmd_var( tblVarObj );continue;}

				if ( obj.val == "{" )	
				{
					let varobj ={};
					analisys( THIS, "blok", nest+1, varobj );
					
				}
				if ( obj.val == "}" )
				{
					return;
				}


				oc.push( obj );
				dump_obj( oc, name, nest );

				if ( oc.length == 4 && oc[1].val == "=" )
				{
console.log("=\n");
					let d = oc.pop();	// ;
					let c = oc.pop();	// 123
					let b = oc.pop();	// =
					let a = oc.pop();	// a

					let o = {val:c.val, atr:"N:"};
					tblVarObj[ a.val ] = o;
				}


			}
		}



		//-----------------------------------------------------------------------------
		function obj_dump( obj, nest )
		//-----------------------------------------------------------------------------
		{
			for ( let o of obj )
			{
				console.log(nest, o);
				if ( Array.isArray(o.val) )
				{
					obj_dump( o.val, nest+1 )
				}
			}
		}

		let tblobj2 = 
		[
			{atr:"(prog)", val:"a=1"},
			{atr:"(prog)", val:
				[
					{atr:"(cmnd)", val:"if"},
					{atr:"(cond)", val:"a==1"},
					{atr:"(prog)", val:
						[
							{atr:"(prog)", val:"foo1()"},
							{atr:"(prog)", val:"foo2()"},
						]
					},
					{atr:"(prog)", val:"bar()"},
				]
			},
		]
		
		let tblobj1 = [];
		//-----------------------------------------------------------------------------
		function pers( THIS, type, nest )
		//-----------------------------------------------------------------------------
		{
			let tbl = [];

			while( THIS.isActive() )
			{
				let obj = THIS.getToken();

				if ( obj.val == "}" ) return { atr:type, val:tbl };

				if ( obj.val == "{" ) 
				{
					obj = pers( THIS,"(progt)", nest+1 );
					tbl.push( obj ); 
					return { atr:type, val:tbl };
				}


				if ( type == "(cond)" )
				{
					if ( obj.val == ")" ) return { atr:type, val:tbl };
					
				}
				else	// (prog)
				{
					if ( obj.val == ";" ) return { atr:type, val:tbl };

					if ( obj.val == "if" ) 
					{
						tbl.push( { atr:"(cmnd)", val:obj.val} );
						let a = THIS.getToken(); // (
						tbl.push( pers( THIS,"(cond)", nest+1 ) );
						tbl.push( pers( THIS,"(prog)", nest+1 ) );
						let b = THIS.getToken(); // else
						tbl.push( pers( THIS,"(prog)", nest+1 ) );
						return { atr:type, val:tbl };
					}
				}

				tbl.push( obj ); 
			}
		}

		tblobj1.push( pers( this,"(prog1)", 0 ) );
		tblobj1.push( pers( this,"(prog2)", 0 ) );


		obj_dump( tblobj1, 0 );

	}


}



/*


	cmd_print("\a=1;if(a==1)foo();else bar();");

	let tbl = 
	[
		{atr:"(prog)", val:"a=1"},
		{atr:"(prog)", val:
			[
				{atr:"(prog)", val:"if"},
				{atr:"(cond)", val:"a==1"},
				{atr:"(prog)", val:"foo()"},
				{atr:"(prog)", val:"bar()"},
			]
		},
	]
*/
	
/*

	$if			if ( $value ) $prog ; !else
	$ifelse		if ( $value ) $prog1 ; else $prog2 ;

	$switch		switch ( $value ) $prog





	$switch		switch ( $value ) {	$swbrock }
	$swbrock	$labelblock	.rep
	
	labelblock:	case $value
	$case		case $value	: ~ case:
	$default	default	: $prog

	while		while ( $value ) $prog

	$prog		

	//$switch
	if( w[0]=="switch" && w[1]=="(" && w[2]=="$value" && w[3]==")" && w[4]=="{" && w[5]=="$swbody"}" )
	{
		let obj = exObj( w[5] );
		pers( obj, w[2] );
	}


	
*/


/*
			// 実行
			if ( oc[0].atr == "if" && oc[1].atr =="cond" && oc[2].atr =="prog" && oc[3].atr =="end" )
			{
				console.log("Yes! if \n)");
			}
*/



let g_tblVarobj = 
{

	"void"		:{atr:"T:"	,val:0},
	"string"	:{atr:"T:"	,val:0},
	"float"		:{atr:"T:"	,val:0},
	"true"		:{atr:"N:"	,val:1},
	"false"		:{atr:"N:"	,val:0},

	"if"		:{atr:"I:"	,from:["if"		,"cond"		,"prog"] 					},	// if (cond) {prog}
	"else"		:{atr:"I:"	,from:["if"		,"cond"		,"prog", "else","prog"]	},	// (if構文) else (prog) 
	"switch"	:{atr:"I:"	,from:["switch"	,"value"	,"case"]					},	// swith (cond) { (case構文)
	"case"		:{atr:"I:"	,from:["case"	,"cond"		,"prog"]					},	// case (N:)	":"
	"default"	:{atr:"I:"	,from:["default","cond"		,"prog"]					},	// default	":"
	"break"		:{atr:"I:"	,from:["if"		,"cond"		,"prog"]					},	// break
	"continue"	:{atr:"I:"	,from:["if"		,"cond"		,"prog"]					},	// continue
	"for"		:{atr:"I:"	,from:["if"		,"cond"		,"prog"]					},	// for ( (prog)[] ; (cond) ; (prog)[] ) (prog)
	"while"		:{atr:"I:"	,from:["if"		,"cond"		,"prog"]					},	// while (cond) (prog)
	"return"	:{atr:"I:"	,from:["if"		,"cond"		,"prog"]					},	// return (param)[]
	"struct"	:{atr:"I:"	,from:["if"		,"cond"		,"prog"]					},	// struct (type) (word)
	"print"		:{atr:"I:"	,from:["if"		,"cond"		,"prog"]					},	// print (obj)

// form[3]	(a;b;c)
// param[3]	(a,b,c)
// prog[3]	(a,b,c)
// type		(word)(type[]);
// lavel	(word):

// error	(N
};


//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_cur_tab = 4;
	g_cur_cnt = 0;
	g_cur_adr=0;
	g_cur_col="#FFFF";

	cmd_init(640,360);
	
//	cmd_print("print_script2 t[1]");
//	cmd_print("1+(2*3);;");
//	cmd_print("\nprint {A,{B1,B2},C};print D");			//	多次元配列テスト		execScript2b
//	cmd_print("\nprint A; print B");					//	; 連結テスト	
//	cmd_print("\na=123;b=456;print a");					//	変数テスト				execScript2c
//	cmd_print("\na={A,{B1,B2},C};b=123;print a[1]");	//	多次元配列変数テスト	execScript2c
//	cmd_print("\na={A,{1+2*3,B2},C};b=123;print a[1]");	//	多次元配列変数テスト	execScript2c
//	cmd_print("\na = 1+(2*3);print a");					 // ()計算テスト

//	cmd_print("\n");
//	cmd_print("\n");
//	cmd_print("\na={1,2};print a[1]");					//	配列テスト				execScript2c
//	cmd_print("\na=1;b=2;a=b;print a");						 //	変数宣言＆代入テスト
//	cmd_print("\nprint 1+2*3+4");						 //	
//	cmd_print("\na=2*(3+4);b={1,2};var");						 //	
//	cmd_print("\na=1;b={1,{2,3},4};c=b[a];var");						 //	
//	cmd_print("\nz=3;x=1;a={1,{X,z},2};b=a[x][1];c=b+1;var");						 //	
//	cmd_print("\nb=2;c=b+1;var");						 //	
//	cmd_print("\a=-1;var");						 //	
//	cmd_print("\a=cos(1.047);var");						 //	
//	cmd_print("\na=_pow{2,3};var");						 //	
//	cmd_print("\nfloat a=1;var");						 //	


//	let foo3 = (){};


//	cmd_print("\na = 1+1;");						 //	
//	cmd_print("\nvoid foo(n){a=n;var}");						 //	
//	cmd_print("\na=1;if ( a == 1 ) a=2 ; else a=3;");						 //	
//	cmd_print("\nswitch(1){case 1:a=1;break;default:a=3;break;}");						 //	
//	cmd_print("\a=1;if(a==1)foo1();else bar();");						 //	
	cmd_print("\a=1;if(a==1){foo1();foo2();}else bar();");						 //	
//	cmd_print("\nif (1) a=2;");						 //	
//	cmd_print("\n");
//	cmd_print("\nfoo[1]");						 //	
//	cmd_print("\n{1,2}");						 //	
//	cmd_print("\nfloat abc");						 //	
//	cmd_print("\na=123;b=a+1;var");						 //	
//	cmd_print("\nfloat foo(x){return x*2;}");						 //	
//	cmd_print("\nb=1 c=1");						 //	
//	cmd_print("\nvoid func{}{};var");						 //	
//	cmd_print("print A;print B;print C");
//	cmd_print("cls;cls;print 1");
//	cmd_print("1+2*3;");

//	(prog)	if
//	(cond)	a==1
//	(prog)	foo()
//	(porg)	bar()

//	(switch)		:	"switch"	(val)	(caseblodck)
//	(caseblodck)	:	"{"	(case)	"}"


//	(if)	:	(val)	(prog)	(prog)

//console.log( Math.floor(6.6));
//console.log( Math.floor(-6.6));
	if (0)
	{
		let n = "1.23";
		
		console.log( n, Number.isFinite(n)) ;
		console.log( n, isFinite(n*1)) ;
		console.log( n, typeof(n)) ;
	}
	if (0)
	{
		let a = "ABC";
		let b = 123;
		let c = [123,"ABC"];
		let d = {a:123, b:"ABC"};
		console.log( 1,typeof(a),a.length,Object.prototype.toString.call(a));
		console.log( 2,typeof(b),b.length,Object.prototype.toString.call(b));
		console.log( 3,typeof(c),c.length,Object.prototype.toString.call(c));
		console.log( 4,typeof(d),d.length,Object.prototype.toString.call(d));
	}

	update_scene(0);

}





let FONT = 12;	// 12:monospaceで8x12
let	FONTw = 8;
let	FONTh = 12;
let	FONTs = 11;
let g_W;
let g_H;
if(1)
{
	FONT = 15;		// 12:monospaceで8x15
	FONTw = 8;
	FONTh = 14;	// 25 line
	FONTh = 16;	// 22 line
	FONTh = 15;	// 24 line
	FONTs = 12;

}


let g_cur_cnt;
let g_cur_adr;
let g_cur_col;
let g_screen;

let g_cur_tab;

let g_token;

//HTMLとのやり取り関連
//-----------------------------------------------------------------------------
window.onkeypress = function( ev )
//-----------------------------------------------------------------------------
{
	const	KEY_CR	= 13;
	const	KEY_SPACE	= 32;	//
	const	KEY_33	= 33;	// !	o	not
	const	KEY_34	= 34;	// "	o
	const	KEY_35	= 35;	// #	
	const	KEY_36	= 36;	// $	
	const	KEY_37	= 37;	// %	o	mod
	const	KEY_38	= 38;	// &	o	and
	const	KEY_39	= 39;	// '	
	const	KEY_4D	= 40;	// (	o
	const	KEY_41	= 41;	// )	o
	const	KEY_42	= 42;	// *	o
	const	KEY_43	= 43;	// +	o
	const	KEY_44	= 44;	// ,	o
	const	KEY_45	= 45;	// -	o
	const	KEY_46	= 46;	// .	o
	const	KEY_47	= 47;	// /	o
	const	KEY_0	= 48;	// 0	o
	const	KEY_1	= 49;	// 1	o
	const	KEY_2	= 50;	// 2	o
	const	KEY_3	= 51;	// 3	o
	const	KEY_4	= 52;	// 4	o
	const	KEY_5	= 53;	// 5	o
	const	KEY_6	= 54;	// 6	o
	const	KEY_7	= 55;	// 7	o
	const	KEY_8	= 56;	// 8	o
	const	KEY_9	= 57;	// 9	o
	const	KEY_A	= 65;	// A	o
	const	KEY_B	= 66;	// B	o
	const	KEY_C	= 67;	// C	o
	const	KEY_D	= 68;	// D	o
	const	KEY_E	= 69;	// E	o
	const	KEY_F	= 70;	// F	o
	const	KEY_G	= 71;	// G	o
	const	KEY_H	= 72;	// H	o
	const	KEY_I	= 73;	// I	o
	const	KEY_J	= 74;	// J	o
	const	KEY_K	= 75;	// K	o
	const	KEY_L	= 76;	// L	o
	const	KEY_M	= 77;	// M	o
	const	KEY_N	= 78;	// N	o
	const	KEY_O	= 79;	// O	o
	const	KEY_P	= 80;	// P	o
	const	KEY_Q	= 81;	// Q	o
	const	KEY_R	= 82;	// R	o
	const	KEY_S	= 83;	// S	o
	const	KEY_T	= 84;	// T	o
	const	KEY_U	= 85;	// U	o
	const	KEY_V	= 86;	// V	o
	const	KEY_W	= 87;	// W	o
	const	KEY_X	= 88;	// X	o
	const	KEY_Y	= 89;	// Y	o
	const	KEY_Z	= 90;	// Z	o
	const	KEY_91	= 91;	// [	o
	const	KEY_92	= 92;	// \	o
	const	KEY_93	= 93;	// ]	o
	const	KEY_94	= 94;	// ^	o	xor
	const	KEY_95	= 95;	// _	o
	const	KEY_96	= 96;	// `	
	const	KEY_a	= 97;	// a	o
	const	KEY_b	= 98;	// b	o
	const	KEY_c	= 99;	// c	o
	const	KEY_d	= 100;	// d	o
	const	KEY_e	= 101;	// e	o
	const	KEY_f	= 102;	// f	o
	const	KEY_g	= 103;	// g	o
	const	KEY_h	= 104;	// h	o
	const	KEY_i	= 105;	// i	o
	const	KEY_j	= 106;	// j	o
	const	KEY_k	= 107;	// k	o
	const	KEY_l	= 108;	// l	o
	const	KEY_m	= 109;	// m	o
	const	KEY_n	= 110;	// n	o
	const	KEY_o	= 111;	// o	o
	const	KEY_p	= 112;	// p	o
	const	KEY_q	= 113;	// q	o
	const	KEY_r	= 114;	// r	o
	const	KEY_s	= 115;	// s	o
	const	KEY_t	= 116;	// t	o
	const	KEY_u	= 117;	// u	o
	const	KEY_v	= 118;	// v	o
	const	KEY_w	= 119;	// w	o
	const	KEY_x	= 120;	// x	o
	const	KEY_y	= 121;	// y	o
	const	KEY_z	= 122;	// z	o
	const	KEY_123	= 123;	// {	o
	const	KEY_124	= 124;	// |	o	or
	const	KEY_125	= 125;	// }	o
	const	KEY_126	= 126;	// ~	o	neg
	const	KEY_127	= 127;	// DEL 使われてない？


	g_cur_cnt = 0;
	let	c = ev.keyCode;
	if (0){}
	else if ( c == KEY_CR )	do_enter();
	else	
	if ( c >=KEY_SPACE && c <= KEY_126 )
	{
		 //cmd_print( String.fromCharCode(c));	// 上書き
		 do_insert( String.fromCharCode(c));
	}
	else
	{
		 console.log("keypress:",c);
	}
}
//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	const	KEY_ESC		= 27;
	const	KEY_LEFT	= 37;
	const	KEY_UP		= 38;
	const	KEY_RIGHT	= 39;
	const	KEY_DOWN	= 40;
	const	KEY_DEL		= 46;	//(DEL)
	const	KEY_BS		= 8;
	const	KEY_TAB		= 9;

	let	c = ev.keyCode;
	g_cur_cnt = 0;

    if ( event.key === "Tab") 
    {
        // デフォルト動作停止
        event.preventDefault();
	    do_tab();
    }
    else
	if(0){}
	else if ( c == KEY_DEL		) 
	{
		if ( ev.ctrlKey )	do_delAfter();
		else do_del();
	}
	else if ( c == KEY_BS		) do_bs();
	else if ( c == KEY_UP		) do_up();
	else if ( c == KEY_DOWN		) do_down();
	else if ( c == KEY_RIGHT	) do_right();
	else if ( c == KEY_LEFT		) do_left();
}
