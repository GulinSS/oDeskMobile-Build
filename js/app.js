'use strict';
var App;

App = angular.module('app', ['ngCookies', 'ngResource', 'app.controllers', 'app.directives', 'app.filters', 'app.services', 'partials']);

App.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, config) {
    $routeProvider.when('/jobs', {
      templateUrl: '/partials/jobs.html'
    }).otherwise({
      redirectTo: '/jobs'
    });
    return $locationProvider.html5Mode(false);
  }
]);
'use strict';
/* Controllers
*/
angular.module('app.controllers', []).controller('AppCtrl', [
  '$scope', '$location', '$resource', '$rootScope', function($scope, $location) {
    $scope.$location = $location;
    $scope.$watch('$location.path()', function(path) {
      return $scope.activeNavId = path || '/';
    });
    return $scope.getClass = function(id) {
      if ($scope.activeNavId.substring(0, id.length) === id) {
        return 'active';
      } else {
        return '';
      }
    };
  }
]).controller('JobsController', [
  '$scope', function($scope) {
    return $scope.findJobs = function() {
      return console.log($scope.type);
    };
  }
]);
'use strict';
/* Directives
*/
angular.module('app.directives', ['app.services']);
'use strict';
/* Filters
*/
angular.module('app.filters', []);
'use strict';
/* Sevices
*/
angular.module('app.services', []);
