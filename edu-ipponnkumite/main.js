
//-----------------------------------------------------------------------------
function update()
//-----------------------------------------------------------------------------
{
	g_timer--;
	
	


	if ( g_timer <= 0 )
	{
		document.getElementById("html_set").innerHTML = g_set+1;

		switch( g_step )
		{
			case 3:
				{
					g_str0 = "国際松濤館";
					g_str1 = "一本組手";
					g_str2 = "";
				}
				break;


			case 4:	// 基本・自由タイトル表示インターバル
				{
					g_step = 2;
					g_timer = 60*0.2;
					g_str0 = "";
					g_str1 = "";
					g_str2 = "";
				}	
				break;

			case 2:	//	基本・自由タイトル表示
				{
					g_step = 1;
					g_timer = 60*2.5;
					g_str0 = "";
					g_str1 = g_tblWaza[g_cntWawa][0];
					g_str2 = "";
				}
				break;

			case 0:	//	 技表示
				{
					g_step = 1;
					let val = document.getElementById( "html_interval" ).value*1;
					g_timer = 60*val;

					g_str0 = g_tblWaza[g_cntWawa][0];
					g_str1 = g_tblWaza[g_cntWawa][1];
					g_str2 = g_tblWaza[g_cntWawa][2];

					let prev = g_cntWawa;

					g_cntWawa++;
					if ( g_cntWawa >= g_tblWaza.length )
					{
						g_set++;

						set_param( true );	//	シャッフルあり
						g_cntWawa = 0;
					}

					if ( g_tblWaza[g_cntWawa][0] != g_tblWaza[prev][0] )
					{
						g_step = 4;
					}

				}	
				break;

			case 1:	// 技表示インターバル
				{
					g_step = 0;
					g_timer = 60*0.5;
					g_str1 = "";
					g_str2 = "";
				}	
				break;



		}
	}
	


	document.getElementById("html_message0").innerHTML = g_str0;
	document.getElementById("html_message1").innerHTML = g_str1;
	document.getElementById("html_message2").innerHTML = g_str2;


	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = requestAnimationFrame( update );
}
let g_reqId = null;
let g_timer = 0;
let g_step = 0;
let g_tblWaza=[];
let g_cntWawa = 0;
let	g_str0 = "";
let	g_str1 = "";
let	g_str2 = "";
let	g_set = 0;

//-----------------------------------------------------------------------------
function set_param( flgShuffle )
//-----------------------------------------------------------------------------
{


	let tblKihon = [];
	if ( document.getElementsByName( "html_kall" )[0].checked )
	{
		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","上段突き","一番"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","上段突き","二番"] );
		if ( document.getElementsByName( "html_knum3" )[0].checked ) tblKihon.push( ["基本一本","上段突き","三番"] );
		if ( document.getElementsByName( "html_knum4" )[0].checked ) tblKihon.push( ["基本一本","上段突き","四番"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","中段突き","一番"] );
		if ( document.getElementsByName( "html_knum3" )[0].checked ) tblKihon.push( ["基本一本","中段突き","三番"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","中段突き","二番"] );
		if ( document.getElementsByName( "html_knum4" )[0].checked ) tblKihon.push( ["基本一本","中段突き","四番"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"一番"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"二番"] );
		if ( document.getElementsByName( "html_knum3" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"三番"] );
		if ( document.getElementsByName( "html_knum4" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"四番"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","横蹴込み","一番"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","横蹴込み","二番"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","回し蹴り","一番"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","回し蹴り","二番"] );


	}

	let tblJyuu = [];
	if ( document.getElementsByName( "html_jall" )[0].checked )
	{
		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","一番"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","二番"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","三番"] );
		if ( document.getElementsByName( "html_jnum4" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","四番"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","一番"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","二番"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","三番"] );
		if ( document.getElementsByName( "html_jnum4" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","四番"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"一番"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"三番"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"二番"] );
		if ( document.getElementsByName( "html_jnum4" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"四番"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","横蹴り"  ,"一番"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","横蹴り"  ,"二番"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","横蹴り"  ,"三番"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","回し蹴り","一番"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","回し蹴り","二番"] );



//		if ( false == document.getElementsByName( "html_jshort" )[0].checked )
		{
			if ( document.getElementsByName( "html_jnum1b" )[0].checked ) tblJyuu.push( ["自由一本","後ろ蹴り","一番"] );
			if ( document.getElementsByName( "html_jnum2b" )[0].checked ) tblJyuu.push( ["自由一本","後ろ蹴り","二番"] );
			if ( document.getElementsByName( "html_jnum3b" )[0].checked ) tblJyuu.push( ["自由一本","後ろ蹴り","三番"] );

			if ( document.getElementsByName( "html_jnum1b" )[0].checked ) tblJyuu.push( ["自由一本","刻み突き","一番"] );
			if ( document.getElementsByName( "html_jnum2b" )[0].checked ) tblJyuu.push( ["自由一本","刻み突き","二番"] );
			if ( document.getElementsByName( "html_jnum3b" )[0].checked ) tblJyuu.push( ["自由一本","刻み突き","三番"] );

			if ( document.getElementsByName( "html_jnum1b" )[0].checked ) tblJyuu.push( ["自由一本","逆突き"  ,"一番"] );
			if ( document.getElementsByName( "html_jnum2b" )[0].checked ) tblJyuu.push( ["自由一本","逆突き"  ,"二番"] );
			if ( document.getElementsByName( "html_jnum3b" )[0].checked ) tblJyuu.push( ["自由一本","逆突き"  ,"三番"] );
		}
	}

	if ( flgShuffle )
	{

		function shuffle( tblSrc )
		{
			let tblDst = [];

			while( tblSrc.length > 0 )
			{
				n = tblSrc.length;
				k = Math.floor( Math.random() * n );

				tblDst.push( tblSrc[k] );
				tblSrc.splice( k, 1 );
			}
			return tblDst;
		}

		function shuffle_half( tbl, n )
		{
//console.log(Math.floor(tbl.length/4),n);
//console.log(tbl);
			for ( let i = 0 ; i < n ; i++ )	// 適当な回数入れ替え
			{
				let a = Math.floor( Math.random() * tbl.length );
				let b = Math.floor( Math.random() * tbl.length );

				[ tbl[b], tbl[a] ] = [ tbl[a], tbl[b] ];

			}
			return tbl;
		}
		tblKihon = shuffle_half( tblKihon, Math.floor(tblKihon.length/4) );
		tblJyuu = shuffle_half( tblJyuu, Math.floor(tblJyuu.length/4) );
	}

	g_tblWaza = tblKihon.concat( tblJyuu );

	if ( g_tblWaza.length == 0 )
	{
		g_tblWaza.push( ["データがありません","" ,""] );
	}

}

//-----------------------------------------------------------------------------
function reset()
//-----------------------------------------------------------------------------
{
	g_set = 0;
	g_step = 3;
	g_timer = 0;
	g_tblWaza=[];
	g_str0 = "";
	g_str1 = "";
	g_str2 = "";
	g_cntWawa = 0;

	set_param( false );	// 初回はシャッフルしない


	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = requestAnimationFrame( update );


}

reset();


//-----------------------------------------------------------------------------
function html_updateReset()
//-----------------------------------------------------------------------------
{
	g_set = 0;

	reset();
}
//-----------------------------------------------------------------------------
function html_updateStart()
//-----------------------------------------------------------------------------
{
	g_step = 4;
}
