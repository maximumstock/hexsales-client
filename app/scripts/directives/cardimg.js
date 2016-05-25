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
                </div>',
      link: function(scope, element, attrs) {
        $('.portrait-container').hide();

			// load picture from gameforge
			var imgUrl = 'https://cards.hex.gameforge.com/cardsdb/en/' + scope.name + '.png';
			var $img = $('<img src="' + imgUrl + '" />')
						.on('error', function() {return;})
						.on('load', function() {
							$('.card-portrait').append($img).show();
						});

				// var imgHost = "http://migration.tcgbrowser.com/files/full-size-jpg/";

				// // get uuid from hex.tcgbrowser.com
				// $.getJSON('http://hex.tcgbrowser.com/tools/tooltips/cardbyname.php?name=' + scope.name + '&callback=?', function(data) {
			
				// 	if (data.image) {
          
				// 		var $img = $('<img src="' + imgHost + data.guid + '.jpg" />')
				// 			.on('error', function() {return;})
				// 			.on('load', function() {
				// 				$('.card-portrait').append($img).show();
				// 			});

				// 	} 
				// 
				// });
				
      }
    };
  });
