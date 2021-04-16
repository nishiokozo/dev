"use strict";
///// 3D系関数 /////
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



///// 汎用的な関数・定数 /////
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
const xorshift = new Xorshift32();
//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{

	let r = 0;
	for ( let j = 0 ; j < n ; j++ ) r += Math.random();
//	for ( let j = 0 ; j < n ; j++ ) r += xorshift.random();
	return r/n;
}

//--------------------------------------------------------------------------
Number.prototype.toHex=function(culms)
//--------------------------------------------------------------------------
{
	var v=this;
	if ( v < 0 )
	{
		v=0;
		for ( var b=(culms*4)-1 ; b>=0 ; b-- )
		{
			v<<=1;
			v|=(this>>b)&1;
		}
	}
	return ("00000000"+(v.toString(16).toUpperCase())).substr(-culms);
}
//-----------------------------------------------------------------------------
function	rgb8( r,g,b )	// 255,255,255 -> string RGB 8:8:8 
//-----------------------------------------------------------------------------
{
	r=Math.floor(r)&0xff;
	g=Math.floor(g)&0xff;
	b=Math.floor(b)&0xff;
	let col =  ((r<<16)|(g<<8)|(b)).toString(16);
	return "#"+("00000000"+col+"FF").substr(-8);
}
//-----------------------------------------------------------------------------
function	rgbf( r, g, b )	// 1.0,1.0,1.0 ->string RGB 8:8:8 
//-----------------------------------------------------------------------------
{
	if ( r > 1.0 ) r=1.0;
	if ( g > 1.0 ) g=1.0;
	if ( b > 1.0 ) b=1.0;

	return rgb8(r*255,g*255,b*255);
}
//-----------------------------------------------------------------------------
function	rgbv( v )	// vec3(1.0,1.0,1.0) ->string RGB 8:8:8 
//-----------------------------------------------------------------------------
{
	return rgbf( v.x, v.y, v.z );
}


///// 2D系関数 /////

