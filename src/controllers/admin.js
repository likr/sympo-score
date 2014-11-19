angular.module('sympo-score')
  .config($stateProvider => {
    $stateProvider.state('admin', {
      controller: 'AdminController as admin',
      resolve: {
        presenters: (AdminPresenter) => {
          return AdminPresenter.query().$promise;
        },
        evaluators: (AdminEvaluator) => {
          return AdminEvaluator.query();
        }
      },
      templateUrl: 'partials/admin.html',
      url: '/admin'
    });
  })
  .controller('AdminController', class {
    constructor(AdminPresenter, AdminEvaluator, presenters, evaluators) {
      this.Presenter = AdminPresenter;
      this.presenters = presenters;
      this.newPresenter = new this.Presenter();
      this.Evaluator = AdminEvaluator;
      this.evaluators = evaluators;
      this.newEvaluator = new this.Evaluator({type: 0});
      this.evaluatorTypes = [
        {value: 0, label: '審査員'},
        {value: 1, label: '院生'},
        {value: 2, label: '学部生'}
      ];
    }

    submitPresenter() {
      this.newPresenter.$save(null, (presenter) => {
        this.presenters.push(presenter);
        this.newPresenter = new this.Presenter();
      }, () => {
        alert('error');
      });
    }

    updatePresenter(index) {
      this.presenters[index].$update(null, (presenter) => {
        this.presenters[index] = presenter;
      }, () => {
        alert('error');
      });
    }

    deletePresenter(index) {
      if (confirm('delete')) {
        this.presenters[index].$remove(null, () => {
          this.presenters.splice(index, 1);
        }, () => {
          alert('error');
        });
      }
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
