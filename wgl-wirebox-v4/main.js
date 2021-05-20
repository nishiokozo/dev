"use strict";

///// canvas

let flg1 = 1;
let flg2 = 1;
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


//-----------------------------------------------------------------------------
function gra_create_webgl( gl )
//-----------------------------------------------------------------------------
{
	let body = {}
	let	m_shader = {};
	let	m_hdlIndexbuf;
	let	m_hdlVertexbuf;
	let	m_hdlColorbuf;
	
	let m_tblIndex = [];
	let m_tblVertex = [];
	let m_tblColor = [];

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
	function reloadBuffer()
	//-----------------------------------------------------------------------------
	{
		// 頂点バッファ
		// gl.createBuffer() ⇔  gl.deleteBuffer( buffer );

		// シェーダ削除
		// shader = gl.createShader( type )⇔  gl.deleteShader( shader );

		// プログラム削除
		// program = gl.createProgram()	⇔  gl.deleteProgram( program );

		m_hdlIndexbuf = gl.deleteBuffer( m_hdlIndexbuf );
		m_hdlVertexbuf = gl.deleteBuffer( m_hdlVertexbuf );
		m_hdlColorbuf = gl.deleteBuffer( m_hdlColorbuf );

		m_hdlIndexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, m_hdlIndexbuf );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( m_tblIndex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
	    }
	    
		m_hdlVertexbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblVertex ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
		
		m_hdlColorbuf = gl.createBuffer();
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( m_tblColor ), gl.STATIC_DRAW );
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		m_tblVertex = [];	// VRAMに転送するので保存しなくてよい
		m_tblColor = [];	// VRAMに転送するので保存しなくてよい

	}
	
	// public

	//-----------------------------------------------------------------------------
	body.drawList_index = function( type )
	//-----------------------------------------------------------------------------
	{
		// 頂点データの再ロード
		reloadBuffer();	
		gl.useProgram( m_shader.prog );
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.vertexAttribPointer( m_shader.pos, 4, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.vertexAttribPointer( m_shader.col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, m_hdlIndexbuf );
			gl.drawElements( type, m_tblIndex.length, gl.UNSIGNED_SHORT, 0 );
	    	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
		}
		gl.flush();
		m_tblIndex = [];
	}

	//-----------------------------------------------------------------------------
	body.drawList_array = function( type, count )
	//-----------------------------------------------------------------------------
	{
		// 頂点データの再ロード
		reloadBuffer();	
		gl.useProgram( m_shader.prog );
		{
			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlVertexbuf );
			gl.vertexAttribPointer( m_shader.pos, 4, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, m_hdlColorbuf );
			gl.vertexAttribPointer( m_shader.col, 3, gl.FLOAT, false, 0, 0 ) ;
	    	gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.drawArrays( type, 0, count );
		}
		gl.flush();
	}

	//-----------------------------------------------------------------------------
	body.trianglev4_index = function( a,b,c, col )
	//-----------------------------------------------------------------------------
	{
		let o = m_tblVertex.length/4;
		m_tblVertex.push( a.x, a.y, a.z, a.w );
		m_tblVertex.push( b.x, b.y, b.z, b.w );
		m_tblVertex.push( c.x, c.y, c.z, c.w );

		m_tblColor.push( col.x,col.y,col.z);
		m_tblColor.push( col.x,col.y,col.z);
		m_tblColor.push( col.x,col.y,col.z);

		m_tblIndex.push( o+0, o+1, o+2 );
	}
	//-----------------------------------------------------------------------------
	body.linev4_index = function( s, e, col )
	//-----------------------------------------------------------------------------
	{
		let o = m_tblVertex.length/4;
		m_tblVertex.push( s.x, s.y, s.z, s.w );
		m_tblVertex.push( e.x, e.y, e.z, e.w );

		m_tblColor.push( col.x, col.y, col.z );
		m_tblColor.push( col.x, col.y, col.z );

		m_tblIndex.push( o+0, o+1 );
	}
	//-----------------------------------------------------------------------------
	body.trianglev4_array = function( a,b,c, col )
	//-----------------------------------------------------------------------------
	{
		m_tblVertex.push( a.x, a.y, a.z, a.w );
		m_tblVertex.push( b.x, b.y, b.z, b.w );
		m_tblVertex.push( c.x, c.y, c.z, c.w );

		m_tblColor.push( col.x, col.y, col.z );
		m_tblColor.push( col.x, col.y, col.z );
		m_tblColor.push( col.x, col.y, col.z );
	}
	//-----------------------------------------------------------------------------
	body.linev4_array = function( s, e, col )
	//-----------------------------------------------------------------------------
	{
		m_tblVertex.push( s.x, s.y, s.z, s.w );
		m_tblVertex.push( e.x, e.y, e.z, e.w );

		m_tblColor.push( col.x, col.y, col.z );
		m_tblColor.push( col.x, col.y, col.z );
	}
	//-----------------------------------------------------------------------------
	body.linev4_red = function( s, e )
	//-----------------------------------------------------------------------------
	{
		let o = m_tblVertex.length/4;
		m_tblVertex.push( s.x, s.y, s.z, s.w );
		m_tblVertex.push( e.x, e.y, e.z, e.w );

		m_tblColor.push( 1.0, 0.0, 0.0 );
		m_tblColor.push( 1.0, 0.0, 0.0 );

		m_tblIndex.push( o+0, o+1 );
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
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );// gl.LESS;
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clearDepth( 1.0 );	
	gl.viewport( 0.0, 0.0, gl.canvas.width, gl.canvas.height );
	gl.enable( gl.CULL_FACE );	// デフォルトでは反時計回りが表示

	// シェーダーコンパイル

	// シェーダー構成
	{

		let src_vs = 
			 "attribute vec4 pos;"
			+"attribute vec3 col;"
		//	+"uniform mat4 V;"
		//	+"uniform mat4 M;"
		//	+"uniform mat4 P;"
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
		let vs	= compile( gl.VERTEX_SHADER, src_vs );
		let fs	= compile( gl.FRAGMENT_SHADER, src_fs );

		m_shader.prog	= gl.createProgram();			//WebGLProgram オブジェクトを作成
		gl.attachShader( m_shader.prog, vs );			//シェーダーを WebGLProgram にアタッチ
		gl.deleteShader( vs );
		gl.attachShader( m_shader.prog, fs );			//シェーダーを WebGLProgram にアタッチ
		gl.deleteShader( fs );
		gl.linkProgram( m_shader.prog );				//WebGLProgram に接続されたシェーダーをリンク
//		m_shader.P		= gl.getUniformLocation( m_shader.prog, "P" );
//		m_shader.V		= gl.getUniformLocation( m_shader.prog, "V" );
//		m_shader.M		= gl.getUniformLocation( m_shader.prog, "M" );
		m_shader.pos		= gl.getAttribLocation( m_shader.prog, "pos" );
		m_shader.col		= gl.getAttribLocation( m_shader.prog, "col" );
		gl.enableVertexAttribArray( m_shader.pos );
		gl.enableVertexAttribArray( m_shader.col );
	}
	
	reloadBuffer();

	return body;
}