class GRA_img // イメージバッファに描画する
{
	constructor( width, height, canvas )
	{
		this.cv = canvas
		this.ctx = this.cv.getContext('2d');

		this.img = this.ctx.createImageData( width, height );
		this.stencil = new Array( width*height );


		//-----------------------------------------------------------------------------
		this.cls = function( col, a =0xff )
		//-----------------------------------------------------------------------------
		{
			for (let x=0; x<this.img.width ; x++ )
			for (let y=0; y<this.img.height ; y++ )
			{
				let adr = (y*this.img.width+x)*4;
				this.img.data[ adr +0 ] = (col>>16)&0xff;
				this.img.data[ adr +1 ] = (col>> 8)&0xff;
				this.img.data[ adr +2 ] = (col>> 0)&0xff;
				this.img.data[ adr +3 ] = a;
			}
		}
		//-----------------------------------------------------------------------------
		this.rgb8 = function( r,g,b )	// xRGB 8:8:8:8 
		//-----------------------------------------------------------------------------
		{
			return (r<<16)|(g<<8)|b;
		}
		//-----------------------------------------------------------------------------
		this.point = function( x, y )
		//-----------------------------------------------------------------------------
		{
			let adr = (y*this.img.width+x)*4;
			let r = this.img.data[ adr +0 ];
			let g = this.img.data[ adr +1 ];
			let b = this.img.data[ adr +2 ];
		//	let a = this.img.data[ adr +3 ];
			return this.rgb8(r,g,b);
		}
		//-----------------------------------------------------------------------------
		this.point_rgbf = function( x, y )
		//-----------------------------------------------------------------------------
		{
			let adr = (y*this.img.width+x)*4;
			let r = this.img.data[ adr +0 ];
			let g = this.img.data[ adr +1 ];
			let b = this.img.data[ adr +2 ];
		//	let a = this.img.data[ adr +3 ];
			return [r,g,b];
		}
		//-----------------------------------------------------------------------------
		this.pset0 = function( _ox, _oy, col, a=0xff )
		//-----------------------------------------------------------------------------
		{
			let x = Math.floor(_ox);
			let y = Math.floor(_oy);
			if ( x < 0 ) return;
			if ( y < 0 ) return;
			if ( x >= this.img.width ) return;
			if ( y >= this.img.height ) return;

			let adr = (y*this.img.width+x)*4;
			this.img.data[ adr +0 ] = (col>>16)&0xff;
			this.img.data[ adr +1 ] = (col>> 8)&0xff;
			this.img.data[ adr +2 ] = (col>> 0)&0xff;
			this.img.data[ adr +3 ] = a&0xff;
		}
		//-----------------------------------------------------------------------------
		this.pset = function( px, py, col=0x000000 )
		//-----------------------------------------------------------------------------
		{
			this.pset0( px, py, col );
		}
		//-----------------------------------------------------------------------------
		this.pset_rgb = function( _px, _py, [r,g,b] )
		//-----------------------------------------------------------------------------
		{


			let adr = (y*this.img.width+x)*4;
			this.img.data[ adr +0 ] = r&0xff;
			this.img.data[ adr +1 ] = g&0xff;
			this.img.data[ adr +2 ] = b&0xff;
			this.img.data[ adr +3 ] = 0xff;
		}

		//-----------------------------------------------------------------------------
		this.pset_rgbf = function( x, y, [r,g,b] )
		//-----------------------------------------------------------------------------
		{
			r*=255;
			if ( r<0		) r = 0;
			if ( r>255	) r = 255;

			g*=255;
			if ( g<0		) g = 0;
			if ( g>255	) g = 255;

			b*=255;
			if ( b<0		) b = 0;
			if ( b>255	) b = 255;

			let adr = (y*this.img.width+x)*4;
			this.img.data[ adr +0 ] = r;
			this.img.data[ adr +1 ] = g;
			this.img.data[ adr +2 ] = b;
			this.img.data[ adr +3 ] = 0xff;
		}

		//-----------------------------------------------------------------------------
		this.stencil_point = function( x, y )
		//-----------------------------------------------------------------------------
		{
			let adr = (y*this.img.width+x);
			let r = this.stencil[ adr ];
			return r;
		}
		//-----------------------------------------------------------------------------
		this.stencil_pset = function( x, y, a )
		//-----------------------------------------------------------------------------
		{
			let adr = (y*this.img.width+x);
			this.stencil[ adr ] = a;
		}

		//-----------------------------------------------------------------------------
		this.line_rgbf = function( x1, y1, x2, y2, [r,g,b] ) 
		//-----------------------------------------------------------------------------
		{
			let col = ((((r*255)&0xff)<<16)|(((g*255)&0xff)<<8)|(((b*255)&0xff)<<0))
			this.line( x1, y1, x2, y2, col ); 
		}
		//-----------------------------------------------------------------------------
		this.line = function( x1, y1, x2, y2, col=0x000000 ) 
		//-----------------------------------------------------------------------------
		{

			//ブレセンハムの線分発生アルゴリズム

			// 二点間の距離
			let dx = ( x2 > x1 ) ? x2 - x1 : x1 - x2;
			let dy = ( y2 > y1 ) ? y2 - y1 : y1 - y2;

			// 二点の方向
			let sx = ( x2 > x1 ) ? 1 : -1;
			let sy = ( y2 > y1 ) ? 1 : -1;

			if ( dx > dy ) 
			{
				// 傾きが1より小さい場合
				let E = -dx;
				for ( let i = 0 ; i <= dx ; i++ ) 
				{
					this.pset0( x1,y1, col );
					x1 += sx;
					E += 2 * dy;
					if ( E >= 0 ) 
					{
						y1 += sy;
						E -= 2 * dx;
					}
				}
			}
			else
			{
				// 傾きが1以上の場合
				let E = -dy;
				for ( let i = 0 ; i <= dy ; i++ )
				{
					this.pset0( x1, y1, col );
					y1 += sy;
					E += 2 * dx;
					if ( E >= 0 )
					{
						x1 += sx;
						E -= 2 * dy;
					}
				}
			}

		}
		//-----------------------------------------------------------------------------
		this.box = function( x1,y1, x2,y2, col )
		//-----------------------------------------------------------------------------
		{

			this.line( x1,y1,x2,y1, col);
			this.line( x1,y2,x2,y2, col);
			this.line( x1,y1,x1,y2, col);
			this.line( x2,y1,x2,y2, col);
		}

		//-----------------------------------------------------------------------------
		this.circle = function( x,y,r,col )
		//-----------------------------------------------------------------------------
		{
			//-----------------------------------------------------------------------------
			let rad = function( deg )
			//-----------------------------------------------------------------------------
			{
				return deg*Math.PI/180;
			}
			{
				let st = rad(1);
				let x0,y0;
				for (  let i = 0 ; i <= Math.PI*2 ; i+=st  )
				{
					let x1 = r * Math.cos(i) + x;
					let y1 = r * Math.sin(i) + y;

					if ( i > 0 ) this.line( x0, y0, x1, y1, col );
					x0 = x1;
					y0 = y1;
				}
			}
		}

		//-----------------------------------------------------------------------------
		this.paint = function(  x0, y0, colsPat=[[0x000000]], colsRej=[0xffffff]  ) 
		//-----------------------------------------------------------------------------
		{
			{
				let c = this.point(x0,y0);
				if ( colsRej.indexOf(c) != -1 ) return 0;
			}

			// 単色色指定（非タイリング）に対応

			let cntlines = 0;

			let flgTiling = false;

			if ( colsPat.length > 0 && colsPat[0].length > 0  )
			{
				flgTiling = true;
			}
			else
			if ( colsPat.length == undefined )
			{
				flgTiling = false;	// 単色
			}
			else
			{
				console.log("error invalid col format");
			}


			this.stencil.fill(0);

			let seed=[];
			seed.push([x0,y0,0,0,0]); // x,y,dir,lx,rx
			while( seed.length > 0 )
			{
				// 先頭のシードを取り出す
				let sx	= seed[0][0];
				let sy	= seed[0][1];
				let pdi	= seed[0][2];
				let plx	= seed[0][3];
				let prx	= seed[0][4];
				seed.shift();

				// シードから左端を探す
				let lx=sx;
				while( lx >= 0 )
				{
					let c = this.point(lx,sy);
					if ( colsRej.indexOf(c) != -1 ) break;
					let s = this.stencil_point(lx,sy);
					if ( s != 0 ) break;
					lx--;
				}
				lx++;

				// シードから右端探す
				let rx=sx;
				while( rx < this.img.width )
				{
					let c = this.point(rx,sy);
					if ( colsRej.indexOf(c) != -1 ) break;
					let s = this.stencil_point(rx,sy);
					if ( s != 0 ) break;
					rx++;
				}
				rx--;

				// 1ライン塗り
				if ( flgTiling )
				{//タイリング
					let iy = Math.floor( sy % colsPat.length );
					let ay = sy*this.img.width;
					for ( let x = lx ; x <=rx ; x++ )
					{
						let ix = Math.floor(  x % colsPat[0].length );
						let col = colsPat[iy][ix];
						let adr = (ay+x);
						this.img.data[ adr*4 +0 ] = (col>>16)&0xff;
						this.img.data[ adr*4 +1 ] = (col>> 8)&0xff;
						this.img.data[ adr*4 +2 ] = (col>> 0)&0xff;
						this.img.data[ adr*4 +3 ] = 0xff;
					
						this.stencil[ adr ] = 1;
					}
					cntlines++;
				}
				else
				{
					let ay = sy*this.img.width;
					for ( let x = lx ; x <=rx ; x++ )
					{
						let col = colsPat; // 単色
						let adr = (ay+x);
						this.img.data[ adr*4 +0 ] = (col>>16)&0xff;
						this.img.data[ adr*4 +1 ] = (col>> 8)&0xff;
						this.img.data[ adr*4 +2 ] = (col>> 0)&0xff;
						this.img.data[ adr*4 +3 ] = 0xff;
					
						this.stencil[ adr ] = 1;
					}
					cntlines++;
				}
				

				if ( seed.length > 50 ) 
				{
					console.log("err Maybe Over seed sampling:seed=",seed.length);
					break;
				}
				for( let dir of [-1,1] )
				{// 一ライン上（下）のライン内でのペイント領域の右端をすべてシードに加える
					let y=sy+dir;
					if ( dir ==-1 && y < 0 ) continue;
					if ( dir == 1 && y >= this.img.height ) continue;
					let flgBegin = false;
					for ( let x = lx ; x <=rx ; x++ )
					{
						let c = this.point(x,y);
						let s = this.stencil_point(x,y);
						if ( flgBegin == false )
						{
							if ( s == 0 && colsRej.indexOf(c) == -1 )
							{
								flgBegin = true;
							}
						}
						else
						{
							if ( s == 0 && colsRej.indexOf(c) == -1 )
							{}
							else
							{
								seed.push([x-1,y,dir,lx,rx]);
								flgBegin = false;
							}
						}
					}
					if ( flgBegin == true )
					{
								seed.push([rx,y,dir,lx,rx]);
					}
				}
			}
			
			return cntlines;
		}


	}
	//-----------------------------------------------------------------------------
	streach()
	//-----------------------------------------------------------------------------
	{
		// -----------------------------------------
		// ImageDataをcanvasに合成
		// -----------------------------------------
		// g   : canvas.getContext('2d')
		// img : g.createImageData( width, height )

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
				let dw = this.cv.width;
				let dh = this.cv.height;
				this.ctx.drawImage( cv,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Imageは引き延ばせる
			}
			
		}
	}
	//-----------------------------------------------------------------------------
	put_buf( buf )
	//-----------------------------------------------------------------------------
	{
		let h = this.img.height;
		let w = this.img.width
		for ( let y = 0 ; y < h ; y++ )
		{
			for ( let x = 0 ; x < w ; x++ )
			{
				let v = buf[ w*y + x ];
				this.pset_rgbf( x, y, [v,v,v] );
			}
		}
	}
	//-----------------------------------------------------------------------------
	ctx_print( tx, ty, str )
	//-----------------------------------------------------------------------------
	{
		this.ctx.font = "12px monospace";
		this.ctx.fillStyle = "#000000";
		this.ctx.fillText( str, tx+1, ty+1 );
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillText( str, tx, ty );
	}
	//-----------------------------------------------------------------------------
	ctx_circle( x,y,r, col="#000"  )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = col;//"#000000";
		this.ctx.lineWidth = 1.0;
		this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.stroke();
	}
	//-----------------------------------------------------------------------------
	ctx_line = function( sx,sy, ex,ey, col="#000" )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = col;
		this.ctx.lineWidth = 1.0;
		this.ctx.moveTo( sx, sy );
		this.ctx.lineTo( ex, ey );
		this.ctx.closePath();
		this.ctx.stroke();
	}

};


