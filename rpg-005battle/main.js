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
		let ve = new vec3(eta,eta,eta);
		let a = vmul( ve , I ); 
		let b = eta * dot(N, I);
		let c = b + Math.sqrt(k);
		let d = vmul( new vec3(c,c,c) , N);
		R = vsub(a , d);
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



///// 汎用的な関数 /////

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
//	for ( let j = 0 ; j < n ; j++ ) r += Math.random();
	for ( let j = 0 ; j < n ; j++ ) r += xorshift.random();
	return r/n;
}
//-----------------------------------------------------------------------------
function getadr( x, y, W )
//-----------------------------------------------------------------------------
{
	return (W*y+x);
}
//-----------------------------------------------------------------------------
function round2d( x, y, W, H )
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
function clip2d( x, y, W, H )
//-----------------------------------------------------------------------------
{
	if ( x < 0   ) x = 0;
	else
	if ( x >= W ) x = W-1;

	if ( y < 0   ) y = 0;
	else
	if ( y >= H ) y = H-1;

	return (W*y + x); 
}
//-----------------------------------------------------------------------------
function edge2d( x, y, W, H )
//-----------------------------------------------------------------------------
{
//	return clip2d( x, y, W, H );	// 
	return round2d( x, y, W, H );	// 上下左右がループする
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
		this.rgb = function( r,g,b )	// xRGB 8:8:8:8 
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
			return this.rgb(r,g,b);
		}
		//-----------------------------------------------------------------------------
		this.point_frgb = function( x, y )
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
		this.pset_frgb = function( x, y, [r,g,b] )
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
		this.line_frgb = function( x1, y1, x2, y2, [r,g,b] ) 
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
				this.pset_frgb( x, y, [v,v,v] );
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
function calc_makeedge( buf0, W, H, valw, valh )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let i = 0 ; i < W ; i++ )
	{
		buf[ W*( H-1)+i ] *= valw; 
		buf[ W*0+i ] *= valw;
	}
	for ( let i = 0 ; i < H ; i++ )
	{
		buf[ W*i+0 ] *= valh;
		buf[ W*i+ (W-1) ] *= valh;
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
function calc_vectorize( buf, W, H, col )
//-----------------------------------------------------------------------------
{ // ベクトル化

/*
	//-----------------------------------------------------------------------------
	function vec_getStart( buf, sy, lvl )
	//-----------------------------------------------------------------------------
	{
		let ret = [false,-1,-1,-1,-1];

		loop:
		for ( let y = sy ; y < H ; y++ )
		{
			for ( let x = 0 ; x < W ; x++ )
			{
				if( chkedge(buf,W,H, lvl,x,y) == false )
				{
					for ( ; x < W ; x++ )
					{
						if( chkedge(buf,W,H, lvl,x+1,y) )
						{
							ret = [true,x,y,0,1];
							break loop;
						}
					}
					
				}
			}
		}

		return ret;
	}
*/


/*
	//-----------------------------------------------------------------------------
	function vec_make2( lvl )
	//-----------------------------------------------------------------------------
	{
		let msk = Array( buf.length ).fill(0);
		loop:
		for ( let y = 0 ; y < H ; y++ )
		{ 

			{ 

				let [flg,sx,sy,ax,ay] = vec_getStart( buf, y, lvl );
				if ( flg )
				{
					if ( msk[ W*sy+sx ] != lvl ) 
					{
						points = vec_search( points, buf, msk, sx, sy, ax, ay, lvl );
					}
				}
				else break loop;

			}
		}
	}

	//-----------------------------------------------------------------------------
	function vec_make3( lvl )
	//-----------------------------------------------------------------------------
	{
		loop:
		for ( let y = 0 ; y < H ; y++ )
		{ 
			loop2:
			for ( let y2 = y ; y2 < H ; y2++ )
			{
				for ( let x2 = 0 ; x2 < W ; x2++ )
				{
					if ( buf[W*y2+x2] > lvl && msk[ W*y2+x2 ] != lvl )
					if( chkedge(buf,W,H, lvl,x2,y2) == false )
					{ 
						if ( msk[ W*y2+x2 ] != lvl ) 
					 	{
							let [ax,ay] = [0,0];

							     if( chkedge(buf,W,H, lvl,x2+1,y2  ) ) [ax,ay] = [ 0, 1];
							else if( chkedge(buf,W,H, lvl,x2-1,y2  ) ) [ax,ay] = [ 0,-1];
							else if( chkedge(buf,W,H, lvl,x2  ,y2-1) ) [ax,ay] = [-1, 0];
							else if( chkedge(buf,W,H, lvl,x2  ,y2+1) ) [ax,ay] = [ 1, 0];
							else {console.log("err:vec_make()");break loop;}

console.log( ax,ay,buf[W*y2+x2] );
							points = vec_search( points, buf, msk, x2, y2, ax, ay, lvl );
						}
					}
				}
			}
		}
	}
*/
	//-----------------------------------------------------------------------------
	function vec_make_old( lvl )
	//-----------------------------------------------------------------------------
	{
		let msk = Array( buf.length ).fill(0);
		loop:
		for ( let y = 0 ; y < H ; y++ )
		{ 
			loop2:
			for ( let y2 = y ; y2 < H ; y2++ )
			{
				for ( let x = 0 ; x < W ; x++ )
				{
					if( chkedge(buf,W,H, lvl,x,y2) == false )
					{
						for ( ; x < W ; x++ )
						{
							if( chkedge(buf,W,H, lvl,x+1,y2) )
							{
								if ( msk[ W*y2+x ] != lvl ) 
								{
									points = vec_search( points, buf, msk, x, y2, 0, 1, lvl );
								}
								break loop2;
							}
						}
						
					}
				}
			}
		}
	}

	//-----------------------------------------------------------------------------
	function chkedge( buf,W,H, lvl, x, y )
	//-----------------------------------------------------------------------------
	{ // 淵かどうかを判定

		if ( 0 )
		{
			if ( x < 0   ) x = W-1;
			else
			if ( x >= W ) x = 0;

			if ( y < 0   ) y = H-1;
			else
			if ( y >= H ) y = 0;
			return ( buf[W*y+x] <= lvl ); // 崖の内側を検出
		}
		else
		{
			if ( x < 0 || y < 0 || x >= W || y >= H ) return true;
			return ( buf[W*y+x] <= lvl ); // 崖の内側を検出
		}
		
//		return ( buf[W*y+x] >= lvl ); // 崖の外側を検出
	}
	//-----------------------------------------------------------------------------
	function vec_search( points, buf, msk, sx, sy,  ax, ay, lvl )
	//-----------------------------------------------------------------------------
	{
		let x = sx;
		let y = sy;
		let c = 0;

		{
			msk[ W*y+x ] = lvl;
			tblIndex[ W*y+x ] = points.length;
			points.push( {x:x, y:y, c:c, end:0} );
		}

		let cnt = 0;

		let cnt_r = 0;
		while(1)
		{	
			if ( chkedge(buf,W,H, lvl, x+ax,y+ay) == false )
			{//前方に崖が無かったら、左手前方を調べる
				if ( chkedge(buf,W,H, lvl, x+ax+ay,y+ay-ax) == false )
				{//左手にも崖が無かったら前進＆左ターン＆前進
					x+=ax;
					y+=ay;
					[ax,ay]=[ay,-ax];
					x+=ax;
					y+=ay;
					
					msk[ W*y+x ] = lvl;
					tblIndex[ W*y+x ] = points.length;
					points.push( {x:x, y:y, c:c, end:0} );
				}
				else
				{//左手が別の色だったら	そのまま前進移動
					x+=ax;
					y+=ay;
				}
				if ( sx == x && sy== y ) 
				{
					msk[ W*y+x ] = lvl;
					tblIndex[ W*y+x ] = points.length;
					points.push( {x:x, y:y, c:c, end:1} );

					break; // 必ず元の場所に戻ってくる。
				}
				else
				{
					msk[ W*y+x ] = lvl;
					tblIndex[ W*y+x ] = points.length;
					points.push( {x:x, y:y, c:c, end:0} );
				}
				
				cnt_r=0;
			}
			else
			{//前進できなければ右ターン
				[ax,ay]=[-ay,ax];
				cnt_r++;
				if ( cnt_r>=4 ) 
				{
					msk[ W*y+x ] = lvl;
					tblIndex[ W*y+x ] = points.length;
					points.push( {x:x, y:y, c:c, end:1} );

					break; // 4連続右折は１ドットピクセル
				}
			}
			if(++cnt>3000) {console.log(">>warn!!<<:too much:",cnt);break;}
		}
	
	
		return points;
	}
	
	//-----------------------------------------------------------------------------
	function vec_make( lvl )
	//-----------------------------------------------------------------------------
	{
		for ( let y = 0 ; y < H ; y++ )
		{
			let prev = (buf[W*y+W-1]>lvl);
			for ( let x = 0 ; x < W ; x++ )
			{
				let flg = ( buf[W*y+x] > lvl );
				if ( flg && prev != flg && msk[W*y+x] != lvl )
				{
					points = vec_search( points, buf, msk, x, y, 0,-1, lvl );
				}
				prev = flg;
			}
		}

if(1)
		for ( let y = 0 ; y < H ; y++ )
		{
			let prev = (buf[W*y+0]>lvl);
			for ( let x = W-1 ; x >= 0 ; x-- )
			{
				let flg = ( buf[W*y+x] > lvl );
				if ( flg && prev != flg && msk[W*y+x] != lvl )
				{
					points = vec_search( points, buf, msk, x, y, 0, 1, lvl );
				}
				prev = flg;
			}
		}
//		console.log(points.length);
 	
	}

	// main

	let tblIndex = new Array( buf.length ).fill(-1);
	let points = [];


	let msk = Array( buf.length ).fill(0);
	for ( let j = 0 ; j < col-1 ; j++ ) // j=col=1.0に等高線は無いはずなのでcol-1にしておく。
	{
		let lvl = func_lvl( j, col );

		vec_make( lvl ); 
	}
//		vec_make( 1/3 ); 
//		vec_make( 2/3 ); 

	return [points, tblIndex];
}

//-----------------------------------------------------------------------------
function calc_rasterize( gra, points, W, H )
//-----------------------------------------------------------------------------
{// ベクター描画2

	const BACK = 0xffffff;

	gra.cls( BACK );

	let sw = gra.img.width / W;
	let sh = gra.img.height / H;

	let sx=0;
	let sy=0;
	let flgFirst = true;
	for( let i = 0 ; i < points.length ; i++ )
	{
		let ex = Math.floor(points[i].x*sw);
		let ey = Math.floor(points[i].y*sh);

		let c = points[i].c;

		if ( flgFirst == false )
		{
			gra.line_frgb( sx, sy, ex, ey, [c,c,c] ); 
		}
		flgFirst = false;

		if ( points[i].end == 1 ) 
		{
			flgFirst = true;
		}
		sx = ex;
		sy = ey;
	}

}

class GRA_cv // 直接キャンバスに描画する
{
	//-----------------------------------------------------------------------------
	constructor( ctx )
	//-----------------------------------------------------------------------------
	{
		this.ctx = ctx;
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
	fill( sx,sy, ex,ey )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
	    this.ctx.rect(sx,sy,ex-sx,ey-sy);
		this.ctx.closePath();
		this.ctx.fillStyle = "#000000";
		this.ctx.fill();
		this.ctx.stroke();

	}
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

	//-----------------------------------------------------------------------------
	line( sx,sy, ex,ey )
	//-----------------------------------------------------------------------------
	{
		if (0)
		{
			this.ctx.beginPath();
			this.ctx.strokeStyle = g_flgNight?"#FFF":"#000";
			this.ctx.lineWidth = 1.0;
			this.ctx.moveTo( sx, sy );
			this.ctx.lineTo( ex, ey );
			this.ctx.closePath();
			this.ctx.stroke();
		}
		else
		{
			this.ctx.beginPath();
			this.ctx.moveTo( sx, sy );
			this.ctx.lineTo( ex, ey );

			this.ctx.strokeStyle = g_flgNight?"#FFF":"#000";
			this.ctx.lineWidth = 1.0;
			this.ctx.stroke();
		}
	}
	//-----------------------------------------------------------------------------
	line_bold( sx,sy, ex,ey )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = g_flgNight?"#FFF":"#000";
		this.ctx.lineWidth = 3.0;
		this.ctx.moveTo( sx, sy );
		this.ctx.lineTo( ex, ey );
		this.ctx.closePath();
		this.ctx.stroke();

	}

	//-----------------------------------------------------------------------------
	scr_print( tx, ty, str, col )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.font = "10px monospace";
		this.ctx.fillStyle = col;
		this.ctx.fillText( str, tx, ty );
		this.ctx.closePath();

	}


	//-----------------------------------------------------------------------------
	circle( x,y,r )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.lineWidth = 1.0;
		this.ctx.strokeStyle = g_flgNight?"#FFF":"#000";
		this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.stroke();
	}
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

	g_col = "#000";
	g_back = "#FFF";
	//-----------------------------------------------------------------------------
	cls( col = "#FFF" )
	//-----------------------------------------------------------------------------
	{
		this.ctx.fillStyle = col;
		this.ctx.fillRect( 0, 0, html_canvas1.width, html_canvas1.height );
	}
	//-----------------------------------------------------------------------------
	clsb()
	//-----------------------------------------------------------------------------
	{
		this.ctx.fillStyle = g_flgNight?"#000":"#FFF"; //バックの色はラインと反対
		this.ctx.fillRect( -html_canvas1.width/2, -html_canvas1.height/2, html_canvas1.width, html_canvas1.height );
	}

	//-----------------------------------------------------------------------------
	line_dir( x, y, dir, r )
	//-----------------------------------------------------------------------------
	{
		let x2 = r * Math.cos( dir )+x;
		let y2 = r * Math.sin( dir )+y;
		this.line( x, y, x2, y2 );
	}

}

