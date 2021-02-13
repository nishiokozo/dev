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
function update()
//-----------------------------------------------------------------------------
{

	cls();

	let xmax = document.getElementById( "html_xmax" ).value*1.0;
	let xmin = document.getElementById( "html_xmin" ).value*1.0;
	let ymax = document.getElementById( "html_ymax" ).value*1.0;
	let ymin = document.getElementById( "html_ymin" ).value*1.0;
	let strFunc = document.getElementById( "html_func" ).value;

	//-----------------------------------------------------------------------------
	function calcFunc( str, x )
	//-----------------------------------------------------------------------------
	{
		let adr = 0;

		//-----------------------------------------------------------------------------
		function calc( [val1, cal1], [val2, cal2] )
		//-----------------------------------------------------------------------------
		{
			function log( s, val1, cal1, val2, cal2, v )
			{
				console.log( s+":", val1, '"'+cal1+'"', val2, '"'+cal2+'"', ":", v );

			}

			const pri = { "+":1, "-":1, "*":2, "/":2, "^":3, "":0, ")":0 };

			//log( "calc a", val1, cal1, val2, cal2, pri[cal1] < pri[cal2] );

			if ( pri[cal1] == undefined || pri[cal2] == undefined ) console.log("err-undefine-cal", '"'+cal1+'" or "'+cal2+'"'); 

			if ( pri[cal1] < pri[cal2] ) 
			{
				[val2,cal2] = calc( [val2, cal2], getValcal() );			

				//log( "calc b", val1, cal1, val2, cal2, pri[cal1] < pri[cal2] );

				if ( pri[cal1] < pri[cal2] ) [val2,cal2] = calc( [val2, cal2], getValcal() );			
			}

			let val3 =0;
			//log( "calc c", val1, cal1, val2, cal2, pri[cal1] < pri[cal2] );
			switch( cal1 )
			{
				case "+": val3 = val1 + val2;break;
				case "-": val3 = val1 - val2;break;
				case "*": val3 = val1 * val2;break;
				case "/": val3 = val1 / val2;break;
				case "^": val3 = Math.pow(val1,val2);break;
				case "": val3 = val2;break;
				default: console.log( "err-cal", '"'+cal1+'"' );
				
			}

			return [val3,cal2];
		}


		//-----------------------------------------------------------------------------
		function getValcal()
		//-----------------------------------------------------------------------------
		{
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

			let val1 = getToken();
			switch( val1 )
			{

				case "x":
					{
						val1 = x;
					}
					break;


				case "-":
					{
						let [v,c] = getValcal();
						return [-v,c];
					}
					break;

				case "(":
						val1 = calc( [0,""], getValcal() )[0];	//[1]:')'
					break;

				case "PI":
					{
						val1 = Math.PI;
					}
					break;


				case "cos":
					{
						getToken(); // '('
						val1 = Math.cos( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "sin":
					{
						getToken(); // '('
						val1 = Math.sin( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "tan":
					{
						getToken(); // '('
						val1 = Math.tan( calc( [0,""], getValcal() )[0] );
					}
					break;


				case "acos":
					{
						getToken(); // '('
						val1 = Math.acos( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "asin":
					{
						getToken(); // '('
						val1 = Math.asin( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "atan":
					{
						getToken(); // '('
						val1 = Math.atan( calc( [0,""], getValcal() )[0] );
					}
					break;


				case "cosh":
					{
						getToken(); // '('
						val1 = Math.cosh( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "sinh":
					{
						getToken(); // '('
						val1 = Math.sinh( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "tanh":
					{
						getToken(); // '('
						val1 = Math.tanh( calc( [0,""], getValcal() )[0] );
					}
					break;


				case "acosh":
					{
						getToken(); // '('
						val1 = Math.acosh( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "asinh":
					{
						getToken(); // '('
						val1 = Math.asinh( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "atanh":
					{
						getToken(); // '('
						val1 = Math.atanh( calc( [0,""], getValcal() )[0] );
					}
					break;


				case "sqrt":
					{
						getToken(); // '('
						val1 = Math.sqrt( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "cbrt":
					{
						getToken(); // '('
						val1 = Math.cbrt( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "cbrt":
					{
						getToken(); // '('
						val1 = Math.cbrt( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "exp":
					{
						getToken(); // '('
						val1 = Math.exp( calc( [0,""], getValcal() )[0] );
					}
					break;

				case "rad":
					{
						getToken(); // '('
						val1 = val/180*Math.PI;
					}
					break;

			}

			if ( isFinite(val1) ) val1 = sgn*Number(val1);


			return [val1,getToken()];
		}

		// calcFunc main

		return calc( [0,""], getValcal() )[0];

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
		for ( let x = xmin ; x <= xmax ; x+= st )
		{
			let y = calcFunc( strFunc, x );

			//--	
			let px = scrn_x1+ x/st;
			let py = scrn_y2-  (y-ymin)/sc*H;
			line( px, py, px, py-1 );

			if ( x == xmin )
			{
				print( scrn_x1-30,py, y.toFixed(2));
			}
		}
	}

}
/*

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	const	KEY_CR	= 13;
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

	let	c = ev.keyCode;
}
*/
// onloadより速いタイミングで決定
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	//if(0)
	{// javascript側でキャンバスサイズを決める
	//	html_canvas.width = window.innerWidth/2;//-40;
	//	html_canvas.height = html_canvas.width*(9/16);
	//	html_canvas.style.border="1px solid";
	}

	requestAnimationFrame( update );
}


//HTMLとのやり取り関連

//-----------------------------------------------------------------------------
function html_onclick()
//-----------------------------------------------------------------------------
{
	requestAnimationFrame( update );
}