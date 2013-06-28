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
  '$scope', 'FindRest', function($scope, FindRest) {
    var page;

    page = 1;
    $scope.nextPage = function() {
      page++;
      return FindRest.find($scope.type, $scope.skills, page).then(function(values) {
        return values.forEach(function(value) {
          return $scope.results.push(value);
        });
      });
    };
    return $scope.findJobs = function() {
      return FindRest.find($scope.type, $scope.skills, page).then(function(values) {
        return $scope.results = values;
      });
    };
  }
]);
'use strict';
/* Directives
*/
angular.module('app.directives', []).directive("appLoading", [
  "AppLoading", "$rootScope", function(AppLoading, $rootScope) {
    return function(scope, element) {
      $rootScope.$on(AppLoading.eventNames.show, function() {
        return element.css({
          marginBottom: "0px"
        });
      });
      return $rootScope.$on(AppLoading.eventNames.hide, function() {
        return element.css({
          marginBottom: "-50px"
        });
      });
    };
  }
]).directive("appScrollPage", [
  "$window", function($window) {
    return function(scope, element, attrs) {
      var appScrollPage;

      appScrollPage = scope.$eval(attrs.appScrollPage);
      return $window.onscroll = function() {
        var deviceHeight, height, scrollTop;

        scrollTop = $window.pageYOffset || $window.document.documentElement.scrollTop;
        height = $window.document.height;
        deviceHeight = $window.document.documentElement.clientHeight;
        if ((scrollTop + deviceHeight) > height) {
          return appScrollPage();
        }
      };
    };
  }
]);
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
angular.module('app.services', []).service("AppLoading", [
  "$rootScope", function($rootScope) {
    this.eventNames = {
      show: "appLoading-show",
      hide: "appLoading-hide"
    };
    this.show = function() {
      return $rootScope.$emit(this.eventNames.show);
    };
    return this.hide = function() {
      return $rootScope.$emit(this.eventNames.hide);
    };
  }
]);
'use strict';
/* Sevices
*/
angular.module('app.services.rest', []).service("FindRest", [
  "JobSearchResult", "AppLoading", "$http", function(JobSearchResult, AppLoading, $http) {
    var getBudget, getPage, searchJobsUrl;

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
    getPage = function(page) {
      var from, multiplier;

      multiplier = 20;
      from = (page - 1) * multiplier;
      return from + ";" + multiplier;
    };
    return this.find = function(type, skills, page) {
      var promise, success;

      if (page == null) {
        page = 1;
      }
      AppLoading.show();
      success = function(response) {
        AppLoading.hide();
        if (response.data.jobs.job === void 0) {
          return [];
        }
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
      };
      promise = $http({
        method: "GET",
        url: searchJobsUrl,
        params: {
          qs: skills != null ? skills : skills = "",
          t: type != null ? type : type = "",
          page: getPage(page)
        }
      });
      return promise.then(success, function() {
        AppLoading.hide();
        return alert("Connection error! Check your Internet connection.");
      });
    };
  }
]);