//-----------------------------------------------------------------------------
function calc_pat_normalize( pat )
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
function vec_round( [x, y], W, H )
//-----------------------------------------------------------------------------
{
	if ( x < 0   ) x += W;
	else
	if ( x >= W ) x -= H;

	if ( y < 0   ) y += H;
	else
	if ( y >= H ) y -= H;

	return [x,y];
}
//-----------------------------------------------------------------------------
function round2d( px, py, W, H )
//-----------------------------------------------------------------------------
{

	[px,py]=vec_round([px,py],W,H);

	return (W*py + px); 
}
//-----------------------------------------------------------------------------
function clip2d( px, py, W, H )
//-----------------------------------------------------------------------------
{
	if ( px < 0   ) px = 0;
	else
	if ( px >= W ) px = W-1;

	if ( py < 0   ) py = 0;
	else
	if ( py >= H ) py = H-1;

	return (W*py + px); 
}
//-----------------------------------------------------------------------------
function edge2d( x, y, W, H )
//-----------------------------------------------------------------------------
{
//	return clip2d( x, y, W, H );	// 
	return round2d( x, y, W, H );	// 上下左右がループする
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
					let a = edge2d( x+(m-edge), y+(n-edge),w,h );


					v += buf1[ a ] * pat[m][n];
				}
			}
			buf2[ (w*y + x) ] = v;
		}
	}
	return buf2;
}
//-----------------------------------------------------------------------------
function pat_calc_rain( buf0, pat, w, h, rate )
//-----------------------------------------------------------------------------
{
	// patで水流シミュレーション
	let buf = new Array( buf0.length );
	let edge = Math.floor(pat.length/2);

	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			//let adr = (w*y + x); 

			let base_high = buf0[ w*y+x ]; // 基準となる中心の高さ
	if(1)
	{
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

						if ( base_high < buf0[ adr ] )
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
	}
	else
	{
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

						let a = buf0[ adr ];
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
				buf[ adr ] = buf0[ adr ] + v;
	}
		}
	}
	return buf;
}

