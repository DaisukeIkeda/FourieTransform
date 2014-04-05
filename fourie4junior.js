$(function() {
    "use strict";

    var mouse_tracking;
    var touch_tracking = [];

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    function is_touch_device() {
        return !!('ontouchstart' in window) // works on most browsers
            || !!('onmsgesturechange' in window); // works on ie10
    }

    function on_panel_mousedown(e) {
        mouse_tracking = {
            target: this,
            initial_panel_color: $(this).hasClass("white") ? "white" : "black"
        };
	//console.log($("#palette .color.selected"));
	//console.log($("#palette .color.selected").data("code"));
	//console.log(typeof $("#palette .color.selected").data("code"));
	$(this).attr("data-color-code", 1);
    }

    function on_panel_mousemove(e) {
        if (mouse_tracking && mouse_tracking.target !== this) {
	    $(this).attr("data-color-code", 1);
            mouse_tracking.target = this;
        }
    }

    function on_panel_mouseup(e) {
        mouse_tracking = null;
    }

    function on_panel_touchstart(e) {
        $.each(e.originalEvent.changedTouches, function(_, t) {
            var target = document.elementFromPoint(t.clientX, t.clientY);
            if ($(target).hasClass('panel')) {
                touch_tracking[t.identifier] = {
                    target: target,
                    initial_panel_color: $(target).hasClass("white") ? "white" : "black"
                };
		$(target).attr("data-color-code", 1);
            }
        });
    }

    function on_panel_touchmove(e) {
        $.each(e.originalEvent.changedTouches, function(_, t) {
            var target = document.elementFromPoint(t.clientX, t.clientY);
            if ($(target).hasClass('panel')) {
                if (touch_tracking[t.identifier] && touch_tracking[t.identifier].target !== target) {
		    $(target).attr("data-color-code", 1);

                    touch_tracking[t.identifier].target = target;
                }
            }
        });
    }

    function on_panel_touchend(e) {
        $.each(e.originalEvent.changedTouches, function(_, t) {
            touch_tracking[t.identifier] = null;
        });
    }

    // inputboard & outputboard
    for (var i = 1; i <= 16; ++i) {
        var row_holder = $('<div class="row-holder"></div>');
        var row = $('<div id="row' + i + '" class="row"></div>');
        for (var j = 1; j <= 4; ++j) {
            var cell = $('<div id="cell' + i + '-' + j + '" class="cell"></div>');
	    var panel = $('<div id="panel' + i + '-' + j + '" class="panel"></div>');
            panel.appendTo(cell);
            cell.appendTo(row);

	    if ( i == 8 ) // 横軸の描画
		$('<style>#panel' + i + '-' + j + '{ border-bottom: 2px solid black}</style>').appendTo('head');

        }
        row.appendTo(row_holder);
        row_holder.appendTo('.board');

	// board4base
        row_holder = $('<div class="row-holder2"></div>');
        row = $('<div id="row' + i + '" class="row"></div>');
        for (var j = 1; j <= 16; ++j) {
            var cell = $('<div id="cell' + i + '-' + j + '" class="cell"></div>');
	    var panel = $('<div id="panel' + i + '-' + j + '" class="panel"></div>');
            panel.appendTo(cell);
            cell.appendTo(row);

	    if ( i == 8 ){ // 横軸と縦軸の描画
		if ( j % 4 == 0 )
		    $('<style>#panel' + i + '-' + j + '{ border-bottom: 2px solid black; border-right: 1px solid black}</style>').appendTo('head');
		else
		    $('<style>#panel' + i + '-' + j + '{ border-bottom: 2px solid black}</style>').appendTo('head');
	    }else if ( j % 4 == 0){
		    $('<style>#panel' + i + '-' + j + '{ border-right: 1px solid black}</style>').appendTo('head');
	    }

        }
        row.appendTo(row_holder);
        row_holder.appendTo('.board2');

	/* 軸の名前*/
        var num_str = (i <= 8 ? '' + 9 - i : '' + 8 - i);
        $('<style>#row' + i + ':before { content: "' + num_str + '"; }</style>').appendTo('head');
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
        $(".panel").each(function() {
            $(this).on('touchstart', on_panel_touchstart);
            $(this).on('touchmove', on_panel_touchmove);
            $(this).on('touchend', on_panel_touchend);
        });
    }
    else {
        $(".panel").each(function() {
            $(this).on('mousedown', on_panel_mousedown);
            $(this).on('mousemove', on_panel_mousemove);
            $(this).on('mouseup', on_panel_mouseup);
        });
    }
    $(".edit-button").addClass("on");

    // style for black&white cells
    i=0;
    $("<style>.panel[data-color-code=\"" + i + "\"] { background-color: white; }</style>").appendTo("html > head");
    i=1;
    $("<style>.panel[data-color-code=\"" + i + "\"] { background-color: black; }</style>").appendTo("html > head");
});
