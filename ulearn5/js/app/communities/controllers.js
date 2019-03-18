'use strict';

/**
 * @ngdoc overview
 * @name Communities views controllers
 * @description
 * #
 */

GenwebApp.controller('AllCommunities', ['_', 'plonePortalURL', 'CommunityInfo', 'CodeInfo', 'UserSubscriptions', 'SweetAlert', 'MAXInfo', '$http', '$window', '$timeout', '$translate', '$stateParams', '$filter', function (_, plonePortalURL, CommunityInfo, CodeInfo, UserSubscriptions, SweetAlert, MAXInfo, $http, $window, $timeout, $translate, $stateParams, $filter) {
    var self = this;
    self.currentPage = 1;
    self.pageSize = 10;
    self.user_subscriptions = [];
    self.user_communities = [];
    self.query = $stateParams.search || '';
    self.prom_allcommunities = $http({
            method: 'GET',
            url: plonePortalURL + '/api/communities',
            headers: {'X-CSRF-TOKEN': CodeInfo.csrf_token}
        })
        .then(function (response) {
            // All the visible communities for the current user (Open and Closed) used
            // in the iterator of the allcommunities view
            self.communities = response.data;
            self.communities_bck = response.data;
        });

    UserSubscriptions.query({
            username: MAXInfo.username,
            limit: 0,
            tags: '[COMMUNITY]'
        })
        .$promise.then(function (response) {
            // Holds the list of the URLs of the current user subscriptions
            self.user_subscriptions = _.pluck(response, 'url');
            // The user's current subscribed communities full info (merged from all
            // the site's communities self.communities and self.user_subscriptions
            self.prom_allcommunities.then(function () {
                self.user_communities = _.filter(self.communities, function (r) {
                    return _.contains(self.user_subscriptions, r.url);
                });
            });
        });

    self.searchby = function (qType2) {
        if (qType2 && qType2 != 'clear') {
            self.queryType = qType2;
        } else if (qType2 == 'clear') {
            self.queryType = '';
            qType2 = '';
        }
        var q = self.query || '';
        var qType = self.queryType || qType2 || '';

        if (((q.length > 2) || (q.length == 0)) && qType.length == 0) {
            self.communities = $filter('filter')(self.communities_bck, q);
        } else if (qType.length > 0 && q.length == 0) {
            self.communities = $filter('filter')(self.communities_bck, {
                type: qType
            });
        } else if (qType.length > 0 && q.length > 2) {
            var temp = $filter('filter')(self.communities_bck, {
                type: qType
            });
            self.communities = $filter('filter')(temp, q);
        }
    }

    self.toggleFavorite = function (community) {
        $http({
                method: 'POST',
                url: community.url + '/toggle-favorite',
                headers: {
                    'X-CSRF-TOKEN': CodeInfo.csrf_token
                }
            })
            .then(function successCallback(response) {
                community.favorited = !community.favorited;
            },function errorCallback(response) {
                $translate(['ALLCOMMUNITIES_VIEW.FAVORITEDERROR'])
                    .then(function (translations) {
                        SweetAlert.swal({
                            title: 'Error',
                            description: translations['ALLCOMMUNITIES_VIEW.FAVORITEDERROR'],
                            type: 'error',
                            timer: 2000
                        });
                    });
            });
    };

    self.subscribe = function (community) {
        $translate(['COMMUNITY_SUBSCRIBE.TITLE',
                'COMMUNITY_SUBSCRIBE.SUCCESSBTN',
                'COMMUNITY_SUBSCRIBE.CANCELBTN',
                'COMMUNITY_SUBSCRIBE.DONE',
                'COMMUNITY_SUBSCRIBE.ERROR'
            ])
            .then(function (translations) {
                SweetAlert.swal({
                        title: translations['COMMUNITY_SUBSCRIBE.TITLE'],
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonText: translations['COMMUNITY_SUBSCRIBE.CANCELBTN'],
                        confirmButtonColor: '#60b044',
                        confirmButtonText: translations['COMMUNITY_SUBSCRIBE.SUCCESSBTN']
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $http({
                                    method: 'POST',
                                    url: community.url + '/subscribe',
                                    headers: {
                                        'X-CSRF-TOKEN': CodeInfo.csrf_token
                                    }
                                })
                                .then(function successCallback(response) {
                                    self.user_subscriptions.push(community.url);
                                    SweetAlert.swal({
                                        title: translations['COMMUNITY_SUBSCRIBE.DONE'],
                                        type: 'success',
                                        timer: 2000
                                    });
                                },function errorCallback(response) {
                                    $translate(['ALLCOMMUNITIES_VIEW.SUBSCRIBEERROR'])
                                        .then(function (translations) {
                                            SweetAlert.swal({
                                                title: 'Error',
                                                description: translations['ALLCOMMUNITIES_VIEW.SUBSCRIBEERROR'],
                                                type: 'error',
                                                timer: 2000
                                            });
                                        });
                                });
                        };
                    });
            });
    };

    self.unSubscribe = function (community) {
        $translate(['COMMUNITY_UNSUBSCRIBE.TITLE',
                'COMMUNITY_UNSUBSCRIBE.SUCCESSBTN',
                'COMMUNITY_UNSUBSCRIBE.CANCELBTN',
                'COMMUNITY_UNSUBSCRIBE.DONE',
                'COMMUNITY_UNSUBSCRIBE.ERROR'
            ])
            .then(function (translations) {
                SweetAlert.swal({
                        title: translations['COMMUNITY_UNSUBSCRIBE.TITLE'],
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonText: translations['COMMUNITY_UNSUBSCRIBE.CANCELBTN'],
                        confirmButtonColor: '#60b044',
                        confirmButtonText: translations['COMMUNITY_UNSUBSCRIBE.SUCCESSBTN']
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $http({
                                    method: 'POST',
                                    url: community.url + '/unsubscribe',
                                    headers: {
                                        'X-CSRF-TOKEN': CodeInfo.csrf_token
                                    }
                                })
                                .then(function successCallback(response) {
                                    self.user_subscriptions.pop(community.url);
                                    community.favorited = false;
                                    SweetAlert.swal({
                                        title: translations['COMMUNITY_UNSUBSCRIBE.DONE'],
                                        type: 'success',
                                        timer: 2000
                                    });
                                },function errorCallback(response) {
                                    $translate(['ALLCOMMUNITIES_VIEW.UNSUBSCRIBEERROR'])
                                        .then(function (translations) {
                                            SweetAlert.swal({
                                                title: 'Error',
                                                description: translations['ALLCOMMUNITIES_VIEW.UNSUBSCRIBEERROR'],
                                                type: 'error',
                                                timer: 2000
                                            });
                                        });
                                });
                        }
                    });
            });
    };

    self.delete = function (community) {
        $translate(['ALLCOMMUNITIES_VIEW.CONFIRMDELETE',
                'COMMUNITY_SUBSCRIBE.CANCELBTN',
                'ALLCOMMUNITIES_VIEW.CONFIRMDELETEBTN',
                'ALLCOMMUNITIES_VIEW.DELETEDONE',
                'ALLCOMMUNITIES_VIEW.DELETEERROR'
            ])
            .then(function (translations) {
                SweetAlert.swal({
                        title: translations['ALLCOMMUNITIES_VIEW.CONFIRMDELETE'],
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonText: translations['COMMUNITY_SUBSCRIBE.CANCELBTN'],
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: translations['ALLCOMMUNITIES_VIEW.CONFIRMDELETEBTN']
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            // Delete the community
                            $http({
                                    method: 'DELETE',
                                    url: plonePortalURL + '/api/communities/' + community.gwuuid,
                                    headers: {
                                        'X-CSRF-TOKEN': CodeInfo.csrf_token
                                    }
                                })
                                .then(function successCallback(response) {
                                    SweetAlert.swal({
                                        title: translations['ALLCOMMUNITIES_VIEW.DELETEDONE'],
                                        type: 'success',
                                        timer: 2000
                                    });
                                    // Update community list
                                    self.communities = _.without(self.communities, _.findWhere(self.communities, {
                                        url: community.url
                                    }));
                                },function errorCallback(response) {
                                    SweetAlert.swal({
                                        title: translations['ALLCOMMUNITIES_VIEW.DELETEERROR'],
                                        type: 'error',
                                        timer: 2000
                                    });
                                });
                        }
                    });
            });
    };

    self.is_subscribed = function (url) {
        if (_.contains(self.user_subscriptions, url)) {
            return true;
        }
    };

    self.searchFilterAllCommunities = function (value) {
        jQuery('select.searchInput option').attr('selected', false);
        jQuery('select.searchInput').find('option[value="' + value + '"]').attr('selected', true);
        jQuery('select.searchInput').find('option[value="' + value + '"]').prop('selected', true);
        $timeout(function() {
            jQuery('select.searchInput option:selected').change();
        }, 100);
    };
}]);