///// 開発用 /////


class Terrain
{

	bufA = [];
	bufB = [];
	bufC = [];

	blur1;
	blur2;
	blur3;
	bp1;
	bp2;
	bp3;
	
	tblIndex = [];
	points = [];

	low;	// 地面
	col;	// 諧調
	reso;	// マップテクスチャサイズ

	//-----------------------------------------------------------------------------
	initParam()
	//-----------------------------------------------------------------------------
	{
		this.blur1 = document.getElementById( "html_blur1" ).value*1;
		this.blur2 = document.getElementById( "html_blur2" ).value*1;
		this.blur3 = document.getElementById( "html_blur3" ).value*1;
		this.bp1 = document.getElementById( "html_bp1" ).value*1;
		this.bp2 = document.getElementById( "html_bp2" ).value*1;
		this.bp3 = document.getElementById( "html_bp3" ).value*1;
		this.col =  document.getElementById( "html_col" ).value * 1.0;
		this.low =  document.getElementById( "html_low" ).value * 1.0;

		this.reso =  document.getElementById( "html_reso" ).value * 1.0;

		this.bufA = [];
		this.bufB = [];
		this.bufC = [];


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


		//-----------------------------------------------------------------------------
		function drawCanvas( canvas, buf, str=null )
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
						gra.pset_frgb( x, y, [v,v,v] );
					}
				}
			}
			// 画面作成
			{
				let gra = new GRA_img( SZ, SZ, canvas );
				// 画面クリア
				gra.cls(0);
				// 画面描画
				put_buf( gra, buf );
				// 画面をキャンバスへ転送
				gra.streach();

				// canvasのID表示
				if ( str == null ) str = canvas.id;
				gra.print(1,gra.cv.height-1, str );
			}
		}
		
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
			buf1 = calc_makecylinder( buf1, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
			buf2 = calc_makecylinder( buf2, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
			buf3 = calc_makecylinder( buf3, SZ, SZ, SZ/2, SZ/2, SZ/8/2, 0 );
		//	drawCanvas( html_canvas6, buf1, "A" );
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

		// 自動レベル調整
		buf4 = calc_autolevel( buf4, SZ,SZ, 0 );

		{
//			let [x,y,w] = [SZ/2-1,SZ/2-1,3];
			let [x,y,w] = [13,15,2];
			buf4 = calc_makebox( buf4, SZ, SZ, x, y, x+w, y+w, 0.8 );
		}


		[this.points,this.tblIndex] = calc_vectorize( buf4, SZ, SZ, this.col );

		buf4 = calc_parapolize( buf4, SZ, SZ, this.col );


	if(0)
		// 雨削られるシミュレーション
		{
			let rate = document.getElementById( "html_rain" ).value*1;
			let num = document.getElementById( "html_rain2" ).value*1;
			for ( let i = 0 ; i < num ; i++ ) buf4 = pat_calc_rain( buf2, pat33, SZ, SZ, rate );

			// 自動レベル調整 fill:0～1.0の範囲に正規化 up:ハイレベルを1.0に合わせて底上げ
			buf4 = calc_autolevel( buf4, SZ*SZ );
		}

		
		return buf4;

	}
}

let g_terrain = new Terrain;



/////////////////////////




//////////////////////
function unit_circle( x, y, r )
{
	let cx = g_scr_cx;
	let cy = g_scr_cy;
	gra1.circle( x-cx, y-cy, r );
}
function unit_circle_red( x, y, r )
{
	let cx = g_scr_cx;
	let cy = g_scr_cy;
	gra1.circle_red( x-cx, y-cy, r );
}
function unit_line( x1, y1, x2,y2 )
{
	let cx = g_scr_cx;
	let cy = g_scr_cy;
	gra1.line( x1-cx, y1-cy, x2-cx, y2-cy );
}

let g_effect;// = new Effect(100);


class Effect
{
	//-----------------------------------------------------------------------------
	constructor( max )
	//-----------------------------------------------------------------------------
	{
		this.tblEffect = Array( max );
		this.effect_reset();
	}
	//-----------------------------------------------------------------------------
	effect_reset()
	//-----------------------------------------------------------------------------
	{
		for ( let i = 0 ; i < this.tblEffect.length ; i++ )
		{
			this.tblEffect[i] = {lim:0};
		}
		this.idx = 0;
	}
	//-----------------------------------------------------------------------------
	effect_gen( _x, _y, _r, _dir, _spd,_lim, _add_r, type = 0 )
	//-----------------------------------------------------------------------------
	{
		let e = this.tblEffect[ this.idx ];
		{
			e.type		= type;
			e.x			= _x;
			e.y			= _y;
			e.r			= _r;
			e.add_r		= _add_r;
			e.dir		= _dir;
			e.spd		= _spd;
			e.lim		= _lim;
		}

		this.idx++;
		if ( this.idx >= this.tblEffect.length ) this.idx = 0;
	}
	//-----------------------------------------------------------------------------
	effect_update()
	//-----------------------------------------------------------------------------
	{
		for ( let e of this.tblEffect )
		{
			if ( e.lim > 0 )
			{
				e.lim--;
				let th = e.dir;
				e.x += Math.cos( th )*e.spd;
				e.y += Math.sin( th )*e.spd;
				e.r += e.add_r;

				if ( e.type == 0 )
				{
					unit_circle( e.x, e.y, e.r );
				}
				else
				{
					let ox = e.x +Math.cos( th )*e.spd*6;
					let oy = e.y +Math.sin( th )*e.spd*6;
					unit_line( e.x, e.y, ox, oy );
					unit_circle( e.x, e.y, e.r );
				}
			}
		}
	}
};

class ActTst
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	tst_set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 32;
		this.time	= 0;
	}
	//-----------------------------------------------------------------------------
	tst_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};

