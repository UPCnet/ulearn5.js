'use strict';

/**
 * @ngdoc overview
 * @name editACL
 * @description
 * #
 */

GenwebApp.controller('subscribeToOpenCommunity', ['_', 'CommunityInfo', 'CodeInfo', 'UserSubscriptions', 'SweetAlert', 'MAXInfo', '$http', '$window', '$timeout', '$translate', function (_, CommunityInfo, CodeInfo, UserSubscriptions, SweetAlert, MAXInfo, $http, $window, $timeout, $translate) {
    var self = this;
    self.show_alert = false;

    UserSubscriptions.query({
        username: MAXInfo.username,
        limit: 0
    }).$promise.then(function (response) {
        var url_list = _.pluck(response, 'url');
        if ((CommunityInfo.community_type == 'Open') && (!_.contains(url_list, $window.location.href.replace(/[\/\#]+$/g, '')))) {
            self.show_alert = true;
        }
    });

    self.closeAlert = function () {
        self.show_alert = false;
    };

    self.confirmSubscribe = function () {
        $translate(['COMMUNITY_SUBSCRIBE.TITLE',
            'COMMUNITY_SUBSCRIBE.SUCCESSBTN',
            'COMMUNITY_SUBSCRIBE.CANCELBTN',
            'COMMUNITY_SUBSCRIBE.DONE',
            'COMMUNITY_SUBSCRIBE.ERROR'
        ]).then(function (translations) {
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
                        // Do the atomic subscription of the current user
                        $http({
                                method: 'POST',
                                url: CommunityInfo.community_url + '/subscribe',
                                headers: {
                                    'X-CSRF-TOKEN': CodeInfo.csrf_token
                                }
                            })
                            .then(function successCallback(response) {
                                SweetAlert.swal({
                                    title: translations['COMMUNITY_SUBSCRIBE.DONE'],
                                    type: 'success',
                                    timer: 2000
                                });
                                $timeout(function () {
                                    $window.location.reload();
                                }, 700);
                            },function errorCallback(response) {
                                SweetAlert.swal({
                                    title: translations['COMMUNITY_SUBSCRIBE.ERROR'],
                                    type: 'error',
                                    timer: 2000
                                });
                            });
                    }
                });
        });
    };
}]);
