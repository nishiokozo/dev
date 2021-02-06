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
function mprojection(th, a, zMin, zMax) 
//---------------------------------------------------------------------
{
	return [
	   0.5/th	, 0			, 0								, 0	,
	   0		, 0.5*a/th	, 0								, 0	,
	   0		, 0			, -(zMax+zMin)/(zMax-zMin)		, -1,
	   0		, 0			, (-2*zMax*zMin)/(zMax-zMin)	, 0
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
	let m =
	[
		c	,	s	,	0	,	0	,
		-s	,	c	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	];
	return m;
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
	let m =
	[
		1	,	0	,	0	,	0	,
		0	,	c	,	s	,	0	,
		0	,	-s	,	c	,	0	,
		0	,	0	,	0	,	1	
	];
	return m;
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
	let m =
	[
		c	,	0	,	-s	,	0	,
		0	,	1	,	0	,	0	,
		s	,	0	,	c	,	0	,
		0	,	0	,	0	,	1	
	];
	return m;
}
//---------------------------------------------------------------------
function mmul( a, b ) 
//---------------------------------------------------------------------
{
	let m = 
	[
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

	return m;

}




let gl = html_canvas.getContext('webgl');

let g_yaw;

let g_matP;
let g_matV;
let g_matM;

let g_bufIndex;
let g_tblIndices;

let g_prevTime=0;
//---------------------------------------------------------------------
function	update_gl(time)
//---------------------------------------------------------------------
{

	let matProj = mprojection( g_fovy/2, html_canvas.width/html_canvas.height, 1, 100);
	let matView = [g_scale,0,0,0, 0,g_scale,0,0, 0,0,1,0, g_cam.x,g_cam.y,g_cam.z,1];
	let matModel = mmul( mrotY(g_yaw), mrotX( rad(10) ) );

	let dt = time-g_prevTime;
	g_yaw += dt/1000/8;//rad(1/8);
	g_prevTime = time;
		
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(g_matP, false, matProj);
	gl.uniformMatrix4fv(g_matV, false, matView);
	gl.uniformMatrix4fv(g_matM, false, matModel);
		
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_bufIndex);
	gl.drawElements(gl.TRIANGLES, g_tblIndices.length, gl.UNSIGNED_SHORT, 0);
//	gl.drawElements(gl.POINTS, g_tblIndices.length, gl.UNSIGNED_SHORT, 0);

	g_reqId = window.requestAnimationFrame(update_gl);
}

//-----------------------------------------------------------------------------
function init_gl( buf, w, h )
//-----------------------------------------------------------------------------
{

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

	let tblVertex = [ -1,-1,-2, 1,-1,-2, 1, 1,-2 ];
	let tblColor = [ 1,0.5,0.2, 0.5,0.2,1, 0.2,1,0.5 ];
	g_tblIndices = [ 0,1,2 ];


	//let tblNormal=[];
	tblVertex = [];
	tblColor = [];
	g_tblIndices = [];

	// 法線計算
	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			let idx = y*h+x;
			let high = buf[ idx ];


			
		}
	}

	for ( let y = 0 ; y < h ; y++ )
	{
		for ( let x = 0 ; x < w ; x++ )
		{
			let idx = y*h+x;
			let high = buf[ idx ];

			tblVertex.push( (x/w-0.5) );
			tblVertex.push( high*g_rate );
			tblVertex.push( (y/h-0.5) );

			let a = 0.25;
			tblColor.push( high+a );
			tblColor.push( high+a );
			tblColor.push( high+a );

			/*
			{
				let m = buf[ round2d( x, y  , w, h) ];
				let u = buf[ round2d( x, y-1, w, h) ];
				let d = buf[ round2d( x, y+1, w, h) ];
				let l = buf[ round2d( x-1, y, w, h) ];
				let r = buf[ round2d( x+1, y, w, h) ];

				let	a = new vec3(
					1,
					(l+r)/2,
					0
				)
				let	b = new vec3(
					0,
					(u+d)/2,
					1
				)
				a = normalize(a);
				b = normalize(b);

				let c = cross( a, b );

				c = normalize(c);

				c = new vec3(high,high,high);				
				tblNormal.push( (c.x+1)/2 );
				tblNormal.push( (c.z+1)/2 );
				tblNormal.push( (c.y+1)/2 );

			}
			*/

			if ( x < w-1 && y < h-1 )
			{
				g_tblIndices.push( idx );
				g_tblIndices.push( idx+1 );
				g_tblIndices.push( idx+w );

				g_tblIndices.push( idx+1 );
				g_tblIndices.push( idx+w );
				g_tblIndices.push( idx+w+1 );
			}
		}
	}

	let bufVertex = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufVertex);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tblVertex), gl.STATIC_DRAW);

	let bufColor = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufColor);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tblColor), gl.STATIC_DRAW);

	//let bufNormal = gl.createBuffer();
	//gl.bindBuffer(gl.ARRAY_BUFFER, bufNormal);
	//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tblNormal), gl.STATIC_DRAW);

	g_bufIndex = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_bufIndex);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(g_tblIndices), gl.STATIC_DRAW);

	/*==========================Shaders=========================*/

	let vs = 
		 "attribute vec3 pos;"
		+"uniform mat4 P;"
		+"uniform mat4 V;"
		+"uniform mat4 M;"
		+"attribute vec3 col;"
