$.fn.taskboard = function(settings) {
	     
     var config = {  
				   data: "#",
				   collapsedByDefault: false,
				   update: function(){}
     }
 
     if (settings) $.extend(config, settings);

     this.each(function() {

    		// Sortables
    		$(this).find(".column").sortable({
    			connectWith: '.column',
    			items: '.portlet:not(.ui-state-disabled)',
    			handle: 'div.portlet-header',
    			placeholder: 'ui-state-highlight',
    			opacity: 0.7,
    			revert: 200,
    			tolerance: 'pointer',
    			cursor: 'move',
    			forcePlaceholderSize: true,
    			over: function(event, ui) { 
    				$(jQuery.data(ui.item, "last-selected-column")).removeClass("ui-state-focus");
    				jQuery.data(ui.item, "last-selected-column", ui.placeholder.parent());
    				
    				if(!(ui.placeholder.parent(".column:first").find(".portlet-dragged").length > 0)){
    					ui.placeholder.parent().addClass("ui-state-focus");
    				}
    			},
    			update: function(event, ui) { ui.item.parent().removeClass("ui-state-focus"); ui.item.removeClass("portlet-dragged"); },
    			start: function(event, ui) {
    				  $(ui.placeholder).addClass("ui-corner-all");
    				  $(ui.item).addClass("portlet-dragged");
    			}
    		});
    	 
     });
     
 	$(this).find(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
	.find(".portlet-header")
		.addClass("ui-widget-header ui-corner-all")
		.prepend('<span class="ui-icon ui-icon-carat-1-n" title="Minimalizuj/Maksymalizuj"></span>')
		.end()
	.find(".portlet-content");

 	$(this).find(".portlet-header .ui-icon-carat-1-n").click(function() {
		$(this).toggleClass("ui-icon-carat-1-n").toggleClass("ui-icon-carat-1-s");
		$(this).parents(".portlet:first").find(".portlet-content").toggle("fast");
	});
	
	// Show menu when #myDiv is clicked
 	$(this).find("div.portlet-content").contextMenu({
		menu: 'myMenu'
	},
		function(action, el, pos) {
		alert(action);
	});
 
    return this;
}

