'use strict';

/**
 * @ngdoc overview
 * @name editACL
 * @description
 * # editACL controller Controls the community edit ACL widget Directive for
 *   attribute acl for adquiring the community ACL with the form encoded with
 *   JSON:
 *   <input
 *       type="hidden"
 *       acl="{"users": [{"role":
 *       "owner", "id": "victor.fernandez"}],
 *       "groups": [{"role": "writer", "id": "PAS"}]}">
 */

GenwebApp.controller('uLearnEditACL', ['$http', 'CodeInfo', 'plonePortalURL', 'MAXInfo', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTTranslations', '$location', '$window', 'SweetAlert', '$translate', '_', function ($http, CodeInfo, plonePortalURL, MAXInfo, DTOptionsBuilder, DTColumnDefBuilder, DTTranslations, $location, $window, SweetAlert, $translate, _) {
    var self = this;
    self.community_url = $location.absUrl().replace('/editacl', '');
    self.principals = [{
        id: 'No results found'
    }];
    self.group_results = [];
    self.users = [];
    self.roles = [];
    self.groups = [];
    self.active_tab = 'users';

    // Detect language
    var language = angular.element('html').attr('lang');

    // Default datatable options
    self.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withLanguage(DTTranslations[language]);

    self.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1)
    ];
    for (var i = 0; i < self.roles.length; i++) {
        self.dtColumnDefs.push(DTColumnDefBuilder.newColumnDef(2 + i).withOption('sSortDataType', 'dom-checkbox'));
    }

    self.dtColumnDefs.push(DTColumnDefBuilder.newColumnDef(self.roles.length + 2).notSortable());

    var last_query = '';
    var last_query_count = 0;
    self.searchUser = function (query) {
        return $http({
                method: 'GET',
                url: plonePortalURL + '/omega13usersearch',
                params: {q: query, last_query: last_query, last_query_count: last_query_count},
                headers: {
                    'X-CSRF-TOKEN': CodeInfo.csrf_token
                }
            })
            .then(function (response) {
                last_query = query;
                last_query_count = response.data.last_query_count;
                self.principals = response.data.results;
            });
    };
    self.searchGroup = function (query) {
        // self.group_results = [{id: 'PAS', displayName: 'PAS UPC'},
        //                       {id: 'PAS-340', displayName: 'UPCnet'}];
        return $http({
                method: 'GET',
                url: plonePortalURL + '/omega13groupsearch',
                params: {q: query},
                headers: {
                    'X-CSRF-TOKEN': CodeInfo.csrf_token
                }
            })
            .then(function (response) {
                self.group_results = response.data.results;
            });
    };
    self.selectUser = function ($item, $model, $select) {
        $item.role = 'reader';
        self.users.push($item);
    };
    self.selectGroup = function ($item, $model, $select) {
        $item.role = 'reader';
        self.groups.push($item);
    };
    self.deleteUser = function ($item) {
        document.getElementById($item.id).remove()
        self.users = _.without(self.users, _.findWhere(self.users, {
            id: $item.id
        }));
    };
    self.deleteGroup = function ($item) {
        document.getElementById($item.id).remove()
        self.groups = _.without(self.groups, _.findWhere(self.groups, {
            id: $item.id
        }));
    };
    self.saveAcl = function () {
        $http({
                method: 'POST',
                url: plonePortalURL + '/api/communities/' + self.gwuuid + '/subscriptions',
                data: {users: self.users, groups: self.groups},
                headers: {'X-CSRF-TOKEN': CodeInfo.csrf_token} + MAXInfo.headers
            })
            .then(function successCallback(response) {
                $window.location = self.community_url;
            },function errorCallback(response) {
                $translate(['EDITACL_VIEW.DESCRIPTION'])
                    .then(function (translations) {
                        SweetAlert.swal({
                            title: 'Error',
                            description: translations['EDITACL_VIEW.DESCRIPTION'],
                            type: 'error',
                            timer: 2000
                        });
                    });
            });
    };
}]);

GenwebApp.directive('acl', [function () {
    return {
        link: function ($scope, $element, $attrs) {
            var acl = angular.fromJson($attrs.acl);
            $scope.ctrl.users = acl.users;

            if (acl.groups !== undefined) {
                $scope.ctrl.groups = acl.groups;
            } else {
                $scope.ctrl.groups = [];
            }
        }
    };
}]);

GenwebApp.directive('roles', [function () {
    return {
        link: function ($scope, $element, $attrs) {
            var roles = angular.fromJson($attrs.roles);
            $scope.ctrl.roles = roles;
        }
    };
}]);
