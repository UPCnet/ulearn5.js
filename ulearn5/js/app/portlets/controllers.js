'use strict';

/**
 * @ngdoc overview
 * @name editACL
 * @description
 * # editACL controller
 * Controls the community edit ACL widget
 */


GenwebApp.controller('profilePortlet', [function () {
  var self = this;

}]);

GenwebApp.controller('profilePortletModal', ['$scope', '$http', '$timeout', '$window', 'plonePortalURL', 'MAXInfo', 'CodeInfo', 'SweetAlert', '$translate', function ($scope, $http, $timeout, $window, plonePortalURL, MAXInfo, CodeInfo, SweetAlert, $translate) {
  $scope.selected = $scope.ngDialogData.community_type;
  $scope.changeCommunityType = function (selected) {
    var data = {community_type: selected};
    $http({
        method: 'PUT',
        url: plonePortalURL + '/api/communities/' + $scope.ngDialogData.community_hash,
        data: data,
        headers: {'X-CSRF-TOKEN': CodeInfo.csrf_token} + MAXInfo.headers
        })
        .then(function successCallback(response) {
          $scope.closeThisDialog();
          $timeout(function () { $window.location.reload(); }, 700);
        },function errorCallback(response) {
          $translate(['CHANGECOMMUNITYTYPE_VIEW.ERROR'])
            .then(function (translations) {
              SweetAlert.swal({
                title:'Error',
                description: translations['CHANGECOMMUNITYTYPE_VIEW.ERROR'],
                type:'error',
                timer: 2000});
            });
        });
  };

}]);

GenwebApp.controller('homeTopPageMenuButtons', ['ngDialog', 'plonePortalURL', '$http', function (ngDialog, plonePortalURL, $http) {
  var self = this;
  self.prom_appconfig = $http.get(plonePortalURL+'/api/appconfig')
    .then(function (response) {
      // All the visible communities for the current user (Open and Closed) used
      // in the iterator of the allcommunities view
      self.active_tab = response.data.buttonbar_selected;
    }
  );
}]);

GenwebApp.controller('homeTopPageMenuButtonsCA', ['ngDialog', '$scope', function (ngDialog, $scope) {
  var self = this;
  self.active_tab = 'stream';
  $scope.filtered_contents_search_ca_view = 'https://farm4.staticflickr.com/3261/2801924702_ffbdeda927_d.jpg';


}]);
