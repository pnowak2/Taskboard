(function($) {
	
	$.fn.portlets = function(settings) {
		     
	     var config = {  
					   data: null,
					   contextMenu: null,
					   contextMenuAction: function(item, el){},
					   allCollapsedByDefault: false,
					   update: function(portlet, newColumn, oldColumn, row){}
	     }
	     if (settings) $.extend(config, settings);

		 handleTags(this);
		 handleContextMenu(this, config);
		 handleStyles(this);
		 handleSortable(this);
		 handleTooltips(this);
		 handleEvents(this);
     
		 $(this).find(".atms-ui-portlet-row").each(function(){
		 	refreshHeight($(this));
		 });
			
		/*
		 * Handles sortables
		 */
		function handleSortable(el){
			
			el.find(".atms-ui-portlet-row").each(function(){
				var i = jQuery.data(this, "atms-ui-portlet-column-connect");
		
				// Sortables
				$(this).find(".atms-ui-portlet-column").sortable({
					connectWith: '.atms-ui-portlet-column-connect-'+i,
					items: '.atms-ui-portlet:not(.ui-state-disabled)',
					handle: 'div.atms-ui-portlet-header',
					placeholder: 'ui-state-highlight',
					opacity: 0.7,
					revert: 200,
					tolerance: 'pointer',
					cursor: 'move',
					forcePlaceholderSize: true,
					over: overMethod,
					update: updateMethod,
					receive: receiveMethod,
					start: startMethod,
					stop: stopMethod
				});
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
			refreshHeight($(this).parents(".atms-ui-portlet-row:first"));
		}
		
		function receiveMethod(event, ui){
			config.update(ui.item, ui.item.parents(".atms-ui-portlet-column:first"), ui.sender, ui.item.parents(".atms-ui-portlet-row:first"));
		}
		
		/*
		 * Handles start drag of portlet
		 */
		function startMethod(event, ui) {
			  $(ui.placeholder).addClass("ui-corner-all");
			  $(ui.item).addClass("portlet-dragged");
			  
			  $(this).parents(".atms-ui-portlet-rows-container").find(".atms-ui-portlet-column-pointer").each(function(){
				  $(this).css("left", $(this).parents(".atms-ui-portlet-column:first").position().left + ($(this).parents(".atms-ui-portlet-column:first").width()/2) - ($(this).width()/1.28));
				  $(this).css("top", ui.placeholder.position().top + (ui.placeholder.height()/2) - ($(this).outerHeight(true)/2) );
				  $(this).show();
			  });
			  
		}
		
		function stopMethod(event, ui) {
			$(this).parents(".atms-ui-portlet-rows-container").find(".atms-ui-portlet-column-pointer").hide();
		}
		 
	     return this;
	};
	
	/* Public functions */

	/*
	 * Performs data refresh
	 */
	$.fn.portlets.refresh = function() {
		
	};
	
	/* Private functions */

	/*
	 * Handle Tags
	 */
	function handleTags(el){
		
		var portletsMain = $("<div/>", {
			  "class": "atms-ui-portlets-main"
			}).appendTo(el);
		$("<div/>", {
			  "class": "atms-ui-portlets-header",
			  text: "ATMS (ATMS)"
			}).appendTo(portletsMain);
		var portletsColumnsContainer = $("<div/>", {
			  "class": "atms-ui-portlet-rows-container"
			}).appendTo(portletsMain);
		var portletsRow = $("<div/>", {
			  "class": "atms-ui-portlet-row"
			}).appendTo(portletsColumnsContainer);
		
		
		var column = $("<div/>", {
			  "class": "atms-ui-portlet-column"
			});
		$("<div/>", {
			  "class": "atms-ui-portlet-column-header",
			  text: 'Header'
			}).appendTo(column);
		
		var columnLegend = $("<div/>", {
			  "class": "atms-ui-portlet-column-legend"
			});
		
		columnLegend.appendTo(portletsRow);
		column.appendTo(portletsRow);
		
		/* Portlet */
		var portlet = $("<div/>", {
			  "class": "atms-ui-portlet"
			}).appendTo(column);
		
			$("<div/>", {
				  "class": "atms-ui-portlet-header",
				  text: 'Portlet'
				}).appendTo(portlet);
			var portletContent = $("<div/>", {
				  "class": "atms-ui-portlet-content"
				}).appendTo(portlet);
		
			createPortletItem("ui-icon-person", "Janus Pawel").appendTo(portletContent);
			createPortletItem("ui-icon-flag", "Normalny").appendTo(portletContent);
			createPortletItem("ui-icon-calendar", "02-03-2010").appendTo(portletContent);
			createPortletItem("ui-icon ui-icon-comment", "BUG - Brak pola w rejestracji czasu pracy. Niniejszy blad wystepuje tylko w IE7.").appendTo(portletContent);
			
		 	el.find(".atms-ui-portlet-row:first-child .atms-ui-portlet-column").each(function(){
		 		$("<div/>", {
					  "class": ("atms-ui-portlet-column-pointer"),
					  text: $(this).find(".atms-ui-portlet-column-header").text()
				}).appendTo($(this));
		 	});
	}
	
	/*
	 * Creates portlet item
	 */
	function createPortletItem(icon, text) {
		var portletItem = $("<div/>", {
			  "class": "atms-ui-portlet-text-entry"
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
			$(this).find(".atms-ui-portlet").each(function(){
				portletHeights+=$(this).outerHeight(true);
			});
			if(portletHeights>totalHeight){
				totalHeight = portletHeights;
			 }
		});
		
		totalHeight+=15; // 15 for placeholder place
		
		/* If row contains headers, they should be calculated into total column height */
		if(el.find(".atms-ui-portlet-column .atms-ui-portlet-column-header").length>0){
			totalHeight+= el.find(".atms-ui-portlet-column-header").outerHeight(true);
		}
		el.find(".atms-ui-portlet-column, .atms-ui-portlet-column-legend").each(function(){ $(this).height(totalHeight);});
	}
	
	/*
	 * Handles UI tasks
	 */
	function handleStyles(el){
		el.addClass("atms-ui-portlet-container");
		el.find(".atms-ui-portlets-header").addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-carat-1-n" title="Minimalizuj/Maksymalizuj"></span>');
		el.find(".atms-ui-portlet-column-legend").addClass(/*ui-widget-header*/"ui-state-highlight ui-corner-all");
		el.find(".atms-ui-portlet-column-header").addClass("ui-corner-all");
		el.find(".atms-ui-portlet-column-pointer").addClass("ui-state-highlight ui-corner-all");
		el.find(".atms-ui-portlet-row").addClass("ui-helper-clearfix ui-corner-all ui-widget-content");
		el.find(".atms-ui-portlet-column .atms-ui-portlet-column-header").addClass("ui-widget-header");
	 	el.find(".atms-ui-portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".atms-ui-portlet-header")
			.addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-carat-1-n" title="Minimalizuj/Maksymalizuj"></span>')
			.end()
		.find(".atms-ui-portlet-content");
	 	
	 	el.find(".atms-ui-portlet-row").each(function(i){
	 		jQuery.data(this, "atms-ui-portlet-column-connect", i);

	 		$(this).find(".atms-ui-portlet-column").each(function(){
	 			$(this).addClass("atms-ui-portlet-column-connect-"+i);
	 		});
	 	});
	}
	
	/*
	 * Handles events
	 */
	function handleEvents(el){
		el.find('.atms-ui-portlets-header .ui-icon-carat-1-n').bind('click', function(){
			$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
			$(this).parents(".atms-ui-portlets-main:first").find('.atms-ui-portlet-rows-container').toggle("fast");
		});

	 	el.find(".atms-ui-portlet-header .ui-icon-carat-1-n").click(function() {
			$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
			$(this).parents(".atms-ui-portlet:first").find(".atms-ui-portlet-content").toggle("fast", function(){
				refreshHeight($(this).parents(".atms-ui-portlet-row:first"));
			});
		});
	}
	
	/*
	 * Handles context menu for portlets
	 */
	function handleContextMenu(el, config) {
		// Creates menu by config.contextMenu property
		if(config.contextMenu){
		 	el.find("div.atms-ui-portlet-content").contextMenu({
				menu: config.contextMenu
			},
				function(action, el, pos) {
					config.contextMenuAction(action, el);
			});
		}
	}
	
	/*
	 * Handles tooltips
	 */
	function handleTooltips(el){
		 el.find("*[title]").tooltip({
				id: "atms-ui-tooltip-id",
				extraClass: "ui-state-default ui-corner-all"
		 });
	}
	
})(jQuery);