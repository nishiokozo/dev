// 2021/05/11 ver0.01	bloom_create追加

//-----------------------------------------------------------------------------
function bloom_create( gl )
//-----------------------------------------------------------------------------
{

	const src_vs = " 								"
		+"attribute vec2	Pos;					" // Pos = attribte["Pos"][n]
		+"attribute vec2	Uv;						" // Uv  = attribte["Uv"][n]
		+"											"
		+"varying  vec2		uv;						" // uv = &fs.uv
		+"void main( void )							"
		+"{											"
		+"	gl_Position = vec4( Pos,0,1 );			"
		+"	uv = Uv;								"
		+"}											";

	const src_fs_const = " 							" // コンスタントカラー
		+"precision highp float;					"
		+"uniform sampler2D Tex0;					" // Tex0 = sampler2D[ uniform["Tex0"] ]
		+"											"
		+"varying  vec2 	uv;						" 
		+"void main( void )							"
		+"{											"
		+"	gl_FragColor = texture2D( Tex0, uv );	"
		+"}											";

	const src_fs_v = "  							" // ガウシアンブラーV
		+"precision highp float;					"
		+"uniform sampler2D	Tex0;					" // Tex0 = sampler2D[ uniform["Tex0"] ]
		+"uniform vec2		Dot;					"
		+"uniform int		Glen;					"
		+"uniform float		Gaus[20];				"
		+"											" 
		+"varying vec2	uv;							" 
		+"void main ( void )							" 
		+"{																		"
		+"	vec4 col  = texture2D( Tex0, uv ) * Gaus[0] ;						"
		+"	float v = 1.0;														"
		+"	for ( int i=1 ; i < 20 ; i++ ) {									" // version 200だと可変のforが使えない
		+"		col += texture2D( Tex0, uv + vec2( 0.0,  Dot.y*v ) ) * Gaus[i];"
		+"		col += texture2D( Tex0, uv + vec2( 0.0, -Dot.y*v ) ) * Gaus[i];"
		+"		v+=1.0;															"
		+"	}																	"
		+"	gl_FragColor = col;													"
		+"}																		";

	const src_fs_h = "  							" // ガウシアンブラーH
		+"precision highp float;					" 
		+"uniform sampler2D	Tex0;					" // Tex0 = sampler2D[ uniform["Tex0"] ] 
		+"uniform vec2		Dot;					"
		+"uniform int		Glen;					"
		+"uniform float		Gaus[20];				"
		+"											" 
		+"varying vec2	uv;							" 
		+"void main ( void )							" 
		+"{																		"
		+"	vec4 col  = texture2D( Tex0, uv ) * Gaus[0] ;						"
		+"	float v = 1.0;														"
		+"	for ( int i=1 ; i < 20 ; i++ ) {									" // version 200だと可変のforが使えない
		+"		col += texture2D( Tex0, uv + vec2(  Dot.x*v, 0.0 ) ) * Gaus[i];"
		+"		col += texture2D( Tex0, uv + vec2( -Dot.x*v, 0.0 ) ) * Gaus[i];"
		+"		v+=1.0;															"
		+"	}																	"
		+"	gl_FragColor = col;													"
		+"}																		";

	const src_fs_add = "				 			" // 加算合成
		+"precision highp float;					"
		+"uniform sampler2D Tex0;					"
		+"uniform sampler2D	Tex1;					"
		+" 											"
		+"varying vec2		uv;						"
		+"void main()								"
		+"{																		"
		+"	gl_FragColor = ( texture2D( Tex0,vec2( uv ) )						"
		+"					+texture2D( Tex1,vec2( uv ) ) );					"
		+"}																		";

	// シェーダー作成
	//-----------------------------------------------------------------------------
	function makeshader( src_vs, src_fs, tblUniformTex )
	//-----------------------------------------------------------------------------
	{
		let shader = {};
		shader.Prog = gl.createProgram();

		function compile( gl, type, source ) 
		{
			const hdl = gl.createShader( type );
			gl.shaderSource( hdl, source );
			gl.compileShader( hdl );
			if ( !gl.getShaderParameter( hdl, gl.COMPILE_STATUS ) ) 
			{
				alert( "An error occurred compiling the shaders: " + gl.getShaderInfoLog( hdl ) );
				gl.deleteShader( hdl );
				return null;
			}
			return hdl;
		}

		const vs	= compile( gl, gl.VERTEX_SHADER, src_vs );
		const fs	= compile( gl, gl.FRAGMENT_SHADER, src_fs );
		gl.attachShader( shader.Prog, vs );
		gl.attachShader( shader.Prog, fs );
		gl.linkProgram( shader.Prog );
		if ( !gl.getProgramParameter( shader.Prog, gl.LINK_STATUS ) ) 
		{
			alert( "Unable to initialize the shader program: " + gl.getProgramInfoLog( shader.Prog ) );
			return null;
		}

		shader.listTex = tblUniformTex;

		return shader;
	}

	// for FBO
	//-----------------------------------------------------------------------------
	function makeframebuf( width, height, flgDepth )
	//-----------------------------------------------------------------------------
	{
		let fbo ={};

		function create_texture( width, height, internalFormat, srcFormat, srcType )
		{//memo 浮動小数点バッファの場合：internalFormat:RGB32F	Format:RGB	Type:FLOAT
			let tex = gl.createTexture();
			const level				= 0;
			gl.bindTexture( gl.TEXTURE_2D, tex );
			gl.texImage2D( gl.TEXTURE_2D, level, internalFormat,width,height,0,srcFormat, srcType, null );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
			gl.texParameterf( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );	
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
			// NEAREST / LINEAR / NEAREST_MIPMAP_NEAREST / LINEAR_MIPMAP_LINEAR

			return tex;
		}
		fbo.color_tex	= create_texture( width, height, gl.RGBA				, gl.RGBA				, gl.UNSIGNED_BYTE );


		fbo.hdl = gl.createFramebuffer();
		gl.bindFramebuffer( gl.FRAMEBUFFER, fbo.hdl );
		gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0	, gl.TEXTURE_2D, fbo.color_tex		, 0 );
		if(flgDepth)
		{
			var ext = gl.getExtension('WEBGL_depth_texture');
			if ( ext )
			{
				//  weggl ではdepthは拡張仕様
				fbo.m_depth_tex	= create_texture( width, height, gl.DEPTH_COMPONENT	, gl.DEPTH_COMPONENT	, gl.UNSIGNED_SHORT );
			}
			else
			{
				// weggl2
				fbo.m_depth_tex	= create_texture( width, height, gl.DEPTH_COMPONENT16	, gl.DEPTH_COMPONENT	, gl.UNSIGNED_SHORT );
			}
			gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT	, gl.TEXTURE_2D, fbo.m_depth_tex	, 0 );
		}
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

		fbo.begin = function()
		{
			gl.bindFramebuffer( gl.FRAMEBUFFER, fbo.hdl );
			gl.viewport( 0, 0,  width, height );
		}

		return fbo;
	}

	// スクリーン用メッシュ
	//-----------------------------------------------------------------------------
	function makemesh()
	//-----------------------------------------------------------------------------
	{
		const tblPos	= [	-1.0,-1.0,	1.0,-1.0,	-1.0, 1.0,	 1.0, 1.0	];
		const tblUv		= [	 0.0, 0.0,	1.0, 0.0,	 0.0, 1.0,	 1.0, 1.0	];	
		const tblIndex	= [	0,1,2,3	];

		let mesh = {};

		mesh.hdlPos = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, mesh.hdlPos );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblPos ), gl.STATIC_DRAW );

		mesh.hdlUv = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, mesh.hdlUv );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( tblUv ), gl.STATIC_DRAW );

		mesh.hdlIndex = gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.hdlIndex );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( tblIndex ), gl.STATIC_DRAW );

		mesh.cntIndex	= tblIndex.length;
		mesh.drawtype	= gl.TRIANGLE_STRIP

		return mesh;
	}

	let model = {};
	let shader_v		= makeshader( src_vs, src_fs_v		, ["Tex0"] );
	let shader_h		= makeshader( src_vs, src_fs_h		, ["Tex0"]  );
	let shader_const	= makeshader( src_vs, src_fs_const	, ["Tex0"]  );
	let shader_add		= makeshader( src_vs, src_fs_add	, ["Tex0","Tex1"]  );
	let mesh			= makemesh();
	let fbo_1D			= makeframebuf( gl.canvas.width/1, gl.canvas.height/1, true );
	let fbo_1b			= makeframebuf( gl.canvas.width/1, gl.canvas.height/1, false );
	let fbo_1c			= makeframebuf( gl.canvas.width/1, gl.canvas.height/1, false );
	let fbo_2a			= makeframebuf( gl.canvas.width/2, gl.canvas.height/2, false );
	let fbo_2b			= makeframebuf( gl.canvas.width/2, gl.canvas.height/2, false );
	let fbo_4a			= makeframebuf( gl.canvas.width/4, gl.canvas.height/4, false );
	let fbo_4b			= makeframebuf( gl.canvas.width/4, gl.canvas.height/4, false );
	let fbo_8a			= makeframebuf( gl.canvas.width/8, gl.canvas.height/8, false );
	let fbo_8b			= makeframebuf( gl.canvas.width/8, gl.canvas.height/8, false );
	shader_v.sigma		= 10;
	shader_v.rate		= 0.45;
	shader_h.sigma		= 10;
	shader_h.rate		= 0.45;

	///// public:関数

	//-----------------------------------------------------------------------------
	model.drawmodel = function( shader, tblTexture )
	//-----------------------------------------------------------------------------
	{
		// mesh & texture setup
		{
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.hdlIndex );

			if (  tblTexture.length < shader.listTex.length )
			{
				alert( "Not enough texture for shader." );
				return;
			}
		}

		// shader setup
		{
			gl.useProgram( shader.Prog );
			{
				let hdl = 	gl.getAttribLocation( shader.Prog, "Pos" )
				gl.bindBuffer( gl.ARRAY_BUFFER, mesh.hdlPos );
				gl.vertexAttribPointer( hdl, 2, gl.FLOAT, false, 0, 0 );
				gl.enableVertexAttribArray( hdl );
			}

			{
				let hdl = 	gl.getAttribLocation( shader.Prog, "Uv" )
				gl.bindBuffer( gl.ARRAY_BUFFER, mesh.hdlUv );
				gl.vertexAttribPointer( hdl, 2, gl.FLOAT, false, 0, 0 );
				gl.enableVertexAttribArray( hdl );
			}
			
	 		// Tex0に渡る定数
	 		{
				for ( let i = 0 ; i < shader.listTex.length ; i++ )
				{
					let hdl = gl.getUniformLocation( shader.Prog, shader.listTex[i] );
		 			gl.uniform1i( hdl, i );									// サンプラーにのったテクスチャインデックスをセット
					gl.activeTexture( gl.TEXTURE0+i );						// TEXTURE0[i].TEXTURE_2D = tblTexture[i]
					gl.bindTexture( gl.TEXTURE_2D, tblTexture[i] );			// サンプラーにテクスチャアドレスをセット
				}
			}
		
	 		// Dotに渡る定数
			{//ドットピッチ
				let m_viewport = gl.getParameter( gl.VIEWPORT );
				let hdl = gl.getUniformLocation( shader.Prog, "Dot" );
				gl.uniform2f( hdl, 1.0/m_viewport[2] , 1.0/m_viewport[3] );
			}

			//テーブル
			{
				let hdl = gl.getUniformLocation( shader.Prog, "Gaus" );
				if ( hdl != null )
				{
					function make_gauss( size, sigma, rate )
					{
						function gauss( x,s )
						{
							let u = 0; 
							// u: μミュー	平均
							// s: σシグマ	標準偏差
							return 	1/( Math.sqrt( 2*Math.PI*s ) )*Math.exp( -( ( x-u )*( x-u ) ) / ( 2*s*s ) );
						}
						// size  :マトリクスの一辺の大きさ
						// sigma :
						let pat = new Array( size );
						for ( let m = 0 ; m < pat.length ; m++ )
						{
							pat[m] = gauss( m, sigma )*rate;
						}
						return pat;
					}	
					let	tbl = make_gauss( 20,shader.sigma, shader.rate );

					if ( hdl != null )
					{
						gl.uniform1fv( hdl, tbl );
						let hdl2 = gl.getUniformLocation( shader.Prog, "Glen" );
						gl.uniform1i( hdl2, tbl.length );
					}
				}
			}
		}

		// draw
		gl.drawElements( mesh.drawtype, mesh.cntIndex, gl.UNSIGNED_SHORT, 0 );
	}
	//-----------------------------------------------------------------------------
	model.renderer = function( cb_model_draw, mode="small64", sigma=1.5, rate=0.9 )
	//-----------------------------------------------------------------------------
	{
		shader_v.sigma = sigma;
		shader_v.rate = rate;
		shader_h.sigma = sigma;
		shader_h.rate = rate;
	
		if ( mode=="small64" ) // sigma=1.5;rate=0.9
		{
			fbo_1D.begin();cb_model_draw();
			fbo_2a.begin();model.drawmodel( shader_const, [fbo_1D.color_tex] );	// 1/4
			fbo_4a.begin();model.drawmodel( shader_const, [fbo_2a.color_tex] );	// 1/16
			fbo_8a.begin();model.drawmodel( shader_const, [fbo_4a.color_tex] );	// 1/64
			fbo_8b.begin();model.drawmodel( shader_v, [fbo_8a.color_tex] );		// 縦ブラー
			fbo_8a.begin();model.drawmodel( shader_h, [fbo_8b.color_tex] );		// 横ブラー
			gl.bindFramebuffer( gl.FRAMEBUFFER, null );												// 元のサイズに引き延ばし合成
			gl.viewport( 0, 0,  gl.canvas.width, gl.canvas.height );
			model.drawmodel( shader_add, [fbo_8a.color_tex,fbo_1D.color_tex] );
		}
		else
		if ( mode=="small16" ) // sigma=3;rate=0.659
		{
			fbo_1D.begin();cb_model_draw();
			fbo_2a.begin();model.drawmodel( shader_const, [fbo_1D.color_tex] );	// 1/4
			fbo_4a.begin();model.drawmodel( shader_const, [fbo_2a.color_tex] );	// 1/16
			fbo_4b.begin();model.drawmodel( shader_v, [fbo_4a.color_tex] );		// 縦ブラー
			fbo_4a.begin();model.drawmodel( shader_h, [fbo_4b.color_tex] );		// 横ブラー
			gl.bindFramebuffer( gl.FRAMEBUFFER, null );												// 元のサイズに引き延ばし合成
			gl.viewport( 0, 0,  gl.canvas.width, gl.canvas.height );
			model.drawmodel( shader_add, [fbo_4a.color_tex,fbo_1D.color_tex] );
		}
		else
		if ( mode=="small4" ) // sigma=3;rate=0.659
		{
			fbo_1D.begin();cb_model_draw();
			fbo_2a.begin();model.drawmodel( shader_const, [fbo_1D.color_tex] );	// 1/4
			fbo_2b.begin();model.drawmodel( shader_v, [fbo_2a.color_tex] );		// 縦ブラー
			fbo_2a.begin();model.drawmodel( shader_h, [fbo_2b.color_tex] );		// 横ブラー
			gl.bindFramebuffer( gl.FRAMEBUFFER, null );												// 元のサイズに引き延ばし合成
			gl.viewport( 0, 0,  gl.canvas.width, gl.canvas.height );
			model.drawmodel( shader_add, [fbo_2a.color_tex,fbo_1D.color_tex] );
		}
		else
		if ( mode=="nosmall" ) // sigma=10;rate=0.45
		{
			fbo_1D.begin();cb_model_draw();
			fbo_1c.begin();model.drawmodel( shader_v, [fbo_1D.color_tex] );		// 縦ブラー
			fbo_1b.begin();model.drawmodel( shader_h, [fbo_1c.color_tex] );		// 横ブラー
			gl.bindFramebuffer( gl.FRAMEBUFFER, null );												// 合成
			gl.viewport( 0, 0,  gl.canvas.width, gl.canvas.height );
			model.drawmodel( shader_add, [fbo_1D.color_tex,fbo_1b.color_tex] );
		}
		else
		{
			cb_model_draw();
		}


	}
	return model;
}
