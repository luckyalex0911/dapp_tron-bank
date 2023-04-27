"use strict";

var JSUtil = {

	dragElementsIn: function(){
		$(".drag-this-left").each(function(i, el) {
			JSUtil.applyDragEffect(el, "drag-left");
		});

		$(".drag-this-right").each(function(i, el) {
			JSUtil.applyDragEffect(el, "drag-right");
		});

		$(".drag-this-up").each(function(i, el) {
			JSUtil.applyDragEffect(el, "drag-up");
		});
	},

	applyDragEffect: function(el, className){
		var el = $(el);
		if (el.visible(true)) {
			el.addClass(className); 
		} 
	},

	checkRisingElements: function(){
		$(".rising-elm:not(.risen)").each(function(i,el){
			JSUtil.riseUp(el);
		});
	},

	riseUp: function(el){
		var $el = $(el);
		var trigger = $el.data("trigger");
		var $w = $(window);
		if(($w.scrollTop() + $w.height() ) > ($el.offset().top + trigger)){
			$(el).addClass('risen');
		}	
	},

	gaugeInitCheck: function(){
		$( ".gauge-container").each(function(i, el){
			var $elm = $(el);
			if($elm.visible(true)){
				var $span = $elm.siblings('span');
				if($span.html() == ""){
					var total = $elm.data('total');
					var current = $elm.data('current');
					var percent = (current/total)*360;
					$elm.css("transform", "rotate(-" + percent + "deg)");
					$span.html("0");
					var val = 0;
					var id = setInterval(frame, 10);
					function frame() {
						if (val >= current) {
							clearInterval(id);
							$span.html(current); // just to be sure.
						} else {
							val+= current / 200; 
							$span.html(Math.floor(val));
						}
					}
				}
			}
		});
	},

	initMobileMenu: function(){

		$(".side-menu-button").on('click', function(e){
			e.preventDefault();
			$('#mobile-menu').toggleClass('active');
		});


		$("#mobile-menu .arrow").on('click', function(e){
			e.preventDefault();
			var $this = $(e.target);
			var $li = $this.closest('li');
			$li.toggleClass('expanded');
			$li.children('.mobile-submenu').slideToggle();
		});
	}


};

(function ($) {

	JSUtil.dragElementsIn();
	JSUtil.checkRisingElements();
	JSUtil.gaugeInitCheck();
	$( window ).scroll(function() {
		JSUtil.dragElementsIn();
		JSUtil.checkRisingElements();
		JSUtil.gaugeInitCheck();
	});


	$('#page-loader').fadeOut(600);

	$('.navbar-toggler').on('click', function(e){
		e.preventDefault();
		$(this).toggleClass('clicked');
		$('.navbar-collapse').toggleClass('collapse');
	});

	$('#page-loader').fadeOut(600);

	//Sliders



	$("#back-to-top").on("click", function(e){
		e.preventDefault();
		$('html,body').animate({ scrollTop: 0 }, 'ease');
		return false;
	});
	
	//Isotopes





	$(".widget-4 .widget-4-progress .progress-item a").on('click', function(e){
		e.preventDefault();
		var target = $(this).data("target");
		$(".widget-4 .widget-4-progress-item").removeClass("active");
		$("." + target).addClass("active");
	});



	JSUtil.initMobileMenu();


})(jQuery);