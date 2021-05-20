"use strict";

///// Token



///// canvas

let first = 1;

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


//-----------------------------------------------------------------------------
function create_gra_webgl( gl )
//-----------------------------------------------------------------------------
{

	// ライブラリコンセプト
	//	・線画、BASICのLINEのような使い勝手が出来るライブラリ。
	//	・速度は重視しない
	//	・webgl版は3Dのニアクリップが出来る。canvas/2d版は文字なども使える。

	let body = {}
	let	m_shader = {};
	let	m_hdlVertexbuf;
	let	m_hdlColorbuf;
	
	let m_tblVertex_wire = [];
	let m_tblColor_wire = [];
	let m_tblVertex_flat = [];
	let m_tblColor_flat = [];


	//-----------------------------------------------------------------------------
	function compile( type, src )
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
	function reloadBuffer_wire()
	//-----------------------------------------------------------------------------
	{
		// 頂点バッファ
		// gl.createBuffer() ⇔  gl.deleteBuffer( buffer );

		// シェーダ削除
		// shader = gl.createShader( type )⇔  gl.deleteShader( shader );

		// プログラム削除
		// program = gl.createProgram()	⇔  gl.deleteProgram( program );

		gl.deleteBuffer( m_hdlVertexbuf );
		gl.deleteBuffer( m_hdlColorbuf );

		m_hdlVertexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblVertex_wire ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
		
		m_hdlColorbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblColor_wire ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		m_tblVertex_wire = [];	// VRAMに転送するので保存しなくてよい
		m_tblColor_wire = [];	// VRAMに転送するので保存しなくてよい

	}
	//-----------------------------------------------------------------------------
	function reloadBuffer_flat()
	//-----------------------------------------------------------------------------
	{
		// 頂点バッファ
		// gl.createBuffer() ⇔  gl.deleteBuffer( buffer );

		// シェーダ削除
		// shader = gl.createShader( type )⇔  gl.deleteShader( shader );

		// プログラム削除
		// program = gl.createProgram()	⇔  gl.deleteProgram( program );

		gl.deleteBuffer( m_hdlVertexbuf );
		gl.deleteBuffer( m_hdlColorbuf );

		m_hdlVertexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblVertex_flat ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
		
		m_hdlColorbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblColor_flat ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		m_tblVertex_flat = [];	// VRAMに転送するので保存しなくてよい
		m_tblColor_flat = [];	// VRAMに転送するので保存しなくてよい

	}
	
	// public

	//-----------------------------------------------------------------------------
	body.draw_wire = function()
	//-----------------------------------------------------------------------------
	{
		// 頂点データの再ロード
		reloadBuffer_wire();	
		gl.useProgram( m_shader.prog );
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.vertexAttribPointer( m_shader.pos, 4, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.vertexAttribPointer( m_shader.col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.drawArrays(  gl.LINES, 0, m_cnt_wire );
		}
		gl.flush();
		m_cnt_wire = 0;
	}
	//-----------------------------------------------------------------------------
	body.draw_flat = function()
	//-----------------------------------------------------------------------------
	{
		// 頂点データの再ロード
		reloadBuffer_flat();	
		gl.useProgram( m_shader.prog );
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.vertexAttribPointer( m_shader.pos, 4, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.vertexAttribPointer( m_shader.col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.drawArrays( gl.TRIANGLES, 0, m_cnt_flat );
		}
		gl.flush();
		m_cnt_flat = 0;
	}

	let m_cnt_wire = 0;
	let m_cnt_flat = 0;
	//-----------------------------------------------------------------------------
	body.set_flat = function( a,b,c, col )
	//-----------------------------------------------------------------------------
	{
		m_tblVertex_flat.push( a.x, a.y, a.z, a.w );
		m_tblVertex_flat.push( b.x, b.y, b.z, b.w );
		m_tblVertex_flat.push( c.x, c.y, c.z, c.w );

		m_tblColor_flat.push( col.x, col.y, col.z );
		m_tblColor_flat.push( col.x, col.y, col.z );
		m_tblColor_flat.push( col.x, col.y, col.z );
	
		m_cnt_flat += 3;
	}
	//-----------------------------------------------------------------------------
	body.set_wire = function( s, e, col )
	//-----------------------------------------------------------------------------
	{
		m_tblVertex_wire.push( s.x, s.y, s.z, s.w );
		m_tblVertex_wire.push( e.x, e.y, e.z, e.w );

		m_tblColor_wire.push( col.x, col.y, col.z );
		m_tblColor_wire.push( col.x, col.y, col.z );

		m_cnt_wire += 2;
	}

	//-----------------------------------------------------------------------------
	body.cls = function( col=vec3(0,0,0) )
	//-----------------------------------------------------------------------------
	{
		gl.clearColor( col.x , col.y , col.z , 1.0);
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	}

	if ( gl == null )
	{
		alert( "ブラウザがwebGL2に対応していません。Safariの場合は設定>Safari>詳細>ExperimentalFeatures>webGL2.0をonにすると動作すると思います。" );
	}

	// デフォルトと同じ
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );// gl.LESS;	最も奥が1.0、最も手前が0.0
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clearDepth( 1.0 );
	gl.viewport( 0.0, 0.0, gl.canvas.width, gl.canvas.height );
	gl.enable( gl.CULL_FACE );	// デフォルトでは反時計回りが表示

	// 陰線処理
	gl.enable( gl.POLYGON_OFFSET_FILL );
	gl.polygonOffset(1,1);
	/*
	有効にすると、各フラグメントの深度値が計算されたオフセット値に追加されます。 
	オフセットは、深度テストが実行される前、および深度値が深度バッファに書き込まれる前に追加されます。 
	glPolygonOffset(GLfloat factor, GLfloat units);
	o = m *factor r *units
	ここで、mはポリゴンの最大深度勾配であり、rはウィンドウ座標深度値に解決可能な差を生成することが保証されている最小値です。 
	値rは、実装固有の定数です。
	*/


	// シェーダーコンパイル

	// シェーダー構成
	{

		let src_vs = 
			 "attribute vec4 pos;"
			+"attribute vec3 col;"
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
			+   "gl_PointSize = 6.0;"
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
		m_shader.prog	= gl.createProgram();			//WebGLProgram オブジェクトを作成
		let vs	= compile( gl.VERTEX_SHADER, src_vs );
		let fs	= compile( gl.FRAGMENT_SHADER, src_fs );
		gl.attachShader( m_shader.prog, vs );			//シェーダーを WebGLProgram にアタッチ
		gl.attachShader( m_shader.prog, fs );			//シェーダーを WebGLProgram にアタッチ
		gl.deleteShader( vs );
		gl.deleteShader( fs );
		gl.linkProgram( m_shader.prog );				//WebGLProgram に接続されたシェーダーをリンク
		m_shader.pos		= gl.getAttribLocation( m_shader.prog, "pos" );
		m_shader.col		= gl.getAttribLocation( m_shader.prog, "col" );
		gl.enableVertexAttribArray( m_shader.pos );
		gl.enableVertexAttribArray( m_shader.col );
	}

	return body;
}

///// Wire Model


//-----------------------------------------------------------------------------
function wideperse( P,  v )		// ワイドパース
//-----------------------------------------------------------------------------
{
	if( g_param_normal )
	{								// 平行奥行
		v = vec4_vmul_Mv( P ,v );
	}
	else
	{								// 距離で割る
		let dis = length( v );
		v = vec4_vmul_Mv( P ,v );
		v.z *= dis/v.w;
		v.w = dis;
	}
	return v;
}

//-----------------------------------------------------------------------------
function model_craete( vecOfs, index_wire, index_flat, vertexes, color, drawtype )
//-----------------------------------------------------------------------------
{
	//ワイヤーフレームのモデル描画

	let body=[];
	body.drawtype = drawtype;
	body.vertexes = vertexes;
	body.index_wire = index_wire;
	body.index_flat = index_flat;
	body.color	= color;
	body.M = mtrans( vecOfs );

	//-----------------------------------------------------------------------------
	body.drawModel = function( gra, P, V, colset )
	//-----------------------------------------------------------------------------
	{

		// 座標計算
		let tmp = []; 
		for ( let i = 0 ; i < body.vertexes.length/3 ; i++ )
		{
			// 透視変換	//pos = PVMv;
			let v = vec4( 
				body.vertexes[i*3+0],
				body.vertexes[i*3+1],
				body.vertexes[i*3+2],
				1,
			);
			v = vec4_vmul_Mv( body.M ,v );
			v = vec4_vmul_Mv( V ,v );
			v = wideperse( P, v );
			tmp.push( v );
		}

		// 描画
		for ( let i = 0 ; i < body.index_flat.length/3 ; i++ )
		{
			let a = tmp[body.index_flat[i*3+0]];
			let b = tmp[body.index_flat[i*3+1]];
			let c = tmp[body.index_flat[i*3+2]];
			gra.set_flat( a, b, c,  colset.flat );
		}
		for ( let i = 0 ; i < body.index_wire.length/2 ; i++ )
		{
			let v = tmp[body.index_wire[i*2+0]];
			let p = tmp[body.index_wire[i*2+1]];
			gra.set_wire( v, p, colset.dark );

			let v3 = body.vertexes[body.index_wire[i*2+0]];
			let p3 = body.vertexes[body.index_wire[i*2+1]];
//			if ( g_param_raph ) raph_line3d( P, v3, p3, colset.wire, 1 );

		}
	}

	return body
};


//-----------------------------------------------------------------------------
function init_testmodel() 
//-----------------------------------------------------------------------------
{
	function prim_create( type, scale )
	{
		let body = {};

		function prim1( sc )
		{
			let vert = 
			[
				[-0.5*sc,-0.5*sc,-0.5*sc],
				[ 0.5*sc,-0.5*sc,-0.5*sc],
				[ 0.5*sc, 0.5*sc,-0.5*sc],
				[-0.5*sc, 0.5*sc,-0.5*sc],

				[-0.5*sc,-0.5*sc, 0.5*sc],
				[ 0.5*sc,-0.5*sc, 0.5*sc],
				[ 0.5*sc, 0.5*sc, 0.5*sc],
				[-0.5*sc, 0.5*sc, 0.5*sc],
			];

			let index_wire = 
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
			let index_flat = 
			[
				4,6,7,6,4,5,
				7,2,3,2,7,6,
				5,2,6,2,5,1,
				0,7,3,7,0,4,
				0,2,1,2,0,3,
				4,1,5,1,4,0,
			];
			return [vert,index_wire,index_flat];
		}

		function floor1( sc )
		{
			let vert = 
			[
				[ -0.5*sc, 0, -0.5*sc ],
				[  0.5*sc, 0, -0.5*sc ],
				[  0.5*sc, 0,  0.5*sc ],
				[ -0.5*sc, 0,  0.5*sc ],
			];

			let index_wire = 
			[
				0,1,
				1,2,
				2,3,
				3,0,
			];
			let index_flat = 
			[
				0,2,1,2,0,3,
			];
			return [vert,index_wire,index_flat];
		}

		let vert_cmn,index_wire,vert_flat,index_flat;
//		let s = 0.995;
//		let scale = 0.5;	// 一辺50cmを基準
		switch( type )
		{
			case "prim1"	:[vert_cmn,index_wire,index_flat] = prim1( scale );break;
			case "floor1"	:[vert_cmn,index_wire,index_flat] = floor1( scale );break;
			default: alert("error " + type );
		}

		body.tblVertex = [];
		body.tblIndex_wire = [];
		body.tblIndex_flat = [];

		body.addprim = function ( x, y, z )
		{
			let ofs = body.tblVertex.length/3;
			for ( let v of vert_cmn )
			{
				body.tblVertex.push( v[0] +x*scale );
				body.tblVertex.push( v[1] +y*scale );
				body.tblVertex.push( v[2] +z*scale );
			}
			for ( let id of index_wire )
			{
				body.tblIndex_wire.push( id+ofs );
			}
			for ( let id of index_flat )
			{
				body.tblIndex_flat.push( id+ofs );
			}
		}
		return body;
	}



	//-----------------------------------------------------------------------------
	function makePrimModel( size_u, size_v, size_w, type, scale )
	//-----------------------------------------------------------------------------
	{
		let prim = prim_create( type, scale );

		let u = Math.floor( size_u / 2 );
		let v = Math.floor( size_v / 2 );
		let w = Math.floor( size_w / 2 );

		let au = (size_u-u*2)==0?1:0;
		let av = (size_v-v*2)==0?1:0;
		let aw = (size_w-w*2)==0?1:0;

		for ( let x = -u ; x <= u-au ; x++ )
		{
			for ( let y = -v ; y <= v-av ; y++ )
			{
				for ( let z = -w ; z <= w-aw ; z++ )
				{
					prim.addprim( x+au/2, y+av/2, z+aw/2 );
				}
			}
		}

		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ prim.tblIndex_wire, prim.tblIndex_flat, prim.tblVertex, color, "INDEXED"];
	}
	//-----------------------------------------------------------------------------
	function makePrimRandom( size_u, size_v, size_w, type, scale, cnt )
	//-----------------------------------------------------------------------------
	{
		let prim = prim_create( type, scale );

		let cu = size_u/2;
		let cv = size_v/2;
		let cw = size_w/2;
		
		for ( let i = 0 ; i < cnt ; i++ )
		{
			let x = Math.floor(rand()*size_u)+0.5-cu;
			let y = Math.floor(rand()*size_v)-0.5;
			let z = Math.floor(rand()*size_w)+0.5-cw;
			prim.addprim( x , y , z );
		}

		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ prim.tblIndex_wire, prim.tblIndex_flat, prim.tblVertex, color, "INDEXED"];
	}
	//-----------------------------------------------------------------------------
	function makePrimPile( size_u, size_v, size_w, type, scale )
	//-----------------------------------------------------------------------------
	{
		let prim = prim_create( type, scale );

		let cu = size_u/2;
		let cv = size_v/2;
		let cw = size_w/2;
		
		for ( let i = 0 ; i < size_v ; i++ )
		{
			let x = size_u+0.5-cu;
			let y = -1.5		+i;
			let z = size_w+0.5-cw;
			prim.addprim( x , y , z );
			prim.addprim( x , y , -z );
			prim.addprim( -x , y , z );
			prim.addprim( -x , y , -z );
		}

		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ prim.tblIndex_wire, prim.tblIndex_flat, prim.tblVertex, color, "INDEXED"];
	}
	//-----------------------------------------------------------------------------
	function makePrimSquare( size_u, y, size_w, type, scale )
	//-----------------------------------------------------------------------------
	{
		let prim = prim_create( type, scale );

		let cu = size_u/2;
		let cw = size_w/2;
		
		for ( let i = 1 ; i <= size_u ; i++ )
		{
			let x = size_u+scale-cu;
			let z = size_w+scale-cw;
			prim.addprim( -x+i , y-scale-2 , z );
			prim.addprim( -x+i , y-scale-2 , -z );
		}
		for ( let i = 1 ; i <= size_w ; i++ )
		{
			let x = size_u+scale-cu;
			let z = size_w+scale-cw;
			prim.addprim(  x , y-scale-2 , -z +i);
			prim.addprim( -x , y-scale-2 , -z +i);
		}


		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ prim.tblIndex_wire, prim.tblIndex_flat, prim.tblVertex, color, "INDEXED"];
	}

	// main

	g_tblModel = [];
	{
		let scale = 0.5;
		let w = 20;
		let h = 20;
		let r2 = 4;
		let y2 = 1;
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimModel( w,1,h, "floor1", scale );
			let m = model_craete( vec3( 0, 0.0, 0.0 ), tblIndex_wire,tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}		
		if(0)
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimRandom( w,6,h, "prim1", scale, 60 );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}
		if(0)
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimPile( r2,y2+1,r2, "prim1", scale );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}
		if(0)
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimSquare( r2,y2,r2, "prim1", scale );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}
		if(1)
		{
			r2=w-2;
			y2=8;	//6=3m相当
			{
				let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimPile( r2,y2,r2, "prim1", scale );
				let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
				g_tblModel.push( m );
			}
			{
				let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimSquare( r2,y2,r2, "prim1", scale );
				let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
				g_tblModel.push( m );
			}
		}
	}


}