///// Model

//-----------------------------------------------------------------------------
function model_craete( vecOfs, index_wire, index_flat, vertexes, color, drawtype )
//-----------------------------------------------------------------------------
{
	let body=[];
	body.drawtype = drawtype;
	body.vertexes = vertexes;
	body.index_wire = index_wire;
	body.index_flat = index_flat;
	body.color	= color;
	body.M = mtrans( vecOfs );

	//-----------------------------------------------------------------------------
	body.drawModel = function( P, V, color )
	//-----------------------------------------------------------------------------
	{

		// 座標計算
		let tmp = []; 
		{
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

				{

					if( g_param_normal )
					{
						// 距離で割る
						v = vec4_vmul_Mv( P ,v );
					}
					else
					if( g_param_undome )
					{
						let n= 1.0;
						// 距離で割る
						let dis = length( v );

						let d2=dis-(n*dis)/v.z;	// フラットな投影面からの距離
						dis=d2-n;
						v = vec4_vmul_Mv( P ,v );
						v.z*=dis/v.w;
						v.w=dis;
					}
					else
					if(1)
					{
						// 距離で割る
						let dis = length( v );
						v = vec4_vmul_Mv( P ,v );
						v.z*=dis/v.w;
						v.w=dis;
					}
					else
					{
						let dis = length( v );
						let aspect = gl.canvas.width/gl.canvas.height;
						let n= 1.0;
						let f= 100.0;
					    let y = n * Math.tan(g_cam.fovy * Math.PI / 360.0);
					    let x = y * aspect;
						let l=-x;
						let r= x;
						let t= y;
						let b=-y;

						P= mat4(
							2*n/(r-l)	,	0			,	0				,	0	,
								0		,	2*n/(t-b)	,	0				,	0	,
							(r+l)/(r-l)	,	(t+b)/(t-b)	,	-(f+n)/(f-n)	,	-1	,
								0		,	0			,	-(2*f*n)/(f-n)	,	0	);
						P= mat4(
								n/x		,	0		,	0				,	0	,
								0		,	n/y		,	0				,	0	,
								0		,	0		,	-(f+n)/(f-n)	,	-1	,
								0		,	0		,	-(2*f*n)/(f-n)	,	0	);

						v = vec4_vmul_Mv( P ,v );

						v.z*=dis/v.w;
						v.w=dis;
					}
				}
				tmp.push( v );
			}
		}
		

		// 描画
		{
			if(1)
			{
				{
					for ( let i = 0 ; i < body.index_flat.length/3 ; i++ )
					{
						let v1 = tmp[body.index_flat[i*3+0]];
						let v2 = tmp[body.index_flat[i*3+1]];
						let v3 = tmp[body.index_flat[i*3+2]];
						gra.trianglev4_array( v1, v2, v3, color[1] );
					}
					gra.drawList_array( gl.TRIANGLES, body.index_flat.length );
				}

				{
					for ( let i = 0 ; i < body.index_wire.length/2 ; i++ )
					{
						let v = tmp[body.index_wire[i*2+0]];
						let p = tmp[body.index_wire[i*2+1]];					
						gra.linev4_array( v, p, color[2] );
					}
					gra.drawList_array( gl.LINES, body.index_wire.length );
				}
			}
/*			else
			{
				for ( let i = 0 ; i < body.index_flat.length/3 ; i++ )
				{
					let v1 = tmp[body.index_flat[i*3+0]];
					let v2 = tmp[body.index_flat[i*3+1]];
					let v3 = tmp[body.index_flat[i*3+2]];
					gra.trianglev4_index( v1, v2, v3, color[1] );
				}
				gra.drawList_index( gl.TRIANGLES );

				for ( let i = 0 ; i < body.index_wire.length/2 ; i++ )
				{
					let v = tmp[body.index_wire[i*2+0]];
					let p = tmp[body.index_wire[i*2+1]];					
					gra.linev4_index( v, p, color[2] );
				}
				gra.drawList_index( gl.LINES );
			}
*/
	
		}

	}

	return body
};