GenwebApp.controller('SharedWithMe', ['_', 'plonePortalURL', 'CommunityInfo', 'CodeInfo', 'UserSubscriptions', 'SweetAlert', 'MAXInfo', '$http', '$window', '$timeout', '$translate', function (_, plonePortalURL, CommunityInfo, CodeInfo, UserSubscriptions, SweetAlert, MAXInfo, $http, $window, $timeout, $translate) {
    var self = this;
    self.currentPage = 1;
    self.pageSize = 10;
    self.shareditems = $http({
            method: 'GET',
            url: plonePortalURL + '/shared_with_me',
            headers: {'X-CSRF-TOKEN': CodeInfo.csrf_token}
        })
        .then(function (response) {
            // All the visible communities for the current user (Open and Closed) used
            // in the iterator of the allcommunities view
            self.shared_items = response.data;
        });

}]);

GenwebApp.controller('SearchUsersController', ['_', 'plonePortalURL', 'CommunityInfo', 'CodeInfo', 'UserSubscriptions', 'SweetAlert', 'MAXInfo', '$http', '$window', '$timeout', '$translate', '$scope', '$stateParams', function (_, plonePortalURL, CommunityInfo, CodeInfo, UserSubscriptions, SweetAlert, MAXInfo, $http, $window, $timeout, $translate, $scope, $stateParams) {
    var self = this;
    self.currentPage = 1;
    self.query = $stateParams.search || '';
    if (CommunityInfo.community_url == '') {
        self.portalURL = plonePortalURL;
    } else {
        self.portalURL = (CommunityInfo.community_url);
    }

    $scope.getFacultyLabel = function (obj) {
        return obj.replace(/&&/g, ' - ').replace(/\|\|/g, ' , ');
    }

    self.searchby = function (query) {

        var q = query || self.query;

        if (q == undefined) {
            q = ''
        }

        self.query = q;
        if ((q.length > 2) || (q.length == 0)) {
            self.response = $http({
                    method: 'GET',
                    url: self.portalURL + '/searchUser',
                    params: {search: q},
                    headers: {'X-CSRF-TOKEN': CodeInfo.csrf_token}
                })
                .then(function (response) {
                    self.big = response.data.users.big;
                    self.users = response.data.users;
                    self.properties = response.data.properties;
                    if (self.big == false) {
                        self.pageSize = 10;
                    } else {
                        self.pageSize = 100;
                    }
                });
        }
    }

    self.searchby();

}]);

GenwebApp.controller('Thinnkers', ['_', 'plonePortalURL', 'CommunityInfo', 'UserSubscriptions', 'SweetAlert', 'MAXInfo', '$http', '$window', '$timeout', '$translate', '$scope', '$stateParams', '$state', function (_, plonePortalURL, CommunityInfo, UserSubscriptions, SweetAlert, MAXInfo, $http, $window, $timeout, $translate, $scope, $stateParams, $state) {
    var self = this;
    self.query = $stateParams.search || '';


    self.searchby = function () {

        $state.go('search', {
            search: self.query
        })

    }

    self.searchbyenter = function (keyEvent) {

        if (keyEvent.which === 13) {
            $state.go('search', {
                search: self.query
            })
        }

    }


}]);
