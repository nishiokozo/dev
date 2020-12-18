'use strict';

let player =  {};

const	FONT_TYPE		= "12px monospace";
const	FONT_COLOR		= "#FFFFFF";
const	WND_COLOR	= "rgba(0,0,0,0.5)";

const	RENDER_WIDTH		= 256;
const	RENDER_HEIGHT		= 256;

const	MESSAGE_W = 180;
const	MESSAGE_H = 30	;
const	MESSAGE_X = (RENDER_HEIGHT - MESSAGE_W ) /2;
const	MESSAGE_Y = 84	+ RENDER_HEIGHT -130;

const	g_key = new Uint8Array( 0x100 );	//	キー入力バッファ
let	g_msg1 = null;
let	g_msg2 = null;

let env = new class
{
	constructor()
	{
		 this.ok = false;
//		 this.notitle = false;
//		 this.nosound = false;
////		 this.powerful = false;
	//	 this.noenemy = false;
		 this.dbgwin = false;
	}

	reload = function()
	{
		env.ok = false;
		let xhr = new XMLHttpRequest();
		xhr.open('GET', "data/env.json");

		xhr.onload = () => 
		{
			env.json = JSON.parse(xhr.response);
//			env.notitle = env.json[0].notitle;
//			env.nosound = env.json[0].nosound;
//			env.powerful = env.json[0].powerful;
//			env.noenemy = env.json[0].noenemy;
			env.dbgwin = env.json[0].dbgwin;
			env.ok = true;
		}
		xhr.send();
	}

};

const	TILE_FILENAME	= "img/tile.png";
const	PLAYER_FILENAME	= "img/player.png";


//Key
const	K_CR	= 13;
const	K_I		= 73;
const	K_O		= 79;
const	K_Z		= 90;
const	K_aL	= 37;
const	K_aU	= 38;
const	K_aR	= 39;
const	K_aD	= 40;




let map = new class
{
	constructor()
	{
		this.WIDTH = 32;
		this.HEIGHT = 32;
		this.TILESIZE	= 16;	// マップタイルサイズ
		this.buf = 
		[
			15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 1, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 6, 6, 3, 6, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 3, 0, 0, 0,
			 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 1, 3, 3, 3, 1, 3, 0, 0, 0,
			 0, 0, 3, 1, 1, 3, 6, 3, 7, 7, 7, 3, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
			 0, 0, 3, 3, 3, 3, 3, 6, 3, 7, 7, 7, 7, 7, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 1, 0, 1, 3, 3, 6, 3, 7, 7, 7, 7, 7, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 6, 6, 6, 3, 6, 3, 7, 7, 7, 7, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 0, 1, 3, 3, 6, 6, 3, 3, 3, 7, 7, 7, 7, 3, 3, 6, 6, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0,
			 0, 0, 0, 0, 0, 3, 6, 6, 6, 3, 3, 3, 7, 7, 7, 7, 7, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 1, 3, 0, 0,
			 0, 0, 0, 0, 0, 1, 7, 3, 6, 3, 3, 3, 3, 7, 3, 7, 7, 6, 6, 3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 0,
			 0, 0, 0, 0, 0, 0, 7, 7, 6, 3, 3, 3, 3, 3, 3, 7, 7, 7, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0,
			 0, 0, 0, 0, 0, 3, 7, 3, 3, 3, 6, 6, 3, 3, 3, 3, 3, 7, 7, 6, 6, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0,
			 0, 0, 0, 0, 0, 3, 3, 7, 3, 6, 3, 6, 6, 3, 4, 5, 3, 7, 7, 7, 6, 6, 3, 0, 0, 0, 0, 1, 0, 3, 3, 3,
			 0, 0, 0, 0, 0, 0, 0, 7, 7, 3, 3, 6, 3, 3, 8, 9, 3, 6, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3,
			 0, 0, 0, 0, 0, 0, 0, 7, 3, 3, 6, 3, 6, 3, 3, 3, 6, 6, 6, 0, 0, 0, 0, 0, 0, 3, 6, 3, 3, 3, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 6, 3, 6, 3, 3, 6, 6, 6, 6, 6, 6, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 3, 7, 7, 3, 6, 3, 3, 3, 6, 6, 6, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 3, 7, 3, 3, 3, 3, 6, 3, 3, 6, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 0, 3, 7, 7, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
			 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 3, 3, 3, 3, 6, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 7, 7, 3, 3, 3, 3, 3, 3, 3, 3, 6, 3, 3, 6, 0, 0, 0, 0, 0, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 7, 7, 0, 0, 0, 3, 0, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 7, 0, 0, 0, 0, 0, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0,
			 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0,
			 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
			 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
			 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		];
	}
};

