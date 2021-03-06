'use strict';

/**
 * @ngdoc overview
 * @name uLearnApp
 * @description
 * # uLearnApp
 *
 * Main module of the uLearn Angular application.
 */


// The main GenwebApp definition
var GenwebApp = angular.module('GenwebApp', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'MAXClient',
    'underscore',
    'ploneVariables',
    'momentjs',
    'ui.select',
    'ui.jq',
    'datatables',
    'datatables.bootstrap',
    'angularSpinner',
    'ngLoadingSpinner',
    'ngDialog',
    'oitozero.ngSweetAlert',
    'custom.ui.bootstrap',
    'pascalprecht.translate',
    'angularUtils.directives.dirPagination',
    'ui.router',
    'ulearn.stats'
  ]);