//-----------------------------------------------------------------------------
function calc_pat_gauss2d( size, sigma )
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
//-----------------------------------------------------------------------------
function calc_autolevel( buf0, W, H, low=0.0, high=1.0 )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);

	let max = Number.MIN_SAFE_INTEGER;
	let min = Number.MAX_SAFE_INTEGER;

	for ( let i = 0 ; i < W*H ; i++ )
	{
		let a = buf[i];
		max = Math.max( max, a );
		min = Math.min( min, a );
	}
	{
		let rate = (high-low)/(max-min);
		for ( let i = 0 ; i < W*H ; i++ )
		{
			buf[i] = (buf[i] - min)*rate + low;
		}
	}
	return buf;
}

// ローパスフィルタ
//-----------------------------------------------------------------------------
function calc_lowpass( buf0, W, H, val )
//-----------------------------------------------------------------------------
{
	let buf = [];
	for ( let i = 0 ; i < W*H ; i++ )
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

//-----------------------------------------------------------------------------
function func_lvl( j, col )
//-----------------------------------------------------------------------------
{
	// 段を作るための共通関数
	return (1.0/col)*(j+1); // lvl
}

// パラポライズ
//-----------------------------------------------------------------------------
function calc_parapolize( buf0, W, H, col )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let y = 0 ; y < H ; y++ )
	{
		for ( let x = 0 ; x < W ; x++ )
		{
			for ( let j = 0 ; j < col ; j++ )
			{
				let lvl = func_lvl( j, col );
				if ( buf[W*y+x] <= lvl) // 内側を検出 lvl
				{
					buf[W*y+x] = (1.0/(col-1))*j;
					break;
				}
			}
		}
	}
	return buf;
}

