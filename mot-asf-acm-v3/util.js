// 2021/05/19 ver0.05	random_create追加
// 2021/05/19 ver0.04	token_craete追加
// 2021/05/13 ver0.03	terrain_create:toCanvas 追加
// 2021/05/13 ver0.02	terrain_create 追加
// 2021/05/11 ver0.01	bloom_create 追加

// ライブラリコンセプト
//	・javascriptと標準ライブラリのみ。自作ライブラリなどを使わない。依存性のないコードのみ
//	・１ライブラリ＝１関数。_create()プリフィクスを付ける

//-----------------------------------------------------------------------------
function random_create( type ) // 2021/05/19 xorshift32＆Math.random()など、複数のランダムルーチンを切り替えられるようにしたもの
//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
function	token_create( strProg )//  2021/05/19 bvh解析で使用実績のあるもの
//-----------------------------------------------------------------------------
{
	let token={};
	let m_adr = 0;

	let cntLine = 0;
	let text  = strProg.replace(/\r\n|\r/g, "\n");
	let lines = text.split( '\n' );
	let m_str = text;

//	//-----------------------------------------------------------------------------
//	token.getTokenNone = function()
//	//-----------------------------------------------------------------------------
//	{
//		return {word:0, atr:"tNON"};
//	}

	//-----------------------------------------------------------------------------
	token.isActive = function()
	//-----------------------------------------------------------------------------
	{
		return ( m_adr < m_str.length );
	}
	//-----------------------------------------------------------------------------
	token.getLine = function()
	//-----------------------------------------------------------------------------
	{
		if ( cntLine >= lines.length ) return null;
		return lines[cntLine++];
		
	}
	//-----------------------------------------------------------------------------
	token.getToken = function()
	//-----------------------------------------------------------------------------
	{

		let word = "";
		let type1 = "tNON";

		while( m_adr < m_str.length )
		{
			let c = m_str[ m_adr++ ];
			
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
				else if ( c  == "#" )	atr = "tNON";	// 
				else if ( c  == "$" )	atr = "tNON";	// 
				else if ( c  == "%" )	atr = "tNON";	// 
				else if ( c  == "&" )	atr = "C:";	// 
				else if ( c  == "'" )	atr = "tNON";	// 
				else if ( c  == "(" )	atr = "^:";	// 
				else if ( c  == ")" )	atr = "^:";	// 
				else if ( c  == "*" )	atr = "C:";	// 
				else if ( c  == "+" )	atr = "C:";	// 
				else if ( c  == "," )	atr = "tCtr";	// 
				else if ( c  == "-" )	atr = "tMin";	// 
				else if ( c  == "/" )	atr = "C:";	// 
				else if ( cd <= 57  )	atr = "N:";	// 0123456789
				else if ( c  == ":" ) 	atr = "L:";
				else if ( c  == ";" ) 	atr = "S:";
				else if ( c  == "<" ) 	atr = "C:";
				else if ( c  == "=" ) 	atr = "C:";
				else if ( c  == ">" ) 	atr = "C:";
				else if ( c  == "?" ) 	atr = "C:";
				else if ( c  == "@" ) 	atr = "tNON";
				else if ( cd <= 90  )	atr = "W:";	// ABCDEFGHIJKLMNOPQRSTUVWXYZ
				else if ( c  == "[" ) 	atr = "tCtr";
				else if ( c  == "\\") 	atr = "C:";
				else if ( c  == "]" ) 	atr = "tCtr";
				else if ( c  == "^" ) 	atr = "C:";
				else if ( c  == "_" ) 	atr = "W:";
				else if ( c  == "`" ) 	atr = "tNON";
				else if ( cd <=122  )	atr = "W:";	// abcdefghijklmnopqrstuvwxyz
				else if ( c  == "{" ) 	atr = "^:";
				else if ( c  == "|" ) 	atr = "C:";
				else if ( c  == "}" ) 	atr = "^:";
				else 					atr = "W:";	// あいう...unicode

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

				word = c;

				if ( c=="{" || c=="[" || c=="(" || c=="}" || c=="]" || c==")" || c=="," || c==";" )	// 一文字のみの集合構文
				{
					break;
				}
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
		//	console.log((++g_cntToken)+":token ["+word+"]",type1);
		return {atr:type1,val:word};
	}
	return token;
}
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
		if( flgDepth )
		{
			var ext = gl.getExtension( 'WEBGL_depth_texture' );
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

//	地形生成ライブラリ

//-----------------------------------------------------------------------------
function terrain_create( reso_w, reso_h, func_random=Math.random ) // 2021/05/13 Terrain2をライブラリ化
//-----------------------------------------------------------------------------
{
	//2021/02/24 terrain_create	ベクタライズ機能が追加。中間データを外部表示。

	// private

	let bufA = [];
	let bufB = [];
	let bufC = [];

	let buf4 = [];

	let blur1;
	let blur2;
	let blur3;
	let bp1;
	let bp2;
	let bp3;

	let low;	// 地面
	let col;	// 諧調

	let body={};

	{
		body.reso_w = reso_w;
		body.reso_h = reso_h;

		for ( let i = 0 ; i < body.reso_w*body.reso_h ; i++ )
		{
			bufA[i] = func_random();
			bufB[i] = func_random();
			bufC[i] = func_random();
		}
	}
	//-----------------------------------------------------------------------------
	function calc_pat_normalize( pat )
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
	function clip2d( px, py, W, H )
	//-----------------------------------------------------------------------------
	{
		if ( px < 0   ) px = 0;
		else
		if ( px >= W ) px = W-1;

		if ( py < 0   ) py = 0;
		else
		if ( py >= H ) py = H-1;

		return ( W*py + px ); 
	}
	//-----------------------------------------------------------------------------
	function vec_round( [x, y], W, H )
	//-----------------------------------------------------------------------------
	{
		if ( x < 0   ) x += W;
		else
		if ( x >= W ) x -= H;

		if ( y < 0   ) y += H;
		else
		if ( y >= H ) y -= H;

		return [x,y];
	}
	//-----------------------------------------------------------------------------
	function round2d( px, py, W, H )
	//-----------------------------------------------------------------------------
	{

		[px,py]=vec_round( [px,py],W,H );

		return ( W*py + px ); 
	}
	//-----------------------------------------------------------------------------
	function edge2d( x, y, W, H )
	//-----------------------------------------------------------------------------
	{
	//	return clip2d( x, y, W, H );	// 
		return round2d( x, y, W, H );	// 上下左右がループする
	}


	//-----------------------------------------------------------------------------
	function calc_blur( buf1, pat, w, h )
	//-----------------------------------------------------------------------------
	{
		// patで乗算
		let buf2 = new Array( buf1.length );
		let edge = Math.floor( pat.length/2 );



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
						let a = edge2d( x+( m-edge ), y+( n-edge ),w,h );


						v += buf1[ a ] * pat[m][n];
					}
				}
				buf2[ ( w*y + x ) ] = v;
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
		let edge = Math.floor( pat.length/2 );

		for ( let y = 0 ; y < h ; y++ )
		{
			for ( let x = 0 ; x < w ; x++ )
			{
				//let adr = ( w*y + x ); 

				let base_high = buf0[ w*y+x ]; // 基準となる中心の高さ
		if( 1 )
		{
					let cntRain = 0;
					let cntAll = 0;
					for ( let m = 0 ; m < pat.length ; m++ )
					{
						for ( let n = 0 ; n < pat[m].length ; n++ )
						{
							// ラウンドする
							let px = x+( m-edge );
							let py = y+( n-edge );
				
							if ( px < 0   ) px = w-1;
							else
							if ( px >= w ) px = 0;

							if ( py < 0   ) py = h-1;
							else
							if ( py >= h ) py = 0;

							let adr = ( w*py + px ); 

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
							let px = x+( m-edge );
							let py = y+( n-edge );
				
							if ( px < 0   ) px = w-1;
							else
							if ( px >= w ) px = 0;

							if ( py < 0   ) py = h-1;
							else
							if ( py >= h ) py = 0;

							let adr = ( w*py + px ); 

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
	function calc_pat_gauss2d( size, sigma )
	//-----------------------------------------------------------------------------
	{
		//-----------------------------------------------------------------------------
		function gauss( x,s )
		//-----------------------------------------------------------------------------
		{
			let u = 0; 
			// u: μミュー	平均
			// s: σシグマ	標準偏差
			return 	1/( Math.sqrt( 2*Math.PI*s ) )*Math.exp( -( ( x-u )*( x-u ) ) / ( 2*s*s ) );
		}
		// size  :マトリクスの一辺の大きさ
		// sigma :
		const c = Math.floor( size/2 );
		let pat = new Array( size );
		for ( let i = 0 ; i < pat.length ; i++ ) pat[i] = new Array( size );
		for ( let m = 0 ; m < pat.length ; m++ )
		{
			for ( let n = 0 ; n < pat[m].length ; n++ )
			{
				let x = ( m-c );
				let y = ( n-c );
				let l = Math.sqrt( x*x+y*y );
				pat[m][n] = gauss( l, sigma );
			}
		}
		return pat;

	}	
	//-----------------------------------------------------------------------------
	function calc_autolevel( buf0, W, H, low=0.0, high=1.0 )
	//-----------------------------------------------------------------------------
	{
		let buf = Array.from( buf0 );

		let max = Number.MIN_SAFE_INTEGER;
		let min = Number.MAX_SAFE_INTEGER;

		for ( let i = 0 ; i < W*H ; i++ )
		{
			let a = buf[i];
			max = Math.max( max, a );
			min = Math.min( min, a );
		}
		{
			let rate = ( high-low )/( max-min );
			for ( let i = 0 ; i < W*H ; i++ )
			{
				buf[i] = ( buf[i] - min )*rate + low;
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

	//-----------------------------------------------------------------------------
	function func_lvl( j, col )
	//-----------------------------------------------------------------------------
	{
		// 段を作るための共通関数
		return ( 1.0/col )*( j+1 ); // lvl
	}

	// パラポライズ
	//-----------------------------------------------------------------------------
	function calc_parapolize( buf0, W, H, col )
	//-----------------------------------------------------------------------------
	{
		let buf = Array.from( buf0 );
		for ( let y = 0 ; y < H ; y++ )
		{
			for ( let x = 0 ; x < W ; x++ )
			{
				for ( let j = 0 ; j < col ; j++ )
				{
					let lvl = func_lvl( j, col );
					if ( buf[W*y+x] <= lvl ) // 内側を検出 lvl
					{
						buf[W*y+x] = ( 1.0/( col-1 ) )*j;
						break;
					}
				}
			}
		}
		return buf;
	}

	// ノイズをわざと乗せる
	//-----------------------------------------------------------------------------
	function calc_addnoise( buf0, W, H, val )
	//-----------------------------------------------------------------------------
	{
		let buf = Array.from( buf0 );
		for ( let i = 0 ; i < W*H ; i++ ) 
		{
			let a = buf0[i];
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
			
				let a1 = edge2d( x-1, y+1 ,w, h );
				let a2 = edge2d( x  , y+1 ,w, h );
				let a3 = edge2d( x+1, y+1 ,w, h );
				let a4 = edge2d( x-1, y   ,w, h );
				let a5 = edge2d( x  , y   ,w, h );
				let a6 = edge2d( x+1, y   ,w, h );
				let a7 = edge2d( x-1, y-1 ,w, h );
				let a8 = edge2d( x  , y-1 ,w, h );
				let a9 = edge2d( x+1, y-1 ,w, h );
				
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
		let buf = Array.from( buf0 );
		for ( let i = 0 ; i < w ; i++ )
		{
			buf[ w*( h-1 )+i ] *= valw; 
			buf[ w*0+i ] *= valw;
		}
		for ( let i = 0 ; i < h ; i++ )
		{
			buf[ w*i+0 ] *= valh;
			buf[ w*i+ ( w-1 ) ] *= valh;
		}
		return buf;
	}
	// 穴をあける
	//-----------------------------------------------------------------------------
	function calc_makehole( buf0, w, h, sx, sy, sr, val )
	//-----------------------------------------------------------------------------
	{
		let buf = Array.from( buf0 );
		for ( let r = 1 ; r < sr  ; r++ )
		{
			for ( let th = 0 ; th < Math.PI*2 ; th+=rad( 1 ) )
			{
				let x = Math.floor( r*Math.cos( th ) )+sx;
				let y = Math.floor( r*Math.sin( th ) )+sy;
				
				buf[ y*w+x ] = val;
			}
		}
		return buf;
	}
	// シリンダーを作る
	//-----------------------------------------------------------------------------
	function calc_makecylinder( buf0, W, H, sx, sy, sr, val )
	//-----------------------------------------------------------------------------
	{
		let buf = Array.from( buf0 );
		for ( let r = 0 ; r < sr  ; r++ )
		{
			for ( let th = 0 ; th < Math.PI*2 ; th+=rad( 1 ) )
			{
				let x = Math.floor( r*Math.cos( th )+0.5 )+sx;
				let y = Math.floor( r*Math.sin( th )+0.5 )+sy;
				
				buf[ y*W+x ] = val;
			}
		}
		return buf;
	}
	// BOXを作る
	//-----------------------------------------------------------------------------
	function calc_makebox( buf0, W, H, sx, sy, ex, ey, val )
	//-----------------------------------------------------------------------------
	{
		let buf = Array.from( buf0 );
		for ( let y = sy ; y < ey ; y++ )
		{
			for ( let x = sx ; x < ex; x++ )
			{
				let px = Math.floor( x );
				let py = Math.floor( y );
				
				let adr = round2d( px , py , W, H );
				buf[adr] = val;
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
				let adr = ( W*y + x );
				buf[adr] = Math.abs( bufA[adr]-bufB[adr] );
			}
		}
		return buf;
	}

	// public

	//-----------------------------------------------------------------------------
	body.update_map = function( blur1=40, blur2=4, blur3=1, bp1=8, bp2=4, bp3=1, col=6, low=0.5 )
	//-----------------------------------------------------------------------------
	{
		let W = body.reso_w;
		let H = body.reso_h;

		// 3x3ブラーフィルタ作成
		let pat33 = calc_pat_normalize( 
		[
			[1,2,1],
			[2,4,2],
			[1,2,1],
		] );
		// 5x5ガウスブラーフィルタ作成
		//	let pat55 = calc_pat_normalize( calc_pat_gauss2d( 5, 1 ) );
		// 9x9ガウスブラーフィルタ作成
		let pat99 = calc_pat_normalize( calc_pat_gauss2d( 9, 2 ) );
	
		//--
		
		// ランダムの種をコピー
		let buf_A = Array.from( bufA );
		let buf_B = Array.from( bufB );
		let buf_C = Array.from( bufC );

		// 鞣し
		// ブラーフィルタn回適用
		for ( let i = 0 ; i < blur1 ; i++ ) buf_A = calc_blur( buf_A, pat33, W, H, blur1 );
		buf_A = calc_autolevel( buf_A, W, H );

		for ( let i = 0 ; i < blur2 ; i++ ) buf_B = calc_blur( buf_B, pat33, W, H, blur2 );
		buf_B = calc_autolevel( buf_B, W, H );

		for ( let i = 0 ; i < blur3 ; i++ ) buf_C = calc_blur( buf_C, pat33, W, H, blur3 );
		buf_C = calc_autolevel( buf_C, W, H );

		let buf_ABC= [];

		{//合成
			for ( let x = 0 ; x < W*W ; x++ )
			{
				buf_ABC[x] =( buf_A[x]*bp1+buf_B[x]*bp2+buf_C[x]*bp3 )/( bp1+bp2+bp3 );
			}
		}

		// 自動レベル調整
		buf_ABC = calc_autolevel( buf_ABC, W, H );

		// ローパスフィルタ
		buf_ABC = calc_lowpass( buf_ABC, W, H, low );

		// 自動レベル調整
		buf_ABC = calc_autolevel( buf_ABC, W, H );

		// パラポライズ
		buf_ABC = calc_parapolize( buf_ABC, W, H, col );

		return [ buf_A	,	buf_B	,	buf_C,	buf_ABC	];

	}

	//-----------------------------------------------------------------------------
	body.toCanvas = function( cv, buf )
	//-----------------------------------------------------------------------------
	{
		let width = this.reso_w;
		let height = this.reso_h;
		let ctx = cv.getContext('2d');

		let img = ctx.createImageData( width, height );

		//-----------------------------------------------------------------------------
		function put_buf( buf )
		//-----------------------------------------------------------------------------
		{
			let h = img.height;
			let w = img.width
			for ( let y = 0 ; y < h ; y++ )
			{
				for ( let x = 0 ; x < w ; x++ )
				{
					let v = buf[ w*y + x ];

					function pset_rgbf( x, y, [r,g,b] )
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

						let adr = (y*img.width+x)*4;
						img.data[ adr +0 ] = r;
						img.data[ adr +1 ] = g;
						img.data[ adr +2 ] = b;
						img.data[ adr +3 ] = 0xff;
					}
					pset_rgbf( x, y, [v,v,v] );

				}
			}
		}
		//-----------------------------------------------------------------------------
		function streach()
		//-----------------------------------------------------------------------------
		{
			ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = 0; // スムージングOFF
			{
			// 引き伸ばして表示
			    let cv2=document.createElement('canvas');				// 新たに<canvas>タグを生成
			    cv2.width = img.width;
			    cv2.height = img.height;
				cv2.getContext("2d").putImageData( img,0,0);				// 作成したcanvasにImageDataをコピー
				{
					let sx = 0;
					let sy = 0;
					let sw = img.width;
					let sh = img.height;
					let dx = 0;
					let dy = 0;
					let dw = cv.width;
					let dh = cv.height;
					ctx.drawImage( cv2,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Canvasは引き延ばせる
				}
				
			}
		}
		put_buf( buf );
		streach();
	}

	return body;
}

