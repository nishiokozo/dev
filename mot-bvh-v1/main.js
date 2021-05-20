"use strict";

///// Token

class Token
{

	adr;
	str;

	//-----------------------------------------------------------------------------
	constructor( strProg )
	//-----------------------------------------------------------------------------
	{
		this.adr = 0;
		this.prev_adr = 0;
		this.str = strProg;

	}

	//-----------------------------------------------------------------------------
	getTokenNone()
	//-----------------------------------------------------------------------------
	{
		return {word:0, atr:"tNON"};
	}

	//-----------------------------------------------------------------------------
	isActive()
	//-----------------------------------------------------------------------------
	{
		return ( this.adr < this.str.length );
	}
	//-----------------------------------------------------------------------------
	set_prev_adr()
	//-----------------------------------------------------------------------------
	{
		this.adr = this.prev_adr;
	}
	//-----------------------------------------------------------------------------
	getToken()
	//-----------------------------------------------------------------------------
	{

		let word = "";
		let type1 = "tNON";

		this.prev_adr = this.adr;

		while( this.adr < this.str.length )
		{
			let c = this.str[ this.adr++ ];
			
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
					this.adr--;
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
					this.adr--;
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
					this.adr--;
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
						this.adr--;
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
/*
	//-----------------------------------------------------------------------------
	pers()
	//-----------------------------------------------------------------------------
	{
		let arr = [];

		while( this.isActive() )
		{
			let obj = this.getToken();

			if ( obj.val == "," ) continue;
			if ( obj.val == ";" ) break;
			if ( obj.val == "(" ) obj.val = this.pers();
			if ( obj.val == "{" ) obj.val = this.pers();
			if ( obj.val == ")" ) break;
			if ( obj.val == "}" ) break;


			arr.push( obj.val );
		}
		return arr;
	}


	//-----------------------------------------------------------------------------
	execScript_obj()
	//-----------------------------------------------------------------------------
	{
		function dump_obj( oc , name, nest )
		{
			let str = name +"."+nest+","+oc.length+") ";
			for ( let o of oc )
			{
				if ( o.atr == "A:" )
				{
					str += o.atr+"["+o.val.length+"]"+" ";
				}
				else
				{
					str += o.atr+o.val+" ";
				}
			}
			console.log( str );
		}

		//-----------------------------------------------------------------------------
		function obj_dump( obj, nest )
		//-----------------------------------------------------------------------------
		{
			for ( let o of obj )
			{
				console.log(nest, o);
				if ( Array.isArray(o.val) )
				{
					obj_dump( o.val, nest+1 )
				}
			}
		}

		let tblobj1 = [];
		tblobj1.push( this.pers() );

		obj_dump( tblobj1, 0 );

	}
*/

}

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
function wireframe_create_webgl( gl )
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
			gra.set_wire( v, p, colset.wire );
		}
	}

	return body
};

///// main

//-----------------------------------------------------------------------------
function init_testmodel() // 
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
		r2=w-2;
		y2=8;	//6=3m相当
//		if(0)
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




let g_yaw = 0;
let g_tblModel = [];
let g_reqId;

let gl = document.getElementById( "html_canvas" ).getContext( "webgl", { antialias: true } );

function camera_create( pos, at, fovy, near=1.0, far=1000.0 )
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

//-----------------------------------------------------------------------------
function random_create( type ) 
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
let rand = random_create( "xorshift32" );

