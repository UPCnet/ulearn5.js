'use strict';

/**
 * @ngdoc overview
 * @name editACL
 * @description
 * # editACL controller
 * Controls the community edit ACL widget
 */

GenwebApp.directive('maxActivitiesCount', [function() {
    return {
      controller: ['$scope', '$element', '$attrs', 'UserActivities', 'ContextActivities', 'UsersComments', function($scope, $element, $attrs, UserActivities, ContextActivities, UsersComments) {
        if ($attrs.object === 'context') {
            ContextActivities.get_count($attrs.communityHash).then(
                function (response) {
                    $element.text(response.headers('X-totalItems'));
                    $scope.context_activities = response.headers('X-totalItems');
            });
            UsersComments.get_count($attrs.communityHash).then(
                  function (response) {
                      $scope.users_comments = response.headers('X-totalItems');
                  });
        }
        if ($attrs.object === 'user') {
            $scope.user_act_promise = UserActivities.get_count($attrs.username).then(
                function (response) {
                    $element.text(response.headers('X-totalItems'));
                    $scope.user_activities = response.headers('X-totalItems');
            });
        }
      }]
    };
}]);

GenwebApp.directive('badge', [function() {
    return {
      template: '<div><img title="{{badge_title}}" alt="{{badge_alt}}" ng-src="{{portal_url}}/{{badge_prefix}}{{badge_png}}" /></div>',
      scope: true,
      replace: true,
      link: function($scope, $element, $attrs) {
        $scope.badge_prefix = '++theme++ulearn5/assets/images/';
        $scope.badge_png = $attrs.image.replace('.png', '-alt.png').replace($scope.badge_prefix, '');
        if ($attrs.enabled === 'True') {
            $scope.badge_prefix = '';
            $scope.badge_png = $attrs.image;
            $scope.badge_title = $attrs.title;
            $scope.badge_alt = $attrs.alt;
        }
      },
      controller: ['$scope', '$element', '$attrs', 'plonePortalURL', function($scope, $element, $attrs, plonePortalURL) {
        $scope.portal_url = plonePortalURL;
        $scope.user_act_promise.then(
          function () {
            if (parseInt($scope.user_activities, 10) >= parseInt($attrs.threshold, 10)) {
                $scope.badge_prefix = '';
                $scope.badge_png = $attrs.image;
            }
            $scope.badge_title = $attrs.title;
            $scope.badge_alt = $attrs.alt;
        });
      }]
    };
}]);

GenwebApp.directive('lastauthors', [function() {
    return {
      controller: ['$scope', '$element', '$attrs', 'plonePortalURL', 'MAXInfo', 'TimelineLastAuthors', 'ContextLastAuthors', function($scope, $element, $attrs, plonePortalURL, MAXInfo, TimelineLastAuthors, ContextLastAuthors) {
        $scope.portal_url = plonePortalURL;
        $scope.url_max_server = MAXInfo.max_server;
        var limit = 8;
        if (jQuery('#box_thinkers[data-limit]').length > 0){
          limit = jQuery('#box_thinkers[data-limit]').attr('data-limit');
        }
        if ($attrs.type === 'timeline') {
          $scope.last_authors = TimelineLastAuthors.query({username: MAXInfo.username, limit: limit});
        } else {
          $scope.last_authors = ContextLastAuthors.query({hash: $attrs.communityHash, limit: limit});
        }
      }]
    };
}]);

GenwebApp.directive('generalstats', [function() {
    return {
      controller: ['$scope', '$element', '$attrs', 'MAXInfo', 'AllActivities', 'AllComments', function($scope, $element, $attrs, MAXInfo, AllActivities, AllComments) {
        AllActivities.get_count().then(
              function (response) {
                  $scope.all_activities = response.headers('X-totalItems');
              });
        AllComments.get_count().then(
              function (response) {
                  $scope.all_comments = response.headers('X-totalItems');
              });
      }]
    };
}]);
