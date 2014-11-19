angular.module('sympo-score')
  .config($stateProvider => {
    $stateProvider.state('admin.presenters', {
      controller: 'AdminPresenterController as ctl',
      resolve: {
        presenters: (AdminPresenter) => {
          return AdminPresenter.query().$promise;
        }
      },
      templateUrl: 'partials/admin-presenters.html',
      url: '/presenters'
    });
  })
  .controller('AdminPresenterController', class {
    constructor(AdminPresenter, presenters) {
      this.Presenter = AdminPresenter;
      this.presenters = presenters;
      this.newPresenter = new this.Presenter();
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
  });
