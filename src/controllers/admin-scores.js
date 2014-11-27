angular.module('sympo-score')
  .config($stateProvider => {
    $stateProvider.state('admin.scores', {
      controller: 'AdminScoreController as ctl',
      resolve: {
        evaluators: (AdminEvaluator) => {
          return AdminEvaluator.query().$promise;
        },
        presenters: (AdminPresenter) => {
          return AdminPresenter.query().$promise;
        },
        scores: (AdminScore) => {
          return AdminScore.query().$promise;
        }
      },
      templateUrl: 'partials/admin-scores.html',
      url: '/scores'
    });
  })
  .controller('AdminScoreController', class {
    constructor(evaluatorTypes, evaluators, presenters, scores) {
      this.evaluators = evaluators;
      this.presenters = presenters;
      this.scores = (() => {
        var obj = {};
        this.evaluators.forEach(evaluator => {
          obj[evaluator.key] = {};
        });
        scores.forEach(score => {
          if (obj[score.evaluatorKey]) {
            obj[score.evaluatorKey][score.presenterKey] = score;
          }
        });
        return obj;
      })();

      this.evaluatorScores = (() => {
        var obj = {};
        this.evaluators.forEach(evaluator => {
          obj[evaluator.key] = this.presenters
            .map(presenter => {
              return this.scores[evaluator.key][presenter.key];
            })
            .filter(score => {
              return score !== undefined;
            });
        });
        return obj;
      })();

      this.presenterScores = (() => {
        var obj = {};
        this.presenters.forEach(presenter => {
          obj[presenter.key] = this.evaluators
            .map(evaluator => {
              return this.scores[evaluator.key][presenter.key];
            })
            .filter(score => {
              return score !== undefined;
            });
        });
        return obj;
      })();

      this.evaluatorTypes = evaluatorTypes;

      this.totalScores = this.presenters.map(presenter => {
        var result = {
          presenter: presenter,
        };
        this.evaluatorTypes.forEach(type => {
          result[type.value] = 0;
        });
        this.evaluators.forEach(evaluator => {
          var score = this.scores[evaluator.key][presenter.key];
          if (score) {
            if (evaluator.type === 0) {
              result[evaluator.type] += +score.score1 * 0.5 + score.score2 * 0.3 + score.score3 * 0.2;
            } else {
              result[evaluator.type] += (+score.score1 + score.score2 + score.score3) / 3;
            }
          }
        });
        this.evaluatorTypes.forEach(type => {
          result[type.value] /= this.evaluators
            .filter(evaluator => {
              return evaluator.type == type.value;
            })
            .length;
        });
        return result;
      });
    }
  });