//		+"attribute vec3 nml;"
		+"varying vec3 vColor;"
		+"void main(void)"
		+"{"
		+   "gl_Position = P*V*M*vec4(pos, 1.0);"
		+   "vColor = col;"
//		+   "gl_PointSize  = 1.5;"
		+"}";

	let fs =
		 "precision mediump float;"
		+"varying vec3 vColor;"
		+"void main(void)"
		+"{"
		+	"gl_FragColor = vec4(vColor, 1.);"
		+"}";

		

	{
		let shader = gl.createProgram();
		{
			let bin_vs = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(bin_vs, vs);
			gl.compileShader(bin_vs);
			gl.attachShader(shader, bin_vs);
		}
		{
			let bin_fs = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(bin_fs, fs);
			gl.compileShader(bin_fs);
			gl.attachShader(shader, bin_fs);
		}
		gl.linkProgram(shader);

		g_matP = gl.getUniformLocation(shader, "P");
		g_matV = gl.getUniformLocation(shader, "V");
		g_matM = gl.getUniformLocation(shader, "M");

		gl.bindBuffer(gl.ARRAY_BUFFER, bufVertex);
		{
			let hdl = gl.getAttribLocation(shader, "pos");
			gl.vertexAttribPointer(hdl, 3, gl.FLOAT, false,0,0) ;
			gl.enableVertexAttribArray(hdl);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, bufColor);
		{
			let hdl = gl.getAttribLocation(shader, "col");
			gl.vertexAttribPointer(hdl, 3, gl.FLOAT, false,0,0) ;
			gl.enableVertexAttribArray(hdl);
		}

		/*
		gl.bindBuffer(gl.ARRAY_BUFFER, bufNormal);
		{
			let hdl = gl.getAttribLocation(shader, "nml");
			gl.vertexAttribPointer(hdl, 3, gl.FLOAT, false,0,0) ;
			gl.enableVertexAttribArray(hdl);
		}
		*/
		

		gl.useProgram(shader);
	}

	//---
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.viewport(0.0, 0.0, html_canvas.width, html_canvas.height);

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


let g_SZ;
let g_bufA = [];
let g_bufB = [];
let g_bufC = [];
let g_bufNoiseD = [];
let g_bufNoiseE = [];
let SZ;
let buf4= [];
let g_rate;
let g_scale;
let g_cam;
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
		buf1 = calc_makehole( buf1, SZ, SZ, SZ/2, SZ/2, SZ/8/2/2, 0 );
		buf2 = calc_makehole( buf2, SZ, SZ, SZ/2, SZ/2, SZ/8/2/2, 0 );
		buf3 = calc_makehole( buf3, SZ, SZ, SZ/2, SZ/2, SZ/8/2/2, 0 );
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
	buf4 = calc_autolevel(buf4, SZ*SZ);

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

//-----------------------------------------------------------------------------
function start()
//-----------------------------------------------------------------------------
{
	let buf= update_map( g_SZ );
	SZ = g_SZ;
	g_scale = 6.0;
	g_cam = new vec3( 0,-0.5,-3);
	g_fovy = rad(45);

	init_gl( buf, SZ, SZ );
	
	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = window.requestAnimationFrame(update_gl);
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
	g_low =  document.getElementById( "low" ).value * 1.0;
}
//-----------------------------------------------------------------------------
function	initSeed()
//-----------------------------------------------------------------------------
{
	g_yaw = 0;

	g_SZ =  document.getElementById( "html_size" ).value * 1.0;

	for ( let i = 0 ; i < g_SZ*g_SZ ; i++ )
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