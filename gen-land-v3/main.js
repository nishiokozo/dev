"use strict";
//let g2=html_canvas2.getContext('2d');

//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( let j = 0 ; j < n ; j++ ) r += Math.random();
	return r/n;
}

class Gra
{
	//-----------------------------------------------------------------------------
	constructor( w, h, canvas )
	//-----------------------------------------------------------------------------
	{
		this.canvas = canvas;
		this.g = canvas.getContext('2d');
		this.img = this.g.createImageData( w, h );
	}
	//-----------------------------------------------------------------------------
	print( tx, ty, str )
	//-----------------------------------------------------------------------------
	{
		this.g.font = "12px monospace";
		this.g.fillStyle = "#000000";
		this.g.fillText( str, tx+1, ty+1 );
		this.g.fillStyle = "#ffffff";
		this.g.fillText( str, tx, ty );
	}
	//-----------------------------------------------------------------------------
	cls( val )
	//-----------------------------------------------------------------------------
	{
		for (let x=0; x<this.img.width ; x++ )
		for (let y=0; y<this.img.height ; y++ )
		{
			let adr = (y*this.img.width+x)*4;
			this.img.data[ adr +0 ] = val?0xff:0;
			this.img.data[ adr +1 ] = val?0xff:0;
			this.img.data[ adr +2 ] = val?0xff:0;
			this.img.data[ adr +3 ] = 0xff;
		}
	}
	//-----------------------------------------------------------------------------
	pseta( x, y, val )
	//-----------------------------------------------------------------------------
	{
		if ( val > 1 ) val = 1;
		if ( val < 0 ) val = 0;
		val = (val*255)&0xff;
		let adr = (y*this.img.width+x)*4;
		this.img.data[ adr+0 ] = val;
		this.img.data[ adr+1 ] = val;
		this.img.data[ adr+2 ] = val;
	}
	//-----------------------------------------------------------------------------
	streach()
	//-----------------------------------------------------------------------------
	{
		// -----------------------------------------
		// ImageDataをcanvasに合成
		// -----------------------------------------
		// g   : html_canvas.getContext('2d')
		// img : g.createImageData( width, height )

		this.g.imageSmoothingEnabled = this.g.msImageSmoothingEnabled = 0; // スムージングOFF
		{
		// 引き伸ばして表示
		    let cv=document.createElement('canvas');				// 新たに<canvas>タグを生成
		    cv.width = this.img.width;
		    cv.height = this.img.height;
			cv.getContext("2d").putImageData( this.img,0,0);				// 作成したcanvasにImageDataをコピー
			{
				let sx = 0;
				let sy = 0;
				let sw = this.img.width;
				let sh = this.img.height;
				let dx = 0;
				let dy = 0;
				let dw = this.canvas.width;
				let dh = this.canvas.height;
				this.g.drawImage( cv,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Imageは引き延ばせる
			}
			
		}
	}
}
//-----------------------------------------------------------------------------
function pat_normalize( pat )
//-----------------------------------------------------------------------------
{
	let amt = 0;
	for ( let m = 0 ; m < pat.length ; m++ )
	{
		for ( let n = 0 ; n < pat[m].length ; n++ )
		{
			amt += pat[m][n];
		}
	}
	for ( let m = 0 ; m < pat.length ; m++ )
	{
		for ( let n = 0 ; n < pat[m].length ; n++ )
		{
			pat[m][n] /= amt;
		}
	}
	return pat;
}

//-----------------------------------------------------------------------------
function calc_blur( buf1, pat, w, h )
//-----------------------------------------------------------------------------
{
	// patで乗算
	let buf2 = new Array( buf1.length );
	let edge = Math.floor(pat.length/2);

	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			let adr = (w*y + x); 

			let v = 0;
			for ( let m = 0 ; m < pat.length ; m++ )
			{
				for ( let n = 0 ; n < pat[m].length ; n++ )
				{
					// ラウンドする
					let px = x+(m-edge);
					let py = y+(n-edge);
		
					if ( px < 0   ) px = w-1;
					else
					if ( px >= w ) px = 0;

					if ( py < 0   ) py = h-1;
					else
					if ( py >= h ) py = 0;

					let a = (w*py + px); 

					v += buf1[ a ] * pat[m][n];
				}
			}
			buf2[ adr ] = v;
		}
	}
	return buf2;
}
//-----------------------------------------------------------------------------
function pat_calc_rain( buf1, pat, w, h, rate )
//-----------------------------------------------------------------------------
{
	// patで水流シミュレーション
	let buf2 = new Array( buf1.length );
	let edge = Math.floor(pat.length/2);

	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			let adr = (w*y + x); 

			let base_high = buf1[ w*y+x ]; // 基準となる中心の高さ
/*			
			let cntRain = 0;
			let cntAll = 0;
			for ( let m = 0 ; m < pat.length ; m++ )
			{
				for ( let n = 0 ; n < pat[m].length ; n++ )
				{
					// ラウンドする
					let px = x+(m-edge);
					let py = y+(n-edge);
		
					if ( px < 0   ) px = w-1;
					else
					if ( px >= w ) px = 0;

					if ( py < 0   ) py = h-1;
					else
					if ( py >= h ) py = 0;

					let adr = (w*py + px); 

					if ( base_high < buf1[ adr ] )
					{
						// 高いところには流れない
					}
					else
					{
						// その分低いところに集まる
						cntRain++;
					}
					cntAll++;

				}
			}
			let mizu = cntRain/cntAll;//（均等配分）
mizu*=rate;
*/
let v = 0;
			for ( let m = 0 ; m < pat.length ; m++ )
			{
				for ( let n = 0 ; n < pat[m].length ; n++ )
				{
					// ラウンドする
					let px = x+(m-edge);
					let py = y+(n-edge);
		
					if ( px < 0   ) px = w-1;
					else
					if ( px >= w ) px = 0;

					if ( py < 0   ) py = h-1;
					else
					if ( py >= h ) py = 0;

					let adr = (w*py + px); 

					let a = buf1[ adr ];
					if ( base_high < a )
					{
						// 高いところには流れない
					}
					else
					{
						// 流れ込んだ分削られる
						v = - rate;
					}

				}
			}
			buf2[ adr ] = buf1[ adr ] + v;
		}
	}
	return buf2;
}
//-----------------------------------------------------------------------------
function draw_buf( gra, buf )
//-----------------------------------------------------------------------------
{
	let h = gra.img.height;
	let w = gra.img.width
	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			let v = buf[ w*y + x ];
			gra.pseta( x, y, v );
		}
	}
}
//-----------------------------------------------------------------------------
function pat_gauss2d( size, sigma )
//-----------------------------------------------------------------------------
{
	//-----------------------------------------------------------------------------
	function gauss( x,s )
	//-----------------------------------------------------------------------------
	{
		let u = 0; 
		// u: μミュー	平均
		// s: σシグマ	標準偏差
		return 	1/(Math.sqrt(2*Math.PI*s))*Math.exp( -((x-u)*(x-u)) / (2*s*s) );
	}
	// size  :マトリクスの一辺の大きさ
	// sigma :
	const c = Math.floor(size/2);
	let pat = new Array(size);
	for ( let i = 0 ; i < pat.length ; i++ ) pat[i] = new Array(size);
	for ( let m = 0 ; m < pat.length ; m++ )
	{
		for ( let n = 0 ; n < pat[m].length ; n++ )
		{
			let x = (m-c);
			let y = (n-c);
			let l = Math.sqrt(x*x+y*y);
			pat[m][n] = gauss( l, sigma );
		}
	}
	return pat;

}	
// 自動レベル調整 0～1.0の範囲に正規化
//-----------------------------------------------------------------------------
function calc_autolevel( buf0, size, mode="full" )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);

	let max = Number.MIN_SAFE_INTEGER;
	let min = Number.MAX_SAFE_INTEGER;

	for ( let i = 0 ; i < size ; i++ )
	{
		let a = buf[i];
		max = Math.max( max, a );
		min = Math.min( min, a );
	}
	if ( mode == "full" )
	{
		let rate = 1.0/(max-min);
		for ( let i = 0 ; i < size ; i++ )
		{
			buf[i] = (buf[i] - min)*rate;
		}
	}
	if ( mode == "up" )
	{
		let base = 1.0-max;
		for ( let i = 0 ; i < size ; i++ )
		{
			buf[i] = buf[i] + base;
		}
	}
	return buf;
}