//------------------------------------------------------------------------------
function create_mot( filename )
//------------------------------------------------------------------------------
{
	let mot={};
	let m_step = 0;
	let m_text_in="(none)";
	let m_loaded = false;
	mot.m_mot = null;

	//------------------------------------------------------------------------------
	function a_web_load( filename )
	//------------------------------------------------------------------------------
	{
		let xhr = new XMLHttpRequest();
		xhr.open('GET', filename); 
		xhr.onload = () => 
		{
			m_text_in = xhr.response;
			m_loaded = true;
		}
		xhr.send( null );
	}

	//------------------------------------------------------------------------------
	mot.update = function()// gra, P, V, colset, scale, numframe )
	//------------------------------------------------------------------------------
	{
		switch( m_step )
		{
		case 0:
			a_web_load( filename );	
			m_step++;
			break;

		case 1:
			if ( m_loaded ) 
			{
				m_step++;

				//----------------------------------------
				function bvh_persJoint( text )
				//----------------------------------------
				{
					function bvh_persJoint_sub( token )
					{
						let hash = {}
						let element="";	//	パースモード
						let form=[];	//	フォーマット
						let param=[];	//	パラメータ
						let len_variable = -1;		// 可変長長さ
						let flg_variable = false;	// 可変長フラグ	：CHANNELS 3 Zrotation Xrotation Yrotation
						hash.JOINT=[];
						while( token.isActive() )
						{
							let obj = token.getToken().val;
						
							if ( obj == "}" ) break;
							if ( obj == "{" ) obj = bvh_persJoint_sub( token );
							if ( obj == null ) return null;

							if ( element == "" )
							{
								switch( obj )
								{
								case "HIERARCHY":
									break;

								case "ROOT":
								case "JOINT":
								case "End":
									element = obj;//"DEFINE";
									param=[];
									flg_variable = false;
									form = 
									[
										[""		,	""],
										[""		,	""],
									];
									break;

								case "CHANNELS":
									element = obj;
									param=[];
									flg_variable = true;
									break;

								case "OFFSET":
									element = obj;
									param=[];
									flg_variable = false;
									form = 
									[
										["float"	,	"x"],
										["float"	,	"y"],
										["float"	,	"z"],
									];
									break;

								case "MOTION":
									element = obj;
									param=[];
									flg_variable = false;
									form = 
									[
										["none"		,	""			],
										["none"		,	""			],
										["float"	,	"Frames"	],
										["none"		,	""			],
										["none"		,	""			],
										["none"		,	""			],
										["float"	,	"FrameTime"	],
									];
									break;

								default:
									alert( ".bvh file error:"+obj );
									return null;
									break;
								}
							}
							else
							{
								param.push(obj);

								if ( flg_variable && param.length == 1 )
								{
									// 長さ指定（CHANNELS）フォーマットの処理
									len_variable = param[0]*1;
									flg_variable = false;
									param = [];
								}
								else
								{
									// 定型フォーマット処理
									switch( element )
									{
									case "ROOT":
									case "JOINT":
									case "End":
										if ( param.length == form.length )
										{
											let name	= param[0];	// hip
											let mot	= param[1];	// {}
											//--
											hash.JOINT.push(mot);	
											mot["NAME"]=name;
											element = "";
										}
										break;

									case "CHANNELS":
										if ( param.length == len_variable ) 
										{
											hash[element]	=	param;
											element = "";
											cntData+=param.length;
										}
										break;

									case "OFFSET":
										if ( param.length == form.length )
										{
											hash[element]={};
											for ( let i = 0 ; i < form.length ; i++ )
											{
												let a = param[i];
												if ( form[i][0] == "float" ) a = a*1;
												if ( form[i][0] == "none" ) continue;
												hash[element][form[i][1]] = a;
											}
											element = "";
										}
										break;

									case "MOTION":
										if ( param.length == form.length )
										{
											hash[element]={};
											for ( let i = 0 ; i < form.length ; i++ )
											{
												let a = param[i];
												if ( form[i][0] == "float" ) a = a*1;
												if ( form[i][0] == "none" ) continue;
												hash[element][form[i][1]] = a;
											}
											element = "DATA";
											hash[element]=[];
											param=[];
											//--
										}
										break;

									case "DATA":
										if ( param.length == cntData )	// Frame毎に分割
										{
											hash[element].push( param );
											param=[];
										}

									}
								}
							}

						}

						return hash;
					}
					let cntData = 0;
					let token = token_create( text );
					return bvh_persJoint_sub( token );
				}

				{//pers
					mot.m_mot = bvh_persJoint( m_text_in );
					if ( mot.m_mot == null ) return;
				}
				//--
				//console.log(mot.m_mot,mot.m_mot.MOTION.Frames );


			}
			break;

		case 2:
			break;
		}
	}
	//------------------------------------------------------------------------------
	mot.exec = function( gra, P, V, colset, scale, numframe )
	//------------------------------------------------------------------------------
	{
		//----------------------------------------
		function bvh_play( M, mot, frame, scale )
		//----------------------------------------
		{
			function drawbone( v3, p3, s )
			{
				let v = vec4( v3.x*s, v3.y*s, v3.z*s , 1 );
				let p = vec4( p3.x*s, p3.y*s, p3.z*s , 1 );
				v = vec4_vmul_Mv( V ,v );
				v = wideperse( P, v );
				p = vec4_vmul_Mv( V ,p );
				p = wideperse( P, p );
				gra.set_wire( v, p, colset.wire );


				function raph_line3d( v3, p3, color )	// ラフ線風描画
				{
					let sc = 0.1*rand();
					let a;
					let b;
					for ( let i = 0 ; i < 8 ; i++ )
					{
						a = vec4( 
							v3.x*s + (rand()-0.5)*sc, 
							v3.y*s + (rand()-0.5)*sc, 
							v3.z*s + (rand()-0.5)*sc , 
							1 
						);
						b = vec4( 
							p3.x*s + (rand()-0.5)*sc, 
							p3.y*s + (rand()-0.5)*sc, 
							p3.z*s + (rand()-0.5)*sc , 
							1 
						);
						a = wideperse( P, vec4_vmul_Mv( V ,a ) );
						b = wideperse( P, vec4_vmul_Mv( V ,b ) );
						gra.set_wire( a, b, colset.wire );
						
					}
				}
				if ( g_param_raph ) raph_line3d( v3, p3, colset.wire );

			}

			function bvh_play_sub( M, obj, data )
			{
				// 描画
				if( obj.OFFSET.x!=0 || obj.OFFSET.y!=0 || obj.OFFSET.z!=0 )
				{
					let p = vmul_Mv( M, vec3(0,0,0) );
					let v = vmul_Mv( M, obj.OFFSET );
					drawbone( p, v, scale );
				}

				// child行列計算
				let C = midentity();
				if ( obj.CHANNELS )
				{
					for ( let ch of obj.CHANNELS )
					{
						switch( ch )
						{
							case "Xposition":C = mmul( mtrans( vec3( data[ptr++]*1,0,0 ) ), C );break;
							case "Yposition":C = mmul( mtrans( vec3( 0,data[ptr++]*1,0 ) ), C );break;
							case "Zposition":C = mmul( mtrans( vec3( 0,0,data[ptr++]*1 ) ), C );break;
							case "Xrotation":C = mmul( C, mrotx( radians( data[ptr++]*1 ) )   );break;
							case "Yrotation":C = mmul( C, mroty( radians( data[ptr++]*1 ) )   );break;
							case "Zrotation":C = mmul( C, mrotz( radians( data[ptr++]*1 ) )   );break;
						}
					}
				}
				C = mmul( mtrans( obj.OFFSET ), C );
				C = mmul( M, C );

				for ( let j of obj.JOINT )
				{
					bvh_play_sub( C, j,data );
				}
			}
			// 
			let ptr = 0;
			bvh_play_sub( M, mot.JOINT[0], mot.DATA[frame] );

		}
		if ( m_step == 2 )
		{
			bvh_play( midentity(), mot.m_mot, numframe, scale );
		}
	}	
	return mot;
}


