angular.module('sympo-score')
  .config($stateProvider => {
    $stateProvider.state('login', {
      controller: 'LoginController as loginCtl',
      templateUrl: 'partials/login.html',
      url: '/login'
    });
  })
  .controller('LoginController', class {
    constructor($http, $state) {
      this.$http = $http;
      this.$state = $state;
    }

    login() {
      var hash = btoa(`${this.evaluatorKey}:${this.password}`);
      this.$http.defaults.headers.common.Authorization = `Basic ${hash}`;
      this.$state.go('main', {
        evaluatorKey: this.evaluatorKey
      });
    }
  });
