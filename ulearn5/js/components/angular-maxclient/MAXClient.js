'use strict';

/**
 * @ngdoc function
 * @name MAXClient
 * @description
 * # Factories for accessing to a MAXServer.
 */


var MAXClient = angular.module('MAXClient', []);

MAXClient.factory('Contexts', ['$resource', 'MAXInfo', function($resource, MAXInfo) {
    return $resource(MAXInfo.max_server+'/contexts', null, {
        search: {method:'GET', params: {tags:'@tags', hash:'@hash'}, headers:MAXInfo.headers, isArray: true},
    });
}]);

MAXClient.factory('ApiInfo', ['$resource', 'MAXInfo', function($resource, MAXInfo) {
    return $resource(MAXInfo.max_server+'/info/api', null, {
        query: {method:'GET'},
        by_category: {method:'GET', params: {by_category:'1'}, isArray: true},
    });
}]);

MAXClient.factory('ContextActivities', ['$http', 'MAXInfo', function($http, MAXInfo) {
    // Head requests should be used with $http, as the values are in headers.
    var self = this;
    self.get_count = function(hash) {
        return $http.head(MAXInfo.max_server+'/contexts/' + hash + '/activities',
                      {headers:MAXInfo.headers});
    };
    return self;
}]);

MAXClient.factory('UserActivities', ['$http', 'MAXInfo', function($http, MAXInfo) {
    // Head requests should be used with $http, as the values are in headers.
    var self = this;
    self.get_count = function(username) {
        return $http.head(MAXInfo.max_server+'/people/' + username + '/activities',
                      {headers:MAXInfo.headers});
    };
    return self;
}]);

MAXClient.factory('TimelineLastAuthors', ['$resource', 'MAXInfo', function($resource, MAXInfo) {
    return $resource(MAXInfo.max_server+'/people/:username/timeline/authors', null, {
        query: {method:'GET', params: {limit:'@limit'}, headers:MAXInfo.headers, isArray: true},
    });
}]);

MAXClient.factory('ContextLastAuthors', ['$resource', 'MAXInfo', function($resource, MAXInfo) {
    return $resource(MAXInfo.max_server+'/contexts/:hash/activities/authors', null, {
        query: {method:'GET', params: {limit:'@limit'}, headers:MAXInfo.headers, isArray: true},
    });
}]);

MAXClient.factory('UsersComments', ['$http', 'MAXInfo', function($http, MAXInfo) {
    // Head requests should be used with $http, as the values are in headers.
    var self = this;
    self.get_count = function(context_hash) {
        return $http.head(MAXInfo.max_server+'/contexts/' + context_hash + '/comments',
                      {headers:MAXInfo.headers});
    };
    return self;
}]);

MAXClient.factory('AllActivities', ['$http', 'MAXInfo', function($http, MAXInfo) {
    // Head requests should be used with $http, as the values are in headers.
    var self = this;
    self.get_count = function() {
        return $http.head(MAXInfo.max_server+'/activities',
                      {headers:MAXInfo.headers});
    };
    return self;
}]);

MAXClient.factory('AllComments', ['$http', 'MAXInfo', function($http, MAXInfo) {
    // Head requests should be used with $http, as the values are in headers.
    var self = this;
    self.get_count = function() {
        return $http.head(MAXInfo.max_server+'/activities/comments',
                      {headers:MAXInfo.headers});
    };
    return self;
}]);

MAXClient.factory('UserSubscriptions', ['$resource', 'MAXInfo', function($resource, MAXInfo) {
    return $resource(MAXInfo.max_server+'/people/:username/subscriptions', null, {
        query: {method:'GET', params: {limit:'@limit', tags:'@tags'}, headers:MAXInfo.headers, isArray: true},
    });
}]);

MAXClient.factory('MAXInfo', ['MAXSession', '_MAXUI', function(MAXSession, _MAXUI) {
    var maxinfo = {};
    if (_MAXUI) {
        maxinfo.headers = {'X-Oauth-Username': _MAXUI.username,
                           'X-Oauth-Token': _MAXUI.oauth_token,
                           'X-Oauth-Scope': 'widgetcli'};
        maxinfo.max_server = _MAXUI.max_server;
        maxinfo.username = _MAXUI.username;
    } else {
        maxinfo.headers = {'X-Oauth-Username': MAXSession.username,
                           'X-Oauth-Token': MAXSession.oauth_token,
                           'X-Oauth-Scope': 'widgetcli'};
        maxinfo.max_server = MAXSession.max_server;
        maxinfo.username = MAXSession.username;
    }
    return maxinfo;
}]);

MAXClient.value('MAXSession', {
    username: '',
    oauth_token: '',
    max_server: ''
});

MAXClient.factory('_MAXUI', [function() {
    if (window._MAXUI !== undefined) {
        return window._MAXUI;
    } else {
        return false;
    }
}]);

MAXClient.directive('oauthinfo', [function() {
    return {
        restrict: 'E',
        controller: ['$scope', '$element', '$attrs', 'MAXSession', function($scope, $element, $attrs, MAXSession) {
            MAXSession.username = $attrs.username;
            MAXSession.oauth_token = $attrs.oauthToken;
            MAXSession.max_server = $attrs.maxServer;
        }]
    };
}]);