// ノイズをわざと乗せる
//-----------------------------------------------------------------------------
function calc_addnoise( buf0, W, H, val )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let i = 0 ; i < W*H ; i++ ) 
	{
		let a = buf0[i];
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

	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
		
			let a1 = edge2d( x-1, y+1 ,w, h );
			let a2 = edge2d( x  , y+1 ,w, h );
			let a3 = edge2d( x+1, y+1 ,w, h );
			let a4 = edge2d( x-1, y   ,w, h );
			let a5 = edge2d( x  , y   ,w, h );
			let a6 = edge2d( x+1, y   ,w, h );
			let a7 = edge2d( x-1, y-1 ,w, h );
			let a8 = edge2d( x  , y-1 ,w, h );
			let a9 = edge2d( x+1, y-1 ,w, h );
			
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
		buf[ w*i+ (w-1) ] *= valh;
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
// シリンダーを作る
//-----------------------------------------------------------------------------
function calc_makecylinder( buf0, W, H, sx, sy, sr, val )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let r = 0 ; r < sr  ; r++ )
	{
		for ( let th = 0 ; th < Math.PI*2 ; th+=rad(1) )
		{
			let x = Math.floor( r*Math.cos(th)+0.5 )+sx;
			let y = Math.floor( r*Math.sin(th)+0.5 )+sy;
			
			buf[ y*W+x ] = val;
		}
	}
	return buf;
}
// BOXを作る
//-----------------------------------------------------------------------------
function calc_makebox( buf0, W, H, sx, sy, ex, ey, val )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let y = sy ; y < ey ; y++ )
	{
		for ( let x = sx ; x < ex; x++ )
		{
			let px = Math.floor(x);
			let py = Math.floor(y);
			
			let adr = round2d( px , py , W, H );
			buf[adr] = val;
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
function calc_vectorize( buf, W, H, col ) //2021/02/25
//-----------------------------------------------------------------------------
{ // ベクトル化

	//-----------------------------------------------------------------------------
	function isedge( [x, y], W, H )
	//-----------------------------------------------------------------------------
	{
		if ( x < 0  ) return true;
		else
		if ( x >= W ) return true;

		if ( y < 0  ) return true;
		else
		if ( y >= H ) return true;

		return false;
	}

	//-----------------------------------------------------------------------------
	function vec_search( points, buf, msk, sx, sy,  ax, ay, lvl )
	//-----------------------------------------------------------------------------
	{
		let x = sx;
		let y = sy;
		let cnt = 0;
		let c = lvl;

//console.log("<start>");
		let cnt_r = 0;

		function isedge( x, y, W, H , lvl )
		{
			if ( buf[W*y+x] > lvl && x>=0 && x <W && y>=0 && y <H ) return true;
			return false;
		}

		// 最の頂点
		points.push( {x:x, y:y, c:c, end:0} );
		msk[W*y+x]=1;
		while(1)
		{	
if ( cnt > 3000) console.log("",sx,sy,"->",x,y);
//if ( cnt >100 )console.log(x,y,ax,ay);
			{
				let [x1,y1] = vec_round( [x+ax, y+ay], W, H );
				if ( isedge( x+ax, y+ay, W, H, lvl ) )
				{//前方に崖が無かったら、左手前方を調べる

					let [x2,y2] = vec_round( [x+ax+ay, y+ay-ax], W, H);
					if ( isedge( x+ax+ay, y+ay-ax, W, H, lvl ) )
					{//左手にも崖が無かったら前進＆左ターン＆前進
	if ( cnt > 3000) console.log("l");
						[x,y]=[x2,y2];
						[ax,ay]=[ay,-ax];
						points.push( {x:x, y:y, c:c, end:0} );
						msk[W*y+x]=1;
					}
					else
					{//左手が別の色だったら	そのまま前進移動
	if ( cnt > 3000) console.log("f");
						[x,y]=[x1,y1];
					}
					//--
					if ( sx == x && sy== y )  // 元の場所
					{
						points.push( {x:x, y:y, c:c, end:1} );
						msk[W*y+x]=1;
						break;
					}
					else
					{
						points.push( {x:x, y:y, c:c, end:0} );
						msk[W*y+x]=1;
					}
					cnt_r=0;
				}
				else
				{//前進できなければ右ターン
	if ( cnt > 3000) console.log("r");
					[ax,ay]=[-ay,ax];
					cnt_r++;
					if ( cnt_r>=4 ) 
					{
						points.push( {x:x, y:y, c:c, end:1} );
						msk[W*y+x]=1;
						break; // 4連続右折は１ドットピクセル
					}
				}
			}
			if ( ++cnt > 3000+100 ) {console.log("warn toomuch vec_serch()>",cnt);break;}
		}
//console.log("<end>");
		return points;
	}
	
	// main

	let points = [];

	function vec_make( lvl )
	{
		let msk = Array( buf.length ).fill(0);

		for ( let y = 0 ; y < H ; y++ )
		{
			let prev = (buf[W*y+W-1] >= lvl);
			for ( let x = 0 ; x < W ; x++ )
			{
				let flg = (buf[W*y+x] >= lvl);
				if ( !prev && flg && msk[W*y+x] == 0 ) 
				{
					points = vec_search( points, buf, msk, x, y, 0,-1,lvl );
				}
				prev = flg;
			}
		}
	}
	for ( let j = 0 ; j < col-1 ; j++ ) // j=col=1.0に等高線は無いはずなのでcol-1にしておく。
	{
		let lvl = func_lvl( j, col );

		vec_make( lvl ); 
	}
		vec_make( 0.01 ); 
	return points;
}

//-----------------------------------------------------------------------------
function draw_rasterize( gra, points, W, H, pos, scale ) // 2021/02/25
//-----------------------------------------------------------------------------
{// ベクター描画2


	let sw = gra.img.width / W;
	let sh = gra.img.height / H;

	let sx=0;
	let sy=0;
	let st_x=0;
	let st_y=0;
	let flgFirst = true;
	for( let [i,p] of points.entries() )
	{
		let ex = scale*Math.floor(p.x*sw)+pos.x*gra.cv.width;
		let ey = scale*Math.floor(p.y*sh)+pos.y*gra.cv.height;
//console.log("ras",p);

		if ( flgFirst == false )
		{
			gra.line_rgbf( sx, sy, ex, ey, [p.c,p.c,p.c] ); 
		}
		else
		{
			st_x = ex;
			st_y = ey;
		}
		flgFirst = false;

		if ( p.end == 1 ) 
		{
			flgFirst = true;
			gra.line_rgbf( st_x, st_y, ex, ey, [p.c,p.c,p.c] ); 
		}
		sx = ex;
		sy = ey;
	}

}

class GRA_cv // 直接キャンバスに描画する
{
	//-----------------------------------------------------------------------------
	constructor( cv )
	//-----------------------------------------------------------------------------
	{
		this.cv = cv;
		this.ctx = this.cv.getContext('2d');
	}

	//-----------------------------------------------------------------------------
	box( sx,sy, ex,ey )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = "#000";
	    this.ctx.rect(sx,sy,ex-sx,ey-sy);
		this.ctx.closePath();
		this.ctx.stroke();
	}
	//-----------------------------------------------------------------------------
	fill_hach( sx,sy, ex,ey, step )
	//-----------------------------------------------------------------------------
	{
		let w = ex-sx;
		let g_scr_h = ey-sy;
		for ( let x = -w ; x <= w ; x+=step )
		{
			let x1 = x;
			let y1 = 0;
			let x2 = x+w;
			let y2 = g_scr_h;
			if ( x1 < 0 ) 
			{
				x1 = 0;
				y1 = g_scr_h-(x+w) * (g_scr_h/w);
			}
			if ( x2 > w ) 
			{
				x2 = w;
				y2 = g_scr_h-(x) * (g_scr_h/w);
			}
			// 左上がりストライプ
			this.line( 
				 sx+x1
				,sy+y1
				,sx+x2
				,sy+y2
			);
			// 右上がりストライプ
			this.line( 
				 sx+x1
				,sy+(g_scr_h-y1)
				,sx+x2
				,sy+(g_scr_h-y2)
			);
		}
	}
	//-----------------------------------------------------------------------------
	fill( sx,sy, ex,ey, col="#000" )
	//-----------------------------------------------------------------------------
	{
		/*
		this.ctx.beginPath();
	    this.ctx.rect(sx,sy,ex-sx,ey-sy);
		this.ctx.closePath();
		this.ctx.fillStyle = "#000000";
		this.ctx.fill();
		this.ctx.stroke();
		*/
		
		this.ctx.beginPath();
		this.ctx.rect(sx,sy,ex-sx,ey-sy);
		this.ctx.fillStyle = col;//"#000";
		this.ctx.fill();
		this.ctx.closePath();

	}
/*
	//-----------------------------------------------------------------------------
	line_col( sx,sy, ex,ey, col )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = col;
		this.ctx.lineWidth = 1.0;
		this.ctx.moveTo( sx, sy );
		this.ctx.lineTo( ex, ey );
		this.ctx.closePath();
		this.ctx.stroke();

	}
*/
	//-----------------------------------------------------------------------------
	line( sx,sy, ex,ey, col="#000"  )
	//-----------------------------------------------------------------------------
	{
		{
			this.ctx.beginPath();
			this.ctx.moveTo( sx, sy );
			this.ctx.lineTo( ex, ey );

			this.ctx.strokeStyle = col;//g_flgNight?"#FFF":"#000";
			this.ctx.lineWidth = 1.0;
			this.ctx.stroke();
		}
	}
	//-----------------------------------------------------------------------------
	line_bold( sx,sy, ex,ey, col="#000" )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = col;//g_flgNight?"#FFF":"#000";
		this.ctx.lineWidth = 3.0;
		this.ctx.moveTo( sx, sy );
		this.ctx.lineTo( ex, ey );
		this.ctx.closePath();
		this.ctx.stroke();

	}

	//-----------------------------------------------------------------------------
	print( tx, ty, str, col="#FFF" )
	//-----------------------------------------------------------------------------
	{
/*		this.ctx.beginPath();
		this.ctx.font = "10px monospace";
		this.ctx.fillStyle = col;
		this.ctx.fillText( str, tx, ty );
		this.ctx.closePath();
*/
		this.ctx.font = "12px monospace";
		this.ctx.fillStyle = "#000000";			// 黒い影付き
		this.ctx.fillText( str, tx+1, ty+1 );
		this.ctx.fillStyle = col;
		this.ctx.fillText( str, tx, ty );

	}


	//-----------------------------------------------------------------------------
	circle( x,y,r,col="#000" )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.lineWidth = 1.0;
		this.ctx.strokeStyle = col;//g_flgNight?"#FFF":"#000";
		this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.stroke();
	}
