/*
 * jQuery ATMS Portlets plugin
 * 
 * This plugin creates simple portlet-like behaviour based on given html markup.
 *
 * http://www.alan-systems.com
 *
 * Copyright (c) 2010 - Piotr Andrzej Nowak
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {
	
	$.fn.portlets = function(settings) {
		     
		 // Additional configuration
	     var config = {  
	    		 	   element: $(this),
	    		 	   showQuickSearch: true,
	    		 	   quickSearchLabel: "Search...",
					   data: null,
					   contextMenuCollapseAllLabel: "Collapse all",
					   contextMenuExpandAllLabel: "Expand all",
					   contextMenuRestoreExpandsLabel: "Restore default",
					   portletsHeaderContextMenuId: null,
					   portletsHeaderContextMenuAction: function(action, header){},
					   legendContextMenuId: null,
					   legendContextMenuAction: function(action, legend){},
					   portletContextMenuId: null,
					   portletContextMenuAction: function(action, portlet){},
					   legendAction: function(legend){},
					   beforeShowPortletsHeaderContextMenu: function(el, menu){},
					   beforeShowLegendContextMenu: function(el, menu){},
					   beforeShowPortletContextMenu: function(el, menu){},
					   update: function(portlet, newColumn, oldColumn, row){}
	     }
	     if (settings) $.extend(config, settings);

	     handleJQueryExtensions();
		 handleTags(this);
		 handleDefaultContextMenu(this, config);
		 handlePortletsHeaderContextMenu(this, config);
		 handleLegendContextMenu(this, config);
		 handlePortletContextMenu(this, config);
		 handleStyles(this);
		 handleSortable(this);
		 handleEvents(this, config);
		 
		 handleTooltips(this);
		 handleQuickSearch(this, config);
		 handleRefreshHeight(this);
		 refreshWidth();

		 $( window ).wresize( refreshWidth );
		 $(this).css("visibility", "visible");
		 
		 /*
		  * Handles width resize 
		  * Calculates overall width of portlet component.
		  * If there are too many columns to fit into parent, it makes its container bigger and scroll bar
		  * appears.
		  */
		 function refreshWidth(){
			 var finalWidth = 0;
			 var colWidth = config.element.find(".atms-ui-portlet-column:visible:first").outerWidth(true);
			 var legendWidth = config.element.find(".atms-ui-portlet-column-legend:visible:first").outerWidth(true);
			 var legendActionWidth = config.element.find(".atms-ui-portlet-column-legend-action:visible:first").outerWidth(true);
			 var cols = 0;

			 config.element.find(".atms-ui-portlet-row:first-child").each(function(){
				 var localCols = $(this).find(".atms-ui-portlet-column").length;
				 if(localCols > cols){
					cols = localCols; 
				 }
			 });
			 
			 finalWidth = (cols * colWidth) + legendWidth + legendActionWidth + 3

			 if(finalWidth > config.element.parent().width()){
				 config.element.width(finalWidth);	
			 }else{
				 config.element.width(config.element.parent().width());
			 }
		}
		 
		/*
		 * Handles sortables
		 * Makes any portlet draggable into columns.
		 */
		function handleSortable(el){
			
			el.find(".atms-ui-portlet-row").each(function(){		
				// Sortables
				$(this).find(".atms-ui-portlet-column").sortable({
					connectWith: $(this).find(".atms-ui-portlet-column"),
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
		 * Any jquery extensions are meant to be evaluated here
		 */
		function handleJQueryExtensions(){
		  // Extends jquery with containsNoCase predicate which is
		  // similar to contains, but its case insensitive
	      $.expr[":"].containsNoCase = function(el, i, m) {
	         var search = m[3];
	         if (!search) return false;
	         return new RegExp(search,"i").test($(el).text().replace(/\s+/g,' '));
	      };  
		}
		
		/*
		 * Handles portlet dragged on another column
		 */
		function overMethod(event, ui) { 
			$(jQuery.data(ui.item, "last-selected-column")).removeClass("ui-state-focus");
			jQuery.data(ui.item, "last-selected-column", ui.placeholder.parent());
			
			if(!(ui.placeholder.parent(".atms-ui-portlet-column:first").find(".portlet-dragged").length > 0)){
				ui.placeholder.parent().addClass("ui-state-focus ui-corner-all").css("border", "none");
			}
		}
		
		/*
		 * Handles successfull update after dropping portlet on column
		 */
		function updateMethod(event, ui) { 
			ui.item.parent().removeClass("ui-state-focus"); 
			ui.item.removeClass("portlet-dragged");
			refreshHeight($(this).parents(".atms-ui-portlet-row:first"));
		}
		
		/*
		 * Handles succesfull drop portlet on to column.
		 * After that it sends event to inform all observables.
		 */
		function receiveMethod(event, ui){
			config.update(ui.item, ui.item.parents(".atms-ui-portlet-column:first"), ui.sender, ui.item.parents(".atms-ui-portlet-row:first"));
		}
		
		/*
		 * Handles drag start on portlet
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
		
		/*
		 * Handles stop dragging portlet.
		 */
		function stopMethod(event, ui) {
			$(this).parents(".atms-ui-portlet-rows-container").find(".atms-ui-portlet-column-pointer").hide();
		}
		 
	     return this;
	};

	/*
	 * Handle Tags
	 * Any elements created on the fly and attached to DOM.
	 */
	function handleTags(el){
		// Creates column labels for noticing user where the column can be dropped to
	 	el.find(".atms-ui-portlet-row:first-child .atms-ui-portlet-column").each(function(){
	 		$("<div/>", {
				  "class": ("atms-ui-portlet-column-pointer"),
				  text: $(this).find(".atms-ui-portlet-column-header").text()
			}).appendTo($(this));
	 	});
	}
	
	/*
	 * Refresh height to fit all portlets into columns and rows
	 */
	function handleRefreshHeight(el){
		el.find(".atms-ui-portlet-row").each(function(){
			// Checks if theres any column legend and sets min height for columns
			var legend = $(this).find(".atms-ui-portlet-column-legend:first");
			$(this).find(".atms-ui-portlet-column-legend, .atms-ui-portlet-column-legend-action, .atms-ui-portlet-column").each(function(){
				$(this).css("min-height", legend ? legend.height() : 0);
			});
			
			
			refreshHeight($(this));
		});
	}
	
	/*
	 * Recalculates heights based on portlet sizes.
	 */
	function refreshHeight(el){		
		var totalHeight = 0;
		el.find(".atms-ui-portlet-column").each(function(){
			var portletHeights = 0;
			$(this).find(".atms-ui-portlet:visible").each(function(){
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
		el.find(".atms-ui-portlet-column, .atms-ui-portlet-column-legend, .atms-ui-portlet-column-legend-action").each(function(){ $(this).height(totalHeight);});
	}
	
	/*
	 * Handles UI styles
	 * Any additional styles should be processed here.
	 */
	function handleStyles(el){
		el.addClass("atms-ui-portlet-container");
		el.find(".atms-ui-portlets-header").addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-carat-1-n"></span>');
		el.find(".atms-ui-portlet-column-legend").addClass(/*ui-widget-header*/"ui-state-default ui-corner-all");
		el.find(".atms-ui-portlet-column-legend-action").addClass(/*ui-widget-header*/"ui-state-default ui-corner-all");
		el.find(".atms-ui-portlet-column-header").addClass("ui-corner-all");
		el.find(".atms-ui-portlet-column-pointer").addClass("ui-state-highlight ui-corner-all");
		el.find(".atms-ui-portlet-row").addClass("ui-helper-clearfix ui-corner-all ui-widget-content");
		el.find(".atms-ui-portlet-column .atms-ui-portlet-column-header").addClass("ui-state-default");
	 	el.find(".atms-ui-portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
		.find(".atms-ui-portlet-header")
			.addClass("ui-widget-header ui-corner-all")
			.prepend('<span class="ui-icon ui-icon-carat-1-n"></span>')
			.end()
		.find(".atms-ui-portlet-content");
	 	
	 	el.find(".atms-ui-portlet-collapsed .atms-ui-portlet-content").each(function(){
	 		$(this).hide();
	 		$(this).parents(".atms-ui-portlet:first").find(".atms-ui-portlet-header .ui-icon").removeClass("ui-icon-carat-1-n").addClass("ui-icon-carat-1-s");
	 	});
	}
	
	/*
	 * Handles events
	 * Any additional events should be added here.
	 */
	function handleEvents(el, config){
		// Expand/Collapse entire portlets container headers
		el.find('.atms-ui-portlets-header .ui-icon').bind('click', function(){
			$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
			$(this).parents(".atms-ui-portlets-main:first").find('.atms-ui-portlet-rows-container').toggle();
		});

		// Expand/Collapse portlet headers
	 	el.find(".atms-ui-portlet-header .ui-icon").click(function() {
			$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
			$(this).parents(".atms-ui-portlet:first").find(".atms-ui-portlet-content").toggle(0, function(){
				refreshHeight($(this).parents(".atms-ui-portlet-row:first"));
			});
		});
	 	
	 	el.find(".atms-ui-portlet-column-legend-action").each(function(){
	 		if(!$(this).hasClass("ui-state-disabled")){
		 		$(this).click(function(){
	 				config.legendAction($(this).prev(".atms-ui-portlet-column-legend"));
		 		});
		 		
		 		$(this).hover(
			 			function() {
			 				$(this).addClass("ui-state-highlight");
			 			}, 
			 			function(){
			 				$(this).removeClass("ui-state-highlight");
			 			}
			 	);
	 		}
	 	});
	}
	
	/*
	 * Handles default context menu
	 */
	function handleDefaultContextMenu(el, config){
		if(!config.portletsHeaderContextMenuId){
			if(!config.portletsHeaderContextMenuId) {
				config.portletsHeaderContextMenuId = el.attr('id') + 'PortletsHeaderContextMenu';
				el.append('<ul id="' + config.portletsHeaderContextMenuId + '" class="contextMenu ui-widget-content">');
			}
			if(!config.legendContextMenuId) {
				config.legendContextMenuId = el.attr('id') + 'LegendContextMenu';
				el.append('<ul id="' + config.legendContextMenuId + '" class="contextMenu ui-widget-content">');
			}
			if(!config.portletContextMenuId) {
				config.portletContextMenuId = el.attr('id') + 'PortletContextMenu';
				el.append('<ul id="' + config.portletContextMenuId + '" class="contextMenu ui-widget-content">');
			}
			
		}
		
		// Append default menu actions
		var collapseAll = '<li class="arrow-in ui-widget-content separator"><a href="#collapse-all">' + config.contextMenuCollapseAllLabel + '</a></li>';
		var expandAll = '<li class="arrow-out"><a href="#expand-all">' + config.contextMenuExpandAllLabel + '</a></li>';
		var restoreDefault = '<li class="arrow-switch"><a href="#restore-default">' + config.contextMenuRestoreExpandsLabel + '</a></li>';
			
		
		$("#"+config.portletsHeaderContextMenuId).append(collapseAll);
		$("#"+config.portletsHeaderContextMenuId).append(expandAll);
		$("#"+config.portletsHeaderContextMenuId).append(restoreDefault);
		// Prevent doubling items in menu if used the same ids for multiple menus.
		if(config.portletsHeaderContextMenuId != config.legendContextMenuId){
			$("#"+config.legendContextMenuId).append(collapseAll);
			$("#"+config.legendContextMenuId).append(expandAll);
			$("#"+config.legendContextMenuId).append(restoreDefault);	
		}
	}
	
	/*
	 * Handles context menu for entire portlets container headers
	 */
	function handlePortletsHeaderContextMenu(el, config){
	 	el.find(".atms-ui-portlets-header").contextMenu({
			menu: config.portletsHeaderContextMenuId,
			beforeShow: function(el, menu){ config.beforeShowPortletsHeaderContextMenu(el, menu); }
		},
			function(action, el, pos, data) {
				contextMenuAction(action, el, pos, config, data);
		});
	}
	
	/*
	 * Handles context menu for legends
	 */
	function handleLegendContextMenu(el, config) {
	 	el.find(".atms-ui-portlet-column-legend").contextMenu({
			menu: config.legendContextMenuId,
			beforeShow: function(el, menu){ config.beforeShowLegendContextMenu(el, menu); }
		},
			function(action, el, pos, data) {
				contextMenuAction(action, el, pos, config, data);
		});
	}
	
	/*
	 * Handles context menu for portlets
	 */
	function handlePortletContextMenu(el, config) {
	 	el.find("div.atms-ui-portlet").contextMenu({
			menu: config.portletContextMenuId,
			beforeShow: function(el, menu){ config.beforeShowPortletContextMenu(el, menu); }
		},
			function(action, el, pos, data) {
				contextMenuAction(action, el, pos, config, data);
		});
	}
	
	/*
	 * Handles all context menu actions
	 */
	function contextMenuAction(action, el, pos, config, data){	
		if(el.hasClass("atms-ui-portlets-header")){
			switch(action){
			case "collapse-all":
				collapseAll(el.parents(".atms-ui-portlets-main:first"));
				break;
			case "expand-all":
				expandAll(el.parents(".atms-ui-portlets-main:first"));
				break;
			case "restore-default":
				restoreExpands(el.parents(".atms-ui-portlets-main:first"));
				break;
			}
			
			config.portletsHeaderContextMenuAction(action, el, pos, data);
		}
		if(el.hasClass("atms-ui-portlet-column-legend")){
			switch(action){
			case "collapse-all":
				collapseAll(el.parents(".atms-ui-portlet-row:first"));
				break;
			case "expand-all":
				expandAll(el.parents(".atms-ui-portlet-row:first"));
				break;
			case "restore-default":
				restoreExpands(el.parents(".atms-ui-portlet-row:first"));
				break;
			}
			
			config.legendContextMenuAction(action, el, pos, data);
		}
		if(el.hasClass("atms-ui-portlet")){
			config.portletContextMenuAction(action, el, pos, data);
		}
	}
	
	/*
	 * Collapse all portlets
	 */
	function collapseAll(el){
		el.find(".atms-ui-portlet-content").hide();
		if(el.hasClass("atms-ui-portlet-row")){
			refreshHeight(el);
		}else{
			el.find(".atms-ui-portlet-row").each(function(){
				refreshHeight($(this));
			});
		}
	}
	
	/*
	 * Expand all portlets
	 */
	function expandAll(el){
		el.find(".atms-ui-portlet-content").show();
		if(el.hasClass("atms-ui-portlet-row")){
			refreshHeight(el);
		}else{
			el.find(".atms-ui-portlet-row").each(function(){
				refreshHeight($(this));
			});
		}
	}
	
	function restoreExpands(el){
		el.find(".atms-ui-portlet-content:not(.atms-ui-portlet-collapsed)").show();
		el.find(".atms-ui-portlet-collapsed").each(function(){
			$(this).find(".atms-ui-portlet-content").hide();
		});
		if(el.hasClass("atms-ui-portlet-row")){
			refreshHeight(el);
		}else{
			el.find(".atms-ui-portlet-row").each(function(){
				refreshHeight($(this));
			});
		}
	}
	
	/*
	 * Handles tooltips
	 */
	function handleTooltips(el){
		 // Legend tooltips
		 el.find(".atms-ui-portlet-column-legend:has(.atms-ui-portlet-tooltip)").tooltip({
				id: "atms-ui-tooltip-id",
				extraClass: "ui-state-default ui-corner-all",
				bodyHandler: function() {
		        	return $(this).find(".atms-ui-portlet-tooltip").html(); 
		    	}
		 });
		
		 // Portlet tooltips
		 el.find(".atms-ui-portlet-content:has(.atms-ui-portlet-tooltip)").tooltip({
				id: "atms-ui-tooltip-id",
				extraClass: "ui-state-default ui-corner-all",
				bodyHandler: function() {
		        	return $(this).find(".atms-ui-portlet-tooltip").html(); 
		    	}
		 });
	}
	
	/*
	 * Handles Quick Search feature for rapid portlet finding.
	 */
	function handleQuickSearch(el, config){
		if(config.showQuickSearch){
			el.find(".atms-ui-portlets-main").each(function(){
				 $(this).find(".atms-ui-portlets-header:first").append("<input type='text' class='ui-state-default atms-ui-portlet-searchbox' value='" + config.quickSearchLabel + "'/>");
			     var main = $(this);
			     var txtBox = $(this).find(".atms-ui-portlet-searchbox");
			     
			     txtBox.focus(function(){
			    	 if(txtBox.val() == config.quickSearchLabel){
			    		 $(this).val("");
			    	 }
			     });
			     txtBox.blur(function(){
			    	 if(txtBox.val() == config.quickSearchLabel || txtBox.val() == ""){
			    		 $(this).val(config.quickSearchLabel);
			    	 }
			     });
			     
			     txtBox.bind("keypress", function(event){
					 if(event.keyCode == 13){
						 var txt =  $(this).val();
						 main.find(".atms-ui-portlet-row").each(function(){
							 if(txt != ""){
								 var portlet = $(this);
								 var found = $(this).find(".atms-ui-portlet:containsNoCase('" + txt + "')").show().length;
								 $(this).find(".atms-ui-portlet:not(:containsNoCase('" + txt + "'))").hide();
								 (found>0) ? $(this).show() : $(this).hide();
							 }else{
								 $(this).find(".atms-ui-portlet").show();
								 $(this).show();
							 }
							 refreshHeight($(this));
						 });		 
					 }
				 });
			 });
		}
	}
	
})(jQuery);