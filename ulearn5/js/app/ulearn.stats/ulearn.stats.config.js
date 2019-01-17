(function() {
    'use strict';

    angular
        .module('ulearn.stats')
        .config(config);

    /**
     * @desc
     */
    /* @nInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('stats', {
              url: '/stats',
              templateUrl: '++app++ulearn/ulearn.stats/templates/stats.html',
              controller: 'StatsController as statsctrl',
              resolve: {
                hiderightportlets: function(){
                      angular.element('#angular-route-view').siblings().hide()
                      angular.element('#home-angular-route-view').parent().parent().find('> * > *').hide()
                      angular.element('.homepage-hpm4').hide()
                      angular.element('.homepage-hpm3').addClass('span12')
                      angular.element('.homepage-hpm3').removeClass('span8')
                      return;
                  }
              },
            })
            .state('stats.activity', {
              url: '/activity',
              templateUrl: '++app++ulearn/ulearn.stats/templates/activity.html',
              controller: 'StatsController as statsctrl'
            })
            .state('stats.chats', {
              url: '/chats',
              templateUrl: '++app++ulearn/ulearn.stats/templates/chats.html',
              controller: 'StatsController as statsctrl'
            })
            .state('stats.pageviews', {
              url: '/pageviews',
              templateUrl: '++app++ulearn/ulearn.stats/templates/pageviews.html',
              controller: 'StatsController as statsctrl'
            });
    }
})();
