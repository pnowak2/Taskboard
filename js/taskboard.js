$(function() {
	$(".column").sortable({
		connectWith: '.column'
	});

	$(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".portlet-header")
			.addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-wrench"></span>')
			.prepend('<span class="ui-icon ui-icon-person"></span>')
			.prepend('<span class="ui-icon ui-icon-shuffle"></span>')
			.prepend('<span class="ui-icon ui-icon-calendar"></span>')
			.prepend('<span class="ui-icon ui-icon-carat-1-n"></span>')
			.end()
		.find(".portlet-content");

	$(".portlet-header .ui-icon").click(function() {
		$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
		$(this).parents(".portlet:first").find(".portlet-content").toggle();
	});

	$(".column").disableSelection();
});