///// main

//-----------------------------------------------------------------------------
function init_model()
//-----------------------------------------------------------------------------
{
	function qubic_create( type )
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
		switch( type )
		{
			case "prim1"	:[vert_cmn,index_wire,index_flat] = prim1( 0.995 );break;
			case "floor1"	:[vert_cmn,index_wire,index_flat] = floor1( 1.00 );break;
			default: alert("error " + type );
		}

		body.tblVertex = [];
		body.tblIndex_wire = [];
		body.tblIndex_flat = [];

		body.addcube = function ( x, y, z )
		{
			let ofs = body.tblVertex.length/3;
			for ( let v of vert_cmn )
			{
				body.tblVertex.push( v[0] +x );
				body.tblVertex.push( v[1] +y );
				body.tblVertex.push( v[2] +z );
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
	function makeWireGrid( size_u, size_v )
	//-----------------------------------------------------------------------------
	{
		let st = 1.0;

		let tblVertex = [];
		let tblIndex = [];

		let max_u = Math.floor( size_u / 2 );
		let max_v = Math.floor( size_v / 2 );

		let au = (size_u-max_u*2)==0?0:1;
		let av = (size_v-max_v*2)==0?0:1;

		{// grid floor
		
			{
				let ofs = tblVertex.length/3;
				for ( let v = -max_v ; v <= max_v+av ; v++ )
				{
					let x1 = -max_u*st       -0.5*au;
					let x2 =  max_u*st +au*st-0.5*au;
					let z  = 	v*st         -0.5*av;
					
					tblVertex.push( x1 , 0 , z );
					tblVertex.push( x2 , 0 , z );

				}
				for ( let i = 0 ; i <= max_v*2+av ; i++ )
				{
					tblIndex.push(  ofs+i*2, ofs+i*2+1 );
				}
			}
			{
				let ofs = tblVertex.length/3;
				for ( let u = -max_u ; u <= max_u+au; u++ )
				{
					let x  =      u*st        -0.5*au;
					let z1 = -max_v*st        -0.5*av;
					let z2 =  max_v*st +av*st -0.5*av;
					tblVertex.push( x  , 0, z1 );
					tblVertex.push( x  , 0, z2 );

				}
				for ( let i = 0 ; i <= max_u*2+au ; i++ )
				{
					tblIndex.push(  ofs+i*2 , ofs+i*2+1 );
				}
			}
		}
		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];
		
		return [ tblIndex, tblVertex, color, "INDEXED"];
	}

	//-----------------------------------------------------------------------------
	function makePrimModel( size_u, size_v, size_w, type )
	//-----------------------------------------------------------------------------
	{
		let qubic = qubic_create( type );

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
					qubic.addcube( x+au/2, y+av/2, z+aw/2 );
				}
			}
		}

		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ qubic.tblIndex_wire, qubic.tblIndex_flat, qubic.tblVertex, color, "INDEXED"];
	}
	//-----------------------------------------------------------------------------
	function makePrimRandom( size_u, size_v, size_w, type, cnt )
	//-----------------------------------------------------------------------------
	{
		let qubic = qubic_create( type );

		let cu = size_u/2;
		let cv = size_v/2;
		let cw = size_w/2;
		
		for ( let i = 0 ; i < cnt ; i++ )
		{
			let x = Math.floor(rand()*size_u)+0.5-cu;
			let y = Math.floor(rand()*size_v)-0.5;
			let z = Math.floor(rand()*size_w)+0.5-cw;
			qubic.addcube( x , y , z );
		}

		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ qubic.tblIndex_wire, qubic.tblIndex_flat, qubic.tblVertex, color, "INDEXED"];
	}
	//-----------------------------------------------------------------------------
	function makePrimPile( size_u, size_v, size_w, type )
	//-----------------------------------------------------------------------------
	{
		let qubic = qubic_create( type );

		let cu = size_u/2;
		let cv = size_v/2;
		let cw = size_w/2;
		
		for ( let i = 0 ; i < size_v ; i++ )
		{
			let x = size_u+0.5-cu;
			let y = -0.5		+i;
			let z = size_w+0.5-cw;
			qubic.addcube( x , y , z );
			qubic.addcube( x , y , -z );
			qubic.addcube( -x , y , z );
			qubic.addcube( -x , y , -z );
		}

		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ qubic.tblIndex_wire, qubic.tblIndex_flat, qubic.tblVertex, color, "INDEXED"];
	}
	//-----------------------------------------------------------------------------
	function makePrimSquare( size_u, y, size_w, type )
	//-----------------------------------------------------------------------------
	{
		let qubic = qubic_create( type );

		let cu = size_u/2;
		let cw = size_w/2;
		
		for ( let i = 1 ; i <= size_u ; i++ )
		{
			let x = size_u+0.5-cu;
			let z = size_w+0.5-cw;
			qubic.addcube( -x+i , y-0.5 , z );
			qubic.addcube( -x+i , y-0.5 , -z );
		}
		for ( let i = 1 ; i <= size_w ; i++ )
		{
			let x = size_u+0.5-cu;
			let z = size_w+0.5-cw;
			qubic.addcube(  x , y-0.5 , -z +i);
			qubic.addcube( -x , y-0.5 , -z +i);
		}


		let color = [vec3( 0.3 , 0.3 , 0.3 ),vec3( 1.0 , 1.0 , 1.0 ) ];

		return [ qubic.tblIndex_wire, qubic.tblIndex_flat, qubic.tblVertex, color, "INDEXED"];
	}

	// main

	g_tblModel=[];
	{
		let x = 20;
		let z = 20;
		let r2 = 4;
		let y2 = 1;
			//	let [ tblIndex_wire, tblVertex, color, drawtype] = makeWireGrid( 18, 18);
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimModel( x,1,z, "floor1" );
			let m = model_craete( vec3( 0, 0.0, 0.0 ), tblIndex_wire,tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}		
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimRandom( x,6,z, "prim1", 60 );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimPile( r2,y2+1,r2, "prim1" );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimSquare( r2,y2,r2, "prim1" );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}
		r2=10;
		y2=4;
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimPile( r2,y2+1,r2, "prim1" );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}
		{
			let [ tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype] = makePrimSquare( r2,y2,r2, "prim1" );
			let m = model_craete( vec3( 0.0, 1, 0.0 ), tblIndex_wire, tblIndex_flat, tblVertex, color, drawtype );
			g_tblModel.push( m );
		}

	}


}




