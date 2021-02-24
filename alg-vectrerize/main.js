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

class GRA
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
//			let [px,py] = this.window_conv( _px, _py );
			this.pset0( px, py, col );
		}
		//-----------------------------------------------------------------------------
		this.pset_rgb = function( _px, _py, [r,g,b] )
		//-----------------------------------------------------------------------------
		{
//			if ( x < 0 ) return;
//			if ( y < 0 ) return;
//			if ( x >= this.img.width ) return;
//			if ( y >= this.img.height ) return;

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
//			if ( x < 0 ) return;
//			if ( y < 0 ) return;
//			if ( x >= this.img.width ) return;
//			if ( y >= this.img.height ) return;

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
		this.line = function( x1, y1, x2, y2, col=0x000000 ) 
		//-----------------------------------------------------------------------------
		{
//			let [x1,y1] = this.window_conv( _x1, _y1 );
//			let [x2,y2] = this.window_conv( _x2, _y2 );


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
//			const scx=2;

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
//					let iy = Math.floor( sy % colsPat.length );
					let ay = sy*this.img.width;
					for ( let x = lx ; x <=rx ; x++ )
					{
//						let ix = Math.floor(  x % colsPat[0].length );
//						let col = colsPat[iy][ix];
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
	print( tx, ty, str )
	//-----------------------------------------------------------------------------
	{
		this.ctx.font = "12px monospace";
		this.ctx.fillStyle = "#000000";
		this.ctx.fillText( str, tx+1, ty+1 );
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillText( str, tx, ty );
	}
};

//-----------------------------------------------------------------------------
function canvas_print( tx, ty, str, cv = html_canvas )
//-----------------------------------------------------------------------------
{
	let ctx = cv.getContext('2d');

	ctx.font = "12px monospace";
	ctx.fillStyle = "#000000";
	ctx.fillText( str, tx+1, ty+1 );
	ctx.fillStyle = "#ffffff";
	ctx.fillText( str, tx, ty );
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
function calc_blur( buf0, pat, w, h )
//-----------------------------------------------------------------------------
{
	// patで乗算
	let buf = new Array( buf0.length );
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


					v += buf0[ a ] * pat[m][n];
				}
			}
			buf[ (w*y + x) ] = v;
		}
	}
	return buf;
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


