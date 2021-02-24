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
		this.ctx.font = "12px monospace";
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
		//	if ( v == 3 ) {r = 1;g = 1;b = 0;} 

			if ( v > 0 )
			{
				gra.pset_rgb( x, y, [r,g,b]);
			}
		}
	}
}

//-----------------------------------------------------------------------------
function draw_buf_land( gra, buf )
//-----------------------------------------------------------------------------
{
	let h = gra.img.height;
	let w = gra.img.width
	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			let v = buf[ w*y + x ];
			if ( v > 0 )
			{
				//gra.pset_land( x, y, v );
				gra.pset_rgb( x, y, [v*0.6,0,0]);
			}
		}
	}
}

//-----------------------------------------------------------------------------
function draw_buf_player( gra, buf )
//-----------------------------------------------------------------------------
{
	let h = gra.img.height;
	let w = gra.img.width
	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			let v = buf[ w*y + x ];
			if ( v ==1 )
			{
				gra.pset_rgb( x, y, [0,1,0]);
			}
		}
	}
}


let g_reso_x;	
let g_reso_y;	
let g_seed = [];
let g_buf_life = [];

//-----------------------------------------------------------------------------
function update_paint()
//-----------------------------------------------------------------------------
{

	function drawCanvas( canvas, buf, str=null )
	{
		// 画面作成
		let gra = new Gra( g_reso_x, g_reso_y, canvas );
		// 画面クリア
//		gra.cls(0);
		gra.cls_rgb([0.5,0.5,0.5]);
		//画面描画
		draw_buf( gra, buf );
		// 地形描画
		draw_buf_land( gra, g_buf_land );
		// Player描画
		draw_buf_player( gra, g_buf_player );
		// 画面をキャンバスへ転送
		gra.streach();

		// canvasのID表示
		if ( str == null ) str = canvas.id;
		gra.print(1,gra.canvas.height-1, str );
	}

	//--

	drawCanvas( html_canvas, g_buf_life,"" );

	document.getElementById("html_gen").value = ""+(g_cntGen).toString();

}

//-----------------------------------------------------------------------------
function update_step( buf_life, buf_land, buf_player )
//-----------------------------------------------------------------------------
{
	if ( g_cntGen == 0 )g_seed = Array.from( buf_life ); // 0フレーム目を記録


	//-----------------------------------------------------------------------------
	function live_std( buf0, W, H )
	//-----------------------------------------------------------------------------
	{

		let tmp1 = Array( buf0.length );
		let tmp2 = Array( buf0.length );
		
		// 周囲の生存カウント
		for ( let y = 0 ; y < H ; y++ )
		{
			for ( let x = 0 ; x < W ; x++ )
			{

				let cnt1 = 0;
				let cnt2 = 0;
				for ( let m = -1 ; m <= 1 ; m++ )
				{
					for ( let n = -1 ; n <= 1 ; n++ )
					{
						if ( m==0 && n == 0 ) continue;
					
						if ( buf0[ round2d( x+m, y+n, W, H ) ] == 1  ) cnt1++; 
						if ( buf0[ round2d( x+m, y+n, W, H ) ] == 2  ) cnt2++; 
					}
				}
				
				tmp1[W*y + x] = cnt1;
				tmp2[W*y + x] = cnt2;
			}
		}

		let buf = Array.from( buf0 );

		// 誕生死滅処理
		for ( let y = 0 ; y < H ; y++ )
		{
			for ( let x = 0 ; x < W ; x++ )
			{

				let adr = W*y + x;
				let val = buf[adr];

				if ( val == 0 || val == 1 || val == 2 )
				{

					let cnt = tmp1[adr]+tmp2[adr];

					if ( buf_land[adr] == 0 && buf_player[adr] == 0 )
					{
						if ( val == 0 )
						{
							if ( cnt == 3	) 
							{
								if ( tmp1[adr] == 3 )	buf[adr] = 1;	//誕生
								if ( tmp2[adr] == 3 )	buf[adr] = 2;	//誕生
							}
						}
						else
						{
							let a = buf[adr];
							if ( cnt <= 1 				) buf[adr] = 0;	//過疎死
							if ( cnt == 2 || cnt == 3	) buf[adr] = a;	//生存
							if ( cnt >= 4				) buf[adr] = 0;	//過密死
						}
					}
				}
			}
		}
		return buf;
	}


	let buf = live_std( buf_life, g_reso_x, g_reso_y );

	g_cntGen++;

	return buf;

}
let g_jx;
let g_jy;
let g_jiki_shot_flg;
let g_jiki_shot_x;
let g_jiki_shot_y;
let g_prevButtons_pad;

