angular.module('sympo-score')
  .config($stateProvider => {
    $stateProvider.state('admin.evaluators', {
      controller: 'AdminEvaluatorController as ctl',
      resolve: {
        evaluators: (AdminEvaluator) => {
          return AdminEvaluator.query().$promise;
        }
      },
      templateUrl: 'partials/admin-evaluators.html',
      url: '/evaluators'
    });
  })
  .controller('AdminEvaluatorController', class {
    constructor(AdminEvaluator, evaluators, evaluatorTypes) {
      this.Evaluator = AdminEvaluator;
      this.evaluators = evaluators;
      this.evaluatorTypes = evaluatorTypes;
      this.newEvaluator = new this.Evaluator({type: 0});
    }

    submitEvaluator() {
      this.newEvaluator.$save(null, (evaluator) => {
        this.evaluators.push(evaluator);
        this.newEvaluator = new this.Evaluator();
      }, () => {
        alert('error');
      });
    }

    updateEvaluator(index) {
      this.evaluators[index].$update(null, (evaluator) => {
        this.evaluators[index] = evaluator;
      }, () => {
        alert('error');
      });
    }

    deleteEvaluator(index) {
      if (confirm('delete')) {
        this.evaluators[index].$remove(null, () => {
          this.evaluators.splice(index, 1);
        }, () => {
          alert('error');
        });
      }
    }
  });

