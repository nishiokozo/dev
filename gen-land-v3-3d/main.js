"use strict";

let ctx=html_canvas6.getContext('2d');
//-----------------------------------------------------------------------------
function rad( v )
//-----------------------------------------------------------------------------
{
	return v/180*Math.PI;
}
//-----------------------------------------------------------------------------
function deg( v )
//-----------------------------------------------------------------------------
{
	return v*180/Math.PI;
}
//-----------------------------------------------------------------------------
function cls( col= "#FFF" )
//-----------------------------------------------------------------------------
{
	ctx.fillStyle = col;
	ctx.fillRect( 0, 0, html_canvas6.width, html_canvas6.height );
}

//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey, col= "#000" )
//-----------------------------------------------------------------------------
{
	ctx.beginPath();
	ctx.strokeStyle = col;
	ctx.lineWidth = 1.0;
	ctx.moveTo( sx, sy );
	ctx.lineTo( ex, ey );
	ctx.closePath();
	ctx.stroke();
}
//-----------------------------------------------------------------------------
let fill= function( sx,sy, ex,ey, col="#000"   )
//-----------------------------------------------------------------------------
{

//	ctx.beginPath();
//	ctx.fillStyle = col;
//	ctx.strokeStyle = col;
  //  ctx.rect(sx,sy,ex-sx,ey-sy);
	//ctx.closePath();
//	ctx.fill();
//	ctx.stroke();

ctx.beginPath();
ctx.rect(sx,sy,ex-sx,ey-sy);
ctx.fillStyle = col;//"#000";
ctx.fill();
	ctx.closePath();
//	ctx.beginPath();
// Set line width

}

//-----------------------------------------------------------------------------
function print( tx, ty, str, col= "#000"  )
//-----------------------------------------------------------------------------
{
	ctx.beginPath();
	ctx.font = "10px monospace";
	ctx.fillStyle = "#000";
	ctx.fillText( str, tx, ty );
	ctx.closePath();

}

///////////////

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

	function round( px, py )
	{
		if ( px < 0   ) px = w-1;
		else
		if ( px >= w ) px = 0;

		if ( py < 0   ) py = h-1;
		else
		if ( py >= h ) py = 0;

		return (w*py + px); 
	}


	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{

			let v = 0;
			for ( let m = 0 ; m < pat.length ; m++ )
			{
				for ( let n = 0 ; n < pat[m].length ; n++ )
				{
					// ラウンドする
					let a = round( x+(m-edge), y+(n-edge) );


					v += buf1[ a ] * pat[m][n];
				}
			}
			buf2[ (w*y + x) ] = v;
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

// ノイズをわざと乗せる
//-----------------------------------------------------------------------------
function cald_addnoise( buf0, size )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let i = 0 ; i < size ; i++ ) 
	{
		let a = buf0[i];
		let s = 1/8;
		a+= g_bufNoiseD[i]*s;
		a-= g_bufNoiseE[i]*s;
		if ( a > 1.0 ) a=1.0;
		if ( a < 0.0 ) a=0.0;
		buf[i] = a;
	}
	return buf;
}

// ノイズカット 等高線に向かない面に満たないノイズを取り除く
//-----------------------------------------------------------------------------
function calc_cutnoise( buf0, w, h )
//-----------------------------------------------------------------------------
{
	// patで乗算
	let buf = Array.from( buf0 );

	function getVal( px, py )
	{
		if ( px < 0   ) px = w-1;
		else
		if ( px >= w ) px = 0;

		if ( py < 0   ) py = h-1;
		else
		if ( py >= h ) py = 0;

		let adr = (w*py + px); 
		
		return buf[adr];

	}

	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
		
			let a1 = getVal( x-1, y+1 );
			let a2 = getVal( x  , y+1 );
			let a3 = getVal( x+1, y+1 );
			let a4 = getVal( x-1, y   );
			let a5 = getVal( x  , y   );
			let a6 = getVal( x+1, y   );
			let a7 = getVal( x-1, y-1 );
			let a8 = getVal( x  , y-1 );
			let a9 = getVal( x+1, y-1 );
			
			if ( a5 == 1 )
			{
				if ( a4 && a7 && a8 ) continue;
				if ( a8 && a9 && a6 ) continue;
				if ( a4 && a1 && a2 ) continue;
				if ( a2 && a3 && a6 ) continue;
				buf[w*y + x] = 0;
			}
			else
			{
				if ( !a4 && !a7 && !a8 ) continue;
				if ( !a8 && !a9 && !a6 ) continue;
				if ( !a4 && !a1 && !a2 ) continue;
				if ( !a2 && !a3 && !a6 ) continue;
				buf[w*y + x] = 1;
			}
		}
	}
	return buf;
}

