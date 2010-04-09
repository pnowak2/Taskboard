$(function() {
	// Sortables
	$(".column").sortable({
		connectWith: '.column',
		items: '.portlet:not(.ui-state-disabled)',
		handle: 'div.portlet-header',
		placeholder: 'ui-state-highlight',
		opacity: 0.7,
		revert: 100,
		tolerance: 'pointer',
		forcePlaceholderSize: true
	});

	$(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".portlet-header")
			.addClass("ui-widget-header ui-corner-all")
//			.prepend('<span class="ui-icon ui-icon-wrench" title="Edytuj"></span>')
//			.prepend('<span class="ui-icon ui-icon-person" title="Przypisz do mnie"></span>')
//			.prepend('<span class="ui-icon ui-icon-transfer-e-w" title="Przypisanie zadania"></span>')
//			.prepend('<span class="ui-icon ui-icon-clock" title="Rejestracja czasu"></span>')
			.prepend('<span class="ui-icon ui-icon-carat-1-n" title="Minimalizuj/Maksymalizuj"></span>')
			.end()
		.find(".portlet-content");

	$(".portlet-header .ui-icon-carat-1-n").click(function() {
		$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
		$(this).parents(".portlet:first").find(".portlet-content").toggle();
	});
	
	// Show menu when #myDiv is clicked
	$("div.portlet-content").contextMenu({
		menu: 'myMenu'
	},
		function(action, el, pos) {
		alert(action);
	});
});