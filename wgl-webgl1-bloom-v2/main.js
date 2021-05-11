"use strict";

///// canvas

let flg1 = 1;
let cnt1 = 0;

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
		this.ctx.arc( x, y, r, 0, Math.PI * 2, true );
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

class G_webgl	// 2021/05/05 glコンテキスト変数を外部定義。glサンプルを試しやすくするため
{
	//-----------------------------------------------------------------------------
	compile( type, src )
	//-----------------------------------------------------------------------------
	{
		let sdr = gl.createShader( type );	
		gl.shaderSource( sdr, src );
		gl.compileShader( sdr );
		if( gl.getShaderParameter( sdr, gl.COMPILE_STATUS ) == false )
		{
			console.log( gl.getShaderInfoLog( sdr ) );
		}
		return sdr
	}
	//-----------------------------------------------------------------------------
	constructor( gl )
	//-----------------------------------------------------------------------------
	{
		this.gl = gl;
		if ( gl == null )
		{
			alert( "ブラウザがwebGL2に対応していません。Safariの場合は設定>Safari>詳細>ExperimentalFeatures>webGL2.0をonにすると動作すると思います。" );
		}
		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );
		gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		gl.clearDepth( 1.0 );	
		gl.viewport( 0.0, 0.0, gl.canvas.width, gl.canvas.height );
		gl.enable( gl.CULL_FACE );	// デフォルトでは反時計回りが表示

		// シェーダーコンパイル

		this.shader_1 = {};
		// シェーダー構成
		{

			let src_vs = 
				 "attribute vec4 pos;"
				+"attribute vec3 col;"
				+"uniform mat4 V;"
				+"uniform mat4 M;"
				+"uniform mat4 P;"
				+"varying vec3 vColor;"
				+"void main( void )"
				+"{"
			//挙動確認用コード 
			//	+   "mat4 S = mat4( 0.5,  0.0,  0.0,  0.0,"
			//	+   "              0.0,  0.5,  0.0,  0.0,"
			//	+   "              0.0,  0.0,  0.5,  0.0,"
			//	+   "              0.0,  0.0,  0.0,  1.0 );"
			//	+   "float th = radians( 15.0 );"
			//	+   "float c = cos( th );"
			//	+   "float s = sin( th );"
			//	+   "mat4 Rx = mat4( 1.0,  0.0,  0.0,  0.0,"
			//	+   "               0.0,    c,   -s,  0.0,"
			//	+   "               0.0,    s,    c,  0.0,"
			//	+   "               0.0,  0.0,  0.0,  1.0 );"
			//	+   "mat4 Ry = mat4(  c,  0.0,    s,  0.0,"
			//	+   "               0.0,  1.0,  0.0,  0.0,"
			//	+   "                -s,  0.0,    c,  0.0,"
			//	+   "               0.0,  0.0,  0.0,  1.0 );"
			//	+   "mat4 Rz = mat4(  c,   -s,  0.0,  0.0,"
			//	+   "                 s,    c,  0.0,  0.0,"
			//	+   "               0.0,  0.0,  1.0,  0.0,"
			//	+   "               0.0,  0.0,  0.0,  1.0 );"
			//	+   "mat4 Tx = mat4( 1.0,  0.0,  0.0, -1.0,"
			//	+   "               0.0,  1.0,  0.0,  0.0,"
			//	+   "               0.0,  0.0,  1.0,  0.0,"
			//	+   "               0.0,  0.0,  0.0,  1.0 );"
			//	+   "mat4 Ty = mat4( 1.0,  0.0,  0.0,  0.0,"
			//	+   "               0.0,  1.0,  0.0,  1.0,"
			//	+   "               0.0,  0.0,  1.0,  0.0,"
			//	+   "               0.0,  0.0,  0.0,  1.0 );"
			//	+   "mat4 Tz = mat4( 1.0,  0.0,  0.0,  0.0,"
			//	+   "               0.0,  1.0,  0.0,  0.0,"
			//	+   "               0.0,  0.0,  1.0, -9.0,"
			//	+   "               0.0,  0.0,  0.0,  1.0 );"
			//	+   "mat4 T = Rz;         "
			//	+   "float fovy=radians( 45.0 );     "
			//	+   "float sc=1.0/tan( fovy/2.0 );   "
			//	+   "float n=0.0;                  "
			//	+   "float f=-1.0;                 "
			//	+   "float aspect=1.0;             "
			//	+	"mat4 Pm = mat4(               "
			//	+	"	sc/aspect,     0.0,          0.0,              0.0,"
			//	+	"	      0.0,      sc,          0.0,              0.0,"
			//	+	"	      0.0,     0.0, -( f+n )/( f-n ), -( 2.0*f*n )/( f-n ),"
			//	+	"	      0.0,     0.0,         -1.0,              0.0 );"
				+   "gl_Position = pos;"
				+   "vColor = col;"
				+"}"
			;
					
			let src_fs =
				 "precision mediump float;"
				+"varying vec3 vColor;"
				+"void main( void )"
				+"{"
				+	"gl_FragColor = vec4( vColor, 1.0 );"
				+"}"
			;
			let vs		= this.compile( gl.VERTEX_SHADER, src_vs );
			let fs		= this.compile( gl.FRAGMENT_SHADER, src_fs );

			this.shader_1.prog	= gl.createProgram();			//WebGLProgram オブジェクトを作成
			gl.attachShader( this.shader_1.prog, vs );			//シェーダーを WebGLProgram にアタッチ
			gl.deleteShader( vs );
			gl.attachShader( this.shader_1.prog, fs );			//シェーダーを WebGLProgram にアタッチ
			gl.deleteShader( fs );
			gl.linkProgram( this.shader_1.prog );				//WebGLProgram に接続されたシェーダーをリンク
			this.shader_1.P		= gl.getUniformLocation( this.shader_1.prog, "P" );
			this.shader_1.V		= gl.getUniformLocation( this.shader_1.prog, "V" );
			this.shader_1.M		= gl.getUniformLocation( this.shader_1.prog, "M" );
			this.shader_1.pos		= gl.getAttribLocation( this.shader_1.prog, "pos" );
			this.shader_1.col		= gl.getAttribLocation( this.shader_1.prog, "col" );
			gl.enableVertexAttribArray( this.shader_1.pos );
			gl.enableVertexAttribArray( this.shader_1.col );
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
		// gl.createBuffer() ⇔  gl.deleteBuffer( buffer );

		// シェーダ削除
		// shader = gl.createShader( type )⇔  gl.deleteShader( shader );

		// プログラム削除
		// program = gl.createProgram()	⇔  gl.deleteProgram( program );

		this.hdlIndexbuf = gl.deleteBuffer( this.hdlIndexbuf );
		this.hdlVertexbuf = gl.deleteBuffer( this.hdlVertexbuf );
		this.hdlColorbuf = gl.deleteBuffer( this.hdlColorbuf );

		this.hdlIndexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.tblIndex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
	    }
	    
