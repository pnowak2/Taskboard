(function($) {
	
	$.fn.taskboard = function(settings) {
		     
	     var config = {  
					   data: "#",
					   allCollapsedByDefault: false,
					   update: function(){}
	     }
	     if (settings) $.extend(config, settings);

		handleTags(this);
		handleContextMenu(this);
		handleStyles(this);
		handleSortable(this);
		
	    return this;
	};
	
	/* Private functions */

	/*
	 * Handle Tags
	 */
	function handleTags(el){
		
		/* Header */
		var column = $("<div/>", {
			  "class": "column"
			})
		$("<div/>", {
			  "class": "column-header",
			  text: 'Header'
			}).appendTo(column);
		
		/* Portlet */
		var portlet = $("<div/>", {
			  "class": "portlet"
			}).appendTo(column);
			$("<div/>", {
				  "class": "portlet-header",
				  text: 'Portlet'
				}).appendTo(portlet);
			var portletContent = $("<div/>", {
				  "class": "portlet-content"
				}).appendTo(portlet);
		
				var taskPerson = $("<div/>", {
					  "class": "task-person"
					}).appendTo(portletContent);
				
					$("<span/>", {
						  "class": "ui-icon ui-icon-person atms-icon",
						}).appendTo(taskPerson);
					$("<span/>", {
						text: "Janus Pawel"
						}).appendTo(taskPerson);
				
				var taskPriority = $("<div/>", {
					  "class": "task-priority"
					}).appendTo(portletContent);
					$("<span/>", {
						  "class": "ui-icon ui-icon-flag",
						}).appendTo(taskPriority);
					$("<span/>", {
						text: "Normalny"
						}).appendTo(taskPriority);
					
				var taskDate = $("<div/>", {
					  "class": "task-date"
					}).appendTo(portletContent);
					$("<span/>", {
						  "class": "ui-icon ui-icon-calendar",
						}).appendTo(taskDate);
					$("<span/>", {
						text: "02-03-2010"
						}).appendTo(taskDate);
					
				var taskDescr = $("<div/>", {
					  "class": "task-description"
					}).appendTo(portletContent);
					$("<span/>", {
						  "class": "ui-icon ui-icon ui-icon-comment",
						}).appendTo(taskDescr);
					$("<span/>", {
						text: "BUG - Brak pola w rejestracji czasu pracy. Niniejszy blad wystepuje tylko w IE7."
						}).appendTo(taskDescr);
		
		el.append(column);
	}
	
	/*
	 * Creates portlet UI based on data
	 */
	function createPortlet(column, data){
		return;
	}
	
	function createColumn(data){
		return;
	}
	
	/*
	 * Handles sortables
	 */
	function handleSortable(el){
		// Sortables
		el.find(".column").sortable({
			connectWith: '.column',
			items: '.portlet:not(.ui-state-disabled)',
			handle: 'div.portlet-header',
			placeholder: 'ui-state-highlight',
			opacity: 0.7,
			revert: 200,
			tolerance: 'pointer',
			cursor: 'move',
			forcePlaceholderSize: true,
			over: overMethod,
			update: updateMethod,
			start: startMethod
		});
	}
	
	/*
	 * Handles UI tasks
	 */
	function handleStyles(el){
		el.find(".column .column-header").addClass("ui-widget-header");
	 	el.find(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".portlet-header")
			.addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-carat-1-n" title="Minimalizuj/Maksymalizuj"></span>')
			.end()
		.find(".portlet-content");
	
	 	el.find(".portlet-header .ui-icon-carat-1-n").click(function() {
			$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
			$(this).parents(".portlet:first").find(".portlet-content").toggle("fast");
		});
	}
	
	/*
	 * Handles context menu for portlets
	 */
	function handleContextMenu(el) {
		// Show menu when #myDiv is clicked
	 	el.find("div.portlet-content").contextMenu({
			menu: 'myMenu'
		},
			function(action, el, pos) {
			alert(action);
		});
	}
	
	/*
	 * Handles portlet over another column
	 */
	function overMethod(event, ui) { 
		$(jQuery.data(ui.item, "last-selected-column")).removeClass("ui-state-focus");
		jQuery.data(ui.item, "last-selected-column", ui.placeholder.parent());
		
		if(!(ui.placeholder.parent(".column:first").find(".portlet-dragged").length > 0)){
			ui.placeholder.parent().addClass("ui-state-focus");
		}
	}
	
	/*
	 * Handles finished update portlet drop on column
	 */
	function updateMethod(event, ui) { 
		ui.item.parent().removeClass("ui-state-focus"); 
		ui.item.removeClass("portlet-dragged"); 
	}
	
	/*
	 * Handles start drag of portlet
	 */
	function startMethod(event, ui) {
		  $(ui.placeholder).addClass("ui-corner-all");
		  $(ui.item).addClass("portlet-dragged");
	}
	
})(jQuery);