'use strict';

angular.module('hexsales-client')
  .directive('cardImg', function() {
    return {
      scope: {
        name: '@',
        size: '@'
      },
      template: '<div> \
                    <div class="portrait-container card-portrait"> \
                      <img ng-src="http://hex.tcgbrowser.com/images/cards/{{size}}/{{name}}.jpg" /> \
                    </div> \
                    <!--<p class="subtitle">Image from hex.tcgbrowser.com</p>--> \
                </div>',
      link: function(scope, element, attrs) {
        $('.portrait-container').hide();
        $('.portrait-container img')
          .load(function() {
            $('.portrait-container').show();
          })
          .error(function() {
            $('#article-image-container').remove();
          });
      }
    };
  });