class ActSummon
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	summon_set( cast_no, u1_x, u1_y, u1_dir, u1_size  )
	//-----------------------------------------------------------------------------
	{
		this.lim	= 60;
		this.time	= 0;
		this.cast	= g_tblCast.tbl[ cast_no ];

		let	dx = (u1_size*0.8) * Math.cos( u1_dir ) + u1_x;
		let	dy = (u1_size*0.8) * Math.sin( u1_dir ) + u1_y;

		this.r0 = u1_size*0.2;
		this.r1 = this.cast.size;
		this.x0 = dx;
		this.y0 = dy;
		this.x1 = dx + Math.cos( u1_dir ) * (u1_size + this.cast.size);
		this.y1 = dy + Math.sin( u1_dir ) * (u1_size + this.cast.size);
	}
	//-----------------------------------------------------------------------------
	summon_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			if ( this.lim == 0 )
			{
				let px = this.x1;
				let py = this.y1;
				g_unit.unit_create( 0, 2, px, py, this.cast.size, u1_dir, this.cast.tblThink, this.cast.name, this.cast.tblTalk );
			}
		}
	}
};
class ActShot
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	shot_set( num = 1, interval = 1 )
	//-----------------------------------------------------------------------------
	{
		this.lim	= num*interval;
		this.time	= 0;
		this.freq	= interval;
	}
	//-----------------------------------------------------------------------------
	shot_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			if ( (this.lim % this.freq) == 0 )
			{
				g_effect.effect_gen( 
					  u1_x
					, u1_y
					, 2
					, u1_dir
					, 3	// speed
					, 50	// lim
					, 0	// rate scale
				);
			}
		}
	}
};
class ActQuick
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
		this.bx = 0;
		this.by = 0;
	}
	//-----------------------------------------------------------------------------
	quick_set( tx, ty, fx, fy, fdir )
	//-----------------------------------------------------------------------------
	{
		this.lim	= 22;
		this.time	= 0;
		this.ax = 0;
		this.ay = 0;

		this.tx = tx;
		this.ty = ty;
	}
	//-----------------------------------------------------------------------------
	quick_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			let x = (this.tx-u1_x)/4;
			let y = (this.ty-u1_y)/4;

			this.ax = x;
			this.ay = y;
		}
	}
};
class ActVolt
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	volt_set( lim  )
	//-----------------------------------------------------------------------------
	{
		this.lim		= lim;
	}
	//-----------------------------------------------------------------------------
	volt_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
		}
	}
};
class ActDying
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	dying_set()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 32;
		this.time		= 0;
	}
	//-----------------------------------------------------------------------------
	dying_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActSleep
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	sleep_set()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 60*10;
		this.time		= 0;
	}
	//-----------------------------------------------------------------------------
	sleep_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActKiai
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	kiai_set()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 32;
		this.time		= 0;
	}
	//-----------------------------------------------------------------------------
	kiai_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActSword
{
	static NONE=0;
	static SET=0;
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.swd_req 	= 0;	//発動リクエスト
		this.swd_lim	= 0;	//発動リミット
		this.swd_stat 	= 0;	//シーケンス
	}
	//-----------------------------------------------------------------------------
	swd_set( req )
	//-----------------------------------------------------------------------------
	{
		if ( this.swd_stat == 1 ) req = 2;
		this.swd_req = req;
	}
	//-----------------------------------------------------------------------------
	swd_update( ax, ay, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.swd_req != 0  )
		{
			switch( this.swd_req )
			{
				case 1:
					this.swd_stat 	= this.swd_req;
					this.swd_req	= 0;
					this.swd_lim	= 32;
					this.swd_dir	= rad(90);
					this.swd_dir2	= rad(70);
					this.swd_add_r	= rad(+10.0);
					this.swd_acc_r	= rad(-1.0);
					break;

				case 2:
					this.swd_stat 	= this.swd_req;
					this.swd_req	= 0;
					this.swd_lim	= 32;
					this.swd_dir	= rad(70);
					this.swd_dir2	= rad(70);
					this.swd_add_r	= rad(+10.0);
					this.swd_acc_r	= rad(-1.0);
					break;
			}
		}

		if ( this.swd_stat == 1 )
		{
			{
				let th	= unit_dir+this.swd_dir;
				let r	= unit_size;
				let	bx	= r*Math.cos(th)+ax;
				let	by	= r*Math.sin(th)+ay;
				let th2	= unit_dir+this.swd_dir2;
				let	cx	= 2*r*Math.cos(th2)+ax;
				let	cy	= 2*r*Math.sin(th2)+ay;
				gra1.line_bold(bx,by,cx,cy);
			}
		}
		if ( this.swd_stat == 2 )
		{
			if ( this.swd_lim > 0 )
			{
				this.swd_lim--;
		
				let th	= unit_dir+this.swd_dir;
				let r	= unit_size;
				let	bx	= r*Math.cos(th)+ax;
				let	by	= r*Math.sin(th)+ay;
				let th2	= unit_dir+this.swd_dir2;
				let	cx	= 2*r*Math.cos(th2)+ax;
				let	cy	= 2*r*Math.sin(th2)+ay;
				this.swd_dir += this.swd_add_r;	
				this.swd_dir2 += this.swd_add_r*1.5;	
				this.swd_add_r += this.swd_acc_r;
				gra1.line_bold(bx,by,cx,cy);
			}
		}
		
	}
};

class ActTwincle	// 点滅アクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	twn_set( lim )
	//-----------------------------------------------------------------------------
	{
		this.time		= 0;
		this.lim		= lim;
		this.twn_flg		= false;
	}
	//-----------------------------------------------------------------------------
	twn_isActive()
	//-----------------------------------------------------------------------------
	{
		let pat = [0,0,0,1,1,1];
		return pat[(this.time % pat.length )]
	}
	//-----------------------------------------------------------------------------
	twn_update()
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActPunch	// パンチ攻撃アクション
{
	static bAttack = true;
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;	
	}
	//-----------------------------------------------------------------------------
	punch_set() 
	//-----------------------------------------------------------------------------
	{
		this.time		= 0;
		this.lim		= 32*2;
		this.dir		= rad(60);
		this.add_r	= rad(+8);
		this.acc_r	= rad(-0.9);
	}
	
	//-----------------------------------------------------------------------------
	punch_update( ax, ay, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )
		{
			this.lim--;
			let sz = unit_size;
			let br = unit_size/2;
			br = this.time;
			if ( br > unit_size/4 ) 
			{
				br = unit_size/4;
			}
			let r	= (br+unit_size);
			
			{
				let th	= unit_dir+this.dir;
				let	bx	= r*Math.cos(th)+ax ;
				let	by	= r*Math.sin(th)+ay;


				unit_circle( bx, by, br ); // パンチ表示
			}
			{
				let th	= unit_dir-this.dir;
				let	bx	= r*Math.cos(th)+ax;
				let	by	= r*Math.sin(th)+ay;


				unit_circle( bx, by, br ); // パンチ表示
			}

				this.dir += this.add_r;	
				this.add_r += this.acc_r;
				let a = rad(11);
				if ( this.dir < a ) 
				{
					this.add_r	= -this.add_r/4;
					this.dir = a;
				}
				this.time++;
		}
	}

};
class ActBreath	// ブレス攻撃アクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	breath_set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 80;
		this.time	= 0;
		this.freq	= 2;
		this.dir	= rad(-30);
		this.rot	= rad(2);
		this.r		= 3.2;
		this.spd	= 2;
		this.br_lim	= 40;
		this.add_r	= 32*0.005;
	}
	//-----------------------------------------------------------------------------
	breath_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++
			if ( (this.time % this.freq ) == 0 )
			{
				g_effect.effect_gen( 
					  dx
					, dy
					, this.r
					, this.dir + unit_dir +Math.sin( rad(this.time*1.2) )
					, this.spd
					, this.br_lim
					, this.add_r
				);
			}
		}
	}
};
class ActValkan	// バルカン砲え
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	valkan_set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 40;
		this.time	= 0;
		this.freq	= 2;
	}
	//-----------------------------------------------------------------------------
	valkan_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++
			if( rand(1) > 0.1 ) 
			{
				for ( let i = 0 ; i <1 ; i++ )
				{
					let dir = unit_dir + rand(2)*rad(50)-rad(50/2);
					g_effect.effect_gen( 
						  dx
						, dy
						, 5.2
						, dir //+ Math.sin(rad(this.time)*10)
						, 2 + rand(1)*4 
						, 60/4
						, -0.08*4
					);
				}

			}
		}
	}
};

class ActBite	// 噛みつきアクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	bite_set()
	//-----------------------------------------------------------------------------
	{// 2	噛付き
		this.lim	= 8;
		this.freq	= 4;
		this.r		= 1.2;
		this.spd	= 1;
		this.br_lim	= 8;
		this.add_r	= 1.0;
	}
	//-----------------------------------------------------------------------------
	bite_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			if ( (this.lim % this.freq ) == 0 )
			{
				g_effect.effect_gen( 
					 dx
					,dy
					, this.r
					, unit_dir
					, this.spd
					, this.br_lim
					, this.add_r
				);
			}
		}
	}
};
class ActLaser	// レーザー
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	bow_set( num = 1, interval = 1 )
	//-----------------------------------------------------------------------------
	{
		this.lim	= num*interval;
		this.time	= 0;
		this.freq	= interval;
	}
	//-----------------------------------------------------------------------------
	bow_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			if ( (this.lim % this.freq) == 0 )
			{
				g_effect.effect_gen( 
					  u1_x
					, u1_y
					, 2
					, u1_dir
					, 3	// speed
					, 50	// lim
					, 0	// rate scale
					,1
				);
			}
		}
	}
};
class ActLong	// ロング攻撃
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	long_set( size = 1.2 )
	//-----------------------------------------------------------------------------
	{
		this.lim	= 16;
		this.time	= 0;
		this.r		= size;
		this.spd	= size*1.25;
		this.br_lim	= 8;
		this.add_r	= size;
	}
	//-----------------------------------------------------------------------------
	long_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
			if ( this.time == 1 )
			{
				g_effect.effect_gen( 
					 dx
					,dy
					, this.r
					, unit_dir
					, this.spd
					, this.br_lim
					, this.add_r
				);
				g_effect.effect_gen( 
					 dx
					,dy
					, this.r
					, unit_dir
					, this.spd/2
					, this.br_lim*2
					, this.add_r/2
				);
			}
		}
	}
};


/*
const THINK_NONE			= 0;	// 思考しない	ユーザーコントロール

const THINK_ATTACK			= 1;	// 攻撃			接近戦	追いかける剣で戦う
const THINK_LONGATTACK		= 2;	// ロング攻撃	距離戦	弓、魔法から適切なものが自動選択
const THINK_DEFFENCE		= 3;	// 護衛			体力の弱い仲間を護衛する。
const THINK_MAB				= 4;	// 回り込むB	背後に回り込む
const THINK_MAF				= 5;	// 回り込むF	敵の前をふさぐ
const THINK_RUN				= 6;	// 逃げる
const THINK_SEARCH			= 7;	// 探す

const THINK_BACK			= 8;	// 後退
const THINK_FORWARD			= 9;	// 前進
const THINK_MAWARI_R		= 10;	// 回り込み右
const THINK_MAWARI_L		= 11;	// 回り込み左
const THINK_ATTACK_BREATH	= 12;	// ブレス攻撃
const THINK_ATTACK_BITE		= 13;	// 噛付き攻撃
*/



