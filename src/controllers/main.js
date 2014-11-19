angular.module('sympo-score')
  .config($stateProvider => {
    $stateProvider.state('main', {
      controller: 'MainController as main',
      resolve: {
        evaluator: ($stateParams, Evaluator) => {
          return Evaluator
            .get({
              key: $stateParams.evaluatorKey
            })
            .$promise;
        },
        presenters: (Presenter) => {
          return Presenter.query().$promise;
        },
        scores: ($stateParams, Score) => {
          return Score
            .query({
              evaluatorKey: $stateParams.evaluatorKey
            })
            .$promise;
        }
      },
      templateUrl: 'partials/main.html',
      url: '/:evaluatorKey'
    });
  })
  .controller('MainController', class {
    constructor(Score, evaluator, presenters, scores) {
      this.evaluator = evaluator;
      this.presenters = presenters;
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
        {value: 0, label: '当てはまらない'},
        {value: 1, label: 'あまり当てはまらない'},
        {value: 2, label: 'やや当てはまる'},
        {value: 3, label: '当てはまる'}
      ];
    }

    updateScore(key) {
      this.scores[key].$update(score => {
        this.scores[key] = score;
      }, () => {
        alert('error');
      });
    }
  });
