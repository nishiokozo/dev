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
	constructor() 
	{
		this.y = 2463534242;
	}
	random() 
	{
		this.y = this.y ^ (this.y << 13); 
		this.y = this.y ^ (this.y >> 17);
		this.y = this.y ^ (this.y << 5);
		return Math.abs(this.y/((1<<31)));
	}
}
const xor32 = new Xorshift32();
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
		this.ctx = canvas.getContext('2d');
		this.img = this.ctx.createImageData( w, h );
	}
	//-----------------------------------------------------------------------------
	print( tx, ty, str )
	//-----------------------------------------------------------------------------
	{
		this.ctx.font = "14px monospace";
		this.ctx.fillStyle = "#000000";
		this.ctx.fillText( str, tx+1, ty+1 );
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillText( str, tx, ty );
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
			this.img.data[ adr +3 ] = 0xff; //0xff:不透明
		}
	}
	//-----------------------------------------------------------------------------
	cls_rgb( [r,g,b] )
	//-----------------------------------------------------------------------------
	{
		if ( r > 1 ) r = 1;
		if ( r < 0 ) r = 0;
		r = (r*255)&0xff;

		if ( g > 1 ) g = 1;
		if ( g < 0 ) g = 0;
		g = (g*255)&0xff;

		if ( b > 1 ) b = 1;
		if ( b < 0 ) b = 0;
		b = (b*255)&0xff;
		
		for (let x=0; x<this.img.width ; x++ )
		for (let y=0; y<this.img.height ; y++ )
		{
			let adr = (y*this.img.width+x)*4;
			this.img.data[ adr +0 ] = r;
			this.img.data[ adr +1 ] = g;
			this.img.data[ adr +2 ] = b;
			this.img.data[ adr +3 ] = 0xff; //0xff:不透明
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
//			this.img.data[ adr +3 ] = 0x0;
	}
	//-----------------------------------------------------------------------------
	pset_rgb( x, y, [r,g,b] )
	//-----------------------------------------------------------------------------
	{
		if ( r > 1 ) r = 1;
		if ( r < 0 ) r = 0;
		r = (r*255)&0xff;

		if ( g > 1 ) g = 1;
		if ( g < 0 ) g = 0;
		g = (g*255)&0xff;

		if ( b > 1 ) b = 1;
		if ( b < 0 ) b = 0;
		b = (b*255)&0xff;

		let adr = (y*this.img.width+x)*4;
		this.img.data[ adr+0 ] = r;
		this.img.data[ adr+1 ] = g;
		this.img.data[ adr+2 ] = b;
//			this.img.data[ adr +3 ] = 0x0;
	}

	//-----------------------------------------------------------------------------
	streach()
	//-----------------------------------------------------------------------------
	{
		// -----------------------------------------
		// ImageDataをcanvasに合成
		// -----------------------------------------
		// g   : canvas.getContext('2d')
		// img : ctx.createImageData( width, height )

		this.ctx.imageSmoothingEnabled = this.ctx.msImageSmoothingEnabled = 0; // スムージングOFF
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
				this.ctx.drawImage( cv,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Imageは引き延ばせる
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

			let r = 0;
			let g = 0;
			let b = 0;
			if ( v == 1 ) {r = 1;g = 1;b = 1;} 
			if ( v == 2 ) {r = 0;g = 0;b = 0;} 

			if ( v > 0 )
			{
				gra.pset_rgb( x, y, [r,g,b]);
			}
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
			if ( a <= b ) 
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
//-----------------------------------------------------------------------------
function calc_defferencial( bufA, bufB, W, H )
//-----------------------------------------------------------------------------
{
	// patで乗算
	let buf = new Array( bufA.length );

	for ( let y = 0 ; y < H ; y++ )
	{
		for ( let x = 0 ; x < W ; x++ )
		{
			let adr = (W*y + x);
			buf[adr] = Math.abs( bufA[adr]-bufB[adr] );
		}
	}
	return buf;
}
//-----------------------------------------------------------------------------
function round2d( x, y,W,H )
//-----------------------------------------------------------------------------
{
	if ( x < 0   ) x = W-1;
	else
	if ( x >= W ) x = 0;

	if ( y < 0   ) y = H-1;
	else
	if ( y >= H ) y = 0;

	return (W*y + x); 
}

let g_cx = 0;
let g_cy = 0;
//-----------------------------------------------------------------------------
function paint_mandelbrot( cx, cy, scale )
//-----------------------------------------------------------------------------
{
g_cx += cx;
g_cy += cy;
	let num =  document.getElementById( "html_num" ).value * 1.0;

	// 画面クリア
//	gra.cls_rgb([1,1,1]);
//	gra.cls_rgb([0,0,0]);

	let cnthit = 0;
	let cntall = 0;

	let adr = 0;
	for ( let py = 0 ; py < g_reso_H ; py++ )
	{
		for ( let px = 0 ; px < g_reso_W ; px++ )
		{
			let a = ((px /g_reso_W)-0.5)*scale*2*g_aspect-g_cx*2;
			let b = ((py /g_reso_H)-0.5)*scale*2-g_cy*2;

			let x = a;
			let y = b;
			let flgOver = false;
			let cntnest =0;
			for ( let n = 1 ; n < num ; n++ )
			{
				let nx = x*x - y*y + a;
				let ny = 2*x*y + b;

				x = nx;
				y = ny;

				if ( nx*nx+ny*ny > 4 ) 
				{
					flgOver = true;
					cnthit++;
					break;
				}
				cntnest++;
			}
			if (1)
			{
				if ( flgOver == false )
				{
					let r = Math.floor(Math.abs(x*100));
					let g = Math.floor(Math.abs(y*100));
					let b = cntnest*5;
					gra.img.data[ adr+0 ] = r&0xff;
					gra.img.data[ adr+1 ] = g&0xff;
					gra.img.data[ adr+2 ] = b&0xff;
				}
				else
				{
					gra.img.data[ adr+0 ] = 0xff;
					gra.img.data[ adr+1 ] = 0xff;
					gra.img.data[ adr+2 ] = 0xff;
				}
			}
			else
			{
				if ( flgOver == false )
				{
					let r = cntall;
					let g = cnthit;
					let b = cntnest;
					gra.img.data[ adr+0 ] = r&0xff;
					gra.img.data[ adr+1 ] = r&0xff;
					gra.img.data[ adr+2 ] = r&0xff;
				}
				else
				{
					gra.img.data[ adr+0 ] = 0xff;
					gra.img.data[ adr+1 ] = 0xff;
					gra.img.data[ adr+2 ] = 0xff;
				}
			}
			
			cntall++;
			adr+=4;
		}
	}

	// 画面をキャンバスへ転送
	gra.streach();
	if ( 2/g_scale<10 )
	{
		gra.print(2,12,"x"+(2/g_scale).toFixed(2));
	}
	else
	{
		gra.print(2,12,"x"+(2/g_scale).toFixed());
	}



}

//-----------------------------------------------------------------------------
function update_paint()
//-----------------------------------------------------------------------------
{
	paint_mandelbrot( 0, 0, g_scale );
//	window.requestAnimationFrame( paint_mandelbrot );
}

let gra;
let g_aspect;
let g_reso_W;	
let g_reso_H;	
//-----------------------------------------------------------------------------
function updateScreensize()
//-----------------------------------------------------------------------------
{
	g_reso_W =  document.getElementById( "html_reso" ).value * 1.0;
	g_reso_H =  g_reso_W;
//	html_canvas.width =  document.getElementById( "html_size_w" ).value * 1.0;
//	html_canvas.height =  document.getElementById( "html_size_h" ).value * 1.0;

//	g_reso_W = html_canvas.width;
//	g_reso_H = html_canvas.height;

	html_canvas.width =  g_reso_W;
	html_canvas.height = g_reso_H;

	g_aspect = (html_canvas.width/html_canvas.height)

	gra = new Gra( g_reso_W, g_reso_H, html_canvas );

}

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	updateScreensize();
	gra.cls_rgb([1,1,1]);



	g_scale = 2;

	window.requestAnimationFrame( update_paint );

}



// HTML/マウス/キーボード制御
document.onmousedown = mousemovedown;
document.onmousemove = mousemovedown;
let g_prevButtons = 0;
let g_prev_fx = null;
let g_prev_fy = null;
let g_scale;
//-----------------------------------------------------------------------------
document.addEventListener("wheel" , function (e)
//-----------------------------------------------------------------------------
{
	if ( e.deltaY > 0 )g_scale *= 1.5;
	if ( e.deltaY < 0 )g_scale /= 1.5;
//console.log(g_scale);
	// 出力テスト
//	console.log(e, e.deltaY);

	{
	    var rect = html_canvas.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / html_canvas.width  * g_reso_W);
        let y= Math.floor((e.clientY - rect.top ) / html_canvas.height * g_reso_H);

		if ( x >= 0 && x < g_reso_W && y >= 0 && y < g_reso_H )
		{
		
			paint_mandelbrot( 0,0, g_scale );
		
		}

	}

});
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	
	if ( e.buttons==1 )
	{
	    var rect = html_canvas.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / html_canvas.width  * g_reso_W);
        let y= Math.floor((e.clientY - rect.top ) / html_canvas.height * g_reso_H);


		if ( g_prevButtons == 0 )
		{
			g_prev_fx = x;
			g_prev_fy = y;
		}
		
		if ( x >= 0 && x < g_reso_W && y >= 0 && y < g_reso_H )
		{
		
			let fx1 = (x/g_reso_W)-0.5;
			let fy1 = (y/g_reso_H)-0.5;
			let fx2 = (g_prev_fx/g_reso_W)-0.5;
			let fy2 = (g_prev_fy/g_reso_H)-0.5;
			
			let fx = fx1-fx2;
			let fy = fy1-fy2;
			paint_mandelbrot( fx*g_scale*g_aspect, fy*g_scale, g_scale );
		
//console.log(x,y);
		}
			g_prev_fx = x;	
			g_prev_fy = y;	

	}

	g_prevButtons = e.buttons;
}
//
//-----------------------------------------------------------------------------
function html_updateSize()
//-----------------------------------------------------------------------------
{
	updateScreensize();
	gra.cls_rgb([1,1,1]);
	update_paint();
}

//-----------------------------------------------------------------------------
function html_updateFullscreen()
//-----------------------------------------------------------------------------
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
