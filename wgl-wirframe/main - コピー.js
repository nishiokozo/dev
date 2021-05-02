"use strict";

//	列優先になると、行列同士は左右反対に掛けるか、列X行で掛ける必要がある。
//	列優先だと回転移動行列を4X3で作ることが出来て25%計算量を減らせるというメリットがある。
//	行列ライブラリコンセプト
//	①GLSLと同じ数式同じ行列がメインプログラムでも同様に機能する
//	②直感的な演算順序、vMVPの順で右から掛けるのが最も使いやすい。

///// geom

//-----------------------------------------------------------------------------
function radians( v )
//-----------------------------------------------------------------------------
{
	return v/180*Math.PI;
}
//-----------------------------------------------------------------------------
function degrees( v )
//-----------------------------------------------------------------------------
{
	return v*180/Math.PI;
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
class vec4
{
	constructor( x, y, z, w )
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
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
function dot( a, b )
//------------------------------------------------------------------------------
{
	return a.x*b.x + a.y*b.y + a.z*b.z;
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
function reflect( I, N )
//------------------------------------------------------------------------------
{
	let a = 2*dot(I,N);
 	return vsub( I , vmul( new vec3(a,a,a), N ) );
}
//------------------------------------------------------------------------------
function refract( I, N, eta )
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
	//	R = eta * I - (eta * dot(N, I) + sqrt(k)) * N;
		let ve = new vec3(eta,eta,eta);
		let a = vmul( ve , I ); 
		let b = eta * dot(N, I);
		let c = b + Math.sqrt(k);
		let d = vmul( new vec3(c,c,c) , N);
		R = vsub(a , d);

	}
	return R;
}


class mat4
{
	constructor( 
		m00,m01,m02,m03,
		m10,m11,m12,m13,
		m20,m21,m22,m23,
		m30,m31,m32,m33)
	{
if (0)
{
		this[0] = [m00,m01,m02,m03];
		this[1] = [m10,m11,m12,m13];
		this[2] = [m20,m21,m22,m23];
		this[3] = [m30,m31,m32,m33];
}
else
if (0)
{
		this[0] = new Array(4);
		this[1] = new Array(4);
		this[2] = new Array(4);
		this[3] = new Array(4);
		this[0][0] = m00;
		this[0][1] = m01;
		this[0][2] = m02;
		this[0][3] = m03;
		this[1][0] = m10;
		this[1][1] = m11;
		this[1][2] = m12;
		this[1][3] = m13;
		this[2][0] = m20;
		this[2][1] = m21;
		this[2][2] = m22;
		this[2][3] = m23;
		this[3][0] = m30;
		this[3][1] = m31;
		this[3][2] = m32;
		this[3][3] = m33;
}
else
{
		this[ 0] = m00;	this[ 1] = m01;	this[ 2] = m02;	this[ 3] = m03;
		this[ 4] = m10;	this[ 5] = m11;	this[ 6] = m12;	this[ 7] = m13;
		this[ 8] = m20;	this[ 9] = m21;	this[10] = m22;	this[11] = m23;
		this[12] = m30;	this[13] = m31;	this[14] = m32;	this[15] = m33;
}

	}
	log( str="" )
	{
		console.log( str );
		console.log( "%f %f %f %f",this[ 0],this[ 1],this[ 2],this[ 3] );
		console.log( "%f %f %f %f",this[ 4],this[ 5],this[ 6],this[ 7] );
		console.log( "%f %f %f %f",this[ 8],this[ 9],this[10],this[11] );
		console.log( "%f %f %f %f",this[12],this[13],this[14],this[15] );
	}
};


//---------------------------------------------------------------------
function mperspective( fovy, aspect, n, f ) // 2021/05/02 fovyで入力に変更
//---------------------------------------------------------------------
{
	// n : ニアクリップ、必ず正の値を指定
	// f : ファークリップ、必ず正の値を指定

	let sc = 1/Math.tan(fovy/2);
	// 参考) https://www.ibm.com/docs/nl/aix/7.1?topic=library-gluperspective-subroutine
	// gluPerspective(60, aspect, 0.01f, 2.0f);
	//
	//	Y-up
	//	Z奥がマイナス

	return	new	mat4(
		sc/aspect	,	0			,	0			,	0				,
		0			,	sc			,	0			,	0				,
		0			,	0			,	-(f+n)/(f-n),	-(2.0*f*n)/(f-n),
		0			,	0			,	-1			,	0				);
}


//---------------------------------------------------------------------
function mfrustum( l, r, b, t, n, f ) 
//---------------------------------------------------------------------
{
	// 参考)https://docs.gl/gl3/glFrustum
	// glFrustum(-1.0, 1.0, -1.0, 1.0, 1.5, 20.0);
  	//
	//	Y-up
	//	Z奥がマイナス

	let A =   (r+l)/(r-l);	// センター
	let B =   (t+b)/(t-b);	// センター
	let C =  -(f+n)/(f-n);
	let D =-2*(f*n)/(f-n);

	return new mat4(
		2*n/(l-r)	,	0			,	A		,	0			,
		0			,	2*n/(t-b)	,	B		,	0			,
		0			,	0			,	C		,	D			,
		0			,	0			,	-1		,	0			);
}
//---------------------------------------------------------------------
function mortho ( l, r, b, t, n, f ) 
//---------------------------------------------------------------------
{
	// 参考) https://docs.microsoft.com/en-us/windows/win32/opengl/glfrustum
	// glOrtho(-2.0, 2.0, -2.0, 2.0, -1.5, 1.5);
	//
	//	Y-up
	//	Z奥がマイナス

	let tx =  -(r+l)/(r-l);
	let ty =  -(t+b)/(t-b);
	let tz =  -(f+n)/(f-n);

	return new mat4(
		2/(r-l)		,	0			,	0			,	tx			,
		0			,	2/(t-b)		,	0			,	ty			,
		0			,	0			,	-2/(f-n)	,	tz			,
		0			,	0			,	0			,	1			);
}
//---------------------------------------------------------------------
function midentity() 
//---------------------------------------------------------------------
{
	return new mat4(
		1	,	0	,	0	,	0	,
		0	,	1	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mtrans( v )	// 列優先
//---------------------------------------------------------------------
{
	return new mat4(
		1	,	0	,	0	,	v.x	,
		0	,	1	,	0	,	v.y	,
		0	,	0	,	1	,	v.z	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotX(th)
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	return new mat4( 
		1	,	0	,	0	,	0	,
		0	,	c	,	s	,	0	,
		0	,	-s	,	c	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotY(th)
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	return new mat4( 
		c	,	0	,	-s	,	0	,
		0	,	1	,	0	,	0	,
		s	,	0	,	c	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mrotZ(th)
//---------------------------------------------------------------------
{
	let c = Math.cos(th);
	let s = Math.sin(th);
	return new mat4( 
		c	,	s	,	0	,	0	,
		-s	,	c	,	0	,	0	,
		0	,	0	,	1	,	0	,
		0	,	0	,	0	,	1	
	);
}
//---------------------------------------------------------------------
function mmul( A, B )  //  A X B 列優先
//---------------------------------------------------------------------
{
	return new mat4(
		A[ 0] * B[ 0] +  A[ 4] * B[ 1] +  A[ 8] * B[ 2] +  A[12] * B[ 3],
		A[ 1] * B[ 0] +  A[ 5] * B[ 1] +  A[ 9] * B[ 2] +  A[13] * B[ 3],
		A[ 2] * B[ 0] +  A[ 6] * B[ 1] +  A[10] * B[ 2] +  A[14] * B[ 3],
		A[ 3] * B[ 0] +  A[ 7] * B[ 1] +  A[11] * B[ 2] +  A[15] * B[ 3],

		A[ 0] * B[ 4] +  A[ 4] * B[ 5] +  A[ 8] * B[ 6] +  A[12] * B[ 7],
		A[ 1] * B[ 4] +  A[ 5] * B[ 5] +  A[ 9] * B[ 6] +  A[13] * B[ 7],
		A[ 2] * B[ 4] +  A[ 6] * B[ 5] +  A[10] * B[ 6] +  A[14] * B[ 7],
		A[ 3] * B[ 4] +  A[ 7] * B[ 5] +  A[11] * B[ 6] +  A[15] * B[ 7],

		A[ 0] * B[ 8] +  A[ 4] * B[ 9] +  A[ 8] * B[10] +  A[12] * B[11],
		A[ 1] * B[ 8] +  A[ 5] * B[ 9] +  A[ 9] * B[10] +  A[13] * B[11],
		A[ 2] * B[ 8] +  A[ 6] * B[ 9] +  A[10] * B[10] +  A[14] * B[11],
		A[ 3] * B[ 8] +  A[ 7] * B[ 9] +  A[11] * B[10] +  A[15] * B[11],

		A[ 0] * B[12] +  A[ 4] * B[13] +  A[ 8] * B[14] +  A[12] * B[15],
		A[ 1] * B[12] +  A[ 5] * B[13] +  A[ 9] * B[14] +  A[13] * B[15],
		A[ 2] * B[12] +  A[ 6] * B[13] +  A[10] * B[14] +  A[14] * B[15],
		A[ 3] * B[12] +  A[ 7] * B[13] +  A[11] * B[14] +  A[15] * B[15]
	);

}
//---------------------------------------------------------------------
function vec4_vmul_vM( v4, M ) // 列優先 
//---------------------------------------------------------------------
{
	//	0	1	2	3		:		1	0	0	tx
	//	4	5	6	7		:		0	1	0	ty
	//	8	9	10	11		:		0	0	1	tz
	//	12	13	14	15		:		0	0	0	1

	let m = mmul( mtrans( new vec3( v4.x, v4.y, v4.z) ), M ); // 

	return new vec4( m[3], m[7], m[11], m[15] );
}
//---------------------------------------------------------------------
function vmul_vM( v, M ) // 列優先 
//---------------------------------------------------------------------
{
	//	0	1	2	3		:		1	0	0	tx
	//	4	5	6	7		:		0	1	0	ty
	//	8	9	10	11		:		0	0	1	tz
	//	12	13	14	15		:		0	0	0	1

	let m = mmul( mtrans( v ), M ); // 

	return new vec4( m[3], m[7], m[11] );
}
//-----------------------------------------------------------------------------
function mlookat( vecEye, vecAt )
//-----------------------------------------------------------------------------
{
	let mv = midentity();
	// 視点・注視点から、viewマトリクスの生成
	let [rx,ry] = function(v)
	{
		let yz =  Math.sqrt(v.x*v.x+v.z*v.z);
		let ry = -Math.atan2( v.x , -v.z ); 
		let rx =  Math.atan2( v.y, yz ); 
		return [rx,ry];
	}( vsub(vecAt, vecEye) ); 
	mv = mtrans( new vec3( -vecEye.x, -vecEye.y, -vecEye.z ) );
	mv = mroty_gl( mv, ry );
	mv = mrotx_gl( mv, rx );
	return mv;
}

///// canvas

class G_2d
{
	constructor( ctx )
	{
		this.ctx = ctx;
	}
	//-----------------------------------------------------------------------------
	print( tx, ty, str )
	//-----------------------------------------------------------------------------
	{
		this.ctx.font = "12px monospace";
		this.ctx.fillStyle = "#000000";
		this.ctx.fillText( str, tx, ty );
	}

	//-----------------------------------------------------------------------------
	circle( x,y,r )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	//-----------------------------------------------------------------------------
	line( sx,sy, ex,ey )
	//-----------------------------------------------------------------------------
	{
		this.ctx.beginPath();
		this.ctx.strokeStyle = "#000000";
		this.ctx.lineWidth = 1.0;
		this.ctx.moveTo( sx, sy );
		this.ctx.lineTo( ex, ey );
		this.ctx.closePath();
		this.ctx.stroke();
	}

	//-----------------------------------------------------------------------------
	cls()
	//-----------------------------------------------------------------------------
	{
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height );
	}
};

class G_webgl
{
	constructor( gl )
	{
		if ( gl == null )
		{
			alert("ブラウザがwebGL2に対応していません。Safariの場合は設定>Safari>詳細>ExperimentalFeatures>webGL2.0をonにすると動作すると思います。");
		}
		this.ctx = gl;
		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );
		gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		gl.clearDepth( 1.0 );	
		gl.viewport( 0.0, 0.0, gl.canvas.width, gl.canvas.height );

		// シェーダーコンパイル
		{
			function compile( type, src )
			{
				let shader = gl.createShader( type );	
				gl.shaderSource( shader, src );
				gl.compileShader( shader );
				if(gl.getShaderParameter(shader, gl.COMPILE_STATUS) == false )
				{
					console.log(gl.getShaderInfoLog(shader));
				}
				return shader
			}

			{
				let src = 
					 "attribute vec3 pos;"
					+"uniform mat4 V;"
					+"uniform mat4 M;"
					+"uniform mat4 P;"
					+"attribute vec3 col;"
					+"varying vec3 vColor;"
					+"void main(void)"
					+"{"
				//挙動確認用コード 
				//	+   "mat4 S = mat4(0.5,  0.0,  0.0,  0.0,"
				//	+   "              0.0,  0.5,  0.0,  0.0,"
				//	+   "              0.0,  0.0,  0.5,  0.0,"
				//	+   "              0.0,  0.0,  0.0,  1.0);"
				//	+   "float th = radians(15.0);"
				//	+   "float c = cos(th);"
				//	+   "float s = sin(th);"
				//	+   "mat4 Rx = mat4(1.0,  0.0,  0.0,  0.0,"
				//	+   "               0.0,    c,   -s,  0.0,"
				//	+   "               0.0,    s,    c,  0.0,"
				//	+   "               0.0,  0.0,  0.0,  1.0);"
				//	+   "mat4 Ry = mat4(  c,  0.0,    s,  0.0,"
				//	+   "               0.0,  1.0,  0.0,  0.0,"
				//	+   "                -s,  0.0,    c,  0.0,"
				//	+   "               0.0,  0.0,  0.0,  1.0);"
				//	+   "mat4 Rz = mat4(  c,   -s,  0.0,  0.0,"
				//	+   "                 s,    c,  0.0,  0.0,"
				//	+   "               0.0,  0.0,  1.0,  0.0,"
				//	+   "               0.0,  0.0,  0.0,  1.0);"
				//	+   "mat4 Tx = mat4(1.0,  0.0,  0.0, -1.0,"
				//	+   "               0.0,  1.0,  0.0,  0.0,"
				//	+   "               0.0,  0.0,  1.0,  0.0,"
				//	+   "               0.0,  0.0,  0.0,  1.0);"
				//	+   "mat4 Ty = mat4(1.0,  0.0,  0.0,  0.0,"
				//	+   "               0.0,  1.0,  0.0,  1.0,"
				//	+   "               0.0,  0.0,  1.0,  0.0,"
				//	+   "               0.0,  0.0,  0.0,  1.0);"
				//	+   "mat4 Tz = mat4(1.0,  0.0,  0.0,  0.0,"
				//	+   "               0.0,  1.0,  0.0,  0.0,"
				//	+   "               0.0,  0.0,  1.0, -9.0,"
				//	+   "               0.0,  0.0,  0.0,  1.0);"
				//	+   "mat4 T = Rz;         "
				//	+   "float fovy=radians(45.0);     "
				//	+   "float sc=1.0/tan(fovy/2.0);   "
				//	+   "float n=0.0;                  "
				//	+   "float f=-1.0;                 "
				//	+   "float aspect=1.0;             "
				//	+	"mat4 Pm = mat4(               "
				//	+	"	sc/aspect,     0.0,          0.0,              0.0,"
				//	+	"	      0.0,      sc,          0.0,              0.0,"
				//	+	"	      0.0,     0.0, -(f+n)/(f-n), -(2.0*f*n)/(f-n),"
				//	+	"	      0.0,     0.0,         -1.0,              0.0);"
//					+   "gl_Position = vec4(pos, 1.0)*P;"
					+   "gl_Position = pos.xyzz;"
					+   "vColor = col;"
					+"}"
				;
				
				this.bin_vs = compile( gl.VERTEX_SHADER, src );
			}
			{
				let src =
					 "precision mediump float;"
					+"varying vec3 vColor;"
					+"void main(void)"
					+"{"
					+	"gl_FragColor = vec4(vColor, 1.0);"
					+"}"
				;
				this.bin_fs = compile( gl.FRAGMENT_SHADER, src );
			}
		}

		// シェーダー構成
		{
			this.hdlProgram = gl.createProgram();			//WebGLProgram オブジェクトを作成、初期化
			gl.attachShader( this.hdlProgram, this.bin_vs );	//シェーダーを WebGLProgram にアタッチ
			gl.attachShader( this.hdlProgram, this.bin_fs );	//シェーダーを WebGLProgram にアタッチ
			gl.linkProgram( this.hdlProgram );				//WebGLProgram に接続されたシェーダーをリンク

			this.hdlP = gl.getUniformLocation( this.hdlProgram, "P" );
			this.hdlV = gl.getUniformLocation( this.hdlProgram, "V" );
			this.hdlM = gl.getUniformLocation( this.hdlProgram, "M" );

			this.hdl_pos = gl.getAttribLocation( this.hdlProgram, "pos" );
			gl.enableVertexAttribArray( this.hdl_pos );

			this.hdl_col = gl.getAttribLocation( this.hdlProgram, "col" );
			gl.enableVertexAttribArray( this.hdl_col );
		}

		this.tblIndex = [];
		this.tblVertex = [];
		this.tblColor = [];
		this.reloadBuffer();
	}

	//-----------------------------------------------------------------------------
	reloadBuffer()
	//-----------------------------------------------------------------------------
	{
		// 頂点バッファ
		// gl.createBuffer() ⇔  gl.deleteBuffer(buffer);

		// シェーダ削除
		// shader = gl.createShader( type )⇔  gl.deleteShader( shader );

		// プログラム削除
		// program = gl.createProgram()	⇔  gl.deleteProgram( program );

		this.hdlIndexbuf = this.ctx.deleteBuffer( this.hdlColorbuf );
		this.hdlVertexbuf = this.ctx.deleteBuffer( this.hdlColorbuf );
		this.hdlColorbuf = this.ctx.deleteBuffer( this.hdlColorbuf );

		this.hdlIndexbuf = this.ctx.createBuffer();
		{
			this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			this.ctx.bufferData( this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.tblIndex ), this.ctx.STATIC_DRAW );
	    	this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, null );
	    }
	    
		this.hdlVertexbuf = this.ctx.createBuffer();
		{
			this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.hdlVertexbuf );
			this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( this.tblVertex ), this.ctx.STATIC_DRAW );
	    	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, null );
		}
		
		this.hdlColorbuf = this.ctx.createBuffer();
		{
			this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.hdlColorbuf );
			this.ctx.bufferData( this.ctx.ARRAY_BUFFER, new Float32Array( this.tblColor ), this.ctx.STATIC_DRAW );
	    	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, null );
		}

		this.tblVertex = [];	// VRAMに転送するので保存しなくてよい
		this.tblColor = [];	// VRAMに転送するので保存しなくてよい

	}
	
	//-----------------------------------------------------------------------------
	drawLists( P )
	//-----------------------------------------------------------------------------
	{
		// 頂点データの再ロード
		this.reloadBuffer();	
		let V = midentity();
		this.M = midentity();
		this.ctx.useProgram( this.hdlProgram );

		{
			this.ctx.uniformMatrix4fv( this.hdlP, false, Object.values(P) );
			this.ctx.uniformMatrix4fv( this.hdlV, false, Object.values(V) );
			this.ctx.uniformMatrix4fv( this.hdlM, false, Object.values(this.M) );

			this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.hdlVertexbuf );
			this.ctx.vertexAttribPointer( this.hdl_pos, 3, this.ctx.FLOAT, false, 0, 0 ) ;
	    	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, null );

			this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, this.hdlColorbuf );
			this.ctx.vertexAttribPointer( this.hdl_col, 3, this.ctx.FLOAT, false, 0, 0 ) ;
	    	this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, null );

			this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			this.ctx.drawElements( this.ctx.LINES, this.tblIndex.length, this.ctx.UNSIGNED_SHORT, 0 );
	    	this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, null );
		}
		this.ctx.flush();
		this.tblIndex = [];
	}

	//-----------------------------------------------------------------------------
	line( sx,sy, ex,ey )
	//-----------------------------------------------------------------------------
	{
		let o = this.tblVertex.length/3;
		this.tblVertex.push( sx, sy, 0.0 );
		this.tblVertex.push( ex, ey, 0.0 );

		this.tblColor.push( 0.0, 0.0, 0.0 );
		this.tblColor.push( 0.0, 0.0, 0.0 );

		this.tblIndex.push( o+0, o+1 );
	}
	//-----------------------------------------------------------------------------
	lineZ( sx,sy,sz, ex,ey,ez )
	//-----------------------------------------------------------------------------
	{
		let o = this.tblVertex.length/3;
		this.tblVertex.push( sx, sy, sz );
		this.tblVertex.push( ex, ey, ez );

		this.tblColor.push( 0.0, 0.0, 0.0 );
		this.tblColor.push( 0.0, 0.0, 0.0 );

		this.tblIndex.push( o+0, o+1 );
	}

	//-----------------------------------------------------------------------------
	cls()
	//-----------------------------------------------------------------------------
	{
		this.ctx.clear( this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT );
	}
}