// エッジを作る。0,0だと島になりやすく、1,1で無効、0,1だと横だけつながる世界
//-----------------------------------------------------------------------------
function calc_makeedge( buf0, w, h, valw, valh )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let i = 0 ; i < w ; i++ )
	{
		buf[ w*( h-1)+i ] *= valw; 
		buf[ w*0+i ] *= valw;
	}
	for ( let i = 0 ; i < h ; i++ )
	{
		buf[ w*i+0 ] *= valh;
		buf[ w*i+ (h-1) ] *= valh;
	}
	return buf;
}
// 穴をあける
//-----------------------------------------------------------------------------
function calc_makehole( buf0, w, h, sx, sy, sr, val )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let r = 1 ; r < sr  ; r++ )
	{
		for ( let th = 0 ; th < Math.PI*2 ; th+=rad(1) )
		{
			let x = Math.floor( r*Math.cos(th) )+sx;
			let y = Math.floor( r*Math.sin(th) )+sy;
			
			buf[ y*w+x ] = val;
		}
	}
	return buf;
}

class vec3
{
	constructor( x, y, z )
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
};
//------------------------------------------------------------------------------
function rotYaw( v, th )
//------------------------------------------------------------------------------
{
   	let s = Math.sin(th);
	let c = Math.cos(th);
	// c,  0, -s,
	// 0,  1,  0,
    // s,  0,  c
	let nx = v.x*c			- v.z*s;
	let ny =		 v.y;
	let nz = v.x*s			+ v.z*c;

	return new vec3( nx, ny, nz );
}
//------------------------------------------------------------------------------
function rotPitch( v, th )
//------------------------------------------------------------------------------
{
	let s = Math.sin(th);
	let c = Math.cos(th);
	// 1,  0,  0,
	// 0,  c,  s,
	// 0, -s,  c
	let nx = v.x;
	let ny =	 v.y*c + v.z*s;
	let nz =	-v.y*s + v.z*c;

	return new vec3( nx, ny, nz );
}
//------------------------------------------------------------------------------
function rotRoll( v, th )
//------------------------------------------------------------------------------
{
	let s = Math.sin(th);
	let c = Math.cos(th);
	// c,  s,  0,
	//-s,  c,  0,
	// 0,  0,  1
	let nx = v.x*c + v.y*s;
	let ny =-v.x*s + v.y*c;
	let nz = 				v.z;

	return new vec3( nx, ny, nz );
}