class Cast
{
	constructor( jsonCast )
	{
		this.tbl = jsonCast ;

		let makeratio = function( tblThink )
		{// rate（割合）からratio（比率）を作成
			let amt = 0;
			for ( let t of tblThink )
			{
				amt += t.rate;
				t.ratio = amt;
			}
			for ( let t of tblThink )
			{
				t.ratio /= amt;
			}
		}
		for ( let key of Object.keys(this.tbl) )
		{
			makeratio( this.tbl[key].tblThink );
		}

	}
};

const ACT_NONE		= 0;	// 攻撃しない
const ACT_BREATH	= 1;	// ブレス攻撃
const ACT_BITE		= 2;	// 噛付き攻撃
const ACT_PUNCH		= 3;	// パンチ
const ACT_TWINCLE	= 4;	// 点滅
const ACT_SWORD		= 5;	// 剣
const ACT_VOLT		=20;	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する
const ACT_DYING		=21;	// 瀕死	激しく大小に脈打つ
const ACT_QUICK		=22;	// 瞬間移動	すっと小さくなって消え、直線の移動先に今度は大きくなって現れる
const ACT_SHOT		= 6;	// 投げる	岩を投げるようなイメージ
const ACT_VALKAN	= 7;	// 散弾	ドラゴンが大量の酸の唾を吐くようなイメージ
const ACT_SUMMON	= 8;	// 生成	召喚士がモンスターを生成する
const ACT_BOW		= 9;	// 攻撃	通常攻撃
const ACT_LONG		=10;	// 剣戟	長い手を伸ばして攻撃
const ACT_KIAI		=11;	// 気合	噛付いて投げ飛ばす
const ACT_SLEEP		=18;	// 遁走	ボスが倒されたり

const ACT_ALPHA		=12;	// 半透明	薄くなって移動。薄い間は攻撃できないが、ダメージも食らわない
const ACT_WARP		=13;	// ワープ	フェードアウトし、別のところからフェードインして現れる
const ACT_PUSH		=14;	// 押す	弾き飛ばすけ
const ACT_JUMP		=15;	// ジャンプ	踏付け
const ACT_GUID		=16;	// 誘導	誘導属性がある。追尾モンスター生成でも良いかも
const ACT_RUN		=17;	// 遁走	ボスが倒されたり

