angular.module('sympo-score', ['ngResource', 'ui.router']);

angular.module('sympo-score')
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('admin', {
      abstract: true,
      templateUrl: 'partials/admin.html',
      url: '/admin'
    });

    $urlRouterProvider.otherwise('/login');
  });

angular.module('sympo-score')
  .run(($rootScope, $window, $http, $state) => {
    $rootScope
      .$on('$stateChangeError', (event, toState, toParams, fromState, fromParams) => {
        console.log(toState, fromState);
        if (toState.name === 'admin') {
          $http.get('/api/auth', {
            params: {
              dest_url: '/#/admin'
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