		this.hdlVertexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlVertexbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.tblVertex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
		
		this.hdlColorbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlColorbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.tblColor ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		this.tblVertex = [];	// VRAMに転送するので保存しなくてよい
		this.tblColor = [];	// VRAMに転送するので保存しなくてよい

	}
	
	//-----------------------------------------------------------------------------
	drawLists( type )
	//-----------------------------------------------------------------------------
	{
		// 頂点データの再ロード
		this.reloadBuffer();	
		let P = midentity();	// CPU側で計算するので単位行列を入れておく
		let V = midentity();	// CPU側で計算するので単位行列を入れておく
		this.M = midentity();	// CPU側で計算するので単位行列を入れておく
		gl.useProgram( this.shader_1.prog );
		{
		
			gl.uniformMatrix4fv( this.shader_1.P, false, P );
			gl.uniformMatrix4fv( this.shader_1.V, false, V );
			gl.uniformMatrix4fv( this.shader_1.M, false, this.M );

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlVertexbuf );
			gl.vertexAttribPointer( this.shader_1.pos, 4, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, this.hdlColorbuf );
			gl.vertexAttribPointer( this.shader_1.col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.hdlIndexbuf );
			gl.drawElements( type, this.tblIndex.length, gl.UNSIGNED_SHORT, 0 );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
		}
		gl.flush();
		this.tblIndex = [];
	}

	//-----------------------------------------------------------------------------
	trianglev4( a,b,c )
	//-----------------------------------------------------------------------------
	{
		let o = this.tblVertex.length/4;
		this.tblVertex.push( a.x, a.y, a.z, a.w );
		this.tblVertex.push( b.x, b.y, b.z, b.w );
		this.tblVertex.push( c.x, c.y, c.z, c.w );

		if ( g_param_color=="Red" )
		{
			this.tblColor.push( 0.10, 0.0, 0.23427 );
			this.tblColor.push( 0.10, 0.0, 0.23427 );
			this.tblColor.push( 0.10, 0.0, 0.23427 );
		}
		else
		if ( g_param_color=="Black" )
		{
			this.tblColor.push( 1.0, 1.0, 1.0 );
			this.tblColor.push( 1.0, 1.0, 1.0 );
			this.tblColor.push( 1.0, 1.0, 1.0 );
		}
		else
		if ( g_param_color=="White" )
		{
			this.tblColor.push( 0.2, 0.2, 0.2 );
			this.tblColor.push( 0.2, 0.2, 0.2 );
			this.tblColor.push( 0.2, 0.2, 0.2 );
		}
		else
		if ( g_param_color=="Green" )
		{
			this.tblColor.push( 0.0, 0.120, 0.0 );
			this.tblColor.push( 0.0, 0.120, 0.0 );
			this.tblColor.push( 0.0, 0.120, 0.0 );
		}
		this.tblIndex.push( o+0, o+1, o+2 );
	}
	//-----------------------------------------------------------------------------
	linev4( s, e )
	//-----------------------------------------------------------------------------
	{
		let o = this.tblVertex.length/4;
		this.tblVertex.push( s.x, s.y, s.z, s.w );
		this.tblVertex.push( e.x, e.y, e.z, e.w );

		if ( g_param_color=="Red" )
		{
			this.tblColor.push( 1.0, 0.0, 0.0 );
			this.tblColor.push( 1.0, 0.0, 0.0 );
		}
		else
		if ( g_param_color=="Black" )
		{
			this.tblColor.push( 0.320, 0.320, 0.320 );
			this.tblColor.push( 0.320, 0.320, 0.320 );
		}
		else
		if ( g_param_color=="White" )
		{
			this.tblColor.push( 0.6, 0.6, 0.6 );
			this.tblColor.push( 0.6, 0.6, 0.6 );
		}
		else
		if ( g_param_color=="Green" )
		{
			this.tblColor.push( 0.0, 1.0, 0.0 );
			this.tblColor.push( 0.0, 1.0, 0.0 );
		}

		this.tblIndex.push( o+0, o+1 );
	}
	//-----------------------------------------------------------------------------
	linev4_red( s, e )
	//-----------------------------------------------------------------------------
	{
		let o = this.tblVertex.length/4;
		this.tblVertex.push( s.x, s.y, s.z, s.w );
		this.tblVertex.push( e.x, e.y, e.z, e.w );

			this.tblColor.push( 1.0, 0.0, 0.0 );
			this.tblColor.push( 1.0, 0.0, 0.0 );

		this.tblIndex.push( o+0, o+1 );
	}

	//-----------------------------------------------------------------------------
	cls()
	//-----------------------------------------------------------------------------
	{
		if ( g_param_color=="Red" )
		{
			gl.clearColor( 0.10, 0.0, 0.23427, 1.0 );
		}
		else
		if ( g_param_color=="Black" )
		{
			gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		}
		if ( g_param_color=="White" )
		{
			gl.clearColor( 0.2, 0.2, 0.2, 1.0 );
		}
		else
		if ( g_param_color=="Green" )
		{
			gl.clearColor( 0.0, 0.120, 0.0, 1.0 );
		}
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	}
}