class Unit
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.unit_init();
	}
	//-----------------------------------------------------------------------------
	unit_init()
	//-----------------------------------------------------------------------------
	{
		this.tblUnit =[];
	}
	//-----------------------------------------------------------------------------
	unit_create( boss, gid, x, y, size, dir, tblThink, name, tblTalk )
	//-----------------------------------------------------------------------------
	{
		this.tblUnit.push(
			{
				boss		: boss,
				gid			: gid,	// グループID , 1:Player
				stat		: 0,	// 0:nomal 1:衝突中
				flgCol		: false,	// 衝突発生フラグ
				x			: x,
				y			: y,
				add_x		: 0,
				add_y		: 0,
				req_x		: 0,	// 移動先リクエスト座標
				req_y		: 0,	// 移動先リクエスト座標 
				size		: size,
				dir			: dir,
				tblThink	: tblThink,
				name		: name,
				oneTalk		: null,	// 一回限りのセリフバッファ
				tblTalk		: tblTalk,
				seqTalk		: 0,
				limTalk		: 10,
				time		: 0,
				to_dir		: 0,
				think_type	: 0,
				think_lim	: 0,

				sword	: new ActSword,
				twincle	: new ActTwincle,
				punch	: new ActPunch,
				breath	: new ActBreath,
				valkan	: new ActValkan,
				bite	: new ActBite,
				bow		: new ActLaser,
				long	: new ActLong,
				volt	: new ActVolt,
				dying	: new ActDying,
				sleep	: new ActSleep,
				kiai	: new ActKiai,
				quick	: new ActQuick,
				shot	: new ActShot,
				summon	: new ActSummon,


				alpha	: new ActTst,
				warp	: new ActTst,
				push	: new ActTst,
				jump	: new ActTst,
				guid	: new ActTst,
				run		: new ActTst,

			}
		);
	}


	//-----------------------------------------------------------------------------
	unit_update( u1 )
	//-----------------------------------------------------------------------------
	{
		////////////////
		// 表示
		////////////////

		let	er = Math.cos(rad(u1.time*10))*0.6;
		let dx,dy;
		if(1) // 目表示
		{
			let r = u1.size*0.8 + er;
			dx = r * Math.cos( u1.dir ) + u1.x;
			dy = r * Math.sin( u1.dir ) + u1.y;
		}
		else
		{
			dx = u1.size * Math.cos( u1.dir ) + u1.x;
			dy = u1.size * Math.sin( u1.dir ) + u1.y;
			unit_line( u1.x, u1.y, dx, dy );	// 本体方向表示
		}

		u1.time+=1;

		if ( u1.breath.lim > 0 )
		{
			u1.oneTalk = {lim:30, str:"くらえ！焦熱のブレス" };
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.punch.lim > 0 )
		{
			u1.oneTalk = {lim:30,str:"パンチ～" };
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.bite.lim > 0 )
		{
			u1.oneTalk = {lim:30,str:"咬み咬み" };
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.bow.lim > 0 )
		{
			u1.oneTalk = {lim:30,str:"攻撃" };
			
			let r = u1.bow.time*4;
			let tx = dx + r * Math.cos( u1.dir );
			let ty = dy + r * Math.sin( u1.dir );

			unit_line( dx, dy, tx, ty );
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.long.lim > 0 )
		{
			u1.oneTalk = {lim:30,str:"ロング攻撃" };
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.quick.lim > 0 ) 					// 高速移動
		{
			u1.oneTalk = {lim:30,str:"フフッ" };
			u1.add_x += u1.quick.ax;	
			u1.add_y += u1.quick.ay;	
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.summon.lim > 0 ) 					// 電撃
		{
			u1.oneTalk = {lim:30,str:"召喚～" };

			if(0)
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let sz = u1.summon.lim/8;
				let st = rad(8);
				while( th < Math.PI*2 )
				{
					let r = u1.size+rand(1)*sz;
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					if ( x2 == 0 ) 
					{
						x0 = x1;
						y0 = y1;
					}
					else
					{
						unit_line( x1,y1,x2,y2);
					}
					x2 = x1;
					y2 = y1;
					th += st;
				}
				unit_line( x0,y0,x2,y2);
			}
			else
			{
				for ( let i = 0 ; i < u1.summon.lim/8 ; i++ )
				{
					const sz = u1.summon.lim*u1.size/32/2;
					let x = rand(3)*sz-sz/2;
					let y = rand(3)*sz-sz/2;
					unit_circle( u1.x+x, u1.y+y, er+u1.size );	// 本体表示
					unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示
				}
			}

			let s = u1.summon;
			let t = s.time / ( s.time + s.lim );
			let x = (s.x1-s.x0)*t + s.x0;
			let y = (s.y1-s.y0)*t + s.y0;
			let r = (s.r1-s.r0)*t + s.r0;

			unit_circle( x, y, r );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示
		}
		else
		if ( u1.volt.lim > 0 ) 					// 電撃
		{
			u1.oneTalk = {lim:30,str:"電撃アターック！" };
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let sz = u1.volt.lim/2;
				let st = rad(8);
				while( th < Math.PI*2 )
				{
					let r = u1.size+rand(1)*sz;
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					if ( x2 == 0 ) 
					{
						x0 = x1;
						y0 = y1;
					}
					else
					{
						unit_line( x1,y1,x2,y2);
					}
					x2 = x1;
					y2 = y1;
					th += st;
				}
				unit_line( x0,y0,x2,y2);
			}
		}
		else
		if ( u1.dying.lim > 0 ) 					// 瀕死
		{
			u1.oneTalk = {lim:30,str:"瀕死ぴえん" };
			for ( let i = 0 ; i < u1.dying.lim/2 ; i++ )
			{
				const sz = u1.dying.lim*u1.size/32;
				let x = rand(3)*sz-sz/2;
				let y = rand(3)*sz-sz/2;
				unit_circle( u1.x+x, u1.y+y, er+u1.size );	// 本体表示
			}
		}
		else
		if ( u1.sleep.lim > 0 ) 					// 睡眠
		{
			u1.oneTalk = {lim:30,str:"Zzz..." };

			er = Math.cos(rad(u1.sleep.time*5))*1.8+er;
			let r = u1.size*0.8 + er;
			dx = r * Math.cos( u1.dir ) + u1.x;
			dy = r * Math.sin( u1.dir ) + u1.y;
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示

			if ( (u1.sleep.time % 48) == 0 )
			{
					g_effect.effect_gen( 
						 dx
						,dy
						, u1.size*0.2
						, u1.dir-rad(45)
						, 0.25
						, 80
						, 0.05
						,0
					);
			}
		}
		else
		if ( u1.kiai.lim > 0 ) 					// 気合
		{
			u1.oneTalk = {lim:30,str:"フンッ！" };
			if ( u1.kiai.time == 1 )
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let st = rad(30);
				while( th <= Math.PI*2 )
				{
					let t = u1.kiai.time
					let r = u1.size+t;
					let sz = rad(6*t);
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					th += st;
					g_effect.effect_gen( 
						 x1
						,y1
						, 5
						, th//u1.dir
						, 1
						, 20
						,-0.2
					);
				}
				unit_line( x0,y0,x2,y2);
			}
			if ( u1.kiai.time == 10 )
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let st = rad(30);
				while( th <= Math.PI*2 )
				{
					let t = u1.kiai.time
					let r = u1.size+t;
					let sz = rad(6*t);
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					th += st;
					g_effect.effect_gen( 
						 x1
						,y1
						, 5
						, th//u1.dir
						, 0.1
						, 20
						,-0.2
					);
				}
				unit_line( x0,y0,x2,y2);
			}
			unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
			unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示
		}
		else
		if ( u1.twincle.lim > 0 )
		{
			u1.oneTalk = {lim:30,str:"見えないよ～ん" };
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let sz = rad(6);
				let st = rad(18);
				while( th <= Math.PI*2 )
				{
					let r = u1.size+er*4;
					r = r+rand(1)*3;
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					let x2 = r*Math.cos(th+sz) + u1.x;
					let y2 = r*Math.sin(th+sz) + u1.y;
					unit_line( x1,y1,x2,y2);
					th += st;
				}
				unit_line( x0,y0,x2,y2);
			}
		}
		else
		{
//			if( u1.stat == 0 )
			{
				unit_circle( u1.x, u1.y, er+u1.size );	// 本体表示
				unit_circle( dx,dy,(u1.size*0.2) );		// 口、目表示
			}
//			else
//			{
//				unit_circle_red( u1.x, u1.y, er+u1.size );	// 本体表示
//				unit_circle_red( dx,dy,(u1.size*0.2) );		// 口、目表示
//			}
			
		}
		
		////////////////
		// update
		////////////////

		u1.sword.swd_update( u1.x, u1.y, u1.size, u1.dir );
		u1.punch.punch_update( u1.x, u1.y, u1.size, u1.dir );
		u1.twincle.twn_update();
		u1.bite.bite_update( dx, dy, u1.size, u1.dir );
		u1.bow.bow_update( dx, dy, u1.size, u1.dir );
		u1.long.long_update( dx, dy, u1.size, u1.dir );
		u1.breath.breath_update( dx, dy, u1.size, u1.dir );
		u1.valkan.valkan_update( dx, dy, u1.size, u1.dir );

		u1.volt.volt_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.dying.dying_update( u1.x, u1.y, u1.size, u1.dir );
		u1.sleep.sleep_update( u1.x, u1.y, u1.size, u1.dir );
		u1.kiai.kiai_update( u1.x, u1.y, u1.size, u1.dir );
		u1.quick.quick_update( u1.x, u1.y, u1.size, u1.dir );	

		u1.shot.shot_update( dx, dy, u1.size, u1.dir );	
		u1.summon.summon_update( dx, dy, u1.size, u1.dir );	
		u1.alpha.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.warp.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.push.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.jump.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.guid.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.run.tst_update( u1.x, u1.y, u1.size, u1.dir );	


	}

	//-----------------------------------------------------------------------------
	unit_think( u1 )
	//-----------------------------------------------------------------------------
	{
		////////////////
		// 思考
		////////////////
		{// 狙いを決める
			let tar_x = 0;
			let tar_y = 0;
			{
				let cnt = 0;
				for ( let u1 of g_unit.tblUnit )
				{
					if ( u1.gid == 1 ) 
					{
						tar_x += u1.x;
						tar_y += u1.y;
						cnt++;
					}
				}

				tar_x /= cnt;
				tar_y /= cnt;

			}
			{	// 方向を求める
				let x0	= tar_x;
				let y0	= tar_y;
				u1.to_dir = Math.atan2( (y0-u1.y), (x0-u1.x) );
			}
		}

		{
			let act	= u1.tblThink[ u1.think_type ];

			{	// アクション発動
				let num = act.act_no;
				if ( num == ACT_TWINCLE	) 	u1.twincle.twn_set( 60 );
				if ( num == ACT_PUNCH	) 	u1.punch.punch_set();
				if ( num == ACT_BREATH	)	u1.breath.breath_set();
				if ( num == ACT_VALKAN	)	u1.valkan.valkan_set();
				if ( num == ACT_BITE	)	u1.bite.bite_set();
				if ( num == ACT_BOW		)	u1.bow.bow_set();
				if ( num == ACT_LONG	)	u1.long.long_set( u1.size/8 );
				if ( num == ACT_SWORD	)	u1.sword.swd_set( 1 );

				if ( num == ACT_VOLT	)	u1.volt.volt_set( 32 );	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する
				if ( num == ACT_DYING	)	u1.dying.dying_set();
				if ( num == ACT_SLEEP	)	u1.sleep.sleep_set();
				if ( num == ACT_KIAI	)	u1.kiai.kiai_set();	// 気合	噛付いて投げ飛ばす
				if ( num == ACT_QUICK	)	
				{
					if ( u1.quick.lim == 0 )
					{
						// 攻撃対象との相対角度を求める
						let th = u1.to_dir - u1.dir;
						if ( th < -Math.PI ) th += Math.PI*2;
						if ( th >  Math.PI ) th -= Math.PI*2;
						
						// 右にいるか左にいるかを判断し、移動方向を決める
						if ( th > 0 )
						{
							th = rad(60);
						}
						else
						{
							th = rad(-60);
						}
						// 移動先座標を決める
						{
							let dir = u1.dir+th;
							let r = 80;	
							let x = r*Math.cos(dir)+u1.x;
							let y = r*Math.sin(dir)+u1.y;
							u1.quick.quick_set( x, y, u1.x, u1.y, u1.dir);
						}
					}
			

				}

				if ( num == ACT_SHOT	)	u1.shot.shot_set(2,6);	// 投げる	岩を投げるようなイメージ
				if ( num == ACT_SUMMON	)	u1.summon.summon_set("ZOMBIE", u1.x, u1.y, u1.dir, u1.size );	// 召喚
				if ( num == ACT_ALPHA	)	u1.alpha.tst_set();	// 半透明	薄くなって移動。薄い間は攻撃できないがダメージも食らわない
				if ( num == ACT_WARP	)	u1.warp.tst_set();	// ワープ	フェードアウトし、別のところからフェードインして現れる
				if ( num == ACT_PUSH	)	u1.push.tst_set();	// 押す	弾き飛ばすけ
				if ( num == ACT_JUMP	)	u1.jump.tst_set();	// ジャンプ	踏付け
				if ( num == ACT_GUID	)	u1.guid.tst_set();	// 誘導	誘導属性がある。追尾モンスター生成でも良いかも
				if ( num == ACT_RUN		)	u1.run.tst_set();	// 遁走	ボスが倒されたり
			}

			{// 方向を変える
				// 相対角を求める
				let s = u1.to_dir - u1.dir;
				if ( s < -Math.PI ) s += Math.PI*2;
				if ( s >  Math.PI ) s -= Math.PI*2;

				let r = 0;
				if ( s > 0 ) 
				{
					r =  Math.min(s,act.rot_spd);
				}
				if ( s < 0 ) 
				{
					r =  -Math.min(-s,act.rot_spd);
				}
				u1.dir += r;
			}

			{	//MOVE

				let th = u1.dir+act.mov_dir;
				u1.add_x += Math.cos( th )*act.mov_spd;
				u1.add_y += Math.sin( th )*act.mov_spd;
			}

		}

		u1.think_lim--;
		if ( u1.think_lim <= 0 )	// 思考パターン抽選
		{
			u1.think_type = 0;
			let r = Math.random();
			for ( let i = 0 ; i < u1.tblThink.length ; i++ )
			{
				let tnk = u1.tblThink[i];
				if ( r < tnk.ratio ) 
				{
					u1.think_type = i;
					u1.think_lim = Math.floor( rand(tnk.num)*tnk.quant )+1;
					break;
				}
			}
			if ( u1.think_type == 0 ) console.log("抽選失敗");			
		}
	}
	//-----------------------------------------------------------------------------
	unit_allupdate()
	//-----------------------------------------------------------------------------
	{
		for ( let u1 of g_unit.tblUnit ) 
		{
			this.unit_update( u1 );
		}

		for ( let u1 of g_unit.tblUnit ) 
		{// 思考ルーチン
			if ( u1.gid == 0 ) continue;	// グループID=0 はNONE
			if ( u1.gid == 1 ) continue;	// グループID=1 はPlayer
			this.unit_think( u1 );
		}

		for ( let u1 of g_unit.tblUnit ) 
		{ // 移動準備
			let ux = u1.x + u1.add_x;
			let uy = u1.y + u1.add_y;
			{
				const sz = g_terrain.reso * g_tile_SZ;
				if ( ux < 0		) ux += sz;
				if ( ux >= sz	) ux -= sz;
				if ( uy < 0		) uy += sz;
				if ( uy >= sz	) uy -= sz;
			}
			u1.add_x = 0;
			u1.add_y = 0;
			u1.req_x = ux;
			u1.req_y = uy;
		}
		
		{ // ユニット同士の衝突
			for ( let i = 0 ; i < g_unit.tblUnit.length ; i++ )
			{
				for ( let j = i+1 ; j < g_unit.tblUnit.length ; j++ )
				{
					let u1 = g_unit.tblUnit[i];
					let u2 = g_unit.tblUnit[j];

					u1.stat = 0;
					u2.stat = 0;
					let flg = false; 
					let size	= u2.size + u1.size;
					let far 	= Math.sqrt( (u2.req_x-u1.req_x)*(u2.req_x-u1.req_x) + (u2.req_y-u1.req_y)*(u2.req_y-u1.req_y) );			
					if ( size > far ) 
					{
						let far = Math.sqrt( (u2.x-u1.x)*(u2.x-u1.x) + (u2.y-u1.y)*(u2.y-u1.y) );			
						if ( size > far ) 
						{
							// 移動前から既に衝突してる状態なら、次回に離れるように移動するように設定。
							// ※移動前には衝突していないのなら変更しない
							let dir = Math.atan2( (u2.y-u1.y), (u2.x-u1.x) );
							let r = (size-far)/2;
							u1.add_x += -r * Math.cos( dir );
							u1.add_y += -r * Math.sin( dir );
							u2.add_x += r * Math.cos( dir );
							u2.add_y += r * Math.sin( dir );
							u1.stat = 1;
							u2.stat = 1;
						}
						flg = true;
					}
					u1.flgCol = flg;
					u2.flgCol = flg;
				}
			}
		}
		
		// 移動
		for ( let u1 of g_unit.tblUnit ) 
		{
			if ( u1.flgCol == false )
			{
				// 衝突が起きてなければ移動
				u1.x = u1.req_x;
				u1.y = u1.req_y;
			}
			u1.req_x = 0;
			u1.req_y = 0;
			u1.flgCol = false;
		}
	}
	

};

let g_unit = new Unit;

