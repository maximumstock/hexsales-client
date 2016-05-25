'use strict';

angular.module('hexsales-client')
  .directive('cardImg', function() {
    return {
      scope: {
        name: '@'
      },
      template: '<div> \
					<button class="btn btn-default" id="toggleCardPortraitButton">Toggle Card Portrait</button> \
                    <div class="card-portrait"> \
                    </div> \
                </div>',
      link: function(scope, element, attrs) {
        $('.card-portrait').hide();

		var portraitLoaded = false;
		var portraitVisible = false;

		$('#toggleCardPortraitButton').click(toggleCardPortrait);

		function toggleCardPortrait() {
		
			if(portraitLoaded === false) {
				// need to load card portrait for first time
				// load picture from gameforge
				var imgUrl = 'https://cards.hex.gameforge.com/cardsdb_350x490/en/' + scope.name + '.png';
				var $img = $('<img src="' + imgUrl + '" />')
							.on('error', function() {
								$('.card-portrait').append('<p>There was a problem loading the portrait</p>').show();
								portraitLoaded = true;
							})
							.on('load', function() {
								$('.card-portrait').append($img).show();
								portraitVisible = true;
								portraitLoaded = true;
							});
			} else {
				if(portraitVisible === false) {
					$('.card-portrait').show();
					portraitVisible = true;
				} else {
					$('.card-portrait').hide();
					portraitVisible = false;
				}
			}
		
			
		
		}


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