let cam = new class
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
	}
};

//-----------------------------------------------------------------------------
function DrawMessage( g )
//-----------------------------------------------------------------------------
{
	if ( !g_msg1 ) return;

	let x = MESSAGE_X;
	let y = MESSAGE_Y;
	let w = MESSAGE_W;
	let h = MESSAGE_H;

	//ウインドウ
	g.fillStyle = WND_COLOR;
	g.fillRect( x, y, w, h );

	// メッセージ
	g.font = FONT_TYPE;
	g.fillStyle = FONT_COLOR;
	g.fillText( g_msg1, x+2, y+12 );
	if ( g_msg2 ) g.fillText( g_msg2,x+2, y+12+14 );

}

//-----------------------------------------------------------------------------
function DrawStatus( g )
//-----------------------------------------------------------------------------
{
	function DrawTextR( g, str, x, y )
	{
		g.textAlign = "right";
		g.fillText( str, x, y );
		g.textAlign = "left";
	}

	//ウインドウ
	g.fillStyle = WND_COLOR;
	g.fillRect( 2,2,120, 14 );

	//内容
	g.font = FONT_TYPE;
	g.fillStyle = FONT_COLOR;
	{
		g.font = FONT_TYPE;
		g.fillStyle = FONT_COLOR;
		var today = new Date();
		g.fillText( today.toLocaleString(), 4,13 );

	}
	
	// 全体地図表示
	{
		let	sx = 4;
		let	sy = 128;
		let	sw = 64;
		let	sh = 64;
		
		g.fillStyle = WND_COLOR;
		g.fillRect( sx-2, sy-2, sw+4, sh+4 );
		let col=
		[
			"#0000ff",
			"#00ff00"
		];
		for ( let y = 0 ; y < map.HEIGHT ; y++ )
		{
			for ( let x = 0 ; x < map.WIDTH ; x++ )
			{
				let idx = map.buf[ y * map.WIDTH + x ];
				if ( idx == 0 )
				{
					g.fillStyle = col[0];
				}
				else
				{
					g.fillStyle = col[1];
				}
		 	    g.fillRect( sx + x * 2, sy+y*2, 2, 2);
				
			}
		}
		// 
		{
			g.fillStyle = "#ff0000";
			let x = Math.floor(player.x/16);
			let y = Math.floor(player.y/16);
	 	    g.fillRect( sx + x * 2, sy+y*2, 2, 2);
		}
	}
	
   

	if ( env.dbgwin )
	{
		let sy = 40;
		let y = 1;
		g.fillStyle = WND_COLOR;
		g.fillRect( 2,sy,144,sy+14*4 );

		g.fillStyle = FONT_COLOR;
		g.fillText( "dbgwin " , 4,sy+14*y++ );

	}
}


