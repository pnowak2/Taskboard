(function($) {
	
	$.fn.portlets = function(settings) {
		     
	     var config = {  
	    		 	   element: $(this),
					   data: null,
					   portletsHeaderContextMenuId: null,
					   portletsHeaderContextMenuAction: function(action, header){},
					   legendContextMenuId: null,
					   legendContextMenuAction: function(action, legend){},
					   portletContextMenuId: null,
					   portletContextMenuAction: function(action, portlet){},
					   update: function(portlet, newColumn, oldColumn, row){}
	     }
	     if (settings) $.extend(config, settings);

		 handleTags(this);
		 handlePortletsHeaderContextMenu(this, config);
		 handleLegendContextMenu(this, config);
		 handlePortletContextMenu(this, config);
		 handleStyles(this);
		 handleSortable(this);
		 handleEvents(this);
		 handleTooltips(this);
		 
		 $(this).find(".atms-ui-portlet-row").each(function(){
		 	refreshHeight($(this));
		 });

		 refreshWidth();
		 $( window ).wresize( refreshWidth );
		 $(this).css("visibility", "visible");
		 
		 /*
		  * Handles width resize 
		  */
		 function refreshWidth(){
			 var finalWidth = 0;
			 var colWidth = config.element.find(".atms-ui-portlet-column:first").outerWidth(true);
			 var legendWidth = config.element.find(".atms-ui-portlet-column-legend:first").outerWidth(true);
			 var cols = 0;

			 config.element.find(".atms-ui-portlet-row:first-child").each(function(){
				 var localCols = $(this).find(".atms-ui-portlet-column").length;
				 if(localCols > cols){
					cols = localCols; 
				 }
			 });
			 finalWidth = (cols * colWidth) + legendWidth + 3

			 if(finalWidth > config.element.parent().width()){
				 config.element.width(finalWidth);	
			 }else{
				 config.element.width(config.element.parent().width());
			 }
		}
		 
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
	
	/* Private functions */

	/*
	 * Handle Tags
	 */
	function handleTags(el){
	 	el.find(".atms-ui-portlet-row:first-child .atms-ui-portlet-column").each(function(){
	 		$("<div/>", {
				  "class": ("atms-ui-portlet-column-pointer"),
				  text: $(this).find(".atms-ui-portlet-column-header").text()
			}).appendTo($(this));
	 	});
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
			.prepend('<span class="ui-icon ui-icon-carat-1-n"></span>');
		el.find(".atms-ui-portlet-column-legend").addClass(/*ui-widget-header*/"ui-state-highlight ui-corner-all");
		el.find(".atms-ui-portlet-column-header").addClass("ui-corner-all");
		el.find(".atms-ui-portlet-column-pointer").addClass("ui-state-highlight ui-corner-all");
		el.find(".atms-ui-portlet-row").addClass("ui-helper-clearfix ui-corner-all ui-widget-content");
		el.find(".atms-ui-portlet-column .atms-ui-portlet-column-header").addClass("ui-widget-header");
	 	el.find(".atms-ui-portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".atms-ui-portlet-header")
			.addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-carat-1-n"></span>')
			.end()
		.find(".atms-ui-portlet-content");
	 	
	 	el.find(".atms-ui-portlet-row").each(function(i){
	 		jQuery.data(this, "atms-ui-portlet-column-connect", i);

	 		$(this).find(".atms-ui-portlet-column").each(function(){
	 			$(this).addClass("atms-ui-portlet-column-connect-"+i);
	 		});
	 	});
	 	
	 	el.find(".atms-ui-portlet-collapsed .atms-ui-portlet-content").each(function(){
	 		$(this).hide();
	 		$(this).parents(".atms-ui-portlet:first").find(".ui-icon-carat-1-n").toggleClass(".ui-icon-carat-1-s");
	 	});
	}
	
	/*
	 * Handles events
	 */
	function handleEvents(el){
		el.find('.atms-ui-portlets-header .ui-icon-carat-1-n').bind('click', function(){
			$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
			$(this).parents(".atms-ui-portlets-main:first").find('.atms-ui-portlet-rows-container').toggle();
		});

	 	el.find(".atms-ui-portlet-header .ui-icon-carat-1-n").click(function() {
			$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
			$(this).parents(".atms-ui-portlet:first").find(".atms-ui-portlet-content").toggle(0, function(){
				refreshHeight($(this).parents(".atms-ui-portlet-row:first"));
			});
		});
	}
	
	/*
	 * Handles context menu for portlets
	 */
	function handlePortletContextMenu(el, config) {
		if(config.portletContextMenuId){
		 	el.find("div.atms-ui-portlet").contextMenu({
				menu: config.portletContextMenuId
			},
				function(action, el, pos) {
					config.portletContextMenuAction(action, el);
			});
		}
	}
	
	function handlePortletsHeaderContextMenu(el, config){
		if(config.portletsHeaderContextMenuId){
		 	el.find(".atms-ui-portlets-header").contextMenu({
				menu: config.portletsHeaderContextMenuId
			},
				function(action, el, pos) {
					config.portletsHeaderContextMenuAction(action, el);
			});
		}
	}
	
	/*
	 * Handles context menu for legends
	 */
	function handleLegendContextMenu(el, config) {
		if(config.legendContextMenuId){
		 	el.find(".atms-ui-portlet-column-legend").contextMenu({
				menu: config.legendContextMenuId
			},
				function(action, el, pos) {
					config.legendContextMenuAction(action, el);
			});
		 	
		 	el.find(".atms-ui-portlet-row").contextMenu({
				menu: config.legendContextMenuId
			},
				function(action, el, pos) {
					config.legendContextMenuAction(action, el.find(".atms-ui-portlet-column-legend:first"));
			});
		}
	}
	
	/*
	 * Handles tooltips
	 */
	function handleTooltips(el){
		 
		 el.find(".atms-ui-portlet-content:has(.atms-ui-portlet-tooltip)").tooltip({
				id: "atms-ui-tooltip-id",
				extraClass: "ui-state-default ui-corner-all",
				bodyHandler: function() {
		        	return $(this).find(".atms-ui-portlet-tooltip").html(); 
		    	}
		 });
	}
	
})(jQuery);