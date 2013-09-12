// Plugin created by Daenu Probst http://codebrewery.blogspot.com/
(function ($) {
    $.fn.microTabs = function (options) {
        var opts = $.extend($.fn.microTabs.defaults, options);
        return this.each(function () {
			var obj = $(this);
			var header = $('<div class="microtabs-header"/>');
			var container = $('<div class="microtabs-container"/>');
			
			obj.children('.micro').each(function(i) {
				var a = $(this).children('a');
				var div = $(this).children('div');
				
				a.css('display', 'inline-block')
					.addClass('microtabs-button mt-b-' + i);
					
				div.addClass('microtabs-element mt-e-' + i)
					
				header.append(a);
				container.append(div);
				$(this).remove();
			});
			
			obj.append(header);
			obj.append(container);
			
			header.children('a').each(function(i) {
				var a = $(this);
				var n = getN(a.attr('class'), 'mt-b-');
				
				a.click(function() {
					$('.microtabs-button').removeClass('microtabs-selected');
					$(this).addClass('microtabs-selected');
					$('.microtabs-element').hide();
					$('.mt-e-' + n).show();
                    $.fn.microTabs.select = i;
					return false;
				});
				
				if(n != opts.selected)
					$('.mt-e-' + n).hide();
				else
					$('.mt-b-' + n).addClass('microtabs-selected');
			});
        });
		
		function getN(classes, starts) {
			var c = classes.split(' ');
			for(var i = 0; i < c.length; i++) {
				if(c[i].indexOf(starts) == 0)
					return c[i].replace(/[^0-9]/gi, '')
			}
		};
    };
	
    $.fn.microTabs.defaults = {
		selected: 0
    };
})(jQuery);