/*
	//-----------------------------------------------------------------------------
	circle_col( x,y,r, col )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.lineWidth = 1.0;
		this.ctx.strokeStyle = col;
		this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.stroke();
	}
*/
/*
	//-----------------------------------------------------------------------------
	circle_red( x,y,r )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = "#F00";
		this.ctx.lineWidth = 1.0;
		this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.stroke();
	}
*/
	//g_col = "#000";
	//g_back = "#FFF";
	//-----------------------------------------------------------------------------
	cls( col = "#FFF" )
	//-----------------------------------------------------------------------------
	{
		this.ctx.fillStyle = col;
		this.ctx.fillRect( 0, 0, this.cv.width, this.cv.height );
	}
/*
	//-----------------------------------------------------------------------------
	clsb( col="#000" )
	//-----------------------------------------------------------------------------
	{
		this.ctx.fillStyle = col;//g_flgNight?"#000":"#FFF"; //バックの色はラインと反対
		this.ctx.fillRect( -this.cv.width/2, -this.cv.height/2, this.cv.width, this.cv.height );
	}
*/

	//-----------------------------------------------------------------------------
	line_dir( x, y, dir, r, col="#000" )
	//-----------------------------------------------------------------------------
	{
		let x2 = r * Math.cos( dir )+x;
		let y2 = r * Math.sin( dir )+y;
		this.line( x, y, x2, y2, col );
	}

}

///// 開発用 /////


class Terrain2
{
	//2021/02/24 Terrain2	ベクタライズ機能が追加。中間データを外部表示。

	bufA = [];
	bufB = [];
	bufC = [];

	buf4 = [];

	blur1;
	blur2;
	blur3;
	bp1;
	bp2;
	bp3;

	low;	// 地面
	col;	// 諧調
	reso;	// マップテクスチャサイズ

	points = [];
	pos = {};

	//-----------------------------------------------------------------------------
	initParam( blur1, blur2, blur3, bp1, bp2, bp3, col, low )
	//-----------------------------------------------------------------------------
	{
		this.blur1 = blur1;
		this.blur2 = blur2;
		this.blur3 = blur3;
		this.bp1 = bp1;
		this.bp2 = bp2;
		this.bp3 = bp3;
		this.col =  col;
		this.low =  low;
	}
	//-----------------------------------------------------------------------------
	initSeed( reso )
	//-----------------------------------------------------------------------------
	{
		this.reso = reso;

		this.pos = {x:0,y:0}
		//g_x=0;
		//g_y=0;


//xorshift.y = -772164425; // ワニ口
//xorshift.y = 1563712943; // 上下ループ島
//xorshift.y = -1473361349; // 島二つ

///xorshift.y = -1134099774; // OF
//console.log( "seed="+xorshift.y );
		
		for ( let i = 0 ; i < this.reso*this.reso ; i++ )
		{
			this.bufA[i] = rand(1);
			this.bufB[i] = rand(1);
			this.bufC[i] = rand(1);
		}
	}
	//-----------------------------------------------------------------------------
	update_map()
	//-----------------------------------------------------------------------------
	{
		let SZ = this.reso;

		// 3x3ブラーフィルタ作成
		let pat33 = calc_pat_normalize(
		[
			[1,2,1],
			[2,4,2],
			[1,2,1],
		]);
		// 5x5ガウスブラーフィルタ作成
	//	let pat55 = calc_pat_normalize( calc_pat_gauss2d( 5, 1 ) );
		// 9x9ガウスブラーフィルタ作成
		let pat99 = calc_pat_normalize( calc_pat_gauss2d( 9, 2 ) );

		
		//--
		
		// ランダムの種をコピー
		let buf1 = Array.from(this.bufA);
		let buf2 = Array.from(this.bufB);
		let buf3 = Array.from(this.bufC);

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
		}

		// 鞣し
		// ブラーフィルタn回適用
		for ( let i = 0 ; i < this.blur1 ; i++ ) buf1 = calc_blur( buf1, pat33, SZ, SZ, this.blur1 );
		buf1 = calc_autolevel(buf1, SZ,SZ);