//-----------------------------------------------------------------------------
function camera_create( pos, at, fovy, near=1.0, far=1000.0 )
//-----------------------------------------------------------------------------
{
	let body = {};
	body.pos	= pos;
	body.at		= at;
	body.fovy	= fovy;
	body.near	= near;
	body.far	= far;
	return body;
}

/////
document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false}); // 指ドラッグスクロールの抑制
let g_yaw;
let g_tblModel;
let g_reqId1;
let g_reqId2;
let rand;
let m_cntframe;
let g_param_colset;
let g_param_fovy;
let g_param_zoom;
let g_param_high;
let g_param_look;
let g_param_normal;
let g_param_raph;
let g_param_undome;
let g_param_request;
let original_width = html_canvas.width;
let original_height = html_canvas.height;
let gra;
//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	if ( g_reqId2 ) clearTimeout( g_reqId2 );				 // main呼び出しで多重化を防ぐ
	g_reqId2=null;

	if ( g_reqId1 ) window.cancelAnimationFrame( g_reqId1 ); // main呼び出しで多重化を防ぐ
	g_reqId1 = null;

	g_param_colset = { back:vec3( 1.0, 1.0, 1.0 )		,	flat:vec3(1.0, 1.0, 1.0 )		, wire:vec3( 0.32, 0.32, 0.32 )	 };
	g_param_fovy = 28;
	g_param_zoom = 10;
	g_param_high = 2;
	g_param_look = 1;
	g_param_normal = false;
	g_param_raph = false;
	g_param_undome = false;
	g_param_request = "";

	g_yaw = 0;
	g_tblModel = [];
	rand = random_create( "xorshift32" );
	m_cntframe = 1;
	let cam = camera_create( vec3(  0.0, 1.0, 10 ), vec3( 0, 1.0,0 ), 28, 1.0,1000.0  );
	gra = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );

	html_onchange();

	var then = 0;
	let g_time = 0;
	let m_stepFrame = 1;
	let m_flgPlay = true;

	let c_mot = create_mot( "nocchi.bvh" );
	let b_mot = create_mot( "aachan.bvh" );
	let a_mot = create_mot( "kashiyuka.bvh" );

	init_testmodel();
	
	//---------------------------------------------------------------------
	function	update_paint( now )
	//---------------------------------------------------------------------
	{
		const deltaTime = ( now - then )/1000;
		then = now;

		// 描画

		cam.fovy	= g_param_fovy;
		cam.pos.z	= g_param_zoom;
		cam.pos.y	= g_param_high;
		cam.at.y	= g_param_look;

		let P = mperspective( cam.fovy, html_canvas.width/html_canvas.height, cam.near, cam.far );
		let V= mlookat( cam.pos, cam.at );

		g_yaw += radians( -0.11  );
		V = mmul( V, mrotate( g_yaw, vec3( 0,1,0 ) ) );

		// ステージ表示
		for ( let m of g_tblModel )
		{
			m.drawModel( gra, P, V, g_param_colset );
		}
		a_mot.update();
		b_mot.update();
		c_mot.update();

		a_mot.exec( gra, P, V, g_param_colset, 0.01, m_cntframe );
		b_mot.exec( gra, P, V, g_param_colset, 0.01, m_cntframe );
		c_mot.exec( gra, P, V, g_param_colset, 0.01, m_cntframe );

		gra.cls( g_param_colset.back );
		gra.draw_flat();
		gra.draw_wire();

		if ( a_mot.m_mot && b_mot.m_mot && c_mot.m_mot )
		{
			// フレーム制御
			{
				m_stepFrame = m_flgPlay?1:0;
				if ( g_param_request == "play/stop" ) 
				{
					g_param_request="";
					m_flgPlay = m_flgPlay?false:true;
				}
				if ( g_param_request == "next" ) 
				{
					g_param_request="";
					m_stepFrame = 1;
				}
				if ( g_param_request == "prev" ) 
				{
					g_param_request="";
					m_stepFrame = -1;
				}
				m_cntframe += m_stepFrame;
				if ( m_cntframe < 1 ) m_cntframe = a_mot.m_mot.MOTION.Frames-1; 
				if ( m_cntframe >= a_mot.m_mot.MOTION.Frames ) m_cntframe = 1; 
				if ( m_stepFrame )
				{
					window.document.getElementById("html_frameval").value = m_cntframe;
				}
				window.document.getElementById("html_framemax").innerHTML = a_mot.m_mot.MOTION.Frames-1;
			}


			let ft = a_mot.m_mot.MOTION.FrameTime*1000;	// bvhの指定フレームタイム
			let time = performance.now();			// 実際に掛かったフレームタイム
			let t = (time-g_time)-ft;				// 差
			let t2 = ((t>0)?ft-t:ft);				// 次のフレームタイムの指定値

			g_time = time;

			g_reqId2 = setTimeout( update_paint, t2 );
		}
		else
		{
			g_reqId1 = window.requestAnimationFrame( update_paint );
		}
	}


	
	update_paint(0);
}