let g_json_cast = 
{
	"DUMMY":
	{
		name		:"DUMMY",
		size		:  2,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"PLAYER1":
	{
		name		:"こーぞ",
		size		:  13,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"PLAYER2":
	{
		name		:"ティナ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"PLAYER3":
	{
		name		:"ユイ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"DRAGON":	// 竜型	ドラゴン
	{
		name		:"ドラゴン"	,
		size		: 52,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)		,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad(180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant: 72, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 60)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad(-60)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"ブレス"	,act_no:ACT_BREATH	,mov_dir:rad(0)		,mov_spd:0.25	, rot_spd:rad(0.6)	,rate:10, quant:0, num:3 },
		]
	},
	"WOLF":	// 獣型	ウルフ
	{
		name		:"ウルフ"		,
		size		: 10,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad(  80)	,mov_spd:0.34 	, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( -80)	,mov_spd:0.34 	, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
			{name:"噛付き"	,act_no:2,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:10, quant:0, num:3 },
		]
	},
	"MINO":	// 人型ミノタウロス
	{
		name		:"ミノタウロス",
		size		: 30,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.40	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( -45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"パンチ"	,act_no:3			,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.6)	,rate:30, quant:0, num:3 },
		]
	},
	"GHOST":	// 幽体	ゴースト
	{
		name		:"ゴースト"	,
		size		: 14,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  60)	,mov_spd:0.35	, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -60)	,mov_spd:0.35	, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
			{name:"BR"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
			{name:"TWINCLE"	,act_no:4			,mov_dir:rad(   0)	,mov_spd:1.30 	, rot_spd:rad(0.3)	,rate:20, quant: 0, num:3 },
		]
	},
	"ZOMBIE":	// 人型	ゾンビ
	{
		name		:"ゾンビ"		,
		size		: 12,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"探す"	,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(1.0)	,rate:10, quant: 48, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.25 	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  30)	,mov_spd:0.25	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -30)	,mov_spd:0.25	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
		]
	},
	"SWORDMAN":	// 人型	ソードマン
	{
		name		:"ソードマン"	,
		size		: 16,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.2 	, rot_spd:rad(0.3)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  90)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:20, quant: 72, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-140)	,mov_spd:0.3	, rot_spd:rad(0.1)	,rate:20, quant: 96, num:3 },
			{name:"攻撃"	,act_no:ACT_SWORD	,mov_dir:rad(   0)	,mov_spd:2.30 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"脈動"	,act_no:ACT_DYING	,mov_dir:rad(   0)	,mov_spd:2.30 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },

		]
	},
	"TSTMAN":	// 人型	テストマン
	{
		name		:"テストマン"	,
		size		: 16,
		tblTalk		:["",50,"やぁやぁ我こそはテストマン",30,"いざ尋常に！"],
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  60)	,mov_spd:0.32	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -60)	,mov_spd:0.32	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"BR"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"ブレス"	,act_no:ACT_BREATH	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"噛付き"	,act_no:ACT_BITE	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"パンチ"	,act_no:ACT_PUNCH	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"点滅"	,act_no:ACT_TWINCLE	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"剣"		,act_no:ACT_SWORD	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"脈動"	,act_no:ACT_DYING	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"射撃"	,act_no:ACT_SHOT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"瞬足"	,act_no:ACT_QUICK	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(4.0)	,rate:120, quant: 20, num:3 },
			{name:"半透明"	,act_no:ACT_ALPHA	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"ワープ"	,act_no:ACT_WARP	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"押す"	,act_no:ACT_PUSH	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"ジャンプ",act_no:ACT_JUMP	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"長距離"	,act_no:ACT_LONG	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"追尾"	,act_no:ACT_GUID	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"電撃"	,act_no:ACT_VOLT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"気合"	,act_no:ACT_KIAI	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"散弾"	,act_no:ACT_VALKAN	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"生成"	,act_no:ACT_SUMMON		,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"遁走"	,act_no:ACT_RUN		,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
		]
	},
	"NINJA":	// 人型	忍者			クイックな動きと手裏剣
	{
		name		:"忍者"	,
		size		: 16,
		tblTalk		:["",70,"某がお相手いたそう",30,"いざッ"],
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  60)	,mov_spd:1.0	, rot_spd:rad(1.5)	,rate:20, quant: 96, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -60)	,mov_spd:1.0	, rot_spd:rad(1.5)	,rate:20, quant: 96, num:3 },
			{name:"BR"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:1.0 	, rot_spd:rad(1.0)	,rate:20, quant: 96, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-120)	,mov_spd:1.0 	, rot_spd:rad(1.0)	,rate:20, quant: 96, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad(-180)	,mov_spd:4.0 	, rot_spd:rad(0.0)	,rate:10, quant: 20, num:3 },
			{name:"瞬足"	,act_no:ACT_QUICK	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(28.0)	,rate:20, quant: 30, num:3 },
			{name:"撃つ"	,act_no:ACT_SHOT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(28.0)	,rate:20, quant: 0, num:3 },
		]
	},
	"WIBARN":	// 飛竜	ワイバーン		酸の唾を吐く
	{
		name		:"ワイバーン"	,
		size		: 32,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(  0)	,mov_spd:0.25	, rot_spd:rad(1.0)	,rate: 0, quant:  0, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 90)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:20, quant: 72, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 60)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad(45)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"バルカン",act_no:ACT_VALKAN	,mov_dir:rad(  0)	,mov_spd:0.25	, rot_spd:rad(0.6)	,rate:10, quant:0, num:3 },
		]
	},
	"SUMMON":	// 人型	召喚士	召喚
	{
		name		:"召喚士"	,
		size		: 12,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(  0)	,mov_spd:0.0	, rot_spd:rad(0.0)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:0.75	, rot_spd:rad(0.8)	,rate:20, quant: 8, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad(  90)	,mov_spd:1.25	, rot_spd:rad(0.8)	,rate:20, quant: 36, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 60)	,mov_spd:1.0	, rot_spd:rad(0.8)	,rate:20, quant:36, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( 160)	,mov_spd:0.5	, rot_spd:rad(0.8)	,rate:20, quant:8, num:3 },
			{name:"召喚"	,act_no:ACT_SUMMON	,mov_dir:rad(  0)	,mov_spd:0.25	, rot_spd:rad(0.3)	,rate:4, quant:0, num:3 },
		]
	},
	"ORC":	// 人型	オーク
	{
		name		:"オーク"	,
		size		: 14,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.2 	, rot_spd:rad(0.3)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  90)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:20, quant: 72, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-140)	,mov_spd:0.3	, rot_spd:rad(0.1)	,rate:20, quant: 36, num:3 },
			{name:"攻撃"	,act_no:ACT_LONG	,mov_dir:rad(   0)	,mov_spd:2.30 	, rot_spd:rad(0.3)	,rate:20, quant: 0, num:3 },
		]
	},
	"ARCHER":	// 人型	弓
	{
		name		:"アーチャー",
		size		: 12,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.40	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( -45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"弓"		,act_no:ACT_BOW		,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.6)	,rate:30, quant:0, num:3 },
		]
	},
//	"GIANT":	// 人型	巨人
//	"TOROL":	// 人型	トロール
//	"GOBLIN":	// 人型	ゴブリン	
//	"CYCROPS":	// 人型	サイクロプス	目からレーザー
};

const g_tblCast = new Cast( g_json_cast );

const g_tile_SZ = 52;
const g_scr_ofx = html_canvas1.width/2;	//canvas 左上オフセットx
const g_scr_ofy = html_canvas1.height/2;	//canvas 左上オフセットy
const g_scr_radius = 256;
const g_scr_w = Math.floor(2*g_scr_radius/g_tile_SZ);
const g_scr_h = Math.floor(2*g_scr_radius/g_tile_SZ);
const g_scr_sx = (2*g_scr_ofx-g_scr_w*g_tile_SZ)/2+g_tile_SZ/2;
const g_scr_sy = (2*g_scr_ofy-g_scr_h*g_tile_SZ)/2+g_tile_SZ/2;

let g_scr_rot = 0;

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
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



	let cntPlayer =0;
	for ( let u1 of g_unit.tblUnit ) 
	{
		if ( u1.gid == 1 )	// グループID=1 はPlayer
		{
			cntPlayer++;
			if ( cntPlayer > 1 ) {if ( Math.random() < 0.5 ) continue;}
			if ( c == KEY_LEFT	) u1.dir -= rad(4);
			if ( c == KEY_RIGHT	) u1.dir += rad(4);

			{
				let spd = 0;
				let dir = u1.dir;

				if ( c == KEY_UP	) {spd=3;dir = u1.dir;}
				if ( c == KEY_DOWN	) {spd=-3;dir = u1.dir;}

				if ( c == KEY_W	) {spd= 6;dir = u1.dir;}
				if ( c == KEY_S	) {spd= 6;dir = u1.dir+rad(180);}
				if ( c == KEY_A	) {spd= 6;dir = u1.dir+rad(-90);}
				if ( c == KEY_D	) {spd= 6;dir = u1.dir+rad( 90);}

				{ // MOVE
					u1.x += Math.cos( dir )*spd;
					u1.y += Math.sin( dir )*spd;
					const sz = g_terrain.reso * g_tile_SZ;
					if ( u1.x < 0 	) u1.x += sz;
					if ( u1.x >= sz ) u1.x -= sz;
					if ( u1.y < 0 	) u1.y += sz;
					if ( u1.y >= sz ) u1.y -= sz;
				}
			}

			if ( c == KEY_F )	//ソード
			{
				u1.sword.swd_set( 1 );
			}
			if ( c == KEY_G )	//
			{
				u1.sleep.sleep_set();	
			}
			if ( c == KEY_H )	//
			{
				u1.kiai.kiai_set();	
			}
			if ( c == KEY_J )	//
			{
				u1.long.long_set( u1.size/8 );
			}
			if ( c == KEY_K )	//
			{
				u1.bow.bow_set();
			}
			if ( c == KEY_L )	//
			{
				u1.summon.summon_set("WOLF", u1.x, u1.y, u1.dir, u1.size );
			}
			if ( c == KEY_E )	//
			{
				u1.valkan.valkan_set();
			}
			if ( c == KEY_R )	//
			{
				u1.shot.shot_set(2,4);
			}
			if ( c == KEY_T )	//
			{
				u1.volt.volt_set(32);	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する
			}
			if ( c == KEY_Y )	//
			{
				u1.dying.dying_set();	
			}
			if ( c == KEY_I )	//噛付き
			{
				u1.bite.bite_set();
			}
			if ( c == KEY_O )	// ブレス
			{
				u1.breath.breath_set();
			}
			if ( c == KEY_P )	//パンチ
			{
				u1.punch.punch_set();
			}
			if ( c == KEY_U )	//点滅
			{
				u1.twincle.twn_set( 32 );
			}
			if ( c == KEY_2 )	//
			{
				u1.size += 1;
			}
			if ( c == KEY_1 )	//
			{
				u1.size -= 1;
			}
		}
	}
}