let g_terrain;
//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	html_onchange();

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

	let cam = camera_create( vec3(  2, 1.0, 10 ), vec3( 0, 1.0,0 ), 28, 1.0,1000.0  );
	let gra = wireframe_create_webgl( gl );

	var then = 0;
	let m_text_in="(none)";
	let m_step = 0;
	let m_loaded = false;
	let m_mot = null;
	let m_cntframe = 0;
	let g_time = 0;
	//---------------------------------------------------------------------
	function	update_paint( now )
	//---------------------------------------------------------------------
	{
		const deltaTime = ( now - then )/1000;
		then = now;
		//------------------------------------------------------------------------------
		function web_load( filename )
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


		// main
		
		switch( m_step )
		{
			case 0:
//				web_load( "02_03-run.bvh" );
///				web_load( "02_01-walk.bvh" );
//				web_load( "05_01-walk.bvh" );
//				web_load( "05_05-dance.bvh" );	//ng
//				web_load( "nocchi.bvh" );	
//				web_load( "aachan.bvh" );	
//				web_load( "kashiyuka.bvh" );
//				web_load( "05_06-dance.bvh" );	//ng
//				web_load( "05_11-dance.bvh" );
				web_load( "05_11.bvh" );
//				web_load( "05_18-dance.bvh" );	//ng
//				web_load( "14_02-boxing.bvh" );	//ng
//				web_load( "audience-02-standing set 2-yokoyama.bvh");
//				web_load( "soccer-03-volley kick-azumi.bvh");
//				web_load( "JumpingJack.bvh");	// 由来 https://github.com/emretanirgan/BVH_Viewer
//				web_load( "02_04.bvh");	// 由来 https://www.outworldz.com/Secondlife/Posts/CMU/
//				web_load( "05_05.bvh");	// 由来 https://www.outworldz.com/Secondlife/Posts/CMU/
				m_step++;
				break;

			case 1:
				if ( m_loaded ) 
				{
					m_step++;
	
					// main
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
	//										case "DEFINE":
											case "ROOT":
											case "JOINT":
											case "End":
												if ( param.length == form.length )
												{
													let name	= param[0];	// hip
													let body	= param[1];	// {}
													//--
	//												hash["_"+name]	= body;		// パーツであることの印
													hash.JOINT.push(body);	
													body["NAME"]=name;
													element = "";
												}
												break;

											case "CHANNELS":
												if ( param.length == len_variable ) 
												{
													hash[element]	=	param;
//													hash["MOTPOS"]=[];
//													hash["MOTROT"]=[];
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
						let token = new Token( text );
						return bvh_persJoint_sub( token );
					}

					{//pers
						m_mot = bvh_persJoint( m_text_in );
						if ( m_mot == null ) return;
					}
					//--
					console.log(m_mot,m_mot.MOTION.Frames );


				}
				break;

			case 2:
				break;
		}

		// 描画

		cam.fovy = g_param_fovy;
		cam.pos.z = g_param_zoom;
		cam.pos.y = g_param_high;

		let P = mperspective( cam.fovy,  gl.canvas.width/ gl.canvas.height, cam.near, cam.far );
		let V= mlookat( cam.pos, cam.at );

		g_yaw += radians( -0.1263/2  );
		V = mmul( V, mrotate( g_yaw, vec3( 0,1,0 ) ) );

		// ステージ表示
		for ( let m of g_tblModel )
		{
			m.drawModel( gra, P, V, g_param_colset );
		}


		//----------------------------------------
		function bvh_play( M, m_mot, frame, scale )
		//----------------------------------------
		{
			function drawbone( v, p, s )
			{
				let v3 = vmul( v , vec3(s,s,s) );
				let p3 = vmul( p , vec3(s,s,s) );
				let v4 = vec4(v3.x, v3.y, v3.z , 1 );
				let p4 = vec4(p3.x, p3.y, p3.z , 1 );
				v4 = vec4_vmul_Mv( V ,v4 );
				v4 = vec4_vmul_Mv( P ,v4 );
				p4 = vec4_vmul_Mv( V ,p4 );
				p4 = vec4_vmul_Mv( P ,p4 );
				gra.set_wire( v4, p4, g_param_colset.wire );
			}

			function bvh_play_sub( M, obj, data )
			{
				// 描画
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
			bvh_play_sub( M, m_mot.JOINT[0], m_mot.DATA[frame] );

		}
		if ( m_step == 2 )
		{
			bvh_play( midentity(), m_mot, m_cntframe, 0.06);
			m_cntframe++;
			if ( m_cntframe >= m_mot.MOTION.Frames ) m_cntframe = 0; 

			gra.cls( g_param_colset.back );
			gra.draw_flat();
			gra.draw_wire();
			first=0;
		}
		 

// gra.m_cnt_wire = 0;
		if ( m_mot )
		{
			let ft = m_mot.MOTION.FrameTime*1000;	// bvhの指定フレームタイム
			let time = performance.now();			// 実際に掛かったフレームタイム
			let t = (time-g_time)-ft;				// 差
			let t2 = ((t>0)?ft-t:ft);				// 次のフレームタイムの指定値

		//		print( 0,10,time-g_time ); 
		//		print( 0,20,g_cntFrame+"/"+g_mot.MOTION.Frames ); 
			g_time = time;

			setTimeout( update_paint, t2 );
//			if ( g_reqId ) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される可能性がある
//			g_reqId = window.requestAnimationFrame( update_paint );
		}
		else
		{
			if ( g_reqId ) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される可能性がある
			g_reqId = window.requestAnimationFrame( update_paint );
		}
	}


	g_reqId = null;

	init_testmodel();
	
	update_paint(0);
}