//-----------------------------------------------------------------------------
function DrawField( g, cam_x, cam_y, map, player )
//-----------------------------------------------------------------------------
{
	let center_x = FW.rWidth/2
	let center_y = FW.rHeight/2;

	// マップの表示
	{
		let SZ = 9;
		for ( let y = -SZ ; y <= SZ ; y++ )
		{
			for ( let x = -SZ ; x <= SZ ; x++ )
			{
				let tx = x * map.TILESIZE - map.TILESIZE/2;
				let ty = y * map.TILESIZE - map.TILESIZE/2;
				// センタリング
				tx += (center_x)-(cam_x%map.TILESIZE);
				ty += (center_y)-(cam_y%map.TILESIZE);

				let mx = x +Math.floor(cam_x/map.TILESIZE);
				let my = y +Math.floor(cam_y/map.TILESIZE);
				// ループ処理
				mx = (mx + map.WIDTH) % map.WIDTH;
				my = (my + map.HEIGHT) % map.HEIGHT;

				let idx = map.buf[ my * map.WIDTH + mx ];

				let	ix = 0;
				let	iy = 0;
				if ( idx > 0 ) 
				{
					ix = 16;
					iy = 0;
				}
				g.drawImage( map.imgTile, ix, iy, map.TILESIZE,map.TILESIZE, tx, ty, map.TILESIZE, map.TILESIZE );
			}
		}
	}
	

	// プレイヤー表示
	{
		let w = 16;
		let h = 16;
		let	tx = player.x  +(center_x)-cam_x - 16/2;
		let	ty = player.y  +(center_y)-cam_y - 16/2;
		g.drawImage( 
			player.imgPlayer
			, 0,0
			, w, h
			, tx, ty
			, w, h 
		);	

	}



	// 境界線
	g.fillStyle = "#ff0000";g.fillRect(      (center_x-cam_x) -1,     0, 2, FW.rHeight );
	g.fillStyle = "#ff0000";g.fillRect(   0, (center_y-cam_y) -1, FW.rWidth,2 );

}

//-----------------------------------------------------------------------------
let circle = function( g, x,y,r )
//-----------------------------------------------------------------------------
{
	{
		g.beginPath();
		g.arc(x, y, r, 0, Math.PI * 2, true);
		g.closePath();
		g.stroke();
	}
}
//-----------------------------------------------------------------------------
FW.onPaint = function( g )
//-----------------------------------------------------------------------------
{
	{
		const s = 30;
		if ( (player.y-cam.y) > s ) cam.y += 1;
		if ( (player.y-cam.y) <-s ) cam.y -= 1;
		if ( (player.x-cam.x) > s ) cam.x += 1;
		if ( (player.x-cam.x) <-s ) cam.x -= 1;
	}

	g_msg1 = Math.floor(player.x/16)+","+Math.floor(player.y/16);
	
	if ( g_key[K_O] ) 
	{
		console.log( "player idx="+Math.floor(player.x-cam.x)+","+Math.floor(player.y-cam.y) ); 
	}


	DrawField( g, cam.x, cam.y, map, player );


	// ステータス表示
	DrawStatus( g );

	// メッセージ表示
	DrawMessage( g );


	circle( g, 100,100, 10 );

}

//-----------------------------------------------------------------------------
FW.onTick = function()
//-----------------------------------------------------------------------------
{
	if ( env.ok == false ) return;

	if ( g_key[K_I] ) 
	{
		console.log( "player pos="+Math.floor(player.x/16)+","+Math.floor(player.y/16) ); 
	}

		 if ( g_key[K_aL] )	{player.x -= 1; }
	else if ( g_key[K_aU] )	{player.y -= 1; }
	else if ( g_key[K_aR] )	{player.x += 1; }
	else if ( g_key[K_aD] )	{player.y += 1; }


}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;

	if ( g_key[c]!=0 ) return;

	g_key[c] = 1;

}

//-----------------------------------------------------------------------------
window.onkeyup = function( ev )
//-----------------------------------------------------------------------------
{
	g_key[ ev.keyCode ] = 0;
}

//-----------------------------------------------------------------------------
player.init = function()
//-----------------------------------------------------------------------------
{
	player.x = 128;
	player.y = 128;
}

//-----------------------------------------------------------------------------
window.onload = function() // <head>で呼ばれる
//-----------------------------------------------------------------------------
{
	env.reload();

	map.imgTile			= new Image();	map.imgTile.src			= TILE_FILENAME;
	player.imgPlayer	= new Image();	player.imgPlayer.src	= PLAYER_FILENAME;

	player.init();

	cam.x = player.x;
	cam.y = player.y;

	FW.init( RENDER_WIDTH, RENDER_HEIGHT );

}


