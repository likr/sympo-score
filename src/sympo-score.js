angular.module('sympo-score', ['ngResource', 'ui.router']);

angular.module('sympo-score')
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('admin', {
      abstract: true,
      templateUrl: 'partials/admin.html',
      url: '/admin'
    });

    $urlRouterProvider.otherwise('/');
  });

angular.module('sympo-score')
  .run(($rootScope, $window, $http, $state) => {
    var hash = $window.localStorage.getItem('hash');
    if (hash) {
      $http.defaults.headers.common.Authorization = `Basic ${hash}`;
    }

    $rootScope
      .$on('$stateChangeError', (event, toState, toParams, fromState, fromParams) => {
        if (toState.name === 'admin') {
          $http.get('/api/auth', {
            params: {
              dest_url: '/#/admin/scores'
            }
          })
          .then(result => {
            $window.location = result.data.loginUrl;
          });
        } else {
          $state.go('login');
        }
      });
  });
