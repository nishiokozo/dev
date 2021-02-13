"use strict";

let g_canvas=document.createElement('canvas');				// 新たに<canvas>タグを生成
let g;

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
let pset = function( sx,sy )
//-----------------------------------------------------------------------------
{	
	sx=sx+0.5;
	sy=sy+0.5;


	g.beginPath();
    g.rect(sx-1,sy-1,2,2);
	g.closePath();
	g.fillStyle = "#000000";
	g.fill();
	g.stroke();

}
//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey, col="#000" )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = col;
	g.lineWidth = 1.0;
	g.moveTo( sx, sy );
	g.lineTo( ex, ey );
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
let g2_line = function( sx,sy, ex,ey, col="#000" )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = col;
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



//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( let j = 0 ; j < n ; j++ ) r += Math.random();
	return r/n;
}



let SW;
let SH;

// ランダムシード
let g_bufA = [];
let g_bufB = [];
let g_bufC = [];

//-----------------------------------------------------------------------------
function update_paint()
//-----------------------------------------------------------------------------
{
	cls();


	// ぼかし
	function calc_blur( ty, num )
	{
		let p1 = document.getElementById( "html_ap1" ).value*1;
		let p2 = document.getElementById( "html_ap2" ).value*1;
		let p3 = document.getElementById( "html_ap3" ).value*1;
		for ( let i = 0 ; i < num ; i++ )
		{
			let tmp = [];
			for ( let x = 0 ; x < g_SZ ; x++ )
			{
				let mx = x-1; if ( mx < 0 )  mx = g_SZ-1;
				let px = x+1; if ( px >= g_SZ )  px = 0;
			
				tmp[x] = ( ty[mx]*p1 + ty[x]*p2 + ty[px]*p3 ) /(p1+p2+p3);
			}
			ty = tmp;
		}
		return ty;
	}

	// 描画
	function draw( buf, rateh, oy,str, col="#000" )
	{
		for ( let x = 1 ; x < g_SZ-1 ; x++ )
		{
			let y1 = SH-((buf[x])) * SH*rateh -oy; 
			let y2 = SH-((buf[x-1])) * SH*rateh -oy; 
//			if( flgBold ) pset( x, y1 );

			line( x+0.5, y1+0.5, x-1+0.5, y2+ 0.5, col );
		}	
		
		print(2,SH -oy-2, str );
	}

	// 自動レベル調整	
	function calc_autolevel( buf )
	{
		let max = 0;
		let min = 9999;
		for ( let x = 0 ; x < g_SZ ; x++ )
		{
			if ( max < buf[x] ) max = buf[x];
			if ( min > buf[x] ) min = buf[x];
		}
		let rate = 1.0/(max-min);
		for ( let i = 0 ; i < g_SZ ; i++ )
		{
			buf[i] = (buf[i] - min)*rate;
		}
	}

	// 鞣し
	let num1 = document.getElementById( "html_blur1" ).value*1;
	let buf1 = calc_blur( g_bufA, num1 );
	calc_autolevel(buf1);

	let num2 = document.getElementById( "html_blur2" ).value*1;
	let buf2 = calc_blur( g_bufB, num2 );
	calc_autolevel(buf2);

	let num3 = document.getElementById( "html_blur3" ).value*1;
	let buf3 = calc_blur( g_bufC, num3 );
	calc_autolevel(buf3);


	let buf9= [];
	{//合成
		let p1 = document.getElementById( "html_bp1" ).value*1;
		let p2 = document.getElementById( "html_bp2" ).value*1;
		let p3 = document.getElementById( "html_bp3" ).value*1;
		for ( let x = 0 ; x < g_SZ ; x++ )
		{
			buf9[x] =(buf1[x]*p1+buf2[x]*p2+buf3[x]*p3)/(p1+p2+p3);
		}
	}

	{
		let hight = document.getElementById( "html_hight" ).value*1;

		draw(buf1,hight,SH/4*3, "A");
		draw(buf2,hight,SH/4*2, "B");
		draw(buf3,hight,SH/4*1, "C");
		draw(buf9,hight,0, "A+B+C", "#F00" );
	}




	{ // 実際のキャンバスに転送
		let sx = 0;
		let sy = 0;
		let sw = g_canvas.width;
		let sh = g_canvas.height;
		let dx = 0;
		let dy = 0;
		let dw = html_canvas.width;
		let dh = html_canvas.height;
		let g=html_canvas.getContext('2d');
		g.drawImage( g_canvas,sx,sy,sw,sh,dx,dy,dw,dh);
	}

}




//-----------------------------------------------------------------------------
function hotstart()
//-----------------------------------------------------------------------------
{
	requestAnimationFrame( update_paint );
}

let g_SZ;
//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	g_SZ =  document.getElementById( "html_size" ).value * 1;

	g_canvas.width = g_SZ;
	g_canvas.height = html_canvas.height;
	g=g_canvas.getContext('2d');
	g.imageSmoothingEnabled = false; // スムージングOFF


	g_SZ = html_canvas.width;
	SH = html_canvas.height;

	// ランダムシード
	for ( let x = 0 ; x < g_SZ ; x++ )
	{
		g_bufA[x] = rand(1);		
		g_bufB[x] = rand(1);		
		g_bufC[x] = rand(1);		
	}
	hotstart();
}
