//let g2=html_canvas2.getContext('2d');

//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( j = 0 ; j < n ; j++ ) r += Math.random();
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
/*
	//-----------------------------------------------------------------------------
	pset( x, y, val )
	//-----------------------------------------------------------------------------
	{
		let adr = (y*this.img.width+x)*4;
		this.img.data[ adr+3 ] = val?0:0xff;
	}
	//-----------------------------------------------------------------------------
	point( x, y )
	//-----------------------------------------------------------------------------
	{
		let adr = (y*this.img.width+x)*4;
		return this.img.data[ adr+3 ]?0:1;
	}
*/
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
/*
	//-----------------------------------------------------------------------------
	pointa( x, y )
	//-----------------------------------------------------------------------------
	{
		let adr = (y*this.img.width+x)*4;
		return this.img.data[ adr+3 ];
	}
*/
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
function pat_calc( buf1, pat, w, h )
//-----------------------------------------------------------------------------
{
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
function calc_autolevel( buf, SZ )
//-----------------------------------------------------------------------------
{
	let max = Number.MIN_SAFE_INTEGER;
	let min = Number.MAX_SAFE_INTEGER;

	for ( let i = 0 ; i < SZ*SZ ; i++ )
	{
		let a = buf[i];
		max = Math.max( max, a );
		min = Math.min( min, a );
	}
	let rate = 1.0/(max-min);
	for ( let i = 0 ; i < SZ*SZ ; i++ )
	{
		buf[i] = (buf[i] - min)*rate;
	}
}

// パラポライズ
//-----------------------------------------------------------------------------
function calc_parapolize( buf, n, SZ )
//-----------------------------------------------------------------------------
{
	for ( let i = 0 ; i < SZ*SZ ; i++ )
	{
		let a = buf[i];
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
}

let g_SZ;
let g_buf;
//-----------------------------------------------------------------------------
function genSeed( SZ )
//-----------------------------------------------------------------------------
{
	// ランダムの種作成
	for ( let i = 0 ; i < SZ*SZ ; i++ )
	{
		g_buf[i] = rand(1);
	}

	function pset( x, y, val )
	{
		g_buf[ (y*SZ+x) ] = val;
	}
	
	//	pset( 10,10,11);
}
//-----------------------------------------------------------------------------
function main( SZ )
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

	function drawCanvas( canvas )
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
		gra.print(0,gra.canvas.height, canvas.id );
	}
	
	//--
	
	// ランダムの種をコピー
	let buf = Array.from(g_buf);
	drawCanvas( html_canvas1 );

	// ブラーフィルタ適用
	{
		let num = html_getValue_textid("blur");
		for ( let i = 0 ; i < num ; i++ ) 	buf = pat_calc( buf, pat33, SZ, SZ );
	}
	drawCanvas( html_canvas2 );

	// 自動レベル調整 0～1.0の範囲に正規化
	calc_autolevel( buf, SZ );
	drawCanvas( html_canvas3 );

	// ローパスフィルタ
	{
		let val =  html_getValue_textid("low");
		for ( let i = 0 ; i < SZ*SZ ; i++ )
		{
			if ( buf[i] < val ) buf[i] = val;
		}
	}
	drawCanvas( html_canvas4 );

	// 自動レベル調整 0～1.0の範囲に正規化
	calc_autolevel( buf, SZ );
	drawCanvas( html_canvas5 );

	// パラポライズ
	{
		let val =  html_getValue_textid("col");
		calc_parapolize( buf, val, SZ );
		drawCanvas( html_canvas6 );
	}

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
	main( g_SZ );

}


//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_SZ = html_getValue_comboid( "html_combo" );
	g_buf = new Array( g_SZ*g_SZ );

	genSeed( g_SZ );
	hotstart();
}