//-----------------------------------------------------------------------------
function html_update()
//-----------------------------------------------------------------------------
{
	init_testmodel();
}
//-----------------------------------------------------------------------------
function html_onchange( valRequest )
//-----------------------------------------------------------------------------
{
	{
		var list = window.document.getElementsByName( "html_color" ) ;
		for ( let l of list )
		{
			if ( l.checked ) 
			{
				switch( l.value )
				{
case "White":	g_param_colset = { back:vec3( 1.0, 1.0, 1.0 )	,	flat:vec3(1.0, 1.0, 1.0 )		, wire:vec3( 0.32, 0.32, 0.32 )	 };	break;
case "Blue":	g_param_colset = { back:vec3( 0.1, 0.2, 0.4 )	,	flat:vec3( 0.1, 0.25, 0.5 )		, wire:vec3(0.5, 0.8, 1.0 )		 };	break;
case "Red"	:	g_param_colset = { back:vec3( 0.15 , 0.12 , 0.22 ),	flat:vec3( 0.12 , 0.12, 0.22 )	, wire:vec3( 1.0, 0.1, 0.06 )	 };	break;
case "Orenge":	g_param_colset = { back:vec3( 0.25 , 0.2 , 0.1 ),	flat:vec3( 0.30 , 0.2, 0.00 )	, wire:vec3( 1.0, 0.25, 0.0 )	 };	break;
case "Green":	g_param_colset = { back:vec3( 0.0, 0.18, 0.1 )	,	flat:vec3( 0.0, 0.22, 0.1 )		, wire:vec3( 0.2, 1.0, 0.0 )		 };	break;
case "Yello":	g_param_colset = { back:vec3( 0.48, 0.32, 0.08 ),	flat:vec3( 0.56, 0.38, 0.08 )	, wire:vec3( 0.9, 1.0, 0.18 )	 };	break;
case "Purple":	g_param_colset = { back:vec3( 0.56, 0.32, 0.8 )	,	flat:vec3( 0.64, 0.40, 0.8 )	, wire:vec3( 0.9, 1.0, 0.8 )		 };	break;
case "Gray":	g_param_colset = { back:vec3( 0.16, 0.16, 0.16 ),	flat:vec3( 0.20, 0.20, 0.20 )	, wire:vec3( 0.75, 0.75, 0.75)	 };	break;
case "Black":	g_param_colset = { back:vec3( 0.0, 0.0, 0.0 )	,	flat:vec3( 0.20, 0.20, 0.20 )	, wire:vec3( 1.0, 1.0, 1.0 )	 };	break;
				}
				break;
			}
		}
		{
			let c1 = g_param_colset.wire;
			let c2 = g_param_colset.flat;
			let s = 0.70;
			let r = (c1.x*s + c2.x*(1-s));
			let g = (c1.y*s + c2.y*(1-s));
			let b = (c1.z*s + c2.z*(1-s));
			g_param_colset.dark = vec3(r,g,b);
		}
	}

	if ( valRequest =="abs" )
	{
		var list = window.document.getElementsByName( "html_cam" ) ;
		for ( let l of list )
		{
			if ( l.checked ) 
			{
				switch( l.value )
				{
					case "cam1":
						g_param_fovy = 45;
						g_param_look = 0.8;	//1.3;
						g_param_high = 0.8;	//0.7;
						g_param_zoom = 4.0;	//5.0;
						break;
					case "cam2":
						g_param_fovy = 42;
						g_param_look = 2.2;	//2.2;	//1.6;	//2
						g_param_high = 0.3;	//0.3;	//0.4;	//0.3
						g_param_zoom = 6;	//6;	//5;	//6
						break;
					case "cam3":
						g_param_fovy = 55;
						g_param_look = 1;
						g_param_high = 6;
						g_param_zoom = 4;
						break;
				}
				break;
			}
		}

						window.document.getElementById( "html_fovy" ).value = g_param_fovy;
						window.document.getElementById( "html_look" ).value = g_param_look;
						window.document.getElementById( "html_high" ).value = g_param_high;
						window.document.getElementById( "html_zoom" ).value = g_param_zoom;
	}
	else
	{
						g_param_fovy = window.document.getElementById( "html_fovy" ).value*1;
						g_param_look = window.document.getElementById( "html_look" ).value*1;
						g_param_high = window.document.getElementById( "html_high" ).value*1;
						g_param_zoom = window.document.getElementById( "html_zoom" ).value*1;
	}


	g_param_normal	= window.document.getElementsByName( "html_normal" )[0].checked ;
	g_param_raph	= window.document.getElementsByName( "html_raph" )[0].checked ;
	m_cntframe = window.document.getElementById("html_frameval").value*1;

	if( valRequest == "最大解像度" )
	{
		html_canvas.width = window.screen.width/2;
		html_canvas.height = window.screen.height/2;
		main();
	}
	else
	if( valRequest == "fullscreen" )
	{
		if( 	window.document.fullscreenEnabled
			||	document.documentElement.webkitRequestFullScreen ) // iOS対応
		{
			original_width = html_canvas.width;
			original_height = html_canvas.height;
			html_canvas.width = window.screen.width;
			html_canvas.height = window.screen.height;

			if ( window.orientation ) // iOS用、縦横検出
			{
				if( window.orientation == 90 || window.orientation == -90 )
				{
					html_canvas.width = window.screen.height;
					html_canvas.height = window.screen.width;
				}
			}
			gra = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );	// 画面再設定
			{
				let obj =	html_canvas.requestFullscreen 
						||	html_canvas.webkitRequestFullScreen;

				obj.call( html_canvas );
			}

			function callback()
			{
				if (	window.document.fullscreenElement
					||	window.document.webkitFullscreenElement )
				{
					// フルスクリーンへ突入時
//					window.document.getElementById("html_debug1").innerHTML = window.orientation;
//					window.document.getElementById("html_debug2").innerHTML = window.screen.width+","+window.screen.height;
				}
				else
				{
					// フルスクリーンから戻り時
					html_canvas.width = original_width;
					html_canvas.height = original_height;
					gra = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );	// 画面再設定
				}
			}
			window.document.addEventListener("fullscreenchange", callback, false);
			window.document.addEventListener("webkitfullscreenchange", callback, false);
		}
		else
		{
			alert("フルスクリーンに対応していません");
		}
	}
	else
	{
		g_param_request = valRequest;

	}
}

main();