// ローパスフィルタ
//-----------------------------------------------------------------------------
function calc_lowpass( buf0, size )
//-----------------------------------------------------------------------------
{
	let buf = [];
	let val =  html_getValue_textid("low");
	for ( let i = 0 ; i < size ; i++ )
	{
		if ( buf0[i] < val ) 
		{
			buf[i] = val;
		}
		else
		{
			buf[i] = buf0[i];
		}
	}
	return buf;
}

// パラポライズ
//-----------------------------------------------------------------------------
function calc_parapolize( buf0, n, SZ )
//-----------------------------------------------------------------------------
{
	let buf = [];
	for ( let i = 0 ; i < SZ*SZ ; i++ )
	{
		let a = buf0[i];
		for ( let i = 0 ; i < n ; i++ )
		{
			let b = (1.0/n)*(i+1);
			let c = (1.0/(n-1))*i;
			if ( a < b ) 
			{
				a = c;
				break;
			}
		}
		
		buf[i] =a;
	}
	return buf;
}

let g_SZ;
let g_bufA = [];
let g_bufB = [];
let g_bufC = [];
//-----------------------------------------------------------------------------
function update_paint( SZ )
//-----------------------------------------------------------------------------
{
	// 3x3ブラーフィルタ作成
	let pat33 = pat_normalize(
	[
		[1,2,1],
		[2,4,2],
		[1,2,1],
	]);
	// 5x5ガウスブラーフィルタ作成
//	let pat55 = pat_normalize( pat_gauss2d( 5, 1 ) );
	// 9x9ガウスブラーフィルタ作成
	let pat99 = pat_normalize(pat_gauss2d( 9, 2 ) );

	function drawCanvas( canvas, buf, str=null )
	{
		// 画面作成
		let gra = new Gra( SZ, SZ, canvas );
		// 画面クリア
		gra.cls(0);
		// 画面描画
		draw_buf( gra, buf );
		// 画面をキャンバスへ転送
		gra.streach();

		// canvasのID表示
		if ( str == null ) str = canvas.id;
		gra.print(1,gra.canvas.height-1, str );
	}
	
	//--
	
	// ランダムの種をコピー
	let buf1 = Array.from(g_bufA);
	let buf2 = Array.from(g_bufB);
	let buf3 = Array.from(g_bufC);

	// 鞣し
	// ブラーフィルタn回適用
	let num1 = document.getElementById( "html_blur1" ).value*1;
	for ( let i = 0 ; i < num1 ; i++ ) buf1 = calc_blur( buf1, pat33, SZ, SZ, num1 );
	buf1 = calc_autolevel(buf1, SZ*SZ);
	drawCanvas( html_canvas1, buf1, "A" );

	let num2 = document.getElementById( "html_blur2" ).value*1;
	for ( let i = 0 ; i < num2 ; i++ ) buf2 = calc_blur( buf2, pat33, SZ, SZ, num2 );
	buf2 = calc_autolevel(buf2, SZ*SZ);
	drawCanvas( html_canvas2, buf2, "B" );

	let num3 = document.getElementById( "html_blur3" ).value*1;
	for ( let i = 0 ; i < num3 ; i++ ) buf3 = calc_blur( buf3, pat33, SZ, SZ, num3 );
	buf3 = calc_autolevel(buf3, SZ*SZ);
	drawCanvas( html_canvas3, buf3, "C" );


	let buf9= [];
	
	{//合成
		let p1 = document.getElementById( "html_bp1" ).value*1;
		let p2 = document.getElementById( "html_bp2" ).value*1;
		let p3 = document.getElementById( "html_bp3" ).value*1;
		for ( let x = 0 ; x < SZ*SZ ; x++ )
		{
			buf9[x] =(buf1[x]*p1+buf2[x]*p2+buf3[x]*p3)/(p1+p2+p3);
		}
	}

	// 自動レベル調整
	buf9 = calc_autolevel(buf9, SZ*SZ);
	drawCanvas( html_canvas5, buf9, "合成" );


	// ローパスフィルタ
	buf9 = calc_lowpass( buf9, SZ*SZ );
	// 自動レベル調整
	buf9 = calc_autolevel(buf9, SZ*SZ);


	// パラポライズ
	let val =  html_getValue_textid("col");
	buf9 = calc_parapolize( buf9, val, SZ );
	drawCanvas( html_canvas6, buf9,"等高線" );

/*

	// ブラーフィルタn回適用
	{
//		let num = html_getValue_textid("html_blur1");
//		for ( let i = 0 ; i < num ; i++ ) 	buf1 = calc_blur( buf1, pat33, SZ, SZ );
	}
	drawCanvas( html_canvas2, buf1 );

	// 自動レベル調整 fill:0～1.0の範囲に正規化 up:ハイレベルを1.0に合わせて底上げ
	buf1 = calc_autolevel( buf1, SZ*SZ, "up" );
	drawCanvas( html_canvas3, buf1 );

	{// 参考 雨の降る前のひかく
		let b = calc_autolevel( buf1, SZ*SZ );
		drawCanvas( html_canvas5, b );
	}

	// 雨削られるシミュレーション
	{
		let rate = html_getValue_textid("rain");
		let num  = html_getValue_textid("rain2");
		for ( let i = 0 ; i < num ; i++ ) buf1 = pat_calc_rain( buf1, pat33, SZ, SZ, rate );

		// 自動レベル調整 fill:0～1.0の範囲に正規化 up:ハイレベルを1.0に合わせて底上げ
		buf1 = calc_autolevel( buf1, SZ*SZ );
		drawCanvas( html_canvas6, buf1 );
	}


	// ローパスフィルタ
	{
		let val =  html_getValue_textid("low");
		for ( let i = 0 ; i < SZ*SZ ; i++ )
		{
			if ( buf1[i] < val ) buf1[i] = val;
		}
	}
	drawCanvas( html_canvas4, buf1 );

	// 自動レベル調整 fill:0～1.0の範囲に正規化 up:ハイレベルを1.0に合わせて底上げ
	buf1 = calc_autolevel( buf1, SZ*SZ );
	drawCanvas( html_canvas5, buf1 );

	// パラポライズ
	{
		let val =  html_getValue_textid("col");
		calc_parapolize( buf1, val, SZ );
		drawCanvas( html_canvas6, buf1 );
	}
	// パラポライズ
	{
		let val =  html_getValue_textid("col");
		calc_parapolize( buf1, val, SZ );
		drawCanvas( html_canvas6, buf1 );
	}
*/

}

//-----------------------------------------------------------------------------
function html_getValue_radioname( name ) // ラジオボタン用
//-----------------------------------------------------------------------------
{
	var list = document.getElementsByName( name ); // listを得るときに使うのが name
	for ( let l of list ) 
	{
		if ( l.checked ) return l.value;	
	}
	return undefined;
}
//-----------------------------------------------------------------------------
function html_getValue_textid( id )	// input type="text" id="xxx" 用
//-----------------------------------------------------------------------------
{
	return document.getElementById( id ).value * 1;
}

//-----------------------------------------------------------------------------
function html_getValue_comboid( id )	// select id="xxx" ..option  用
//-----------------------------------------------------------------------------
{
	return document.getElementById( id ).value * 1;
}

//-----------------------------------------------------------------------------
function hotstart()
//-----------------------------------------------------------------------------
{
	update_paint( g_SZ );
}

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_SZ = html_getValue_comboid( "html_size" );

	for ( let i = 0 ; i < g_SZ*g_SZ ; i++ )
	{
		g_bufA[i] = rand(1);
		g_bufB[i] = rand(1);
		g_bufC[i] = rand(1);
	}



	hotstart();
}