//-----------------------------------------------------------------------------
function game_init( start_x, start_y )
//-----------------------------------------------------------------------------
{//ユニット配置

	//.unit_create( 0, 100, 350, 16, rad(-90), "ティナ",THINK_NONE );
	//.unit_create( 0, 290, 300, 16, rad(-90), "ユイ",THINK_NONE );

	//.unit_create( 1,100,  40, 25, 0.25, rad(90),"ワイバーン",THINK_ATTACK_BREATH );
	//.unit_create( 1,192, 150, 36, 0.25, rad(90), "ドラゴン",THINK_ATTACK_BREATH );
	//.unit_create( 1,300, 130, 22, 0.25, rad(90), "ゴースト",THINK_ATTACK_BREATH );
		let g_sets=[
			[9,9,0,9,0,9,9],
			[9,0,9,3,9,0,9],
			[0,0,0,9,0,0,0],
			[0,4,0,0,0,4,0],
			[0,0,0,9,0,0,0],
			[9,0,9,1,9,0,9],
			[9,9,9,9,9,9,9],
		];
		const hosei_x = 3;
		const hosei_y = 5;
	{
		for ( let y = 0 ; y < g_sets.length ; y++ )
		{
			for ( let x = 0 ; x < g_sets[y].length ; x++ )
			{
				switch( g_sets[y][x] )
				{
					case 0:	// 雑魚
						if ( y < 3 )
						{
							if ( rand(1) < 0.2 ) g_sets[y][x] = 2;
						}
						else
						{
							if ( rand(1) < 0.1 ) g_sets[y][x] = 2;
						}
						break;

					case 3:	// ボス
						{
						//	if ( rand(1) < 0.2 ) g_sets[y][x] = 0;
						}
						break;

					case 4:	// 中ボス
						{
							if ( rand(1) < 0.2 ) g_sets[y][x] = 0;
						}
						break;
				}
			}
		}
	}

	if (1)
	{	// テスト用
				
		{
			const cast = g_tblCast.tbl[ "PLAYER1" ];
			g_unit.unit_create( 0, 1, start_x, start_y, cast.size, rad(-90), cast.tblThink, cast.name, cast.tblTalk );
		}
/*
		{
			const cast = g_tblCast.tbl[ "DRAGON" ];
			g_unit.unit_create( 0, 0, 1000-52+20, 900, cast.size, rad(-90), cast.tblThink, cast.name, cast.tblTalk );
		}
		{
			const cast = g_tblCast.tbl[ "DRAGON" ];
			g_unit.unit_create( 0, 0, 1000+52-20, 900, cast.size, rad(-90), cast.tblThink, cast.name, cast.tblTalk );
		}
*/
	}
	else
	{
		let tblEnemy =
		[


			["WOLF","GHOST","ZOMBIE","NINJA","ORC","ARCHER",],
			["GHOST","WIBARN","MINO","NINJA","SUMMON","SWORDMAN",],
			["DRAGON","MINO","SWORDMAN","TSTMAN","NINJA","WIBARN"],

			["SUMMON",],
			["SUMMON",],
			["SUMMON",],
		];
		let e0 = Math.floor(tblEnemy[0].length*rand(1))
		let e1 = Math.floor(tblEnemy[1].length*rand(1))
		let e2 = Math.floor(tblEnemy[2].length*rand(1))

		let cntPlayer = 0;
		for ( let y = 0 ; y < g_scr_h ; y++ )
		{
			for ( let x = 0 ; x < g_scr_w ; x++ )
			{

				if ( y >= g_sets.length || x >= g_sets[y].length ) continue;

				let px = (x-hosei_x)*g_tile_SZ+start_x;
				let py = (y-hosei_y)*g_tile_SZ+start_y;

				switch( g_sets[y][x] )
				{
				case 1: // プレイヤー
					{
						let cast;
						if ( cntPlayer == 0 ) cast = g_tblCast.tbl[ "PLAYER1" ];
						if ( cntPlayer == 1 ) cast = g_tblCast.tbl[ "PLAYER2" ];
						if ( cntPlayer == 2 ) cast = g_tblCast.tbl[ "PLAYER3" ];
						g_unit.unit_create( 0, 1, px, py, cast.size, rad(-90), cast.tblThink, cast.name, cast.tblTalk );
						cntPlayer++;
					}
					break;

				case 2: // 雑魚
//break;
					{
							let cast = g_tblCast.tbl[ tblEnemy[0][ e0 ]];
							g_unit.unit_create( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.tblTalk );
					}
					break;

				case 4: // 中ボス
//break;
					{
							let cast = g_tblCast.tbl[ tblEnemy[1][ e1 ]];
							g_unit.unit_create( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.tblTalk );
					}
					break;

				case 3: // ボス
					{
							let cast = g_tblCast.tbl[ tblEnemy[2][ e2 ]];
							g_unit.unit_create( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.tblTalk );
					}
					break;


				}
			}
		}
	}
}
let g_prevButtons;
//-----------------------------------------------------------------------------
function main_update()
//-----------------------------------------------------------------------------
{
	function unit_pad( u1 )
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
						//ctx_scr_print( 0,20+10*i, ""+i+":"+pad.buttons[i].value, g_flgNight?"#FFF":"#000" );
					}
					let a  = pad.buttons[ 0].value && !g_prevButtons[ 0].value;
					let b  = pad.buttons[ 1].value && !g_prevButtons[ 1].value;
					let x  = pad.buttons[ 2].value && !g_prevButtons[ 2].value;
					let y  = pad.buttons[ 3].value && !g_prevButtons[ 3].value;
					let l1 = pad.buttons[ 4].value && !g_prevButtons[ 4].value;
					let r1 = pad.buttons[ 5].value && !g_prevButtons[ 5].value;
					let se = pad.buttons[ 8].value && !g_prevButtons[ 8].value;
					let st = pad.buttons[ 9].value && !g_prevButtons[ 9].value;
					let u = pad.buttons[12].value
					let d = pad.buttons[13].value
					let l = pad.buttons[14].value
					let r = pad.buttons[15].value
					if ( a ) 
					{
						switch( Math.floor(rand(1)*8) )
						{
							case 0:u1.shot.shot_set(1,2);break;
							case 1:u1.breath.breath_set();break;
							case 2:u1.bow.bow_set(1,2);break;
							case 3:u1.valkan.valkan_set();break;
							case 4:u1.volt.volt_set(32);break;
							case 5:u1.long.long_set( u1.size/8 );break;
							case 6:u1.dying.dying_set();	break;
							case 7:u1.twincle.twn_set( 32 );break;
						}
					}
					if ( b ) u1.breath.breath_set();
					if ( x ) u1.bow.bow_set(1,2);
					if ( y ) u1.valkan.valkan_set();
					if ( se ) g_flgNight = !g_flgNight;
					if ( st ) 
					{
						if ( r ) 
						{
							gra2.put_buf( g_map_buf3 );
						}
						else
						{
							resetAll();
						}
					}

					{// 左レバー制御
						let spd = Math.sqrt(ly*ly+lx*lx);
						let dir = u1.dir+Math.atan2(lx,-ly);
						if ( Math.abs(spd) > 0.2 )
						{
							u1.add_x += Math.cos( dir )*spd*2;
							u1.add_y += Math.sin( dir )*spd*2;
						}
					}

					{// 右レバー制御
						let spd = 0;
						let dir = u1.dir;
						if ( Math.abs(rx) > 0.2 ) dir = u1.dir += rad(rx);
						if ( Math.abs(ry) > 0.2 ) spd += -ry;
						if ( Math.abs(spd) > 0.2 )
						{
							u1.add_x += Math.cos( dir )*spd*2;
							u1.add_y += Math.sin( dir )*spd*2;
						}

					}
					g_prevButtons = pad.buttons;
				}
			}
		}
	}

	//-----------------------------------------------------------------------------
	function draw_pole_luna_sun()
	//-----------------------------------------------------------------------------
	{// 月と太陽と北極星
		// ☆北極星
		function draw_pole( pr, rot, r0 )
		{
			let px = pr * Math.cos( rot ) + g_scr_ofx;
			let py = pr * Math.sin( rot ) + g_scr_ofy;
		
			let st = rad(360*2/5);
			for ( let th = rad(-90) ; th <= Math.PI*4 ; th += st )
			{
				let x1 = r0*Math.cos(th) + px;
				let y1 = r0*Math.sin(th) + py;
				let x2 = r0*Math.cos(th-st) + px;
				let y2 = r0*Math.sin(th-st) + py;
				gra1.line_col( x1, y1, x2, y2, "black" );
			}
		}

		// 🌙月
		function draw_moon( pr, rot, r0 )
		{
			let px = pr * Math.cos( rot ) + g_scr_ofx;
			let py = pr * Math.sin( rot ) + g_scr_ofy;
			for ( let i = 0 ; i < r0 ; i+=0.5 )
			{
				gra1.circle_col( px, py, i, g_flgNight?"white":"black" );
			}
				gra1.circle_col( px, py, r0,"black" );
		}

		// 太陽
		function draw_sun( pr, rot, r0, r1, r2 )
		{
			let px = pr * Math.cos( rot ) + g_scr_ofx;
			let py = pr * Math.sin( rot ) + g_scr_ofy;
			for ( let i = 0 ; i < r0 ; i+=0.5 )
			{
				gra1.circle_col( px, py, i, "white" );
			}
				gra1.circle_col( px, py, r0, "black" );

			for ( let th = 0 ; th < Math.PI*2 ; th += rad(30) )
			{
				let x1 = r1*Math.cos(th) + px;
				let y1 = r1*Math.sin(th) + py;
				let x2 = r2*Math.cos(th) + px;
				let y2 = r2*Math.sin(th) + py;
				gra1.line_col( x1, y1, x2, y2, "black" );
			}

		}
		{
			let r = Math.floor( g_scr_radius-10-1+3 );
			draw_moon( r, rad(-120)+g_scr_rot, 6 );
		}
		if ( !g_flgNight ) 
		{
			let r = Math.floor( g_scr_radius-10-1+3 );
			const s = 5;
			draw_sun( r, rad(-160)+g_scr_rot, s+7-2, s+11-4, s+15-4 );
		}

		{
			let r = Math.floor( g_scr_radius-10-1 );
			draw_pole( r, rad(-90)+g_scr_rot, 5 );
		}
	}
	

	{
		// メイン画面の周囲をクリア
		gra1.cls( "white" );
	}

	if (0)	// フロアマトリクス
	{
		let size= 54;
		let w = Math.floor(html_canvas1.width/size);
		let g_scr_h = Math.floor(html_canvas1.height/size);
		let sx = (html_canvas1.width-w*size)/2+size/2;
		let sy = (html_canvas1.height-g_scr_h*size)/2+size/2;


		for ( let x = 0 ; x < w ; x++ )
		{
			for ( let y = 0 ; y < g_scr_h ; y++ )
			{
				gra1.circle( x*size+sx, y*size+sy, 16+8,1 );
				let s = size-0;
				let x0 = x*size+sx;
				let y0 = y*size+sy;
				let x1 = x0-s/2;
				let y1 = y0-s/2;
				let x2 = x0+s/2;
				let y2 = y0+s/2;
				gra1.box( x1,y1,x2,y2 );
			}
		}
	}


	{ // コントローラ入力
		for ( let u1 of g_unit.tblUnit ) 
		{
			if ( u1.gid == 1 )	// グループID=1 はPlayer
			{
				unit_pad( u1 );
				break;
			}
		}
	}

	{// カメラ更新
		for ( let u1 of g_unit.tblUnit ) 
		{
			if ( u1.gid == 1 )	// グループID=1 はPlayer
			{
				g_scr_cx = u1.x;
				g_scr_cy = u1.y;
				let to = rad(-90)-u1.dir;
				let s = to - g_scr_rot;
				if ( s < -Math.PI ) s += Math.PI*2;
				if ( s >  Math.PI ) s -= Math.PI*2;
				let r = 0;
				if ( s > 0 ) 
				{
					r =  Math.min(s,rad(2));
				}
				if ( s < 0 ) 
				{
					r =  -Math.min(-s,rad(2));
				}
				g_scr_rot = to;
			}
		}
	}

	if(1)
	{// 宇宙
		gra1.ctx.save();
		gra1.circle_col( g_scr_ofx,g_scr_ofy,255-14,g_flgNight?"#000":"#FFF" );
		gra1.ctx.clip();
		gra1.cls( !g_flgNight?"#000":"#FFF");
		gra1.ctx.restore();
	}
	else
	{// 宇宙
		gra1.ctx.save();
		gra1.circle_col( g_scr_ofx,g_scr_ofy,255-15,"#000" );
		gra1.ctx.clip();
		gra1.ctx.restore();
	}

	
	{// 月と太陽と北極星
		draw_pole_luna_sun();
	}


	{ // メイン画面表示
		{
			gra1.ctx.save();
			gra1.ctx.translate(g_scr_ofx,g_scr_ofy);
			{

				{ // クリッピング
					gra1.circle( 0,0, (g_scr_w)*g_tile_SZ/2 );
					gra1.ctx.clip();
					gra1.clsb();
				}
				gra1.ctx.save();
				{
					gra1.ctx.rotate( g_scr_rot ) ;


					// 表示エリア確認用
					gra1.box( 
												g_scr_sx-g_tile_SZ/2	-g_scr_ofx -0.5,
												g_scr_sy-g_tile_SZ/2	-g_scr_ofy -0.5,
						(g_scr_w-1)*g_tile_SZ+	g_scr_sx+g_tile_SZ/2	-g_scr_ofx +0.5,
						(g_scr_h-1)*g_tile_SZ+	g_scr_sy+g_tile_SZ/2	-g_scr_ofy +0.5	
					);


					{ // 画面表示
						let mx = Math.floor( g_scr_cx / g_tile_SZ );
						let my = Math.floor( g_scr_cy / g_tile_SZ );
						let nx = (g_scr_cx)%g_tile_SZ;
						let ny = (g_scr_cy)%g_tile_SZ;

						let wh = Math.floor( g_scr_radius/g_tile_SZ )+1;
						for ( let y = -wh ; y <= wh+1 ; y++ )
						{
							for ( let x = -wh ; x <= wh+1 ; x++ )
							{
								let ax = (mx+x);
								let ay = (my+y);
								if ( ax >= g_terrain.reso	) ax -= g_terrain.reso;
								if ( ay >= g_terrain.reso	) ay -= g_terrain.reso;
								if ( ax < 0 		) ax += g_terrain.reso;
								if ( ay < 0 		) ay += g_terrain.reso;


								{
									let idx = g_terrain.tblIndex[ g_terrain.reso*ay + ax ]
									if ( idx > 0 && idx < g_terrain.points.length-1 )
									{
										let idx0 = idx;
										let idx1 = idx+1;


										let p0 = g_terrain.points[ idx0 ];
										let p1 = g_terrain.points[ idx1 ];

										let x0 = Math.floor( (p0.x-mx)*g_tile_SZ -nx);
										let y0 = Math.floor( (p0.y-my)*g_tile_SZ -ny);
										let x1 = Math.floor( (p1.x-mx)*g_tile_SZ -nx);
										let y1 = Math.floor( (p1.y-my)*g_tile_SZ -ny);

										if ( p0.end == false )gra1.line( x0,y0,x1,y1 );


									}
								}


								let a = g_map_buf3[ g_terrain.reso*ay + ax ];
								gra2.pset_frgb( ax, ay, [a,a,a] );
							
	if(0)
								if ( a > 0 )
								{
									let x0 = x*g_tile_SZ -nx;
									let y0 = y*g_tile_SZ -ny;
									let x1 = x0-g_tile_SZ/2;
									let y1 = y0-g_tile_SZ/2;
									let x2 = x0+g_tile_SZ/2;
									let y2 = y0+g_tile_SZ/2;
									if ( a > 0.7 )
									{
										gra1.fill_hach( x1,y1,x2,y2, 13 );
									}
									else
									{
										gra1.fill_hach( x1,y1,x2,y2, 26 );
									}

								}
							}
						}
					}

					// エフェクト更新
					g_effect.effect_update();

					// ユニット更新
					g_unit.unit_allupdate();

				}
				gra1.ctx.restore();

				{// ユニットセリフ表示
					for ( let u1 of g_unit.tblUnit ) 
					{
						let c = Math.cos( g_scr_rot );
						let s = Math.sin( g_scr_rot );
						let x = u1.x-g_scr_cx;
						let y = u1.y-g_scr_cy;

						let px = x*c - y*s;
						let py = x*s + y*c;
						gra1.scr_print( px+u1.size, py-u1.size, u1.name, g_flgNight?"#FFF":"#000" );

						// シーケンスのセリフ
						if ( u1.oneTalk != null )
						{
							if ( u1.oneTalk.lim > 0 )
							{
								u1.oneTalk.lim--;
								if ( u1.oneTalk.lim == 0 )
								{
									u1.oneTalk = null;
								}
								else
								{
									gra1.scr_print( px+u1.size+10, py-u1.size+16, u1.oneTalk.str, g_flgNight?"#FFF":"#000" );
								}

							}
						}
						else
						if ( u1.tblTalk != undefined )
						{
							if ( u1.limTalk > 0 )
							{
								u1.limTalk--;
								if ( u1.limTalk == 0 )
								{
									while( u1.seqTalk < u1.tblTalk.length )
									{
										u1.seqTalk++;
										let d = u1.tblTalk[u1.seqTalk];
										if ( Number.isFinite(d) ) 
										{
											u1.limTalk = d;
										}
										else
										{
											break;	
										}
									}
								}
								if ( u1.seqTalk < u1.tblTalk.length )
								{
									gra1.scr_print( px+u1.size, py-u1.size-16, u1.tblTalk[u1.seqTalk], g_flgNight?"#FFF":"#000" );
								}
							}
						}

					}
				}
			
			}
			gra1.ctx.restore();
		}
	}

	gra1.scr_print( 0,8, "units:" + g_unit.tblUnit.length.toString(), "black" );

	if ( null != document.getElementById("html_canvas2") )
	{	// 全体地形表示
		gra2.streach();

		// カーソル表示
		let sc = html_canvas2.height/g_terrain.reso;
		let x = g_scr_cx/g_tile_SZ*sc+1.5;
		let y = g_scr_cy/g_tile_SZ*sc+1.5;
		let r = (g_scr_h/2)*sc;
		gra2.ctx_circle( x, y, r, "#fff" );
		let ax = r*Math.cos(rad(-90)-g_scr_rot)+x;
		let ay = r*Math.sin(rad(-90)-g_scr_rot)+y;
		gra2.ctx_line( x, y, ax,ay, "#fff" );
	}
	{
		gra3.streach();

		// カーソル表示
		let sc = html_canvas3.height/g_terrain.reso;
		let x = g_scr_cx/g_tile_SZ*sc+1.5;
		let y = g_scr_cy/g_tile_SZ*sc+1.5;
		let r = (g_scr_h/2)*sc;
		gra3.ctx_circle( x, y, r, 0 );
		let ax = r*Math.cos(rad(-90)-g_scr_rot)+x;
		let ay = r*Math.sin(rad(-90)-g_scr_rot)+y;
		gra3.ctx_line( x, y, ax,ay, 0 );
	}

	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = requestAnimationFrame( main_update );
}
////////////////////////////

