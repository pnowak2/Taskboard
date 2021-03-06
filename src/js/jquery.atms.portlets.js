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

	     var startTime = new Date().getTime();
	     
	     handleJQueryExtensions();
	     
	     var extensionsTime = new Date().getTime();
	     
		 handleTags(this);
		 
		 var tagsTime = new Date().getTime();
		 
		 handleDefaultContextMenu(this, config);
		 
		 var defContextMenuTime = new Date().getTime();
		 
		 handlePortletsHeaderContextMenu(this, config);
		 
		 var portHeaderContextMenuTime = new Date().getTime();
		 
		 handleLegendContextMenu(this, config);
		 
		 var legendContextMenuTime = new Date().getTime();
		 
		 handlePortletContextMenu(this, config);
		 
		 var portletContextmenuTime = new Date().getTime();
		 
		 handleStyles(this);
		 
		 var stylesTime = new Date().getTime();
		 
		 handleSortable(this);
		 
		 var sortableTime = new Date().getTime();
		 
		 handleEvents(this, config);
		 
		 var eventsTime = new Date().getTime();
		 
		 handleTooltips(this);
		 
		 var tooltipsTime = new Date().getTime();
		 
		 handleQuickSearch(this, config);
		 
		 var quickSearchTime = new Date().getTime();
		 
		 handleRefreshHeight(this);
		 
		 var refreshHeightTime = new Date().getTime();
		 
		 refreshWidth();
		 
		 var refreshWidthTime = new Date().getTime();

		 $( window ).wresize( refreshWidth );
		 $(this).css("visibility", "visible");
		 
//		 alert("tags: " + (tagsTime - extensionsTime) + "\n" +
//			   "defContextMenu: " + (defContextMenuTime - tagsTime) + "\n" +
//			   "portHeaderContextMenu: " + (portHeaderContextMenuTime-defContextMenuTime) + "\n" +
//			   "legendContextMenuTime: " + (legendContextMenuTime - portHeaderContextMenuTime) + "\n" +
//			   "portletContextmenuTime: " + (portletContextmenuTime - legendContextMenuTime) + "\n" +
//			   "stylesTime: " + (stylesTime - portletContextmenuTime) + "\n" +
//			   "sortableTime: " + (sortableTime - stylesTime) + "\n" +
//			   "eventsTime: " + (eventsTime - sortableTime)  + "\n" +
//			   "tooltipsTime: " + (tooltipsTime - eventsTime) + "\n" +
//			   "quickSearchTime: " + (quickSearchTime - tooltipsTime) + "\n" +
//			   "refreshHeightTime: " + (refreshHeightTime - quickSearchTime) + "\n" +
//			   "refreshWidthTime: " + (refreshWidthTime - refreshHeightTime) + "\n" +
//			   "OVERALL: " + (parseInt(tagsTime - extensionsTime) + 
//					   	      parseInt(defContextMenuTime - tagsTime) + 
//					   	      parseInt(portHeaderContextMenuTime-defContextMenuTime) + 
//					   	      parseInt(legendContextMenuTime - portHeaderContextMenuTime) + 
//					   	      parseInt(portletContextmenuTime - legendContextMenuTime) + 
//					   	      parseInt(stylesTime - portletContextmenuTime) + 
//					   	      parseInt(sortableTime - stylesTime) + 
//					   	      parseInt(eventsTime - sortableTime) + 
//					   	      parseInt(tooltipsTime - eventsTime) + 
//					   	      parseInt(quickSearchTime - tooltipsTime) + 
//					   	      parseInt(refreshHeightTime - quickSearchTime) +
//					   	      parseInt(refreshWidthTime - refreshHeightTime)
//				 )
//			   );
		 
		 /*
		  * Handles width resize 
		  * Calculates overall width of portlet component.
		  * If there are too many columns to fit into parent, it makes its container bigger and scroll bar
		  * appears.
		  */
		 function refreshWidth(){
			 var cols = 0;
			 var finalWidth = 5;
			 var rowChild = null;
			 var rowChilds = config.element.find(".atms-ui-portlet-row:first-child");

			 rowChilds.each(function(){
				 var localCols = $(this).find(".atms-ui-portlet-column").length;
				 if(localCols > cols){
					cols = localCols; 
					rowChild = $(this);
				 }
			 });

			 if(rowChild != null){
				 rowChild.children().each(function(){
					 finalWidth += $(this).outerWidth(true);
				 });
	
				 if(finalWidth > config.element.parent().width()){
					 config.element.width(finalWidth);	
				 }else{
					 config.element.width(config.element.parent().width());
				 }
			 }
		}
		 
		/*
		 * Handles sortables
		 * Makes any portlet draggable into columns.
		 */
		function handleSortable(el){
			
			el.find(".atms-ui-portlet-row").each(function(){		
				var cols = $(this).find(".atms-ui-portlet-column");
				// Sortables
				cols.sortable({
					connectWith: cols,
					items: '.atms-ui-portlet',
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

	}
	
	/*
	 * Refresh height to fit all portlets into columns and rows
	 */
	function handleRefreshHeight(el){
		el.find(".atms-ui-portlet-row").each(function(){
			refreshHeight($(this));
		});
	}
	
	/*
	 * Recalculates heights based on portlet sizes.
	 */
	function refreshHeight(el){		
		var totalHeight = 0;
		var cols = el.find(".atms-ui-portlet-column");
		cols.each(function(){
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
		var headers = cols.find(".atms-ui-portlet-column-header");
		if(headers.length>0){
			totalHeight+= headers.outerHeight(true);
		}
		el.children().each(function(){ $(this).height(totalHeight);});
	}
	
	/*
	 * Handles UI styles
	 * Any additional styles should be processed here.
	 */
	function handleStyles(el){

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
		 el.find(".atms-ui-portlet-column-legend").tooltip({
				id: "atms-ui-tooltip-id",
				extraClass: "ui-state-default ui-corner-all",
				bodyHandler: function() {
			 		var tooltip = $(this).find(".atms-ui-portlet-tooltip");
		        	return tooltip.length > 0 ? tooltip.html() : ""; 
		    	}
		 });
		
		 // Portlet tooltips
		 el.find(".atms-ui-portlet").tooltip({
				id: "atms-ui-tooltip-id",
				extraClass: "ui-state-default ui-corner-all",
				bodyHandler: function() {
			 		var tooltip = $(this).find(".atms-ui-portlet-tooltip");
		        	return tooltip.length > 0 ? tooltip.html() : ""; 
		    	}
		 });
	}
	
	/*
	 * Handles Quick Search feature for rapid portlet finding.
	 */
	function handleQuickSearch(el, config){
		if(config.showQuickSearch){
			el.find(".atms-ui-portlets-main").each(function(){
				 $(this).find(".atms-ui-portlets-header:first").append("<input type='text' class='ui-widget-content atms-ui-portlet-searchbox' value='" + config.quickSearchLabel + "'/>");
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