// パラポライズ
//-----------------------------------------------------------------------------
function calc_parapolize( buf0, W, H, n )
//-----------------------------------------------------------------------------
{
	let buf = [];
	for ( let i = 0 ; i < W*H ; i++ )
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
function calc_addnoise( buf0, W, H, val )
//-----------------------------------------------------------------------------
{
	let buf = Array.from(buf0);
	for ( let i = 0 ; i < W*H ; i++ ) 
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

	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
		
			let a1 = round2d( x-1, y+1 ,w, h );
			let a2 = round2d( x  , y+1 ,w, h );
			let a3 = round2d( x+1, y+1 ,w, h );
			let a4 = round2d( x-1, y   ,w, h );
			let a5 = round2d( x  , y   ,w, h );
			let a6 = round2d( x+1, y   ,w, h );
			let a7 = round2d( x-1, y-1 ,w, h );
			let a8 = round2d( x  , y-1 ,w, h );
			let a9 = round2d( x+1, y-1 ,w, h );
			
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
function update_paint()
//-----------------------------------------------------------------------------
{

	// 画面クリア
	gra.cls_rgb([1,1,1]);

	let cnthit = 0;
	let cntall = 0;

	let a=0;
	let b=0;

	let x = g_reso_W/2;
	let y = g_reso_H/2;
	for ( let py = 0 ; py < g_reso_H ; py++ )
	{
		for ( let px = 0 ; px < g_reso_W ; px++ )
		{
			let a = (px /g_reso_W)*4-2;
			let b = (py /g_reso_H)*4-2;

			let x = 0;
			let y = 0;
			let flgOver = false;
			for ( let n = 1 ; n < 100 ; n++ )
			{
				let nx = x*x - y*y + a;
				let ny = 2*x*y + b;

				x = nx;
				y = ny;

				if ( Math.sqrt(nx*nx+ny*ny) > 2 ) 
				{
					flgOver = true;
					cnthit++;
					break;
				}				
			}
			if ( flgOver == false ) gra.pset_rgb( px,py, [0,0,0] );

			cntall++;
		}
	}
//console.log(cnthit,cntall);
	// 画面をキャンバスへ転送
	gra.streach();


//	window.requestAnimationFrame( update_paint );

}




//let g_img;
//let g_buf;
//let gra;
//let g_reso_W;
//let g_reso_H;	


//-----------------------------------------------------------------------------
function gra_createImagedata( elmImg )
//-----------------------------------------------------------------------------
{
    var cv = document.createElement('canvas');			//一旦キャンバスを作り

    cv.width = elmImg.naturalWidth;
    cv.height = elmImg.naturalHeight;

    var ctx = cv.getContext('2d');

    ctx.drawImage( elmImg, 0, 0 ); 						// イメージを展開し

    return ctx.getImageData(0, 0, cv.width, cv.height);	// イメージデータを取得する
}
//-----------------------------------------------------------------------------
function gra_loadImageMono( elmImg, W, H )
//-----------------------------------------------------------------------------
{
	let img = gra_createImagedata( elmImg );


	let buf = new Array( W * H );

	let w = Math.min(W,elmImg.naturalWidth);
	let h = Math.min(H,elmImg.naturalHeight);

	// モノクロバッファ作成
	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w; x++ )
		{
			let adr1 = y*W + x;

			let r = img.data[ adr1*4+0 ]/255;
			let g = img.data[ adr1*4+1 ]/255;
			let b = img.data[ adr1*4+2 ]/255;

			let adr2 = y*W + x;
			buf[ adr2 ] =(r+g+b)/3;
		}
	}
	return buf;//{buf:buf, width:elmImg.naturalWidth, height:elmImg.naturalHeight };
}
//-----------------------------------------------------------------------------
function gra_drawCanvas( canvas, buf, W, H, str=null )
//-----------------------------------------------------------------------------
{
	// 画面作成
	let gra = new GRA( W, H, canvas );
	// 画面クリア
	gra.cls(0);
	// 画面描画

	function draw_buf( gra, buf )
	{
		let h = gra.img.height;
		let w = gra.img.width
		for ( let y = 0 ; y < h ; y++ )
		{
			for ( let x = 0 ; x < w ; x++ )
			{
				let v = buf[ w*y + x ];
				gra.pset_frgb( x, y, [v,v,v] );

				if(0)
				switch(v)
				{
					case 1: gra.pset_frgb( x, y, [0,0,1] );break;
					case 2: gra.pset_frgb( x, y, [1,0,0] );break;
					case 3: gra.pset_frgb( x, y, [1,0,1] );break;
					case 4: gra.pset_frgb( x, y, [0,1,0] );break;
					case 5: gra.pset_frgb( x, y, [0,1,1] );break;
					case 6: gra.pset_frgb( x, y, [1,1,0] );break;
					case 7: gra.pset_frgb( x, y, [1,1,1] );break;
				}
			}
		}
	}

	draw_buf( gra, buf );


	// 画面をキャンバスへ転送
	gra.streach();

	
	// canvasのID表示
	if ( str == null ) str = canvas.id;
	gra.print(1,canvas.height-1, str );
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
function getadr2d(x,y,W,H)
//-----------------------------------------------------------------------------
{
	return W*y+x;
}

let gra2;
//let g_rejs;
//-----------------------------------------------------------------------------
function calc_vectorize( buf, W, H )
//-----------------------------------------------------------------------------
{ // ベクトル化

	function bufcol(x,y)
	{
		return buf[W*y+x]
	}
	//-----------------------------------------------------------------------------
	function vec_getStart( buf, sx,sy )
	//-----------------------------------------------------------------------------
	{
		let c = bufcol(sx,sy);

		//左を探す
		let nx=sx;
		let ny=sy;
		let y = sy;
		for ( let x = sx ; x >= 0 ; x-- )
		{
			if ( bufcol(x,y) !=c || x==0 ) break;
			nx = x;
			ny = y;
		}

		for ( let y = ny ; y < H-1 ; y++ )
		{
			for ( let x = nx ; x < W-1 ; x++ )
			{
					if ( bufcol(x,y-1) !=c ) return [true,x,y, 1,0];
					if ( bufcol(x,y+1) !=c ) return [true,x,y,-1,0];
					if ( bufcol(x-1,y) !=c ) return [true,x,y,0,-1];
					if ( bufcol(x+1,y) !=c ) return [true,x,y,0, 1];
			}
		}
		return [false,0,0,0,0];
	}

	//-----------------------------------------------------------------------------
	function vec_search( buf, gra, sx, sy,  ax, ay, c )
	//-----------------------------------------------------------------------------
	{
		let points = [];
		let x = sx;
		let y = sy;
		let cnt = 0;

		function chkwall( c, x, y )
		{
			if ( x < 0 || y < 0 || x >= W || y >= H ) return false;
			return (c==bufcol(x,y));
		}

		points.push( {x:sx, y:sy, c:c, end:0} );

		let cnt_r = 0;
		while(1)
		{	
			function pipe(a,b){return[a,b];}
			if ( chkwall(c, x+ax,y+ay) )
			{//前方に壁が無かったら、左手前方を調べる
				if ( chkwall(c, x+ax+ay,y+ay-ax) )
				{//左手にも壁が無かったら前進＆左ターン＆前進
					x+=ax;
					y+=ay;
					[ax,ay]=pipe(ay,-ax);
					x+=ax;
					y+=ay;
					points.push( {x:x, y:y, c:c, end:0} );
				}
				else
				{//左手が別の色だったら	そのまま前進移動
					x+=ax;
					y+=ay;
				}
				gra.pset_frgb( x, y, [c,c,c] );
				if ( sx == x && sy== y ) 
				{
					points.push( {x:x, y:y, c:c, end:1} );
					break; // 必ず元の場所に戻ってくる。
				}
				else
				{
					points.push( {x:x, y:y, c:c, end:0} );
				}
				
				cnt_r=0;
			}
			else
			{//前進できなければ右ターン
				[ax,ay]=pipe(-ay,ax);
				cnt_r++;
				if ( cnt_r>=4 ) 
				{
					points.push( {x:x, y:y, c:c, end:1} );
					gra.pset_frgb( x, y, [c,c,c] );
					break; // 4連続右折は１ドットピクセル
				}
			}
		}
		return points;
	}

	let points = [];


	{
		let graM = new GRA( W, H, html_canvas ); // 描かないのでキャンバスは何でもいい。
		graM.cls(0x000000);

		for ( let y = 0 ; y < H ; y++ )
		{ 
			for ( let x = 0 ; x < W ; x++ )
			{ 
				let [flg,sx,sy,ax,ay] = vec_getStart(buf,x,y);
				if ( flg )
				{
					if ( graM.point(sx,sy) == 0 ) 
					{
						let c = bufcol(sx,sy);
						points = points.concat( vec_search( buf, graM,  sx, sy, ax,ay, c  ) );
					}
				}
			}
		}

	}
	return points;
}

//-----------------------------------------------------------------------------
function calc_rasterize( gra, points, W, H )
//-----------------------------------------------------------------------------
{// ベクター描画2

	gra.cls( 0x006600 );

	let sw = gra.img.width / W;
	let sh = gra.img.height / H;

	let sx=0;
	let sy=0;
	let flgFirst = true;
	let cnt = 0;
	for( let i = 0 ; i < points.length ; i++ )
	{
		let ex = Math.floor(points[i].x*sw);
		let ey = Math.floor(points[i].y*sh);

		let c = points[i].c;

		if ( flgFirst == false )
		{
			let r = c;
			let g = c;
			let b = c;
			let col = ((((r*255)&0xff)<<16)|(((g*255)&0xff)<<8)|(((b*255)&0xff)<<0))
			gra.line( sx, sy, ex, ey, col ); 
		}
		flgFirst = false;

		if ( points[i].end == 1 ) 
		{
			let r = c;
			let g = c;
			let b = c;
			let col = ((((r*255)&0xff)<<16)|(((g*255)&0xff)<<8)|(((b*255)&0xff)<<0))
			flgFirst = true;
		}


		cnt++;
		sx = ex;
		sy = ey;
	}
	
	let col;

	let rejs;

	{// 使われている色を検索
		let hash = {}
		for( let i = 0 ; i < points.length ; i++ )
		{
			let c = points[i].c;
			let col = ((((c*255)&0xff)<<16)|(((c*255)&0xff)<<8)|(((c*255)&0xff)<<0))
			hash[ col ] = col;
		}
		rejs = Object.values(hash);
	}

	gra.paint(gra.img.width-1,gra.img.height-1,0x0000ff,rejs);

	for ( let y = 0 ; y < gra.img.height ; y++ )
	{
		for ( let x = 0 ; x < gra.img.width ; x++ )
		{
			let c = gra.point(x,y);
			if ( c == 0x006600 )
			{
				gra.paint(x,y,col,rejs);
			}
			else
			{
				col = c;
			}

		}
	}				
}
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	let elmImg = document.getElementById('html_img');

	let reso_W = elmImg.naturalWidth;
	let reso_H = elmImg.naturalHeight;

	let buf = gra_loadImageMono( elmImg, reso_W, reso_H );

	buf = calc_autolevel( buf, reso_W, reso_H ); 

	buf = calc_parapolize( buf, reso_W, reso_H, 4 );

	// 素材描画
	gra_drawCanvas( html_canvas, buf, reso_W, reso_H );

	let points = calc_vectorize( buf, reso_W, reso_H );

	gra2 = new GRA( reso_W*4, reso_H*4, html_canvas2 );

	calc_rasterize( gra2, points, reso_W, reso_H );

	gra2.streach();

}