let g_yaw = 0;
let g_tblModel = [];
let g_reqId;

let gl = document.getElementById( "html_canvas" ).getContext( "webgl" );
let gra = gra_create_webgl( gl );

function camera_create( pos, at, fovy )
{
	let body = {};
	body.pos	= pos;
	body.at		= at;
	body.fovy	= fovy;
	return body;
}
let g_cam;

/////

function random_create( type ) 
{
	let body = {};
	switch( type )
	{
	case "xorshift32":			//xorshift32 再現性のあるランダム
		body.y = 2463534242;
		body.random = function()
		{
			body.y = body.y ^ (body.y << 13); 
			body.y = body.y ^ (body.y >> 17);
			body.y = body.y ^ (body.y << 5);
			return Math.abs(body.y/((1<<31)));
		}
		break;

	case "Math":				// javascript Math
		body.random = function()
		{
			return Math.random();
		}
		break;

	default:					
		alert("random_create ERROR : "+ type );

	}
	return body.random;
}
let rand = random_create( "xorshift32" );

let g_terrain;
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	html_onchange();


	var then = 0;
	//---------------------------------------------------------------------
	function	update_paint( now )
	//---------------------------------------------------------------------
	{
		const deltaTime = ( now - then )/1000;
		then = now;
		g_cam = camera_create( vec3(  0, 2.5, g_param_zoom ), vec3( 0, 2.5,0 ), g_param_fovy );

		function	draw_scene()
		{

			// プロジェクション計算
			let P = mperspective( g_cam.fovy,  gl.canvas.width/ gl.canvas.height, 1, 100.0 );
			// ビュー計算
			let V= mlookat( g_cam.pos, g_cam.at );
			g_yaw+=radians( -0.1263 );
			V = mmul( V, mrotate( g_yaw, vec3( 0,1,0 ) ) );

			let color = [ vec3( 1.0, 1.0, 1.0 )		,	vec3(1.0, 1.0, 1.0 )		, vec3( 0.32, 0.32, 0.32 )	 ];

			// 色設定
			switch( g_param_color )
			{
				case "White":	color = [ vec3( 1.0, 1.0, 1.0 )		,	vec3(1.0, 1.0, 1.0 )		, vec3( 0.32, 0.32, 0.32 )	 ];	break;
				case "Blue":	color = [ vec3( 0.1, 0.2, 0.4 )		,	vec3( 0.1, 0.25, 0.5 )		, vec3(0.4, 0.6, 1.0 )		 ];	break;
				case "Red"	:	color = [ vec3( 0.12 , 0.15 , 0.25 ),	vec3( 0.12 , 0.15, 0.30 )	, vec3( 1.0, 0.2, 0.12 )	 ];	break;
				case "Green":	color = [ vec3( 0.0, 0.18, 0.1 )	,	vec3( 0.0, 0.22, 0.1 )		, vec3( 0.2, 1.0, 0.0 )		 ];	break;
				case "Yello":	color = [ vec3( 0.48, 0.32, 0.08 )	,	vec3( 0.64, 0.40, 0.08 )	, vec3( 0.9, 1.0, 0.18 )	 ];	break;
				case "Purple":	color = [ vec3( 0.56, 0.32, 0.8 )	,	vec3( 0.64, 0.40, 0.8 )		, vec3( 0.9, 1.0, 0.8 )		 ];	break;
				case "Black":	color = [ vec3( 0.12, 0.12, 0.12 )	,	vec3( 0.2, 0.2, 0.2 )		, vec3( 0.75, 0.75, 0.75)	 ];	break;
			}


			// 描画
				gra.cls( color[0] );

			if( 1 )
			{
				for ( let m of g_tblModel )
				{
					m.drawModel( P, V, color  );
				}
			}
			else
			{	// Zバッファ実験検証用コード
				test_depth();
			}	
		}

		draw_scene();

		if ( g_reqId ) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される可能性がある
		g_reqId = window.requestAnimationFrame( update_paint );
	}


	g_reqId = null;

	init_model();
	
	update_paint();
}


let g_param_color = "Black";
let g_param_fovy = 28;
let g_param_zoom = 10;
let g_param_normal = false;
let g_param_undome = false;

//-----------------------------------------------------------------------------
function html_update()
//-----------------------------------------------------------------------------
{
	init_model();
}
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

	g_param_fovy = document.getElementById( "html_fovy" ).value*1;
	g_param_zoom = document.getElementById( "html_zoom" ).value*1;

	g_param_normal	= document.getElementsByName( "html_normal" )[0].checked ;
//	g_param_undome	= document.getElementsByName( "html_undome" )[0].checked ;
//console.log(g_param_normal);
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