///// Model

class Model	// 2021/05/02 TRIANGLESに対応
{
	indexes = [];
	vertexes = [];

	//-----------------------------------------------------------------------------
	constructor( vecOfs, indexes, vertexes, drawtype )
	//-----------------------------------------------------------------------------
	{
		this.drawtype = drawtype;
		this.vertexes = vertexes;
		this.indexes = indexes;

		this.M = mtrans( vecOfs );
	}
	//-----------------------------------------------------------------------------
	drawModel( P, V )
	//-----------------------------------------------------------------------------
	{
		// 座標計算
		let tmp = []; 
		{
			let T = mmul( P, mmul( V, this.M ) );

			for ( let i = 0 ; i < this.vertexes.length/3 ; i++ )
			{
				// 透視変換	//pos = v*M*V*P;
				let v = vec4( 
					this.vertexes[i*3+0],
					this.vertexes[i*3+1],
					this.vertexes[i*3+2],
					1,
				 );
				v = vec4_vmul_Mv( T ,v );

				tmp.push( v );
			}
		}

		// 描画
		{
			if ( this.drawtype == "LINES" )
			{
				for ( let i = 0 ; i < this.indexes.length/2 ; i++ )
				{
					let v = tmp[this.indexes[i*2+0]];
					let p = tmp[this.indexes[i*2+1]];					
					gra.linev4( v, p );
				}
				gra.drawLists( gl.LINES );
			}
			if ( this.drawtype == "TRIANGLES" )
			{
				for ( let i = 0 ; i < this.indexes.length/3 ; i++ )
				{
					let v1 = tmp[this.indexes[i*3+0]];
					let v2 = tmp[this.indexes[i*3+1]];
					let v3 = tmp[this.indexes[i*3+2]];
v1.z*=1.00003421210976421;
v2.z*=1.00003421210976421;
v3.z*=1.00003421210976421;
					gra.trianglev4( v1, v2, v3 );
				}
				gra.drawLists( gl.TRIANGLES );
			}
	
		}

	}

};