		for ( let i = 0 ; i < this.blur2 ; i++ ) buf2 = calc_blur( buf2, pat33, SZ, SZ, this.blur2 );
		buf2 = calc_autolevel(buf2, SZ,SZ);

		for ( let i = 0 ; i < this.blur3 ; i++ ) buf3 = calc_blur( buf3, pat33, SZ, SZ, this.blur3 );
		buf3 = calc_autolevel(buf3, SZ,SZ);

		let buf4= [];

		{//合成
			for ( let x = 0 ; x < SZ*SZ ; x++ )
			{
				buf4[x] =(buf1[x]*this.bp1+buf2[x]*this.bp2+buf3[x]*this.bp3)/(this.bp1+this.bp2+this.bp3);
			}
		}

		// 自動レベル調整
		buf4 = calc_autolevel(buf4, SZ, SZ);

		// ローパスフィルタ
		buf4 = calc_lowpass( buf4, SZ, SZ, this.low );

		if(0)
		{
			buf4.fill(0);
			{
				let [x,y,w] = [1,0,2];
				buf4 = calc_makebox( buf4, SZ, SZ, x, y, x+w, y+w, 0.8 );
			}
			{
				let [x,y,w] = [1,30,2];
				buf4 = calc_makebox( buf4, SZ, SZ, x, y, x+w, y+w, 0.8 );
			}
			{
				let [x,y,w,h] = [0,20,32,4];
				buf4 = calc_makebox( buf4, SZ, SZ, x, y, x+w, y+h, 0.8 );
			}
		}


		// 自動レベル調整
		buf4 = calc_autolevel( buf4, SZ,SZ );

		// パラポライズ
		let buf5 = calc_parapolize( buf4, SZ,SZ, this.col );

		// ベクタライズ
		this.points = calc_vectorize( buf4, SZ, SZ, this.col );

	if(0)
		// 雨削られるシミュレーション
		{
			let rate = document.getElementById( "html_rain" ).value*1;
			let num = document.getElementById( "html_rain2" ).value*1;
			for ( let i = 0 ; i < num ; i++ ) buf4 = pat_calc_rain( buf2, pat33, SZ, SZ, rate );

			// 自動レベル調整 fill:0～1.0の範囲に正規化 up:ハイレベルを1.0に合わせて底上げ
			buf4 = calc_autolevel( buf4, SZ*SZ );
		}

		this.buf4 = buf4;
		return [buf1,buf2,buf3,buf4];

	}
}

let g_terrain;


let g_cam = new vec3( 0,0,40);
let g_addYaw = rad(0.15205125);
let g_rotYaw = 0;
let g_rotPitch = rad(25);
let SZ;
let g_rate;
//-----------------------------------------------------------------------------
function update_3d()
//-----------------------------------------------------------------------------
{
	gra1.cls("#000");
	let sz = gra1.cv.height/2;
	let sc = 200;

	let flgDot = document.getElementsByName( "html_dot" )[0].checked ;
	let flgLine = document.getElementsByName( "html_line" )[0].checked ;
	

	//-----------------------------------------------------------------------------
	function calc( v )
	//-----------------------------------------------------------------------------
	{
		let x = v.x*sc + g_cam.x;
		let y = v.y*sc + g_cam.y;
		let z = v.z*sc + g_cam.z;
	
		x = x / (z+sz);
		y = y / (z+sz);

		let px=Math.floor((x+0.5)*gra1.cv.width);
		let py=gra1.cv.height-Math.floor((y+0.5)*gra1.cv.height);
		return [px,py];
	}

	function rotate( x, y, z , ry, rx )
	{
		let v = new vec3( x/SZ-0.5, y*g_rate, z/SZ-0.5 );

		v = vrotYaw( v, ry ); 
		v = vrotPitch( v, rx ); 
		return v;

	}

	if ( flgDot )
	{
		for ( let py = 0 ; py < SZ ; py++ )
		{
			for ( let px = 0 ; px < SZ ; px++ )
			{
				let adr = py*SZ+px;
				let high = g_terrain.buf4[ adr ];
	//			if ( high > 0 )
				{
					
					let v = rotate( px, high, py,g_rotYaw,g_rotPitch );


					function pset3d( v )
					{
						let [px,py] = calc(v);
						gra1.fill(px,py,px+1,py+1,"#2F2");
					} 
					pset3d( v );	
				}
			}
		}
	}	


	if ( flgLine )
	{// ベクター描画2
		let sx=0;
		let sy=0;
		let st_x=0;
		let st_y=0;
		let prev_p=0;
		let flgFirst = true;
		for( let [i,p] of g_terrain.points.entries() )
		{

			let y = p.c*13-12;

			if ( flgFirst == false )
			{
				let vs = rotate( p.x, p.c, p.y,g_rotYaw,g_rotPitch );
				let ve = rotate( prev_p.x, prev_p.c, prev_p.y,g_rotYaw,g_rotPitch );
				let [x1,y1] = calc(vs);
				let [x2,y2] = calc(ve);
				gra1.line( x1,y1,x2,y2, "#2F2" ); 
//				gra1.line( x1,y1,x2,y2, "#FFF" ); 
			}
			flgFirst = false;

			if ( p.end == 1 ) 
			{
				flgFirst = true;
			}
			prev_p = p;
		}

		gra1.print(1,gra1.cv.height-1, "3D");
	}



	g_rotYaw+=g_addYaw;
//	g_rotPitch+=rad(0.1);


	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId=requestAnimationFrame( update_3d );
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
	g_terrain.initParam(
		 document.getElementById( "html_blur1" ).value*1
		,document.getElementById( "html_blur2" ).value*1
		,document.getElementById( "html_blur3" ).value*1
		,document.getElementById( "html_bp1" ).value*1
		,document.getElementById( "html_bp2" ).value*1
		,document.getElementById( "html_bp3" ).value*1
		,document.getElementById( "html_col" ).value * 1.0
		,document.getElementById( "html_low" ).value * 1.0
		,document.getElementById( "html_reso" ).value * 1.0
	);

//	let buf= update_map( g_terrain.reso );
SZ = g_terrain.reso;

//	buf4 =buf4x;
	if (1)
	{
		let [buf1,buf2,buf3,buf4] = g_terrain.update_map();
		//-----------------------------------------------------------------------------
		function drawCanvas( cv, buf,W,H, str=null )
		//-----------------------------------------------------------------------------
		{
			//-----------------------------------------------------------------------------
			function put_buf( gra, buf )
			//-----------------------------------------------------------------------------
			{
				let h = gra.img.height;
				let w = gra.img.width
				for ( let y = 0 ; y < h ; y++ )
				{
					for ( let x = 0 ; x < w ; x++ )
					{
						let v = buf[ w*y + x ];
						gra.pset_rgbf( x, y, [v,v,v] );
					}
				}
			}
			// 画面作成
			{
				let gra = new GRA_img( W, H, cv );
				// 画面クリア
				gra.cls(0);
				// 画面描画
				put_buf( gra, buf );
				// 画面をキャンバスへ転送
				gra.streach();

				// canvasのID表示
				if ( str == null ) str = cv.id;
				gra.ctx_print(1,gra.cv.height-1, str );
			}
		}
		drawCanvas( html_canvas1, buf1,g_terrain.reso,g_terrain.reso, "A" );
		drawCanvas( html_canvas2, buf2,g_terrain.reso,g_terrain.reso, "B" );
		drawCanvas( html_canvas3, buf3,g_terrain.reso,g_terrain.reso, "C" );
		drawCanvas( html_canvas4, buf4,g_terrain.reso,g_terrain.reso, "A+B+C" );
	}

	g_rate =  document.getElementById( "html_rate" ).value * 1.0;


	{
		let gra2 = new GRA_img( html_canvas5.width, html_canvas5.height, html_canvas5 );

		gra2.cls( 0xffffff );

		draw_rasterize( gra2, g_terrain.points, g_terrain.reso, g_terrain.reso, g_terrain.pos, 1.0 );
		gra2.streach();
		gra2.ctx_print(1,gra2.cv.height-1, "等高線");
	}

	update_3d();

}

