"use strict";



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
function vrotYaw( v, th )
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
function vrotPitch( v, th )
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
function vrotRoll( v, th )
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

//------------------------------------------------------------------------------
function cross( a, b )
//------------------------------------------------------------------------------
{
	return new vec3(
		a.y*b.z-a.z*b.y,
		a.z*b.x-a.x*b.z,
		a.x*b.y-a.y*b.x
	);
}

//------------------------------------------------------------------------------
function length( v )
//------------------------------------------------------------------------------
{
	return Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
}

//------------------------------------------------------------------------------
function normalize( v )
//------------------------------------------------------------------------------
{
	let s = 1/Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
	return new vec3(
		v.x * s,
		v.y * s,
		v.z * s
	);
}
//------------------------------------------------------------------------------
function vadd( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x +b.x,
		a.y +b.y,
		a.z +b.z
	);
}
//------------------------------------------------------------------------------
function vsub( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x -b.x,
		a.y -b.y,
		a.z -b.z
	);
}
//------------------------------------------------------------------------------
function vmul( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x *b.x,
		a.y *b.y,
		a.z *b.z
	);
}
//------------------------------------------------------------------------------
function vdiv( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x /b.x,
		a.y /b.y,
		a.z /b.z
	);
}
//------------------------------------------------------------------------------
function vmax( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		Math.max(a.x,b.x),
		Math.max(a.y,b.y),
		Math.max(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function vmin( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		Math.min(a.x,b.x),
		Math.min(a.y,b.y),
		Math.min(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function vreflect( I, N )
//------------------------------------------------------------------------------
{
	let a = 2*dot(I,N);
 	return vsub( I , vmul( new vec3(a,a,a), N ) );
}
//------------------------------------------------------------------------------
function vrefract( I, N, eta )
//------------------------------------------------------------------------------
{

	let R = new vec3(0,0,0);
	let k = 1.0 - eta * eta * (1.0 - dot(N, I) * dot(N, I));
	if ( k < 0.0 )
	{
		R = new vec3(0,0,0);
	}
	else
	{
//		R = eta * I - (eta * dot(N, I) + sqrt(k)) * N;

		let ve = new vec3(eta,eta,eta);
		let a = vmul( ve , I ); 
		let b = eta * dot(N, I);
		let c = b + Math.sqrt(k);
		let d = vmul( new vec3(c,c,c) , N);
		R = vsub(a , d);

//console.log(11, I,ve,a,b,c,d,R);

	}
	return R;
}

//------------------------------------------------------------------------------
function dot( a, b )
//------------------------------------------------------------------------------
{
	return a.x*b.x + a.y*b.y + a.z*b.z;
}

//---------------------------------------------------------------------
function mperspective( f, aspect, near, far ) 
//---------------------------------------------------------------------
{
	// 参考)http://marina.sys.wakayama-u.ac.jp/~tokoi/?date=20090829
	// f = 1/tan(fovy)
	return [
	  f/aspect		, 0				, 0							, 0	,
	   0			, f				, 0							, 0	,
	   0			, 0				, -(  far+near)/(far-near)	, -1,
	   0			, 0				, -(2*far*near)/(far-near)	, 0
	];
}
//---------------------------------------------------------------------
function mprojection( left, right, bottom, top, near, far ) 
//---------------------------------------------------------------------
{
	return [
	   2*near/(right-left)			, 0								, 0								, 0		,
	   0							, 2*near/(top-bottom)			, 0								, 0		,
	   (right+left)/(right-left)	, (top+bottom)/(top-bottom)		, -(far+near)/(far-near)		, -1	,
	   0							, 0								, -2*far*near/(far-near)		, 0
	];
}
//---------------------------------------------------------------------
function mrotZ(th) 
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	// c,  s,  0,
	//-s,  c,  0,
	// 0,  0,  1
	return [
		c	,	s	,	0	,	0	,
		-s	,	c	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	];
}
//---------------------------------------------------------------------
function mrotX(th) 
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	// 1,  0,  0,
	// 0,  c,  s,
	// 0, -s,  c
	return [
		1	,	0	,	0	,	0	,
		0	,	c	,	s	,	0	,
		0	,	-s	,	c	,	0	,
		0	,	0	,	0	,	1	
	];
}
//---------------------------------------------------------------------
function mrotY(th) 
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	// c,  0, -s,
	// 0,  1,  0,
    // s,  0,  c
	return [
		c	,	0	,	-s	,	0	,
		0	,	1	,	0	,	0	,
		s	,	0	,	c	,	0	,
		0	,	0	,	0	,	1	
	];
}
//---------------------------------------------------------------------
function midentity() 
//---------------------------------------------------------------------
{
	return [
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	];
}
//---------------------------------------------------------------------
function mtrans( v ) 
//---------------------------------------------------------------------
{
if(1)
{
	return [
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		v.x	,	v.y	,	v.z	,	1	
	];
}
else
{
	return [
		1	,	0	,	0	,	v.x	,
		0	,	1	,	0	,	v.y	,
		0	,	0	,	1	,	v.z	,
		0	,	0	,	0	,	1	
	];
}
}
//---------------------------------------------------------------------
function mmul( a, b ) 
//---------------------------------------------------------------------
{

	return [
		a[ 0] * b[ 0] +  a[ 1] * b[ 4] +  a[ 2] * b[ 8] +  a[ 3] * b[12],
		a[ 0] * b[ 1] +  a[ 1] * b[ 5] +  a[ 2] * b[ 9] +  a[ 3] * b[13],
		a[ 0] * b[ 2] +  a[ 1] * b[ 6] +  a[ 2] * b[10] +  a[ 3] * b[14],
		a[ 0] * b[ 3] +  a[ 1] * b[ 7] +  a[ 2] * b[11] +  a[ 3] * b[15],

		a[ 4] * b[ 0] +  a[ 5] * b[ 4] +  a[ 6] * b[ 8] +  a[ 7] * b[12],
		a[ 4] * b[ 1] +  a[ 5] * b[ 5] +  a[ 6] * b[ 9] +  a[ 7] * b[13],
		a[ 4] * b[ 2] +  a[ 5] * b[ 6] +  a[ 6] * b[10] +  a[ 7] * b[14],
		a[ 4] * b[ 3] +  a[ 5] * b[ 7] +  a[ 6] * b[11] +  a[ 7] * b[15],

		a[ 8] * b[ 0] +  a[ 9] * b[ 4] +  a[10] * b[ 8] +  a[11] * b[12],
		a[ 8] * b[ 1] +  a[ 9] * b[ 5] +  a[10] * b[ 9] +  a[11] * b[13],
		a[ 8] * b[ 2] +  a[ 9] * b[ 6] +  a[10] * b[10] +  a[11] * b[14],
		a[ 8] * b[ 3] +  a[ 9] * b[ 7] +  a[10] * b[11] +  a[11] * b[15],

		a[12] * b[ 0] +  a[13] * b[ 4] +  a[14] * b[ 8] +  a[15] * b[12],
		a[12] * b[ 1] +  a[13] * b[ 5] +  a[14] * b[ 9] +  a[15] * b[13],
		a[12] * b[ 2] +  a[13] * b[ 6] +  a[14] * b[10] +  a[15] * b[14],
		a[12] * b[ 3] +  a[13] * b[ 7] +  a[14] * b[11] +  a[15] * b[15]
	];

}







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
///////////////


class Xorshift32 //再現性のあるランダム
{
	constructor(seed = 2463534242) 
	{
		this.y = seed;
	}
	random() 
	{
		  this.y = this.y ^ (this.y << 13); 
		  this.y = this.y ^ (this.y >> 17);
		  this.y = this.y ^ (this.y << 5);
		  return Math.abs(this.y/((1<<31)));
	}
}
const xor32 = new Xorshift32(1);
//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( let j = 0 ; j < n ; j++ ) r += Math.random();
//	for ( let j = 0 ; j < n ; j++ ) r += xor32.random();
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

	function round2d( px, py, w, h )
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
					let a = round2d( x+(m-edge), y+(n-edge),w,h );


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
function calc_autolevel( buf0, size, low=0.0, high=1.0 )
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
	{
		let rate = (high-low)/(max-min);
		for ( let i = 0 ; i < size ; i++ )
		{
			buf[i] = (buf[i] - min)*rate + low;
		}
	}
	return buf;
}