///// main

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

		return [ tblIndex, tblVertex, "LINES"];
	}
	//-----------------------------------------------------------------------------
	function makeFlatBox( s )
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

		let tblIndex = 
		[
			4,6,7,6,4,5,
			7,2,3,2,7,6,
			5,2,6,2,5,1,
			0,7,3,7,0,4,
			0,2,1,2,0,3,
			4,1,5,1,4,0,
			
			
		];

		return [ tblIndex, tblVertex, "TRIANGLES"];
	}

	//-----------------------------------------------------------------------------
	function makeWireGrid( sz,st )
	//-----------------------------------------------------------------------------
	{
		let tblVertex = [];
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
		return [ tblIndex, tblVertex, "LINES"];
	}
		
	// main
		
	// floor
	{
		let [ tblIndex, tblVertex, drawtype] = makeWireGrid( 30.0, 2.0 );
		g_tblModel.push( new Model( vec3( 0,0,0 ), tblIndex, tblVertex, drawtype ) );
	}

	// box1
	{
		let [ tblIndex, tblVertex, drawtype] = makeWireBox( 2.0 );
		let m = new Model( vec3( 0.0, 2.0, 0.0 ), tblIndex, tblVertex, drawtype );
		g_tblModel.push( m );
	}
	{
		let [ tblIndex, tblVertex, drawtype] = makeFlatBox( 2.0 );
		let m = new Model( vec3( 0, 2.0, 0.0 ), tblIndex, tblVertex, drawtype );
		g_tblModel.push( m );
	}

	// box1
	{
		let [ tblIndex, tblVertex, drawtype] = makeWireBox( 1.0 );
		let m = new Model( vec3( 8.0,1.0,0 ), tblIndex, tblVertex, drawtype );
		g_tblModel.push( m );
	}
	{
		let [ tblIndex, tblVertex, drawtype] = makeFlatBox( 1.0 );
		let m = new Model( vec3( 8,1.0, 0.0 ), tblIndex, tblVertex, drawtype );
		g_tblModel.push( m );
	}
}




let g_yaw = 0;
let g_tblModel = [];
let g_reqId;

//let gl = document.getElementById( "html_canvas" ).getContext( "webgl" );
let gl = document.getElementById( "html_canvas" ).getContext( "webgl2", { antialias: false } );
let gra = new G_webgl( gl );

class Camera
{
	constructor( pos, at, fovy )
	{
		this.pos	= pos;
		this.at		= at;
		this.fovy	= fovy;
	}
	
};
let g_cam;

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	html_onchange();

	let bloomfilter = bloom_create( gl );

	var then = 0;
	//---------------------------------------------------------------------
	function	update_paint( now )
	//---------------------------------------------------------------------
	{
		const deltaTime = ( now - then )/1000;
		then = now;
		function	draw_scene()
		{

			// プロジェクション計算
			let P = mperspective( g_cam.fovy,  gl.canvas.width/ gl.canvas.height, 0.1, 1000.0 );
			// ビュー計算
			let V = mlookat( g_cam.pos, g_cam.at );
			g_yaw+=radians( -0.1263 );
			V = mmul( V, mrotate( g_yaw, vec3( 0,1,0 ) ) );

			// モデル回転
			{
				let m = g_tblModel[3];
				m.M = mmul( mrotate( radians( 0.5 ), vec3( 0,1,0 ) ), m.M  );
			}
			{
				let m = g_tblModel[4];
				m.M = mmul( mrotate( radians( 0.5 ), vec3( 0,1,0 ) ), m.M  );
			}


			// 描画
			gra.cls();

			if( 1 )
			{
				for ( let m of g_tblModel )
				{
					m.drawModel( P, V );
				}
			}
			else
			{	// Zバッファ実験検証用コード
				test_depth();
			}	
		}

		if ( 0 )
		{
				bloomfilter.renderer( draw_scene,"XXnosmall", g_param_sigma, g_param_rate  );
		}
		else
		if ( document.getElementsByName( "html_noblur" )[0].checked )
		{
			draw_scene();
		}
		else
		{
			bloomfilter.renderer( draw_scene, g_param_small, g_param_sigma, g_param_rate );
		}

		if ( g_reqId ) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される可能性がある
		g_reqId = window.requestAnimationFrame( update_paint );
	}


	g_cam = new Camera( vec3( -8,8, 18 ), vec3( 0,3,0 ), 45 );

	g_reqId = null;

	int_model();
	
	update_paint();
}


