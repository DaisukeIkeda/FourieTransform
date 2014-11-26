$(function() {
    "use strict";

    var dim = 4;
    var max_height = 8;
    var input_vec = [1, 1, 1, 1];
    var basic_vecs = [[1, 1, 1, 1],
		      [1, 1, -1, -1],
		      [1, -1, -1, 1],
		      [1, -1, 1, -1]];
    var factors = [1, 0, 0, 0]; //input_vec = \sum_i factors[i]*basic_vecs[i]
    var output_vec = [0, 0, 0, 0];
    var showBase_vec = [1, 1, 1, 1]; // 基底ベクトルを用いるかどうかのフラグ

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    function is_touch_device() {
        return !!('ontouchstart' in window) // works on most browsers
            || !!('onmsgesturechange' in window); // works on ie10
    }

    // 送信ブロックのベクトルを変化させる
    function change_input_vec(col, v){ // 1<=col<=dim, v = 1 or -1
	var tmp;
	if ( v == 1 && input_vec[col-1] < max_height ){
	    if ( input_vec[col-1] >= 0 ){
		tmp = max_height - input_vec[col-1];
		$("#panel" + tmp + '-' + col).attr("data-color-code", 1);
	    }
	    else{
		tmp = max_height + (-1)*input_vec[col-1];
		$("#panel" + tmp + '-' + col).attr("data-color-code", 0);
	    }

	    input_vec[col-1] += 1;
	}
	else if ( v == -1 && input_vec[col-1] > -max_height ){
	    if ( input_vec[col-1] > 0 ){
		tmp = max_height - input_vec[col-1] + 1; // 0 の分を一つ加える
		$("#panel" + tmp + '-' + col).attr("data-color-code", 0);
	    }
	    else{
		tmp = max_height + (-1)*input_vec[col-1] + 1;
		$("#panel" + tmp + '-' + col).attr("data-color-code", 1);
	    }

	    input_vec[col-1] -= 1;
	}

	// change display number
	$("#input_display" + col).html(input_vec[col-1]);
    }

    function inner_product(v1, v2) {
	var res=0;
	for(var i=0; i<dim; i++){
	    res += v1[i]*v2[i];
	}
	return(res);
    }

    function on_calc_bases(e) {
	console.log("on_calc_bases: ---- ");
	for(var i=0; i<dim; i++){
	    console.log("input=" + input_vec);
	    console.log("base=" + basic_vecs[i]);
	    factors[i] = inner_product(input_vec, basic_vecs[i])/4;//TODO きちんとノルムを計算する
	    console.log("result=" + factors[i]);
	}
	console.log(" ---- ");
	// 初期化
	$(".panel4base").each(function() {
            $(this).attr("data-color-code", 0);
	    $(this).attr("style", "height:30px;");
        });

	drow_bases();

	// change display number
	for(var i=0; i<dim; i++){
	    for(var j=1; j<=dim; j++){
		console.log("DEBUG: (i, j)=(" + i + ", " + j + "), factors[i]=" + factors[i] + ", basic_vecs[i][j-1]=" + basic_vecs[i][j-1]);
		$("#base_display" + (i+1) + j ).html(factors[i]*basic_vecs[i][j-1]);
	    }
	}
    }

    // 基本ブロックのベクトルを描画する
    function drow_bases(){
	var tmp, residue;
	var j;
	var tmp_vec = [0, 0, 0, 0];

	for(var k=0; k<dim; k++){// 基本ブロック(基底ベクトル)に関するループ
	    for(var col=1; col<=dim; col++){
		tmp_vec[col-1] = factors[k]*basic_vecs[k][col-1]; // k 基本ブロック×係数

		if ( col == dim ) console.log("tmp_vec=" + tmp_vec);

		var tmp_col = col + k*dim; // パネル上の列番号(1〜16)
		if ( tmp_vec[col-1] >= 0 ){
		    tmp = max_height - Math.ceil(tmp_vec[col-1]);
		    j=tmp+1;
		    while( j<= max_height){ // 整数部分の描画
			$("#panel4base" + j + '-' + tmp_col).attr("data-color-code", 1);
			j++;
		    }

		    residue = Math.ceil(tmp_vec[col-1]) - tmp_vec[col-1];
		    if ( residue > 0 ){ // 小数部分の描画
			tmp = max_height - Math.ceil(tmp_vec[col-1]);
			j=tmp+1;
			$("#panel4base" + j + '-' + tmp_col).attr("data-color-code", 1);
			$("#panel4base" + j + '-' + tmp_col).attr("style", "height:" + 30*(1-residue) + "px; bottom:-" + 30*residue + "px;");
		    }
		}
		else{
		    tmp = max_height + (-1)*Math.floor(tmp_vec[col-1]) + 1; // 0 の分を一つ加える
		    j=tmp-1;
		    while( j>= max_height+1){ // 整数部分の描画
			$("#panel4base" + j + '-' + tmp_col).attr("data-color-code", 1);
			j--;
		    }

		    residue = Math.floor(tmp_vec[col-1]) - tmp_vec[col-1];
		    console.log("residue="+residue);
		    if ( residue < 0 ){ // 小数部分の描画
			tmp = max_height + (-1)*Math.floor(tmp_vec[col-1]) + 1; // 0 の分を一つ加える
			j=tmp-1;
			console.log("j=" + j + ", tmp="+tmp);
			console.log("30*(1+residue)=" + 30*(1+residue) + ", 30*(-residue)="+30*(-residue));
			$("#panel4base" + j + '-' + tmp_col).attr("data-color-code", 1);
			$("#panel4base" + j + '-' + tmp_col).attr("style", "height:" + 30*(1+residue) + "px; top:0;");
		    }
		}
	    }
	}
    }

    function on_composite_vecs(e) { // for both mouse and touch
	// 初期化
	$(".panel4res").each(function() {
            $(this).attr("data-color-code", 0);
	    $(this).attr("style", "height:30px;");
        });

	// 出力ベクトルの初期化
	for(var i=0; i<dim; i++)
	    output_vec[i]=0;

	// 用いる基底ベクトルのオン/オフ(チェックボックス)
	for(var i=0; i<dim; i++){
	    // TODO i を使って、1 回で済ませたい
	    //console.log("DARUMA2" + $("#showBase" + (i+1) + ":checked"));
	    //if ( $("#showBase" + (i+1) + ":checked") == "1"){ 
	    //showBase_vec[i]=1;
	    //}else{
	    //showBase_vec[i]=0;
	    //}

	    if ( document.getElementById("showBase1").checked){
		showBase_vec[0]=1;
	    }else{
		showBase_vec[0]=0;
	    }
	    if ( document.getElementById("showBase2").checked){
		showBase_vec[1]=1;
	    }else{
		showBase_vec[1]=0;
	    }
	    if ( document.getElementById("showBase3").checked){
		showBase_vec[2]=1;
	    }else{
		showBase_vec[2]=0;
	    }
	    if ( document.getElementById("showBase4").checked){
		showBase_vec[3]=1;
	    }else{
		showBase_vec[3]=0;
	    }
	}

	console.log("on_composite_vecs: ---- ");
	for(var i=0; i<dim; i++){
	    console.log("factors[i]=" + factors[i]);
	    console.log("base[i]=" + basic_vecs[i]);
	    console.log("showBase[i]=" + showBase_vec[i]);
	    for(var j=0; j<dim; j++){
		output_vec[j] += factors[i] * showBase_vec[i] * (basic_vecs[i])[j];
	    }
	}

	console.log("result=" + output_vec);
	console.log(" ---- ");

	drow_output_vec();
	for(var i=1; i<=dim; i++){
	    // change display number
	    $("#output_display" + i).html(output_vec[i-1]);
	}
    }

    // 受信ブロックのベクトルを描画する
    function drow_output_vec(){
	var tmp, residue;
	var j;
	for(var col=1; col<=dim; col++){
	    if ( output_vec[col-1] >= 0 ){
		//tmp = max_height - output_vec[col-1];
		tmp = max_height - Math.ceil(output_vec[col-1]);
		//for(j=tmp+1; j<= max_height; j++){
		//    $("#panel4res" + j + '-' + col).attr("data-color-code", 1);
		//}
		j=tmp+1;
		while( j<= max_height){ // 整数部分の描画
		    $("#panel4res" + j + '-' + col).attr("data-color-code", 1);
		    j++;
		}

		residue = Math.ceil(output_vec[col-1]) - output_vec[col-1];
		if ( residue > 0 ){ // 小数部分の描画
		    tmp = max_height - Math.ceil(output_vec[col-1]);
		    j=tmp+1;
		    $("#panel4res" + j + '-' + col).attr("data-color-code", 1);
		    $("#panel4res" + j + '-' + col).attr("style", "height:" + 30*(1-residue) + "px; bottom:-" + 30*residue + "px;");
		}
	    }
	    else{
		//tmp = max_height + (-1)*output_vec[col-1] + 1; // 0 の分を一つ加える
		tmp = max_height + (-1)*Math.floor(output_vec[col-1]) + 1; // 0 の分を一つ加える
		//for(j=tmp-1; j>= max_height+1; j--){
		//    $("#panel4res" + j + '-' + col).attr("data-color-code", 1);
		//}
		j=tmp-1;
		while( j>= max_height+1){ // 整数部分の描画
		    $("#panel4res" + j + '-' + col).attr("data-color-code", 1);
		    j--;
		}

		residue = Math.floor(output_vec[col-1]) - output_vec[col-1];
		console.log("residue="+residue);
		if ( residue < 0 ){ // 小数部分の描画
		    tmp = max_height + (-1)*Math.floor(output_vec[col-1]) + 1; // 0 の分を一つ加える
		    j=tmp-1;
		    console.log("j=" + j + ", tmp="+tmp);
		    console.log("30*(1+residue)=" + 30*(1+residue) + ", 30*(-residue)="+30*(-residue));
		    $("#panel4res" + j + '-' + col).attr("data-color-code", 1);
		    $("#panel4res" + j + '-' + col).attr("style", "height:" + 30*(1+residue) + "px; top:0;");
		}

	    }
	}
    }

    function new_inputboard(){
	var row_holder, row;
	var cell;
	var panel;

	for (var i = 1; i <= 16; ++i) {
            row_holder = $('<div class="row-holder"></div>');
            row = $('<div id="row' + i + '" class="row"></div>');
            for (var j = 1; j <= dim; ++j) {
		cell = $('<div id="cell' + i + '-' + j + '" class="cell"></div>');
		panel = $('<div id="panel' + i + '-' + j + '" class="panel"></div>');

		panel.appendTo(cell);
		cell.appendTo(row);

		// 横軸の描画
		if ( i == max_height )
		    $('<style>#panel' + i + '-' + j + '{ border-bottom: 2px solid black}</style>').appendTo('head');
            }
            row.appendTo(row_holder);
            row_holder.appendTo('.board');
	}
    }

    // board4base
    function new_bases(){
	var row_holder, row;
	var cell;
	var panel;

	for (var i = 1; i <= 16; ++i) {
            row_holder = $('<div class="row-holder4base"></div>');
            row = $('<div id="row' + i + '" class="row"></div>');
            for (var j = 1; j <= 16; ++j) {
		var cell = $('<div id="cell' + i + '-' + j + '" class="cell"></div>');
		var panel = $('<div id="panel4base' + i + '-' + j + '" class="panel4base"></div>');
		panel.appendTo(cell);
		cell.appendTo(row);

		if ( i == max_height ){ // 横軸と縦軸の描画
		    if ( j % dim == 0 )
			$('<style>#panel4base' + i + '-' + j + '{ border-bottom: 2px solid black; border-right: 1px solid black}</style>').appendTo('head');
		    else
			$('<style>#panel4base' + i + '-' + j + '{ border-bottom: 2px solid black}</style>').appendTo('head');
		}else if ( j % dim == 0){
		    $('<style>#panel4base' + i + '-' + j + '{ border-right: 1px solid black}</style>').appendTo('head');
		}

            }
            row.appendTo(row_holder);
            row_holder.appendTo('.board2');
	}
    }

    function new_outputboard(){
	var row_holder, row;
	var cell;
	var panel;

	for (var i = 1; i <= 16; ++i) {
            row_holder = $('<div class="row-holder"></div>');
            row = $('<div id="row4res' + i + '" class="row"></div>');
            for (var j = 1; j <= dim; ++j) {
		cell = $('<div id="cell4res' + i + '-' + j + '" class="cell"></div>');
		panel = $('<div id="panel4res' + i + '-' + j + '" class="panel4res"></div>');

		panel.appendTo(cell);
		cell.appendTo(row);

		// 横軸の描画
		if ( i == 8 )
		    $('<style>#panel4res' + i + '-' + j + '{ border-bottom: 2px solid black}</style>').appendTo('head');
            }
            row.appendTo(row_holder);
            row_holder.appendTo('.board3');
	}
    }

    function initialize_inputboard(){
	for(var j = 1; j <= dim; j++){ // j は横軸
	    // we assume that initially input_vec[i] > 0
	    for(var i = max_height; i> max_height - input_vec[j-1]; i--){ // max_height(=8) が原点
		$("#panel" + i + '-' + j ).attr("data-color-code", 1);
	    }

	    // change display number
	    $("#input_display" + j).html(input_vec[j-1]);
	}
    }

    // ボードの描画
    new_inputboard();
    new_bases();
    new_outputboard();
    initialize_inputboard();

    /* 軸の番号 */
    var num_str;
    for (var i = 1; i <= 16; ++i) {
        num_str = (i <= max_height ? '' + max_height - i +1 : '' + max_height - i);
        $('<style>#row' + i + ':before { content: "' + num_str + '"; }</style>').appendTo('head');
        $('<style>#row4res' + i + ':before { content: "' + num_str + '"; }</style>').appendTo('head');
    }

    if (is_touch_device()) {
        // disable the overscroll effect on touch-capable environments.
	// http://www.html5rocks.com/en/mobile/touch/
	// http://stackoverflow.com/questions/2890361/disable-scrolling-in-an-iphone-web-application
	$(document).on('touchmove', function(e) {
            e.preventDefault();
	});
    }

    if (is_touch_device()) {
	// 増ボタン
        $("#up-button1").on('touchstart', function(){
	    return change_input_vec(1, 1);
	});
        $("#up-button2").on('touchstart', function(){
	    return change_input_vec(2, 1);
	});
        $("#up-button3").on('touchstart', function(){
	    return change_input_vec(3, 1);
	});
        $("#up-button4").on('touchstart', function(){
	    return change_input_vec(4, 1);
	});

	// 減ボタン
        $("#down-button1").on('touchstart', function(){
	    return change_input_vec(1, -1);
	});
        $("#down-button2").on('touchstart', function(){
	    return change_input_vec(2, -1);
	});
        $("#down-button3").on('touchstart', function(){
	    return change_input_vec(3, -1);
	});
        $("#down-button4").on('touchstart', function(){
	    return change_input_vec(4, -1);
	});

	// 計算ボタン
        $(".calc-button").on('mousedown', on_calc_bases);

	// 再構成ボタン
        $(".composite-button").on('touchstart', on_composite_vecs);
    }
    else {
	// 増ボタン
        $("#up-button1").on('click', function(){
	    return change_input_vec(1, 1);
	});
        $("#up-button2").on('click', function(){
	    return change_input_vec(2, 1);
	});
        $("#up-button3").on('click', function(){
	    return change_input_vec(3, 1);
	});
        $("#up-button4").on('click', function(){
	    return change_input_vec(4, 1);
	});

	// 減ボタン
        $("#down-button1").on('click', function(){
	    return change_input_vec(1, -1);
	});
        $("#down-button2").on('click', function(){
	    return change_input_vec(2, -1);
	});
        $("#down-button3").on('click', function(){
	    return change_input_vec(3, -1);
	});
        $("#down-button4").on('click', function(){
	    return change_input_vec(4, -1);
	});

	// 計算ボタン
        $(".calc-button").on('mousedown', on_calc_bases);

	// 再構成ボタン
        $(".composite-button").on('mousedown', on_composite_vecs);
    }

    // style for black&white panels
    i=0;
    $("<style>.panel[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    $("<style>.panel4base[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    $("<style>.panel4res[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    i=1;
    $("<style>.panel[data-color-code=\"" + i + "\"] { background-color: black; }</style>").appendTo("html > head");
    $("<style>.panel4base[data-color-code=\"" + i + "\"] { background-color: black; }</style>").appendTo("html > head");
    $("<style>.panel4res[data-color-code=\"" + i + "\"] { background-color: black; }</style>").appendTo("html > head");

});
