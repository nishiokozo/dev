"use strict";

let gl = html_canvas.getContext('webgl');


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
	vecOfs;
	flg = false;	
	

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
	
		let g_yaw = 0;
//		g_yaw+=document.getElementById( "yaw" ).value*1;
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
/*
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
*/

		let tblVertex = new Array( (resoH+1)*(resoW+1) );
		let tblColor = new Array( (resoH+1)*(resoW+1) );
		let tblIndex = [];

		let g_scale = 1.0;
		let g_rate = 0.1;
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

//	for ( let y = -g_block ; y <=g_block ; y++ )
	{
		let x = 0;
		let y = 0;
		let g_scale = 1.0;
//		for ( let x = -g_block ; x <= g_block ; x++ )
		{
			let [ tblIndex, tblVertex, tblColor] = makeGeom( x*g_reso_x, y*g_reso_y );
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


////////
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
/*	//-----------------------------------------------------------------------------
	pset_land( x, y, val )
	//-----------------------------------------------------------------------------
	{
		if ( val > 1 ) val = 1;
		if ( val < 0 ) val = 0;
		val = (val*255)&0xff;
		let adr = (y*this.img.width+x)*4;
		this.img.data[ adr+0 ] = val;
		this.img.data[ adr+1 ] = 0;//val;
		this.img.data[ adr+2 ] = 0;//val;
//		this.img.data[ adr +3 ] = a;
	}
*/
	//-----------------------------------------------------------------------------
	streach()
	//-----------------------------------------------------------------------------
	{
		// -----------------------------------------
		// ImageDataをcanvasに合成
		// -----------------------------------------
		// g   : canvas.getContext('2d')
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

/*
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

*/
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
if(0)
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


let g_reso_x;	
let g_reso_y;	
let g_seedA = [];
let g_seedB = [];
let g_bufA = [];
let g_bufB = [];

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
		// 画面描画
		draw_buf( gra, buf );

		draw_buf_land( gra, g_buf_land );
		// 画面をキャンバスへ転送
		gra.streach();

		// canvasのID表示
		if ( str == null ) str = canvas.id;
		gra.print(1,gra.canvas.height-1, str );
	}

	//--

	drawCanvas( html_canvasA, g_bufA, "A" );
	drawCanvas( html_canvasB, g_bufB, "B" );

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
	let bufC = calc_defferencial( g_bufA, g_bufB, g_reso_x, g_reso_y );
	drawCanvas( html_canvasC, bufC, "|A-B| 差分" );



	document.getElementById("html_gen").value = ""+(g_cntLife).toString();



}
		function round2d( x, y,W,H )
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
function update_life( buf_life, buf_land )
//-----------------------------------------------------------------------------
{

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
				let cnt = tmp1[adr]+tmp2[adr];

				if ( buf_land == null || g_buf_land[adr] == 0 )
				{
					if ( buf[adr] == 0 )
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
		return buf;
	}

	//-----------------------------------------------------------------------------
	function live_analog( buf0, W, H )
	//-----------------------------------------------------------------------------
	{

		let tmp = Array( buf0.length );
		
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
					}
				}
				
				tmp[W*y + x] = cnt1;
			}
		}

		let buf = Array.from( buf0 );

let val = 0.5;
		// 誕生死滅処理
		for ( let y = 0 ; y < H ; y++ )
		{
			for ( let x = 0 ; x < W ; x++ )
			{

				let adr = W*y + x;
				let cnt = tmp[adr];

				if ( buf_land == null || g_buf_land[adr] == 0 )
				{
					if ( buf[adr] == 0 )
					{
						if ( cnt == 3	) buf[adr] += val;	//誕生
					}
					else
					{
						if ( cnt <= 1	) buf[adr] -= val;	//過疎死
						if ( cnt == 2	) buf[adr] = 1;	//生存
						if ( cnt == 3	) buf[adr] = 1;	//生存
						if ( cnt >= 4	) buf[adr] -= val;	//過密死
					}
				}
			}
		}
		return buf;
	}	

	

//	let buf = live_analog( buf_life, g_reso_x, g_reso_y );
	let buf = live_std( buf_life, g_reso_x, g_reso_y );


	return buf;

}

//-----------------------------------------------------------------------------
function update_scene( time )
//-----------------------------------------------------------------------------
{
	{
		var a = document.getElementsByName( "html_auto" )[0].checked ;
		if ( a ) 
		{
			let interval = document.getElementById( "html_speed" ).value*1;
			if ( g_reqId !=null ) clearTimeout( g_reqId );
			g_reqId = setTimeout( update_scene, interval );

			if ( a == false ) return;
		}
	}

	if ( g_cntLife == 0 )g_seedA = Array.from( g_bufA );
	if ( g_cntLife == 0 )g_seedB = Array.from( g_bufB );
	g_bufA = update_life( g_bufA, g_buf_land );
	g_bufB = update_life( g_bufB, g_buf_land );
	g_cntLife++;
	update_paint();

}



let g_cntLife;
let g_reqId;


//-----------------------------------------------------------------------------
function initParam()
//-----------------------------------------------------------------------------
{
	g_cntLife = 0;

	g_bufA = Array.from(g_seedA);
	g_bufB = Array.from(g_seedB);
}
//-----------------------------------------------------------------------------
function init_land()
//-----------------------------------------------------------------------------
{

	g_buf_land = new Array( g_reso_x*g_reso_y );
	g_buf_land = genSeed_land( g_reso_x*g_reso_y );
	g_buf_land = update_land( g_buf_land, g_reso_x, g_reso_y );
	//--
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
						g_seedA[adr] = 1;
						g_seedB[adr] = 1;
					}
					else
					{
						g_seedA[adr] = 0;
						g_seedB[adr] = 0;
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
		g_seedA = Array( g_reso_x*g_reso_y ).fill(0);
		g_seedB = Array( g_reso_x*g_reso_y ).fill(0);

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
		if ( g_cntLife == 0 )g_seedA = Array.from( g_bufA );
		if ( g_cntLife == 0 )g_seedB = Array.from( g_bufB );
		g_bufA = update_life( g_bufA, g_buf_land );
		g_bufB = update_life( g_bufB, null );
		g_cntLife++;
		update_paint();
	}
}

