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
                var errorOccured = false;

                $('#toggleCardPortraitButton').click(toggleCardPortrait);

                function toggleCardPortrait() {

                    if (portraitLoaded === false) {
                        // need to load card portrait for first time
                        // load picture from gameforge
                        var imgUrl = 'https://cards.hex.gameforge.com/cardsdb_350x490/en/' + encodeURIComponent(scope.name) + '.png';
                        var $img = $('<img src="' + imgUrl + '" />')
                            .error(function() {
                                $('.card-portrait').parent().append('<p>Sorry, there was a problem loading the portrait.</p>').show();
                                portraitLoaded = true;
                                errorOccured = true;
                            })
                            .load(function() {
                                $('.card-portrait').append($img).show();
                                portraitVisible = true;
                                portraitLoaded = true;
                                errorOccured = false;
                            });
                    } else {
                        if (portraitVisible === false && errorOccured === false) {
                             $('.card-portrait').show();
                            portraitVisible = true;
                        } else {
                            $('.card-portrait').hide();
                            portraitVisible = false;
                        }
                    }

                }

            }
        };
    });
