'use strict';
var App;

angular.module('app.models', []);

App = angular.module('app', ['ngCookies', 'ngResource', 'app.controllers', 'app.directives', 'app.filters', 'app.services', 'app.services.rest', 'app.services.models.result', 'app.models', 'partials']);

App.config([
  '$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider, config) {
    $routeProvider.when('/jobs', {
      templateUrl: '/partials/jobs.html'
    }).otherwise({
      redirectTo: '/jobs'
    });
    $locationProvider.html5Mode(false);
    return delete $httpProvider.defaults.headers.common["X-Requested-With"];
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
  '$scope', 'FindRest', 'JobSearchResult', function($scope, FindRest, JobSearchResult) {
    return $scope.findJobs = function() {
      return FindRest.find($scope.type, $scope.skills).then(function(results) {
        return $scope.results = results;
      });
    };
  }
]);
'use strict';
/* Directives
*/
angular.module('app.directives', []);
'use strict';
/* Filters
*/
angular.module('app.filters', []);
'use strict';
/* Models
*/
angular.module('app.services.models.result', []).factory("JobSearchResult", [
  function() {
    var JobSearchResult;

    return JobSearchResult = (function() {
      function JobSearchResult(dto) {
        this.link = dto.link;
        this.type = dto.type;
        this.budget = dto.budget;
        this.busy = dto.busy;
        this.time = dto.time;
        this.description = dto.description;
      }

      JobSearchResult.prototype.go = function() {
        return window.open(this.link, '_blank', 'location=yes');
      };

      return JobSearchResult;

    })();
  }
]);
'use strict';
/* Sevices
*/
angular.module('app.services', []);
'use strict';
/* Sevices
*/
angular.module('app.services.rest', []).service("FindRest", [
  "JobSearchResult", "$http", function(JobSearchResult, $http) {
    var getBudget, searchJobsUrl;

    searchJobsUrl = "https://www.odesk.com/api/profiles/v1/search/jobs.json";
    getBudget = function(one) {
      if (one.job_type === "Hourly") {
        if (one.hours_per_week) {
          return one.hours_per_week + "h/w";
        } else {
          return void 0;
        }
      } else if (one.job_type === "Fixed") {
        if (one.amount) {
          return one.amount + "$";
        } else {
          return void 0;
        }
      } else {
        throw new Error("Unknown type of job");
      }
    };
    return this.find = function(type, skills) {
      var promise;

      promise = $http({
        method: "GET",
        url: searchJobsUrl,
        params: {
          qs: skills != null ? skills : skills = "",
          t: type != null ? type : type = ""
        }
      });
      return promise.then(function(response) {
        return response.data.jobs.job.map(function(one) {
          return new JobSearchResult({
            link: "https://odesk.com/jobs/" + one.ciphertext,
            type: one.job_type,
            budget: getBudget(one),
            busy: one.op_engagement,
            time: one.engagement_weeks,
            description: one.op_description
          });
        });
      });
    };
  }
]);
