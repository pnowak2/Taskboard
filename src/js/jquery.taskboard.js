(function($) {
	
	$.fn.taskboard = function(settings) {
		     
	     var config = {  
					   data: "#",
					   contextMenu: null,
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
	
	/* Public functions */

	/*
	 * Performs data refresh
	 */
	$.fn.taskboard.refresh = function() {
		
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
		
			createPortletItem("task-person", "ui-icon-person", "Janus Pawel").appendTo(portletContent);
			createPortletItem("task-priority", "ui-icon-flag", "Normalny").appendTo(portletContent);
			createPortletItem("task-date", "ui-icon-calendar", "02-03-2010").appendTo(portletContent);
			createPortletItem("task-description", "ui-icon ui-icon-comment", "BUG - Brak pola w rejestracji czasu pracy. Niniejszy blad wystepuje tylko w IE7.").appendTo(portletContent);
		
		el.append(column);
	}
	
	/*
	 * Creates portlet item
	 */
	function createPortletItem(clazz, icon, text) {
		var portletItem = $("<div/>", {
			  "class": clazz
			});
			$("<span/>", {
				  "class": ("ui-icon " + icon)
				}).appendTo(portletItem);
			$("<span/>", {
				text: text
				}).appendTo(portletItem);
			
		return portletItem;
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