(function($) {
	
	$.fn.taskboard = function(settings) {
		     
	     var config = {  
					   data: "#",
					   contextMenu: null,
					   contextMenuAction: function(item, el){},
					   allCollapsedByDefault: false,
					   update: function(){}
	     }
	     if (settings) $.extend(config, settings);
	     
			// handleTags(this);
			handleContextMenu(this, config);
			handleStyles(this);
			handleSortable(this);
	     
			refreshHeight(this);
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
			  "class": "atms-ui-portlet-column-header",
			  text: 'Header'
			}).appendTo(column);
		$("<div/>", {
			  "class": "task-column-pointer ui-state-highlight ui-corner-all",
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
	 * Recalculates heights
	 */
	function refreshHeight(el){
		var totalHeight = 0;
		el.find(".atms-ui-portlet-column").each(function(){
			var portletHeights = 0;
			$(this).find(".portlet").each(function(){
				portletHeights+=$(this).outerHeight(true);
			});
			if(portletHeights>totalHeight){
				totalHeight = portletHeights;
			 }
		});
		totalHeight+= el.find(".portlet-header").height();
		el.find(".atms-ui-portlet-column, .atms-ui-portlet-column-legend").each(function(){ $(this).height(totalHeight);});
	}
	
	/*
	 * Handles UI tasks
	 */
	function handleStyles(el){
		el.find(".atms-ui-portlet-column .atms-ui-portlet-column-header").addClass("ui-widget-header");
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
	function handleContextMenu(el, config) {
		// Creates menu by config.contextMenu property
		if(config.contextMenu){
		 	el.find("div.portlet-content").contextMenu({
				menu: config.contextMenu
			},
				function(action, el, pos) {
					config.contextMenuAction(action, el);
			});
		}
	}
	
	/*
	 * Handles sortables
	 */
	function handleSortable(el){
		// Sortables
		el.find(".atms-ui-portlet-column").sortable({
			connectWith: '.atms-ui-portlet-column',
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
			start: startMethod,
			stop: stopMethod
		});
	}
	
	/*
	 * Handles portlet over another column
	 */
	function overMethod(event, ui) { 
		$(jQuery.data(ui.item, "last-selected-column")).removeClass("ui-state-focus");
		jQuery.data(ui.item, "last-selected-column", ui.placeholder.parent());
		
		if(!(ui.placeholder.parent(".atms-ui-portlet-column:first").find(".portlet-dragged").length > 0)){
			ui.placeholder.parent().addClass("ui-state-focus ui-corner-all").css("border", "none");
		}
	}
	
	/*
	 * Handles finished update portlet drop on column
	 */
	function updateMethod(event, ui) { 
		ui.item.parent().removeClass("ui-state-focus"); 
		ui.item.removeClass("portlet-dragged");
		refreshHeight($(this).parent());
	}
	
	/*
	 * Handles start drag of portlet
	 */
	function startMethod(event, ui) {
		  $(ui.placeholder).addClass("ui-corner-all");
		  $(ui.item).addClass("portlet-dragged");
		  
		  $(this).parent().find(".task-column-pointer").each(function(){
			  $(this).css("left", $(this).parents(".atms-ui-portlet-column:first").position().left + ($(this).parents(".atms-ui-portlet-column:first").width()/2) - ($(this).width()/1.28));
			  $(this).css("top", ui.placeholder.position().top + (ui.placeholder.height()/2) - ($(this).outerHeight(true)/2) );
			  $(this).show();
		  });
		  
	}
	
	function stopMethod(event, ui) {
		$(this).parent().find(".task-column-pointer").hide();
	}
	
})(jQuery);