//-----------------------------------------------------------------------------
function init_player()
//-----------------------------------------------------------------------------
{
	g_buf_player = new Array( g_reso_x*g_reso_y ).fill(0);
	g_jx = Math.floor(g_reso_x/2);
	g_jy = Math.floor(g_reso_x/2);
	g_jiki_shot_flg = false;
	g_prevButtons_pad = null;
	g_jiki_shot_x = 0;
	g_jiki_shot_y = 0;

}
//-----------------------------------------------------------------------------
function update_player()
//-----------------------------------------------------------------------------
{
	// 入力
	{
		if(navigator.getGamepads)
		{
			let list = navigator.getGamepads();
			for ( let pad of list )
			{
				if ( pad != null )		
				{
					let lx = pad.axes[0];
					let ly = pad.axes[1];
					let rx = pad.axes[2];
					let ry = pad.axes[3];
					for ( let i = 0 ; i < pad.buttons.length ; i++ )
					{
//						//scr_print( 0,20+10*i, ""+i+":"+pad.buttons[i].value, g_flgNight?"#FFF":"#000" );
//						console.log(  ""+i+":"+pad.buttons[i].value );
					}
					let a  = pad.buttons[ 0].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 0].value);
					let b  = pad.buttons[ 1].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 1].value);
					let x  = pad.buttons[ 2].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 2].value);
					let y  = pad.buttons[ 3].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 3].value);
					let l1 = pad.buttons[ 4].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 4].value);
					let r1 = pad.buttons[ 5].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 5].value);
					let l2 = pad.buttons[ 6].value;
					let r2 = pad.buttons[ 7].value;
					let se = pad.buttons[ 8].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 8].value);
					let st = pad.buttons[ 9].value && (g_prevButtons_pad==null || !g_prevButtons_pad[ 9].value);
					let u = pad.buttons[12].value
					let d = pad.buttons[13].value
					let l = pad.buttons[14].value
					let r = pad.buttons[15].value
					
				//	cam_update( l2, r2, lx, ly, rx, ry );
//console.log( l2, r2, lx, ly, rx, ry );

if(Math.abs(lx)>0.2)g_jx +=lx;
if(Math.abs(ly)>0.2 )g_jy +=ly;
if(a)shot(g_jx,g_jy);
					if ( g_prevButtons_pad == undefined || g_prevButtons_pad == null ) 
					{
						g_prevButtons_pad = pad.buttons;
					}
					g_prevButtons_pad = pad.buttons;

				}
			}
		}
	}
//console.log( g_jiki_shot_flg, g_jiki_shot_y);
	function shot( jx, jy )
	{
		g_jiki_shot_flg = true;
		g_jiki_shot_x = Math.floor(jx);
		g_jiki_shot_y = Math.floor(jy);
	}
	function shot_update()
	{
		let adr = g_reso_x*g_jiki_shot_y+g_jiki_shot_x;

		if ( g_jiki_shot_flg )
		{
			g_jiki_shot_y--;
			if ( g_jiki_shot_y<=0  )
			{
				g_jiki_shot_flg = false;
			}
			if ( g_buf_land[adr] > 0 )
			{
				g_jiki_shot_flg = false;
			}
			if ( g_buf_life[adr] > 0 )
			{
				let prev = g_reso_x*(g_jiki_shot_y+2)+g_jiki_shot_x;

				g_buf_life[adr] =1;
	
				g_jiki_shot_flg = false;
			}
//				g_buf_life[adr] =1;
		}
	}
	shot_update();

	// 描画

	g_buf_player.fill(0);

	{
		{
			let adr = g_reso_x*g_jiki_shot_y+g_jiki_shot_x;
			if ( g_jiki_shot_flg )
			{
				g_buf_player[adr] =	1;
			}
		}





		function pset(x,y)
		{
			g_buf_player[ g_reso_x*y+x ] = 1;
		}
		
		let cx = Math.floor(g_reso_x/2);
		let cy = Math.floor(g_reso_x/2);

		function putGrider( x, y )
		{// グライダー
			pset(x  ,y-1);
			pset(x-1,y );
			pset(x  ,y );
			pset(x-1,y+1);
			pset(x+1,y+1);
		}
		function putBrinker( x, y )
		{// ブリンカー
			pset(x-1,y );
			pset(x  ,y );
			pset(x+1,y);
		}
		putGrider( Math.floor(g_jx) , Math.floor(g_jy) );
	}
	
}
let g_time;
//-----------------------------------------------------------------------------
function update_scene()
//-----------------------------------------------------------------------------
{
//	var a = document.getElementsByName( "html_auto" )[0].checked ;
	{


		g_time++;
		if ( g_time > 10 )
		{
			g_time=0;
			g_buf_life = update_step( g_buf_life, g_buf_land, g_buf_player );
		}

	}


	// 自機
	update_player();

	// 描画
	update_paint();


	{
		let interval = document.getElementById( "html_speed" ).value*1;
//		if ( g_reqId !=null ) clearTimeout( g_reqId );
		g_reqId = setTimeout( update_scene, interval );
	}
}