//-----------------------------------------------------------------------------
function map_hotstart()
//-----------------------------------------------------------------------------
{

	gra1 = new GRA_cv( html_canvas1.getContext('2d') );

//	g_terrain.initSeed();
	g_terrain.initParam();
	g_map_buf3 = g_terrain.update_map();

//	if ( null != document.getElementById("html_canvas2") )
	{
		// キャンバスに描画
		// 画面作成
		gra2 = new GRA_img( g_terrain.reso, g_terrain.reso, html_canvas2 );
		// 画面クリア
		gra2.cls(255);
		// 画面描画
		if(1)
		{//全マップ開示
			gra2.put_buf( g_map_buf3 );
		}


		// 画面をキャンバスへ転送
		gra2.streach();

		// canvasのID表示
		gra2.ctx_print(0,html_canvas2.height, html_canvas2.id );


		// 描画
		{
			gra3 = new GRA_img( html_canvas3.width, html_canvas3.height, html_canvas3 );

			calc_rasterize( gra3, g_terrain.points, g_terrain.reso, g_terrain.reso );

			gra3.streach();
		}

	}
}

let g_scr_cx;
let g_scr_cy;
let gra1;	// for canvas1
let gra2;	// for canvas2
let gra3;	// for canvas3
//-----------------------------------------------------------------------------
function resetAll()
//-----------------------------------------------------------------------------
{
	map_hotstart();

	g_effect.effect_reset();

	g_unit.unit_init();


	const sx = g_terrain.reso/2*g_tile_SZ; 
	const sy = g_terrain.reso/2*g_tile_SZ; 
	game_init(sx,sy);

}
let g_map_buf3;
let g_reqId;
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
//	g_scr_cx = 1664;
//	g_scr_cy = 1664;
	g_effect = new Effect(100);
	

	resetAll();

	g_reqId = requestAnimationFrame( main_update );
}

let g_flgNight = 0;	// 0:day 1:nighit
