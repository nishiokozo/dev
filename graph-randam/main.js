const	KEY_CR	= 13;
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

let g=html_canvas.getContext('2d');
//-----------------------------------------------------------------------------
function rad( deg )
//-----------------------------------------------------------------------------
{
	return deg/180*Math.PI;
}
//-----------------------------------------------------------------------------
let box = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.stroke();

}
//-----------------------------------------------------------------------------
let fill= function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.fillStyle = "#000000";
	g.fill();
	g.stroke();

}

//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
	g.lineWidth = 1.0;
	g.moveTo( sx, sy );
	g.lineTo( ex, ey );
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
function print( tx, ty, str )
//-----------------------------------------------------------------------------
{
	g.font = "12px monospace";
	g.fillStyle = "#000000";
	g.fillText( str, tx, ty );
}

//-----------------------------------------------------------------------------
let circle = function( x,y,r )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.arc(x, y, r, 0, Math.PI * 2, true);
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
function cls()
//-----------------------------------------------------------------------------
{
	g.fillStyle = "#ffffff";
	g.fillRect( 0, 0, html_canvas.width, html_canvas.height );
}


let g_tbl = new Array(1000);
g_tbl.fill(0);
let g_ave = new Array(1000);
g_ave.fill(0);

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

let g_cntErr = 0;
let g_algo ="r";
//-----------------------------------------------------------------------------
function update()
//-----------------------------------------------------------------------------
{
	cls();


	{

		let r_qnum	= 32;		// 量子化数
		let r_smp	= 100000;	// 振る回数
		let r_dice	= 3;		// 0～1のアナログさいころの数



		for ( let i = 0 ; i < r_qnum ; i++ ) g_tbl[i] = 0;

		function rnd2( n ) // n=3以上が正規分布
		{
			let r = 0;
			for ( j = 0 ; j < n ; j++ ) r += Math.random();
			return r/n;
		}

		for ( let i = 0 ; i < r_smp ; i++ )
		{
			let r = 0;

			switch( g_algo )
			{
				case "r"		:r = rnd2( 1 );	break;
				case "(r+r)/2"	:r = rnd2( 2 );	break;
				case "(r+r+r)/3":r = rnd2( 3 );	break;
				case "(A+B)/2"	:r = (rnd2( 1 )+rnd2( 2 ))/2;	break;
				case "(A+C)/2"	:r = (rnd2( 1 )+rnd2( 3 ))/2;	break;
				case "(B+C)/2"	:r = (rnd2( 2 )+rnd2( 3 ))/2;	break;
				case "A*B"		:r = (rnd2( 1 )*rnd2( 2 ));		break;
				case "A*C"		:r = (rnd2( 1 )*rnd2( 3 ));		break;
				case "B*C"		:r = (rnd2( 2 )*rnd2( 3 ));		break;
			}

			let n = Math.floor( r*r_qnum );	// 量子化
			g_tbl[n]++;
		}	

		{	// グラフ表示
			print( 10,16*1, "      量子化数:"+r_qnum.toString() );
			print( 10,16*2, "サンプリング数:"+r_smp );
			print( 10,16*3, "  アルゴリズム:"+g_algo );

			let d_wide = 16;
			let d_sc = 1/40;
			let d_y = html_canvas.height -32;

			for ( let i = 0 ; i < r_qnum ; i++ ) 
			{
				let v = g_tbl[i];
				let x = i * d_wide;
				line( x+1,d_y-2-v*d_sc,x+d_wide-1,d_y-2-v*d_sc );
				print( x,d_y+16*1, i );
			}
		}
		
	}
	
	if(0)
	{
		let r_s		= 1;		//	最小値
		let r_e		= 5;		//	最大値
		let r_smp	= 10000;	//	振る回数
		let r_dice	= 3;	//	さいころの数

		let d_st = 1;//r_s;
		let d_en = 24;//r_e;
		let d_wide = 32;
		let d_y = html_canvas.height -40;
		let d_sc = (html_canvas.height-128)/(r_smp)*4;

		print( 10,16*1, "賽最小値:"+r_s.toString() );
		print( 10,16*2, "賽最大値:"+r_e.toString() );

		for ( let i = d_st ; i <= d_en ; i++ )
		{
			let x = i * d_wide;
			fill( x+1,d_y,x+d_wide-1,d_y );
			g_tbl[i]=0;
		}


		print( 10,16*3, "賽の数  :"+ r_dice+"個" );
		print( 10,16*4, "振る回数:"+ r_smp+"回" );
		print( 10,16*5, "err     :"+ g_cntErr );

		for ( let i = 0; i < r_smp; i++ )
		{
			let r = 0;
			for ( j = 0 ; j < r_dice ; j++ )
			{
				r += Math.floor(Math.random()*(r_e-r_s+1)+r_s);
			}
///			r=Math.round(r/r_dice);
			if ( r>=r_s || r<=r_e ) 
			{
				g_tbl[r]++;
			}
			else
			{
				g_cntErr++;
				console.log( "err ", r );
			}
		}

		let amt = 0;
		for ( let i = d_st; i <= d_en ; i++ )
		{
			let v = g_tbl[i];
			let a = g_ave[i] = Math.round((g_ave[i]*15+v)/16);	// 16回平均
			amt+=v;
		}
		for ( let i = d_st; i <= d_en ; i++ )
		{
			let v = g_tbl[i];
			let a = g_ave[i];
//			v=a;

			let x = i * d_wide;
			line( x+1,d_y-2-v*d_sc,x+d_wide-1,d_y-2-v*d_sc );
			line( x+1,d_y-2-a*d_sc,x+d_wide-1,d_y-2-a*d_sc );

			print( x,d_y-2 , i );
			print( x,d_y+16, v );
//			print( x,d_y+32, Math.round(100*a/amt)+"%" );
			print( x,d_y+32, (100*a/amt).toFixed(1)+"%" );
		}
			print( (d_en+1)*d_wide,d_y+16, "計:"+amt );
	}
	
	requestAnimationFrame( update );

}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;

}
	requestAnimationFrame( update );


//HTMLとのやり取り関連
//-----------------------------------------------------------------------------
function html_clickBtn()
//-----------------------------------------------------------------------------
{
	const str = document.getElementById("html_select").value;
	g_algo = str;

console.log(str);
}

//-----------------------------------------------------------------------------
function html_clickRadio()
//-----------------------------------------------------------------------------
{
	let element = document.getElementById("html_form");
	let radio = element.hoge;
	let str = radio.value;
	g_algo = str;

console.log(str);
}
function tmp()
{
	var elements = document.getElementsByName( "hoge" ) ;

	// 選択状態の値を取得
	for ( var a="", i=elements.length; i--; ) {
		if ( elements[i].checked ) {
			var a = elements[i].value ;
			break ;
		}
	}

	if ( a === "" ) {
		// 未選択状態
	} else {
		// aには選択状態の値が代入されている
		console.log( a ) ;
g_algo = a;
	}
}