let g_SZ;
let g_bufA = [];
let g_bufB = [];
let g_bufC = [];
let g_bufNoiseD = [];
let g_bufNoiseE = [];
let g_rot = 0;
let SZ;
let buf4= [];
let g_rate;
//-----------------------------------------------------------------------------
function update_3d(  )
//-----------------------------------------------------------------------------
{
	cls( "#000");
	let cam = new vec3( 0,30,0);
	let sz = html_canvas6.height/2;
	let sc = 200;
	function pset3d( v )
	{
		let x = v.x*sc - cam.x;
		let y = v.y*sc - cam.y;
		let z = v.z*sc - cam.z;
	
		x = x / (z+sz);
		y = y / (z+sz);

		let px=Math.floor((x+0.5)*html_canvas6.width);
		let py=html_canvas6.height-Math.floor((y+0.5)*html_canvas6.height);
		fill(px,py,px+2,py+2,"#2F2");

	} 
	

	for ( let py = 0 ; py < SZ ; py++ )
	{
		for ( let px = 0 ; px < SZ ; px++ )
		{
			let adr = py*SZ+px;
			let high = buf4[ adr ];
//			if ( high > 0 )
			{
				
				let v = rotYaw( 
					new vec3(
						px/SZ-0.5,
						high*g_rate,
						py/SZ-0.5
					), 
					g_rot 
				);
				
				pset3d( v );	
			}
		}
	}
	
	g_rot+=rad(1);
//console.log(g_rot);
	requestAnimationFrame( update_3d );
}
//-----------------------------------------------------------------------------
function update_map( SZ )
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

	if(0)
	{
		// ベクター化しやすいように縁取り
		buf1 = calc_makeedge( buf1, SZ, SZ, 0,0 );
		buf2 = calc_makeedge( buf2, SZ, SZ, 0,0 );
		buf3 = calc_makeedge( buf3, SZ, SZ, 0,0 );

		// 中央に穴をあける
		buf1 = calc_makehole( buf1, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
		buf2 = calc_makehole( buf2, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
		buf3 = calc_makehole( buf3, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
	//	drawCanvas( html_canvas6, buf1, "A" );
	}

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


	
	{//合成
		let p1 = document.getElementById( "html_bp1" ).value*1;
		let p2 = document.getElementById( "html_bp2" ).value*1;
		let p3 = document.getElementById( "html_bp3" ).value*1;
		for ( let x = 0 ; x < SZ*SZ ; x++ )
		{
			buf4[x] =(buf1[x]*p1+buf2[x]*p2+buf3[x]*p3)/(p1+p2+p3);
		}
	}

	// 自動レベル調整
	buf4 = calc_autolevel(buf4, SZ*SZ);
	//drawCanvas( html_canvas5, buf4, "合成" );


	// ローパスフィルタ
	buf4 = calc_lowpass( buf4, SZ*SZ );
	// 自動レベル調整
	buf4 = calc_autolevel(buf4, SZ*SZ);

	// パラポライズ
//	let val =  html_getValue_textid("col");
//	buf4 = calc_parapolize( buf4, val, SZ );
	drawCanvas( html_canvas5, buf4,"合成" );

	return buf4;

	
//	drawCanvas( html_canvas1, buf4,"等高線" );

/*
	for ( let y = 0 ; y < SZ ; y++ )
	{
		for ( let x = 0 ; x < SZ ; x++ )
		{
			let adr = y*SZ+x;

			let x1 = x-1;
			let x2 = x;
			let x3 = x+1;
			if ( x1 <  0  ) x1 += SZ;
			if ( x3 >= SZ ) x1 -= SZ;

			let p1 = buf4[ y*SZ+x1 ];
			let p2 = buf4[ y*SZ+x2 ];
			let p3 = buf4[ y*SZ+x3 ];


			if ( p1 == 0 && p2 == 1 )
			{
				sx = x;
				sy = y;
			}
			if ( p2 == 1 && p3 == 0 )
			{
				pos.push({sx:sx,sy:sy,ex:x,ey:y});
			}
		}
	}

	cls();
	let sw = html_canvas6.width/SZ;
	let sh = html_canvas6.height/SZ;
	for ( let a of buf5 )
	{
//console.log( a.sx, a.sy, a.ex, a.ey );
		let s = 5;
		line( a.sx*sw, a.sy*sh, a.ex*sw, a.ey*sh );
	}
//		line( 0,0,100,100 );
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
	let buf= update_map( g_SZ );
SZ = g_SZ;
	g_rate =  document.getElementById( "rate" ).value * 1.0;
	update_3d();

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
		g_bufNoiseD[i] = rand(1);
		g_bufNoiseE[i] = rand(1);
	}



	hotstart();
}


//-----------------------------------------------------------------
function html_setFullscreen()
//-----------------------------------------------------------------
{
	const obj = document.querySelector("#html_canvas6"); 

	if( document.fullscreenEnabled )
	{
		obj.requestFullscreen.call(obj);
	}
	else
	{
		alert("フルスクリーンに対応していません");
	}
}
