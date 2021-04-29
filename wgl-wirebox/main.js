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
		this[ 0] = m00;
		this[ 1] = m01;
		this[ 2] = m02;
		this[ 3] = m03;
		this[ 4] = m10;
		this[ 5] = m11;
		this[ 6] = m12;
		this[ 7] = m13;
		this[ 8] = m20;
		this[ 9] = m21;
		this[10] = m22;
		this[11] = m23;
		this[12] = m30;
		this[13] = m31;
		this[14] = m32;
		this[15] = m33;
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
function mperspective( sc, aspect, n, f ) 
//---------------------------------------------------------------------
{
	// 参考)http://marina.sys.wakayama-u.ac.jp/~tokoi/?date=20090829
	// f = 1/tan(fovy)

	//	左手座標系
	//	Z奥がマイナス(-1～1)
	//	DEPTHも奥がマイナス(-1～1)
	//	X右がプラス
	//	Y上がプラス

	return new mat4(
		sc/aspect,     0,            0,                0,
		        0,    sc,            0,                0,
		        0,     0, -(f+n)/(f-n), -(2.0*f*n)/(f-n),
		        0,     0,           -1,                0);
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

let gl = html_canvas_gl.getContext('webgl');
if ( gl == null )
{
	alert("ブラウザがwebGL2に対応していません。Safariの場合は設定>Safari>詳細>ExperimentalFeatures>webGL2.0をonにすると動作すると思います。");
}

let g=html_canvas_2d.getContext('2d');
console.log(gl.canvas.width);
//-----------------------------------------------------------------------------
g.print = function( tx, ty, str )
//-----------------------------------------------------------------------------
{
	this.font = "12px monospace";
	this.fillStyle = "#000000";
	this.fillText( str, tx, ty );
}

//-----------------------------------------------------------------------------
g.circle = function( x,y,r )
//-----------------------------------------------------------------------------
{
	this.beginPath();
	this.arc(x, y, r, 0, Math.PI * 2, true);
	this.closePath();
	this.stroke();
}

//-----------------------------------------------------------------------------
g.line = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	this.beginPath();
	this.strokeStyle = "#000000";
	this.lineWidth = 1.0;
	this.moveTo( sx, sy );
	this.lineTo( ex, ey );
	this.closePath();
	this.stroke();
}

//-----------------------------------------------------------------------------
g.cls = function()
//-----------------------------------------------------------------------------
{
	this.fillStyle = "#ffffff";
	this.fillRect( 0, 0, this.canvas.width, this.canvas.height );
}

///// Model

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
	tblVertex = [];
	tblColor = [];
	vecOfs;
	flg = false;	

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
					+   "gl_Position = vec4(pos, 1.0)*M*V*P;"
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
	drawModel( P, V )
	//-----------------------------------------------------------------------------
	{
		// 座標計算
		// 描画
		gl.useProgram( this.hdlShader );
		{
			gl.uniformMatrix4fv( this.hdlP, false, Object.values(P) );
			gl.uniformMatrix4fv( this.hdlV, false, Object.values(V) );
			gl.uniformMatrix4fv( this.hdlM, false, Object.values(this.M) );

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlVertexbuf );
			gl.vertexAttribPointer( this.hdl_pos, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlColorbuf );
			gl.vertexAttribPointer( this.hdl_col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
			
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			gl.drawElements( this.drawtype, this.tblIndex.length, gl.UNSIGNED_SHORT, 0 );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
		}
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
				let v = new vec4(
					this.tblVertex[i*3+0],
					this.tblVertex[i*3+1],
					this.tblVertex[i*3+2],
					1
				);
				v = vec4_vmul_vM( v, this.M );
				v = vec4_vmul_vM( v, V );
				v = vec4_vmul_vM( v, P );
				tmp.push( v );
			}
		}

		// 描画
		{
			let sx = g.canvas.width/2;
			let sy = g.canvas.height/2;

			for ( let i = 0 ; i < tmp.length ; i++ )
			{
				tmp[i].x /=  tmp[i].w;
				tmp[i].y /= -tmp[i].w;
			}
			for ( let v of tmp )
			{
				let x = v.x*sx+sx;
				let y = v.y*sy+sy;
				g.circle( x,y, 3 );
			}

			if ( this.drawtype == gl.LINES )
			{
				for ( let i = 0 ; i< this.tblIndex.length/2 ; i++ )
				{
					let v = tmp[this.tblIndex[i*2+0]];
					let p = tmp[this.tblIndex[i*2+1]];					
					let x1 = v.x*sx+sx;
					let y1 = v.y*sy+sy;
					let x2 = p.x*sx+sx;
					let y2 = p.y*sy+sy;
					g.line( x1, y1,x2, y2 );
				}
			}
			
		}

	}

};

