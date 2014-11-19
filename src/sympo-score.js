angular.module('sympo-score', ['ngResource', 'ui.router']);

angular.module('sympo-score')
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/login');
  });

angular.module('sympo-score')
  .run(($rootScope, $window, $http, $state) => {
    $rootScope
      .$on('$stateChangeError', (event, toState, toParams, fromState, fromParams) => {
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
