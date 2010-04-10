$(function() {
	// Sortables
	$(".column").sortable({
		connectWith: '.column',
		items: '.portlet:not(.ui-state-disabled)',
		handle: 'div.portlet-header',
		placeholder: 'ui-state-highlight',
		opacity: 0.7,
		revert: 200,
		tolerance: 'pointer',
		cursor: 'move',
		forcePlaceholderSize: true,
		over: function(event, ui) { ui.placeholder.parent().addClass("ui-state-highlight");},
		update: function(event, ui) { ui.item.parent().removeClass("ui-state-highlight"); },
		deactivate: function(event, ui) { ui.item.parent().removeClass("ui-state-highlight"); },
		out: function(event, ui) { ui.item.parent().removeClass("ui-state-highlight"); },
		start: function(event, ui) {
			  $(ui.placeholder).addClass("ui-corner-all");
		}
	});

	$(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".portlet-header")
			.addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-carat-1-n" title="Minimalizuj/Maksymalizuj"></span>')
			.end()
		.find(".portlet-content");

	$(".portlet-header .ui-icon-carat-1-n").click(function() {
		$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
		$(this).parents(".portlet:first").find(".portlet-content").toggle("fast");
	});
	
	// Show menu when #myDiv is clicked
	$("div.portlet-content").contextMenu({
		menu: 'myMenu'
	},
		function(action, el, pos) {
		alert(action);
	});
	
	$('#switcher').themeswitcher();

});