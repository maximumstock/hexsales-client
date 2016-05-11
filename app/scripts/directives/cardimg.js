'use strict';

angular.module('hexsales-client')
  .directive('cardImg', function() {
    return {
      scope: {
        name: '@'
      },
      template: '<div> \
                    <div class="portrait-container card-portrait"> \
                    </div> \
                    <!--<p class="subtitle">Image from hex.tcgbrowser.com</p>--> \
                </div>',
      link: function(scope, element, attrs) {
        $('.portrait-container').hide();
		
				var imgHost = "http://migration.tcgbrowser.com/files/full-size-jpg/";

				// get uuid from hex.tcgbrowser.com
				$.getJSON('http://hex.tcgbrowser.com/tools/tooltips/cardbyname.php?name=' + scope.name + '&callback=?', function(data) {
			
					if (data.image) {
          
						var $img = $('<img src="' + imgHost + data.guid + '.jpg" />')
							.on('error', function() {return;})
							.on('load', function() {
								$('.card-portrait').append($img).show();
							});

					} 
				
				});
				
      }
    };
  });