document.onmousedown = mousemovedown;
document.onmousemove = mousemovedown;
let g_prevButtons = 0;
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	if ( g_prevButtons == 0 &&  e.buttons==1 )
	{
	    var rect = html_canvasA.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / html_canvasA.width  * g_reso_x);
        let y= Math.floor((e.clientY - rect.top ) / html_canvasA.height * g_reso_y);

		if ( x >= 0 && x < g_reso_x && y >= 0 && y < g_reso_y )
		{
			let a = g_bufA[ g_reso_x*y+x ];
			g_penCol = a==0?1:0;
		}
	}
	
	if ( e.buttons==1 )
	{
		var flgBold = document.getElementsByName( "html_bold" )[0].checked ;
		var flgBlack = document.getElementsByName( "html_black" )[0].checked ;
		var flgSymmetry = document.getElementsByName( "html_symmetry" )[0].checked ;

	    var rect = html_canvasA.getBoundingClientRect();
        let x= Math.floor((e.clientX - rect.left) / html_canvasA.width  * g_reso_x);
        let y= Math.floor((e.clientY - rect.top ) / html_canvasA.height * g_reso_y);


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
						g_bufA[ round2d(x  ,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_bufA[ round2d(w  ,y  ,g_reso_x,g_reso_y)	] = g_penCol*c2;

						g_bufA[ round2d(x  ,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_bufA[ round2d(w  ,y+1,g_reso_x,g_reso_y)	] = g_penCol*c2;

						g_bufA[ round2d(x+1,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_bufA[ round2d(w-1,y  ,g_reso_x,g_reso_y)	] = g_penCol*c2;

						g_bufA[ round2d(x+1,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_bufA[ round2d(w-1,y+1,g_reso_x,g_reso_y)	] = g_penCol*c2;
					}
					else
					{
						g_bufA[ g_reso_x*y+x ] = g_penCol*c1;
						g_bufA[ g_reso_x*y+w ] = g_penCol*c2;
					}
				}
				else
				{
					if ( flgBold )
					{
						g_bufA[ round2d(x  ,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_bufA[ round2d(x  ,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_bufA[ round2d(x-1,y  ,g_reso_x,g_reso_y)	] = g_penCol*c1;
						g_bufA[ round2d(x-1,y+1,g_reso_x,g_reso_y)	] = g_penCol*c1;
					}
					else
					{
						g_bufA[ g_reso_x*y+x ] = g_penCol*c1;
					}
				}
				update_paint();
			}

		}

	}

	g_prevButtons = e.buttons;
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
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{

	g_penCol =1 ;

	g_reso_y =  document.getElementById( "html_reso" ).value * 1.0;
	g_reso_x = g_reso_y*(html_canvasA.width/html_canvasA.height);
	init_land();

	initSeed_clear();
//	initSeed_randam();

	if(1)
	{	// 初期画面
		function pset(x,y)
		{
			g_seedA[ g_reso_x*y+x ] = 1;
//			g_seedB[ g_reso_x*y+x ] = 1;
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
	update_paint();

	//webGL
//	let buf = update_map( g_size );
	g_model = [];
	init_gl( g_bufA,  g_reso_x,  g_reso_y,  g_reso_x,  g_reso_y );
	g_reqId = window.requestAnimationFrame( update_gl );
	g_posView = new vec3( 0,-0.5,-1.5);
	g_rotView = new vec3( rad(10),0,0);
	g_fovy = rad(45);
	g_reqId = null;
}
// webGL
//let g_yaw = 0;
let g_model = [];



//カメラ制御
let g_rotView;
let g_posView;
let g_fovy;
//-----------------------------------------------------------------------------
function cam_update( l2, r2, lx, ly, rx, ry )
//-----------------------------------------------------------------------------
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

// HTML制御
let g_penCol;
//-----------------------------------------------------------------------------
function html_updateCopy( v )
//-----------------------------------------------------------------------------
{
	g_bufB = Array.from(g_bufA);
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
	g_seedA = Array.from( g_bufA );
	g_seedB = Array.from( g_bufB );
	initParam();
	update_paint();
}
//-----------------------------------------------------------------------------
function html_updateSize()
//-----------------------------------------------------------------------------
{
	g_reso_y =  document.getElementById( "html_reso" ).value * 1.0;
	g_reso_x = g_reso_y*(html_canvasA.width/html_canvasA.height);
console.log(g_reso_x,g_reso_y);
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
	if ( g_cntLife == 0 )g_seedA = Array.from( g_bufA );
	if ( g_cntLife == 0 )g_seedB = Array.from( g_bufB );
	g_bufA = update_life( g_bufA, g_buf_land );
	g_bufB = update_life( g_bufB, null );
	g_cntLife++;
	update_paint();
}

//-----------------------------------------------------------------------------
function html_updateAuto()
//-----------------------------------------------------------------------------
{
	update_scene(0);

}
//-----------------------------------------------------------------------------
function html_updateFullscreen()
//-----------------------------------------------------------------------------
{
	const obj = document.querySelector("#html_canvasA"); 

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