///// Model

class Model
{
	tblIndex = [];
	tblVertex = [];
	tblColor = [];

	//-----------------------------------------------------------------------------
	constructor( vecOfs, tblIndex, tblVertex, tblColor, drawtype )
	//-----------------------------------------------------------------------------
	{
		this.tblIndex = tblIndex;
		this.drawtype = drawtype;
		this.tblVertex = tblVertex;	// canvas/2d描画用 wglだけなら保存しなくてよい
		this.tblColor = tblColor;	// canvas/2d描画用 wglだけなら保存しなくてよい

		this.flg = true;	
		this.vecOfs = vecOfs;
		this.M = mtrans( this.vecOfs );
	}

	//-----------------------------------------------------------------------------
	drawModel_canvas( P, V )
	//-----------------------------------------------------------------------------
	{
		// 座標計算
		let tmp = []; // vec4
		{
			for ( let i = 0 ; i < this.tblVertex.length/3 ; i++ )
			{
				// 透視変換	//gl_Position = vec4(pos, 1.0)*M*V*P;
				let v = new vec3(
					this.tblVertex[i*3+0],
					this.tblVertex[i*3+1],
					this.tblVertex[i*3+2]
				);
				v = vmul_vM( v, this.M );
				v = vmul_vM( v, V );
				v = vmul_vM( v, P );
				tmp.push( v );
			}
		}

		// 描画
		{
			let sx = g2.ctx.canvas.width/2;
			let sy = g2.ctx.canvas.height/2;

			let tmp2=[];
			for ( let i = 0 ; i < tmp.length ; i++ )
			{
				tmp2[i] = 
				{
					x:tmp[i].x / tmp[i].z,
					y:tmp[i].y /-tmp[i].z
				}
			}

			if ( this.drawtype == "LINES" )
			{
				for ( let i = 0 ; i< this.tblIndex.length/2 ; i++ )
				{
					let v = tmp[this.tblIndex[i*2+0]];
					let p = tmp[this.tblIndex[i*2+1]];					
					g1.lineZ( v.x, v.y, v.z, p.x, p.y, p.z );
				}
			}


			if ( this.drawtype == "LINES" )
			{
				for ( let i = 0 ; i< this.tblIndex.length/2 ; i++ )
				{
					let v = tmp2[this.tblIndex[i*2+0]];
					let p = tmp2[this.tblIndex[i*2+1]];					
					let x1 = v.x*sx+sx;
					let y1 = v.y*sy+sy;
					let x2 = p.x*sx+sx;
					let y2 = p.y*sy+sy;
					g2.line( x1, y1,x2, y2 );
				}
			}
			
		}


	}

};