///// main

let g_flg1 = 0;
//---------------------------------------------------------------------
function	update_gl(time)
//---------------------------------------------------------------------
{

	// プロジェクション計算
	let P1 = mperspective( 1/Math.tan(g_fovy/2), gl.canvas.width/gl.canvas.height, 0.0, -1.0);
	let P2 = mperspective( 1/Math.tan(g_fovy/2),  g.canvas.width/ g.canvas.height, 0.0, -1.0);

	// ビュー計算
	g_yaw+=radians(0.263);
	let V = midentity();
	V = mmul( V, mrotY( g_yaw )  );
	V = mmul( V, mtrans( g_posEye ) );

	// モデル計算
	for ( let m of g_tblModel )
	{
		m.M = mmul( m.M, mrotX( radians(-1.5) )  );
	}

	{	// gl 描画
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		for ( let m of g_tblModel )
		{
			m.drawModel( P1, V );
		}
	}

	{	// 2d 描画
		g.cls();
		for ( let m of g_tblModel )
		{
			m.drawModel_canvas( P2, V );
		}
	}

	g_reqId = window.requestAnimationFrame( update_gl );
}

//-----------------------------------------------------------------------------
function init_gl()
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

		return [ tblIndex, tblVertex, tblColor, gl.LINES];
	}
	
	//-----------------------------------------------------------------------------
	function makePolyBox( s )
	//-----------------------------------------------------------------------------
	{
		let tblVertex = 
		[
			-s,-s,-s,
			 s,-s,-s,
			-s, s,-s,
			 s, s,-s,

		];

		let tblColor = 
		[
			1.0 , 0.0 , 0.0 , 	
			1.0 , 0.0 , 0.0 , 
			1.0 , 0.0 , 0.0 , 
			1.0 , 0.0 , 0.0 , 
		]

		let tblIndex = 
		[
			0,1,2,3
		];

		return [ tblIndex, tblVertex, tblColor, gl.TRIANGLE_STRIP];
	}
	
	// main
		
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makeWireBox( 1.0 );
		let m = new Model( new vec3( 0,0,0), tblIndex, tblVertex, tblColor, drawtype );
		g_tblModel.push( m );
	}
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makeWireBox( 1.0 );
		let m = new Model( new vec3( 1,1,1), tblIndex, tblVertex, tblColor, drawtype );
		g_tblModel.push( m );
	}
	if(0)
	{
		let [ tblIndex, tblVertex, tblColor, drawtype] = makePolyBox( 1.0 );
		g_tblModel.push( new Model( new vec3( 0,0,0), tblIndex, tblVertex, tblColor, drawtype ) );
	}

	//---
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clearDepth( 1.0 );
	gl.viewport( 0.0, 0.0, gl.canvas.width, gl.canvas.height );

}

let g_yaw = 0;
let g_tblModel = [];
let g_posEye;
let g_fovy;
let g_matCam;
let g_prevButtons;
let g_reqId;
console.log( html_canvas_gl.width,html_canvas_gl.height);
console.log( html_canvas_2d.width,html_canvas_2d.height);

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	g_posEye = new vec3( 0,-0.5,-12.5);
	g_fovy = radians(45);
	g_reqId = null;

	init_gl();
	
	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = window.requestAnimationFrame( update_gl );
}

// HTML制御
