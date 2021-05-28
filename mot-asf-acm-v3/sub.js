

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
//		m_tblColor_wire.push( 1,0.5,0 );
//		m_tblColor_wire.push( 0,0.5,1 );

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
		}
	}

	return body
};


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
function testmodel_create() 
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

	let teststage={};

	let m_tblModel = [];
	{
		let scale = 0.5;
		let w = 20;
		let h = 20;
		let r2 = 4;
		let y2 = 1;
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimModel( w,1,h, "floor1", scale );
			let m = model_craete( vec3( 0, 0.0, 0.0 ), tblIndex_wire,tblIndex_flat, tblVertex, color, drawtype );
			m_tblModel.push( m );
		}		
		if(0)
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimRandom( w,6,h, "prim1", scale, 60 );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			m_tblModel.push( m );
		}
		if(0)
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimPile( r2,y2+1,r2, "prim1", scale );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			m_tblModel.push( m );
		}
		if(0)
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimSquare( r2,y2,r2, "prim1", scale );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			m_tblModel.push( m );
		}
		if(1)
		{
			r2=w-2;
			y2=8;	//6=3m相当
			{
				let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimPile( r2,y2,r2, "prim1", scale );
				let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
				m_tblModel.push( m );
			}
			{
				let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimSquare( r2,y2,r2, "prim1", scale );
				let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
				m_tblModel.push( m );
			}
		}
	}
	
	teststage.draw = function( gra, P, V, colset )
	{
		for ( let m of m_tblModel )
		{
			m.drawModel( gra, P, V, g_param_colset );
		}
	}
	return teststage;

}


//------------------------------------------------------------------------------
function bvh_create( filename )
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
	mot.update = function()
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
			function drawbone( v3, p3, s, col )
			{
				let v = vec4( v3.x*s, v3.y*s, v3.z*s , 1 );
				let p = vec4( p3.x*s, p3.y*s, p3.z*s , 1 );
				v = vec4_vmul_Mv( V ,v );
				v = wideperse( P, v );
				p = vec4_vmul_Mv( V ,p );
				p = wideperse( P, p );
				gra.set_wire( v, p, col );

				function raph_line3d( v3, p3, col )	// ラフ線風描画
				{
					let sc = 0.02;
					let a;
					let b;
					for ( let i = 0 ; i < 8 ; i++ )
					{
						a = vec4( 
							v3.x*s + (-0.5)*sc, 
							v3.y*s + (-0.5)*sc, 
							v3.z*s + (-0.5)*sc , 
							1 
						);
						b = vec4( 
							p3.x*s + (-0.5)*sc, 
							p3.y*s + (-0.5)*sc, 
							p3.z*s + (-0.5)*sc , 
							1 
						);
						a = wideperse( P, vec4_vmul_Mv( V ,a ) );
						b = wideperse( P, vec4_vmul_Mv( V ,b ) );
	//					gra.set_wire( a, b, colvec3(1,0,0));//colset.wire );
						gra.set_wire( a, b, col );
						
					}
				}
	//			raph_line3d(v3,p3, colset.wire)
			}
					function drawboneX( v3, p3, s )
			{
				let v = vec4( v3.x*s, v3.y*s, v3.z*s , 1 );
				let p = vec4( p3.x*s, p3.y*s, p3.z*s , 1 );
				v = vec4_vmul_Mv( V ,v );
				v = wideperse( P, v );
				p = vec4_vmul_Mv( V ,p );
				p = wideperse( P, p );
				gra.set_wire( v, p, colset.wire );


/*				function raph_line3d( v3, p3, color )	// ラフ線風描画
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
*/
//				if ( g_param_raph ) raph_line3d( v3, p3, colset.wire );

			}

			function bvh_play_sub( M, obj, data )
			{
				// 描画
				if( obj.OFFSET.x!=0 || obj.OFFSET.y!=0 || obj.OFFSET.z!=0 )
				{
					let p = vmul_Mv( M, vec3(0,0,0) );
					let v = vmul_Mv( M, obj.OFFSET );
					drawbone( p, v, scale, colset.wire );
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

//-----------------------------------------------------------------------------
function tst_create()
//-----------------------------------------------------------------------------
{
	let tst = {}

	document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false}); // 指ドラッグスクロールの抑制

	let m_fullscreen_original_width;
	let m_fullscreen_original_height;

	//-----------------------------------------------------------------------------
	tst.fullscreeen_change = function( cv,cb )
	//-----------------------------------------------------------------------------
	{
		if( 	window.document.fullscreenEnabled
			||	document.documentElement.webkitRequestFullScreen ) // iOS対応
		{
			m_fullscreen_original_width = cv.width;
			m_fullscreen_original_height = cv.height;
			cv.width = window.screen.width;
			cv.height = window.screen.height;

			if ( window.orientation ) // iOS用、縦横検出
			{
				if( window.orientation == 90 || window.orientation == -90 )
				{
					cv.width = window.screen.height;
					cv.height = window.screen.width;
				}
			}
		//	gra = create_gra_webgl( cv.getContext( "webgl", { antialias: true } ) );	// 画面再設定
			{
				let obj =	cv.requestFullscreen 
						||	cv.webkitRequestFullScreen;

				obj.call( cv );
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
					cv.width = m_fullscreen_original_width;
					cv.height = m_fullscreen_original_height;
//					gra = create_gra_webgl( cv.getContext( "webgl", { antialias: true } ) );	// 画面再設定
				}
				cb(); // 画面モード再設定
			}
			window.document.addEventListener("fullscreenchange", callback, false);
			window.document.addEventListener("webkitfullscreenchange", callback, false);
		}
		else
		{
			alert("フルスクリーンに対応していません");
		}
	}
	return tst;
}