// ローパスフィルタ
//-----------------------------------------------------------------------------
function calc_lowpass( buf0, size, val )
//-----------------------------------------------------------------------------
{
	let buf = [];
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
function calc_parapolize( buf0, n, size )
//-----------------------------------------------------------------------------
{
	let buf = [];
	for ( let i = 0 ; i < size ; i++ )
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
function calc_addnoise( buf0, size, val )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let i = 0 ; i < size ; i++ ) 
	{
		let a = buf0[i];
		a+= g_bufNoiseD[i]*val;
		a-= g_bufNoiseE[i]*val;
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


let g_size;	// マップテクスチャサイズ
let g_scale;
let g_block;
let g_reso;	 // block 辺りの一辺の頂点数 
let g_bufA = [];
let g_bufB = [];
let g_bufC = [];
let g_bufNoiseD = [];
let g_bufNoiseE = [];
let g_rate;
let g_col;
let g_posView;
let g_rotView;
//let g_posObj;
//let g_rotObj;
let g_fovy;
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
	}
	if(0)
	{
		// 中央に穴をあける
		buf1 = calc_makehole( buf1, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
		buf2 = calc_makehole( buf2, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
		buf3 = calc_makehole( buf3, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
	//	drawCanvas( html_canvas6, buf1, "A" );
	}

	// 鞣し
	// ブラーフィルタn回適用
	for ( let i = 0 ; i < g_blur1 ; i++ ) buf1 = calc_blur( buf1, pat33, SZ, SZ, g_blur1 );
	buf1 = calc_autolevel(buf1, SZ*SZ);
	drawCanvas( html_canvas1, buf1, "A" );

	for ( let i = 0 ; i < g_blur2 ; i++ ) buf2 = calc_blur( buf2, pat33, SZ, SZ, g_blur2 );
	buf2 = calc_autolevel(buf2, SZ*SZ);
	drawCanvas( html_canvas2, buf2, "B" );

	for ( let i = 0 ; i < g_blur3 ; i++ ) buf3 = calc_blur( buf3, pat33, SZ, SZ, g_blur3 );
	buf3 = calc_autolevel(buf3, SZ*SZ);
	drawCanvas( html_canvas3, buf3, "C" );

	let buf4= [];

	{//合成
		for ( let x = 0 ; x < SZ*SZ ; x++ )
		{
			buf4[x] =(buf1[x]*g_p1+buf2[x]*g_p2+buf3[x]*g_p3)/(g_p1+g_p2+g_p3);
		}
	}

	// 自動レベル調整
	buf4 = calc_autolevel(buf4, SZ*SZ);
	//drawCanvas( html_canvas5, buf4, "合成" );


	// ローパスフィルタ
	buf4 = calc_lowpass( buf4, SZ*SZ, g_low );

	// 自動レベル調整
	buf4 = calc_autolevel( buf4, SZ*SZ, 0.2 );

	// パラポライズ
	buf4 = calc_parapolize( buf4, g_col, SZ*SZ );

	drawCanvas( html_canvas5, buf4,"合成" );

	return buf4;

}

let g_reqId;

let g_blur1;
let g_blur2;
let g_blur3;
let g_p1;
let g_p2;
let g_p3;
let	g_low;


let gl = html_canvas.getContext('webgl');
if ( gl == null )
{
	alert("ブラウザがwebGL2に対応していません。Safariの場合は設定>Safari>詳細>ExperimentalFeatures>webGL2.0をonにすると動作すると思います。");
}


class Model
{
	hdlIndexbuf;
		hdlVertexbuf;
		hdlColorbuf;
	hdlP;
	hdlV;
	hdlM;
	hdlShader;

	tblIndex = [];
	//tblColor;
	vecOfs;
	flg = false;	

//	M = midentity();
	

	//-----------------------------------------------------------------------------
	initModel( vecOfs, tblVertex, tblColor )
	//-----------------------------------------------------------------------------
	{
		this.flg = true;	
		this.vecOfs = vecOfs;

		this.hdlIndexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.tblIndex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
	    }
	    
		this.hdlVertexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlVertexbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblVertex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
		
		this.hdlColorbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlColorbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblColor ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		// シェーダーコンパイル
		this.bin_vs = gl.createShader( gl.VERTEX_SHADER );
		{
			let src = 
				 "attribute vec3 pos;"
				+"uniform mat4 P;"
				+"uniform mat4 V;"
				+"uniform mat4 M;"
				+"attribute vec3 col;"
				+"varying vec3 vColor;"
				+"void main(void)"
				+"{"
				+   "gl_Position = P*V*M*vec4(pos, 1.0);"
				+   "vColor = col;"
				+"}"
			;
			gl.shaderSource( this.bin_vs, src );
			gl.compileShader( this.bin_vs );
		}

		this.bin_fs = gl.createShader( gl.FRAGMENT_SHADER );
		{
			let src =
				 "precision mediump float;"
				+"varying vec3 vColor;"
				+"void main(void)"
				+"{"
				+	"gl_FragColor = vec4(vColor, 1.0);"
				+"}"
			;
			gl.shaderSource( this.bin_fs, src );
			gl.compileShader( this.bin_fs );
		}

		// シェーダー構成
		{
			this.hdlShader = gl.createProgram();			//WebGLProgram オブジェクトを作成、初期化
			gl.attachShader( this.hdlShader, this.bin_vs );	//シェーダーを WebGLProgram にアタッチ
			gl.attachShader( this.hdlShader, this.bin_fs );	//シェーダーを WebGLProgram にアタッチ
			gl.linkProgram( this.hdlShader );				//WebGLProgram に接続されたシェーダーをリンク

			this.hdlP = gl.getUniformLocation( this.hdlShader, "P" );
			this.hdlV = gl.getUniformLocation( this.hdlShader, "V" );
			this.hdlM = gl.getUniformLocation( this.hdlShader, "M" );

			this.hdl_pos = gl.getAttribLocation( this.hdlShader, "pos" );
			gl.enableVertexAttribArray( this.hdl_pos );

			this.hdl_col = gl.getAttribLocation( this.hdlShader, "col" );
			gl.enableVertexAttribArray( this.hdl_col );
		}
	}

	//-----------------------------------------------------------------------------
	drawModel( matProj, matView )
	//-----------------------------------------------------------------------------
	{
		// 座標計算
		let matModel = midentity();
		this.M = mmul( mtrans( this.vecOfs),matModel );


		// 描画
		gl.useProgram( this.hdlShader );
		{
			gl.uniformMatrix4fv( this.hdlP, false, matProj );
			gl.uniformMatrix4fv( this.hdlV, false, matView );
			gl.uniformMatrix4fv( this.hdlM, false, this.M);

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlVertexbuf );
			gl.vertexAttribPointer( this.hdl_pos, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlColorbuf );
			gl.vertexAttribPointer( this.hdl_col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
			
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			gl.drawElements( gl.TRIANGLES, this.tblIndex.length, gl.UNSIGNED_SHORT, 0 );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
		}
	}

};
let g_yaw = 0;
let g_model = [];
function cam_update( l2, r2, lx, ly, rx, ry )
{

	{// 前後左右
		let v = (l2-r2);
		let spd = Math.sqrt(v*v+lx*lx);
		let dir = g_rotView.y+Math.atan2(lx,-v);
		if ( Math.abs(spd) > 0.2 )
		{
			let sc = 0.1/4/2/2/2;
			g_posView.z += Math.cos( dir )*spd*sc;
			g_posView.x -= Math.sin( dir )*spd*sc;
		}
	}
	{//上下
		let sc = 0.01/2/2;
		if ( Math.abs(ly) > 0.2 )
		{
			g_posView.y += (ly)*sc;
		}
		
	}
	{// 視線回転
		let sc = 1/2/1;
		if ( Math.abs(rx) > 0.2 )
		{
			g_rotView.y += rad(rx*sc);
		}
		if ( Math.abs(ry) > 0.2 )
		{
			g_rotView.x += rad(ry*sc);
		}
	}
}

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


	let	c = ev.keyCode;

	if ( c >= KEY_0 && c <= KEY_9 ) return;
	if ( c == KEY_CR || c == KEY_TAB ) return;

	let l2 = 0;
	let r2 = 0;
	let lx = 0;
	let ly = 0;
	let rx = 0;
	let ry = 0;
	if ( c==KEY_R	) r2 = 1;
	if ( c==KEY_F	) l2 = 1;
	if ( c==KEY_W	) ly =-1;
	if ( c==KEY_S	) ly = 1;
	if ( c==KEY_D	) lx = 1;
	if ( c==KEY_A	) lx =-1;
	if ( c==KEY_UP		) ry =-1;
	if ( c==KEY_DOWN	) ry = 1;
	if ( c==KEY_RIGHT	) rx = 1;
	if ( c==KEY_LEFT	) rx =-1;

	cam_update( l2, r2, lx, ly, rx, ry );
}

let g_matCam;
let g_prevButtons;
//---------------------------------------------------------------------
function	update_gl(time)
//---------------------------------------------------------------------
{


	{
		if(navigator.getGamepads)
		{
			let list = navigator.getGamepads();
			for ( let pad of list )
			{
				if ( pad != null )		
				{
					if ( g_prevButtons == undefined ) g_prevButtons = pad.buttons;
					let lx = pad.axes[0];
					let ly = pad.axes[1];
					let rx = pad.axes[2];
					let ry = pad.axes[3];
					for ( let i = 0 ; i < pad.buttons.length ; i++ )
					{
//						//scr_print( 0,20+10*i, ""+i+":"+pad.buttons[i].value, g_flgNight?"#FFF":"#000" );
//						console.log(  ""+i+":"+pad.buttons[i].value );
					}
					let a  = pad.buttons[ 0].value && !g_prevButtons[ 0].value;
					let b  = pad.buttons[ 1].value && !g_prevButtons[ 1].value;
					let x  = pad.buttons[ 2].value && !g_prevButtons[ 2].value;
					let y  = pad.buttons[ 3].value && !g_prevButtons[ 3].value;
					let l1 = pad.buttons[ 4].value && !g_prevButtons[ 4].value;
					let r1 = pad.buttons[ 5].value && !g_prevButtons[ 5].value;
					let l2 = pad.buttons[ 6].value;
					let r2 = pad.buttons[ 7].value;
					let se = pad.buttons[ 8].value && !g_prevButtons[ 8].value;
					let st = pad.buttons[ 9].value && !g_prevButtons[ 9].value;
					let u = pad.buttons[12].value
					let d = pad.buttons[13].value
					let l = pad.buttons[14].value
					let r = pad.buttons[15].value
					
					cam_update( l2, r2, lx, ly, rx, ry );
/*
					{// 前後左右
						let v = (l2-r2);
						let spd = Math.sqrt(v*v+lx*lx);
						let dir = g_rotView.y+Math.atan2(lx,-v);
						if ( Math.abs(spd) > 0.2 )
						{
							let sc = 0.1/4/2/2/2;
							g_posView.z += Math.cos( dir )*spd*sc;
							g_posView.x -= Math.sin( dir )*spd*sc;
						}
					}
					{//上下
						let sc = 0.01/2/2;
						if ( Math.abs(ly) > 0.2 )
						{
							g_posView.y += (ly)*sc;
						}
						
					}
					{// 視線回転
						let sc = 1/2/1;
						if ( Math.abs(rx) > 0.2 )
						{
							g_rotView.y += rad(rx*sc);
						}
						if ( Math.abs(ry) > 0.2 )
						{
							g_rotView.x += rad(ry*sc);
						}
					}
*/
					g_prevButtons = pad.buttons;
				}
			}
		}
	}

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


	{
		let matProj = mperspective( 1/Math.tan(g_fovy/2), html_canvas.width/html_canvas.height, 0.1, 10000);
		let matView = midentity();
		matView = mtrans( g_posView, matView );
		matView = mmul( matView, mrotY( g_rotView.y )  );
		matView = mmul( matView, mrotX( g_rotView.x )  );
	
		g_yaw+=document.getElementById( "yaw" ).value*1;
		matView = mmul( mrotY( rad(g_yaw) ), matView  );

		for ( let m of g_model )
		{
			m.drawModel( matProj, matView);
		}
	}
	g_reqId = window.requestAnimationFrame( update_gl );
}

//-----------------------------------------------------------------------------
function init_gl( buf, MW, MH, resoW, resoH )
//-----------------------------------------------------------------------------
{
	//-----------------------------------------------------------------------------
	function makeGeom( ox, oy )
	//-----------------------------------------------------------------------------
	{
		function round2d( x, y, w, h )
		{
			if ( x < 0   ) x += w;
			else
			if ( x >= w ) x -= w;

			if ( y < 0   ) y += h;
			else
			if ( y >= h ) y -= h;

			return (w*y + x); 
		}

		let tblVertex = new Array( (resoH+1)*(resoW+1) );
		let tblColor = new Array( (resoH+1)*(resoW+1) );
		let tblIndex = [];


		let idx=0;
		for ( let y = 0 ; y < resoH+1 ; y++ )
		{
			for ( let x = 0 ; x < resoW+1 ; x++ )
			{
				if ( x < resoW && y < resoH )
				{
						{
							let high = buf[ round2d(ox+x,oy+y,MW,MH) ];

							tblVertex[idx*3+0] = ( g_scale*(x/(resoW)-0.5) );
							tblVertex[idx*3+1] = ( high*g_rate );
							tblVertex[idx*3+2] = ( g_scale*(y/(resoH)-0.5) );

							tblColor[idx*3+0] = ( high );
							tblColor[idx*3+1] = ( high );
							tblColor[idx*3+2] = ( high );
						}

						{
							tblIndex.push( idx );
							tblIndex.push( idx+1 );
							tblIndex.push( idx+(resoW+1) );

							tblIndex.push( idx+1 );
							tblIndex.push( idx+(resoW+1) );
							tblIndex.push( idx+(resoW+1)+1 );
						}
						idx++;
				}
				else
				{
						{
							let high = buf[ round2d(ox+x,oy+y,MW,MH) ];
							tblVertex[idx*3+0] = ( g_scale*(x/(resoW)-0.5) );
							tblVertex[idx*3+1] = ( high*g_rate );
							tblVertex[idx*3+2] = ( g_scale*(y/(resoH)-0.5) );
							tblColor[idx*3+0] = ( high );
							tblColor[idx*3+1] = ( high );
							tblColor[idx*3+2] = ( high );
							idx++;
						}

					if ( x == resoW && y == resoH )
					{
						{
							let high = buf[ round2d(ox+x-1,oy+y,MW,MH) ];
							tblVertex[idx*3+0] = ( g_scale*((x-1)/(resoW)-0.5) );
							tblVertex[idx*3+1] = ( high*g_rate );
							tblVertex[idx*3+2] = ( g_scale*((y)/(resoH)-0.5) );
							tblColor[idx*3+0] = ( high );
							tblColor[idx*3+1] = ( high );
							tblColor[idx*3+2] = ( high );
							idx++;
						}
						{
							let high = buf[ round2d(ox+x,oy+y-1,MW,MH) ];
							tblVertex[idx*3+0] = ( g_scale*((x)/(resoW)-0.5) );
							tblVertex[idx*3+1] = ( high*g_rate );
							tblVertex[idx*3+2] = ( g_scale*((y-1)/(resoH)-0.5) );
							tblColor[idx*3+0] = ( high );
							tblColor[idx*3+1] = ( high );
							tblColor[idx*3+2] = ( high );
							idx++;
						}
					}
				}
			}
		}

		return [ tblIndex, tblVertex, tblColor];
	}

	for ( let y = -g_block ; y <=g_block ; y++ )
	{
		for ( let x = -g_block ; x <= g_block ; x++ )
		{
			let [ tblIndex, tblVertex, tblColor] = makeGeom( x*g_reso, y*g_reso );
			g_model.push( new Model );
			g_model[ g_model.length-1 ].tblIndex = tblIndex;
			g_model[ g_model.length-1 ].initModel( new vec3( x*g_scale ,0, y*g_scale), tblVertex, tblColor );
		}
	}
	

	//---
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.clearDepth( 1.0 );
	gl.viewport( 0.0, 0.0, html_canvas.width, html_canvas.height );

}

//-----------------------------------------------------------------------------
function start()
//-----------------------------------------------------------------------------
{
	let buf = update_map( g_size );

	g_model = [];

	init_gl( buf,  g_size,  g_size,  g_reso,  g_reso );
	
	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = window.requestAnimationFrame( update_gl );
}

//-----------------------------------------------------------------------------
function initParam()
//-----------------------------------------------------------------------------
{
	g_blur1 = document.getElementById( "html_blur1" ).value*1;
	g_blur2 = document.getElementById( "html_blur2" ).value*1;
	g_blur3 = document.getElementById( "html_blur3" ).value*1;
	g_p1 = document.getElementById( "html_bp1" ).value*1;
	g_p2 = document.getElementById( "html_bp2" ).value*1;
	g_p3 = document.getElementById( "html_bp3" ).value*1;
	g_rate =  document.getElementById( "rate" ).value * 1.0;
	g_col =  document.getElementById( "col" ).value * 1.0;
	g_low =  document.getElementById( "low" ).value * 1.0;

}
//-----------------------------------------------------------------------------
function initSeed()
//-----------------------------------------------------------------------------
{
	g_block =  document.getElementById( "html_block" ).value * 1.0;
	g_reso =  document.getElementById( "html_reso" ).value * 1.0;
	g_size = g_reso * (g_block*2+1);
	g_scale =  g_reso/g_reso;

	document.getElementById("html_out").innerHTML = " size:"+g_size.toString()+"x"+g_size.toString();


	for ( let i = 0 ; i < g_size*g_size ; i++ )
	{
		g_bufA[i] = rand(1);
		g_bufB[i] = rand(1);
		g_bufC[i] = rand(1);
		g_bufNoiseD[i] = rand(1);
		g_bufNoiseE[i] = rand(1);
	}
}

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_posView = new vec3( 0,-0.5,-1.5);
	g_rotView = new vec3( rad(10),0,0);
	g_fovy = rad(45);
	g_reqId = null;

	initSeed();
	initParam();
	start();
}

// HTML制御
//-----------------------------------------------------------------------------
function html_updateParam()
//-----------------------------------------------------------------------------
{
	initParam();
	start();
}

//-----------------------------------------------------------------------------
function html_updateSeed()
//-----------------------------------------------------------------------------
{
	initSeed();
	start();
}
//-----------------------------------------------------------------------------
function html_updateAll()
//-----------------------------------------------------------------------------
{
	initParam();
	initSeed();
	start();
}
//-----------------------------------------------------------------
function html_setFullscreen()
//-----------------------------------------------------------------
{
	const obj = document.querySelector("#html_canvas"); 

	if( document.fullscreenEnabled )
	{
		obj.requestFullscreen.call(obj);
	}
	else
	{
		alert("フルスクリーンに対応していません");
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