// HTML/マウス/キーボード制御
document.onmousedown = mousemovedown;
document.onmousemove = mousemovedown;
let g_prevButtons = 0;
//let g_cnt = 0;
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	
	if ( e.buttons==1 )
	{
		let cv = gra2.cv;
		let img = gra2.img;
	    var rect = cv.getBoundingClientRect();
//        let x= Math.floor((e.clientX - rect.left) / cv.width  * g_reso_W);
  //      let y= Math.floor((e.clientY - rect.top ) / cv.height * g_reso_H);
        let x= Math.floor((e.clientX - rect.left) / cv.width  * img.width);
        let y= Math.floor((e.clientY - rect.top ) / cv.height * img.height);

		if ( x >= 0 && x < img.width && y >= 0 && y < img.height )
		{
//			let sw = gra2.img.width / img.width;
//			let sh = gra2.img.height / img.height;
//			let px = Math.floor(x*sw);
//			let py = Math.floor(y*sh);

			if ( 0 )
			{
				console.log( gra2.point(x,y).toString(16) );
			}
			else
			{
//				gra2.paint(x,y,0xff0000,g_rejs);
				gra2.streach()
			}
		}

	}

	g_prevButtons = e.buttons;
}
//
//-----------------------------------------------------------------------------
function html_updateSize()
//-----------------------------------------------------------------------------
{
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