let g_reqId;
let gra1;
//let gra3;
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_terrain = new Terrain2;
	g_terrain.initParam(
		 document.getElementById( "html_blur1" ).value*1
		,document.getElementById( "html_blur2" ).value*1
		,document.getElementById( "html_blur3" ).value*1
		,document.getElementById( "html_bp1" ).value*1
		,document.getElementById( "html_bp2" ).value*1
		,document.getElementById( "html_bp3" ).value*1
		,document.getElementById( "html_col" ).value * 1.0
		,document.getElementById( "html_low" ).value * 1.0
		
	);
	g_terrain.initSeed( document.getElementById( "html_reso" ).value * 1.0);



	gra1 = new GRA_cv( html_canvas6 );


	hotstart();

}


// HTML/マウス/キーボード制御
document.onmousedown = mousemovedown;
document.onmousemove = mousemovedown;
let g_prevButtons = 0;
let g_prev_fx = null;
let g_prev_fy = null;
let g_prev_fx2 = null;
let g_prev_fy2 = null;
//let g_scale;
//-----------------------------------------------------------------------------
document.addEventListener("wheel" , function (e)
//-----------------------------------------------------------------------------
{
	let cv = html_canvas6;
	let W = g_terrain.reso;
	let H = g_terrain.reso;
	//--

	if ( e.deltaY < 0 ) g_cam.z += 8;
	if ( e.deltaY > 0 ) g_cam.z += -8
	if ( g_cam.z < -100 ) g_cam.z = -100;
console.log(g_cam.z);
	{
	    var rect = cv.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / cv.width  * W);
        let y= Math.floor((e.clientY - rect.top ) / cv.height * H);

		if ( x >= 0 && x < W && y >= 0 && y < H )
		{
//			paint_mandelbrot( 0,0, g_scale );
		
		}

	}

});
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	let cv = html_canvas6;
	let W = g_terrain.reso;
	let H = g_terrain.reso;
	let sw = cv.width / W;
	let sh = cv.height / H;
	//--
	
	if ( e.buttons==1 )
	{
	    var rect = cv.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / cv.width  * W);
        let y= Math.floor((e.clientY - rect.top ) / cv.height * H);


		if ( g_prevButtons == 0 )
		{
			g_prev_fx2 = x;
			g_prev_fy2 = y;
			g_prev_fx = x;
			g_prev_fy = y;
		}
		
		if ( x >= 0 && x < W && y >= 0 && y < H )
		{
		
			let fx1 = (x/W)-0.5;
			let fy1 = (y/H)-0.5;
			let fx2 = (g_prev_fx/W)-0.5;
			let fy2 = (g_prev_fy/H)-0.5;
			let fxa = fx1-fx2;
			let fya = fy1-fy2;

	g_addYaw=fxa;
	g_rotPitch += fya;
//			g_terrain.pos.x += fxa;
//			g_terrain.pos.y += fya;
		}
			g_prev_fx2 = g_prev_fx;	
			g_prev_fy2 = g_prev_fy;	
			g_prev_fx = x;	
			g_prev_fy = y;	

	}

	g_prevButtons = e.buttons;
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
