"use strict";
let g=html_canvas.getContext('2d');

//-----------------------------------------------------------------------------
function rad( deg )
//-----------------------------------------------------------------------------
{
	return deg/180*Math.PI;
}
//-----------------------------------------------------------------------------
let box = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.stroke();

}
//-----------------------------------------------------------------------------
let fill= function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.fillStyle = "#000000";
	g.fill();
	g.stroke();

}

//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
	g.lineWidth = 1.0;
	g.moveTo( sx, sy );
	g.lineTo( ex, ey );
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
function print( tx, ty, str )
//-----------------------------------------------------------------------------
{
	g.font = "12px monospace";
	g.fillStyle = "#000000";
	g.fillText( str, tx, ty );
}

//-----------------------------------------------------------------------------
let circle = function( x,y,r )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.arc(x, y, r, 0, Math.PI * 2, true);
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
function cls()
//-----------------------------------------------------------------------------
{
	g.fillStyle = "#ffffff";
	g.fillRect( 0, 0, html_canvas.width, html_canvas.height );
}

//-----------------------------------------------------------------------------
function calcFunc( str, x )
//-----------------------------------------------------------------------------
{
	let adr = 0;

	//-----------------------------------------------------------------------------
	function getToken()
	//-----------------------------------------------------------------------------
	{
		const	TYPE_NONE	= 0;
		const	TYPE_CTRL	= 1;	// /n /r	...
		const	TYPE_ALPHA	= 2;	// abcあいう...
		const	TYPE_NUM	= 3;	// 1234..
		const	TYPE_SPACE	= 4;	// 0x20, \t, ..
		const	TYPE_CALC	= 5;	// +,*,;
		const	TYPE_STR	= 6;	// "..."

		let word = "";
		let type = TYPE_NONE;

		while( adr < str.length )
		{
			let c = str[ adr++ ];
			
			function func( c )
			{
				let	type = TYPE_NONE;
				
				let cd = c.charCodeAt();
				
				     if ( cd <=  8 )	type = TYPE_CTRL;	// (TT)
				else if ( cd <=  9 )	type = TYPE_SPACE;	// tab
				else if ( cd <= 31 )	type = TYPE_CTRL;	// (TT)
				else if ( cd <= 32 )	type = TYPE_SPACE;	// (space)
				else if ( cd <= 33 )	type = TYPE_SPACE;	// !
				else if ( cd =='"' )	type = TYPE_STR;	// '"'
				else if ( cd == 46 )	type = TYPE_NUM;	// '.'
				else if ( cd <= 47 )	type = TYPE_CALC;	// #$%&'()*+,-/
				else if ( cd <= 57 )	type = TYPE_NUM;	// 0123456789
				else if ( cd <= 64 )	type = TYPE_CALC;	// :;<=>?@
				else if ( cd <= 90 )	type = TYPE_ALPHA;	// ABCDEFGHIJKLMNOPQRSTUVWXYZ
				else if ( cd <= 96 )	type = TYPE_CALC;	// [\]^_`
				else if ( cd <=122 )	type = TYPE_ALPHA;	// abcdefghijklmnopqrstuvwxyz
				else if ( cd <=126 )	type = TYPE_CALC;	// {|}~
				else 					type = TYPE_ALPHA;	// あいう...unicode

				return type;
			};
			// 文字
			// ABC
			// _123
			//
			// 数値
			// 123
			// 1.23
			// .123
			// -123
			// 0x123

			if ( word.length == 0 ) // 最初の一文字目
			{
				type = func(c);
				if ( type == TYPE_STR ) continue;
				if ( type == TYPE_CTRL ) continue;
				if ( type == TYPE_SPACE ) continue;
				word = c;
				continue;
			}
			else
			{
				let type2 = func(c);

				let bAbandon = false;	// c 放棄フラグ
				let bComp = false;		// トークン完成フラグ

				     if ( type2 == TYPE_STR )		{bComp = true;bAbandon = true;}	
				else if ( type2 == TYPE_CTRL )		{bComp = true;bAbandon = true;}
				else if ( type2 == TYPE_SPACE )		{bComp = true;bAbandon = true;}
				else if ( type2 == TYPE_CALC && type == TYPE_CALC )	{bComp = true;}
				else if ( type2 != type )			bComp = true;

				if ( bComp  )
				{
					// トークン完成


					if ( bAbandon ) 
					{
						// 放棄
					}
					else
					{
						adr--;
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
		return word;
	}

	function log( s, val1, cal1, val2, cal2, v )
	{
		console.log( s+":", val1, '"'+cal1+'"', val2, '"'+cal2+'"', ":", v );
	}
	const pri = { "+":1, "-":1, "*":2, "/":2, "^":3, "":0, ")":0 };

	//-----------------------------------------------------------------------------
	function calc( [val1, cal1], [val2, cal2] )
	//-----------------------------------------------------------------------------
	{
		if ( pri[cal1] == undefined || pri[cal2] == undefined ) {console.log("err-undefine-cal", '"'+cal1+'" or "'+cal2+'"'); return [0,""];}

		if ( pri[cal1] < pri[cal2] ) 
		{
			[val2,cal2] = calc( [val2, cal2], getValcal() );			
		}

		switch( cal1 )
		{
			case "+": val2 = val1 + val2;break;
			case "-": val2 = val1 - val2;break;
			case "*": val2 = val1 * val2;break;
			case "/": val2 = val1 / val2;break;
			case "^": val2 = Math.pow(val1,val2);break;
			case "" : val2 = val2;break;
			default: 
				console.log( "err-cal", '"'+cal1+'"' );
				return [0,""];
		}
		return [val2,cal2];
	}


	//-----------------------------------------------------------------------------
	function getValcal()
	//-----------------------------------------------------------------------------
	{
		let val1 = getToken();

		function getparam()
		{
			getToken(); // '('
			return getValue();
		}

		switch( val1 )
		{

			case "-":
				{
					let [v,c] = getValcal();
					return [-v,c];
				}
				break;

			case "(":	val1 = getValue();	break;

			case "x"	:val1 = x;	break;

			case "PI"	:val1 = Math.PI;break;
			case "RND"	:val1 = Math.random()	;break;

			case "cos"	:val1 = Math.cos( getparam() )	;break;
			case "sin"	:val1 = Math.sin( getparam() )	;break;
			case "tan"	:val1 = Math.tan( getparam() )	;break;

			case "acos"	:val1 = Math.acos( getparam() )	;break;
			case "asin"	:val1 = Math.asin( getparam() )	;break;
			case "atan"	:val1 = Math.atan( getparam() )	;break;

			case "cosh"	:val1 = Math.cosh( getparam() )	;break;
			case "sinh"	:val1 = Math.sinh( getparam() )	;break;
			case "tanh"	:val1 = Math.tanh( getparam() )	;break;

			case "acosh":val1 = Math.acosh( getparam() );break;
			case "asinh":val1 = Math.asinh( getparam() );break;
			case "atanh":val1 = Math.atanh( getparam() );break;

			case "sqrt"	:val1 = Math.sqrt( getparam() )	;break;
			case "cbrt"	:val1 = Math.cbrt( getparam() )	;break;

			case "log"	:val1 = Math.log( getparam() )	;break;
			case "exp"	:val1 = Math.exp( getparam() )	;break;

			case "abs"	:val1 = Math.abs( getparam() )	;break;
			case "rad"	:val1 = getparam()/180*Math.PI	;break;


		}

		if ( isFinite(val1) ) val1 = Number(val1);
		else console.log( "err-Finite", '"'+val1+'"' );

		return [val1,getToken()];
	}


	//-----------------------------------------------------------------------------
	function getValue()
	//-----------------------------------------------------------------------------
	{
		let [val,cal] = getValcal();
		while( pri[cal] > 0 )
		{
			[val,cal] = calc( [val,cal], getValcal() );
		}
		return val;
	}

	// calcFunc main
	return getValue();

}

//-----------------------------------------------------------------------------
function update_paint()
//-----------------------------------------------------------------------------
{
	cls();

	let xmax = document.getElementById( "html_xmax" ).value;
	let xmin = document.getElementById( "html_xmin" ).value;
	let ymax = document.getElementById( "html_ymax" ).value;
	let ymin = document.getElementById( "html_ymin" ).value;
	let strFunc = document.getElementById( "html_func" ).value;

	xmax = calcFunc( xmax, 0 );
	xmin = calcFunc( xmin, 0 );
	ymax = calcFunc( ymax, 0 );
	ymin = calcFunc( ymin, 0 );

	if (xmin>=xmax) 
	{
		xmin = xmax-1; 
		document.getElementById( "html_xmin" ).value = xmin;
	}
	if (ymin>=ymax) 
	{
		ymin = ymax-1; 
		document.getElementById( "html_ymin" ).value = ymin;
	}


	//====
	
	let scrn_x1 = 32;
	let scrn_y1 = 0;
	let scrn_x2 = html_canvas.width;
	let scrn_y2 = html_canvas.height -32;
	
	{// 基本軸描画

		// 縦軸
		line( scrn_x1, 0, scrn_x1, html_canvas.height );
		print( scrn_x1-30,10, ymax.toString());
		print( scrn_x1-30,scrn_y2-2, ymin.toString());

		// 横軸
		line( 0, scrn_y2, scrn_x2, scrn_y2 );
		print( scrn_x1+2,scrn_y2+12, xmin.toString());
		print( scrn_x2-30,scrn_y2+12, xmax.toString());
	}

	{// グラフ描画
		let W = scrn_x2-scrn_x1;
		let H = scrn_y2-scrn_y1;

		let st = (xmax-xmin)/W;
		let sc = (ymax-ymin);

		let rx = scrn_x1;
		let ry = scrn_y2- (calcFunc( strFunc, 0 )-ymin)/sc*H;
		for ( let x = xmin ; x <= xmax ; x+= st )
		{
			let y = calcFunc( strFunc, x );

			//--	
			let px = scrn_x1+ (x-xmin)/st;
			let py = scrn_y2- (y-ymin)/sc*H;
			line( px, py, rx, ry );

			if ( x == xmin )
			{
				print( scrn_x1-30,py, y.toFixed(2));
			}
			rx = px;
			ry = py;
		}
	}

}

let g_AudioContext = window.AudioContext || window.webkitAudioContext;

var channels = 2;

// AudioContextのサンプルレートで2秒間の空のステレオバッファを生成する
let g_audioCtx= new g_AudioContext();
var g_frameCount = g_audioCtx.sampleRate * 2.0;
var g_myArrayBuffer = g_audioCtx.createBuffer(channels, g_frameCount, g_audioCtx.sampleRate);


//-----------------------------------------------------------------------------
function html_update_sound()
//-----------------------------------------------------------------------------
{
	let strFunc = document.getElementById( "html_func" ).value;

	// sound
	{
		// バッファにホワイトノイズを書き込む;
		// 単なる-1.0から1.0の間の乱数の値である
		for (var channel = 0; channel < channels; channel++) 
		{
			// 実際のデータの配列を得る
			var nowBuffering = g_myArrayBuffer.getChannelData(channel);
			for (var i = 0; i < g_frameCount; i++) 
			{
				// Math.random()は[0; 1.0]である
				// 音声は[-1.0; 1.0]である必要がある
				let v =  calcFunc( strFunc, i );
				if ( v>1.0)v=1.0;
				if ( v<-1.0)v=-1.0;
				nowBuffering[i] = calcFunc( strFunc, i );
				
			}
		}
console.log(g_audioCtx.sampleRate);

		// AudioBufferSourceNodeを得る
		// これはAudioBufferを再生するときに使うAudioNodeである
		var source = g_audioCtx.createBufferSource();

		// AudioBufferSourceNodeにバッファを設定する
		source.buffer = g_myArrayBuffer;

		// AudioBufferSourceNodeを出力先に接続すると音声が聞こえるようになる
		source.connect(g_audioCtx.destination);

		// 音源の再生を始める
		source.start();
	}

}

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
		html_canvas.width	= document.getElementById( "html_size_w" ).value;
		html_canvas.height	= document.getElementById( "html_size_h" ).value;


	requestAnimationFrame( update_paint );
}


//HTMLとのやり取り関連
//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	const	KEY_TAB	= 9;
	const	KEY_CR	= 13;
	const	KEY_0	= 48;	//0x30
	const	KEY_1	= 49;	//0x31
	const	KEY_2	= 50;	//0x32
	const	KEY_3	= 51;	//0x33
	const	KEY_4	= 52;	//0x34
	const	KEY_5	= 53;	//0x35
	const	KEY_6	= 54;	//0x36
	const	KEY_7	= 55;	//0x37
	const	KEY_8	= 56;	//0x38
	const	KEY_9	= 57;	//0x39
	const	KEY_A	= 65;	//0x41
	const	KEY_B	= 66;	//0x42
	const	KEY_C	= 67;	//0x43
	const	KEY_D	= 68;	//0x44
	const	KEY_E	= 69;	//0x45
	const	KEY_F	= 70;	//0x46
	const	KEY_G	= 71;	//0x47
	const	KEY_H	= 72;	//0x48
	const	KEY_I	= 73;	//0x49
	const	KEY_J	= 74;	//0x4a
	const	KEY_K	= 75;	//0x4b
	const	KEY_L	= 76;	//0x4c
	const	KEY_M	= 77;	//0x4d
	const	KEY_N	= 78;	//0x4e
	const	KEY_O	= 79;	//0x4f
	const	KEY_P	= 80;	//0x50
	const	KEY_Q	= 81;	//0x51
	const	KEY_R	= 82;	//0x52
	const	KEY_S	= 83;	//0x53
	const	KEY_T	= 84;	//0x54
	const	KEY_U	= 85;	//0x55
	const	KEY_V	= 86;	//0x56
	const	KEY_W	= 87;	//0x57
	const	KEY_X	= 88;	//0x58
	const	KEY_Y	= 89;	//0x59
	const	KEY_Z	= 90;	//0x5a
	const	KEY_LEFT	= 37;
	const	KEY_UP		= 38;
	const	KEY_RIGHT	= 39;
	const	KEY_DOWN	= 40;
	
	const	KEY_SHIFT	= 16;


	let	c = ev.keyCode;

	if ( c == KEY_CR ) 
	{
//		requestAnimationFrame( update_paint );
	}
	if ( c == KEY_SHIFT ) 
	{
		html_update_sound();
//		requestAnimationFrame( update_paint );
	}
}
//-----------------------------------------------------------------------------
function html_onclick()
//-----------------------------------------------------------------------------
{
	// javascript側で初期のキャンバスサイズを決める
	{
		html_canvas.width	= document.getElementById( "html_size_w" ).value;
		html_canvas.height	= document.getElementById( "html_size_h" ).value;

//		document.getElementById( "html_size_x" ).value = html_canvas.width;
//		document.getElementById( "html_size_y" ).value = html_canvas.height;
	}
	
	requestAnimationFrame( update_paint );
}