///// main

let g_flg1 = 0;
//---------------------------------------------------------------------
function	update_paint(time)
//---------------------------------------------------------------------
{
	// プロジェクション計算
	let P = mperspective( g_fovy,  g2.ctx.canvas.width/ g2.ctx.canvas.height, 0.0, -1.0);

	// ビュー計算
	g_yaw+=radians(0.1263);
	let V = midentity();
	V = mmul( V, mrotY( g_yaw )  );
	V = mmul( V, mtrans( g_posEye ) );

	// モデル計算
	for ( let m of g_tblModel )
	{
//		m.M = mmul( m.M, mrotX( radians(-1.5) )  );
	}
	{
		let m = g_tblModel[1];
		m.M = mmul( m.M, mrotY( radians(-0.5) )  );
	}

	g1.cls();
	g2.cls();

	for ( let m of g_tblModel )
	{
		m.drawModel_canvas( P, V );
	}

	{
		{
			let sw = g1.ctx.canvas.width;
			let sh = g1.ctx.canvas.height;
			let P = mortho(  -0, sw,sh, 0, -1.0, 100.0);
			g1.drawLists( P );
		}
	}
	if ( g_reqId ) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される可能性がある
	g_reqId = window.requestAnimationFrame( update_paint );
}

//-----------------------------------------------------------------------------
function int_model()
//-----------------------------------------------------------------------------
{

	//-----------------------------------------------------------------------------
	function makeWireBox( s )
	//-----------------------------------------------------------------------------
	{
		let tblVertex = 
		[
			-s,-s,-s,
			 s,-s,-s,
			 s, s,-s,
			-s, s,-s,

			-s,-s, s,
			 s,-s, s,
			 s, s, s,
			-s, s, s,
		];

		let tblColor = 
		[
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,

			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,

		]

		let tblIndex = 
		[
			0,1,
			1,2,
			2,3,
			3,0,

			4+0,4+1,
			4+1,4+2,
			4+2,4+3,
			4+3,4+0,

			0,4+0,
			1,4+1,
			2,4+2,
			3,4+3,
		];

		return [ tblIndex, tblVertex, tblColor, "LINES"];
	}

	//-----------------------------------------------------------------------------
	function makeWireGrid( sz,st)
	//-----------------------------------------------------------------------------
	{
		let tblVertex = [];
		let tblColor = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
		let tblIndex = [];


		{// grid floor
		
			{
				let ofs = tblVertex.length/3;
				for ( let i = -sz ; i < sz ; i++ )
				{
					let x = sz*st;
					let z = i*st;
					tblVertex.push( -x,0,z );
					tblVertex.push( x,0,z );

				}
					tblVertex.push( sz*st,0,sz*st );

				for ( let i = 0 ; i < sz*2 ; i++ )
				{
					tblIndex.push(  ofs+i*2,ofs+i*2+1 );
				}
					tblIndex.push(  ofs+0*2+1,ofs+sz*4 );
			}
			{
				let ofs = tblVertex.length/3;
				for ( let i = -sz ; i < sz ; i++ )
				{
					let x = i*st;
					let z = sz*st;
					tblVertex.push( x,0,-z );
					tblVertex.push( x,0,z );
				}
					tblVertex.push( sz*st,0,sz*st );

				for ( let i = 0 ; i < sz*2 ; i++ )
				{
					tblIndex.push(  ofs+i*2,ofs+i*2+1 );
				}
					tblIndex.push(  ofs+0*2+1,ofs+sz*4  );
			}
		}
		return [ tblIndex, tblVertex, tblColor, "LINES"];
	}
		
	// main
		
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makeWireBox( 2.0 );
		let m = new Model( new vec3( 0,2.0,0), tblIndex, tblVertex, tblColor, drawtype );
		g_tblModel.push( m );
	}
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makeWireBox( 1.0 );
		let m = new Model( new vec3( 11,2,1), tblIndex, tblVertex, tblColor, drawtype );
		g_tblModel.push( m );
	}
	if(1)
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makeWireGrid( 8.0, 2.0 );
		g_tblModel.push( new Model( new vec3( 0,0,0), tblIndex, tblVertex, tblColor, drawtype ) );
	}

}

let g_yaw = 0;
let g_tblModel = [];
let g_posEye;
let g_fovy;
let g_matCam;
let g_prevButtons;
let g_reqId;

let g1 = new G_webgl( html_canvas_glb.getContext('webgl') );
let g2 = new G_2d( html_canvas_2d.getContext('2d') );

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_posEye = new vec3( 0,-3,-12.5);
	g_fovy = radians(45);
	g_reqId = null;

	int_model();
	
	update_paint();
}