//-----------------------------------------------------------------------------
function	script_create( strProg )//  2021/05/21
//-----------------------------------------------------------------------------
{
	let script={};
	let m_adr = 0;

	let cntLine = 0;
	let str2  = strProg.replace(/\r\n|\r/g, "\n");
	let lines = str2.split( '\n' );
	script.text = str2;


	//-----------------------------------------------------------------------------
	script.isActive = function()
	//-----------------------------------------------------------------------------
	{
		return ( m_adr < script.text.length );
	}

	//-----------------------------------------------------------------------------
	script.getLineScript = function()
	//-----------------------------------------------------------------------------
	{
		if ( cntLine >= lines.length ) return null;
		let line = lines[cntLine++];
		if ( line == null ) return null;
		return script_create( line );
		
	}
	//-----------------------------------------------------------------------------
	script.getToken = function()
	//-----------------------------------------------------------------------------
	{

		let word = "";
		let type1 = "tNON";

		while( m_adr < script.text.length )
		{
			let c = script.text[ m_adr++ ];
			
			function get_type( c )
			{
				let	atr = "tNON"; 
			

				let cd = c.charCodeAt();
				
				     if ( cd <=  8  )	atr = "tNON";	// (TT)
				else if ( cd ==  9  )	atr = "t_sp";	// tab
				else if ( cd <= 31  )	atr = "tNON";	// (TT)
				else if ( c  == " " )	atr = "t_sp";	// (space)
				else if ( c  == "!" )	atr = "C:";	// !
				else if ( c  == '"' )	atr = "tSTR";	// '"'
				else if ( c  == "." )	atr = "N:";	// '.'
				else if ( c  == "#" )	atr = "tOne";	// 
				else if ( c  == "$" )	atr = "tOne";	// 
				else if ( c  == "%" )	atr = "tOne";	// 
				else if ( c  == "&" )	atr = "C:";	// 
				else if ( c  == "'" )	atr = "tOne";	// 
				else if ( c  == "(" )	atr = "tOne";	// 
				else if ( c  == ")" )	atr = "tOne";	// 
				else if ( c  == "*" )	atr = "C:";	// 
				else if ( c  == "+" )	atr = "C:";	// 
				else if ( c  == "," )	atr = "tOne";	// 
				else if ( c  == "-" )	atr = "tMin";	// 
				else if ( c  == "/" )	atr = "C:";	// 
				else if ( cd <= 57  )	atr = "N:";	// 0123456789
				else if ( c  == ":" ) 	atr = "tOne";
				else if ( c  == ";" ) 	atr = "tOne";
				else if ( c  == "<" ) 	atr = "C:";
				else if ( c  == "=" ) 	atr = "C:";
				else if ( c  == ">" ) 	atr = "C:";
				else if ( c  == "?" ) 	atr = "tOne";
				else if ( c  == "@" ) 	atr = "tOne";
				else if ( cd <= 90  )	atr = "W:";	// ABCDEFGHIJKLMNOPQRSTUVWXYZ
				else if ( c  == "[" ) 	atr = "tOne";
				else if ( c  == "\\") 	atr = "C:";
				else if ( c  == "]" ) 	atr = "tOne";
				else if ( c  == "^" ) 	atr = "C:";
				else if ( c  == "_" ) 	atr = "W:";
				else if ( c  == "`" ) 	atr = "tOne";
				else if ( cd <=122  )	atr = "W:";	// abcdefghijklmnopqrstuvwxyz
				else if ( c  == "{" ) 	atr = "tOne:";
				else if ( c  == "|" ) 	atr = "C:";
				else if ( c  == "}" ) 	atr = "tOne:";
				else 					atr = "W:";	// あいう...unicode
			 		//if ( c=="{" || c=="[" || c=="(" || c=="}" || c=="]" || c==")" || c=="," || c==";" )	// 一文字のみの集合構文

				return atr;
			};
			// <string> 	"123"
			// <word> 		ABC	 _123  .ABC
			// <numeric>	123  1.23  .123  -123  0x123 
			// <calculator>	+ - / * ^ & | ( ) ,

			if ( type1 == "W:" )	//単語
			{
				let type2 = get_type(c);

				if ( type2 == "W:" || type2 == "N:" )
				{
					// トークン継続
					word += c;
				}
				else
				{
					// トークン完成
					m_adr--;
					break;
				}
			}
			else
			if ( type1 == "C:" )	//演算子
			{
				let type2 = get_type(c);

			     if ( type2 != "C:" )
			     {
					// トークン完成
					m_adr--;
					break;
			     }
			     else
			     {
					word += c;
			     }
			}
			else						//
			if ( type1 == "tSTR" )	//文字列
			{
			     if ( c == '"' )
			     {
					// トークン完成
					break;
			     }
			     else
			     {
					word += c;
			     }
			}
			else						//
			if ( word.length == 0 ) 		// 最初の一文字目
			{
				type1 = get_type(c);
				if ( type1 == "tSTR" ) continue;
				else 
				if ( type1 == "tNON" ) continue;
				else 
				if ( type1 == "t_sp" ) continue;
				else 
				if ( type1 == "tOne" ) 
				{
					word = c;
			 		//if ( c=="{" || c=="[" || c=="(" || c=="}" || c=="]" || c==")" || c=="," || c==";" )	// 一文字のみの集合構文
					break;
				}

				word = c;

//				if ( c=="{" || c=="[" || c=="(" || c=="}" || c=="]" || c==")" || c=="," || c==";" )	// 一文字のみの集合構文
//				{
//					break;
//				}
				continue;
			}
			else							// ２文字目以降
			{
				let type2 = get_type(c);

				let bAbandon = false;	// c 放棄フラグ
				let bComp = false;		// トークン完成フラグ

				if(0){}
				else if ( type1 == "Ne:" && c == "-"  )
				{
					// 指数表示対応：例）-2.03217e-16
					type1 = "N:"
				}
				else if ( type1 == "N:" && c == "e"  )
				{
					// 指数表示対応：例）-2.03217e-16
					type1 = "Ne:"
				}
				else if ( type1 == "tMin" && type2 == "N:" )
				{
					type1 = type2;
				}
				else if ( type2 == "tSTR" || type2 == "C:" )
				{
					// トークン完成
					m_adr--;
					break;
				}	
				else if ( type2 == "tNON" )		{bComp = true;bAbandon = true;}
				else if ( type2 == "t_sp" )		{bComp = true;bAbandon = true;}
				else if ( type2 != type1 )			bComp = true;

				if ( bComp  )
				{
					// トークン完成

					if ( bAbandon ) 
					{
						// 放棄
					}
					else
					{
						m_adr--;
					}
					break;
				}
				else
				{
					// トークン継続
					word += c;
				}
			}
		}
		//	console.log((++g_cntToken)+":script ["+word+"]",type1);
		if ( word=="" ) return null;
		return {atr:type1,val:word};
	}
	return script;
}
//------------------------------------------------------------------------------
function asfamc_create( asf_filename, amc_filename )
//------------------------------------------------------------------------------
{
	let asf={};
	let m_step = 0;
	let amc_text_in="(none)";
	let asf_text_in="(none)";
	let amc_loaded = false;
	let asf_loaded = false;
	let amc_hash = null;
	let asf_hash = null;
	asf.m_mot = null;
	asf.amt_frame=0;

	//------------------------------------------------------------------------------
	function amc_load( amc_filename )
	//------------------------------------------------------------------------------
	{
		let xhr = new XMLHttpRequest();
		xhr.open('GET', amc_filename); 
		xhr.onload = () => 
		{
			amc_text_in = xhr.response;
			amc_loaded = true;
		}
		xhr.send( null );
	}
	//------------------------------------------------------------------------------
	function asf_load( asf_filename )
	//------------------------------------------------------------------------------
	{
		let xhr = new XMLHttpRequest();
		xhr.open('GET', asf_filename); 
		xhr.onload = () => 
		{
			asf_text_in = xhr.response;
			asf_loaded = true;
		}
		xhr.send( null );
	}

	//------------------------------------------------------------------------------
	asf.update = function()
	//------------------------------------------------------------------------------
	{
		switch( m_step )
		{
		case 0:
			amc_load( amc_filename );	
			asf_load( asf_filename );	
			m_step++;
			break;

		case 1:
			if ( asf_loaded && asf_hash == null ) m_step = 2;
			if ( amc_loaded && amc_hash == null ) m_step = 3;
			if ( asf_hash && amc_hash ) m_step = 4;
			break;
		


		case 2: //asf
			{
				//----------------------------------------
				function asf_persJoint( text )
				//----------------------------------------
				{
					let script = script_create( text );
					let hash = {};	// for block
					let sub = {};	// for begin~end

					let line;
					let str;
					let scr;
					let tkn;
					let framenum=0;
					let block="";	//	units/root/bonedata... block

					WhileA:while( scr = script.getLineScript() )
					{
						function getwords( scr )
						{
							let words = [];
							while( tkn = scr.getToken() )
							{
								words.push( tkn.val );
							}
							return words;
						}	
					
//						console.log( ">>",scr.text);

						if ( scr.text[0] == "#" ) continue;	// コメント

						if ( scr.text[0] == ":" ) 
						{
							let words = getwords( scr );
							switch( words[1] )
							{
								case "version":
								case "name":
									hash[ words[1] ] = words[2] ; 
									break;

								case "units":
								case "root":
								case "bonedata":
									block = words[1];
									hash[ block ] = {};
									break;

								case "documentation":
								case "hierarchy":
									block = words[1];
									hash[ block ] = [];
									break;

								default:
									alert(".asf file error, Invalid word used "+ words[1] );
									return null;
							}
						}
						else
						if( block != "" )
						{
							switch( block )
							{
								case "units":
									{
										let words = getwords( scr );
										hash[ block ][ words[0] ] = words[1]; 
									}
									break;

								case "documentation":
									{
										hash[ block ].push( scr.text );
									}
									break;

								case "root":
									{
										let words = getwords( scr );
										switch( words[0] )
										{
											case "order":
											case "axis":
											case "position":
											case "orientation":
												hash[ block ][ words[0] ] = [];
												for ( let i = 1 ; i < words.length ; i++ )
												{
													hash[ block ][ words[0] ].push( words[i] );
												}
												break;

											default:
												alert( ".asf error unknown:", words[0] );
										}
									}
									break;
							
								case "bonedata":
									{
										let words = getwords( scr );
										switch( words[0] )
										{
											case "begin":	sub ={}; break;
											case "end":		hash[ block ][sub.name]=sub; break;

											case "id":
											case "name":
											case "length":	
											case "axis":	
											case "dof":	
												sub[ words[0] ] = [];
												for ( let i = 1 ; i < words.length ; i++ )
												{
													sub[ words[0] ].push( words[i] );
												}
												break;

											case "direction":
												sub[ words[0] ] = [];
												for ( let i = 1 ; i < words.length ; i++ )
												{
													sub[ words[0] ].push( words[i]*1 );
												}
												break;

											case "limits":	
												sub[ words[0] ] = [];
												sub[ words[0] ].push( words[2], words[3] );
												break;
		
											case "(":	
												sub[ "limits" ].push( words[1], words[2] );
												break;

											case ")":	
												break;

											default:
												alert( ".asf error unknown:", words[0] );
											
										}
									}
									break;

								case "hierarchy":
									{
										if ( scr.text.trim() == "begin" ) {sub={};continue;}
										if ( scr.text.trim() == "end" ) {hash[ block ] = sub;block="";continue;}
										{
											let words = getwords( scr );

											function foo( hie, word )
											{
												if ( hie[ word ] != undefined )
												{
													return hie;
												}

												for ( let h of Object.values( hie ) )
												{
													let ret = foo( h, word );
													if ( ret != null ) return ret;
												}
												return null;
											}
											let tar = foo( sub, words[0] );
											if ( tar )
											{
												for ( let i = 1 ; i < words.length ; i++ )
												{
													tar[ words[0] ][ words[i] ] = {};
												}
											}
											else
											{
												sub[ words[0] ] = {};
												for ( let i = 1 ; i < words.length ; i++ )
												{
													sub[ words[0] ][ words[i] ] = {};
												}
											}

										}
									}
									break;

								default:
									alert(".asf file error" );
									return null;
							}
						
						}

					}
					return hash;
				}

				{//pers
					asf_hash = asf_persJoint( asf_text_in );

					if ( asf_hash == null ) 
					{
						alert( "asf file error" );
						return null;
					}
				}
				//--
				//console.log(asf.m_mot,asf.m_mot.MOTION.Frames );
				m_step = 1;

			}
			break;

		case 3:	//amc
			{
				//----------------------------------------
				function amc_persJoint( text )
				//----------------------------------------
				{
					let script = script_create( text );
					let hash = {}

					let line;
					let str;
					let scr;
					let tkn;
					let framenum=0;
					WhileA:while( scr = script.getLineScript() )
					{
						if ( scr.text[0] == "#" ) continue;
						if ( scr.text[0] == ":" ) { hash[ scr.text.substring(1) ] = true; continue;}

						let element="";	//	パースモード
						WhileB:while( tkn = scr.getToken() )
						{
							if ( element=="" )
							{
								switch( tkn.atr )
								{
									case "N:":
										framenum = tkn.val;	// 最初の一ワード目が数字だったらフレーム番号
										asf.amt_frame = tkn.val*1;

										if ( hash[ "JOINT" ] == undefined ) hash[ "JOINT" ]={}
										break WhileB;

									case "W:":
										element = tkn.val;
										if ( hash[ "JOINT" ][ element ] == undefined ) hash[ "JOINT" ][ element ]=[];
										hash[ "JOINT" ][ element ][ 0 ] = [0,0,0,0,0,0]; // 0フレーム
										hash[ "JOINT" ][ element ][ framenum ] = [];
										break;

									default:
										alert("Invalid acm data:"+tkn.val );
										break WhileA;
								}
							}
							else
							{
//console.log(element,framenum,tkn.val);
								hash[ "JOINT" ][ element ][ framenum ].push(tkn.val);
							}
						}
					}

					return hash;
				}

				{//pers
					amc_hash = amc_persJoint( amc_text_in );

					if ( amc_hash  == null ) 
					{
						alert( "amc file error" );
						return null;
					}
				}
				m_step = 1;
			}
			break;
			
		case 4:	// last
			asf.m_mot={};
			asf.m_mot.asf = asf_hash;
			asf.m_mot.amc = amc_hash;
//console.log(asf.m_mot);
			m_step++;

		case 5:	
			break;

		}
	}
	//------------------------------------------------------------------------------
	asf.exec = function( gra, P, V, colset, scale, numframe )
	//------------------------------------------------------------------------------
	{
		function drawbone( v3, p3, s, col )
		{
			let v = vec4( v3.x*s, v3.y*s, v3.z*s , 1 );
			let p = vec4( p3.x*s, p3.y*s, p3.z*s , 1 );
			v = vec4_vmul_Mv( V ,v );
			v = wideperse( P, v );
			p = vec4_vmul_Mv( V ,p );
			p = wideperse( P, p );
			gra.set_wire( v, p, col );

			function raph_line3d( v3, p3, col )	// ラフ線風描画
			{
				let sc = 0.02;
				let a;
				let b;
				for ( let i = 0 ; i < 8 ; i++ )
				{
					a = vec4( 
						v3.x*s + (-0.5)*sc, 
						v3.y*s + (-0.5)*sc, 
						v3.z*s + (-0.5)*sc , 
						1 
					);
					b = vec4( 
						p3.x*s + (-0.5)*sc, 
						p3.y*s + (-0.5)*sc, 
						p3.z*s + (-0.5)*sc , 
						1 
					);
					a = wideperse( P, vec4_vmul_Mv( V ,a ) );
					b = wideperse( P, vec4_vmul_Mv( V ,b ) );
//					gra.set_wire( a, b, colvec3(1,0,0));//colset.wire );
					gra.set_wire( a, b, col );
					
				}
			}
//			raph_line3d(v3,p3, colset.wire)
		}

		//----------------------------------------
		function asf_play( asf )
		//----------------------------------------
		{


			//-------------------------
			function asf_subB( P, bones )
			//-------------------------
			{
				for ( let bone of Object.keys( bones ) )
				{
					let b = asf.asf.bonedata[bone];
					let ofs = vec3(
						b.direction[0]*b.length,
						b.direction[1]*b.length,
						b.direction[2]*b.length)



					let B = mtrans( ofs );	//オフセット

					let C = midentity();	// 
					{
						C = mmul( mrotx( radians( b.axis[0]*1 ) ), C  );	//XYZ 回転軸	の逆順
						C = mmul( mroty( radians( b.axis[1]*1 ) ), C  );
						C = mmul( mrotz( radians( b.axis[2]*1 ) ), C  );
					}

					let M = midentity();	// モーション
					{
						let jnt = asf.amc.JOINT[bone];
						if ( jnt )
						{
							for ( let i=0 ; i < b.dof.length ; i++ )
							{
								let r = radians( jnt[numframe][i]*1 );
								switch( b.dof[i] )
								{
									case "rx": M = mmul( mrotx( r ), M );break;
									case "ry": M = mmul( mroty( r ), M );break; 
									case "rz": M = mmul( mrotz( r ), M );break;
									default:alert("error .asf / dof :",b.dof[i] ); return null;
								}
							}
		
						}
					}
					let L=midentity();
//					let N=midentity();

if(0)
{
					// L = Cinv * M * C * B	の逆順
					M = mmul( M, minvers(C) );
					M = mmul( C, M );
					L = mmul( M, B );
					L = mmul( P, L ); 
}
else
{
					// L = Cinv * M * C * B	の逆順	t
					L = mmul( B, L );
					L = mmul( minvers(C), L );
					L = mmul( M, L );
					L = mmul( C, L );
					L = mmul( P, L ); 
}
					{
						let p = vmul_Mv( P , vec3(0,0,0) );
						let v = vmul_Mv( L , vec3(0,0,0) );	//vM の逆順
						drawbone( p, v, scale, colset.wire);
					}

					asf_subB( L, bones[bone] );
				}
			}
			{
				let R = midentity();
				let T = midentity();
				let jnt = asf.amc.JOINT["root"];
				for ( let i = 0 ; i < asf.asf.root.order.length ; i++ )
				{
					let val = jnt[ numframe ][i]*1;
	//if(first) console.log(val, asf.asf.root.order[i] );

					switch( asf.asf.root.order[i] )
					{
						case "TX":	T = mmul( mtrans( vec3( val,0,0 ) ),T );break;
						case "TY":	T = mmul( mtrans( vec3( 0,val,0 ) ),T );break;
						case "TZ":	T = mmul( mtrans( vec3( 0,0,val ) ),T );break;
						case "RX":	R = mmul( mrotx( radians( val ) )  ,R );break;
						case "RY":	R = mmul( mroty( radians( val ) )  ,R );break;
						case "RZ":	R = mmul( mrotz( radians( val ) )  ,R );break;
						default:alert("error .asf / root / order :", asf.asf.root.order[i] ); return null;
					}

				}
				scale = scale * asf.asf.units.length;
				asf_subB( mmul( T, R ), asf.asf.hierarchy["root"],vec3(0,0,0) );
			}
		}

		asf_play( asf.m_mot );
	}	
	return asf;
}