let g_param_colset = { back:vec3( 1.0, 1.0, 1.0 )		,	flat:vec3(1.0, 1.0, 1.0 )		, wire:vec3( 0.32, 0.32, 0.32 )	 };
let g_param_fovy = 28;
let g_param_zoom = 10;
let g_param_high = 2;
let g_param_normal = false;
let g_param_undome = false;

//-----------------------------------------------------------------------------
function html_update()
//-----------------------------------------------------------------------------
{
	init_testmodel();
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
			switch( l.value )
			{
case "White":	g_param_colset = { back:vec3( 1.0, 1.0, 1.0 )	,	flat:vec3(1.0, 1.0, 1.0 )		, wire:vec3( 0.32, 0.32, 0.32 )	 };	break;
case "Blue":	g_param_colset = { back:vec3( 0.1, 0.2, 0.4 )	,	flat:vec3( 0.1, 0.25, 0.5 )		, wire:vec3(0.4, 0.6, 1.0 )		 };	break;
case "Red"	:	g_param_colset = { back:vec3( 0.12 , 0.15 , 0.25 ),	flat:vec3( 0.12 , 0.15, 0.30 )	, wire:vec3( 1.0, 0.2, 0.12 )	 };	break;
case "Orenge":	g_param_colset = { back:vec3( 0.25 , 0.2 , 0.1 )	,	flat:vec3( 0.30 , 0.2, 0.00 )	, wire:vec3( 1.0, 0.25, 0.0 )	 };	break;
case "Green":	g_param_colset = { back:vec3( 0.0, 0.18, 0.1 )	,	flat:vec3( 0.0, 0.22, 0.1 )		, wire:vec3( 0.2, 1.0, 0.0 )		 };	break;
case "Yello":	g_param_colset = { back:vec3( 0.48, 0.32, 0.08 )	,	flat:vec3( 0.64, 0.40, 0.08 )	, wire:vec3( 0.9, 1.0, 0.18 )	 };	break;
case "Purple":	g_param_colset = { back:vec3( 0.56, 0.32, 0.8 )	,	flat:vec3( 0.64, 0.40, 0.8 )		, wire:vec3( 0.9, 1.0, 0.8 )		 };	break;
case "Gray":	g_param_colset = { back:vec3( 0.16, 0.16, 0.16 )	,	flat:vec3( 0.20, 0.20, 0.20 )	, wire:vec3( 0.75, 0.75, 0.75)	 };	break;
case "Black":	g_param_colset = { back:vec3( 0.0, 0.0, 0.0 )	,	flat:vec3( 0.20, 0.20, 0.20 )	, wire:vec3( 1.0, 1.0, 1.0 )	 };	break;
			}
			break;
		}
	}


	g_param_fovy = document.getElementById( "html_fovy" ).value*1;
	g_param_zoom = document.getElementById( "html_zoom" ).value*1;
	g_param_high = document.getElementById( "html_high" ).value*1;

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