let g_cntGen;
let g_reqId;


//-----------------------------------------------------------------------------
function initParam()
//-----------------------------------------------------------------------------
{
	g_cntGen = 0;
	g_buf_life = Array.from(g_seed);
}
//-----------------------------------------------------------------------------
function init_land()
//-----------------------------------------------------------------------------
{

	g_buf_land = new Array( g_reso_x*g_reso_y );
	g_buf_land = genSeed_land( g_reso_x*g_reso_y );
	g_buf_land = update_land( g_buf_land, g_reso_x, g_reso_y );
}
//-----------------------------------------------------------------------------
function initSeed_randam()
//-----------------------------------------------------------------------------
{
	let val = document.getElementById( "html_randval" ).value*1;

	{
		//ランダム
		for ( let y = 0 ; y < g_reso_y ; y++ )
		{
			for ( let x = 0 ; x < g_reso_x ; x++ )
			{
				let adr = y*g_reso_x+x;
				
				if ( g_buf_land[adr] == 0 )
				{

					if ( rand(1) > val ) 
					{
						g_seed[adr] = 1;
					}
					else
					{
						g_seed[adr] = 0;
					}

				}
			}
		}
	}
}
//-----------------------------------------------------------------------------
function initSeed_clear()
//-----------------------------------------------------------------------------
{

	{
		g_seed = Array( g_reso_x*g_reso_y ).fill(0);
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

	if ( c == KEY_RIGHT ) 
	{
		g_buf_life = update_step( g_buf_life, g_buf_land, g_buf_player );
		update_paint();
	}
}

document.onmousedown = mousemovedown;
document.onmousemove = mousemovedown;
let g_prevButtons_mouse = 0;
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	if ( g_prevButtons_mouse == 0 &&  e.buttons==1 )
	{
	    var rect = html_canvas.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / html_canvas.width  * g_reso_x);
        let y= Math.floor((e.clientY - rect.top ) / html_canvas.height * g_reso_y);

		if ( x >= 0 && x < g_reso_x && y >= 0 && y < g_reso_y )
		{
			let a = g_buf_life[ g_reso_x*y+x ];
			g_penCol = a==0?1:0;
		}
	}
	
	if ( e.buttons==1 )
	{
		var flgBold = document.getElementsByName( "html_bold" )[0].checked ;
		var flgBlack = document.getElementsByName( "html_black" )[0].checked ;
		var flgSymmetry = document.getElementsByName( "html_symmetry" )[0].checked ;

	    var rect = html_canvas.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / html_canvas.width  * g_reso_x);
        let y= Math.floor((e.clientY - rect.top ) / html_canvas.height * g_reso_y);


		if ( x >= 0 && x < g_reso_x && y >= 0 && y < g_reso_y )
		{
			if ( g_buf_land[ g_reso_x*y+x ] == 0 )
			{
				let c1 = 1;
				let c2 = 2;
				if ( flgBlack ) 
				{
					let c = c1;
					c1 = c2;
					c2 = c;
				}
				
				if ( flgSymmetry ) 
				{
					let w = (g_reso_x-x);
					if ( flgBold )
					{
						g_buf_life[ round2d(x  ,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_buf_life[ round2d(w  ,y  ,g_reso_x,g_reso_y)	] = g_penCol*c2;

						g_buf_life[ round2d(x  ,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_buf_life[ round2d(w  ,y+1,g_reso_x,g_reso_y)	] = g_penCol*c2;

						g_buf_life[ round2d(x+1,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_buf_life[ round2d(w-1,y  ,g_reso_x,g_reso_y)	] = g_penCol*c2;

						g_buf_life[ round2d(x+1,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_buf_life[ round2d(w-1,y+1,g_reso_x,g_reso_y)	] = g_penCol*c2;
					}
					else
					{
						g_buf_life[ g_reso_x*y+x ] = g_penCol*c1;
						g_buf_life[ g_reso_x*y+w ] = g_penCol*c2;
					}
				}
				else
				{
					if ( flgBold )
					{
						g_buf_life[ round2d(x  ,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_buf_life[ round2d(x  ,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_buf_life[ round2d(x-1,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_buf_life[ round2d(x-1,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
					}
					else
					{
						g_buf_life[ g_reso_x*y+x ] = g_penCol*c1;
					}
				}
				update_paint();
			}

		}

	}

	g_prevButtons_mouse = e.buttons;
}

//-

//-----------------------------------------------------------------------------
function genSeed_land( SZ )
//-----------------------------------------------------------------------------
{
	let buf = new Array( SZ );
	
	
	// ランダムの種作成
	for ( let i = 0 ; i < SZ ; i++ )
	{
		buf[i] = rand(1);
	}

	return buf;
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
function update_land( buf0, W,H )
//-----------------------------------------------------------------------------
{
	// ランダムの種をコピー
	let buf = Array.from( buf0 );

	// 3x3ブラーフィルタ作成
	let pat33 = pat_normalize(
	[
		[1,2,1],
		[2,4,2],
		[1,2,1],
	]);

	
	for ( let i = 0 ; i < 15 ; i++ )
	{
		// ブラーフィルタ適用
		let buf3 = pat_calc( buf, pat33, W, H );

		for ( let i = 0 ; i < W*H ; i++ )
		{
//			buf[i] = ( buf3[i]+buf9[i] )/2;
			buf[i] = ( buf3[i] )/2;
		}
	}
	
	// 地形化
	for ( let i = 0 ; i < W*H ; i++ )
	{
		buf[i] -= 0.5;
		buf[i] *= 5;
	}

	let val =  document.getElementById( "html_landval" ).value * 1.0;
	buf = calc_autolevel( buf, W*H,0,0.5+val/2 );
	buf = calc_parapolize( buf, 2, W*H );

	return buf;
}

let g_buf_land;
let g_buf_player;


//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_time = 0;
	g_penCol =1 ;

	g_reso_y =  document.getElementById( "html_reso" ).value * 1.0;
	g_reso_x = g_reso_y*(html_canvas.width/html_canvas.height);
	init_land();
	
	init_player();



	initSeed_clear();
//	initSeed_randam();



	if(0)
	{
		function pset(x,y)
		{
			g_seed[ g_reso_x*y+x ] = 3;
		}
		
		let cx = Math.floor(g_reso_x/2);
		let cy = Math.floor(g_reso_x/2);

		function putGrider( x, y )
		{// グライダー
			pset(x  ,y-1);
			pset(x-1,y );
			pset(x  ,y );
			pset(x-1,y+1);
			pset(x+1,y+1);
		}
		function putBrinker( x, y )
		{// ブリンカー
			pset(x-1,y );
			pset(x  ,y );
			pset(x+1,y);
		}
		putGrider( cx, cy );
		
	}
	initParam();
	update_scene();
//	update_paint();
}
let g_penCol;
// HTML制御
//-----------------------------------------------------------------------------
function html_updateCopy( v )
//-----------------------------------------------------------------------------
{
	update_paint();

}
//-----------------------------------------------------------------------------
function html_updatePen( v )
//-----------------------------------------------------------------------------
{
	g_penCol = v;
}
//-----------------------------------------------------------------------------
function html_updateStore()
//-----------------------------------------------------------------------------
{
	g_seed = Array.from( g_buf_life );
	initParam();
	update_paint();
}
//-----------------------------------------------------------------------------
function html_updateSize()
//-----------------------------------------------------------------------------
{
	g_reso_y =  document.getElementById( "html_reso" ).value * 1.0;
	g_reso_x = g_reso_y*(html_canvas.width/html_canvas.height);
//console.log(g_reso_x,g_reso_y);
	init_land();
	initSeed_clear();
	initParam();
	update_paint();
}
//-----------------------------------------------------------------------------
function html_updateClear()
//-----------------------------------------------------------------------------
{
	initSeed_clear();
	initParam();
	update_paint();
}
//-----------------------------------------------------------------------------
function html_updateSeed()
//-----------------------------------------------------------------------------
{
	initSeed_randam();
	initParam();
	update_paint();
}
//-----------------------------------------------------------------------------
function html_updateReset()
//-----------------------------------------------------------------------------
{
	initParam();
	update_paint();
}
//-----------------------------------------------------------------------------
function html_updateNext()
//-----------------------------------------------------------------------------
{
	g_buf_life = update_step( g_buf_life, g_buf_land, g_buf_player );
	update_paint();
}

function html_updateLoad(e)
{
console.log(e);
}
//-----------------------------------------------------------------------------
function html_updateAuto()
//-----------------------------------------------------------------------------
{
	update_scene();

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