let g_param_color = "Red";
let g_param_small = "small64";
let g_param_sigma =8;
let g_param_rate =0.45;
//-----------------------------------------------------------------------------
function html_onchange()
//-----------------------------------------------------------------------------
{
	var list = document.getElementsByName( "html_color" ) ;
	for ( let l of list )
	{
		if ( l.checked ) 
		{
			g_param_color = l.value;
			break;
		}
	}


	var list = document.getElementsByName( "html_small" ) ;
	for ( let l of list )
	{
		if ( l.checked ) 
		{
			g_param_small = l.value;
			break;
		}
	}
	
	g_param_sigma	= document.getElementById( "html_sigma" ).value*1;
	g_param_rate	= document.getElementById( "html_rate" ).value*1;



}

function test_depth()
{
	gl.disable( gl.DEPTH_TEST );

	let m = g_tblModel[0];
	let P = mperspective( g_cam.fovy,  gl.canvas.width/ gl.canvas.height, 1.0, 10000.0 );
	g_cam = new Camera( vec3( 0, 1, 30 ), vec3( 0,0,0 ), 45 );
	let V = mlookat( g_cam.pos, g_cam.at );

	m.vertexes = [ 0,0,-10,  0,0,8.1  		]; // クリッピング非対象設定
	//m.vertexes = [ 0,0,-10,  0,0,8.1 +3		]; // クリッピング対象設定
	m.indexes = [0,1];
	// 座標計算
	if( 0 )
	{
		let tmp = []; 
		for ( let i = 0 ; i < m.vertexes.length/3 ; i++ )
		{
			// 透視変換	//pos = v*M*V*P;
			let v = vec4( 
				m.vertexes[i*3+0],
				m.vertexes[i*3+1],
				m.vertexes[i*3+2],
				1,
			 );
			v = vec4_vmul_Mv( V ,v );
			v = vec4_vmul_Mv( P ,v );
			tmp.push( v );
		}

		// 描画
		if ( m.drawtype == "LINES" )
		{
			for ( let i = 0 ; i < m.indexes.length/2 ; i++ )
			{
				let v = tmp[m.indexes[i*2+0]];
				let p = tmp[m.indexes[i*2+1]];					
				gra.linev4( v, p );
			}
			gra.drawLists( gl.LINES );
		}
	}

	// 座標計算
	{
		let n = 1;
		let tmp = []; 
		for ( let i = 0 ; i < m.vertexes.length/3 ; i++ )
		{
			// 透視変換	//pos = v*M*V*P;
			let v = vec4( 
				m.vertexes[i*3+0],
				m.vertexes[i*3+1],
				m.vertexes[i*3+2],
				1,
			 );
			v = vec4_vmul_Mv( V ,v );

			if( cnt1<2 )if( cnt1==n )	console.log( "v",v );
			if( cnt1<2 )if( cnt1==n )	console.log( "P",P );

			v = vec4_vmul_Mv( P ,v );

			if( cnt1<2 )if( cnt1==n )	console.log( "Pv",v );

			if( 1 ){
			v.x/=v.w;
			v.y/=v.w;
			v.z/=v.w;
			v.w/=v.w;
			}

			if( cnt1<2 )if( cnt1==n )	console.log( "v/w",v );
//					if( cnt1<2 )console.log( v );
			if( cnt1<2 )cnt1++;

			tmp.push( v );
		}

		// 描画
		if ( m.drawtype == "LINES" )
		{
			for ( let i = 0 ; i < m.indexes.length/2 ; i++ )
			{
				let v = tmp[m.indexes[i*2+0]];
				let p = tmp[m.indexes[i*2+1]];					
				gra.linev4_red( v, p );
			}
			gra.drawLists( gl.LINES );
		}

	}
}
