angular.module('sympo-score')
  .config($stateProvider => {
    $stateProvider.state('main', {
      controller: 'MainController as main',
      resolve: {
        evaluator: (Evaluator) => {
          return Evaluator.get().$promise;
        },
        presenters: (Presenter) => {
          return Presenter.query().$promise;
        },
        scores: (Score) => {
          return Score.query().$promise;
        }
      },
      templateUrl: 'partials/main.html',
      url: '/'
    });
  })
  .controller('MainController', class {
    constructor($window, $http, $state, Score, evaluator, presenters, scores) {
      this.$window = $window;
      this.$http = $http;
      this.$state = $state;

      this.evaluator = evaluator;
      this.presenters = presenters;
      this.changed = (() => {
        var obj = {};
        this.presenters.forEach(presenter => {
          obj[presenter.key] = false;
        });
        return obj;
      })();

      this.scores = (() => {
        var obj = {};
        this.presenters.forEach(presenter => {
          obj[presenter.key] = new Score({
            evaluatorKey: this.evaluator.key,
            presenterKey: presenter.key
          });
        });
        scores.forEach(score => {
          obj[score.presenterKey] = score;
        });
        return obj;
      })();
      this.points = [
        {value: 0, label: 'Strongly disagree'},
        {value: 1, label: 'Disagree'},
        {value: 2, label: 'Agree'},
        {value: 3, label: 'Strongly agree'}
      ];
    }

    setDirty(key) {
      this.changed[key] = true;
    }

    updateScore(key) {
      this.scores[key].$update(score => {
        this.scores[key] = score;
        this.changed[key] = false;
        alert('saved');
      }, () => {
        alert('error');
      });
    }

    logout() {
      this.$window.localStorage.removeItem('hash');
      this.$http.defaults.headers.common.Authorization = null;
      this.$state.go('login');
    }
  });
