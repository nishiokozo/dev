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
//	line(sx,sy,ex,sy ); // up
//	line(sx,ey,ex,ey ); // down
//	line(ex,sy,ex,ey );	// right
//	line(sx,sy,sx,ey );	// left
	g.beginPath();
//	g.moveTo( sx, sy );
//	g.lineTo( ex, sy );
//	g.lineTo( ex, ey );
//	g.lineTo( sx, ey );
    g.rect(1,1,ex-sx,ey-sx);
	g.closePath();
	g.stroke();

}

//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
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
//	g.arc(x, y, r, rad(70), rad(-250), true);
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
function cls()
//-----------------------------------------------------------------------------
{
	g.fillStyle = "#ffffffff";
	g.fillRect( 0,0,384,384 );
}

let cast ={};
cast.MAX = 10;
cast.cnt = 0;
cast.tbl = new Array(cast.MAX);
const THINK_NON = 0;	// 何もしない	その場で様子見。
const THINK_ATK = 1;	// 攻撃			接近戦	剣で戦う
const THINK_LAT = 2;	// ロング攻撃	距離戦	弓、魔法から適切なものが自動選択
const THINK_DIF = 3;	// 護衛			体力の弱い仲間を護衛する。
const THINK_MAB = 4;	// 回り込むB	背後に回り込む
const THINK_MAF = 5;	// 回り込むF	敵の前をふさぐ
const THINK_RUN = 6;	// 逃げる
const THINK_FIN = 7;	// 探す
const THINK_BAC = 8;	// 後退

const STAT_NON = 0;	// 特になし
const STAT_COL = 1;	// 衝突している（詰まって動けない）

for ( let i = 0 ; i < cast.MAX ; i++ )
{
	let gid=0;
	let x=0;
	let y=0;
	let flgActive=false;
	let time=0;
	let size=0;
	let name="";
	let dir=0;
	let think=THINK_NON;
	let stat=STAT_NON;
	cast.tbl[i] = {gid,x,y,size,name,flgActive,time,dir,think};
}

//-----------------------------------------------------------------------------
cast.add = function( gid, x, y, size, dir, name, think )
//-----------------------------------------------------------------------------
{
	if ( cast.cnt+1 >= cast.MAX ) return;
	cast.tbl[ cast.cnt ].gid = gid;	// グループID
	cast.tbl[ cast.cnt ].x = x;
	cast.tbl[ cast.cnt ].y = y;	
	cast.tbl[ cast.cnt ].size = size;	
	cast.tbl[ cast.cnt ].dir = dir;	
	cast.tbl[ cast.cnt ].name = name;	
	cast.tbl[ cast.cnt ].think = think;	//	思考ルーチン
	cast.cnt++;
}

//-----------------------------------------------------------------------------
cast.update = function()
//-----------------------------------------------------------------------------
{
	for ( let i = 0 ; i < cast.cnt ; i++ )
	{
		let one = cast.tbl[i];
		let px		= one.x;
		let py		= one.y;
		let size	= one.size;
		let time	= one.time;
		let name	= one.name;
		let dir		= one.dir;
		let think	= one.think;
	
		let	er = Math.cos(rad(time))*1.2;
		circle( px,py, er+size );
		print( px+size, py-size, name );
		let dx = size * Math.cos( dir ) + px;
		let dy = size * Math.sin( dir ) + py;
		line( px, py, dx, dy );

		one.time+=10;

		switch( think )
		{
		case THINK_NON:	// 何もしない	その場で様子見。
			// 方向を変える
			{
				let x0	= cast.tbl[0].x;
				let y0	= cast.tbl[0].y;
				let th = Math.atan2( (y0-py), (x0-px) );
				
				let s = th - one.dir;
				if ( s < rad(-180) ) s += rad(360);
				if ( s > rad( 180) ) s -= rad(360);
//if ( i==0)print(10,10,(cast.tbl[0].dir*180/3.14));
//if ( i==1)print(10,20,(cast.tbl[1].dir*180/3.14));
//if ( i==1)print(10,30,(s*180/3.14));
				one.dir += s/200;
			}
			break;

		case THINK_ATK:	// 攻撃			接近戦	剣で戦う
			break;

		case THINK_LAT:	// ロング攻撃	距離戦	弓、魔法から適切なものが自動選択
			break;

		case THINK_DIF:	// 護衛			体力の弱い仲間を護衛する。
			break;

		case THINK_MAW:	// 回り込む		敵グループの重心を中心に背後に回り込む
			break;

		case THINK_RUN:	// 逃げる
			break;

		}

		// 移動
//if(0)
		if( i != 0 )
		{
			px += Math.cos( dir )/4;
			py += Math.sin( dir )/4;
			
			let isCol = function() //衝突判定
			{
				let flg = false; 
				for ( let j = 0 ; j < cast.cnt ; j++ )
				{
					if ( j == i ) continue;
					let x1	= cast.tbl[j].x;
					let y1	= cast.tbl[j].y;
					let len	= cast.tbl[j].size + size;
					let far = Math.sqrt( (x1-px)*(x1-px) + (y1-py)*(y1-py) );			
					if ( len+5 > far ) flg = true;
				}
				return flg
			}
			
			if ( isCol() == false )
			{
				one.x = px;
				one.y = py;
			}
		}

	}
	{
		let x = 320;
		let y = 320;
		let i = 0;
		print(x,y+14*i++,"ティナ");
		print(x,y+14*i++,"戦う");
		print(x,y+14*i++,"援護");
		print(x,y+14*i++,"守備");
		print(x,y+14*i++,"退避");

		print(x-14,y+14*2,"＞");
	}

}

//-----------------------------------------------------------------------------
function update()
//-----------------------------------------------------------------------------
{
	cls();

	//circle( 192,192, 190);

	cast.update();
	
	box( 0,0, 383, 383 );
	
	requestAnimationFrame( update );

}

const	KEY_CR	= 13;
const	KEY_I	= 73;
const	KEY_O	= 79;
const	KEY_Z	= 90;
const	KEY_LEFT	= 37;
const	KEY_UP		= 38;
const	KEY_RIGHT	= 39;
const	KEY_DOWN	= 40;
//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;

	if ( c == KEY_LEFT	) cast.tbl[0].x -= 15;
	if ( c == KEY_RIGHT	) cast.tbl[0].x += 15;
	if ( c == KEY_UP	) cast.tbl[0].y -= 15;
	if ( c == KEY_DOWN	) cast.tbl[0].y += 15;

}



cast.add( 0, 160, 300, 16, rad(-90), "こーぞ",THINK_NON );
cast.add( 0, 100, 350, 16, rad(-90), "ティナ",THINK_NON );
cast.add( 0, 290, 300, 16, rad(-90), "ユイ",THINK_NON );

  cast.add( 1,100,  40, 25, rad(90),"ドラゴン",THINK_NON );
 cast.add( 1,192, 150, 36, rad(90), "ドラゴン",THINK_NON );
cast.add( 1,300, 130, 22, rad(90), "ドラゴン",THINK_NON );


requestAnimationFrame( update );

