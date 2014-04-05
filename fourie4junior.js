$(function() {
    "use strict";

    var mouse_tracking;
    var touch_tracking = [];
    var dim = 4;
    var input_vec = [1, 1, 1, 1];
    var basic_vecs = [[1, 1, 1, 1],
		      [1, 1, -1, -1],
		      [1, -1, -1, 1],
		      [1, -1, 1, -1]];

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    function is_touch_device() {
        return !!('ontouchstart' in window) // works on most browsers
            || !!('onmsgesturechange' in window); // works on ie10
    }

    // 送信ブロックのベクトルを変化させる
    function change_vec(col, v){ // 1<=col<=dim, v = 1 or -1
	var tmp;
	if ( v == 1 && input_vec[col-1] < 8 ){
	    if ( input_vec[col-1] >= 0 ){
		tmp = 8 - input_vec[col-1];
		$("#panel" + tmp + '-' + col).attr("data-color-code", 1);
	    }
	    else{
		tmp = 8 + (-1)*input_vec[col-1] + 1; // 0 の分を一つ加える
		$("#panel" + tmp + '-' + col).attr("data-color-code", 0);
	    }

	    input_vec[col-1] += 1;
	}
	else if ( v == -1 && input_vec[col-1] > -8 ){
	    if ( input_vec[col-1] > 0 ){
		tmp = 8 - input_vec[col-1] + 1; // 0 の分を一つ加える
		$("#panel" + tmp + '-' + col).attr("data-color-code", 0);
	    }
	    else{
		tmp = 8 + (-1)*input_vec[col-1] + 1;
		$("#panel" + tmp + '-' + col).attr("data-color-code", 1);
	    }

	    input_vec[col-1] -= 1;
	}

	// change display number
	$("#display" + col).html(input_vec[col-1]);
    }

    function inner_product(v1, v2) {
	var res=0;
	for(var i=0; i<dim; i++){
	    res += v1[i]*v2[i];
	}
	return(res);
    }

    function on_calc_bases(e) {
	for(var i=0; i<dim; i++){
	    console.log("input=" + input_vec);
	    console.log("base=" + basic_vecs[i]);
	    var r = inner_product(input_vec, basic_vecs[i]);
	    console.log("result=" + r);
	}
    }

    function on_button_down(e) { // for both mouse and touch
        $(".panel").each(function() {
	    $(this).attr("data-color-code", 0);
	});
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
		if ( i == 8 )
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

		if ( i == 8 ){ // 横軸と縦軸の描画
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
	    for(var i = 8; i> 8 - input_vec[j-1]; i--){ // 8 が原点
		$("#panel" + i + '-' + j ).attr("data-color-code", 1);
	    }

	    // change display number
	    $("#display" + j).html(input_vec[j-1]);
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
        num_str = (i <= 8 ? '' + 9 - i : '' + 8 - i);
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
	    return change_vec(1, 1);
	});
        $("#up-button2").on('touchstart', function(){
	    return change_vec(2, 1);
	});
        $("#up-button3").on('touchstart', function(){
	    return change_vec(3, 1);
	});
        $("#up-button4").on('touchstart', function(){
	    return change_vec(4, 1);
	});

	// 減ボタン
        $("#down-button1").on('touchstart', function(){
	    return change_vec(1, -1);
	});
        $("#down-button2").on('touchstart', function(){
	    return change_vec(2, -1);
	});
        $("#down-button3").on('touchstart', function(){
	    return change_vec(3, -1);
	});
        $("#down-button4").on('touchstart', function(){
	    return change_vec(4, -1);
	});

	// 計算ボタン
        $(".calc-button").on('mousedown', on_calc_bases);

	// クリアボタン
        $(".composite-button").on('touchstart', on_button_down);
    }
    else {
	// 増ボタン
        $("#up-button1").on('click', function(){
	    return change_vec(1, 1);
	});
        $("#up-button2").on('click', function(){
	    return change_vec(2, 1);
	});
        $("#up-button3").on('click', function(){
	    return change_vec(3, 1);
	});
        $("#up-button4").on('click', function(){
	    return change_vec(4, 1);
	});

	// 減ボタン
        $("#down-button1").on('click', function(){
	    return change_vec(1, -1);
	});
        $("#down-button2").on('click', function(){
	    return change_vec(2, -1);
	});
        $("#down-button3").on('click', function(){
	    return change_vec(3, -1);
	});
        $("#down-button4").on('click', function(){
	    return change_vec(4, -1);
	});

	// 計算ボタン
        $(".calc-button").on('mousedown', on_calc_bases);

	// クリアボタン
        $(".composite-button").on('mousedown', on_button_down);
    }

    // style for black&white panels
    i=0;
    $("<style>.panel[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    $("<style>.panel4base[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    $("<style>.panel4res[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    i=1;
    $("<style>.panel[data-color-code=\"" + i + "\"] { background-color: black; }</style>").appendTo("html > head");
    $("<style>.panel4base[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    $("<style>.panel4res[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");

});
